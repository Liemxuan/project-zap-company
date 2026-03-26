import { MongoClient } from "mongodb";
import { generateOmniContent, OmniPayload, resolveAgentLLMConfig } from "./src/runtime/engine/omni_router.js";
import "dotenv/config";

async function runDemo() {
    console.log("🚀 Testing BLAST-012 TRT Integration inside Omni Router...");

    // We emulate a tenant payload but explicitly ask for reflexions
    const payload: OmniPayload = {
        systemPrompt: "You are a helpful software engineer. You write concise code.",
        messages: [{ role: "user", content: "Write a function that calculates the nth Fibonacci number, but intentionally make a small bug in the initial logic. Do not fix it on the first try so the TRT reflection can catch it." }],
        theme: "C_PRECISION", // Triggers the higher intelligence models
        intent: "REASONING",
        reflexions: 1 // Force 1 hidden TRT loop
    };

    const config = {
        apiKey: process.env.OPENROUTER_API_KEY || process.env.GOOGLE_API_KEY || "",
        defaultModel: "google/gemini-2.5-flash",
        accountLevel: "STANDARD" as any,
    };

    try {
        const response = await generateOmniContent(config, payload);
        console.log("\n================== TRT FINAL RESPONSE ==================\n");
        console.log(response.text);
        console.log("\n========================================================");
    } catch (e: any) {
        console.error("Test failed:", e.message);
    }
}

runDemo();
