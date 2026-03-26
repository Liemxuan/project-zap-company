import { MongoClient, ObjectId } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

// Ensure we have our API key
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("[Autonomous Lane] ❌ FATAL ERROR: GOOGLE_API_KEY is missing from environment.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function executeAutonomousLane(
    agentProfile: any,
    tenantId: string,
    task: any
) {
    console.log(`\n[Autonomous Lane] 🚀 Booting autonomous execution sequence for Agent: ${agentProfile.assignedAgentId}`);
    console.log(`[Autonomous Lane] 📋 Processing Task ID: ${task._id} | Title: ${task.title}`);

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // Find the linked supervisor to get their identifier
        const usersCol = db.collection(`${tenantId}_SYS_OS_users`);
        const supervisor = await usersCol.findOne({ email: agentProfile.linkedHuman });
        const supervisorName = supervisor ? supervisor.name : agentProfile.linkedHuman;

        const memoryCollectionName = `${tenantId}_SYS_CLAW_memory`;
        const memoryCol = db.collection(memoryCollectionName);

        // We don't necessarily need the supervisor's full history for an autonomous task, 
        // but it's good architecture to pull recent context in case the task relates to recent chats.
        console.log(`[Autonomous Lane] 🧠 Injecting Context: Querying ${memoryCollectionName} for Supervisor ${supervisorName}...`);
        const rawHistory = await memoryCol.find({ senderIdentifier: supervisorName }).sort({ timestamp: 1 }).limit(5).toArray();
        let historyString = "Recent Supervisor Context:\n";

        if (rawHistory.length === 0) {
            historyString += "(No recent context available.)\n";
        } else {
            for (const doc of rawHistory) {
                historyString += `[${doc.role.toUpperCase()}]: ${doc.content}\n`;
            }
        }

        console.log(`[Autonomous Lane] ⚙️ Building Prompt & Firing LLM Request (${agentProfile.defaultModel})...`);

        const systemInstruction = `You are an AUTONOMOUS AI assistant named ${agentProfile.assignedAgentId}.
You report to: ${supervisorName} (${agentProfile.linkedHuman}).
Tenant: ${tenantId}

You are executing a background task. You do not wait for human input. 
Perform the task requested, and write a status report that will be inserted directly into your supervisor's feed.`;

        const fullPrompt = `${historyString}\n\n[TASK DIRECTIVE]\nTitle: ${task.title}\nDescription: ${task.description}\n\nPlease execute this task and provide your final report:`;

        const response = await ai.models.generateContent({
            model: agentProfile.defaultModel,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4 // Lower temperature for more deterministic autonomous tasks
            }
        });

        const reply = response.text || "Task completed, but no report was generated.";
        console.log(`\n[Autonomous Output]\n${reply}\n`);

        // State Preservation: Save the autonomous report back to the SUPERVISOR's memory
        console.log(`[Autonomous Lane] 💾 Transmitting Report -> Saving to ${supervisorName}'s feed in ${memoryCollectionName}`);
        await memoryCol.insertOne({
            tenantId,
            senderIdentifier: supervisorName, // Injected into Mike's stream
            assignedAgentId: agentProfile.assignedAgentId,
            role: "agent",
            content: `[AUTONOMOUS REPORT: ${task.title}]\n${reply}`,
            timestamp: new Date()
        });

        // Mark the task as completed
        const tasksCol = db.collection(`${tenantId}_SYS_OS_tasks`);
        await tasksCol.updateOne(
            { _id: task._id },
            { $set: { status: "COMPLETED", result: reply, completedAt: new Date() } }
        );
        console.log(`[Autonomous Lane] ✅ Task marked as COMPLETED in DB.`);

        return reply;

    } catch (error) {
        console.error(`[Autonomous Lane ERROR]`, error);
        return "❌ Internal Autonomous Error.";
    } finally {
        await client.close();
    }
}
