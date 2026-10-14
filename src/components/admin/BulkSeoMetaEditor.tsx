import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Save,
  Eye,
  ExternalLink,
  Tag,
  Check,
  RefreshCw,
  FileText,
  Sliders,
  ChevronDown,
  Layers,
  X,
  Globe,
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';

interface BulkSeoMetaEditorProps {
  articles: NewsArticle[];
  onSaveArticle: (article: Partial<NewsArticle>) => Promise<void>;
  siteTitle?: string;
  baseUrl?: string;
}

interface ArticleEditState {
  seoTitle: string;
  seoDescription: string;
  focusKeywords: string;
  imageAltText: string;
  isIndexable: boolean;
  isModified: boolean;
  isSaving: boolean;
  isSaved: boolean;
}

export const BulkSeoMetaEditor: React.FC<BulkSeoMetaEditorProps> = ({
  articles,
  onSaveArticle,
  siteTitle = 'Khabri Dost',
  baseUrl = 'https://khabridost.com',
}) => {
  // Local edit states for all articles keyed by article ID
  const [editStates, setEditStates] = useState<Record<string, ArticleEditState>>(() => {
    const initial: Record<string, ArticleEditState> = {};
    for (const art of articles) {
      initial[art.id] = {
        seoTitle: art.seoTitle || art.title || '',
        seoDescription: art.seoDescription || art.summary || '',
        focusKeywords: art.focusKeywords || `${art.category}, समाचार, Breaking News`,
        imageAltText: art.imageAltText || art.imageCaption || art.title || '',
        isIndexable: true,
        isModified: false,
        isSaving: false,
        isSaved: false,
      };
    }
    return initial;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [seoHealthFilter, setSeoHealthFilter] = useState<'all' | 'missing_title' | 'missing_desc' | 'missing_keywords' | 'modified'>('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [bulkKeywordInput, setBulkKeywordInput] = useState('');
  const [showBulkKeywordModal, setShowBulkKeywordModal] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  // Update edit state helper
  const updateField = (id: string, field: keyof ArticleEditState, value: any) => {
    setEditStates((prev) => {
      const current = prev[id] || {
        seoTitle: '',
        seoDescription: '',
        focusKeywords: '',
        imageAltText: '',
        isIndexable: true,
        isModified: false,
        isSaving: false,
        isSaved: false,
      };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: value,
          isModified: true,
          isSaved: false,
        },
      };
    });
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const state = editStates[art.id] || {
        seoTitle: art.seoTitle || art.title,
        seoDescription: art.seoDescription || art.summary,
        focusKeywords: art.focusKeywords || '',
        imageAltText: '',
        isIndexable: true,
        isModified: false,
        isSaving: false,
        isSaved: false,
      };

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSeo = state.seoTitle.toLowerCase().includes(q);
        const matchesKw = state.focusKeywords.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSeo && !matchesKw) return false;
      }

      // Category
      if (categoryFilter !== 'all' && art.category !== categoryFilter) {
        return false;
      }

      // Health filter
      if (seoHealthFilter === 'missing_title') {
        return !state.seoTitle || state.seoTitle.trim().length < 30;
      }
      if (seoHealthFilter === 'missing_desc') {
        return !state.seoDescription || state.seoDescription.trim().length < 70;
      }
      if (seoHealthFilter === 'missing_keywords') {
        return !state.focusKeywords || state.focusKeywords.trim().length === 0;
      }
      if (seoHealthFilter === 'modified') {
        return state.isModified;
      }

      return true;
    });
  }, [articles, editStates, searchQuery, categoryFilter, seoHealthFilter]);

  // Modified count
  const modifiedCount = useMemo(() => {
    return Object.values(editStates).filter((s) => s.isModified).length;
  }, [editStates]);

  // Save single article
  const handleSaveSingle = async (art: NewsArticle) => {
    const state = editStates[art.id];
    if (!state) return;

    setEditStates((prev) => ({
      ...prev,
      [art.id]: { ...prev[art.id], isSaving: true },
    }));

    try {
      await onSaveArticle({
        id: art.id,
        seoTitle: state.seoTitle.trim(),
        seoDescription: state.seoDescription.trim(),
        focusKeywords: state.focusKeywords.trim(),
        imageAltText: state.imageAltText.trim(),
      });

      setEditStates((prev) => ({
        ...prev,
        [art.id]: {
          ...prev[art.id],
          isSaving: false,
          isModified: false,
          isSaved: true,
        },
      }));

      setTimeout(() => {
        setEditStates((prev) => ({
          ...prev,
          [art.id]: { ...prev[art.id], isSaved: false },
        }));
      }, 3000);
    } catch (err) {
      console.error(err);
      alert(`Error saving SEO tags for ${art.title}`);
      setEditStates((prev) => ({
        ...prev,
        [art.id]: { ...prev[art.id], isSaving: false },
      }));
    }
  };

  // Bulk Save all modified
  const handleSaveAllModified = async () => {
    const dirtyIds = Object.keys(editStates).filter((id) => editStates[id]?.isModified);
    if (dirtyIds.length === 0) {
      alert('No modified articles to save.');
      return;
    }

    setIsBulkSaving(true);
    let count = 0;

    for (const id of dirtyIds) {
      const state = editStates[id];
      const art = articles.find((a) => a.id === id);
      if (state && art) {
        try {
          await onSaveArticle({
            id,
            seoTitle: state.seoTitle.trim(),
            seoDescription: state.seoDescription.trim(),
            focusKeywords: state.focusKeywords.trim(),
            imageAltText: state.imageAltText.trim(),
          });
          count++;
          setEditStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], isModified: false, isSaved: true },
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }

    setIsBulkSaving(false);
    setBulkActionSuccess(`सफलतापूर्वक ${count} आर्टिकल्स के एसईओ मेटा टैग्स सहेजे गए!`);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  // AI / Smart Auto-Optimize All Incomplete Meta Tags
  const handleSmartAutoGenerateAll = () => {
    let generatedCount = 0;
    setEditStates((prev) => {
      const next = { ...prev };
      for (const art of articles) {
        const cur = next[art.id] || {
          seoTitle: '',
          seoDescription: '',
          focusKeywords: '',
          imageAltText: '',
          isIndexable: true,
          isModified: false,
          isSaving: false,
          isSaved: false,
        };

        let changed = false;
        let newTitle = cur.seoTitle;
        let newDesc = cur.seoDescription;
        let newKw = cur.focusKeywords;
        let newAlt = cur.imageAltText;

        // Title optimization (ideal 50-65 chars)
        if (!newTitle || newTitle.trim().length < 30) {
          const raw = `${art.title} | ${siteTitle}`;
          newTitle = raw.length > 68 ? art.title.slice(0, 65) : raw;
          changed = true;
        }

        // Description optimization (ideal 130-160 chars)
        if (!newDesc || newDesc.trim().length < 70) {
          const rawDesc = art.summary || art.content?.slice(0, 160) || '';
          newDesc = rawDesc.length > 155 ? `${rawDesc.slice(0, 150)}...` : rawDesc;
          changed = true;
        }

        // Keywords optimization
        if (!newKw || newKw.trim().length === 0) {
          const catLabel = CATEGORIES.find((c) => c.id === art.category)?.labelHindi || art.category;
          newKw = `${catLabel}, ${art.location || 'भारत'}, ताज़ा समाचार, Breaking News, Khabri Dost`;
          changed = true;
        }

        // Image Alt text
        if (!newAlt || newAlt.trim().length === 0) {
          newAlt = art.imageCaption || art.title;
          changed = true;
        }

        if (changed) {
          next[art.id] = {
            ...cur,
            seoTitle: newTitle,
            seoDescription: newDesc,
            focusKeywords: newKw,
            imageAltText: newAlt,
            isModified: true,
            isSaved: false,
          };
          generatedCount++;
        }
      }
      return next;
    });

    setBulkActionSuccess(`स्वचालित रूप से ${generatedCount} आर्टिकल्स के लिए अनुकूलित मेटा टैग्स, विवरण व कीवर्ड्स तैयार किए गए! अब 'सभी सहेजें' पर क्लिक करें।`);
    setTimeout(() => setBulkActionSuccess(null), 6000);
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map((a) => a.id));
    }
  };

  // Apply bulk keyword to selected
  const handleApplyBulkKeyword = () => {
    if (!bulkKeywordInput.trim() || selectedArticles.length === 0) return;
    const kwToAdd = bulkKeywordInput.trim();

    setEditStates((prev) => {
      const next = { ...prev };
      for (const id of selectedArticles) {
        if (next[id]) {
          const currentKw = next[id].focusKeywords || '';
          const updatedKw = currentKw.includes(kwToAdd)
            ? currentKw
            : currentKw ? `${currentKw}, ${kwToAdd}` : kwToAdd;
          next[id] = {
            ...next[id],
            focusKeywords: updatedKw,
            isModified: true,
          };
        }
      }
      return next;
    });

    setBulkKeywordInput('');
    setShowBulkKeywordModal(false);
    setBulkActionSuccess(`चयनित ${selectedArticles.length} आर्टिकल्स में कीवर्ड '${kwToAdd}' जोड़ा गया!`);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-5 font-kd-meta">
      {/* Top Banner & Fast Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-red-600 text-white font-bold">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kd-headline flex items-center gap-2">
                  <span>Advance Level SEO Meta Tags Bulk Editor</span>
                  <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                    BULK ENGINE
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  सभी आर्टिकल्स के Google SEO शीर्षक, मेटा विवरण (Meta Description), फोकस कीवर्ड्स व Image Alt को एक ही स्थान से बल्क में एडिट करें।
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {/* Auto Generate Button */}
            <button
              type="button"
              onClick={handleSmartAutoGenerateAll}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              title="अपूर्ण आर्टिकल्स के लिए AI/ऑटो मेटा टैग्स भरें"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>1-Click Auto-Generate Missing Meta</span>
            </button>

            {/* Save All Modified Button */}
            <button
              type="button"
              onClick={handleSaveAllModified}
              disabled={modifiedCount === 0 || isBulkSaving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isBulkSaving ? 'सहेजा जा रहा है...' : `Save All Modified (${modifiedCount})`}</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {bulkActionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bulkActionSuccess}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="आर्टिकल शीर्षक या कीवर्ड खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
            >
              <option value="all">सभी श्रेणियां (All Categories)</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.labelHindi} ({c.labelEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* SEO Health Filter */}
          <div>
            <select
              value={seoHealthFilter}
              onChange={(e) => setSeoHealthFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
            >
              <option value="all">सम्पूर्ण स्थिति (All Status)</option>
              <option value="missing_title">⚠️ अधूरा Meta Title (&lt;30 Chars)</option>
              <option value="missing_desc">⚠️ अधूरा Meta Description (&lt;70 Chars)</option>
              <option value="missing_keywords">⚠️ Focus Keywords गायब</option>
              <option value="modified">✏️ केवल संशोधित (Modified Only)</option>
            </select>
          </div>

          {/* Multi-Select Action */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer flex-1 text-center"
            >
              {selectedArticles.length === filteredArticles.length && filteredArticles.length > 0
                ? 'अन-चेक करें (Deselect)'
                : `सभी चेक (${filteredArticles.length})`}
            </button>

            {selectedArticles.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBulkKeywordModal(true)}
                className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-red-200 transition cursor-pointer flex items-center space-x-1"
                title="चयनित आर्टिकल्स में कीवर्ड जोड़ें"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>+कीवर्ड ({selectedArticles.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Articles Spreadsheet / Card List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">कोई आर्टिकल नहीं मिला। फ़िल्टर बदल कर देखें।</p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const state = editStates[art.id] || {
              seoTitle: art.seoTitle || art.title,
              seoDescription: art.seoDescription || art.summary,
              focusKeywords: art.focusKeywords || '',
              imageAltText: art.imageAltText || art.title,
              isIndexable: true,
              isModified: false,
              isSaving: false,
              isSaved: false,
            };

            const isSelected = selectedArticles.includes(art.id);
            const titleLength = state.seoTitle.length;
            const descLength = state.seoDescription.length;

            return (
              <div
                key={art.id}
                className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                  state.isModified
                    ? 'border-amber-400 ring-2 ring-amber-100'
                    : isSelected
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Header Row */}
                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedArticles((prev) => [...prev, art.id]);
                        } else {
                          setSelectedArticles((prev) => prev.filter((id) => id !== art.id));
                        }
                      }}
                      className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                    />

                    <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
                      {art.category}
                    </span>

                    <span className="font-bold text-slate-900 truncate max-w-sm sm:max-w-md lg:max-w-xl" title={art.title}>
                      {art.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Google SERP Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(art)}
                      className="text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition"
                      title="Google SERP प्रीव्यू देखें"
                    >
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span className="hidden sm:inline">Google SERP Preview</span>
                    </button>

                    {/* Single Save Button */}
                    <button
                      type="button"
                      onClick={() => handleSaveSingle(art)}
                      disabled={state.isSaving || (!state.isModified && !state.isSaved)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                        state.isSaved
                          ? 'bg-emerald-600 text-white'
                          : state.isModified
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs'
                          : 'bg-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      {state.isSaving ? (
                        <span>Saving...</span>
                      ) : state.isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved ✓</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Row</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Row: Editable Form Inputs */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start text-xs">
                  {/* Left: Thumbnail & Info */}
                  <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-2">
                    <img
                      src={art.imageUrl}
                      alt={state.imageAltText || art.title}
                      className="w-20 h-14 md:w-full md:h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <div className="font-mono">ID: {art.id.slice(0, 8)}...</div>
                      <div className="truncate">लेखक: {art.authorName}</div>
                      <div className="text-emerald-700 font-bold">
                        {state.isIndexable ? '● Google Index' : '○ No-Index'}
                      </div>
                    </div>
                  </div>

                  {/* Middle-Left: SEO Title & Description */}
                  <div className="md:col-span-6 space-y-2.5">
                    {/* SEO Title Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Google SEO Meta Title (शीर्षक)
                        </label>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            titleLength >= 45 && titleLength <= 65
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : titleLength < 35
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {titleLength} / 65 ch
                        </span>
                      </div>
                      <input
                        type="text"
                        value={state.seoTitle}
                        onChange={(e) => updateField(art.id, 'seoTitle', e.target.value)}
                        placeholder="Google Search Result Title..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                      />
                    </div>

                    {/* SEO Description Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Google Search Meta Description (मेटा विवरण)
                        </label>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            descLength >= 120 && descLength <= 160
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : descLength < 70
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {descLength} / 160 ch
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={state.seoDescription}
                        onChange={(e) => updateField(art.id, 'seoDescription', e.target.value)}
                        placeholder="Google Search Snippet Preview Description..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Middle-Right: Focus Keywords & Image Alt */}
                  <div className="md:col-span-4 space-y-2.5">
                    {/* Focus Keywords */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Focus Keywords (अल्पविराम / Comma से अलग करें)
                      </label>
                      <input
                        type="text"
                        value={state.focusKeywords}
                        onChange={(e) => updateField(art.id, 'focusKeywords', e.target.value)}
                        placeholder="उदा. उत्तर प्रदेश, राजनीति, Breaking News..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                      />
                      {/* Keyword Tag Chips Preview */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {state.focusKeywords
                          .split(',')
                          .filter((k) => k.trim())
                          .slice(0, 4)
                          .map((kw, ki) => (
                            <span
                              key={ki}
                              className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              #{kw.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Image Alt Text */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Image Alt Text (Google Images SEO)
                      </label>
                      <input
                        type="text"
                        value={state.imageAltText}
                        onChange={(e) => updateField(art.id, 'imageAltText', e.target.value)}
                        placeholder="छवि विवरण (उदा. संसद भवन नई दिल्ली)..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: LIVE GOOGLE SEARCH SERP PREVIEW */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl p-5 space-y-4 font-sans text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Google Search Snippet Preview (SERP Simulation)
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                      previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                      previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewArticle(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Google SERP Card Preview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              {previewDevice === 'desktop' ? (
                // Google Desktop Result Card
                <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center space-x-2 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                      KD
                    </div>
                    <div className="leading-tight">
                      <span className="font-semibold text-slate-800">{siteTitle}</span>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {baseUrl} &gt; {previewArticle.category} &gt; {previewArticle.id.slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-normal pt-1">
                    {editStates[previewArticle.id]?.seoTitle || previewArticle.title}
                  </h3>

                  <p className="text-xs text-[#4d5156] leading-relaxed pt-0.5">
                    <span className="text-slate-500 font-semibold mr-1">
                      {new Date(previewArticle.createdAt).toLocaleDateString('hi-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })} —
                    </span>
                    {editStates[previewArticle.id]?.seoDescription || previewArticle.summary}
                  </p>
                </div>
              ) : (
                // Google Mobile Result Card
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs max-w-sm mx-auto space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      KD
                    </div>
                    <div className="text-xs truncate">
                      <div className="font-bold text-slate-800 leading-none">{siteTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{baseUrl}</div>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[#1a0dab] leading-snug">
                    {editStates[previewArticle.id]?.seoTitle || previewArticle.title}
                  </h3>

                  <div className="flex gap-2.5 items-start">
                    <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-3">
                      {editStates[previewArticle.id]?.seoDescription || previewArticle.summary}
                    </p>
                    {previewArticle.imageUrl && (
                      <img
                        src={previewArticle.imageUrl}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg shrink-0 bg-slate-100"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Google SERP Ranking Simulator</span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BULK ADD KEYWORD */}
      {showBulkKeywordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-xl p-5 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-red-600" />
                <span>Bulk Focus Keyword Addition</span>
              </h4>
              <button onClick={() => setShowBulkKeywordModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                चयनित <strong>{selectedArticles.length}</strong> आर्टिकल्स के Focus Keywords में नया कीवर्ड जोड़ें:
              </p>
              <input
                type="text"
                value={bulkKeywordInput}
                onChange={(e) => setBulkKeywordInput(e.target.value)}
                placeholder="उदा. Lok Sabha 2026, Budget News, Cricket Live..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkKeywordModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleApplyBulkKeyword}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-2xs"
              >
                लागू करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
