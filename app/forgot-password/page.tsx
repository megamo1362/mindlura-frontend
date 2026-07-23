'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/app/i18n/LangContext';
import { apiFetch } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { t, isRTL } = useLang();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)] space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t.forgot_password_title}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t.forgot_password_desc}</p>
        </div>

        {status === 'success' ? (
          <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--profit-soft)] border border-[var(--profit)]/30 text-[var(--profit)]">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{t.forgot_password_success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-[var(--text-muted)]">{t.email}</Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                iconLeft={<Mail className="h-4 w-4" />}
                required
                autoComplete="email"
                inputSize="lg"
                dir="ltr"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm bg-[var(--loss-soft)] border border-[var(--loss)]/30 text-[var(--loss)]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{t.forgot_password_error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="h-12 w-full text-base" loading={submitting} disabled={submitting}>
              {t.forgot_password_submit}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--text-muted)]">
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
            {t.forgot_password_back_to_login}
          </Link>
        </p>
      </div>
    </div>
  );
}
