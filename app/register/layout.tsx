import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Waitlist — Mindlura Early Access',
  description:
    'Mindlura is a forex trading psychology platform connecting to MT5 for behavioral analytics. Join the waitlist for free early access.',
  openGraph: { locale: 'en_US' },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
