import React, { useState } from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { convertTemperature, convertWindSpeed, convertPrecipitation } from '../utils/units';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineChart, Thermometer, CloudRain, Wind, Sun, TrendingUp } from 'lucide-react';

interface InteractiveChartsProps {
  data: WeatherData;
  units: UserUnits;
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ data, units }) => {
  const [activeChart, setActiveChart] = useState<'temp' | 'precip' | 'wind' | 'uv'>('temp');

  const hourly = data.raw.hourly;
  if (!hourly || !hourly.time) return null;

  // Format 24 hour data for Recharts
  const chartData = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const dateObj = new Date(timeStr);
    const timeFormatted = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });

    const rawTemp = hourly.temperature_2m[idx];
    const rawApparent = hourly.apparent_temperature[idx];
    const rawWind = hourly.wind_speed_10m[idx];
    const rawPrecip = hourly.precipitation[idx] ?? 0;

    return {
      time: timeFormatted,
      temp: convertTemperature(rawTemp, units.temperature),
      apparent: convertTemperature(rawApparent, units.temperature),
      precipProb: hourly.precipitation_probability[idx] ?? 0,
      precipMm: convertPrecipitation(rawPrecip, units.precipitation).value,
      windSpeed: convertWindSpeed(rawWind, units.windSpeed).value,
      uvIndex: Math.round((hourly.uv_index[idx] ?? 0) * 10) / 10,
    };
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
      {/* Chart Header & Tab Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Weather Analytics</h3>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 flex-wrap gap-1">
          <button
            id="btn-chart-tab-temp"
            onClick={() => setActiveChart('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeChart === 'temp'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp
          </button>

          <button
            id="btn-chart-tab-precip"
            onClick={() => setActiveChart('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeChart === 'precip'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain
          </button>

          <button
            id="btn-chart-tab-wind"
            onClick={() => setActiveChart('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeChart === 'wind'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>

          <button
            id="btn-chart-tab-uv"
            onClick={() => setActiveChart('uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeChart === 'uv'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV Index
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="apparentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="temp"
                name={`Actual Temp (°${units.temperature === 'fahrenheit' ? 'F' : 'C'})`}
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="apparent"
                name={`Feels Like (°${units.temperature === 'fahrenheit' ? 'F' : 'C'})`}
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#apparentGradient)"
              />
            </AreaChart>
          ) : activeChart === 'precip' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="precipProb"
                name="Rain Probability (%)"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : activeChart === 'wind' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                name={`Wind Speed (${units.windSpeed})`}
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="uvIndex"
                name="UV Index Exposure"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#uvGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
