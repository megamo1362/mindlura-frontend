'use client';

import Link from 'next/link';
import { ScrollReveal, StaggerList, StaggerItem } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { blogPreviewCopy } from '../copy';

type BlogPreviewCopy = (typeof blogPreviewCopy)['en'];

export function BlogPreview({ copy, chrome }: { copy: BlogPreviewCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <SectionShell tone="alt" spacing="md">
      <ScrollReveal variant="fadeUp">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{copy.title}</h2>
          <Link href={chrome.localizeHref('/blog')} className="text-sm" style={{ color: accent }}>{copy.cta} →</Link>
        </div>
      </ScrollReveal>

      <StaggerList className="grid md:grid-cols-3 gap-8">
        {copy.cards.map((card) => (
          <StaggerItem key={card.slug}>
            <div className="flex flex-col h-full" style={{ borderTop: `1px solid ${tokens.color.line}`, paddingTop: '20px' }}>
              <span className="text-xs mb-3 uppercase tracking-wide" style={{ color: accent, fontFamily: tokens.font.mono }}>{card.category}</span>
              <h3 className="text-base mb-3 leading-snug flex-1" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{card.title}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: tokens.color.muted }}>{card.desc}</p>
              <Link href={chrome.localizeHref(`/blog/${card.slug}`)} className="text-xs" style={{ color: accent }}>→</Link>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </SectionShell>
  );
}
