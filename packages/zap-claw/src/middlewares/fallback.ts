import type { ToolMiddlewareContext, ToolMiddleware } from "./pipeline.js";

/**
 * FallbackMiddleware wraps the execution of tools to institute native provider redundancy.
 * If a tool (like an extraction subagent or a secondary LLM call) 500s or hits a rate-limit mid-stream,
 * this middleware intercepts the failure and can auto-failover or gracefully degrade the tool output
 * without crashing the parent extraction pipeline.
 */
export const FallbackMiddleware: ToolMiddleware = async (ctx, next) => {
    try {
        await next();
    } catch (error: any) {
        console.error(`[FallbackMiddleware] 🛡️ Intercepted tool crash in '${ctx.toolName}':`, error.message);
        ctx.hadError = true;
        
        // Check if the error is an API failure or Rate Limit
        const isRateLimit = error.message?.includes("429") || error.message?.includes("RATE LIMIT") || error.status === 429;
        const isServerError = error.message?.includes("500") || error.message?.includes("503") || error.status >= 500;
        
        if (isRateLimit || isServerError) {
            ctx.resultContent = `[SYSTEM REDUNDANCY WARNING] The tool '${ctx.toolName}' experienced a provider rate-limit or API failure during execution. The system intercepted this failure to prevent pipeline collapse. Please evaluate the partial state, simplify your request, or try an alternative fallback strategy.`;
        } else {
            ctx.resultContent = `[TOOL EXECUTION ERROR] '${ctx.toolName}' threw an unhandled exception: ${error.message}. Pipeline recovered safely.`;
        }
    }
};
