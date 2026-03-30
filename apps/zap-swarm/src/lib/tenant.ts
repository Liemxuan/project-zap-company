import { headers } from 'next/headers';

/**
 * Extracts tenant context from the middleware-injected headers.
 * This is the canonical way for API routes to resolve tenant identity
 * without duplicating query-param parsing in every route.
 *
 * Usage:
 *   const { tenantId, sessionId } = await getTenantContext();
 */
export async function getTenantContext(): Promise<{ tenantId: string; sessionId: string | null }> {
    const headerStore = await headers();
    const tenantId = headerStore.get('x-zap-tenant') || 'ZVN';
    const sessionId = headerStore.get('x-zap-session') || null;
    return { tenantId, sessionId };
}

/**
 * Extracts client IP from the middleware-forwarded headers.
 */
export async function getClientIP(): Promise<string> {
    const headerStore = await headers();
    return headerStore.get('x-forwarded-for')?.split(',')[0]?.trim()
        || headerStore.get('x-real-ip')
        || '127.0.0.1';
}
