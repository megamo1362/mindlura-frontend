'use client';

import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { painCopy } from '../copy';

type PainCopy = (typeof painCopy)['en'];

export function PainSection({ copy, chrome }: { copy: PainCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <SectionShell tone="alt" spacing="md">
      <ScrollReveal variant="fadeUp">
        <h2 className="text-2xl md:text-3xl mb-14 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
      </ScrollReveal>
      <div>
        {copy.items.map((item, i) => (
          <ScrollReveal key={item.t} variant="fadeUp" delay={i * 0.06}>
            <div
              className="grid md:grid-cols-[80px_1fr] gap-6 py-7"
              style={{ borderBottom: i < copy.items.length - 1 ? '1px solid #1C1C28' : 'none' }}
            >
              <div className="text-sm" style={{ fontFamily: tokens.font.mono, color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="text-lg mb-1.5" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{item.t}</h3>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: tokens.color.muted }}>{item.d}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}
