'use client';

import { ArrowDown } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { howCopy } from '../copy';

type HowCopy = (typeof howCopy)['en'];

export function HowItWorks({ copy, chrome }: { copy: HowCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <SectionShell id="how" tone="canvas" spacing="md">
      <ScrollReveal variant="fadeUp">
        <h2 className="text-2xl md:text-3xl mb-14 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-10">
        {copy.steps.map((step, i) => (
          <ScrollReveal key={step.t} variant="fadeUp" delay={i * 0.1}>
            <div className="text-xs mb-4" style={{ fontFamily: tokens.font.mono, color: accent }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="text-lg mb-2" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{step.t}</h3>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: tokens.color.muted }}>{step.d}</p>
            {i < copy.steps.length - 1 && (
              <ArrowDown size={16} className="mt-4 md:hidden" style={{ color: tokens.color.mutedDim }} />
            )}
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}
