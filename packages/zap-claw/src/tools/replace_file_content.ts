import type { ChatCompletionTool } from "openai/resources/chat/completions.js";
import * as fs from "fs/promises";
import * as path from "path";

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "replace_file_content",
        description: "Write or replace the content of a file completely.",
        parameters: {
            type: "object",
            properties: {
                absolute_path: {
                    type: "string",
                    description: "The absolute path to the file.",
                },
                content: {
                    type: "string",
                    description: "The new complete content of the file.",
                },
            },
            required: ["absolute_path", "content"],
        },
    },
};

export async function handler(input: Record<string, unknown>): Promise<string> {
    const { absolute_path, content } = input as { absolute_path: string; content: string };
    try {
        await fs.mkdir(path.dirname(absolute_path), { recursive: true });
        await fs.writeFile(absolute_path, content, "utf-8");
        return `Successfully wrote to ${absolute_path}`;
    } catch (e: any) {
        throw new Error(`Failed to write file: ${e.message}`);
    }
}
