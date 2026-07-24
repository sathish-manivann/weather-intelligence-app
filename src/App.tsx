import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GeoLocationResult, WeatherData, UserUnits } from './types/weather';
import { fetchWeatherData, POPULAR_CITIES, reverseGeocode } from './services/openMeteo';
import { computeWeatherIntelligence } from './utils/intelligenceEngine';
import { getWMOCodeInfo } from './utils/wmoCodes';

import { Header } from './components/Header';
import { CitySearchBar } from './components/CitySearchBar';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { MetricsGrid } from './components/MetricsGrid';
import { HourlyTimeline } from './components/HourlyTimeline';
import { Forecast7Days } from './components/Forecast7Days';
import { InteractiveCharts } from './components/InteractiveCharts';
import { SmartPlanner } from './components/SmartPlanner';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ExportModal } from './components/ExportModal';
import { HotkeysModal } from './components/HotkeysModal';
import { HistoricalContextCard } from './components/HistoricalContextCard';
import { WeatherRadarMap } from './components/WeatherRadarMap';

import { AlertCircle, RefreshCw, MapPin, Compass } from 'lucide-react';

const STORAGE_KEY_UNITS = 'weather_app_units';
const STORAGE_KEY_FAVORITES = 'weather_app_favorites';
const STORAGE_KEY_RECENTS = 'weather_app_recents';
const STORAGE_KEY_LAST_CITY = 'weather_app_last_city';

