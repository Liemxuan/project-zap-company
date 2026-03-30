import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP } from '../../../../zap/sections/atoms/foundations/schema';
import { compileThemeCSS } from '../../../../lib/theme-compiler';
import { compileFlutterRadius } from '../../../../lib/flutter-compiler';

export const dynamic = 'force-dynamic';

const SETTINGS_DIR = path.join(process.cwd(), '.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `border_radius-${theme}.json`);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // The frontend sends `state` instead of `radiusTokens` now
        const { theme, state } = body;

        if (!theme) {
            return NextResponse.json({ error: 'Missing required theme field.' }, { status: 400 });
        }

        // Ensure settings directory exists
        if (!fs.existsSync(SETTINGS_DIR)) {
            fs.mkdirSync(SETTINGS_DIR, { recursive: true });
        }

        const settings = {
            theme,
            state: state || {},
            updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(getSettingsPath(theme), JSON.stringify(settings, null, 2), 'utf-8');

        console.log(`[ZAP PUBLISH] Saved ${theme} border radius settings to disk`);

        // --- COMPILE TO CSS VARIABLES ---
        // Map the tailwind classes (e.g. "rounded-none", "border-8") to pixel values
        const universalRadiusToken = state?.universal?.radius || 'rounded-md';
        const universalWidthToken = state?.universal?.width || 'border';

        // Find the actual value from the schema (e.g. "0px", "8px")
        // Note: some string manipulation is needed if value is like "0.125rem (2px)" -> just use what's before the space or parens, 
        // but for CSS, just grabbing the token's defined value works. Actually BORDER_RADIUS_TOKENS value might have " (4px)".
        // Let's use a simpler mapping for compilation
        // Setup a helper to safely extract and compile component overrides
        const compileValue = (val: string) => val.split(' ')[0];
        
        const getOverride = (compName: string, prop: 'radius' | 'width') => {
            const overrideToken = state?.components?.[compName]?.[prop];
            if (overrideToken) {
                const schemaList = prop === 'radius' ? BORDER_RADIUS_TOKENS : BORDER_WIDTH_TOKENS;
                return compileValue(schemaList.find(t => t.token === overrideToken)?.value || '');
            }
            return null; // Fallback to universal
        };

        const getBgOverride = (compName: string, propName: 'bg' | 'bgGroup' = 'bg') => {
            const overrideToken = state?.components?.[compName]?.[propName];
            if (overrideToken) {
                const layer = ZAP_LAYER_MAP.find(L => L.zapToken === overrideToken);
                if (layer) {
                    return `var(--color-${layer.m3Token.replace('bg-', '')})`;
                }
                if (overrideToken.startsWith('bg-')) {
                    return `var(--color-${overrideToken.replace('bg-', '')})`;
                }
            }
            return null; // Fallback to universal
        };

        const rawRadiusValue = BORDER_RADIUS_TOKENS.find(t => t.token === universalRadiusToken)?.value || '4px';
        const rawWidthValue = BORDER_WIDTH_TOKENS.find(t => t.token === universalWidthToken)?.value || '1px';

        const compiledRadius = compileValue(rawRadiusValue);
        const compiledWidth = compileValue(rawWidthValue);

        const variablesToPublish: Record<string, string> = {
            '--radius-shape-small': compiledRadius,
            '--radius-shape-medium': compiledRadius,
            '--radius-shape-large': compiledRadius,
            '--card-radius': getOverride('Card', 'radius') || compiledRadius,
            '--button-border-radius': getOverride('Button', 'radius') || compiledRadius,
            '--input-border-radius': getOverride('Input', 'radius') || compiledRadius,
            '--card-border-width': getOverride('Card', 'width') || compiledWidth,
            '--input-border-width': getOverride('Input', 'width') || compiledWidth,
            '--button-border-width': getOverride('Button', 'width') || compiledWidth,
            '--badge-border-radius': getOverride('Badge', 'radius') || compiledRadius,
            '--badge-border-width': getOverride('Badge', 'width') || compiledWidth,
            '--pill-border-radius': getOverride('Pill', 'radius') || compiledRadius,
            '--pill-border-width': getOverride('Pill', 'width') || compiledWidth,
            '--skeleton-border-radius': getOverride('Skeleton', 'radius') || compiledRadius,
            '--skeleton-border-width': getOverride('Skeleton', 'width') || compiledWidth,
            '--checkbox-border-radius': getOverride('Checkbox', 'radius') || compiledRadius,
            '--checkbox-border-width': getOverride('Checkbox', 'width') || compiledWidth,
            '--search-input-border-radius': getOverride('SearchInput', 'radius') || compiledRadius,
            '--search-input-border-width': getOverride('SearchInput', 'width') || compiledWidth,
            '--select-border-radius': getOverride('Select', 'radius') || compiledRadius,
            '--select-border-width': getOverride('Select', 'width') || compiledWidth,
            '--select-bg': getBgOverride('Select') || 'var(--color-surface-container-highest)',
            '--textarea-border-radius': getOverride('Textarea', 'radius') || compiledRadius,
            '--textarea-border-width': getOverride('Textarea', 'width') || compiledWidth,
            '--textarea-bg': getBgOverride('Textarea') || 'var(--color-surface-container-highest)',
            '--input-bg': getBgOverride('Input') || 'var(--color-surface-container-highest)',
            '--switch-border-radius': getOverride('Switch', 'radius') || compiledRadius,
            '--switch-border-width': getOverride('Switch', 'width') || compiledWidth,
            '--toggle-bg': getBgOverride('Toggle') || 'var(--color-surface-container-highest)',
            '--toggle-border-radius': getOverride('ToggleGroup', 'radius') || getOverride('Toggle', 'radius') || compiledRadius,
            '--toggle-border-width': getOverride('ToggleGroup', 'width') || getOverride('Toggle', 'width') || compiledWidth,
            '--toggle-group-bg': getBgOverride('ToggleGroup', 'bgGroup') || 'transparent',
            '--dialog-bg': getBgOverride('Dialog') || 'var(--color-surface-container-highest)',
            '--dialog-border-radius': getOverride('Dialog', 'radius') || compiledRadius,
            '--dialog-border-width': getOverride('Dialog', 'width') || compiledWidth,
            '--table-border-radius': getOverride('Table', 'radius') || compiledRadius,
            '--table-border-width': getOverride('Table', 'width') || compiledWidth,
            '--layer-border-width': compiledWidth, // Universal fallback for structural layers
            '--layer-border-radius': compiledRadius, // Universal fallback for structural layers
        };

        // Write Structural ZAP Layer L2-L5 Overrides dynamically if present
        const layerMap = [
            { comp: 'Cover (L2)', N: 2 },
            { comp: 'Panel (L3)', N: 3 },
            { comp: 'Dialog', N: 4 }, // L4
            { comp: 'Modal (L5)', N: 5 }
        ];

        layerMap.forEach(({ comp, N }) => {
            const rad = getOverride(comp, 'radius');
            const wid = getOverride(comp, 'width');
            if (rad) variablesToPublish[`--layer-${N}-border-radius`] = rad;
            if (wid) variablesToPublish[`--layer-${N}-border-width`] = wid;
        });

        // Call the compiler directly
        await compileThemeCSS(theme, variablesToPublish);
        console.log(`[ZAP PUBLISH] Successfully compiled border variables to ${theme} theme`);

        // FLUTTER SYNC HOOK
        await compileFlutterRadius(theme, state);

        return NextResponse.json({ success: true, message: `Border Radius for theme ${theme} saved and compiled.`, data: settings });
    } catch (error: unknown) {
        console.error("Border Radius Save Error:", error);
        const errMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const theme = searchParams.get('theme') || 'metro';
        const settingsPath = getSettingsPath(theme);

        if (!fs.existsSync(settingsPath)) {
            return NextResponse.json({ success: true, data: null });
        }

        const raw = fs.readFileSync(settingsPath, 'utf-8');
        const data = JSON.parse(raw);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Border Radius Read Error:", error);
        return NextResponse.json({ success: false, error: 'File read failed' }, { status: 500 });
    }
}
