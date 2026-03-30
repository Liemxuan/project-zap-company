import { MongoClient } from "mongodb";
import { receiveMessage } from "../gateway/intercept.js";
import { formatTelegramHUD } from "./telegram_hud.js";
import { OmniResponse } from '../runtime/engine/omni_router.js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Sends a chat action (like 'typing') to the Telegram user.
 */
export function sendTelegramTypingAction(chatId: number, threadId?: number) {
    if (!TELEGRAM_BOT_TOKEN) return;

    const payloadObj: any = {
        chat_id: chatId,
        action: "typing"
    };
    if (threadId) payloadObj.message_thread_id = threadId;

    const payload = JSON.stringify(payloadObj);

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options);
    req.on('error', () => { }); // Ignore errors for typing indicators
    req.write(payload);
    req.end();
}

/**
 * Starts a persistent 'typing' heartbeat for long-running turns.
 * Returns a cleanup function to stop the heartbeat.
 */
export function startTypingHeartbeat(chatId: number, threadId?: number): () => void {
    // Send immediate action
    sendTelegramTypingAction(chatId, threadId);

    // Set up interval (Telegram typing action expires after ~5 seconds)
    const interval = setInterval(() => {
        sendTelegramTypingAction(chatId, threadId);
    }, 4000);

    return () => {
        clearInterval(interval);
    };
}

/**
 * Sends a message back to the Telegram user via the Telegram Bot API.
 */
