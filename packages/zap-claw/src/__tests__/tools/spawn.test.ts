// packages/zap-claw/src/__tests__/tools/spawn.test.ts
import { definition, createChildJob } from '../../tools/spawn.js';

describe('spawn tool', () => {
  it('should have correct tool definition', () => {
    expect(definition.function.name).toBe('spawn');
    expect(definition.function.parameters?.required).toContain('agent_slug');
    expect(definition.function.parameters?.required).toContain('task');
  });

  it('createChildJob should return a job document shape', () => {
    const job = createChildJob({
      parentThreadId: 'thread-1',
      agentSlug: 'coder',
      task: 'Write unit tests',
      priority: 1,
      tenantId: 'ZVN',
      userId: '1',
    });

    expect(job.agentSlug).toBe('coder');
    expect(job.status).toBe('PENDING');
    expect(job.parentThreadId).toBe('thread-1');
    expect(job.priority).toBe(1);
    expect(job.payload).toBe('Write unit tests');
  });
});
