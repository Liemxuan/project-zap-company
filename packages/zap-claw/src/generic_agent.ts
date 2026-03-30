import "dotenv/config";
import { createBot, globalSwarmAgents } from "./bot.js";
import express from "express";
import cors from "cors";
import { mountMemoryRoutes } from "./lib/memory_routes.js";

// Parse args to know which agent we are booting
const agentName = process.env.AGENT_NAME || "Generic Agent";
const agentTokenVar = process.env.AGENT_TOKEN_VAR || "TELEGRAM_BOT_TOKEN_CLAW";
const agentPort = parseInt(process.env.PORT || "3999", 10);
const agentFlavor = process.env.AGENT_FLAVOR || "tier_p3_heavy";

// ── Validate core environment variables (non-Telegram) ────────────────────────
const coreRequired = ["OPENROUTER_API_KEY", "ALLOWED_USER_IDS"] as const;

for (const key of coreRequired) {
    if (!process.env[key]) {
        console.warn(`⚠️  [${agentName}] Missing ${key} — agent will run in headless mode (memory + heartbeat only)`);
    }
}

// ── Booting The Agent ────────────────────────────────────────────────────────
const agentToken = process.env[agentTokenVar];
let agentBot: any = null;

if (agentToken) {
    agentBot = createBot(agentToken, agentName, agentFlavor as any);
    console.log(`⚡️ ${agentName} Swarm Agent is running on strict isolation...`);
} else {
    console.log(`⚡️ ${agentName} running in headless mode (no Telegram bot token: ${agentTokenVar})`);
    console.log(`   Memory v2 + Heartbeat active. Telegram disabled.`);
}

console.log(`   Press Ctrl+C to stop.\n`);

// ── Inbound Listener ──────────────────────────
const app = express();
app.use(express.json());
app.use(cors());

// Health Check / Inbound Webhook
app.post("/api/inbound", async (req, res) => {
    console.log(`[${agentName.toUpperCase()} INBOUND] 📥 Received payload:`, req.body);
    res.status(200).json({ status: "received", message: `Payload queued for ${agentName} processing.` });
});

// Mount Memory v2.1 + Heartbeat + Reflect + Stats
mountMemoryRoutes(app, { name: agentName.toLowerCase(), role: agentFlavor, port: agentPort });

app.listen(agentPort, "0.0.0.0", () => {
    console.log(`[${agentName.toUpperCase()} SERVER] 🎧 Listener active on port ${agentPort}`);
});

// Graceful shutdown
process.once("SIGINT", () => {
    console.log(`\n[shutdown] SIGINT received, stopping ${agentName}...`);
    if (agentBot) agentBot.stop();
});

process.once("SIGTERM", () => {
    console.log(`\n[shutdown] SIGTERM received, stopping ${agentName}...`);
    if (agentBot) agentBot.stop();
});

// Launch Telegram polling (only if bot is available)
if (agentBot) {
    agentBot.start({
        onStart: (info: any) => {
            console.log(`[${agentName}] ✅ Agent online: @${info.username} (ID: ${info.id})`);
        },
    });
}
