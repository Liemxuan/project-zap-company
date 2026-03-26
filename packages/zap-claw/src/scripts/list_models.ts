import "dotenv/config";
import OpenAI from "openai";

async function listModels() {
    const googleClient = new OpenAI({
        apiKey: process.env["GOOGLE_API_KEY"] || "",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    });

    try {
        const models = await googleClient.models.list();
        console.log("Available models:");
        for (const m of models.data) {
            console.log(`- ${m.id}`);
        }
    } catch (e: any) {
        console.error("Error listing models:", e.message);
    }
}

listModels().catch(console.error);
