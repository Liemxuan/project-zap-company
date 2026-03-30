import type { ChatCompletionTool } from "openai/resources/chat/completions.js";

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "analyze_asset",
        description: "Extract OCR text, structured UI layouts, and visual descriptions from a downloaded image or PDF asset. Use this on file paths provided by [ASSET INGESTED: ...].",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "The absolute path to the asset file (e.g., /tmp/zap-assets/...)",
                },
            },
            required: ["path"],
        },
    },
};

export async function handler(input: Record<string, unknown>, botName?: string): Promise<{ output: string; isError?: boolean }> {
    // The actual Vision execution is intercepted and handled by the UploadsMiddleware.
    // If we reach this handler, the middleware pipeline was bypassed or failed.
    return { output: "System Warning: UploadsMiddleware did not intercept this asset analysis request.", isError: true };
}
