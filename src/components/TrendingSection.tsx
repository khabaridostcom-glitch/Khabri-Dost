import React, { useRef } from 'react';
import {
  Flame,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Settings,
  ArrowRight,
  Share2,
  Zap,
} from 'lucide-react';
import { NewsArticle, TrendingSectionConfig, HeadlineStylingConfig } from '../types/news';

interface TrendingSectionProps {
  articles: NewsArticle[];
  config?: TrendingSectionConfig;
  trendingTopics?: string[];
  onSelectArticle: (article: NewsArticle) => void;
  onSelectTopic?: (topic: string) => void;
  onViewAllTrending?: () => void;
  onOpenAdminTrending?: () => void;
  isAdmin?: boolean;
  headlineStyling?: HeadlineStylingConfig;
  onQuickRead?: (article: NewsArticle) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  articles,
  config,
  trendingTopics = [],
  onSelectArticle,
  onSelectTopic,
  onViewAllTrending,
  onOpenAdminTrending,
  isAdmin = false,
  headlineStyling,
  onQuickRead,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // If explicitly disabled in config, don't render
  if (config?.enabled === false) {
    return null;
  }

  // Filter and slice according to config
  const maxItems = config?.itemCount || 8;
  const displayArticles = articles.slice(0, maxItems);

  if (displayArticles.length === 0) {
    return null;
  }

