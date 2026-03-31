// packages/zap-claw/src/__tests__/middlewares/pipeline_integration.test.ts
import { runMiddlewarePipeline, ToolMiddlewareContext } from '../../middlewares/pipeline.js';
import { LoopDetectionMiddleware, _resetLoopCache } from '../../middlewares/loop_detection.js';
import { SubagentLimitMiddleware, _resetSpawnCounts } from '../../middlewares/subagent_limit.js';
import { TodoListMiddleware } from '../../middlewares/todolist.js';

describe('Full DeerFlow Middleware Pipeline', () => {
  beforeEach(() => {
    _resetLoopCache();
    _resetSpawnCounts();
  });

  it('should run full pipeline in order for allowed request', async () => {
    const executionOrder: string[] = [];

    const trackingMiddleware = (name: string) =>
      (async (ctx: ToolMiddlewareContext, next: () => Promise<void>) => {
        executionOrder.push(name);
        await next();
      }) as any;

    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello world' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'test',
      isAllowed: true,
    };

    await runMiddlewarePipeline(
      [
        trackingMiddleware('guardrail'),
        trackingMiddleware('memory'),
        trackingMiddleware('context'),
        trackingMiddleware('loop'),
        trackingMiddleware('subagent'),
        trackingMiddleware('todo'),
      ],
      ctx
    );

    expect(executionOrder).toEqual([
      'guardrail', 'memory', 'context', 'loop', 'subagent', 'todo'
    ]);
    expect(ctx.isAllowed).toBe(true);
  });

  it('should halt pipeline when a middleware blocks', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'test' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'test',
      isAllowed: true,
    };

    // TodoListMiddleware blocks spawn without plan
    let postTodoRan = false;
    await runMiddlewarePipeline(
      [
        TodoListMiddleware,
        async (_ctx, next) => { postTodoRan = true; await next(); },
      ],
      ctx
    );

    expect(ctx.isAllowed).toBe(false);
    expect(postTodoRan).toBe(false);
  });
});
