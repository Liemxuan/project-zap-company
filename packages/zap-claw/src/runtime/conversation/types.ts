/**
 * ZAP Conversation Runtime — Core Types
 * Ported from claw-code/rust/crates/runtime/src/{conversation,session,usage}.rs
 * 
 * These types define the contracts for the entire conversation pipeline:
 * ApiClient → ConversationRuntime → ToolExecutor → HookRunner → PermissionPolicy
 */

// ─── Message & Content Types ────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface TextBlock {
  type: "text";
  text: string;
}

export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: string; // raw JSON string
}

export interface ToolResultBlock {
  type: "tool_result";
  toolUseId: string;
  toolName: string;
  content: string;
  isError: boolean;
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export interface ConversationMessage {
  role: MessageRole;
  blocks: ContentBlock[];
  timestamp: number;
  usage?: TokenUsage;
}

// ─── Token Usage ────────────────────────────────────────────────────────

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens?: number;
  cacheCreationInputTokens?: number;
}

// ─── API Client Interface ───────────────────────────────────────────────

export interface ApiRequest {
  systemPrompt: string[];
  messages: ConversationMessage[];
  tools?: ToolDefinition[];
  maxTokens?: number;
  model?: string;
}

export type AssistantEvent =
  | { type: "text_delta"; text: string }
  | { type: "tool_use"; id: string; name: string; input: string }
  | { type: "usage"; usage: TokenUsage }
  | { type: "message_stop" };

/**
 * ApiClient trait — decoupled from any specific provider.
 * Implement this for Google, Anthropic, OpenRouter, Ollama, etc.
 */
export interface ApiClient {
  stream(request: ApiRequest): AsyncIterable<AssistantEvent>;
}

// ─── Tool Executor Interface ────────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  requiredPermission?: PermissionMode;
}

export interface ToolResult {
  output: string;
  isError: boolean;
}

/**
 * ToolExecutor trait — execute a tool by name with JSON input.
 * Returns output string or throws ToolError.
 */
export interface ToolExecutor {
  execute(toolName: string, input: string): Promise<ToolResult>;
  getDefinitions(): Promise<ToolDefinition[]>;
}

// ─── Permission Types ───────────────────────────────────────────────────

export type PermissionMode =
  | "read-only"
  | "workspace-write"
  | "danger-full-access"
  | "prompt"
  | "allow";

export type PermissionOverride = "allow" | "deny" | "ask";

export interface PermissionContext {
  override?: PermissionOverride;
  reason?: string;
}

export type PermissionOutcome =
  | { type: "allow" }
  | { type: "deny"; reason: string };

/**
 * PermissionPrompter — interactive approval for escalated operations.
 * The Swarm UI implements this to show approval buttons.
 */
export interface PermissionPrompter {
  decide(request: PermissionRequest): Promise<PermissionPromptDecision>;
}

export interface PermissionRequest {
  toolName: string;
  input: string;
  currentMode: PermissionMode;
  requiredMode: PermissionMode;
  reason?: string;
}

export type PermissionPromptDecision =
  | { type: "allow" }
  | { type: "deny"; reason: string };

// ─── Hook Types ─────────────────────────────────────────────────────────

export type HookEvent = "PreToolUse" | "PostToolUse" | "PostToolUseFailure";

export interface HookRunResult {
  isDenied: boolean;
  isFailed: boolean;
  isCancelled: boolean;
  messages: string[];
  permissionOverride?: PermissionOverride;
  permissionReason?: string;
  updatedInput?: string; // JSON string of modified tool input
}

export interface HookProgressEvent {
  type: "started" | "completed" | "cancelled";
  event: HookEvent;
  toolName: string;
  command: string;
}

export interface HookProgressReporter {
  onEvent(event: HookProgressEvent): void;
}

// ─── Turn Summary ───────────────────────────────────────────────────────

export interface TurnSummary {
  assistantMessages: ConversationMessage[];
  toolResults: ConversationMessage[];
  iterations: number;
  usage: TokenUsage;
  autoCompaction?: AutoCompactionEvent;
}

export interface AutoCompactionEvent {
  removedMessageCount: number;
}

// ─── Session ────────────────────────────────────────────────────────────

export interface SessionOptions {
  id?: string;
  branchName?: string;
}

// ─── Runtime Config ─────────────────────────────────────────────────────

export interface ConversationRuntimeConfig {
  maxIterations?: number;
  autoCompactionThreshold?: number; // input tokens before auto-compact
  systemPrompt: string[];
  dynamicTools?: ToolDefinition[];
}

// ─── Errors ─────────────────────────────────────────────────────────────

export class ToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolError";
  }
}

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeError";
  }
}
