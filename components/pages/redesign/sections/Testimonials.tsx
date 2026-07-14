'use client';

import { Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import type { SectionChrome } from '../types';
import type { testimonialsCopy } from '../copy';

type TestimonialsCopy = (typeof testimonialsCopy)['en'];

export function Testimonials({ copy, chrome }: { copy: TestimonialsCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 py-16">
      <div className="hairline mb-16" />
      <ScrollReveal variant="fadeUp">
        <div className="text-center max-w-xl mx-auto">
          <Quote size={26} strokeWidth={1.2} style={{ color: accent, margin: '0 auto 20px' }} />
          <p className="text-xs italic mb-4" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
          <h3 className="text-xl md:text-2xl mb-4" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{copy.title}</h3>
          <p className="text-sm" style={{ color: tokens.color.mutedDim }}>{copy.sub}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
