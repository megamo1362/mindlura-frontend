import { NextRequest, NextResponse } from 'next/server';
import { resolveCountry } from '@/lib/geo';

const LOCALE_COOKIE = 'mindlura_locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const isFaPath = pathname === '/fa' || pathname.startsWith('/fa/');

  // Root path: decide whether to redirect to /fa based on cookie preference,
  // falling back to geo (Iranian IPs) when no preference has been recorded yet.
  if (pathname === '/') {
    if (cookieLocale === 'fa') {
      const url = request.nextUrl.clone();
      url.pathname = '/fa';
      return NextResponse.redirect(url, 302);
    }

    if (!cookieLocale) {
      const country = resolveCountry((name) => request.headers.get(name));
      if (country === 'IR') {
        const url = request.nextUrl.clone();
        url.pathname = '/fa';
        const redirectResponse = NextResponse.redirect(url, 302);
        redirectResponse.cookies.set(LOCALE_COOKIE, 'fa', { maxAge: COOKIE_MAX_AGE, path: '/' });
        return redirectResponse;
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Persist whichever locale the visitor is actually looking at, so a manual
  // visit to / or /fa overrides a previous geo-based redirect next time.
  if (pathname === '/' && !cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, 'en', { maxAge: COOKIE_MAX_AGE, path: '/' });
  } else if (isFaPath) {
    response.cookies.set(LOCALE_COOKIE, 'fa', { maxAge: COOKIE_MAX_AGE, path: '/' });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|dashboard|admin|login|.*\\..*).*)'],
};
