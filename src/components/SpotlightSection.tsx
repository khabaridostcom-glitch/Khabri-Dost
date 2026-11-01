import React from 'react';
import { Flame, Sliders, Layers, Sparkles } from 'lucide-react';
import { NewsArticle, PortalSettings, SpotlightLayoutSettings } from '../types/news';
import { SpotlightHeroSlider } from './SpotlightHeroSlider';
import { SpotlightBriefTicker } from './SpotlightBriefTicker';
import { ArticleCard } from './ArticleCard';

interface SpotlightSectionProps {
  heroArticle?: NewsArticle;
  heroSliderArticles: NewsArticle[];
  secondaryArticles: NewsArticle[];
  briefArticles: NewsArticle[];
  spotlightConfig: SpotlightLayoutSettings;
  portalSettings: PortalSettings;
  onSelectArticle: (article: NewsArticle) => void;
  isArticleBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  isArticleInReadLater?: (id: string) => boolean;
  onToggleReadLater?: (article: NewsArticle) => void;
  isAdmin?: boolean;
  onOpenSpotlightSettings?: () => void;
  onSelectCategory?: (category: string) => void;
  onQuickRead?: (article: NewsArticle) => void;
}

/**
 * SpotlightSection Component
 * 
 * Features:
 * - Fixed-height constraints across desktop (lg:h-[490px] xl:h-[500px]) ensuring all 3 columns
 *   (Hero Slider, Secondary Featured Cards, Fast Brief Ticker) maintain pixel-perfect visual alignment.
 * - Internal scrolling on Column 2 (Secondary Cards) and Column 3 (Ticker), completely preventing vertical overflow.
 * - Responsive adaptations for tablet (side-by-side Col 1 & 2) and mobile (compact scroll).
 * - Direct Admin Layout & Slider Customization modal integration.
 */
export const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  heroArticle,
  heroSliderArticles,
  secondaryArticles,
  briefArticles,
  spotlightConfig,
  portalSettings,
  onSelectArticle,
  isArticleBookmarked,
  onToggleBookmark,
  isArticleInReadLater,
  onToggleReadLater,
  isAdmin = false,
  onOpenSpotlightSettings,
  onSelectCategory,
  onQuickRead,
}) => {
  if (!heroArticle && heroSliderArticles.length === 0) {
    return null;
  }

  const primaryHero = heroArticle || heroSliderArticles[0];
  const heroSliderEnabled = spotlightConfig.heroSlider?.enabled !== false && heroSliderArticles.length > 0;

  return (
    <section id="spotlight-hero-section" className="space-y-3">
      {/* 1. SECTION HEADER BAR */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
          <h2 className="text-base sm:text-lg font-black font-kd-headline text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>प्रमुख सुर्खियां • Top Headlines</span>
          </h2>
        </div>

        {isAdmin && onOpenSpotlightSettings && (
          <button
            type="button"
            onClick={onOpenSpotlightSettings}
            title="Spotlight Layout & Slider Settings"
            className="text-[11px] text-red-600 hover:text-white hover:bg-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3 h-3" />
            <span>Layout Settings</span>
          </button>
        )}
      </div>

      {/* 2. THREE-COLUMN FIXED-HEIGHT ALIGNED GRID */}
      {/* Desktop: Exactly lg:h-[490px] xl:h-[500px] with all three columns stretched to 100% height */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:h-[490px] xl:h-[500px] items-stretch">
        
        {/* COLUMN 1: MAIN HERO STORY / CAROUSEL SLIDER (5 COLS) */}
        <div className="lg:col-span-5 h-full flex flex-col overflow-hidden">
          {heroSliderEnabled ? (
            <SpotlightHeroSlider
              articles={heroSliderArticles}
              sliderConfig={spotlightConfig.heroSlider}
              onSelectArticle={onSelectArticle}
              isBookmarked={isArticleBookmarked}
              onToggleBookmark={onToggleBookmark}
              isReadLater={isArticleInReadLater}
              onToggleReadLater={onToggleReadLater}
              displayOptions={portalSettings.displayOptions}
              mobileScale={portalSettings.typography?.mobileScale || 'normal'}
              onOpenSettings={isAdmin ? onOpenSpotlightSettings : undefined}
            />
          ) : (
            <ArticleCard
              article={primaryHero}
              layout="hero"
              onSelectArticle={onSelectArticle}
              isBookmarked={isArticleBookmarked(primaryHero.id)}
              onToggleBookmark={onToggleBookmark}
              isReadLater={isArticleInReadLater ? isArticleInReadLater(primaryHero.id) : false}
              onToggleReadLater={onToggleReadLater}
              onQuickRead={onQuickRead}
              displayOptions={portalSettings.displayOptions}
              mobileScale={portalSettings.typography?.mobileScale || 'normal'}
            />
          )}
        </div>

        {/* COLUMN 2: SECONDARY FEATURED CARDS (4 COLS) WITH INTERNAL SCROLLING & FIXED HEIGHT */}
        <div className="lg:col-span-4 h-full flex flex-col overflow-hidden bg-slate-50/70 p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Header of Column 2 */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 shrink-0">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-800 font-kd-meta">
                खास ख़बरें • Featured Stories
              </h3>
            </div>
          </div>

          {/* Scrollable list with fixed-height constraint and internal scroll */}
          <div className="flex-1 overflow-y-auto max-h-[380px] lg:max-h-none scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-slate-100 pr-1.5 space-y-2">
            {secondaryArticles.length > 0 ? (
              secondaryArticles.map((art) => (
                <div key={art.id} className="w-full">
                  <ArticleCard
                    article={art}
                    layout="compact"
                    onSelectArticle={onSelectArticle}
                    onQuickRead={onQuickRead}
                    isBookmarked={isArticleBookmarked(art.id)}
                    onToggleBookmark={onToggleBookmark}
                    isReadLater={isArticleInReadLater ? isArticleInReadLater(art.id) : false}
                    onToggleReadLater={onToggleReadLater}
                    displayOptions={portalSettings.displayOptions}
                    mobileScale={portalSettings.typography?.mobileScale || 'normal'}
                  />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center p-4 text-center text-xs text-slate-400">
                अन्य प्रमुख खबरें शीघ्र आ रही हैं
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: FAST-READ BRIEFS TICKER (3 COLS) WITH SYNCHRONIZED HEIGHT */}
        <div className="md:col-span-2 lg:col-span-3 h-[380px] sm:h-[420px] lg:h-full flex flex-col overflow-hidden">
          <SpotlightBriefTicker
            articles={briefArticles}
            config={spotlightConfig.briefTicker}
            onSelectArticle={onSelectArticle}
            onOpenSettings={isAdmin ? onOpenSpotlightSettings : undefined}
            onViewAllCategory={onSelectCategory}
          />
        </div>

      </div>
    </section>
  );
};
