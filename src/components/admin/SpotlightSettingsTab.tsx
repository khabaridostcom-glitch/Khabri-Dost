import React, { useState } from 'react';
import {
  Layers,
  Sliders,
  Check,
  Search,
  ArrowUp,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { NewsArticle, NewsCategory, SpotlightLayoutSettings } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';
import { DEFAULT_SPOTLIGHT_LAYOUT } from '../../data/portalDefaults';

interface SpotlightSettingsTabProps {
  settings?: SpotlightLayoutSettings;
  onChange: (updated: SpotlightLayoutSettings) => void;
  articles?: NewsArticle[];
}

export const SpotlightSettingsTab: React.FC<SpotlightSettingsTabProps> = ({
  settings = DEFAULT_SPOTLIGHT_LAYOUT,
  onChange,
  articles = [],
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [briefSearch, setBriefSearch] = useState('');

  const current: SpotlightLayoutSettings = {
    heroSlider: {
      ...DEFAULT_SPOTLIGHT_LAYOUT.heroSlider,
      ...(settings?.heroSlider || {}),
    },
    secondaryCol: {
      ...DEFAULT_SPOTLIGHT_LAYOUT.secondaryCol,
      ...(settings?.secondaryCol || {}),
    },
    briefTicker: {
      ...DEFAULT_SPOTLIGHT_LAYOUT.briefTicker,
      ...(settings?.briefTicker || {}),
    },
  };

  const toggleHeroArticle = (id: string) => {
    const list = current.heroSlider.selectedArticleIds || [];
    const updated = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    onChange({
      ...current,
      heroSlider: {
        ...current.heroSlider,
        selectedArticleIds: updated,
      },
    });
  };

  const toggleBriefArticle = (id: string) => {
    const list = current.briefTicker.selectedArticleIds || [];
    const updated = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    onChange({
      ...current,
      briefTicker: {
        ...current.briefTicker,
        selectedArticleIds: updated,
      },
    });
  };

  const filteredHeroArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(heroSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(heroSearch.toLowerCase())
  );

  const filteredBriefArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(briefSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(briefSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs sm:text-sm max-w-4xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-white text-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Layers className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              Homepage 3-Column Spotlight & Slider Studio
            </h4>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Manage the 3 main spotlight columns: Card 1 (Hero Carousel Slider), Card 2 (4 Featured Stories Stack),
              and Card 3 (Bottom-to-Top Sliding Headlines Ticker).
            </p>
          </div>
        </div>
      </div>

      {/* CARD 1: HERO SLIDER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                Card 1
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Primary Hero Carousel Slider
              </h4>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Enable sliding carousel and configure category, auto-rotation interval, and display arrows
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={current.heroSlider.enabled !== false}
              onChange={(e) =>
                onChange({
                  ...current,
                  heroSlider: { ...current.heroSlider, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            <span className="ml-2 text-xs font-bold text-slate-700">
              {current.heroSlider.enabled !== false ? 'Carousel ON' : 'Carousel OFF'}
            </span>
          </label>
        </div>

        {current.heroSlider.enabled !== false && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block font-bold text-slate-800 text-xs mb-2">
                1. Select Slide News Source Mode:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Mode 1: Recent */}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...current,
                      heroSlider: { ...current.heroSlider, source: 'recent' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    current.heroSlider.source === 'recent'
                      ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">⚡ Recent Stories</span>
                    {current.heroSlider.source === 'recent' && (
                      <Check className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Automatically rotates recent 4 to 5 published top stories
                  </p>
                </button>

                {/* Mode 2: Specific Category */}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...current,
                      heroSlider: { ...current.heroSlider, source: 'category' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    current.heroSlider.source === 'category'
                      ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">🏷️ Specific Category</span>
                    {current.heroSlider.source === 'category' && (
                      <Check className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Slides only news from a chosen category (e.g., Politics, Sports)
                  </p>
                </button>

                {/* Mode 3: Manual */}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...current,
                      heroSlider: { ...current.heroSlider, source: 'manual' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    current.heroSlider.source === 'manual'
                      ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">🎯 Handpicked by Admin</span>
                    {current.heroSlider.source === 'manual' && (
                      <Check className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Custom select individual articles to slide in the carousel
                  </p>
                </button>
              </div>
            </div>

            {/* Category selector */}
            {current.heroSlider.source === 'category' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800 text-xs">
                  Category for Card 1 Carousel:
                </label>
                <select
                  value={current.heroSlider.category}
                  onChange={(e) =>
                    onChange({
                      ...current,
                      heroSlider: {
                        ...current.heroSlider,
                        category: e.target.value as NewsCategory | 'all',
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  <option value="all">🌐 All Top Stories</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.labelEnglish} ({cat.labelHindi})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Manual Article Selector */}
            {current.heroSlider.source === 'manual' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs">
                    Select Articles to Slide (Selected:{' '}
                    <span className="text-red-600 font-bold">
                      {current.heroSlider.selectedArticleIds?.length || 0}
                    </span>
                    ):
                  </label>
                  {current.heroSlider.selectedArticleIds &&
                    current.heroSlider.selectedArticleIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...current,
                            heroSlider: { ...current.heroSlider, selectedArticleIds: [] },
                          })
                        }
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 pr-1">
                  {filteredHeroArticles.slice(0, 15).map((art) => {
                    const isSelected = (current.heroSlider.selectedArticleIds || []).includes(art.id);
                    return (
                      <div
                        key={art.id}
                        onClick={() => toggleHeroArticle(art.id)}
                        className={`pt-1.5 first:pt-0 flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${
                          isSelected ? 'bg-red-50 border border-red-200' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <img
                            src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{art.title}</p>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {art.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(art.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Slider Interval & Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slide Interval:
                </label>
                <select
                  value={current.heroSlider.slideIntervalSeconds || 5}
                  onChange={(e) =>
                    onChange({
                      ...current,
                      heroSlider: {
                        ...current.heroSlider,
                        slideIntervalSeconds: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value={3}>3 Seconds (Fast)</option>
                  <option value={5}>5 Seconds (Recommended)</option>
                  <option value={7}>7 Seconds (Relaxed)</option>
                  <option value={10}>10 Seconds (Slow)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Navigation Arrows:
                </label>
                <select
                  value={current.heroSlider.showArrows !== false ? 'yes' : 'no'}
                  onChange={(e) =>
                    onChange({
                      ...current,
                      heroSlider: {
                        ...current.heroSlider,
                        showArrows: e.target.value === 'yes',
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="yes">Show Arrows</option>
                  <option value="no">Hide Arrows</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Progress Dots:
                </label>
                <select
                  value={current.heroSlider.showDots !== false ? 'yes' : 'no'}
                  onChange={(e) =>
                    onChange({
                      ...current,
                      heroSlider: {
                        ...current.heroSlider,
                        showDots: e.target.value === 'yes',
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="yes">Show Dots</option>
                  <option value="no">Hide Dots</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 2: 4 STORIES STACK */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
          <span className="bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            Card 2
          </span>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            Column 2: 4 Stories Stack
          </h4>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Displays <strong>4 featured news cards</strong> to perfectly match the height of Column 1 and maintain zero gap.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Articles Count:
            </label>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-2 bg-slate-100 font-black text-red-600 rounded-lg text-sm border border-slate-200">
                4 Cards
              </span>
              <span className="text-[11px] text-slate-500">
                (Configured to 4 cards for optimal vertical alignment)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Filter:
            </label>
            <select
              value={current.secondaryCol.category || 'all'}
              onChange={(e) =>
                onChange({
                  ...current,
                  secondaryCol: {
                    ...current.secondaryCol,
                    category: e.target.value as NewsCategory | 'all',
                  },
                })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            >
              <option value="all">🌐 All Top Stories</option>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.labelEnglish} ({cat.labelHindi})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARD 3: BOTTOM-TO-TOP SLIDING TICKER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                Card 3
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Column 3: Bottom-to-Top Sliding Headlines Ticker
              </h4>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Continuous upward ticker with category badge toggle, custom sources, and speed control
            </p>
          </div>

          <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100 text-xs font-bold">
            <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
            <span>Upward Scroll</span>
          </div>
        </div>

        {/* Toggle Category Badge */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                1. Show Category Badge on Headlines:
              </span>
              <p className="text-[11px] text-slate-500">
                When disabled, category badges are hidden and headlines display in full width
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={current.briefTicker.showCategoryBadge !== false}
                onChange={(e) =>
                  onChange({
                    ...current,
                    briefTicker: {
                      ...current.briefTicker,
                      showCategoryBadge: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {current.briefTicker.showCategoryBadge !== false ? 'Badge ON' : 'Badge OFF'}
              </span>
            </label>
          </div>
        </div>

        {/* Source mode for Brief Ticker */}
        <div className="space-y-3 pt-1">
          <label className="block font-bold text-slate-800 text-xs">
            2. Choose News Source for Column 3 Ticker:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Mode 1: Recent */}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...current,
                  briefTicker: { ...current.briefTicker, source: 'recent' },
                })
              }
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                current.briefTicker.source === 'recent'
                  ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold">⚡ Recent Headlines</span>
                {current.briefTicker.source === 'recent' && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Continuous upward stream of recently published news
              </p>
            </button>

            {/* Mode 2: Specific Category */}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...current,
                  briefTicker: { ...current.briefTicker, source: 'category' },
                })
              }
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                current.briefTicker.source === 'category'
                  ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold">🏷️ Specific Category</span>
                {current.briefTicker.source === 'category' && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Streams headlines from a designated category
              </p>
            </button>

            {/* Mode 3: Handpicked */}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...current,
                  briefTicker: { ...current.briefTicker, source: 'manual' },
                })
              }
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                current.briefTicker.source === 'manual'
                  ? 'border-red-600 bg-red-50/50 text-red-950 font-bold ring-1 ring-red-600'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold">🎯 Handpicked Stories</span>
                {current.briefTicker.source === 'manual' && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Select specific articles to stream in this ticker
              </p>
            </button>
          </div>

          {/* Category Dropdown */}
          {current.briefTicker.source === 'category' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800 text-xs">
                Select Category for Column 3 Ticker:
              </label>
              <select
                value={current.briefTicker.category}
                onChange={(e) =>
                  onChange({
                    ...current,
                    briefTicker: {
                      ...current.briefTicker,
                      category: e.target.value as NewsCategory | 'all',
                    },
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="all">🌐 All Top Stories</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.labelEnglish} ({cat.labelHindi})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual Picker */}
          {current.briefTicker.source === 'manual' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-xs">
                  Pick Stories for Ticker (Selected:{' '}
                  <span className="text-red-600 font-bold">
                    {current.briefTicker.selectedArticleIds?.length || 0}
                  </span>
                  ):
                </label>
                {current.briefTicker.selectedArticleIds &&
                  current.briefTicker.selectedArticleIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...current,
                          briefTicker: { ...current.briefTicker, selectedArticleIds: [] },
                        })
                      }
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title or category..."
                  value={briefSearch}
                  onChange={(e) => setBriefSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 pr-1">
                {filteredBriefArticles.slice(0, 15).map((art) => {
                  const isSelected = (current.briefTicker.selectedArticleIds || []).includes(art.id);
                  return (
                    <div
                      key={art.id}
                      onClick={() => toggleBriefArticle(art.id)}
                      className={`pt-1.5 first:pt-0 flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${
                        isSelected ? 'bg-red-50 border border-red-200' : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-red-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{art.title}</p>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">
                            {art.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(art.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Speed & Title Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upward Sliding Speed:
              </label>
              <select
                value={current.briefTicker.slideSpeed || 'normal'}
                onChange={(e) =>
                  onChange({
                    ...current,
                    briefTicker: {
                      ...current.briefTicker,
                      slideSpeed: e.target.value as 'slow' | 'normal' | 'fast',
                    },
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
              >
                <option value="slow">Slow Pace (34s loop)</option>
                <option value="normal">Normal Pace (22s loop - Recommended)</option>
                <option value="fast">Fast Pace (14s loop)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ticker Heading Title:
              </label>
              <input
                type="text"
                value={current.briefTicker.title}
                onChange={(e) =>
                  onChange({
                    ...current,
                    briefTicker: { ...current.briefTicker, title: e.target.value },
                  })
                }
                placeholder="TOP HEADLINES • FAST BRIEFS"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
