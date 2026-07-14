'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import type { SectionChrome } from '../types';
import type { finalCtaCopy } from '../copy';

type FinalCtaCopy = (typeof finalCtaCopy)['en'];

export function FinalCTA({ copy, chrome }: { copy: FinalCtaCopy; chrome: SectionChrome }) {
  const { accent, isFa, displayFont } = chrome;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 py-24 text-center">
      <div className="hairline mb-16 max-w-xs mx-auto" style={{ backgroundColor: accent, opacity: 0.5 }} />
      <ScrollReveal variant="fadeUp">
        <h2 className="text-2xl md:text-4xl mb-3 max-w-2xl mx-auto" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
        <p className="text-base mb-10" style={{ color: tokens.color.muted }}>{copy.sub}</p>
        <Link
          href={chrome.localizeHref('/register')}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm"
          style={{ backgroundColor: accent, color: tokens.color.canvas, boxShadow: `0 0 28px ${accent}80` }}
        >
          {copy.button}
          <ArrowRight size={16} className={isFa ? 'rotate-180' : ''} />
        </Link>
      </ScrollReveal>
    </section>
  );
}
