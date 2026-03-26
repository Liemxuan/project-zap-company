/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const designPath = path.join(__dirname, 'src', 'app', 'design');
const foundationsPath = path.join(__dirname, 'src', 'zap', 'foundations');

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

const allFiles = [...walkDir(designPath), ...walkDir(foundationsPath)];

let modifiedCount = 0;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We want to target the span inside the button that contains "Publish to ... Theme"
    // and replace its ENTIRE className string to be perfectly uniform.
    
    // Regex matches: `<span` followed by ANY `className="..."` followed by `>` followed by `Publish to`
    const spanRegex = /<span\s+className="([^"]*)"\s*>(\s*Publish to.*?)<\/span>/g;
    
    content = content.replace(spanRegex, (match, classStr, innerHTML) => {
        // Keep tracking-widest and text-[11px] (or whatever), but nuke specific offenders
        // We will just construct the perfect class array for this specific button context.
        // It's a dark button (bg-primary), so text needs to be text-on-primary
        
        let newClasses = "relative z-10 text-on-primary font-secondary text-transform-secondary tracking-widest text-[11px]";
        
        return `<span className="${newClasses}">${innerHTML}</span>`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Fixed formatting in: ${file}`);
    }
});

console.log(`\nGlobal Audit Complete: ${modifiedCount} files standardized.`);
