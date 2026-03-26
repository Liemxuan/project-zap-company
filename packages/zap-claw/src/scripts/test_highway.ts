import { generateOmniContent, LLMConfig, OmniPayload } from "../runtime/engine/omni_router.js";

async function testLangChainHighway() {
    console.log("🛣️ Testing LangChain Highway (Phase 2)...");
    
    const config: LLMConfig = {
        apiKey: "", // Deliberately empty to test Redis/Env fallback resolution
        defaultModel: "google/gemini-3-flash-preview", 
        agentId: "test-agent-123",
        regionCode: "US"
    };

    const payload: OmniPayload = {
        systemPrompt: "You are a helpful test bot validating the ZAP LangChain architecture.",
        messages: [{ role: "user", content: "Respond with exactly: 'The LangChain Highway is open for business!'" }],
        theme: "A_ECONOMIC",
        intent: "GENERAL",
        forceModel: false // Let the priority router pick
    };

    try {
        console.log("[Test] Invoking generateOmniContent...");
        const response = await generateOmniContent(config, payload);
        console.log("\\n✅ Highway Request Successful:");
        console.log(`- Text: ${response.text}`);
        console.log(`- Provider: ${response.providerRef}`);
        console.log(`- Model Used: ${response.modelId}`);
        console.log(`- Tokens: Prompt(${response.tokensUsed.prompt}) Completion(${response.tokensUsed.completion}) Total(${response.tokensUsed.total})\\n`);
        process.exit(0);
    } catch (e: any) {
        console.error("\\n❌ Highway Test Failed:", e.message || e);
        process.exit(1);
    }
}

testLangChainHighway();
