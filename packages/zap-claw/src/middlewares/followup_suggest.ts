// packages/zap-claw/src/middlewares/followup_suggest.ts
import { ToolMiddleware } from './pipeline.js';

export const FollowupSuggestMiddleware: ToolMiddleware = async (ctx, next) => {
  if (ctx.toolName === 'chat') {
    ctx.toolInput._generateFollowups = true;
  }
  await next();
};
