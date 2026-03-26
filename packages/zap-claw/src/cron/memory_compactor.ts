import { MongoClient, ObjectId } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";
const TENANTS = ["OLYMPUS", "ZVN", "PHO24"];

// The threshold of RAW messages before compaction triggers.
// Setting to 5 for demonstration purposes (so it triggers quickly in our tests).
const MAX_RAW_MESSAGES = 5;

// We leave this many recent RAW messages intact for immediate context.
const KEEP_RECENT_MESSAGES = 2;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

async function summarizeHistory(messages: any[], tenantId: string, assignedAgentId: string): Promise<string> {

    // 1. Inherit the exact static System Prompt for maximum cache hits
    const { SYSTEM_PROMPT } = require('../system_prompt');

    // 2. Recreate the dynamic System Update (so the prefix exactly matches the parent conversation)
    const dynamicSystemUpdate = `[SYSTEM UPDATE]
Agent Context: You are ${assignedAgentId}.
Tenant Context: ${tenantId}
Current System Time: ${new Date().toISOString()}

Please read the following conversation history.`;

    // 3. Construct the same contents Payload array structure
    const contentsPayload: any[] = [
        { role: "user", parts: [{ text: dynamicSystemUpdate }] },
        { role: "model", parts: [{ text: "Understood. Proceed with the history." }] }
    ];

    // 4. Inject the raw history messages (this utilizes the previous turns' cache)
    for (const msg of messages) {
        if (msg.role === 'summary') {
            contentsPayload.push({ role: "user", parts: [{ text: `--- HISTORICAL SUMMARY BLOCK ---\n${msg.content}\n--- END SUMMARY ---` }] });
        } else {
            const mapRole = msg.role === 'agent' ? 'model' : 'user';
            contentsPayload.push({ role: mapRole, parts: [{ text: msg.content }] });
        }
    }

    // 5. Append the Side-Operation Instruction (Rule 6: Parent-Child Inheritance)
    const summarizationInstruction = `
    [COMPACTION PROTOCOL ACTIVATED]
    You are now acting as the Memory Archiver. 
    Read the highly detailed conversation log above.
    Your job is to output a highly dense, chronological summary describing the sequence of events, tasks completed, decisions made, and any strict continuous instructions the user gave to the AI.
    
    Do NOT include greetings or small talk. Focus purely on facts, state changes, defined variables, and completed goals.
    Keep it as compressed as possible while retaining all historical truth.
    OUTPUT ONLY THE TEXT SUMMARY.
    `;

    contentsPayload.push({ role: "user", parts: [{ text: summarizationInstruction }] });

    try {
        console.log(`[Memory Compactor] 🧠 Initiating Cache-Inherited Summarization (${assignedAgentId})...`);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using the parent model ensures we hit the exact cache tree
            contents: contentsPayload,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.1, // extremely low temperature for factual archival
            }
        });
        return response.text || "Summary generation failed.";
    } catch (error) {
        console.error("[Memory Compactor] Summarization Error:", error);
        return "ERROR_SUMMARIZING";
    }
}

async function runCompactor() {
    console.log(`======================================================`);
    console.log(`[Memory Compactor] 🧹 Initializing global sweep...`);
    console.log(`======================================================\n`);

    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        for (const tenantId of TENANTS) {
            console.log(`\n[Memory Compactor] Scanning Tenant: ${tenantId}`);
            const memoryCol = db.collection(`${tenantId}_SYS_CLAW_memory`);

            // Find all unique senders in this tenant
            const uniqueSenders = await memoryCol.distinct("senderIdentifier");

            for (const sender of uniqueSenders) {
                // Get ALL messages for this sender, sorted oldest to newest
                const allMessages = await memoryCol.find({ senderIdentifier: sender }).sort({ timestamp: 1 }).toArray();

                // Count how many of these are raw messages (not already a summary)
                const rawMessages = allMessages.filter(msg => msg.role !== 'summary');

                if (rawMessages.length > MAX_RAW_MESSAGES) {
                    console.log(`[Memory Compactor] ⚠️ Threshold exceeded for ${sender} (${rawMessages.length} raw messages). Compacting...`);

                    // We want to compact the oldest messages, leaving the `KEEP_RECENT_MESSAGES` intact.
                    const messagesToCompact = rawMessages.slice(0, rawMessages.length - KEEP_RECENT_MESSAGES);

                    const firstMessage = messagesToCompact[0];

                    if (messagesToCompact.length > 0 && firstMessage) {
                        const summaryText = await summarizeHistory(messagesToCompact, tenantId, firstMessage.assignedAgentId);

                        if (summaryText !== "ERROR_SUMMARIZING") {
                            const lastMessage = messagesToCompact[messagesToCompact.length - 1];

                            if (lastMessage && firstMessage) {
                                const summaryDoc = {
                                    tenantId,
                                    senderIdentifier: sender,
                                    assignedAgentId: firstMessage.assignedAgentId,
                                    role: "summary",
                                    content: `[COMPACTED_SUMMARY]\n${summaryText}`,
                                    timestamp: lastMessage.timestamp
                                };

                                // Insert the summary
                                await memoryCol.insertOne(summaryDoc);
                            }

                            // Delete the old raw messages we just compacted
                            const idsToDelete = messagesToCompact.map(m => m._id);
                            await memoryCol.deleteMany({ _id: { $in: idsToDelete } });

                            console.log(`[Memory Compactor] ✅ Successfully compacted ${messagesToCompact.length} messages for ${sender} into 1 metadata block.`);
                        }
                    }

                } else {
                    console.log(`[Memory Compactor] ${sender} is within limits (${rawMessages.length}/${MAX_RAW_MESSAGES}).`);
                }
            }
        }

    } catch (error) {
        console.error(`[Memory Compactor ERROR]`, error);
    } finally {
        await client.close();
        console.log(`\n[Memory Compactor] 🧹 Sweep complete. Winding down.\n`);
    }
}

// Allow running directly via TSX for testing
if (import.meta.url === `file://${process.argv[1]}`) {
    runCompactor();
}
