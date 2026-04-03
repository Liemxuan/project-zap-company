/**
 * ZAP Adapters — Bridge between ConversationRuntime and existing infrastructure
 * 
 * These adapters wrap the legacy omni_router, tool registry, and Redis pub/sub
 * to implement the new typed interfaces (ApiClient, ToolExecutor, PermissionPrompter).
 */

import type {
  ApiClient,
  ApiRequest,
  AssistantEvent,
  ToolExecutor,
  ToolDefinition,
  ToolResult,
  PermissionPrompter,
  PermissionRequest,
  PermissionPromptDecision,
  PermissionMode,
} from "./types.js";

// ─── OmniApiClient ──────────────────────────────────────────────────────

/**
 * Wraps generateOmniContent from omni_router.ts to implement ApiClient.
 * Converts our ConversationMessage format → OpenAI ChatCompletionMessageParam
 * and yields AssistantEvents from the OmniResponse.
 */
export class OmniApiClient implements ApiClient {
  private tier: "A_ECONOMIC" | "B_PRODUCTIVITY" | "C_PRECISION";
  private agentId: string;
  private modelOverride: string | undefined;

  constructor(
    tier: "A_ECONOMIC" | "B_PRODUCTIVITY" | "C_PRECISION" = "B_PRODUCTIVITY",
    agentId: string = "OLYMPUS",
    modelOverride: string | undefined = undefined
  ) {
    this.tier = tier;
    this.agentId = agentId;
    this.modelOverride = modelOverride;
  }

  async *stream(request: ApiRequest): AsyncIterable<AssistantEvent> {
    const { generateOmniContent } = await import(
      "../engine/omni_router.js"
    );

    // Convert ConversationMessage[] → OpenAI ChatCompletionMessageParam[]
    const messages = request.messages.map(messageToChatCompletion);

    // Convert ToolDefinition[] → OpenAI ChatCompletionTool[]
    const tools = request.tools ? request.tools.map(toolDefToOpenAI) : [];

    const omniResponse = await generateOmniContent(
      {
        apiKey: "",
        defaultModel: this.modelOverride ?? "google/gemini-1.5-pro",
        agentId: this.agentId,
      } as any,
      {
        systemPrompt: request.systemPrompt.join("\n\n"),
        messages,
        theme: this.tier,
        intent: "GENERAL" as const,
        tools,
        ...(this.modelOverride && { forceModel: true }),
      }
    );

    // Yield text content
    if (omniResponse.text) {
      yield { type: "text_delta", text: omniResponse.text };
    }

    // Yield tool use blocks
    if (omniResponse.toolCalls && omniResponse.toolCalls.length > 0) {
      for (const call of omniResponse.toolCalls) {
        yield {
          type: "tool_use",
          id: call.id,
          name: call.function?.name ?? "unknown",
          input: call.function?.arguments ?? "{}",
        };
      }
    }

    // Yield usage
    yield {
      type: "usage",
      usage: {
        inputTokens: omniResponse.tokensUsed.prompt,
        outputTokens: omniResponse.tokensUsed.completion,
        cacheReadInputTokens: omniResponse.tokensUsed.cached || 0,
      },
    };

    // Always yield message_stop
    yield { type: "message_stop" };
  }
}

// ─── ZapToolExecutor ────────────────────────────────────────────────────

/**
 * Wraps the existing tools/index.ts executeTool + getAvailableTools
 * to implement the ToolExecutor interface.
 */
export class ZapToolExecutor implements ToolExecutor {
  private botName: string;
  private userId: number;
  private sessionId: string | undefined;
  private dynamicHandlers: Record<string, any>;

  constructor(
    botName: string = "Jerry",
    userId: number = 999999,
    sessionId: string | undefined = undefined,
    dynamicHandlers: Record<string, any> = {}
  ) {
    this.botName = botName;
    this.userId = userId;
    this.sessionId = sessionId;
    this.dynamicHandlers = dynamicHandlers;
  }

