export interface ToolMiddlewareContext {
    toolName: string;
    toolInput: Record<string, unknown>;
    userId: number;
    botName: string;
    sessionId?: string;
    
    // Outputs
    isAllowed: boolean;
    blockReason?: string;
    resultContent?: string;
    hadError?: boolean;
}

export type ToolMiddleware = (
    ctx: ToolMiddlewareContext,
    next: () => Promise<void>
) => Promise<void>;

/**
 * Runs a chain of middlewares sequentially. 
 * If a middleware doesn't call `await next()`, the chain halts.
 */
export async function runMiddlewarePipeline(
    middlewares: ToolMiddleware[],
    ctx: ToolMiddlewareContext
): Promise<void> {
    let index = -1;
    
    const dispatch = async (i: number): Promise<void> => {
        if (i <= index) throw new Error("next() called multiple times in middleware");
        index = i;
        const fn = middlewares[i];
        
        if (fn) {
            await fn(ctx, () => dispatch(i + 1));
        }
    };
    
    await dispatch(0);
}
