const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getRelativePath(fromDir, toFile) {
    let rel = path.relative(fromDir, toFile);
    if (!rel.startsWith('.')) rel = './' + rel;
    if (rel.endsWith('.ts')) rel = rel.slice(0, -3); // remove .ts
    return rel; // e.g. ../../lib/mongo
}

function processFile(filePath, isClaw) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('new MongoClient(')) return;
    console.log(`Processing: ${filePath}`);

    // Determine target import path
    const fileDir = path.dirname(filePath);
    let importStatement = '';
    let replaceText = '';
    
    if (isClaw) {
        // zap-claw uses the db/mongo_client.js and takes URI argument
        const targetPathFull = path.join(__dirname, 'packages/zap-claw/src/db/mongo_client');
        let relPath = getRelativePath(fileDir, targetPathFull);
        importStatement = `import { getGlobalMongoClient } from "${relPath}.js";\n`; // using ES/TS node modules extension (.js for zap-claw)
        
        // Match things like `new MongoClient(process.env.MONGODB_URI...)` or `new MongoClient(MONGO_URI...)`
        // We will capture the first argument
        content = content.replace(/new MongoClient\(([^,)]+)(?:,[^)]+)?\)/g, "await getGlobalMongoClient($1)");
    } else {
        // zap-swarm uses lib/mongo
        const targetPathFull = path.join(__dirname, 'apps/zap-swarm/src/lib/mongo');
        const relPath = getRelativePath(fileDir, targetPathFull);
        importStatement = `import { getGlobalMongoClient } from "${relPath}";\n`;
        
        content = content.replace(/new MongoClient\([^)]*\)/g, "await getGlobalMongoClient()");
    }

    // Add import statement at the top if not present
    if (!content.includes('getGlobalMongoClient')) {
        // Fallback in case regex failed to replace or didn't add it
    } else {
        if (!content.includes('import { getGlobalMongoClient }')) {
            // Find after last import
            const lines = content.split('\n');
            let insertIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) insertIndex = i + 1;
            }
            lines.splice(insertIndex, 0, importStatement.trim());
            content = lines.join('\n');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir, isClaw) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath, isClaw);
        } else if (file.endsWith('.ts')) {
            processFile(fullPath, isClaw);
        }
    }
}

console.log("Starting DB Hardening Codemod...");
walk(path.join(__dirname, 'apps/zap-swarm/src/app/api'), false);
walk(path.join(__dirname, 'packages/zap-claw/src/runtime'), true);
console.log("Codemod completed.");
