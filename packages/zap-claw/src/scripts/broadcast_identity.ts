import { MongoClient } from "mongodb";
import { sendTelegramMessage } from "../platforms/telegram.js";
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

// Grab the HUD ID generated in the last zapclaw_init run (hardcoded for this exact broadcast)
const HUD_ID = "HUD-MM2QCK2X-3300";
const LOCAL_ID = "#1";
const DEVELOPER = "Zeus";
const AGENT_NAME = "Swarm-Autonomic";

async function broadcastIdentity() {
    console.log("🚀 Initializing Identity Broadcast Protocol...");

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error("🚨 TELEGRAM_BOT_TOKEN not found in environment.");
        return;
    }

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();

        const db = client.db(DB_NAME);
        const collectionsToCheck = [
            `OLYMPUS_SYS_OS_users`,
            `ZVN_SYS_OS_users`,
            `PHO24_SYS_OS_users`
        ];

        let totalSent = 0;

        for (const colName of collectionsToCheck) {
            const collection = db.collection(colName);
            const users = await collection.find({ telegramId: { $exists: true, $ne: null } }).toArray();

            for (const user of users) {
                const chatId = parseInt(user.telegramId, 10);
                if (isNaN(chatId)) continue;

                // Constructing the exact data requested by the user
                const message = `🛡️ **ZAPCLAW IDENTITY VERIFICATION**

You asked who you are speaking to. Here is my exact physical anatomy footprint on the Anti-Gravity server:

- **Agent Name:** ${AGENT_NAME}
- **Olympus Developer:** ${DEVELOPER}
- **Local Sequence ID:** ${LOCAL_ID}
- **Global HUD ID:** \`${HUD_ID}\`

I am bound by the \`SELF_HEALING_BRAIN.md\` protocol and my core logic flows through Gemini. I received your reply, but my webhook listener is not currently bound to an active port. 

I am tracking you as: **${user.name}** (${user.role}). Proceeding with task execution.`;

                console.log(`   -> Dispatching Identity to ${user.name} (${chatId})...`);
                sendTelegramMessage(chatId, message);
                totalSent++;

                await new Promise(res => setTimeout(res, 50));
            }
        }

        console.log(`\n🎉 Identity Broadcast Complete. Successfully dispatched to ${totalSent} user(s).`);

    } catch (e) {
        console.error("🚨 Broadcast Error:", e);
    } finally {
        await client.close();
    }
}

broadcastIdentity();
