import dotenv from "dotenv";
dotenv.config();
import { generateOmniContent } from "./src/runtime/engine/omni_router";

async function main() {
    process.env.OPENROUTER_API_KEY = "dummy"; // Bypass openrouter checks
    
    console.log("[Test 1] Testing Gemini Gateway Streaming natively...");
    const res = await generateOmniContent({
        provider: "GOOGLE",
        defaultModel: "google/gemini-2.5-pro",
        apiKey: process.env.GOOGLE_API_KEY || "dummy",
        agentId: "test_agent"
    }, {
        intent: "TEST",
        forceModel: true,
        messages: [{ role: "user", content: "Hello proxy!" }]
    });

    console.log("Response:", res.text?.substring(0, 100));
}

main().catch(console.error);
