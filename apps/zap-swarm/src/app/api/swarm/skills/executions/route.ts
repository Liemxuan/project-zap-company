import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

/**
 * GET /api/swarm/skills/executions — Query skill execution history
 * 
 * Query params:
 *   skillName?: string  — Filter by skill name
 *   status?: string     — Filter by status (DISPATCHED, COMPLETED, FAILED)
 *   limit?: number      — Max results (default 50)
 */
export async function GET(req: Request) {
    let client: MongoClient | null = null;
    try {
        const { tenantId } = await getTenantContext();
        const url = new URL(req.url);
        const skillName = url.searchParams.get("skillName");
        const status = url.searchParams.get("status");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);

        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection("ZVN_SYS_SKILL_EXECUTIONS");

        const query: any = { tenantId };
        if (skillName) query.skillName = skillName;
        if (status) query.status = status;

        const executions = await col.find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        // Enrich with job status from the queue if job is still in-flight
        const jobCol = db.collection(`${tenantId}_SYS_OS_job_queue`);
        const enriched = await Promise.all(
            executions.map(async (exec) => {
                const result: any = { ...exec, _id: exec._id.toString() };
                
                if (exec.jobId && exec.status === "DISPATCHED") {
                    try {
                        const { ObjectId } = await import("mongodb");
                        const job = await jobCol.findOne({ _id: new ObjectId(exec.jobId) });
                        if (job) {
                            result.jobStatus = job.status;
                            // If job completed/failed, update the execution record
                            if (job.status === "COMPLETED" || job.status === "FAILED") {
                                const newStatus = job.status === "COMPLETED" ? "COMPLETED" : "FAILED";
                                await col.updateOne(
                                    { _id: exec._id },
                                    { $set: { status: newStatus, completedAt: new Date() } }
                                );
                                result.status = newStatus;
                            }
                        }
                    } catch {
                        // Non-blocking enrichment
                    }
                }
                
                return result;
            })
        );

        // Compute aggregate stats
        const allExecs = await col.find({ tenantId }).toArray();
        const stats = {
            total: allExecs.length,
            dispatched: allExecs.filter(e => e.status === "DISPATCHED").length,
            completed: allExecs.filter(e => e.status === "COMPLETED").length,
            failed: allExecs.filter(e => e.status === "FAILED").length,
        };

        return NextResponse.json({ success: true, executions: enriched, stats });
    } catch (error: any) {
        console.error(`[api/swarm/skills/executions] Error:`, error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
