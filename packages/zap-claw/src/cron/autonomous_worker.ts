import { MongoClient } from "mongodb";
import { executeAutonomousLane } from "../runtime/autonomous_lane.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

async function runAutonomousWorker(tenantId: string) {
    console.log(`======================================================`);
    console.log(`[Cron Worker] Waking up to check queue for ${tenantId}...`);
    console.log(`======================================================\n`);

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        const tasksCol = db.collection(`SYS_OS_tasks`);
        const usersCol = db.collection(`SYS_OS_users`);

        // Look for any autonomous agents in this tenant
        const autonomousAgents = await usersCol.find({ agentType: "AUTONOMOUS", tenantId }).toArray();
        if (autonomousAgents.length === 0) {
            console.log(`[Cron Worker] No AUTONOMOUS agents found in ${tenantId}. Sleeping.`);
            return;
        }

        // For each autonomous agent, see if they have pending tasks
        for (const agent of autonomousAgents) {
            console.log(`[Cron Worker] Checking queue for Agent: ${agent.assignedAgentId}...`);

            // In a real system, we'd lock the row or update to PROCESSING. For this mock, we just grab one PENDING.
            const pendingTask = await tasksCol.findOneAndUpdate(
                { assignedTo: agent.assignedAgentId, status: "PENDING", tenantId },
                { $set: { status: "PROCESSING" } },
                { returnDocument: 'after' }
            );

            if (pendingTask) {
                console.log(`[Cron Worker] Found task! ID: ${pendingTask._id} -> Forwarding to Autonomous Lane.`);
                // Send to background lane (awaiting here for the script demo, but in real life it might be fire-and-forget)
                await executeAutonomousLane(agent, tenantId, pendingTask);
            } else {
                console.log(`[Cron Worker] No pending tasks for ${agent.assignedAgentId}.`);
            }
        }

    } catch (error) {
        console.error(`[Cron Worker ERROR]`, error);
    } finally {
        await client.close();
        console.log(`\n[Cron Worker] Going back to sleep.\n`);
    }
}

// For testing purposes, we define a quick seeder if there are no tasks
async function seedDummyTaskIfNeeded() {
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const tasksCol = db.collection(`SYS_OS_tasks`);

        const existing = await tasksCol.findOne({ assignedTo: "AGNT-PHO-RALPH", tenantId: "PHO24" });
        if (!existing) {
            console.log(`[Setup] Seeding a test task for Ralph before cron runs...`);
            await tasksCol.insertOne({
                title: "Competitor Analysis Report: Phở 2000",
                description: "Analyze the current online marketing sentiment for Phở 2000 and summarize three key weaknesses we can target in our upcoming ad campaign. Your supervisor is Mike, write the report directly to him.",
                assignedTo: "AGNT-PHO-RALPH",
                status: "PENDING",
                createdAt: new Date(),
                tenantId: "PHO24"
            });
        } else if (existing.status === "COMPLETED") {
            // Reset it for repeatable testing
            console.log(`[Setup] Resetting Ralph's completed task to PENDING for testing...`);
            await tasksCol.updateOne(
                { _id: existing._id },
                { $set: { status: "PENDING", result: null } }
            );
        }
    } finally {
        await client.close();
    }
}

async function main() {
    await seedDummyTaskIfNeeded();
    await runAutonomousWorker("PHO24");
}

main();
