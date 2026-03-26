import { omniQueue } from './src/runtime/engine/omni_queue.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    await omniQueue.connect("ZVN");
    console.log("Connected to ZVN omni_queue. Processing single job...");

    // Process next job
    const processed = await omniQueue.processNextJob("ZVN");
    if (processed) {
        console.log("Job was picked up and processed.");
    } else {
        console.log("No PENDING jobs found.");
    }

    process.exit(0);
}

run().catch(e => {
    console.error("Error running queue locally:", e);
    process.exit(1);
});
