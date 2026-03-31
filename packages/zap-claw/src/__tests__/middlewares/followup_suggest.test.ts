// packages/zap-claw/src/__tests__/middlewares/followup_suggest.test.ts
import { FollowupSuggestMiddleware } from '../../middlewares/followup_suggest.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('FollowupSuggestMiddleware', () => {
  it('should flag chat responses for follow-up generation', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'explain auth flows' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await FollowupSuggestMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._generateFollowups).toBe(true);
  });
});
