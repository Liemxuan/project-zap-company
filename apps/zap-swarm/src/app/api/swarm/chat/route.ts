import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const body = await req.json();
        const { sessionId, agentId, message, contextParams, tenantId = "OLYMPUS_SWARM" } = body;

        if (!sessionId || !agentId || !message) {
            return NextResponse.json({ error: "Missing required fields: sessionId, agentId, or message" }, { status: 400 });
        }

        // Test DAG bypass — direct Mongo insert for visualizer testing only
        if (message.trim().startsWith('/test-dag')) {
            client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DB_NAME);
            const col = db.collection(`${tenantId}_SYS_OS_job_queue`);
            const { ObjectId } = require('mongodb');
            const nodeA = new ObjectId(); const nodeB = new ObjectId();
            const nodeC = new ObjectId(); const nodeD = new ObjectId();
            const mockConfig = { apiKey: process.env.GOOGLE_API_KEY || "", defaultModel: "google/gemini-1.5-flash", agentId };
            await col.insertMany([
                { _id: nodeA, status: "PENDING",  dependsOn: [],           workflowId: `WF_${nodeA}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId }, payload: { intent: "DAG_STAGE_1_INITIALIZER",  messages: [{ role: "user", content: message }] } },
                { _id: nodeB, status: "BLOCKED",  dependsOn: [nodeA],       workflowId: `WF_${nodeA}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId }, payload: { intent: "DAG_STAGE_2_PARALLEL_A", messages: [{ role: "user", content: message }] } },
                { _id: nodeC, status: "BLOCKED",  dependsOn: [nodeA],       workflowId: `WF_${nodeA}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId }, payload: { intent: "DAG_STAGE_2_PARALLEL_B", messages: [{ role: "user", content: message }] } },
                { _id: nodeD, status: "BLOCKED",  dependsOn: [nodeB, nodeC], workflowId: `WF_${nodeA}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId }, payload: { intent: "DAG_STAGE_3_AGGREGATOR",  messages: [{ role: "user", content: message }] } },
            ]);
            return NextResponse.json({ success: true, jobId: nodeA.toString(), sessionId });
        }

        // Primary: route through claw — it executes AgentLoop which marks jobs COMPLETED
        try {
            const clawRes = await fetch(`${CLAW_URL}/api/swarm/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, agentId, message, tenantId, contextParams }),
                signal: AbortSignal.timeout(4000), // 4s connect timeout
            });
            if (clawRes.ok) {
                const data = await clawRes.json();
                return NextResponse.json(data);
            }
            // Claw returned an error — surface it
            let clawErr = `ZAP Claw error ${clawRes.status}`;
            try { const b = await clawRes.json(); clawErr = b.error || clawErr; } catch {}
            logger.error(`[api/swarm/chat] Claw returned error: ${clawErr}`);
            // Fall through to Mongo fallback
        } catch (clawConnErr: any) {
            logger.warn(`[api/swarm/chat] Claw unreachable (${clawConnErr.message}), falling back to direct Mongo enqueue`);
        }

        // Fallback: direct Mongo enqueue (job stays PENDING until claw comes back up)
        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection(`${tenantId}_SYS_OS_job_queue`);
        const jobResult = await col.insertOne({
            status: "PENDING",
            queueName: "Queue-Short",
            priority: 0,
            tenantId,
            sourceChannel: "SWARM",
            historyContext: { sessionId, assignedAgentId: agentId },
            payload: { messages: [{ role: "user", content: message }], intent: "SWARM_CHAT", ...(contextParams && { contextParams }) },
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, jobId: jobResult.insertedId.toString(), sessionId, note: "queued_offline" });

    } catch (error: any) {
        logger.error("[api/swarm/chat] Error:", error);
        return NextResponse.json({ error: `Failed to enqueue chat job: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
