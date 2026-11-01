import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Flame,
  Star,
  Check,
  Download,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  ArrowUpDown,
  Tag,
  FolderOpen,
  LayoutGrid,
  List as ListIcon,
  Table as TableIcon,
  Share2,
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';

interface BulkArticleManagerProps {
  articles: NewsArticle[];
  onSaveArticle: (article: Partial<NewsArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onOpenEditor: (article?: Partial<NewsArticle>) => void;
  onSelectArticleToView: (article: NewsArticle) => void;
  onPreviewSocialShare?: (article: NewsArticle) => void;
}

export const BulkArticleManager: React.FC<BulkArticleManagerProps> = ({
  articles,
  onSaveArticle,
  onDeleteArticle,
  onOpenEditor,
  onSelectArticleToView,
  onPreviewSocialShare,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<NewsCategory>('national');
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'compact'>('table');

  // Filtered articles
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.authorName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'breaking' && art.isBreaking) ||
      (statusFilter === 'top' && art.isTopStory) ||
      (statusFilter === 'draft' && art.status === 'draft') ||
      (statusFilter === 'published' && (!art.status || art.status === 'published'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} selected articles? This action is permanent.`
      )
    )
      return;

    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        await onDeleteArticle(id);
      }
      setSelectedIds([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkChangeCategory = async () => {
    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        await onSaveArticle({ id, category: bulkCategoryTarget });
      }
      setSelectedIds([]);
      setShowBulkCategoryModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkToggleBreaking = async (val: boolean) => {
    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        await onSaveArticle({ id, isBreaking: val });
      }
      setSelectedIds([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkToggleTopStory = async (val: boolean) => {
    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        await onSaveArticle({ id, isTopStory: val });
      }
      setSelectedIds([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkChangeStatus = async (status: 'published' | 'draft' | 'archived') => {
    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        await onSaveArticle({ id, status });
      }
      setSelectedIds([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkExportJSON = () => {
    const targetArticles = articles.filter((a) => selectedIds.includes(a.id));
    const dataStr = JSON.stringify(targetArticles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khabri-dost-posts-${Date.now()}.json`;
    link.click();
  };

  const handleBulkExportCSV = () => {
    const targetArticles = articles.filter((a) => selectedIds.includes(a.id));
    const headers = ['ID', 'Title', 'Category', 'Author', 'Location', 'Views', 'Likes', 'Breaking', 'TopStory', 'Date'];
    const rows = targetArticles.map((a) => [
      `"${a.id}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.authorName}"`,
      `"${a.location}"`,
      a.viewsCount,
      a.likesCount,
      a.isBreaking ? 'YES' : 'NO',
      a.isTopStory ? 'YES' : 'NO',
      `"${a.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khabri-dost-posts-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            News & Articles Content Management System
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Bulk operations, rich editorial status, categorisation, and newsroom curation.
          </p>
        </div>

        <button
          onClick={() => onOpenEditor()}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Article</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles by title, author, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-red-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({articles.length})
          </button>
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.labelEnglish}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 text-xs text-slate-800 border border-slate-300 rounded-xl px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Badges & Status</option>
          <option value="breaking">🔴 Breaking News Only</option>
          <option value="top">⭐ Top Stories Only</option>
          <option value="published">🟢 Published</option>
          <option value="draft">🟡 Drafts</option>
        </select>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
              viewMode === 'table' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Table View (तालिका दृश्य)"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
              viewMode === 'grid' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Cards Grid View (ग्रिड कार्ड्स)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
              viewMode === 'compact' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Compact List View (संक्षिप्त सूची)"
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compact</span>
          </button>
        </div>
      </div>

      {/* BULK ACTIONS FLOATING TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-900">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>{selectedIds.length} of {filteredArticles.length} articles selected</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-[11px] text-red-700 underline hover:text-red-900 ml-2 cursor-pointer"
            >
              Deselect All
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Bulk Category Change */}
            <button
              onClick={() => setShowBulkCategoryModal(true)}
              disabled={isProcessing}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-300 font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Change Category</span>
            </button>

            {/* Bulk Breaking Toggle */}
            <button
              onClick={() => handleBulkToggleBreaking(true)}
              disabled={isProcessing}
              className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-700 rounded-xl border border-red-200 font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>Mark Breaking</span>
            </button>

            {/* Bulk Top Story Toggle */}
            <button
              onClick={() => handleBulkToggleTopStory(true)}
              disabled={isProcessing}
              className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Mark Top Story</span>
            </button>

            {/* Bulk Status */}
            <button
              onClick={() => handleBulkChangeStatus('draft')}
              disabled={isProcessing}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-300 font-semibold cursor-pointer shadow-2xs"
            >
              Move to Drafts
            </button>

            {/* Bulk Export */}
            <button
              onClick={handleBulkExportCSV}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
              title="Download selected articles as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Bulk Delete */}
            <button
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center space-x-1 cursor-pointer shadow-xs ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ARTICLES DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredArticles.length > 0 &&
                      selectedIds.length === filteredArticles.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    title="Select All Articles"
                  />
                </th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Author & Location</th>
                <th className="py-3 px-3 text-center">Badges & Priority</th>
                <th className="py-3 px-3 text-right">Views / Likes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No articles found matching the current search criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const isSelected = selectedIds.includes(art.id);
                  return (
                    <tr
                      key={art.id}
                      className={`hover:bg-slate-50 transition ${
                        isSelected ? 'bg-red-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(art.id)}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 flex items-start space-x-3 max-w-md">
                        <img
                          src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4
                              className="font-bold text-slate-900 text-xs leading-snug hover:text-red-600 cursor-pointer line-clamp-2"
                              onClick={() => onSelectArticleToView(art)}
                            >
                              {art.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                art.seoTitle
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {art.seoTitle ? '✓ SEO Meta' : '⚡ AI SEO'}
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {art.summary}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[11px] uppercase font-bold">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-slate-900 font-semibold">{art.authorName}</p>
                        <span className="text-[10px] text-slate-500">{art.location}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() =>
                              onSaveArticle({ id: art.id, isBreaking: !art.isBreaking })
                            }
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition cursor-pointer ${
                              art.isBreaking
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Toggle Breaking News"
                          >
                            Breaking
                          </button>
                          <button
                            onClick={() =>
                              onSaveArticle({ id: art.id, isTopStory: !art.isTopStory })
                            }
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition cursor-pointer ${
                              art.isTopStory
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Toggle Top Story"
                          >
                            Top
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <p className="text-slate-900 font-mono font-bold">
                          {art.viewsCount.toLocaleString()}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {art.likesCount} likes
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => onSelectArticleToView(art)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                          title="View Public Article Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onPreviewSocialShare && (
                          <button
                            onClick={() => onPreviewSocialShare(art)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            title="Preview WhatsApp, X, FB & Telegram Social Cards"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenEditor(art)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                          title="Generate or Edit AI SEO Meta"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditor(art)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Open Rich Editor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete article "${art.title}"?`)) {
                              onDeleteArticle(art.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BULK CHANGE CATEGORY MODAL */}
      {showBulkCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-xl text-slate-900">
            <h4 className="text-sm font-bold text-slate-900">
              Move {selectedIds.length} Articles to New Category
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Category</label>
              <select
                value={bulkCategoryTarget}
                onChange={(e) => setBulkCategoryTarget(e.target.value as NewsCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.labelHindi} ({c.labelEnglish})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkCategoryModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkChangeCategory}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Apply Category to All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
