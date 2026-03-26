import { MongoClient } from "mongodb";
import "dotenv/config";
import { executeSerializedLane } from "../runtime/serialized_lane.js";
import { ArbiterTheme } from "../runtime/engine/omni_router.js";

const MONGO_URI = process.env.MONGODB_URI || "";
const TENANT_ID = "CLAW_TEAM_ALPHA";

interface ClawAgent {
    userId: string;
    name: string;
    role: string;
    assignedAgentId: string;
    preferences: { arbiterTheme: ArbiterTheme };
    assignedTier: number;
}

async function main() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("olympus");

        console.log(`\n🚢 [ZAP] Spawning the "Claw Team" Agents for Tenant: ${TENANT_ID}...\n`);

        const team: ClawAgent[] = [
            { userId: "TOM_ZAP", name: "Tom", role: "The Architect", assignedAgentId: "ZAP_COMMANDER", preferences: { arbiterTheme: "C_PRECISION" }, assignedTier: 4 },
            { userId: "NGUYEN_DEV", name: "Nguyen", role: "Development Lead", assignedAgentId: "CLAW_CODER", preferences: { arbiterTheme: "B_PRODUCTIVITY" }, assignedTier: 3 },
            { userId: "GHOST_SCOUT", name: "Ghost", role: "Security & Research", assignedAgentId: "GHOST_SCOUT", preferences: { arbiterTheme: "C_PRECISION" }, assignedTier: 3 },
            { userId: "DEEP_ECON", name: "Deep", role: "Economic Analyst", assignedAgentId: "DEEPSEEK_PRO", preferences: { arbiterTheme: "A_ECONOMIC" }, assignedTier: 2 }
        ];

        const agentsCol = db.collection(`${TENANT_ID}_SYS_OS_agents`);
        for (const agent of team) {
            await agentsCol.updateOne(
                { agentId: agent.assignedAgentId },
                { $set: agent },
                { upsert: true }
            );
        }

        console.log(`✅ ${team.length} Team Members deployed to the registry.`);
        console.log(`\n🚀 [ZAP] Initializing Team Warm-up Simulation...\n`);

        const scenarios = [
            { user: team[0], prompt: "Establish the priority roadmap for the next 24 hours.", tag: "critical" },
            { user: team[1], prompt: "Optimize the recursive file search function in the CLI module.", tag: undefined },
            { user: team[2], prompt: "Verify the mathematical consistency of the new token-cost formula.", tag: "critical" },
            { user: team[3], prompt: "Calculate the projected cost for 1B tokens using current BYOK rates.", tag: "bulk" }
        ];

        for (const scene of scenarios) {
            const user = scene.user;
            if (!user) {
                console.warn(`[SCENE] Skipping scenario: User not found in database.`);
                continue;
            }
            console.log(`[SCENE] Running ${user.name} as ${user.assignedAgentId} (${user.preferences.arbiterTheme})...`);

            try {
                const res = await executeSerializedLane(
                    user,
                    TENANT_ID,
                    user.userId,
                    scene.prompt,
                    user.assignedTier
                );

                if (typeof res !== 'string' && res) {
                    console.log(`✨ [${user.name}] Response: ${(res.text || "").substring(0, 100)}...`);
                    console.log(`📊 [TELEMETRY] Model: ${res.modelId} | Provider: ${res.providerRef} | Tokens: ${res.tokensUsed.total}`);
                } else if (typeof res === 'string') {
                    console.log(`✨ [${user.name}] Response: ${res.substring(0, 100)}...`);
                } else {
                    console.log(`🚨 [${user.name}] Received invalid response format.`);
                }
            } catch (err: any) {
                console.error(`🚨 [${user.name}] Lane Failure: ${err.message}`);
            }
        }

        console.log(`\n📊 [ZAP] Warm-up complete. Run 'npx tsx src/scripts/arbiter_report.ts' to see the metrics.`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
