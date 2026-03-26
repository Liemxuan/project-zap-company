import { omniQueue, QueueName, QueuePriority, triageJob } from '../src/runtime/engine/omni_queue.js';
import { OmniPayload, LLMConfig } from '../src/runtime/engine/omni_router.js';
import * as fs from 'fs';
import * as path from 'path';

const filePath = process.argv[2];
if (!filePath) {
    console.error("Usage: npx tsx enqueue_task.ts <path-to-markdown-task>");
    process.exit(1);
}

const resolvedPath = path.resolve(filePath);
if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
}

const taskContent = fs.readFileSync(resolvedPath, "utf8");

async function run() {
    await omniQueue.connect("ZVN");

    const payload: OmniPayload = {
        systemPrompt: "You are a specialized agent from the CLAW team. Your objective is to read the following task and execute its instructions flawlessly in the ZAP Design Engine or Olympus workspace.",
        messages: [{ role: "user" as const, content: taskContent }],
        theme: "C_PRECISION",
        intent: "CODING"
    };

    const config: LLMConfig = {
        apiKey: "system_internal",
        defaultModel: "google/gemini-3.1-pro-preview"
    };

    const queueName = triageJob(payload);
    let priority: QueuePriority = 1;
    if (queueName === "Queue-Complex") priority = 3;
    else if (queueName === "Queue-Short") priority = 0;

    console.log(`[Queue System] Triaged to ${queueName} (Priority: ${priority})`);

    const jobId = await omniQueue.enqueue(
        queueName,
        priority,
        "ZVN",
        payload,
        config,
        "CLI",
        "Antigravity"
    );

    console.log(`✅ Task enqueued into OmniQueue with Job ID: ${jobId}`);
    console.log(`Waiting for CLAW team worker to pick it up.`);
    process.exit(0);
}

run().catch(err => {
    console.error("Failed to enqueue job:", err);
    process.exit(1);
});
