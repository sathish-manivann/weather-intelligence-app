import React, { useState } from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { formatTemp, formatPrecipitation } from '../utils/units';
import { DailyDetailModal } from './DailyDetailModal';
import * as Icons from 'lucide-react';
import { Calendar, CloudRain, ChevronRight } from 'lucide-react';

interface Forecast7DaysProps {
  data: WeatherData;
  units: UserUnits;
}

export const Forecast7Days: React.FC<Forecast7DaysProps> = ({ data, units }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const daily = data.raw.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate global min and max temperature across the whole 7-day period for relative temp bar!
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">7-Day Forecast</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Click any day for details</span>
      </div>

      {/* 7 Day List */}
      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((timeStr, idx) => {
          const dateObj = new Date(timeStr);
          const isToday = idx === 0;
          const dayName = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const code = daily.weather_code[idx];
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const precipSum = daily.precipitation_sum?.[idx] ?? 0;

          const wmoInfo = getWMOCodeInfo(code, 1);
          const IconComponent = (Icons as any)[wmoInfo.icon] || Icons.Cloud;

          // Compute width and offset for relative temperature bar
          const leftPercent = ((minTemp - allMin) / tempRange) * 100;
          const widthPercent = Math.max(8, ((maxTemp - minTemp) / tempRange) * 100);

          return (
            <button
              key={`day-${timeStr}`}
              onClick={() => setSelectedDayIdx(idx)}
              className="w-full p-3.5 rounded-2xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 hover:border-sky-500/30 transition-all flex items-center justify-between gap-4 group text-left"
            >
              {/* Day & Date */}
              <div className="w-28 shrink-0">
                <div className={`text-sm font-bold ${isToday ? 'text-sky-400' : 'text-white'}`}>
                  {dayName}
                </div>
                <div className="text-[11px] text-slate-400">{dateFormatted}</div>
              </div>

              {/* Weather Condition Icon & Text */}
              <div className="flex items-center gap-2.5 w-36 shrink-0">
                <div className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-slate-800 transition-colors">
                  <IconComponent className={`w-5 h-5 ${wmoInfo.theme.textAccent}`} />
                </div>
                <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {wmoInfo.shortDescription}
                </span>
              </div>

              {/* Rain Chance % */}
              <div className="w-16 text-center shrink-0">
                {precipProb > 10 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300">
                    <CloudRain className="w-3 h-3" /> {precipProb}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">-</span>
                )}
              </div>

              {/* Relative Temperature Bar */}
              <div className="flex-1 hidden md:flex items-center gap-3">
                <span className="text-xs font-bold text-sky-300 w-10 text-right">
                  {formatTemp(minTemp, units.temperature)}
                </span>

                <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-rose-300 w-10">
                  {formatTemp(maxTemp, units.temperature)}
                </span>
              </div>

              {/* Mobile Min/Max fallback */}
              <div className="md:hidden text-right shrink-0">
                <span className="text-xs font-bold text-rose-300">{formatTemp(maxTemp, units.temperature)}</span>
                <span className="text-xs text-slate-500 mx-1">/</span>
                <span className="text-xs font-semibold text-sky-300">{formatTemp(minTemp, units.temperature)}</span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Modal detail */}
      {selectedDayIdx !== null && (
        <DailyDetailModal
          dayIndex={selectedDayIdx}
          data={data}
          units={units}
          onClose={() => setSelectedDayIdx(null)}
        />
      )}
    </div>
  );
};
