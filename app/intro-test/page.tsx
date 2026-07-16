import type { Metadata } from 'next';
import { IntroExperience } from '@/components/pages/intro/IntroExperience';

// Internal prototype only — must never be indexed or compete with the live
// homepage (app/page.tsx) in search. Isolated route: does not touch, embed,
// or replace any existing page.
export const metadata: Metadata = {
  title: 'Mindlura — Intro Animation Prototype',
  description: 'Internal prototype of the Mindlura cinematic intro animation. Not the live site.',
  robots: { index: false, follow: false, nocache: true },
};

export default function IntroTestPage() {
  return <IntroExperience />;
}
