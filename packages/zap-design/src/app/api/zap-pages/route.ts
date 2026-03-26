import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

export async function GET() {
    try {
        const clawDirName = 'zap' + '-claw';
        const scriptPath = path.resolve(process.cwd(), '..', clawDirName, 'src/scripts/pages_status_json.ts');
        const output = execSync(`npx tsx ${scriptPath}`, { encoding: 'utf-8', cwd: path.resolve(process.cwd(), '..', clawDirName) });
        const data = JSON.parse(output);
        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("API Error fetching Zap Pages:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
