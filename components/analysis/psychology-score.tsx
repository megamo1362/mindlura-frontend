'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/app/i18n/LangContext';

// ── Types ────────────────────────────────────────────────────
interface PsychologyInsight {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: { en: string; fa: string };
}

interface PsychologySignal {
  signal: string;
  rate: number;
  points_applied: number;
  points: number;
  count: number;
  label: { en: string; fa: string };
}

interface PsychologyScoreData {
  overall: number;
  grade: { en: string; fa: string };
  scores: Record<string, number>;
  deductions?: PsychologySignal[];
  positive_signals?: PsychologySignal[];
  insights: PsychologyInsight[];
  weights?: Record<string, number>;
  confidence?: number;
  outcome_multiplier?: number;
}

interface PsychologyScoreProps {
  data: PsychologyScoreData;
}

// ── Constants ────────────────────────────────────────────────
// Short bar labels for the 9 Layer-1 signals (positive + negative).
// The backend `label` field is a full sentence — this map gives the
// compact name shown next to each progress bar.
const SIGNAL_LABELS: Record<string, { en: string; fa: string }> = {
  sl_discipline:       { en: 'SL Discipline',        fa: 'رعایت حد ضرر' },
  rr_positive:         { en: 'Risk/Reward',           fa: 'نسبت ریسک/ریوارد' },
  size_consistency:    { en: 'Size Consistency',      fa: 'ثبات حجم' },
  plan_adherence:      { en: 'Plan Adherence',        fa: 'پایبندی به برنامه' },
  revenge_trading:     { en: 'Revenge Trading',       fa: 'معامله انتقامی' },
  overtrading:         { en: 'Overtrading',           fa: 'بیش‌معاملاتی' },
  position_escalation: { en: 'Position Escalation',   fa: 'افزایش حجم بعد ضرر' },
  off_session:         { en: 'Off-Session Trading',   fa: 'معامله خارج سشن' },
  holding_losers:      { en: 'Holding Losers',        fa: 'نگه داشتن ضررده' },
};

const SEVERITY_STYLE = {
  high:   {
    dot:  'bg-red-500',
    text: 'text-red-300',
    wrap: 'border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)]',
  },
  medium: {
    dot:  'bg-orange-500',
    text: 'text-orange-300',
    wrap: 'border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.06)]',
  },
  low:    {
    dot:  'bg-yellow-400',
    text: 'text-yellow-200',
    wrap: 'border-[rgba(234,179,8,0.25)] bg-[rgba(234,179,8,0.06)]',
  },
} as const;

// ── Color helpers ─────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-blue-400';
  if (score >= 55) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function scoreStroke(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#3b82f6';
  if (score >= 55) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function formatPoints(value: number, tone: 'positive' | 'negative'): string {
  return tone === 'positive' ? `+${value.toFixed(1)}` : `−${Math.abs(value).toFixed(1)}`;
}

// ── Circular Progress ─────────────────────────────────────────
function CircleScore({ overall, grade }: { overall: number; grade: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;
  const stroke = scoreStroke(overall);
  const color = scoreColor(overall);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black leading-none ${color}`}>{overall}</span>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">/100</span>
        </div>
      </div>
      <span className={`text-sm font-bold ${color}`}>{grade}</span>
    </div>
  );
}

// ── Signal Row (positive or negative) ───────────────────────────
function SignalRow({ signal, label, rate, points, tone, delay }: {
  signal: string;
  label: string;
  rate: number;
  points: number;
  tone: 'positive' | 'negative';
  delay: number;
}) {
  const isPositive = tone === 'positive';
  const textColor = isPositive ? 'text-emerald-400' : 'text-red-400';
  const barColor = isPositive ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <motion.div
      key={signal}
      className="space-y-1.5"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        <span className={`text-xs font-bold tabular-nums ${textColor}`}>{formatPoints(points, tone)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(rate * 100)}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function PsychologyScore({ data }: PsychologyScoreProps) {
  const { lang } = useLang();
  const l = (lang === 'fa' ? 'fa' : 'en') as 'en' | 'fa';

  const positiveSignals = data.positive_signals ?? [];
  const negativeSignals = data.deductions ?? [];
  const hasConfidence = data.confidence != null && data.outcome_multiplier != null;

  return (
    <motion.div
      className="card-surface rounded-2xl p-5 space-y-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-[var(--color-purple)]/60" />
        <h3 className="font-bold text-[var(--color-text-primary)] text-sm">
          {l === 'fa' ? 'امتیاز روان‌شناسی معاملاتی' : 'Trading Psychology Score'}
        </h3>
      </div>

      {/* Score circle */}
      <div className="flex flex-col items-center gap-2">
        <CircleScore overall={data.overall} grade={data.grade[l]} />
        {hasConfidence && (
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            <span>
              {l === 'fa'
                ? `اطمینان: ${Math.round((data.confidence as number) * 100)}٪`
                : `Confidence: ${Math.round((data.confidence as number) * 100)}%`}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]/50" />
            <span>
              {l === 'fa'
                ? `ضریب نتیجه: ×${(data.outcome_multiplier as number).toFixed(1)}`
                : `Outcome: ×${(data.outcome_multiplier as number).toFixed(1)}`}
            </span>
          </div>
        )}
      </div>

      {/* Positive signals */}
      {positiveSignals.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="h-px bg-[var(--color-border)]" />
          <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-1">
            {l === 'fa' ? 'سیگنال‌های مثبت' : 'Positive Signals'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {positiveSignals.map((s, i) => {
              const labels = SIGNAL_LABELS[s.signal];
              const label = labels ? labels[l] : s.label[l];
              return (
                <SignalRow
                  key={s.signal}
                  signal={s.signal}
                  label={label}
                  rate={s.rate}
                  points={s.points_applied}
                  tone="positive"
                  delay={0.1 + i * 0.06}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Negative signals */}
      {negativeSignals.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="h-px bg-[var(--color-border)]" />
          <p className="text-[10px] font-semibold text-red-400/80 uppercase tracking-wider px-1">
            {l === 'fa' ? 'سیگنال‌های منفی' : 'Negative Signals'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {negativeSignals.map((s, i) => {
              const labels = SIGNAL_LABELS[s.signal];
              const label = labels ? labels[l] : s.label[l];
              return (
                <SignalRow
                  key={s.signal}
                  signal={s.signal}
                  label={label}
                  rate={s.rate}
                  points={s.points_applied}
                  tone="negative"
                  delay={0.1 + i * 0.06}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Insights */}
      {data.insights.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="h-px bg-[var(--color-border)]" />
          {data.insights.map((insight, i) => {
            const cfg = SEVERITY_STYLE[insight.severity] ?? SEVERITY_STYLE.low;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${cfg.wrap}`}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <p className={`text-sm leading-relaxed ${cfg.text}`}>
                  {insight.message[l]}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
