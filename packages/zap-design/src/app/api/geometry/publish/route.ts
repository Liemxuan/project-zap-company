import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const SETTINGS_DIR = path.join(process.cwd(), '.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `geometry-${theme}.json`);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { theme, cssOutput, settings: geoSettings } = body;

        if (!theme || (!cssOutput && !geoSettings)) {
            return NextResponse.json({ error: 'Missing required geometry fields.' }, { status: 400 });
        }

        // Ensure settings directory exists
        if (!fs.existsSync(SETTINGS_DIR)) {
            fs.mkdirSync(SETTINGS_DIR, { recursive: true });
        }

        const payload = {
            theme,
            cssOutput,
            settings: geoSettings,
            updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(getSettingsPath(theme), JSON.stringify(payload, null, 2), 'utf-8');

        console.log(`[ZAP PUBLISH] Saved ${theme} geometry settings to disk`);

        return NextResponse.json({ success: true, message: `Geometry for theme ${theme} saved.`, data: payload });
    } catch (error) {
        console.error("Geometry Save Error:", error);
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
        console.error("Geometry Read Error:", error);
        return NextResponse.json({ success: false, error: 'File read failed' }, { status: 500 });
    }
}
