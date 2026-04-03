'use server';

import { cookies } from 'next/headers';
import { prisma } from '@olympus/zap-db';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'zss-omega-delta-99-super-secret-key-2026'
);

async function signToken(payload: { sub: string; tenantId: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function loginAction(email: string, pass: string) {
    if (email === 'name@zap' && pass === '1234') {
        const token = await signToken({ sub: 'mock-user-id-bypass', tenantId: 'ZVN' });
        const cookieStore = await cookies();
        cookieStore.set('zap_session', token, { 
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
            // Employee -> Organization mappings usually dictate the tenant, defaulting to ZVN for now
            const tenantId = user.employee?.organizationId || 'ZVN';
            const token = await signToken({ sub: user.id, tenantId });
            
            const cookieStore = await cookies();
            cookieStore.set('zap_session', token, { 
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
    const token = cookieStore.get('zap_session')?.value;
    if (!token) return null;
    if (!prisma) return null; // Prisma unavailable (Turbopack engine resolution)

    let sessionId = token;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        sessionId = payload.sub as string;
    } catch (e) {
        // Fallback for legacy unencrypted session cookies during migration
        console.warn("[Auth] Legacy raw session cookie detected and permitted as fallback.");
    }

    if (sessionId === 'mock-user-id-bypass') {
        return {
            id: 'mock-user-id-bypass',
            name: 'Zeus Tom',
            email: 'name@zap',
            image: 'https://github.com/shadcn.png',
            employee: null
        };
    }

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
