'use client';

interface PasswordStrengthIndicatorProps {
  password: string;
  lang: 'fa' | 'en';
}

const LABELS: Record<'fa' | 'en', Record<1 | 2 | 3 | 4, string>> = {
  en: { 1: 'Weak', 2: 'Fair', 3: 'Strong', 4: 'Very Strong' },
  fa: { 1: 'ضعیف', 2: 'متوسط', 3: 'قوی', 4: 'خیلی قوی' },
};

const SEGMENT_COLOR: Record<1 | 2 | 3 | 4, string> = {
  1: 'var(--color-danger, #ef4444)',
  2: '#f59e0b',
  3: '#22c55e',
  4: '#15803d',
};

function getScore(password: string): 1 | 2 | 3 | 4 {
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(password);

  if (password.length >= 10 && hasUpper && hasNumber && hasSpecial) return 4;
  if (password.length >= 8 && hasUpper && hasNumber) return 3;
  if (password.length >= 8) return 2;
  return 1;
}

export function PasswordStrengthIndicator({ password, lang }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const score = getScore(password);

  return (
    <div className="w-full" style={{ maxHeight: 32 }}>
      <div className="flex gap-1">
        {([1, 2, 3, 4] as const).map((segment) => (
          <div
            key={segment}
            className="h-1 flex-1 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: segment <= score ? SEGMENT_COLOR[score] : 'var(--color-border, #e5e7eb)',
            }}
          />
        ))}
      </div>
      <p className="mt-1 text-[10px] leading-none text-[var(--color-text-muted)]">
        {LABELS[lang][score]}
      </p>
    </div>
  );
}
