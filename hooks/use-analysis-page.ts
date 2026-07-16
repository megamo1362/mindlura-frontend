'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCheckAndRun, useRealtimeAnalysis, useUserFeatures, useFilteredAnalysis } from '@/hooks/use-analysis';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type { Analysis, Trade, OpenPosition } from '@/types';

export type DatePreset = 'all' | 'this_week' | 'this_month' | 'last_month' | '3_months' | '6_months' | '1_year' | 'custom';

export const PRESET_LABELS: Record<DatePreset, { en: string; fa: string }> = {
  all: { en: 'All Time', fa: 'همه' },
  this_week: { en: 'This Week', fa: 'هفته جاری' },
  this_month: { en: 'This Month', fa: 'ماه جاری' },
  last_month: { en: 'Last Month', fa: 'ماه گذشته' },
  '3_months': { en: 'Last 3 Months', fa: '۳ ماه گذشته' },
  '6_months': { en: 'Last 6 Months', fa: '۶ ماه گذشته' },
  '1_year': { en: 'Last Year', fa: 'یک سال گذشته' },
  custom: { en: 'Custom', fa: 'بازه دلخواه' },
};

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getPresetRange(preset: DatePreset): { from: string; to: string } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (preset === 'all' || preset === 'custom') return null;
  if (preset === 'this_week') {
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    return { from: toYMD(monday), to: toYMD(now) };
  }
  if (preset === 'this_month') return { from: toYMD(new Date(now.getFullYear(), now.getMonth(), 1)), to: toYMD(now) };
  if (preset === 'last_month') {
    return {
      from: toYMD(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: toYMD(new Date(now.getFullYear(), now.getMonth(), 0)),
    };
  }
  if (preset === '3_months') { const f = new Date(now); f.setMonth(f.getMonth() - 3); return { from: toYMD(f), to: toYMD(now) }; }
  if (preset === '6_months') { const f = new Date(now); f.setMonth(f.getMonth() - 6); return { from: toYMD(f), to: toYMD(now) }; }
  if (preset === '1_year') { const f = new Date(now); f.setFullYear(f.getFullYear() - 1); return { from: toYMD(f), to: toYMD(now) }; }
  return null;
}

export interface AnalysisPageData {
  balance: number | null;
  equity: number | null;
  analysis: Analysis;
  trades: Trade[];
  openPositions: OpenPosition[];
  snapshotTime: string | null;
  hoursUntilNext: number | null;
  hoursSinceUpdate: number | null;
}

export type AnalysisTabKey = 'summary' | 'trades' | 'time' | 'symbols' | 'equity';

interface UseAnalysisPageOptions {
  id: string;
  isCoachMode: boolean;
}

/**
 * All data-fetching/state/handlers for the account Analysis page, extracted
 * from components/analysis/analysis-page.tsx so the live page and the
 * /redesign preview can share one source of truth instead of diverging.
 */
