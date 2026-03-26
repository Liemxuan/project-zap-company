import 'dotenv/config';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function run() {
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const mongoDb = mongoClient.db("olympus");
    const queueCol = mongoDb.collection("ZVN_SYS_OS_job_queue");

    // Get all recent jobs related to Spike Pages
    const jobs = await queueCol.find({ "payload.messages.content": { $regex: "ZAP-SPIKE-PAGES" } }).toArray();

    // Read SQLite CSV Dump — gracefully handle missing file
    const csvPath = "/tmp/pages.csv";
    if (!fs.existsSync(csvPath)) {
        console.log(JSON.stringify([]));
        await mongoClient.close();
        return;
    }
    const rawPages = fs.readFileSync(csvPath, "utf8").trim().split("\n").slice(1);

    const result = [];
    let idCounter = 1;

    for (const line of rawPages) {
        if (!line.trim()) continue;
        const [pathStr, fonts, colors, spacing] = line.split(",");
        if (!pathStr) continue;

        // Find matching job
        let jobStatus = "QUEUED";
        let qcDate = null;

        // Let's parse matchingJob
        const matchingJob = jobs.find(j => j.payload.messages[0].content.includes(pathStr));

        if (matchingJob) {
            jobStatus = matchingJob.status;
            if (matchingJob.completedAt) {
                qcDate = new Date(matchingJob.completedAt).toISOString();
            }
        }

        result.push({
            id: idCounter++,
            path: pathStr.replace("src/app", "").replace("/page.tsx", ""), // Make it a clickable URL
            fullPath: pathStr,
            fonts: fonts === "1",
            colors: colors === "1",
            spacing: spacing === "1",
            status: jobStatus,
            worker: "Spike",
            qcDate: qcDate
        });
    }

    console.log(JSON.stringify(result, null, 2));

    await mongoClient.close();
}

run().catch(e => {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
});
