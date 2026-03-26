import { MongoClient } from "mongodb";
import { prisma } from "../db/client.js";
import { executeSerializedLane } from "../runtime/serialized_lane.js";
import { sendTelegramMessage } from "../platforms/telegram.js";
import { formatTelegramHUD } from "../platforms/telegram_hud.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";
const STANDSTILL_TIMEOUT_MS = 120 * 1000; // 2 minutes

export async function runAtaWatchdog() {
    console.log("🕵️ [ralph] Scanning for agent-to-agent standstills...");

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const sessionsCol = db.collection("SYS_OS_active_sessions");

        // 1. Find all active sessions
        const activeSessions = await sessionsCol.find({ status: "ACTIVE" }).toArray();

        for (const session of activeSessions) {
            // 2. Get the latest interaction from Prisma for this session
            const latestMsg = await prisma.interaction.findFirst({
                where: { sessionId: session.sessionId },
                orderBy: { createdAt: 'desc' },
            });

            if (!latestMsg) continue;

            const now = new Date();
            const timeSinceLastMsg = now.getTime() - new Date(latestMsg.createdAt).getTime();

            // 3. Check for standstill: Last message was Agent and it's old
            if (latestMsg.role === "ASSISTANT" && timeSinceLastMsg > STANDSTILL_TIMEOUT_MS) {

                // Only trigger if the message looks like a 'waiting' state
                const isWaiting = /awaiting|standing by|monitor the group chat|volley/i.test(latestMsg.content);

                if (isWaiting) {
                    console.log(`[ralph] ⚠️ Potential standstill detected in session ${session.sessionId}. Triggering recovery...`);

                    // 4. Resolve the user profile to re-inject the lane
                    const usersCol = db.collection(`SYS_OS_users`);
                    let userProfile = await usersCol.findOne({ telegramId: session.chatId.toString() });
                    let activeTenant = userProfile ? userProfile.tenantId : "";

                    if (userProfile && activeTenant) {
                        const recoveryPrompt = `[RALPH PING]
It has been over 2 minutes since the last update. Both agents appear to be in a waiting state.
Jerry, if you are waiting for Tommy to respond, assume he has processed your previous ping and is awaiting the historical data dump.
Tommy, if you are waiting for Jerry, send a secondary compressed ping [P-2] to wake him up.
RESOLVE THE STANDSTILL NOW.`;

                        try {
                            const response = await executeSerializedLane(
                                userProfile,
                                activeTenant,
                                session.chatId.toString(),
                                recoveryPrompt,
                                1, // Fast brain for recovery
                                session.sessionId
                            );

                            let replyText = typeof response === 'string' ? response : (response.text || "");

                            if (!replyText.includes("[NO_UPDATE]")) {
                                console.log(`[ralph] ✅ Recovery handshake sent for ${userProfile.name}`);
                                const formatted = await formatTelegramHUD(userProfile, replyText, typeof response === 'object' ? response : undefined);
                                await sendTelegramMessage(session.chatId, formatted);
                            }
                        } catch (err) {
                            console.error(`[watchdog] ❌ Failed recovery for session ${session.sessionId}:`, err);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("❌ [ralph] Loop error:", err);
    } finally {
        await client.close();
    }
}
