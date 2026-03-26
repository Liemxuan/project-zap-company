import { AgentLoop } from "../agent.js";

async function run() {
    console.log("🚀 Starting Autonomic Nervous System Test: Syntax Repair...");

    // We instantiate The Architect (Claw) so it receives file system tools
    const agent = new AgentLoop("tier_p3_heavy", "Claw");

    const prompt = `Please execute src/scripts/dummy_tax.ts using 'npx tsx'. Wait for the output. If it fails due to a compilation or syntax error, use your tools (view_file and replace_file_content) to diagnose and fix the error, then execute it again to confirm it works.`;

    const result = await agent.run(999998, prompt);

    console.log("\n--- Final Output ---");
    console.log(result);

    process.exit(0);
}

run().catch(console.error);
