'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './RedesignThemeProvider';
import { useLang } from '@/app/i18n/LangContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { lang } = useLang();
  const label = lang === 'fa' ? (theme === 'dark' ? 'حالت روشن' : 'حالت تیره') : theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-150 ${theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-150 ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      />
    </button>
  );
}
