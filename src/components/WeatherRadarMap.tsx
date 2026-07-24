import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { Radio, Layers, Play, Pause, ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles } from 'lucide-react';

interface WeatherRadarMapProps {
  data: WeatherData;
}

type MapLayer = 'precipitation' | 'wind' | 'temperature' | 'clouds';

export const WeatherRadarMap: React.FC<WeatherRadarMapProps> = ({ data }) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('precipitation');
  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(10);

  // Animate radar frames (loop 0 -> 1 -> 2 -> 3 -> 0)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const frameLabels = ['10m ago', '5m ago', 'Live Now', '+15m Forecast'];

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Interactive Weather Radar & GIS Layer
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-tight flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Live Radar Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              High-resolution precipitation scan & wind vector simulation • {data.city.name}
            </p>
          </div>
        </div>

        {/* Map Layer Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#0f0f0f] border border-white/5 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveLayer('precipitation')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeLayer === 'precipitation'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeLayer === 'wind'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wind Stream
          </button>
          <button
            onClick={() => setActiveLayer('temperature')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeLayer === 'temperature'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temp Heatmap
          </button>
          <button
            onClick={() => setActiveLayer('clouds')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeLayer === 'clouds'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clouds
          </button>
        </div>
      </div>

      {/* Radar Map Canvas Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-xl bg-[#0a0a0a] border border-white/5 overflow-hidden flex items-center justify-center">
        {/* Grid Mesh Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Latitude/Longitude Radial Grid Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-sky-500/10 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-sky-500/5 border-dashed" />
        </div>

        {/* High-tech Radar Sweep Beam */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(14,165,233,0.25)_360deg)] animate-[spin_4s_linear_infinite]" />
          </div>
        )}

        {/* Dynamic Simulated Radar Clouds / Heatmap Blobs according to frame & activeLayer */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-700">
          {/* Simulated Echo 1 */}
          <div
            className={`absolute rounded-full blur-2xl opacity-60 transition-all duration-700 ${
              activeLayer === 'precipitation'
                ? 'bg-gradient-to-tr from-sky-500/40 via-blue-500/50 to-emerald-400/30'
                : activeLayer === 'wind'
                ? 'bg-gradient-to-r from-teal-500/40 via-cyan-400/40 to-blue-600/30'
                : activeLayer === 'temperature'
                ? 'bg-gradient-to-tr from-amber-500/40 via-rose-500/50 to-orange-400/30'
                : 'bg-gradient-to-br from-slate-400/30 via-slate-600/40 to-white/20'
            }`}
            style={{
              width: `${120 + frame * 15}px`,
              height: `${100 + frame * 12}px`,
              top: `${25 + (frame % 2) * 5}%`,
              left: `${30 + frame * 4}%`,
              transform: `scale(${zoomLevel / 10})`,
            }}
          />

          {/* Simulated Echo 2 */}
          <div
            className={`absolute rounded-full blur-3xl opacity-50 transition-all duration-700 ${
              activeLayer === 'precipitation'
                ? 'bg-gradient-to-tr from-purple-500/40 via-indigo-500/50 to-sky-400/40'
                : activeLayer === 'wind'
                ? 'bg-gradient-to-l from-sky-400/40 via-indigo-500/40 to-blue-500/30'
                : activeLayer === 'temperature'
                ? 'bg-gradient-to-br from-yellow-500/40 via-orange-500/50 to-red-600/30'
                : 'bg-gradient-to-tr from-slate-500/30 via-slate-300/20 to-slate-600/40'
            }`}
            style={{
              width: `${160 - frame * 10}px`,
              height: `${140 - frame * 8}px`,
              top: `${45 - frame * 3}%`,
              left: `${50 - frame * 5}%`,
              transform: `scale(${zoomLevel / 10})`,
            }}
          />
        </div>

        {/* Center Target Marker for Active City */}
        <div className="relative z-20 flex flex-col items-center gap-1">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/60 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-lg shadow-sky-500/50 flex items-center justify-center z-10">
              <MapPin className="w-2.5 h-2.5 text-slate-950" />
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[11px] font-bold text-slate-100 font-mono shadow-xl">
            {data.city.name} ({data.city.latitude.toFixed(2)}°, {data.city.longitude.toFixed(2)}°)
          </span>
        </div>

        {/* Top Right Live Radar Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-[10px] font-mono text-sky-400 font-bold flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {frameLabels[frame]}
          </span>
        </div>

        {/* Bottom Left Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-950/90 border border-white/10 p-2.5 rounded-xl text-[10px] font-mono text-slate-400 space-y-1 backdrop-blur-md">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
            {activeLayer} Intensity
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500/40" /> Light
            <span className="w-3 h-3 rounded bg-blue-600/60" /> Mod
            <span className="w-3 h-3 rounded bg-purple-600/80" /> Heavy
            <span className="w-3 h-3 rounded bg-rose-500/90" /> Severe
          </div>
        </div>

        {/* Bottom Right Map Controls (Play/Pause, Zoom) */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/90 border border-white/10 p-1 rounded-xl backdrop-blur-md shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause radar animation' : 'Play radar loop'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
          </button>
          <div className="w-px h-4 bg-slate-800" />
          <button
            onClick={() => setZoomLevel((z) => Math.min(15, z + 1))}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(5, z - 1))}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(10);
              setFrame(0);
            }}
            title="Reset Map View"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
