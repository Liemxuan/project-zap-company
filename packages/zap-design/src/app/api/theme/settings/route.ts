import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * ═══════════════════════════════════════════════════════════════════
 * API: /api/theme/settings
 * Unified Theme Settings — Single Source of Truth
 * ═══════════════════════════════════════════════════════════════════
 *
 * FILE-SYSTEM DRIVEN — no hardcoded theme list, no DB.
 * Each theme lives in: src/themes/{NAME}/theme.json
 *
 * Drop a new folder → it's a new theme. Scale to 50+ themes
 * by swapping directories, zero code changes needed.
 *
 * GET  ?theme=metro                      → full theme.json
 * GET  ?theme=metro&section=typography   → just the typography block
 * GET  (no params)                       → list all available themes
 * POST { theme, section, data }          → merge into theme.json
 *
 * Sections: "typography" | "colors" | "physics" | "metrics"
 * ═══════════════════════════════════════════════════════════════════
 */

const THEMES_DIR = path.join(process.cwd(), 'src/themes');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Check if a theme directory exists on disk */
function themeExists(theme: string): boolean {
    const dir = path.join(THEMES_DIR, theme.toUpperCase());
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

/** List all theme directories */
function listThemes(): string[] {
    if (!fs.existsSync(THEMES_DIR)) return [];
    return fs
        .readdirSync(THEMES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name.toLowerCase())
        .sort();
}

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
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(themePath, JSON.stringify(data, null, 2), 'utf-8');
}

/** Deep merge source into target. Arrays are replaced, not merged. */
function deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
): Record<string, unknown> {
    for (const key of Object.keys(source)) {
        const sourceVal = source[key];
        const targetVal = target[key];

        if (
            sourceVal &&
            typeof sourceVal === 'object' &&
            !Array.isArray(sourceVal) &&
            targetVal &&
            typeof targetVal === 'object' &&
            !Array.isArray(targetVal)
        ) {
            target[key] = deepMerge(
                targetVal as Record<string, unknown>,
                sourceVal as Record<string, unknown>
            );
        } else {
            target[key] = sourceVal;
        }
    }
    return target;
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
    try {
        const theme = request.nextUrl.searchParams.get('theme');
        const section = request.nextUrl.searchParams.get('section');

        // No theme param → return list of all available themes
        if (!theme) {
            const themes = listThemes();
            return NextResponse.json({ success: true, themes });
        }

        if (!themeExists(theme)) {
            const available = listThemes();
            return NextResponse.json(
                { success: false, error: `Theme "${theme}" not found. Available: ${available.join(', ')}` },
                { status: 404 }
            );
        }

        const themeData = readThemeJson(theme);
        if (!themeData) {
            return NextResponse.json({ success: true, data: null });
        }

        // If a specific section is requested, return just that block
        if (section) {
            const tokens = (themeData.tokens as Record<string, unknown>) || {};
            const sectionMap: Record<string, unknown> = {
                typography: tokens.typography ?? null,
                colors: tokens.colors ?? null,
                physics: tokens.physics ?? null,
                metrics: themeData.metrics ?? null,
            };

            if (!(section in sectionMap)) {
                return NextResponse.json(
                    { success: false, error: `Invalid section: "${section}". Valid: typography, colors, physics, metrics` },
                    { status: 400 }
                );
            }

            return NextResponse.json({ success: true, theme, section, data: sectionMap[section] });
        }

        return NextResponse.json({ success: true, theme, data: themeData });
    } catch (error) {
        console.error('[ZAP THEME SETTINGS] GET Error:', error);
        return NextResponse.json({ success: false, error: 'Read failed' }, { status: 500 });
    }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { theme = 'metro', section, data } = body;

        if (!data || typeof data !== 'object') {
            return NextResponse.json(
                { success: false, error: 'Missing "data" object in request body.' },
                { status: 400 }
            );
        }

        // Auto-create theme directory if it doesn't exist (new theme flow)
        const themeDir = path.join(THEMES_DIR, theme.toUpperCase());
        if (!fs.existsSync(themeDir)) {
            fs.mkdirSync(themeDir, { recursive: true });
            console.log(`[ZAP THEME SETTINGS] Created new theme directory: ${themeDir}`);
        }

        // Read existing theme.json or create skeleton
        const existing = readThemeJson(theme) || {
            version: '2.0',
            theme: theme.toLowerCase(),
            name: theme.toUpperCase(),
            tokens: { colors: {}, typography: {}, physics: {} },
            metrics: {},
        };

        // Ensure tokens exists
        if (!existing.tokens || typeof existing.tokens !== 'object') {
            existing.tokens = { colors: {}, typography: {}, physics: {} };
        }

        const tokens = existing.tokens as Record<string, unknown>;

        if (section) {
            switch (section) {
                case 'typography':
                    tokens.typography = deepMerge(
                        (tokens.typography as Record<string, unknown>) || {},
                        data
                    );
                    // Sync typography keys into metrics for CSS variable generation
                    if (!existing.metrics || typeof existing.metrics !== 'object') {
                        existing.metrics = {};
                    }
                    const typMetrics = existing.metrics as Record<string, unknown>;
                    if (data.primaryFont) typMetrics.fontDisplay = `${data.primaryFont} !important`;
                    if (data.primaryTransform) typMetrics.headingTransform = `${data.primaryTransform} !important`;
                    if (data.secondaryFont) typMetrics.fontBody = `${data.secondaryFont} !important`;
                    if (data.secondaryTransform) typMetrics.bodyTransform = `${data.secondaryTransform} !important`;
                    if (data.tertiaryFont) typMetrics.fontDev = `${data.tertiaryFont} !important`;
                    if (data.tertiaryTransform) typMetrics.devTransform = `${data.tertiaryTransform} !important`;
                    break;

                case 'colors':
                    tokens.colors = deepMerge(
                        (tokens.colors as Record<string, unknown>) || {},
                        data
                    );
                    break;

                case 'physics':
                    tokens.physics = deepMerge(
                        (tokens.physics as Record<string, unknown>) || {},
                        data
                    );
                    break;

                case 'metrics':
                    existing.metrics = deepMerge(
                        (existing.metrics as Record<string, unknown>) || {},
                        data
                    );
                    break;

                default:
                    return NextResponse.json(
                        { success: false, error: `Invalid section: "${section}". Valid: typography, colors, physics, metrics` },
                        { status: 400 }
                    );
            }
        } else {
            // No section — deep merge everything
            deepMerge(existing, data);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (existing as any).updatedAt = new Date().toISOString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        writeThemeJson(theme, existing as any);

        console.log(`[ZAP THEME SETTINGS] Saved ${theme.toUpperCase()}${section ? `/${section}` : ''} → theme.json`);

        return NextResponse.json({
            success: true,
            message: `Theme ${theme.toUpperCase()}${section ? ` (${section})` : ''} saved to theme.json.`,
            data: existing,
        });
    } catch (error) {
        console.error('[ZAP THEME SETTINGS] POST Error:', error);
        return NextResponse.json({ success: false, error: 'Write failed' }, { status: 500 });
    }
}
