// packages/zap-claw/src/tools/spawn.ts
import { ChatCompletionTool } from "openai/resources/chat/completions.js";

export const definition: any = {
  type: "function",
  function: {
    name: "spawn",
    description:
      "Spawn a child agent job in the DAG. The child job runs asynchronously and its results are tracked in the job queue. Use this for tasks that need a specific specialist agent. Always use write_todos first to plan your delegation.",
    parameters: {
      type: "object",
      properties: {
        agent_slug: {
          type: "string",
          description: "The agent to assign this task to.",
          enum: [
            "spike", "jerry", "athena", "hermes", "hawk",
            "nova", "raven", "scout", "coder", "architect",
            "cleo", "daemon",
          ],
        },
        task: {
          type: "string",
          description: "The detailed task description for the child agent.",
        },
        priority: {
          type: "number",
          description: "Job priority: 0=critical, 1=high, 2=normal, 3=low",
          enum: [0, 1, 2, 3],
        },
        depends_on: {
          type: "array",
          items: { type: "string" },
          description: "Array of job IDs this task depends on (DAG edges).",
        },
      },
      required: ["agent_slug", "task"],
    },
  },
};

export interface ChildJobInput {
  parentThreadId: string;
  agentSlug: string;
  task: string;
  priority?: number | undefined;
  dependsOn?: string[] | undefined;
  tenantId: string;
  userId: string;
}

export function createChildJob(input: ChildJobInput) {
  return {
    parentThreadId: input.parentThreadId,
    agentSlug: input.agentSlug,
    assignedAgentId: `AGNT-OLY-${input.agentSlug.toUpperCase()}`,
    payload: input.task,
    status: input.dependsOn?.length ? "BLOCKED" : "PENDING",
    priority: input.priority ?? 2,
    dependsOn: input.dependsOn || [],
    tenantId: input.tenantId,
    userId: input.userId,
    createdAt: new Date(),
  };
}

export async function handler(
  input: Record<string, unknown>,
  userId: number,
  botName?: string
) {
  const { agent_slug, task, priority, depends_on } = input as {
    agent_slug: string;
    task: string;
    priority?: number;
    depends_on?: string[];
  };

  const tenantId = (input.tenantId as string) || "ZVN";
  const sessionId = (input.sessionId as string) || `SPAWN_${Date.now()}`;

  const job = createChildJob({
    parentThreadId: sessionId,
    agentSlug: agent_slug,
    task,
    priority,
    dependsOn: depends_on,
    tenantId,
    userId: userId.toString(),
  });

  // Insert into MongoDB job queue
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
    const db = client.db("zap_swarm");
    const col = db.collection(`${tenantId}_SYS_OS_job_queue`);
    const result = await col.insertOne(job);

    console.log(
      `[Spawn] 🚀 ${botName || "Lead"} spawned child job for [${agent_slug}]: ${result.insertedId}`
    );
    await client.close();

    return {
      output: `Child job spawned for agent "${agent_slug}" (Job ID: ${result.insertedId}). Status: ${job.status}. ${
        job.dependsOn.length
          ? `Blocked on: ${job.dependsOn.join(", ")}`
          : "Ready for execution."
      }`,
    };
  } catch (err) {
    return {
      output: `Failed to spawn child job: ${(err as Error).message}`,
    };
  }
}
