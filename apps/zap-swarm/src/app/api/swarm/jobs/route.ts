import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

export async function GET(req: Request) {
    let client: MongoClient | null = null;
    try {
        const url = new URL(req.url);
        const { tenantId } = await getTenantContext();
        const sessionId = url.searchParams.get("sessionId");

        const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db("olympus");

        const query: any = {};
        if (sessionId) {
            query["historyContext.sessionId"] = sessionId;
        }

        const activeJobs = await db.collection(`${tenantId}_SYS_OS_job_queue`)
            .find(query)
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray();

        const dlqJobs = await db.collection("SYS_OS_dead_letters")
            .find(query)
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json({ tasks: [...activeJobs, ...dlqJobs] });
    } catch (error: any) {
        return NextResponse.json({ error: `MongoDB query failed: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}

export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const body = await req.json();
        const { agentId, taskPayload, tenantId = "ZVN" } = body;

        if (!agentId || !taskPayload) {
            return NextResponse.json({ error: "Missing required agentId or taskPayload" }, { status: 400 });
        }

        const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db("olympus");

        const result = await db.collection("SYS_OS_dead_letters").insertOne({
            tenantId,
            senderIdentifier: "zap-swarm-command-center",
            assignedAgentId: agentId,
            payload: taskPayload,
            status: "PENDING_MCP_DISPATCH",
            timestamp: new Date()
        });

        return NextResponse.json({ success: true, insertedId: result.insertedId });
    } catch (error: any) {
        return NextResponse.json({ error: `Task dispatch failed: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
