import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthGuard } from '@/components/layouts/auth-guard';
import { RedesignThemeProvider } from '@/components/redesign/theme/RedesignThemeProvider';
import { Shell } from '@/components/redesign/layout/Shell';
import '@/app/theme.css';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get('rd-theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <AuthGuard>
      <RedesignThemeProvider initialTheme={initialTheme}>
        <Shell>{children}</Shell>
      </RedesignThemeProvider>
    </AuthGuard>
  );
}
