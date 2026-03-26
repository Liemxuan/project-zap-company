import "dotenv/config";
import OpenAI from "openai";
import { type GatewayTier, getGatewayConfig } from "../gateway.js";

// Initialize OpenRouter Aggregator Client
const openRouterKey = process.env["OPENROUTER_API_KEY"];
if (!openRouterKey) throw new Error("OPENROUTER_API_KEY is not set");

const orClient = new OpenAI({
    apiKey: openRouterKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://github.com/zap-claw",
        "X-Title": "Zap Claw Load Tester",
    },
});

// Initialize Native OEM Clients (If available)
const googleKey = process.env["GOOGLE_API_KEY"];
const anthropicKey = process.env["ANTHROPIC_API_KEY"];

const googleClient = googleKey ? new OpenAI({
    apiKey: googleKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai", // Gemini OpenAI Compatibility Endpoint
}) : null;

const anthropicClient = anthropicKey ? new OpenAI({
    apiKey: anthropicKey,
    baseURL: "https://api.anthropic.com/v1", // Anthropic doesn't have a native OpenAI endpoint, will need anthropic SDK or bridge, skipping direct call for now if bridging is complex
}) : null;


async function fireRequest(client: OpenAI, tier: GatewayTier, id: string): Promise<number> {
    const payload = getGatewayConfig(tier);
    const start = Date.now();

    const requestPayload: any = {
        model: payload.model,
        messages: [{ role: "user", content: `Stress Test Target: ${id}. Reply with a single word.` }],
        max_tokens: 10
    };

    if (payload.models) requestPayload.models = payload.models;
    if (payload.provider) requestPayload.provider = payload.provider;
    if (payload.route) requestPayload.route = payload.route;

    try {
        await client.chat.completions.create(requestPayload);
        return Date.now() - start;
    } catch (err: any) {
        console.error(`[${id}] ❌ Error: ${err.message}`);
        return -1; // Indicate failure
    }
}

async function runConcurrencyTest() {
    console.log("\n===========================================");
    console.log("=== ST-04: Concurrency Deadlock Test ===");
    console.log("===========================================");
    console.log("Firing 50 simultaneous Tier 1 requests...");

    const promises: Promise<number>[] = [];
    for (let i = 0; i < 50; i++) {
        promises.push(fireRequest(orClient, "tier_p0_fast", `Conn-${i}`));
    }

    const results = await Promise.all(promises);
    const successes = results.filter(r => r > 0);
    const failures = results.filter(r => r === -1);

    console.log(`\nResults: ${successes.length} Succeeded | ${failures.length} Failed`);
    if (successes.length > 0) {
        const avg = successes.reduce((a, b) => a + b, 0) / successes.length;
        console.log(`Average Concurrent Latency: ${avg.toFixed(0)}ms`);
    }
}

async function runOemVsAggregatorTest() {
    console.log("\n===========================================");
    console.log("=== ST-02: OEM vs Aggregator (Tier 1) ===");
    console.log("===========================================");

    // Test OpenRouter
    console.log("Testing Aggregator (OpenRouter -> Gemini Flash)...");
    const orLatencies = [];
    for (let i = 0; i < 3; i++) {
        const lat = await fireRequest(orClient, "tier_p0_fast", `OR-Iter-${i}`);
        if (lat > 0) orLatencies.push(lat);
    }
    const orAvg = orLatencies.length ? (orLatencies.reduce((a, b) => a + b, 0) / orLatencies.length) : 0;

    console.log(`-> OpenRouter Avg: ${orAvg.toFixed(0)}ms\n`);

    // Test Google Native
    if (googleClient) {
        console.log("Testing Native OEM (Google Studio -> Gemini Flash)...");
        const goLatencies = [];
        for (let i = 0; i < 3; i++) {
            const start = Date.now();
            try {
                await googleClient.chat.completions.create({
                    model: "gemini-2.5-flash",
                    messages: [{ role: "user", content: `Stress Test OEM. Reply with a single word.` }],
                    max_tokens: 10
                });
                goLatencies.push(Date.now() - start);
            } catch (err: any) {
                console.error(`[OEM] ❌ Error: ${err.message}`);
            }
        }
        const goAvg = goLatencies.length ? (goLatencies.reduce((a, b) => a + b, 0) / goLatencies.length) : 0;
        console.log(`-> Google Native Avg: ${goAvg.toFixed(0)}ms`);

        console.log(`\n** Arbitrage Delta: ${Math.abs(orAvg - goAvg).toFixed(0)}ms difference.`);
    } else {
        console.log("⚠️ GOOGLE_API_KEY not found in .env. Skipping Native benchmark.");
    }
}

async function runStressMatrix() {
    console.log("🚀 Starting Prolonged Gateway Stress Matrix...");

    await runOemVsAggregatorTest();
    await runConcurrencyTest();

    console.log("\n✅ Stress Matrix execution complete.");
}

runStressMatrix().catch(console.error);
