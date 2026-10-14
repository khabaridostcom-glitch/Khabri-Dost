import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Tag,
  MapPin,
  Flame,
  Star,
  Bookmark,
  FileText,
  HelpCircle,
  Play,
  ShieldCheck,
  Camera,
  Upload,
  User,
  RefreshCw,
  RotateCcw,
  Check,
} from 'lucide-react';
import { NewsArticle, NewsCategory, MediaAsset, ApiConfiguration } from '../types/news';
import { CATEGORIES, getAuthorPhoto, AUTHOR_PROFILES } from '../data/seedNews';
import { AiSeoMetaGenerator } from './admin/AiSeoMetaGenerator';
import { AiSeoAssistantModal, DraftedSeoArticle } from './admin/AiSeoAssistantModal';
import { renderArticleBlock } from '../utils/articleContentParser';
import { compressImage } from '../utils/imageCompressor';

interface RichPostEditorModalProps {
  article: Partial<NewsArticle> | null;
  onClose: () => void;
  onSave: (article: Partial<NewsArticle>) => Promise<void>;
  mediaLibrary?: MediaAsset[];
  onOpenMediaLibrary?: () => void;
  apiConfig?: ApiConfiguration;
  inline?: boolean;
  existingArticles?: NewsArticle[];
}

export const RichPostEditorModal: React.FC<RichPostEditorModalProps> = ({
  article,
  onClose,
  onSave,
  mediaLibrary = [],
  onOpenMediaLibrary,
  apiConfig,
  inline = false,
  existingArticles = [],
}) => {
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: article?.title || '',
    summary: article?.summary || '',
    content: article?.content || '',
    category: article?.category || 'national',
    imageUrl:
      article?.imageUrl ||
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    imageCaption: article?.imageCaption || '',
    authorName: article?.authorName || 'मुख्य संपादक',
    authorRole: article?.authorRole || 'संपादकीय डेस्क',
    authorPhotoUrl: article?.authorPhotoUrl || getAuthorPhoto(article?.authorName || 'मुख्य संपादक'),
    authorUid: article?.authorUid || 'admin-user',
    location: article?.location || 'नई दिल्ली',
    isBreaking: article?.isBreaking || false,
    isTopStory: article?.isTopStory || false,
    isPinned: article?.isPinned || false,
    isEditorsPick: article?.isEditorsPick || false,
    status: article?.status || 'published',
    scheduledFor: article?.scheduledFor || '',
    seoTitle: article?.seoTitle || '',
    seoDescription: article?.seoDescription || '',
    focusKeywords: article?.focusKeywords || '',
    tags: article?.tags || ['ताज़ा ख़बर', 'राष्ट्रीय'],
    highlights: article?.highlights || [],
    urlSlug: article?.urlSlug || '',
    ...(article?.id ? { id: article.id } : {}),
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo'>('editor');
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isCompressingAuthorPhoto, setIsCompressingAuthorPhoto] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [autoGeneratingSeo, setAutoGeneratingSeo] = useState(false);
  const [seoSuccessToast, setSeoSuccessToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Autosave Draft Recovery
  const [autosavedDraftAvailable, setAutosavedDraftAvailable] = useState<{
    data: Partial<NewsArticle>;
    savedAt: string;
  } | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<string | null>(null);

  // Check for autosaved draft on mount if composing a new article
  useEffect(() => {
    if (!article?.id) {
      try {
        const raw = localStorage.getItem('kd_editor_autosave_draft');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.data && (parsed.data.title?.trim() || parsed.data.content?.trim())) {
            setAutosavedDraftAvailable(parsed);
          }
        }
      } catch {}
    }
  }, [article?.id]);

  // Periodic autosave for new articles (every 1.5s after editing stops)
  useEffect(() => {
    if (article?.id) return;
    if (!formData.title?.trim() && !formData.content?.trim()) return;

    const timer = setTimeout(() => {
      try {
        const payload = {
          data: formData,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('kd_editor_autosave_draft', JSON.stringify(payload));
        const timeStr = new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setAutosaveStatus(`ऑटो-सेव: ${timeStr}`);
      } catch {}
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, article?.id]);

  // Duplicate slug / title collision detection
  const duplicateCollision = useMemo(() => {
    if (!existingArticles || existingArticles.length === 0) return null;
    const currentSlug = formData.urlSlug?.trim().toLowerCase();
    const currentTitle = formData.title?.trim().toLowerCase();
    if (!currentSlug && !currentTitle) return null;

    for (const a of existingArticles) {
      if (article?.id && a.id === article.id) continue;
      if (currentSlug && a.urlSlug && a.urlSlug.toLowerCase() === currentSlug) {
        return { type: 'slug' as const, value: a.urlSlug, title: a.title };
      }
      if (currentTitle && a.title && a.title.trim().toLowerCase() === currentTitle) {
        return { type: 'title' as const, value: a.title, title: a.title };
      }
    }
    return null;
  }, [existingArticles, formData.urlSlug, formData.title, article?.id]);

  const handleAutoSuffixSlug = () => {
    const base = formData.urlSlug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]/gi, '-').slice(0, 30) : 'khabri-news');
    const suffixed = `${base.replace(/-+$/, '')}-${Math.floor(10 + Math.random() * 90)}`;
    setFormData((prev) => ({ ...prev, urlSlug: suffixed }));
  };

  const handleRestoreAutosavedDraft = () => {
    if (autosavedDraftAvailable) {
      setFormData((prev) => ({ ...prev, ...autosavedDraftAvailable.data }));
      setAutosavedDraftAvailable(null);
      setSeoSuccessToast('✓ पिछला ड्राफ्ट सफलतापूर्वक लोड किया गया!');
      setTimeout(() => setSeoSuccessToast(null), 3500);
    }
  };

  const handleDiscardAutosavedDraft = () => {
    try {
      localStorage.removeItem('kd_editor_autosave_draft');
    } catch {}
    setAutosavedDraftAvailable(null);
  };
  const authorPhotoInputRef = useRef<HTMLInputElement>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Formatting helper that inserts markdown/tags into content
  const applyFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.content || '';

    const selectedText = currentText.substring(start, end) || defaultPlaceholder;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);

    setFormData({ ...formData, content: newContent });

    // Re-focus and position cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  // Hindi News Template Inserters
  const insertTemplate = (type: 'breaking' | 'statement' | 'quote' | 'keypoints') => {
    if (type === 'breaking') {
      const template = `\n\n### ⚡ बड़ी बातें (Key Highlights):\n- **घटना:** \n- **समय व स्थान:** \n- **मुख्य बिंदु:** \n- **आधिकारिक पुष्टि:** \n\n`;
      applyFormatting('', '', template);
    } else if (type === 'statement') {
      const template = `\n\n> «यहाँ संबंधित नेता या अधिकारी का आधिकारिक बयान लिखें। निष्पक्ष पत्रकारिता के सिद्धांतों का पालन करें।» \n— **नाम व पदनाम**\n\n`;
      applyFormatting('', '', template);
    } else if (type === 'quote') {
      applyFormatting('> «', '»\n');
    } else if (type === 'keypoints') {
      const template = `\n\n> 💡 **विशेष तथ्य (Special Report):**\n> 1. \n> 2. \n> 3. \n\n`;
      applyFormatting('', '', template);
    }
  };

  // Word & Character count calculations
  const wordsCount = (formData.content || '').trim().split(/\s+/).filter(Boolean).length;
  const charsCount = (formData.content || '').length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordsCount / 180));

  // Tag Management
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    const currentTags = formData.tags || [];
    if (!currentTags.includes(clean)) {
      setFormData({ ...formData, tags: [...currentTags, clean] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((tag) => tag !== t),
    });
  };

  // Auto-Generate SEO using Gemini API based on article content
  const handleAutoGenerateSeo = async () => {
    if (!formData.content || formData.content.trim().length < 20) {
      setFormError('कृपया पहले लेख का विवरण / बॉडी (Body Content) लिखें ताकि AI सही व सटीक SEO तैयार कर सके।');
      return;
    }
    setAutoGeneratingSeo(true);
    setFormError(null);
    try {
      const activeProvider = apiConfig?.activeAiProvider || 'gemini';
      const customKey =
        activeProvider === 'gemini'
          ? apiConfig?.geminiApiKey
          : activeProvider === 'openai'
          ? apiConfig?.openaiApiKey
          : apiConfig?.anthropicApiKey;

      const res = await fetch('/api/ai/generate-seo-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          title: formData.title,
          category: formData.category || 'national',
          customApiKey: customKey,
          provider: activeProvider,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        const data = resData.data;
        setFormData((prev) => ({
          ...prev,
          title: prev.title?.trim() ? prev.title : data.metaTitle,
          seoTitle: data.metaTitle,
          seoDescription: data.metaDescription,
          summary: prev.summary?.trim() ? prev.summary : data.metaDescription,
          focusKeywords: data.focusKeywords,
          tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : prev.tags,
          highlights: data.highlights || prev.highlights,
          urlSlug: data.urlSlug || prev.urlSlug,
        }));
        setSeoSuccessToast('✓ Auto-Generate SEO: Title, Slug, Meta, Tags & Highlights updated successfully!');
        setTimeout(() => setSeoSuccessToast(null), 4000);
      } else {
        throw new Error(resData.error || 'Failed to auto-generate SEO');
      }
    } catch (err: any) {
      console.error('Auto SEO error:', err);
      setFormError('SEO जनरेट करने में त्रुटि: ' + (err.message || 'Error'));
    } finally {
      setAutoGeneratingSeo(false);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.title?.trim() || !formData.summary?.trim() || !formData.content?.trim()) {
      setFormError('कृपया समाचार शीर्षक, संक्षिप्त सार और पूर्ण लेख अवश्य भरें।');
      return;
    }

    if (formData.status === 'scheduled' && !formData.scheduledFor) {
      setFormError('कृपया शेड्यूल्ड प्रकाशन का समय (Release Timestamp) चुनें।');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      try {
        localStorage.removeItem('kd_editor_autosave_draft');
      } catch {}
      onClose();
    } catch (err: any) {
      console.error(err);
      setFormError('आर्टिकल सहेजने में त्रुटि आई: ' + (err?.message || 'पुनः प्रयास करें'));
    } finally {
      setIsSaving(false);
    }
  };

  const editorContent = (
    <div className={`bg-slate-900 border border-slate-800 w-full ${inline ? 'rounded-2xl shadow-xl min-h-[85vh]' : 'max-w-5xl rounded-2xl shadow-2xl max-h-[92vh] my-auto'} flex flex-col overflow-hidden`}>
      {/* MODAL HEADER */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{formData.id ? 'Edit News Article' : 'Compose News Article'}</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {formData.status?.toUpperCase() || 'PUBLISHED'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Professional Editorial Studio with Rich Hindi Formatting & SEO Metadata
              </p>
            </div>
          </div>

          {/* Top Tabs: Editor, Live Preview, SEO */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={handleAutoGenerateSeo}
              disabled={autoGeneratingSeo}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              title="Automatically generate title, slug, meta description, tags, and highlights based on article content"
            >
              {autoGeneratingSeo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Auto-Generate SEO</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAiAssistantOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Open AI SEO Assistant to draft, review, and refine title, meta, highlights, and body content"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI SEO Assistant</span>
            </button>

            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'seo'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>SEO Meta</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-mono ml-1">AI</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Form Error Toast */}
          {formError && (
            <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Autosaved Draft Recovery Notice */}
          {autosavedDraftAvailable && !article?.id && (
            <div className="bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">
                    पुनर्प्राप्त करने योग्य ड्राफ्ट मिला (Unsaved Draft Recovered):
                  </strong>
                  <span className="text-[11px] text-amber-300/80">
                    "{autosavedDraftAvailable.data.title || 'शीर्षक रहित'}" ({new Date(autosavedDraftAvailable.savedAt).toLocaleTimeString('hi-IN')})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRestoreAutosavedDraft}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ड्राफ्ट लोड करें (Restore)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDiscardAutosavedDraft}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer border border-slate-700"
                >
                  खारिज करें (Discard)
                </button>
              </div>
            </div>
          )}

          {/* Duplicate Collision Warning */}
          {duplicateCollision && (
            <div className="bg-red-950/90 border border-red-500/70 text-red-200 text-xs p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>डुप्लिकेट चेतावनी ({duplicateCollision.type === 'slug' ? 'URL स्लग' : 'शीर्षक'}):</strong> यह पहले से मौजूद खबर ("{duplicateCollision.title.slice(0, 45)}...") से मेल खाता है।
                </span>
              </div>
              {duplicateCollision.type === 'slug' && (
                <button
                  type="button"
                  onClick={handleAutoSuffixSlug}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer"
                >
                  स्लग में '-2' जोड़ें (Auto-Fix)
                </button>
              )}
            </div>
          )}

          {/* TAB 1: MAIN EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Success Toast */}
              {seoSuccessToast && (
                <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in">
                  <div className="flex items-center space-x-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{seoSuccessToast}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className="text-[11px] underline text-emerald-300 hover:text-white font-bold cursor-pointer"
                  >
                    View SEO Meta →
                  </button>
                </div>
              )}

              {/* AI Quick SEO Assistant Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 border border-slate-800 hover:border-red-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <strong className="text-white block">AI SEO Assistant & Article Drafter:</strong>
                    <span className="text-[11px] text-slate-400">
                      जेमिनी एआई द्वारा लेख की बॉडी के आधार पर अनुकूलित शीर्षक, स्लग, मेटा विवरण, टैग्स व मुख्य बिंदु तुरंत प्राप्त करें।
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoGenerateSeo}
                    disabled={autoGeneratingSeo}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    {autoGeneratingSeo ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Auto-Generate SEO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30"
                  >
                    <span>Assistant (Draft / Refine)</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Primary Headline Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>मुख्य समाचार शीर्षक (Headline) *</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({(formData.title || '').length}/150 वर्ण)
                    </span>
                  </label>
                  <span className="text-[10px] text-red-400">अनिवार्य (Required)</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="आकर्षक व स्पष्ट मुख्य समाचार शीर्षक यहाँ लिखें..."
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 font-bold"
                />
              </div>

              {/* Summary / Sub-headline */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-200">
                    संक्षिप्त सार / इंट्रो (Summary / Standfirst) *
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {(formData.summary || '').length} वर्ण
                  </span>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="समाचार का 2-3 पंक्तियों में सार लिखें, जो पाठकों को मुख्य बिंदु समझाए..."
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* RICH EDITORIAL TOOLBAR */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="p-2 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center gap-1 text-slate-300">
                  {/* Text Style: Bold, Italic, Underline, Strike */}
                  <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => applyFormatting('**', '**', 'बोल्ड टेक्स्ट')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="बोल्ड (Bold - **text**)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('*', '*', 'इटैलिक टेक्स्ट')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="इटैलिक (Italic - *text*)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('<u>', '</u>', 'अंडरलाइन टेक्स्ट')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="अंडरलाइन (Underline)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('~~', '~~', 'स्ट्राइक टेक्स्ट')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="स्ट्राइकथ्रू (Strikethrough)"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Headings: H2, H3 */}
                  <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => applyFormatting('\n\n## ', '\n', 'उप-शीर्षक H2')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition font-bold text-xs"
                      title="बड़ा उप-शीर्षक (H2 Heading)"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('\n\n### ', '\n', 'लघु उप-शीर्षक H3')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition font-bold text-xs"
                      title="छोटा उप-शीर्षक (H3 Heading)"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Lists & Quotes */}
                  <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => applyFormatting('\n- ', '', 'बिंदु सूची')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="बुलेटेड लिस्ट (Bullet List)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('\n1. ', '', 'क्रम संख्या सूची')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="नंबर लिस्ट (Numbered List)"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('\n> «', '»\n', 'महत्वपूर्ण उद्धरण')}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="उद्धरण बॉक्स (Blockquote / Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Insert Link, Media & Rich Embeds */}
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-wrap gap-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter link URL (लिंक URL दर्ज करें):', 'https://');
                        if (url) {
                          applyFormatting('[', `](${url})`, 'लिंक टेक्स्ट');
                        }
                      }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                      title="Link (लिंक जोड़ें)"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(!mediaPickerOpen)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center space-x-1"
                      title="Media Gallery"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Media</span>
                    </button>
                    {/* YouTube Video Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('YouTube Video URL or Video ID:\n(e.g., https://www.youtube.com/watch?v=jfKfPfyJRdk)', '');
                        if (url && url.trim()) {
                          applyFormatting(`\n\n[youtube:${url.trim()}]\n\n`, '');
                        }
                      }}
                      className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center space-x-1"
                      title="Embed YouTube Video inside paragraph"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>YouTube</span>
                    </button>
                    {/* Twitter / X Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Twitter / X Post URL:\n(e.g., https://x.com/KhabriDost/status/123456)', '');
                        if (url && url.trim()) {
                          const author = prompt('Author / Handle:', '@KhabriDost') || '@KhabriDost';
                          const text = prompt('Tweet text:', 'Breaking update via official handle') || 'Official Post';
                          applyFormatting(`\n\n[tweet:${url.trim()}|${author}|${text}]\n\n`, '');
                        }
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold flex items-center space-x-1"
                      title="Embed Twitter/X Post"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>Tweet</span>
                    </button>
                    {/* In-article Image Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Image URL to embed:', 'https://images.unsplash.com/...');
                        if (url && url.trim()) {
                          const caption = prompt('Image Caption / Photo Credit:', 'विशेष साभार');
                          applyFormatting(`\n\n[image:${url.trim()}|${caption || ''}|Photo Credit]\n\n`, '');
                        }
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
                      title="Embed Inline Photo with Caption"
                    >
                      <span>📸 Photo</span>
                    </button>
                    {/* Fact Check Box */}
                    <button
                      type="button"
                      onClick={() => {
                        applyFormatting(`\n\n[factcheck:सोशल मीडिया पर किया जा रहा वायरल दावा | हमारी पड़ताल में यह दावा भ्रामक/सत्य पाया गया | विस्तृत तथ्य व आधिकारिक पुष्टि यहाँ लिखें...]\n\n`, '');
                      }}
                      className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center space-x-1"
                      title="Fact Check Box"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Fact Check</span>
                    </button>
                  </div>

                  {/* Quick Hindi Typing Helpers */}
                  <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Hindi:</span>
                    <button
                      type="button"
                      onClick={() => applyFormatting('। ')}
                      className="px-1.5 py-0.5 rounded hover:bg-slate-800 font-bold"
                      title="पूर्ण विराम"
                    >
                      ।
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('«', '»', 'कथन')}
                      className="px-1.5 py-0.5 rounded hover:bg-slate-800 font-bold"
                      title="देवनागरी दोहरा उद्धरण"
                    >
                      « »
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting(' — ')}
                      className="px-1.5 py-0.5 rounded hover:bg-slate-800 font-bold"
                      title="डैश"
                    >
                      —
                    </button>
                  </div>

                  {/* Newsroom Pre-built Templates Dropdown */}
                  <div className="ml-auto flex items-center space-x-1.5">
                    <span className="text-[11px] text-slate-400 hidden lg:inline">Templates:</span>
                    <button
                      type="button"
                      onClick={() => insertTemplate('breaking')}
                      className="text-[10px] px-2 py-1 bg-red-950 text-red-300 hover:bg-red-900 border border-red-800/80 rounded font-semibold"
                    >
                      ⚡ Key Highlights
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate('statement')}
                      className="text-[10px] px-2 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded font-semibold"
                    >
                      « Official Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate('keypoints')}
                      className="text-[10px] px-2 py-1 bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800/80 rounded font-semibold"
                    >
                      💡 Fact Box
                    </button>
                  </div>
                </div>

                {/* Inline Media Library Drawer for Quick Inserting */}
                {mediaPickerOpen && (
                  <div className="p-3 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Select image to insert into article body:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                      {mediaLibrary.slice(0, 12).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            applyFormatting(
                              `\n\n![${item.caption || item.title}](${item.url})\n*चित्र: ${item.caption || item.title}*\n\n`
                            );
                            setMediaPickerOpen(false);
                          }}
                          className="group relative cursor-pointer rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400 transition aspect-video"
                        >
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-amber-300 text-center p-1 transition">
                            + Insert
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Content Textarea */}
                <textarea
                  ref={contentTextareaRef}
                  rows={10}
                  required
                  placeholder="यहाँ पूरा समाचार विस्तार से लिखें... (ऊपर दिए गए टूलबार से बोल्ड, इटैलिक, उप-शीर्षक या उद्धरण जोड़ें)"
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none text-xs sm:text-sm leading-relaxed font-sans"
                />

                {/* Editorial Counters Footer */}
                <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      शब्द (Words): <strong className="text-slate-200">{wordsCount}</strong>
                    </span>
                    <span>
                      वर्ण (Characters): <strong className="text-slate-200">{charsCount}</strong>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        अनुमानित समय:{' '}
                        <strong className="text-slate-200">{readTimeMinutes} मिनट</strong>
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400">✓ Auto-Draft Ready</span>
                </div>
              </div>

              {/* Category, Status & Media Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    खबर का विषय (Category) *
                  </label>
                  <select
                    value={formData.category || 'national'}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as NewsCategory })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.labelHindi} ({c.labelEnglish})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    प्रकाशन स्थिति (Status) *
                  </label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="published">🟢 Published (लाइव प्रकाशित)</option>
                    <option value="draft">🟡 Draft (प्रारूप)</option>
                    <option value="scheduled">⏱️ Scheduled (शेड्यूल)</option>
                    <option value="archived">⚪ Archived (आर्काइव)</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="sm:col-span-3 bg-amber-950/40 border border-amber-600/50 rounded-xl p-3 space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>शेड्यूल्ड प्रकाशन समय (Release Timestamp) *</span>
                      </span>
                      <span className="text-[10px] text-amber-400/80">इस समय पर यह समाचार स्वतः लाइव हो जाएगा</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor || ''}
                      onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-amber-600/40 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      संवाददाता / लेखक (Author Profile)
                    </label>
                    <select
                      onChange={(e) => {
                        const name = e.target.value;
                        if (!name) return;
                        const prof = AUTHOR_PROFILES[name];
                        if (prof) {
                          setFormData({
                            ...formData,
                            authorName: name,
                            authorRole: prof.role,
                            authorPhotoUrl: prof.photoURL,
                          });
                        }
                      }}
                      className="text-[10px] bg-slate-900 border border-slate-700 text-amber-300 rounded px-1.5 py-0.5"
                    >
                      <option value="">-- टीम से चुनें (Select Author) --</option>
                      {Object.keys(AUTHOR_PROFILES).map((author) => (
                        <option key={author} value={author}>
                          {author} ({AUTHOR_PROFILES[author].role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.authorName || ''}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="लेखक का नाम (e.g. राजेश त्रिपाठी)"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      value={formData.authorRole || ''}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      placeholder="पद / दायित्व (e.g. वरिष्ठ संवाददाता)"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Author Photo Upload & URL */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      <img
                        src={formData.authorPhotoUrl || getAuthorPhoto(formData.authorName)}
                        alt={formData.authorName || 'Author'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      ref={authorPhotoInputRef}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsCompressingAuthorPhoto(true);
                          const res = await compressImage(file, {
                            maxWidth: 300,
                            maxHeight: 300,
                            quality: 0.85,
                            format: 'image/webp',
                          });
                          setFormData({ ...formData, authorPhotoUrl: res.dataUrl });
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsCompressingAuthorPhoto(false);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => authorPhotoInputRef.current?.click()}
                      disabled={isCompressingAuthorPhoto}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold rounded-lg flex items-center space-x-1 shrink-0 cursor-pointer"
                    >
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>{isCompressingAuthorPhoto ? 'Compressing...' : 'Upload Photo'}</span>
                    </button>
                    <input
                      type="url"
                      placeholder="Photo URL..."
                      value={formData.authorPhotoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, authorPhotoUrl: e.target.value })}
                      className="w-full px-2 py-1 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image URL & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200">
                      मुख्य फ़ीचर्ड इमेज URL *
                    </label>
                    {mediaLibrary.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const random =
                            mediaLibrary[Math.floor(Math.random() * mediaLibrary.length)];
                          if (random) {
                            setFormData({
                              ...formData,
                              imageUrl: random.url,
                              imageCaption: random.caption || random.title,
                            });
                          }
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        मीडिया से चुनें
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    इमेज कैप्शन / फ़ोटो साभार (Image Caption)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. फ़ोटो: पीटीआई / विशेष व्यवस्था"
                    value={formData.imageCaption || ''}
                    onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Location & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    स्थान / ब्यूरो (Location)
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. नई दिल्ली / लखनऊ"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    टैग्स (Tags / Topics)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="टैग लिखकर + दबाएं..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(formData.tags || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center space-x-1 bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges / Promotion Flags */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  खबर का महत्व (Editorial Badges):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 transition">
                    <input
                      type="checkbox"
                      checked={formData.isBreaking || false}
                      onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                      className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      <span>Breaking News</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500 transition">
                    <input
                      type="checkbox"
                      checked={formData.isTopStory || false}
                      onChange={(e) => setFormData({ ...formData, isTopStory: e.target.checked })}
                      className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Top Story</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 transition">
                    <input
                      type="checkbox"
                      checked={formData.isPinned || false}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                      <span>Pin to Top</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500 transition">
                    <input
                      type="checkbox"
                      checked={formData.isEditorsPick || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isEditorsPick: e.target.checked })
                      }
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Editor's Pick</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4 max-w-3xl mx-auto bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {formData.category}
                </span>
                {formData.isBreaking && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                    🔴 ब्रेकिंग
                  </span>
                )}
                {formData.isTopStory && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                    ⭐ लीड स्टोरी
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-auto">
                  {formData.location} • {new Date().toLocaleDateString('hi-IN')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-['Rozha_One',serif] leading-tight text-slate-950">
                {formData.title || 'मुख्य समाचार शीर्षक पूर्वावलोकन'}
              </h1>

              <p className="text-sm font-semibold text-slate-700 leading-relaxed font-['Mukta',sans-serif]">
                {formData.summary || 'समाचार का संक्षिप्त सार यहाँ प्रदर्शित होगा...'}
              </p>

              {formData.imageUrl && (
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img src={formData.imageUrl} alt="" className="w-full h-72 object-cover" />
                  {formData.imageCaption && (
                    <p className="p-2 text-[11px] text-slate-500 bg-slate-50 italic">
                      {formData.imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Render article body with rich embeds */}
              <div className="space-y-4 pt-2 font-['Mukta',sans-serif]">
                {(formData.content || '').split('\n\n').filter(Boolean).map((para, i) => {
                  return renderArticleBlock(para, i, 'text-sm text-slate-800');
                })}
              </div>

              {/* Byline */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  रिपोर्टर:{' '}
                  <strong className="text-slate-800">
                    {formData.authorName} ({formData.authorRole})
                  </strong>
                </span>
                <span>पढ़ने का समय: {readTimeMinutes} मिनट</span>
              </div>
            </div>
          )}

          {/* TAB 3: SEO METADATA & SEARCH ENGINE CONFIGURATION */}
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Search Engine Optimization (Google News & Discovery)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Configure custom meta tags, focus search keywords, and social snippet descriptions.
                </p>
              </div>

              {/* AI Automated Meta Title & Description Generator */}
              <AiSeoMetaGenerator
                articleContent={formData.content || ''}
                articleTitle={formData.title || ''}
                articleCategory={formData.category || 'national'}
                currentSeoTitle={formData.seoTitle}
                currentSeoDescription={formData.seoDescription}
                currentFocusKeywords={formData.focusKeywords}
                currentImageAltText={formData.imageAltText}
                apiConfig={apiConfig}
                onApplyMeta={(meta) => {
                  setFormData((prev) => ({
                    ...prev,
                    ...(meta.seoTitle ? { seoTitle: meta.seoTitle } : {}),
                    ...(meta.seoDescription ? { seoDescription: meta.seoDescription } : {}),
                    ...(meta.focusKeywords ? { focusKeywords: meta.focusKeywords } : {}),
                    ...(meta.imageAltText ? { imageAltText: meta.imageAltText } : {}),
                    ...(meta.tags && meta.tags.length > 0 ? { tags: meta.tags } : {}),
                    ...(meta.highlights && meta.highlights.length > 0 ? { highlights: meta.highlights } : {}),
                    ...(meta.urlSlug ? { urlSlug: meta.urlSlug } : {}),
                  }));
                }}
              />

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  SEO Meta Title (Google Search Title)
                </label>
                <input
                  type="text"
                  placeholder={formData.title || 'गूगल सर्च परिणाम शीर्षक...'}
                  value={formData.seoTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Recommended length: 50-60 characters.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Meta Description (Google Snippet)
                </label>
                <textarea
                  rows={3}
                  placeholder={formData.summary || 'सर्च इंजन रिजल्ट्स में दिखने वाला संक्षिप्त विवरण...'}
                  value={formData.seoDescription || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Recommended length: 140-160 characters.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Focus Keywords (अल्पविराम द्वारा अलग करें)
                </label>
                <input
                  type="text"
                  placeholder="e.g. गगनयान, इसरो, भारतीय अंतरिक्ष यात्री, ताज़ा ख़बर"
                  value={formData.focusKeywords || ''}
                  onChange={(e) => setFormData({ ...formData, focusKeywords: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              {/* URL Slug & Highlights */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Clean URL Slug (सर्च-अनुकूल URL स्लग)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-800 text-slate-400 text-xs px-3 py-2 rounded-l-xl border border-r-0 border-slate-700 font-mono">
                      khabridost.com/{formData.category}/
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. gaganyaan-mission-launch-2026-latest-update"
                      value={formData.urlSlug || ''}
                      onChange={(e) => setFormData({ ...formData, urlSlug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-r-xl text-white focus:outline-none font-mono"
                    />
                  </div>
                  {duplicateCollision?.type === 'slug' && (
                    <div className="mt-1 flex items-center justify-between text-[11px] text-red-400 bg-red-950/40 border border-red-800/60 px-2.5 py-1.5 rounded-lg">
                      <span>⚠️ यह स्लग पहले से उपयोग में है (Colliding Slug)!</span>
                      <button
                        type="button"
                        onClick={handleAutoSuffixSlug}
                        className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
                      >
                        स्लग ठीक करें (+सुफिक्स)
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    मुख्य आकर्षण (Key Story Highlights - प्रति पंक्ति एक बिंदु)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="हर पंक्ति में एक मुख्य बिंदु लिखें..."
                    value={(formData.highlights || []).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        highlights: e.target.value.split('\n').filter((line) => line.trim().length > 0),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Canonical URL & Image Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    कैनोनिकल URL (Canonical URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://khabridost.com/..."
                    value={formData.canonicalUrl || ''}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    मुख्य फ़ोटो ऑल्ट टेक्स्ट (Image Alt Text)
                  </label>
                  <input
                    type="text"
                    placeholder="चित्र का वर्णनात्मक ऑल्ट टेक्स्ट..."
                    value={formData.imageAltText || ''}
                    onChange={(e) => setFormData({ ...formData, imageAltText: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Snippet Simulation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Google Search परिणाम पूर्वावलोकन (Live SERP Preview):
                </span>
                <div className="text-xs text-blue-400 font-medium line-clamp-1 hover:underline cursor-pointer">
                  {formData.seoTitle || formData.title || 'खबरी दोस्त • मुख्य समाचार'}
                </div>
                <div className="text-[11px] text-emerald-500 font-mono">
                  https://khabridost.com/{formData.category}/{formData.id || 'new-story'}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {formData.seoDescription ||
                    formData.summary ||
                    'खबरी दोस्त हिंदी न्यूज़ पोर्टल पर पढ़ें देश, विदेश, खेल, व्यापार और राजनीति की ताज़ा ख़बरें।'}
                </div>
              </div>

              {/* WhatsApp & Social Media Share Card Simulation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  सोशल शेयरिंग कार्ड पूर्वावलोकन (WhatsApp, X / Twitter & Facebook Share Preview):
                </span>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-sm">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt={formData.imageAltText || formData.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">KHABRIDOST.COM</span>
                    <h5 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                      {formData.seoTitle || formData.title || 'ख़बर शीर्षक'}
                    </h5>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                      {formData.seoDescription || formData.summary || 'संक्षिप्त सार'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${formData.status === 'scheduled' ? 'bg-amber-400' : formData.status === 'draft' ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                <span>
                  स्थिति: <strong className="text-slate-200 capitalize">{formData.status}</strong>
                </span>
              </div>
              {autosaveStatus && (
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  • {autosaveStatus}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : formData.id ? 'Save Changes' : 'Publish Article Now'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* AI SEO ASSISTANT REVIEW & REFINE MODAL */}
        <AiSeoAssistantModal
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          currentTitle={formData.title}
          currentContent={formData.content}
          currentCategory={formData.category}
          apiConfig={apiConfig}
          onApplyToEditor={(draft: DraftedSeoArticle) => {
            setFormData((prev) => ({
              ...prev,
              title: draft.title,
              summary: draft.summary || draft.metaDescription,
              content: draft.content || prev.content,
              category: draft.category || prev.category,
              seoTitle: draft.title,
              seoDescription: draft.metaDescription || draft.summary,
              focusKeywords: draft.focusKeywords,
              tags: draft.tags && draft.tags.length > 0 ? draft.tags : prev.tags,
              highlights: draft.highlights || prev.highlights,
              urlSlug: draft.urlSlug || prev.urlSlug,
            }));
            setSeoSuccessToast('✓ AI SEO Assistant: Refined draft applied to editor!');
            setTimeout(() => setSeoSuccessToast(null), 4000);
          }}
        />
      </div>
  );

  if (inline) {
    return <div className="w-full animate-fadeIn">{editorContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {editorContent}
    </div>
  );
};
