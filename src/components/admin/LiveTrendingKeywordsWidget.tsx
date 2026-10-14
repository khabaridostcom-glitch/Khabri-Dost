import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Tag,
  PenTool,
  Clock,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { NewsCategory } from '../../types/news';

export interface TrendingTopic {
  id: string;
  query: string;
  englishQuery: string;
  category: string;
  searchVolume: string;
  trafficRate: string;
  status: 'hot' | 'surging' | 'trending';
  summary: string;
  suggestedAngle: string;
  suggestedImage?: string;
  relatedKeywords?: string[];
}

interface LiveTrendingKeywordsWidgetProps {
  onDraftArticle?: (topic: TrendingTopic) => void;
  onGenerateSeo?: (topic: TrendingTopic) => void;
  onPinToTicker?: (hashtag: string) => void;
}

export const LiveTrendingKeywordsWidget: React.FC<LiveTrendingKeywordsWidgetProps> = ({
  onDraftArticle,
  onGenerateSeo,
  onPinToTicker,
}) => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const fetchTrends = async (cat: string = selectedCategory) => {
    setLoading(true);
    try {
      const url = cat === 'all' ? '/api/ai/google-trends' : `/api/ai/google-trends?category=${cat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.trends)) {
        setTrends(data.trends);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to fetch google trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedCategory);
  }, [selectedCategory]);

  const handleCopyKeywords = (trend: TrendingTopic) => {
    const list = [
      trend.query,
      trend.englishQuery,
      ...(trend.relatedKeywords || []),
      'ताज़ा ख़बर',
      'Breaking News',
    ].join(', ');
    navigator.clipboard.writeText(list);
    setCopiedId(trend.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePin = (trend: TrendingTopic) => {
    if (onPinToTicker) {
      const hashtag = '#' + trend.query.replace(/\s+/g, '_').slice(0, 20);
      onPinToTicker(hashtag);
      setPinnedId(trend.id);
      setTimeout(() => setPinnedId(null), 2500);
    }
  };

  const categories = [
    { id: 'all', label: 'All Trends (समस्त)' },
    { id: 'national', label: 'National (राष्ट्रीय)' },
    { id: 'tech', label: 'Tech & Space (तकनीक)' },
    { id: 'sports', label: 'Sports (खेल)' },
    { id: 'business', label: 'Business (व्यापार)' },
    { id: 'politics', label: 'Politics (राजनीति)' },
    { id: 'state', label: 'State (राज्य)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Widget Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-red-50/40 via-amber-50/20 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/20 shrink-0">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Live Trending Keywords & Topics</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </h3>
              <span className="text-[10px] font-mono bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                GOOGLE TRENDS LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time high-velocity search queries in India to assist editorial creation & maximum reach.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <span className="text-[11px] text-slate-400 hidden lg:inline font-mono">
            Updated: {lastRefreshed}
          </span>
          <button
            type="button"
            onClick={() => fetchTrends(selectedCategory)}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            title="Refresh Live Trends"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Trends List / Grid */}
      <div className="p-4 sm:p-5">
        {loading && trends.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-red-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching real-time Google Trends...</p>
          </div>
        ) : trends.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No trending topics found for the selected category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {trends.map((trend, idx) => {
              const isHot = trend.status === 'hot';
              const isSurging = trend.status === 'surging';

              return (
                <div
                  key={trend.id || idx}
                  className="group relative bg-slate-50/60 hover:bg-white border border-slate-200 hover:border-red-300 rounded-xl p-3.5 sm:p-4 transition shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category, Volume & Surge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {trend.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <span>📊</span>
                          <span>{trend.searchVolume}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isSurging
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isHot
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          <Flame className="w-3 h-3 text-red-600" />
                          <span>{trend.trafficRate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Headline / Query */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 transition leading-snug">
                      {trend.query}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                      {trend.englishQuery}
                    </p>

                    {/* Angle / Summary */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {trend.summary || trend.suggestedAngle}
                    </p>

                    {/* Related Keyword Tags */}
                    {trend.relatedKeywords && trend.relatedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {trend.relatedKeywords.slice(0, 3).map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleCopyKeywords(trend)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                        title="Copy keywords for SEO tags"
                      >
                        {copiedId === trend.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy Keywords</span>
                          </>
                        )}
                      </button>

                      {onPinToTicker && (
                        <button
                          type="button"
                          onClick={() => handlePin(trend)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-indigo-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          title="Pin as Ticker Trending Hashtag"
                        >
                          {pinnedId === trend.id ? (
                            <Check className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <Tag className="w-3 h-3" />
                          )}
                          <span className="hidden sm:inline">Pin</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {onDraftArticle && (
                        <button
                          type="button"
                          onClick={() => onDraftArticle(trend)}
                          className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Draft Article</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
