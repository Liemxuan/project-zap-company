import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function deepSearch() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const dbs = ["olympus", "zap-claw"];

        for (const dbName of dbs) {
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log(`\n🔍 Searching DB: ${dbName}`);

            for (const colInfo of collections) {
                const col = db.collection(colInfo.name);
                // Search for "agent:" in any string field
                const results = await col.find({
                    $or: [
                        { sessionId: { $regex: "agent:" } },
                        { interactionId: { $regex: "agent:" } },
                        { content: { $regex: "agent:" } },
                        { fact: { $regex: "agent:" } }
                    ]
                }).limit(5).toArray();

                if (results.length > 0) {
                    console.log(`✅ Found in ${colInfo.name}:`, JSON.stringify(results, null, 2));
                }
            }
        }
    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await client.close();
    }
}

deepSearch();
