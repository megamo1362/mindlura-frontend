'use client';

import Link from 'next/link';
import { ScrollReveal, StaggerList, StaggerItem } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { pricingTeaserCopy } from '../copy';

type PricingTeaserCopy = (typeof pricingTeaserCopy)['en'];

export function PricingTeaser({ copy, chrome }: { copy: PricingTeaserCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <SectionShell tone="canvas" spacing="md">
      <ScrollReveal variant="fadeUp">
        <h2 className="text-2xl md:text-3xl mb-14" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
      </ScrollReveal>

      <StaggerList className="grid md:grid-cols-4 gap-8 mb-10">
        {copy.cards.map((card, i) => (
          <StaggerItem key={card.name}>
            <div style={{ borderTop: i === copy.cards.length - 1 ? `1px solid ${accent}` : `1px solid ${tokens.color.line}`, paddingTop: '20px' }}>
              <h3 className="text-base mb-2" style={{ fontFamily: tokens.font.mono, color: tokens.color.text }}>{card.name}</h3>
              <p className="text-xs leading-relaxed" style={{ color: tokens.color.muted }}>{card.tag}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>

      <ScrollReveal variant="fadeUp" delay={0.1}>
        <Link href={chrome.localizeHref('/pricing')} className="text-sm underline" style={{ color: accent }}>
          {copy.cta}
        </Link>
      </ScrollReveal>
    </SectionShell>
  );
}
