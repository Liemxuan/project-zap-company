import { MongoClient, ObjectId } from "mongodb";
import { executeSerializedLane } from "../runtime/serialized_lane.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

export async function processDeadLetterQueue() {
    console.log(`[DLQ Worker] ♻️ Waking up... Checking for pending Dead Letters.`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const dlqCol = db.collection("SYS_OS_dead_letters");

        const pendingJobs = await dlqCol.find({ status: "PENDING" }).toArray();
        if (pendingJobs.length === 0) {
            console.log(`[DLQ Worker] ✅ No pending jobs in the queue.`);
            return;
        }

        console.log(`[DLQ Worker] 🚨 Found ${pendingJobs.length} stranded payloads. Attempting recovery...`);

        for (const job of pendingJobs) {
            try {
                const usersCol = db.collection(`SYS_OS_users`);
                const userProfile = await usersCol.findOne({ name: job.senderIdentifier, tenantId: job.tenantId });

                if (!userProfile) {
                    console.error(`[DLQ Worker] ❌ Orphaned Job ${job._id}: Could not find user ${job.senderIdentifier}`);
                    await dlqCol.updateOne({ _id: job._id }, { $set: { status: "FAILED", error: "User Profile Not Found" } });
                    continue;
                }

                // Determine assignedTier if they forced an override
                let assignedTier = 2;
                if (userProfile.overrideModelTier) {
                    assignedTier = userProfile.overrideModelTier;
                }

                console.log(`[DLQ Worker] 🔄 Re-processing payload for ${job.senderIdentifier}...`);

                // BLAST-012 TRT Injection (SOP-010)
                let trtPayload = job.payload;
                if (job.lastError || job.error) {
                    const errorReason = job.lastError || job.error;
                    trtPayload = `\n\n[TRT SYSTEM INJECTION]\nThis is a complex problem. Oh the reference solution has one reasoning flaw! I will solve it from scratch first and challenge the reference solution's assumptions against this constraint:\nERROR: ${errorReason}\nEnsure this failure state does not repeat.\n\n[ORIGINAL PAYLOAD]\n${job.payload}`;
                    console.log(`[DLQ Worker] 🧠 Injected TRT Hindsight context for ${job._id}`);
                }

                // executeSerializedLane requires userProfile, tenantId, senderIdentifier, payload, assignedTier
                const response = await executeSerializedLane(userProfile, job.tenantId, job.senderIdentifier, trtPayload, assignedTier);

                console.log(`[DLQ Worker] ✅ Successfully recovered job ${job._id}`);
                await dlqCol.updateOne({ _id: job._id }, { $set: { status: "RECOVERED", recoveredAt: new Date() } });

            } catch (err: any) {
                console.error(`[DLQ Worker] ❌ Failed to recover job ${job._id}:`, err.message);
                await dlqCol.updateOne({ _id: job._id }, { $set: { retryCount: (job.retryCount || 0) + 1, lastError: err.message } });
            }
        }
    } catch (error) {
        console.error(`[DLQ Worker] ❌ Internal Worker Error:`, error);
    } finally {
        await client.close();
        console.log(`[DLQ Worker] 💤 Worker going back to sleep.`);
    }
}

// Support for running directly via CRON
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    processDeadLetterQueue();
}
