import { Request, Response } from "express";
import { getOrCreateSession, appendMessage } from "./session.js";
import { omniQueue, triageJob, QueuePriority } from "../engine/omni_queue.js";
import { OmniPayload, LLMConfig } from "../engine/omni_router.js";
import { passesMentionGate, resolveAgentBinding, logDLQ } from "./dispatch.js";

export async function handleTelegramWebhook(req: Request, res: Response) {
    try {
        const payload = req.body;

        // Fallback tenant isolation (Assume default for now unless mapped in middleware)
        const tenantId = req.headers["x-tenant-id"] as string || "ZVN_DEFAULT";

        // Handle generic Telegram message logic
        if (payload.message) {
            const chatId = payload.message.chat.id.toString();
            const text = payload.message.text;

            // Specifically capture the thread_id to natively support subagent_spawning
            // and forum topics (the limitation OpenClaw had).
            const threadId = payload.message.message_thread_id
                ? payload.message.message_thread_id.toString()
                : undefined;

            if (text) {
                // Determine group context & gate
                const chatType = payload.message.chat.type;
                const botUsername = process.env.TELEGRAM_BOT_USERNAME || "ZAP_Bot";
                const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
                
                // 1. Resolve Matrix Binding First (to check for allowAutoListen)
                const binding = await resolveAgentBinding(mongoUri, tenantId, "telegram", chatId, threadId);

                if (!binding) {
                    console.log(`[Router] 🛑 Filtered: No agent bound to ${chatId}`);
                    // Fail-closed DLQ behavior
                    await logDLQ(mongoUri, payload, "NO_AGENT_BINDING");
                    return res.status(200).json({ ok: true, dropped: "no_agent_binding" });
                }

                // 2. Mention Gate (Noise Filter)
                if (!passesMentionGate(chatType, text, botUsername, threadId, binding.allowAutoListen)) {
                    console.log(`[Router] 🛑 Filtered: Non-mention in group ${chatId}`);
                    // Optionally log to DLQ if we want to trace noise, though usually we don't save noise
                    return res.status(200).json({ ok: true, dropped: "mention_gated" });
                }

                // 1. Acquire Session
                const session = await getOrCreateSession(tenantId, "telegram", chatId, threadId);

                // 2. Append User Message
                await appendMessage(session.sessionId, tenantId, "user", text);

                // 3. Construct Payload with Paranoia Constraints
                let systemPrompt = binding.systemPrompt || "You are an integrated agent of the ZAP Swarm.";
                
                // Inject Environmental Context dynamically per PRD-005 Section 5
                const senderName = payload.message.from.first_name || payload.message.from.username || "User";
                systemPrompt += `\n[ENVIRONMENT CONTEXT: You are running in a ${chatType} chat. The user speaking right now is ${senderName}. Do not misidentify the speaker.]`;

                const omniPayload: OmniPayload = {
                    systemPrompt: systemPrompt,
                    messages: [
                        ...session.messages.map(m => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
                        { role: "user", content: text }
                    ],
                    theme: "A_ECONOMIC",
                    intent: threadId ? "ACP_SUBAGENT_SPAWN" : "FAST_CHAT"
                };

                // 4. Triage & Enqueue
                const queueName = triageJob(omniPayload);
                const priority = (binding.priority ?? 1) as unknown as QueuePriority;

                const llmConfig: LLMConfig = {
                    apiKey: process.env.GOOGLE_API_KEY || "", 
                    defaultModel: "google/gemini-2.0-flash-001",
                    accountLevel: "STANDARD"
                };

                const jobId = await omniQueue.enqueue(
                    queueName,
                    priority,
                    tenantId,
                    omniPayload,
                    llmConfig,
                    "TELEGRAM",
                    chatId,
                    parseInt(chatId),
                    {
                        tenantId,
                        senderIdentifier: chatId,
                        sessionId: session.sessionId,
                        assignedAgentId: binding.agentId,
                        threadId
                    }
                );

                console.log(`[Router] 🚀 Enqueued Job ${jobId} for Session[${session.sessionId}] into ${queueName}`);
            }
        }

        // Always 200 OK so Telegram stops retrying
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("[Router - Telegram Webhook ERROR]", error);
        return res.status(500).json({ ok: false, error: "Internal Server Error" });
    }
}
