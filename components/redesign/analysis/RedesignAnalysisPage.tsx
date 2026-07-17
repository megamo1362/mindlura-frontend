'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Printer, Zap } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Tabs } from '@/components/redesign/ui/Tabs';
import { Button } from '@/components/redesign/ui/Button';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { OverviewTab } from './OverviewTab';
import { DateRangeFilter } from './DateRangeFilter';
import { PrintDialog } from './PrintDialog';
import { TradesTable } from '@/components/analysis/trades-table';
import { TimeAnalysis } from '@/components/analysis/time-analysis';
import { SymbolAnalysis } from '@/components/analysis/symbol-analysis';
import { ChartTabs } from '@/components/analysis/chart-tabs';
import { SessionAnalysis } from '@/components/analysis/session-analysis';
import { ParetoAnalysis } from '@/components/analysis/pareto-analysis';
import { EntryExitQuality } from '@/components/analysis/entry-exit-quality';
import { CostAnalysis } from '@/components/analysis/cost-analysis';
import { TradingStyle } from '@/components/analysis/trading-style';
import { useAnalysisPage, type AnalysisTabKey } from '@/hooks/use-analysis-page';
import { useLang } from '@/app/i18n/LangContext';
import { BarChart2 } from 'lucide-react';

type RedesignTabKey = AnalysisTabKey | 'sessions' | 'costs';

