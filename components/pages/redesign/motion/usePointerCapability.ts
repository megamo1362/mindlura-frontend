'use client';

import { useEffect, useState } from 'react';

// True only for devices with a mouse-like cursor (fine pointer + hover
// support). Touch-only devices — phones, tablets — get the static
// HeroReportPreview and nothing else: there's no persistent cursor to react
// to there, so turning the signature motion off is the honest choice rather
// than faking it with touchmove events. Starts false so SSR/first paint
// never assumes capability it hasn't confirmed yet.
export function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFinePointer(mq.matches);

    const handleChange = (e: MediaQueryListEvent) => setFinePointer(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return finePointer;
}
