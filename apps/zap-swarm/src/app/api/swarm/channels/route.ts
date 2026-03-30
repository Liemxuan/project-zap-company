import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

/**
 * Channel seed schema — only used for initial collection bootstrap.
 * After first seed, the backend (telegram.ts, etc.) maintains real state
 * via $set on { status, ping, lastActivityAt, messageCount }.
 */
const SEED_CHANNELS = [
    { name: "Telegram", status: "offline", users: 0, ping: "-", messageCount: 0, connectedAgent: null },
    { name: "WhatsApp", status: "not_configured", users: 0, ping: "-", messageCount: 0, connectedAgent: null },
    { name: "Discord",  status: "not_configured", users: 0, ping: "-", messageCount: 0, connectedAgent: null },
    { name: "iMessage", status: "not_configured", users: 0, ping: "-", messageCount: 0, connectedAgent: null },
];

export async function GET() {
    let client: MongoClient | null = null;
    try {
        const { tenantId } = await getTenantContext();
        
        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        await client.connect();
        const db = client.db(DB_NAME);
        const colName = `${tenantId}_SYS_CHANNELS`;
        const col = db.collection(colName);

        let channels = await col.find({}).toArray();

        // Seed only if collection is completely empty (first boot)
        if (channels.length === 0) {
            const docsToInsert = SEED_CHANNELS.map(c => ({
                ...c,
                tenantId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            await col.insertMany(docsToInsert);
            channels = await col.find({}).toArray();
        }

        // Compute liveness — mark channels with no activity in 5 min as "offline"
        const STALE_THRESHOLD_MS = 5 * 60 * 1000;
        const now = Date.now();
        const enriched = channels.map(ch => {
            const lastActivity = ch.lastActivityAt ? new Date(ch.lastActivityAt).getTime() : 0;
            const isStale = lastActivity > 0 && (now - lastActivity) > STALE_THRESHOLD_MS;
            return {
                _id: ch._id.toString(),
                name: ch.name,
                status: ch.status === "not_configured" ? "not_configured" : (isStale ? "idle" : ch.status),
                users: ch.users || 0,
                ping: ch.ping || "-",
                messageCount: ch.messageCount || 0,
                connectedAgent: ch.connectedAgent || null,
                lastActivityAt: ch.lastActivityAt || null,
            };
        });

        return NextResponse.json({ success: true, channels: enriched });
    } catch (error: any) {
        logger.error(`[api/swarm/channels] Error:`, error);
        return NextResponse.json(
            { success: false, error: error.message, channels: [] },
            { status: 500 }
        );
    } finally {
        if (client) await client.close();
    }
}
