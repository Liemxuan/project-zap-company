import { MongoClient, ObjectId } from 'mongodb';
import type { OmniPayload, LLMConfig, OmniResponse } from './omni_router.js';

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
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "WAITING_APPROVAL";
    tenantId: string;
    payload: OmniPayload;
    config: LLMConfig;
    sourceChannel?: "WHATSAPP" | "TELEGRAM" | "ZALO" | "IMESSAGE" | "CLI" | "HUD";
    senderIdentifier?: string;
    chatId?: number;
    historyContext?: {
        tenantId: string;
        senderIdentifier: string;
        sessionId?: string;
        assignedAgentId: string;
    };
    result?: OmniResponse;
    errorMap?: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
}

export class OmniQueueManager {
    private client: MongoClient;
    private isProcessing: boolean = false;

    constructor() {
        this.client = new MongoClient(MONGO_URI);
    }

    async connect(tenantId: string = "ZVN") {
        await this.client.connect();
        // Ensure index for fast queue polling
        const db = this.client.db(DB_NAME);
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
        const db = this.client.db(DB_NAME);
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
        const db = this.client.db(DB_NAME);
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

    async getJobStatus(jobId: string, tenantId: string = "ZVN"): Promise<OmniJob | null> {
        const db = this.client.db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));
        return await col.findOne({ _id: new ObjectId(jobId) });
    }

    // A simple worker loop that grabs the highest priority PENDING job
    async processNextJob(tenantId: string = "ZVN"): Promise<boolean> {
        const db = this.client.db(DB_NAME);
        const col = db.collection<OmniJob>(getQueueCollection(tenantId));

        // Find and lock the next job (Priority 0 first, then oldest)
        const job = await col.findOneAndUpdate(
            { status: "PENDING" },
            { $set: { status: "PROCESSING", startedAt: new Date() } },
            { sort: { priority: 1, createdAt: 1 }, returnDocument: "after" }
        );

        if (!job) return false;

        console.log(`[OmniQueue] 🚀 Processing Job ${job._id} from ${job.queueName} (Priority ${job.priority})`);

        try {
            // Processing logic using standard router
            const { generateOmniContent } = await import('./omni_router.js');
            const response = await generateOmniContent(job.config, job.payload);

            await col.updateOne(
                { _id: job._id },
                { $set: { status: "COMPLETED", result: response, completedAt: new Date() } }
            );
            console.log(`[OmniQueue] ✅ Job ${job._id} completed successfully.`);

            // Emit instant cross-process/cross-module push notification for the WSS Daemon
            import('../../gateway/wss.js').then(({ websocketNotifier }) => {
                websocketNotifier.emit('job_completed', {
                    jobId: job._id.toString(),
                    tenantId: job.tenantId,
                    status: "COMPLETED",
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
                import('../../platforms/telegram.js').then(({ sendTelegramMessage }) => {
                    sendTelegramMessage(job.chatId!, `[Background Job ${job._id} Completed]\n\n${response.text}`);
                }).catch(e => console.error("[OmniQueue] Background Egress Failed (TELEGRAM):", e.message));
            } else if (job.sourceChannel === "CLI") {
                console.log(`\n================= (BACKGROUND CLI RESPONSE) =================`);
                console.log(response.text);
                console.log(`=============================================================\n`);
            }

        } catch (error: any) {
            console.error(`[OmniQueue] ❌ Job ${job._id} failed:`, error.message);
            // Fallback logic
            await col.updateOne(
                { _id: job._id },
                { $set: { status: "FAILED", errorMap: error.message, completedAt: new Date() } }
            );

            if (job.sourceChannel === "TELEGRAM" && job.chatId) {
                import('../../platforms/telegram.js').then(({ sendTelegramMessage }) => {
                    sendTelegramMessage(job.chatId!, `⚠️ Background Job ${job._id} Failed.\nError: ${error.message}`);
                }).catch(e => console.error("[OmniQueue] Background Egress Failed (TELEGRAM):", e.message));
            }
        }

        return true;
    }

    // Fire-and-forget daemon loop
    async startWorkerDaemon(tenantId: string = "ZVN", intervalMs = 2000) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        console.log(`[OmniQueue] 🎧 Worker Daemon Started for ${tenantId}. Listening for OmniRouter Jobs...`);
        while (this.isProcessing) {
            const processed = await this.processNextJob(tenantId);
            if (!processed) {
                // Sleep if no jobs
                await new Promise(r => setTimeout(r, intervalMs));
            }
        }
    }

    stopWorkerDaemon() {
        this.isProcessing = false;
        console.log(`[OmniQueue] 🛑 Worker Daemon Stopping...`);
    }
}

export const omniQueue = new OmniQueueManager();
