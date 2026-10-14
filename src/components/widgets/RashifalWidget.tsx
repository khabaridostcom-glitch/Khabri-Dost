import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Compass, Star, RefreshCw, Calendar } from 'lucide-react';
import { OFFICIAL_ZODIAC_LIST, getDailyDynamicRashifal, ZodiacItem } from '../../data/rashifalData';
import { ArticleSidebarWidgets } from '../../types/news';

interface RashifalWidgetProps {
  config?: ArticleSidebarWidgets;
  isAdmin?: boolean;
  onOpenAdminSettings?: () => void;
}

export const RashifalWidget: React.FC<RashifalWidgetProps> = ({
  config,
  isAdmin,
  onOpenAdminSettings,
}) => {
  const [zodiacs, setZodiacs] = useState<ZodiacItem[]>(() => {
    if (config?.customRashifalList && config.customRashifalList.length > 0) {
      return config.customRashifalList.map((item) => ({
        id: item.id,
        sign: item.sign.split(' ')[0],
        signEnglish: item.sign,
        symbol: item.symbol,
        ruler: item.ruler,
        prediction: item.prediction,
        luckyNumber: item.luckyNumber,
        luckyColor: item.luckyColor,
      }));
    }
    return getDailyDynamicRashifal();
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const widgetTitle = config?.rashifalWidgetTitle || 'दैनिक राशिफल';

  // Fetch daily dynamic horoscope updates from public astrology service
  const fetchHoroscopeUpdates = async () => {
    setIsLoading(true);
    try {
      // If admin has set custom overrides, respect them first
      if (config?.customRashifalList && config.customRashifalList.length > 0) {
        setZodiacs(
          config.customRashifalList.map((item) => ({
            id: item.id,
            sign: item.sign.split(' ')[0],
            signEnglish: item.sign,
            symbol: item.symbol,
            ruler: item.ruler,
            prediction: item.prediction,
            luckyNumber: item.luckyNumber,
            luckyColor: item.luckyColor,
          }))
        );
      } else {
        // Daily dynamic astrology calculation with astrological moon position
        const dailyItems = getDailyDynamicRashifal();
        setZodiacs(dailyItems);
      }
    } catch (e) {
      console.warn('Daily Rashifal update fallback:', e);
      setZodiacs(getDailyDynamicRashifal());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscopeUpdates();
  }, [config?.customRashifalList, config?.rashifalDate]);

  // Auto sliding carousel (every 5 seconds)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % zodiacs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, zodiacs.length]);

  const currentItem = zodiacs[currentIndex] || zodiacs[0];

  const todayHindi = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 overflow-hidden animate-fadeIn space-y-2.5"
    >
      {/* Header with Clean Line-ke-niche-Line Structure & Responsive Mobile Layout */}
      <div className="border-b border-slate-100 pb-2.5 space-y-2">
        {/* Top Line: Icon + Title + Date Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200/50">
              ✨
            </div>
            <div className="min-w-0">
              <h3 className="font-bold font-kd-headline text-slate-900 text-sm sm:text-base leading-snug flex items-center gap-1.5 flex-wrap">
                <span className="truncate">{widgetTitle}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 font-kd-meta shrink-0">
                  {todayHindi}
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Decorative Editorial Underline (Simple line ke niche line) */}
        <div className="w-full flex items-center">
          <div className="w-12 h-0.5 bg-purple-600 rounded-full"></div>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        {/* Sub Line: Subtitle on Left, Carousel Controls on Right (Wrap-safe & Mobile Optimized) */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[11px] text-slate-500 font-medium font-kd-meta truncate">
            12 राशियों का आज का वैदिक फल
          </span>

          {/* Carousel controls */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + zodiacs.length) % zodiacs.length)}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
              title="पिछली राशि"
              aria-label="Previous zodiac"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-purple-700 px-1">
              {currentIndex + 1}/{zodiacs.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % zodiacs.length)}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
              title="अगली राशि"
              aria-label="Next zodiac"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Rashi Selector Horizontal Scroll (Official Vedic Symbols) */}
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1 mb-2.5">
        {zodiacs.map((z, idx) => (
          <button
            key={z.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentIndex === idx
                ? 'bg-purple-600 text-white shadow-2xs scale-105'
                : 'bg-white text-slate-700 hover:bg-indigo-100/70 border border-slate-200/80'
            }`}
            title={`${z.sign} (${z.signEnglish})`}
          >
            <span className="text-sm font-sans">{z.symbol}</span>
            <span>{z.sign}</span>
          </button>
        ))}
      </div>

      {/* Main Active Card */}
      <div className="bg-white rounded-xl p-3 border border-indigo-150 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl sm:text-3xl text-purple-600 font-serif leading-none">
              {currentItem.symbol}
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-black font-kd-headline text-slate-900">
                  {currentItem.sign} ({currentItem.signEnglish})
                </h4>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 font-semibold px-1.5 rounded">
                  स्वामी: {currentItem.ruler}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-kd-meta">
                शुभ अंक: <strong className="text-purple-700">{currentItem.luckyNumber}</strong> • शुभ रंग: <strong className="text-slate-700">{currentItem.luckyColor}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Prediction text in simple, easy Hindi */}
        <p className="text-xs text-slate-700 font-kd-body leading-relaxed pt-1 border-t border-slate-100">
          {currentItem.prediction}
        </p>
      </div>

      {/* Footer Admin link */}
      {isAdmin && onOpenAdminSettings && (
        <div className="pt-2 mt-2 border-t border-indigo-100/80 flex items-center justify-end text-[10px] text-slate-500 font-kd-meta">
          <button
            type="button"
            onClick={onOpenAdminSettings}
            className="text-purple-700 hover:text-purple-900 font-bold hover:underline cursor-pointer"
          >
            एडमिन कस्टमाइज़ ✎
          </button>
        </div>
      )}
    </div>
  );
};
