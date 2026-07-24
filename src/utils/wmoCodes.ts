export interface WMOCodeInfo {
  description: string;
  shortDescription: string;
  icon: string; // Lucide icon identifier
  isNightVariantAvailable?: boolean;
  theme: {
    bgGradient: string; // Tailwind background gradient for main card
    backdropGradient: string; // Whole page atmospheric glow
    textAccent: string;
    badgeBg: string;
    cardBg: string;
  };
  severity: 'normal' | 'notice' | 'severe';
}

export const WMO_CODES: Record<number, WMOCodeInfo> = {
  0: {
    description: 'Clear Sky',
    shortDescription: 'Clear',
    icon: 'Sun',
    isNightVariantAvailable: true,
    theme: {
      bgGradient: 'from-amber-500/20 via-orange-400/15 to-sky-500/10',
      backdropGradient: 'from-amber-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      cardBg: 'bg-slate-900/60 border-amber-500/20',
    },
    severity: 'normal',
  },
  1: {
    description: 'Mainly Clear',
    shortDescription: 'Mostly Clear',
    icon: 'SunDim',
    isNightVariantAvailable: true,
    theme: {
      bgGradient: 'from-sky-500/20 via-amber-400/10 to-slate-800/20',
      backdropGradient: 'from-sky-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-sky-300',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      cardBg: 'bg-slate-900/60 border-sky-500/20',
    },
    severity: 'normal',
  },
  2: {
    description: 'Partly Cloudy',
    shortDescription: 'Partly Cloudy',
    icon: 'CloudSun',
    isNightVariantAvailable: true,
    theme: {
      bgGradient: 'from-blue-500/20 via-slate-700/20 to-sky-600/15',
      backdropGradient: 'from-blue-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-sky-300',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      cardBg: 'bg-slate-900/60 border-sky-500/20',
    },
    severity: 'normal',
  },
  3: {
    description: 'Overcast',
    shortDescription: 'Overcast',
    icon: 'Cloud',
    theme: {
      bgGradient: 'from-slate-600/20 via-gray-700/20 to-slate-800/20',
      backdropGradient: 'from-slate-950 via-slate-900 to-slate-950',
      textAccent: 'text-slate-300',
      badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      cardBg: 'bg-slate-900/60 border-slate-700/30',
    },
    severity: 'normal',
  },
  45: {
    description: 'Fog',
    shortDescription: 'Foggy',
    icon: 'CloudFog',
    theme: {
      bgGradient: 'from-zinc-500/20 via-slate-600/20 to-teal-900/10',
      backdropGradient: 'from-zinc-950 via-slate-900 to-slate-950',
      textAccent: 'text-zinc-300',
      badgeBg: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
      cardBg: 'bg-slate-900/60 border-zinc-700/30',
    },
    severity: 'notice',
  },
  48: {
    description: 'Depositing Rime Fog',
    shortDescription: 'Freezing Fog',
    icon: 'CloudFog',
    theme: {
      bgGradient: 'from-cyan-500/20 via-teal-700/20 to-slate-800/20',
      backdropGradient: 'from-cyan-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      cardBg: 'bg-slate-900/60 border-cyan-500/20',
    },
    severity: 'notice',
  },
  51: {
    description: 'Light Drizzle',
    shortDescription: 'Light Drizzle',
    icon: 'CloudDrizzle',
    theme: {
      bgGradient: 'from-cyan-500/20 via-blue-600/15 to-slate-800/20',
      backdropGradient: 'from-cyan-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      cardBg: 'bg-slate-900/60 border-cyan-500/20',
    },
    severity: 'normal',
  },
  53: {
    description: 'Moderate Drizzle',
    shortDescription: 'Drizzle',
    icon: 'CloudDrizzle',
    theme: {
      bgGradient: 'from-blue-500/20 via-cyan-600/20 to-slate-800/20',
      backdropGradient: 'from-blue-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-blue-300',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      cardBg: 'bg-slate-900/60 border-blue-500/20',
    },
    severity: 'normal',
  },
  55: {
    description: 'Dense Drizzle',
    shortDescription: 'Heavy Drizzle',
    icon: 'CloudDrizzle',
    theme: {
      bgGradient: 'from-blue-600/25 via-cyan-700/20 to-slate-800/20',
      backdropGradient: 'from-blue-950 via-slate-900 to-slate-950',
      textAccent: 'text-blue-300',
      badgeBg: 'bg-blue-500/25 text-blue-300 border-blue-500/30',
      cardBg: 'bg-slate-900/60 border-blue-500/20',
    },
    severity: 'notice',
  },
  56: {
    description: 'Light Freezing Drizzle',
    shortDescription: 'Freezing Drizzle',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-teal-500/20 via-cyan-600/20 to-blue-800/20',
      backdropGradient: 'from-teal-950 via-slate-900 to-slate-950',
      textAccent: 'text-teal-300',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      cardBg: 'bg-slate-900/60 border-teal-500/20',
    },
    severity: 'notice',
  },
  57: {
    description: 'Dense Freezing Drizzle',
    shortDescription: 'Freezing Drizzle',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-teal-600/25 via-cyan-700/20 to-slate-800/20',
      backdropGradient: 'from-teal-950 via-slate-900 to-slate-950',
      textAccent: 'text-teal-300',
      badgeBg: 'bg-teal-500/25 text-teal-300 border-teal-500/30',
      cardBg: 'bg-slate-900/60 border-teal-500/20',
    },
    severity: 'severe',
  },
  61: {
    description: 'Slight Rain',
    shortDescription: 'Light Rain',
    icon: 'CloudRain',
    theme: {
      bgGradient: 'from-blue-500/20 via-sky-600/20 to-slate-800/20',
      backdropGradient: 'from-blue-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-sky-300',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      cardBg: 'bg-slate-900/60 border-sky-500/20',
    },
    severity: 'normal',
  },
  63: {
    description: 'Moderate Rain',
    shortDescription: 'Moderate Rain',
    icon: 'CloudRain',
    theme: {
      bgGradient: 'from-blue-600/25 via-indigo-700/20 to-slate-900/20',
      backdropGradient: 'from-indigo-950/30 via-slate-900 to-slate-950',
      textAccent: 'text-blue-300',
      badgeBg: 'bg-blue-500/25 text-blue-300 border-blue-500/30',
      cardBg: 'bg-slate-900/60 border-blue-500/20',
    },
    severity: 'notice',
  },
  65: {
    description: 'Heavy Rain',
    shortDescription: 'Heavy Rain',
    icon: 'CloudRainWind',
    theme: {
      bgGradient: 'from-blue-700/30 via-indigo-800/25 to-slate-950',
      backdropGradient: 'from-blue-950 via-indigo-950 to-slate-950',
      textAccent: 'text-blue-300',
      badgeBg: 'bg-blue-500/30 text-blue-300 border-blue-400/40',
      cardBg: 'bg-slate-900/60 border-blue-400/30',
    },
    severity: 'severe',
  },
  66: {
    description: 'Light Freezing Rain',
    shortDescription: 'Freezing Rain',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-cyan-600/25 via-blue-800/25 to-slate-900',
      backdropGradient: 'from-cyan-950 via-slate-900 to-slate-950',
      textAccent: 'text-cyan-300',
      badgeBg: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/30',
      cardBg: 'bg-slate-900/60 border-cyan-500/20',
    },
    severity: 'severe',
  },
  67: {
    description: 'Heavy Freezing Rain',
    shortDescription: 'Freezing Rain',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-cyan-700/30 via-blue-900/30 to-slate-950',
      backdropGradient: 'from-cyan-950 via-blue-950 to-slate-950',
      textAccent: 'text-cyan-200',
      badgeBg: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/40',
      cardBg: 'bg-slate-900/60 border-cyan-400/30',
    },
    severity: 'severe',
  },
  71: {
    description: 'Slight Snow Fall',
    shortDescription: 'Light Snow',
    icon: 'Snowflake',
    theme: {
      bgGradient: 'from-cyan-400/20 via-sky-500/15 to-slate-800/20',
      backdropGradient: 'from-cyan-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-cyan-200',
      badgeBg: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/30',
      cardBg: 'bg-slate-900/60 border-cyan-400/20',
    },
    severity: 'normal',
  },
  73: {
    description: 'Moderate Snow Fall',
    shortDescription: 'Snow',
    icon: 'Snowflake',
    theme: {
      bgGradient: 'from-sky-300/20 via-cyan-500/20 to-slate-800/20',
      backdropGradient: 'from-sky-950/30 via-slate-900 to-slate-950',
      textAccent: 'text-sky-200',
      badgeBg: 'bg-sky-400/20 text-sky-200 border-sky-400/30',
      cardBg: 'bg-slate-900/60 border-sky-400/20',
    },
    severity: 'notice',
  },
  75: {
    description: 'Heavy Snow Fall',
    shortDescription: 'Heavy Snow',
    icon: 'Snowflake',
    theme: {
      bgGradient: 'from-cyan-300/25 via-blue-500/25 to-slate-900',
      backdropGradient: 'from-sky-950 via-blue-950 to-slate-950',
      textAccent: 'text-cyan-100',
      badgeBg: 'bg-cyan-300/25 text-cyan-100 border-cyan-300/40',
      cardBg: 'bg-slate-900/60 border-cyan-300/30',
    },
    severity: 'severe',
  },
  77: {
    description: 'Snow Grains',
    shortDescription: 'Snow Grains',
    icon: 'Snowflake',
    theme: {
      bgGradient: 'from-teal-400/20 via-sky-500/15 to-slate-800/20',
      backdropGradient: 'from-teal-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-teal-200',
      badgeBg: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
      cardBg: 'bg-slate-900/60 border-teal-400/20',
    },
    severity: 'notice',
  },
  80: {
    description: 'Slight Rain Showers',
    shortDescription: 'Light Showers',
    icon: 'CloudSunRain',
    isNightVariantAvailable: true,
    theme: {
      bgGradient: 'from-sky-500/20 via-indigo-600/15 to-slate-800/20',
      backdropGradient: 'from-sky-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-sky-300',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      cardBg: 'bg-slate-900/60 border-sky-500/20',
    },
    severity: 'normal',
  },
  81: {
    description: 'Moderate Rain Showers',
    shortDescription: 'Showers',
    icon: 'CloudRain',
    theme: {
      bgGradient: 'from-blue-500/25 via-indigo-600/20 to-slate-900',
      backdropGradient: 'from-blue-950/30 via-slate-900 to-slate-950',
      textAccent: 'text-blue-300',
      badgeBg: 'bg-blue-500/25 text-blue-300 border-blue-500/30',
      cardBg: 'bg-slate-900/60 border-blue-500/20',
    },
    severity: 'notice',
  },
  82: {
    description: 'Violent Rain Showers',
    shortDescription: 'Heavy Showers',
    icon: 'CloudRainWind',
    theme: {
      bgGradient: 'from-blue-700/30 via-indigo-900/30 to-slate-950',
      backdropGradient: 'from-indigo-950 via-slate-950 to-black',
      textAccent: 'text-indigo-300',
      badgeBg: 'bg-indigo-500/30 text-indigo-300 border-indigo-400/40',
      cardBg: 'bg-slate-900/60 border-indigo-400/30',
    },
    severity: 'severe',
  },
  85: {
    description: 'Slight Snow Showers',
    shortDescription: 'Snow Showers',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-sky-400/20 via-cyan-600/20 to-slate-800/20',
      backdropGradient: 'from-sky-950/20 via-slate-900 to-slate-950',
      textAccent: 'text-sky-200',
      badgeBg: 'bg-sky-400/20 text-sky-200 border-sky-400/30',
      cardBg: 'bg-slate-900/60 border-sky-400/20',
    },
    severity: 'notice',
  },
  86: {
    description: 'Heavy Snow Showers',
    shortDescription: 'Heavy Snow Showers',
    icon: 'CloudSnow',
    theme: {
      bgGradient: 'from-cyan-400/25 via-blue-700/25 to-slate-900',
      backdropGradient: 'from-cyan-950 via-blue-950 to-slate-950',
      textAccent: 'text-cyan-200',
      badgeBg: 'bg-cyan-400/25 text-cyan-200 border-cyan-400/30',
      cardBg: 'bg-slate-900/60 border-cyan-400/30',
    },
    severity: 'severe',
  },
  95: {
    description: 'Thunderstorm',
    shortDescription: 'Thunderstorm',
    icon: 'CloudLightning',
    theme: {
      bgGradient: 'from-purple-600/30 via-amber-600/20 to-slate-950',
      backdropGradient: 'from-purple-950 via-slate-950 to-black',
      textAccent: 'text-amber-300',
      badgeBg: 'bg-purple-500/30 text-amber-300 border-amber-400/40',
      cardBg: 'bg-slate-900/60 border-amber-400/30',
    },
    severity: 'severe',
  },
  96: {
    description: 'Thunderstorm with Slight Hail',
    shortDescription: 'Thunderstorm & Hail',
    icon: 'CloudLightning',
    theme: {
      bgGradient: 'from-purple-700/35 via-rose-700/25 to-slate-950',
      backdropGradient: 'from-purple-950 via-slate-950 to-black',
      textAccent: 'text-amber-200',
      badgeBg: 'bg-rose-500/30 text-amber-200 border-rose-400/40',
      cardBg: 'bg-slate-900/60 border-rose-400/30',
    },
    severity: 'severe',
  },
  99: {
    description: 'Thunderstorm with Heavy Hail',
    shortDescription: 'Severe Hailstorm',
    icon: 'CloudLightning',
    theme: {
      bgGradient: 'from-rose-800/40 via-purple-900/30 to-black',
      backdropGradient: 'from-rose-950 via-purple-950 to-black',
      textAccent: 'text-rose-300',
      badgeBg: 'bg-rose-600/40 text-rose-200 border-rose-400/50',
      cardBg: 'bg-slate-900/60 border-rose-400/40',
    },
    severity: 'severe',
  },
};

export function getWMOCodeInfo(code: number, isDay = 1): WMOCodeInfo {
  const info = WMO_CODES[code];
  if (!info) {
    return {
      description: 'Unknown Conditions',
      shortDescription: 'Unknown',
      icon: 'Cloud',
      theme: {
        bgGradient: 'from-slate-700/20 to-slate-900/20',
        backdropGradient: 'from-slate-950 via-slate-900 to-slate-950',
        textAccent: 'text-slate-300',
        badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        cardBg: 'bg-slate-900/60 border-slate-700/30',
      },
      severity: 'normal',
    };
  }

  // Adjust icon for night if day is 0
  if (isDay === 0 && info.isNightVariantAvailable) {
    if (code === 0 || code === 1) {
      return {
        ...info,
        icon: 'Moon',
        theme: {
          ...info.theme,
          bgGradient: 'from-indigo-600/25 via-slate-800/20 to-slate-950',
          backdropGradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
          textAccent: 'text-indigo-300',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        },
      };
    }
    if (code === 2 || code === 80) {
      return {
        ...info,
        icon: 'CloudMoon',
      };
    }
  }

  return info;
}
