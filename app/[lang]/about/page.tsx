import type { Metadata } from 'next';
import { AboutPageContent } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: { absolute: 'درباره ما — مایندلورا' },
  description:
    'مایندلورا توسط افرادی ساخته شد که درون بروکرها کار کرده‌اند و دیده‌اند که تریدرها نه به خاطر استراتژی ضعیف، بلکه به خاطر الگوهای رفتاری‌ای که نمی‌توانستند ببینند، حساب‌هایشان را از دست می‌دهند.',
  alternates: { canonical: 'https://mindlura.com/fa/about' },
  openGraph: { locale: 'fa_IR' },
};

export default function FaAboutPage() {
  return <AboutPageContent lang="fa" />;
}
