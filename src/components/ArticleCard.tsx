import React from 'react';
import { Bookmark, Clock, Eye, Share2, Flame, MapPin } from 'lucide-react';
import { NewsArticle, PortalSettings } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';

interface ArticleCardProps {
  article: NewsArticle;
  layout?: 'hero' | 'featured' | 'compact' | 'opinion';
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: NewsArticle) => void;
  displayOptions?: PortalSettings['displayOptions'];
  mobileScale?: 'compact' | 'normal' | 'large';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  layout = 'featured',
  onSelectArticle,
  isBookmarked = false,
  onToggleBookmark,
  displayOptions = {
    showExcerptOnMobile: false,
    showAuthor: true,
    showDate: true,
    showViews: true,
    showLocation: true,
    cardStyle: 'compact',
  },
  mobileScale = 'normal',
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(article);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Mobile scale adjustment classes - TV9 Hindi & News18 Hindi large readable font standards
  const titleMobileSizeClass = {
    compact: 'text-[13px] sm:text-sm leading-snug',
    normal: 'text-sm sm:text-[15px] leading-snug',
    large: 'text-[15px] sm:text-base leading-snug',
  }[mobileScale];

  const metaMobileSizeClass = {
    compact: 'text-[11px] sm:text-xs',
    normal: 'text-xs sm:text-[13px]',
    large: 'text-xs sm:text-sm',
  }[mobileScale];

  /* HERO LAYOUT */
  if (layout === 'hero') {
    return (
      <div
        onClick={() => onSelectArticle(article)}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-slate-200/80 cursor-pointer flex flex-col"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center font-kd-meta">
            {article.isBreaking && (
              <span className="bg-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>ब्रेकिंग</span>
              </span>
            )}
            <span className="bg-slate-900/90 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              {article.category}
            </span>
          </div>

          {/* Floating actions */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full backdrop-blur-md transition ${
                isBookmarked
                  ? 'bg-amber-500 text-white'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title="सहेजें"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition"
              title="शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1">
          {/* Complete Headline Display (Always visible, full text) */}
          <div className="mb-2.5">
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1.5 font-kd-meta">
              <span className="text-red-700 font-bold uppercase">{article.category}</span>
              {displayOptions.showLocation && article.location && <span>• {article.location}</span>}
              {article.isBreaking && (
                <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">• बड़ी ख़बर</span>
              )}
            </div>
            <h2
              style={{ fontSize: 'var(--font-hero-title-size, 26px)' }}
              className="font-black font-kd-headline leading-snug text-slate-900 group-hover:text-red-700 transition"
            >
              {article.title}
            </h2>
          </div>

          <p
            style={{ fontSize: 'var(--font-grid-card-excerpt-size, 13px)' }}
            className="text-slate-600 line-clamp-2 font-kd-body leading-relaxed mb-3"
          >
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-kd-meta">
            <div className="flex items-center space-x-2">
              {displayOptions.showAuthor && (
                <span className="font-semibold text-slate-700">{article.authorName}</span>
              )}
              {displayOptions.showDate && (
                <span>• {formatHindiTimeAgo(article.createdAt)}</span>
              )}
            </div>
            {displayOptions.showViews && (
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.viewsCount}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* COMPACT / HORIZONTAL MOBILE STYLE (Left photo, right title + meta) */
  return (
    <div
      onClick={() => onSelectArticle(article)}
      className="group bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-red-200 transition duration-200 cursor-pointer p-1.5 sm:p-2 flex items-center gap-2 sm:gap-2.5 h-full"
    >
      {/* Left: Compact Photo */}
      <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-slate-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        {article.isBreaking && (
          <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
            ब्रेकिंग
          </span>
        )}
      </div>

      {/* Right: Title + Short Meta */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 self-stretch">
        <div>
          {/* Category & Location */}
          <div className={`flex items-center justify-between ${metaMobileSizeClass} text-slate-500 mb-0.5 font-kd-meta`}>
            <div className="flex items-center space-x-1.5 truncate">
              <span className="font-bold text-red-600 uppercase tracking-wide text-[10px] sm:text-[11px]">{article.category}</span>
              {displayOptions.showLocation && article.location && (
                <span className="truncate text-slate-400 text-[10px] sm:text-[11px]">• {article.location}</span>
              )}
            </div>
            {displayOptions.showDate && (
              <span className="shrink-0 text-slate-400 text-[10px]">
                {formatHindiTimeAgo(article.createdAt)}
              </span>
            )}
          </div>

          {/* Headline with custom font & enhanced size for readability */}
          <h3
            style={{ fontSize: 'var(--font-grid-card-title-size, 16px)' }}
            className={`${titleMobileSizeClass} font-bold font-kd-title text-slate-900 group-hover:text-red-700 transition leading-snug`}
          >
            {article.title}
          </h3>

          {/* Optional Short Excerpt */}
          {displayOptions.showExcerptOnMobile && (
            <p
              style={{ fontSize: 'var(--font-grid-card-excerpt-size, 13px)' }}
              className="text-slate-500 line-clamp-1 mt-0.5 font-kd-body hidden xs:block"
            >
              {article.summary}
            </p>
          )}
        </div>

        {/* Footer Meta Row */}
        <div className={`flex items-center justify-between ${metaMobileSizeClass} text-slate-400 pt-1 mt-0.5 border-t border-slate-50 font-kd-meta`}>
          <div className="flex items-center space-x-2 truncate">
            {displayOptions.showAuthor && (
              <span className="text-slate-600 truncate font-medium text-[10px] sm:text-[11px]">{article.authorName}</span>
            )}
            {displayOptions.showViews && (
              <span className="flex items-center space-x-0.5 text-[10px]">
                <Eye className="w-3 h-3 text-slate-400" />
                <span>{article.viewsCount}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleBookmarkClick}
              className={`p-1 rounded hover:bg-slate-100 transition ${
                isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="सहेजें"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={handleShareClick}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="शेयर"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
