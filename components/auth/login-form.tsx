'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/redesign/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-auth-api';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';

const PERSIAN_ARABIC_CHARS = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  const { t } = useLang();

  const errorMessage = error instanceof ApiError ? error.message : error ? t.auth_login_error : null;
  const hasPersianInPassword = PERSIAN_ARABIC_CHARS.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, remember_me: rememberMe });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-[var(--text-muted)]">{t.email}</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          iconLeft={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
          inputSize="lg"
          dir="ltr"
          className="bg-[var(--bg-surface-2)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-[var(--text-muted)]">{t.password}</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.password}
          iconLeft={<Lock className="h-4 w-4" />}
          required
          autoComplete="current-password"
          inputSize="lg"
          dir="ltr"
          error={hasPersianInPassword ? t.auth_password_persian_keyboard_warning : undefined}
          className="bg-[var(--bg-surface-2)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-none text-left"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:underline">
            {t.auth_forgot_password}
          </Link>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <span className="text-sm text-[var(--text-muted)]">{t.auth_remember_me}</span>
      </label>

      {errorMessage && (
        <motion.div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="h-12 w-full text-base"
        loading={isPending}
        disabled={isPending}
      >
        {t.auth_login_btn}
      </Button>
    </motion.form>
  );
}
