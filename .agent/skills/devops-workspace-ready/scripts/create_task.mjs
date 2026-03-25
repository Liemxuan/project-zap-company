#!/usr/bin/env node

/**
 * Create Task with Unique ID
 * Generates CURRENT_TASK.md in project root with unique task ID
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

function generateTaskId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `TASK-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function createTaskFile() {
    const taskPath = join(process.cwd(), 'CURRENT_TASK.md');
    let existingId = null;
    let existingContent = '';

    if (existsSync(taskPath)) {
        try {
            existingContent = readFileSync(taskPath, 'utf-8');
            const idMatch = existingContent.match(/\*\*Task ID:\*\* (TASK-\d{8}-\d{6})/);
            if (idMatch) {
                existingId = idMatch[1];
                console.log(`ℹ️  Found existing Task ID: ${existingId}`);
            }
        } catch (e) {
            // Ignore read errors
        }
    }

    const taskId = existingId || generateTaskId();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Read project version from package.json
    let projectVersion = 'unknown';
    try {
        const pkgPath = join(process.cwd(), 'package.json');
        const pkgContent = readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        projectVersion = `v${pkg.version}`;
    } catch (error) {
        // Use unknown if can't read package.json
    }

    let content;
    if (existingId) {
        // Update existing file while preserving Objective/Breakdown if possible
        // For simplicity in this script, we'll just refresh the header meta but keep the file
        // A more advanced version would parse and preserve, but for now we'll just acknowledge reuse
        console.log(`✅ Session continued: ${taskId}`);
        return taskId;
    } else {
        content = `# Current Task

**Task ID:** ${taskId}  
**Created:** ${timestamp}  
**Status:** Active  
**Project Version:** ${projectVersion} (from package.json)

## Objective

[Description of what you're working on]

## Task Breakdown

- [ ] [List your tasks here]

## Current Work

[What you're currently doing]

## Constraints

[Any constraints or limitations]

## Notes

- Task ID links to project version shown at bottom of app
- [Additional notes or context]
`;
        writeFileSync(taskPath, content, 'utf-8');
        console.log(`✅ Created task file: ${taskPath}`);
        console.log(`📋 Task ID: ${taskId}`);
    }

    // Persist Task ID for UI access
    try {
        const publicDir = join(process.cwd(), 'public');
        if (!existsSync(publicDir)) {
            // Silently skip if no public dir is present (though unusual for Next.js)
        } else {
            const metadataPath = join(publicDir, 'metadata.json');
            const metadata = { taskId, projectVersion, timestamp };
            writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
            console.log(`📡 Task ID persisted to public/metadata.json for UI integration.`);
        }
    } catch (e) {
        console.warn(`⚠️  Failed to persist metadata: ${e.message}`);
    }

    console.log(`📦 Project Version: ${projectVersion}`);
    return taskId;
}

createTaskFile();
