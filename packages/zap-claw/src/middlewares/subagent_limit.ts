// packages/zap-claw/src/middlewares/subagent_limit.ts
import { ToolMiddleware } from './pipeline.js';

const spawnCounts = new Map<string, number>();
const MAX_SUBAGENTS_PER_THREAD = 6;

export function _resetSpawnCounts() {
  spawnCounts.clear();
}

export const SubagentLimitMiddleware: ToolMiddleware = async (ctx, next) => {
  const spawnTools = ['spawn', 'task', 'deploy_hydra_team'];

  if (!spawnTools.includes(ctx.toolName)) {
    await next();
    return;
  }

  const threadKey = `${ctx.userId}:${ctx.sessionId || 'default'}`;
  const current = spawnCounts.get(threadKey) || 0;

  if (current >= MAX_SUBAGENTS_PER_THREAD) {
    ctx.isAllowed = false;
    ctx.hadError = true;
    ctx.resultContent = `[DEERFLOW GUARDRAIL] Subagent limit reached: ${current}/${MAX_SUBAGENTS_PER_THREAD} concurrent child jobs for this thread. Wait for existing jobs to complete before spawning more.`;
    console.warn(`[SubagentLimit] 🛑 Blocked ${ctx.toolName}: ${current} active spawns for thread ${threadKey}`);
    return;
  }

  spawnCounts.set(threadKey, current + 1);
  await next();
};
