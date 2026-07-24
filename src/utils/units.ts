import { UserUnits } from '../types/weather';

export function convertTemperature(celsius: number, unit: UserUnits['temperature']): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: UserUnits['temperature']): string {
  const val = convertTemperature(celsius, unit);
  return `${val}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function convertWindSpeed(kmh: number, unit: UserUnits['windSpeed']): { value: number; label: string } {
  if (unit === 'mph') {
    return { value: Math.round(kmh * 0.621371), label: 'mph' };
  }
  if (unit === 'ms') {
    return { value: Math.round((kmh / 3.6) * 10) / 10, label: 'm/s' };
  }
  return { value: Math.round(kmh), label: 'km/h' };
}

export function formatWindSpeed(kmh: number, unit: UserUnits['windSpeed']): string {
  const { value, label } = convertWindSpeed(kmh, unit);
  return `${value} ${label}`;
}

export function convertPrecipitation(mm: number, unit: UserUnits['precipitation']): { value: number; label: string } {
  if (unit === 'inch') {
    const inches = mm * 0.0393701;
    return { value: Math.round(inches * 100) / 100, label: 'in' };
  }
  return { value: Math.round(mm * 10) / 10, label: 'mm' };
}

export function formatPrecipitation(mm: number, unit: UserUnits['precipitation']): string {
  const { value, label } = convertPrecipitation(mm, unit);
  return `${value} ${label}`;
}

export function degreesToCompass(degrees: number): string {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return cardinals[index % 16];
}

export function formatUVIndex(uv: number): { level: string; color: string; advice: string } {
  const rounded = Math.round(uv * 10) / 10;
  if (rounded <= 2) {
    return { level: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', advice: 'No protection required. Safe outdoors.' };
  }
  if (rounded <= 5) {
    return { level: 'Moderate', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', advice: 'Wear sunglasses and SPF 30+ outdoors.' };
  }
  if (rounded <= 7) {
    return { level: 'High', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', advice: 'Protection required. Seek shade during midday.' };
  }
  if (rounded <= 10) {
    return { level: 'Very High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', advice: 'Extra protection needed. Avoid direct sun 11am-4pm.' };
  }
  return { level: 'Extreme', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', advice: 'Take all precautions. Unprotected skin can burn quickly.' };
}

export function formatVisibility(meters: number): string {
  if (!meters && meters !== 0) return 'N/A';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

export function formatHumidity(humidity: number): { label: string; desc: string } {
  if (humidity < 30) return { label: 'Dry', desc: 'Low moisture, may cause dry skin.' };
  if (humidity <= 60) return { label: 'Optimal', desc: 'Comfortable indoor & outdoor moisture.' };
  if (humidity <= 80) return { label: 'Humid', desc: 'Noticeable air moisture.' };
  return { label: 'Very Muggy', desc: 'High humidity, feels sticky.' };
}
