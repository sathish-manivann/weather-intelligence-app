import React from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { formatTemp, formatWindSpeed, formatPrecipitation, formatUVIndex, degreesToCompass } from '../utils/units';
import * as Icons from 'lucide-react';
import { X, Sunrise, Sunset, Wind, Sun, CloudRain, ShieldCheck } from 'lucide-react';

interface DailyDetailModalProps {
  dayIndex: number;
  data: WeatherData;
  units: UserUnits;
  onClose: () => void;
}

export const DailyDetailModal: React.FC<DailyDetailModalProps> = ({
  dayIndex,
  data,
  units,
  onClose,
}) => {
  const daily = data.raw.daily;
  const hourly = data.raw.hourly;
  if (!daily || daily.time.length <= dayIndex) return null;

  const dateStr = daily.time[dayIndex];
  const dateObj = new Date(dateStr);
  const dayName = dayIndex === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const maxTemp = daily.temperature_2m_max[dayIndex];
  const minTemp = daily.temperature_2m_min[dayIndex];
  const weatherCode = daily.weather_code[dayIndex];
  const wmoInfo = getWMOCodeInfo(weatherCode, 1);
  const IconComponent = (Icons as any)[wmoInfo.icon] || Icons.Cloud;

  const sunrise = daily.sunrise[dayIndex]
    ? new Date(daily.sunrise[dayIndex]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  const sunset = daily.sunset[dayIndex]
    ? new Date(daily.sunset[dayIndex]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const precipSum = daily.precipitation_sum[dayIndex] ?? 0;
  const precipProbMax = daily.precipitation_probability_max[dayIndex] ?? 0;
  const maxWind = daily.wind_speed_10m_max[dayIndex] ?? 0;
  const maxUV = daily.uv_index_max[dayIndex] ?? 0;
  const uvInfo = formatUVIndex(maxUV);

  // Filter 24 hours corresponding to this day
  const startHourIdx = dayIndex * 24;
  const dayHourly = hourly && hourly.time
    ? hourly.time.slice(startHourIdx, startHourIdx + 24).map((t, idx) => {
        const i = startHourIdx + idx;
        return {
          time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
          temp: hourly.temperature_2m[i],
          precipProb: hourly.precipitation_probability[i] ?? 0,
          wind: hourly.wind_speed_10m[i] ?? 0,
          code: hourly.weather_code[i] ?? 0,
        };
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          id="btn-close-daily-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{dayName}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {fullDate}
              </span>
            </div>
            <p className="text-xs text-sky-300 mt-1 font-semibold">{wmoInfo.description}</p>
          </div>
        </div>

        {/* Metric Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">High / Low</div>
            <div className="text-sm font-bold text-white mt-1">
              <span className="text-rose-400">{formatTemp(maxTemp, units.temperature)}</span> /{' '}
              <span className="text-sky-400">{formatTemp(minTemp, units.temperature)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Rain Probability</div>
            <div className="text-sm font-bold text-cyan-300 mt-1 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" /> {precipProbMax}% ({formatPrecipitation(precipSum, units.precipitation)})
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Peak Wind</div>
            <div className="text-sm font-bold text-sky-300 mt-1 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" /> {formatWindSpeed(maxWind, units.windSpeed)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Max UV Index</div>
            <div className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" /> {maxUV.toFixed(1)} ({uvInfo.level})
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset Row */}
        <div className="flex items-center justify-around p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Sunrise:</span>
            <strong className="text-white">{sunrise}</strong>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Sunset:</span>
            <strong className="text-white">{sunset}</strong>
          </div>
        </div>

        {/* Day Hourly Breakdown */}
        {dayHourly.length > 0 && (
          <div className="overflow-hidden flex-1 flex flex-col">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Hourly Breakdown for {dayName}</h4>
            <div className="overflow-x-auto pb-2 flex gap-2">
              {dayHourly.map((item, idx) => (
                <div
                  key={`day-hourly-${idx}`}
                  className="flex-shrink-0 w-20 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center"
                >
                  <div className="text-[11px] font-bold text-slate-300">{item.time}</div>
                  <div className="text-xs font-extrabold text-white my-1">
                    {formatTemp(item.temp, units.temperature)}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold">{item.precipProb}% rain</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
