import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";

export interface SessionData {
    sessionId: string;
    chatId: number;
    threadId?: number;
    tenantId: string;
    lastActive: Date;
    status: "ACTIVE" | "COMPACTING" | "CLOSED";
}

/**
 * Gets or creates an active session for a specific Telegram Chat ID and Thread ID.
 * If the current session has timed out (e.g., 4 hours of inactivity),
 * it marks it as CLOSED and generates a new one.
 */
export async function getOrCreateSession(chatId: number, tenantId: string, threadId?: number): Promise<string> {
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const sessionsCol = db.collection<SessionData>("SYS_OS_active_sessions");

        const query: any = { chatId, status: "ACTIVE" };
        if (threadId) query.threadId = threadId;

        const session = await sessionsCol.findOne(query);

        const now = new Date();
        const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

        if (session) {
            const timeSinceLastActive = now.getTime() - session.lastActive.getTime();
            if (timeSinceLastActive > FOUR_HOURS_MS) {
                // Timeout: Close old session
                await sessionsCol.updateOne({ _id: session._id }, { $set: { status: "CLOSED" } });
                console.log(`[SessionManager] Closed stale session ${session.sessionId} due to timeout.`);
            } else {
                // Heartbeat: Update lastActive
                await sessionsCol.updateOne({ _id: session._id }, { $set: { lastActive: now } });
                return session.sessionId;
            }
        }

        // Create new session
        const newSessionId = `SES-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        const sessionPayload: any = {
            sessionId: newSessionId,
            chatId,
            tenantId,
            lastActive: now,
            status: "ACTIVE"
        };

        if (threadId !== undefined) {
            sessionPayload.threadId = threadId;
        }

        await sessionsCol.insertOne(sessionPayload);

        console.log(`[SessionManager] Generated new active session: ${newSessionId}`);
        return newSessionId;
    } finally {
        await client.close();
    }
}

/**
 * Explicitly terminates a session (e.g., triggered by /new)
 */
export async function terminateSession(chatId: number): Promise<boolean> {
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const sessionsCol = db.collection<SessionData>("SYS_OS_active_sessions");
        const result = await sessionsCol.updateMany(
            { chatId, status: "ACTIVE" },
            { $set: { status: "CLOSED" } }
        );
        return result.modifiedCount > 0;
    } finally {
        await client.close();
    }
}
