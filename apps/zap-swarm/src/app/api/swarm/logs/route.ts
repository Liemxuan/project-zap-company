import { NextResponse } from "next/server";
import Redis from "ioredis";

// This endpoint streams execution logs over SSE (Server-Sent Events)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const containerName = searchParams.get("container");

    if (!containerName) {
        return new Response(JSON.stringify({ error: "Missing container parameter" }), { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const redisStr = process.env.REDIS_URL || "redis://localhost:6379";
            // We need two Redis instances: one for polling commands (lrange), one for subscribing (pubsub)
            const redisData = new Redis(redisStr);
            const redisSub = new Redis(redisStr);

            const sendEvent = (data: string) => {
                try {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ logs: data })}\n\n`));
                } catch (e) {
                    console.error("SSE Error writing to stream", e);
                }
            };

            // 1. Fetch historical trace logs (to prepopulate terminal)
            try {
                const history = await redisData.lrange(`zap:trace:${containerName}:logs`, 0, -1);
                if (history && history.length > 0) {
                    sendEvent(history.join(""));
                } else {
                    sendEvent(`> Initializing Trace Stream for session/container '${containerName}'...\r\n`);
                }
            } catch (err) {
                sendEvent(`> Redis initialization error... waiting for live stream.\r\n`);
            }

            // 2. Subscribe to realtime updates
            redisSub.subscribe(`zap:trace:${containerName}`);
            redisSub.on("message", (channel, message) => {
                if (channel === `zap:trace:${containerName}`) {
                    sendEvent(message);
                }
            });

            // 3. Keepalive ping every 10 seconds to prevent SSE timeout
            const pingInterval = setInterval(() => {
                sendEvent(""); // empty means no logs, just KeepAlive
            }, 10000);

            // Cleanup when context is aborted
            req.signal.addEventListener("abort", () => {
                clearInterval(pingInterval);
                redisSub.quit();
                redisData.quit();
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    });
}
