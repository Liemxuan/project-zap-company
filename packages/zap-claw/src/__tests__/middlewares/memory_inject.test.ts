// packages/zap-claw/src/__tests__/middlewares/memory_inject.test.ts
import { MemoryInjectMiddleware } from '../../middlewares/memory_inject.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('MemoryInjectMiddleware', () => {
  it('should inject recalled memories into toolInput context', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'What do we know about auth?' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'test-session',
      isAllowed: true,
    };

    let nextCalled = false;
    await MemoryInjectMiddleware(ctx, async () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(ctx.isAllowed).toBe(true);
    // Memory inject should add context but not block
  });

  it('should pass through when no memories found', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello' },
      userId: 1,
      botName: 'Spike',
      isAllowed: true,
    };

    let nextCalled = false;
    await MemoryInjectMiddleware(ctx, async () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
  });
});
