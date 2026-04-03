import { MongoClient } from "mongodb";
import { getGlobalMongoClient } from "../../db/mongo_client.js";

interface CacheEntry {
    promise: Promise<AgentBinding | null>;
    expiresAt: number;
}
const bindingCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60000; // 60 seconds

export interface AgentBinding {
    agentId: string;
    systemPrompt?: string;
    priority?: number;
    allowAutoListen?: boolean;
}

/**
 * The Filter (Mention-Only Gate): Drops non-mentioned group messages aggressively.
 */
export function passesMentionGate(
    chatType: string,
    text: string,
    botUsername: string,
    threadId?: string,
    allowAutoListen?: boolean
): boolean {
    const isGroup = chatType === "group" || chatType === "supergroup" || chatType === "channel";
    if (!isGroup) return true;

    // Threads implicitly act as continuation of an agent session
    if (threadId) return true;

    // Admin / Channel override
    if (allowAutoListen) return true;

    if (!text) return false;

    // Explicit mention check
    const mentionRegex = new RegExp(`@${botUsername}\\b`, "i");
    return mentionRegex.test(text);
}

/**
 * Dispatch Resolution (The Matrix): Returns the agent assigned to this channel/tenant route.
 */
export async function resolveAgentBinding(
    mongoUri: string,
    tenantId: string,
    platform: string,
    peerId: string,
    threadId?: string
): Promise<AgentBinding | null> {
    const cacheKey = `${tenantId}:${platform}:${peerId}:${threadId || "root"}`;
    const cached = bindingCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.promise;
    }

    const promise = (async () => {
        const client = await getGlobalMongoClient(mongoUri);
        try {
            const db = client.db("olympus");
            const col = db.collection(`${tenantId}_SYS_OS_bindings`);

            let match = await col.findOne(
                { platform, peerId, parentThreadId: threadId }, 
                { sort: { priority: -1 } }
            );
            
            if (!match) {
                match = await col.findOne(
                    { platform, peerId, $or: [{ parentThreadId: null }, { parentThreadId: { $exists: false } }] },
                    { sort: { priority: -1 } }
                );
            }

            if (!match) {
                match = await col.findOne(
                    { 
                        platform, 
                        $and: [
                            { $or: [{ peerId: null }, { peerId: { $exists: false } }] },
                            { $or: [{ parentThreadId: null }, { parentThreadId: { $exists: false } }] }
                        ]
                    },
                    { sort: { priority: -1 } }
                );
            }

            if (!match) return null; // Fail-Closed execution

            return {
                agentId: match.agentId,
                systemPrompt: match.systemPrompt,
                priority: match.priority,
                allowAutoListen: match.allowAutoListen === true
            };
        } catch (err) {
            console.error("[Dispatch Matrix] Database Error:", err);
            return null;
        }
    })();

    bindingCache.set(cacheKey, { promise, expiresAt: Date.now() + CACHE_TTL_MS });
    return promise;
}

/**
 * Fail-Closed Paranoia: Logs rejected traffic to the global Dead Letter Queue.
 */
export async function logDLQ(mongoUri: string, payload: any, reason: string): Promise<void> {
    const client = await getGlobalMongoClient(mongoUri);
    try {
        const db = client.db("olympus");
        await db.collection("SYS_OS_dead_letters").insertOne({
            event: "NATIVE_ROUTER_DROP",
            reason: reason,
            payload: payload,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("[DLQ Logger] Failed to write dead letter:", err);
    }
}
