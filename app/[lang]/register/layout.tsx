import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'به لیست انتظار بپیوندید — دسترسی زودهنگام مایندلورا',
  description:
    'مایندلورا پلتفرم روان‌شناسی معاملاتی فارکس است که به MT5 متصل می‌شود و آنالیتیکس رفتاری ارائه می‌دهد. برای دسترسی زودهنگام و رایگان به لیست انتظار بپیوندید.',
  openGraph: { locale: 'fa_IR' },
};

export default function FaRegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
