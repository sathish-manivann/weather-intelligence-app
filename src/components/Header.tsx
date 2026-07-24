import React from 'react';
import { UserUnits } from '../types/weather';
import { Compass, Sparkles, RefreshCw, Bookmark, MapPin, Download, Keyboard, WifiOff, Database } from 'lucide-react';

interface HeaderProps {
  units: UserUnits;
  onUpdateUnits: (newUnits: Partial<UserUnits>) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onGetCurrentLocation: () => void;
  onRefresh: () => void;
  onOpenExport?: () => void;
  onOpenHotkeys?: () => void;
  isRefreshing: boolean;
  isLocating: boolean;
  isCached?: boolean;
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  units,
  onUpdateUnits,
  favoritesCount,
  onOpenFavorites,
  onGetCurrentLocation,
  onRefresh,
  onOpenExport,
  onOpenHotkeys,
  isRefreshing,
  isLocating,
  isCached,
  isOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white ring-1 ring-white/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" /> Open-Meteo
              </span>

              {/* Offline / Cached Data Warning Pill */}
              {(isCached || isOffline) && (
                <span
                  id="pill-offline-warning"
                  title="Showing stale-while-revalidate cached forecast from localStorage"
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 animate-pulse"
                >
                  {isOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Database className="w-3 h-3 text-amber-400" />}
                  Offline / Cached Data
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Real-time forecast & intelligent planning
            </p>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end">
          {/* Export Report Button */}
          {onOpenExport && (
            <button
              id="btn-export-report"
              onClick={onOpenExport}
              title="Export professional weather report"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export Report</span>
            </button>
          )}

          {/* Hotkeys Button */}
          {onOpenHotkeys && (
            <button
              id="btn-open-hotkeys"
              onClick={onOpenHotkeys}
              title="View power-user keyboard shortcuts"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-all"
            >
              <Keyboard className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline text-[11px] font-mono font-bold text-sky-400">/ Hotkeys</span>
            </button>
          )}

          {/* Current Location Button */}
          <button
            id="btn-current-location"
            onClick={onGetCurrentLocation}
            disabled={isLocating}
            title="Use current location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 hover:text-white transition-all border border-slate-700/60 active:scale-95 disabled:opacity-50"
          >
            <MapPin className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-bounce' : ''}`} />
            <span className="hidden md:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Temperature Unit Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              id="btn-unit-celsius"
              onClick={() => onUpdateUnits({ temperature: 'celsius' })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                units.temperature === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              id="btn-unit-fahrenheit"
              onClick={() => onUpdateUnits({ temperature: 'fahrenheit' })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                units.temperature === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Wind Unit Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              id="btn-unit-kmh"
              onClick={() => onUpdateUnits({ windSpeed: 'kmh' })}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                units.windSpeed === 'kmh'
                  ? 'bg-slate-700 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              km/h
            </button>
            <button
              id="btn-unit-mph"
              onClick={() => onUpdateUnits({ windSpeed: 'mph' })}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                units.windSpeed === 'mph'
                  ? 'bg-slate-700 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              mph
            </button>
          </div>

          {/* Favorites Button */}
          <button
            id="btn-open-favorites"
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 hover:text-white transition-all border border-slate-700/60"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Manual Refresh Button */}
          <button
            id="btn-refresh-weather"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data (Hotkey: R)"
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all border border-slate-700/60 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
