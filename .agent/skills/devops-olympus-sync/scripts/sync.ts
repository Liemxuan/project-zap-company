import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Swarm-Sync Automation Script
 * Standardizes the backup and global synchronization process.
 */

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const DATA_DIR = path.join(REPO_ROOT, 'data');
const GUIDE_PATH = path.join(REPO_ROOT, 'collaboration_guide.md');

function runSync() {
    console.log('🚀 Starting ZAP Olympus Sync...');

    try {
        // 1. Stage all changes
        console.log('📦 Staging changes...');
        execSync('git add .', { cwd: REPO_ROOT });

        // 2. Commit with metadata
        const timestamp = new Date().toISOString();
        const message = `chore(sync): automated swarm backup ${timestamp}`;
        console.log(`📝 Committing: ${message}`);
        execSync(`git commit -m "${message}"`, { cwd: REPO_ROOT });

        // 3. Push to global remote
        console.log('☁️ Pushing to global repository...');
        execSync('git push origin main', { cwd: REPO_ROOT });

        // 4. Update Collaboration Guide
        console.log('📄 Updating Collaboration Guide...');
        const guideContent = `# 🌏 Global Olympus Sync\n\nLast Sync: ${timestamp}\nStatus: Active\n\nRun 'git pull' to receive the latest agent memories and logic.\n`;
        fs.writeFileSync(GUIDE_PATH, guideContent);

        console.log('✅ Sync Complete. Everything is backed up and global.');
    } catch (error) {
        console.error('❌ Sync Failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

runSync();
