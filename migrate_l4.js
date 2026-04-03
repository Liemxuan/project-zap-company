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

let updatedFiles = 0;

for (const file of results) {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already migrated
    if (content.includes('<CanvasBody')) continue;

    const folderName = path.basename(path.dirname(file));
    let titleMatch = content.match(/componentName="([^"]+)"/);
    let title = titleMatch ? titleMatch[1] : folderName;

    // 1. Inject CanvasBody and SectionHeader imports
    if (!content.includes("import { CanvasBody")) {
        let newImports = "import { CanvasBody } from '../../../../../zap/layout/CanvasBody';\nimport { SectionHeader } from '../../../../../zap/sections/SectionHeader';\n";
        let importMatches = [...content.matchAll(/^import .*$/gm)];
        if (importMatches.length > 0) {
            let lastImport = importMatches[importMatches.length - 1];
            let insertPos = lastImport.index + lastImport[0].length + 1;
            content = content.slice(0, insertPos) + newImports + content.slice(insertPos);
        }
    }

    // Replace <div className="something"> -> CanvasBody etc.
    const startIdx = content.indexOf('<ComponentSandboxTemplate');
    if (startIdx === -1) continue;

    let propsEndPos = -1;
    let stack = 0;
    let inQuotes = false;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '"' && content[i-1] !== '\\') inQuotes = !inQuotes;
        if (!inQuotes) {
            if (content[i] === '{') stack++;
            if (content[i] === '}') stack--;
            // Find exactly the `>` that closes ComponentSandboxTemplate
            // We'll use a hack - match the first `)\n        >\n` or similar from the end regex 
        }
    }

    // Actually, Regex on the ComponentSandboxTemplate close bracket is easier:
    const closeBracketMatch = content.match(/>(\s*)<([a-zA-Z]+)([^>]*)>/g);
    // This is too generic.
    // Let's rely on finding `>\n            <Wrapper` or `>\n            <div`
    const regexMatch = content.match(/foundationRules=\{[^}]*\}\s*>\s*<([a-zA-Z]+)([^>]*)>/);
    const regexMatchAlt = content.match(/platformConstraints=\{[^}]*\}\s*>\s*<([a-zA-Z]+)([^>]*)>/);
    const match = regexMatch || regexMatchAlt;

    if (match) {
        let tagName = match[1];
        let tagAttrs = match[2];
        let classNameMatch = tagAttrs.match(/className="([^"]+)"/);
        let tagClasses = classNameMatch ? classNameMatch[1] : '';

        // Determine props end index based on index of `<tagName`
        let targetStr = `<${tagName}${tagAttrs}>`;
        let targetIdx = content.indexOf(targetStr, startIdx);

        if (targetIdx !== -1) {
            let replaceStr = `\n            <CanvasBody flush={false}>\n                <CanvasBody.Section>\n                    <SectionHeader number="1" id="${folderName}" title="${title} Sandbox" description="Interactive components for ${title}" icon="widgets" />\n                    <CanvasBody.Demo className="${tagClasses}">`;
            
            let openTagLength = targetStr.length;

            let cstEndIdx = content.lastIndexOf('</ComponentSandboxTemplate>');
            let endTagToReplace = `</${tagName}>`;
            
            if (cstEndIdx !== -1) {
                let textBeforeCSTEnd = content.substring(0, cstEndIdx);
                let lastEndTagIdx = textBeforeCSTEnd.lastIndexOf(endTagToReplace);

                if (lastEndTagIdx !== -1) {
                    content = content.substring(0, lastEndTagIdx) + 
                              `    </CanvasBody.Demo>\n                </CanvasBody.Section>\n            </CanvasBody>\n        ` + 
                              content.substring(lastEndTagIdx + endTagToReplace.length);
                              
                    content = content.substring(0, targetIdx) + 
                              replaceStr + 
                              content.substring(targetIdx + openTagLength);

                    // Clean up Wrapper imports
                    content = content.replace(/import \{ Wrapper \} from '[^']+';\n/g, '');
                    content = content.replace(/import \{ MasterVerticalShell \} from '[^']+';\n/g, '');

                    fs.writeFileSync(file, content, 'utf8');
                    updatedFiles++;
                    console.log(`Migrated: ${folderName}`);
                }
            }
        }
    }
}

console.log(`Successfully migrated ${updatedFiles} sandboxes.`);
