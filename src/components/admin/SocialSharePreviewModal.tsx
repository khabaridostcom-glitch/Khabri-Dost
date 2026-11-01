import React, { useState } from 'react';
import {
  X,
  Share2,
  ExternalLink,
  Smartphone,
  Globe,
  Check,
  Copy,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { NewsArticle } from '../../types/news';

interface SocialSharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
}

/**
 * SocialSharePreviewModal
 * Real-time OpenGraph & Social Media Card Visual Simulator.
 * Simulates WhatsApp, X (Twitter), Facebook, and Telegram previews for editorial validation.
 */
export const SocialSharePreviewModal: React.FC<SocialSharePreviewModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const [activePlatform, setActivePlatform] = useState<'whatsapp' | 'twitter' | 'facebook' | 'telegram'>('whatsapp');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !article) return null;

  const articleUrl = `https://khabridost.com/${article.category}/${article.id}`;
  const displayTitle = article.seoTitle || article.title;
  const displayDescription = article.seoDescription || article.summary;
  const displayImage = article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-kd-meta">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-50 text-slate-900 p-4 sm:p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900 leading-tight">
                Social Media Share Card Previewer
              </h3>
              <p className="text-[11px] text-slate-500">
                Inspect OpenGraph cards across WhatsApp, X (Twitter), Facebook & Telegram before sharing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
            title="Close Previewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setActivePlatform('whatsapp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePlatform === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('twitter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePlatform === 'twitter'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
            >
              X / Twitter
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('facebook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePlatform === 'facebook'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('telegram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePlatform === 'telegram'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
            >
              Telegram
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center space-x-1 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Public URL'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/70">
          {/* Metadata Character Count Status */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">SEO Title Length</span>
              <span className="font-bold text-slate-900">{displayTitle.length} characters</span>
              <span className="text-[10px] text-slate-400 block">Optimal: 50–65 characters</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Meta Description Length</span>
              <span className="font-bold text-slate-900">{displayDescription.length} characters</span>
              <span className="text-[10px] text-slate-400 block">Optimal: 120–160 characters</span>
            </div>
          </div>

          {/* SIMULATOR 1: WHATSAPP */}
          {activePlatform === 'whatsapp' && (
            <div className="max-w-md mx-auto bg-[#e5ddd5] p-4 rounded-2xl shadow-inner space-y-2">
              <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-slate-200 max-w-[340px] ml-auto">
                <img src={displayImage} alt="" className="w-full aspect-[16/9] object-cover" />
                <div className="p-3 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
                    KHABRIDOST.COM
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {displayTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {displayDescription}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block text-right mr-1">10:42 AM ✓✓</span>
            </div>
          )}

          {/* SIMULATOR 2: X / TWITTER */}
          {activePlatform === 'twitter' && (
            <div className="max-w-md mx-auto bg-black text-white p-4 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center space-x-2 text-xs text-zinc-400">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">
                  KD
                </div>
                <div>
                  <span className="font-bold text-white block">Khabri Dost News</span>
                  <span className="text-[11px]">@khabridost • 5m</span>
                </div>
              </div>

              <p className="text-xs text-zinc-200 leading-normal">
                {displayTitle} 👇 Read the full report: {articleUrl}
              </p>

              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/70">
                <img src={displayImage} alt="" className="w-full aspect-[2/1] object-cover" />
                <div className="p-3">
                  <span className="text-[11px] text-zinc-400 block font-mono">khabridost.com</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{displayTitle}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{displayDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 3: FACEBOOK */}
          {activePlatform === 'facebook' && (
            <div className="max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                  KD
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Khabri Dost</span>
                  <span className="text-[10px] text-slate-400 block">Just now • 🌐 Public</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={displayImage} alt="" className="w-full aspect-[1.91/1] object-cover" />
                <div className="p-3 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">KHABRIDOST.COM</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{displayTitle}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{displayDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 4: TELEGRAM */}
          {activePlatform === 'telegram' && (
            <div className="max-w-md mx-auto bg-[#0e1621] text-white p-4 rounded-2xl shadow-lg space-y-2">
              <div className="bg-[#182533] p-3 rounded-xl border border-sky-500/40 space-y-2 border-l-4 border-l-sky-400">
                <span className="text-[11px] font-bold text-sky-400 block font-mono">Khabri Dost</span>
                <h4 className="text-xs font-bold text-white line-clamp-2">{displayTitle}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">{displayDescription}</p>
                <img src={displayImage} alt="" className="w-full aspect-video rounded-lg object-cover" />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">10:45 AM</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            OpenGraph meta tags conform to Facebook & Twitter Cards protocol.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg font-bold cursor-pointer transition shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
