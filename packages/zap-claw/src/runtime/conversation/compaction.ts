/**
 * ZAP Session Compaction
 * Ported from claw-code/rust/crates/runtime/src/compact.rs
 * 
 * Estimates session token count and compacts old messages when threshold is exceeded.
 * Uses a simple heuristic: ~4 chars per token (industry standard for English text).
 */

import type { ConversationMessage, ContentBlock } from "./types.js";
import { Session } from "./session.js";

const CHARS_PER_TOKEN = 4;
const DEFAULT_MAX_ESTIMATED_TOKENS = 80_000;

export interface CompactionConfig {
  maxEstimatedTokens: number;
  preserveRecentMessages: number; // always keep this many messages at the end
}

export interface CompactionResult {
  compactedSession: Session;
  removedMessageCount: number;
  estimatedTokensBefore: number;
  estimatedTokensAfter: number;
}

/**
 * Estimate the token count for a session by summing all content block lengths.
 */
export function estimateSessionTokens(session: Session): number {
  let totalChars = 0;

  for (const msg of session.messages) {
    for (const block of msg.blocks) {
      switch (block.type) {
        case "text":
          totalChars += block.text.length;
          break;
        case "tool_use":
          totalChars += block.name.length + block.input.length;
          break;
        case "tool_result":
          totalChars += block.toolName.length + block.content.length;
          break;
      }
    }
  }

  return Math.ceil(totalChars / CHARS_PER_TOKEN);
}

/**
 * Compact a session by summarizing old messages into a single system-level summary,
 * preserving the most recent messages for context continuity.
 */
export function compactSession(
  session: Session,
  config: Partial<CompactionConfig> = {}
): CompactionResult {
  const maxTokens = config.maxEstimatedTokens ?? DEFAULT_MAX_ESTIMATED_TOKENS;
  const preserveRecent = config.preserveRecentMessages ?? 6;
  const estimatedBefore = estimateSessionTokens(session);

  if (estimatedBefore <= maxTokens || session.messages.length <= preserveRecent) {
    return {
      compactedSession: session,
      removedMessageCount: 0,
      estimatedTokensBefore: estimatedBefore,
      estimatedTokensAfter: estimatedBefore,
    };
  }

  // Split: messages to compact vs messages to keep
  const cutoff = session.messages.length - preserveRecent;
  const toCompact = session.messages.slice(0, cutoff);
  const toKeep = session.messages.slice(cutoff);

  // Build summary of compacted messages
  const summary = buildCompactionSummary(toCompact);

  // Create new session with summary + recent messages
  const compacted = session.fork(`compacted-${Date.now()}`);
  compacted.messages = [
    {
      role: "system" as const,
      blocks: [{ type: "text" as const, text: summary }],
      timestamp: Date.now(),
    },
    ...toKeep,
  ];

  const estimatedAfter = estimateSessionTokens(compacted);

  return {
    compactedSession: compacted,
    removedMessageCount: toCompact.length,
    estimatedTokensBefore: estimatedBefore,
    estimatedTokensAfter: estimatedAfter,
  };
}

function buildCompactionSummary(messages: ConversationMessage[]): string {
  const userCount = messages.filter((m) => m.role === "user").length;
  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const toolCount = messages.filter((m) => m.role === "tool").length;

  const lines: string[] = [
    "<compacted_context>",
    `${messages.length} earlier messages compacted (user=${userCount}, assistant=${assistantCount}, tool=${toolCount}).`,
    "Key events:",
  ];

  for (const msg of messages) {
    const preview = extractMessagePreview(msg, 120);
    if (preview) {
      lines.push(`  - [${msg.role}] ${preview}`);
    }
  }

  lines.push("</compacted_context>");
  return lines.join("\n");
}

function extractMessagePreview(msg: ConversationMessage, maxLen: number): string {
  const parts: string[] = [];

  for (const block of msg.blocks) {
    switch (block.type) {
      case "text":
        parts.push(truncate(block.text.replace(/\n/g, " "), maxLen));
        break;
      case "tool_use":
        parts.push(`[Tool: ${block.name}]`);
        break;
      case "tool_result":
        parts.push(
          `[Result: ${block.toolName}${block.isError ? " ❌" : " ✓"}]`
        );
        break;
    }
  }

  return parts.join(" ").trim();
}

function truncate(str: string, maxLen: number): string {
  if (!str) return "";
  const trimmed = str.trim();
  return trimmed.length > maxLen
    ? trimmed.substring(0, maxLen) + "..."
    : trimmed;
}
