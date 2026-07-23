'use client';

import Image from 'next/image';
import { useLang } from '@/app/i18n/LangContext';
import { API_URL } from '@/lib/constants';

interface GoogleSignInButtonProps {
  /** Invite code to carry through the OAuth redirect for brand-new accounts —
   * public invite-free registration is disabled, so Google sign-up must go
   * through the same invite gate as email/password registration. */
  inviteCode?: string;
}

export function GoogleSignInButton({ inviteCode }: GoogleSignInButtonProps) {
  const { t } = useLang();
  const href = inviteCode
    ? `${API_URL}/auth/google/login?invite_code=${encodeURIComponent(inviteCode)}`
    : `${API_URL}/auth/google/login`;

  return (
    // Full page navigation on purpose — this is an OAuth redirect flow, not a fetch.
    <a
      href={href}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)] hover:bg-[var(--bg-surface)]"
    >
      <Image src="/google-icon.svg" alt="" width={18} height={18} aria-hidden="true" />
      {t.auth_google_btn}
    </a>
  );
}
