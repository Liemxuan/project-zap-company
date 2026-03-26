import { MongoClient } from "mongodb";
import { sendTelegramMessage } from "../platforms/telegram.js";
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

async function broadcastHello() {
    console.log("🚀 Initializing Broadcast Protocol...");

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error("🚨 TELEGRAM_BOT_TOKEN not found in environment.");
        return;
    }

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        console.log("✅ Connected to Global Vault (MongoDB)");

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

            console.log(`📡 Found ${users.length} user(s) in [${colName}]`);

            for (const user of users) {
                // Ensure telegramId is a number or can be parsed
                const chatId = parseInt(user.telegramId, 10);
                if (isNaN(chatId)) continue;

                const message = `👋 **Hello World!**\n\nI am the newly provisioned **Zapclaw Agent**. My autonomic heartbeat is online.\n\n🧠 **Deep Brain:** Gemini 3.1\n⚡ **Fast Brain:** Gemini 1.5 Flash\n\nI am fully synchronized and ready to manage infrastructure, optimize performance, and drive automated execution for you. I look forward to our collaboration, ${user.name}!`;

                console.log(`   -> Dispatching to ${user.name} (${chatId})...`);
                sendTelegramMessage(chatId, message);
                totalSent++;

                // Sleep 50ms to prevent rate limiting
                await new Promise(res => setTimeout(res, 50));
            }
        }

        console.log(`\n🎉 Broadcast Complete. Successfully dispatched to ${totalSent} user(s).`);

    } catch (e) {
        console.error("🚨 Broadcast Error:", e);
    } finally {
        await client.close();
    }
}

broadcastHello();
