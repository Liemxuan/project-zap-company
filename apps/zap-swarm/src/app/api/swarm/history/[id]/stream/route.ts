// Olympus ID: OLY-SWARM
// SSE endpoint for real-time message history streaming.
// Subscribes to Redis trace channel for instant reply detection,
// then fetches structured messages from Claw history API.

import Redis from "ioredis";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../../lib/mongo";

const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = await params;

    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Missing session ID" }), { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            const redisStr = process.env.REDIS_URL || "redis://localhost:6379";
            const redisSub = new Redis(redisStr);

            let lastMessageCount = 0;
            let lastContentHash = "";
            let lastJobHash = "";
            let lastTitleHash = "";
            let lastSuggestionsHash = "";
            let lastInterruptHash = "";

            const sendEvent = (event: string, data: object) => {
                try {
                    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                } catch (e: any) {
                    logger.error("[history/stream] SSE write error", { error: e?.message });
                }
            };

            const fetchAndPush = async () => {
                try {
                    // Run Claw history fetch and all MongoDB queries in parallel
                    const mongoClient = await getGlobalMongoClient();
                    const db = mongoClient.db("olympus");
                    const query = { "historyContext.sessionId": sessionId };

                    const [historyRes, activeJobs, dlqJobs, titleDoc, suggestionsDoc, interruptDoc] = await Promise.all([
                        fetch(`${CLAW_URL}/api/history/${sessionId}?accountType=OLYMPUS_SWARM`, {
                            signal: AbortSignal.timeout(2000),
                        }).catch(() => null),
                        db.collection("OLYMPUS_SWARM_SYS_OS_job_queue")
                            .find(query).sort({ createdAt: -1 }).limit(10).toArray(),
                        db.collection("SYS_OS_dead_letters")
                            .find(query).sort({ timestamp: -1 }).limit(5).toArray(),
                        db.collection("SYS_OS_session_titles").findOne({ sessionId }),
                        db.collection("SYS_OS_followup_suggestions").findOne({ sessionId }),
                        db.collection("SYS_OS_interrupts").findOne({ sessionId, status: "pending" }),
                    ]);

                    // 1. Chat History
                    if (historyRes?.ok) {
                        const data = await historyRes.json();
                        if (data.history && data.history.length > 0) {
                            const messages = data.history.map((h: any) => ({
                                id: h.id?.toString() || h._id?.toString(),
                                role: h.role === "user" ? "user" : "agent",
                                originalRole: h.role,
                                content: h.tool_name ? `[Tool: ${h.tool_name}]\n${h.content}` : h.content,
                                toolName: h.tool_name || null,
                                timestamp: h.created_at,
                            }));

                            const newCount = messages.length;
                            const newHash = messages[messages.length - 1]?.content?.slice(0, 100) || "";

                            if (newCount !== lastMessageCount || newHash !== lastContentHash) {
                                lastMessageCount = newCount;
                                lastContentHash = newHash;
                                sendEvent("messages", { messages });
                            }
                        }
                    }

                    // 2. Job Queue
                    const tasks = [...activeJobs, ...dlqJobs];
                    const jobHash = JSON.stringify(tasks.map(t => `${t._id}-${t.status}`));
                    if (jobHash !== lastJobHash) {
                        lastJobHash = jobHash;
                        sendEvent("jobs", { tasks });
                    }

                    // 3. Title
                    const currentTitle = titleDoc?.title || "";
                    if (currentTitle !== lastTitleHash) {
                        lastTitleHash = currentTitle;
                        sendEvent("title", { title: currentTitle });
                    }

                    // 4. Suggestions
                    const currentSuggestionsHash = JSON.stringify(suggestionsDoc?.suggestions || []);
                    if (currentSuggestionsHash !== lastSuggestionsHash) {
                        lastSuggestionsHash = currentSuggestionsHash;
                        sendEvent("suggestions", { suggestions: suggestionsDoc?.suggestions || [] });
                    }

                    // 5. Interrupt (HITL)
                    const interruptHash = interruptDoc ? interruptDoc._id.toString() : "";
                    if (interruptHash !== lastInterruptHash) {
                        lastInterruptHash = interruptHash;
                        if (interruptDoc) {
                            sendEvent("interrupt", {
                                interruptId: interruptDoc._id.toString(),
                                question: interruptDoc.question,
                                type: interruptDoc.type || "ask",
                            });
                        } else {
                            sendEvent("interrupt", { interruptId: null });
                        }
                    }

                } catch (err: any) {
                    if (err?.name !== "AbortError") {
                        logger.error("[history/stream] Fetch error:", err?.message);
                    }
                }
            };

            // 1. Send initial history immediately without blocking the stream connection
            fetchAndPush().catch(e => logger.error("Initial fetchAndPush failed:", e));

            // 2. Subscribe to Redis trace channel — triggers instant fetch on reply
            redisSub.subscribe(`zap:trace:${sessionId}`);
            redisSub.on("message", async (channel, message) => {
                if (channel === `zap:trace:${sessionId}`) {
                    // Notify client that agent is working (for typing indicator)
                    if (message.includes("[status]") || message.includes("[tool execution]")) {
                        sendEvent("status", { type: "working", detail: message.trim() });
                    }
                    // When an interrupt is published, fetch immediately
                    if (message.includes("[interrupt]")) {
                        setTimeout(() => fetchAndPush(), 150);
                    }
                    // When a reply lands, extract text and stream it immediately before MongoDB write settles
                    if (message.includes("[reply]")) {
                        const replyMatch = message.match(/\[reply\]\s*([\s\S]+?)(?:\r?\n\s*)?$/);
                        const replyContent = replyMatch?.[1]?.trim();
                        if (replyContent) {
                            sendEvent("reply_preview", { content: replyContent });
                        }
                        sendEvent("status", { type: "reply_incoming" });
                        // Small delay to let MongoDB write settle
                        setTimeout(() => fetchAndPush(), 300);
                    }
                }
            });

            // 3. Fallback polling every 3s (in case Redis misses something)
            const pollInterval = setInterval(fetchAndPush, 3000);

            // 4. Keepalive every 15s to prevent SSE timeout
            const pingInterval = setInterval(() => {
                sendEvent("ping", { ts: Date.now() });
            }, 15000);

            // Cleanup on disconnect
            req.signal.addEventListener("abort", () => {
                clearInterval(pollInterval);
                clearInterval(pingInterval);
                redisSub.quit();
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "Content-Encoding": "none",
        },
    });
}
