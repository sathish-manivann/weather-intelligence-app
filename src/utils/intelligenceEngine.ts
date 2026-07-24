import { RawOpenMeteoResponse, WeatherIntelligence, ActivityRating, BestWindow } from '../types/weather';

export function computeWeatherIntelligence(raw: RawOpenMeteoResponse): WeatherIntelligence {
  const current = raw.current;
  const hourly = raw.hourly;
  const daily = raw.daily;

  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const windGusts = current.wind_gusts_10m;
  const uvIndex = current.uv_index;
  const precip = current.precipitation;
  const code = current.weather_code;
  const cloudCover = current.cloud_cover;
  const isDay = current.is_day;

  // 1. Overall Outdoor Score (0 - 100)
  let outdoorScore = 100;

  // Temperature penalty (Ideal 18°C - 24°C)
  if (temp < 0) outdoorScore -= 40;
  else if (temp < 10) outdoorScore -= 20;
  else if (temp < 18) outdoorScore -= (18 - temp) * 2;
  else if (temp > 35) outdoorScore -= 45;
  else if (temp > 28) outdoorScore -= (temp - 28) * 3;

  // Rain / Precip penalty
  if (precip > 5) outdoorScore -= 50;
  else if (precip > 0) outdoorScore -= 30;

  // Weather code severe penalty
  if ([95, 96, 99].includes(code)) outdoorScore -= 60; // Thunderstorm
  else if ([65, 67, 75, 82, 86].includes(code)) outdoorScore -= 45; // Heavy rain/snow
  else if ([61, 63, 71, 73, 80, 81].includes(code)) outdoorScore -= 25; // Moderate rain/snow

  // Wind penalty
  if (windSpeed > 40) outdoorScore -= 40;
  else if (windSpeed > 25) outdoorScore -= 20;
  else if (windSpeed > 15) outdoorScore -= 10;

  // Humidity penalty
  if (humidity > 85) outdoorScore -= 15;

  outdoorScore = Math.max(0, Math.min(100, Math.round(outdoorScore)));

  // 2. Comfort Level
  let comfortLevel = 'Pleasant & Balanced';
  if (apparentTemp < 0) comfortLevel = 'Freezing Cold';
  else if (apparentTemp < 10) comfortLevel = 'Chilly & Crisp';
  else if (apparentTemp > 32) comfortLevel = 'Hot & Sweltering';
  else if (humidity > 80 && temp > 24) comfortLevel = 'Muggy & Sticky';
  else if (humidity < 25) comfortLevel = 'Dry Air';

  // 3. Clothing Advice
  const clothingAdvice: string[] = [];
  if (apparentTemp < 5) {
    clothingAdvice.push('Heavy winter coat, thermal layers, scarf & gloves');
  } else if (apparentTemp < 14) {
    clothingAdvice.push('Warm jacket or pullover with long pants');
  } else if (apparentTemp < 20) {
    clothingAdvice.push('Light sweater or hoodie, comfortable layers');
  } else if (apparentTemp < 28) {
    clothingAdvice.push('T-shirt, shorts/breathable pants');
  } else {
    clothingAdvice.push('Ultra-light, moisture-wicking breathable clothes');
  }

  if (precip > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    clothingAdvice.push('Waterproof raincoat or sturdy umbrella');
  }

  if (windSpeed > 20) {
    clothingAdvice.push('Windbreaker jacket or outer shell');
  }

  if (uvIndex >= 6) {
    clothingAdvice.push('Sunglasses, broad-brim hat & SPF 30+ sunscreen');
  } else if (uvIndex >= 3) {
    clothingAdvice.push('Sunglasses & light sun protection');
  }

  // 4. Health & Environmental Warnings
  const healthWarnings: WeatherIntelligence['healthWarnings'] = [];

  if (uvIndex >= 8) {
    healthWarnings.push({
      type: 'uv',
      level: 'alert',
      message: `Extreme UV Index (${uvIndex.toFixed(1)}). Unprotected skin burns quickly. Seek shade between 11 AM - 3 PM.`,
    });
  } else if (uvIndex >= 6) {
    healthWarnings.push({
      type: 'uv',
      level: 'warning',
      message: `High UV Index (${uvIndex.toFixed(1)}). Apply SPF 30+ sunscreen every 2 hours outdoors.`,
    });
  }

  if (windGusts > 50 || windSpeed > 40) {
    healthWarnings.push({
      type: 'wind',
      level: 'alert',
      message: `High Wind Warning (${Math.round(windSpeed)} km/h, gusts ${Math.round(windGusts)} km/h). Watch for falling branches & loose items.`,
    });
  } else if (windSpeed > 25) {
    healthWarnings.push({
      type: 'wind',
      level: 'warning',
      message: `Breezy conditions (${Math.round(windSpeed)} km/h). Secure outdoor patio furniture.`,
    });
  }

  if ([95, 96, 99].includes(code)) {
    healthWarnings.push({
      type: 'rain',
      level: 'alert',
      message: 'Active Thunderstorm Hazard. Stay indoors away from windows and electric equipment.',
    });
  } else if (precip > 5 || [65, 82].includes(code)) {
    healthWarnings.push({
      type: 'rain',
      level: 'warning',
      message: 'Heavy precipitation expected. Reduced road visibility and hydroplaning risk.',
    });
  }

  if (apparentTemp < -5) {
    healthWarnings.push({
      type: 'cold',
      level: 'alert',
      message: `Severe Wind Chill (${Math.round(apparentTemp)}°C). Frostbite risk on exposed skin in under 30 minutes.`,
    });
  } else if (apparentTemp > 35) {
    healthWarnings.push({
      type: 'heat',
      level: 'warning',
      message: `Excessive Heat Index (${Math.round(apparentTemp)}°C). Stay hydrated and avoid strenuous outdoor exercise.`,
    });
  }

  // 5. Activity Ratings
  const activityRatings: ActivityRating[] = [
    evaluateRunning(temp, precip, windSpeed, humidity, code),
    evaluateCycling(temp, precip, windSpeed, windGusts, code),
    evaluateOutdoorDining(temp, precip, windSpeed, uvIndex, isDay),
    evaluateBeachPool(temp, precip, cloudCover, uvIndex, isDay),
    evaluatePhotography(cloudCover, precip, isDay, code),
    evaluateLaundryDrying(temp, humidity, windSpeed, precip, cloudCover),
    evaluateCommuting(precip, windSpeed, code),
  ];

  // 6. Stargazing Quality
  const stargazingQuality = evaluateStargazing(cloudCover, humidity, precip, isDay, code);

  // 7. Laundry Drying Time
  let dryingHours = 3;
  if (precip > 0) dryingHours = 99; // impossible outside
  else {
    let rate = 1.0;
    if (temp > 25) rate += 0.5;
    else if (temp < 10) rate -= 0.4;
    if (humidity > 80) rate -= 0.5;
    if (windSpeed > 15) rate += 0.4;
    if (cloudCover > 70) rate -= 0.3;
    dryingHours = Math.max(1, Math.round((4 / Math.max(0.2, rate)) * 10) / 10);
  }

  // 8. Best Windows Finder (Next 24 Hours)
  const bestWindows = findBestOutdoorWindows(hourly);

  return {
    overallOutdoorScore: outdoorScore,
    comfortLevel,
    clothingAdvice,
    healthWarnings,
    activityRatings,
    bestWindows,
    stargazingQuality,
    laundryDryingTimeHours: dryingHours,
  };
}

