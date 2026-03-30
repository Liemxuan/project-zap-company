import mongoose, { Schema } from "mongoose";

export interface IJob {
    jobId: string;
    tenantId: string;
    status: "PENDING" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "FAILED";
    target_lane: "short" | "long" | "complex";
    assigned_agent?: string;
    payload: any;
    review_url?: string;
    result?: any;
    created_at: Date;
    updated_at: Date;
}

const JobQueueSchema = new Schema<IJob>(
    {
        jobId: { type: String, required: true, unique: true, index: true },
        tenantId: { type: String, required: true, index: true },
        status: { 
            type: String, 
            enum: ["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED", "FAILED"], 
            default: "PENDING",
            required: true 
        },
        target_lane: { 
            type: String, 
            enum: ["short", "long", "complex"], 
            required: true 
        },
        assigned_agent: { type: String },
        payload: { type: Schema.Types.Mixed, required: true },
        review_url: { type: String },
        result: { type: Schema.Types.Mixed },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Index for fast queue pulling: oldest PENDING jobs by lane
JobQueueSchema.index({ status: 1, target_lane: 1, created_at: 1 });

export const JobQueue = (mongoose.models.ZVN_SYS_OS_job_queue as mongoose.Model<IJob>) || mongoose.model<IJob>("ZVN_SYS_OS_job_queue", JobQueueSchema);
/**
 * Pushes a new job into the queue.
 */
export async function createJob(
    jobId: string,
    tenantId: string,
    target_lane: "short" | "long" | "complex",
    payload: any
): Promise<IJob> {
    const job = await JobQueue.create({
        jobId,
        tenantId,
        status: "PENDING",
        target_lane,
        payload
    });
    return job;
}

/**
 * OmniRouter Worker Pull:
 * Atomically finds the oldest PENDING job for a specific lane and marks it IN_PROGRESS,
 * assigning it to the requesting agent.
 */
export async function claimJob(
    target_lane: "short" | "long" | "complex",
    agentId: string
): Promise<IJob | null> {
    const job = await JobQueue.findOneAndUpdate(
        { status: "PENDING", target_lane },
        { 
            $set: { 
                status: "IN_PROGRESS", 
                assigned_agent: agentId,
                updated_at: new Date()
            } 
        },
        { sort: { created_at: 1 }, returnDocument: "after" }
    );
    return job;
}

/**
 * Halts a job for Zeus' explicit review.
 */
export async function blockJobForReview(
    jobId: string,
    review_url: string
): Promise<IJob | null> {
    const job = await JobQueue.findOneAndUpdate(
        { jobId },
        { 
            $set: { 
                status: "BLOCKED", 
                review_url,
                updated_at: new Date()
            } 
        },
        { new: true }
    );
    return job;
}

/**
 * Completes a job.
 */
export async function completeJob(
    jobId: string,
    result: any
): Promise<IJob | null> {
    const job = await JobQueue.findOneAndUpdate(
        { jobId },
        { 
            $set: { 
                status: "COMPLETED", 
                result,
                updated_at: new Date()
            } 
        },
        { new: true }
    );
    return job;
}

/**
 * Marks a job as FAILED.
 */
export async function failJob(
    jobId: string,
    error: any
): Promise<IJob | null> {
    const job = await JobQueue.findOneAndUpdate(
        { jobId },
        { 
            $set: { 
                status: "FAILED", 
                result: error,
                updated_at: new Date()
            } 
        },
        { new: true }
    );
    return job;
}
