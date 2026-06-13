'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxCount?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, maxCount, id, value, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--color-text-muted)]"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full bg-[rgba(6,13,28,0.6)] rounded-[var(--radius-md)]',
            'border text-sm px-4 py-3 min-h-[100px] resize-y',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]',
            'outline-none transition-all duration-200',
            error
              ? 'border-[rgba(239,68,68,0.5)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-border-active)] focus:shadow-[var(--shadow-focus)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
            {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
          </div>
          {maxCount && (
            <p
              className="text-xs ml-auto"
              style={{ color: charCount > maxCount ? 'var(--color-danger)' : 'var(--color-text-muted)' }}
            >
              {charCount}/{maxCount}
            </p>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
