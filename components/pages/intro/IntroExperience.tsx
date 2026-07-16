'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDeviceCapability } from './hooks/useDeviceCapability';
import { IntroOverlay } from './IntroOverlay';
import { IntroFallback } from './IntroFallback';
import { IntroReducedMotion } from './IntroReducedMotion';
import { TIMELINE, VOID_COLOR } from './constants';
import type { ElapsedRef } from './types';

// The R3F scene (three.js + fiber + drei) is code-split into its own chunk
// and never rendered on the server — WebGL has no server-side equivalent,
// and this keeps the JS cost off every route except this one.
const IntroCanvasScene = dynamic(
  () => import('./canvas/IntroCanvasScene').then((m) => m.IntroCanvasScene),
  { ssr: false }
);

// Top-level orchestrator for the /intro-test prototype. Picks one of three
// self-contained variants based on capability (see useDeviceCapability) and
// wires up the "Skip intro" control, which the WebGL variant honors via a
// mutable offset ref (see IntroCanvasScene) and the other two honor via a
// `skipped` boolean that collapses their framer-motion delays to ~0.
//
// Renders a plain void-colored screen until capability is known — identical
// on server and first client paint, so there's no hydration mismatch and no
// flash of the wrong variant.
export function IntroExperience() {
  const mode = useDeviceCapability();
  const skipOffsetRef = useRef<ElapsedRef>({ current: 0 }).current;
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    skipOffsetRef.current = TIMELINE.total;
    setSkipped(true);
  };

  if (mode === 'checking') {
    return <div className="h-screen w-full" style={{ backgroundColor: VOID_COLOR }} />;
  }

  if (mode === 'reduced') return <IntroReducedMotion />;
  if (mode === 'fallback') return <IntroFallback />;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <IntroCanvasScene skipOffsetRef={skipOffsetRef} />
      <IntroOverlay
        timing={{
          skipButton: TIMELINE.skipButtonDelay / 1000,
          wordmark: skipped ? 0 : TIMELINE.wordmarkDelay / 1000,
          tagline: skipped ? 0.15 : TIMELINE.taglineDelay / 1000,
          cta: skipped ? 0.3 : TIMELINE.ctaDelay / 1000,
        }}
        skipped={skipped}
        onSkip={handleSkip}
      />
    </div>
  );
}
