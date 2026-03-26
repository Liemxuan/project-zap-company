import { MongoClient } from "mongodb";
import { executeSerializedLane } from "../runtime/serialized_lane.js";
import { OmniResponse } from "../runtime/engine/omni_router.js";
import { routeEgress } from "./egress.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

// Simulate an incoming omni-channel payload
interface IncomingMessage {
    channel: "WHATSAPP" | "TELEGRAM" | "ZALO" | "IMESSAGE" | "CLI";
    senderIdentifier: string; // Simplistic identifier for this mock (e.g. "Tom")
    tenantId: "ZVN" | "PHO24" | "OLYMPUS"; // Derived from the webhook or port origin
    payload: string;
    sessionId?: string; // Optional trackable session bounding box
}

export async function receiveMessage(msg: IncomingMessage): Promise<OmniResponse | string | undefined> {
    console.log(`[Gateway] Intercepted [${msg.channel}] message from [${msg.senderIdentifier}]...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // Use generic collection and filter by tenantId
        const collectionName = `SYS_OS_users`;
        const usersCol = db.collection(collectionName);

        console.log(`[Gateway] Querying Entity Matrix: ${collectionName} for ${msg.tenantId}`);
        const user = await usersCol.findOne({ name: msg.senderIdentifier, tenantId: msg.tenantId });

        if (!user) {
            console.error(`[Gateway] ❌ Unknown Sender. Security rejection.`);
            return "❌ Access Denied: Unknown Sender.";
        }

        console.log(`[Gateway] ✅ Identity Match: ${user.name} (${user.role})`);
        console.log(`[Gateway] Entity AI Level: ${user.agentType}`);

        if (user.agentType === "NONE") {
            console.log(`[Gateway] 🛤️  Routing Decision: [Halt Execution]. User has no AI assigned. Message logged for human records.`);
            return "❌ Action Failed: You do not have an active AI Copilot assigned to your profile.";
        } else if (user.agentType === "ASSISTED") {
            // "Sorting Hat" Heuristic logic
            let assignedTier = 2; // Default intermediate tier
            if (user.overrideModelTier) {
                assignedTier = user.overrideModelTier;
                console.log(`[Gateway] 🎩 Sorting Hat Bypass: User forced Tier ${assignedTier}`);
            } else {
                const payloadLower = msg.payload.toLowerCase();
                const highLogicKeywords = ["write", "analyze", "explain", "code", "projection", "report", "debug", "audit"];
                const isHighLogic = highLogicKeywords.some(kw => payloadLower.includes(kw));

                if (payloadLower.length > 500 || isHighLogic) {
                    assignedTier = 1;
                } else if (payloadLower.length < 50 && !payloadLower.includes("?")) {
                    assignedTier = 3;
                }
                console.log(`[Gateway] 🎩 Sorting Hat Assigned: Tier ${assignedTier} based on payload heuristics.`);
            }

            console.log(`[Gateway] 🛤️  Routing Decision: [Push to Serialized LLM Lane].`);
            console.log(`            - Assigned AI Core: ${user.assignedAgentId}`);
            console.log(`            - Bound Model Constraint: ${user.defaultModel || 'Global Fallback'}`);
            console.log(`            - Optimization Tier: ${assignedTier}`);
            console.log(`            - Bound Session: ${msg.sessionId || 'Global Default'}`);
            console.log(`            - Next Step: Fetching SYS_CLAW_memory for context injection...`);

            // Connect Gateway -> Lane and capture response
            const reply = await executeSerializedLane(
                user,
                msg.tenantId,
                msg.senderIdentifier,
                msg.payload,
                assignedTier,
                msg.sessionId
            );
            console.log(`[Gateway] Pipeline Pre-processing Complete.\n`);

            if (typeof reply === "string") return reply;
            const formattedReply = routeEgress(reply, msg.channel);
            console.log(`[Gateway] ✅ Egress formatted for ${msg.channel}.`);
            return formattedReply;

        } else if (user.agentType === "AUTONOMOUS") {
            console.log(`[Gateway] 🛤️  Routing Decision: [Trigger Autonomous Execution].`);
            console.log(`            - Assigned AI Core: ${user.assignedAgentId}`);
            console.log(`            - Bound Model Constraint: ${user.defaultModel}`);
            console.log(`            - Output Destination: Reporting directly to supervisor -> ${user.linkedHuman}`);
            return "✅ Autonomous task accepted and queued.";
        }

        return "❌ Unmapped Agent Type";


    } catch (error) {
        console.error(`[Gateway ERROR]`, error);
        return "❌ Internal Gateway Error.";
    } finally {
        await client.close();
    }
}

// MOCK EXECUTION FOR TESTING
async function runMocks() {
    console.log(`\n======================================================`);
    console.log(`--- TEST 1: CEO Tom sending a WhatsApp message ---`);
    console.log(`======================================================`);
    await receiveMessage({
        channel: "WHATSAPP",
        senderIdentifier: "Tom",
        tenantId: "ZVN",
        payload: "Hey, what is our Q3 revenue looking like?"
    });

    console.log(`======================================================`);
    console.log(`--- TEST 2: Kevin (Cook) sending a Telegram message ---`);
    console.log(`======================================================`);
    await receiveMessage({
        channel: "TELEGRAM",
        senderIdentifier: "Kevin",
        tenantId: "PHO24",
        payload: "I'm sick, can't come in today."
    });
}

// Only run if called directly from the terminal
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runMocks();
}
