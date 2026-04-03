import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

// Point to the SHARED settings directory in the workspace root or zap-design package
const SETTINGS_DIR = path.join(process.cwd(), '../../packages/zap-design/.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `typography-${theme}.json`);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            theme,
            primaryFont, primaryTransform,
            secondaryFont, secondaryTransform,
            tertiaryFont, tertiaryTransform,
            components
        } = body;

        if (!theme || !primaryFont) {
            return NextResponse.json({ error: 'Missing required typography fields.' }, { status: 400 });
        }

        // Ensure settings directory exists
        if (!fs.existsSync(SETTINGS_DIR)) {
            fs.mkdirSync(SETTINGS_DIR, { recursive: true });
        }

        const settings = {
            theme,
            primaryFont,
            primaryTransform: primaryTransform || 'none',
            secondaryFont: secondaryFont || '',
            secondaryTransform: secondaryTransform || 'none',
            tertiaryFont: tertiaryFont || '',
            tertiaryTransform: tertiaryTransform || 'none',
            components: components || {},
            updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(getSettingsPath(theme), JSON.stringify(settings, null, 2), 'utf-8');

        console.log(`[ZAP WEB PROXY] Saved ${theme} typography to shared settings`, settings);

        return NextResponse.json({ success: true, message: `Typography for theme ${theme} saved.`, data: settings });
    } catch (error) {
        console.error("Typography Save Error:", error);
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
        console.error("Typography Read Error:", error);
        return NextResponse.json({ success: false, error: 'File read failed' }, { status: 500 });
    }
}
