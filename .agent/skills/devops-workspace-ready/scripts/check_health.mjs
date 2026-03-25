#!/usr/bin/env node

/**
 * Comprehensive Workspace Health Check
 * Checks git status, dependencies, and build health
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

/**
 * Check Git status
 */
async function checkGitStatus() {
    try {
        const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
        const { stdout: status } = await execAsync('git status --porcelain');

        const uncommitted = status.trim().split('\n').filter(line => line.trim()).length;

        console.log(`\n📂 Git Status:`);
        console.log(`   Branch: ${branch.trim()}`);
        console.log(`   Uncommitted changes: ${uncommitted > 0 ? uncommitted : 'None'}`);

        return { branch: branch.trim(), uncommitted };
    } catch (error) {
        console.log('⚠️  Not a git repository or git not available');
        return null;
    }
}

/**
 * Check if dependencies are installed
 */
async function checkDependencies() {
    const nodeModulesExists = existsSync(join(process.cwd(), 'node_modules'));

    console.log(`\n📦 Dependencies:`);

    if (!nodeModulesExists) {
        console.log('   ❌ node_modules not found - running npm install...');
        try {
            await execAsync('npm install', { cwd: process.cwd() });
            console.log('   ✅ Dependencies installed successfully');
            return true;
        } catch (error) {
            console.log('   ❌ Failed to install dependencies');
            return false;
        }
    }

    console.log('   ✅ Dependencies installed');

    // Check for outdated packages (non-blocking)
    try {
        const { stdout } = await execAsync('npm outdated --json', { cwd: process.cwd() });
        const outdated = JSON.parse(stdout || '{}');
        const count = Object.keys(outdated).length;

        if (count > 0) {
            console.log(`   ℹ️  ${count} package(s) have updates available`);
        }
    } catch (error) {
        // npm outdated returns exit code 1 when packages are outdated
        // This is expected behavior, so we don't treat it as an error
    }

    return true;
}

/**
 * Check TypeScript compilation
 */
async function checkTypeScript() {
    console.log(`\n🔷 TypeScript:`);

    try {
        await execAsync('npx tsc --noEmit', { cwd: process.cwd() });
        console.log('   ✅ No type errors');
        return true;
    } catch (error) {
        console.log('   ⚠️  Type errors detected (non-blocking)');
        return true; // Non-blocking
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🔍 Running workspace health check...\n');

    const results = {
        git: await checkGitStatus(),
        dependencies: await checkDependencies(),
        typescript: await checkTypeScript()
    };

    console.log('\n' + '='.repeat(50));

    if (results.dependencies) {
        console.log('✅ Workspace is ready!');
        console.log('🚀 You can start coding now.');
    } else {
        console.log('⚠️  Some issues detected, but workspace is functional.');
    }

    console.log('='.repeat(50) + '\n');

    process.exit(0);
}

main();
