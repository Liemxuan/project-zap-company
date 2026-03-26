
import { PrismaClient } from '@prisma/client';
import { omniQueue, triageJob, getQueueCollection } from '../runtime/engine/omni_queue.js';
import { OmniPayload, LLMConfig } from '../runtime/engine/omni_router.js';
import { MongoClient } from 'mongodb';

const prisma = new PrismaClient();
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function runAlphaBeta() {
    console.log("🚀 [ZAP-CSO] Alpha/Beta Swarm Deployment (Spike x Jerry)");

    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const tenantId = "ZVN";
    const queueCol = db.collection(getQueueCollection(tenantId));

    // Clear ghost items
    await queueCol.deleteMany({ status: "WAITING_APPROVAL" });

    const ticketId = `ZAP-ALPHABETA-${Date.now()}`;
    await prisma.jobTicket.create({
        data: {
            ticketId,
            level: 'L7',
            scope: 'Concurrent MASP Refactoring and Audit',
            manager: 'CSO (Antigravity)',
            status: 'IN_PROGRESS',
            targetBranch: 'main'
        }
    });

    const pendingTickets = await prisma.extractionTicket.findMany({
        where: { status: "DOM_RIPPED" },
        take: 2 // Starting with a test batch of 2 pages (Alpha/Beta pilot)
    });

    console.log(`📡 Dispatching Alpha/Beta teams to ${pendingTickets.length} pages...`);

    await omniQueue.connect(tenantId);

    const config: LLMConfig = {
        apiKey: "system_internal",
        defaultModel: "google/gemini-3.1-pro-preview"
    };

    /**
     * MASP Protocol Injection
     */
    const maspProtocol = `
## MASP (Metro Alignment & Standardization Protocol)
1. **BASELINE**: px-12 (48px) for all layout containers.
2. **INDENT**: pl-6 (24px) for content stacks inside headers.
3. **BORDER**: Standard 1px border-b only.
4. **COLOR**: Match #576500 Seed Identity.
5. **TYPOGRAPHY**: Headers => activeFont/activeTransform. Detailed Pills => bg-primary text-on-primary.
    `;

    for (const ticket of pendingTickets) {
        // --- ALPHA JOB (SPIKE) ---
        const alphaTask = `
**Alpha Task (Spike):** Refactor \`${ticket.urlPath}\`.
Apply MASP standards precisely.
${maspProtocol}
        `;

        const alphaPayload: OmniPayload = {
            systemPrompt: "You are Spike (Builder). Implement MASP standards. Output only the diff.",
            messages: [{ role: "user", content: alphaTask }],
            theme: "C_PRECISION",
            intent: "CODING"
        };

        const alphaJobId = await omniQueue.enqueue(
            triageJob(alphaPayload),
            2,
            tenantId,
            alphaPayload,
            config,
            "CLI",
            "Antigravity (CSO)"
        );
        await omniQueue.approveJob(alphaJobId, tenantId);

        // --- BETA JOB (JERRY) ---
        const betaTask = `
**Beta Task (Jerry):** Audit Refactoring of \`${ticket.urlPath}\`.
Verify MASP compliance (72px baseline, 1px lines, #576500 color).
Report any deviations.
        `;

        const betaPayload: OmniPayload = {
            systemPrompt: "You are Jerry (Watchdog). Audit Spike's work against MASP. Pass or Fail with technical comments.",
            messages: [{ role: "user", content: betaTask }],
            theme: "C_PRECISION",
            intent: "REASONING"
        };

        const betaJobId = await omniQueue.enqueue(
            triageJob(betaPayload),
            2,
            tenantId,
            betaPayload,
            config,
            "CLI",
            "Antigravity (CSO)"
        );
        await omniQueue.approveJob(betaJobId, tenantId);

        console.log(`🔗 Paired [Alpha: ${alphaJobId}] <-> [Beta: ${betaJobId}] for ${ticket.urlPath}`);
    }

    console.log("\n🛸 Alpha/Beta pairing complete. Swarm operational.");

    await prisma.$disconnect();
    await mongoClient.close();
    process.exit(0);
}

runAlphaBeta().catch(console.error);
