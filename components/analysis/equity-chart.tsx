'use client';

import { useState, useRef } from 'react';
import type { EquityCurvePoint } from '@/types';

// Chart constants
const W = 900, H = 280, PL = 68, PR = 20, PT = 24, PB = 38;
const CW = W - PL - PR;
const CH = H - PT - PB;

function sample(data: EquityCurvePoint[], max = 400): EquityCurvePoint[] {
  if (data.length <= max) return data;
  const step = Math.ceil(data.length / max);
  const out = data.filter((_, i) => i % step === 0);
  if (out[out.length - 1] !== data[data.length - 1]) out.push(data[data.length - 1]);
  return out;
}

export function EquityChart({ data }: { data: EquityCurvePoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length < 2) {
    return (
      <div className="card-surface rounded-2xl p-12 text-center">
        <p className="text-[var(--color-text-muted)]">داده‌ای برای Equity Curve وجود ندارد</p>
        <p className="text-sm text-[var(--color-text-muted)]/60 mt-1">آنالیز لحظه‌ای را اجرا کنید</p>
      </div>
    );
  }

  const pts = sample(data);
  const equities = pts.map(p => p.equity);
  const maxEq = Math.max(...equities);
  const minEq = Math.min(...equities);
  const range = maxEq - minEq || 1;
  const balance = equities[0];

  const toX = (i: number) => PL + (i / Math.max(pts.length - 1, 1)) * CW;
  const toY = (eq: number) => PT + ((maxEq - eq) / range) * CH;
  const balanceY = toY(balance);

  const polylinePoints = pts.map((p, i) => `${toX(i)},${toY(p.equity)}`).join(' ');
  const areaFill = `${PL},${balanceY} ${polylinePoints} ${toX(pts.length - 1)},${balanceY}`;

  // Grid lines
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PT + t * CH,
    label: `$${(maxEq - t * range).toFixed(0)}`,
  }));

  // Time axis labels (5 evenly spaced)
  const timeIdxs = [0, Math.floor(pts.length / 4), Math.floor(pts.length / 2), Math.floor(pts.length * 3 / 4), pts.length - 1];

  // Stats
  let peak = equities[0], maxDD = 0;
  equities.forEach(e => { if (e > peak) peak = e; if (peak - e > maxDD) maxDD = peak - e; });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const chartX = Math.max(0, Math.min(svgX - PL, CW));
    const idx = Math.round((chartX / CW) * (pts.length - 1));
    setHoverIdx(Math.max(0, Math.min(idx, pts.length - 1)));
  };

  const hoverPt = hoverIdx !== null ? pts[hoverIdx] : null;
  const hoverX = hoverIdx !== null ? toX(hoverIdx) : 0;
  const hoverY = hoverIdx !== null ? toY(pts[hoverIdx].equity) : 0;
  const hoverAbove = hoverPt ? hoverPt.equity >= balance : false;

  return (
    <div className="space-y-4">
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'بیشترین Equity', value: `$${maxEq.toFixed(2)}`, cls: 'text-emerald-400' },
          { label: 'کمترین Equity', value: `$${minEq.toFixed(2)}`, cls: 'text-red-400' },
          { label: 'Max Drawdown', value: `$${maxDD.toFixed(2)}`, cls: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="card-surface rounded-xl p-3 text-center">
            <p className="text-[10px] text-[var(--color-text-muted)] mb-1">{s.label}</p>
            <p className={`text-sm font-bold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-surface rounded-2xl p-4 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full select-none cursor-crosshair"
          style={{ height: 260 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="ecGradFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06D6A0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06D6A0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {gridY.map((g, i) => (
            <g key={i}>
              <line x1={PL} y1={g.y} x2={W - PR} y2={g.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={PL - 8} y={g.y + 4} fill="#4a6a80" fontSize="9" textAnchor="end">{g.label}</text>
            </g>
          ))}

          {/* Balance baseline */}
          <line
            x1={PL} y1={balanceY} x2={W - PR} y2={balanceY}
            stroke="rgba(0,212,255,0.35)" strokeWidth="1" strokeDasharray="5,3"
          />
          <text x={PL - 8} y={balanceY + 4} fill="#00d4ff" fontSize="8" textAnchor="end">B</text>

          {/* Area fill */}
          <polygon points={areaFill} fill="url(#ecGradFill)" />

          {/* Line — individual colored segments */}
          {pts.slice(1).map((p, i) => (
            <line
              key={i}
              x1={toX(i)} y1={toY(pts[i].equity)}
              x2={toX(i + 1)} y2={toY(p.equity)}
              stroke={p.equity >= balance ? '#06D6A0' : '#ef4444'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ))}

          {/* Time axis */}
          {timeIdxs.filter(i => pts[i]).map((i) => (
            <text key={i} x={toX(i)} y={H - 8} fill="#4a6a80" fontSize="8" textAnchor="middle">
              {pts[i].time.length > 10 ? pts[i].time.slice(0, 10) : pts[i].time}
            </text>
          ))}

          {/* Hover crosshair + dot */}
          {hoverIdx !== null && hoverPt && (
            <>
              <line
                x1={hoverX} y1={PT} x2={hoverX} y2={H - PB}
                stroke="rgba(0,212,255,0.25)" strokeWidth="1" strokeDasharray="3,2"
              />
              <circle
                cx={hoverX} cy={hoverY} r="4.5"
                fill={hoverAbove ? '#06D6A0' : '#ef4444'}
                stroke="rgba(0,0,0,0.6)" strokeWidth="1.5"
              />
            </>
          )}
        </svg>

        {/* Floating tooltip */}
        {hoverIdx !== null && hoverPt && (
          <div className="absolute top-5 right-5 pointer-events-none">
            <div className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 shadow-xl text-xs min-w-[130px]">
              <p className="text-[var(--color-text-muted)] mb-1">{hoverPt.time.slice(0, 16)}</p>
              <p className={`font-bold text-base ${hoverAbove ? 'text-emerald-400' : 'text-red-400'}`}>
                ${hoverPt.equity.toFixed(2)}
              </p>
              {hoverPt.floating_pnl !== 0 && (
                <p className="text-[var(--color-text-muted)] mt-0.5 text-[10px]">
                  Float:{' '}
                  <span className={hoverPt.floating_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    ${hoverPt.floating_pnl.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
