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

    // 1. Strip ALL <Wrapper ...> and </Wrapper>
    // Note: This relies on Wrapper identity={...} props not containing `>` characters.
    let original = content;
    
    // Non-greedy match for <Wrapper ...> or <Wrapper>
    content = content.replace(/<Wrapper[^>]*>/g, '');
    content = content.replace(/<\/Wrapper>/g, '');
    
    // Remove the import as well
    content = content.replace(/import \{ Wrapper \} from '[^']+';\n/g, '');
    content = content.replace(/import Wrapper from '[^']+';\n/g, '');
    
    // 2. We need to handle MasterVerticalShell and WrapperLayout
    // If we just remove them, the children are fine.
    content = content.replace(/<MasterVerticalShell[^>]*>/g, '');
    content = content.replace(/<\/MasterVerticalShell>/g, '');
    content = content.replace(/import \{ MasterVerticalShell \} from '[^']+';\n/g, '');
    
    content = content.replace(/<WrapperLayout[^>]*>/g, '');
    content = content.replace(/<\/WrapperLayout>/g, '');
    content = content.replace(/import \{ WrapperLayout \} from '[^']+';\n/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedFiles++;
        console.log(`Stripped legacy wrappers from: ${path.basename(path.dirname(file))}`);
    }
}

console.log(`Successfully stripped legacy from ${updatedFiles} sandboxes.`);
