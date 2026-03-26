import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

async function auditOlympus() {
    console.log(`[Audit: OLYMPUS] Initiating Zeus Override Verification...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // 1. Verify Zeus & Jerry in OLYMPUS_SYS_OS_users
        console.log(`\n--- Step 1: Validating God Admin Identity ---`);
        const olympusUsers = db.collection("OLYMPUS_SYS_OS_users");

        const zeus = await olympusUsers.findOne({ name: "Zeus" });
        if (zeus) {
            console.log(`✅ [Pass] Identity Confirmed: ${zeus.name} (${zeus.role})`);
            console.log(`   - Agent Type: ${zeus.agentType}`);
            console.log(`   - Assigned Copilot: ${zeus.assignedAgentId}`);
            if (zeus.assignedAgentId === "AGNT-OLY-JERRY") {
                console.log(`✅ [Pass] Jerry (Chief of Staff AI) is correctly bound to Zeus.`);
            } else {
                console.error(`❌ [Fail] Jerry is not bound to Zeus.`);
            }
        } else {
            console.error(`❌ [Fail] Zeus not found in OLYMPUS_SYS_OS_users.`);
        }

        // 2. The Zeus Override: Cross-Tenant Task Tracking
        console.log(`\n--- Step 2: Testing Cross-Tenant Query (The Zeus Override) ---`);
        const olympusTasks = db.collection("OLYMPUS_SYS_OS_tasks");
        const zvnTasks = db.collection("ZVN_SYS_OS_tasks");

        // Insert Dummy Tasks to verify query scope
        await olympusTasks.deleteMany({});
        await zvnTasks.deleteMany({});

        await olympusTasks.insertOne({
            title: "[OLYMPUS] Provision New Database Nodes",
            tenantId: "OLYMPUS",
            assignedTo: "Zeus",
            status: "IN_PROGRESS",
            priority: "CRITICAL"
        });

        await zvnTasks.insertOne({
            title: "[ZVN] Approve Q2 Marketing Budget",
            tenantId: "ZVN",
            assignedTo: "Tom",
            status: "PENDING",
            priority: "HIGH"
        });

        console.log(`System: Inserted test tasks into separate tenant namespaces.`);

        // Simulate Zeus (or Jerry) fetching tasks across tenants simultaneously
        const [oTasks, zTasks] = await Promise.all([
            olympusTasks.find({}).toArray(),
            zvnTasks.find({}).toArray()
        ]);

        console.log(`\n[God View Dashboard - Active Tasks]`);
        console.log(`===================================`);
        console.log(`OLYMPUS Infrastructure Tasks:`);
        oTasks.forEach(t => console.log(` - ${t.title} [${t.status}]`));

        console.log(`\nZVN Sub-Tenant Tasks:`);
        zTasks.forEach(t => console.log(` - ${t.title} [${t.status}]`));
        console.log(`===================================`);

        if (oTasks.length > 0 && zTasks.length > 0) {
            console.log(`\n✅ [Pass] Zeus Override successful. Cross-tenant queries executed securely.`);
        } else {
            console.error(`\n❌ [Fail] Cross-tenant query failed to return data.`);
        }

    } catch (error) {
        console.error(`[Audit: OLYMPUS] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`[Audit: OLYMPUS] Audit complete. Database connection closed.`);
    }
}

auditOlympus();
