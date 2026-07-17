import type { Metadata } from 'next';
import { DashboardShell } from '@/components/layouts';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      <span className="fixed bottom-1 right-2 z-50 text-[10px] text-white/30 pointer-events-none select-none">
        v1.2.1
      </span>
    </>
  );
}
