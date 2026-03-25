import { prisma } from './index';
import { NextRequest, NextResponse } from 'next/server';

export function extractBearerToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

export async function GET_logs(req: NextRequest) {
    try {
        if (!extractBearerToken(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const logs = await prisma.systemLog.findMany({ 
            orderBy: { createdAt: 'desc' }, 
            take: 100 
        });
        return NextResponse.json({ logs });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET_metrics(req: NextRequest) {
    try {
        if (!extractBearerToken(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const totalUsers = await prisma.user.count();
        const posLogs = await prisma.systemLog.count({ where: { source: 'POS' } });
        const totalLogs = await prisma.systemLog.count();
        
        return NextResponse.json({
            totalUsers,
            totalLogs,
            posLogs,
            revenue: 12450.00 // Static Mock until Phase 9 Transaction Schema
        });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
