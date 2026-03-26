import { omniQueue } from "../src/runtime/engine/omni_queue.js";

async function main() {
    const jobId = process.argv[2];
    const tenantId = process.argv[3] || "ZVN";

    if (!jobId) {
        console.error("Usage: tsx approve_job.ts <jobId> [tenantId]");
        process.exit(1);
    }

    try {
        console.log(`[Approve Job] Connecting to queue for tenant: ${tenantId}...`);
        await omniQueue.connect(tenantId);

        console.log(`[Approve Job] Approving job ${jobId}...`);
        const success = await omniQueue.approveJob(jobId, tenantId);

        if (success) {
            console.log(`✅ Successfully approved Job ID: ${jobId}`);
            console.log(`The daemon will now pick it up for processing.`);
        } else {
            console.error(`❌ Failed to approve Job ID: ${jobId}. Either it doesn't exist, or it is not in WAITING_APPROVAL state.`);
        }
    } catch (e: any) {
        console.error(`[Approve Job] Fatal Error:`, e.message);
    } finally {
        process.exit(0);
    }
}

main();
