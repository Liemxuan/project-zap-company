/**
 * Open Browser to Dynamic Port
 * Reads .server-port and opens the correct localhost URL
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

function getUrl() {
    const portFile = join(process.cwd(), '.server-port');
    let port = 3000;

    if (existsSync(portFile)) {
        try {
            port = parseInt(readFileSync(portFile, 'utf-8').trim(), 10);
        } catch (e) {
            console.error('⚠️ Could not read .server-port, defaulting to 3000');
        }
    } else {
        console.log('ℹ️ .server-port not found, defaulting to 3000');
    }

    return `http://localhost:${port}`;
}

function openBrowser() {
    const url = getUrl();
    console.log(`🌐 Opening browser to ${url}...`);

    let command;
    switch (process.platform) {
        case 'darwin':
            command = `open "${url}"`;
            break;
        case 'win32':
            command = `start "${url}"`;
            break;
        default:
            command = `xdg-open "${url}"`;
            break;
    }

    exec(command, (error) => {
        if (error) {
            console.error(`❌ Failed to open browser: ${error.message}`);
        } else {
            console.log('✅ Browser opened');
        }
    });
}

openBrowser();
