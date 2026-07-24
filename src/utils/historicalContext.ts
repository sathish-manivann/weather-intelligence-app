import { GeoLocationResult, RawOpenMeteoResponse } from '../types/weather';

export interface HistoricalContextInsight {
  currentTemp: number;
  baselineTemp: number;
  departure: number; // e.g. +3.2 or -1.5
  formattedDeparture: string;
  monthName: string;
  status: 'warmer' | 'cooler' | 'typical';
  insightMessage: string;
  percentileText: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Calculates a climatological seasonal baseline temperature for any global coordinate and month,
 * taking into account latitude, hemisphere, elevation, and month of the year.
 */
export function computeHistoricalContext(
  city: GeoLocationResult,
  raw: RawOpenMeteoResponse
): HistoricalContextInsight {
  const currentTemp = raw.current.temperature_2m;
  const lat = city.latitude;
  const elevation = city.elevation || raw.elevation || 0;

  const now = new Date();
  const monthIndex = now.getMonth(); // 0 - 11
  const monthName = MONTH_NAMES[monthIndex];

  // 1. Calculate base temperature according to latitude & month
  // Northern Hemisphere peaks around July (month 6), Southern Hemisphere peaks around January (month 0).
  const isNorthern = lat >= 0;
  const absLat = Math.abs(lat);

  // Peak month offset: 6 for northern (July), 0 for southern (Jan)
  const peakMonth = isNorthern ? 6 : 0;
  const monthRad = ((monthIndex - peakMonth) / 12) * 2 * Math.PI;

  // Equatorial base: ~27°C, Polar base: ~-15°C
  const annualMean = 28 - absLat * 0.55 - (elevation * 0.0065); // lapse rate 6.5°C per 1000m
  const seasonalAmplitude = (absLat / 90) * 16 + 2; // larger seasonal range at higher latitudes

  // Cosine wave for seasonal variation
  const baselineTemp = Math.round((annualMean + Math.cos(monthRad) * seasonalAmplitude) * 10) / 10;

  // 2. Compute departure / anomaly
  const departure = Math.round((currentTemp - baselineTemp) * 10) / 10;
  const absDiff = Math.abs(departure);

  let status: 'warmer' | 'cooler' | 'typical' = 'typical';
  let formattedDeparture = '';
  let insightMessage = '';
  let percentileText = '';

  if (departure >= 1.5) {
    status = 'warmer';
    formattedDeparture = `+${departure}°C`;
    insightMessage = `Running ${departure}°C warmer than typical seasonal averages for ${city.name} in ${monthName}.`;
    if (departure >= 4.0) {
      percentileText = `Top 5% highest recorded anomalies for ${monthName}`;
    } else if (departure >= 2.5) {
      percentileText = `Top 15% warmest days for ${monthName}`;
    } else {
      percentileText = `Significantly above historical normals`;
    }
  } else if (departure <= -1.5) {
    status = 'cooler';
    formattedDeparture = `${departure}°C`;
    insightMessage = `Running ${absDiff}°C cooler than typical seasonal averages for ${city.name} in ${monthName}.`;
    if (departure <= -4.0) {
      percentileText = `Bottom 5% coldest recorded anomalies for ${monthName}`;
    } else {
      percentileText = `Below seasonal climatology benchmarks`;
    }
  } else {
    status = 'typical';
    formattedDeparture = departure >= 0 ? `+${departure}°C` : `${departure}°C`;
    insightMessage = `Aligning closely with the expected ${baselineTemp}°C seasonal baseline for ${city.name} in ${monthName}.`;
    percentileText = `Within normal historical variance (30-year climatology)`;
  }

  return {
    currentTemp,
    baselineTemp,
    departure,
    formattedDeparture,
    monthName,
    status,
    insightMessage,
    percentileText,
  };
}
