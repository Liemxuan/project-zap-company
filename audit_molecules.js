const fs = require('fs');
const path = require('path');

const moleculesDir = path.join(__dirname, 'packages/zap-design/src/app/design/zap/molecules');
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

findPageFiles(moleculesDir);

let table = "| Molecule | `CanvasBody` | `flush={false}` | `SectionHeader` | Legacy Shells | Status |\n";
table += "| :--- | :---: | :---: | :---: | :---: | :--- |\n";

let passedCount = 0;

for (const file of results.sort()) {
    const content = fs.readFileSync(file, 'utf-8');
    const folderName = path.basename(path.dirname(file));
    
    const hasCanvasBody = content.includes('CanvasBody');
    const hasFlushFalse = content.includes('flush={false}');
    const hasSectionHeader = content.includes('SectionHeader');
    const hasLegacy = content.includes('MasterVerticalShell') || content.includes('<Wrapper') || content.includes('WrapperLayout');
    
    let isDone = hasCanvasBody && hasFlushFalse && hasSectionHeader && !hasLegacy;
    
    if (isDone) passedCount++;
    
    const fmt = (bool) => bool ? '✅' : '❌';
    
    table += `| \`${folderName}\` | ${fmt(hasCanvasBody)} | ${fmt(hasFlushFalse)} | ${fmt(hasSectionHeader)} | ${fmt(!hasLegacy)} | ${isDone ? '✨ Completed' : '⚠️ Pending'} |\n`;
}

table += `\n\n**Total:** ${passedCount} completed, ${results.length - passedCount} pending.`;

fs.writeFileSync('/tmp/molecule-audit.md', table, 'utf-8');
console.log(table);
