import { prisma } from './db/client.js';
import { Redis } from "ioredis";

// Task 5.1: ThreadData KV Caching
// Ephemeral Redis layer where active conversational context lives during bursts.
export const ThreadDataMiddleware = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const THREAD_DATA_TTL = 3600; // 1 hour memory burst retention


export interface Message {
  id?: number | string;
  user_id: number;
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  tool_name?: string | null;
  created_at?: number | Date;
}

export async function getHistory(userId: string | number, accountType: string = "PERSONAL", limit = 20): Promise<Message[]> {
  const cacheKey = `thread_data:history:${userId}:${accountType}`;
  try {
    const cached = await ThreadDataMiddleware.lrange(cacheKey, 0, limit - 1);
    if (cached && cached.length > 0) {
      console.log(`[ThreadDataMiddleware] ⚡ Cache HIT for user ${userId} (${cached.length} records)`);
      return cached.map(c => JSON.parse(c)).reverse().map(parserMessageFormatter);
    }
  } catch (e) {
    console.warn(`[ThreadDataMiddleware] Redis failure on get:`, e);
  }

  // Fallback to Long-Term DB
  const rows = await prisma.interaction.findMany({
    where: {
      sessionId: userId.toString(),
      accountType: accountType
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  // Hotload the cache to catch incoming bursts
  if (rows.length > 0) {
    try {
      const pipeline = ThreadDataMiddleware.pipeline();
      pipeline.del(cacheKey);
      for (const row of rows) {
        pipeline.rpush(cacheKey, JSON.stringify(row));
      }
      pipeline.expire(cacheKey, THREAD_DATA_TTL);
      await pipeline.exec();
    } catch (e) {
      console.warn(`[ThreadDataMiddleware] Failed to hotload cache:`, e);
    }
  }

  // Reverse so chronologically ordered messages go into LLM
  return rows.reverse().map(parserMessageFormatter);
}

function parserMessageFormatter(r: any): Message {
    let content = r.content;
    let tool_name: string | null = null;

    if (content.startsWith("[Tool: ")) {
      if (r.role === 'ASSISTANT') {
        const match = content.match(/^\[Tool: (\[.*?\])\]\s*([\s\S]*)$/);
        if (match) {
          tool_name = match[1] || null;
          content = match[2] || "";
        } else {
          const fallbackMatch = content.match(/^\[Tool: (.*?)\]\s*([\s\S]*)$/);
          if (fallbackMatch) {
            tool_name = fallbackMatch[1] || null;
            content = fallbackMatch[2] || "";
          }
        }
      } else if (r.role === 'TOOL') {
        const match = content.match(/^\[Tool: ([a-zA-Z0-9_-]+)\]\s*([\s\S]*)$/);
        if (match) {
          tool_name = match[1] || null;
          content = match[2] || "";
        } else {
          const fallbackMatch = content.match(/^\[Tool: (.*?)\]\s*([\s\S]*)$/);
          if (fallbackMatch) {
            tool_name = fallbackMatch[1] || null;
            content = fallbackMatch[2] || "";
          }
        }
      }
    }

    return {
      id: r.id,
      user_id: r.sessionId || r.user_id?.toString() || "0",
      role: r.role.toLowerCase() as any,
      content: content,
      tool_name,
      created_at: r.createdAt || r.created_at
    };
}

export async function appendMessage(
  userId: string | number,
  role: 'user' | 'assistant' | 'tool' | 'system',
  content: string,
  accountType: string = "PERSONAL",
  toolName?: string | null,
  promptTokens?: number | null,
  completionTokens?: number | null,
  totalTokens?: number | null
): Promise<void> {
  let MAX_PAYLOAD_SIZE = 50000;
  
  if (role === 'tool' || toolName) {
    const isMassiveTool = toolName === "run_command" || toolName?.startsWith("mcp_");
    MAX_PAYLOAD_SIZE = isMassiveTool ? 5000 : 20000;
  }

  let finalContent = toolName ? `[Tool: ${toolName}] ${content}` : content;

  if (finalContent.length > MAX_PAYLOAD_SIZE) {
    console.warn(`[history] ⚡ Truncating massive message for user ${userId} (${finalContent.length} chars, cap ${MAX_PAYLOAD_SIZE})`);
    finalContent = finalContent.substring(0, MAX_PAYLOAD_SIZE) + "\n\n... [TRUNCATED BY SYSTEM DUE TO PAYLOAD LIMIT]";
  }

  const cacheRecord = {
    sessionId: userId.toString(),
    role: role.toUpperCase(),
    content: finalContent,
    accountType: accountType,
    promptTokens: promptTokens ?? null,
    completionTokens: completionTokens ?? null,
    totalTokens: totalTokens ?? null,
    createdAt: new Date()
  };

  const cacheKey = `thread_data:history:${userId}:${accountType}`;
  try {
    const pipeline = ThreadDataMiddleware.pipeline();
    pipeline.lpush(cacheKey, JSON.stringify(cacheRecord)); // Push to front for latest
    pipeline.ltrim(cacheKey, 0, 99); // Keep latest 100 entries max in KV memory burst
    pipeline.expire(cacheKey, THREAD_DATA_TTL);
    await pipeline.exec();
    console.log(`[ThreadDataMiddleware] ✍️ Appended to Burst Cache for user ${userId}`);
  } catch (e) {
    console.warn(`[ThreadDataMiddleware] Redis failure on append:`, e);
  }

  // Still flush to DB asynchronously to not block the LLM loop
  prisma.interaction.create({
    data: cacheRecord
  }).catch((e: any) => console.error("[history] DB Async flush error:", e));
}


export async function pruneHistory(userId: string | number, keepLast = 200): Promise<void> {
  const toKeep = await prisma.interaction.findMany({
    where: { sessionId: userId.toString() },
    orderBy: { createdAt: 'desc' },
    take: keepLast,
    select: { id: true, role: true, content: true }
  });

  const keepIds = toKeep.map((row: any) => row.id);

  // Sweep and compact massive retained tool messages to clear memory pressure
  for (const row of toKeep) {
    if (row.role === 'TOOL' && row.content.length > 5000) {
      console.log(`[history] 🧹 Compacting retained massive tool output from history id: ${row.id}`);
      await prisma.interaction.update({
        where: { id: row.id },
        data: { content: "[COMPACTED BY SYSTEM: PAYLOAD LIMIT]" }
      });
    }
  }

  await prisma.interaction.deleteMany({
    where: {
      sessionId: userId.toString(),
      id: { notIn: keepIds }
    }
  });

  // Also truncate the burst cache explicitly when pruned
  try {
    const keys = await ThreadDataMiddleware.keys(`thread_data:history:${userId}:*`);
    for (const key of keys) {
      await ThreadDataMiddleware.del(key);
    }
  } catch(e) {}
}
