import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes
  if (pathname.startsWith('/en/admin') || pathname.startsWith('/hi/admin') || pathname.startsWith('/mr/admin')) {
    // Allow access to login page without authentication
    if (pathname.endsWith('/admin/login')) {
      // If already logged in, redirect to dashboard
      if (session) {
        const locale = pathname.split('/')[1];
        return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!session) {
      const locale = pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
