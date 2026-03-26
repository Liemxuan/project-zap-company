import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const filePath = process.argv[2];
if (!filePath) {
    console.error("Usage: node enqueue_raw.js <path-to-markdown-task>");
    process.exit(1);
}

const resolvedPath = path.resolve(filePath);
if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
}

const taskContent = fs.readFileSync(resolvedPath, "utf8");

async function run() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    await client.connect();

    // Auto-triage logic mapped directly
    const queueName = "Queue-Long";
    const priority = 1;

    const document = {
        queueName,
        priority,
        status: "PENDING",
        tenantId: "ZVN",
        payload: {
            systemPrompt: "You are a specialized agent from the CLAW team. Your objective is to read the following task and execute its instructions flawlessly in the ZAP Design Engine or Olympus workspace.",
            messages: [{ role: "user", content: taskContent }],
            theme: "C_PRECISION",
            intent: "CODING"
        },
        config: {
            apiKey: "system_internal",
            defaultModel: "google/gemini-3.1-pro-preview"
        },
        sourceChannel: "CLI",
        senderIdentifier: "Antigravity",
        createdAt: new Date()
    };

    const db = client.db("olympus");
    const col = db.collection("ZVN_SYS_OS_job_queue");

    const result = await col.insertOne(document);
    console.log(`✅ Task enqueued into OmniQueue with Job ID: ${result.insertedId.toString()}`);
    console.log(`Waiting for CLAW team worker to pick it up.`);
    await client.close();
    process.exit(0);
}

run().catch(err => {
    console.error("Failed to enqueue job:", err);
    process.exit(1);
});
