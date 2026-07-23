'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/auth/register-form';
import { useLang } from '@/app/i18n/LangContext';
import { LangToggle } from '@/app/i18n/LangToggle';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { useTheme } from '@/components/redesign/theme/RedesignThemeProvider';
import { useEffect } from 'react';

function RegisterCard({ initialLang, initialCountry }: { initialLang: Lang; initialCountry: string }) {
  const { t, lang, setLang } = useLang();
  const { theme } = useTheme();
  const { lang: geoLang, country, resolved } = useGeoLang(initialLang, initialCountry);
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite') ?? undefined;
  const isFa = lang === 'fa';
  const showLangToggle = country === 'IR';

  useEffect(() => {
    if (!resolved) return;
    if (!localStorage.getItem('lang')) {
      setLang(geoLang);
    }
  }, [resolved, geoLang, setLang]);

  return (
    <motion.div
      className="w-full max-w-md"
      dir={isFa ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <Image
            src={theme === 'dark' ? '/logo-login-dark.png' : '/logo-dashboard-light.png'}
            alt="MINDLURA"
            width={260}
            height={260}
            className="object-contain w-36 sm:w-48 lg:w-64"
            priority
          />
        </div>
      </div>

      <div className="mb-6" style={{ textAlign: isFa ? 'right' : 'left' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
          {isFa ? 'روانشناسی معاملات' : 'Trading Psychology'}
        </p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
          {isFa ? 'ساخت حساب' : 'Create your account.'}
        </h1>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)]">
        <RegisterForm inviteCode={inviteCode} />
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-5">
        {t.auth_have_account}{' '}
        <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
          {t.auth_login_tab}
        </Link>
      </p>

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-[var(--text-muted)]">
          MINDLURA · AI Fintech Trading &amp; Psychology
        </p>
        {showLangToggle && <LangToggle />}
      </div>
    </motion.div>
  );
}

export default function RegisterClient({ initialLang, initialCountry }: { initialLang: Lang; initialCountry: string }) {
  return (
    <Suspense fallback={null}>
      <RegisterCard initialLang={initialLang} initialCountry={initialCountry} />
    </Suspense>
  );
}
