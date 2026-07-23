'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { useLang } from '@/app/i18n/LangContext';
import { LangToggle } from '@/app/i18n/LangToggle';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { API_URL, AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import { LoadingScreen } from '@/components/shared';
import { useTheme } from '@/components/redesign/theme/RedesignThemeProvider';
import type { Translations } from '@/app/i18n/translations';
import type { User } from '@/types';

function googleErrorMessage(t: Translations, code: string | null): string | null {
  if (!code) return null;
  const messages: Record<string, string> = {
    google_failed: t.auth_error_google_failed,
    google_state_invalid: t.auth_error_google_state_invalid,
    google_email_unverified: t.auth_error_google_email_unverified,
    google_invite_required: t.auth_error_google_invite_required,
    google_account_inactive: t.auth_error_google_account_inactive,
  };
  return messages[code] ?? t.auth_error_google_failed;
}

function LoginCard({ initialLang, initialCountry }: { initialLang: Lang; initialCountry: string }) {
  const { t, lang, setLang } = useLang();
  const { theme } = useTheme();
  const { lang: geoLang, country, resolved } = useGeoLang(initialLang, initialCountry);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isFa = lang === 'fa';
  const showLangToggle = country === 'IR';
  const googleError = googleErrorMessage(t, searchParams.get('auth_error'));

  // If a valid session already exists (e.g. after a browser restart with
  // "remember me"), skip the form and go straight to the app.
  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY)
        : null;

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((user: User) => {
        if (user.role === 'admin') {
          router.replace(ROUTES.admin.root);
        } else if (user.role === 'coach') {
          router.replace(ROUTES.coachClients);
        } else {
          router.replace(ROUTES.dashboard);
        }
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        setCheckingAuth(false);
      });
  }, [router]);

  useEffect(() => {
    if (!resolved) return;
    if (!localStorage.getItem('lang')) {
      setLang(geoLang);
    }
  }, [resolved, geoLang, setLang]);

  if (checkingAuth) return <LoadingScreen />;

  return (
    <>
      <motion.div
        className="w-full max-w-md"
        dir={isFa ? 'rtl' : 'ltr'}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            className="flex justify-center mb-2"
            animate={{ filter: [
              'drop-shadow(0 0 12px rgba(0,212,255,0.4)) drop-shadow(0 0 24px rgba(124,58,237,0.2))',
              'drop-shadow(0 0 24px rgba(0,212,255,0.7)) drop-shadow(0 0 48px rgba(124,58,237,0.4))',
              'drop-shadow(0 0 12px rgba(0,212,255,0.4)) drop-shadow(0 0 24px rgba(124,58,237,0.2))',
            ]}}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src={theme === 'dark' ? '/logo-login-dark.png' : '/logo-dashboard-light.png'}
              alt="MINDLURA"
              width={260}
              height={260}
              className="object-contain w-36 sm:w-48 lg:w-64"
              priority
            />
          </motion.div>
        </div>

        {/* Heading */}
        <div className="mb-6" style={{ textAlign: isFa ? 'right' : 'left' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
            {isFa ? 'روانشناسی معاملات' : 'Trading Psychology'}
          </p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
            {isFa ? '«خوش آمدید»' : 'Welcome back.'}
          </h1>
        </div>

        {/* Google OAuth error, if redirected back with one */}
        {googleError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{googleError}</span>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)]">
          <LoginForm />
        </div>

      {/* Switch to register */}
      <p className="text-center text-sm text-[var(--text-muted)] mt-5">
        {t.auth_no_account}{' '}
        <Link href="/register" className="text-[var(--accent)] hover:underline font-medium">
          {t.auth_register_tab}
        </Link>
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-[var(--text-muted)]">
          MINDLURA · AI Fintech Trading &amp; Psychology
        </p>
        {showLangToggle && <LangToggle />}
      </div>
    </motion.div>
    </>
  );
}

export default function LoginClient(props: { initialLang: Lang; initialCountry: string }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginCard {...props} />
    </Suspense>
  );
}
