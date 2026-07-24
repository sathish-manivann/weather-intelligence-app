import React from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { getWMOCodeInfo } from '../utils/wmoCodes';
import { formatTemp, degreesToCompass } from '../utils/units';
import * as Icons from 'lucide-react';
import { MapPin, Sunrise, Sunset, Star, Calendar, Clock, ArrowUp, ArrowDown, ShieldAlert } from 'lucide-react';

interface CurrentWeatherHeroProps {
  data: WeatherData;
  units: UserUnits;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  data,
  units,
  isFavorite,
  onToggleFavorite,
}) => {
  const { city, raw } = data;
  const current = raw.current;
  const daily = raw.daily;

  const wmoInfo = getWMOCodeInfo(current.weather_code, current.is_day);

  // Dynamic Lucide icon resolution
  const IconComponent = (Icons as any)[wmoInfo.icon] || Icons.Cloud;

  const currentTempStr = formatTemp(current.temperature_2m, units.temperature);
  const feelsLikeStr = formatTemp(current.apparent_temperature, units.temperature);

  const maxTempStr = daily?.temperature_2m_max?.[0] !== undefined
    ? formatTemp(daily.temperature_2m_max[0], units.temperature)
    : 'N/A';
  const minTempStr = daily?.temperature_2m_min?.[0] !== undefined
    ? formatTemp(daily.temperature_2m_min[0], units.temperature)
    : 'N/A';

  const sunriseTime = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  const sunsetTime = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const fetchedTimeStr = new Date(data.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-gradient-to-br ${wmoInfo.theme.bgGradient} ${wmoInfo.theme.cardBg}`}
    >
      {/* Ambient background glow orb */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Row: Location & Actions */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {city.name}
            </h2>
            <button
              id="btn-toggle-favorite-star"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Star
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'
                }`}
              />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
            <span>{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
            {city.timezone && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
                <Clock className="w-3 h-3 text-sky-300" /> {city.timezone.replace('_', ' ')}
              </span>
            )}
          </p>
        </div>

        {/* Condition Tag & Weather Severity Badge */}
        <div className="flex items-center gap-2">
          {wmoInfo.severity === 'severe' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" /> Severe Weather
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${wmoInfo.theme.badgeBg}`}
          >
            {wmoInfo.description}
          </span>
        </div>
      </div>

      {/* Main Temperature Showcase */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big Temp Display */}
        <div className="md:col-span-7 flex items-center gap-6">
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl shrink-0">
            <IconComponent className={`w-14 h-14 sm:w-16 sm:h-16 ${wmoInfo.theme.textAccent}`} />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
                {currentTempStr}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-1 text-sm text-slate-200">
              <span>
                Feels like <strong className="text-white font-bold">{feelsLikeStr}</strong>
              </span>

              {/* High / Low Badge */}
              <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-black/30 border border-white/10">
                <span className="flex items-center text-rose-300">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> {maxTempStr}
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center text-sky-300">
                  <ArrowDown className="w-3 h-3 mr-0.5" /> {minTempStr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Solar & Day Cycle Card */}
        <div className="md:col-span-5 bg-slate-950/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> Today's Solar Cycle
            </span>
            <span className="text-[10px] text-slate-400">Refreshed {fetchedTimeStr}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <Sunrise className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Sunrise</div>
                <div className="text-xs font-bold text-slate-100">{sunriseTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sunset className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Sunset</div>
                <div className="text-xs font-bold text-slate-100">{sunsetTime}</div>
              </div>
            </div>
          </div>

          {/* Quick wind & humidity highlight */}
          <div className="mt-3 text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-white/5">
            <span>
              Wind: <strong>{current.wind_speed_10m} km/h</strong> ({degreesToCompass(current.wind_direction_10m)})
            </span>
            <span>
              Humidity: <strong>{current.relative_humidity_2m}%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
