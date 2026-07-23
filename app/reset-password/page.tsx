'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { useLang } from '@/app/i18n/LangContext';
import { apiFetch, ApiError } from '@/lib/api';

function ResetPasswordForm() {
  const { t, lang, isRTL } = useLang();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'invalid_token'>('idle');
  const [serverError, setServerError] = useState('');

  if (!token) {
    return (
      <div className="w-full max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)] space-y-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t.reset_password_no_token}</span>
          </div>
          <p className="text-center text-sm text-[var(--text-muted)]">
            <Link href="/forgot-password" className="text-[var(--accent)] hover:underline font-medium">
              {t.forgot_password_title}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError('');

    if (newPassword !== confirmPassword) {
      setValidationError(t.auth_password_mismatch);
      return;
    }
    if (newPassword.length < 8) {
      setValidationError(t.auth_password_too_short);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: { token, new_password: newPassword },
      });
      setStatus('success');
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setStatus('invalid_token');
      } else {
        setServerError(t.forgot_password_error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)] space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t.reset_password_title}</h1>
        </div>

        {status === 'success' ? (
          <>
            <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--profit-soft)] border border-[var(--profit)]/30 text-[var(--profit)]">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{t.reset_password_success}</span>
            </div>
            <p className="text-center text-sm text-[var(--text-muted)]">
              <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
                {t.reset_password_go_to_login}
              </Link>
            </p>
          </>
        ) : status === 'invalid_token' ? (
          <>
            <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{t.reset_password_invalid_token}</span>
            </div>
            <p className="text-center text-sm text-[var(--text-muted)]">
              <Link href="/forgot-password" className="text-[var(--accent)] hover:underline font-medium">
                {t.forgot_password_title}
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-new-password" className="text-[var(--text-muted)]">{t.reset_password_new_password}</Label>
              <Input
                id="reset-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                iconLeft={<Lock className="h-4 w-4" />}
                required
                autoComplete="new-password"
                inputSize="lg"
              />
              <PasswordStrengthIndicator password={newPassword} lang={lang} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm-password" className="text-[var(--text-muted)]">{t.reset_password_confirm_password}</Label>
              <Input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                iconLeft={<Lock className="h-4 w-4" />}
                required
                autoComplete="new-password"
                inputSize="lg"
              />
              <PasswordStrengthIndicator password={confirmPassword} lang={lang} />
            </div>

            {(validationError || serverError) && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{validationError || serverError}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="h-12 w-full text-base" loading={submitting} disabled={submitting}>
              {t.reset_password_submit}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
