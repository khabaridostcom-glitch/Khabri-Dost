import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Bookmark,
  Share2,
  Clock,
  Eye,
  Sliders,
  Pause,
  Play,
} from 'lucide-react';
import { NewsArticle, PortalSettings, SpotlightLayoutSettings } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';

interface SpotlightHeroSliderProps {
  articles: NewsArticle[];
  sliderConfig?: SpotlightLayoutSettings['heroSlider'];
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  isReadLater?: (id: string) => boolean;
  onToggleReadLater?: (article: NewsArticle) => void;
  displayOptions?: PortalSettings['displayOptions'];
  mobileScale?: 'compact' | 'normal' | 'large';
  onOpenSettings?: () => void;
}

export const SpotlightHeroSlider: React.FC<SpotlightHeroSliderProps> = ({
  articles,
  sliderConfig,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  isReadLater,
  onToggleReadLater,
  displayOptions = {
    showExcerptOnMobile: false,
    showAuthor: true,
    showDate: true,
    showViews: true,
    showLocation: true,
    cardStyle: 'compact',
  },
  mobileScale = 'normal',
  onOpenSettings,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const enabled = sliderConfig?.enabled !== false;
  const autoPlay = sliderConfig?.autoPlay !== false;
  const intervalSeconds = sliderConfig?.slideIntervalSeconds || 5;
  const showArrows = sliderConfig?.showArrows !== false;
  const showDots = sliderConfig?.showDots !== false;

  const validArticles = articles.length > 0 ? articles : [];
  const count = validArticles.length;

  // Auto sliding timer
  useEffect(() => {
    if (!enabled || !autoPlay || isPaused || count <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, Math.max(2000, intervalSeconds * 1000));

    return () => clearInterval(timer);
  }, [enabled, autoPlay, isPaused, count, intervalSeconds]);

  // If index out of bounds on articles update
  useEffect(() => {
    if (currentIndex >= count && count > 0) {
      setCurrentIndex(0);
    }
  }, [count, currentIndex]);

  if (count === 0) {
    return (
      <div className="h-full min-h-[360px] bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center p-6 text-center text-slate-500 text-sm">
        कोई प्रमुख समाचार उपलब्ध नहीं है।
      </div>
    );
  }

  const currentArticle = validArticles[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(currentArticle);
  };

  const handleReadLaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleReadLater) {
      onToggleReadLater(currentArticle);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: currentArticle.title,
          text: currentArticle.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const bookmarked = isBookmarked(currentArticle.id);

  // Mobile scale adjustment classes
  const titleMobileSizeClass = {
    compact: 'text-base sm:text-xl',
    normal: 'text-lg sm:text-2xl',
    large: 'text-xl sm:text-3xl',
  }[mobileScale];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => onSelectArticle(currentArticle)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/90 cursor-pointer flex flex-col h-full select-none"
    >
      {/* Media / Photo Area with Modern aspect-video & CSS Skeleton Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse pointer-events-none" />
        <img
          key={currentArticle.id}
          src={currentArticle.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
          alt={currentArticle.imageAltText || currentArticle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out animate-fadeIn relative z-0"
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-[1]" />

        {/* Badges on Top Left */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 max-w-[55%] flex flex-wrap gap-1 sm:gap-1.5 items-center font-kd-meta z-10">
          {currentArticle.isBreaking && (
            <span className="bg-red-600 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-md animate-pulse">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
              <span>ब्रेकिंग</span>
            </span>
          )}
          <span className="bg-slate-900/90 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs border border-white/10 truncate max-w-[90px] sm:max-w-none">
            {currentArticle.category}
          </span>
        </div>

        {/* Top Right Action Buttons */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex items-center space-x-1 sm:space-x-1.5 z-10 shrink-0">
          {count > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              title={isPaused ? 'स्लाइडिंग शुरू करें' : 'स्लाइडिंग रोकें'}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition shadow-sm cursor-pointer"
            >
              {isPaused ? <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" /> : <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSettings();
              }}
              title="स्लाइडर व कार्ड सेटिंग्स (Admin Customization)"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600/85 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition shadow-sm cursor-pointer"
            >
              <Sliders className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          )}

          {onToggleReadLater && (
            <button
              onClick={handleReadLaterClick}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-sm cursor-pointer ${
                isReadLater && isReadLater(currentArticle.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/75 hover:bg-slate-900 text-white/90 hover:text-white'
              }`}
              title={isReadLater && isReadLater(currentArticle.id) ? 'रीड लेटर से हटाएं' : 'बाद में पढ़ें (Read Later)'}
            >
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          )}

          <button
            onClick={handleBookmarkClick}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-sm cursor-pointer ${
              bookmarked
                ? 'bg-red-600 text-white'
                : 'bg-slate-900/75 hover:bg-slate-900 text-white/90 hover:text-white'
            }`}
            title="बुकमार्क करें"
          >
            <Bookmark className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${bookmarked ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={handleShareClick}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition shadow-sm cursor-pointer"
            title="शेयर करें"
          >
            <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>

        {/* Slider Navigation Arrows */}
        {enabled && count > 1 && showArrows && (
          <>
            <button
              onClick={handlePrev}
              aria-label="पिछली स्लाइड"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition duration-200 z-10 shadow-md cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="अगली स्लाइड"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition duration-200 z-10 shadow-md cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Slider Progress Indicator Dots inside image */}
        {enabled && count > 1 && showDots && (
          <div className="absolute bottom-2 right-3 flex items-center space-x-1.5 z-20">
            {validArticles.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-red-600' : 'w-1.5 bg-white/70 hover:bg-white'
                }`}
                aria-label={`स्लाइड ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content & Details - Filled proportionally to eliminate awkward gaps */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Location Kicker Row */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1 font-kd-meta">
            <span className="text-red-600 font-bold uppercase tracking-wide">
              {currentArticle.category}
            </span>
            {displayOptions.showLocation && currentArticle.location && (
              <span className="text-slate-400">• {currentArticle.location}</span>
            )}
            {currentArticle.isBreaking && (
              <span className="text-red-600 font-semibold">• बड़ी ख़बर</span>
            )}
          </div>

          {/* Prominent Editorial Headline - Visible on both desktop & mobile */}
          <h2
            className={`text-base sm:text-lg md:text-xl font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition leading-snug mb-1.5`}
          >
            {currentArticle.title}
          </h2>

          {/* Summary / Excerpt - Line-clamped to maintain perfect height balance */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 font-kd-body leading-relaxed">
            {currentArticle.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
