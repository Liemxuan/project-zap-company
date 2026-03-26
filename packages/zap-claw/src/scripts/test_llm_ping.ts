import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import "dotenv/config";

const googleKey = process.env.GOOGLE_API_KEY;
const orKey = process.env.OPENROUTER_API_KEY;

async function testGoogle() {
    console.log("Testing Google Native (GenAI SDK)...");
    if (!googleKey) {
        console.warn("GOOGLE_API_KEY not found in ENV.");
        return;
    }
    const ai = new GoogleGenAI({ apiKey: googleKey });

    try {
        const start = Date.now();
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "ping"
        });
        console.log(`✅ Google Success in ${Date.now() - start}ms:`, response.text);
    } catch (e: any) {
        console.error("❌ Google Failed:", e.message);
    }
}

async function testOpenRouter() {
    console.log("\nTesting OpenRouter...");
    if (!orKey) {
        console.warn("OPENROUTER_API_KEY not found in ENV.");
        return;
    }
    const client = new OpenAI({
        apiKey: orKey,
        baseURL: "https://openrouter.ai/api/v1",
    });
    try {
        const start = Date.now();
        const res = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5
        });
        console.log(`✅ OpenRouter Success in ${Date.now() - start}ms:`, res.choices[0]?.message?.content);
    } catch (e: any) {
        console.error("❌ OpenRouter Failed:", e.message);
    }
}

async function runTests() {
    await testGoogle();
    await testOpenRouter();
}

runTests();
