import React, { useState, useEffect, useRef } from 'react';
import { GeoLocationResult } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/openMeteo';
import { Search, X, MapPin, Globe, History, AlertCircle, Loader2 } from 'lucide-react';

interface CitySearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  recentSearches: GeoLocationResult[];
  selectedCity?: GeoLocationResult;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  onSelectCity,
  recentSearches,
  selectedCity,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(trimmed, controller.signal);
        setResults(data);
        if (data.length === 0) {
          setErrorMsg(`No cities found matching "${trimmed}"`);
        }
      } catch (err: any) {
        if (err.message) setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-30" ref={dropdownRef}>
      {/* Search Bar Input */}
      <div
        className={`relative flex items-center w-full rounded-2xl bg-slate-900/90 border transition-all duration-200 shadow-xl ${
          isFocused
            ? 'border-sky-500/80 ring-4 ring-sky-500/20 shadow-sky-500/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="pl-4 text-slate-400">
          <Search className="w-5 h-5 text-sky-400" />
        </div>
        <input
          id="input-city-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search any city or country (e.g., Tokyo, San Francisco, Paris)..."
          className="w-full py-3.5 pl-3 pr-10 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-medium"
        />

        {query && (
          <button
            id="btn-clear-search"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="pr-3 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isLoading && (
          <div className="pr-4 text-sky-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>

      {/* Quick Search Suggestions & Recent Chips under Search */}
      {!isFocused && recentSearches.length > 0 && (
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <History className="w-3 h-3 text-slate-400" /> Recent:
          </span>
          {recentSearches.slice(0, 5).map((city) => (
            <button
              key={`recent-${city.id}-${city.name}`}
              onClick={() => handleSelect(city)}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/30 transition-all shrink-0 flex items-center gap-1"
            >
              <MapPin className="w-2.5 h-2.5 text-sky-400" />
              {city.name}
              {city.country_code && (
                <span className="text-[10px] text-slate-500 uppercase">{city.country_code}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Popular Cities Pills if no query and search bar is clicked */}
      {isFocused && query.length < 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 p-4 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50">
          <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            Popular World Cities
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={`pop-${city.id}`}
                onClick={() => handleSelect(city)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-sky-500/10 hover:border-sky-500/40 border border-slate-800 transition-all text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                    {city.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{city.country}</div>
                </div>
                <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Geocoding Dropdown Search Results */}
      {isFocused && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-slate-800/60">
          {errorMsg && (
            <div className="p-4 text-center text-xs text-rose-400 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          {results.map((item) => {
            const locationString = [item.admin1, item.country].filter(Boolean).join(', ');
            return (
              <button
                key={`result-${item.id}-${item.latitude}-${item.longitude}`}
                onClick={() => handleSelect(item)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-sky-500/10 hover:border-l-4 hover:border-l-sky-400 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-sky-500/20 flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{locationString || 'Global location'}</span>
                      {item.population && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          Pop. {(item.population / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
