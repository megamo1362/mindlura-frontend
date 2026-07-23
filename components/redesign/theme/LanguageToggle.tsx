'use client';

import { Globe } from 'lucide-react';
import { useLang } from '@/app/i18n/LangContext';

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const label = lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی';

  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
      aria-label={label}
      title={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
    >
      <Globe className="h-[18px] w-[18px]" />
    </button>
  );
}
