import "dotenv/config";
import { createBot, globalSwarmAgents } from "./bot.js";
import { startDaemon } from "./daemon.js";
import { appendMessage } from "./history.js";
import express from "express";
import cors from "cors";

// ── Validate required environment variables ───────────────────────────────────

const required = [
    "TELEGRAM_BOT_TOKEN_CLAW",
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

// ── Triangulation: Booting the Agent Swarm ─────────────────────────────────────

// Bot 1: @zap_claw_bot (The Architect - Primary)
const clawToken = process.env["TELEGRAM_BOT_TOKEN_CLAW"]!;
const clawBot = createBot(clawToken, "Claw (Architect)", "tier_p3_heavy");

// Bot 3: @zap_jerry_bot has been permanently decoupled to Port 3300 (`src/jerry_server.ts`)
// Bot 2: @zap_spike_bot has been permanently decoupled to Port 3301 (`src/spike_server.ts`)

// Bot 3: @zap_jerry_bot has been permanently decoupled to Port 3300 (`src/jerry_server.ts`)

console.log("🦀 Zap Claw Swarm is running on strict Prisma schema...");
console.log("   Press Ctrl+C to stop.\n");

// ── Inbound Webhook Listener (OpenClaw -> Zap-Claw) ──────────────────────────
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// 1. OpenClaw Inbound Webhook
app.post("/api/openclaw/inbound", async (req, res) => {
    console.log(`[INBOUND] 📥 Received payload from OpenClaw:`, req.body);

    const incomingText = typeof req.body.payload === "string" ? req.body.payload : (typeof req.body.message === "string" ? req.body.message : JSON.stringify(req.body, null, 2));
    const sourceAgent = req.body.sourceAgent || "OpenClaw";

    // 1. Immediately ACK the webhook so OpenClaw doesn't timeout waiting for the LLM
    res.status(200).json({ status: "received", message: "Payload queued for Zap-Claw autonomic processing." });

    // 2. Process Headlessly in the background
    const jerryAgent = globalSwarmAgents["Jerry"];
    if (jerryAgent) {
        console.log(`[INBOUND] 🧠 Routing to Jerry for pure autonomic background response...`);

        // Execute asynchronously
        (async () => {
            try {
                const broadcastTarget = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999999;

                // Enforce extreme brevity for the outbound message 
                const systemPrompt = `[INBOUND_FROM_OPENCLAW]
Source: ${sourceAgent}
Message: ${incomingText}

[CRITICAL DIRECTIVE: You are responding directly to an external agent (${sourceAgent}). 
You MUST respond in MAXIMUM 1-2 SHORT SENTENCES.
DO NOT use Markdown. DO NOT use bolding. DO NOT use bullet points.
DO NOT output "Summary:", "Action Items:", or "Technical Details:".
YOUR RESPONSE MUST BE RAW, PLAIN, CONVERSATIONAL TEXT ONLY.]`;

                // Execute Jerry's core loop
                const jerryResponse = await jerryAgent.run(broadcastTarget, systemPrompt, "PERSONAL", "OPENCLAW_BRIDGE");

                // 3. Fire the response directly back to OpenClaw's target URL (Headless Egress)
                const outboundUrl = process.env.OPENCLAW_WEBHOOK_URL || "http://127.0.0.1:8000/webhook-integration";
                console.log(`[OUTBOUND] 🚀 Firing Jerry's headless response back to OpenClaw at ${outboundUrl}`);

                await fetch(outboundUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: jerryResponse,
                        sourceAgent: "Jerry",
                        targetAgent: sourceAgent
                    })
                });
                console.log(`[OUTBOUND] ✅ Successfully transmitted Jerry's response to OpenClaw.`);

                // 4. Notify the War Room of the completed exchange (Ultra-concise per Zeus)
                const hudMessage = `[ZAP-CLAW HUD] 🌉 **OpenClaw Bridge Pulse**: Payload routed from *${sourceAgent}* to *Jerry* and returned successfully.`;

                // Fallback to the known group ID if the ALLOWED_USER_IDS array doesn't have a specific group
                const warRoomId = -1003794659625;
                try {
                    await clawBot.api.sendMessage(warRoomId, hudMessage, { parse_mode: "Markdown" });
                } catch {
                    // Fallback to sending it to the human admin if the bot isn't in the group or fails
                    await clawBot.api.sendMessage(broadcastTarget, hudMessage);
                }

            } catch (err: any) {
                console.error(`[BACKGROUND ERROR] ❌ Failed to process headlessly: ${err.message}`);
            }
        })();
    } else {
        console.warn("[INBOUND] ⚠️ Jerry agent not active, cannot route payload headlessly.");
    }
});

// 2. HUD Chat Endpoint (Frontend -> Zap-Claw)
app.post("/api/hud/chat", async (req, res) => {
    const { message, botName, activePage } = req.body;
    console.log(`[HUD] 💬 Received chat request for ${botName} on page ${activePage}: "${message}"`);

    // Jerry traffice is decoupled and should hit his dedicated Port 3300, 
    // but if it arrives here, route down to default or error out.
    if (botName === "Jerry") {
        res.status(400).json({ error: "Jerry has been decoupled to Port 3300. Frontend must ping http://localhost:3300/api/hud/chat instead." });
        return;
    }

    const targetAgent = globalSwarmAgents[botName];
    if (!targetAgent) {
        res.status(404).json({ error: "Agent not found" });
        return;
    }

    try {
        // Inject context about the current page
        const contextInjection = `[SYSTEM_CONTEXT: User is currently viewing the page: ${activePage}]\n`;
        const fullPrompt = contextInjection + message;

        // Use a generic session ID for HUD interactions or derive from user if auth was present
        const sessionId = "HUD_SESSION_" + new Date().toISOString().split('T')[0];
        const userId = process.env.ALLOWED_USER_IDS?.split(",").map(id => parseInt(id.trim()))[0] || 999999;

        const reply = await targetAgent.run(userId, fullPrompt, "PERSONAL", sessionId);

        res.json({ reply });
    } catch (error: any) {
        console.error(`[HUD] ❌ Error processing chat: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Change port to 8000 to match Frontend expectation
const INBOUND_PORT = 8000;
app.listen(INBOUND_PORT, () => {
    console.log(`[INBOUND] 🎧 Zap-Claw Webhook Listener active on port ${INBOUND_PORT}`);
    console.log(`   Endpoint: POST http://localhost:${INBOUND_PORT}/api/openclaw/inbound`);
    console.log(`   Endpoint: POST http://localhost:${INBOUND_PORT}/api/hud/chat`);
});

// Spin up the background Master Job Queue to poll the database
startDaemon();

// Graceful shutdown
process.once("SIGINT", () => {
    console.log("\n[shutdown] SIGINT received, stopping Swarm...");
    clawBot.stop();
});

process.once("SIGTERM", () => {
    console.log("\n[shutdown] SIGTERM received, stopping Swarm...");
    clawBot.stop();
});

// Launch all available bots via long-polling
const botStartPayload = {
    onStart: (info: any) => {
        console.log(`[Swarm] ✅ Agent online: @${info.username} (ID: ${info.id})`);
    },
};

clawBot.start(botStartPayload);
