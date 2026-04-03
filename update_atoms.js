const fs = require('fs');
const path = require('path');

const atomsDir = path.join(__dirname, 'packages/zap-design/src/app/design/zap/atoms');
const results = [];

function findPageFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findPageFiles(fullPath);
        } else if (entry.name === 'page.tsx') {
            results.push(fullPath);
        }
    }
}

findPageFiles(atomsDir);

for (const file of results) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Fix the mapping issue for key and label
    const keyMatch = /key=\{t\.id\}/g;
    if (keyMatch.test(content)) {
        content = content.replace(keyMatch, 'key={t.name}');
        changed = true;
    }

    const labelMatch = />\{t\.label\}</g;
    if (labelMatch.test(content)) {
        content = content.replace(labelMatch, '>{t.name}<');
        changed = true;
    }

    // Fix the array index out of bounds for BORDER_RADIUS_TOKENS
    if (content.includes('BORDER_RADIUS_TOKENS[10]')) {
        content = content.replace(/BORDER_RADIUS_TOKENS\[10\]/g, 'BORDER_RADIUS_TOKENS[8]');
        changed = true;
    }
    
    if (content.includes('BORDER_RADIUS_TOKENS[9]')) {
        content = content.replace(/BORDER_RADIUS_TOKENS\[9\]/g, 'BORDER_RADIUS_TOKENS[8]');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}
