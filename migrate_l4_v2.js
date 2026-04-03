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

    // Skip canvas-body or already migrated ones
    if (file.includes('canvas-body') || content.includes('<CanvasBody')) continue;

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

    // Match until the first '>' that closes ComponentSandboxTemplate
    // and captures the very next opening tag
    const match = content.match(/<ComponentSandboxTemplate([^>]+)>\s*<([a-zA-Z]+)([^>]*)>/);

    if (match) {
        let propsContent = match[1];
        let tagName = match[2];
        let tagAttrs = match[3];
        let classNameMatch = tagAttrs.match(/className="([^"]+)"/);
        let tagClasses = classNameMatch ? classNameMatch[1] : '';

        let targetStr = `<ComponentSandboxTemplate${propsContent}>\n            <${tagName}${tagAttrs}>`;
        let targetIdx = content.indexOf(`<ComponentSandboxTemplate${propsContent}>`);
        let openNextIdx = content.indexOf(`<${tagName}${tagAttrs}>`, targetIdx);

        if (targetIdx !== -1 && openNextIdx !== -1) {
            let replaceStr = `<ComponentSandboxTemplate${propsContent}>\n            <CanvasBody flush={false}>\n                <CanvasBody.Section>\n                    <SectionHeader number="1" id="${folderName}" title="${title} Sandbox" description="Interactive components for ${title}" icon="widgets" />\n                    <CanvasBody.Demo className="${tagClasses}">`;
            
            let cstEndIdx = content.lastIndexOf('</ComponentSandboxTemplate>');
            let endTagToReplace = `</${tagName}>`;
            
            if (cstEndIdx !== -1) {
                let textBeforeCSTEnd = content.substring(0, cstEndIdx);
                let lastEndTagIdx = textBeforeCSTEnd.lastIndexOf(endTagToReplace);

                if (lastEndTagIdx !== -1) {
                    content = content.substring(0, lastEndTagIdx) + 
                              `    </CanvasBody.Demo>\n                </CanvasBody.Section>\n            </CanvasBody>\n        ` + 
                              content.substring(lastEndTagIdx + endTagToReplace.length);
                              
                    // Replace start
                    let oldStartStr = content.substring(targetIdx, openNextIdx + `<${tagName}${tagAttrs}>`.length);
                    content = content.split(oldStartStr).join(replaceStr);

                    fs.writeFileSync(file, content, 'utf8');
                    updatedFiles++;
                    console.log(`Migrated: ${folderName}`);
                }
            }
        }
    }
}

console.log(`V2 Successfully migrated ${updatedFiles} sandboxes.`);
