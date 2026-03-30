/*
 * ZAP DESIGN ENGINE - PERIMETER MIDDLEWARE
 * Blocks access to /lab/ routes in production.
 * Enforces ZAP Session presence for all /design/ administrative routes.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Experimental Lab Perimeter
  if (pathname.startsWith('/lab')) {
    if (process.env.NEXT_PUBLIC_ENABLE_LAB !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Design Engine Administrative Perimeter
  if (pathname.startsWith('/design')) {
    // Exempt Sign-In Previews from Session Lock
    if (pathname.includes('/signin')) {
      return NextResponse.next();
    }

    // Dev Bypass: Allow local UI testing without active auth bounds
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    const session = request.cookies.get('zap_session');
    if (!session) {
      // Unauthorized intrusion detected, route back to Root Login Gate.
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/lab/:path*', '/design/:path*'],
};
