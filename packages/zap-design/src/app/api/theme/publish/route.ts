import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * API: Publish Theme
 * 
 * Writes the adjusted variables back to the specific theme CSS file 
 * (defaulting to METRO for the engine) for permanent persistence.
 */

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme') || 'metro';
    const themePath = path.join(process.cwd(), `src/themes/${theme.toUpperCase()}/theme-${theme.toLowerCase()}.css`);

    try {
        if (!fs.existsSync(themePath)) {
            return NextResponse.json({ success: true, variables: {} });
        }

        const css = fs.readFileSync(themePath, 'utf-8');
        const variables: Record<string, string> = {};
        
        // Extract CSS variables using regex
        const regex = /(--[a-zA-Z0-9-_]+):\s*([^;!]+)(?:\s*!important)?;/g;
        let match;
        while ((match = regex.exec(css)) !== null) {
            variables[match[1]] = match[2].trim();
        }

        return NextResponse.json({ success: true, variables });
    } catch (error) {
        console.error("[ZAP THEME GET] Read Error:", error);
        return NextResponse.json({ success: false, error: 'Read failed' }, { status: 500 });
    }
}

import { compileThemeCSS } from '../../../../lib/theme-compiler';

// --- Dual-Store Sync Helpers ---
const THEMES_DIR = path.join(process.cwd(), 'src/themes');

function getThemePath(theme: string): string {
    return path.join(THEMES_DIR, theme.toUpperCase(), 'theme.json');
}

function readThemeJson(theme: string): Record<string, unknown> | null {
    const themePath = getThemePath(theme);
    if (!fs.existsSync(themePath)) return null;
    const raw = fs.readFileSync(themePath, 'utf-8');
    return JSON.parse(raw);
}

