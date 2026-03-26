import "dotenv/config";
import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN_CLAW;
const chatId = -1003794659625; // Retrieved from zap-claw.SYS_OS_active_sessions

if (!token) {
    console.error("❌ No bot token found.");
    process.exit(1);
}

const bot = new Bot(token);

async function ping() {
    try {
        const msg = `⚡ [ZEUS OVERRIDE] Comm Check ⚡\n\nJerry, please initiate the \`[ATA_TARGET: Tommy]\` Handshake to confirm the new comms protocol is online. Discuss the initial objectives for the OLYMPUS build.`;
        await bot.api.sendMessage(chatId, msg, { parse_mode: "Markdown" });
        console.log("✅ Ping sent successfully.");
    } catch (error) {
        console.error("❌ Failed to send ping:", error);
        process.exit(1);
    }
}

ping();
