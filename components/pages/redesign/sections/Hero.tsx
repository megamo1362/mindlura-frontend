'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { tokens } from '@/lib/design-tokens';
import { HeroVisualStage } from './HeroVisualStage';
import type { SectionChrome } from '../types';

interface HeroCopy {
  eyebrow: string;
  title: string;
  sub: string;
  cta1: string;
  cta2: string;
}

// `accent` is passed explicitly (not read from chrome.accent) because it's
// the one place on the page that's meant to react live to the audience
// toggle — see RedesignHomePage's heroAccent. Every section below this one
// uses chrome.accent, which stays fixed regardless of the toggle.
export function Hero({ copy, chrome, accent }: { copy: HeroCopy; chrome: SectionChrome; accent: string }) {
  const { isFa, displayFont } = chrome;
  // `relative z-0` gives the section its own stacking context so
  // MarketSignalMotion's absolute, -z-10 overlay (rendered inside
  // HeroVisualStage below) stays scoped behind this section's own content
  // without leaking behind the sticky header or anything else on the page.
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative z-0 max-w-screen-2xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center"
    >
      <div className={isFa ? 'md:order-2' : ''}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm italic mb-5"
          style={{ color: accent, fontFamily: displayFont }}
        >
          {copy.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-[3.4rem] leading-[1.12] mb-7"
          style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}
        >
          {copy.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base leading-relaxed mb-10 max-w-md"
          style={{ color: tokens.color.muted }}
        >
          {copy.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center gap-8"
        >
          <Link
            href={chrome.localizeHref('/register')}
            className="px-7 py-3 text-sm"
            style={{ backgroundColor: accent, color: tokens.color.canvas, boxShadow: `0 0 28px ${accent}55` }}
          >
            {copy.cta1}
          </Link>
          <a href="#ai-demo" className="text-sm flex items-center gap-2" style={{ color: '#C7CBE0' }}>
            {copy.cta2}
            <ArrowRight size={14} className={isFa ? 'rotate-180' : ''} />
          </a>
        </motion.div>
      </div>

      <div className={`flex items-center justify-center ${isFa ? 'md:order-1' : ''}`}>
        <HeroVisualStage accent={accent} isFa={isFa} heroRef={heroRef} />
      </div>
    </section>
  );
}
