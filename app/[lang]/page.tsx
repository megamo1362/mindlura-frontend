import type { Metadata } from 'next';
import HomeClient from '@/app/HomeClient';

const siteTitle = 'مایندلورا — روان‌شناسی معاملاتی، قابل اندازه‌گیری | آنالیتیکس رفتاری فارکس';
const siteDescription =
  'حساب معاملاتی خود را متصل کنید و الگوهای رفتاری‌ای که هزینه برایتان دارند را کشف کنید. تحلیل MAE/MFE، امتیاز روان‌شناختی، ژورنال هوشمند احساسی و ابزارهای کوچ — در حال حاضر از MT5 پشتیبانی می‌کنیم، پشتیبانی cTrader به‌زودی.';
const siteUrl = 'https://mindlura.com/fa';

export const metadata: Metadata = {
  title: { absolute: siteTitle },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
};

export default function FaHome() {
  return <HomeClient initialLang="fa" initialCountry="IR" />;
}
