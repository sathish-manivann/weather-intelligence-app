import { WeatherData, WeatherIntelligence } from '../types/weather';
import { getWMOCodeInfo } from './wmoCodes';
import { formatTemp, formatWindSpeed } from './units';
import { computeHistoricalContext } from './historicalContext';

export function generateTextReport(data: WeatherData, intelligence: WeatherIntelligence | null): string {
  const current = data.raw.current;
  const daily = data.raw.daily;
  const units = data.units;
  const info = getWMOCodeInfo(current.weather_code, current.is_day);
  const historical = computeHistoricalContext(data.city, data.raw);

  const formattedTemp = formatTemp(current.temperature_2m, units.temperature);
  const formattedApparent = formatTemp(current.apparent_temperature, units.temperature);
  const formattedWind = formatWindSpeed(current.wind_speed_10m, units.windSpeed);
  const formattedGusts = formatWindSpeed(current.wind_gusts_10m, units.windSpeed);

  const timestamp = new Date(data.fetchedAt).toUTCString();
  const dateStr = new Date().toISOString().split('T')[0];

  let report = `================================================================================
                    AETHER WEATHER INTELLIGENCE REPORT
================================================================================
City:                ${data.city.name}, ${data.city.country || ''} (${data.city.country_code || 'N/A'})
Coordinates:         ${data.city.latitude.toFixed(4)}°N, ${data.city.longitude.toFixed(4)}°E
Generated At:        ${timestamp}
DataSource:          Open-Meteo High Resolution Forecast API
Mode:                ${data.isCached ? 'Cached / SWR Storage' : 'Real-Time Live Feed'}

--------------------------------------------------------------------------------
1. CURRENT ATMOSPHERIC METRICS
--------------------------------------------------------------------------------
Temperature:         ${formattedTemp} (Feels like ${formattedApparent})
Condition:           ${info.description} (WMO Code ${current.weather_code})
Relative Humidity:   ${current.relative_humidity_2m}%
Wind Speed & Gusts:  ${formattedWind} (Gusts: ${formattedGusts}, Dir: ${current.wind_direction_10m}°)
Pressure (MSL):      ${Math.round(current.pressure_msl)} hPa
UV Index:            ${current.uv_index.toFixed(1)} / 11
Cloud Cover:         ${current.cloud_cover}%
Precipitation Rate:  ${current.precipitation} mm/h

--------------------------------------------------------------------------------
2. HISTORICAL & SEASONAL CONTEXT
--------------------------------------------------------------------------------
Seasonal Baseline:   ${historical.baselineTemp}°C for ${historical.monthName}
Current Anomaly:     ${historical.formattedDeparture}
Insight:             ${historical.insightMessage}
Statistical Norm:    ${historical.percentileText}

--------------------------------------------------------------------------------
3. SMART INTELLIGENCE & PLANNING
--------------------------------------------------------------------------------
Overall Outdoor Score:${intelligence ? `${intelligence.overallOutdoorScore}/100` : 'N/A'}
Comfort Assessment:   ${intelligence ? intelligence.comfortLevel : 'N/A'}
Clothing Advice:      ${intelligence ? intelligence.clothingAdvice.join(' | ') : 'N/A'}

Active Warnings & Safety Alerts:
${
  intelligence && intelligence.healthWarnings.length > 0
    ? intelligence.healthWarnings.map((w) => `  - [${w.level.toUpperCase()}] ${w.message}`).join('\n')
    : '  - None active. Conditions are stable.'
}

Activity Suitability Scores:
${
  intelligence
    ? intelligence.activityRatings
        .map((a) => `  - ${a.name.padEnd(24, ' ')}: ${a.score}/100 (${a.label}) - ${a.summary}`)
        .join('\n')
    : '  - N/A'
}

Optimal Activity Windows (Next 24 Hours):
${
  intelligence && intelligence.bestWindows.length > 0
    ? intelligence.bestWindows
        .map((w) => `  - ${w.startTime} to ${w.endTime}: ${w.activity} (Score ${w.score}/100) - ${w.reason}`)
        .join('\n')
    : '  - Standard conditions throughout the day.'
}

--------------------------------------------------------------------------------
4. 7-DAY FORECAST SUMMARY
--------------------------------------------------------------------------------
Date         Condition             Max Temp    Min Temp    Precip Sum    Max Wind
--------------------------------------------------------------------------------
`;

  if (daily && daily.time) {
    daily.time.forEach((timeStr, i) => {
      const code = daily.weather_code[i];
      const codeInfo = getWMOCodeInfo(code, 1);
      const maxT = formatTemp(daily.temperature_2m_max[i], units.temperature);
      const minT = formatTemp(daily.temperature_2m_min[i], units.temperature);
      const precip = daily.precipitation_sum ? `${daily.precipitation_sum[i]} mm` : '0 mm';
      const maxWind = daily.wind_speed_10m_max ? formatWindSpeed(daily.wind_speed_10m_max[i], units.windSpeed) : 'N/A';

      report += `${timeStr}   ${codeInfo.description.padEnd(20, ' ')} ${maxT.padEnd(11, ' ')} ${minT.padEnd(11, ' ')} ${precip.padEnd(13, ' ')} ${maxWind}\n`;
    });
  }

  report += `================================================================================
Report exported via Aether Weather Intelligence Utility • ${dateStr}
================================================================================\n`;

  return report;
}

export function generateCsvReport(data: WeatherData): string {
  const current = data.raw.current;
  const daily = data.raw.daily;
  const units = data.units;

  let csv = `City,Country,Latitude,Longitude,FetchedAt,Temperature,ApparentTemp,Humidity,WindSpeed,Pressure,UVIndex\n`;
  csv += `"${data.city.name}","${data.city.country || ''}",${data.city.latitude},${data.city.longitude},"${data.fetchedAt}",${current.temperature_2m},${current.apparent_temperature},${current.relative_humidity_2m},${current.wind_speed_10m},${current.pressure_msl},${current.uv_index}\n\n`;

  csv += `Date,WeatherCode,MaxTemp,MinTemp,PrecipitationSum,MaxWindSpeed,MaxUVIndex\n`;
  if (daily && daily.time) {
    daily.time.forEach((t, i) => {
      csv += `${t},${daily.weather_code[i]},${daily.temperature_2m_max[i]},${daily.temperature_2m_min[i]},${daily.precipitation_sum?.[i] || 0},${daily.wind_speed_10m_max?.[i] || 0},${daily.uv_index_max?.[i] || 0}\n`;
    });
  }

  return csv;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
