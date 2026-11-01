import React, { useState, useEffect } from 'react';
import {
  Zap,
  X,
  Clock,
  Sparkles,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  RotateCw,
} from 'lucide-react';
import { NewsArticle } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';

interface QuickReadData {
  bullets: string[];
  readingTime: string;
  oneLineTakeaway: string;
  poweredBy: string;
}

interface QuickReadSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  onSelectFullArticle: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: NewsArticle) => void;
}

export const QuickReadSlidePanel: React.FC<QuickReadSlidePanelProps> = ({
  isOpen,
  onClose,
  article,
  onSelectFullArticle,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuickReadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Cache summaries in memory per session
  const [cache, setCache] = useState<Record<string, QuickReadData>>({});

  useEffect(() => {
    if (!isOpen || !article) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    // Check cache first
    if (cache[article.id]) {
      setData(cache[article.id]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setData(null);

    const fetchQuickRead = async () => {
      try {
        const response = await fetch('/api/ai/quick-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: article.id,
            title: article.title,
            content: article.content || article.summary,
            summary: article.summary,
            category: article.category,
          }),
        });

        if (!response.ok) {
          throw new Error('त्वरित सार लोड करने में समस्या हुई।');
        }

        const resData = await response.json();
        if (isMounted) {
          const quickData: QuickReadData = {
            bullets: resData.bullets || [
              `1. ${article.title}: मुख्य घटनाक्रम।`,
              `2. ${article.summary}`,
              `3. विस्तृत जानकारी के लिए पूरी खबर पढ़ें।`,
            ],
            readingTime: resData.readingTime || '15 सेकंड',
            oneLineTakeaway: resData.oneLineTakeaway || article.summary,
            poweredBy: resData.poweredBy || 'Gemini 3.8 Flash',
          };
          setData(quickData);
          setCache((prev) => ({ ...prev, [article.id]: quickData }));
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('QuickRead API error:', err);
          // Fallback to local extraction
          const fallbackData: QuickReadData = {
            bullets: [
              `1. ${article.title}`,
              `2. ${article.summary || 'इस खबर पर ताज़ा अपडेट जारी है।'}`,
              `3. खबरी दोस्त संपादकीय टीम द्वारा निरंतर निगरानी रखी जा रही है।`,
            ],
            readingTime: '15 सेकंड',
            oneLineTakeaway: `${article.title}: मुख्य बिंदु।`,
            poweredBy: 'Editorial QuickDesk',
          };
          setData(fallbackData);
          setLoading(false);
        }
      }
    };

    fetchQuickRead();

    return () => {
      isMounted = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, article?.id]);

  if (!isOpen || !article) return null;

  // Audio Playback in Hindi
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!data) return;

    window.speechSynthesis.cancel();
    const textToSpeak = `${article.title}. मुख्य 3 बातें: ${data.bullets.join('. ')}. निष्कर्ष: ${data.oneLineTakeaway}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    // Find a Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // WhatsApp / Social Share
  const handleShareSummary = () => {
    const summaryText = `⚡ *${article.title}*\n\n📌 *3 बड़ी बातें (Quick Read):*\n${(data?.bullets || []).join('\n')}\n\n🌐 खबरी दोस्त पर पूरी खबर पढ़ें: ${window.location.origin}`;

    if (navigator.share) {
      navigator
        .share({
          title: `⚡ त्वरित सार: ${article.title}`,
          text: summaryText,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      {/* Slide Container: Bottom sheet on mobile, right drawer on desktop */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-md max-h-[90vh] sm:max-h-full flex flex-col bg-white rounded-t-3xl sm:rounded-none shadow-2xl border-t sm:border-t-0 sm:border-l border-slate-200 z-50 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 ease-out font-sans">
        {/* Mobile Drag Pill */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50/70 via-amber-50/40 to-white shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-red-700 uppercase tracking-wider font-mono">
                  त्वरित सार • Quick Read
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>AI Powered</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                3 मुख्य बातें • 15 सेकंड में समझें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Article Context Header */}
          <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
              alt={article.title}
              className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover shrink-0 shadow-2xs border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1 font-kd-meta">
                <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                  {article.category}
                </span>
                <span>•</span>
                <span>{formatHindiTimeAgo(article.createdAt)}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </div>
          </div>

          {/* Reading Time & Audio Bar */}
          <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/70 px-3.5 py-2 rounded-xl text-xs text-amber-950 font-kd-meta">
            <span className="flex items-center space-x-1.5 font-semibold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>पढ़ने का समय: 15 सेकंड</span>
            </span>

            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title="ऑडियो सुनें"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>ऑडियो रोकें</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>ऑडियो सुनें</span>
                </>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-3 py-2 animate-pulse">
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <RotateCw className="w-4 h-4 text-red-600 animate-spin" />
                <span>जेमिनी एआई द्वारा 3 मुख्य बिंदु तैयार किए जा रहे हैं...</span>
              </div>
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {/* 3 Crisp Bullets Display */}
          {!loading && data && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>खबर की 3 सबसे बड़ी बातें:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {data.poweredBy}
                </span>
              </div>

              {data.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-red-300 transition duration-200 flex items-start space-x-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-xs sm:text-[13px] leading-relaxed text-slate-800 font-kd-body">
                    {bullet.replace(/^[0-9]+[.\-]\s*/, '')}
                  </div>
                </div>
              ))}

              {/* One line takeaway */}
              {data.oneLineTakeaway && (
                <div className="bg-gradient-to-r from-red-50/60 to-amber-50/60 p-3 rounded-xl border border-red-200/70 text-xs text-slate-800 font-kd-meta space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
                    मुख्य निष्कर्ष (Bottom Line)
                  </span>
                  <p className="font-semibold text-slate-900 leading-snug">
                    {data.oneLineTakeaway}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareSummary}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedNotice ? 'कॉपी हो गया ✓' : 'शेयर करें'}</span>
            </button>

            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(article)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer border ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isBookmarked ? 'सहेजा गया' : 'बुकमार्क'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onSelectFullArticle(article);
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>पूरी खबर विस्तार से पढ़ें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
