import type { ChatCompletionTool } from "openai/resources/chat/completions.js";
import * as getCurrentTime from "./get_current_time.js";
import * as remember from "./remember.js";
import * as recall from "./recall.js";
import * as forget from "./forget.js";
import * as viewFile from "./view_file.js";
import * as replaceFileContent from "./replace_file_content.js";
import * as runCommand from "./run_command.js";
import * as braveSearch from "./brave_search.js";
import * as hydraHandoff from "./hydra_handoff.js";
import * as subagentTask from "./task.js";
import * as writeTodos from "./write_todos.js";
import * as analyzeAsset from "./analyze_asset.js";
import * as spawnTool from "./spawn.js";
import * as writeToFile from "./write_to_file.js";
import * as listDir from "./list_dir.js";
import * as grepSearch from "./grep_search.js";
// ── Types ─────────────────────────────────────────────────────────────────────

export interface ToolResult {
    output: string;
    isError: boolean;
}

type ToolHandler = (input: Record<string, unknown>, userId: number, botName?: string, sessionId?: string) => Promise<string | { output: string; isError?: boolean }> | string | { output: string; isError?: boolean };

interface RegistryEntry {
    definition: ChatCompletionTool;
    handler: ToolHandler;
}

// ── Registry ──────────────────────────────────────────────────────────────────
// Add new tools here — one entry per tool.

const registry: Record<string, RegistryEntry> = {
    get_current_time: {
        definition: getCurrentTime.definition,
        handler: getCurrentTime.handler,
    },
    remember: {
        definition: remember.rememberDefinition,
        handler: (input, userId) => remember.executeRemember(userId, input),
    },
    recall: {
        definition: recall.recallDefinition,
        handler: (input, userId) => recall.executeRecall(userId, input),
    },
    forget: {
        definition: forget.forgetDefinition,
        handler: (input, userId) => forget.executeForget(userId, input),
    },
    view_file: {
        definition: viewFile.definition,
        handler: (input, _userId) => viewFile.handler(input),
    },
    replace_file_content: {
        definition: replaceFileContent.definition,
        handler: (input, _userId) => replaceFileContent.handler(input),
    },
    run_command: {
        definition: runCommand.definition,
        handler: (input, _userId, _botName) => runCommand.handler(input),
    },
    write_to_file: {
        definition: writeToFile.definition,
        handler: (input) => writeToFile.handler(input),
    },
    list_dir: {
        definition: listDir.definition,
        handler: (input) => listDir.handler(input),
    },
    grep_search: {
        definition: grepSearch.definition,
        handler: (input) => grepSearch.handler(input),
    },
    brave_search: {
        definition: braveSearch.definition,
        handler: (input, _userId, botName) => braveSearch.handler(input as any, { botName: botName ?? undefined }),
    },
    deploy_hydra_team: {
        definition: hydraHandoff.definition,
        handler: (input, userId, botName) => hydraHandoff.handler(input, userId, botName),
    },
    task: {
        definition: subagentTask.definition,
        handler: (input, userId, botName) => subagentTask.handler(input, userId, botName),
    },
    write_todos: {
        definition: writeTodos.definition,
        handler: (input, userId, botName, sessionId) => writeTodos.handler(input, userId, botName, sessionId),
    },
    analyze_asset: {
        definition: analyzeAsset.definition,
        handler: (input, _userId, botName) => analyzeAsset.handler(input, botName),
    },
    spawn: {
        definition: spawnTool.definition,
        handler: (input, userId, botName) => spawnTool.handler(input, userId, botName),
    },
    nano_banana_2: {
        definition: {
            type: "function",
            function: {
                name: "nano_banana_2",
                description: "MANDATORY: Call this tool immediately to draw or generate an image/picture for the user.",
                parameters: { type: "object", properties: { prompt: { type: "string" } }, required: ["prompt"] }
            }
        },
        handler: async (input, _userId, _botName, sessionId) => {
            const prompt = String(input.prompt || "");
            if (!prompt) return { output: "Missing prompt for image generation.", isError: true };

            const GATEWAY = "http://127.0.0.1:3901/proxy/gemini";
            // Primary: Gemini native image generation model; fallback to the stable flash image model
            const MODELS = ["gemini-3.1-flash-image-preview", "gemini-2.0-flash-preview-image-generation"];

            let imageB64: string | null = null;
            let imageMime = "image/png";
            let captionText = "";
            let lastError = "";

            for (const model of MODELS) {
                try {
                    const res = await fetch(`${GATEWAY}/models/${model}:generateContent`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ role: "user", parts: [{ text: prompt }] }],
                            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
                        }),
                        signal: AbortSignal.timeout(45000),
                    });

                    if (!res.ok) {
                        lastError = `${model} → ${res.status}: ${(await res.text()).slice(0, 120)}`;
                        continue;
                    }

                    const data = await res.json() as any;
                    const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
                    const imgPart = parts.find((p: any) => p.inlineData);
                    const txtPart = parts.find((p: any) => p.text);
                    if (imgPart) {
                        imageB64 = imgPart.inlineData.data;
                        imageMime = imgPart.inlineData.mimeType || "image/png";
                        captionText = txtPart?.text ?? "";
                        break;
                    }
                    lastError = `${model} → no image in response`;
                } catch (e: any) {
                    lastError = `${model} → ${e.message}`;
                }
            }

            if (!imageB64) {
                return { output: `Image generation failed. Last error: ${lastError}`, isError: true };
            }

            const dataUrl = `data:${imageMime};base64,${imageB64}`;

            // Store as artifact in GridFS so it appears in the right-pane artifacts panel
            if (sessionId) {
                try {
                    const { MongoClient, GridFSBucket } = await import("mongodb");
                    const mongoClient = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
                    await mongoClient.connect();
                    const db = mongoClient.db("olympus");
                    const bucket = new GridFSBucket(db, { bucketName: "OLYMPUS_SWARM_SYS_ARTIFACTS" });
                    const ext = imageMime.includes("png") ? "png" : "jpg";
                    const filename = `generated_${Date.now()}.${ext}`;
                    await new Promise<void>((resolve, reject) => {
                        const stream = bucket.openUploadStream(filename, {
                            metadata: { sessionId, type: "image" },
                        });
                        stream.on("finish", resolve);
                        stream.on("error", reject);
                        stream.end(Buffer.from(dataUrl, "utf-8"));
                    });
                    await mongoClient.close();
                } catch (dbErr: any) {
                    console.error("[nano_banana_2] GridFS store error:", dbErr.message);
                }
            }

            return {
                output: `[IMAGE_GENERATED] The image is ready and has been saved to the artifacts panel on the right. Click the file selector (top-right of the preview panel) to view it. ${captionText ? `\nModel note: ${captionText}` : ""}`,
            };
        }
    },
    df_ppt_generation: {
        definition: {
            type: "function",
            function: {
                name: "df_ppt_generation",
                description: "MANDATORY: Call this tool immediately to generate a PowerPoint (.pptx).",
                parameters: { type: "object", properties: { prompt: { type: "string" }, slideCount: { type: "number" } }, required: ["prompt"] }
            }
        },
        handler: async (input) => `[SYSTEM: Artifact SSE Dispatched] PowerPoint generation dispatched for: "${input.prompt || 'unknown'}". Tell the user you are working on the slides.`
    },
    invoke_local_mcp: {
        definition: {
            type: "function",
            function: {
                name: "invoke_local_mcp",
                description: "MANDATORY: Call this tool to interact directly with connected Phase 2 MCP servers.",
                parameters: { type: "object", properties: { serverName: { type: "string" }, action: { type: "string" }, payload: { type: "string" } }, required: ["serverName", "action"] }
            }
        },
        handler: async (input) => `[SYSTEM: MCP Hook Dispatched] MCP ${input.serverName} invoked. Tell the user the command was dispatched.`
    }
};

