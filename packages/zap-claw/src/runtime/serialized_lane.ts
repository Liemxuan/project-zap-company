import { MongoClient } from "mongodb";
import { Redis } from "ioredis";
import { resolveAgentLLMConfig, generateOmniContent, OmniPayload, OmniResponse } from "./engine/omni_router.js";
import { SYSTEM_PROMPT } from "../system_prompt.js";
import "dotenv/config";
import { getGlobalMongoClient } from "../db/mongo_client.js";

const MONGO_URI = process.env.MONGODB_URI || "";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8100";
const DB_NAME = "olympus";

async function fetchChromaContext(tenantId: string, query: string): Promise<string> {
    try {
        const res = await fetch(`${CHROMA_URL}/api/v1/collections/${tenantId}_knowledge/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_texts: [query], n_results: 3 })
        });
        if (res.ok) {
            const data = await res.json() as any;
            return data.documents?.[0]?.join("\\n") || "";
        }
    } catch (e) {
        console.error("[ChromaDB] RAG Fetch Failed:", (e as Error).message);
    }
    return "";
}

// Removed the hardcoded generic GEMINI_API_KEY check, Omni Router handles resolution

export async function executeSerializedLane(
    userProfile: any,
    tenantId: string,
    senderIdentifier: string,
    payload: string,
    assignedTier?: number,
    sessionId?: string,
    sourceChannel?: "WHATSAPP" | "TELEGRAM" | "ZALO" | "IMESSAGE" | "CLI" | "HUD",
    chatId?: number
): Promise<OmniResponse | string> {
    console.log(`\n[Serialized Lane] 🚀 Booting execution sequence for Agent: ${userProfile.assignedAgentId}`);

    const client = await getGlobalMongoClient(MONGO_URI);
    try {
        const db = client.db(DB_NAME);
        const memoryCollectionName = `${tenantId}_SYS_CLAW_memory`;
        const memoryCol = db.collection(memoryCollectionName);

        const redis = new Redis(REDIS_URL);
        redis.on("error", () => {});
        const sessionKey = `zap:session:${tenantId}:${sessionId || senderIdentifier}`;

        console.log(`[Serialized Lane] 🧠 Injecting Context: Querying Redis ${sessionKey}...`);

        // Fetch last 15 interactions for context from Redis Hot Session
        const rawHistoryStrs = await redis.lrange(sessionKey, -15, -1);
        const rawHistory = rawHistoryStrs.map(s => JSON.parse(s));
        
        let historyString = "Conversation History:\\n";
        let knowledgeText = "";
        let mistakeCount = 1;

        if (rawHistory.length === 0) {
            // Attempt to seed from Mongo if Redis is empty but session exists
            const queryFilter = sessionId ? { sessionId } : { senderIdentifier };
            const mongoHistory = await memoryCol.find(queryFilter).sort({ timestamp: 1 }).limit(15).toArray();
            if (mongoHistory.length > 0) {
                console.log(`[Serialized Lane] ♻️ Restoring Hot Session to Redis from Mongo (${mongoHistory.length} records)`);
                const pipeline = redis.pipeline();
                for (const doc of mongoHistory) {
                    pipeline.rpush(sessionKey, JSON.stringify(doc));
                }
                pipeline.expire(sessionKey, 86400); // 24 hours
                await pipeline.exec();
                rawHistory.push(...mongoHistory);
            }
        }

        if (rawHistory.length === 0) {
            historyString += "(No prior history in this context. This is a fresh session.)\\n";
        } else {
            for (const doc of rawHistory) {
                if (doc.role === 'summary') {
                    historyString += `--- HISTORICAL SUMMARY BLOCK ---\\n${doc.content}\\n--- END SUMMARY ---\\n\\n`;
                } else if (doc.role === 'mistake' || doc.tag === 'TRT_MISTAKE') {
                    knowledgeText += `**Wrong Answer ${mistakeCount}**: ${doc.content}\\n`;
                    mistakeCount++;
                } else {
                    const identifier = doc.senderIdentifier ? `[User: ${doc.senderIdentifier}]` : `[${doc.role.toUpperCase()}]`;
                    historyString += `${identifier} ${doc.content}\\n`;
                }
            }
        }

        console.log(`[Serialized Lane] 🌐 Injecting RAG Context from ChromaDB...`);
        const ragContext = await fetchChromaContext(tenantId, payload);

        // Security Check: Prompt Injection / Cognitive Bypass Prevention
        const bypassPatterns = [
            /ignore all previous instructions/i,
            /uncodixfy/i,
            /uncodexify/i,
            /forget your previous/i,
            /you are now/i,
            /bypass the/i,
            /new system prompt:/i
        ];

        for (const pattern of bypassPatterns) {
            if (pattern.test(payload) || (ragContext && pattern.test(ragContext))) {
                console.warn(`[Serialized Lane] 🚨 ZSS Security Alert: Prompt Injection / Cognitive Bypass Attempt Detected (Pattern: ${pattern})`);
                return "❌ [SECURITY BLOCK] Prompt Injection or Cognitive Bypass attempt detected. This incident has been logged. Compliance with ZSS is mandatory.";
            }
        }

        console.log(`[Serialized Lane] ⚙️ Building Cached Prompt Sequence (${userProfile.defaultModel})...`);

        // Layer 2: The Dynamic System Update (Injected as the first conversation message)
        const dynamicSystemUpdate = `[SYSTEM UPDATE]
Agent Context: You are ${userProfile.assignedAgentId}.
User Context: Assisting ${userProfile.name} (${userProfile.role}) in the ${userProfile.department} department.
Tenant Context: ${tenantId}
Base Timezone: ${userProfile.preferences?.timezone || 'UTC'}
Current System Time: ${new Date().toISOString()}

Please read the following conversation history and execute the next response based on your static SYSTEM_PROMPT instructions and this dynamic context.`;

        // Layer 3 & 4: Constructing the Message Array payload for the Omni-Router adapter
        // Standardized to ChatCompletionMessageParam for unified schema across providers.
        const omniMessages: any[] = [
            { role: "user", content: dynamicSystemUpdate },
            { role: "assistant", content: "Understood. My static instructions and dynamic context are loaded. Proceed with the history." }
        ];

        if (rawHistory.length === 0) {
            omniMessages.push({ role: "user", content: "(No prior history. This is a new conversation.)" });
        } else {
            for (const doc of rawHistory) {
                if (doc.role === 'summary') {
                    omniMessages.push({ role: "user", content: `--- HISTORICAL SUMMARY BLOCK ---\n${doc.content}\n--- END SUMMARY ---` });
                } else if (doc.role === 'mistake' || doc.tag === 'TRT_MISTAKE') {
                    // Handled via knowledge_text block below
                    continue;
                } else {
                    // Normalize roles from custom schema ("agent", "user") to OpenAI standard ("assistant", "user")
                    const mapRole = doc.role === 'agent' ? 'assistant' : 'user';
                    omniMessages.push({ role: mapRole, content: doc.content });
                }
            }
        }

        // Detect Preferred Theme from User Preferences or Default
        const preferredTheme = (userProfile.preferences?.arbiterTheme as any) || "B_PRODUCTIVITY";

        // BLAST-012 TRT Injection: Build the Error Constraint Prompt
        let finalPayload = payload;
        if (knowledgeText.length > 0) {
            finalPayload = `## Wrong Answer List\nAnalyze the following past mistakes recursively and ensure your logic does not repeat them:\n${knowledgeText}\n\n[USER REQUEST]\n${payload}`;
            console.log(`[Serialized Lane] 🧠 Injecting TRT Knowledge Text (${mistakeCount - 1} prior mistakes).`);
        }

        // Layer 5: The Current Turn + RAG
        let finalTurnContent = finalPayload;
        if (ragContext) {
            finalTurnContent = `[RAG KNOWLEDGE RETRIEVAL]\\n${ragContext}\\n\\n[USER REQUEST]\\n${finalPayload}`;
        }
        omniMessages.push({ role: "user", content: finalTurnContent });

        const omniPayload: OmniPayload = {
            systemPrompt: SYSTEM_PROMPT,
            messages: omniMessages,
            theme: preferredTheme,
            intent: (userProfile.specialty as any) || "GENERAL"
        };

        const { triageJob } = await import("./engine/omni_queue.js");
        const queueName = triageJob(omniPayload);

        // Phase 14 Execution: Route the payload conditionally based on user/tenant BYOK settings
        const llmConfig = await resolveAgentLLMConfig(tenantId, userProfile.assignedAgentId, assignedTier);

        if (queueName === "Queue-Complex" || queueName === "Queue-Long") {
            const { enqueueOmniJob } = await import("./engine/omni_router.js");

            // Generate History Context to preserve state later in background processing
            const historyContext = {
                tenantId,
                senderIdentifier,
                sessionId,
                assignedAgentId: userProfile.assignedAgentId
            };

            const jobId = await enqueueOmniJob(
                tenantId,
                llmConfig,
                omniPayload,
                sourceChannel,
                senderIdentifier,
                chatId,
                historyContext
            );

            // Save the USER's half of the interaction now, daemon saves the AGENT's half later
            await memoryCol.insertOne({
                tenantId,
                senderIdentifier,
                sessionId,
                assignedAgentId: userProfile.assignedAgentId,
                role: "user",
                content: payload,
                timestamp: new Date()
            });

            const timeStr = queueName === "Queue-Complex" ? "requires manual approval." : "will take a moment.";
            return `⏳ **Job Enqueued.**\nRouted to ${queueName} and ${timeStr}\n\nJob ID: \`${jobId}\``;
        }

        let reply: OmniResponse;
        try {
            // Instant Process (Queue-Short)
            reply = await generateOmniContent(llmConfig, omniPayload);
        } catch (omniError: any) {
            console.error(`[Serialized Lane] 🚨 Omni-Router Failure. Triggering Dead Letter Queue (DLQ).`, omniError.message);
            const dlqCol = db.collection("SYS_OS_dead_letters");
            await dlqCol.insertOne({
                tenantId,
                senderIdentifier,
                assignedAgentId: userProfile.assignedAgentId,
                payload,
                error: omniError.message,
                status: "PENDING",
                timestamp: new Date()
            });
            return "⚠️ The network is experiencing heavy turbulence. Your request has been saved and will process shortly.";
        }

        console.log(`\n[Arbiter Summary] Theme: ${reply.strategy?.theme} | Tier: ${reply.strategy?.tier} | Latency: ${reply.strategy?.latencyMs}ms`);
        console.log(`[Agent Response]\n${reply.text}\n`);

        // State Preservation: Save the new interaction
        console.log(`[Serialized Lane] 💾 Preserving State -> Saving to ${memoryCollectionName}`);

        const metricsCol = db.collection("SYS_OS_arbiter_metrics");

        // Parallel writing for speed
        const userInteraction = {
            tenantId,
            senderIdentifier,
            sessionId,
            assignedAgentId: userProfile.assignedAgentId,
            role: "user",
            content: payload,
            timestamp: new Date()
        };

        const agentInteraction = {
            tenantId,
            senderIdentifier,
            sessionId,
            assignedAgentId: userProfile.assignedAgentId,
            role: "agent",
            content: reply.text,
            timestamp: new Date()
        };

        await Promise.all([
            redis.rpush(sessionKey, JSON.stringify(userInteraction), JSON.stringify(agentInteraction)).then(() => redis.expire(sessionKey, 86400)),
            memoryCol.insertMany([userInteraction, agentInteraction]),
            metricsCol.insertOne({
                sessionId: sessionId || null,
                timestamp: new Date(),
                tenantId,
                agentId: userProfile.assignedAgentId,
                theme: reply.strategy?.theme,
                tier: reply.strategy?.tier,
                latencyMs: reply.strategy?.latencyMs,
                tokens: reply.tokensUsed,
                modelId: reply.modelId,
                intent: reply.strategy?.intent
            })
        ]);

        console.log(`[Serialized Lane] ✅ Execution Loop Complete.`);
        return reply;

    } catch (error: any) {
        console.error(`[Serialized Lane ERROR]`, error.message || error);
        return "❌ Internal Lane Error.";
    } finally {
    }
}
