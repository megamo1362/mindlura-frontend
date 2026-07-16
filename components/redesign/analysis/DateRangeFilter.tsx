'use client';

import { CalendarRange } from 'lucide-react';
import { Button } from '@/components/redesign/ui/Button';
import { PRESET_LABELS, type DatePreset } from '@/hooks/use-analysis-page';
import { useLang } from '@/app/i18n/LangContext';

interface DateRangeFilterProps {
  datePreset: DatePreset;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (v: string) => void;
  onCustomToChange: (v: string) => void;
  onPresetChange: (preset: DatePreset) => void;
  onCustomApply: () => void;
  filterLoading: boolean;
  matchedTradeCount: number;
}

/**
 * A single filter control (not a second tab row) — deliberately a dropdown
 * rather than the live page's row of pill buttons, which visually competed
 * with the page's main navigation. See analysis-page.tsx for the original.
 */
export function DateRangeFilter({
  datePreset,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onPresetChange,
  onCustomApply,
  filterLoading,
  matchedTradeCount,
}: DateRangeFilterProps) {
  const { lang } = useLang();
  const l = lang === 'fa' ? 'fa' : 'en';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CalendarRange className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
      <select
        value={datePreset}
        onChange={(e) => onPresetChange(e.target.value as DatePreset)}
        className="h-8 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
      >
        {(Object.keys(PRESET_LABELS) as DatePreset[]).map((preset) => (
          <option key={preset} value={preset}>
            {PRESET_LABELS[preset][l]}
          </option>
        ))}
      </select>

      {datePreset === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="h-8 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
          <span className="text-xs text-[var(--text-muted)]">—</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="h-8 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
          <Button variant="primary" size="sm" onClick={onCustomApply} disabled={!customFrom || !customTo || filterLoading}>
            {l === 'fa' ? 'اعمال' : 'Apply'}
          </Button>
        </div>
      )}

      {filterLoading && (
        <span className="animate-pulse text-xs text-[var(--text-muted)]">
          {lang === 'fa' ? 'در حال محاسبه...' : 'Recalculating...'}
        </span>
      )}
      {datePreset !== 'all' && !filterLoading && (
        <span className="rd-tabular text-xs font-semibold text-[var(--accent)]">
          {matchedTradeCount} {lang === 'fa' ? 'معامله' : 'trades'}
        </span>
      )}
    </div>
  );
}
