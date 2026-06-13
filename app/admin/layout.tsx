import type { Metadata } from 'next';
import { AdminShell } from '@/components/layouts';

export const metadata: Metadata = {
  title: 'پنل ادمین | IRFX',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
