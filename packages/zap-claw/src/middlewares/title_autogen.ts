// packages/zap-claw/src/middlewares/title_autogen.ts
import { ToolMiddleware } from './pipeline.js';

export const TitleAutoGenMiddleware: ToolMiddleware = async (ctx, next) => {
  if (ctx.toolName === 'chat' && ctx.toolInput._isFirstMessage) {
    ctx.toolInput._generateTitle = true;
  }
  await next();
};
