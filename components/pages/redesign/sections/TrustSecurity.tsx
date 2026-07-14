'use client';

import { Eye, Lock, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import type { SectionChrome } from '../types';
import type { trustCopy } from '../copy';

type TrustCopy = (typeof trustCopy)['en'];

const ICONS = [Eye, Lock, ShieldCheck];

export function TrustSecurity({ copy, chrome }: { copy: TrustCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <section id="security" className="max-w-screen-2xl mx-auto px-6 py-16">
      <div className="hairline mb-16" />
      <ScrollReveal variant="fadeUp">
        <p className="text-sm italic mb-4" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
        <h2 className="text-2xl md:text-3xl mb-14 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-8">
        {copy.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <ScrollReveal key={item.t} variant="fadeUp" delay={i * 0.08}>
              <Icon size={18} strokeWidth={1.5} style={{ color: accent }} className="mb-4" />
              <h3 className="text-base mb-1.5" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{item.t}</h3>
              <p className="text-sm leading-relaxed" style={{ color: tokens.color.muted }}>{item.d}</p>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
