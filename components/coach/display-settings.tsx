'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { DisplayMode } from '@/types';

interface DisplaySettingsProps {
  mode: DisplayMode;
  label: string;
  onModeChange: (m: DisplayMode) => void;
  onLabelChange: (l: string) => void;
}

export function DisplaySettings({ mode, label, onModeChange, onLabelChange }: DisplaySettingsProps) {
  const { t } = useLang();
  const needsLabel = mode === 'name' || mode === 'both';

  const OPTIONS: { value: DisplayMode; label: string }[] = [
    { value: 'name', label: t.display_mode_name },
    { value: 'email', label: t.display_mode_email },
    { value: 'both', label: t.display_mode_both },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-muted)]">{t.display_hint}</p>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onModeChange(opt.value)}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-medium border transition-all text-center',
              mode === opt.value
                ? 'bg-[var(--color-cyan-dim)] border-[var(--color-cyan-glow)] text-[var(--color-cyan)]'
                : 'bg-[var(--color-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-cyan)]/20',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {needsLabel && (
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-muted)]">
            {t.display_name_label} <span className="text-[var(--color-status-error)]">*</span>
          </label>
          <Input
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder={t.display_name_placeholder}
          />
        </div>
      )}
    </div>
  );
}
