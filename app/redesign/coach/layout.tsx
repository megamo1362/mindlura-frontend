import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthGuard } from '@/components/layouts/auth-guard';
import { RedesignThemeProvider } from '@/components/redesign/theme/RedesignThemeProvider';
import { Shell } from '@/components/redesign/layout/Shell';
import '@/app/theme.css';

export const metadata: Metadata = {
  title: 'Redesign Preview — Coach Dashboard',
  robots: { index: false, follow: false, nocache: true },
};

// STAGING NOTE: same admin-only gate as app/redesign/dashboard/layout.tsx —
// see that file for the go-live removal note. The live coach pages this
// mirrors actually live under app/dashboard/coach/** (there is no separate
// app/coach/** today); the go-live checklist documents the real move.
export default async function RedesignCoachLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get('rd-theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <AuthGuard adminOnly>
      <RedesignThemeProvider initialTheme={initialTheme}>
        <Shell variant="coach">{children}</Shell>
      </RedesignThemeProvider>
    </AuthGuard>
  );
}
