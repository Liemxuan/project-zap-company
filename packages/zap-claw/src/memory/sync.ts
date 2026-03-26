import "dotenv/config";
import { prisma } from "../db/client.js";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";

export async function runMongoSync() {
    console.log("🔄 [sync] Waking up. Scanning for unsynced MemoryFacts...");

    const unsyncedFacts = await prisma.memoryFact.findMany({
        where: { synced: false },
        orderBy: { createdAt: 'asc' },
    });

    if (unsyncedFacts.length === 0) {
        console.log("💤 [sync] No new facts to sync. Going back to sleep.");
        return;
    }

    console.log(`[sync] Found ${unsyncedFacts.length} unsynced facts. Connecting to MongoDB...`);

    let client: MongoClient | null = null;
    let syncedCount = 0;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection("merchant_memory");

        const { vectorStore } = await import("./vector_store.js");

        for (const fact of unsyncedFacts) {
            // Generate embedding for semantic search
            const embedding = await vectorStore.getEmbedding(fact.fact);

            // Push fact to Mongo global storage with embedding
            await collection.insertOne({
                _id: fact.id as any,
                merchantId: fact.merchantId || "UNKNOWN_MERCHANT",
                agentId: fact.agentId || "AGENT_SELF",
                factType: fact.factType,
                fact: fact.fact,
                accountType: fact.accountType, // Track PERSONAL vs BUSINESS
                embedding: embedding, // Crucial for Titan Memory Engine
                sourceId: fact.sourceId,
                createdAt: fact.createdAt,
                syncedAt: new Date()
            });

            // Mark as safely exported locally
            await prisma.memoryFact.update({
                where: { id: fact.id },
                data: { synced: true }
            });
            syncedCount++;
            console.log(`[sync] ✅ Synced local fact [${fact.factType}] to MongoDB Merchant Document.`);
        }
    } catch (error: any) {
        console.error("[sync] ❌ Error syncing to MongoDB (Ensure MONGODB_URI is set or local mongo is running):", error.message);
    } finally {
        if (client) {
            await client.close();
        }
    }

    console.log(`🔄 [sync] Sync cycle complete. Synchronized ${syncedCount} memories to the global state.`);
}

// Allow running standalone
if (import.meta.url && process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    runMongoSync().then(() => process.exit(0));
}
