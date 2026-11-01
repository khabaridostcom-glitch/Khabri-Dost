import React, { useState, useRef } from 'react';
import {
  Flame,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Pause,
  Play,
  Sliders,
  Radio,
  Clock,
} from 'lucide-react';
import { NewsArticle, SpotlightLayoutSettings } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';

interface SpotlightBriefTickerProps {
  articles: NewsArticle[];
  config?: Partial<SpotlightLayoutSettings['briefTicker']>;
  onSelectArticle: (article: NewsArticle) => void;
  onOpenSettings?: () => void;
  onViewAllCategory?: (category: string) => void;
}

export const SpotlightBriefTicker: React.FC<SpotlightBriefTickerProps> = ({
  articles,
  config,
  onSelectArticle,
  onOpenSettings,
  onViewAllCategory,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const title = config?.title || 'बड़ी सुर्खियां • FAST BRIEFS';
  const showCategory = config?.showCategoryBadge !== false; // Admin option: whether to show category or not
  const speed = config?.slideSpeed || 'normal';
  const pauseOnHover = config?.pauseOnHover !== false;

  // User request: "is card mein sirf 4 se 5 news hi slide karni chahiye"
  const validArticles = (articles.length > 0 ? articles : []).slice(0, 5);

  // Determine speed animation class
  const animationClass = {
    slow: 'animate-vertical-ticker-slow',
    normal: 'animate-vertical-ticker',
    fast: 'animate-vertical-ticker-fast',
  }[speed];

  // Manual scroll step helper
  const handleScrollUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop -= 90;
    }
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += 90;
    }
  };

  if (validArticles.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
        <div className="text-center py-8 text-slate-400 text-xs">
          कोई सुर्खियां उपलब्ध नहीं हैं।
        </div>
      </div>
    );
  }

  // Duplicate the 4-5 items to make the upward continuous sliding loop smooth and seamless
  const displayItems = [...validArticles, ...validArticles];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Header with Title, Live Badge, and Admin/Playback Controls */}
      <div className="border-b border-slate-100 pb-2 mb-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 font-['Rozha_One',serif]">
              {title}
            </h3>
            <span className="text-[10px] text-slate-400 font-sans font-semibold">
              ({validArticles.length})
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'ऊपर स्लाइडिंग जारी रखें' : 'स्लाइडिंग रोकें'}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 fill-slate-600 text-slate-600" /> : <Pause className="w-3 h-3" />}
            </button>

            {/* Manual Step Jump Buttons */}
            <button
              onClick={handleScrollUp}
              title="ऊपर स्क्रॉल करें"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleScrollDown}
              title="नीचे स्क्रॉल करें"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Quick Admin Settings Trigger */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                title="3rd कार्ड सेटिंग्स (Admin Customization: विषय व स्पीड)"
                className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upward Sliding Container (Continuous bottom-to-top vertical sliding marquee) */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        className="relative flex-1 min-h-0 overflow-hidden"
      >
        {/* Top and bottom subtle fade overlays for smooth appearance */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

        {/* The Animated Moving Track */}
        <div
          className={`space-y-2 pt-0.5 pb-2 ${!isPaused ? animationClass : ''}`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {displayItems.map((art, idx) => {
            const originalIndex = (idx % validArticles.length) + 1;
            return (
              <div
                key={`${art.id}-${idx}`}
                onClick={() => onSelectArticle(art)}
                className="cursor-pointer group/item p-2 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/40 transition-all duration-200 bg-white shadow-2xs"
              >
                {/* Meta row: Category (if enabled by admin) & Time */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    {showCategory ? (
                      <span className="font-bold text-red-600 uppercase px-1.5 py-0.2 rounded bg-red-50 border border-red-100">
                        {art.category}
                      </span>
                    ) : (
                      <span className="font-bold text-slate-500 uppercase">
                        {art.location || 'ताज़ा ख़बर'}
                      </span>
                    )}
                    {art.location && showCategory && (
                      <span className="truncate text-slate-400">• {art.location}</span>
                    )}
                  </div>

                  <span className="shrink-0 flex items-center space-x-1 text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>
                      {new Date(art.createdAt).toLocaleTimeString('hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>

                {/* News Headline */}
                <h4 className="text-[13px] sm:text-sm font-bold font-kd-headline text-slate-900 group-hover/item:text-red-700 transition leading-snug">
                  <span className="text-red-600 font-sans font-bold mr-1.5">
                    {originalIndex}.
                  </span>
                  {art.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Link */}
      <div className="pt-2 mt-1 border-t border-slate-100 shrink-0">
        <button
          onClick={() => onViewAllCategory && onViewAllCategory(config?.category || 'all')}
          className="w-full text-center text-[11px] font-bold text-red-600 hover:text-red-800 transition py-1.5 rounded-lg bg-red-50/70 hover:bg-red-100/70 flex items-center justify-center space-x-1 cursor-pointer"
        >
          <span>
            {config?.category && config.category !== 'all'
              ? `सभी ${config.category} की ख़बरें पढ़ें`
              : 'सभी ताज़ा ख़बरें पढ़ें'}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
