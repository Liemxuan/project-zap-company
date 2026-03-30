import { prisma } from '../db/client.js';
import type { ChatCompletionTool } from 'openai/resources/chat/completions.js';

export const recallDefinition: ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'recall',
        description: "Search the user's long-term memory for facts, preferences, or past information they have told you. Use this whenever the user references something from the past or asks if you remember something.",
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to look for in memory (e.g. "favorite color", "dog name", "project X").',
                }
            },
            required: ['query'],
        },
    },
};

export async function executeRecall(userId: number, input: Record<string, unknown>): Promise<{ output: string }> {
    try {
        const query = input['query'] as string;
        if (!query) return { output: 'Error: query is required.' };

        // Fallback to basic LIKE query since we disabled FTS5 raw queries for security
        const rows = await prisma.memoryFact.findMany({
            where: {
                merchantId: userId.toString(),
                fact: { contains: query }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        if (rows.length === 0) {
            return { output: 'No matching memories found.' };
        }

        const formatted = rows.map((r: any) =>
            `[Memory ID: ${r.id}] [Type: ${r.factType}] ${r.fact}`
        ).join('\n');

        return { output: `Found the following memories:\n${formatted}` };
    } catch (error: any) {
        return { output: `Error recalling memory: ${error.message}` };
    }
}
