import { MongoClient } from "mongodb";
import { executeSerializedLane } from "../runtime/serialized_lane.js";
import { sendTelegramMessage } from "../platforms/telegram.js";
import { formatTelegramHUD } from "../platforms/telegram_hud.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

export async function runProactiveHeartbeat() {
    // console.log("💓 [Heartbeat] Polling active users for proactive updates...");

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);

        const usersCol = db.collection(`SYS_OS_users`);
        // Find all users who have an assigned Agent and a registered Telegram ID
        const activeUsers = await usersCol.find({
            assignedAgentId: { $exists: true, $ne: null },
            telegramId: { $exists: true, $ne: null }
        }).toArray();

        for (const user of activeUsers) {
            const tenantId = user.tenantId;
            // Determine if this user's agent should wake up
                // For this MVP, we force a heartbeat pulse every time to test the prompt
                const internalPrompt = `[BACKGROUND HEARTBEAT] 
You have been awoken by the ZAP OS daemon. Review your immediate context and history. 
If there is a critical update, proactive insight, or question you need to bring to ${user.name}'s attention, generate a message now.
If there is NOTHING urgent to say, you MUST reply with exactly the string: [NO_UPDATE]. Do not explain.`;

                try {
                    // Send it down the Serialized Lane just like a normal message
                    const response = await executeSerializedLane(
                        user,
                        tenantId,
                        user.telegramId, // Sender Identifier maps to their Telegram chat
                        internalPrompt
                    );

                    let replyText = typeof response === 'string' ? response : (response.text || "");

                    // If the LLM decided it was silence, or it failed, ignore
                    if (replyText.includes("[NO_UPDATE]") || replyText.includes("Internal Lane Error")) {
                        // console.log(`[Heartbeat] AGNT for ${user.name} determined no update needed.`);
                        continue;
                    }

                    console.log(`\n💓 [Heartbeat] Proactive Update Generated for ${user.name} (${user.telegramId})`);
                    console.log(`Payload: ${replyText}`);

                    // Push the actual message back to the human via Telegram
                    // We route it through the HUD formatter to ensure RBAC and styling match
                    let output = replyText;
                    if (typeof response === 'object') {
                        output = await formatTelegramHUD(user, replyText, response);
                    } else {
                        output = await formatTelegramHUD(user, replyText);
                    }

                    await sendTelegramMessage(user.telegramId, output);

                } catch (laneErr) {
                    console.error(`❌ [Heartbeat] Lane error for ${user.name}:`, laneErr);
                }
        }
    } catch (dbErr) {
        console.error("❌ [Heartbeat] DB connection error:", dbErr);
    } finally {
        await client.close();
    }
}
