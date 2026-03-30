import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('zap_session');

  // If there's no session, immediately bump them to the Auth micro-frontend
  if (!session) {
    const loginUrl = new URL('http://localhost:4700/auth/metro/user-management');
    // Keep a record of where they tried to go so Auth can redirect them back (optional based on architecture)
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists, allow request to proceed to the Merchant Workspace
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
