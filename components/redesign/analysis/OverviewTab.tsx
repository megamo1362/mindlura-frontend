'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ScoreRing } from '@/components/redesign/ui/ScoreRing';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { AIPsychologyCard } from '@/components/analysis/ai-psychology';
import { useLang } from '@/app/i18n/LangContext';
import type { Analysis, AnalysisWarning } from '@/types';

const WARNING_ICON = { danger: AlertTriangle, warning: AlertCircle, info: Info } as const;
const WARNING_BADGE: Record<string, 'loss' | 'warning' | 'accent'> = {
  danger: 'loss',
  warning: 'warning',
  info: 'accent',
};

const SEVERITY_BADGE: Record<string, 'loss' | 'warning' | 'neutral'> = {
  high: 'loss',
  medium: 'warning',
  low: 'neutral',
};

const SUB_SCORE_LABELS: Record<string, { en: string; fa: string }> = {
  revenge_control: { en: 'Revenge Control', fa: 'کنترل انتقام' },
  emotional_stability: { en: 'Emotional Stability', fa: 'ثبات احساسی' },
  fear_control: { en: 'Fear Control', fa: 'کنترل ترس' },
  risk_management: { en: 'Risk Management', fa: 'مدیریت ریسک' },
  discipline: { en: 'Discipline', fa: 'نظم معاملاتی' },
  consistency: { en: 'Consistency', fa: 'ثبات عملکرد' },
};

// Mirrors the bilingual-literal pattern already used across this codebase
// (e.g. PRESET_LABELS in hooks/use-analysis-page.ts) for labels that don't
// yet have a translations.ts key — components/analysis/summary-stats.tsx
// hardcodes these same two labels in English only; this fixes that gap for
// the redesign hero row without touching the live component's i18n debt.
const HERO_LABELS = {
  win_rate: { en: 'Win Rate', fa: 'نرخ برد' },
  max_drawdown: { en: 'Max Drawdown', fa: 'حداکثر افت سرمایه' },
} as const;

function scoreBarClass(score: number): string {
  if (score < 40) return 'bg-[var(--loss)]';
  if (score < 70) return 'bg-[var(--warning)]';
  return 'bg-[var(--profit)]';
}

interface OverviewTabProps {
  analysis: Analysis;
  warnings: AnalysisWarning[];
  accountId: string;
  isCoachMode: boolean;
  aiFromDate?: string;
  aiToDate?: string;
}

export function OverviewTab({ analysis, warnings, accountId, isCoachMode, aiFromDate, aiToDate }: OverviewTabProps) {
  const { t, lang } = useLang();
  const l = lang === 'fa' ? 'fa' : 'en';
  const summary = analysis.summary;
  const psych = analysis.psychology_score;

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {psych && (
          <div className="flex flex-shrink-0 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-5 lg:w-[220px]">
            <ScoreRing score={psych.overall} label={psych.grade[l]} size={128} />
          </div>
        )}
        {summary && (
          <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label={t.stat_total_profit}
              value={`${summary.total_profit >= 0 ? '+' : '-'}$${Math.abs(summary.total_profit).toFixed(2)}`}
              trend={summary.total_profit >= 0 ? 'up' : 'down'}
              trendPositive={summary.total_profit >= 0}
            />
            <StatCard label={HERO_LABELS.win_rate[l]} value={`${summary.winrate}%`} subValue={`${summary.wins}/${summary.total_trades}`} />
            <StatCard label={t.stat_total_trades} value={summary.total_trades} />
            <StatCard
              label={HERO_LABELS.max_drawdown[l]}
              value={`${summary.max_drawdown_pct.toFixed(2)}%`}
              trend="down"
              trendPositive={false}
            />
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings?.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => {
            const Icon = WARNING_ICON[w.level as keyof typeof WARNING_ICON] ?? Info;
            const warnFn = t.warnings[w.type as keyof typeof t.warnings];
            const num = w.message.match(/[\d.]+/)?.[0] ?? '';
            const text = warnFn ? warnFn(num) : w.message;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3"
              >
                <Badge variant={WARNING_BADGE[w.level] ?? 'accent'} icon={<Icon className="h-3 w-3" />}>
                  {w.level}
                </Badge>
                <p className="flex-1 text-sm text-[var(--text-secondary)]">{text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Psychology detail */}
      {psych && (
        <Card title={lang === 'fa' ? 'جزئیات امتیاز روان‌شناسی' : 'Psychology Breakdown'}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {Object.entries(psych.scores).map(([key, score]) => {
              const label = SUB_SCORE_LABELS[key]?.[l] ?? key;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[var(--text-secondary)]">{label}</span>
                    <span className="rd-tabular text-xs font-semibold text-[var(--text-primary)]">{score}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
                    <div className={`h-full rounded-full ${scoreBarClass(score)}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {psych.insights.length > 0 && (
            <div className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4">
              {psych.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Badge variant={SEVERITY_BADGE[insight.severity] ?? 'neutral'}>{insight.severity}</Badge>
                  <p className="flex-1 text-sm text-[var(--text-secondary)]">{insight.message[l]}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* AI Psychology — self-contained component with its own surface; reused
          as-is (business logic + its own card chrome), not re-wrapped, to
          avoid nesting a card inside a card. */}
      {analysis.has_data && !isCoachMode && (
        <AIPsychologyCard accountId={accountId} fromDate={aiFromDate} toDate={aiToDate} />
      )}
    </div>
  );
}
