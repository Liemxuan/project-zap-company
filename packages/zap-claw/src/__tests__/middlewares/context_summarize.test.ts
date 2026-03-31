// packages/zap-claw/src/__tests__/middlewares/context_summarize.test.ts
import { ContextSummarizeMiddleware } from '../../middlewares/context_summarize.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('ContextSummarizeMiddleware', () => {
  it('should pass through when history is short', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello', _historyLength: 5 },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await ContextSummarizeMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._shouldSummarize).toBeUndefined();
  });

  it('should flag summarization when history exceeds threshold', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'continue', _historyLength: 45 },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await ContextSummarizeMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._shouldSummarize).toBe(true);
  });
});
