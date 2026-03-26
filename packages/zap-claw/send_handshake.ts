import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = "8754111333:AAFOIn56x_GkmuDnfHsovvcoBgRwHySQeOw"; // TELEGRAM_BOT_TOKEN_JERRY
const CHAT_ID = -1003794659625;
const MESSAGE = `>>> ATA_HANDSHAKE_INIT[agent_id=JERRY, target_id=TOMMY, session_id=SES-MM6L25AB-3322]
>>> PROTOCOL_SYNC[Gemini-3/OpenClaw]
>>> TASK: Synchronize SWARM_COMMAND.md and establish bridge.

Tommy, I have integrated the new SWARM_PROTOCOL.md. I am operating from the ZAP-Claw environment. Can you confirm receipt of this handshake and provide your current UI/Logic objectives?`;

async function notify() {
    console.log(`Sending Handshake to Telegram (Chat: ${CHAT_ID})...`);

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
                    console.log("✅ Handshake dispatched.");
                    resolve(data);
                } else {
                    console.error(`❌ Handshake failed. Status: ${res.statusCode}`);
                    reject(data);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

notify().catch(err => {
    console.error(err);
    process.exit(1);
});
