// packages/zap-claw/src/__tests__/middlewares/title_autogen.test.ts
import { TitleAutoGenMiddleware } from '../../middlewares/title_autogen.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('TitleAutoGenMiddleware', () => {
  it('should flag first message for title generation', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'Help me design an auth system', _isFirstMessage: true },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await TitleAutoGenMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._generateTitle).toBe(true);
  });

  it('should skip title gen for subsequent messages', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'continue', _isFirstMessage: false },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    await TitleAutoGenMiddleware(ctx, async () => {});
    expect(ctx.toolInput._generateTitle).toBeUndefined();
  });
});
