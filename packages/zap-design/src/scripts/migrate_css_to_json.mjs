import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THEMES_DIR = path.resolve(__dirname, '../../src/themes');
const TARGET_THEMES = ['CORE', 'METRO', 'NEO', 'WIX'];

// Utility to convert CSS variable names to camelCase (e.g. --input-height -> inputHeight)
function kebabToCamel(str) {
    // Remove leading dashes
    const cleanStr = str.replace(/^--?/, '');
    return cleanStr.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

async function migrateThemeCssToJson(themeName) {
    const themeDir = path.join(THEMES_DIR, themeName);
    const cssPath = path.join(themeDir, 'theme.css');
    const jsonPath = path.join(themeDir, 'theme.json');

    console.log(`\n[${themeName}] Starting extraction...`);

    if (!fs.existsSync(cssPath)) {
        console.warn(`[${themeName}] ⚠️  Missing theme.css, skipping.`);
        return;
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');

    const metricsAcc = {};
    let varCount = 0;

    // Global Regex to match standard CSS variables anywhere in the file: --radius: 0.5rem;
    const varRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let varMatch;

    while ((varMatch = varRegex.exec(cssContent)) !== null) {
        varCount++;
        const cssVar = varMatch[1].trim();
        const value = varMatch[2].trim();
        const jsonKey = kebabToCamel(cssVar);
        
        metricsAcc[jsonKey] = value;
    }

    if (varCount === 0) {
        console.log(`[${themeName}] ℹ️  No CSS variables found in theme.css.`);
        return;
    }

    console.log(`[${themeName}] ✅ Extracted ${Object.keys(metricsAcc).length} unique variables.`);

    // Load or create the theme.json
    let themeJson = {};
    if (fs.existsSync(jsonPath)) {
        const rawJson = fs.readFileSync(jsonPath, 'utf8');
        try {
            themeJson = JSON.parse(rawJson);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            console.error(`[${themeName}] ❌ Failed to parse existing theme.json. Overwriting.`);
            themeJson = {};
        }
    }

    // Merge into the "metrics" object inside JSON
    if (!themeJson.metrics) {
        themeJson.metrics = {};
    }

    themeJson.metrics = {
        ...themeJson.metrics,
        ...metricsAcc
    };

    // Ensure basic metadata exists
    if (!themeJson.name) themeJson.name = themeName;
    if (!themeJson.version) themeJson.version = "1.0.0";

    fs.writeFileSync(jsonPath, JSON.stringify(themeJson, null, 2), 'utf8');
    console.log(`[${themeName}] 💾 Saved new metrics to theme.json`);
}

async function run() {
    console.log('--- STARTING CSS-TO-JSON MIGRATION ---');
    for (const theme of TARGET_THEMES) {
        await migrateThemeCssToJson(theme);
    }
    console.log('\n--- MIGRATION COMPLETE ---');
}

run().catch(console.error);