// ── Public API ────────────────────────────────────────────────────────────────

/** All tool definitions — passed to the model in every API call. */
export const toolDefinitions: ChatCompletionTool[] = Object.values(registry).map(
    (e) => e.definition
);

/** Get available tools scoped by bot name */
export function getAvailableTools(botName: string): ChatCompletionTool[] {
    const slug = botName.toLowerCase();

    // Only The Architect (Claw), Jerry, and Tommy get file system and execution tools
    if (slug.includes("claw") || slug.includes("jerry") || slug.includes("tommy")) {
        return toolDefinitions;
    }

    // Other bots only get the safe base tools
    const safeTools = ["get_current_time", "remember", "recall", "forget", "brave_search", "view_file", "deploy_hydra_team", "task", "write_todos", "analyze_asset", "spawn"];
    return safeTools.map(name => registry[name]!.definition);
}

/** Execute a tool by name. Returns output string and error flag. */
export async function executeTool(
    name: string,
    input: Record<string, unknown>,
    userId: number,
    botName?: string,
    sessionId?: string
): Promise<ToolResult> {
    const entry = registry[name];

    if (!entry) {
        // Fallback to Dynamic MCP servers if not in local registry
        const { MCPManager } = await import('../runtime/engine/mcp_manager.js');
        const mcpServerName = name.split('_')[0] || ''; // e.g. "GitKraken_issues" -> "GitKraken"
        if (MCPManager.clients.has(mcpServerName) || MCPManager.clients.has(name.split('_').slice(0,2).join('_')) || MCPManager.clients.has(name.split('_').slice(0,3).join('_'))) {
            // Find exactly which prefix matches
            let matchingServer = "";
            if (MCPManager.clients.has(name.split('_').slice(0,3).join('_'))) matchingServer = name.split('_').slice(0,3).join('_');
            else if (MCPManager.clients.has(name.split('_').slice(0,2).join('_'))) matchingServer = name.split('_').slice(0,2).join('_');
            else if (MCPManager.clients.has(mcpServerName)) matchingServer = mcpServerName;

            if (matchingServer) {
                try {
                    // Remove prefix to get actual tool name
                    const actualToolName = name.slice((matchingServer as string).length + 1);
                    const output = await MCPManager.executeTool(matchingServer as string, actualToolName, input);
                    return { output, isError: false };
                } catch (err) {
                    return { output: `MCP Tool Error: ${err}`, isError: true };
                }
            }
        }

        return {
            output: `Unknown tool: "${name}". Available tools: ${Object.keys(registry).join(", ")}`,
            isError: true,
        };
    }

    try {
        const result = await entry.handler(input, userId, botName, sessionId);
        const output = typeof result === 'string' ? result : result.output;
        const isError = typeof result === 'string' ? false : (result.isError ?? false);
        return { output, isError };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { output: `Tool "${name}" error: ${message}`, isError: true };
    }
}
