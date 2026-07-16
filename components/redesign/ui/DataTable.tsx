'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from './EmptyState';
import { TableSkeletonRows } from './Skeleton';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  /** numeric columns are end-aligned for text flow but keep LTR digit direction */
  numeric?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => number | string;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDir) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av).localeCompare(String(bv));
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [rows, sortKey, sortDir, columns]);

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  return (
    <div className={cn('overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-subtle)]', className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-[var(--bg-surface-2)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]',
                  col.numeric ? 'text-end' : 'text-start',
                  col.sortable && 'cursor-pointer select-none hover:text-[var(--text-secondary)]',
                )}
                onClick={() => handleSort(col)}
              >
                <span className={cn('inline-flex items-center gap-1', col.numeric && 'flex-row-reverse')}>
                  {col.header}
                  {col.sortable &&
                    (sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeletonRows rows={5} cols={columns.length} />
          ) : sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState
                  title={emptyTitle ?? 'No data yet'}
                  description={emptyDescription}
                  icon={emptyIcon}
                  compact
                />
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-t border-[var(--border-subtle)] transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-[var(--bg-surface-2)]',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 text-[var(--text-secondary)]', col.numeric ? 'text-end rd-tabular' : 'text-start')}
                  >
                    <span dir={col.numeric ? 'ltr' : undefined} className={col.numeric ? 'inline-block' : undefined}>
                      {col.render(row)}
                    </span>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
