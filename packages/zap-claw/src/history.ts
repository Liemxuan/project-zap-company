import { prisma } from './db/client.js';

export interface Message {
  id?: number | string;
  user_id: number;
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  tool_name?: string | null;
  created_at?: number | Date;
}

export async function getHistory(userId: number, accountType: string = "PERSONAL", limit = 20): Promise<Message[]> {
  const rows = await prisma.interaction.findMany({
    where: {
      sessionId: userId.toString(),
      accountType: accountType
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  // Reverse so chronologically ordered messages go into LLM
  return rows.reverse().map(r => {
    let content = r.content;
    let tool_name: string | null = null;

    if (content.startsWith("[Tool: ")) {
      if (r.role === 'ASSISTANT') {
        // Assistant tool_calls are usually stringified JSON arrays like [Tool: [{"id":...}]]
        const match = content.match(/^\[Tool: (\[.*?\])\]\s*([\s\S]*)$/);
        if (match) {
          tool_name = match[1] || null;
          content = match[2] || "";
        } else {
          // Fallback for edge cases
          const fallbackMatch = content.match(/^\[Tool: (.*?)\]\s*([\s\S]*)$/);
          if (fallbackMatch) {
            tool_name = fallbackMatch[1] || null;
            content = fallbackMatch[2] || "";
          }
        }
      } else if (r.role === 'TOOL') {
        // Tool results are usually [Tool: function-call-id]
        const match = content.match(/^\[Tool: ([a-zA-Z0-9_-]+)\]\s*([\s\S]*)$/);
        if (match) {
          tool_name = match[1] || null;
          content = match[2] || "";
        } else {
          // Fallback
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
      user_id: parseInt(r.sessionId, 10),
      role: r.role.toLowerCase() as any,
      content: content,
      tool_name,
      created_at: r.createdAt
    };
  });
}

export async function appendMessage(
  userId: number,
  role: 'user' | 'assistant' | 'tool' | 'system',
  content: string,
  accountType: string = "PERSONAL",
  toolName?: string | null,
  promptTokens?: number | null,
  completionTokens?: number | null,
  totalTokens?: number | null
): Promise<void> {
  const MAX_PAYLOAD_SIZE = 50000;
  let finalContent = toolName ? `[Tool: ${toolName}] ${content}` : content;

  if (finalContent.length > MAX_PAYLOAD_SIZE) {
    console.warn(`[history] ⚡ Truncating massive message for user ${userId} (${finalContent.length} chars)`);
    finalContent = finalContent.substring(0, MAX_PAYLOAD_SIZE) + "\n\n... [TRUNCATED due to size limit]";
  }

  await prisma.interaction.create({
    data: {
      sessionId: userId.toString(),
      role: role.toUpperCase(),
      content: finalContent,
      accountType: accountType,
      promptTokens: promptTokens ?? null,
      completionTokens: completionTokens ?? null,
      totalTokens: totalTokens ?? null
    }
  });
}


export async function pruneHistory(userId: number, keepLast = 200): Promise<void> {
  const toKeep = await prisma.interaction.findMany({
    where: { sessionId: userId.toString() },
    orderBy: { createdAt: 'desc' },
    take: keepLast,
    select: { id: true }
  });

  const keepIds = toKeep.map(row => row.id);

  await prisma.interaction.deleteMany({
    where: {
      sessionId: userId.toString(),
      id: { notIn: keepIds }
    }
  });
}
