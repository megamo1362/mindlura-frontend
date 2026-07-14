'use client';

import Link from 'next/link';
import { ArrowRight, FileText, BarChart2, Lightbulb, Users, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import type { SectionChrome } from '../types';
import type { coachPlatformCopy } from '../copy';

type CoachPlatformCopy = (typeof coachPlatformCopy)['en'];

const ICONS = [FileText, BarChart2, Lightbulb];

function RoleNode({ label, icon: Icon, small }: { label: string; icon: React.ElementType; small?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${small ? 'w-16 h-16' : 'w-24 h-16'}`}
      style={{ border: `1px solid ${tokens.color.line}` }}
    >
      <Icon size={small ? 13 : 16} strokeWidth={1.3} style={{ color: tokens.color.muted }} />
      <span className="text-[10px] mt-1.5" style={{ color: tokens.color.mutedDim }}>{label}</span>
    </div>
  );
}

// Coach → clients hierarchy — coach platform only, no broker tier.
function CoachHierarchy({ isFa }: { isFa: boolean }) {
  const labels = isFa ? { coach: 'کوچ', client: 'کلاینت' } : { coach: 'Coach', client: 'Client' };
  return (
    <div className="flex flex-col items-center gap-4">
      <RoleNode label={labels.coach} icon={Users} />
      <div className="w-px h-8" style={{ backgroundColor: tokens.color.line }} />
      <div className="flex gap-5">
        {[0, 1, 2].map((i) => <RoleNode key={i} label={labels.client} icon={Sparkles} small />)}
      </div>
    </div>
  );
}

export function CoachPlatformSection({ copy, chrome }: { copy: CoachPlatformCopy; chrome: SectionChrome }) {
  const { isFa, displayFont } = chrome;
  const coachAccent = tokens.color.coach;

  return (
    <section id="coaches" className="max-w-screen-2xl mx-auto px-6 py-16">
      <div className="hairline mb-16" />
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <ScrollReveal variant="fadeUp">
          <p className="text-sm italic mb-4" style={{ color: coachAccent, fontFamily: displayFont }}>{copy.eyebrow}</p>
          <h2 className="text-2xl md:text-3xl mb-5 max-w-md" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
            {copy.title}
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: tokens.color.muted }}>{copy.sub}</p>

          <div className="space-y-5 mb-8">
            {copy.items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={item.t} className="flex items-start gap-3">
                  <Icon size={16} strokeWidth={1.5} style={{ color: coachAccent, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h3 className="text-sm font-medium mb-0.5" style={{ color: tokens.color.text }}>{item.t}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: tokens.color.muted }}>{item.d}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href={chrome.localizeHref('/for-coaches')} className="text-sm inline-flex items-center gap-2" style={{ color: coachAccent }}>
            {copy.cta}
            <ArrowRight size={14} className={isFa ? 'rotate-180' : ''} />
          </Link>
        </ScrollReveal>

        <ScrollReveal variant="scaleIn" delay={0.1} className="flex flex-col items-center justify-center gap-4">
          <CoachHierarchy isFa={isFa} />
          <p className="text-xs italic text-center" style={{ color: tokens.color.mutedDim, fontFamily: displayFont }}>{copy.note}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
