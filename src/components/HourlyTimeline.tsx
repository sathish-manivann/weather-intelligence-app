import React, { useState } from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { formatTemp, formatWindSpeed } from '../utils/units';
import * as Icons from 'lucide-react';
import { Clock, Umbrella, Wind, Thermometer, ChevronLeft, ChevronRight } from 'lucide-react';

interface HourlyTimelineProps {
  data: WeatherData;
  units: UserUnits;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ data, units }) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'precip' | 'wind'>('temp');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hourly = data.raw.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take the next 24 hours starting from current hour
  const items = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const dateObj = new Date(timeStr);
    const timeFormatted = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });
    const temp = hourly.temperature_2m[idx];
    const precipProb = hourly.precipitation_probability[idx] ?? 0;
    const wind = hourly.wind_speed_10m[idx] ?? 0;
    const code = hourly.weather_code[idx] ?? 0;
    const isDay = hourly.is_day?.[idx] ?? (dateObj.getHours() >= 6 && dateObj.getHours() <= 20 ? 1 : 0);

    const wmoInfo = getWMOCodeInfo(code, isDay);

    return {
      idx,
      timeFormatted,
      temp,
      precipProb,
      wind,
      code,
      wmoInfo,
    };
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
      {/* Header & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Hourly Outlook</h3>
          <span className="text-xs text-slate-400 font-normal ml-1">Next 24 Hours</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            id="btn-hourly-metric-temp"
            onClick={() => setActiveMetric('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'temp'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp
          </button>
          <button
            id="btn-hourly-metric-precip"
            onClick={() => setActiveMetric('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'precip'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Umbrella className="w-3.5 h-3.5" /> Rain %
          </button>
          <button
            id="btn-hourly-metric-wind"
            onClick={() => setActiveMetric('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === 'wind'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>
        </div>
      </div>

      {/* Timeline Scroll Box with Navigation Arrows */}
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 rounded-full bg-slate-800/90 text-slate-200 hover:bg-slate-700 flex items-center justify-center border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x"
        >
          {items.map((item) => {
            const IconComponent = (Icons as any)[item.wmoInfo.icon] || Icons.Cloud;
            const isNow = item.idx === 0;

            return (
              <div
                key={`hourly-${item.idx}`}
                className={`flex-shrink-0 w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between gap-3 text-center transition-all duration-200 border snap-start ${
                  isNow
                    ? 'bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Time Label */}
                <div
                  className={`text-xs font-bold ${
                    isNow ? 'text-sky-300' : 'text-slate-300'
                  }`}
                >
                  {item.timeFormatted}
                </div>

                {/* Condition Icon */}
                <div className={`p-2 rounded-xl ${isNow ? 'bg-sky-500/20' : 'bg-slate-900'}`}>
                  <IconComponent
                    className={`w-6 h-6 ${item.wmoInfo.theme.textAccent}`}
                  />
                </div>

                {/* Primary Metric based on activeMetric */}
                {activeMetric === 'temp' && (
                  <div>
                    <div className="text-base font-extrabold text-white">
                      {formatTemp(item.temp, units.temperature)}
                    </div>
                    {item.precipProb > 20 && (
                      <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                        {item.precipProb}% rain
                      </div>
                    )}
                  </div>
                )}

                {activeMetric === 'precip' && (
                  <div>
                    <div className="text-sm font-extrabold text-cyan-300">
                      {item.precipProb}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {formatTemp(item.temp, units.temperature)}
                    </div>
                  </div>
                )}

                {activeMetric === 'wind' && (
                  <div>
                    <div className="text-xs font-bold text-sky-300">
                      {formatWindSpeed(item.wind, units.windSpeed)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {formatTemp(item.temp, units.temperature)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 rounded-full bg-slate-800/90 text-slate-200 hover:bg-slate-700 flex items-center justify-center border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
