import OpenAI from "openai";
import "dotenv/config";

const googleFallbackClient = new OpenAI({
    apiKey: process.env["GOOGLE_API_KEY"] || "",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
    try {
        const res = await googleFallbackClient.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{ role: "user", content: "hello" }],
        });
        console.log("SUCCESS:", res);
    } catch (err: any) {
        console.error("ERROR:", err.message);
        if (err.response) {
            console.error("DATA:", err.response.data);
        }
    }
}
main();
