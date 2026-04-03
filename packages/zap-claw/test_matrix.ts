import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. Manually resolve the exact path of the .env file
const envPath = path.resolve(process.cwd(), ".env");

// 2. Load the env vars securely
dotenv.config({ path: envPath, override: true });

// 3. Import the resolver algorithm directly from zap-claw OM
import { resolveBalancedKey } from "./src/runtime/engine/omni_router.ts";

async function runRotationTest() {
    console.log("=========================================");
    console.log("⚡ TESTING OMNI-ROUTER 2D MATRIX (ULTRA)");
    console.log("=========================================");
    
    // Simulate 5 highly concurrent API requests hitting the router
    for (let i = 1; i <= 5; i++) {
        const balanced = await resolveBalancedKey("ULTRA");
        if (balanced) {
            // Censor the middle of the key to keep the output safe, just showing the tail end to prove rotation
            const censoredKey = balanced.apiKey.substring(0, 8) + "..." + balanced.apiKey.substring(balanced.apiKey.length - 4);
            console.log(`Request #${i} | Project -> [${balanced.projectId}] | Auto-Selected Key -> ${censoredKey}`);
        } else {
            console.log(`Request #${i} | NO KEY RETURNED. Matrix dead.`);
        }
        
        // Small delay just to let Redis sync atomic commands cleanly in script format
        await new Promise(r => setTimeout(r, 200));
    }

    console.log("=========================================");
    console.log("✅ TEST COMPLETE. Exiting.");
    process.exit(0);
}

runRotationTest();
