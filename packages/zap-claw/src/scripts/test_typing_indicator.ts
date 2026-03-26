import { sendTelegramTypingAction } from "../platforms/telegram.js";
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(process.cwd(), '.env') });

const ZEUS_CHAT_ID = parseInt("8522264702", 10);
const TOM_CHAT_ID = parseInt("8357443696", 10);

console.log("Sending 'typing...' action to Zeus...");
sendTelegramTypingAction(ZEUS_CHAT_ID);

console.log("Sending 'typing...' action to Tom...");
sendTelegramTypingAction(TOM_CHAT_ID);

console.log("Typing actions dispatched! They should show for ~5 seconds on Telegram.");
