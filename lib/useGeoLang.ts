'use client';

import { useCallback, useEffect, useState } from 'react';

export type Lang = 'en' | 'fa';

const LANG_KEY = 'mindlura_lang';
const COUNTRY_KEY = 'mindlura_country';

export function useGeoLang(initialLang?: Lang, initialCountry?: string | null) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? 'en');
  const [country, setCountry] = useState<string | null>(initialCountry ?? null);
  const [resolved, setResolved] = useState(initialLang !== undefined);

  useEffect(() => {
    // Server already resolved the language for this request (e.g. the landing
    // page passes it in from getServerGeoLang()) — skip the localStorage/fetch
    // detection so a stale cached value can't override a fresh, correct read.
    if (initialLang !== undefined) {
      localStorage.setItem(LANG_KEY, initialLang);
      if (initialCountry) localStorage.setItem(COUNTRY_KEY, initialCountry);
      return;
    }

    const storedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    setCountry(localStorage.getItem(COUNTRY_KEY));

    if (storedLang === 'en' || storedLang === 'fa') {
      setLangState(storedLang);
      setResolved(true);
      return;
    }

    let cancelled = false;

    fetch('/api/geo')
      .then((res) => res.json())
      .then((data: { country: string; isIran: boolean }) => {
        if (cancelled) return;
        const detected: Lang = data.isIran ? 'fa' : 'en';
        setLangState(detected);
        setCountry(data.country);
        localStorage.setItem(LANG_KEY, detected);
        localStorage.setItem(COUNTRY_KEY, data.country);
      })
      .catch(() => {
        if (cancelled) return;
        setLangState('en');
        localStorage.setItem(LANG_KEY, 'en');
      })
      .finally(() => {
        if (!cancelled) setResolved(true);
      });

    return () => {
      cancelled = true;
    };
    // initialLang/initialCountry are only meant to seed the first render (server-resolved value) — intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }, []);

  return { lang, setLang, country, resolved };
}
