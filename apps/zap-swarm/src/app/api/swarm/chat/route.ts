import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, agentId, message, contextParams, tenantId = "ZVN" } = body;

        if (!sessionId || !agentId || !message) {
            return NextResponse.json({ error: "Missing required fields: sessionId, agentId, or message" }, { status: 400 });
        }

        // Test DAG Generation Bypass for visualizer testing
        if (message.trim().startsWith('/test-dag')) {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DB_NAME);
            const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

            const { ObjectId } = require('mongodb');
            const nodeA = new ObjectId();
            const nodeB = new ObjectId();
            const nodeC = new ObjectId();
            const nodeD = new ObjectId();

            const mockConfig = { apiKey: process.env.GOOGLE_API_KEY || "", defaultModel: "google/gemini-1.5-flash", agentId: "Spike" };
            
            const jobsToInsert = [
                {
                    _id: nodeA, status: "PENDING", dependsOn: [], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId },
                    payload: { intent: "DAG_STAGE_1_INITIALIZER", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG initialization.", messages: [{ role: "user", content: "Wait 3000ms" }], contextParams: { simulateDelay: 3000 } }
                },
                {
                    _id: nodeB, status: "BLOCKED", dependsOn: [nodeA], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId },
                    payload: { intent: "DAG_STAGE_2_PARALLEL_A", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG parallelization A.", messages: [{ role: "user", content: "Wait 4000ms" }], contextParams: { simulateDelay: 4000 } }
                },
                {
                    _id: nodeC, status: "BLOCKED", dependsOn: [nodeA], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId },
                    payload: { intent: "DAG_STAGE_2_PARALLEL_B", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG parallelization B.", messages: [{ role: "user", content: "Wait 2500ms" }], contextParams: { simulateDelay: 2500 } }
                },
                {
                    _id: nodeD, status: "BLOCKED", dependsOn: [nodeB, nodeC], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(), historyContext: { sessionId, assignedAgentId: agentId },
                    payload: { intent: "DAG_STAGE_3_AGGREGATOR", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG aggregation.", messages: [{ role: "user", content: "Wait 1500ms" }], contextParams: { simulateDelay: 1500 } }
                }
            ];

            await col.insertMany(jobsToInsert);
            await client.close();
            return NextResponse.json({ success: true, jobId: nodeA.toString(), sessionId });
        }

        // Phase 2: Native routing through ZAP Claw Pipeline
        const response = await fetch(`${CLAW_URL}/api/swarm/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                agentId,
                message,
                tenantId,
                contextParams
            })
        });

        if (!response.ok) {
            throw new Error(`ZAP Claw returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        logger.error("[api/swarm/chat] Error:", error);
        return NextResponse.json({ error: `Failed to enqueue chat job: ${error.message}` }, { status: 500 });
    }
}
