import "dotenv/config";
import { createBot, globalSwarmAgents } from "./bot.js";
import express from "express";
import cors from "cors";
import { mountMemoryRoutes } from "./lib/memory_routes.js";

// ── Validate required environment variables ───────────────────────────────────

const required = [
    "TELEGRAM_BOT_TOKEN_SPIKE",
    "OPENROUTER_API_KEY",
    "ALLOWED_USER_IDS",
] as const;

for (const key of required) {
    if (!process.env[key]) {
        console.error(`❌ Missing required environment variable: ${key}`);
        console.error(`   Copy .env.example to .env and fill in the values.`);
        process.exit(1);
    }
}

// ── Booting Spike (Agent 1: The Analyst) ─────────────────────────────────────

const spikeToken = process.env["TELEGRAM_BOT_TOKEN_SPIKE"]!;
const spikeBot = createBot(spikeToken, "Spike (Analyst)", "tier_p3_heavy");

console.log("⚡️ Spike Swarm Agent is running on strict isolation...");
console.log("   Press Ctrl+C to stop.\n");

// ── Inbound Listener (Port 3301) ──────────────────────────
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// 1. Direct Inbound Webhook (System Integrations)
app.post("/api/inbound", async (req, res) => {
    console.log(`[SPIKE INBOUND] 📥 Received payload:`, req.body);
    const incomingText = typeof req.body.payload === "string" ? req.body.payload : (typeof req.body.message === "string" ? req.body.message : JSON.stringify(req.body, null, 2));

    // ACK immediately
    res.status(200).json({ status: "received", message: "Payload queued for Spike autonomic processing." });

    const spikeAgent = globalSwarmAgents["Spike (Analyst)"] || globalSwarmAgents["Spike"];
    if (spikeAgent) {
        (async () => {
            try {
                const broadcastTarget = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999999;

                const systemPrompt = `[DIRECT_INBOUND]
Payload: ${incomingText}
[CRITICAL DIRECTIVE: You are executing an isolated request. Be exceedingly concise.]`;

                await spikeAgent.run(broadcastTarget, systemPrompt, "PERSONAL", "SPIKE_BRIDGE");

            } catch (err: any) {
                console.error(`[SPIKE BACKGROUND ERROR] ❌ Failed to process headlessly: ${err.message}`);
            }
        })();
    } else {
        console.warn("[SPIKE INBOUND] ⚠️ Spike agent object not found in memory.");
    }
});

// 2. HUD Chat Endpoint (Frontend -> Spike)
app.post("/api/hud/chat", async (req, res) => {
    const { message, activePage } = req.body;
    console.log(`[SPIKE HUD] 💬 Received chat request on page ${activePage}: "${message}"`);

    const spikeAgent = globalSwarmAgents["Spike (Analyst)"] || globalSwarmAgents["Spike"];
    if (!spikeAgent) {
        res.status(404).json({ error: "Spike agent not found in memory" });
        return;
    }

    try {
        const contextInjection = `[SYSTEM_CONTEXT: User is currently viewing the page: ${activePage}]\n`;
        const fullPrompt = contextInjection + message;
        const sessionId = "HUD_SESSION_" + new Date().toISOString().split('T')[0];
        const userId = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999;

        const reply = await spikeAgent.run(userId, fullPrompt, "PERSONAL", sessionId);
        res.json({ reply });
    } catch (error: any) {
        console.error(`[SPIKE HUD] ❌ Error processing chat: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 3301;

// Mount Memory v2 + Heartbeat
mountMemoryRoutes(app, { name: 'spike', role: 'Agent 1 / Builder', port: PORT });

app.listen(PORT, () => {
    console.log(`[SPIKE INBOUND] 🎧 Isolater Listener active on port ${PORT}`);
    console.log(`   Endpoint: POST http://localhost:${PORT}/api/inbound`);
    console.log(`   Endpoint: POST http://localhost:${PORT}/api/hud/chat`);
});

// Graceful shutdown
process.once("SIGINT", () => {
    console.log("\n[shutdown] SIGINT received, stopping Spike...");
    spikeBot.stop();
});

process.once("SIGTERM", () => {
    console.log("\n[shutdown] SIGTERM received, stopping Spike...");
    spikeBot.stop();
});

// Launch Spike Telegram polling
spikeBot.start({
    onStart: (info: any) => {
        console.log(`[Spike] ✅ Agent online: @${info.username} (ID: ${info.id})`);
    },
});
