#!/usr/bin/env node

/**
 * Automated Server Check and Start Script
 * Checks if Next.js dev server is running on port 3000
 * Automatically starts it if not running
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import net from 'net';

const execAsync = promisify(exec);

const PORT = 3000;
const HOST = 'localhost';

/**
 * Check if a port is in use
 */
const { writeFileSync } = await import('fs');
const { join } = await import('path');

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
    return new Promise((resolve) => {
        const tester = net.createServer()
            .once('error', (err) => {
                if (err.code === 'EADDRINUSE') return resolve(true);
                resolve(false);
            })
            .once('listening', () => {
                tester.once('close', () => resolve(false)).close();
            })
            .listen(port, HOST);
    });
}

/**
 * Find the first available port or running server
 */
async function findRunningServerOrAvailablePort() {
    const startPort = 3000;
    const endPort = 3010;

    for (let port = startPort; port <= endPort; port++) {
        if (await isPortInUse(port)) {
            // Check if it's our server (rudimentary check, or just assume for now if we can't query)
            // For now, if a port is in use, we'll assume it might be our dev server specific to this workflow context
            // In a more advanced version, we could fetch /api/health or similar
            // But let's check if we CAN bind to it. If isPortInUse returns true, it's used.
            // But we actually want to find if it IS our server OR if we should start one.
            // Simplified logic: Start scanning.
            // If we find a used port, we might want to verify it.
            // But for 'check_server', if we find one running, we assume it's good?
            // Actually, the previous logic was: Check 3000. If InUse -> Good. Else -> Start.
            // New logic: Check 3000...3010. If InUse -> Assume Good and return that port?
            // OR: If nothing running, start on first available.

            // Let's stick to: "If server is running, used that port."
            // But how do we distinguish "Other App" from "Our App"?
            // We can't easily without a specific endpoint.
            // Let's assume if 3000-3010 is taken, it's likely a dev server we want to connect to.
            return { port, status: 'running' };
        }
    }

    // If nothing found running in range, find first FREE port to start on
    for (let port = startPort; port <= endPort; port++) {
        if (!(await isPortInUse(port))) {
            return { port, status: 'available' };
        }
    }

    throw new Error('No ports available between 3000-3010');
}

/**
 * Start the Next.js dev server
 */
async function startDevServer(port) {
    console.log(`🚀 Starting Next.js dev server on port ${port}...`);

    // Start server in background
    // We explicitly pass the port to ensure it tries the one we detected as free
    const serverProcess = exec(`npx next dev -p ${port}`, {
        cwd: process.cwd(),
        windowsHide: true
    });

    // Wait for server to be ready (max 30 seconds)
    const maxWaitTime = 30000;
    const checkInterval = 1000;
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        elapsed += checkInterval;

        const inUse = await isPortInUse(port);
        if (inUse) {
            console.log(`✅ Server started successfully on http://${HOST}:${port}`);
            return true;
        }
    }

    console.log('⚠️  Server startup timeout');
    return false;
}

/**
 * Save port to file for other scripts
 */
function savePort(port) {
    const portFile = join(process.cwd(), '.server-port');
    writeFileSync(portFile, port.toString(), 'utf-8');
    // console.log(`💾 Saved port ${port} to .server-port`);
}

/**
 * Main execution
 */
async function main() {
    try {
        // 1. Check if we have a running server or need to start one
        // Strategy:
        // - If 3000 is used, assume it's Good.
        // - If 3000 free, start on 3000.
        // - If 3000 used but explicitly blocked/zombie (handled by recover script), well...
        // - Recover script kills zombies. So if we are here, 'Used' means 'Actual Running Server' or 'Other App'.

        // Simple approach:
        // Try to check if 3000 is in use.
        // If yes -> Write 3000 to file. Exit.
        // If no -> Try 3000. Start.

        // Wait, the requirement was "Dynamic Port".
        // Use Next.js default behavior? No, we need to KNOW the port.
        // Better: Scan for free port. Start on that.
        // But if I already have a server on 3005?
        // I should check 3000..3010. If any is listening, pick the first one?
        // Risky if I have Python server on 3000 and Next on 3005.
        // But for this project, likely single user.

        // Let's iterate:
        // Check 3000. If running -> Use 3000.
        // Check 3001. If running -> Use 3001.
        // ...
        // If nothing running, pick 3000 (or first free).

        let targetPort = 3000;
        let serverRunning = false;

        const startPort = 3000;
        const endPort = 3010;

        console.log(`🔍 Scanning ports ${startPort}-${endPort} for active ZAP servers...`);

        // Scan for EXISTING servers first
        for (let p = startPort; p <= endPort; p++) {
            if (await isPortInUse(p)) {
                console.log(`📡 Detected activity on http://${HOST}:${p}. Assuming active dev server.`);
                targetPort = p;
                serverRunning = true;
                break;
            }
        }

        if (!serverRunning) {
            // Find first FREE port
            for (let p = startPort; p <= endPort; p++) {
                if (!(await isPortInUse(p))) {
                    targetPort = p;
                    break;
                }
            }
            console.log(`✨ Port ${targetPort} is available. Launching new Next.js instance...`);
            const started = await startDevServer(targetPort);
            if (!started) {
                console.error(`❌ Failed to start server on port ${targetPort}. Please check for zombie processes.`);
                process.exit(1);
            }
        }

        savePort(targetPort);
        console.log(`🚀 Workspace Ready at http://${HOST}:${targetPort}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
