'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, FlaskConical } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { aiDemoCopy } from '../copy';

type AIDemoCopy = (typeof aiDemoCopy)['en'];

function scoreColor(score: number) {
  if (score >= 80) return '#4ade80';
  if (score >= 65) return '#60a5fa';
  if (score >= 50) return '#facc15';
  return '#f87171';
}

// Full report mock — visually mirrors the real dashboard's Psychology Score
// card (ring gauge, sub-score bars, insight callouts) so the demo reads as
// authentic product UI. Driven entirely by explicit props (not the global
// useLang() context that the live dashboard components use) so it always
// matches this page's own /redesign vs /fa/redesign locale.
export function AIDemoSection({ copy, chrome }: { copy: AIDemoCopy; chrome: SectionChrome }) {
  const { accent, isFa, displayFont } = chrome;
  const score = 78;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <SectionShell id="ai-demo" tone="canvas" spacing="lg">
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="text-sm italic" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
        </div>
        <h2 className="text-2xl md:text-4xl mb-4 max-w-xl" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-12 max-w-xl" style={{ color: tokens.color.muted }}>
          {copy.sub}
        </p>
      </ScrollReveal>

      <ScrollReveal variant="scaleIn" delay={0.1}>
        <div
          className="rounded-2xl p-6 md:p-8 max-w-3xl"
          style={{ backgroundColor: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}
        >
          {/* Report chrome: unmistakably sample data */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <FlaskConical size={14} style={{ color: tokens.color.mutedDim }} />
              <span className="text-xs" style={{ color: tokens.color.mutedDim }}>{copy.sampleNote}</span>
            </div>
            <span
              className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-medium"
              style={{ border: `1px solid ${accent}`, color: accent }}
            >
              {copy.sampleBadge}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <h3 className="text-sm font-medium" style={{ color: tokens.color.text }}>{copy.scoreTitle}</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
            {/* Score ring */}
            <div className="flex-shrink-0 mx-auto sm:mx-0 flex flex-col items-center gap-2">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                  <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <motion.circle
                    cx="65" cy="65" r={radius}
                    fill="none"
                    stroke={scoreColor(score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: offset }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold leading-none" style={{ color: scoreColor(score), fontFamily: tokens.font.mono }}>{score}</span>
                  <span className="text-[10px] mt-0.5" style={{ color: tokens.color.mutedDim }}>/100</span>
                </div>
              </div>
              <span className="text-sm font-medium" style={{ color: scoreColor(score) }}>{copy.grade}</span>
            </div>

            {/* Sub-scores */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
              {copy.subScores.map((s, i) => (
                <motion.div
                  key={s.key}
                  className="space-y-1.5"
                  initial={{ opacity: 0, x: isFa ? 8 : -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs" style={{ color: tokens.color.muted }}>{s.label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: scoreColor(s.score), fontFamily: tokens.font.mono }}>{s.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: scoreColor(s.score) }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.score}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-px mb-6" style={{ backgroundColor: tokens.color.line }} />

          {/* Detected pattern + AI recommendation */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="rounded-xl px-4 py-3.5"
              style={{ border: '1px solid rgba(249,115,22,0.25)', backgroundColor: 'rgba(249,115,22,0.06)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle size={12} className="text-orange-400" />
                <p className="text-[10px] uppercase tracking-wide text-orange-300">{copy.patternLabel}</p>
              </div>
              <p className="text-sm mb-1.5" style={{ color: tokens.color.text }}>{copy.patternText}</p>
              <p className="text-xs leading-relaxed text-orange-200/70">{copy.patternDetail}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.48, duration: 0.35 }}
              className="rounded-xl px-4 py-3.5"
              style={{ border: `1px solid ${accent}40`, backgroundColor: `${accent}0d` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} style={{ color: accent }} />
                <p className="text-[10px] uppercase tracking-wide" style={{ color: accent }}>{copy.recommendationLabel}</p>
              </div>
              <p className="text-sm mb-1.5" style={{ color: tokens.color.text }}>{copy.recommendationText}</p>
              <p className="text-xs leading-relaxed" style={{ color: tokens.color.muted }}>{copy.recommendationDetail}</p>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
