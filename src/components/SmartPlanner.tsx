import React from 'react';
import { WeatherIntelligence, ActivityRating } from '../types/weather';
import * as Icons from 'lucide-react';
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Shirt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sun,
  Flame,
} from 'lucide-react';

interface SmartPlannerProps {
  intelligence: WeatherIntelligence;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({ intelligence }) => {
  const {
    overallOutdoorScore,
    comfortLevel,
    clothingAdvice,
    healthWarnings,
    activityRatings,
    bestWindows,
    stargazingQuality,
    laundryDryingTimeHours,
  } = intelligence;

  // Score color badge
  const scoreColor =
    overallOutdoorScore >= 80
      ? 'from-emerald-500 to-teal-600 text-emerald-300 border-emerald-500/30'
      : overallOutdoorScore >= 60
      ? 'from-sky-500 to-blue-600 text-sky-300 border-sky-500/30'
      : overallOutdoorScore >= 40
      ? 'from-amber-500 to-orange-600 text-amber-300 border-amber-500/30'
      : 'from-rose-500 to-red-600 text-rose-300 border-rose-500/30';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl space-y-6">
      {/* Top Banner: Intelligence Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Weather Intelligence & Planning</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                <Sparkles className="w-3 h-3" /> AI Insights
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated outdoor suitability, gear recommendations, and activity windows
            </p>
          </div>
        </div>

        {/* Overall Outdoor Score Card */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scoreColor} flex flex-col items-center justify-center shadow-lg border text-white font-black text-xl`}
          >
            {overallOutdoorScore}
            <span className="text-[9px] font-medium opacity-80">/100</span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Outdoor Index</div>
            <div className="text-sm font-bold text-white mt-0.5">{comfortLevel}</div>
          </div>
        </div>
      </div>

      {/* Weather Warnings / Bulletins if present */}
      {healthWarnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Weather & Health Advisories
          </h4>
          <div className="space-y-2">
            {healthWarnings.map((warning, i) => {
              const bg =
                warning.level === 'alert'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-200';

              return (
                <div
                  key={`warning-${i}`}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs font-medium ${bg}`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{warning.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best Outdoor Windows Today */}
      {bestWindows.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/20">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4" /> Recommended Outdoor Window Today
          </div>
          {bestWindows.map((win, idx) => (
            <div key={`win-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                  {win.startTime} - {win.endTime}
                </span>
                <span className="font-semibold text-white">{win.activity}</span>
              </div>
              <p className="text-slate-300 text-[11px]">{win.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* Clothing & Gear Recommendations */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Shirt className="w-4 h-4 text-sky-400" /> Recommended Dress & Apparel Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {clothingAdvice.map((gear, idx) => (
            <div
              key={`gear-${idx}`}
              className="flex items-center gap-2 text-xs text-slate-200 p-2 rounded-xl bg-slate-900 border border-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{gear}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Suitability Matrix */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Outdoor Activity Suitability
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityRatings.map((act) => {
            const IconComp = (Icons as any)[act.iconName] || Icons.Activity;

            const badgeColor =
              act.label === 'Ideal'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : act.label === 'Good'
                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                : act.label === 'Fair'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

            return (
              <div
                key={`act-${act.name}`}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-900 text-sky-400 border border-slate-800">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-white">{act.name}</span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                      {act.label} ({act.score}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">{act.summary}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{act.tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stargazing & Laundry Footer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Stargazing Quality</div>
            <div className="text-xs font-semibold text-indigo-300 mt-0.5">{stargazingQuality.verdict}</div>
            <p className="text-[11px] text-slate-400 mt-1">{stargazingQuality.notes}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Est. Laundry Drying Time</div>
            <div className="text-xs font-semibold text-cyan-300 mt-0.5">
              {laundryDryingTimeHours >= 90
                ? 'Rain / Wet (Indoor only)'
                : `~${laundryDryingTimeHours} hours outdoors`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {laundryDryingTimeHours < 4 ? 'Optimal breezy & low-humidity drying speed.' : 'Cooler temperatures or cloud cover.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