  async execute(toolName: string, input: string): Promise<ToolResult> {
    // 1. Check dynamic handlers first
    if (this.dynamicHandlers[toolName]) {
      const handler = this.dynamicHandlers[toolName];
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(input);
      } catch {
        parsed = { raw: input };
      }
      
      const result = await handler(parsed, this.userId, this.botName, this.sessionId);
      if (typeof result === "string") {
        return { output: result, isError: false };
      }
      return {
        output: result.output,
        isError: !!result.isError
      };
    }

    // 2. Fallback to legacy registry
    const { executeTool } = await import("../../tools/index.js");

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(input);
    } catch {
      parsed = { raw: input };
    }

    return executeTool(toolName, parsed, this.userId, this.botName, this.sessionId);
  }

  async getDefinitions(): Promise<ToolDefinition[]> {
    // Lazy import to avoid circular deps at module load
    const { getAvailableTools } = await import("../../tools/index.js");
    const openAITools = getAvailableTools(this.botName);

    return (openAITools as any[]).map((t: any): ToolDefinition => ({
      name: t.function.name,
      description: t.function.description ?? "",
      inputSchema: t.function.parameters ?? {},
    }));
  }
}

// ─── RedisPermissionPrompter ────────────────────────────────────────────

/**
 * Publishes permission requests to Redis for the Swarm UI approval workflow.
 * Falls back to auto-allow for non-interactive contexts (Telegram, etc).
 */
export class RedisPermissionPrompter implements PermissionPrompter {
  private sessionId: string;
  private autoApprove: boolean;

  constructor(sessionId: string, autoApprove: boolean = false) {
    this.sessionId = sessionId;
    this.autoApprove = autoApprove;
  }

  async decide(request: PermissionRequest): Promise<PermissionPromptDecision> {
    if (this.autoApprove) {
      return { type: "allow" };
    }

    // For now, auto-allow read-only and workspace-write tools
    // Prompt only for danger-full-access and above
    if (
      request.requiredMode === "read-only" ||
      request.requiredMode === "workspace-write"
    ) {
      return { type: "allow" };
    }

    // TODO: Implement Redis pub/sub approval flow for the Swarm UI
    // For Phase 1 wire-in, we auto-allow to match existing behavior
    console.log(
      `[ConversationRuntime] ⚠️ Auto-approving '${request.toolName}' (permission prompt not yet wired to UI)`
    );
    return { type: "allow" };
  }
}

// ─── Conversion Helpers ─────────────────────────────────────────────────

import type { ConversationMessage } from "./types.js";

function messageToChatCompletion(msg: ConversationMessage): any {
  switch (msg.role) {
    case "user": {
      const textParts = msg.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text);
      return { role: "user", content: textParts.join("\n") };
    }

    case "assistant": {
      const content = msg.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text)
        .join("");

      const toolUses = msg.blocks.filter((b) => b.type === "tool_use");

      if (toolUses.length > 0) {
        return {
          role: "assistant",
          content: content || null,
          tool_calls: toolUses.map((b: any) => ({
            id: b.id,
            type: "function",
            function: {
              name: b.name,
              arguments: b.input,
            },
          })),
        };
      }

      return { role: "assistant", content };
    }

    case "tool": {
      const result = msg.blocks.find((b) => b.type === "tool_result") as any;
      if (result) {
        return {
          role: "tool",
          tool_call_id: result.toolUseId,
          content: result.content,
        };
      }
      return { role: "tool", tool_call_id: "unknown", content: "(no result)" };
    }

    case "system": {
      const text = msg.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text)
        .join("\n");
      return { role: "system", content: text };
    }

    default:
      return { role: msg.role, content: "(unknown)" };
  }
}

function toolDefToOpenAI(def: ToolDefinition): any {
  return {
    type: "function",
    function: {
      name: def.name,
      description: def.description,
      parameters: def.inputSchema,
    },
  };
}
