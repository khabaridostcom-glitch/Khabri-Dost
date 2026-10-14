import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Radio,
  Clock,
  Sparkles,
  Flame,
  Share2,
  RefreshCw,
  Tag,
  CheckCircle2,
  Bell,
  BellOff,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Send,
  Eye,
  Sliders,
} from 'lucide-react';
import { LiveBlogEvent, NewsArticle, PortalSettings } from '../types/news';

interface LiveFeedPageViewProps {
  liveBlog: LiveBlogEvent;
  allLiveBlogs: LiveBlogEvent[];
  onSelectLiveBlog: (blog: LiveBlogEvent) => void;
  onBackToHome: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  articles: NewsArticle[];
  fontSize: 'normal' | 'large' | 'xlarge' | 'extra_large';
  portalSettings: PortalSettings;
  onOpenAdminSettings?: () => void;
}

export const LiveFeedPageView: React.FC<LiveFeedPageViewProps> = ({
  liveBlog,
  allLiveBlogs,
  onSelectLiveBlog,
  onBackToHome,
  onSelectArticle,
  articles,
  fontSize,
  portalSettings,
  onOpenAdminSettings,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [onlyImportant, setOnlyImportant] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpdateId, setCopiedUpdateId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [viewerCount, setViewerCount] = useState(14820);
  const [reactions, setReactions] = useState<Record<string, number>>({});

  // Dynamic font size classes
  const fontClassesMap = {
    normal: {
      headline: 'text-2xl sm:text-3xl lg:text-4xl',
      updateTitle: 'text-base sm:text-lg',
      body: 'text-sm sm:text-base leading-relaxed',
    },
    large: {
      headline: 'text-3xl sm:text-4xl lg:text-5xl',
      updateTitle: 'text-lg sm:text-xl',
      body: 'text-base sm:text-lg leading-relaxed',
    },
    xlarge: {
      headline: 'text-4xl sm:text-5xl lg:text-6xl',
      updateTitle: 'text-xl sm:text-2xl',
      body: 'text-lg sm:text-xl leading-relaxed',
    },
    extra_large: {
      headline: 'text-4xl sm:text-5xl lg:text-6xl',
      updateTitle: 'text-xl sm:text-2xl',
      body: 'text-lg sm:text-xl leading-relaxed',
    },
  };
  const fontClasses = fontClassesMap[fontSize as keyof typeof fontClassesMap] || fontClassesMap.normal;

  // Viewer count gentle random fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 15) - 7);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 30s auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30; // resets
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const allTags = Array.from(
    new Set(liveBlog.updates.map((u) => u.tag).filter(Boolean) as string[])
  );

  const filteredUpdates = liveBlog.updates.filter((u) => {
    const matchesTag = filterTag === 'all' || u.tag === filterTag;
    const matchesImportant = !onlyImportant || u.isImportant;
    return matchesTag && matchesImportant;
  });

  const importantCount = liveBlog.updates.filter((u) => u.isImportant).length;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareUpdate = (updateId: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - Live Coverage: ${window.location.href}#update-${updateId}`);
      setCopiedUpdateId(updateId);
      setTimeout(() => setCopiedUpdateId(null), 2000);
    }
  };

  const handleReaction = (updateId: string) => {
    setReactions((prev) => ({
      ...prev,
      [updateId]: (prev[updateId] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans animate-fadeIn">
      {/* Sticky Navigation & Live Meta Bar */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onBackToHome}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition cursor-pointer shrink-0 border border-white/15"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-1 text-slate-400 truncate">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-red-400 font-semibold">Live Coverage</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white truncate max-w-xs">{liveBlog.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Live Indicator */}
            <div className="flex items-center space-x-1.5 bg-red-600/90 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>LIVE</span>
            </div>

            {/* Viewer Count */}
            <div className="hidden md:flex items-center space-x-1 text-slate-300 text-[11px] font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{viewerCount.toLocaleString()} Viewers</span>
            </div>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5 border transition cursor-pointer ${
                autoRefresh
                  ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="30-second live auto-refresh"
            >
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {autoRefresh ? `${countdown}s` : 'Paused'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-950/80 border-amber-600/60 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'Alert Sound ON' : 'Alert Sound OFF'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: The Live Feed Coverage Body */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Hero Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-red-900/40 relative overflow-hidden">
              <div className="relative z-10 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase rounded-full flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>{liveBlog.isLive ? '🔴 LIVE UPDATES' : 'LIVE COVERAGE'}</span>
                  </span>

                  <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {liveBlog.category.toUpperCase()} • 2026
                  </span>

                  <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Last Updated:{' '}
                      <strong className="text-white">
                        {new Date(liveBlog.lastUpdatedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </strong>
                    </span>
                  </span>
                </div>

                <h1 className={`font-black font-kd-headline text-white leading-tight ${fontClasses.headline}`}>
                  {liveBlog.title}
                </h1>

                <p className={`text-slate-300 font-kd-body ${fontClasses.body}`}>
                  {liveBlog.summary}
                </p>

                {/* Social Share Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs text-slate-300">
                    <span>Total <strong className="text-white">{liveBlog.updates.length}</strong> Updates</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{importantCount} Key Highlights</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">Share:</span>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(liveBlog.title + ' - ' + window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(liveBlog.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition border border-slate-700"
                    >
                      <span>X</span>
                    </a>
                    <button
                      onClick={handleShare}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition border border-slate-700 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Highlights Card */}
            {liveBlog.keyHighlights && liveBlog.keyHighlights.length > 0 && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>KEY HIGHLIGHTS:</span>
                </div>
                <ul className="text-xs sm:text-sm text-amber-950 space-y-1.5 pl-5 list-disc font-medium leading-relaxed">
                  {liveBlog.keyHighlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filters & Timeline Navigation Controls */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                <button
                  onClick={() => {
                    setFilterTag('all');
                    setOnlyImportant(false);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    filterTag === 'all' && !onlyImportant
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Updates ({liveBlog.updates.length})
                </button>

                <button
                  onClick={() => setOnlyImportant(!onlyImportant)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                    onlyImportant
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <Flame className="w-3 h-3 text-red-500" />
                  <span>⚡ Key Highlights ({importantCount})</span>
                </button>

                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilterTag(tag);
                      setOnlyImportant(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      filterTag === tag
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Showing: <strong>{filteredUpdates.length}</strong> Updates
              </div>
            </div>

            {/* LIVE UPDATES TIMELINE STREAM */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-red-600 before:via-slate-300 before:to-slate-200">
              {filteredUpdates.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">No updates found for this filter.</p>
                  <button
                    onClick={() => {
                      setFilterTag('all');
                      setOnlyImportant(false);
                    }}
                    className="text-xs text-red-600 font-bold underline cursor-pointer"
                  >
                    View All Updates
                  </button>
                </div>
              ) : (
                filteredUpdates.map((update, index) => {
                  const isLatest = index === 0;
                  return (
                    <article
                      key={update.id}
                      id={`update-${update.id}`}
                      className={`relative bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs transition hover:shadow-md ${
                        update.isImportant
                          ? 'border-red-300 ring-1 ring-red-100'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Timeline Dot Indicator */}
                      <span
                        className={`absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          isLatest
                            ? 'bg-red-600 ring-4 ring-red-100'
                            : update.isImportant
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />

                      {/* Header of each update */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                            {update.timestamp}
                          </span>

                          {update.isImportant && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-red-600" />
                              <span>Key Update</span>
                            </span>
                          )}

                          {update.tag && (
                            <span className="text-[11px] text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2 py-0.2 rounded">
                              #{update.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <button
                            onClick={() => handleShareUpdate(update.id, update.title)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                            title="Copy link to this update"
                          >
                            {copiedUpdateId === update.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Update Headline */}
                      <h2 className={`font-bold font-kd-headline text-slate-900 leading-snug mb-2 ${fontClasses.updateTitle}`}>
                        {update.title}
                      </h2>

                      {/* Update Body */}
                      <div className={`text-slate-700 font-kd-body space-y-2 ${fontClasses.body}`}>
                        {update.content.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>

                      {/* Byline & Reactions Footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="italic font-medium text-slate-600">
                          — {update.authorName || 'Live News Desk'}
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReaction(update.id)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition cursor-pointer text-xs font-semibold"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful</span>
                            {reactions[update.id] && (
                              <span className="font-mono text-red-600">({reactions[update.id]})</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT 4 COLS: Editorial Sidebar & Broadcast Studio */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Other Active Live Coverages Switcher */}
            {allLiveBlogs.length > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-red-600" />
                  <span>Other Live Events:</span>
                </div>
                <div className="space-y-2">
                  {allLiveBlogs
                    .filter((b) => b.id !== liveBlog.id)
                    .map((otherBlog) => (
                      <div
                        key={otherBlog.id}
                        onClick={() => onSelectLiveBlog(otherBlog)}
                        className="p-3 rounded-xl border border-slate-100 hover:border-red-300 hover:bg-red-50/50 cursor-pointer transition space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-red-600 uppercase">
                            {otherBlog.category}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {otherBlog.updates.length} Updates
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {otherBlog.title}
                        </h4>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 2. Live Broadcast Mini Player (if configured) */}
            {portalSettings.liveVideoSectionEnabled && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 text-white space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-red-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                    <span>24x7 Digital Studio Live Broadcast</span>
                  </span>
                  <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded font-black font-mono">
                    LIVE
                  </span>
                </div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${portalSettings.liveVideoYoutubeId || 'jfKfPfyJRdk'}?autoplay=0&rel=0`}
                    title="Live Video Broadcast"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {portalSettings.liveVideoTitle || 'Khabri Dost Digital Studio • Live Stream'}
                </p>
              </div>
            )}

            {/* 3. Official Channels CTA - High-Contrast & Compact */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2.5 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>आधिकारिक चैनल्स (Instant Updates)</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/30">
                  FREE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* WhatsApp */}
                <a
                  href={portalSettings.headerFooter?.socialLinks.whatsappChannel || 'https://whatsapp.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2 rounded-xl bg-[#075E54] hover:bg-[#128C7E] active:scale-98 text-white transition-all shadow-2xs border border-emerald-600/40 cursor-pointer overflow-hidden"
                  title="WhatsApp चैनल जॉइन करें"
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-emerald-400/25 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="text-[11px] font-black truncate">WhatsApp</div>
                      <div className="text-[9px] text-emerald-200 truncate">लाइव अलर्ट्स</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black bg-white text-emerald-950 px-1 py-0.5 rounded ml-1 shrink-0">
                    ➔
                  </span>
                </a>

                {/* Telegram */}
                <a
                  href={portalSettings.headerFooter?.socialLinks.telegramChannel || 'https://t.me/example'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2 rounded-xl bg-[#0077b5] hover:bg-[#0088cc] active:scale-98 text-white transition-all shadow-2xs border border-sky-400/40 cursor-pointer overflow-hidden"
                  title="Telegram चैनल से जुड़ें"
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-sky-300/25 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="text-[11px] font-black truncate">Telegram</div>
                      <div className="text-[9px] text-sky-200 truncate">फास्ट बुलेटिन</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black bg-white text-sky-950 px-1 py-0.5 rounded ml-1 shrink-0">
                    ➔
                  </span>
                </a>
              </div>
            </div>

            {/* 4. Latest Breaking Articles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Trending Headlines</span>
                </span>
                <span className="text-[10px] text-slate-400">Top 4</span>
              </div>

              <div className="space-y-3">
                {articles.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="flex space-x-3 group cursor-pointer"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0 group-hover:opacity-90"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {art.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-red-600 leading-snug">
                        {art.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Editorial Integrity Box */}
            <div className="bg-slate-100/80 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Editorial Policy</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All updates on Khabri Dost are verified by our editorial live desk before publication.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
