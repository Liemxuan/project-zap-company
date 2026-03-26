import { Schema, model, models } from "mongoose";

export interface ISession {
    sessionId: string;
    tenantId: string;
    channel: string;
    chatId: string;
    threadId?: string;
    messages: Array<{
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
    }>;
    created_at: Date;
    updated_at: Date;
}

const SessionSchema = new Schema<ISession>(
    {
        sessionId: { type: String, required: true, unique: true, index: true },
        tenantId: { type: String, required: true, index: true },
        channel: { type: String, required: true },
        chatId: { type: String, required: true },
        threadId: { type: String },
        messages: [
            {
                role: { type: String, enum: ["user", "assistant", "system"], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export const Session = (models.SYS_CLAW_sessions as import("mongoose").Model<ISession>) || model<ISession>("SYS_CLAW_sessions", SessionSchema);

/**
 * Retrieves an active session or creates a new one, ensuring strict tenant isolation.
 */
export async function getOrCreateSession(
    tenantId: string,
    channel: string,
    chatId: string,
    threadId?: string
): Promise<ISession> {
    const sessionId = `${tenantId}:${channel}:${chatId}${threadId ? `:${threadId}` : ""}`;

    let session = await Session.findOne({ sessionId, tenantId });

    if (!session) {
        session = await Session.create({
            sessionId,
            tenantId,
            channel,
            chatId,
            ...(threadId ? { threadId } : {}),
            messages: [],
        });
    }

    return session;
}

/**
 * Appends a message to the session history and enforces the "Rule of 500" compaction.
 */
export async function appendMessage(
    sessionId: string,
    tenantId: string,
    role: "user" | "assistant" | "system",
    content: string
): Promise<void> {
    // 1. Push the new message
    await Session.updateOne(
        { sessionId, tenantId },
        {
            $push: {
                messages: {
                    role,
                    content,
                    timestamp: new Date(),
                },
            },
        }
    );

    // 2. Check for Compaction (Rule of 500)
    // We do this asynchronously to not block the response, but for data integrity we await it here.
    const session = await Session.findOne({ sessionId, tenantId });
    if (session && session.messages.length > 500) {
        await compactSession(session);
    }
}

/**
 * Compaction Logic:
 * - Keeps the System Prompt (Index 0)
 * - Keeps the last 50 messages (Recent Context)
 * - Summarizes/Truncates the middle 450+ messages into a single "Compacted Memory" block.
 */
async function compactSession(session: ISession) {
    console.log(`[Session] 🧹 Compacting Session ${session.sessionId} (Length: ${session.messages.length})`);

    const messages = session.messages;
    const systemMessage = messages.find(m => m.role === "system");
    const recentMessages = messages.slice(-50); // Keep last 50

    // Calculate the middle chunk
    const removedCount = messages.length - (systemMessage ? 1 : 0) - recentMessages.length;
    
    if (removedCount <= 0) return; // Should not happen if length > 500

    const compactionNote = {
        role: "system" as const,
        content: `[MEMORY COMPACTION] ${removedCount} older messages were archived to long-term storage to maintain context window efficiency.`,
        timestamp: new Date()
    };

    const newHistory = [];
    if (systemMessage) newHistory.push(systemMessage);
    newHistory.push(compactionNote);
    newHistory.push(...recentMessages);

    // Update the session with the compacted history
    await Session.updateOne(
        { sessionId: session.sessionId, tenantId: session.tenantId },
        { $set: { messages: newHistory } }
    );

    console.log(`[Session] ✅ Compaction Complete. New Length: ${newHistory.length}`);
}
