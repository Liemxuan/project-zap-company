import mongoose from "mongoose";
import { createJob, claimJob, completeJob } from "../runtime/router/job_queue.js";

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/olympus");
        console.log("Connected.");

        console.log("Creating dummy job...");
        const job = await createJob(`TEST_${Date.now()}`, "ZVN", "short", { prompt: "Hello from Mongoose Schema" });
        console.log("Job created:", job.jobId);

        console.log("Claiming job...");
        const claimed = await claimJob("short", "Agent_Jerry");
        console.log("Claimed job:", claimed?.jobId, "by", claimed?.assigned_agent);

        if (claimed) {
            console.log("Completing job...");
            await completeJob(claimed.jobId, { status: "success", parsed: true });
            console.log("Job completed.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
