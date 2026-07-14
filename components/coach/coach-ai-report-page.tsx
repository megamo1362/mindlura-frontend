'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Clock, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/shared';
import { useLang } from '@/app/i18n/LangContext';
import {
  useAIReportStatus, useLatestAIReport, useRequestAIReport, useCoachEvents,
} from '@/hooks/use-coach';
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
      html.push(`<h${level} class="font-bold text-[var(--color-text-primary)] mt-4 mb-2 first:mt-0">${inlineMd(heading[2])}</h${level}>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { html.push('<ul class="list-disc pr-5 space-y-1 my-2">'); inList = true; }
      html.push(`<li>${inlineMd(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }
    closeList();
    html.push(`<p class="leading-relaxed my-2">${inlineMd(line)}</p>`);
  }
  closeList();
  return html.join('\n');
}

export function CoachAIReportPage() {
  const { t, lang } = useLang();
  const l = (lang === 'fa' ? 'fa' : 'en') as 'en' | 'fa';
  const isRTL = l === 'fa';

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
      setReport({
        report_en: latest.report_en,
        report_fa: latest.report_fa,
        generated_at: latest.generated_at,
        client_count: null,
      });
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
        setReport({
          report_en: data.report_en,
          report_fa: data.report_fa,
          generated_at: data.generated_at,
          client_count: data.client_count,
        });
        setReportLang(l);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.ai_daily_report}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.ai_daily_report_desc}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
            canRequest
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-white/[0.04] text-[var(--color-text-muted)] border-[var(--color-border)]'
          }`}
        >
          {canRequest ? t.report_ready : `${t.report_used_today} — ${t.available_tomorrow}`}
        </span>
      </div>

      {/* Request panel */}
      <motion.div
        className="card-surface rounded-2xl p-5 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          {t.advanced_filters}
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  type="number"
                  label={t.max_drawdown_filter}
                  value={maxDrawdown}
                  onChange={(e) => setMaxDrawdown(e.target.value)}
                  placeholder="15"
                />
                <Input
                  type="number"
                  label={t.min_rr_filter}
                  value={minRR}
                  onChange={(e) => setMinRR(e.target.value)}
                  placeholder="1.5"
                  step="0.1"
                />
                <Input
                  type="number"
                  label={t.min_win_rate_filter}
                  value={minWinRate}
                  onChange={(e) => setMinWinRate(e.target.value)}
                  placeholder="50"
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                    {t.filter_by_event}
                  </label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="input-dark rounded-xl px-3 py-2 text-sm w-full h-10"
                  >
                    <option value="">{t.all_events}</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4">
                <label className="text-sm text-[var(--color-text-secondary)]">{t.include_inactive}</label>
                <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleGenerate}
          loading={isPending}
          disabled={isPending || !canRequest}
          title={!canRequest ? `${t.report_used_today} — ${t.available_tomorrow}` : undefined}
        >
          {isPending ? null : !canRequest ? (
            <>
              <Lock className="w-3.5 h-3.5 ml-1.5" />
              {t.generate_report}
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 ml-1.5" />
              {t.generate_report}
            </>
          )}
        </Button>

        {isPending && (
          <div className="flex items-center justify-center gap-2 py-2 text-[var(--color-text-muted)]">
            <motion.div
              className="w-4 h-4 border-2 border-[var(--color-cyan)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm"
              >
                {t[LOADING_MESSAGE_KEYS[messageIdx]]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Report display */}
      {!report && !isPending && (
        <EmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title={t.no_report_yet}
          description={t.no_report_description}
        />
      )}

      {report && (
        <motion.div
          className="card-surface rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              {report.generated_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.report_generated_at(new Date(report.generated_at).toLocaleString(l === 'fa' ? 'fa-IR' : 'en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }))}
                </span>
              )}
              {report.client_count !== null && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {t.clients_analyzed(report.client_count)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] p-0.5">
              <button
                type="button"
                onClick={() => setReportLang('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  reportLang === 'en' ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setReportLang('fa')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  reportLang === 'fa' ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                FA
              </button>
            </div>
          </div>

          <div
            className="px-5 py-4 text-sm text-[var(--color-text-secondary)]"
            dir={reportLang === 'fa' ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(reportLang === 'fa' ? report.report_fa : report.report_en),
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
