import "dotenv/config";
import { vectorStore } from "../memory/vector_store.js";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";
const TEST_USER_ID = "999999";

async function verifyTME() {
    console.log("🧪 [verify-tme] Starting semantic recall verification...");

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection("merchant_memory");

        const testFact = "The user's favorite programming language is TypeScript, especially for its type safety.";
        const testEmbedding = await vectorStore.getEmbedding(testFact);

        // 1. Setup: Insert test fact
        console.log("[verify-tme] Inserting test fact with embedding...");
        await collection.deleteOne({ merchantId: TEST_USER_ID }); // Cleanup
        await collection.insertOne({
            merchantId: TEST_USER_ID,
            factType: "PREFERENCE",
            fact: testFact,
            embedding: testEmbedding,
            createdAt: new Date()
        });

        // 2. Test: Semantic Search
        const query = "What language does the user prefer for development?";
        console.log(`[verify-tme] Searching for query: "${query}"`);

        const results = await vectorStore.search(query, TEST_USER_ID, "USER", 1);

        if (results.length > 0 && results[0].fact.includes("TypeScript")) {
            console.log("✅ [verify-tme] SUCCESS: Semantic recall correctly identified the preference!");
            console.log(`[verify-tme] Recall Score: ${results[0].score}`);
            console.log(`[verify-tme] Recall Content: ${results[0].fact}`);
        } else {
            console.error("❌ [verify-tme] FAILURE: Semantic recall could not find the relevant fact.");
            console.log("[verify-tme] Results:", results);
        }

    } catch (error: any) {
        console.error("❌ [verify-tme] ERROR:", error.message);
    } finally {
        await client.close();
        await vectorStore.close();
    }
}

verifyTME().catch(console.error);
