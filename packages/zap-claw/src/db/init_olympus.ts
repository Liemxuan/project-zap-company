import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus"; // The new Master Database for the multi-tenant architecture

async function initializeOlympus() {
    console.log(`[Olympus Init] Connecting to Atlas Cluster...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        console.log(`[Olympus Init] Connection Successful!`);

        const db = client.db(DB_NAME);

        // Define the ISO collections for ZAP Vietnam (Tenant: ZVN)
        const collectionsToSpawn = [
            "ZVN_SYS_OS_users",
            "ZVN_SYS_EMP_payroll",
            "ZVN_SYS_POS_sales",
            "ZVN_SYS_CLAW_merchant_memory",
            "ZVN_SYS_OS_job_queue", // Master multi-tier queue for agent tasks
            "SYS_OS_global_models",
            "SYS_OS_dead_letters"
        ];

        console.log(`[Olympus Init] Establishing ISO standard namespaces in DB: ${DB_NAME}...`);

        for (const colName of collectionsToSpawn) {
            const collection = db.collection(colName);
            const existingCount = await collection.countDocuments();

            if (existingCount === 0) {
                if (colName === "SYS_OS_global_models") {
                    await collection.insertMany([
                        {
                            model_id: "anthropic/claude-3-5-sonnet",
                            provider: "openrouter",
                            tier: 1,
                            capabilities: ["reasoning", "coding", "omni-tooling"],
                            fallback_chain: ["google/gemini-2.5-pro", "openai/gpt-4o"]
                        },
                        {
                            model_id: "google/gemini-2.5-pro",
                            provider: "openrouter",
                            tier: 2,
                            capabilities: ["reasoning", "omni-tooling"],
                            fallback_chain: ["anthropic/claude-3-5-sonnet", "openai/gpt-4o"]
                        },
                        {
                            model_id: "google/gemini-2.5-flash",
                            provider: "openrouter",
                            tier: 3,
                            capabilities: ["fast-chat", "low-logic", "json-extraction"],
                            fallback_chain: ["openai/gpt-4o-mini", "anthropic/claude-3-haiku"]
                        }
                    ]);
                    console.log(`  ✅ Seeded Registry: ${colName}`);
                } else {
                    await collection.insertOne({
                        _manifest: "INIT",
                        tenantId: "ZVN",
                        systemLog: `Initialized ISO structure for ${colName}`,
                        createdAt: new Date()
                    });
                    console.log(`  ✅ Constructed Collection: ${colName}`);
                }
            } else {
                console.log(`  ⚡ Collection ${colName} already exists. Skipping.`);
            }
        }

        console.log(`\n[Olympus Init] SUCCESS. You can now open MongoDB Compass, refresh the databases, and look for the 'olympus' database!`);
    } catch (error) {
        console.error(`[Olympus Init] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`[Olympus Init] Connection closed.`);
    }
}

initializeOlympus();
