import { AgentLoop } from '../agent.js';

async function test() {
    const loop = new AgentLoop("tier_p3_heavy", "Jerry");
    const response = await loop.run(999, "What is your identity?");
    console.log("Response:", response);
}
test();
