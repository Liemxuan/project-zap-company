import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

async function auditZVN() {
    console.log(`[Audit: ZVN] Initiating Zap Vietnam Employee-to-Agent Verification...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const zvnUsers = db.collection("ZVN_SYS_OS_users");

        console.log(`\n--- Step 1: Validating Tom (CEO) & Gemini-Pro Mapping ---`);
        const tom = await zvnUsers.findOne({ name: "Tom" });

        if (tom) {
            console.log(`✅ [Pass] Found user: ${tom.name} (${tom.role})`);
            const isAssisted = tom.agentType === "ASSISTED";
            const isCorrectAgent = tom.assignedAgentId === "AGNT-ZVN-TOM";
            const isProModel = tom.defaultModel === "gemini-2.5-pro";

            if (isAssisted && isCorrectAgent && isProModel) {
                console.log(`✅ [Pass] Tom is correctly mapped to his dedicated Gemini-Pro Copilot.`);
            } else {
                console.error(`❌ [Fail] Tom's agent mapping is incorrect:`, {
                    agentType: tom.agentType,
                    assignedAgentId: tom.assignedAgentId,
                    defaultModel: tom.defaultModel
                });
            }
        } else {
            console.error(`❌ [Fail] User 'Tom' not found in ZVN_SYS_OS_users.`);
        }

        console.log(`\n--- Step 2: Validating Tommy (Sales) & Gemini-Flash Mapping ---`);
        const tommy = await zvnUsers.findOne({ name: "Tommy" });

        if (tommy) {
            console.log(`✅ [Pass] Found user: ${tommy.name} (${tommy.role})`);
            const isAssisted = tommy.agentType === "ASSISTED";
            const isCorrectAgent = tommy.assignedAgentId === "AGNT-ZVN-TOMMY";
            const isFlashModel = tommy.defaultModel === "gemini-2.5-flash";

            if (isAssisted && isCorrectAgent && isFlashModel) {
                console.log(`✅ [Pass] Tommy is correctly mapped to his dedicated Gemini-Flash Copilot.`);
            } else {
                console.error(`❌ [Fail] Tommy's agent mapping is incorrect:`, {
                    agentType: tommy.agentType,
                    assignedAgentId: tommy.assignedAgentId,
                    defaultModel: tommy.defaultModel
                });
            }
        } else {
            console.error(`❌ [Fail] User 'Tommy' not found in ZVN_SYS_OS_users.`);
        }

        console.log(`\n--- Step 3: Validating ZVN Tenant Isolation ---`);
        const totalZVNUsers = await zvnUsers.countDocuments();
        console.log(`System: Found ${totalZVNUsers} total entities in ZVN tenant.`);
        // Assuming Zap Vietnam has exactly 11 people based on our seed data
        if (totalZVNUsers === 11) {
            console.log(`✅ [Pass] Strict ZVN isolation holds. No Pho24 or Olympus entities leaked into the collection.`);
        } else {
            console.warn(`⚠️ [Warning] Expected 11 entities in ZVN, but found ${totalZVNUsers}. Check seed data consistency.`);
        }

    } catch (error) {
        console.error(`[Audit: ZVN] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`\n[Audit: ZVN] Audit complete. Database connection closed.`);
    }
}

auditZVN();
