/**
 * ZAP Conversation Runtime — Barrel Export
 * 
 * Clean public API for the entire conversation subsystem.
 */

// Core runtime
export { ConversationRuntime } from "./conversation-runtime.js";

// Adapters
export { OmniApiClient, ZapToolExecutor, RedisPermissionPrompter } from "./adapters.js";

// Chat handler
export { chatV2Router } from "./chat-v2-handler.js";
export { Session } from "./session.js";

// Usage tracking
export { UsageTracker } from "./usage-tracker.js";

// Compaction
export {
  compactSession,
  estimateSessionTokens,
  type CompactionConfig,
  type CompactionResult,
} from "./compaction.js";

// Hooks
export {
  HookRunner,
  ZSSHookRunner,
  HookAbortSignal,
  mergeHookFeedback,
  type HookConfig,
} from "./hooks.js";

// Permissions
export {
  PermissionPolicy,
  type PermissionRuleConfig,
} from "./permissions.js";

// Types
export type {
  // Messages
  MessageRole,
  TextBlock,
  ToolUseBlock,
  ToolResultBlock,
  ContentBlock,
  ConversationMessage,
  TokenUsage,

  // API
  ApiClient,
  ApiRequest,
  AssistantEvent,

  // Tools
  ToolDefinition,
  ToolResult,
  ToolExecutor,

  // Permissions
  PermissionMode,
  PermissionOverride,
  PermissionContext,
  PermissionOutcome,
  PermissionPrompter,
  PermissionRequest,
  PermissionPromptDecision,

  // Hooks
  HookEvent,
  HookRunResult,
  HookProgressEvent,
  HookProgressReporter,

  // Turn
  TurnSummary,
  AutoCompactionEvent,
  ConversationRuntimeConfig,
  SessionOptions,
} from "./types.js";

// Errors
export { ToolError, RuntimeError } from "./types.js";
