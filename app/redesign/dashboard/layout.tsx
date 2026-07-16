import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthGuard } from '@/components/layouts/auth-guard';
import { RedesignThemeProvider } from '@/components/redesign/theme/RedesignThemeProvider';
import { Shell } from '@/components/redesign/layout/Shell';
// Global CSS import — scoped in practice because every rule in theme.css
// lives under a [data-theme] selector (set on the .rd-shell wrapper below,
// not on <html>), so it cannot affect the live dashboard's styling.
import '@/app/theme.css';

export const metadata: Metadata = {
  title: 'Redesign Preview — Client Dashboard',
  robots: { index: false, follow: false, nocache: true },
};

// STAGING NOTE: admin-only gate. Non-admin users are bounced to the live
// dashboard by <AuthGuard adminOnly>. At go-live this gate is removed
// entirely (real client users need to reach this route) and the page files
// under app/redesign/dashboard/** move to app/dashboard/**.
export default async function RedesignDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get('rd-theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <AuthGuard adminOnly>
      <RedesignThemeProvider initialTheme={initialTheme}>
        <Shell variant="client">{children}</Shell>
      </RedesignThemeProvider>
    </AuthGuard>
  );
}
