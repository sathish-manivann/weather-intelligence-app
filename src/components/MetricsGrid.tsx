import React from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import {
  formatWindSpeed,
  degreesToCompass,
  formatUVIndex,
  formatVisibility,
  formatPressure,
  formatHumidity,
  formatPrecipitation,
} from '../utils/units';
import {
  Sun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Cloud,
  CloudRain,
  Compass,
  AlertTriangle,
} from 'lucide-react';

interface MetricsGridProps {
  data: WeatherData;
  units: UserUnits;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data, units }) => {
  const current = data.raw.current;
  const hourly = data.raw.hourly;
  const daily = data.raw.daily;

  const uvInfo = formatUVIndex(current.uv_index);
  const humidityInfo = formatHumidity(current.relative_humidity_2m);
  const windCompass = degreesToCompass(current.wind_direction_10m);

  // Precipitation probability for today (from daily or first hourly)
  const maxPrecipProb = daily?.precipitation_probability_max?.[0] ?? hourly?.precipitation_probability?.[0] ?? 0;
  const precipSum = daily?.precipitation_sum?.[0] ?? current.precipitation ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. UV Index Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> UV Index
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${uvInfo.color}`}>
              {uvInfo.level}
            </span>
          </div>

          <div className="text-3xl font-extrabold text-white my-1">
            {current.uv_index.toFixed(1)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ 11+</span>
          </div>
        </div>

        {/* UV Gauge Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (current.uv_index / 11) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{uvInfo.advice}</p>
        </div>
      </div>

      {/* 2. Wind & Gusts Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Wind & Gusts
            </span>
            <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" /> {windCompass} ({current.wind_direction_10m}°)
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white my-1">
            {formatWindSpeed(current.wind_speed_10m, units.windSpeed)}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Wind Gusts:</span>
          <strong className="text-slate-200">
            {formatWindSpeed(current.wind_gusts_10m, units.windSpeed)}
          </strong>
        </div>
      </div>

      {/* 3. Humidity & Dew Point */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" /> Humidity
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {humidityInfo.label}
            </span>
          </div>

          <div className="text-3xl font-extrabold text-white my-1">
            {current.relative_humidity_2m}%
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Dew Point:</span>
          <strong className="text-slate-200">
            {hourly?.dew_point_2m?.[0] !== undefined
              ? `${Math.round(hourly.dew_point_2m[0])}°C`
              : 'N/A'}
          </strong>
        </div>
      </div>

      {/* 4. Rain & Precipitation Probability */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" /> Rain Chance
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {maxPrecipProb}% chance
            </span>
          </div>

          <div className="text-3xl font-extrabold text-white my-1">
            {formatPrecipitation(precipSum, units.precipitation)}
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, maxPrecipProb)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Expected total volume for today.
          </p>
        </div>
      </div>

      {/* 5. Atmospheric Pressure */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-400" /> Barometric Pressure
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white my-1">
            {formatPressure(current.pressure_msl)}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          Surface pressure: <strong>{formatPressure(current.surface_pressure)}</strong>
        </div>
      </div>

      {/* 6. Visibility */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" /> Visibility
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white my-1">
            {hourly?.visibility?.[0] !== undefined
              ? formatVisibility(hourly.visibility[0])
              : '10.0 km'}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          {hourly?.visibility?.[0] && hourly.visibility[0] >= 8000
            ? 'Clear view ahead'
            : 'Hazy or reduced visibility'}
        </div>
      </div>

      {/* 7. Cloud Cover */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-slate-300" /> Cloud Coverage
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white my-1">
            {current.cloud_cover}%
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-300 rounded-full transition-all duration-500"
              style={{ width: `${current.cloud_cover}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {current.cloud_cover < 20 ? 'Clear sky' : current.cloud_cover < 70 ? 'Partly cloudy' : 'Overcast'}
          </p>
        </div>
      </div>

      {/* 8. Air & Comfort Overview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-2">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-indigo-400" /> Outdoor Comfort
            </span>
          </div>

          <div className="text-xl font-bold text-white my-1">
            {humidityInfo.desc}
          </div>
        </div>

        <div className="mt-3 text-[11px] text-indigo-200">
          Air feels balanced and suitable for typical outdoor routines.
        </div>
      </div>
    </div>
  );
};
