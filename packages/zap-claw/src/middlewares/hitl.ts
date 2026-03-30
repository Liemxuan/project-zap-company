import { ToolMiddleware, ToolMiddlewareContext } from "./pipeline.js";
import { Redis } from "ioredis";

const getRedisClient = () => {
    return new Redis(process.env.REDIS_URL || "redis://localhost:6379");
};

// Define explicit tools that require human approval before mutating systems or spanning heavy agents
const DANGEROUS_TOOLS = ["task", "run_command", "npm_install", "execute_bash", "delete_file", "git_commit"];

export const HitlMiddleware: ToolMiddleware = async (ctx, next) => {
    if (!ctx.isAllowed || ctx.hadError) {
        return next();
    }

    if (DANGEROUS_TOOLS.includes(ctx.toolName)) {
        console.log(`[hitl] 🚦 Pausing execution for ${ctx.toolName}. Awaiting user approval...`);
        
        const reqId = `hitl:${Date.now()}:${Math.random().toString(36).substring(2, 7)}`;
        
        const publisher = getRedisClient();
        const subscriber = getRedisClient();
        
        try {
            const hitlPayload = {
                botName: ctx.botName,
                userId: ctx.userId,
                sessionId: ctx.sessionId,
                toolName: ctx.toolName,
                toolInput: ctx.toolInput,
                reqId
            };
            
            // Subscribe to the direct response channel for this specific request
            await subscriber.subscribe(`zap:hitl:response:${reqId}`);
            
            // Publish the request outwards to `bot.ts` / Telegram listeners
            await publisher.publish("zap:hitl:request", JSON.stringify(hitlPayload));

            const approvalPromise = new Promise<{ approved: boolean, reason?: string }>((resolve) => {
                // Wait firmly for 15 minutes before collapsing the thread to avoid memory locks
                const timeout = setTimeout(() => {
                    resolve({ approved: false, reason: "HITL Request Timeout (15 minutes). Auto-denied." });
                }, 15 * 60 * 1000); 
                
                subscriber.on("message", (channel: string, message: string) => {
                    if (channel === `zap:hitl:response:${reqId}`) {
                        clearTimeout(timeout);
                        try {
                            const data = JSON.parse(message);
                            resolve(data);
                        } catch (e) {
                            resolve({ approved: false, reason: "Invalid JSON response from HITL broker" });
                        }
                    }
                });
            });
            
            const response = await approvalPromise;
            
            if (!response.approved) {
                ctx.isAllowed = false;
                ctx.hadError = true;
                ctx.resultContent = `[HITL DENIED] Execution of tool '${ctx.toolName}' was explicitly rejected by the human overseer. Reason: ${response.reason || "N/A"}`;
                console.log(`[hitl] 🛑 Request Denied: ${reqId}`);
                // Return early so execution middleware does not fire
                return; 
            }
            
            console.log(`[hitl] ✅ Request Approved: ${reqId}. Proceeding pipeline.`);
        } finally {
            subscriber.disconnect();
            publisher.disconnect();
        }
    }
    
    await next();
};
