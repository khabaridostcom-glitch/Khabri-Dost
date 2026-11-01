import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  Cpu,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  Send,
  ArrowRight,
  FileText,
  Tag,
  Globe,
  Flame,
  Zap,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { AiSeoConfig, NewsCategory, NewsArticle } from '../../types/news';
import { DEFAULT_AI_SEO_CONFIG } from '../../data/portalDefaults';
import { generateSeoArticleWithAi, AiSeoResult } from '../../utils/aiSeoGenerator';

interface AiSeoAssistantTabProps {
  settings?: AiSeoConfig;
  onUpdateSettings: (updated: AiSeoConfig) => void;
  onOpenArticleEditorWithData?: (data: Partial<NewsArticle>) => void;
}

export const AiSeoAssistantTab: React.FC<AiSeoAssistantTabProps> = ({
  settings,
  onUpdateSettings,
  onOpenArticleEditorWithData,
}) => {
  const current: AiSeoConfig = {
    ...DEFAULT_AI_SEO_CONFIG,
    ...(settings || {}),
  };

  const [rawText, setRawText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('national');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<AiSeoResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSaveConfig = (changes: Partial<AiSeoConfig>) => {
    onUpdateSettings({
      ...current,
      ...changes,
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setErrorMsg('कृपया प्रेस नोट, समाचार ड्राफ्ट या कच्ची जानकारी दर्ज करें।');
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const res = await generateSeoArticleWithAi(rawText, current, selectedCategory);
      setGeneratedResult(res);
    } catch (err: any) {
      setErrorMsg(err?.message || 'AI जनरेशन में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenInEditor = () => {
    if (!generatedResult || !onOpenArticleEditorWithData) return;
    onOpenArticleEditorWithData({
      title: generatedResult.title,
      urlSlug: generatedResult.slug,
      category: generatedResult.category,
      summary: generatedResult.summary,
      content: generatedResult.suggestedContent || rawText,
      seoTitle: generatedResult.title,
      seoDescription: generatedResult.seoDescription,
      focusKeywords: generatedResult.focusKeywords,
      highlights: generatedResult.keyHighlights,
      tags: generatedResult.tags,
      isTopStory: false,
      isBreaking: false,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-800">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              AI SEO Assistant & Press Note Converter
            </h2>
            <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
              SMART NEWSROOM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Integrate Gemini, OpenAI (ChatGPT), or Anthropic Claude API keys. Paste raw press notes or bulletins to automatically generate Google News-optimized Hindi titles, English slugs, meta descriptions, highlights, and tags.
          </p>
        </div>
      </div>

      {/* 2. API KEYS & PROVIDER CONFIGURATION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900">
              AI Engine & API Key Configuration
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
            ✓ Built-in Gemini Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">AI Provider Model:</label>
            <select
              value={current.provider || 'gemini'}
              onChange={(e) => handleSaveConfig({ provider: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="gemini">Google Gemini 3.8 Flash (Official @google/genai)</option>
              <option value="openai">OpenAI (ChatGPT / GPT-4o-mini)</option>
              <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet)</option>
              <option value="custom">Custom Enterprise LLM API Endpoint</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">API Secret Key:</label>
            <input
              type="password"
              value={current.apiKey || ''}
              onChange={(e) => handleSaveConfig({ apiKey: e.target.value })}
              placeholder="Paste Gemini / OpenAI / Claude API Key..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Leave blank to use default built-in AI Studios proxy.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Editorial Writing Tone:</label>
            <select
              value={current.defaultTone || 'journalistic'}
              onChange={(e) => handleSaveConfig({ defaultTone: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="journalistic">पत्रकारिता (Neutral & Fact-Driven)</option>
              <option value="breaking">ताज़ा ब्रेकिंग (Urgent & Impactful)</option>
              <option value="analytical">विश्लेषणात्मक (Deep Explainer)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={current.autoSlugEnabled !== false}
                onChange={(e) => handleSaveConfig({ autoSlugEnabled: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-red-600 accent-red-600"
              />
              <span className="font-semibold text-slate-700">Auto-Generate English URL Slugs</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={current.autoKeywordsEnabled !== false}
                onChange={(e) => handleSaveConfig({ autoKeywordsEnabled: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-red-600 accent-red-600"
              />
              <span className="font-semibold text-slate-700">Auto-Extract Focus Keywords & Tags</span>
            </label>
          </div>

          <span className="text-[11px] text-slate-500">
            Powered by modern SEO Newsroom Intelligence
          </span>
        </div>
      </div>

      {/* 3. PRESS NOTE TO COMPLETE SEO ARTICLE GENERATOR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Press Release & Raw Notes to SEO Article Generator
            </h3>
          </div>
          <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
            1-Click Conversion
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <label className="font-bold text-slate-700">
                प्रेस नोट / कच्ची जानकारी या समाचार सारांश यहाँ पेस्ट करें:
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-500">श्रेणी चुनें:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as NewsCategory)}
                  className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-800 text-[11px]"
                >
                  <option value="national">देश / राष्ट्रीय</option>
                  <option value="politics">राजनीति</option>
                  <option value="business">व्यापार व बाज़ार</option>
                  <option value="sports">खेल</option>
                  <option value="tech">टेक</option>
                  <option value="entertainment">मनोरंजन</option>
                  <option value="state">राज्य व शहर</option>
                </select>
              </div>
            </div>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="यहाँ कोई भी सरकारी विज्ञप्ति, एजेंसी प्रेस नोट, पीटीआई बुलेटिन या कच्ची ख़बर पेस्ट करें..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-kd-body"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-slate-500">
              {rawText.length > 0 ? `${rawText.length} वर्ण दर्ज किए गए` : 'कच्ची जानकारी से पूर्ण SEO मेटाडाटा जनरेट होगा'}
            </span>

            <button
              type="submit"
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AI जनरेट कर रहा है...' : '✨ Generate SEO Article with AI'}</span>
            </button>
          </div>
        </form>

        {/* 4. GENERATED RESULT PREVIEW CARD */}
        {generatedResult && (
          <div className="mt-5 p-5 bg-gradient-to-br from-slate-50 to-red-50/20 border border-slate-300 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm sm:text-base text-slate-900">
                  AI Generated Article Package Ready
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-300">
                  SEO Score: {generatedResult.seoScore}/100
                </span>
                <button
                  type="button"
                  onClick={handleOpenInEditor}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Generated Headline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">SEO Headline / शीर्षक:</span>
                <button
                  onClick={() => handleCopy('title', generatedResult.title)}
                  className="text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold font-kd-headline text-base text-slate-900">
                {generatedResult.title}
              </div>
            </div>

            {/* URL Slug & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-700">Google Slug (URL):</span>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 truncate">
                  /news/{generatedResult.slug}
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-700">Category (श्रेणी):</span>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 capitalize">
                  {generatedResult.category}
                </div>
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Google Snippet Meta Description ({generatedResult.seoDescription.length} chars):
                </span>
                <button
                  onClick={() => handleCopy('desc', generatedResult.seoDescription)}
                  className="text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-kd-body">
                {generatedResult.seoDescription}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700">3 Key Bullet Highlights (मुख्य बिंदु):</span>
              <ul className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                {generatedResult.keyHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-800">
                    <span className="text-red-600 font-bold shrink-0">●</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags & Keywords */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="font-bold text-slate-700 mr-1">Trending Tags:</span>
              {generatedResult.tags.map((tg, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-md font-semibold text-[11px]"
                >
                  {tg}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
