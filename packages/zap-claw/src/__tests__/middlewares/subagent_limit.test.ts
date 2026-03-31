// packages/zap-claw/src/__tests__/middlewares/subagent_limit.test.ts
import { SubagentLimitMiddleware, _resetSpawnCounts } from '../../middlewares/subagent_limit.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('SubagentLimitMiddleware', () => {
  beforeEach(() => _resetSpawnCounts());

  it('should allow spawn when under limit', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'write tests' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
  });

  it('should block spawn when limit reached', async () => {
    for (let i = 0; i < 6; i++) {
      const ctx: ToolMiddlewareContext = {
        toolName: 'spawn',
        toolInput: { agent_slug: 'coder', task: `task-${i}` },
        userId: 1,
        botName: 'Cleo',
        sessionId: 'sess-1',
        isAllowed: true,
      };
      await SubagentLimitMiddleware(ctx, async () => {});
    }

    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'task-7' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(ctx.isAllowed).toBe(false);
  });

  it('should not affect non-spawn tools', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'web_search',
      toolInput: { query: 'test' },
      userId: 1,
      botName: 'Scout',
      isAllowed: true,
    };
    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
  });
});
