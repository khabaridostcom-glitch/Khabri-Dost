import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, Clock, Eye, Share2, Flame, MapPin, Zap, Edit3, X, Check, Save, Loader2, Sparkles } from 'lucide-react';
import { NewsArticle, NewsCategory, PortalSettings } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';
import { renderStyledHeadline } from '../utils/headlineHelper';
import { useAuth } from '../context/AuthContext';
import { updateArticle } from '../services/newsService';
import { CATEGORIES } from '../data/seedNews';

interface ArticleCardProps {
  article: NewsArticle;
  layout?: 'hero' | 'featured' | 'compact' | 'opinion';
  onSelectArticle: (article: NewsArticle) => void;
  onQuickRead?: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: NewsArticle) => void;
  isReadLater?: boolean;
  onToggleReadLater?: (article: NewsArticle) => void;
  displayOptions?: PortalSettings['displayOptions'];
  headlineStyling?: PortalSettings['headlineStyling'];
  mobileScale?: 'compact' | 'normal' | 'large';
  onArticleUpdated?: (article: NewsArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  layout = 'featured',
  onSelectArticle,
  onQuickRead,
  isBookmarked = false,
  onToggleBookmark,
  isReadLater = false,
  onToggleReadLater,
  displayOptions = {
    showExcerptOnMobile: false,
    showAuthor: true,
    showDate: true,
    showViews: true,
    showLocation: true,
    showBookmark: true,
    showShare: true,
    showReadLater: true,
    cardStyle: 'compact',
  },
  headlineStyling,
  mobileScale = 'normal',
  onArticleUpdated,
}) => {
  const { isAdmin, isStaff } = useAuth();
  const canQuickEdit = isAdmin || isStaff;

  const [currentArticle, setCurrentArticle] = useState<NewsArticle>(article);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Quick Edit Modal State
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(article.title);
  const [editCategory, setEditCategory] = useState<NewsCategory>(article.category);
  const [editSummary, setEditSummary] = useState(article.summary || '');
  const [editBreaking, setEditBreaking] = useState(Boolean(article.isBreaking));
  const [editSpotlight, setEditSpotlight] = useState(Boolean(article.isSpotlight));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Synchronize when parent article prop updates
  useEffect(() => {
    setCurrentArticle(article);
    setEditTitle(article.title);
    setEditCategory(article.category);
    setEditSummary(article.summary || '');
    setEditBreaking(Boolean(article.isBreaking));
    setEditSpotlight(Boolean(article.isSpotlight));
  }, [article]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(currentArticle);
    }
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

  const handleQuickReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickRead) {
      onQuickRead(currentArticle);
    }
  };

  const handleOpenQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(currentArticle.title);
    setEditCategory(currentArticle.category);
    setEditSummary(currentArticle.summary || '');
    setEditBreaking(Boolean(currentArticle.isBreaking));
    setEditSpotlight(Boolean(currentArticle.isSpotlight));
    setSaveSuccess(false);
    setSaveError(null);
    setShowQuickEdit(true);
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setSaveError('शीर्षक खाली नहीं हो सकता');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const updates: Partial<NewsArticle> = {
      title: editTitle.trim(),
      category: editCategory,
      summary: editSummary.trim(),
      isBreaking: editBreaking,
      isSpotlight: editSpotlight,
    };

    try {
      await updateArticle(currentArticle.id, updates);
      const updatedArticle: NewsArticle = {
        ...currentArticle,
        ...updates,
      };
      setCurrentArticle(updatedArticle);
      setSaveSuccess(true);
      if (onArticleUpdated) {
        onArticleUpdated(updatedArticle);
      }
      setTimeout(() => {
        setShowQuickEdit(false);
        setSaveSuccess(false);
      }, 900);
    } catch (err: any) {
      setSaveError(err?.message || 'त्वरित संपादन सहेजने में विफल');
    } finally {
      setIsSaving(false);
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

  // Quick Edit Modal Component
  const quickEditModal = showQuickEdit && typeof document !== 'undefined'
    ? createPortal(
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickEdit(false);
          }}
          className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 my-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Quick Edit</span>
                    <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                      Admin
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    त्वरित शीर्षक व श्रेणी संपादन (बिना CMS खोले)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickEdit(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900">सफलतापूर्वक सहेजा गया!</h4>
                <p className="text-xs text-slate-500">लेख तुरंत लाइव अपडेट कर दिया गया है।</p>
              </div>
            ) : (
              <form onSubmit={handleSaveQuickEdit} className="space-y-4">
                {saveError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {saveError}
                  </div>
                )}

                {/* Article Headline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    शीर्षक (Article Title) *
                  </label>
                  <textarea
                    rows={3}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    placeholder="लेख का मुख्य शीर्षक लिखें..."
                    required
                  />
                </div>

                {/* Category Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      श्रेणी (Category)
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as NewsCategory)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans cursor-pointer"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'trending').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.labelHindi} ({cat.labelEnglish})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Toggles */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      प्राथमिकता (Priority)
                    </label>
                    <div className="flex items-center gap-3 pt-1.5">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editBreaking}
                          onChange={(e) => setEditBreaking(e.target.checked)}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="font-semibold flex items-center gap-1 text-red-700">
                          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          ब्रेकिंग
                        </span>
                      </label>

                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editSpotlight}
                          onChange={(e) => setEditSpotlight(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-semibold text-blue-700">स्पॉटलाइट</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Excerpt Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    संक्षिप्त सारांश (Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    placeholder="संक्षिप्त विवरण..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowQuickEdit(false)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>सहेज रहे हैं...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>सहेजें (Save Changes)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  /* HERO LAYOUT */
  if (layout === 'hero') {
    return (
      <>
        {quickEditModal}
        <div
          onClick={() => onSelectArticle(currentArticle)}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-slate-200/80 cursor-pointer flex flex-col"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
            )}
            <img
              src={currentArticle.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
              alt={currentArticle.imageAltText || currentArticle.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center font-kd-meta">
              {currentArticle.isBreaking && (
                <span className="bg-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>ब्रेकिंग</span>
                </span>
              )}
              <span className="bg-slate-900/90 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                {currentArticle.category}
              </span>
            </div>

            {/* Floating actions */}
            <div className="absolute top-3 right-3 flex items-center space-x-1.5">
              {canQuickEdit && (
                <button
                  type="button"
                  onClick={handleOpenQuickEdit}
                  className="p-1.5 rounded-full bg-blue-600/90 hover:bg-blue-700 text-white backdrop-blur-md transition shadow-xs cursor-pointer"
                  title="त्वरित संपादन (Quick Edit)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onToggleReadLater && (
                <button
                  onClick={handleReadLaterClick}
                  className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                    isReadLater
                      ? 'bg-indigo-600 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title={isReadLater ? 'रीड लेटर से हटाएं' : 'बाद में पढ़ें (Read Later)'}
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleBookmarkClick}
                className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
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
            {/* Complete Headline Display */}
            <div className="mb-2.5">
              <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1.5 font-kd-meta">
                <span className="text-red-700 font-bold uppercase">{currentArticle.category}</span>
                {displayOptions.showLocation && currentArticle.location && <span>• {currentArticle.location}</span>}
                {currentArticle.isBreaking && (
                  <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">• बड़ी ख़बर</span>
                )}
              </div>
              <h2
                style={{ fontSize: 'var(--font-hero-title-size, 26px)' }}
                className="font-black font-kd-headline leading-snug text-slate-900 group-hover:text-red-700 transition"
              >
                {renderStyledHeadline(
                  currentArticle.title,
                  currentArticle.headlineHighlight,
                  currentArticle.highlightColor || headlineStyling?.defaultColor || '#dc2626'
                )}
              </h2>
            </div>

            <p
              style={{ fontSize: 'var(--font-grid-card-excerpt-size, 13px)' }}
              className="text-slate-600 line-clamp-2 font-kd-body leading-relaxed mb-3"
            >
              {currentArticle.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-kd-meta">
              <div className="flex items-center space-x-2">
                {displayOptions.showAuthor && (
                  <span className="font-semibold text-slate-700">{currentArticle.authorName}</span>
                )}
                {displayOptions.showDate && (
                  <span>• {formatHindiTimeAgo(currentArticle.createdAt)}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {canQuickEdit && (
                  <button
                    type="button"
                    onClick={handleOpenQuickEdit}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 transition cursor-pointer shadow-2xs mr-1"
                    title="त्वरित संपादन (Quick Edit)"
                  >
                    <Edit3 className="w-3 h-3 text-blue-600" />
                    <span>त्वरित संपादन</span>
                  </button>
                )}
                {onQuickRead && (
                  <button
                    type="button"
                    onClick={handleQuickReadClick}
                    className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                    title="3 मुख्य बातें 15 सेकंड में पढ़ें"
                  >
                    <Zap className="w-3 h-3 fill-white" />
                    <span>त्वरित सार</span>
                  </button>
                )}
                {displayOptions.showViews && (
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{currentArticle.viewsCount}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* COMPACT / HORIZONTAL MOBILE STYLE (Left photo, right title + meta) */
  return (
    <>
      {quickEditModal}
      <div
        onClick={() => onSelectArticle(currentArticle)}
        className="group bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-red-200 transition duration-200 cursor-pointer p-2 flex items-start gap-2.5 w-full"
      >
        {/* Left: Compact Photo with Modern aspect-ratio & Skeleton */}
        <div className="relative aspect-[4/3] w-20 sm:w-24 rounded-lg overflow-hidden shrink-0 bg-slate-200 mt-0.5">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}
          <img
            src={currentArticle.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
            alt={currentArticle.imageAltText || currentArticle.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
          {currentArticle.isBreaking && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow z-10">
              ब्रेकिंग
            </span>
          )}
        </div>

        {/* Right: Title + Short Meta */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 self-stretch min-h-[64px] sm:min-h-[70px]">
          <div>
            {/* Category & Location */}
            <div className={`flex items-center justify-between ${metaMobileSizeClass} text-slate-500 mb-0.5 font-kd-meta shrink-0`}>
              <div className="flex items-center space-x-1.5 truncate">
                <span className="font-bold text-red-600 uppercase tracking-wide text-[10px] sm:text-[11px] shrink-0">{currentArticle.category}</span>
                {displayOptions.showLocation && currentArticle.location && (
                  <span className="truncate text-slate-400 text-[10px] sm:text-[11px]">• {currentArticle.location}</span>
                )}
              </div>
              {displayOptions.showDate && (
                <span className="shrink-0 text-slate-400 text-[10px] ml-1">
                  {formatHindiTimeAgo(currentArticle.createdAt)}
                </span>
              )}
            </div>

            {/* Headline with custom font & enhanced size for readability */}
            <h3
              style={{ fontSize: 'var(--font-grid-card-title-size, 15px)' }}
              className={`${titleMobileSizeClass} font-bold font-kd-title text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2 break-words`}
            >
              {renderStyledHeadline(
                currentArticle.title,
                currentArticle.headlineHighlight,
                currentArticle.highlightColor || headlineStyling?.defaultColor || '#dc2626'
              )}
            </h3>

            {/* Optional Short Excerpt */}
            {displayOptions.showExcerptOnMobile && (
              <p
                style={{ fontSize: 'var(--font-grid-card-excerpt-size, 13px)' }}
                className="text-slate-500 line-clamp-1 mt-0.5 font-kd-body hidden xs:block"
              >
                {currentArticle.summary}
              </p>
            )}
          </div>

          {/* Footer Meta Row - Controlled by Admin Toggles */}
          {((displayOptions.showAuthor !== false) ||
            (displayOptions.showViews !== false) ||
            (displayOptions.showBookmark !== false && !!onToggleBookmark) ||
            (displayOptions.showShare !== false) ||
            (displayOptions.showReadLater !== false && !!onToggleReadLater) ||
            canQuickEdit) && (
            <div className={`flex items-center justify-between ${metaMobileSizeClass} text-slate-400 pt-1 mt-1 border-t border-slate-100 font-kd-meta shrink-0`}>
              <div className="flex items-center space-x-2 truncate">
                {displayOptions.showAuthor !== false && (
                  <span className="text-slate-600 truncate font-medium text-[10px] sm:text-[11px]">{currentArticle.authorName}</span>
                )}
                {displayOptions.showViews !== false && (
                  <span className="flex items-center space-x-0.5 text-[10px]">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>{currentArticle.viewsCount}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {canQuickEdit && (
                  <button
                    type="button"
                    onClick={handleOpenQuickEdit}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 transition cursor-pointer shadow-2xs mr-1"
                    title="त्वरित संपादन (Quick Edit)"
                  >
                    <Edit3 className="w-2.5 h-2.5 text-blue-600" />
                    <span className="hidden sm:inline">त्वरित संपादन</span>
                  </button>
                )}
                {onQuickRead && (
                  <button
                    type="button"
                    onClick={handleQuickReadClick}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 transition hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-2xs mr-1"
                    title="3 मुख्य बातें 15 सेकंड में पढ़ें"
                  >
                    <Zap className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                    <span>त्वरित सार</span>
                  </button>
                )}
                {onToggleReadLater && displayOptions.showReadLater !== false && (
                  <button
                    onClick={handleReadLaterClick}
                    className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
                      isReadLater ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                    title={isReadLater ? 'रीड लेटर से हटाएं' : 'बाद में पढ़ें (Read Later)'}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
                {displayOptions.showBookmark !== false && onToggleBookmark && (
                  <button
                    onClick={handleBookmarkClick}
                    className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
                      isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="सहेजें"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                )}
                {displayOptions.showShare !== false && (
                  <button
                    onClick={handleShareClick}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="शेयर"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
