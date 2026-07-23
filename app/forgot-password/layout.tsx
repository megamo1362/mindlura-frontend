import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { RedesignThemeProvider } from '@/components/redesign/theme/RedesignThemeProvider';
import '@/app/theme.css';

export const metadata: Metadata = {
  title: 'Forgot Password | Mindlura',
  description: 'Reset your Mindlura password',
};

export default async function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get('rd-theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <RedesignThemeProvider initialTheme={initialTheme}>
      <div className="relative flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </RedesignThemeProvider>
  );
}
