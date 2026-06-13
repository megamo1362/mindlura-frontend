'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
        مشکلی پیش آمد
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs">
        یه خطای غیرمنتظره رخ داده. لطفاً دوباره تلاش کن.
      </p>
      <button onClick={reset} className="btn-secondary px-5 py-2 rounded-xl text-sm">
        تلاش مجدد
      </button>
    </div>
  );
}
