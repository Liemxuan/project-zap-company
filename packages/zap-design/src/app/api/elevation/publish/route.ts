import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { compileThemeCSS } from '../../../../lib/theme-compiler';
import { LayerPropertiesState } from '../../../../zap/sections/atoms/elevation/use-layer-properties';

export const dynamic = 'force-dynamic';

const SETTINGS_DIR = path.join(process.cwd(), '.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `elevation-${theme}.json`);

// POST — persist elevation layer properties
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { theme, settings } = body as { theme: string, settings: LayerPropertiesState };

        if (!theme || !settings) {
            return NextResponse.json({ error: 'Missing theme or settings' }, { status: 400 });
        }

        // Ensure settings directory exists
        if (!fs.existsSync(SETTINGS_DIR)) {
            fs.mkdirSync(SETTINGS_DIR, { recursive: true });
        }

        const filePath = getSettingsPath(theme);
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');

        // Extract variables for compilation
        const cssVars: Record<string, string> = {};

        const LAYER_IDS = [0, 1, 2, 3, 4, 5];
        LAYER_IDS.forEach(id => {
            const layer = settings.layers[id];
            if (!layer) return;

            if (layer.bgOpacity !== undefined) {
                cssVars[`--layer-${id}-bg-opacity`] = `${layer.bgOpacity / 100}`;
            }
            if (layer.tintOpacity !== undefined) {
                cssVars[`--layer-${id}-tint-opacity`] = `${layer.tintOpacity / 100}`;
            }
            if (layer.bgToken !== undefined && layer.bgToken !== '') {
                cssVars[`--layer-${id}-bg-token`] = `var(--color-${layer.bgToken})`;
            }
        });

        // Compile and write theme CSS
        await compileThemeCSS(theme, cssVars);

        return NextResponse.json({
            success: true,
            path: filePath,
            timestamp: new Date().toISOString(),
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
