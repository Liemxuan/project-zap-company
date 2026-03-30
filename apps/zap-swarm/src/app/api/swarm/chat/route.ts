import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const body = await req.json();
        const { sessionId, agentId, message, contextParams, tenantId = "ZVN" } = body;

        if (!sessionId || !agentId || !message) {
            return NextResponse.json({ error: "Missing required fields: sessionId, agentId, or message" }, { status: 400 });
        }

        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

        let dynamicSystemPrompt = "You are a professional assistant.";
        
        try {
            const fs = require("fs");
            const AGENT_DIR = path.resolve(process.cwd(), "../../packages/zap-claw/.agent", agentId.toLowerCase());
            
            let soul = "";
            let memory = "";
            
            if (fs.existsSync(path.join(AGENT_DIR, "soul.md"))) {
                soul = fs.readFileSync(path.join(AGENT_DIR, "soul.md"), "utf-8");
            }
            if (fs.existsSync(path.join(AGENT_DIR, "memory.md"))) {
                memory = fs.readFileSync(path.join(AGENT_DIR, "memory.md"), "utf-8");
            }
            
            // Fetch global memory facts
            const colMemory = db.collection("SYS_MEMORY");
            const globalMemories = await colMemory.find({}).sort({ createdAt: -1 }).limit(10).toArray();
            let globalMemoryStr = "";
            if (globalMemories.length > 0) {
                globalMemoryStr = "\n\n# GLOBAL FACTS & MEMORY\n" + globalMemories.map(m => `- [${m.agentSource || 'system'}] ${m.content}`).join("\n");
            }

            if (soul || memory || globalMemoryStr) {
                dynamicSystemPrompt = `${soul}\n\n${memory}${globalMemoryStr}`;
            }
        } catch (e) {
            console.error("Failed to inject context:", e);
        }

        // Construct OmniPayload matching OmniRouter expectations
        const payload = {
            systemPrompt: dynamicSystemPrompt,
            messages: [{ role: "user", content: message }],
            theme: "B_PRODUCTIVITY",
            intent: "GENERAL",
            contextParams
        };

        // Construct LLMConfig
        const config = {
            apiKey: process.env.GOOGLE_API_KEY || "",
            defaultModel: "google/gemini-1.5-flash",
            agentId: agentId
        };

        if (message.trim().startsWith('/test-dag')) {
            const { ObjectId } = require('mongodb');
            const nodeA = new ObjectId();
            const nodeB = new ObjectId();
            const nodeC = new ObjectId();
            const nodeD = new ObjectId();

            const mockConfig = { apiKey: process.env.GOOGLE_API_KEY || "", defaultModel: "google/gemini-1.5-flash", agentId: "Spike" };
            
            const jobsToInsert = [
                {
                    _id: nodeA, status: "PENDING", dependsOn: [], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(),
                    payload: { intent: "DAG_STAGE_1_INITIALIZER", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG initialization.", messages: [{ role: "user", content: "Wait 3000ms" }], contextParams: { simulateDelay: 3000 } }
                },
                {
                    _id: nodeB, status: "BLOCKED", dependsOn: [nodeA], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(),
                    payload: { intent: "DAG_STAGE_2_PARALLEL_A", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG parallelization A.", messages: [{ role: "user", content: "Wait 4000ms" }], contextParams: { simulateDelay: 4000 } }
                },
                {
                    _id: nodeC, status: "BLOCKED", dependsOn: [nodeA], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(),
                    payload: { intent: "DAG_STAGE_2_PARALLEL_B", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG parallelization B.", messages: [{ role: "user", content: "Wait 2500ms" }], contextParams: { simulateDelay: 2500 } }
                },
                {
                    _id: nodeD, status: "BLOCKED", dependsOn: [nodeB, nodeC], workflowId: `WF_${nodeA.toString()}`, tenantId, config: mockConfig, queueName: "Queue-Short", priority: 0, createdAt: new Date(),
                    payload: { intent: "DAG_STAGE_3_AGGREGATOR", theme: "B_PRODUCTIVITY", systemPrompt: "You are testing DAG aggregation.", messages: [{ role: "user", content: "Wait 1500ms" }], contextParams: { simulateDelay: 1500 } }
                }
            ];

            await col.insertMany(jobsToInsert);
            return NextResponse.json({ success: true, jobId: nodeA, sessionId });
        }

        const job = {
            queueName: "Queue-Short",
            priority: 0,
            status: "PENDING",
            tenantId,
            payload,
            config,
            sourceChannel: "HUD",
            senderIdentifier: "ZAP_USER",
            historyContext: {
                tenantId,
                senderIdentifier: "ZAP_USER",
                sessionId,
                assignedAgentId: agentId
            },
            createdAt: new Date()
        };

        const result = await col.insertOne(job as any);

        return NextResponse.json({ 
            success: true, 
            jobId: result.insertedId,
            sessionId 
        });
    } catch (error: any) {
        console.error("[api/swarm/chat] Error:", error);
        return NextResponse.json({ error: `Failed to enqueue chat job: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
