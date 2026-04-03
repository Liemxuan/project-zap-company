const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/app/design/zap/{atoms,molecules}/*/page.tsx');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Naively match <SectionHeader ... title="X" ... />
    // It could span multiple lines.
    content = content.replace(/<SectionHeader([\s\S]*?)>/g, (match, inner) => {
        if (inner.includes('id=')) return match;
        
        let titleMatch = inner.match(/title=(['"])(.*?)\1/) || inner.match(/title=\{['"](.*?)['"]\}/);
        let idVal = "section";
        if (titleMatch) {
            idVal = titleMatch[2] || titleMatch[1]; // depending on which group matched
            idVal = idVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        } else {
             // maybe title is a variable
             idVal = "section-header-" + Math.floor(Math.random() * 1000);
        }
        
        hasChanges = true;
        return `<SectionHeader id="${idVal}"${inner}>`;
    });

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
});

console.log('Modified', modifiedCount, 'files');
