/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const crypto = require('crypto');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir('./src/zap/foundations', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove .toUpperCase() from theme name overrides
    content = content.replace(/\{themeId\.toUpperCase\(\)\}/g, '{themeId}');
    content = content.replace(/\{theme(?:Config\?\.name)?(?: \|\| themeId)?\.toUpperCase\(\)\}/g, '{theme}');

    // Fix uppercase tracking-widest
    content = content.replace(/font-black text-on-primary uppercase tracking-widest text-\[11px\]/g, 'font-secondary text-on-primary text-transform-secondary tracking-widest text-[11px]');
    
    // Fix font-display text-transform-primary 
    content = content.replace(/font-black text-on-primary tracking-widest text-\[11px\] font-display text-transform-primary/g, 'font-secondary text-on-primary tracking-widest text-[11px] text-transform-secondary');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        modifiedCount++;
    }
});

console.log(`Fixed ${modifiedCount} files in src/zap/foundations.`);
