import "dotenv/config";
import { Bot } from "grammy";

const tokens = {
    CLAW: process.env.TELEGRAM_BOT_TOKEN_CLAW,
    TOMMY: process.env.TELEGRAM_BOT_TOKEN_TOMMY,
    JERRY: process.env.TELEGRAM_BOT_TOKEN_JERRY,
};

async function identify() {
    console.log("🛰️ Swarm Identity Check...\n");
    for (const [key, token] of Object.entries(tokens)) {
        if (!token || token.includes("YOUR")) {
            console.log(`[${key}] ❌ No token found.`);
            continue;
        }
        try {
            const bot = new Bot(token);
            const info = await bot.api.getMe();
            console.log(`[${key}] ✅ @${info.username} (ID: ${info.id})`);
        } catch (e: any) {
            console.log(`[${key}] ❌ Error: ${e.message}`);
        }
    }
}

identify();
