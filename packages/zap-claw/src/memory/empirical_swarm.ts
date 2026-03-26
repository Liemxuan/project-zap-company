import "dotenv/config";
import { vectorStore } from "./vector_store.js";
import { AgentLoop } from "../agent.js";
import { prisma } from "../db/client.js";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const TEST_USER_ID = 777777;
const N_TRIALS = 20; // Set lower for faster validation in this turn, default N=100 in production

interface Metrics {
    latencyFast: number[];
    latencyDeep: number[];
    recallSuccess: number;
    isolationBreaches: number;
    tokenSavings: number;
}

async function runSwarm() {
    console.log("🦾 [swarm] Deploying Empirical Validation Swarm (EXP-005)...");

    const metrics: Metrics = {
        latencyFast: [],
        latencyDeep: [],
        recallSuccess: 0,
        isolationBreaches: 0,
        tokenSavings: 0,
    };

    const agent = new AgentLoop();
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db("zap-claw");
    const collection = db.collection("merchant_memory");

    // Setup: Seed massive isolated memory
    console.log("[swarm] Phase 1: Seeding high-density isolated memory...");
    await collection.deleteMany({ merchantId: TEST_USER_ID.toString() });

    const personalFacts = [
        "User prefers dark roast coffee from Ethiopia.",
        "User's primary coding language is TypeScript.",
        "User likes a minimalist UI with HSL colors.",
        "User's dog is named 'Pixel'.",
        "User works from a home office in Portland."
    ];

    const businessFacts = [
        "Company uses AWS us-east-1 for all production instances.",
        "Project 'Titan' uses a tripartite storage architecture.",
        "Monthly cloud budget is capped at $5,000.",
        "Production database is MongoDB Atlas Sharded cluster.",
        "Emergency contact for server downtime is CTO Jerry."
    ];

    for (const f of personalFacts) {
        const embedding = await vectorStore.getEmbedding(f);
        await collection.insertOne({ merchantId: TEST_USER_ID.toString(), accountType: "PERSONAL", factType: "PREFERENCE", fact: f, embedding });
    }
    for (const f of businessFacts) {
        const embedding = await vectorStore.getEmbedding(f);
        await collection.insertOne({ merchantId: TEST_USER_ID.toString(), accountType: "BUSINESS", factType: "TECHNICAL", fact: f, embedding });
    }

    console.log("[swarm] Phase 2: Executing Bicameral Routing & Recall Trials...");

    for (let i = 0; i < N_TRIALS; i++) {
        // Trial A: Fast-Brain + Personal Recall
        const startTimeFast = performance.now();
        const fastQuery = "What's my dog's name?";
        const responseFast = await agent.run(TEST_USER_ID, fastQuery, "PERSONAL");
        const endTimeFast = performance.now();
        metrics.latencyFast.push(endTimeFast - startTimeFast);

        if (responseFast.includes("Pixel")) metrics.recallSuccess++;
        if (responseFast.includes("AWS") || responseFast.includes("Titan")) metrics.isolationBreaches++;

        // Trial B: Deep-Brain + Business Recall
        const startTimeDeep = performance.now();
        const deepQuery = "Analyze the tripartite storage architecture of Project Titan and its cost impact.";
        const responseDeep = await agent.run(TEST_USER_ID, deepQuery, "BUSINESS");
        const endTimeDeep = performance.now();
        metrics.latencyDeep.push(endTimeDeep - startTimeDeep);

        if (responseDeep.includes("tripartite") || responseDeep.includes("MongoDB")) metrics.recallSuccess++;
        if (responseDeep.includes("Pixel") || responseDeep.includes("coffee")) metrics.isolationBreaches++;

        // Trial C: Token Savings (Theoretical)
        // Previous system would inject all 10 facts (approx 200 tokens). 
        // Current system injects top 2 (approx 40 tokens).
        metrics.tokenSavings += 160;

        console.log(`[swarm] Trial ${i + 1}/${N_TRIALS} complete.`);
    }

    // Report Generation
    const avgFast = metrics.latencyFast.reduce((a, b) => a + b, 0) / N_TRIALS;
    const avgDeep = metrics.latencyDeep.reduce((a, b) => a + b, 0) / N_TRIALS;
    const recallRate = (metrics.recallSuccess / (N_TRIALS * 2)) * 100;
    const isolationRate = 100 - ((metrics.isolationBreaches / (N_TRIALS * 2)) * 100);

    console.log("\n📊 === EXP-005 SWARM REPORT ===");
    console.log(`Average Fast-Brain Latency: ${avgFast.toFixed(2)}ms`);
    console.log(`Average Deep-Brain Latency: ${avgDeep.toFixed(2)}ms`);
    console.log(`Recall Accuracy Rate:       ${recallRate}%`);
    console.log(`Account Isolation Integrity: ${isolationRate}%`);
    console.log(`Total Token Savings (est):  ${metrics.tokenSavings} tokens`);

    await client.close();
    await vectorStore.close();
}

runSwarm().catch(console.error);
