import React, { useState } from 'react';
import {
  X,
  Radio,
  Clock,
  Sparkles,
  Flame,
  Share2,
  RefreshCw,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { LiveBlogEvent } from '../types/news';

interface LiveBlogReaderModalProps {
  blog: LiveBlogEvent;
  onClose: () => void;
}

export const LiveBlogReaderModal: React.FC<LiveBlogReaderModalProps> = ({
  blog,
  onClose,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const tags = Array.from(
    new Set(blog.updates.map((u) => u.tag).filter(Boolean) as string[])
  );

  const filteredUpdates =
    filterTag === 'all'
      ? blog.updates
      : blog.updates.filter((u) => u.tag === filterTag);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none">
            <img
              src={blog.coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 relative z-10 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>{blog.isLive ? '🔴 लाइव अपडेट्स (LIVE UPDATES)' : 'लाइव कवरेज'}</span>
              </span>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {blog.category.toUpperCase()} 2026
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold font-kd-headline text-white leading-tight">
              {blog.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-kd-body line-clamp-2">
              {blog.summary}
            </p>

            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
              <span>कुल अपडेट्स: <strong className="text-white">{blog.updates.length}</strong></span>
              <span>•</span>
              <span>
                अंतिम अपडेट:{' '}
                <strong className="text-white">
                  {new Date(blog.lastUpdatedAt).toLocaleTimeString('hi-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="शेयर करें"
            >
              {copiedLink ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Highlights Banner */}
        {blog.keyHighlights && blog.keyHighlights.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 sm:px-6 py-3 shrink-0">
            <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>मुख्य बिंदु (Key Highlights):</span>
            </div>
            <ul className="text-xs text-amber-950 space-y-1 pl-4 list-disc font-medium">
              {blog.keyHighlights.map((hl, i) => (
                <li key={i}>{hl}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Filter Tags Bar */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <button
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                filterTag === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              सभी ({blog.updates.length})
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  filterTag === t
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ऑटो-अपडेट सक्रिय</span>
          </span>
        </div>

        {/* Scrollable Updates Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {filteredUpdates.map((up) => (
            <div
              key={up.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs relative pl-12 sm:pl-16 transition ${
                up.isImportant
                  ? 'border-red-300 ring-1 ring-red-400/20 bg-red-50/15'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Left Timeline marker */}
              <div className="absolute left-3.5 sm:left-4 top-4.5 flex flex-col items-center">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <div className="w-0.5 h-full bg-red-200 mt-2"></div>
              </div>

              {/* Time & Badge */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                  {up.timestamp}
                </span>
                {up.tag && (
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                    {up.tag}
                  </span>
                )}
                {up.isImportant && (
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                    <Flame className="w-3 h-3" />
                    <span>बड़ी ख़बर</span>
                  </span>
                )}
              </div>

              {/* Headline */}
              <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900 leading-snug">
                {up.title}
              </h3>

              {/* Content */}
              <p className="text-xs sm:text-sm text-slate-700 font-kd-body leading-relaxed mt-2 whitespace-pre-line text-justify">
                {up.content}
              </p>

              {/* Byline */}
              {up.authorName && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-kd-meta">
                  <span>रिपोर्ट: {up.authorName}</span>
                  <span>खबरी दोस्त लाइव डेस्क</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
