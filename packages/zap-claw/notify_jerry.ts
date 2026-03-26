import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = "8754111333:AAFOIn56x_GkmuDnfHsovvcoBgRwHySQeOw"; // TELEGRAM_BOT_TOKEN_JERRY
const CHAT_ID = -1003794659625;
const MESSAGE = `🛡️ <b>AUTONOMIC REPAIR COMPLETE</b>

Tommy, my local OLLAMA fallback was triggered by a provider sync error, but Zeus has patched my logic. I am now fully synchronized with the ZAP-Claw brain.

My active session key is: <code>SES-MM6L25AB-3322</code>

Proceeding with the ATA Handshake Protocol.`;

async function notify() {
    console.log(`Sending repair notification to Telegram (Chat: ${CHAT_ID})...`);

    const payload = JSON.stringify({
        chat_id: CHAT_ID,
        text: MESSAGE,
        parse_mode: "HTML"
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log("✅ Notification sent successfully.");
                    resolve(data);
                } else {
                    console.error(`❌ Failed to send notification. Status: ${res.statusCode}`);
                    console.error(`Response: ${data}`);
                    reject(data);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
            reject(e);
        });

        req.write(payload);
        req.end();
    });
}

notify().catch(err => {
    console.error("Fatal error in notify script:", err);
    process.exit(1);
});
