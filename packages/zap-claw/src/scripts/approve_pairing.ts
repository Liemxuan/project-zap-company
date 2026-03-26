import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

async function approvePairing() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log("Usage: npx tsx src/scripts/approve_pairing.ts <CODE> <TENANT_ID> <USERNAME>");
        process.exit(1);
    }

    const [pairingCode, tenantId, username] = args;
    if (!tenantId || !username) {
        console.error("❌ Error: Missing TENANT_ID or USERNAME");
        process.exit(1);
    }
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // 1. Find the pairing code
        const pairingCol = db.collection(`SYS_OS_pairing_codes`);
        const pending = await pairingCol.findOne({ pairingCode, status: 'PENDING' });

        if (!pending) {
            console.error(`❌ Error: Pairing code [${pairingCode}] not found or already approved.`);
            process.exit(1);
        }

        console.log(`[Approve] Found pairing request for TelegramID: ${pending.telegramId}`);

        // 2. Create the user in the target tenant collection
        const userCol = db.collection(`${tenantId.toUpperCase()}_SYS_OS_users`);
        const newUser = {
            name: username,
            telegramId: pending.telegramId,
            tenantId: tenantId.toUpperCase(),
            role: "MEMBER",
            createdAt: new Date()
        };

        await userCol.insertOne(newUser);
        console.log(`[Approve] ✅ User [${username}] created in tenant [${tenantId}]`);

        // 3. Mark the code as APPROVED
        await pairingCol.updateOne(
            { pairingCode },
            { $set: { status: 'APPROVED', approvedAt: new Date() } }
        );
        console.log(`[Approve] ✅ Pairing code [${pairingCode}] marked as approved.`);

    } catch (e) {
        console.error(`[Approve] 🚨 Unexpected Error:`, e);
    } finally {
        await client.close();
    }
}

approvePairing();
