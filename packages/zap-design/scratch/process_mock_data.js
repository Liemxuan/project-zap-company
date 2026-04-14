const fs = require('fs');
const path = require('path');

const mockDataPath = 'g:\\zap-builder-v4\\packages\\zap-design\\src\\hooks\\mock-data.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

function generateAcronym(name) {
    if (!name) return '??';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else if (name.length >= 2) {
        return name.substring(0, 2).toUpperCase();
    } else {
        return (name + name).toUpperCase();
    }
}

// Regex to find arrays
const arrayRegex = /export const (MOCK_\w+): \w+\[\] = \[([\s\S]*?)\];/g;

content = content.replace(arrayRegex, (match, arrayName, arrayContent) => {
    // Process objects within array content
    // This is simple parsing, assuming objects are delimited by { ... }
    const objectRegex = /\{([\s\S]*?)\}/g;
    
    const newArrayContent = arrayContent.replace(objectRegex, (objMatch, objBody) => {
        if (objBody.includes('acronymn:')) return objMatch; // Skip if already has it

        // Extract name or tier
        let nameMatch = objBody.match(/name:\s*["'`](.*?)["'`],/);
        if (!nameMatch) {
            nameMatch = objBody.match(/tier:\s*["'`](.*?)["'`],/);
        }

        if (nameMatch) {
            const name = nameMatch[1];
            const acronym = generateAcronym(name);
            // Insert after name or tier
            return objMatch.replace(nameMatch[0], `${nameMatch[0]} acronymn: "${acronym}",`);
        }
        return objMatch;
    });

    return `export const ${arrayName}: ${arrayName === 'MOCK_UNITS' ? 'Unit' : (arrayName === 'MOCK_MODIFIER_GROUPS' ? 'ModifierGroup' : arrayName.replace('MOCK_', '').replace(/S$/, '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''))}[] = [${newArrayContent}];`;
});

// Fix any potential issues with types in the exported string
// Actually my type generation in the replace was a bit hacky, let's just replace the content and keep the original signature

content = fs.readFileSync(mockDataPath, 'utf8');
content = content.replace(/\{([\s\S]*?)\}/g, (objMatch, objBody) => {
    if (objBody.includes('acronymn:')) return objMatch;
    
    let nameMatch = objBody.match(/(name|tier):\s*["'`](.*?)["'`],/);
    if (nameMatch) {
        const name = nameMatch[2];
        const acronym = generateAcronym(name);
        return objMatch.replace(nameMatch[0], `${nameMatch[0]} acronymn: "${acronym}",`);
    }
    return objMatch;
});

fs.writeFileSync(mockDataPath, content);
console.log('Processed mock-data.ts');
