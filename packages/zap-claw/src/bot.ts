import { Bot, type Context, InlineKeyboard } from "grammy";
import { AgentLoop } from "./agent.js";
import { type GatewayTier } from "./gateway.js";
import { getOrCreateSession } from "./gateway/session.js";
import { Redis } from "ioredis";
import * as fs from "fs";
import * as path from "path";

async function downloadTelegramFile(ctx: Context, fileId: string, botToken: string, extension: string = "bin"): Promise<string> {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) throw new Error("Could not get file path from Telegram");
    
    const url = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
    
    const vfsDir = "/tmp/zap-assets";
    if (!fs.existsSync(vfsDir)) {
        fs.mkdirSync(vfsDir, { recursive: true });
    }
    
    const filename = `${Date.now()}_${fileId}.${extension}`;
    const destPath = path.join(vfsDir, filename);
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    
    return destPath;
}

// ── Security: parse the allowlist once at startup ─────────────────────────────

function parseAllowedUserIds(): Set<number> {
    const raw = process.env["ALLOWED_USER_IDS"] ?? "";
    const ids = raw
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));

    if (ids.length === 0) {
        throw new Error(
            "ALLOWED_USER_IDS is empty or invalid. Set it to your Telegram user ID."
        );
    }

    console.log(`[security] Allowed user IDs: ${ids.join(", ")}`);
    return new Set(ids);
}

// ── Global Swarm Registry (ATA Bus) ───────────────────────────────────────────

export const globalSwarmAgents: Record<string, AgentLoop> = {};

async function processAtaRouting(reply: string, userId: number, sessionId: string, chatId: number, ctx: Context, ataDepth: number = 0) {
    if (ataDepth >= 3) {
        console.warn(`[ATA_BUS] ⚠️ Maximum ATA depth reached (${ataDepth}). Breaking potential infinite loop.`);
        return;
    }

    // 1. Check for Internal ATA Routing
    const internalAtaMatch = reply.match(/\[ATA_(?:TARGET|HANDSHAKE):\s*(\w+)\]/i);
    if (internalAtaMatch && internalAtaMatch[1]) {
        const targetName = internalAtaMatch[1];
        if (!globalSwarmAgents[targetName]) {
            console.warn(`[ATA_BUS] ⚠️ Internal target agent '${targetName}' not found in registry.`);
        } else {
            console.log(`[ATA_BUS] 🚌 Dispatching internal message to ${targetName}...`);
            const ataPayload = `[ATA_ROUTED_MESSAGE]\n${reply}`;

            setImmediate(async () => {
                try {
                    let stopHeartbeat: (() => void) | null = null;
                    try {
                        const sendAction = () => ctx.api.sendChatAction(chatId, "typing").catch(() => { });
                        sendAction();
                        const interval = setInterval(sendAction, 4000);
                        stopHeartbeat = () => clearInterval(interval);
                    } catch (e) { }

                    const targetReply = await globalSwarmAgents[targetName]?.run(userId, ataPayload, "PERSONAL", sessionId);

                    if (stopHeartbeat) stopHeartbeat();

                    if (targetReply) {
                        try {
                            await ctx.api.sendMessage(chatId, targetReply, { parse_mode: "Markdown" });
                        } catch {
                            await ctx.api.sendMessage(chatId, targetReply);
                        }
                        await processAtaRouting(targetReply, userId, sessionId, chatId, ctx, ataDepth + 1);
                    }
                } catch (e) {
                    console.error(`[ATA_BUS] ❌ Internal target agent ${targetName} failed:`, e);
                }
            });
            return; // Handled internally
        }
    }

    // 2. Check for External OpenClaw Routing
    const externalAtaMatch = reply.match(/\[OPENCLAW_TARGET:\s*(\w+)\]/i);
    if (externalAtaMatch && externalAtaMatch[1]) {
        const externalTargetName = externalAtaMatch[1];
        console.log(`[ATA_BUS] 🌍 Intercepted external routing request for OpenClaw Target: ${externalTargetName}`);

        const webhookUrl = process.env.OPENCLAW_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error(`[ATA_BUS] ❌ OPENCLAW_WEBHOOK_URL is not set in .env. Cannot dispatch to ${externalTargetName}.`);
            return;
        }

        const authToken = process.env.OPENCLAW_AUTH_TOKEN || "";

        try {
            console.log(`[ATA_BUS] 🚀 Firing external payload to ${webhookUrl}...`);
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    targetAgent: externalTargetName,
                    sourceSessionId: sessionId,
                    sourceUserId: userId,
                    payload: reply,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                console.error(`[ATA_BUS] ❌ External bridging failed with status: ${response.status}`);
            } else {
                console.log(`[ATA_BUS] ✅ Successfully dispatched payload to OpenClaw (${externalTargetName}).`);
            }
        } catch (error) {
            console.error(`[ATA_BUS] ❌ Network error communicating with OpenClaw:`, error);
        }
    }
}

