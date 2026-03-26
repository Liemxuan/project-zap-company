import { MongoClient } from "mongodb";
import { redis, SyncQueuePayload } from '../lib/redis.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";
const QUEUE_NAME = "queue:sync_events";

let isRunning = false;

export async function startSyncWorker() {
    if (isRunning) return;
    isRunning = true;
    console.log(`[Sync Worker] 🚀 Started listening to Redis key: ${QUEUE_NAME}`);

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const syncCol = db.collection(`SYS_OS_sync_events`);

        while (isRunning) {
            try {
                // Block for up to 5 seconds to wait for a payload, then loop
                // This prevents hard-spinning the CPU
                const result = await redis.blpop(QUEUE_NAME, 5);

                if (!result) {
                    continue; // Timeout reached, checking if still running
                }

                const [_, item] = result;
                const parsed: SyncQueuePayload = JSON.parse(item);

                if (parsed && Array.isArray(parsed.data)) {
                    // Map the raw mutations into server-validated documents
                    const eventsToInsert = parsed.data.map((m: any) => ({
                        ...m,
                        deviceId: parsed.clientId,
                        channel: parsed.channel,
                        serverTimestamp: parsed.timestamp
                    }));

                    if (eventsToInsert.length > 0) {
                        await syncCol.insertMany(eventsToInsert);
                        console.log(`[Sync Worker] ✅ Committed ${eventsToInsert.length} batched events from [${parsed.channel}] to MongoDB.`);
                    }
                }
            } catch (err) {
                console.error("[Sync Worker] Error processing payload:", err);
                // Back-off sleep to prevent error loops
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    } catch (e) {
        console.error("[Sync Worker] Fatal Initialization Error:", e);
    } finally {
        await client.close();
        isRunning = false;
        console.log(`[Sync Worker] 🛑 Stopped.`);
    }
}
