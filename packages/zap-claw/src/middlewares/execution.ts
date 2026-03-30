import { ToolMiddleware } from "./pipeline.js";
import { executeTool } from "../tools/index.js";
import { Redis } from "ioredis";

// Reuse connection or create one for trace logging
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const ExecutionMiddleware: ToolMiddleware = async (ctx, next) => {
    // Only execute if previous middlewares (e.g. Guardrail, Sandbox) haven't blocked it
    if (ctx.isAllowed) {
        if (ctx.sessionId) {
            const startMsg = `\r\n> ⚙️ [tool execution] \`${ctx.toolName}\` (${JSON.stringify(ctx.toolInput)})\r\n`;
            await redis.rpush(`zap:trace:${ctx.sessionId}:logs`, startMsg);
            await redis.publish(`zap:trace:${ctx.sessionId}`, startMsg);
            // Expire the list so it doesn't grow forever
            await redis.expire(`zap:trace:${ctx.sessionId}:logs`, 3600);
        }

        const result = await executeTool(ctx.toolName, ctx.toolInput, ctx.userId, ctx.botName, ctx.sessionId);
        console.log(`[tool result] ${ctx.toolName}:`, result.output);
        
        if (ctx.sessionId) {
            const endMsg = `\r\n> ✅ [tool result] \`${ctx.toolName}\`:\r\n${result.output}\r\n`;
            await redis.rpush(`zap:trace:${ctx.sessionId}:logs`, endMsg);
            await redis.publish(`zap:trace:${ctx.sessionId}`, endMsg);
        }
        
        if (result.isError) {
            ctx.hadError = true;
        }
        
        ctx.resultContent = result.output;
    }
    
    await next();
};
