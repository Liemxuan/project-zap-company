import { Request, Response } from "express";
import { getOrCreateSession, appendMessage } from "./session.js";
import { omniQueue, triageJob, QueuePriority } from "../engine/omni_queue.js";
import { OmniPayload, LLMConfig } from "../engine/omni_router.js";

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
                // 1. Acquire Session (creating if necessary, strictly bound to tenant, chat, and thread)
                const session = await getOrCreateSession(tenantId, "telegram", chatId, threadId);

                // 2. Append User Message to History (triggers Rule of 500 compaction if needed)
                await appendMessage(session.sessionId, tenantId, "user", text);

                // 3. Construct OmniPayload (Strictly Typed)
                const omniPayload: OmniPayload = {
                    systemPrompt: "You are a helpful ZAP Claw assistant.", // Default system prompt
                    messages: [
                        ...session.messages.map(m => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
                        { role: "user", content: text } // Ensure the latest message is included
                    ],
                    theme: "A_ECONOMIC", // Default to economic theme
                    intent: threadId ? "ACP_SUBAGENT_SPAWN" : "FAST_CHAT" // Native Thread Inference
                };

                // 4. Triage & Enqueue
                const queueName = triageJob(omniPayload);
                const priority: QueuePriority = 1; // Default priority for chat

                const llmConfig: LLMConfig = {
                    apiKey: process.env.GOOGLE_API_KEY || "", // Router will resolve/override this
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
                    chatId, // Sender Identifier (Chat ID)
                    parseInt(chatId), // Numeric Chat ID for callbacks
                    {
                        tenantId,
                        senderIdentifier: chatId,
                        sessionId: session.sessionId,
                        assignedAgentId: "default-agent",
                        threadId // Pass deep binding string to OmniQueue
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
