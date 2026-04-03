import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../lib/mongo";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export async function GET(req: Request) {
    let client: MongoClient | null = null;
    try {
        const url = new URL(req.url);
        const agentId = url.searchParams.get("agentId");

        client = await getGlobalMongoClient();
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
        logger.error("[api/swarm/memory] Error fetching memories:", error);
        return NextResponse.json({ error: `MongoDB query failed: ${error.message}` }, { status: 500 });
    } finally {
    }
}

export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const body = await req.json();
        const { agentId, type, content, fact } = body;

        client = await getGlobalMongoClient();
        const db = client.db(DB_NAME);
        const colMemory = db.collection("SYS_MEMORY");

        const newMemory = {
            agentSource: agentId || null,
            type: type || "global",
            content: content || fact || "",
            createdAt: new Date()
        };

        const result = await colMemory.insertOne(newMemory);

        return NextResponse.json({ success: true, memory: { ...newMemory, _id: result.insertedId } });
    } catch (error: any) {
        logger.error("[api/swarm/memory] Error creating memory:", error);
        return NextResponse.json({ error: `MongoDB insert failed: ${error.message}` }, { status: 500 });
    } finally {
    }
}

export async function DELETE(req: Request) {
    let client: MongoClient | null = null;
    try {
        const url = new URL(req.url);
        const agentId = url.searchParams.get("agentId");
        const id = url.searchParams.get("id");

        if (!agentId && !id) {
            return NextResponse.json({ error: "Missing agentId or id" }, { status: 400 });
        }

        client = await getGlobalMongoClient();
        const db = client.db(DB_NAME);
        const colMemory = db.collection("SYS_MEMORY");

        if (id) {
             const result = await colMemory.deleteOne({ _id: new ObjectId(id) });
             return NextResponse.json({ success: true, deleted: result.deletedCount });
        } else if (agentId) {
             const result = await colMemory.deleteMany({ agentSource: agentId });
             return NextResponse.json({ success: true, deleted: result.deletedCount });
        }
        return NextResponse.json({ success: false });
    } catch (error: any) {
        logger.error("[api/swarm/memory] Error deleting memory:", error);
        return NextResponse.json({ error: `MongoDB delete failed: ${error.message}` }, { status: 500 });
    } finally {
    }
}
