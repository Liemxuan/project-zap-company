import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ZAP Swarm Auth Gate
 * ─────────────────────────────────────────────────────────────
 * Redirects unauthenticated users to the ZAP Auth portal (:4700).
 * After login, the callbackUrl parameter bounces them back to Swarm.
 *
 * This is a redirect-based gate, NOT full SSO. Cross-port JWT
 * federation is a separate infrastructure project. This gate
 * ensures Swarm telemetry, OmniRouter, and fleet config aren't
 * exposed to anyone on the network.
 */
export function middleware(request: NextRequest) {
    const session = request.cookies.get('zap_session');

    // Allow API routes, static assets, and Next.js internals through
    if (
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // No session → redirect to Auth portal
    if (!session) {
        const loginUrl = new URL('http://localhost:4700');
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|favicon).*)'],
};
