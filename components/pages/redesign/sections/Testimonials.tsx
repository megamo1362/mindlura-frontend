'use client';

import Link from 'next/link';
import { ShieldCheck, Building2, EyeOff, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerList, StaggerItem } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { testimonialsCopy } from '../copy';

type TestimonialsCopy = (typeof testimonialsCopy)['en'];

const ICONS = [EyeOff, Building2, ShieldCheck];

// Replaces the old "testimonials will live here" placeholder. Rather than
// leaving an empty social-proof slot (or worse, inventing quotes), this
// trades on the trust angle Mindlura can actually back today: read-only
// access, who built it, and an explicit no-fake-reviews stance.
export function Testimonials({ copy, chrome }: { copy: TestimonialsCopy; chrome: SectionChrome }) {
  const { accent, isFa, displayFont } = chrome;

  return (
    <SectionShell tone="alt" spacing="md">
      <ScrollReveal variant="fadeUp">
        <div className="max-w-xl mx-auto text-center mb-14">
          <p className="text-xs italic mb-4" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
          <h2 className="text-xl md:text-2xl mb-4" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
            {copy.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: tokens.color.muted }}>{copy.sub}</p>
        </div>
      </ScrollReveal>

      <StaggerList className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
        {copy.chips.map((chip, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <StaggerItem key={chip.t}>
              <div className="text-center sm:text-left" style={{ direction: isFa ? 'rtl' : 'ltr', textAlign: isFa ? 'right' : 'left' }}>
                <Icon size={16} strokeWidth={1.5} style={{ color: accent }} className="mb-3 mx-auto sm:mx-0" />
                <h3 className="text-sm font-medium mb-1" style={{ color: tokens.color.text }}>{chip.t}</h3>
                <p className="text-xs leading-relaxed" style={{ color: tokens.color.mutedDim }}>{chip.d}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerList>

      <ScrollReveal variant="fadeUp" delay={0.1}>
        <div className="text-center">
          <Link
            href={chrome.localizeHref('/register')}
            className="inline-flex items-center gap-2 text-sm px-6 py-2.5"
            style={{ border: `1px solid ${accent}`, color: tokens.color.text }}
          >
            {copy.cta}
            <ArrowRight size={14} className={isFa ? 'rotate-180' : ''} />
          </Link>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
