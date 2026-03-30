import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env") });
import { AgentLoop } from "../agent.js";
import { Redis } from "ioredis";

async function main() {
    console.log("🚀 Initializing Jerry Trace test...");
    
    const hitlPublisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    const sessionId = `test_trace_${Date.now()}`;
    
    console.log(`📡 Trace Session ID: ${sessionId} (You can monitor this on the dashboard)`);
    console.log("----------------------------------------------------------------");

    // The agent instance
    const agent = new AgentLoop("tier_p0_fast", "Jerry");

    const onStatus = async (msg: string) => {
        const formatted = `\r\n> 🧠 [status] ${msg}\r\n`;
        process.stdout.write(formatted);
        await hitlPublisher.rpush(`zap:trace:${sessionId}:logs`, formatted);
        await hitlPublisher.publish(`zap:trace:${sessionId}`, formatted);
        await hitlPublisher.expire(`zap:trace:${sessionId}:logs`, 3600);
    };

    try {
        const prompt = "Please run a harmless command to check the current directory contents using `run_command`. Note: be brief.";
        
        console.log(`\r\n> 👤 [user] ${prompt}\r\n`);

        const reply = await agent.run(
            999999, // dummy userId
            prompt,
            "OLYMPUS_TEST", // Ensure it bypasses real protections or acts as test 
            sessionId,
            onStatus
        );
        
        const replyFormatted = `\r\n> 🤖 [reply] ${reply}\r\n`;
        process.stdout.write(replyFormatted);
        
        await hitlPublisher.rpush(`zap:trace:${sessionId}:logs`, replyFormatted);
        await hitlPublisher.publish(`zap:trace:${sessionId}`, replyFormatted);
        await hitlPublisher.expire(`zap:trace:${sessionId}:logs`, 3600);

        console.log("\n✅ Test Complete.");
    } catch (err) {
        console.error("\n❌ TEST FAILED:", err);
    } finally {
        hitlPublisher.quit();
        process.exit(0);
    }
}

main().catch(console.error);
