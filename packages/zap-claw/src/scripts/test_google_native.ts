import { GoogleGenAI } from "@google/genai";

const apiKey = process.env["GOOGLE_API_KEY"];
if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set");
    process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: apiKey });

async function main() {
    try {
        console.log("Testing gemini-1.5-flash with native SDK...");
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "Hello"
        });
        console.log("Success:", result.text);
    } catch (error: any) {
        console.error("Error:", error);
    }
}

main();
