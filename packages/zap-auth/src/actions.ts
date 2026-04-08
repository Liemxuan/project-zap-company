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

// ─── Mock Users (no DB required) ───────────────────────────────────────────
const MOCK_USERS: Record<string, { password: string; id: string; tenantId: string }> = {
    'admin@zap':   { password: '1234',        id: 'mock-admin-001',   tenantId: 'ZVN' },
    'manager@zap': { password: 'manager123',  id: 'mock-manager-002', tenantId: 'ZVN' },
    'name@zap':    { password: '1234',        id: 'mock-user-003',    tenantId: 'ZVN' },
    'name.zap':    { password: '1234',        id: 'mock-user-004',    tenantId: 'ZVN' },
};

// Known failure scenarios (mock only)
const MOCK_LOCKED = new Set(['locked@zap']);

export async function loginAction(email: string, pass: string) {
    const IS_MOCK = process.env.NEXT_PUBLIC_IS_MOCK === 'true';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api';
    console.log('🔍 loginAction: account =', email, '| IS_MOCK =', IS_MOCK, '| API_URL =', API_URL);

    // ─── Handle Mock Login ───────────────────────────────────────────
    if (IS_MOCK) {
        const user = MOCK_USERS[email];
        if (!user || user.password !== pass) {
            console.log('❌ Mock login failed for:', email);
            return { error: 'invalid_credentials' };
        }

        console.log('✅ Mock login success for:', email);
        const token = 'mock-jwt-token-zss-' + Math.random().toString(36).substring(2);
        
        const cookieStore = await cookies();
        cookieStore.set('zap_session', token, {
            secure: false,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        cookieStore.set('access_token', token, {
            secure: false,
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        const userData = {
            merchant_id: user.tenantId,
            email: email,
            name: email.split('@')[0],
            logo_url: '/zap-logo.png',
        };

        cookieStore.set('zap_user', JSON.stringify(userData), {
            secure: false,
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        return {
            success: true,
            data: {
                token,
                ...userData,
            },
        };
    }

    try {
        // Call real API for authentication
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account: email,
                password: pass,
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { error: 'invalid_credentials' };
            }
            if (response.status === 423) {
                return { error: 'account_locked' };
            }
            return { error: 'network_error' };
        }

        const result = await response.json();

        if (!result.success || !result.data?.token) {
            return { error: 'invalid_credentials' };
        }

        // Store token in secure httpOnly cookie (for server-side requests)
        const cookieStore = await cookies();
        cookieStore.set('zap_session', result.data.token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        // Store token in accessible cookie (for client-side code on web app)
        cookieStore.set('access_token', result.data.token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        // Store user info for later use
        cookieStore.set('zap_user', JSON.stringify({
            merchant_id: result.data.merchant_id,
            email: result.data.email,
            name: result.data.name,
            logo_url: result.data.logo_url,
        }), {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });

        // Return user data so client can store in localStorage
        return {
            success: true,
            data: {
                token: result.data.token,
                merchant_id: result.data.merchant_id,
                email: result.data.email,
                name: result.data.name,
                logo_url: result.data.logo_url,
            },
        };
    } catch (error) {
        console.error('[Auth] API error during login:', error);
        return { error: 'network_error' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('zap_session');
}

export async function getSession() {
    if (!prisma) return null; // Prisma unavailable (Turbopack engine resolution)

    const cookieStore = await cookies();
    const token = cookieStore.get('zap_session')?.value;
    if (!token) return null;

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
    if (!prisma) return [];
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
    if (!prisma) return [];
    return await prisma.systemLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });
}

export async function getPortalMetricsAction() {
    if (!prisma) {
        return {
            totalUsers: 0,
            totalLogs: 0,
            posLogs: 0,
            revenue: 12450.00
        };
    }
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

// ─── Utility: Get Auth Token ────────────────────────────────────────────
export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('zap_session')?.value || null;
}

// ─── Utility: API Call with Auth Header ────────────────────────────────
export async function apiCallWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = await getAuthToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api';

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}

export async function getProductsAction() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
}
