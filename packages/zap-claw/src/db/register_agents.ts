import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus"; 

async function registerAgents() {
    console.log(`[Olympus] Registering isolated agents inside MongoDB...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const agentCol = db.collection("OLYMPUS_SYS_OS_agents");

        const agents = [
            {
                agentId: "JERRY",
                role: "Chief of Staff & Builder",
                tenantId: "OLYMPUS",
                status: "ACTIVE",
                preferences: {
                    byok: {
                        apiKey: process.env.JERRY_PRIMARY_API_KEY,
                        modelId: "google/gemini-3.1-pro-preview"
                    }
                },
                fallback: {
                    apiKey: process.env.JERRY_BACKUP_API_KEY,
                    provider: "OPENROUTER"
                },
                imageGen: {
                    apiKey: process.env.JERRY_IMAGE_API_KEY,
                    provider: "GOOGLE_BANANA"
                },
                createdAt: new Date()
            },
            {
                agentId: "SPIKE",
                role: "Analyst",
                tenantId: "OLYMPUS",
                status: "ACTIVE",
                preferences: {
                    byok: {
                        apiKey: process.env.SPIKE_PRIMARY_API_KEY,
                        modelId: "google/gemini-3.1-pro-preview"
                    }
                },
                fallback: {
                    apiKey: process.env.SPIKE_BACKUP_API_KEY,
                        provider: "OPENROUTER"
                },
                imageGen: {
                    apiKey: process.env.SPIKE_IMAGE_API_KEY,
                    provider: "GOOGLE_BANANA"
                },
                createdAt: new Date()
            }
        ];

        for (const agent of agents) {
            await agentCol.updateOne(
                { agentId: agent.agentId, tenantId: agent.tenantId },
                { $set: agent },
                { upsert: true }
            );
            console.log(`  ✅ Registered Agent: ${agent.agentId} under tenant ${agent.tenantId}`);
        }

        console.log(`\n[Olympus] Agent Registry Update SUCCESS. Data persisted to OLYMPUS_SYS_OS_agents.`);
    } catch (error) {
        console.error(`[Olympus] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`[Olympus] Connection closed.`);
    }
}

registerAgents();
