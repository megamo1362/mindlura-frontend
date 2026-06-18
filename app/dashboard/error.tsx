'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLang } from '@/app/i18n/LangContext';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLang();

  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
        {t.error_page_title}
      </h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-5 max-w-xs">
        {t.error_page_desc}
      </p>
      <button onClick={reset} className="btn-secondary px-4 py-1.5 rounded-lg text-xs">
        {t.error_retry}
      </button>
    </div>
  );
}
