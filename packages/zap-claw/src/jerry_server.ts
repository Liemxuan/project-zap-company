import "dotenv/config";
import express from "express";
import cors from "cors";
import { mountMemoryRoutes } from "./lib/memory_routes.js";
import { AgentLoop } from "./agent.js";
import { createBot } from "./bot.js";

const app = express();
app.use(express.json());
app.use(cors());

// The strict, permanent port mandated by ZEUS_TOM
const PORT = 3300;

console.log("==========================================");
console.log(" ZAP CLAW - JERRY ISOLATED INSTANCE");
console.log(` PORT: ${PORT}`);
console.log("==========================================\n");

// Initialize Jerry's Telegram Bot if token exists (so he can optionally pulse the War Room directly)
const jerryToken = process.env["TELEGRAM_BOT_TOKEN_JERRY"];
let jerryBot: ReturnType<typeof createBot> | null = null;
if (jerryToken && jerryToken !== "YOUR_JERRY_TOKEN_HERE") {
    jerryBot = createBot(jerryToken, "Jerry (Chief of Staff)", "tier_p0_fast");
    jerryBot.start({
        onStart: (info: any) => {
            console.log(`[Jerry Swarm] ✅ Agent online: @${info.username} (ID: ${info.id})`);
        },
    });
}

// 1. Jerry's Dedicated Inbound Webhook Bridge (OpenClaw / Swarm routing)
app.post("/api/inbound", async (req, res) => {
    console.log(`[JERRY SERVER] 📥 Received payload:`, req.body);
    const incomingText = typeof req.body.payload === "string" ? req.body.payload : (typeof req.body.message === "string" ? req.body.message : JSON.stringify(req.body, null, 2));
    const sourceAgent = req.body.sourceAgent || "Unknown";

    // Immediate ACK
    res.status(200).json({ status: "received", message: "Jerry is processing." });

    (async () => {
        try {
            const broadcastTarget = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999999;
            const systemPrompt = `[INBOUND_TO_JERRY]
Source: ${sourceAgent}
Message: ${incomingText}

[CRITICAL DIRECTIVE: You are Jerry. Respond directly taking action based on your role. Keep it precise.]`;

            const jerryLoop = new AgentLoop("tier_p0_fast", "Jerry");
            const response = await jerryLoop.run(broadcastTarget, systemPrompt, "PERSONAL", "JERRY_DEDICATED_BRIDGE");

            console.log(`[JERRY SERVER] ✅ Task completed successfully.`);

            // Pulse the War Room if needed
            if (jerryBot) {
                const warRoomId = parseInt(process.env.WAR_ROOM_IDS?.split(",")[0] || "-1003794659625");
                await jerryBot.api.sendMessage(warRoomId, `[JERRY PORT 3300] Task complete.`).catch(() => { });
            }

        } catch (err: any) {
            console.error(`[JERRY SERVER] ❌ Failed to process headlessly: ${err.message}`);
        }
    })();
});

// 2. HUD Chat Specific to Jerry
app.post("/api/hud/chat", async (req, res) => {
    const { message, activePage } = req.body;
    console.log(`[JERRY HUD] 💬 Received chat request on page ${activePage}: "${message}"`);

    try {
        const loop = new AgentLoop("tier_p0_fast", "Jerry");
        const contextInjection = `[SYSTEM_CONTEXT: User is currently viewing the page: ${activePage}]\n`;
        const fullPrompt = contextInjection + message;

        const sessionId = "JERRY_SESSION_" + new Date().toISOString().split('T')[0];
        const userId = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999;

        const reply = await loop.run(userId, fullPrompt, "PERSONAL", sessionId);
        res.json({ reply });
    } catch (error: any) {
        console.error(`[JERRY HUD] ❌ Error processing chat: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Healthy", port: PORT, agent: "Jerry" });
});

// Mount Memory v2 + Heartbeat
mountMemoryRoutes(app, { name: 'jerry', role: 'Agent 2 / Watchdog', port: PORT });

app.listen(PORT, () => {
    console.log(`[JERRY SERVER] 🎧 Dedicated listener active on port ${PORT}`);
    console.log(`   Endpoint: POST http://localhost:${PORT}/api/inbound`);
    console.log(`   Endpoint: POST http://localhost:${PORT}/api/hud/chat`);
});

// Graceful shutdown
process.once("SIGINT", () => {
    console.log("\n[shutdown] SIGINT received, stopping Jerry...");
    if (jerryBot) jerryBot.stop();
});

process.once("SIGTERM", () => {
    console.log("\n[shutdown] SIGTERM received, stopping Jerry...");
    if (jerryBot) jerryBot.stop();
});
