import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { compileFlutterColors } from '../../../../lib/flutter-compiler';

export const dynamic = 'force-dynamic';

const SETTINGS_DIR = path.join(process.cwd(), '.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `colors-${theme}.json`);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { theme, cssOutput, colors } = body;

        if (!theme || (!cssOutput && !colors)) {
            return NextResponse.json({ error: 'Missing required color fields.' }, { status: 400 });
        }

        // Ensure settings directory exists
        if (!fs.existsSync(SETTINGS_DIR)) {
            fs.mkdirSync(SETTINGS_DIR, { recursive: true });
        }

        const settings = {
            theme,
            cssOutput,
            colors,
            updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(getSettingsPath(theme), JSON.stringify(settings, null, 2), 'utf-8');

        console.log(`[ZAP PUBLISH] Saved ${theme} color settings to disk`);
        
        // FLUTTER SYNC HOOK
        await compileFlutterColors(theme, colors);

        return NextResponse.json({ success: true, message: `Colors for theme ${theme} saved.`, data: settings });
    } catch (error) {
        console.error("Color Save Error:", error);
        return NextResponse.json({ success: false, error: 'File write failed' }, { status: 500 });
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
        console.error("Color Read Error:", error);
        return NextResponse.json({ success: false, error: 'File read failed' }, { status: 500 });
    }
}
