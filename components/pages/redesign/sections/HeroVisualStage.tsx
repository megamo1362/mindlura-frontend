'use client';

import type { RefObject } from 'react';
import { HeroReportPreview } from './HeroReportPreview';
import { MarketSignalMotion } from '../motion/MarketSignalMotion';

interface HeroVisualStageProps {
  accent: string;
  isFa: boolean;
  /** Ref to the Hero <section> itself — MarketSignalMotion listens for
   *  cursor movement across the whole hero, not just this column, and
   *  positions its overlay against that section (see Hero.tsx). */
  heroRef: RefObject<HTMLElement | null>;
  /** Forwarded to MarketSignalMotion — see its own doc comment for the
   *  automatic disable conditions this sits on top of. */
  enabled?: boolean;
}

// Mount point for the hero's visual column. Renders the static report
// preview card plus MarketSignalMotion, Mindlura's cursor-reactive signature
// motion (see components/pages/redesign/motion/) — a trail of miniature
// candlesticks with occasional "intelligence pulses", themed Market Data ->
// Analysis -> Intelligence. The card always renders regardless of whether
// the motion layer is active.
export function HeroVisualStage({ accent, isFa, heroRef, enabled = true }: HeroVisualStageProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <MarketSignalMotion heroRef={heroRef} accent={accent} enabled={enabled} />
      <HeroReportPreview accent={accent} isFa={isFa} />
    </div>
  );
}
