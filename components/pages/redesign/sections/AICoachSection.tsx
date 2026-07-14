'use client';

import { Bot, MessageCircleHeart, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import type { SectionChrome } from '../types';
import type { aiCoachCopy } from '../copy';

type AICoachCopy = (typeof aiCoachCopy)['en'];

const ICONS = [Bot, MessageCircleHeart, TrendingUp];

export function AICoachSection({ copy, chrome }: { copy: AICoachCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 py-16">
      <div className="hairline mb-16" />
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="text-sm italic" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5" style={{ border: `1px solid ${accent}`, color: accent }}>
            {copy.badge}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-4 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed mb-12 max-w-lg" style={{ color: tokens.color.muted }}>{copy.sub}</p>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6">
        {copy.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <ScrollReveal key={item.t} variant="fadeUp" delay={i * 0.08}>
              <div className="p-6 h-full" style={{ border: `1px solid ${tokens.color.line}` }}>
                <Icon size={20} strokeWidth={1.4} style={{ color: accent }} className="mb-4" />
                <h3 className="text-lg mb-2" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{item.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: tokens.color.muted }}>{item.d}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
