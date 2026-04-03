import { ToolMiddleware } from "./pipeline.js";

/**
 * Memory Inject Middleware
 * Before LLM call: recall relevant memories from Redis→Mongo→Chroma
 * and inject them into the tool context for the agent to use.
 */
export const MemoryInjectMiddleware: ToolMiddleware = async (ctx, next) => {
  try {
    // Only inject memory for chat-related tools
    const chatTools = ['chat', 'task', 'spawn'];
    if (!chatTools.includes(ctx.toolName)) {
      await next();
      return;
    }

    const message = (ctx.toolInput.message as string) || (ctx.toolInput.objective as string) || '';
    if (!message || message.length < 10) {
      await next();
      return;
    }

    // Direct import of mongodb to avoid circular deps and missing files
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017", { serverSelectionTimeoutMS: 2000 });
    const db = client.db("zap_swarm");
    const tenantId = (ctx.toolInput.tenantId as string) || 'ZVN';

    // Layer 1: MongoDB memory recall (fast, structured)
    const memCol = db.collection(`${tenantId}_SYS_CLAW_memory`);
    const recentMemories = await memCol
      .find({ agentSource: ctx.botName })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    if (recentMemories.length > 0) {
      const memoryContext = recentMemories
        .map((m: any) => `[Memory] ${m.content || m.text || JSON.stringify(m)}`)
        .join('\n');

      // Inject into toolInput as additional context
      ctx.toolInput._injectedMemory = memoryContext;
    }
    await client.close();
  } catch (err) {
    // Memory injection is non-blocking — log and continue
    console.warn('[MemoryInject] Failed to recall memories:', (err as Error).message);
  }

  await next();
};
