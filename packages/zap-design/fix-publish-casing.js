/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src/app/design');
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('Publish to')) {
        // 1. Replace the CSS class 'uppercase' with M3 tokens
        if (content.includes('uppercase tracking-widest text-[11px]')) {
            content = content.replace(/uppercase tracking-widest text-\[11px\]/g, 'font-secondary text-transform-secondary tracking-widest text-[11px]');
            changed = true;
        }

        // 2. Replace .toUpperCase() string manipulation
        if (content.includes('{theme.toUpperCase()}')) {
            content = content.replace(/\{theme\.toUpperCase\(\)\}/g, '{theme}');
            changed = true;
        }
        
        if (content.includes('{activeTheme.toUpperCase()}')) {
            content = content.replace(/\{activeTheme\.toUpperCase\(\)\}/g, '{activeTheme}');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
    }
});

console.log(`Fixed text casing and JS string manipulation across ${replacedCount} component pages.`);
