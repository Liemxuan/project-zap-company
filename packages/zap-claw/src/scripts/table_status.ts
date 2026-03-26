import 'dotenv/config';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function run() {
    // 1. Connect to MongoDB Queue
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const mongoDb = mongoClient.db("olympus");
    const queueCol = mongoDb.collection("ZVN_SYS_OS_job_queue");

    // Get all recent jobs related to Spike Pages
    const jobs = await queueCol.find({ "payload.messages.content": { $regex: "ZAP-SPIKE-PAGES" } }).toArray();

    // 2. Read SQLite CSV Dump
    const rawPages = fs.readFileSync("/tmp/pages.csv", "utf8").trim().split("\n").slice(1);

    console.log("| Target Page | Fonts | Colors | Spacing | Swarm Status |");
    console.log("| :--- | :--- | :--- | :--- | :--- |");

    for (const line of rawPages) {
        if (!line.trim()) continue;
        const [pathStr, fonts, colors, spacing] = line.split(",");

        const fontStatus = fonts === "1" ? "✅" : "❌";
        const colorStatus = colors === "1" ? "✅" : "❌";
        const spaceStatus = spacing === "1" ? "✅" : "❌";

        // Find matching job
        let jobStatus = "🟡 QUEUED";
        const matchingJob = jobs.find(j => j.payload.messages[0].content.includes(pathStr));

        if (matchingJob) {
            if (matchingJob.status === "COMPLETED") jobStatus = "🟢 COMPLETED";
            else if (matchingJob.status === "PROCESSING") jobStatus = "🟡 PROCESSING";
            else if (matchingJob.status === "PENDING") jobStatus = "⏳ PENDING";
            else if (matchingJob.status === "FAILED") jobStatus = "🔴 FAILED";
        }

        console.log(`| \`${pathStr}\` | ${fontStatus} | ${colorStatus} | ${spaceStatus} | ${jobStatus} |`);
    }

    await mongoClient.close();
}

run().catch(console.error);
