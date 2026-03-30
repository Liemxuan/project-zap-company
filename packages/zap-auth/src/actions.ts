'use server';

import { cookies } from 'next/headers';
import { prisma } from '@olympus/zap-db';

export async function loginAction(email: string, pass: string) {
    if (email === 'name@zap' && pass === '1234') {
        const cookieStore = await cookies();
        cookieStore.set('zap_session', 'mock-user-id-bypass', { 
            secure: process.env.NODE_ENV === 'production', 
            httpOnly: true, 
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return { success: true };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true }
        });

        if (user && user.password === pass) {
            const cookieStore = await cookies();
            cookieStore.set('zap_session', user.id, { 
                secure: process.env.NODE_ENV === 'production', 
                httpOnly: true, 
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            return { success: true };
        }
        return { error: 'Invalid credentials. Use name@zap and 1234.' };
    } catch (error) {
        console.error("Database error during login:", error);
        return { error: 'Database connection failed. Please use name@zap / 1234 to bypass.' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('zap_session');
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('zap_session')?.value;
    if (!sessionId) return null;
    if (!prisma) return null; // Prisma unavailable (Turbopack engine resolution)

    return await prisma.user.findUnique({
        where: { id: sessionId },
        include: { employee: true }
    });
}

export async function getUsersAction() {
    return await prisma.user.findMany({
        include: { 
            employee: { 
                include: { 
                    organization: true,
                    brand: true,
                    location: true
                } 
            } 
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getSystemLogsAction() {
    return await prisma.systemLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });
}

export async function getPortalMetricsAction() {
    const totalUsers = await prisma.user.count();
    const totalLogs = await prisma.systemLog.count();
    const posLogs = await prisma.systemLog.count({ where: { source: 'POS' } });

    return {
        totalUsers,
        totalLogs,
        posLogs,
        revenue: 12450.00 // Static Mock until Phase 9 Transaction Schema is built
    };
}
