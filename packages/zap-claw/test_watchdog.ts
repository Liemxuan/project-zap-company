import { generateOmniContent, OmniPayload, LLMConfig } from './src/runtime/engine/omni_router.js';

async function testJerry() {
    console.log("🚀 Testing ZAP-OS Jerry Watchdog...");

    const dummyConfig: LLMConfig = {
        apiKey: process.env.GOOGLE_API_KEY || "", // Assume it's loaded via .env global
        defaultModel: "google/gemini-2.5-flash",
        accountLevel: "STANDARD"
    };

    const payload: OmniPayload = {
        theme: "A_ECONOMIC",
        intent: "CODING",
        systemPrompt: "You are a helpful assistant.",
        messages: [{ role: "user", content: "Write a React component for a button with inline hex colors and absolute hardcoded positioning to test Jerry." }],
        watchdogReview: true // <--- Trigger the Spike-Jerry pipeline
    };

    try {
        console.log("⏱️ Awaiting Spike's Generation...");
        const result = await generateOmniContent(dummyConfig, payload as any);
        console.log("✅ Spike and Jerry completed successfully:", result.text?.substring(0, 100) + "...");
    } catch (e: any) {
        console.error("🛑 Process Terminated:", e.message);
    }
}

testJerry();
