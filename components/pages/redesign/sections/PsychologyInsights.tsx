'use client';

import { Repeat, LineChart, CalendarClock, ListChecks } from 'lucide-react';
import { ScrollReveal, StaggerList, StaggerItem } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { psychologyInsightsCopy } from '../copy';

type PsychInsightsCopy = (typeof psychologyInsightsCopy)['en'];

const ICONS = [ListChecks, Repeat, LineChart, CalendarClock];

export function PsychologyInsights({ copy, chrome }: { copy: PsychInsightsCopy; chrome: SectionChrome }) {
  const { accent, displayFont } = chrome;

  return (
    <SectionShell tone="alt" spacing="md">
      <ScrollReveal variant="fadeUp">
        <p className="text-sm italic mb-4" style={{ color: accent, fontFamily: displayFont }}>{copy.eyebrow}</p>
        <h2 className="text-2xl md:text-3xl mb-4 max-w-xl" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed mb-14 max-w-lg" style={{ color: tokens.color.muted }}>{copy.sub}</p>
      </ScrollReveal>

      <StaggerList className="grid md:grid-cols-2 gap-x-8 gap-y-10">
        {copy.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <StaggerItem key={item.t}>
              <Icon size={18} strokeWidth={1.5} style={{ color: accent }} className="mb-4" />
              <h3 className="text-base mb-1.5" style={{ fontFamily: displayFont, fontWeight: 500, color: tokens.color.text }}>{item.t}</h3>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: tokens.color.muted }}>{item.d}</p>
            </StaggerItem>
          );
        })}
      </StaggerList>
    </SectionShell>
  );
}
