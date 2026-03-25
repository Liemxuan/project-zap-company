#!/usr/bin/env node

/**
 * Test Localhost Corruption Fixes
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testLocalhostFix() {
    console.log('🔧 Testing localhost corruption fixes...\n');

    const actions = [];

    try {
        console.log('1. Killing all Node processes...');
        await execAsync('Stop-Process -Name node -Force -ErrorAction SilentlyContinue', {
            cwd: process.cwd(),
            shell: 'powershell.exe'
        });
        console.log('   ✅ Node processes killed');
        actions.push('Killed Node processes');
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.log('   ℹ️  No Node processes running');
    }

    try {
        console.log('2. Clearing .next cache...');
        await execAsync('Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue', {
            cwd: process.cwd(),
            shell: 'powershell.exe'
        });
        console.log('   ✅ .next cache cleared');
        actions.push('Cleared .next cache');
    } catch (error) {
        console.log('   ℹ️  .next already clean');
    }

    try {
        console.log('3. Clearing node_modules cache...');
        await execAsync('Remove-Item -Path node_modules\\.cache -Recurse -Force -ErrorAction SilentlyContinue', {
            cwd: process.cwd(),
            shell: 'powershell.exe'
        });
        console.log('   ✅ node_modules cache cleared');
        actions.push('Cleared node_modules cache');
    } catch (error) {
        console.log('   ℹ️  node_modules cache clean');
    }

    try {
        console.log('4. Flushing DNS cache...');
        await execAsync('ipconfig /flushdns', {
            cwd: process.cwd(),
            shell: 'cmd.exe'
        });
        console.log('   ✅ DNS cache flushed');
        actions.push('Flushed DNS cache');
    } catch (error) {
        console.log('   ⚠️  Could not flush DNS');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Localhost corruption fixes applied:');
    actions.forEach(action => console.log(`   ✓ ${action}`));
    console.log('='.repeat(50) + '\n');

    process.exit(0);
}

testLocalhostFix();
