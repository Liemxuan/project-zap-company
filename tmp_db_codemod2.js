const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // We only want to process files that have `client.close()` or `mclient.close()`
    // Just to be safe, any line ending with `client.close();` inside API roots and runtime.
    const lines = content.split('\n');
    let newLines = [];

    for (const line of lines) {
        if (line.match(/.*?client\.close\(\).*/i)) {
            // Drop line
            modified = true;
            console.log(`Removed close in: ${filePath}`);
            continue;
        }
        if (line.match(/.*?mclient\.close\(\).*/i)) {
            // Drop line
            modified = true;
            console.log(`Removed close in: ${filePath}`);
            continue;
        }
        if (line.match(/.*?client\.connect\(\).*/i)) {
            // Drop line since getGlobalMongoClient inherently connects and caches the promise
            modified = true;
            console.log(`Removed connect in: ${filePath}`);
            continue;
        }
        if (line.match(/.*?mclient\.connect\(\).*/i)) {
            // Drop line
            modified = true;
            console.log(`Removed connect in: ${filePath}`);
            continue;
        }
        newLines.push(line);
    }

    if (modified) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

console.log("Starting Close/Connect removal codemod...");
walk(path.join(__dirname, 'apps/zap-swarm/src/app/api'));
walk(path.join(__dirname, 'packages/zap-claw/src/runtime'));
console.log("Close/Connect Codemod completed.");
