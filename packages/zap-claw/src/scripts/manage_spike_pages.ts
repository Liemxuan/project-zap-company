import { PrismaClient } from '@prisma/client';
import { omniQueue, triageJob, getQueueCollection } from '../runtime/engine/omni_queue.js';
import { OmniPayload, LLMConfig } from '../runtime/engine/omni_router.js';
import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';

const prisma = new PrismaClient();
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function run() {
    console.log("🚀 [ZAP-CSO] Re-evaluating. Updating Spike's assignments with exact logic from migration_tracking.db");

    // Clear previous pending jobs that were incorrectly generic
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const tenantId = "ZVN";
    const queueCol = db.collection(getQueueCollection(tenantId));

    const deleteRes = await queueCol.deleteMany({ status: "WAITING_APPROVAL" });
    console.log(`🧹 Flushed ${deleteRes.deletedCount} generic stalled queue items.`);

    const ticketId = `ZAP-SPIKE-PAGES-${Date.now()}`;
    const ticket = await prisma.jobTicket.create({
        data: {
            ticketId: ticketId,
            level: 'L7',
            scope: 'Targeted Fixes (Fonts, Colors, Spacings) exactly per Page Audit',
            manager: 'Spike',
            status: 'IN_PROGRESS',
            targetBranch: 'main'
        }
    });

    console.log(`✅ [ZAP-CSO] Governance Ticket Registered: ${ticket.ticketId}`);

    // Read the list of pages dumped from CSV
    const rawPages = fs.readFileSync("/tmp/pages.csv", "utf8").trim().split("\n").slice(1);

    console.log(`📌 Re-Queuing ${rawPages.length} precise tasks to Spike via OmniRouter/Queue...`);

    await omniQueue.connect(tenantId);

    const config: LLMConfig = {
        apiKey: "system_internal",
        defaultModel: "google/gemini-3.1-pro-preview"
    };

    let i = 0;
    for (const line of rawPages) {
        if (!line.trim()) continue;
        const [path, fonts, colors, spacing] = line.split(",");

        i++;

        let instructions = "";
        let missingDeps = [];
        if (fonts === "0") {
            instructions += "\n- Fonts: Extract Metronic font tokens, inject M3 generic typography mapping.";
            missingDeps.push("Fonts");
        }
        if (colors === "0") {
            instructions += "\n- Colors: Update all generic Metro color tokens to utilize specific M3 variables (or ZAP standard mappings).";
            missingDeps.push("Colors");
        }
        if (spacing === "0") {
            instructions += "\n- Spacing/Elevation: Fix layout gap, padding, and elevation logic to ensure proper containment compliance.";
            missingDeps.push("Spacing/Elevation");
        }

        const taskContent = `
**Ticket:** ${ticketId}
**Task:** Targeted Refactoring of Page \`${path}\`.
**Diagnosed Required Actions:**${instructions}

**CRITICAL Execution Policy (Spike Protocol):**
1. Read the page content using standard tools.
2. Only apply structural UI upgrades targeting specifically: ${missingDeps.join(", ")}. Do not alter correct or unrelated code (like business logic).
3. If the code is already compliant, mark it explicitly.
4. Output the full structural diff directly for review or file updates.
        `;

        const payload: OmniPayload = {
            systemPrompt: "You are Spike from the CLAW team. Execute the designated structural refactoring precisely at the molecular/atomic level per the prompt diagnosis.",
            messages: [{ role: "user" as const, content: taskContent }],
            theme: "C_PRECISION",
            intent: "CODING"
        };

        const queueName = triageJob(payload);
        const priority = 2; // Medium/high priority

        // Queue it
        const jobId = await omniQueue.enqueue(
            queueName,
            priority,
            tenantId,
            payload,
            config,
            undefined,
            "Spike"
        );

        // Auto approve
        await omniQueue.approveJob(jobId, tenantId);

        console.log(`✅ [${i}/${rawPages.length}] Dispatched & Auto-Approved ${path} -> Job ID: ${jobId}`);
    }

    console.log(`\n🎉 [ZAP-CSO] All specialized tasks dispatched to Spike. Swarm is working async.`);

    await prisma.$disconnect();
    await mongoClient.close();
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
