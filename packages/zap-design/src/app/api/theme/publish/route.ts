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

        return NextResponse.json({ success: true, message: `Theme ${theme} recorded into dual-store sync.` });
    } catch (error) {
        console.error("[ZAP PUBLISH] Write Error:", error);
        return NextResponse.json({ success: false, error: 'Write failed' }, { status: 500 });
    }
}
