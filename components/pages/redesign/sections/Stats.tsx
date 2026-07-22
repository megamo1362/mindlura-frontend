'use client';

import { StaggerList, StaggerItem } from '@/components/motion';
import { tokens } from '@/lib/design-tokens';
import { SectionShell } from '../SectionShell';
import type { SectionChrome } from '../types';
import type { statsCopy } from '../copy';

type StatsCopy = (typeof statsCopy)['en'];

export function Stats({ copy, chrome }: { copy: StatsCopy; chrome: SectionChrome }) {
  const { accent } = chrome;

  return (
    <SectionShell tone="canvas" spacing="sm">
      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {copy.map((s) => (
          <StaggerItem key={s.l}>
            <div className="text-3xl mb-2" style={{ fontFamily: tokens.font.mono, color: accent }}>{s.n}</div>
            <div className="text-xs" style={{ color: tokens.color.muted }}>{s.l}</div>
          </StaggerItem>
        ))}
      </StaggerList>
    </SectionShell>
  );
}
