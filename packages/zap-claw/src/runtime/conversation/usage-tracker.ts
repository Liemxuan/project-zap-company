/**
 * ZAP Usage Tracker
 * Ported from claw-code/rust/crates/runtime/src/usage.rs
 * 
 * Accumulates token usage across turns for budget enforcement and reporting.
 */

import type { TokenUsage } from "./types.js";

const EMPTY_USAGE: TokenUsage = {
  inputTokens: 0,
  outputTokens: 0,
  cacheReadInputTokens: 0,
  cacheCreationInputTokens: 0,
};

export class UsageTracker {
  private cumulative: TokenUsage;
  private turnHistory: TokenUsage[];

  constructor(initial?: TokenUsage) {
    this.cumulative = { ...EMPTY_USAGE, ...initial };
    this.turnHistory = [];
  }

  record(usage: TokenUsage): void {
    this.cumulative.inputTokens += usage.inputTokens;
    this.cumulative.outputTokens += usage.outputTokens;
    this.cumulative.cacheReadInputTokens =
      (this.cumulative.cacheReadInputTokens ?? 0) +
      (usage.cacheReadInputTokens ?? 0);
    this.cumulative.cacheCreationInputTokens =
      (this.cumulative.cacheCreationInputTokens ?? 0) +
      (usage.cacheCreationInputTokens ?? 0);
    this.turnHistory.push({ ...usage });
  }

  cumulativeUsage(): TokenUsage {
    return { ...this.cumulative };
  }

  totalTokens(): number {
    return this.cumulative.inputTokens + this.cumulative.outputTokens;
  }

  turnCount(): number {
    return this.turnHistory.length;
  }

  reset(): void {
    this.cumulative = { ...EMPTY_USAGE };
    this.turnHistory = [];
  }
}
