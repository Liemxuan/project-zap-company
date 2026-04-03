import "dotenv/config";
import { generateOmniContent } from "./src/runtime/engine/omni_router.js";

async function run() {
    const res = await generateOmniContent({
        provider: "GOOGLE",
        defaultModel: "google/gemini-3.1-pro-preview",
        apiKey: process.env.GOOGLE_API_KEY || "dummy",
        agentId: "test_agent"
    } as any, {
        systemPrompt: "You are a helpful assistant.",
        messages: [{ role: "user", content: "Hello proxy!" }],
        theme: "C_PRECISION",
        intent: "FAST_CHAT"
    });
    console.log("Response:", res);
}
run();
