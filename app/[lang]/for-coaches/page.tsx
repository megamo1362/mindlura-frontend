import type { Metadata } from 'next';
import { ForCoachesPageContent } from '@/components/pages/ForCoachesPage';

export const metadata: Metadata = {
  title: { absolute: 'برای کوچ‌ها — مایندلورا' },
  description:
    'پلتفرم حرفه‌ای برای کوچ‌های فارکس. مدیریت کلاینت‌ها، پیگیری عملکرد رفتاری و ارائه بینش‌های هوش مصنوعی.',
  alternates: { canonical: 'https://mindlura.com/fa/for-coaches' },
  openGraph: { locale: 'fa_IR' },
};

export default function FaForCoachesPage() {
  return <ForCoachesPageContent lang="fa" />;
}
