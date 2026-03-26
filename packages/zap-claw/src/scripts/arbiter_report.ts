import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

async function generateArbiterReport() {
    console.log("\n📊 [ZAP Arbiter] Performance & Cost Leaderboard:");

    if (!MONGO_URI) {
        console.error("MONGODB_URI missing.");
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const metricsCol = db.collection("SYS_OS_arbiter_metrics");

        // Aggregating performance by Theme
        const stats = await metricsCol.aggregate([
            {
                $group: {
                    _id: "$theme",
                    avgLatency: { $avg: "$latencyMs" },
                    totalTokens: { $sum: "$tokens.total" },
                    count: { $sum: 1 },
                    models: { $addToSet: "$modelId" }
                }
            },
            { $sort: { avgLatency: 1 } }
        ]).toArray();

        if (stats.length === 0) {
            console.log("   (No data yet. Run some interactions to generate telemetry.)");
        } else {
            console.table(stats.map(s => ({
                Theme: s._id || "DEFAULT",
                "Avg Latency (ms)": Math.round(s.avgLatency),
                "Total Tokens": s.totalTokens,
                "Request Count": s.count,
                "Used Models": s.models.length
            })));
        }

    } catch (e: any) {
        console.error("Report failed:", e.message);
    } finally {
        await client.close();
    }
}

generateArbiterReport();
