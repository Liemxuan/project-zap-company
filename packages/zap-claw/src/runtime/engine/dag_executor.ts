import { getGlobalMongoClient } from "../../db/mongo_client.js";
// packages/zap-claw/src/runtime/engine/dag_executor.ts

interface DAGJob {
  _id: string;
  status: string;
  dependsOn: string[];
  agentSlug?: string;
  assignedAgentId?: string;
  payload?: string;
  tenantId?: string;
  parentThreadId?: string;
  priority?: number;
  [key: string]: unknown;
}

export function shouldDispatch(job: Pick<DAGJob, 'status' | 'dependsOn'>): boolean {
  return job.status === 'PENDING' && (!job.dependsOn || job.dependsOn.length === 0);
}

export function resolveReadyJobs(jobs: DAGJob[]): DAGJob[] {
  return jobs.filter(shouldDispatch);
}

/**
 * DAG Executor Daemon
 *
 * Polls the job queue for PENDING jobs with resolved dependencies,
 * dispatches them to OmniRouter via the existing executeSerializedLane.
 *
 * The DAG unblocking logic already exists in omni_queue.ts (lines 332-343):
 * when a job completes, it removes itself from dependsOn arrays of BLOCKED jobs,
 * promoting them to PENDING when all deps are resolved.
 *
 * This executor complements that by actively polling for PENDING jobs
 * and dispatching them.
 */
export async function startDAGExecutor(tenantId: string = 'ZVN', pollIntervalMs: number = 2000) {
  const { MongoClient } = await import('mongodb');
  const { executeSerializedLane } = await import('../serialized_lane.js');

  const client = await getGlobalMongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
  const db = client.db("zap_swarm");
  const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

  console.log(`[DAG Executor] 🔄 Started polling every ${pollIntervalMs}ms for tenant ${tenantId}`);

  const interval = setInterval(async () => {
    try {
      const pendingJobs = await col
        .find({ status: 'PENDING', agentSlug: { $exists: true } })
        .sort({ priority: 1, createdAt: 1 })
        .limit(3) // Process max 3 jobs per tick
        .toArray();

      const ready = resolveReadyJobs(pendingJobs as unknown as DAGJob[]);

      for (const job of ready) {
        // Mark as PROCESSING to prevent double-dispatch
        await col.updateOne(
          { _id: job._id as any, status: 'PENDING' },
          { $set: { status: 'PROCESSING', startedAt: new Date() } }
        );

        console.log(`[DAG Executor] 🚀 Dispatching job ${job._id} to agent ${job.agentSlug}`);

        const agentProfile = {
          name: job.agentSlug || 'spike',
          role: job.agentSlug || 'spike',
          department: 'Swarm',
          assignedAgentId: job.assignedAgentId || `AGNT-OLY-${(job.agentSlug || 'SPIKE').toUpperCase()}`,
          defaultModel: 'anthropic/claude-sonnet-4-6',
          specialty: 'EXECUTION',
        };

        // Fire and forget — omni_queue handles completion + DAG unblocking
        executeSerializedLane(
          agentProfile as any,
          job.tenantId || tenantId,
          '0', // system user
          job.payload || '',
          1,
          job.parentThreadId || `DAG_${job._id}`
        ).catch(err => {
          console.error(`[DAG Executor] ❌ Job ${job._id} failed: ${err.message}`);
          col.updateOne(
            { _id: job._id as any },
            { $set: { status: 'FAILED', error: err.message, failedAt: new Date() } }
          ).catch(() => {});
        });
      }
    } catch (err) {
      console.error(`[DAG Executor] Poll error: ${(err as Error).message}`);
    }
  }, pollIntervalMs);

}
