'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock, Lock, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { Skeleton } from '@/components/redesign/ui/Skeleton';
import {
  useAIReportStatus, useLatestAIReport, useRequestAIReport, useCoachEvents,
} from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachAIReportFilters } from '@/types';

const LOADING_MESSAGE_KEYS = [
  'analyzing_clients', 'analyzing_performance', 'generating_insights', 'translating_report',
] as const;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderMarkdown(md: string): string {
  const lines = escapeHtml(md).split('\n');
  const html: string[] = [];
  let inList = false;
  const closeList = () => {
    if (inList) { html.push('</ul>'); inList = false; }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      html.push(`<h${level} class="font-bold text-[var(--text-primary)] mt-4 mb-2 first:mt-0">${inlineMd(heading[2])}</h${level}>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { html.push('<ul class="list-disc ps-5 space-y-1 my-2">'); inList = true; }
      html.push(`<li>${inlineMd(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }
    closeList();
    html.push(`<p class="leading-relaxed my-2">${inlineMd(line)}</p>`);
  }
  closeList();
  return html.join('\n');
}

export function RedesignCoachAIReportPage() {
  const { t, lang } = useLang();
  const l = (lang === 'fa' ? 'fa' : 'en') as 'en' | 'fa';

  const { data: status } = useAIReportStatus();
  const { data: latest } = useLatestAIReport();
  const { data: events = [] } = useCoachEvents();
  const { mutate: requestReport, isPending } = useRequestAIReport();

  const [showFilters, setShowFilters] = useState(false);
  const [maxDrawdown, setMaxDrawdown] = useState('');
  const [minRR, setMinRR] = useState('');
  const [minWinRate, setMinWinRate] = useState('');
  const [eventId, setEventId] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [reportLang, setReportLang] = useState<'en' | 'fa'>(l);
  const [messageIdx, setMessageIdx] = useState(0);

  const [report, setReport] = useState<{
    report_en: string; report_fa: string; generated_at: string | null; client_count: number | null;
  } | null>(null);

  useEffect(() => {
    if (latest && !report) {
      setReport({ report_en: latest.report_en, report_fa: latest.report_fa, generated_at: latest.generated_at, client_count: null });
    }
  }, [latest, report]);

  useEffect(() => {
    if (!isPending) { setMessageIdx(0); return; }
    const id = setInterval(() => setMessageIdx((i) => (i + 1) % LOADING_MESSAGE_KEYS.length), 3000);
    return () => clearInterval(id);
  }, [isPending]);

  const canRequest = status?.can_request ?? true;

  const handleGenerate = () => {
    const filters: CoachAIReportFilters = {
      max_drawdown: maxDrawdown ? Number(maxDrawdown) : undefined,
      min_rr_ratio: minRR ? Number(minRR) : undefined,
      min_win_rate: minWinRate ? Number(minWinRate) : undefined,
      event_id: eventId ? Number(eventId) : undefined,
      include_inactive: includeInactive,
    };
    requestReport(filters, {
      onSuccess: (data) => {
        setReport({ report_en: data.report_en, report_fa: data.report_fa, generated_at: data.generated_at, client_count: data.client_count });
        setReportLang(l);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.ai_daily_report}
        description={t.ai_daily_report_desc}
        actions={<Badge variant={canRequest ? 'profit' : 'neutral'}>{canRequest ? t.report_ready : `${t.report_used_today} — ${t.available_tomorrow}`}</Badge>}
      />

      <Card className="space-y-4">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          {t.advanced_filters}
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">{t.max_drawdown_filter}</label>
                  <input
                    type="number"
                    value={maxDrawdown}
                    onChange={(e) => setMaxDrawdown(e.target.value)}
                    placeholder="15"
                    className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">{t.min_rr_filter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minRR}
                    onChange={(e) => setMinRR(e.target.value)}
                    placeholder="1.5"
                    className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">{t.min_win_rate_filter}</label>
                  <input
                    type="number"
                    value={minWinRate}
                    onChange={(e) => setMinWinRate(e.target.value)}
                    placeholder="50"
                    className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-muted)]">{t.filter_by_event}</label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">{t.all_events}</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4">
                <label className="text-sm text-[var(--text-secondary)]">{t.include_inactive}</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeInactive}
                  onClick={() => setIncludeInactive((v) => !v)}
                  className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors"
                  style={{ background: includeInactive ? 'var(--accent)' : 'var(--bg-surface-2)' }}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${includeInactive ? 'end-0.5' : 'start-0.5'}`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="primary"
          onClick={handleGenerate}
          loading={isPending}
          disabled={isPending || !canRequest}
          title={!canRequest ? `${t.report_used_today} — ${t.available_tomorrow}` : undefined}
        >
          {isPending ? null : !canRequest ? <Lock className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          {t.generate_report}
        </Button>

        {isPending && (
          <div className="flex items-center justify-center gap-2 py-2 text-[var(--text-muted)]">
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-[var(--accent)] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <AnimatePresence mode="wait">
              <motion.span key={messageIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-sm">
                {t[LOADING_MESSAGE_KEYS[messageIdx]]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </Card>

      {!report && !isPending && (
        <EmptyState icon={<Sparkles className="h-5 w-5" />} title={t.no_report_yet} description={t.no_report_description} />
      )}

      {!report && isPending && (
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      )}

      {report && (
        <Card
          padded={false}
          title={
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
              {report.generated_at && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t.report_generated_at(new Date(report.generated_at).toLocaleString(l === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }))}
                </span>
              )}
              {report.client_count !== null && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {t.clients_analyzed(report.client_count)}
                </span>
              )}
            </div>
          }
          action={
            <div className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] p-0.5">
              <button
                type="button"
                onClick={() => setReportLang('en')}
                className={`rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors ${reportLang === 'en' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setReportLang('fa')}
                className={`rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors ${reportLang === 'fa' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
              >
                FA
              </button>
            </div>
          }
        >
          <div
            className="px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]"
            dir={reportLang === 'fa' ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(reportLang === 'fa' ? report.report_fa : report.report_en) }}
          />
        </Card>
      )}
    </div>
  );
}
