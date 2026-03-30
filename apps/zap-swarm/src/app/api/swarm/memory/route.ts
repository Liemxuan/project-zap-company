import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export async function GET(req: Request) {
    let client: MongoClient | null = null;
    try {
        const url = new URL(req.url);
        const agentId = url.searchParams.get("agentId");

        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db(DB_NAME);
        const colMemory = db.collection("SYS_MEMORY");

        const query: any = {};
        if (agentId) {
            query.$or = [
                { agentSource: agentId },
                { agentSource: { $exists: false } },
                { agentSource: null }
            ];
        }

        const memories = await colMemory.find(query)
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json({ success: true, memories });
    } catch (error: any) {
        console.error("[api/swarm/memory] Error fetching memories:", error);
        return NextResponse.json({ error: `MongoDB query failed: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
