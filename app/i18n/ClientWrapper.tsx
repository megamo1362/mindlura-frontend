'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from './LangContext';
import { useTheme } from './ThemeContext';

// The dashboard/admin/login UI has its own language toggle (LangContext),
// independent of the public marketing site's per-URL locale (/ vs /fa).
const PRIVATE_PREFIXES = ['/dashboard', '/admin', '/login', '/forgot-password', '/reset-password'];

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { lang, isRTL } = useLang();
  const { theme } = useTheme();
  const pathname = usePathname();
  const isPrivateArea = PRIVATE_PREFIXES.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (!isPrivateArea) return;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [lang, isRTL, isPrivateArea]);

  // Public pages get their initial lang/dir from the server (root layout,
  // based on pathname) so there's no flash on first load. But / and /fa share
  // that same root layout, so a client-side transition between them (e.g. the
  // EN/FA toggle link) never re-runs the server logic — <html> would keep
  // showing the old lang/dir even though the page content did switch. Mirror
  // that pathname-derived value here so it re-syncs on every route change.
  const isFaPath = pathname === '/fa' || (pathname?.startsWith('/fa/') ?? false);

  useEffect(() => {
    if (isPrivateArea) return;
    document.documentElement.setAttribute('lang', isFaPath ? 'fa' : 'en');
    document.documentElement.setAttribute('dir', isFaPath ? 'rtl' : 'ltr');
  }, [isFaPath, isPrivateArea]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
