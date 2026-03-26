import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });
    try {
        console.log("Attempting to list models...");
        // The new SDK might have a different way to list models, or it might not be exposed easily.
        // Let's try a very basic fetch to the models endpoint.
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
        const data = await res.json();
        console.log("Models Available:", JSON.stringify(data, null, 2));
    } catch (e: any) {
        console.log("Listing failed:", e.message);
    }
}

listModels();
