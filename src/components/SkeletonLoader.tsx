import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-slate-800/60 rounded-lg" />
          </div>
          <div className="h-8 w-24 bg-slate-800 rounded-full" />
        </div>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800" />
          <div className="space-y-3">
            <div className="h-14 w-40 bg-slate-800 rounded-2xl" />
            <div className="h-4 w-28 bg-slate-800/60 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={`skel-grid-${i}`} className="h-32 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-8 w-28 bg-slate-800 rounded-lg" />
            <div className="h-3 w-36 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly timeline skeleton */}
      <div className="h-44 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="h-5 w-36 bg-slate-800 rounded" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={`skel-hourly-${i}`} className="w-24 h-24 rounded-2xl bg-slate-800/60 shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
};
