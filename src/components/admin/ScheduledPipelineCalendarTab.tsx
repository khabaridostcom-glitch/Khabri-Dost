import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Edit,
  Eye,
  Filter,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  FileText,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';

interface ScheduledPipelineCalendarTabProps {
  articles: NewsArticle[];
  onSaveArticle: (article: Partial<NewsArticle>) => Promise<void>;
  onEditArticle: (article: NewsArticle) => void;
  onSelectArticleToView: (article: NewsArticle) => void;
}

/**
 * ScheduledPipelineCalendarTab
 * Editorial Scheduling & Content Pipeline Manager.
 * Allows editors to track upcoming stories, promote scheduled stories to immediate publication,
 * and review editorial workload across days of the month.
 */
export const ScheduledPipelineCalendarTab: React.FC<ScheduledPipelineCalendarTabProps> = ({
  articles,
  onSaveArticle,
  onEditArticle,
  onSelectArticleToView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pipeline_list' | 'calendar_grid'>('pipeline_list');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'scheduled'
          ? art.status === 'scheduled' || Boolean(art.scheduledFor)
          : statusFilter === 'draft'
          ? art.status === 'draft'
          : art.status === 'published';
      const matchQuery =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchQuery;
    });
  }, [articles, selectedCategory, statusFilter, searchQuery]);

  // Scheduled and pipeline counts
  const scheduledCount = articles.filter((a) => a.status === 'scheduled' || Boolean(a.scheduledFor)).length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const publishedCount = articles.filter((a) => a.status === 'published' || !a.status).length;

  const handlePublishNow = async (article: NewsArticle) => {
    setPublishingId(article.id);
    try {
      await onSaveArticle({
        id: article.id,
        status: 'published',
        scheduledFor: undefined,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setPublishingId(null);
    }
  };

  // Calendar Day grouping
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; dateStr: string; items: NewsArticle[] }> = [];

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayItems = articles.filter((a) => {
        const itemDate = a.scheduledFor
          ? a.scheduledFor.slice(0, 10)
          : a.createdAt
          ? a.createdAt.slice(0, 10)
          : '';
        return itemDate === dateStr;
      });
      days.push({ dayNumber: i, dateStr, items: dayItems });
    }

    return { firstDayOffset: firstDay, days };
  }, [currentMonthDate, articles]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-red-600" />
            <span>Editorial Scheduling & Pipeline Calendar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track future scheduled posts, manage publication embargoes, and oversee daily newsroom production.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('pipeline_list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'pipeline_list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pipeline List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar_grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'calendar_grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Calendar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Scheduled Posts</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{scheduledCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Pending timed release</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Drafts In Review</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{draftCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Unpublished news drafts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{publishedCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active articles on portal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Auto-Publish Service</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-sm font-bold text-emerald-600 mt-2 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active (60s cycle)</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Client & server worker</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by article title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-red-600 outline-none text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled Only</option>
            <option value="draft">Drafts Only</option>
            <option value="published">Published Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.labelEnglish}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main View: Pipeline List vs Monthly Calendar */}
      {viewMode === 'pipeline_list' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredArticles.length} of {articles.length} total articles
            </span>
            <span className="text-[11px] text-slate-400">Sorted by publication & schedule timeline</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No articles match your pipeline filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredArticles.map((art) => {
                const isScheduled = art.status === 'scheduled' || Boolean(art.scheduledFor);
                const isDraft = art.status === 'draft';
                const isLive = !isScheduled && !isDraft;

                const scheduleDateStr = art.scheduledFor
                  ? new Date(art.scheduledFor).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : null;

                return (
                  <div
                    key={art.id}
                    className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <img
                        src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=160'}
                        alt={art.title}
                        className="w-16 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        loading="lazy"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                          {isScheduled && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Scheduled for: {scheduleDateStr}</span>
                            </span>
                          )}
                          {isDraft && (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Draft Review
                            </span>
                          )}
                          {isLive && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Live on Portal</span>
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 border border-red-200/70 px-1.5 py-0.2 rounded">
                            {art.category}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                          {art.title}
                        </h4>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                          <span>By {art.authorName}</span>
                          <span>•</span>
                          <span>{art.readTimeMinutes || 3} min read</span>
                          {art.location && (
                            <>
                              <span>•</span>
                              <span>📍 {art.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      {isScheduled && (
                        <button
                          type="button"
                          onClick={() => handlePublishNow(art)}
                          disabled={publishingId === art.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-xs cursor-pointer disabled:opacity-50"
                          title="Bypass schedule and publish immediately"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{publishingId === art.id ? 'Publishing...' : 'Publish Now'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditArticle(art)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                        title="Edit in Newsroom Editor"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectArticleToView(art)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                        title="View Public Article Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Monthly Calendar Grid View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
              </h3>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonthDate(
                    new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonthDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonthDate(
                    new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-100">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: calendarDays.firstDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="h-28 rounded-xl bg-slate-50/50 border border-transparent" />
            ))}

            {calendarDays.days.map(({ dayNumber, dateStr, items }) => {
              const isToday =
                new Date().toISOString().slice(0, 10) === dateStr;

              return (
                <div
                  key={dateStr}
                  className={`h-28 rounded-xl border p-2 flex flex-col justify-between overflow-hidden transition ${
                    isToday
                      ? 'border-red-400 bg-red-50/20 ring-1 ring-red-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-mono'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {items.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {items.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-16 scrollbar-none py-1">
                    {items.slice(0, 2).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onEditArticle(item)}
                        className="w-full text-left truncate text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 hover:bg-red-50 hover:text-red-700 transition block"
                        title={item.title}
                      >
                        {item.status === 'scheduled' ? '⏰ ' : '● '}
                        {item.title}
                      </button>
                    ))}
                    {items.length > 2 && (
                      <span className="text-[9px] text-slate-400 block text-center font-bold">
                        +{items.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
