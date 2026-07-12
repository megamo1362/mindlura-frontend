import type { Lang } from '@/lib/useGeoLang';
import type { CalendarEvent, EventAnalysisContent, AnalysisScenario } from './types';

const COPY = {
  en: {
    whyMatters: '📌 Why it matters',
    bullish: (country: string) => `📈 Bullish ${country}`,
    bearish: (country: string) => `📉 Bearish ${country}`,
    level: 'Level',
    keyInsight: '⚡ Key Insight',
  },
  fa: {
    whyMatters: '📌 چرا اهمیت دارد',
    bullish: (country: string) => `📈 صعودی ${country}`,
    bearish: (country: string) => `📉 نزولی ${country}`,
    level: 'سطح',
    keyInsight: '⚡ نکته کلیدی',
  },
};

function ScenarioColumn({
  scenario,
  label,
  levelLabel,
  tint,
}: {
  scenario: AnalysisScenario;
  label: string;
  levelLabel: string;
  tint: 'success' | 'danger';
}) {
  const borderColor = tint === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
  const textColor = tint === 'success' ? 'var(--color-success)' : 'var(--color-danger)';
  return (
    <div className="p-3 rounded-lg space-y-2" style={{ border: `1px solid ${borderColor}` }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: textColor }}>{label}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{scenario.probability}</p>
      <div className="space-y-1.5">
        {scenario.pairs.map((p, i) => (
          <div key={`${p.pair}-${i}`} className="text-xs">
            <span className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.pair}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>: {p.outlook}</span>
            <div style={{ color: 'var(--color-text-disabled)' }}>{levelLabel}: {p.level}</div>
          </div>
        ))}
      </div>
      <p className="text-xs italic" style={{ color: 'var(--color-text-secondary)' }}>{scenario.insight}</p>
    </div>
  );
}

/** Inline analysis content (why_matters + bullish/bearish + key_insight) — shared by any
 * expandable panel that needs to render a single event's AI analysis for one language. */
export default function AnalysisPanel({
  event,
  content,
  lang,
}: {
  event: CalendarEvent;
  content: EventAnalysisContent;
  lang: Lang;
}) {
  const t = COPY[lang];
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-cyan)' }}>{t.whyMatters}</p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.why_matters}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <ScenarioColumn scenario={content.bullish} label={t.bullish(event.country)} levelLabel={t.level} tint="success" />
        <ScenarioColumn scenario={content.bearish} label={t.bearish(event.country)} levelLabel={t.level} tint="danger" />
      </div>

      <div className="text-sm pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <span className="font-semibold">{t.keyInsight}:</span>{' '}
        <span style={{ color: 'var(--color-text-secondary)' }}>{content.key_insight}</span>
      </div>
    </div>
  );
}
