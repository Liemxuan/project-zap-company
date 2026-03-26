/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname, '../src');

// Read argument (either --audit or --fix)
const mode = process.argv[2] || '--audit';

const counts = {
    primary: { font: 'font-display', total: 0, linked: 0, hardcoded: 0, none: 0 },
    secondary: { font: 'font-body', total: 0, linked: 0, hardcoded: 0, none: 0 },
    tertiary: { font: 'font-dev / font-mono', total: 0, linked: 0, hardcoded: 0, none: 0 },
};

function walkAndProcess(dir, mode, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            let fullPath = path.resolve(dir, file);
            fs.stat(fullPath, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walkAndProcess(fullPath, mode, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                        if (mode === '--audit') {
                            analyzeFile(fullPath);
                        } else if (mode === '--fix') {
                            if (!file.includes('layout.tsx') && !file.includes('ThemeContext.tsx') && !file.includes('globals.css')) {
                                fixFile(fullPath);
                            }
                        }
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let line of lines) {
        let hasPrimary = line.includes('font-display');
        let hasSecondary = line.includes('font-body');
        let hasTertiary = line.includes('font-dev') || line.includes('font-mono');

        let hasPrimaryLinked = line.includes('text-transform-primary');
        let hasSecondaryLinked = line.includes('text-transform-secondary');
        let hasTertiaryLinked = line.includes('text-transform-tertiary');

        let hasHardcoded = /\b(?:uppercase|lowercase|capitalize)\b/.test(line);

        if (hasPrimary) {
            counts.primary.total++;
            if (hasPrimaryLinked) counts.primary.linked++;
            else if (hasHardcoded) counts.primary.hardcoded++;
            else counts.primary.none++;
        }

        if (hasSecondary) {
            counts.secondary.total++;
            if (hasSecondaryLinked) counts.secondary.linked++;
            else if (hasHardcoded) counts.secondary.hardcoded++;
            else counts.secondary.none++;
        }

        if (hasTertiary) {
            counts.tertiary.total++;
            if (hasTertiaryLinked) counts.tertiary.linked++;
            else if (hasHardcoded) counts.tertiary.hardcoded++;
            else counts.tertiary.none++;
        }
    }
}

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // 1. PRIMARY TIER
        if (line.includes('font-display') && !line.includes('text-transform-primary') && !line.includes('--font-display')) {
            line = line.replace(/font-display/g, 'font-display text-transform-primary');
            changed = true;
        }

        if (line.includes('font-display') && /\b(?:uppercase|lowercase|capitalize)\b/.test(line)) {
            line = line.replace(/\b(?:uppercase|lowercase|capitalize)\b/g, '');
            line = line.replace(/\s{2,}/g, ' ');
            changed = true;
        }

        // 2. SECONDARY TIER
        if (line.includes('font-body') && !line.includes('text-transform-secondary') && !line.includes('--font-body')) {
            line = line.replace(/font-body/g, 'font-body text-transform-secondary');
            changed = true;
        }

        if (line.includes('font-body') && /\b(?:uppercase|lowercase|capitalize)\b/.test(line)) {
            line = line.replace(/\b(?:uppercase|lowercase|capitalize)\b/g, '');
            line = line.replace(/\s{2,}/g, ' ');
            changed = true;
        }

        // 3. TERTIARY TIER
        if ((line.includes('font-mono') || line.includes('font-dev')) && !line.includes('text-transform-tertiary') && !line.includes('--font-mono') && !line.includes('--font-dev')) {
            line = line.replace(/font-mono/g, 'font-mono text-transform-tertiary').replace(/font-dev/g, 'font-dev text-transform-tertiary');
            changed = true;
        }

        if ((line.includes('font-mono') || line.includes('font-dev') || line.includes('text-transform-tertiary')) && /\b(?:uppercase|lowercase|capitalize)\b/.test(line)) {
            line = line.replace(/\b(?:uppercase|lowercase|capitalize)\b/g, '');
            line = line.replace(/\s{2,}/g, ' ');
            changed = true;
        }

        // Clean trailing spaces
        line = line.replace(/ "\}/g, '"}').replace(/ '\}/g, "'}").replace(/ `\}/g, '`}');

        if (lines[i] !== line) {
            lines[i] = line;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`\x1b[32mFixed\x1b[0m ${filePath}`);
    }
}

console.log(`\x1b[36mRunning Typography Casing Enforcer (${mode === '--fix' ? 'FIX MODE' : 'AUDIT MODE'})\x1b[0m`);

walkAndProcess(directoryPath, mode, function(err) {
    if (err) throw err;
    
    if (mode === '--audit') {
        console.log('\n| Role | Font Class | Total Instances | Linked Casing Token | Hardcoded (uppercase/etc) | No Casing Class |');
        console.log('|---|---|---|---|---|---|');
        console.log(`| Primary | ${counts.primary.font} | ${counts.primary.total} | ${counts.primary.linked} | ${counts.primary.hardcoded} | ${counts.primary.none} |`);
        console.log(`| Secondary | ${counts.secondary.font} | ${counts.secondary.total} | ${counts.secondary.linked} | ${counts.secondary.hardcoded} | ${counts.secondary.none} |`);
        console.log(`| Tertiary | ${counts.tertiary.font} | ${counts.tertiary.total} | ${counts.tertiary.linked} | ${counts.tertiary.hardcoded} | ${counts.tertiary.none} |`);
        console.log('\n\x1b[33mTo fix these issues, run: node scripts/typography-casing-enforcer.js --fix\x1b[0m');
    } else {
        console.log('\n\x1b[32mRemediation complete. Run without --fix to view new audit snapshot.\x1b[0m');
    }
});
