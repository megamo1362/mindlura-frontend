'use client';

import { Bot, MessageCircleHeart, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { aiCoachCopy } from '../copy';

type AICoachCopy = (typeof aiCoachCopy)['en'];

const ICONS = [Bot, MessageCircleHeart, TrendingUp];

// Shipped features (AIDemoSection, TrustSecurity, ...) use solid borders and
// opaque cards. This section is explicitly "In Development" — everything in
// it uses a dashed border instead, so the distinction between "live product"
// and "coming" is visual, not just a small badge you can miss.
export function AICoachSection({ copy, chrome }: { copy: AICoachCopy; chrome: SectionChrome }) {
  const { accent, isFa, displayFont } = chrome;

  return (
    <SectionShell tone="canvas" spacing="lg">
      <ScrollReveal variant="fadeUp">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="text-sm italic" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
          <span
            className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ border: `1px dashed ${accent}`, color: accent }}
          >
            {copy.badge}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-4 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed mb-10 max-w-lg" style={{ color: tokens.color.muted }}>{copy.sub}</p>
      </ScrollReveal>

      <ScrollReveal variant="scaleIn" delay={0.08}>
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{ border: `1px dashed ${accent}66`, backgroundColor: 'rgba(255,255,255,0.015)' }}
        >
          <p className="text-[10px] uppercase tracking-wide mb-6" style={{ color: tokens.color.mutedDim }}>
            {isFa ? 'پیش‌نمایش قابلیت — هنوز در دسترس نیست' : 'Feature preview — not yet available'}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {copy.items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={item.t}>
                  <Icon size={20} strokeWidth={1.4} style={{ color: accent }} className="mb-4" />
                  <h3 className="text-lg mb-2" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{item.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: tokens.color.muted }}>{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
