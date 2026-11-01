import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NewsArticle, NewsCategory, PortalSettings } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';
import { ArticleCard } from '../ArticleCard';

interface TopCategoriesGridProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onQuickRead?: (article: NewsArticle) => void;
  onSelectCategory: (category: NewsCategory) => void;
  isArticleBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  isArticleInReadLater: (id: string) => boolean;
  onToggleReadLater: (article: NewsArticle) => void;
  displayOptions?: PortalSettings['displayOptions'];
  mobileScale?: 'compact' | 'normal' | 'large';
}

const FEATURED_HOME_CATEGORIES: NewsCategory[] = [
  'national',
  'state',
  'politics',
  'business',
  'entertainment',
  'tech',
  'sports',
  'lifestyle',
  'world',
];

/**
 * TopCategoriesGrid
 * High-density, modular grid of the portal's top 9 categories with 3 stories each.
 * Clean, compact, and optimized for mobile and desktop reading.
 */
export const TopCategoriesGrid: React.FC<TopCategoriesGridProps> = ({
  articles,
  onSelectArticle,
  onQuickRead,
  onSelectCategory,
  isArticleBookmarked,
  onToggleBookmark,
  isArticleInReadLater,
  onToggleReadLater,
  displayOptions,
  mobileScale = 'normal',
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full shrink-0" />
          <h2
            style={{ fontSize: 'var(--font-section-heading-size, 20px)' }}
            className="font-bold font-kd-headline text-slate-900"
          >
            Top Categories & Stories
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-kd-meta hidden sm:inline">
          National, State, Politics, Business, Entertainment, Tech, Sports & World
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {FEATURED_HOME_CATEGORIES.map((catKey) => {
          const catMeta = CATEGORIES.find((c) => c.id === catKey);
          const catNews = articles.filter((a) => a.category === catKey).slice(0, 3);

          if (catNews.length === 0) return null;

          return (
            <div
              key={catKey}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-red-200 hover:shadow-sm shadow-2xs p-3 sm:p-3.5 flex flex-col overflow-hidden transition-all duration-200"
            >
              {/* Mini Category Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5 shrink-0">
                <h3 className="font-bold text-xs sm:text-sm font-kd-headline text-slate-900 flex items-center space-x-1.5 min-w-0 truncate">
                  <span className="w-1.5 h-3.5 bg-red-600 rounded-xs shrink-0"></span>
                  <span className="truncate">
                    {catMeta?.labelEnglish} ({catMeta?.labelHindi})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => onSelectCategory(catKey)}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center font-kd-meta cursor-pointer shrink-0 ml-2"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* 3 Compact items with complete titles & quick read */}
              <div className="space-y-2 flex-1 flex flex-col justify-start">
                {catNews.map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    layout="compact"
                    onSelectArticle={onSelectArticle}
                    onQuickRead={onQuickRead}
                    isBookmarked={isArticleBookmarked(item.id)}
                    onToggleBookmark={onToggleBookmark}
                    isReadLater={isArticleInReadLater(item.id)}
                    onToggleReadLater={onToggleReadLater}
                    displayOptions={displayOptions}
                    mobileScale={mobileScale}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
