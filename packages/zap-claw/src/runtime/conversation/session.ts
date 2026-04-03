/**
 * ZAP Session Manager
 * Ported from claw-code/rust/crates/runtime/src/session.rs
 * 
 * Manages conversation history with push/fork/compact operations.
 */

import { randomUUID } from "node:crypto";
import type {
  ConversationMessage,
  ContentBlock,
  TextBlock,
  ToolUseBlock,
  ToolResultBlock,
  TokenUsage,
  SessionOptions,
} from "./types.js";

export class Session {
  readonly id: string;
  readonly branchName: string | null;
  messages: ConversationMessage[];
  private readonly createdAt: number;

  constructor(options: SessionOptions = {}) {
    this.id = options.id ?? randomUUID();
    this.branchName = options.branchName ?? null;
    this.messages = [];
    this.createdAt = Date.now();
  }

  // ─── Message Push ───────────────────────────────────────────────────

  pushUserText(text: string): void {
    this.messages.push({
      role: "user",
      blocks: [{ type: "text", text }],
      timestamp: Date.now(),
    });
  }

  pushMessage(message: ConversationMessage): void {
    this.messages.push(message);
  }

  // ─── Message Factories ─────────────────────────────────────────────

  static assistantMessage(
    blocks: ContentBlock[],
    usage?: TokenUsage
  ): ConversationMessage {
    const msg: ConversationMessage = {
      role: "assistant",
      blocks,
      timestamp: Date.now(),
    };
    if (usage !== undefined) {
      msg.usage = usage;
    }
    return msg;
  }

  static toolResult(
    toolUseId: string,
    toolName: string,
    content: string,
    isError: boolean
  ): ConversationMessage {
    return {
      role: "tool",
      blocks: [
        {
          type: "tool_result",
          toolUseId,
          toolName,
          content,
          isError,
        } as ToolResultBlock,
      ],
      timestamp: Date.now(),
    };
  }

  // ─── Fork ───────────────────────────────────────────────────────────

  fork(branchName?: string): Session {
    const forked = new Session({
      branchName: branchName ?? `fork-${this.id.slice(0, 8)}`,
    });
    forked.messages = this.messages.map((msg) => ({
      ...msg,
      blocks: [...msg.blocks],
    }));
    return forked;
  }

  // ─── Introspection ─────────────────────────────────────────────────

  get messageCount(): number {
    return this.messages.length;
  }

  get lastMessage(): ConversationMessage | undefined {
    return this.messages[this.messages.length - 1];
  }

  pendingToolUses(): { id: string; name: string; input: string }[] {
    const last = this.lastMessage;
    if (!last || last.role !== "assistant") return [];

    return last.blocks
      .filter((b): b is ToolUseBlock => b.type === "tool_use")
      .map(({ id, name, input }) => ({ id, name, input }));
  }
}
