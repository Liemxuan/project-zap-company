import { AgentLoop } from "../agent.js";
import dotenv from "dotenv";

dotenv.config();

// Intentionally ruin the API key to simulate a 401 error
process.env["OPENROUTER_API_KEY"] = "sk-or-v1-invalid-key-for-testing-autonomy";

async function run() {
    console.log("🚀 Starting Autonomic Nervous System Test...");
    console.log("   Simulating a 401 Unauthorized error from OpenRouter...\n");

    const agent = new AgentLoop("tier_p0_fast", "Claw");

    // We expect the agent to:
    // 1. Fail the first API call (401)
    // 2. Catch it in AgentLoop, increment selfHealingAttempts=1
    // 3. Inject the error back into the LLM context.
    // 4. Try again. Fail again (API key is still bad). selfHealingAttempts=2.
    // 5. Try again. Fail again (API key is still bad). selfHealingAttempts=3.
    // 6. Hit the circuit breaker and return the [AUTONOMIC FAILURE] string.

    const result = await agent.run(999999, "Hello Claw, what is 2+2?");

    console.log("\n--- Final Output ---");
    console.log(result);

    if (result.includes("[AUTONOMIC FAILURE - AWAITING HITL]")) {
        console.log("\n✅ SUCCESS: Circuit Breaker successfully tripped and prevented an infinite crash loop!");
    } else {
        console.log("\n❌ FAILED: Agent did not return the expected autonomic failure string.");
    }

    process.exit(0);
}

run().catch(console.error);
