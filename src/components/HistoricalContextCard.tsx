import React from 'react';
import { WeatherData } from '../types/weather';
import { computeHistoricalContext } from '../utils/historicalContext';
import { History, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { formatTemp } from '../utils/units';

interface HistoricalContextCardProps {
  data: WeatherData;
}

export const HistoricalContextCard: React.FC<HistoricalContextCardProps> = ({ data }) => {
  const context = computeHistoricalContext(data.city, data.raw);
  const units = data.units;

  const formattedCurrent = formatTemp(context.currentTemp, units.temperature);
  const formattedBaseline = formatTemp(context.baselineTemp, units.temperature);

  const isWarmer = context.status === 'warmer';
  const isCooler = context.status === 'cooler';

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-all">
      {/* Background Accent Glow */}
      <div
        className={`absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none ${
          isWarmer ? 'bg-amber-500' : isCooler ? 'bg-sky-500' : 'bg-emerald-500'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Historical & Seasonal Context
            </h3>
            <p className="text-[11px] text-slate-500">
              Climatological 30-Year Baseline • {data.city.name} ({context.monthName})
            </p>
          </div>
        </div>

        {/* Departure Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-tight flex items-center gap-1.5 border ${
            isWarmer
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : isCooler
              ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isWarmer && <TrendingUp className="w-3.5 h-3.5" />}
          {isCooler && <TrendingDown className="w-3.5 h-3.5" />}
          {!isWarmer && !isCooler && <Minus className="w-3.5 h-3.5" />}
          {context.formattedDeparture}
        </span>
      </div>

      {/* Main Insight Text */}
      <div className="my-4 p-4 rounded-xl bg-[#0f0f0f] border border-white/5 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200 leading-relaxed">
            {context.insightMessage}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            {context.percentileText}
          </p>
        </div>
      </div>

      {/* Comparison Gauge */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">
            Seasonal Norm ({context.monthName}): <strong className="text-slate-200">{formattedBaseline}</strong>
          </span>
          <span className="text-slate-400">
            Current Recorded: <strong className="text-sky-400">{formattedCurrent}</strong>
          </span>
        </div>

        {/* Visual Progress Bar Gauge */}
        <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          {/* Baseline Marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 shadow-sm"
            style={{ left: '50%' }}
            title={`Baseline: ${formattedBaseline}`}
          />

          {/* Current Temp offset bar */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isWarmer ? 'bg-gradient-to-r from-amber-500 to-rose-500' : isCooler ? 'bg-gradient-to-r from-sky-600 to-sky-400' : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(100, Math.max(10, 50 + context.departure * 5))}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
          <span>Below Average</span>
          <span>Baseline (50%)</span>
          <span>Above Average</span>
        </div>
      </div>
    </div>
  );
};
