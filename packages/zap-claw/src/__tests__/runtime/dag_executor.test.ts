// packages/zap-claw/src/__tests__/runtime/dag_executor.test.ts
import { resolveReadyJobs, shouldDispatch } from '../../runtime/engine/dag_executor.js';

describe('DAG Executor', () => {
  it('shouldDispatch returns true for PENDING jobs with no dependencies', () => {
    const job = { status: 'PENDING', dependsOn: [] };
    expect(shouldDispatch(job as any)).toBe(true);
  });

  it('shouldDispatch returns false for BLOCKED jobs', () => {
    const job = { status: 'BLOCKED', dependsOn: ['abc'] };
    expect(shouldDispatch(job as any)).toBe(false);
  });

  it('shouldDispatch returns false for COMPLETED jobs', () => {
    const job = { status: 'COMPLETED', dependsOn: [] };
    expect(shouldDispatch(job as any)).toBe(false);
  });

  it('resolveReadyJobs filters to only dispatchable jobs', () => {
    const jobs = [
      { _id: '1', status: 'PENDING', dependsOn: [] },
      { _id: '2', status: 'BLOCKED', dependsOn: ['1'] },
      { _id: '3', status: 'COMPLETED', dependsOn: [] },
      { _id: '4', status: 'PENDING', dependsOn: [] },
    ];
    const ready = resolveReadyJobs(jobs as any[]);
    expect(ready).toHaveLength(2);
    expect(ready.map((j: any) => j._id)).toEqual(['1', '4']);
  });
});
