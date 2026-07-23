'use client';

import { useLang } from '@/app/i18n/LangContext';
import CalendarAlertsSection from './CalendarAlertsSection';

export default function SettingsPage() {
  const { t } = useLang();

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t.settings_title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{t.settings_desc}</p>
      </div>

      <CalendarAlertsSection />
    </div>
  );
}
