import { receiveMessage } from "./gateway/intercept.js";
import { processDeadLetterQueue } from "./cron/dlq_worker.js";

async function runDLQTest() {
    console.log("==========================================");
    console.log("🧪 TESTING DLQ & HYDRA EXHAUSTION");
    console.log("==========================================");

    // 1. Invalidate keys temporarily to force a chain exhaustion
    const originalGoogle = process.env.GOOGLE_API_KEY;
    const originalOpenrouter = process.env.OPENROUTER_API_KEY;

    process.env.GOOGLE_API_KEY = "invalid_key_123";
    process.env.OPENROUTER_API_KEY = "invalid_key_456";

    console.log("\n[Test Phase 1] 🚀 Sending failing message to trigger DLQ...");
    const result = await receiveMessage({
        channel: "CLI",
        senderIdentifier: "Tom",
        tenantId: "ZVN",
        payload: "This is a failing message that should trigger the DLQ!"
    });

    console.log("\n[Test Phase 1 Result]:", result);

    // 2. Restore keys to allow recovery
    process.env.GOOGLE_API_KEY = originalGoogle;
    process.env.OPENROUTER_API_KEY = originalOpenrouter;

    console.log("\n[Test Phase 2] ♻️ Running DLQ Worker to see if it recovers the stranded payload...");
    await processDeadLetterQueue();

    console.log("\n✅ Test sequence complete.");
}

runDLQTest();
