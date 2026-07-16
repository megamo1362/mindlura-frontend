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

// STAGING NOTE: any authenticated user can reach this route — the
// admin-only gate was removed. Auth itself (AuthGuard, no adminOnly) still
// applies, so anonymous visitors are redirected to /login as usual. At
// go-live the page files under app/redesign/dashboard/** move to
// app/dashboard/**.
export default async function RedesignDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get('rd-theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <AuthGuard>
      <RedesignThemeProvider initialTheme={initialTheme}>
        <Shell variant="client">{children}</Shell>
      </RedesignThemeProvider>
    </AuthGuard>
  );
}
