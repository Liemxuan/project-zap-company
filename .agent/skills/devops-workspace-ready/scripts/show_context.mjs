#!/usr/bin/env node

/**
 * Context Summary - Show Progress and Outstanding Tasks
 * Displays current project state and opens task.md for review
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Find the most recent task.md in brain directory
 */
function findLatestTaskFile() {
    const brainDir = 'C:\\Users\\kayvi\\.gemini\\antigravity\\brain';

    if (!existsSync(brainDir)) {
        return null;
    }

    try {
        const conversations = readdirSync(brainDir)
            .map(name => join(brainDir, name))
            .filter(path => statSync(path).isDirectory());

        let latestTask = null;
        let latestTime = 0;

        for (const convDir of conversations) {
            const taskPath = join(convDir, 'task.md');
            if (existsSync(taskPath)) {
                const stat = statSync(taskPath);
                if (stat.mtimeMs > latestTime) {
                    latestTime = stat.mtimeMs;
                    latestTask = taskPath;
                }
            }
        }

        return latestTask;
    } catch (error) {
        return null;
    }
}

/**
 * Parse task.md and extract summary
 */
function parseTaskFile(taskPath) {
    try {
        const content = readFileSync(taskPath, 'utf-8');
        const lines = content.split('\n');

        let totalTasks = 0;
        let completedTasks = 0;
        let inProgressTasks = 0;
        let pendingTasks = 0;
        let currentSection = '';
        const sections = [];

        for (const line of lines) {
            // Track sections
            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').trim();
                sections.push({ name: currentSection, tasks: [] });
            }

            // Count tasks
            if (line.trim().startsWith('- [')) {
                totalTasks++;
                if (line.includes('- [x]')) {
                    completedTasks++;
                } else if (line.includes('- [/]')) {
                    inProgressTasks++;
                    if (sections.length > 0) {
                        sections[sections.length - 1].tasks.push(line.trim());
                    }
                } else if (line.includes('- [ ]')) {
                    pendingTasks++;
                    if (sections.length > 0) {
                        sections[sections.length - 1].tasks.push(line.trim());
                    }
                }
            }
        }

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            sections,
            content
        };
    } catch (error) {
        return null;
    }
}

/**
 * Display context summary
 */
function displaySummary(taskPath, taskData) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 SESSION CONTEXT SUMMARY');
    console.log('='.repeat(60) + '\n');

    if (!taskData) {
        console.log('ℹ️  No active task file found');
        console.log('   Starting fresh session\n');
        return;
    }

    // Progress Overview
    console.log('📊 PROGRESS OVERVIEW:');
    console.log(`   Total Tasks: ${taskData.totalTasks}`);
    console.log(`   ✅ Completed: ${taskData.completedTasks}`);
    console.log(`   🔄 In Progress: ${taskData.inProgressTasks}`);
    console.log(`   ⏳ Pending: ${taskData.pendingTasks}`);

    const progress = taskData.totalTasks > 0
        ? Math.round((taskData.completedTasks / taskData.totalTasks) * 100)
        : 0;
    console.log(`   Progress: ${progress}%\n`);

    // Outstanding Tasks
    if (taskData.inProgressTasks > 0 || taskData.pendingTasks > 0) {
        console.log('🎯 OUTSTANDING WORK:');

        for (const section of taskData.sections) {
            if (section.tasks.length > 0) {
                console.log(`\n   ${section.name}:`);
                section.tasks.forEach(task => {
                    const status = task.includes('[/]') ? '🔄' : '⏳';
                    const taskText = task.replace(/- \[.\]/, '').trim();
                    console.log(`   ${status} ${taskText}`);
                });
            }
        }
        console.log('');
    }

    // Constraints
    console.log('⚠️  CURRENT CONSTRAINTS:');
    console.log('   - Review task.md for detailed context');
    console.log('   - Check git status for uncommitted changes');
    console.log('   - Verify IDE problems are current (not stale)\n');

    console.log('📂 Task File: ' + taskPath);
    console.log('='.repeat(60) + '\n');
}

/**
 * Open task.md in default editor
 */
async function openTaskFile(taskPath) {
    if (!taskPath || !existsSync(taskPath)) {
        return;
    }

    try {
        console.log('📖 Opening task.md...');
        // Use VS Code if available, otherwise use default editor
        await execAsync(`code "${taskPath}"`, { cwd: process.cwd() });
        console.log('   ✅ Opened in VS Code\n');
    } catch (error) {
        try {
            // Fallback to default editor
            await execAsync(`start "" "${taskPath}"`, {
                cwd: process.cwd(),
                shell: 'cmd.exe'
            });
            console.log('   ✅ Opened in default editor\n');
        } catch (fallbackError) {
            console.log('   ℹ️  Could not auto-open (file path shown above)\n');
        }
    }
}

/**
 * Main execution
 */
async function main() {
    const taskPath = findLatestTaskFile();
    const taskData = taskPath ? parseTaskFile(taskPath) : null;

    displaySummary(taskPath, taskData);

    if (taskPath) {
        await openTaskFile(taskPath);
    }

    process.exit(0);
}

main();
