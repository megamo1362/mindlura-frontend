'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLang } from '@/app/i18n/LangContext';
import { apiFetch } from '@/lib/api';
import {
  useCalendarAlertSettings,
  useUpdateCalendarAlertSettings,
  type CalendarAlertSettings,
} from '@/hooks/use-calendar-alerts';
import type { ProfileResponse } from '@/types';

const MINUTES_OPTIONS = [5, 10, 15, 30];
const IMPACT_LEVELS: { value: string; dot: string }[] = [
  { value: 'High', dot: '🔴' },
  { value: 'Medium', dot: '🟡' },
  { value: 'Low', dot: '⚪' },
];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'NZD'];

const IMPACT_LABEL_KEY: Record<string, 'settings_calendar_impact_high' | 'settings_calendar_impact_medium' | 'settings_calendar_impact_low'> = {
  High: 'settings_calendar_impact_high',
  Medium: 'settings_calendar_impact_medium',
  Low: 'settings_calendar_impact_low',
};

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
        active
          ? 'border-[var(--color-cyan)] bg-[var(--color-cyan-dim)] text-[var(--color-cyan)]'
          : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function CalendarAlertsSection() {
  const { t } = useLang();
  const { data, isLoading } = useCalendarAlertSettings();
  const updateSettings = useUpdateCalendarAlertSettings();

  const [form, setForm] = useState<CalendarAlertSettings>({
    enabled: true,
    minutes_before: 15,
    impact_filter: ['High'],
    currency_filter: [],
    notify_result: true,
  });
  const [telegramVerified, setTelegramVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  useEffect(() => {
    apiFetch<ProfileResponse>('/profile/me')
      .then((p) => setTelegramVerified(p.is_telegram_verified))
      .catch(() => setTelegramVerified(false));
  }, []);

  const toggleImpact = (level: string) => {
    setForm((f) => ({
      ...f,
      impact_filter: f.impact_filter.includes(level)
        ? f.impact_filter.filter((l) => l !== level)
        : [...f.impact_filter, level],
    }));
  };

  const toggleCurrency = (code: string) => {
    setForm((f) => ({
      ...f,
      currency_filter: f.currency_filter.includes(code)
        ? f.currency_filter.filter((c) => c !== code)
        : [...f.currency_filter, code],
    }));
  };

  if (isLoading) return null;

  return (
    <section className="glass rounded-2xl p-5 border border-[var(--color-border)] space-y-5">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-[var(--color-cyan)]" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
          {t.settings_calendar_section}
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-text-secondary)]">{t.settings_calendar_enabled}</span>
        <Switch
          checked={form.enabled}
          onCheckedChange={(enabled) => setForm((f) => ({ ...f, enabled }))}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">{t.settings_calendar_minutes_before}</p>
        <Select
          value={String(form.minutes_before)}
          onValueChange={(v) => setForm((f) => ({ ...f, minutes_before: Number(v) }))}
        >
          <SelectTrigger className="max-w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MINUTES_OPTIONS.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {t.settings_calendar_minutes_option(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">{t.settings_calendar_impact_filter}</p>
        <div className="flex flex-wrap gap-2">
          {IMPACT_LEVELS.map((level) => (
            <ToggleChip key={level.value} active={form.impact_filter.includes(level.value)} onClick={() => toggleImpact(level.value)}>
              {level.dot} {t[IMPACT_LABEL_KEY[level.value]]}
            </ToggleChip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-text-muted)]">{t.settings_calendar_currency_filter}</p>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((code) => (
            <ToggleChip key={code} active={form.currency_filter.includes(code)} onClick={() => toggleCurrency(code)}>
              {code}
            </ToggleChip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-text-secondary)]">{t.settings_calendar_notify_result}</span>
        <Switch
          checked={form.notify_result}
          onCheckedChange={(notify_result) => setForm((f) => ({ ...f, notify_result }))}
        />
      </div>

      <div className="flex items-center gap-2 text-xs pt-1 border-t border-[var(--color-border)]">
        {telegramVerified ? (
          <span className="flex items-center gap-1.5 text-[var(--color-success)] pt-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.settings_calendar_telegram_active}
          </span>
        ) : (
          <Link href="/dashboard/profile" className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-cyan)] pt-3">
            {t.settings_calendar_telegram_inactive}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <Button
        onClick={() => updateSettings.mutate(form)}
        loading={updateSettings.isPending}
        className="w-full"
      >
        {t.settings_calendar_save}
      </Button>
    </section>
  );
}
