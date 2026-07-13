const LOCALE_COOKIE = 'mindlura_locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Given the current pathname, returns the equivalent URL in the other language. */
export function getCounterpartPath(pathname: string): string {
  if (pathname === '/fa' || pathname.startsWith('/fa/')) {
    const rest = pathname.slice(3);
    return rest === '' ? '/' : rest;
  }
  return pathname === '/' ? '/fa' : `/fa${pathname}`;
}

/** Persists the visitor's explicit language choice so future visits to / honor it. */
export function setLocaleCookie(lang: 'en' | 'fa') {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=${COOKIE_MAX_AGE}`;
}
