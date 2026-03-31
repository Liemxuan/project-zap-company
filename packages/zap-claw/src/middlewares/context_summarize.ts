// packages/zap-claw/src/middlewares/context_summarize.ts
import { ToolMiddleware } from './pipeline.js';

const SUMMARIZE_THRESHOLD = 40; // turns

/**
 * Context Summarize Middleware
 * When a thread exceeds 40 turns, flag it for summarization.
 * The OmniRouter will then compress the context before the LLM call.
 */
export const ContextSummarizeMiddleware: ToolMiddleware = async (ctx, next) => {
  const historyLength = (ctx.toolInput._historyLength as number) || 0;

  if (historyLength > SUMMARIZE_THRESHOLD) {
    ctx.toolInput._shouldSummarize = true;
    console.log(`[ContextSummarize] Thread ${ctx.sessionId} has ${historyLength} turns — flagged for summarization.`);
  }

  await next();
};
