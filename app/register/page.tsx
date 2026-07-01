'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth/register-form';
import { useLang } from '@/app/i18n/LangContext';
import { LangToggle } from '@/app/i18n/LangToggle';

export default function RegisterPage() {
  const { t } = useLang();

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <motion.div
          className="flex justify-center mb-2"
          animate={{ filter: [
            'drop-shadow(0 0 12px rgba(0,212,255,0.4)) drop-shadow(0 0 24px rgba(124,58,237,0.2))',
            'drop-shadow(0 0 24px rgba(0,212,255,0.7)) drop-shadow(0 0 48px rgba(124,58,237,0.4))',
            'drop-shadow(0 0 12px rgba(0,212,255,0.4)) drop-shadow(0 0 24px rgba(124,58,237,0.2))',
          ]}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image src="/logo-login-dark.png" alt="MINDLURA" width={260} height={260} className="object-contain w-36 sm:w-48 lg:w-64" priority />
        </motion.div>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          AI Fintech Trading &amp; Psychology
        </p>
      </div>

      {/* Card */}
      <div className="glass-elevated rounded-2xl p-6 border border-[var(--color-border)]">
        <RegisterForm />
      </div>

      {/* Switch to login */}
      <p className="text-center text-sm text-[var(--color-text-muted)] mt-5">
        {t.auth_have_account}{' '}
        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          {t.auth_login_tab}
        </Link>
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-[var(--color-text-muted)]">
          MINDLURA · AI Fintech Trading &amp; Psychology
        </p>
        <LangToggle />
      </div>
    </motion.div>
  );
}
