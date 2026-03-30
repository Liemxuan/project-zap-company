import { ChatCompletionTool } from "openai/resources/chat/completions.js";

// Global KV store for active thread plans (ThreadKey -> string[])
export const activePlans = new Map<string, string[]>();

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "write_todos",
        description: "Drafts an explicit, multi-step execution plan before making structural changes or delegating concurrent subagents (Spike).",
        parameters: {
            type: "object",
            properties: {
                steps: {
                    type: "array",
                    items: { type: "string" },
                    description: "The sequence of discrete tasks that need to be accomplished."
                }
            },
            required: ["steps"]
        }
    }
};

export async function handler(input: any, userId: number, botName?: string, sessionId?: string): Promise<{ output: string; isError: boolean }> {
    if (!input.steps || !Array.isArray(input.steps)) {
        return { output: "Missing array of 'steps'.", isError: true };
    }
    
    const threadKey = `${userId}:${sessionId || 'default'}`;
    activePlans.set(threadKey, input.steps);
    
    return {
        output: `[PLAN MODE ENGAGED] Todo list securely stored for thread ${sessionId}. You may now safely delegate tasks simultaneously.`,
        isError: false
    };
}
