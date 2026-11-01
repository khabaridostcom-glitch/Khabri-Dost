import React from 'react';
import { MapPin } from 'lucide-react';

interface RegionalStatesFilterBarProps {
  userCity: string;
  searchQuery: string;
  activeStatesList: string[];
  onSelectCity: (city: string) => void;
  onSelectState: (state: string) => void;
  onOpenAllStatesModal: () => void;
}

/**
 * RegionalStatesFilterBar
 * Horizontal quick filter bar allowing readers to toggle their preferred city or state news with one tap.
 */
export const RegionalStatesFilterBar: React.FC<RegionalStatesFilterBarProps> = ({
  userCity,
  searchQuery,
  activeStatesList,
  onSelectCity,
  onSelectState,
  onOpenAllStatesModal,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-2 overflow-hidden">
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider shrink-0 bg-slate-100 px-2 py-1 rounded font-kd-meta flex items-center space-x-1">
          <span>📍</span>
          <span>राज्य व शहर:</span>
        </span>
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
          {/* User Selected City Pinned Shortcut */}
          {userCity && (
            <button
              type="button"
              onClick={() => onSelectCity(userCity)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-kd-meta shrink-0 flex items-center space-x-1 ${
                searchQuery === userCity
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
              }`}
              title="मेरा पसंदीदा शहर"
            >
              <MapPin className="w-3 h-3 text-red-600" />
              <span>{userCity}</span>
              {searchQuery === userCity && <span className="text-[10px] ml-0.5">✕</span>}
            </button>
          )}

          {activeStatesList.map((stateName) => {
            const isSelected = searchQuery === stateName;
            return (
              <button
                key={stateName}
                onClick={() => onSelectState(stateName)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-kd-meta shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200'
                }`}
              >
                <span>{stateName}</span>
                {isSelected && <span className="text-[10px] ml-0.5">✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* View All States Button */}
      <button
        type="button"
        onClick={onOpenAllStatesModal}
        className="shrink-0 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-2.5 py-1 rounded-full transition cursor-pointer flex items-center space-x-1 shadow-2xs"
        title="सभी भारतीय राज्य व केंद्र शासित प्रदेश देखें"
      >
        <span>सभी राज्य</span>
        <span className="text-[10px]">▾</span>
      </button>
    </div>
  );
};