// ── Bot setup ─────────────────────────────────────────────────────────────────

export function createBot(token: string, botName: string = "ZapClaw", defaultTier: GatewayTier = "tier_p3_heavy"): Bot {
    const allowedIds = parseAllowedUserIds();
    const agent = new AgentLoop(defaultTier, botName);
    const botBaseName = (botName?.split(" ")[0] || "").trim();
    if (botBaseName) {
        globalSwarmAgents[botBaseName] = agent;
    }
    const bot = new Bot(token);

    // DEBUG: Trace all incoming updates
    bot.use(async (ctx, next) => {
        console.log(`[bot:debug] Incoming update for ${botName}: type=${Object.keys(ctx.update)[1] || 'unknown'}, from=${ctx.from?.id}, chat=${ctx.chat?.id}`);
        await next();
    });

    console.log(`[bot] 🤖 ${botName} initialized with Engagement Layer (Typing Heartbeat) active.`);

    // Security middleware — runs before every update
    bot.use(async (ctx: Context, next) => {
        const userId = ctx.from?.id;
        if (!userId || !allowedIds.has(userId)) {
            // Silently drop — no response, no error, no log entry that reveals anything
            return;
        }
        await next();
    });

    // ── HITL Subsystem (Phase 3.2) ────────────────────────────────────────────────
    const hitlSubscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    const hitlPublisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

    hitlSubscriber.subscribe("zap:hitl:request");
    hitlSubscriber.on("message", async (channel: string, message: string) => {
        if (channel === "zap:hitl:request") {
            try {
                const payload = JSON.parse(message);
                if (payload.botName === botName) {
                    const keyboard = new InlineKeyboard()
                        .text("✅ Approve", `hitl:approve:${payload.reqId}`).row()
                        .text("🛑 Deny", `hitl:deny:${payload.reqId}`);
                    
                    const text = `🚦 *Human-In-The-Loop Intervention Required*\n\n` + 
                                 `🤖 *Agent:* ${payload.botName}\n` + 
                                 `🛠 *Tool:* \`${payload.toolName}\`\n\n` + 
                                 `*Payload:*\n\`\`\`json\n${JSON.stringify(payload.toolInput, null, 2).substring(0, 1000)}\n\`\`\`\n\n` +
                                 `Do you authorize this execution?`;
                    
                    await bot.api.sendMessage(payload.userId, text, { parse_mode: "Markdown", reply_markup: keyboard });
                }
            } catch (err) {
                console.error("[bot:hitl] Failed to process HITL request", err);
            }
        }
    });

    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;
        if (data.startsWith("hitl:")) {
            const [, action, reqId] = data.split(":");
            const approved = action === "approve";
            const responsePayload = {
                approved,
                reason: approved ? "Approved by Zeus via Telegram" : "Denied by Zeus via Telegram"
            };

            await hitlPublisher.publish(`zap:hitl:response:${reqId}`, JSON.stringify(responsePayload));
            
            const originalText = ctx.callbackQuery.message?.text || "HITL Request";
            await ctx.editMessageText(
                `${originalText}\n\n*Status:* ${approved ? '✅ APPROVED' : '🛑 DENIED'}`, 
                { parse_mode: "Markdown" }
            );
            await ctx.answerCallbackQuery({ text: approved ? "Authorized." : "Rejected." });
        }
    });

    // /start — welcome message
    bot.command("start", async (ctx) => {
        const userId = ctx.from?.id;
        const name = botName;
        await ctx.reply(
            `🚀 **ZAP OS Initialized.**\n\n` +
            `Hello! I am **${name}**, your personal Anti-gravity assistant.\n\n` +
            `I've been provisioned with your secure workspace and memory engine. What would you like to call me, or how can I help you get started today?`
        );
    });

    // /clear — reset conversation history
    bot.command("clear", async (ctx) => {
        const userId = ctx.from?.id;
        if (userId) agent.clearHistory(userId);
        await ctx.reply("🧹 Conversation cleared.");
    });

    // Phase 8: Swarm IM Message Bus Commands
    bot.command("status", async (ctx) => {
        const agentKeys = Object.keys(globalSwarmAgents).join(", ") || "None";
        await ctx.reply(`📊 *ZAP Swarm Deployment Status*\n\n🟢 Active Fleet: ${agentKeys}\n🛡️ Guardrail: Synchronous (Jerry V2)\n🧠 Memory: Deduplicator Active\n\nSystem is fully nominal.`, { parse_mode: "Markdown" });
    });

    bot.command("deploy_spike", async (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;
        
        await ctx.reply("🚀 *Deploying Spike (Structural Engineer)...*\n\nVFS Sandboxing initialized. Delegating to background Executor.", { parse_mode: "Markdown" });
        
        // Emulate sending a directive to the Swarm
        const sessionId = await getOrCreateSession(ctx.chat.id, "ZAP_CLAW");
        const triggerPayload = `[SYSTEM DELEGATION] The user has authorized a mobile deployment for Spike via Telegram. Please evaluate the workspace and engage the 'task' tool to assign Spike to structural extraction tasks on the frontend immediately.`;
        
        try {
            const sendAction = () => ctx.api.sendChatAction(ctx.chat.id, "typing").catch(() => { });
            sendAction();
            const interval = setInterval(sendAction, 4000);
            
            const reply = await agent.run(userId, triggerPayload, "PERSONAL", sessionId);
            
            clearInterval(interval);
            try {
                await ctx.reply(reply, { parse_mode: "Markdown" });
            } catch {
                await ctx.reply(reply);
            }
        } catch (err: any) {
            await ctx.reply(`⚠️ Swarm deployment failed: ${err.message}`);
        }
    });

    // Main message handler
    bot.on("message", async (ctx: Context) => {
        const userId = ctx.from!.id;
        let userMessage = ctx.message?.text || ctx.message?.caption || "";

        // Phase 3.3 Media Ingestion (Photos/Documents/Video)
        let downloadedAssets: string[] = [];
        try {
            if (ctx.message?.photo && ctx.message.photo.length > 0) {
                const photo = ctx.message.photo[ctx.message.photo.length - 1]; // get highest res
                if (photo) {
                    const destPath = await downloadTelegramFile(ctx, photo.file_id, token, "jpg");
                    downloadedAssets.push(destPath);
                }
            } 
            if (ctx.message?.document) {
                const doc = ctx.message.document;
                const ext = doc.file_name ? doc.file_name.split('.').pop() || "bin" : "bin";
                const destPath = await downloadTelegramFile(ctx, doc.file_id, token, ext);
                downloadedAssets.push(destPath);
            }
        } catch (downloadErr) {
            console.error("[bot] Failed to download media asset:", downloadErr);
        }

        if (downloadedAssets.length > 0) {
            userMessage = `[ASSET INGESTED: ${downloadedAssets.join(", ")}]\n${userMessage}`;
            console.log(`[bot] 📥 Media Assets downloaded: ${downloadedAssets.join(", ")}`);
        }

        if (!userMessage.trim()) return; // Ignore if no text/caption/media

        // --- GROUP CHAT PROTOCOL ---
        // If in a group/supergroup, only respond if explicitly mentioned
        const chat = ctx.chat;
        if (!chat) return;

        const isGroup = chat.type === "group" || chat.type === "supergroup";
        if (isGroup) {
            const warRoomIds = (process.env["WAR_ROOM_IDS"] ?? "")
                .split(",")
                .map(id => id.trim())
                .filter(id => id !== "");

            const isWarRoom = warRoomIds.includes(chat.id.toString());
            const botUsername = ctx.me.username;
            const hasMention = userMessage.includes(`@${botUsername}`);
            const hasPoke = userMessage.toLowerCase().includes("poke");

            // Proactive Swarm Protocol: In War Rooms, certain keywords trigger Jerry/Spike automatically
            const proactiveKeywords = ["daemon", "watchdog", "runtime", "error", "pulse", "outage", "status"];
            const isProactiveTrigger = isWarRoom && proactiveKeywords.some(kw => userMessage.toLowerCase().includes(kw));

            // --- ATA VALIDATION HANDSHAKE ---
            // If another agent explicitly signs their message with an ATA target, wake up.
            // e.g. [ATA_TARGET: Jerry] or [ATA_HANDSHAKE: Spike]
            const botBaseName = (botName?.split(" ")[0] || "").trim();
            const isAtaTarget = botBaseName !== "" && (
                userMessage.includes(`[ATA_TARGET: ${botBaseName}]`) ||
                userMessage.includes(`[ATA_HANDSHAKE: ${botBaseName}]`)
            );

            // --- FULL AUTONOMY PROTOCOL ---
            // If FULL_AUTONOMY is enabled and this is a War Room, respond to everything.
            const isFullAutonomy = isWarRoom && process.env["FULL_AUTONOMY"] === "true";

            if (!hasMention && !hasPoke && !isProactiveTrigger && !isAtaTarget && !isFullAutonomy) {
                // Ignore message - bot was not mentioned, no poke, no proactive trigger, no ATA handshake, and not in full autonomy mode
                return;
            }

            let triggerReason = "unknown";
            if (hasMention) triggerReason = "mention";
            else if (hasPoke) triggerReason = "poke";
            else if (isAtaTarget) triggerReason = "ATA Handshake";
            else if (isProactiveTrigger) triggerReason = "proactive protocol";
            else if (isFullAutonomy) triggerReason = "full autonomy";

            console.log(`[bot] 🤖 ${botName} triggered by ${triggerReason}. Processing...`);
        }

        // Show typing indicator while we work (Heartbeat for long-running turns)
        let stopHeartbeat: (() => void) | null = null;
        try {
            // Persistent heartbeat (every 4 seconds)
            const sendAction = () => ctx.api.sendChatAction(chat.id, "typing").catch(() => { });
            sendAction();
            const interval = setInterval(sendAction, 4000);
            stopHeartbeat = () => clearInterval(interval);
        } catch (e) {
            console.warn("[bot] Failed to start typing heartbeat:", e);
        }

        try {
            const sessionId = await getOrCreateSession(chat.id, "ZAP_CLAW");

            const onStatus = async (msg: string) => {
                const formatted = `\r\n> 🧠 [status] ${msg}\r\n`;
                await hitlPublisher.rpush(`zap:trace:${sessionId}:logs`, formatted);
                await hitlPublisher.publish(`zap:trace:${sessionId}`, formatted);
                await hitlPublisher.expire(`zap:trace:${sessionId}:logs`, 3600);
            };

            const reply = await agent.run(userId, userMessage, "PERSONAL", sessionId, onStatus);
            if (stopHeartbeat) stopHeartbeat();
            
            // Also trace the agent reply
            const replyFormatted = `\r\n> 🤖 [reply] ${reply}\r\n`;
            await hitlPublisher.rpush(`zap:trace:${sessionId}:logs`, replyFormatted);
            await hitlPublisher.publish(`zap:trace:${sessionId}`, replyFormatted);
            await hitlPublisher.expire(`zap:trace:${sessionId}:logs`, 3600);

            try {
                // Try sending with Markdown parsing first
                await ctx.reply(reply, { parse_mode: "Markdown" });
            } catch (parseErr) {
                console.warn(`[bot] Markdown parsing failed, falling back to plain text: ${parseErr}`);
                await ctx.reply(reply); // Fallback without parse_mode
            }

            // ATA MESSAGE BUS ROUTING
            await processAtaRouting(reply, userId, sessionId, chat.id, ctx);

        } catch (err) {
            console.error("[bot] Error handling message:", err);
            await ctx.reply(
                "⚠️ An error occurred. Check the logs for details."
            );
        }
    });

    return bot;
}
