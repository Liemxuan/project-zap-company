import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const components = await (prisma as any).componentRegistry.findMany({
            orderBy: {
                name: 'asc',
            }
        });

        const formattedComponents = components.map((c: { 
            name: string; 
            tags: string | null; 
            pages: string | null; 
            [key: string]: unknown 
        }) => ({
            ...c,
            tags: c.tags ? JSON.parse(c.tags) : [],
            pages: c.pages ? JSON.parse(c.pages) : [],
        }));

        return NextResponse.json(formattedComponents);
    } catch (err: unknown) {
        console.error("Prisma Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}
