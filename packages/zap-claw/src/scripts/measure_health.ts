import { MongoClient } from "mongodb";
import { execSync } from "child_process";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

export interface HealthReport {
    score: number;
    records: string[];
    isOptimal: boolean;
    timestamp: Date;
}

export async function runDiagnostic(): Promise<HealthReport> {
    let score = 100;
    const records: string[] = [];

    // 1. Process Hygiene Check
    try {
        const psOutput = execSync('ps aux | grep "tsx" | grep -v grep').toString();
        const tsxProcesses = psOutput.trim().split('\n').filter(line => line.length > 0);

        if (tsxProcesses.length > 2) { // 1 for index.ts, 1 for the watcher usually
            score -= 20;
            records.push(`Zombie process overlap detected (${tsxProcesses.length} active).`);
        }
    } catch (e) {
        // No processes found, that's fine for a diagnostic
    }

    // 2. Database Connectivity
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        await db.command({ ping: 1 });

        const infraCol = db.collection("SYS_OS_infra_keys");
        const keyCount = await infraCol.countDocuments();
        if (keyCount === 0) {
            score -= 40;
            records.push("Infra keys collection is empty.");
        }
    } catch (e: any) {
        score -= 50;
        records.push(`Database unreachable: ${e.message}`);
    } finally {
        await client.close();
    }

    // 3. Port Check (3000)
    try {
        execSync('lsof -i :3000').toString();
    } catch (e) {
        score -= 10;
        records.push("Port 3000 is inactive (Server might be down).");
    }

    return {
        score,
        records,
        isOptimal: score === 100,
        timestamp: new Date()
    };
}

// Support for CLI-only execution
if (import.meta.url.endsWith(process.argv[1]!.replace(/\\/g, '/'))) {
    console.log(`\n[AROS Health Check] 🔍 Starting System Diagnostics...\n`);
    runDiagnostic().then(report => {
        console.log(`[PROCESS] ${report.records.some(r => r.includes('Zombie')) ? '⚠️ WARNING' : '✅ Clean'}`);
        console.log(`[DATABASE] ${report.records.some(r => r.includes('Database')) ? '❌ FAILED' : '✅ Connected'}`);
        console.log(`[PORT 3000] ${report.records.some(r => r.includes('3000')) ? '⚠️ WARNING' : '✅ Bound'}`);

        console.log(`\n------------------------------------------------------`);
        console.log(`📊 FINAL HEALTH SCORE: ${report.score}/100`);
        console.log(`------------------------------------------------------`);

        if (report.records.length > 0) {
            console.log(`\nIssues Identified:`);
            report.records.forEach(r => console.log(` - ${r}`));
        } else {
            console.log(`\n✨ System is optimal. AROS compliance verified.`);
        }
        console.log(`\n[AROS] Diagnostics Complete.\n`);
    }).catch(console.error);
}
