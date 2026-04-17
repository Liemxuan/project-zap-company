import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        return NextResponse.json({
            data: [],
            meta: {
                total: 0,
                page,
                limit,
                totalPages: 0
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch asset tickets" }, { status: 500 });
    }
}
