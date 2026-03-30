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
    const safeTools = ["get_current_time", "remember", "recall", "forget", "brave_search", "view_file", "deploy_hydra_team", "task", "write_todos", "analyze_asset"];
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