function evaluateRunning(temp: number, precip: number, wind: number, humidity: number, code: number): ActivityRating {
  let score = 100;
  if (temp < 5) score -= 30;
  else if (temp < 12) score -= 10; // ideal running temp is 10-18
  else if (temp > 25) score -= 30;
  else if (temp > 30) score -= 50;

  if (precip > 2) score -= 40;
  else if (precip > 0) score -= 15;

  if (wind > 30) score -= 30;
  else if (wind > 20) score -= 15;

  if (humidity > 85 && temp > 22) score -= 20;

  if ([95, 96, 99].includes(code)) score = 0;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 85) label = 'Ideal';
  else if (score >= 70) label = 'Good';
  else if (score >= 50) label = 'Fair';
  else if (score >= 25) label = 'Poor';
  else label = 'Hazardous';

  return {
    name: 'Running & Jogging',
    iconName: 'Footprints',
    score,
    label,
    summary: score >= 70 ? 'Great conditions for a outdoor run.' : 'Sub-optimal running conditions.',
    tip: temp > 22 ? 'Stay hydrated & run early.' : precip > 0 ? 'Wear grip shoes for wet pavement.' : 'Great pace conditions!',
  };
}

function evaluateCycling(temp: number, precip: number, wind: number, gusts: number, code: number): ActivityRating {
  let score = 100;
  if (wind > 35 || gusts > 45) score -= 50;
  else if (wind > 20) score -= 25;

  if (precip > 1) score -= 45;
  else if (precip > 0) score -= 20;

  if (temp < 5) score -= 35;
  else if (temp > 32) score -= 40;

  if ([95, 96, 99].includes(code)) score = 0;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 85) label = 'Ideal';
  else if (score >= 70) label = 'Good';
  else if (score >= 50) label = 'Fair';
  else if (score >= 25) label = 'Poor';
  else label = 'Hazardous';

  return {
    name: 'Road Cycling',
    iconName: 'Bike',
    score,
    label,
    summary: wind > 25 ? 'Strong headwinds & gust caution.' : 'Smooth riding conditions.',
    tip: wind > 20 ? 'Watch crosswinds on open roads.' : 'Great day for cycling.',
  };
}

