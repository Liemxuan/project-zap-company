import * as dotenv from "dotenv";
dotenv.config();
import { AgentLoop } from "../agent.js";

async function main() {
    console.log("Starting Jerry Test...");
    const agent = new AgentLoop("tier_p0_fast", "Jerry");
    try {
        const resp = await agent.run(12345, "ATA_HANDSHAKE_INIT[agent_id=TOMMY, target_id=JERRY, session_id=SES-CURRENT_OPENCLAW_ID] PROTOCOL_SYNC[Gemini-3/OpenClaw] TASK: Confirm handshake and align on next steps for SWARM_COMMAND.md implementation.", "OLYMPUS", "test-session");
        console.log("RESPONSE:", resp);
    } catch (err) {
        console.error("TEST FAILED:", err);
    }
}

main().catch(console.error);
