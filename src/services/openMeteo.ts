import { GeoLocationResult, RawOpenMeteoResponse, WeatherData, UserUnits } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Popular default cities for instant fallback or recommendations
export const POPULAR_CITIES: GeoLocationResult[] = [
  { id: 1, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB', admin1: 'England' },
  { id: 2, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', country_code: 'US', admin1: 'New York' },
  { id: 3, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { id: 4, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { id: 5, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' },
  { id: 6, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', country_code: 'SG' },
  { id: 7, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE' },
];

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Geocoding server error (${response.status})`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    if (error.name === 'AbortError') return [];
    console.error('City search failed:', error);
    throw new Error('Unable to search city. Please check your internet connection.');
  }
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL

function getCacheKey(city: GeoLocationResult): string {
  const cityIdentifier = city.id || `${city.latitude.toFixed(3)}_${city.longitude.toFixed(3)}`;
  return `swr_weather_cache_${cityIdentifier}`;
}

export function getCachedWeatherData(city: GeoLocationResult): { weatherData: WeatherData; isFresh: boolean; ageMinutes: number } | null {
  try {
    const key = getCacheKey(city);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { weatherData: WeatherData; cacheTimestamp: number };
    if (!parsed || !parsed.weatherData || !parsed.cacheTimestamp) return null;

    const ageMs = Date.now() - parsed.cacheTimestamp;
    const ageMinutes = Math.floor(ageMs / 60000);
    const isFresh = ageMs <= CACHE_TTL_MS;

    return {
      weatherData: {
        ...parsed.weatherData,
        isCached: true,
        cacheTimestamp: parsed.cacheTimestamp,
      },
      isFresh,
      ageMinutes,
    };
  } catch (e) {
    console.warn('Failed to read weather cache:', e);
    return null;
  }
}

export function saveCachedWeatherData(city: GeoLocationResult, weatherData: WeatherData): void {
  try {
    const key = getCacheKey(city);
    const payload = {
      weatherData,
      cacheTimestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save weather cache:', e);
  }
}

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelayMs = 800): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`Request attempt ${attempt} failed. Retrying in ${delay}ms...`, err);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Network request failed after retries.');
}

export async function fetchWeatherData(city: GeoLocationResult, units: UserUnits): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: 'auto',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const rawData = await fetchWithRetry(async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Forecast service error (${response.status})`);
      }
      return (await response.json()) as RawOpenMeteoResponse;
    }, 3, 800);

    const freshWeatherData: WeatherData = {
      city,
      raw: rawData,
      units,
      fetchedAt: new Date().toISOString(),
      isCached: false,
      isOffline: false,
      cacheTimestamp: Date.now(),
    };

    saveCachedWeatherData(city, freshWeatherData);
    return freshWeatherData;
  } catch (error: any) {
    console.error('Weather fetch error after retries:', error);

    // SWR fallback: check cached forecast
    const cached = getCachedWeatherData(city);
    if (cached) {
      console.info(`Serving cached weather data for ${city.name} (${cached.ageMinutes} minutes old)`);
      return {
        ...cached.weatherData,
        city,
        units,
        isCached: true,
        isOffline: true || !navigator.onLine,
      };
    }

    throw new Error(`Failed to load weather for ${city.name}. ${error.message || 'Please check your connection.'}`);
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocationResult> {
  // Free reverse geocoding endpoint or fallback name
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'My Location';
      return {
        id: Math.round(latitude * 10000 + longitude),
        name: cityName,
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback used:', e);
  }

  return {
    id: Math.round(latitude * 1000 + longitude),
    name: 'Current Location',
    latitude,
    longitude,
  };
}
