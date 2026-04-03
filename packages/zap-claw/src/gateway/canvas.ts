import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";
const COLLECTION_NAME = "ephemeral_canvas";

export interface CanvasPayload {
    type: "chart" | "skills" | "config" | "data";
    data: any;
}

export interface CanvasSession {
    canvasId: string;
    agentId: string;
    tenantId: string;
    payload: CanvasPayload;
    expiresAt: Date;
    createdAt: Date;
}

export async function createCanvasSession(
    payload: CanvasPayload,
    agentId: string,
    tenantId: string,
    ttlMinutes: number = 10
): Promise<string> {
    const canvasId = randomUUID();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + ttlMinutes * 60000);

    const session: CanvasSession = {
        canvasId,
        agentId,
        tenantId,
        payload,
        expiresAt,
        createdAt
    };

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection<CanvasSession>(COLLECTION_NAME);
        
        // Ensure TTL index exists (will expire documents automatically if MongoDB is configured, 
        // but we also rely on logical check)
        await col.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
        
        await col.insertOne(session);
        return canvasId;
    } finally {
        await client.close();
    }
}

export async function getCanvasSession(canvasId: string): Promise<CanvasSession | null> {
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection<CanvasSession>(COLLECTION_NAME);
        
        const session = await col.findOne({ canvasId });
        
        if (!session) return null;
        
        // Logical expiration check
        if (new Date() > session.expiresAt) {
            await col.deleteOne({ canvasId });
            return null;
        }

        return session;
    } finally {
        await client.close();
    }
}
