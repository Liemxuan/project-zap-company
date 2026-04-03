/**
 * ZAP Conversation Runtime
 * Ported from claw-code/rust/crates/runtime/src/conversation.rs (1,680 lines)
 * 
 * This is the core agentic loop. For each user turn:
 * 1. Push user message to session
 * 2. Stream API request to the LLM
 * 3. Build assistant message from events
 * 4. For each tool_use block:
 *    a. Run PreToolUse hooks → get permission context
 *    b. Check permission policy with hook overrides
 *    c. Execute tool via ToolExecutor
 *    d. Merge hook feedback into output
 *    e. Run PostToolUse / PostToolUseFailure hooks
 * 5. Auto-compact if token threshold exceeded
 * 6. Return structured TurnSummary
 */

import type {
  ApiClient,
  ApiRequest,
  AssistantEvent,
  ToolExecutor,
  ToolDefinition,
  PermissionPrompter,
  PermissionContext,
  PermissionOutcome,
  ConversationMessage,
  ConversationRuntimeConfig,
  ContentBlock,
  TextBlock,
  ToolUseBlock,
  TurnSummary,
  AutoCompactionEvent,
  TokenUsage,
  HookProgressReporter,
} from "./types.js";
import { RuntimeError, ToolError } from "./types.js";
import { Session } from "./session.js";
import { UsageTracker } from "./usage-tracker.js";
import { compactSession, estimateSessionTokens } from "./compaction.js";
import { HookRunner, HookAbortSignal, mergeHookFeedback } from "./hooks.js";
import { PermissionPolicy } from "./permissions.js";

const DEFAULT_MAX_ITERATIONS = 50;
const DEFAULT_AUTO_COMPACTION_THRESHOLD = 100_000; // tokens

export class ConversationRuntime {
  private session: Session;
  private apiClient: ApiClient;
  private toolExecutor: ToolExecutor;
  private permissionPolicy: PermissionPolicy;
  private systemPrompt: string[];
  private maxIterations: number;
  private usageTracker: UsageTracker;
  private hookRunner: HookRunner;
  private autoCompactionThreshold: number;
  private hookAbortSignal: HookAbortSignal;
  private hookProgressReporter?: HookProgressReporter;
  private dynamicTools: ToolDefinition[];

  // Lifecycle callback for streaming events to the UI (SSE, WebSocket, etc.)
  onAssistantEvent?: (event: AssistantEvent) => void;
  onToolStarted?: (toolName: string, iteration: number) => void;
  onToolFinished?: (toolName: string, isError: boolean, iteration: number) => void;
  onTurnProgress?: (iteration: number, pendingTools: number) => void;

  constructor(
    session: Session,
    apiClient: ApiClient,
    toolExecutor: ToolExecutor,
    permissionPolicy: PermissionPolicy,
    hookRunner: HookRunner,
    config: ConversationRuntimeConfig
  ) {
    this.session = session;
    this.apiClient = apiClient;
    this.toolExecutor = toolExecutor;
    this.permissionPolicy = permissionPolicy;
    this.hookRunner = hookRunner;
    this.systemPrompt = config.systemPrompt;
    this.maxIterations = config.maxIterations ?? DEFAULT_MAX_ITERATIONS;
    this.autoCompactionThreshold =
      config.autoCompactionThreshold ?? DEFAULT_AUTO_COMPACTION_THRESHOLD;
    this.usageTracker = new UsageTracker();
    this.hookAbortSignal = new HookAbortSignal();
    this.dynamicTools = config.dynamicTools ?? [];
  }

  // ─── Configuration ─────────────────────────────────────────────────

  setMaxIterations(n: number): this {
    this.maxIterations = n;
    return this;
  }

  setAutoCompactionThreshold(tokens: number): this {
    this.autoCompactionThreshold = tokens;
    return this;
  }

  setHookAbortSignal(signal: HookAbortSignal): this {
    this.hookAbortSignal = signal;
    return this;
  }

  setHookProgressReporter(reporter: HookProgressReporter): this {
    this.hookProgressReporter = reporter;
    return this;
  }

  // ─── Core Turn Loop ────────────────────────────────────────────────

