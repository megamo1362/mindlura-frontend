'use client';

import type { CSSProperties, ReactNode } from 'react';
import { tokens } from '@/lib/design-tokens';

type Spacing = 'sm' | 'md' | 'lg' | 'xl';

const SPACING_CLASS: Record<Spacing, string> = {
  sm: 'py-14',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24',
};

interface SectionShellProps {
  /** Anchor id for in-page nav — also drives the sticky-header scroll offset. */
  id?: string;
  /** Full-bleed background tone. 'alt' is a barely-there wash used to break up
   *  long runs of identical sections without introducing new "card" chrome. */
  tone?: 'canvas' | 'alt';
  spacing?: Spacing;
  /** Top hairline divider — every section has one except Hero (first on the
   *  page, right under the sticky header) and FinalCTA (own centered accent divider). */
  divider?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

// Shared full-bleed section wrapper for the redesign preview. Centralizes two
// things every content section needs: (1) scroll-margin-top so sticky-header
// anchor navigation doesn't hide the heading it jumps to, and (2) the
// canvas/canvasAlt tone alternation used for page-rhythm pacing.
export function SectionShell({ id, tone = 'canvas', spacing = 'md', divider = true, className = '', style, children }: SectionShellProps) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: tone === 'alt' ? tokens.color.canvasAlt : 'transparent',
        scrollMarginTop: id ? '6rem' : undefined,
        ...style,
      }}
    >
      <div className={`max-w-screen-2xl mx-auto px-6 ${SPACING_CLASS[spacing]} ${className}`}>
        {divider && <div className="hairline mb-16" />}
        {children}
      </div>
    </section>
  );
}