export default function App() {
  // 1. Units state with local storage persistence
  const [units, setUnits] = useState<UserUnits>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNITS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved units:', e);
    }
    return { temperature: 'celsius', windSpeed: 'kmh', precipitation: 'mm' };
  });

  // 2. Favorites state
  const [favorites, setFavorites] = useState<GeoLocationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved favorites:', e);
    }
    return POPULAR_CITIES.slice(0, 4);
  });

  // 3. Recent searches state
  const [recentSearches, setRecentSearches] = useState<GeoLocationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved recents:', e);
    }
    return POPULAR_CITIES.slice(0, 3);
  });

  // 4. Selected city & weather data
  const [selectedCity, setSelectedCity] = useState<GeoLocationResult>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_CITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse last city:', e);
    }
    return POPULAR_CITIES[0]; // Default: London
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState<boolean>(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UNITS, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LAST_CITY, JSON.stringify(selectedCity));
  }, [selectedCity]);

  // Load weather for selected city
  const loadWeather = useCallback(async (city: GeoLocationResult, isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorMsg(null);

    try {
      const data = await fetchWeatherData(city, units);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setErrorMsg(err.message || 'Unable to retrieve weather data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [units]);

  // Initial load or city change trigger
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Handle unit updates
  const handleUpdateUnits = useCallback((newUnits: Partial<UserUnits>) => {
    setUnits((prev) => ({ ...prev, ...newUnits }));
  }, []);

  // Global Keyboard Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true');

      // Esc always closes active overlays
      if (e.key === 'Escape') {
        setIsFavoritesOpen(false);
        setIsExportOpen(false);
        setIsHotkeysOpen(false);
        if (isInputActive && activeEl instanceof HTMLElement) {
          activeEl.blur();
        }
        return;
      }

      // Ignore other hotkeys if typing inside input
      if (isInputActive) return;

      // '/' -> Focus search bar
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('input-city-search');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // 'r' or 'R' -> Refresh data
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        loadWeather(selectedCity, true);
      }

      // 'u' or 'U' -> Toggle temperature unit (°C / °F)
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUpdateUnits({
          temperature: units.temperature === 'celsius' ? 'fahrenheit' : 'celsius',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCity, loadWeather, units.temperature, handleUpdateUnits]);

  // Select city handler (adds to recents)
  const handleSelectCity = (city: GeoLocationResult) => {
    setSelectedCity(city);
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      return [city, ...filtered].slice(0, 8);
    });
  };

  // Toggle favorite city
  const isSelectedFavorite = useMemo(() => {
    return favorites.some((f) => f.id === selectedCity.id || (f.latitude === selectedCity.latitude && f.longitude === selectedCity.longitude));
  }, [favorites, selectedCity]);

  const handleToggleFavorite = () => {
    if (isSelectedFavorite) {
      setFavorites((prev) => prev.filter((f) => f.id !== selectedCity.id));
    } else {
      setFavorites((prev) => [...prev, selectedCity]);
    }
  };

  const handleRemoveFavorite = (cityId: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== cityId));
  };

  // Get user geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const cityResult = await reverseGeocode(lat, lon);
          handleSelectCity(cityResult);
        } catch (e: any) {
          setErrorMsg('Failed to reverse geocode your location.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location access denied. Please search for a city manually in the search bar.');
        } else {
          setErrorMsg('Unable to detect your current location.');
        }
      },
      { timeout: 10000 }
    );
  };

  // Compute Weather Intelligence
  const intelligence = useMemo(() => {
    if (!weatherData) return null;
    return computeWeatherIntelligence(weatherData.raw);
  }, [weatherData]);

  // Compute atmospheric background theme from current weather
  const backdropGradient = useMemo(() => {
    if (!weatherData) return 'from-slate-950 via-slate-900 to-slate-950';
    const code = weatherData.raw.current.weather_code;
    const isDay = weatherData.raw.current.is_day;
    const info = getWMOCodeInfo(code, isDay);
    return info.theme.backdropGradient;
  }, [weatherData]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans bg-gradient-to-b ${backdropGradient} transition-colors duration-700`}>
      {/* Sticky Header */}
      <Header
        units={units}
        onUpdateUnits={handleUpdateUnits}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        onGetCurrentLocation={handleGetCurrentLocation}
        onRefresh={() => loadWeather(selectedCity, true)}
        isRefreshing={isRefreshing}
        isLocating={isLocating}
        isCached={weatherData?.isCached}
        isOffline={weatherData?.isOffline}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* City Search Bar Section */}
        <section>
          <CitySearchBar
            onSelectCity={handleSelectCity}
            recentSearches={recentSearches}
            selectedCity={selectedCity}
          />
        </section>

        {/* Error State Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
            <button
              onClick={() => loadWeather(selectedCity)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/40 transition-colors flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <SkeletonLoader />
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Hero Spotlight Card */}
            <CurrentWeatherHero
              data={weatherData}
              units={units}
              isFavorite={isSelectedFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 2. Key Weather Metrics Bento Grid */}
            <MetricsGrid data={weatherData} units={units} />

            {/* 3. Historical Context & Climatology Baseline Card */}
            <HistoricalContextCard data={weatherData} />

            {/* 4. Interactive Weather Radar / GIS Map Placeholder */}
            <WeatherRadarMap data={weatherData} />

            {/* 5. 24-Hour Timeline */}
            <HourlyTimeline data={weatherData} units={units} />

            {/* 6. 7-Day Forecast Cards */}
            <Forecast7Days data={weatherData} units={units} />

            {/* 7. Interactive Analytics Charts */}
            <InteractiveCharts data={weatherData} units={units} />

            {/* 8. Smart Weather Intelligence & Planning Engine */}
            {intelligence && <SmartPlanner intelligence={intelligence} />}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Select a city to explore weather intelligence</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Use the search bar above or pick one of the popular global cities below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={`default-pop-${c.id}`}
                  onClick={() => handleSelectCity(c)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {c.name}, {c.country}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Favorites Drawer */}
      {isFavoritesOpen && (
        <FavoritesDrawer
          favorites={favorites}
          onSelectCity={handleSelectCity}
          onRemoveFavorite={handleRemoveFavorite}
          onClose={() => setIsFavoritesOpen(false)}
        />
      )}

      {/* Export Report Modal */}
      {isExportOpen && weatherData && (
        <ExportModal
          data={weatherData}
          intelligence={intelligence}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Power-User Hotkeys Modal */}
      {isHotkeysOpen && (
        <HotkeysModal onClose={() => setIsHotkeysOpen(false)} />
      )}

      {/* Sleek Footer */}
      <footer className="mt-16 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© Weather Intelligence • Powered by Open-Meteo High Resolution Forecast API</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>No API Keys Required</span>
            <span>•</span>
            <span>Global Coverage</span>
            <span>•</span>
            <span>SWR Offline Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
