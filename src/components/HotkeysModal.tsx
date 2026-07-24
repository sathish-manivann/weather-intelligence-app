import React from 'react';
import { Keyboard, X, Command, Search, RefreshCw, Thermometer, CornerDownLeft } from 'lucide-react';

interface HotkeysModalProps {
  onClose: () => void;
}

export const HotkeysModal: React.FC<HotkeysModalProps> = ({ onClose }) => {
  const hotkeysList = [
    {
      key: '/',
      label: 'Focus Search Bar',
      description: 'Instantly highlights city search field to type new location',
      icon: Search,
    },
    {
      key: 'Esc',
      label: 'Close Modals & Drawers',
      description: 'Dismisses active search dropdowns, favorites drawer, or reports',
      icon: CornerDownLeft,
    },
    {
      key: 'R',
      label: 'Refresh Weather',
      description: 'Triggers live data revalidation from Open-Meteo',
      icon: RefreshCw,
    },
    {
      key: 'U',
      label: 'Toggle Units',
      description: 'Switches temperature scale between Celsius (°C) and Fahrenheit (°F)',
      icon: Thermometer,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0f0f0f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Power-User Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-400">
                Navigate & control weather intelligence with hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotkeys Table */}
        <div className="p-5 space-y-3 bg-[#141414]">
          {hotkeysList.map((hk) => {
            const IconComponent = hk.icon;
            return (
              <div
                key={hk.key}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0f0f0f] border border-white/5 hover:border-sky-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-300 group-hover:text-sky-400 flex items-center justify-center transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                      {hk.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{hk.description}</div>
                  </div>
                </div>

                <kbd className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-sky-400 shadow-inner shrink-0">
                  {hk.key}
                </kbd>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0f0f0f] border-t border-white/5 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Command className="w-3.5 h-3.5 text-sky-400" />
          <span>Press any key while viewing the app to trigger shortcuts</span>
        </div>
      </div>
    </div>
  );
};