export function sendTelegramMessage(chatId: number, text: string, threadId?: number) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error("[Telegram] 🚨 TELEGRAM_BOT_TOKEN is not set.");
        return;
    }

    const payloadObj: any = {
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown" // Enable Markdown styling for the HUDs
    };
    if (threadId) payloadObj.message_thread_id = threadId;

    const payload = JSON.stringify(payloadObj);

    console.log(`\n===============\n[Telegram UI Render]:\n${text}\n===============\n`);

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
            console.error(`[Telegram] 🚨 Error sending message. HTTP Status: ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        console.error(`[Telegram] 🚨 HTTP Request Error:`, error);
    });

    req.write(payload);
    req.end();
}


/**
 * Processes incoming Telegram Webhook payloads.
 */
export async function handleTelegramWebhook(update: any) {
    // 1. Validate Payload
    if (!update.message || !update.message.text || !update.message.chat) {
        return; // Ignore non-text messages (stickers, edits, etc)
    }

    const chatId = update.message.chat.id;
    const text = update.message.text;
    const telegramId = update.message.from.id.toString();
    const threadId = update.message.message_thread_id;

    console.log(`\n[Telegram] 📥 Received Webhook. ChatID: ${chatId} | ThreadID: ${threadId || 'N/A'} | TelegramID: ${telegramId}`);

    // 2. Identify the User in MongoDB across all tenants
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);

        let user = null;
        const collectionsToCheck = [
            `OLYMPUS_SYS_OS_users`,
            `ZVN_SYS_OS_users`,
            `PHO24_SYS_OS_users`
        ];

        for (const colName of collectionsToCheck) {
            const collection = db.collection(colName);
            user = await collection.findOne({ telegramId: telegramId });
            if (user) break; // Found them
        }

        if (!user) {
            console.log(`[Telegram] ❌ Unregistered user attempted access. ID: ${telegramId}`);

            // Fetch tenant settings to check if pairing is enforced (Defaulting to OLYMPUS for now)
            // In a multi-tenant setup, this would be determined by the webhook URL or bot token.
            const settingsCol = db.collection(`OLYMPUS_SYS_OS_settings`);
            const settings = await settingsCol.findOne({ tenantId: "OLYMPUS" });
            const pairingEnforced = settings?.pairingEnforced !== false; // Default to true if not set

            if (!pairingEnforced) {
                console.log(`[Telegram] 🔓 Pairing NOT enforced for tenant OLYMPUS. Auto-provisioning guest.`);
                const guestUser = {
                    name: `Guest_${telegramId.slice(-4)}`,
                    telegramId: telegramId,
                    tenantId: "OLYMPUS",
                    role: "GUEST",
                    createdAt: new Date()
                };
                await db.collection(`OLYMPUS_SYS_OS_users`).insertOne(guestUser);
                user = guestUser;
            } else {
                // Generate a secure 8-character pairing code
                const pairingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                const pairingCol = db.collection(`SYS_OS_pairing_codes`);

                await pairingCol.updateOne(
                    { telegramId: telegramId },
                    {
                        $set: {
                            pairingCode,
                            chatId,
                            telegramId,
                            status: 'PENDING',
                            createdAt: new Date()
                        }
                    },
                    { upsert: true }
                );

                const message = [
                    `**Olympus Access Restricted.**`,
                    ``,
                    `Your Telegram user id: \`${telegramId}\``,
                    ``,
                    `Pairing code: \`${pairingCode}\``,
                    ``,
                    `Provide this code to the workspace administrator for authorization.`
                ].join("\n");

                sendTelegramMessage(chatId, message);
                return;
            }
        }

        console.log(`[Telegram] ✅ Authenticated User: ${user.name} (${user.tenantId})`);

        // Handle HUD Toggles
        if (text.trim().startsWith("/hud")) {
            const { setHUDPreference, getHUDPreference } = await import("../memory/hud.js");
            const arg = text.split(" ")[1]?.toLowerCase();
            const uId = user.telegramId || telegramId;

            if (arg === "on") {
                await setHUDPreference(uId, "TOKEN_STATS");
                sendTelegramMessage(chatId, "✅ **HUD Enabled.** Telemetry will be shown at the bottom of responses.");
            } else if (arg === "off") {
                await setHUDPreference(uId, "NONE");
                sendTelegramMessage(chatId, "🌑 **HUD Disabled.** Keeping the chat clean.");
            } else {
                const current = await getHUDPreference(uId);
                sendTelegramMessage(chatId, `Usage: \`/hud on\` or \`/hud off\`\nCurrent setting: \`${current}\``);
            }
            return;
        }

        // (Legacy OpenClaw /approve and /new commands removed - Native Engine now dynamically auto-spawns and manages threads)

        // Get or Create Native Mongoose Context Bound Session
        const { getOrCreateSession, appendMessage } = await import("../runtime/router/session.js");
        const session = await getOrCreateSession(user.tenantId, "telegram", chatId, threadId);
        console.log(`[Telegram] 🌐 Bound to Native Session: ${session.sessionId}`);

        // Send 'typing' indicator to Telegram so the user knows we are processing
        sendTelegramTypingAction(chatId, threadId);

        // Append User Message to History
        await appendMessage(session.sessionId, user.tenantId, "user", text);

        const { omniQueue, triageJob } = await import("../runtime/engine/omni_queue.js");

        const omniPayload = {
            systemPrompt: "You are Hermes, the Communications Gateway for the ZAP Swarm. Your primary function is to converse natively with the user on Telegram and orchestrate swarm resources if complex tasks arise. Answer queries accurately or dispatch to Spike/Jerry if code/backend systems need mutating.",
            messages: [
                ...session.messages.map(m => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
                { role: "user" as const, content: text }
            ],
            theme: "A_ECONOMIC" as const,
            intent: "FAST_CHAT" as const
        };

        const queueName = triageJob(omniPayload);
        const llmConfig = {
            apiKey: process.env.GOOGLE_API_KEY || "",
            defaultModel: "google/gemini-2.0-flash-001",
            accountLevel: "STANDARD" as const
        };

        const jobId = await omniQueue.enqueue(
            queueName,
            1, // priority
            user.tenantId,
            omniPayload,
            llmConfig,
            "TELEGRAM",
            telegramId, // Sender Identifier (Used for user lookup on egress)
            chatId,     // Target channel reply ID
            {
                tenantId: user.tenantId,
                senderIdentifier: telegramId,
                sessionId: session.sessionId,
                assignedAgentId: "hermes",
                threadId: threadId
            }
        );

        // Phase 6: Core Analytics - Update Real-Time Channel Status
        const channelsCol = db.collection(`${user.tenantId}_SYS_CHANNELS`);
        await channelsCol.updateOne(
            { name: "Telegram" },
            { 
                $set: { status: "active", ping: "native", lastActivityAt: new Date(), connectedAgent: "Hermes" },
                $inc: { messageCount: 1 }
            },
            { upsert: true }
        );

        console.log(`[Telegram] 🚀 Enqueued Job ${jobId} into ${queueName} for Session: ${session.sessionId}`);

    } catch (error) {
        console.error(`[Telegram] 🚨 Database/Gateway Error:`, error);
        sendTelegramMessage(chatId, "System Error: The AI core is currently unreachable.");
    } finally {
        await client.close();
    }
}
