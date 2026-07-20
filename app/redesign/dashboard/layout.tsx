import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthGuard } from '@/components/layouts/auth-guard';
import { RedesignThemeProvider } from '@/components/redesign/theme/RedesignThemeProvider';
import { Shell } from '@/components/redesign/layout/Shell';
// Global CSS import — scoped in practice because every rule in theme.css
// lives under a [data-theme] selector. RedesignThemeProvider mirrors that
// attribute onto <html> (so the page background follows the theme) and
// removes it on unmount, so it still cannot leak into the live dashboard.
import '@/app/theme.css';

export const metadata: Metadata = {
  title: 'Redesign Preview — Client Dashboard',
  robots: { index: false, follow: false, nocache: true },
};

// Role-aware: clients land here after login and see the client nav; coaches
// are bounced to /redesign/coach by page.tsx. AuthGuard has no adminOnly
// gate so admins can still reach this tree to preview the client experience
// (Sidebar/BottomNav show all client-tagged entries for them — see
// nav-config.ts). Anonymous visitors are redirected to /login as usual. At
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
