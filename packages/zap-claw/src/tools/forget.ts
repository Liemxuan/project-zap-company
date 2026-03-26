import { prisma } from '../db/client.js';
import type { ChatCompletionTool } from 'openai/resources/chat/completions.js';

export const forgetDefinition: ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'forget',
        description: 'Delete a specific memory by its string ID. Use this when the user explicitly asks you to forget something they previously told you, or if a fact is no longer correct.',
        parameters: {
            type: 'object',
            properties: {
                memory_id: {
                    type: 'string',
                    description: 'The string GUID/UUID of the memory to delete.',
                }
            },
            required: ['memory_id'],
        },
    },
};

export async function executeForget(userId: number, input: Record<string, unknown>): Promise<{ output: string }> {
    try {
        const memoryId = input['memory_id'] as string;
        if (!memoryId) {
            return { output: 'Error: memory_id (string) is required.' };
        }

        const result = await prisma.memoryFact.deleteMany({
            where: {
                id: memoryId,
                merchantId: userId.toString()
            }
        });

        if (result.count === 0) {
            return { output: `Error: No memory found with ID ${memoryId} for your user, or it was already deleted.` };
        }

        return { output: `Memory ${memoryId} has been successfully deleted.` };
    } catch (error: any) {
        return { output: `Error deleting memory: ${error.message}` };
    }
}
