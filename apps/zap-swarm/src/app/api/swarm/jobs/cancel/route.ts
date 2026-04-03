import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

/**
 * POST /api/swarm/jobs/cancel — Cancel a job (cascading for DAG workflows)
 * 
 * Body:
 *   jobId: string  — The job ObjectId to cancel
 */
export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const body = await req.json();
        const { jobId } = body;
        const { tenantId } = await getTenantContext();

        if (!jobId) {
            return NextResponse.json({ error: "Missing required field: jobId" }, { status: 400 });
        }

        client = await getGlobalMongoClient();
        const db = client.db(DB_NAME);
        const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

        const job = await col.findOne({ _id: new ObjectId(jobId) });
        if (!job) {
            return NextResponse.json({ error: `Job ${jobId} not found.` }, { status: 404 });
        }

        let cancelled = 0;

        // Cancel the target job if in a cancellable state
        const CANCELLABLE = ["PENDING", "BLOCKED", "WAITING_APPROVAL"];
        if (CANCELLABLE.includes(job.status)) {
            await col.updateOne(
                { _id: job._id },
                { $set: { status: "CANCELLED", completedAt: new Date(), errorMap: "Cancelled by operator" } }
            );
            cancelled++;
        }

        // Cascade across DAG workflow
        if (job.workflowId) {
            const res = await col.updateMany(
                {
                    workflowId: job.workflowId,
                    status: { $in: CANCELLABLE }
                },
                { $set: { status: "CANCELLED", completedAt: new Date(), errorMap: `Cascade cancel from job ${jobId}` } }
            );
            cancelled += res.modifiedCount;
        }

        logger.info("Job cancelled", { jobId, tenantId, cancelled, workflowId: job.workflowId || null });

        return NextResponse.json({
            success: true,
            cancelled,
            jobId,
            workflowId: job.workflowId || null,
        });
    } catch (error: any) {
        logger.error("Cancel job failed", { error: error.message });
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
    }
}
