import express, { Router } from 'express';
import { MongoClient } from "mongodb";

export const syncRouter: Router = express.Router();

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

// ==========================================
// Phase 0: Controlled Prototype Sync
// ==========================================

// 1. Pull: Client requests latest cloud state for their SQLite db
syncRouter.get('/api/sync/pull', async (req, res) => {
    const { deviceId, channel, lastSyncCursor } = req.query;

    if (!deviceId || !channel) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const syncCol = db.collection(`SYS_OS_sync_events`);

        // Get all events since the client's last sync cursor
        const query = lastSyncCursor ? { timestamp: { $gt: lastSyncCursor } } : {};
        const events = await syncCol.find(query).toArray();

        // In a real system, you'd filter by what's relevant to the specific device/tenant
        res.status(200).json({
            events,
            newCursor: new Date().toISOString()
        });
    } catch (e: any) {
        console.error("[API Sync Pull] Error:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

import { redis, SyncQueuePayload } from '../lib/redis.js';

// 2. Push: Client pushes local SQLite mutations to the cloud
syncRouter.post('/api/sync/push', async (req, res) => {
    const { deviceId, channel, mutations } = req.body;

    if (!deviceId || !channel || !Array.isArray(mutations)) {
        res.status(400).json({ error: "Missing required fields or invalid mutations array." });
        return;
    }

    try {
        // [PHASE 2 CONCURRENCY]
        // Instead of connecting to MongoDB directly (which crashes at 10k connections),
        // we throw the payload into a serverless Upstash Redis queue.
        // This drops the request closure time from ~50ms to ~2ms.

        const payload: SyncQueuePayload = {
            clientId: deviceId,
            channel: channel,
            timestamp: new Date().toISOString(),
            data: mutations
        };

        // Push the payload to the right side of the list
        await redis.rpush('queue:sync_events', JSON.stringify(payload));

        // HTTP 202: Accepted (but processing happens async in the background)
        res.status(202).json({
            message: "Sync Push queued for processing",
            queuedCount: mutations.length
        });

    } catch (e: any) {
        console.error("[API Sync Push] Redis Queuing Error:", e);
        res.status(500).json({ error: "Internal Queue Error" });
    }
});
