// packages/zap-claw/src/__tests__/middlewares/loop_detection.test.ts
import { LoopDetectionMiddleware, _resetLoopCache } from '../../middlewares/loop_detection.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('LoopDetectionMiddleware', () => {
  beforeEach(() => _resetLoopCache());

  function makeCtx(overrides?: Partial<ToolMiddlewareContext>): ToolMiddlewareContext {
    return {
      toolName: 'task',
      toolInput: { role: 'Spike', objective: 'build auth module' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
      ...overrides,
    };
  }

  it('should allow first two identical calls', async () => {
    for (let i = 0; i < 2; i++) {
      const ctx = makeCtx();
      let nextCalled = false;
      await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
      expect(nextCalled).toBe(true);
      expect(ctx.isAllowed).toBe(true);
    }
  });

  it('should block on 3rd identical call', async () => {
    for (let i = 0; i < 2; i++) {
      const ctx = makeCtx();
      await LoopDetectionMiddleware(ctx, async () => {});
    }
    const ctx = makeCtx();
    let nextCalled = false;
    await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(ctx.isAllowed).toBe(false);
    expect(ctx.resultContent).toContain('Loop detected');
  });

  it('should allow different inputs', async () => {
    for (let i = 0; i < 3; i++) {
      const ctx = makeCtx({ toolInput: { role: 'Spike', objective: `task-${i}` } });
      let nextCalled = false;
      await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
      expect(nextCalled).toBe(true);
    }
  });
});
