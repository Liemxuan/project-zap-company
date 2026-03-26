import "dotenv/config";
import OpenAI from "openai";
import { type GatewayTier, getGatewayConfig } from "../gateway.js";

const apiKey = process.env["OPENROUTER_API_KEY"];
if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://github.com/zap-claw",
        "X-Title": "Zap Claw Load Tester",
    },
});

async function measureTier(tier: GatewayTier, iterations = 3) {
    console.log(`\n===========================================`);
    console.log(`=== Testing Tier: ${tier.toUpperCase()} ===`);
    const payload = getGatewayConfig(tier);
    console.log(`=== Config:`, JSON.stringify(payload));
    console.log(`===========================================`);

    let totalLatency = 0;

    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        const requestPayload: any = {
            model: payload.model,
            messages: [{ role: "user", content: "Reply with the single word: PING" }],
            max_tokens: 10
        };

        if (payload.models) requestPayload.models = payload.models;
        if (payload.provider) requestPayload.provider = payload.provider;
        if (payload.route) requestPayload.route = payload.route;

        try {
            const response = await client.chat.completions.create(requestPayload);
            const latency = Date.now() - start;
            totalLatency += latency;
            // OpenRouter extends the response choice with an optional `model` reflecting the actual provider used
            console.log(`  [Iter ${i + 1}] Latency: ${latency}ms | Model Served: ${response.model}`);
        } catch (err: any) {
            console.error(`  [Iter ${i + 1}] ❌ Error: ${err.message}`);
        }
    }

    console.log(`--> Avg Latency for ${tier}: ${(totalLatency / iterations).toFixed(0)}ms`);
}

async function runTests() {
    console.log("🚀 Starting Gateway Arbitrage Load Test...");
    await measureTier("tier_p0_fast");
    await measureTier("tier_p0_fast");
    await measureTier("tier_p3_heavy");
    await measureTier("tier_p3_heavy");
    console.log("\n✅ Arbitrage test complete.");
}

runTests().catch(console.error);
