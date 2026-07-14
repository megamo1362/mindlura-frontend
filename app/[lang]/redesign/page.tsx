import type { Metadata } from 'next';
import { RedesignHomePage } from '@/components/pages/redesign/RedesignHomePage';

// Internal preview only — must never be indexed. Reachable only at /fa/redesign
// since the parent [lang]/layout.tsx already 404s any lang other than 'fa'.
export const metadata: Metadata = {
  title: 'مایندلورا — پیش‌نمایش بازطراحی',
  description: 'پیش‌نمایش داخلی بازطراحی صفحه اصلی مایندلورا. نسخه نهایی سایت نیست.',
  robots: { index: false, follow: false, nocache: true },
};

export default function FaRedesignPage() {
  return <RedesignHomePage lang="fa" />;
}
