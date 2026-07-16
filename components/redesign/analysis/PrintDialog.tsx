'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/redesign/ui/Button';
import { useLang } from '@/app/i18n/LangContext';
import type { AnalysisTabKey } from '@/hooks/use-analysis-page';

interface PrintDialogProps {
  open: boolean;
  tabs: { key: AnalysisTabKey; label: string }[];
  selected: Set<AnalysisTabKey>;
  onToggle: (key: AnalysisTabKey) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PrintDialog({ open, tabs, selected, onToggle, onCancel, onConfirm }: PrintDialogProps) {
  const { lang } = useLang();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:hidden">
      <div className="w-full max-w-sm space-y-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
        <h2 className="text-base font-bold text-[var(--text-primary)]">
          {lang === 'fa' ? 'انتخاب بخش‌های PDF' : 'Select PDF Sections'}
        </h2>
        <div className="space-y-3">
          {tabs.map((tab) => (
            <label key={tab.key} className="group flex cursor-pointer select-none items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(tab.key)}
                onChange={() => onToggle(tab.key)}
                className="h-4 w-4 cursor-pointer rounded accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                {tab.label}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onCancel}>
            {lang === 'fa' ? 'انصراف' : 'Cancel'}
          </Button>
          <Button variant="primary" size="sm" className="flex-1" onClick={onConfirm} disabled={selected.size === 0}>
            <Printer className="h-3.5 w-3.5" />
            {lang === 'fa' ? 'دریافت PDF' : 'Print PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}