  async runTurn(
    userInput: string,
    prompter?: PermissionPrompter
  ): Promise<TurnSummary> {
    // 1. Push user message
    this.session.pushUserText(userInput);

    const assistantMessages: ConversationMessage[] = [];
    const toolResults: ConversationMessage[] = [];
    let iterations = 0;

    // 2. Agentic loop
    while (true) {
      iterations++;
      if (iterations > this.maxIterations) {
        throw new RuntimeError(
          `Conversation loop exceeded maximum iterations (${this.maxIterations})`
        );
      }

      // 2a. Build and send API request
      const rawTools = [...(await this.toolExecutor.getDefinitions()), ...this.dynamicTools];
      const toolMap = new Map<string, ToolDefinition>();
      for (const t of rawTools) {
        toolMap.set(t.name, t);
      }
      const deDupedTools = Array.from(toolMap.values());

      const request: ApiRequest = {
        systemPrompt: this.systemPrompt,
        messages: this.session.messages,
        tools: deDupedTools,
      };

      const { assistantMessage, usage } = await this.streamApiRequest(request);

      if (usage) {
        this.usageTracker.record(usage);
      }

      // 2b. Extract pending tool uses
      const pendingToolUses = assistantMessage.blocks
        .filter((b): b is ToolUseBlock => b.type === "tool_use")
        .map(({ id, name, input }) => ({ id, name, input }));

      this.onTurnProgress?.(iterations, pendingToolUses.length);

      // Push assistant message to session
      this.session.pushMessage(assistantMessage);
      assistantMessages.push(assistantMessage);

      // 2c. If no tools requested, the turn is complete
      if (pendingToolUses.length === 0) {
        break;
      }

      // 2d. Execute each tool with full hook + permission pipeline
      for (const { id: toolUseId, name: toolName, input } of pendingToolUses) {
        const resultMessage = await this.executeToolWithPipeline(
          toolUseId,
          toolName,
          input,
          iterations,
          prompter
        );

        this.session.pushMessage(resultMessage);
        toolResults.push(resultMessage);
      }
    }

    // 3. Auto-compact if threshold exceeded
    const autoCompaction = this.maybeAutoCompact();

    return {
      assistantMessages,
      toolResults,
      iterations,
      usage: this.usageTracker.cumulativeUsage(),
      ...(autoCompaction ? { autoCompaction } : {}),
    };
  }

  // ─── Tool Execution Pipeline ───────────────────────────────────────

  private async executeToolWithPipeline(
    toolUseId: string,
    toolName: string,
    rawInput: string,
    iteration: number,
    prompter?: PermissionPrompter
  ): Promise<ConversationMessage> {
    // Phase 1: PreToolUse hook
    const preHookResult = await this.hookRunner.runPreToolUse(
      toolName,
      rawInput,
      this.hookAbortSignal,
      this.hookProgressReporter
    );

    // Effective input (hooks can modify tool input)
    const effectiveInput = preHookResult.updatedInput ?? rawInput;

    // Build permission context from hook result
    const permissionContext: PermissionContext = {
      ...(preHookResult.permissionOverride ? { override: preHookResult.permissionOverride } : {}),
      ...(preHookResult.permissionReason ? { reason: preHookResult.permissionReason } : {}),
    };

    // Phase 2: Determine permission outcome
    let permissionOutcome: PermissionOutcome;

    if (preHookResult.isCancelled) {
      permissionOutcome = {
        type: "deny",
        reason: formatHookMessage(preHookResult.messages, `PreToolUse hook cancelled tool '${toolName}'`),
      };
    } else if (preHookResult.isFailed) {
      permissionOutcome = {
        type: "deny",
        reason: formatHookMessage(preHookResult.messages, `PreToolUse hook failed for tool '${toolName}'`),
      };
    } else if (preHookResult.isDenied) {
      permissionOutcome = {
        type: "deny",
        reason: formatHookMessage(preHookResult.messages, `PreToolUse hook denied tool '${toolName}'`),
      };
    } else {
      permissionOutcome = await this.permissionPolicy.authorizeWithContext(
        toolName,
        effectiveInput,
        permissionContext,
        prompter
      );
    }

    // Phase 3: Execute or deny
    if (permissionOutcome.type === "deny") {
      return Session.toolResult(
        toolUseId,
        toolName,
        mergeHookFeedback(preHookResult.messages, permissionOutcome.reason, true),
        true
      );
    }

    // Phase 4: Execute the tool
    this.onToolStarted?.(toolName, iteration);

    let output: string;
    let isError: boolean;

    try {
      const result = await this.toolExecutor.execute(toolName, effectiveInput);
      output = result.output;
      isError = result.isError;
    } catch (err) {
      output = err instanceof Error ? err.message : String(err);
      isError = true;
    }

    // Merge pre-hook feedback
    output = mergeHookFeedback(preHookResult.messages, output, false);

    // Phase 5: PostToolUse hook
    const postHookResult = isError
      ? await this.hookRunner.runPostToolUseFailure(
          toolName,
          effectiveInput,
          output,
          this.hookAbortSignal,
          this.hookProgressReporter
        )
      : await this.hookRunner.runPostToolUse(
          toolName,
          effectiveInput,
          output,
          false,
          this.hookAbortSignal,
          this.hookProgressReporter
        );

    if (postHookResult.isDenied || postHookResult.isFailed || postHookResult.isCancelled) {
      isError = true;
    }

    output = mergeHookFeedback(
      postHookResult.messages,
      output,
      postHookResult.isDenied || postHookResult.isFailed || postHookResult.isCancelled
    );

    this.onToolFinished?.(toolName, isError, iteration);

    return Session.toolResult(toolUseId, toolName, output, isError);
  }

