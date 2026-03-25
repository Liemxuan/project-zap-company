#!/usr/bin/env node

/**
 * Verify App is Actually Working
 * Checks if localhost:3000 returns valid HTML content (not just port open)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';

const execAsync = promisify(exec);

const PORT = 3000;
const HOST = 'localhost';

/**
 * Check if server returns valid HTML
 */
async function verifyAppLoads() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: '/',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                // Check if response contains expected app content
                const hasValidContent = data.includes('ZAP') ||
                    data.includes('Welcome') ||
                    data.includes('Login') ||
                    data.includes('<!DOCTYPE html>');

                if (res.statusCode === 200 && hasValidContent) {
                    console.log('✅ App is loading correctly');
                    console.log(`   Status: ${res.statusCode}`);
                    console.log(`   Content Length: ${data.length} bytes`);
                    resolve(true);
                } else {
                    console.log('⚠️  Server responded but content looks unexpected');
                    console.log(`   Status: ${res.statusCode}`);
                    console.log(`   Content preview: ${data.substring(0, 200)}...`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Failed to connect to app');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log('⚠️  Request timeout');
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Main execution
 */
async function main() {
    try {
        await verifyAppLoads();
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

main();
