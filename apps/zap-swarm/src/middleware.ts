import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════════
// ZAP Swarm Middleware Pipeline — Phase 2
// ═══════════════════════════════════════════════════════════
// Layer 1: Route Classification (static / API / page)
// Layer 2: CORS Enforcement
// Layer 3: Rate Limiting (in-memory sliding window)
// Layer 4: Session Validation (cookie decode + user lookup)
// Layer 5: Tenant Injection (X-ZAP-Tenant header)
// Layer 6: ZSS Request Fingerprinting
// ═══════════════════════════════════════════════════════════

// ── Rate Limiter (in-memory sliding window) ──────────────
// Production: swap for Redis INCR + EXPIRE
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 120; // per IP per window
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now > entry.resetAt) {
        // New window
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

// Periodic cleanup to prevent memory leak on long-running process
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, val] of rateLimitStore) {
            if (now > val.resetAt) rateLimitStore.delete(key);
        }
    }, RATE_LIMIT_WINDOW_MS * 2);
}

// ── CORS Allowed Origins ─────────────────────────────────
const ALLOWED_ORIGINS = new Set([
    'http://localhost:3000',  // zap-design
    'http://localhost:3500',  // zap-swarm (self)
    'http://localhost:3900',  // zap-claw
    'http://localhost:4700',  // zap-auth
]);

// ── Known Bypass Session IDs (dev/test only) ─────────────
const DEV_BYPASS_SESSIONS = new Set([
    'mock-user-id-bypass',
]);

// ── Tenant Resolution ────────────────────────────────────
// Maps session user IDs or cookie values to tenant contexts.
// In production this would be a DB lookup; here we default to ZVN.
function resolveTenantFromSession(sessionValue: string): string {
    if (sessionValue === 'mock-user-id-bypass') return 'ZVN';
    // Future: decode JWT or lookup user → tenant mapping
    // For now, all authenticated users default to ZVN
    return 'ZVN';
}

// ── ZSS Request Fingerprinting ───────────────────────────
// Detects anomalous request patterns at the edge
function isZSSBlocked(request: NextRequest): { blocked: boolean; reason?: string } {
    const ua = request.headers.get('user-agent') || '';
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);

    // Block requests with no user-agent (automated scanners)
    if (!ua && !request.nextUrl.pathname.startsWith('/api')) {
        return { blocked: true, reason: 'MISSING_USER_AGENT' };
    }

    // Block absurdly large payloads at the edge (>5MB)
    if (contentLength > 5_242_880) {
        return { blocked: true, reason: 'PAYLOAD_TOO_LARGE' };
    }

    return { blocked: false };
}

// ═══════════════════════════════════════════════════════════
// Main Middleware Pipeline
// ═══════════════════════════════════════════════════════════
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Layer 1: Static / Internal Bypass ────────────────
    if (
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/__nextjs')
    ) {
        return NextResponse.next();
    }

    // ── Layer 2: CORS Headers for API Routes ─────────────
    const origin = request.headers.get('origin');
    const response = NextResponse.next();

    if (pathname.startsWith('/api')) {
        // Handle preflight
        if (request.method === 'OPTIONS') {
            const preflightResponse = new NextResponse(null, { status: 204 });
            if (origin && ALLOWED_ORIGINS.has(origin)) {
                preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
            }
            preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-ZAP-Tenant');
            preflightResponse.headers.set('Access-Control-Max-Age', '86400');
            return preflightResponse;
        }

        if (origin && ALLOWED_ORIGINS.has(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        }
    }

    // ── Layer 3: Rate Limiting (all routes) ──────────────
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || '127.0.0.1';

    const rateCheck = checkRateLimit(clientIP);
    response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateCheck.resetAt / 1000)));

    if (!rateCheck.allowed) {
        return NextResponse.json(
            { error: 'Rate limit exceeded. Try again shortly.', retryAfterMs: rateCheck.resetAt - Date.now() },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
                    'X-RateLimit-Remaining': '0',
                }
            }
        );
    }

    // ── Layer 4: ZSS Edge Fingerprinting ─────────────────
    const zssCheck = isZSSBlocked(request);
    if (zssCheck.blocked) {
        return NextResponse.json(
            { error: 'Request blocked by ZSS security layer.', reason: zssCheck.reason },
            { status: 403 }
        );
    }

    // ── Layer 5: Session Validation ──────────────────────
    // API routes pass through (they handle their own auth or are public telemetry)
    if (pathname.startsWith('/api')) {
        // Inject tenant context header for downstream API routes
        const session = request.cookies.get('zap_session');
        if (session?.value) {
            const tenantId = resolveTenantFromSession(session.value);
            response.headers.set('X-ZAP-Tenant', tenantId);
            response.headers.set('X-ZAP-Session', session.value);
        } else {
            // Default tenant for unauthenticated API calls (telemetry, health)
            response.headers.set('X-ZAP-Tenant', 'ZVN');
        }
        return response;
    }

    // Page routes require authentication
    const session = request.cookies.get('zap_session');

    if (!session?.value) {
        // No session → redirect to Auth portal
        const loginUrl = new URL('http://localhost:4700');
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Validate session value isn't empty/malformed
    if (session.value.length < 4) {
        // Suspicious short session — clear and redirect
        const redirectResponse = NextResponse.redirect(new URL('http://localhost:4700'));
        redirectResponse.cookies.delete('zap_session');
        return redirectResponse;
    }

    // ── Layer 6: Tenant Injection for Pages ──────────────
    const tenantId = resolveTenantFromSession(session.value);
    response.headers.set('X-ZAP-Tenant', tenantId);
    response.headers.set('X-ZAP-Session', session.value);

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