export function RedesignAnalysisPage({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const isCoachMode = searchParams?.get('coach') === 'true';
  const { t, lang } = useLang();

  const {
    data,
    error,
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
    tabs: baseTabs,
    formatHours,
    aiFromDate,
    aiToDate,
  } = useAnalysisPage({ id, isCoachMode });

  // Consolidates every mid-page menu from the live page (main content tabs +
  // session/pareto/entry-exit/cost/style sections that used to render as a
  // flat always-on stack) into ONE tab row. See go-live checklist item on
  // the Account Analysis page for the before/after summary.
  const tabItems = [
    { key: 'summary' as RedesignTabKey, label: t.analysis_tab_summary },
    ...baseTabs.filter((tb) => tb.key !== 'summary').map((tb) => ({ key: tb.key as RedesignTabKey, label: tb.label })),
    { key: 'sessions' as RedesignTabKey, label: lang === 'fa' ? 'جلسات' : 'Sessions' },
    { key: 'costs' as RedesignTabKey, label: lang === 'fa' ? 'هزینه‌ها' : 'Costs' },
  ];

  // Local tab-selection state — deliberately independent of the hook's data-
  // fetching state. Every section's data is already present in `data.analysis`
  // once loaded, so switching tabs here is presentation-only and never
  // triggers a refetch (per the brief's "must not reload data" requirement).
  const [uiTab, setUiTab] = useState<RedesignTabKey>('summary');

  return (
    <>
      <PrintDialog
        open={showPrintDialog}
        tabs={baseTabs}
        selected={printTabs}
        onToggle={togglePrintTab}
        onCancel={() => setShowPrintDialog(false)}
        onConfirm={handlePrintConfirm}
      />

      <div className="space-y-5">
        <PageHeader
          breadcrumb={
            <Link href="/redesign/dashboard" className="inline-flex items-center gap-1 hover:text-[var(--text-secondary)]">
              <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              {t.nav_accounts}
            </Link>
          }
          title={
            <span className="flex items-center gap-2">
              {t.analysis_account_title}
              <span className="rd-tabular text-sm font-normal text-[var(--text-muted)]">#{id}</span>
            </span>
          }
          description={
            data?.snapshotTime && data.hoursSinceUpdate !== null ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {t.analysis_update_ago(formatHours(data.hoursSinceUpdate))}
                {data.hoursUntilNext !== null && ` · ${t.analysis_next_in(formatHours(data.hoursUntilNext))}`}
              </span>
            ) : undefined
          }
          actions={
            <>
              {canRunRealtime && (
                <Button variant="primary" size="sm" onClick={handleRealtime} loading={realtimeLoading}>
                  <Zap className="h-3.5 w-3.5" />
                  {t.analysis_realtime_btn}
                </Button>
              )}
              {data && (
                <Button variant="secondary" size="sm" onClick={() => setShowPrintDialog(true)}>
                  <Printer className="h-3.5 w-3.5" />
                  {lang === 'fa' ? 'خروجی PDF' : 'Export PDF'}
                </Button>
              )}
            </>
          }
        />

        {error && (
          <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
            {error}
          </div>
        )}

        {initialLoading && !data && <StatCardSkeletonRow count={4} />}

        {!initialLoading && !data && !error && (
          <EmptyState
            icon={<BarChart2 className="h-5 w-5" />}
            title={t.analysis_no_snapshot}
            description={canRunRealtime ? t.analysis_realtime_hint : undefined}
          />
        )}

        {data && (
          <>
            {/* ONE sticky secondary nav for the whole page */}
            <div className="sticky top-16 z-20 -mx-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 px-4 backdrop-blur-md md:-mx-6 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3 py-2">
                <Tabs tabs={tabItems} activeKey={uiTab} onChange={(k) => setUiTab(k as RedesignTabKey)} className="border-b-0" />
                <DateRangeFilter
                  datePreset={datePreset}
                  customFrom={customFrom}
                  customTo={customTo}
                  onCustomFromChange={setCustomFrom}
                  onCustomToChange={setCustomTo}
                  onPresetChange={handlePresetChange}
                  onCustomApply={handleCustomApply}
                  filterLoading={filterLoading}
                  matchedTradeCount={realTrades.length}
                />
              </div>
            </div>

            {!data.analysis.has_data ? (
              <EmptyState title={data.analysis.message ?? t.analysis_no_data} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={uiTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rd-analyze-legacy space-y-5"
                >
                  {uiTab === 'summary' && (
                    <OverviewTab
                      analysis={data.analysis}
                      warnings={data.analysis.warnings ?? []}
                      accountId={id}
                      isCoachMode={isCoachMode}
                      aiFromDate={aiFromDate}
                      aiToDate={aiToDate}
                    />
                  )}

                  {uiTab === 'trades' && (
                    <TradesTable trades={data.trades} openPositions={data.openPositions} accountId={id} showJournal={!isCoachMode} />
                  )}

                  {uiTab === 'time' && <TimeAnalysis data={data.analysis.time_analysis ?? []} />}

                  {uiTab === 'symbols' && <SymbolAnalysis data={data.analysis.symbol_analysis ?? []} />}

                  {uiTab === 'equity' && <ChartTabs accountId={id} />}

                  {uiTab === 'sessions' && (
                    <div className="space-y-5">
                      {data.analysis.session_analysis && <SessionAnalysis data={data.analysis.session_analysis} />}
                      {data.analysis.pareto_analysis && <ParetoAnalysis data={data.analysis.pareto_analysis} />}
                      {data.analysis.entry_exit_quality && <EntryExitQuality data={data.analysis.entry_exit_quality} />}
                    </div>
                  )}

                  {uiTab === 'costs' && (
                    <div className="space-y-5">
                      {data.analysis.cost_analysis && <CostAnalysis data={data.analysis.cost_analysis} />}
                      {data.analysis.trading_style && <TradingStyle data={data.analysis.trading_style} />}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Print-only: unlike the live page, every section here lives
                behind a tab, so on `window.print()` (from PrintDialog's
                onConfirm) only the active tab would otherwise be in the DOM.
                This block reproduces the live page's full-report print
                output — the always-shown sections plus whichever of the 5
                original picker sections the user checked. */}
            {data.analysis.has_data && (
              <div className="rd-analyze-legacy hidden space-y-5 print:block">
                {data.analysis.session_analysis && <SessionAnalysis data={data.analysis.session_analysis} />}
                {data.analysis.pareto_analysis && <ParetoAnalysis data={data.analysis.pareto_analysis} />}
                {data.analysis.entry_exit_quality && <EntryExitQuality data={data.analysis.entry_exit_quality} />}
                {data.analysis.cost_analysis && <CostAnalysis data={data.analysis.cost_analysis} />}
                {data.analysis.trading_style && <TradingStyle data={data.analysis.trading_style} />}
                {printTabs.has('summary') && data.analysis.summary && (
                  <OverviewTab
                    analysis={data.analysis}
                    warnings={data.analysis.warnings ?? []}
                    accountId={id}
                    isCoachMode={isCoachMode}
                    aiFromDate={aiFromDate}
                    aiToDate={aiToDate}
                  />
                )}
                {printTabs.has('trades') && (
                  <TradesTable trades={data.trades} openPositions={data.openPositions} accountId={id} showJournal={!isCoachMode} />
                )}
                {printTabs.has('time') && <TimeAnalysis data={data.analysis.time_analysis ?? []} />}
                {printTabs.has('symbols') && <SymbolAnalysis data={data.analysis.symbol_analysis ?? []} />}
                {printTabs.has('equity') && <ChartTabs accountId={id} />}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
