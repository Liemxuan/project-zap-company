import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THEMES_DIR = path.resolve(__dirname, '../../src/themes');
const TARGET_THEMES = ['CORE', 'METRO', 'NEO', 'WIX'];

// Utility: camelCase to kebab-case
function camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Utility: Parse CSS value string into strict typed Dart equivalents
function parseDartValue(value) {
    let cleanVal = value.replace(/!important/g, '').trim();
    
    // Check if it's a pixel value like "12px" -> convert to double 12.0
    if (cleanVal.endsWith('px')) {
        const numVal = parseFloat(cleanVal.replace('px', ''));
        if (!isNaN(numVal)) {
            return { type: 'double', val: Number.isInteger(numVal) ? `${numVal}.0` : `${numVal}` };
        }
    }
    
    // Check if it's a pure number string like "400" or "0.5"
    if (/^\d+(\.\d+)?$/.test(cleanVal)) {
        const numVal = parseFloat(cleanVal);
        return { type: 'double', val: Number.isInteger(numVal) ? `${numVal}.0` : `${numVal}` };
    }
    
    // Fallback to strict String type for colors (e.g., "#FFF"), complex values ("12px 24px"), etc.
    return { type: 'String', val: `"${cleanVal}"` };
}

async function compileTheme(themeName) {
    const themeDir = path.join(THEMES_DIR, themeName);
    const jsonPath = path.join(themeDir, 'theme.json');
    const cssPath = path.join(themeDir, 'theme.css');
    const dartDir = path.join(themeDir, 'dart');
    const dartPath = path.join(dartDir, 'theme.dart');

    if (!fs.existsSync(jsonPath)) {
        console.warn(`[${themeName}] ⚠️  Missing theme.json`);
        return;
    }

    const themeJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const metrics = themeJson.metrics || {};
    
    if (Object.keys(metrics).length === 0) {
        console.log(`[${themeName}] ℹ️  No metrics found in theme.json`);
        return;
    }

    console.log(`\n[${themeName}] Compiling from JSON...`);

    // 1. Generate Web CSS
    let cssLines = [];
    cssLines.push(`/* AUTO-GENERATED ZAP THEME OVERRIDE: ${themeName} */`);
    cssLines.push(`/* Do not edit directly. Edit theme.json and run the compiler. */`);
    cssLines.push(``);
    cssLines.push(`.theme-${themeName.toLowerCase()} {`);
    
    // 2. Generate Dart Class
    let dartLines = [];
    dartLines.push(`// AUTO-GENERATED ZAP THEME OVERRIDE: ${themeName}`);
    dartLines.push(`// Do not edit directly. Edit theme.json and run the compiler.`);
    dartLines.push(``);
    
    const className = themeName.charAt(0).toUpperCase() + themeName.slice(1).toLowerCase() + 'Theme';
    dartLines.push(`class ${className} {`);

    for (const [key, rawValue] of Object.entries(metrics)) {
        // ---- CSS Compilation ----
        const cssVar = `--${camelToKebab(key)}`;
        // Raw value likely still has !important from prior extraction
        cssLines.push(`    ${cssVar}: ${rawValue};`);
        
        // ---- Dart Compilation ----
        const dartParsed = parseDartValue(rawValue);
        dartLines.push(`  static const ${dartParsed.type} ${key} = ${dartParsed.val};`);
    }

    cssLines.push(`}`);
    dartLines.push(`}`);

    // Commit Web CSS
    fs.writeFileSync(cssPath, cssLines.join('\n'), 'utf8');
    console.log(`[${themeName}] 🌐 Wrote Web CSS: ${cssPath}`);

    // Commit Flutter Dart
    if (!fs.existsSync(dartDir)) {
        fs.mkdirSync(dartDir, { recursive: true });
    }
    fs.writeFileSync(dartPath, dartLines.join('\n'), 'utf8');
    console.log(`[${themeName}] 📱 Wrote Flutter Dart: ${dartPath}`);
}

async function run() {
    console.log('--- STARTING OMNI-THEME COMPILATION ---');
    for (const theme of TARGET_THEMES) {
        await compileTheme(theme);
    }
    console.log('\n--- COMPILATION COMPLETE ---');
}

run().catch(console.error);
