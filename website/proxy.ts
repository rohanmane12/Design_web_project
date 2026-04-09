import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'hi', 'mr'] as const;
const adminRoles = new Set(['admin', 'super-admin']);

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  const isLocalizedAdminRoute =
    locales.includes(locale as (typeof locales)[number]) && segments[1] === 'admin';

  if (isLocalizedAdminRoute) {
    const adminSubpath = segments.slice(2).join('/');
    const isPublicAdminRoute = adminSubpath === 'login' || adminSubpath === 'signup';

    if (!isPublicAdminRoute) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token?.email || !adminRoles.has(String(token.role))) {
        return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
