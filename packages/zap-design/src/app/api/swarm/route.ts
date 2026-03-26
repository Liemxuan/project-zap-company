import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const rawTickets = await prisma.extractionTicket.findMany({
            orderBy: {
                urlPath: 'asc',
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tickets = rawTickets.map((t: any, index: number) => ({
            ...t,
            indexId: `ZAP-${String(index + 1).padStart(3, '0')}`,
            l5Organisms: t.l5Organisms ? JSON.parse(t.l5Organisms) : [],
            l4Molecules: t.l4Molecules ? JSON.parse(t.l4Molecules) : [],
            l3Atoms: t.l3Atoms ? JSON.parse(t.l3Atoms) : [],
            l2Primitives: t.l2Primitives ? JSON.parse(t.l2Primitives) : [],
            l1Tokens: t.l1Tokens ? JSON.parse(t.l1Tokens) : []
        }));

        return NextResponse.json(tickets);
    } catch (err: unknown) {
        console.error("Prisma Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}
