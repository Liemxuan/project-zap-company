import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

async function auditPho24() {
    console.log(`[Audit: PHO24] Initiating 3-Tier Agent Routing Verification...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const phoUsrs = db.collection("PHO24_SYS_OS_users");

        // 1. Verify Type B: Assisted (Dan & Mike)
        console.log(`\n--- Step 1: Validating Type B (Assisted) Mappings ---`);
        const dan = await phoUsrs.findOne({ name: "Dan" });
        const mike = await phoUsrs.findOne({ name: "Mike" });

        if (dan && dan.agentType === "ASSISTED" && dan.assignedAgentId === "AGNT-PHO-DAN") {
            console.log(`✅ [Pass] Dan (CEO) correctly mapped to Assisted Copilot.`);
        } else {
            console.error(`❌ [Fail] Dan's mapping is incorrect.`);
        }

        if (mike && mike.agentType === "ASSISTED" && mike.assignedAgentId === "AGNT-PHO-MIKE") {
            console.log(`✅ [Pass] Mike (Marketing Mgr) correctly mapped to Assisted Copilot.`);
        } else {
            console.error(`❌ [Fail] Mike's mapping is incorrect.`);
        }

        // 2. Verify Type C: Autonomous (Ralph)
        console.log(`\n--- Step 2: Validating Type C (Autonomous) Hierarchy ---`);
        const ralph = await phoUsrs.findOne({ name: "Ralph" });

        if (ralph) {
            console.log(`✅ [Pass] Found Autonomous Agent: ${ralph.name} (${ralph.role})`);
            if (ralph.agentType === "AUTONOMOUS" && ralph.linkedHuman === "mike@pho24.com") {
                console.log(`✅ [Pass] Ralph is correctly configured as an Autonomous Agent reporting to Mike.`);
            } else {
                console.error(`❌ [Fail] Ralph's autonomous or linkedHuman configuration is incorrect.`, { type: ralph.agentType, linkedHuman: ralph.linkedHuman });
            }
        } else {
            console.error(`❌ [Fail] Autonomous Agent 'Ralph' not found.`);
        }

        // 3. Verify Type A: None (Kevin & Lisa)
        console.log(`\n--- Step 3: Validating Type A (None) Constraints ---`);
        const kevin = await phoUsrs.findOne({ name: "Kevin" });
        const lisa = await phoUsrs.findOne({ name: "Lisa" });

        if (kevin && kevin.agentType === "NONE" && !kevin.assignedAgentId) {
            console.log(`✅ [Pass] Kevin (Junior Cook) correctly has NO agent assigned.`);
        } else {
            console.error(`❌ [Fail] Kevin's Type A mapping failed.`);
        }

        if (lisa && lisa.agentType === "NONE" && !lisa.assignedAgentId) {
            console.log(`✅ [Pass] Lisa (Cleaning Staff) correctly has NO agent assigned.`);
        } else {
            console.error(`❌ [Fail] Lisa's Type A mapping failed.`);
        }

    } catch (error) {
        console.error(`[Audit: PHO24] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`\n[Audit: PHO24] Audit complete. Database connection closed.`);
    }
}

auditPho24();
