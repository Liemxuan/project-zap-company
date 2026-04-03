import { MongoClient, ObjectId } from 'mongodb';
import type { OmniPayload, LLMConfig, OmniResponse } from './omni_router.js';
import { redactSecrets } from '../../security/log_redaction.js';
import { getGlobalMongoClient } from "../../db/mongo_client.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
// Master Collection Prefix - now generated per tenant dynamically (e.g., ZVN_SYS_OS_job_queue)
export function getQueueCollection(tenantId: string) {
    return `${tenantId}_SYS_OS_job_queue`;
}

export type QueuePriority = 0 | 1 | 2 | 3;
// 0: Real-time (Voice/Fast Chat)
// 1: Vision (Images, UI mockups)
// 2: Preprocess (Janitor, Prompt Injection sweep)
// 3: Async Heavy (Deep Research, Council)

export type QueueName = "Queue-Voice" | "Queue-Text-Fast" | "Queue-Vision" | "Queue-Preprocess" | "Queue-Async-Heavy" | "Queue-Short" | "Queue-Long" | "Queue-Complex";

export function triageJob(payload: OmniPayload): QueueName {
    try {
        const contentStr = payload.messages.map(m => m.content).join(" ");
        const complexKeywords = ["architect", "refactor", "new system", "rebuild", "database schema", "multi-file"];
        const isComplex = complexKeywords.some(keyword => contentStr.toLowerCase().includes(keyword));

        if (isComplex || contentStr.length > 5000) {
            return "Queue-Complex";
        } else if (contentStr.length > 500) {
            return "Queue-Long";
        } else {
            return "Queue-Short";
        }
    } catch {
        return "Queue-Long"; // Safe default
    }
}

export interface OmniJob {
    _id?: ObjectId;
    queueName: QueueName;
    priority: QueuePriority;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "WAITING_APPROVAL" | "BLOCKED" | "CANCELLED";
    dependsOn?: ObjectId[];
    workflowId?: string;
    tenantId: string;
    payload: OmniPayload;
    config: LLMConfig;
    retryCount?: number;
    sourceChannel?: "WHATSAPP" | "TELEGRAM" | "ZALO" | "IMESSAGE" | "CLI" | "HUD";
    senderIdentifier?: string;
    chatId?: number;
    historyContext?: {
        tenantId: string;
        senderIdentifier: string;
        sessionId?: string;
        assignedAgentId: string;
        threadId?: string;
    };
    result?: OmniResponse;
    errorMap?: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
}

export class OmniQueueManager {
    private clientPromise: Promise<MongoClient>;
    private isProcessing: boolean = false;

    constructor() {
        this.clientPromise = getGlobalMongoClient(MONGO_URI);
    }

    async connect(tenantId: string = "ZVN") {
        // Ensure index for fast queue polling
        const db = (await this.clientPromise).db(DB_NAME);
        await db.collection(getQueueCollection(tenantId)).createIndex({ status: 1, priority: 1, createdAt: 1 });
    }

