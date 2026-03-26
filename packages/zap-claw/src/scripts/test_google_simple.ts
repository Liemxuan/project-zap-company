import OpenAI from "openai";

const apiKey = process.env["GOOGLE_API_KEY"];
if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set");
    process.exit(1);
}

console.log("API Key starts with:", apiKey.substring(0, 5));

const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

async function main() {
    try {
        console.log("Testing gemini-1.5-flash...");
        const completion = await client.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log("Success:", completion.choices[0]?.message?.content);
    } catch (error: any) {
        console.error("Error:", error);
    }
}

main();
