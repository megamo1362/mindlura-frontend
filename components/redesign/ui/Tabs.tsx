'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  /** Renders as a small segmented control instead of the full underline tab row — for subordinate, page-section-level switchers (e.g. chart timeframes). */
  segmented?: boolean;
}

export function Tabs({ tabs, activeKey, onChange, className, segmented = false }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeKey]);

  if (segmented) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-0.5',
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors duration-150',
              activeKey === tab.key
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-[var(--border-subtle)]',
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            ref={active ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative flex-shrink-0 px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap',
              active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ms-1.5 rd-tabular text-xs text-[var(--text-muted)]">({tab.count})</span>
            )}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />}
          </button>
        );
      })}
    </div>
  );
}
