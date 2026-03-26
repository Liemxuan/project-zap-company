import { getAvailableTools } from "../tools/index.js";

function verifyPermissions() {
    console.log("🔍 Verifying Agent Tool Permissions...\n");

    const agents = ["ZAP_Claw_bot", "Jerry (Chief of Staff)", "Tommy (Analyst)"];

    for (const agent of agents) {
        const tools = getAvailableTools(agent);
        console.log(`[Agent] ${agent}`);
        console.log(`[Tools] ${tools.map((t: any) => t.function.name).join(", ")}\n`);
    }
}

verifyPermissions();
