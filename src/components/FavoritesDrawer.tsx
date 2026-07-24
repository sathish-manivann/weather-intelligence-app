import React from 'react';
import { GeoLocationResult } from '../types/weather';
import { X, Bookmark, Trash2, MapPin, Globe } from 'lucide-react';

interface FavoritesDrawerProps {
  favorites: GeoLocationResult[];
  onSelectCity: (city: GeoLocationResult) => void;
  onRemoveFavorite: (cityId: number) => void;
  onClose: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Saved Cities</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold">
                {favorites.length}
              </span>
            </div>

            <button
              id="btn-close-favorites-drawer"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of saved cities */}
          {favorites.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Globe className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No favorite cities saved yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the star icon on any city card to save it for quick 1-click access.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {favorites.map((city) => (
                <div
                  key={`fav-${city.id}`}
                  className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center justify-between gap-3 group"
                >
                  <button
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-sky-500/20 flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-colors shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(city.id)}
                    title="Remove city"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Favorites stored locally in browser session
        </div>
      </div>
    </div>
  );
};