  const title = config?.title || 'ट्रेंडिंग न्यूज़ • सबसे ज्यादा पढ़ी जा रही सुर्खियां';
  const subTitle =
    config?.subTitle || '24 घंटे में पाठकों द्वारा सबसे ज्यादा पढ़ी, शेयर और पसंद की गई प्रमुख खबरें';
  const badgeText = config?.badgeText || '🔥 ट्रेंडिंग नाउ';
  const displayStyle = config?.displayStyle || 'hero_grid';
  const showRankBadges = config?.showRankBadges !== false;
  const showViewCounts = config?.showViewCounts !== false;
  const showFireBadge = config?.showFireBadge !== false;
  const showCategoryTag = config?.showCategoryTag !== false;
  const showReadTime = config?.showReadTime !== false;
  const showHashtagsBar = config?.showHashtagsBar !== false && trendingTopics.length > 0;

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getRankBadgeClasses = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-1 ring-amber-300';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-sm ring-1 ring-slate-400';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 shadow-sm ring-1 ring-amber-500';
    }
    return 'bg-slate-900/85 text-white backdrop-blur-xs';
  };

  return (
    <section
      id="trending-news-section"
      className="scroll-mt-24 space-y-4 rounded-2xl bg-gradient-to-b from-orange-50/40 via-white to-slate-50/60 p-3 sm:p-5 border border-orange-200/80 shadow-xs relative overflow-hidden transition-all duration-300"
    >
      {/* Anchor for backward compatibility with old links */}
      <div id="trending-keywords-section" className="sr-only" />

      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER BAR */}
      <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-orange-200/90 relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          {showFireBadge && (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-sm sm:text-lg md:text-xl font-bold font-kd-headline text-slate-900 tracking-tight truncate">
              {title}
            </h2>
            {subTitle && (
              <p className="text-[10px] sm:text-xs text-slate-500 font-kd-meta truncate hidden sm:block">
                {subTitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls: View All + Carousel Controls + Admin Quick Edit */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {displayStyle === 'carousel' && (
            <div className="flex items-center space-x-1 mr-1">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition shadow-2xs cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition shadow-2xs cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {onViewAllTrending && (
            <button
              type="button"
              onClick={onViewAllTrending}
              className="text-[11px] sm:text-xs font-bold text-red-700 hover:text-white bg-white sm:bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl transition flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <span>सभी ट्रेंडिंग</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}

          {isAdmin && onOpenAdminTrending && (
            <button
              type="button"
              onClick={onOpenAdminTrending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Manage Trending Settings & Pinned Articles"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. CONTENT LAYOUT BY DISPLAY STYLE */}

      {/* STYLE A: HERO GRID (1 Large Hero Card + 3-4 Secondary Cards) */}
      {displayStyle === 'hero_grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Main #1 Trending Hero Feature Card (7 Cols) */}
          {displayArticles[0] && (
            <div
              onClick={() => onSelectArticle(displayArticles[0])}
              className="lg:col-span-7 group bg-white rounded-2xl overflow-hidden border border-orange-200/90 shadow-xs hover:shadow-md hover:border-red-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse pointer-events-none" />
                <img
                  src={displayArticles[0].imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                  alt={displayArticles[0].imageAltText || displayArticles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-0"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-[1]" />

                {/* Badges Top Left & Right */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center space-x-1.5 z-10 max-w-[65%] truncate">
                  {showRankBadges && (
                    <span
                      className={`text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center space-x-1 shrink-0 ${getRankBadgeClasses(
                        1
                      )}`}
                    >
                      <span>🔥 #1 ट्रेंडिंग</span>
                    </span>
                  )}
                  {showCategoryTag && (
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md uppercase font-kd-meta truncate">
                      {displayArticles[0].category}
                    </span>
                  )}
                </div>

                {showViewCounts && (
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center space-x-1 z-10 shrink-0">
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                    <span>{displayArticles[0].viewsCount?.toLocaleString() || 1200} पाठक</span>
                  </div>
                )}

                {/* Headline on Overlay for Hero Card */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white z-[2]">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-slate-300 mb-1 font-kd-meta">
                    {displayArticles[0].location && <span>📍 {displayArticles[0].location} •</span>}
                    <span className="truncate">{displayArticles[0].authorName}</span>
                    {showReadTime && (
                      <span className="flex items-center space-x-1 ml-auto shrink-0">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{displayArticles[0].readTimeMinutes || 3} मिनट</span>
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      color: headlineStyling?.enabled ? headlineStyling.defaultColor : undefined,
                    }}
                    className="text-sm sm:text-lg md:text-xl font-bold font-kd-headline group-hover:text-amber-300 transition-colors duration-200 line-clamp-2 drop-shadow-xs leading-snug"
                  >
                    {displayArticles[0].title}
                  </h3>
                </div>
              </div>

              {/* Summary Bottom Strip */}
              <div className="p-3 sm:p-3.5 bg-white flex items-center justify-between gap-2 sm:gap-3">
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 line-clamp-2 flex-1 font-kd-meta">
                  {displayArticles[0].summary}
                </p>
                <div className="flex items-center space-x-2 shrink-0">
                  {onQuickRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickRead(displayArticles[0]);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 transition shadow-2xs active:scale-95"
                      title="AI 3-बुलेट त्वरित सार (Quick Read)"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span className="hidden xs:inline">त्वरित सार</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-red-600 group-hover:text-red-700 whitespace-nowrap flex items-center space-x-1">
                    <span>पूरी खबर</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Trending Cards (#2 to #5) (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
            {displayArticles.slice(1, 5).map((art, idx) => {
              const rank = idx + 2;
              return (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="group bg-white rounded-xl p-2.5 border border-slate-200/90 hover:border-red-300 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer flex items-center gap-3"
                >
                  {/* Thumbnail with Rank Badge and modern aspect-[4/3] */}
                  <div className="relative aspect-[4/3] w-24 sm:w-28 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse pointer-events-none" />
                    <img
                      src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-0"
                      loading="lazy"
                      decoding="async"
                    />
                    {showRankBadges && (
                      <span
                        className={`absolute top-1 left-1 text-[10px] font-black px-1.5 py-0.5 rounded font-mono z-10 ${getRankBadgeClasses(
                          rank
                        )}`}
                      >
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-kd-meta">
                      <div className="flex items-center space-x-2">
                        {showCategoryTag && (
                          <span className="text-red-600 font-bold uppercase">{art.category}</span>
                        )}
                        {showViewCounts && (
                          <span className="flex items-center space-x-0.5 text-slate-500">
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>{art.viewsCount?.toLocaleString() || 850}</span>
                          </span>
                        )}
                      </div>
                      {onQuickRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickRead(art);
                          }}
                          className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition shrink-0 active:scale-95"
                          title="AI त्वरित सार"
                        >
                          <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                          <span>सार</span>
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE B: GRID (Standard 4-Column Responsive Cards) */}
      {displayStyle === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {displayArticles.map((art, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-red-300 shadow-2xs hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    {showRankBadges && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full font-mono ${getRankBadgeClasses(
                          rank
                        )}`}
                      >
                        #{rank} Trending
                      </span>
                    )}
                  </div>

                  {showCategoryTag && (
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {art.category}
                    </span>
                  )}

                  {showViewCounts && (
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-amber-300" />
                      <span>{art.viewsCount?.toLocaleString() || 500}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1 font-kd-meta">
                      {art.location && <span>{art.location} •</span>}
                      <span>{art.authorName}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-kd-meta">
                    {showReadTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{art.readTimeMinutes || 3} Min Read</span>
                      </span>
                    )}
                    <span className="text-red-600 font-bold group-hover:underline flex items-center space-x-0.5 ml-auto">
                      <span>पढ़ें</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STYLE C: RANKED LIST (Leaderboard 01-08 with Large Numbers) */}
      {displayStyle === 'ranked_list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayArticles.map((art, idx) => {
            const rank = idx + 1;
            const rankFormatted = rank < 10 ? `0${rank}` : `${rank}`;
            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group bg-white rounded-xl p-3 border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-xs transition duration-200 cursor-pointer flex items-center gap-3.5"
              >
                {/* Huge stylized rank number */}
                <span className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-amber-600 w-9 text-center shrink-0">
                  {rankFormatted}
                </span>

                {/* Thumbnail */}
                <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                  <img
                    src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1 font-kd-meta">
                    {showCategoryTag && (
                      <span className="text-red-600 font-bold uppercase">{art.category}</span>
                    )}
                    {showViewCounts && (
                      <span className="flex items-center space-x-0.5 text-slate-500">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{art.viewsCount?.toLocaleString() || 620} Views</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STYLE D: CAROUSEL (Horizontal Swipe / Scroll Cards) */}
      {displayStyle === 'carousel' && (
        <div
          ref={carouselRef}
          className="flex items-stretch space-x-3.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
        >
          {displayArticles.map((art, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="w-64 sm:w-72 shrink-0 group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-red-300 shadow-2xs hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {showRankBadges && (
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full font-mono ${getRankBadgeClasses(
                        rank
                      )}`}
                    >
                      #{rank} Trending
                    </span>
                  )}
                  {showCategoryTag && (
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {art.category}
                    </span>
                  )}
                  {showViewCounts && (
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-amber-300" />
                      <span>{art.viewsCount?.toLocaleString() || 750}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-kd-meta">
                    <span>{art.authorName}</span>
                    <span className="text-red-600 font-bold group-hover:underline">पढ़ें →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