function evaluateOutdoorDining(temp: number, precip: number, wind: number, uv: number, isDay: number): ActivityRating {
  let score = 100;
  if (temp < 16) score -= (16 - temp) * 5;
  if (temp > 30) score -= (temp - 30) * 5;
  if (precip > 0) score -= 60;
  if (wind > 25) score -= 40;
  else if (wind > 15) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 80) label = 'Ideal';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Fair';
  else label = 'Poor';

  return {
    name: 'Outdoor Dining & BBQ',
    iconName: 'Utensils',
    score,
    label,
    summary: score >= 70 ? 'Pleasant atmosphere for patio dining.' : 'Indoor dining recommended.',
    tip: temp < 18 ? 'Patio heaters or warm jacket recommended.' : 'Enjoy your meal outdoor!',
  };
}

function evaluateBeachPool(temp: number, precip: number, cloud: number, uv: number, isDay: number): ActivityRating {
  if (isDay === 0) {
    return {
      name: 'Beach & Swimming',
      iconName: 'Waves',
      score: 0,
      label: 'Poor',
      summary: 'Nighttime',
      tip: 'Visit during sunny daytime hours.',
    };
  }

  let score = 100;
  if (temp < 22) score -= (22 - temp) * 6;
  if (cloud > 60) score -= 30;
  if (precip > 0) score -= 70;
  if (uv < 3) score -= 20;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 80) label = 'Ideal';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Fair';
  else label = 'Poor';

  return {
    name: 'Beach & Swimming',
    iconName: 'Waves',
    score,
    label,
    summary: temp >= 25 && cloud < 40 ? 'Warm & sunny beach weather!' : 'Cooler or cloudy for swimming.',
    tip: uv >= 6 ? 'Reapply SPF 50 sunscreen regularly!' : 'Check water temperature before jumping in.',
  };
}

function evaluatePhotography(cloud: number, precip: number, isDay: number, code: number): ActivityRating {
  let score = 70;
  // Golden hour / dramatic skies love light cloud cover 30-60%
  if (cloud >= 25 && cloud <= 65) score += 25;
  else if (cloud > 80) score -= 20;

  if (precip > 2) score -= 40;

  if ([95, 96, 99].includes(code)) score += 10; // dramatic storm shots if safe!

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 80) label = 'Ideal';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Fair';
  else label = 'Poor';

  return {
    name: 'Outdoor Photography',
    iconName: 'Camera',
    score,
    label,
    summary: cloud >= 25 && cloud <= 60 ? 'Soft diffuse light & dynamic clouds.' : 'Direct overhead sun or flat overcast.',
    tip: isDay ? 'Golden hour light will be crisp.' : 'Great night sky framing opportunity.',
  };
}

