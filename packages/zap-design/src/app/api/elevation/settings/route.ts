import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const SETTINGS_DIR = path.join(process.cwd(), '.zap-settings');
const getSettingsPath = (theme: string) => path.join(SETTINGS_DIR, `elevation-${theme}.json`);

// GET — load saved elevation settings
export async function GET(request: NextRequest) {
    try {
        const theme = request.nextUrl.searchParams.get('theme') || 'metro';
        const filePath = getSettingsPath(theme);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(null, { status: 404 });
        }

        const raw = fs.readFileSync(filePath, 'utf-8');
        const settings = JSON.parse(raw);
        return NextResponse.json(settings);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
