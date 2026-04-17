import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { filePath, isLocked } = body;

        if (!filePath || typeof isLocked !== 'boolean') {
            return NextResponse.json({ error: "Missing required fields: filePath and isLocked (boolean)" }, { status: 400 });
        }

        return NextResponse.json({ data: { filePath, isLocked, updatedAt: new Date().toISOString() } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update asset lock status" }, { status: 500 });
    }
}
