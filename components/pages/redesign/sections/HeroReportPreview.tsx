'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingDown, Target } from 'lucide-react';
import { tokens } from '@/lib/design-tokens';

// Compact, static preview of a real Mindlura report — not a generic AI
// illustration. Mirrors the ring + sub-score language of the full AI Demo
// section below so the hero reads as "the actual product", not marketing art.
export function HeroReportPreview({ accent, isFa }: { accent: string; isFa: boolean }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const score = 78;
  const offset = circumference - (score / 100) * circumference;

  const rows = [
    { Icon: Shield, label: isFa ? 'کنترل انتقام' : 'Revenge Control', value: 58 },
    { Icon: TrendingDown, label: isFa ? 'مدیریت ریسک' : 'Risk Management', value: 64 },
    { Icon: Target, label: isFa ? 'نظم معاملاتی' : 'Discipline', value: 81 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-sm"
      style={{
        backgroundColor: tokens.color.surface,
        border: `1px solid ${tokens.color.line}`,
        borderRadius: 12,
      }}
    >
      {/* Subtle continuous float — respects prefers-reduced-motion via the
          MotionConfig wrapper in RedesignHomePage. */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] uppercase tracking-wide" style={{ color: tokens.color.mutedDim }}>
            {isFa ? 'گزارش نمونه مایندلورا' : 'Mindlura Sample Report'}
          </span>
          <span
            className="text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ border: `1px solid ${tokens.color.line}`, color: tokens.color.muted }}
          >
            {isFa ? 'نمونه' : 'Sample'}
          </span>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={accent}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold leading-none" style={{ color: tokens.color.text, fontFamily: tokens.font.mono }}>{score}</span>
              <span className="text-[9px] mt-0.5" style={{ color: tokens.color.mutedDim }}>/100</span>
            </div>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: tokens.color.mutedDim }}>
              {isFa ? 'امتیاز روان‌شناسی معاملاتی' : 'Trading Psychology Score'}
            </p>
            <p className="text-sm font-medium" style={{ color: accent, fontFamily: tokens.font.display, fontStyle: 'italic' }}>
              {isFa ? 'خوب — نیازمند توجه' : 'Good — Needs Attention'}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.35 }}
              className="flex items-center gap-2"
            >
              <row.Icon size={12} strokeWidth={1.5} style={{ color: tokens.color.muted, flexShrink: 0 }} />
              <span className="text-[11px] flex-1" style={{ color: tokens.color.muted }}>{row.label}</span>
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.value}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className="rounded-lg px-3 py-2.5"
          style={{ border: `1px solid ${tokens.color.line}`, backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-[9px] uppercase tracking-wide mb-1" style={{ color: accent }}>
            {isFa ? 'رفتار شناسایی‌شده' : 'Detected Behavior'}
          </p>
          <p className="text-[11px] leading-snug" style={{ color: tokens.color.text }}>
            {isFa ? 'افزایش ریسک پس از ضررهای پیاپی' : 'Risk increases after consecutive losses'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
