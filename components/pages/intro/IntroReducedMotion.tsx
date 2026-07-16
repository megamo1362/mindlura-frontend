'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IntroOverlay } from './IntroOverlay';

// prefers-reduced-motion: skip the animated build-up entirely and settle
// directly into the end state with a single short opacity fade — no
// continuous motion, no WebGL. Still lands on the same wordmark/tagline/CTA
// moment as the other two variants.
export function IntroReducedMotion() {
  const [skipped, setSkipped] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pb-[20vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: skipped ? 0.1 : 0.6 }}
          className="relative h-44 w-44"
          style={{
            maskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
          }}
          aria-hidden="true"
        >
          <Image src="/logo-dashboard-dark.png" alt="" fill sizes="176px" priority className="object-contain" />
        </motion.div>
      </div>

      <IntroOverlay
        timing={{ skipButton: 0, wordmark: 0.25, tagline: 0.4, cta: 0.55 }}
        skipped={skipped}
        onSkip={() => setSkipped(true)}
      />
    </div>
  );
}
