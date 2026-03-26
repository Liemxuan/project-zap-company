import { runRalphExtraction } from "./memory/ralph.js";
import { runMongoSync } from "./memory/sync.js";
import { runProactiveHeartbeat } from "./cron/heartbeat.js";
import { runModelSync } from "./cron/sync_models.js";
import { runAtaWatchdog } from "./cron/ata_watchdog.js";
import { runMsidReport } from "./cron/msid_report.js";
import { omniQueue } from "./runtime/engine/omni_queue.js";

// Polling Intervals (Constants)
const RALPH_LOOP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const MONGO_SYNC_INTERVAL_MS = 60 * 1000; // 60 seconds
const ATA_WATCHDOG_INTERVAL_MS = 30 * 1000; // 30 seconds

let isRalphLoopRunning = false;
let isMongoSyncRunning = false;

export function startDaemon() {
    console.log("⚙️ [daemon] Master Job Queue daemon initializing...");

    // EXEC-002: Ralph Loop (Stateless Facts Extraction)
    const runRalph = async () => {
        if (isRalphLoopRunning) return;
        isRalphLoopRunning = true;
        try {
            await runRalphExtraction();
        } catch (err: any) {
            console.error("❌ [daemon] Ralph Loop encountered an error:", err.message);
        } finally {
            isRalphLoopRunning = false;
        }
    };
    setInterval(runRalph, RALPH_LOOP_INTERVAL_MS);
    runRalph(); // Trigger immediately on boot

    // EXEC-003: Mongo Sync (Global State Migration)
    const runMongo = async () => {
        if (isMongoSyncRunning) return;
        isMongoSyncRunning = true;
        try {
            await runMongoSync();
        } catch (err: any) {
            console.error("❌ [daemon] Mongo Sync encountered an error:", err.message);
        } finally {
            isMongoSyncRunning = false;
        }
    };
    setInterval(runMongo, MONGO_SYNC_INTERVAL_MS);
    runMongo(); // Trigger immediately on boot

    // EXEC-004: ATA Watchdog (Agent Standstill Resolution)
    let isAtaWatchdogRunning = false;
    const runAta = async () => {
        if (isAtaWatchdogRunning) return;
        isAtaWatchdogRunning = true;
        try {
            await runAtaWatchdog();
        } catch (err: any) {
            console.error("❌ [daemon] ATA Watchdog encountered an error:", err.message);
        } finally {
            isAtaWatchdogRunning = false;
        }
    };
    setInterval(runAta, ATA_WATCHDOG_INTERVAL_MS);
    runAta(); // Trigger immediately on boot

    // PHASE 17: Proactive AI Heartbeat (Background Triggers)
    let isHeartbeatRunning = false;
    const runHeartbeat = async () => {
        if (isHeartbeatRunning) return;
        isHeartbeatRunning = true;
        try {
            await runProactiveHeartbeat();
        } catch (err: any) {
            console.error("❌ [daemon] Proactive Heartbeat encountered an error:", err.message);
        } finally {
            isHeartbeatRunning = false;
        }
    };
    setInterval(runHeartbeat, 30 * 60 * 1000);

    // PHASE 20: Dynamic Model Sync (12 Hour Interval)
    let isModelSyncRunning = false;
    const runModelSyncJob = async () => {
        if (isModelSyncRunning) return;
        isModelSyncRunning = true;
        try {
            await runModelSync();
        } catch (err: any) {
            console.error("❌ [daemon] Model Sync encountered an error:", err.message);
        } finally {
            isModelSyncRunning = false;
        }
    };
    // Run once every 12 hours
    setInterval(runModelSyncJob, 12 * 60 * 60 * 1000);
    runModelSyncJob(); // Trigger immediately on boot

    // BLAST-010: Daily MSID Report (8:00 AM)
    let lastMsidReportDate = "";
    const runMsidCron = async () => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
        const currentDate = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

        if (currentTime === "08:00" && lastMsidReportDate !== currentDate) {
            lastMsidReportDate = currentDate;
            try {
                await runMsidReport();
            } catch (err: any) {
                console.error("❌ [daemon] MSID Report failed:", err.message);
            }
        }
    };
    setInterval(runMsidCron, 60 * 1000); // Check every minute

    // ACTIVATION: OmniQueue Worker Daemon
    // This allows active jobs placed in the Mongo queue to be pulled and processed by the engine
    omniQueue.startWorkerDaemon("ZVN", 2000).catch(err => {
        console.error("❌ [daemon] OmniQueue Worker Daemon failed:", err.message);
    });

    console.log("⚙️ [daemon] Master Job Queue daemon running in background.");
}