  // ─── API Streaming ─────────────────────────────────────────────────

  private async streamApiRequest(
    request: ApiRequest
  ): Promise<{ assistantMessage: ConversationMessage; usage?: TokenUsage }> {
    let text = "";
    const blocks: ContentBlock[] = [];
    let usage: TokenUsage | undefined;
    let finished = false;

    for await (const event of this.apiClient.stream(request)) {
      this.onAssistantEvent?.(event);

      switch (event.type) {
        case "text_delta":
          text += event.text;
          break;

        case "tool_use":
          // Flush pending text
          if (text.trim()) {
            blocks.push({ type: "text", text } as TextBlock);
            text = "";
          }
          blocks.push({
            type: "tool_use",
            id: event.id,
            name: event.name,
            input: event.input,
          } as ToolUseBlock);
          break;

        case "usage":
          usage = event.usage;
          break;

        case "message_stop":
          finished = true;
          break;
      }
    }

    // Flush remaining text
    if (text.trim()) {
      blocks.push({ type: "text", text } as TextBlock);
    }

    if (!finished) {
      throw new RuntimeError("Assistant stream ended without a message stop event");
    }
    if (blocks.length === 0) {
      throw new RuntimeError("Assistant stream produced no content");
    }

    return {
      assistantMessage: Session.assistantMessage(blocks, usage),
      ...(usage ? { usage } : {}),
    };
  }

  // ─── Auto-Compaction ───────────────────────────────────────────────

  private maybeAutoCompact(): AutoCompactionEvent | undefined {
    const totalInputTokens = this.usageTracker.cumulativeUsage().inputTokens;
    if (totalInputTokens < this.autoCompactionThreshold) {
      return undefined;
    }

    const result = compactSession(this.session, {
      maxEstimatedTokens: 0, // compact as much as possible
    });

    if (result.removedMessageCount === 0) {
      return undefined;
    }

    // Replace session with compacted version
    this.session = result.compactedSession;

    return {
      removedMessageCount: result.removedMessageCount,
    };
  }

  // ─── Accessors ─────────────────────────────────────────────────────

  getSession(): Session {
    return this.session;
  }

  getUsage(): UsageTracker {
    return this.usageTracker;
  }

  estimatedTokens(): number {
    return estimateSessionTokens(this.session);
  }

  forkSession(branchName?: string): Session {
    return this.session.fork(branchName);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatHookMessage(messages: string[], fallback: string): string {
  return messages.length > 0 ? messages.join("\n") : fallback;
}
