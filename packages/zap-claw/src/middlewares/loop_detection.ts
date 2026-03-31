// packages/zap-claw/src/middlewares/loop_detection.ts
import { createHash } from 'crypto';
import { ToolMiddleware } from './pipeline.js';

const loopCache = new Map<string, number>();
const MAX_REPEATS = 3;

export function _resetLoopCache() {
  loopCache.clear();
}

export const LoopDetectionMiddleware: ToolMiddleware = async (ctx, next) => {
  const hash = createHash('sha256')
    .update(`${ctx.botName}:${ctx.sessionId || ''}:${ctx.toolName}:${JSON.stringify(ctx.toolInput)}`)
    .digest('hex')
    .slice(0, 16);

  const count = (loopCache.get(hash) || 0) + 1;
  loopCache.set(hash, count);

  if (count >= MAX_REPEATS) {
    ctx.isAllowed = false;
    ctx.hadError = true;
    ctx.resultContent = `[DEERFLOW GUARDRAIL] Loop detected: identical (agent + tool + input) seen ${count} times in this session. Breaking the loop. Try a different approach.`;
    console.warn(`[LoopDetection] 🔁 Blocked ${ctx.toolName} by ${ctx.botName}: ${count} repeats (hash: ${hash})`);
    return;
  }

  await next();
};