function evaluateLaundryDrying(temp: number, humidity: number, wind: number, precip: number, cloud: number): ActivityRating {
  if (precip > 0) {
    return {
      name: 'Outdoor Laundry Drying',
      iconName: 'Shirt',
      score: 0,
      label: 'Poor',
      summary: 'Precipitation will wet clothes.',
      tip: 'Hang clothes indoors or use a dryer.',
    };
  }

  let score = 60;
  if (temp > 20) score += 20;
  if (humidity < 50) score += 20;
  else if (humidity > 75) score -= 30;

  if (wind > 12) score += 15;
  if (cloud < 30) score += 10;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 80) label = 'Ideal';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Fair';
  else label = 'Poor';

  return {
    name: 'Outdoor Laundry Drying',
    iconName: 'Shirt',
    score,
    label,
    summary: score >= 70 ? 'Fast natural air drying environment.' : 'Slow drying due to moisture/cool air.',
    tip: 'Breezy & dry air speeds up drying time significantly.',
  };
}

function evaluateCommuting(precip: number, wind: number, code: number): ActivityRating {
  let score = 100;
  if (precip > 5) score -= 40;
  else if (precip > 0) score -= 20;

  if (wind > 35) score -= 25;

  if ([45, 48].includes(code)) score -= 35; // Fog
  if ([65, 75, 82, 95, 96, 99].includes(code)) score -= 50;

  score = Math.max(0, Math.min(100, score));

  let label: ActivityRating['label'] = 'Ideal';
  if (score >= 85) label = 'Ideal';
  else if (score >= 70) label = 'Good';
  else if (score >= 50) label = 'Fair';
  else label = 'Poor';

  return {
    name: 'Commute & Travel Safety',
    iconName: 'Car',
    score,
    label,
    summary: score >= 80 ? 'Clear traffic & travel weather.' : 'Reduced visibility / wet road delays possible.',
    tip: precip > 0 ? 'Allow 10-15 min extra travel buffer.' : 'Safe driving conditions.',
  };
}

function evaluateStargazing(cloud: number, humidity: number, precip: number, isDay: number, code: number) {
  if (precip > 0 || [95, 96, 99].includes(code)) {
    return { score: 0, verdict: 'Poor (Rain/Storm)', notes: 'Overcast or storm clouds obscuring night sky.' };
  }

  let score = 100 - cloud;
  if (humidity > 85) score -= 15; // haze

  score = Math.max(0, Math.round(score));

  let verdict = 'Excellent (Crystal Clear Skies)';
  if (score < 30) verdict = 'Poor (Heavy Cloud Cover)';
  else if (score < 60) verdict = 'Fair (Partial Sky Clarity)';
  else if (score < 85) verdict = 'Good View';

  return {
    score,
    verdict,
    notes: cloud < 20 ? 'Optimal dark sky viewing conditions. Constellations clearly visible.' : 'Passing cloud patches may obscure faint stars.',
  };
}

function findBestOutdoorWindows(hourly: RawOpenMeteoResponse['hourly']): BestWindow[] {
  if (!hourly || !hourly.time || hourly.time.length === 0) return [];

  const windows: BestWindow[] = [];
  const times = hourly.time.slice(0, 24); // next 24 hours

  let bestIndex = -1;
  let bestScore = -1;

  for (let i = 0; i < times.length; i++) {
    const temp = hourly.temperature_2m[i];
    const precipProb = hourly.precipitation_probability[i];
    const wind = hourly.wind_speed_10m[i];

    let score = 100;
    if (temp < 15 || temp > 26) score -= Math.abs(20 - temp) * 2;
    score -= precipProb * 0.8;
    if (wind > 20) score -= (wind - 20) * 1.5;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestIndex !== -1) {
    const rawTime = times[bestIndex];
    const dateObj = new Date(rawTime);
    const startStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endObj = new Date(dateObj.getTime() + 2 * 3600 * 1000);
    const endStr = endObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    windows.push({
      startTime: startStr,
      endTime: endStr,
      activity: 'Outdoor Workout & Stroll',
      score: Math.max(10, Math.min(100, Math.round(bestScore))),
      temp: hourly.temperature_2m[bestIndex],
      precipProb: hourly.precipitation_probability[bestIndex],
      reason: `Ideal temperature (${Math.round(hourly.temperature_2m[bestIndex])}°C), low precipitation chance (${hourly.precipitation_probability[bestIndex]}%), and gentle breeze.`,
    });
  }

  return windows;
}
