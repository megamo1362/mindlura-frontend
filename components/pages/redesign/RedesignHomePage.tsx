'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { tokens } from '@/lib/design-tokens';
import { chromeCopy, heroCopy, aiDemoCopy, painCopy, howCopy, psychologyInsightsCopy, aiCoachCopy, coachPlatformCopy, trustCopy, testimonialsCopy, finalCtaCopy, type Lang } from './copy';
import type { SectionChrome } from './types';
import { Hero } from './sections/Hero';
import { AIDemoSection } from './sections/AIDemoSection';
import { PainSection } from './sections/PainSection';
import { HowItWorks } from './sections/HowItWorks';
import { PsychologyInsights } from './sections/PsychologyInsights';
import { AICoachSection } from './sections/AICoachSection';
import { CoachPlatformSection } from './sections/CoachPlatformSection';
import { TrustSecurity } from './sections/TrustSecurity';
import { Testimonials } from './sections/Testimonials';
import { FinalCTA } from './sections/FinalCTA';

// Matches the order of footer cols in chromeCopy (Product | Company | Legal)
const FOOTER_HREFS = [
  ['#ai-demo', '#how', '#security'],
  ['/about', '/blog'],
  ['/privacy', '/terms'],
];

// Not-yet-live redesign preview. Deliberately kept independent of
// HomeClient.tsx / app/i18n — a route-level lang prop (matching the
// ForCoachesPage / BlogIndexPage convention) rather than the live site's
// header logic or global useLang() context, so this page can evolve without
// any risk of touching the production homepage or its wiring.
export function RedesignHomePage({ lang }: { lang: Lang }) {
  const [audience, setAudience] = useState<'trader' | 'coach'>('trader');
  const [menuOpen, setMenuOpen] = useState(false);

  const isFa = lang === 'fa';
  const t = chromeCopy[lang];
  const accent = audience === 'trader' ? tokens.color.trader : tokens.color.coach;

  const bodyFont = isFa ? tokens.font.fa : tokens.font.body;
  const displayFont = isFa ? tokens.font.fa : tokens.font.display;

  // Mirrors HomeClient's localizeHref: /fa prefix on internal routes, except
  // shared /login and /dashboard, and in-page anchors.
  const NO_PREFIX_PATHS = ['/login', '/dashboard'];
  const localizeHref = (href: string) =>
    isFa && !href.startsWith('#') && !NO_PREFIX_PATHS.includes(href) ? `/fa${href}` : href;

  const otherLangHref = isFa ? '/redesign' : '/fa/redesign';

  const chrome: SectionChrome = { lang, isFa, accent, displayFont, bodyFont, localizeHref };

  const navLinks = [
    { label: t.nav.demo, href: '#ai-demo' },
    { label: t.nav.how, href: '#how' },
    { label: t.nav.coaches, href: '#coaches' },
    { label: t.nav.security, href: '#security' },
  ];

  return (
    <div dir={t.dir} style={{ backgroundColor: tokens.color.canvas, color: tokens.color.text, fontFamily: bodyFont, minHeight: '100vh' }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        .hairline { height: 1px; background: ${tokens.color.line}; }
      `}</style>

      {/* Non-production preview banner — never shown on the live homepage. */}
      <div
        className="text-center text-xs py-2 px-4"
        style={{ backgroundColor: tokens.color.surface, color: tokens.color.mutedDim, borderBottom: `1px solid ${tokens.color.line}` }}
      >
        {t.footer.preview}
      </div>

      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(10,14,23,0.9)', backdropFilter: 'blur(8px)' }}>
        <div className="hairline" />
        <div className="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Mindlura" className="w-9 h-9" style={{ filter: `drop-shadow(0 0 6px ${accent}80)` }} />
            <span className="text-lg" style={{ fontFamily: displayFont, letterSpacing: '0.01em' }}>Mindlura</span>
          </div>

          <nav className="hidden md:flex items-center gap-9 text-sm" style={{ color: tokens.color.muted }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-[#E9ECF3] transition-colors">{link.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm mr-2" style={{ color: tokens.color.mutedDim }}>
              {(['trader', 'coach'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className="pb-0.5"
                  style={{
                    color: audience === a ? tokens.color.text : tokens.color.mutedDim,
                    fontFamily: displayFont,
                    fontStyle: 'italic',
                    borderBottom: audience === a ? `1px solid ${accent}` : '1px solid transparent',
                  }}
                >
                  {a === 'trader' ? t.toggle.trader : t.toggle.coach}
                </button>
              ))}
            </div>
            <Link href={otherLangHref} className="text-xs italic" style={{ fontFamily: displayFont, color: tokens.color.mutedDim }}>
              {isFa ? 'English' : 'فارسی'}
            </Link>
            <Link href="/login" className="text-sm" style={{ color: '#C7CBE0' }}>{t.nav.login}</Link>
            <Link href={localizeHref('/register')} className="text-sm px-5 py-2" style={{ border: `1px solid ${accent}`, color: tokens.color.text }}>
              {t.nav.start}
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-5 flex flex-col gap-3 text-sm" style={{ color: '#C7CBE0' }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
            <div className="hairline" />
            <Link href="/login" onClick={() => setMenuOpen(false)}>{t.nav.login}</Link>
            <Link
              href={localizeHref('/register')}
              onClick={() => setMenuOpen(false)}
              className="inline-block px-5 py-2 text-center"
              style={{ border: `1px solid ${accent}`, color: tokens.color.text }}
            >
              {t.nav.start}
            </Link>
            <Link href={otherLangHref} className="italic" style={{ fontFamily: displayFont }}>
              {isFa ? 'English' : 'فارسی'}
            </Link>
          </div>
        )}
      </header>

      {/* ---------------- SECTIONS (show, don't tell — AI demo right after hero) ---------------- */}
      <Hero copy={heroCopy[lang][audience]} chrome={chrome} />
      <AIDemoSection copy={aiDemoCopy[lang]} chrome={chrome} />
      <PainSection copy={painCopy[lang]} chrome={chrome} />
      <HowItWorks copy={howCopy[lang]} chrome={chrome} />
      <PsychologyInsights copy={psychologyInsightsCopy[lang]} chrome={chrome} />
      <AICoachSection copy={aiCoachCopy[lang]} chrome={chrome} />
      <CoachPlatformSection copy={coachPlatformCopy[lang]} chrome={chrome} />
      <TrustSecurity copy={trustCopy[lang]} chrome={chrome} />
      <Testimonials copy={testimonialsCopy[lang]} chrome={chrome} />
      <FinalCTA copy={finalCtaCopy[lang]} chrome={chrome} />

      {/* ---------------- FOOTER ---------------- */}
      <footer>
        <div className="hairline" />
        <div className="max-w-screen-2xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Mindlura" className="w-7 h-7" />
              <span style={{ fontFamily: displayFont }}>Mindlura</span>
            </div>
            <p className="text-sm" style={{ color: tokens.color.mutedDim }}>{t.footer.tagline}</p>
          </div>
          {t.footer.cols.map((col, ci) => (
            <div key={col.h}>
              <h4 className="text-xs mb-3 uppercase tracking-wide" style={{ color: tokens.color.muted }}>{col.h}</h4>
              <ul className="space-y-2 text-sm" style={{ color: tokens.color.mutedDim }}>
                {col.items.map((item, ii) => (
                  <li key={item}>
                    <Link href={localizeHref(FOOTER_HREFS[ci][ii])} className="hover:text-[#C7CBE0] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline" />
        <div className="max-w-screen-2xl mx-auto px-6 py-6 text-xs text-center" style={{ color: tokens.color.mutedDim }}>
          © 2026 Mindlura — {t.footer.rights}
        </div>
      </footer>
    </div>
  );
}
