'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from './LangContext';
import { useTheme } from './ThemeContext';

// This lang/dir sync is only relevant to the dashboard/admin/login UI, which
// has its own language toggle (LangContext) independent of the public
// marketing site's per-URL locale (/ vs /fa). Public pages set lang/dir via
// the server-rendered <html> tag in app/layout.tsx based on the URL, and
// must not have that overwritten by LangContext's default ('en').
const PRIVATE_PREFIXES = ['/dashboard', '/admin', '/login'];

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
