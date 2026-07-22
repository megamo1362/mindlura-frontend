'use client';

import { Moon, Sun, Globe } from 'lucide-react';
import { useLang } from '@/app/i18n/LangContext';
import { useTheme, type RedesignTheme } from '@/components/redesign/theme/RedesignThemeProvider';
import type { Lang } from '@/app/i18n/translations';
import CalendarAlertsSection from './CalendarAlertsSection';

function OptionButton<T extends string>({
  value,
  current,
  onChange,
  icon,
  label,
}: {
  value: T;
  current: T;
  onChange: (v: T) => void;
  icon?: React.ReactNode;
  label: string;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-sm)] border transition-all text-sm font-medium ${
        active
          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
      }`}
    >
      {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {active && (
        <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)]" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t.settings_title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t.settings_desc}</p>
      </div>

      {/* Appearance */}
      <section className="rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            {t.settings_appearance_section}
          </h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] -mt-2">{t.settings_theme_label}</p>
        <div className="grid grid-cols-2 gap-3">
          <OptionButton<RedesignTheme>
            value="dark"
            current={theme}
            onChange={setTheme}
            icon={<Moon className="w-4 h-4" />}
            label={t.settings_theme_dark}
          />
          <OptionButton<RedesignTheme>
            value="light"
            current={theme}
            onChange={setTheme}
            icon={<Sun className="w-4 h-4" />}
            label={t.settings_theme_light}
          />
        </div>
      </section>

      {/* Language */}
      <section className="rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            {t.settings_language_section}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <OptionButton<Lang>
            value="en"
            current={lang}
            onChange={setLang}
            label={t.settings_lang_en}
          />
          <OptionButton<Lang>
            value="fa"
            current={lang}
            onChange={setLang}
            label={t.settings_lang_fa}
          />
        </div>
      </section>

      <CalendarAlertsSection />
    </div>
  );
}
