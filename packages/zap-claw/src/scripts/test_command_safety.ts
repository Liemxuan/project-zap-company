import { handler } from "../tools/run_command.js";
import * as fs from "fs";

async function testCommandSafety() {
    console.log("🚀 Starting Command Safety Verification...");

    // 1. Test normal output
    console.log("📝 Running small command (ls -l)...");
    const smallOutput = await handler({ command: "ls -l" });
    if (!smallOutput.includes("[TRUNCATED") && smallOutput.includes("STDOUT:")) {
        console.log("✅ Normal output handled correctly.");
    } else {
        console.error("❌ Small output failed.");
        process.exit(1);
    }

    // 2. Test large output (truncation)
    console.log("📝 Running large command (ls -R /Users/zap/Workspace/zap-claw)...");
    // We'll use a known large output generator
    const largeOutput = await handler({ command: "find . -maxdepth 5" });

    if (largeOutput.includes("[TRUNCATED") && largeOutput.includes("/tmp/cmd_output_")) {
        console.log("✅ Large output truncation verified.");

        // Extract filename
        const match = largeOutput.match(/\/tmp\/cmd_output_\d+\.txt/);
        if (match && fs.existsSync(match[0])) {
            console.log(`✅ Temp file created at: ${match[0]}`);
            const stats = fs.statSync(match[0]);
            console.log(`📊 Temp file size: ${stats.size} bytes`);

            // Clean up
            // fs.unlinkSync(match[0]);
        } else {
            console.error("❌ Temp file NOT created.");
            process.exit(1);
        }
    } else {
        // Fallback: If find . wasn't large enough, force it
        console.log("⚠️ Output was not large enough to truncate. Retrying with explicit volume...");
        const forcedLarge = await handler({ command: "yes 'HELLO WORLD' | head -n 5000" });
        if (forcedLarge.includes("[TRUNCATED")) {
            console.log("✅ Forced large output truncation verified.");
        } else {
            console.error("❌ Forced large output failed truncation.");
            process.exit(1);
        }
    }

    console.log("🏁 COMMAND SAFETY TEST PASSED.");
}

testCommandSafety().catch(err => {
    console.error("💥 TEST CRASHED:", err);
    process.exit(1);
});