export function useAnalysisPage({ id, isCoachMode }: UseAnalysisPageOptions) {
  const { t, lang } = useLang();
  const l: 'en' | 'fa' = lang === 'fa' ? 'fa' : 'en';

  const { mutate: checkAndRun, isPending: initialLoading } = useCheckAndRun();
  const { mutate: runRealtime, isPending: realtimeLoading } = useRealtimeAnalysis();
  const { mutate: runFiltered, isPending: filterLoading } = useFilteredAnalysis();
  const { data: features } = useUserFeatures();

  const [allTimeData, setAllTimeData] = useState<AnalysisPageData | null>(null);
  const [data, setData] = useState<AnalysisPageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTabKey>('summary');
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printTabs, setPrintTabs] = useState<Set<AnalysisTabKey>>(
    new Set(['summary', 'trades', 'time', 'symbols', 'equity'] as AnalysisTabKey[]),
  );
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const hasTriggered = useRef(false);

  const formatHours = useCallback(
    (h: number): string => {
      if (h < 0.1) return t.time_just_now;
      if (h < 1) return `${Math.round(h * 60)} ${t.time_min}`;
      return `${h.toFixed(1)} ${t.time_hours}`;
    },
    [t],
  );

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    checkAndRun(id, {
      onSuccess: (snap) => {
        if (snap.has_snapshot && snap.analysis) {
          const d: AnalysisPageData = {
            balance: snap.balance ?? null,
            equity: snap.equity ?? null,
            analysis: snap.analysis,
            trades: snap.trades ?? [],
            openPositions: snap.open_positions ?? [],
            snapshotTime: snap.snapshot_time ?? null,
            hoursUntilNext: snap.hours_until_next ?? null,
            hoursSinceUpdate: snap.hours_since_update ?? null,
          };
          setAllTimeData(d);
          setData(d);
        }
      },
      onError: (err) => {
        setError(err instanceof ApiError ? err.message : t.analysis_error_load);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = useCallback(
    (preset: DatePreset, from: string, to: string) => {
      if (preset === 'all') {
        setData(allTimeData);
        return;
      }

      let fromDate: string;
      let toDate: string;

      if (preset === 'custom') {
        if (!from || !to) return;
        fromDate = from;
        toDate = to;
      } else {
        const range = getPresetRange(preset);
        if (!range) return;
        fromDate = range.from;
        toDate = range.to;
      }

      runFiltered(
        { id, fromDate, toDate },
        {
          onSuccess: (result) => {
            setData((prev) => ({
              balance: prev?.balance ?? null,
              equity: prev?.equity ?? null,
              snapshotTime: prev?.snapshotTime ?? null,
              hoursUntilNext: prev?.hoursUntilNext ?? null,
              hoursSinceUpdate: prev?.hoursSinceUpdate ?? null,
              analysis: result.analysis,
              trades: result.trades,
              openPositions: prev?.openPositions ?? [],
            }));
          },
          onError: () => {
            setDatePreset('all');
            setData(allTimeData);
          },
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allTimeData, id],
  );

  const handleRealtime = useCallback(() => {
    setError(null);
    runRealtime(id, {
      onSuccess: (result) => {
        const d: AnalysisPageData = {
          balance: result.balance ?? null,
          equity: result.equity ?? null,
          analysis: result.analysis,
          trades: result.trades ?? [],
          openPositions: result.open_positions ?? [],
          snapshotTime: null,
          hoursUntilNext: null,
          hoursSinceUpdate: null,
        };
        setAllTimeData(d);
        setData(d);
        setDatePreset('all');
      },
      onError: (err) => {
        setError(err instanceof ApiError ? err.message : t.analysis_error_run);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const togglePrintTab = useCallback((key: AnalysisTabKey) => {
    setPrintTabs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const handlePrintConfirm = useCallback(() => {
    setShowPrintDialog(false);
    setTimeout(() => window.print(), 150);
  }, []);

  const handlePresetChange = useCallback(
    (preset: DatePreset) => {
      setDatePreset(preset);
      if (preset !== 'custom') {
        applyFilter(preset, customFrom, customTo);
      }
    },
    [applyFilter, customFrom, customTo],
  );

  const handleCustomApply = useCallback(() => {
    applyFilter('custom', customFrom, customTo);
  }, [applyFilter, customFrom, customTo]);

  const aiRange = datePreset !== 'all' && datePreset !== 'custom' ? getPresetRange(datePreset) : null;
  const aiFromDate = aiRange?.from ?? (datePreset === 'custom' && customFrom ? customFrom : undefined);
  const aiToDate = aiRange?.to ?? (datePreset === 'custom' && customTo ? customTo : undefined);

  const canRunRealtime = !isCoachMode && (features?.realtime_analysis ?? false);
  const realTrades = (data?.trades ?? []).filter((tr) => [0, 1].includes(tr.type) && tr.volume > 0 && tr.profit !== 0);
  const openCount = data?.openPositions?.length ?? 0;
  const tradesTabCount = realTrades.length + openCount;

  const tabs: { key: AnalysisTabKey; label: string }[] = [
    { key: 'summary', label: t.analysis_tab_summary },
    { key: 'trades', label: `${t.analysis_tab_trades} (${tradesTabCount})` },
    { key: 'time', label: t.analysis_tab_time },
    { key: 'symbols', label: t.analysis_tab_symbols },
    { key: 'equity', label: t.analysis_tab_charts },
  ];

  return {
    l,
    lang,
    t,
    data,
    error,
    activeTab,
    setActiveTab,
    showPrintDialog,
    setShowPrintDialog,
    printTabs,
    togglePrintTab,
    handlePrintConfirm,
    datePreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    handlePresetChange,
    handleCustomApply,
    handleRealtime,
    initialLoading,
    realtimeLoading,
    filterLoading,
    canRunRealtime,
    realTrades,
    openCount,
    tradesTabCount,
    tabs,
    formatHours,
    aiFromDate,
    aiToDate,
  };
}
