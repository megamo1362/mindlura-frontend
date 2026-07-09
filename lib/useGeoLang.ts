'use client';

import { useCallback, useEffect, useState } from 'react';

export type Lang = 'en' | 'fa';

const LANG_KEY = 'mindlura_lang';
const COUNTRY_KEY = 'mindlura_country';

export function useGeoLang() {
  const [lang, setLangState] = useState<Lang>('en');
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const storedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    setCountry(localStorage.getItem(COUNTRY_KEY));

    if (storedLang === 'en' || storedLang === 'fa') {
      setLangState(storedLang);
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
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }, []);

  return { lang, setLang, country };
}
