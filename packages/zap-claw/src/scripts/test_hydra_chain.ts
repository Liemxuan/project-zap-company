import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

async function getLiveInfraKeys(): Promise<Record<string, string>> {
    const client = new MongoClient(process.env.MONGODB_URI || "");
    try {
        await client.connect();
        const db = client.db("olympus");
        const keys = await db.collection(`SYS_OS_infra_keys`).find({}).toArray();
        return Object.fromEntries(keys.map(k => [k.name, k.apiKey]));
    } catch (e) {
        console.error("Failed to fetch keys:", e);
        return {};
    } finally {
        await client.close();
    }
}

async function testKey(name: string, key: string, modelId: string) {
    console.log(`\n--- Testing ${name} with ${modelId} ---`);
    if (!key || key.startsWith("projects/")) {
        console.warn(`⚠️ Skipping ${name}: Key is missing or invalid format (${key})`);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: key });
        const start = Date.now();
        // Trying with full models/ prefix for GenAI SDK safety
        const response = await ai.models.generateContent({
            model: `models/${modelId}`,
            contents: [{ role: "user", parts: [{ text: "ping" }] }]
        });
        console.log(`✅ ${name} SUCCESS (${Date.now() - start}ms):`, (response as any).candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (e: any) {
        console.error(`❌ ${name} FAILED:`, e.message);
    }
}

async function testOpenRouter(name: string, key: string, modelId: string) {
    console.log(`\n--- Testing OpenRouter ${name} with ${modelId} ---`);
    if (!key) {
        console.warn(`⚠️ Skipping OpenRouter ${name}: Key is missing`);
        return;
    }

    try {
        const client = new OpenAI({
            apiKey: key,
            baseURL: "https://openrouter.ai/api/v1",
        });
        const start = Date.now();
        const res = await client.chat.completions.create({
            model: modelId,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5
        });
        console.log(`✅ ${name} SUCCESS (${Date.now() - start}ms):`, res.choices[0]?.message.content);
    } catch (e: any) {
        console.error(`❌ ${name} FAILED:`, e.message);
    }
}

async function runTests() {
    console.log("🚀 Starting Hydra Chain Connectivity Test (v4 - Dual Account Check)...");
    const keys = await getLiveInfraKeys();

    // Testing with Gemini 3 as confirmed by user
    const g3Flash = "gemini-3-flash-preview";
    const g3Pro = "gemini-3.1-pro-preview";

    // 1. Test Precision Gateway (Ultra Account)
    await testKey("GOOGLE_ULTRA (PRECISION_GATEWAY)", keys["PRECISION_GATEWAY"] || "", g3Pro);

    // 2. Test Code Workforce (Pro Account)
    await testKey("GOOGLE_PRO (CODE_WORKFORCE)", keys["CODE_WORKFORCE"] || "", g3Flash);

    // 3. Test OpenRouter Fallback
    const orKey = process.env.OPENROUTER_API_KEY;
    if (orKey) {
        await testOpenRouter("OR_G3_FLASH", orKey, `google/${g3Flash}`);
    }
}

runTests();
