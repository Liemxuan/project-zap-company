import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function list() {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });
    console.log("Checking Gemini models...");

    const modelsToCheck = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-2.0-pro-exp"];

    for (const m of modelsToCheck) {
        try {
            const res = await ai.models.generateContent({
                model: m,
                contents: [{ role: "user", parts: [{ text: "hi" }] }]
            });
            console.log(`✅ SUCCESS: ${m}`);
        } catch (e: any) {
            console.log(`❌ FAILED: ${m} -> ${e.message}`);
        }
    }
}

list();