function writeThemeJson(theme: string, data: Record<string, unknown>): void {
    const themePath = getThemePath(theme);
    const dir = path.dirname(themePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(themePath, JSON.stringify(data, null, 2), 'utf-8');
}

function cssVariableToJsonKey(cssVar: string): string {
    return cssVar.replace(/^--/, '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function writeThemeElevationMarkdown(theme: string, metrics: Record<string, string>): void {
    const themeDir = path.join(THEMES_DIR, theme.toUpperCase());
    const mdPath = path.join(themeDir, 'elevation.md');
    
    // Auto-doc template with the latest tokens injected
    const mdContent = `# ZAP Surface Elevation Protocol (${theme.toUpperCase()})
> This document is auto-generated upon Theme Publishing. It represents the single source of truth for ZAP-OS L0-L5 surface semantics for this theme.
> Last Sync: ${new Date().toISOString()}

## 1. The Default M3 Surface Map
By default, the \`bg-layer-*\` utility classes map directly to the underlying Material 3 surface tint hierarchy:
- **L0: Base** (\`bg-layer-base\`) → \`--md-sys-color-surface-container-lowest\`
- **L1: Canvas** (\`bg-layer-canvas\`) → \`--md-sys-color-surface-container-low\`
- **L2: Cover** (\`bg-layer-cover\`) → \`--md-sys-color-surface-container\`
- **L3: Panels** (\`bg-layer-panel\`) → \`--md-sys-color-surface-container-high\`
- **L4: Dialogs** (\`bg-layer-dialog\`) → \`--md-sys-color-surface-container-highest\`
- **L5: Modals** (\`bg-layer-modal\`) → \`--md-sys-color-surface-container-highest\` (Note: L5 shares the highest container token but often incorporates scrim/shadow values for depth)

## 2. The Dynamic Override Tokens
The ZAP system allows real-time theming via the Inspector. These override tokens sit on top of the defaults. If these CSS variables are set, they override the M3 standard colors via \`color-mix()\`.

Currently active inspector overrides for this theme session:
- **L0 Override:** \`var(--layer-0-bg-token)\`  (Active: \`${metrics['--layer-0-bg-token'] || 'default'}\`)
- **L1 Override:** \`var(--layer-1-bg-token)\`  (Active: \`${metrics['--layer-1-bg-token'] || 'default'}\`)
- **L2 Override:** \`var(--layer-2-bg-token)\`  (Active: \`${metrics['--layer-2-bg-token'] || 'default'}\`)
- **L3 Override:** \`var(--layer-3-bg-token)\`  (Active: \`${metrics['--layer-3-bg-token'] || 'default'}\`)
- **L4 Override:** \`var(--layer-4-bg-token)\`  (Active: \`${metrics['--layer-4-bg-token'] || 'default'}\`)
- **L5 Override:** \`var(--layer-5-bg-token)\`  (Active: \`${metrics['--layer-5-bg-token'] || 'default'}\`)

## 3. The DevMode Debug Colors
When spatial depth debugging is activated (\`[data-devmode="true"]\`), the architecture forcefully applies highly saturated generic colors to easily spot "layer inversion":
- **L0:** \`#e5e7eb\` (Gray-200)
- **L1:** \`#f87171\` (Red-400)
- **L2:** \`#facc15\` (Yellow-400)
- **L3:** \`#22c55e\` (Green-500)
- **L4:** \`#a855f7\` (Purple-500)
- **L5:** \`#ec4899\` (Pink-500)

## ZAP Structural Compliance Rules

### A. The Strict Ascension Rule (Terminal Violations)
The system explicitly calls out a **Terminal Violation** for spatial inversion.
* **The Rule:** "Once an **L2 Cover** wrapper is established (like a main body sandbox), all inner localized content MUST strictly ascend to \`bg-layer-panel\` (L3) or \`bg-layer-dialog\` (L4)."
* **The Warning:** Nesting \`bg-layer-base\` (L0) or \`bg-layer-canvas\` (L1) inside an L2 Cover is flagged as an architectural failure.

### B. Interaction State Mechanics
Elevation is not static. The \`COMPONENT_ELEVATION_MAP\` dictates exactly how surfaces must react to user interaction:
* **Hover:** Raises the elevation by exactly **1 level** (e.g., L1 Card elevates to L2 on hover).
* **Press/Active:** Drops back down to the **default level**.
* **Disabled:** Hard drops to **Level 0 (Flat)** with reduced opacity.

### C. Z-Index Coupling & Tint Mathematics
ZAP replaces arbitrary drop shadows with the M3 Tint Overlay math.
* **Tint Opacity:** Elevation hierarchy is primarily achieved by injecting microscopic amounts of primary color into the surface background (L1 is 5% tint, L5 is 14% tint).
* **Z-Index Bonding:** Every semantic layer is hard-coupled to a z-index band. 
  * \`L1: z-10\`
  * \`L2: z-100\`
  * \`L3: z-1000+\`
  * \`L4: z-2000+\`
  * \`L5: z-3000\`
`;
    if (!fs.existsSync(themeDir)) fs.mkdirSync(themeDir, { recursive: true });
    fs.writeFileSync(mdPath, mdContent.trim(), 'utf-8');
}
// -------------------------------

export async function POST(request: Request) {
    const { theme = 'METRO', variables } = await request.json();

    if (!variables || typeof variables !== 'object') {
        return NextResponse.json({ success: false, error: 'No variables provided' }, { status: 400 });
    }

    try {
        // 1. Publish to literal CSS Payload (Live Variables)
        await compileThemeCSS(theme, variables);

        // 2. Publish to JSON Database Registry (Fallback & Preview Server)
        const existing = readThemeJson(theme) || {
            version: '2.0',
            theme: theme.toLowerCase(),
            name: theme.toUpperCase(),
            tokens: { colors: {}, typography: {}, physics: {} },
            metrics: {},
        };
        
        if (!existing.metrics) existing.metrics = {};
        
        for (const [key, value] of Object.entries(variables)) {
            const mappedKey = cssVariableToJsonKey(key);
            let stringVal = value as string;
            
            // Re-enforcing !important tags to match METRO theme struct if not present
            if (!stringVal.includes('!important')) {
                 stringVal = `${stringVal} !important`;
            }
            
            (existing.metrics as Record<string, string>)[mappedKey] = stringVal;
        }

        (existing as Record<string, unknown>).updatedAt = new Date().toISOString();
        writeThemeJson(theme, existing);
        
        // 3. Publish to Auto-Doc Engine (Markdown)
        writeThemeElevationMarkdown(theme, variables);

        return NextResponse.json({ success: true, message: `Theme ${theme} recorded into dual-store sync.` });
    } catch (error) {
        console.error("[ZAP PUBLISH] Write Error:", error);
        return NextResponse.json({ success: false, error: 'Write failed' }, { status: 500 });
    }
}
