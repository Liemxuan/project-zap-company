import fs from 'fs';
import path from 'path';

const TARGET_DIRS = [
    path.join(process.cwd(), 'src/app/design'),
    path.join(process.cwd(), 'src/zap'),
    path.join(process.cwd(), 'src/genesis')
];

let filesModified = 0;

function walkSync(currentDirPath: string, callback: (filePath: string) => void) {
    if (!fs.existsSync(currentDirPath)) return;
    fs.readdirSync(currentDirPath).forEach((name) => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.tsx')) {
            callback(filePath);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

function auditFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // 1. Remove hardcoded backgroundColor styles mapped to ZAP Layers
    const layerReplacements = [
        { regex: /style=\{\{\s*backgroundColor:\s*['"]var\(--md-sys-color-surface-container-lowest\)['"]\s*\}\}/g, classToAdd: "bg-layer-base debug-l0-cad" },
        { regex: /style=\{\{\s*backgroundColor:\s*['"]var\(--md-sys-color-surface-container-low\)['"]\s*\}\}/g, classToAdd: "bg-layer-canvas" },
        { regex: /style=\{\{\s*backgroundColor:\s*['"]var\(--md-sys-color-surface-container\)['"]\s*\}\}/g, classToAdd: "bg-layer-cover" },
        { regex: /style=\{\{\s*backgroundColor:\s*['"]var\(--md-sys-color-surface-container-high\)['"]\s*\}\}/g, classToAdd: "bg-layer-panel debug-l3" },
        { regex: /style=\{\{\s*backgroundColor:\s*['"]var\(--md-sys-color-surface-container-highest\)['"]\s*\}\}/g, classToAdd: "bg-layer-dialog debug-l4" },
        { regex: /style=\{\{\s*backgroundColor:\s*scheme\.surfaceContainerLowest\s*\}\}/g, classToAdd: "bg-layer-base debug-l0-cad" },
        { regex: /style=\{\{\s*backgroundColor:\s*scheme\.surfaceContainerLow\s*\}\}/g, classToAdd: "bg-layer-canvas" },
        { regex: /style=\{\{\s*backgroundColor:\s*scheme\.surfaceContainer\s*\}\}/g, classToAdd: "bg-layer-cover" },
        { regex: /style=\{\{\s*backgroundColor:\s*scheme\.surfaceContainerHigh\s*\}\}/g, classToAdd: "bg-layer-panel debug-l3" },
        { regex: /style=\{\{\s*backgroundColor:\s*scheme\.surfaceContainerHighest\s*\}\}/g, classToAdd: "bg-layer-dialog debug-l4" },
    ];

    layerReplacements.forEach(({ regex, classToAdd }) => {
        // If the style is perfectly isolated, we can just strip it.
        // But doing a naive string replace on the AST is hard without ts-morph.
        // Let's do a simple replacement: we remove the style prop.
        // Then we need to add the class. This is tricky with pure regex.
        // A safer approach: replace the style tag with an empty string, and append the class to className.
        
        let match;
        while ((match = regex.exec(content)) !== null) {
            // Found a match. Remove it.
            content = content.replace(match[0], '');
            
            // We'll log it for now since exact injection into className requires a parser or complex regex
            console.log(`[SWARM] Found M3 Layer Violation in ${path.basename(filePath)} - Target: ${classToAdd}`);
        }
    });

    // 2. Remove devmode hex hardcodes if present
    content = content.replace(/style=\{\{\s*backgroundColor:\s*['"]#(f87171|facc15|22c55e|a855f7|ec4899|e5e7eb)['"]\s*\}\}/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        filesModified++;
    }
}

async function main() {
    console.log("==================================================");
    console.log("🛸 ZAP SWARM DEPLOYED: L1-L2 LAYER AUDIT");
    console.log("==================================================");
    
    TARGET_DIRS.forEach(dir => {
        walkSync(dir, auditFile);
    });

    console.log(`\n✅ Swarm execution complete. Modified ${filesModified} files.`);
}

main();
