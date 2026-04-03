import "dotenv/config";
import { generateOmniContent } from "./src/runtime/engine/omni_router.js";

async function run() {
    const res = await generateOmniContent({
        provider: "GOOGLE",
        defaultModel: "google/gemini-3.1-pro-preview",
        apiKey: process.env.GOOGLE_API_KEY || "dummy",
        agentId: "test_agent"
    } as any, {
        systemPrompt: "You are the ZAP Swarm.",
        messages: [{ role: "user", content: "Identify yourself concisely." }],
        theme: "C_PRECISION",
        intent: "FAST_CHAT"
    });
    console.log("SUCCESS TEST:\n", res.text?.substring(0, 100));
}
run();
