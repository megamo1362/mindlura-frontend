'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  label?: string;
  size?: number;
  className?: string;
}

function colorVarFor(score: number): string {
  if (score < 40) return 'var(--loss)';
  if (score < 70) return 'var(--warning)';
  return 'var(--profit)';
}

export function ScoreRing({ score, label, size = 140, className }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const targetOffset = circumference - (clamped / 100) * circumference;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedOffset(targetOffset));
    return () => cancelAnimationFrame(raf);
  }, [targetOffset]);

  const color = colorVarFor(clamped);

  return (
    <div className={cn('inline-flex flex-col items-center', className)} style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <linearGradient id="rd-score-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#rd-score-ring-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="rd-tabular text-[32px] font-bold leading-none text-[var(--text-primary)]">
            {Math.round(clamped)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">/ 100</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">{label}</p>}
    </div>
  );
}