    async enqueue(
        queueName: QueueName,
        priority: QueuePriority,
        tenantId: string,
        payload: OmniPayload,
        config: LLMConfig,
        sourceChannel?: "WHATSAPP" | "TELEGRAM" | "ZALO" | "IMESSAGE" | "CLI" | "HUD",
        senderIdentifier?: string,
        chatId?: number,
        historyContext?: OmniJob["historyContext"]
    ): Promise<string> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));

        const isComplex = queueName === "Queue-Complex";
        const job: OmniJob = {
            queueName,
            priority,
            status: isComplex ? "WAITING_APPROVAL" : "PENDING",
            tenantId,
            payload,
            config,
            createdAt: new Date(),
        };

        if (sourceChannel !== undefined) job.sourceChannel = sourceChannel;
        if (senderIdentifier !== undefined) job.senderIdentifier = senderIdentifier;
        if (chatId !== undefined) job.chatId = chatId;
        if (historyContext !== undefined) job.historyContext = historyContext;

        const result = await col.insertOne(job);
        const jobIdStr = result.insertedId.toString();

        if (isComplex) {
            console.log(`\n======================================================`);
            console.log(`🛑 [OmniQueue] JOB ${jobIdStr} PLACED IN WAITING_APPROVAL STATE 🛑`);
            console.log(`Requires Human-in-the-Loop (HitL) confirmation.`);
            console.log(`Antigravity Agent OR Telegram Admin can approve this.`);
            console.log(`To approve via script: \`ts-node scripts/approve_job.ts ${jobIdStr} ${tenantId}\``);
            console.log(`======================================================\n`);

            // Fire background ping to Telegram targeting Admin (if configured)
            import('../../platforms/telegram.js').then(({ sendTelegramMessage }) => {
                const adminId = process.env.TELEGRAM_ADMIN_CHAT_ID;
                if (adminId) {
                    sendTelegramMessage(parseInt(adminId), `⚠️ **Complex Job Enqueued**\nID: \`${jobIdStr}\`\n\nWaiting for your approval to proceed. You or Antigravity can approve it.`);
                }
            }).catch(e => console.error("[OmniQueue] Failed to notify admin via Telegram:", e.message));
        }

        return jobIdStr;
    }

    /**
     * Approves a Complex job that is in WAITING_APPROVAL state.
     */
    async approveJob(jobId: string, tenantId: string = "ZVN"): Promise<boolean> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));
        const res = await col.updateOne(
            { _id: new ObjectId(jobId), status: "WAITING_APPROVAL" },
            { $set: { status: "PENDING" } }
        );
        if (res.modifiedCount > 0) {
            console.log(`✅ [OmniQueue] Job ${jobId} approved and moved to PENDING state.`);
            return true;
        }
        return false;
    }

    /**
     * Cancel a job. If it belongs to a DAG workflow, cancel all PENDING/BLOCKED siblings.
     */
    async cancelJob(jobId: string, tenantId: string = "ZVN"): Promise<{ cancelled: number }> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));

        const job = await col.findOne({ _id: new ObjectId(jobId) });
        if (!job) return { cancelled: 0 };

        let cancelled = 0;

        // Cancel the target job if it's in a cancellable state
        if (["PENDING", "BLOCKED", "WAITING_APPROVAL"].includes(job.status)) {
            await col.updateOne(
                { _id: job._id },
                { $set: { status: "CANCELLED", completedAt: new Date(), errorMap: "Cancelled by operator" } }
            );
            cancelled++;
            console.log(`[OmniQueue] 🛑 Job ${jobId} cancelled.`);
        }

        // Cascade cancel across the DAG workflow
        if (job.workflowId) {
            const res = await col.updateMany(
                {
                    workflowId: job.workflowId,
                    status: { $in: ["PENDING", "BLOCKED", "WAITING_APPROVAL"] }
                },
                { $set: { status: "CANCELLED", completedAt: new Date(), errorMap: `Cascade cancel from job ${jobId}` } }
            );
            cancelled += res.modifiedCount;
            console.log(`[OmniQueue] 🛑 DAG Workflow ${job.workflowId}: ${res.modifiedCount} sibling jobs cancelled.`);
        }

        return { cancelled };
    }

    /**
     * Reap stale jobs stuck in PROCESSING or WAITING_APPROVAL.
     */
    async reapStaleJobs(tenantId: string = "ZVN", maxAgeMs: number = 30 * 60 * 1000): Promise<number> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));
        
        let reaped = 0;

        // 1. Reap PROCESSING jobs (standard 30min timeout)
        const cutoff = new Date(Date.now() - maxAgeMs);
        const staleJobs = await col.find({
            status: "PROCESSING",
            startedAt: { $lt: cutoff }
        }).toArray();

        for (const job of staleJobs) {
            const retries = job.retryCount || 0;
            if (retries < 3) {
                await col.updateOne(
                    { _id: job._id },
                    { $set: { status: "PENDING", retryCount: retries + 1, errorMap: "Reaped: exceeded max processing time" } }
                );
            } else {
                await col.updateOne(
                    { _id: job._id },
                    { $set: { status: "FAILED", completedAt: new Date(), errorMap: "Reaped: exceeded max processing time after 3 retries" } }
                );
            }
            reaped++;
            console.log(`[OmniQueue] 🧹 Reaped stale job ${job._id} (age: ${Math.round((Date.now() - (job.startedAt?.getTime() || 0)) / 1000)}s)`);
        }

        // Sub-Phase 2B: HITL Deadlock Prevention (Reap WAITING_APPROVAL jobs older than 5 minutes)
        const hitlCutoff = new Date(Date.now() - (5 * 60 * 1000));
        const deadlockedJobs = await col.find({
            status: "WAITING_APPROVAL",
            suspendedAt: { $lt: hitlCutoff }
        }).toArray();

        for (const job of deadlockedJobs) {
            await col.updateOne(
                { _id: job._id },
                { $set: { status: "FAILED", completedAt: new Date(), errorMap: "Failed: HITL Suspend Deadlock (No user approval received within 300s)" } }
            );
            reaped++;
            console.log(`[OmniQueue] 🔒 HITL Timeout: Cancelled job ${job._id} due to human authorization deadlock.`);
            
            // Optionally, we could emit a websocket event here if we wanted to visually dismiss the prompt
        }

        return reaped;
    }

    async getJobStatus(jobId: string, tenantId: string = "ZVN"): Promise<OmniJob | null> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));
        return await col.findOne({ _id: new ObjectId(jobId) });
    }

    // A simple worker loop that grabs the highest priority PENDING job
    async processNextJob(tenantId: string = "ZVN"): Promise<boolean> {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));

        // Find and lock the next job (Priority 0 first, then oldest). Ignore spawn jobs (which lack queueName).
        const job = await col.findOneAndUpdate(
            { status: "PENDING", queueName: { $exists: true } },
            { $set: { status: "PROCESSING", startedAt: new Date() } },
            { sort: { priority: 1, createdAt: 1 }, returnDocument: "after" }
        );

        if (!job) return false;

        const sessionId = job.historyContext?.sessionId || `job_${job._id}`;
        const redis = new (await import('ioredis')).Redis(process.env.REDIS_URL || "redis://localhost:6379");
        
        const logTrace = async (msg: string) => {
            const formatted = `\r\n${redactSecrets(msg)}\r\n`;
            await redis.rpush(`zap:trace:${sessionId}:logs`, formatted);
            await redis.publish(`zap:trace:${sessionId}`, formatted);
            await redis.expire(`zap:trace:${sessionId}:logs`, 3600);
        };

        console.log(`[OmniQueue] 🚀 Processing Job ${job._id} from ${job.queueName} (Priority ${job.priority})`);
        await logTrace(`> ⚙️ [OmniQueue] 🚀 Processing Job ${job._id} (Agent: ${job.config.agentId})`);

        try {
            // PHASE 4: DeerFlow Skill Interceptor & Assimilation
            const userText = job.payload.messages[0]?.content as string || "";
            if (userText.startsWith('/df-')) {
                const fs = await import('fs');
                const path = await import('path');
                const match = userText.match(/^\/(df-[^\s]+)(?:\s+(.*))?/);
                if (match) {
                    const skillName = match[1];
                    const query = match[2] || "";
                    
                    try {
                        const skillPath = path.resolve(process.cwd(), `../../.agent/skills/${skillName}/SKILL.md`);
                        const skillContent = fs.readFileSync(skillPath, 'utf8');
                        job.payload.systemPrompt += `\n\n[DEERFLOW SKILL: ${skillName}]\n${skillContent}`;
                        await logTrace(`> 🧠 [Skill Intercepter] Assimilated ${skillName}`);
                        
                        // Execute Brave Search immediately if it's a research skill to seed the OmniRouter context
                        if (skillName === "df-deep-research" && query) {
                            try {
                                const { executeTool } = await import('../../tools/index.js');
                                await logTrace(`> 🔎 [Search Engine] Executing realtime query for: "${query}"`);
                                const searchResult = await executeTool('brave_search', { query }, 0, job.config.agentId);
                                job.payload.systemPrompt += `\n\n[INITIAL SEARCH RESULTS (DO NOT HALLUCINATE)]\n${typeof searchResult === 'string' ? searchResult : searchResult.output}`;
                                await logTrace(`> ✅ [Search Engine] Raw DOM content injected into OmniPayload.`);
                            } catch (searchErr: any) {
                                await logTrace(`> ⚠️ [Search Engine] Failed: ${searchErr.message}`);
                            }
                        }
                    } catch (e: any) {
                        await logTrace(`> ⚠️ [Skill Intercepter] Skill ${skillName} not found. Proceeding without context.`);
                    }
                }
            }

            // Processing logic using standard router with per-node timeout
            let response: any;
            const TIMEOUT_MS = job.queueName === "Queue-Complex" ? 15 * 60 * 1000 : 5 * 60 * 1000; // 15 min complex, 5 min standard

            const executeWithTimeout = async (fn: () => Promise<any>, timeoutMs: number): Promise<any> => {
                return Promise.race([
                    fn(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error(`JOB_TIMEOUT: Exceeded ${Math.round(timeoutMs / 1000)}s execution limit`)), timeoutMs)
                    )
                ]);
            };
            
            if (job.payload.intent?.startsWith("DAG_STAGE_")) {
                // Phase 3: Real DAG node dispatch through OmniRouter
                const testDelay = job.payload.contextParams?.simulateDelay;
                if (testDelay && typeof testDelay === 'number' && testDelay > 0) {
                    await logTrace(`> ⏳ [DAG] Node warmup delay: ${testDelay}ms`);
                    await new Promise(resolve => setTimeout(resolve, Math.min(testDelay, 10000)));
                }
                
                const { generateOmniContent } = await import('./omni_router.js');
                await logTrace(`> 🕸️ [DAG] Executing node ${job._id} via OmniRouter (intent: ${job.payload.intent})`);
                response = await executeWithTimeout(() => generateOmniContent(job.config, job.payload), TIMEOUT_MS);
                await logTrace(`> ✅ [DAG] Node ${job._id} completed. Model: ${response.modelId}`);
            } else {
                const { generateOmniContent } = await import('./omni_router.js');
                response = await executeWithTimeout(() => generateOmniContent(job.config, job.payload), TIMEOUT_MS);
            }

            // Sub-Phase 2B: HITL Suspend/Resume Integrity Wrap
            let finalStatus: "COMPLETED" | "WAITING_APPROVAL" = "COMPLETED";
            let pendingApprovalReason = "";
            let suspendedToolCall = null;

            if (response.toolCalls && response.toolCalls.length > 0) {
                // Check if any tool call hits the High-Risk bounds
                const highRiskTools = ["run_command", "execute_bash", "replace_file_content", "multi_replace_file_content", "invoke_local_mcp"];
                for (const tc of response.toolCalls) {
                    const funcName = tc.function?.name || tc.name;
                    if (highRiskTools.includes(funcName)) {
                        finalStatus = "WAITING_APPROVAL";
                        suspendedToolCall = tc;
                        pendingApprovalReason = `Execution paused. High-risk tool [${funcName}] requires human authorization.`;
                        await logTrace(`> ⚠️ [HITL Safeguard] Suspending execution: Tool ${funcName} requires approval.`);
                        break;
                    }
                }
            }

            const updateDoc: any = {
                status: finalStatus,
                result: response,
                suspendedToolCall
            };
            if (finalStatus === "COMPLETED") updateDoc.completedAt = new Date();
            if (finalStatus === "WAITING_APPROVAL") updateDoc.suspendedAt = new Date();

            await col.updateOne(
                { _id: job._id },
                { $set: updateDoc }
            );

            // BLAST-IRONCLAD: Post-completion token accounting
            if (response.tokensUsed && job.config.agentId) {
                const { recordUsage } = await import('../../security/token_budgets.js');
                await recordUsage(job.config.agentId, response.tokensUsed.total).catch((e: any) =>
                    console.error("[ZSS] Budget accounting failed:", e.message)
                );
            }

            if (finalStatus === "COMPLETED") {
                console.log(`[OmniQueue] ✅ Job ${job._id} completed successfully.`);
                await logTrace(`> ✅ [OmniQueue] Job ${job._id} completed.`);

                // Phase 5: DeerFlow DAG Dependent Unblocking (Only unblock if actually completed, not suspended)
                const dependents = await col.find({ status: "BLOCKED", dependsOn: job._id }).toArray();
                for (const dep of dependents) {
                    const updatedDepends = dep.dependsOn!.filter(id => !id.equals(job._id!));
                    if (updatedDepends.length === 0) {
                        await col.updateOne({ _id: dep._id }, { $set: { status: "PENDING", dependsOn: [] } });
                        console.log(`[OmniQueue] 🚀 DAG Node Unblocked: Job ${dep._id}`);
                        await logTrace(`> 🚀 [OmniQueue] DAG Execution: Unblocked dependent Job ${dep._id}`);
                    } else {
                        await col.updateOne({ _id: dep._id }, { $set: { dependsOn: updatedDepends } });
                    }
                }
            }

            if (response.text) {
                await logTrace(`> 🤖 [reply] ${response.text}`);
            }

            // Emit instant cross-process/cross-module push notification for the WSS Daemon
            import('../../gateway/wss.js').then(({ websocketNotifier }) => {
                websocketNotifier.emit(finalStatus === "WAITING_APPROVAL" ? 'hitl_challenge' : 'job_completed', {
                    jobId: job._id.toString(),
                    tenantId: job.tenantId,
                    status: finalStatus,
                    reason: pendingApprovalReason,
                    suspendedToolCall,
                    result: response
                });
            }).catch(e => console.error("[OmniQueue] Failed to notify Gateway WSS:", e.message));

            // Preserve Memory State if requested
            if (job.historyContext && response.text) {
                const memCol = db.collection(`${job.historyContext.tenantId}_SYS_CLAW_memory`);
                await memCol.insertOne({
                    tenantId: job.historyContext.tenantId,
                    senderIdentifier: job.historyContext.senderIdentifier,
                    sessionId: job.historyContext.sessionId,
                    assignedAgentId: job.historyContext.assignedAgentId,
                    role: "agent",
                    content: response.text,
                    timestamp: new Date()
                });
            }

            // Return-routing push
            if (job.sourceChannel === "TELEGRAM" && job.chatId && response.text) {
                try {
                    const { sendTelegramMessage } = await import('../../platforms/telegram.js');
                    const { formatTelegramHUD } = await import('../../platforms/telegram_hud.js');
                    const userCol = db.collection(`${job.tenantId}_SYS_OS_users`);
                    const user = await userCol.findOne({ telegramId: job.senderIdentifier });
                    
                    if (user) {
                        const formatted = await formatTelegramHUD(user, response.text, response);
                        sendTelegramMessage(job.chatId, formatted, job.historyContext?.threadId ? parseInt(job.historyContext.threadId) : undefined);
                    } else {
                        sendTelegramMessage(job.chatId, `[Background Job ${job._id} Completed]\n\n${response.text}`, job.historyContext?.threadId ? parseInt(job.historyContext.threadId) : undefined);
                    }
                } catch (e: any) {
                    console.error("[OmniQueue] Background Egress Failed (TELEGRAM):", e.message);
                }
            } else if (job.sourceChannel === "HUD") {
                // HUD channel is handled via Redis Trace [reply] tags already published above
            } else if (job.sourceChannel === "CLI") {
                console.log(`\n================= (BACKGROUND CLI RESPONSE) =================`);
                console.log(response.text);
                console.log(`=============================================================\n`);
            }

        } catch (error: any) {
            const currentRetries = job.retryCount || 0;
            if (currentRetries < 3) {
                console.warn(`[OmniQueue] ⚠️ Job ${job._id} failed: ${error.message}. Retrying (${currentRetries + 1}/3)...`);
                await logTrace(`> ⚠️ [OmniQueue] Job ${job._id} failed: ${error.message}. Retrying (${currentRetries + 1}/3)...`);
                await col.updateOne(
                    { _id: job._id },
                    { $set: { status: "PENDING", retryCount: currentRetries + 1, errorMap: error.message } }
                );
            } else {
                console.error(`[OmniQueue] ❌ Job ${job._id} permanently failed:`, error.message);
                await logTrace(`> ❌ [OmniQueue] Job ${job._id} permanently failed after 3 retries: ${error.message}`);
                // Fallback logic
                await col.updateOne(
                    { _id: job._id },
                    { $set: { status: "FAILED", errorMap: error.message, completedAt: new Date() } }
                );

                if (job.sourceChannel === "TELEGRAM" && job.chatId) {
                    import('../../platforms/telegram.js').then(({ sendTelegramMessage }) => {
                        sendTelegramMessage(job.chatId!, `❌ Background Job ${job._id} permanently failed after 3 tries.\nError: ${error.message}`, job.historyContext?.threadId ? parseInt(job.historyContext.threadId) : undefined);
                    }).catch(e => console.error("[OmniQueue] Background Egress Failed (TELEGRAM):", e.message));
                }
            }
        } finally {
            await redis.quit();
        }


        return true;
    }

    // Fire-and-forget concurrent daemon pool
    async startWorkerDaemon(tenantId: string = "ZVN", intervalMs = 2000, maxConcurrency = 5) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        console.log(`[OmniQueue] 🎧 Concurrent Worker Daemon (Pool: ${maxConcurrency}) Started for ${tenantId}...`);
        
        let activePromises = new Set<Promise<void>>();

        while (this.isProcessing) {
            if (activePromises.size >= maxConcurrency) {
                await Promise.race(activePromises);
            }
            
            const workerPromise = this.processNextJob(tenantId).then(async (processed) => {
                if (!processed) {
                    await new Promise(r => setTimeout(r, intervalMs));
                }
            }).catch(e => console.error("[OmniQueue] Worker Error:", e)).finally(() => {
                activePromises.delete(workerPromise);
            });
            
            activePromises.add(workerPromise);
        }
    }

    stopWorkerDaemon() {
        this.isProcessing = false;
        console.log(`[OmniQueue] 🛑 Worker Daemon Stopping...`);
    }

    // Phase 5: DeerFlow DAG Queue Ingress
    async enqueueWorkflowDAG(tenantId: string, workflowDef: Array<{ id: string; dependsOn: string[]; payload: OmniPayload; config: LLMConfig; queueName: QueueName; priority: QueuePriority }>) {
        const db = (await this.clientPromise).db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));
        
        const workflowId = `WF_${new ObjectId().toString()}`;
        const nodeMap = new Map<string, ObjectId>();
        
        // 1. Generate ObjectIds for all nodes mapping their string aliases
        for (const node of workflowDef) {
            nodeMap.set(node.id, new ObjectId());
        }

        // 2. Build the OmniJob records
        const jobsToInsert: OmniJob[] = workflowDef.map(node => {
            const deps = node.dependsOn.map(id => nodeMap.get(id)!);
            return {
                _id: nodeMap.get(node.id)!,
                status: deps.length > 0 ? "BLOCKED" : "PENDING",
                dependsOn: deps,
                workflowId,
                tenantId,
                payload: node.payload,
                config: node.config,
                queueName: node.queueName,
                priority: node.priority,
                createdAt: new Date(),
            };
        });

        // 3. Atomically block-insert the DAG
        if (jobsToInsert.length > 0) {
            await col.insertMany(jobsToInsert);
            console.log(`[OmniQueue] 🕸️ Workflow DAG ${workflowId} enqueued with ${jobsToInsert.length} nodes.`);
        }
        
        return workflowId;
    }
}

export const omniQueue = new OmniQueueManager();
