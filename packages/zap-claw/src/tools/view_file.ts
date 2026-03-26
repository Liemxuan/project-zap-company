import type { ChatCompletionTool } from "openai/resources/chat/completions.js";
import * as fs from "fs/promises";
import * as path from "path";

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "view_file",
        description: "View the contents of a file.",
        parameters: {
            type: "object",
            properties: {
                absolute_path: {
                    type: "string",
                    description: "The absolute path to the file.",
                },
            },
            required: ["absolute_path"],
        },
    },
};

export async function handler(input: Record<string, unknown>): Promise<string> {
    const { absolute_path } = input as { absolute_path: string };
    try {
        const content = await fs.readFile(absolute_path, "utf-8");
        return content;
    } catch (e: any) {
        throw new Error(`Failed to read file: ${e.message}`);
    }
}
