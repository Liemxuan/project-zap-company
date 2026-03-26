import { prisma } from '../db/client.js';
import type { ChatCompletionTool } from 'openai/resources/chat/completions.js';

export const rememberDefinition: ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'remember',
        description: 'Save a specific fact or preference about the user into long-term memory. Use this when the user tells you something important about themselves, their work, or their preferences.',
        parameters: {
            type: 'object',
            properties: {
                fact: {
                    type: 'string',
                    description: 'The core fact to remember (e.g. "user has a dog named Max", "user prefers dark mode").',
                },
                factType: {
                    type: 'string',
                    description: 'Categorization of the fact (e.g. "PREFERENCE", "TECHNICAL", "BIZ_LOGIC", "PERSONAL").',
                }
            },
            required: ['fact', 'factType'],
        },
    },
};

export async function executeRemember(userId: number, input: Record<string, unknown>): Promise<{ output: string }> {
    try {
        const fact = input['fact'] as string;
        const factType = (input['factType'] as string) || "PERSONAL";

        if (!fact) {
            return { output: 'Error: fact is required.' };
        }

        const memory = await prisma.memoryFact.create({
            data: {
                merchantId: userId.toString(),
                factType: factType.toUpperCase(),
                fact: fact,
            }
        });

        return { output: `Successfully remembered fact for future reference. Memory ID: ${memory.id}` };
    } catch (error: any) {
        return { output: `Error storing memory: ${error.message}` };
    }
}
