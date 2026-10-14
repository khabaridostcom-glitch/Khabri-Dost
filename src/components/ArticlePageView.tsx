import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Send,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Newspaper,
  ExternalLink,
  Link2,
  Sliders,
  Mail,
  UserCheck,
  HelpCircle,
  CheckCircle2,
  Radio,
  Layout,
  Type,
  PenTool,
  Flame,
  Download,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
} from 'lucide-react';
import { NewsArticle, NewsComment, PortalSettings, ReactionType, ArticleReactions } from '../types/news';
import { getAuthorPhoto, CATEGORIES } from '../data/seedNews';
import {
  DEFAULT_ARTICLE_META_SETTINGS,
  DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  DEFAULT_SIDEBAR_ADS_CONFIG,
  FONT_OPTIONS,
} from '../data/portalDefaults';
import { ArticleEPaperClippingModal } from './ArticleEPaperClippingModal';
import { generateArticlePdf } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import {
  fetchComments,
  postComment,
  likeArticle,
  incrementArticleViews,
  updateArticleReaction,
  updateArticle,
} from '../services/newsService';
import { formatHindiTimeAgo, speakHindiText, stopHindiSpeech } from '../utils/hindiHelpers';
import { renderArticleBlock } from '../utils/articleContentParser';
import { AdBanner } from './AdBanner';
import { ArticleCard } from './ArticleCard';
import { OpinionPollWidget } from './OpinionPollWidget';
import { GoldRateWidget } from './widgets/GoldRateWidget';
import { RashifalWidget } from './widgets/RashifalWidget';
import { SudokuGameWidget } from './widgets/SudokuGameWidget';
import { AudioNewsPlayer } from './AudioNewsPlayer';
import { ArticleKeyHighlights } from './ArticleKeyHighlights';

export const getEnglishArticleSlug = (art: NewsArticle): string => {
  if (art.urlSlug && art.urlSlug.trim()) {
    return art.urlSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  }
  const engWords = (art.title + ' ' + (art.tags || []).join(' ')).match(/[a-zA-Z0-9]+/g);
  if (engWords && engWords.length >= 2) {
    return engWords.slice(0, 5).join('-').toLowerCase();
  }
  const cleanId = art.id.replace(/[^a-zA-Z0-9]/g, '');
  return `${art.category || 'news'}-${cleanId}`;
};

interface ArticlePageViewProps {
  article: NewsArticle;
  onBackToHome: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  allArticles: NewsArticle[];
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  portalSettings: PortalSettings;
  onOpenAdminSettings?: (tab?: any) => void;
  onUpdateSettings?: (settings: PortalSettings) => void;
  onOpenEPaper?: () => void;
  onEditArticle?: (article: NewsArticle) => void;
  onOpenTypography?: () => void;
  onOpenSudokuModal?: () => void;
}

export const ArticlePageView: React.FC<ArticlePageViewProps> = ({
  article,
  onBackToHome,
  onSelectArticle,
  allArticles,
  isBookmarked,
  onToggleBookmark,
  fontSize,
  portalSettings,
  onOpenAdminSettings,
  onUpdateSettings,
  onOpenEPaper,
  onEditArticle,
  onOpenTypography,
  onOpenSudokuModal,
}) => {
  const { user, signInWithGoogle, isAdmin } = useAuth();
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likes, setLikes] = useState(article.likesCount);
  const [hasLiked, setHasLiked] = useState(false);

  // EMOJI REACTIONS (Like, Love, Insightful, Funny)
  const [reactions, setReactions] = useState<ArticleReactions>(() => ({
    like: article.reactions?.like ?? (article.likesCount || 0),
    love: article.reactions?.love ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.14)),
    insightful: article.reactions?.insightful ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.09)),
    funny: article.reactions?.funny ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.05)),
  }));

  const [userReaction, setUserReaction] = useState<ReactionType | null>(() => {
    try {
      const stored = localStorage.getItem(`kd_reaction_${article.id}`);
      return (stored as ReactionType) || null;
    } catch {
      return null;
    }
  });

  const [reactionBurst, setReactionBurst] = useState<ReactionType | null>(null);

  // Sync reactions when article changes
  useEffect(() => {
    const nextReactions: ArticleReactions = {
      like: article.reactions?.like ?? (article.likesCount || 0),
      love: article.reactions?.love ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.14)),
      insightful: article.reactions?.insightful ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.09)),
      funny: article.reactions?.funny ?? Math.max(0, Math.floor((article.viewsCount || 8) * 0.05)),
    };
    setReactions(nextReactions);
    setLikes(nextReactions.like);
    try {
      const stored = localStorage.getItem(`kd_reaction_${article.id}`);
      const r = (stored as ReactionType) || null;
      setUserReaction(r);
      setHasLiked(r === 'like');
    } catch {
      setUserReaction(null);
      setHasLiked(false);
    }
  }, [article.id, article.reactions, article.likesCount, article.viewsCount]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showClippingModal, setShowClippingModal] = useState(false);

  // Admin-configurable Related Articles count (admin can choose 3, 4, 6 or more)
  const [adminRelatedCount, setAdminRelatedCount] = useState<number>(() => {
    return portalSettings.sidebarWidgets?.relatedArticlesCount || 4;
  });

  // Interactive Sidebar Slider Carousel state for single page content
  const [isSidebarSlider, setIsSidebarSlider] = useState<boolean>(() => {
    return portalSettings.sidebarWidgets?.sidebarSliderMode ?? false;
  });
  const [sidebarSlideIndex, setSidebarSlideIndex] = useState<number>(0);
  const [isSliderAutoplay, setIsSliderAutoplay] = useState<boolean>(true);
  const [isSliderHovered, setIsSliderHovered] = useState<boolean>(false);

  // Auto-play timer for sidebar slider carousel
  useEffect(() => {
    if (!isSidebarSlider || !isSliderAutoplay || isSliderHovered) return;
    const interval = setInterval(() => {
      setSidebarSlideIndex((prev) => (prev + 1) % 5);
    }, 5500);
    return () => clearInterval(interval);
  }, [isSidebarSlider, isSliderAutoplay, isSliderHovered]);

  // Newsletter & Poll state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [pollVoted, setPollVoted] = useState<'A' | 'B' | null>(null);
  const [pollPercentages, setPollPercentages] = useState<{ a: number; b: number }>({ a: 73, b: 27 });

  // Article PDF download state
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Dynamic Reader Typography Customizer State (Font-Size & Font-Family Dropdown)
  const [showTypographyDropdown, setShowTypographyDropdown] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kd_reader_font_size');
      if (saved) return Number(saved);
    } catch {}
    return portalSettings.typography?.articleBodyFontSizePx || 17;
  });
  const [readerFontFamily, setReaderFontFamily] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('kd_reader_font_family');
      if (saved) return saved;
    } catch {}
    return portalSettings.typography?.bodyFont || "'Mukta', sans-serif";
  });
  const [readerLineHeight, setReaderLineHeight] = useState<number>(() => {
    return portalSettings.typography?.articleBodyLineHeight || 1.75;
  });

  const handleUpdateReaderFontSize = (newSize: number) => {
    setReaderFontSize(newSize);
    try {
      localStorage.setItem('kd_reader_font_size', String(newSize));
    } catch {}
  };

  const handleUpdateReaderFontFamily = (newFont: string) => {
    setReaderFontFamily(newFont);
    try {
      localStorage.setItem('kd_reader_font_family', newFont);
    } catch {}
  };

  // Admin Headline Direct Inline Editor State (On-page immediate editing)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(article.title);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [titleSaveSuccess, setTitleSaveSuccess] = useState(false);

  useEffect(() => {
    setInlineTitle(article.title);
  }, [article.id, article.title]);

  const handleSaveInlineTitle = async () => {
    const trimmed = inlineTitle.trim();
    if (!trimmed) return;
    setIsSavingTitle(true);
    try {
      await updateArticle(article.id, { title: trimmed });
      article.title = trimmed;
      if (onEditArticle) {
        onEditArticle({ ...article, title: trimmed });
      }
      setTitleSaveSuccess(true);
      setTimeout(() => setTitleSaveSuccess(false), 2500);
      setIsEditingTitle(false);
    } catch (err) {
      console.warn('Updated title locally', err);
      article.title = trimmed;
      if (onEditArticle) {
        onEditArticle({ ...article, title: trimmed });
      }
      setIsEditingTitle(false);
      setTitleSaveSuccess(true);
      setTimeout(() => setTitleSaveSuccess(false), 2500);
    } finally {
      setIsSavingTitle(false);
    }
  };

  // Trending stories vertical slider state (smooth continuous bottom-to-top like homepage 3rd card)
  const [trendingSlideIndex, setTrendingSlideIndex] = useState(0);
  const [isTrendingHovered, setIsTrendingHovered] = useState(false);
  const [isTrendingPaused, setIsTrendingPaused] = useState(false);
  const trendingScrollRef = React.useRef<HTMLDivElement>(null);

  // Extract customizable article meta and action bar settings (configured by Admin)
  const metaSettings = {
    ...DEFAULT_ARTICLE_META_SETTINGS,
    ...(portalSettings.articleMetaSettings || {}),
    platforms: {
      ...DEFAULT_ARTICLE_META_SETTINGS.platforms,
      ...(portalSettings.articleMetaSettings?.platforms || {}),
    },
  };

  // Extract single page and sidebar widget settings (configured by Admin)
  const sidebarWidgets = {
    ...DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
    ...(portalSettings.sidebarWidgets || {}),
  };

  // Extract modular sidebar advertising configuration
  const sidebarAds = portalSettings.sidebarAdsConfig || DEFAULT_SIDEBAR_ADS_CONFIG;

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    incrementArticleViews(article.id, article.viewsCount);
    loadComments();
    return () => {
      stopHindiSpeech();
    };
  }, [article.id]);

  const loadComments = async () => {
    const list = await fetchComments(article.id);
    setComments(list);
  };

  const handleSpeechToggle = () => {
    setShowAudioPlayer((prev) => !prev);
  };

  const handleReaction = async (type: ReactionType) => {
    const prev = userReaction;
    const isTogglingOff = prev === type;
    const nextUserReaction = isTogglingOff ? null : type;

    // Optimistic local state update
    setUserReaction(nextUserReaction);
    try {
      if (nextUserReaction) {
        localStorage.setItem(`kd_reaction_${article.id}`, nextUserReaction);
      } else {
        localStorage.removeItem(`kd_reaction_${article.id}`);
      }
    } catch {
      // ignore storage error
    }

    // Trigger visual pop animation
    if (nextUserReaction) {
      setReactionBurst(nextUserReaction);
      setTimeout(() => setReactionBurst(null), 1200);
    }

    setReactions((current) => {
      const updated = { ...current };
      if (prev && prev !== type) {
        updated[prev] = Math.max(0, (updated[prev] || 0) - 1);
      }
      if (isTogglingOff) {
        updated[type] = Math.max(0, (updated[type] || 0) - 1);
      } else {
        updated[type] = (updated[type] || 0) + 1;
      }
      return updated;
    });

    if (type === 'like' || prev === 'like') {
      const nextLiked = !isTogglingOff && nextUserReaction === 'like';
      setHasLiked(nextLiked);
      setLikes((curr) => {
        if (type === 'like') {
          return isTogglingOff ? Math.max(0, curr - 1) : curr + 1;
        } else if (prev === 'like') {
          return Math.max(0, curr - 1);
        }
        return curr;
      });
    }

    await updateArticleReaction(article.id, type, reactions, prev);
  };

  const handleLike = async () => {
    await handleReaction('like');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in with Google to post a comment.');
      signInWithGoogle();
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const added = await postComment(
        article.id,
        newComment.trim(),
        {
          uid: user.uid,
          name: user.displayName || 'Reader',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined,
        }
      );
      setComments([added, ...comments]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const existing = localStorage.getItem('kd_subscribers');
      const list = existing ? JSON.parse(existing) : [];
      if (!list.some((s: any) => s.email?.toLowerCase() === newsletterEmail.trim().toLowerCase())) {
        list.push({
          id: `sub_${Date.now()}`,
          email: newsletterEmail.trim(),
          status: 'active',
          source: 'sidebar',
          subscribedAt: new Date().toISOString(),
        });
        localStorage.setItem('kd_subscribers', JSON.stringify(list));
      }
    } catch {}
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  const handleVotePoll = (option: 'A' | 'B') => {
    if (pollVoted) return;
    setPollVoted(option);
    if (option === 'A') {
      setPollPercentages({ a: 76, b: 24 });
    } else {
      setPollPercentages({ a: 71, b: 29 });
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://khabridost.com';
  const shareTitle = encodeURIComponent(`${article.title} - Khabri Dost`);
  const shareUrl = encodeURIComponent(currentUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.title,
          url: currentUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Font size multiplier
  const contentFontSizeClass = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-loose',
  }[fontSize];

  // Admin option changer for related articles count (3, 4, 6, etc.)
  const handleSetRelatedCount = (count: number) => {
    setAdminRelatedCount(count);
    if (onUpdateSettings) {
      onUpdateSettings({
        ...portalSettings,
        sidebarWidgets: {
          ...sidebarWidgets,
          relatedArticlesCount: count,
        },
      });
    }
  };

  // Strictly prioritize articles from the SAME CATEGORY as currently active article
  const sameCategoryArticles = allArticles.filter(
    (a) => a.id !== article.id && (a.category?.toLowerCase() === article.category?.toLowerCase())
  );
  // Graceful backfill from other articles if current category has fewer stories
  const otherCategoryArticles = allArticles.filter(
    (a) => a.id !== article.id && (a.category?.toLowerCase() !== article.category?.toLowerCase())
  );
  const relatedArticles = [
    ...sameCategoryArticles,
    ...otherCategoryArticles,
  ].slice(0, adminRelatedCount);

  const handleDownloadArticlePdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateArticlePdf(article, portalSettings);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Trending Sidebar articles filtered by admin category & count settings
  const trendingCategory = sidebarWidgets.trendingCategoryFilter || 'all';
  let filteredTrending = allArticles.filter((a) => a.id !== article.id);
  if (trendingCategory !== 'all') {
    filteredTrending = filteredTrending.filter(
      (a) => a.category?.trim().toLowerCase() === trendingCategory.trim().toLowerCase()
    );
  }
  filteredTrending.sort((a, b) => b.viewsCount - a.viewsCount);
  const trendingCount = sidebarWidgets.trendingStoriesCount || 5;
  const trendingSidebarArticles = (
    filteredTrending.length > 0 ? filteredTrending : allArticles.filter((a) => a.id !== article.id)
  ).slice(0, trendingCount);

  // Auto-slide timer for Trending Stories (Vertical bottom-to-top auto sliding)
  const isTrendingSliderEnabled = sidebarWidgets.trendingSliderEnabled !== false;
  const trendingSlideSpeed = sidebarWidgets.trendingSlideSpeed || 3500;

  useEffect(() => {
    if (!isTrendingSliderEnabled || isTrendingHovered || trendingSidebarArticles.length <= 1) return;
    const interval = setInterval(() => {
      setTrendingSlideIndex((prev) => (prev + 1) % trendingSidebarArticles.length);
    }, trendingSlideSpeed);
    return () => clearInterval(interval);
  }, [isTrendingSliderEnabled, isTrendingHovered, trendingSidebarArticles.length, trendingSlideSpeed]);

  const editorPickArticles = [...allArticles]
    .filter((a) => a.id !== article.id && (a.isEditorsPick || a.isTopStory))
    .slice(0, 3);

  // Helper to format full Hindi/English date and time
  const formatArticleDateTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const months = [
        'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
        'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
      ];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm} IST`;
    } catch {
      return isoString;
    }
  };

  const paragraphs = article.content.split('\n\n').filter(Boolean);
  const midPoint = Math.max(1, Math.floor(paragraphs.length / 2));

  // Helper to render rich markdown and embeds (YouTube, Twitter/X, Images, Fact Check, Callouts) in paragraphs
  const renderFormattedParagraph = (text: string, key: React.Key) => {
    return renderArticleBlock(text, key, contentFontSizeClass);
  };

  /* ICON-ONLY SOCIAL SHARING BAR AS REQUESTED BY USER:
     "social share wale button sirf social icons use karo"
  */
  const renderSocialIconButtons = () => (
    <div className="flex items-center space-x-2 py-1.5 flex-wrap gap-y-2">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-kd-meta mr-1">
        Share:
      </span>

      {/* Mobile Single Share Button */}
      <button
        onClick={handleNativeShare}
        className="sm:hidden flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition cursor-pointer"
        title="Share Article"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      {/* WhatsApp Icon */}
      {portalSettings.sharePlatforms.whatsapp && (
        <a
          href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xs hover:scale-110 transition duration-200"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      )}

      {/* Telegram Icon */}
      {portalSettings.sharePlatforms.telegram && (
        <a
          href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Telegram"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white flex items-center justify-center shadow-xs hover:scale-110 transition duration-200"
        >
          <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      )}

      {/* X / Twitter Icon */}
      {portalSettings.sharePlatforms.twitter && (
        <a
          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shadow-xs hover:scale-110 transition duration-200"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      )}

      {/* Facebook Icon */}
      {portalSettings.sharePlatforms.facebook && (
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xs hover:scale-110 transition duration-200"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      )}

      {/* Copy Link Icon */}
      {portalSettings.sharePlatforms.copyLink && (
        <button
          onClick={handleCopyLink}
          title={copiedLink ? 'Link Copied!' : 'Copy Link'}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-xs hover:scale-110 transition duration-200 ${
            copiedLink ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          {copiedLink ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );

  return (
    <article className="min-h-screen bg-slate-50/70 pb-16 relative">
      {/* 0. DYNAMIC TOP READING PROGRESS BAR (Controlled by Admin) */}
      {sidebarWidgets.showReadingProgressBar !== false && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200/60 z-50 pointer-events-none">
          <div
            className="h-full bg-red-600 shadow-sm transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* 1. TOP BREADCRUMB */}
      <div className="bg-white border-b border-slate-200 py-2.5 shadow-2xs sticky top-[102px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600 font-kd-meta">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-1 font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="font-bold text-slate-800 uppercase">
              {CATEGORIES.find((c) => c.id === article.category)?.labelEnglish || article.category}
            </span>
            <span>/</span>
            <span className="text-slate-500 font-mono text-xs truncate max-w-xs sm:max-w-md hidden sm:inline">
              {getEnglishArticleSlug(article)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-1.5 rounded-full border transition cursor-pointer shadow-2xs ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'बुकमार्क हटाया जा सकता है' : 'बुकमार्क में सहेजें'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* TOP ADVERTISEMENT */}
      {portalSettings.adSettings.showTopAd && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <AdBanner
            slot="leaderboard"
            type={portalSettings.adSettings.topAdType}
            privateBannerUrl={portalSettings.adSettings.privateBannerUrl}
            privateBannerLink={portalSettings.adSettings.privateBannerLink}
            privateBannerTitle={portalSettings.adSettings.privateBannerTitle}
            breakpoints={portalSettings.adSettings.responsiveBreakpoints?.leaderboard}
          />
        </div>
      )}

      {/* MAIN TWO-COLUMN ARTICLE PAGE BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT COLUMN: ARTICLE CONTENT (8 COLS) */}
        <div className="lg:col-span-8 bg-white p-3.5 sm:p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5 sm:space-y-5">
          {/* ADMIN IN-PLACE CUSTOMIZER BAR (STRICTLY VISIBLE ONLY TO AUTHENTICATED ADMIN) */}
          {isAdmin && onOpenAdminSettings && (
            <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white p-3 rounded-xl border border-red-700/60 shadow-md flex items-center justify-between flex-wrap gap-2 text-xs font-kd-meta mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-amber-300">Admin Live Studio:</span>
                <span className="text-slate-300 hidden sm:inline">Title, Meta, Author & Widgets Settings</span>
              </div>
              <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                <button
                  onClick={() => onOpenAdminSettings('articlemeta')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                  title="Meta & Author Settings"
                >
                  <Sliders className="w-3 h-3 text-amber-400" />
                  <span>Meta & Author</span>
                </button>
                <button
                  onClick={() => onOpenAdminSettings('sidebar_widgets')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                  title="Widgets & Sidebar Settings"
                >
                  <Layout className="w-3 h-3 text-sky-400" />
                  <span>Widgets & Sidebar</span>
                </button>
                <button
                  onClick={() => onOpenAdminSettings('typography')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                  title="Font & Body Typography"
                >
                  <Type className="w-3 h-3 text-rose-400" />
                  <span>Typography</span>
                </button>
                {onEditArticle && (
                  <button
                    onClick={() => onEditArticle(article)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-xs flex items-center space-x-1 cursor-pointer"
                    title="Edit This Article"
                  >
                    <PenTool className="w-3.5 h-3.5 text-white" />
                    <span>Edit Article</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category, Location, Date, Views, Audio Listen & PDF Download Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200/80 pb-3 font-kd-meta text-xs">
            {/* Left side: Category, Location & Date */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                {article.category}
              </span>
              {article.location && metaSettings.showLocationBadge !== false && (
                <span className="text-xs text-slate-700 flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>{article.location}</span>
                </span>
              )}
              {(metaSettings.showPublishDate || metaSettings.showRelativeTime) && (
                <span className="text-xs text-slate-500 hidden sm:flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatHindiTimeAgo(article.createdAt)}</span>
                </span>
              )}
            </div>

            {/* Right side: Compact Actions (PDF Download, Listen Hindi Audio, Views Counter) */}
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              {/* Listen Article Audio Button (Simple, compact, intuitive) */}
              {metaSettings.showListenButton !== false && (
                <button
                  type="button"
                  onClick={handleSpeechToggle}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition shadow-2xs cursor-pointer border ${
                    showAudioPlayer
                      ? 'bg-red-600 text-white border-red-700 shadow-xs ring-2 ring-red-100'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                  title={showAudioPlayer ? 'ऑडियो प्लेयर बंद करें' : 'खबर सुनें (ऑडियो बुलेटिन)'}
                >
                  {showAudioPlayer ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-white" />
                      <span>ऑडियो चालू</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>खबर सुनें</span>
                    </>
                  )}
                </button>
              )}

              {/* Generate / Download Article PDF Button (Real Download + E-Paper Clipping) */}
              {metaSettings.showPdfButton !== false && (
                <div className="inline-flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleDownloadArticlePdf}
                    disabled={isDownloadingPdf}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-60"
                    title="इस खबर का PDF डाउनलोड करें"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>PDF बन रही है...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-white" />
                        <span>PDF डाउनलोड</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClippingModal(true)}
                    className="inline-flex items-center p-1 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-2xs transition cursor-pointer"
                    title="ई-पेपर क्लिपिंग देखें व प्रिंट निकालें"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Reader Typography Customizer (Font-Size & Font-Family Dropdown for Readers) */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setShowTypographyDropdown(!showTypographyDropdown)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer shadow-2xs ${
                    showTypographyDropdown
                      ? 'bg-red-600 text-white'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                  title="फ़ॉन्ट व लिखावट का आकार बदलें (Reader Typography Customizer)"
                >
                  <Type className={`w-3.5 h-3.5 ${showTypographyDropdown ? 'text-white' : 'text-rose-600'}`} />
                  <span>फ़ॉन्ट ({readerFontSize}px)</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showTypographyDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Typography Popover Dropdown Panel */}
                {showTypographyDropdown && (
                  <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 animate-fadeIn space-y-3.5 font-kd-body text-slate-800 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Type className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-slate-900 font-kd-headline text-xs sm:text-sm">
                          पाठक टाइपोग्राफी (Reader Typography)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTypographyDropdown(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Font Family Selection */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        फ़ॉन्ट शैली (Font Family):
                      </label>
                      <select
                        value={readerFontFamily}
                        onChange={(e) => handleUpdateReaderFontFamily(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
                      >
                        <optgroup label="हिन्दी देवनागरी (Hindi Fonts)">
                          {FONT_OPTIONS.filter((f) => f.category === 'hindi').map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="English & Clean Sans">
                          {FONT_OPTIONS.filter((f) => f.category === 'english').map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Font Size Adjuster with Quick Buttons & Slider */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>अक्षर का आकार (Font Size):</span>
                        <span className="font-mono text-red-600 font-black">{readerFontSize}px</span>
                      </div>

                      {/* Quick Preset Buttons: A- / Normal / A+ */}
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {[
                          { label: 'छोटा (15px)', size: 15 },
                          { label: 'सामान्य (17px)', size: 17 },
                          { label: 'बड़ा (20px)', size: 20 },
                          { label: 'विशाल (24px)', size: 24 },
                        ].map((btn) => (
                          <button
                            key={btn.size}
                            type="button"
                            onClick={() => handleUpdateReaderFontSize(btn.size)}
                            className={`py-1 px-1 text-[10px] font-bold rounded-lg border transition cursor-pointer text-center ${
                              readerFontSize === btn.size
                                ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="range"
                        min="13"
                        max="28"
                        step="1"
                        value={readerFontSize}
                        onChange={(e) => handleUpdateReaderFontSize(Number(e.target.value))}
                        className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                    </div>

                    {/* Line Height Adjuster */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>पंक्तियों के बीच दूरी (Line Spacing):</span>
                        <span className="font-mono text-slate-900">{readerLineHeight}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'सघन (1.5)', value: 1.5 },
                          { label: 'मानक (1.75)', value: 1.75 },
                          { label: 'खुला (2.0)', value: 2.0 },
                        ].map((lh) => (
                          <button
                            key={lh.value}
                            type="button"
                            onClick={() => setReaderLineHeight(lh.value)}
                            className={`py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer text-center ${
                              readerLineHeight === lh.value
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {lh.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reset Button & Admin Shortcut */}
                    <div className="pt-2 border-t border-slate-150 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateReaderFontSize(portalSettings.typography?.articleBodyFontSizePx || 17);
                          handleUpdateReaderFontFamily(portalSettings.typography?.bodyFont || "'Mukta', sans-serif");
                          setReaderLineHeight(portalSettings.typography?.articleBodyLineHeight || 1.75);
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        डिफ़ॉल्ट पर रीसेट
                      </button>

                      {onOpenTypography && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowTypographyDropdown(false);
                            onOpenTypography();
                          }}
                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          एडमिन सेटिंग्स →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Views Counter (Admin customizable toggle) */}
              {metaSettings.showViewsCount !== false && (
                <span className="flex items-center space-x-1 text-slate-600 text-[11px] sm:text-xs font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.viewsCount} पढ़े</span>
                </span>
              )}
            </div>
          </div>

          {/* Headline (Uses customizable font-kd-headline with news industry sizing and Admin inline editor) */}
          <div className="relative group/h1">
            {isEditingTitle && isAdmin ? (
              <div className="space-y-2.5 bg-amber-50/80 p-4 rounded-xl border-2 border-amber-400 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin Inline Headline Editor</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-normal">Instant live update on page</span>
                </div>
                <textarea
                  value={inlineTitle}
                  onChange={(e) => setInlineTitle(e.target.value)}
                  rows={2}
                  className="w-full text-lg sm:text-2xl font-bold font-kd-headline text-slate-900 p-2.5 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setInlineTitle(article.title);
                      setIsEditingTitle(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineTitle}
                    disabled={isSavingTitle || !inlineTitle.trim()}
                    className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition cursor-pointer shadow-xs flex items-center space-x-1"
                  >
                    {isSavingTitle ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Headline</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    lineHeight: 1.28,
                  }}
                  className="font-black font-kd-headline text-slate-900 tracking-tight break-words transition-all duration-150"
                >
                  {inlineTitle || article.title}
                </h1>
                {isAdmin && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(true)}
                      className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-md transition cursor-pointer shadow-2xs"
                      title="Click to edit headline instantly on page"
                    >
                      <PenTool className="w-3 h-3 text-red-600" />
                      <span>Edit Headline (Direct Inline)</span>
                    </button>
                    {titleSaveSuccess && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fadeIn">
                        ✓ Headline Updated!
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MERGED COMPACT CARD: SUBTITLE, AUTHOR BYLINE, DATE-TIME & SOCIAL SHARING */}
          <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-2xs transition-all">
            {/* Subtitle / Excerpt with compact styling */}
            {article.summary && (
              <p
                style={{
                  fontSize: portalSettings.typography?.articleLeadSubtitlePx
                    ? `${portalSettings.typography.articleLeadSubtitlePx}px`
                    : undefined,
                }}
                className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed font-kd-body border-l-3 border-red-600 pl-2.5 sm:pl-3 py-0.5"
              >
                {article.summary}
              </p>
            )}

            {/* Line 1: Author info + Detailed Date & Time + Reader Views (Configured via Admin Settings) */}
            <div className={`flex items-center justify-between gap-2.5 ${article.summary ? 'pt-2.5 border-t border-slate-200/70' : ''} text-xs text-slate-600 font-kd-meta`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                {metaSettings.showAuthorAvatar && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-slate-300 bg-slate-200 shrink-0 ring-2 ring-white shadow-2xs">
                    <img
                      src={article.authorPhotoUrl || getAuthorPhoto(article.authorName)}
                      alt={article.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 leading-tight">
                  {(metaSettings.showAuthorName || metaSettings.showAuthorRole) && (
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                      {metaSettings.showAuthorName && (
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {article.authorName}
                        </span>
                      )}
                      {metaSettings.showAuthorName && metaSettings.showAuthorRole && (
                        <span className="text-[10px] text-slate-300">•</span>
                      )}
                      {metaSettings.showAuthorRole && (
                        <span className="text-[10px] sm:text-xs text-red-700 bg-red-50 border border-red-200/60 font-medium px-1.5 py-0.2 rounded truncate">
                          {article.authorRole || 'Special Correspondent'}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Detailed Date & Time */}
                  {(metaSettings.showPublishDate || metaSettings.showRelativeTime) && (
                    <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-500 mt-1 flex-wrap gap-y-0.5">
                      {metaSettings.showPublishDate && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-red-600 shrink-0" />
                          <span>{formatArticleDateTime(article.createdAt)}</span>
                        </span>
                      )}
                      {metaSettings.showPublishDate && metaSettings.showRelativeTime && (
                        <span className="text-slate-300">•</span>
                      )}
                      {metaSettings.showRelativeTime && (
                        <span className="flex items-center space-x-1 text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatHindiTimeAgo(article.createdAt)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Reader View Count on Mobile & Desktop + Quick Admin Settings access */}
              <div className="flex items-center space-x-2 shrink-0">
                {metaSettings.showViewsCount && (
                  <div className="flex items-center space-x-1 text-slate-500 text-[11px] sm:text-xs font-mono bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-200/80 shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.viewsCount} Readers</span>
                  </div>
                )}
                {isAdmin && onOpenAdminSettings && (
                  <button
                    onClick={() => onOpenAdminSettings('articlemeta')}
                    title="Article Meta & Action Bar Settings"
                    className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Line 2: 1-Line Compact Version (Bookmark + Social Icons + Share Button) */}
            <div
              className={`flex items-center justify-between gap-1.5 sm:gap-2 pt-2.5 border-t border-slate-200/80 text-xs w-full ${
                metaSettings.compactSingleLine
                  ? 'flex-nowrap overflow-x-auto no-scrollbar py-0.5'
                  : 'flex-wrap sm:flex-nowrap'
              }`}
            >
              {/* Left Side: Bookmark & Reading Action */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
                {/* Bookmark Toggle */}
                {metaSettings.showBookmarkButton && (
                  <button
                    onClick={() => onToggleBookmark(article)}
                    className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-90 shrink-0 ${
                      isBookmarked
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50/50'
                    }`}
                    title={isBookmarked ? 'सेव किया गया' : 'बुकमार्क करें'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="text-[11px] font-semibold">{isBookmarked ? 'सेव है' : 'बुकमार्क'}</span>
                  </button>
                )}
              </div>

              {/* Right Side: Social Media Sharing Icons + Quick Share Button */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 justify-end">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-kd-meta hidden md:inline mr-0.5 shrink-0">
                  शेयर:
                </span>

                {/* Social Media Icons (WhatsApp, Telegram, Twitter, Facebook) */}
                {metaSettings.showSocialIcons && (
                  <>
                    {/* WhatsApp */}
                    {metaSettings.platforms.whatsapp && portalSettings.sharePlatforms.whatsapp && (
                      <a
                        href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="व्हाट्सएप पर शेयर करें"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-90 text-white flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </a>
                    )}

                    {/* Telegram */}
                    {metaSettings.platforms.telegram && portalSettings.sharePlatforms.telegram && (
                      <a
                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="टेलीग्राम पर शेयर करें"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0088cc] hover:bg-[#0077b5] active:scale-90 text-white flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </a>
                    )}

                    {/* X / Twitter */}
                    {metaSettings.platforms.twitter && portalSettings.sharePlatforms.twitter && (
                      <a
                        href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="X पर शेयर करें"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 hover:bg-black active:scale-90 text-white flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 shrink-0"
                      >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}

                    {/* Facebook */}
                    {metaSettings.platforms.facebook && portalSettings.sharePlatforms.facebook && (
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="फेसबुक पर शेयर करें"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1877F2] hover:bg-[#166fe5] active:scale-90 text-white flex items-center justify-center shadow-2xs hover:scale-105 transition-all duration-200 shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                  </>
                )}

                {/* One-Click Native Quick Share Button (Red Pill) */}
                {metaSettings.showNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 active:scale-90 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer shrink-0"
                    title="शेयर करें"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] sm:text-xs">शेयर</span>
                  </button>
                )}

                {/* Copy Link Button */}
                {metaSettings.platforms.copyLink && portalSettings.sharePlatforms.copyLink && (
                  <button
                    onClick={handleCopyLink}
                    title={copiedLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-2xs active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer shrink-0 ${
                      copiedLink ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Link2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AUDIO NEWS PLAYER BAR (Minimalist Audio Bulletin with Hindi TTS) */}
          {showAudioPlayer && (
            <div className="my-2.5">
              <AudioNewsPlayer
                title={article.title}
                textToRead={`${article.title}। ${article.summary ? article.summary + '।' : ''} ${article.content}`}
                isOpen={showAudioPlayer}
                onClose={() => {
                  setShowAudioPlayer(false);
                  stopHindiSpeech();
                }}
              />
            </div>
          )}

          {/* EDITORIAL KEY HIGHLIGHTS (मुख्य बिंदु / 5 खास बातें) */}
          <ArticleKeyHighlights article={article} />

          {/* Featured Image & Caption */}
          <div className="space-y-1.5">
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200 shadow-xs">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <p className="text-xs text-slate-500 italic text-center font-kd-meta">
                फोटो: {article.imageCaption}
              </p>
            )}
          </div>

          {/* Article Full Paragraphs with In-Content Middle Ad */}
          <div
            style={{
              fontSize: `${readerFontSize}px`,
              fontFamily: readerFontFamily,
              lineHeight: readerLineHeight,
            }}
            className="space-y-4 text-slate-800 transition-all duration-150"
          >
            {paragraphs.slice(0, midPoint).map((p, idx) => renderFormattedParagraph(p, idx))}

            {portalSettings.adSettings.showMidContentAd && (
              <div className="my-6">
                <AdBanner
                  slot="in-content"
                  type="adsense"
                  breakpoints={portalSettings.adSettings.responsiveBreakpoints?.inContent}
                />
              </div>
            )}

            {paragraphs.slice(midPoint).map((p, idx) =>
              renderFormattedParagraph(p, idx + midPoint)
            )}
          </div>

          {/* BOTTOM SOCIAL SHARING BUTTONS (ICON-ONLY) */}
          <div className="border-t border-slate-200 pt-4">
            {renderSocialIconButtons()}
          </div>

          {/* EMOJI REACTIONS (MINIMALIST, ONLY EMOJIS WITHOUT TEXT) */}
          <div className="py-2.5 flex items-center justify-between border-y border-slate-150 my-4 select-none">
            <div className="flex items-center space-x-2 sm:space-x-2.5 overflow-x-auto scrollbar-none py-1">
              {[
                { type: 'like', emoji: '👍', count: reactions.like || 0 },
                { type: 'love', emoji: '❤️', count: reactions.love || 0 },
                { type: 'insightful', emoji: '💡', count: reactions.insightful || 0 },
                { type: 'funny', emoji: '😂', count: reactions.funny || 0 },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleReaction(item.type as any)}
                  className={`px-3 py-1.5 rounded-full border text-base sm:text-lg flex items-center space-x-1.5 transition-all duration-150 cursor-pointer active:scale-90 ${
                    userReaction === item.type
                      ? 'bg-red-50 border-red-400 text-red-700 ring-2 ring-red-200 shadow-xs scale-105 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                  title={`${item.emoji} (${item.count})`}
                >
                  <span className="leading-none">{item.emoji}</span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
            {userReaction && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full animate-fadeIn font-kd-meta shrink-0 ml-2">
                ✓ दर्ज हुआ
              </span>
            )}
          </div>

          {/* BOTTOM ADVERTISEMENT */}
          {portalSettings.adSettings.showBottomAd && (
            <div className="pt-2">
              <AdBanner
                slot="bottom"
                type="adsense"
                breakpoints={portalSettings.adSettings.responsiveBreakpoints?.bottom}
              />
            </div>
          )}

          {/* AUTHOR BIO & FACT-CHECK CARD (Controlled by Admin Settings - Responsive Mobile & Desktop Layout) */}
          {sidebarWidgets.showAuthorBio !== false && (
            <div className="bg-gradient-to-br from-white via-slate-50 to-red-50/30 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs font-kd-meta space-y-3">
              {/* Card Header Tag */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70">
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>संपादकीय प्रोफाइल • Author Credentials</span>
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Desk</span>
                </span>
              </div>

              {/* Responsive Body */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-red-200 shrink-0 shadow-xs bg-slate-100">
                    <img
                      src={article.authorPhotoUrl || getAuthorPhoto(article.authorName)}
                      alt={article.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* On Mobile: show name and role right next to avatar */}
                  <div className="sm:hidden min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
                      {article.authorName}
                    </h4>
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded inline-block mt-0.5">
                      {article.authorRole || 'वरिष्ठ संवाददाता'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 w-full">
                  {/* On Desktop: show name and role here */}
                  <div className="hidden sm:flex items-center space-x-2 flex-wrap gap-y-1">
                    <h4 className="font-bold text-base text-slate-900">
                      {article.authorName}
                    </h4>
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md border border-red-200">
                      {article.authorRole || 'वरिष्ठ संवाददाता'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-kd-body">
                    खबरी दोस्त नेशनल व रीजनल न्यूज़ नेटवर्क की समर्पित संपादकीय टीम द्वारा ग्राउंड रिपोर्टिंग और तथ्य-जांच के साथ प्रकाशित।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CONNECT WITH KHABRI DOST: JOIN OUR GROUPS */}
          {sidebarWidgets.showFollowUsChannels !== false && (
            <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4 font-kd-meta">
              {/* Header: Connect with Khabri Dost to Join our Groups */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base font-kd-headline text-slate-900 tracking-tight">
                      Connect with Khabri Dost to Join our Groups
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      ताज़ा अपडेट्स और ब्रेकिंग न्यूज़ सीधे अपने फोन पर प्राप्त करें
                    </p>
                  </div>
                </div>
              </div>

              {/* 2 Channels: WhatsApp & Telegram (High-Contrast & Compact) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. WhatsApp Channel */}
                <a
                  href={portalSettings?.headerFooter?.socialLinks?.whatsappChannel || 'https://whatsapp.com/channel/example'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#075E54] hover:bg-[#128C7E] active:scale-98 p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-white border border-emerald-600/50 shadow-xs hover:shadow-md transition-all group cursor-pointer overflow-hidden"
                  title="WhatsApp ग्रुप / चैनल जॉइन करें - तुरंत ब्रेकिंग अलर्ट्स"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/25 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="text-xs sm:text-sm font-black text-white truncate">
                        WhatsApp Group
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-emerald-200 truncate">
                        ताज़ा ब्रेकिंग अलर्ट्स
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center space-x-1 text-emerald-950 font-black text-[11px] sm:text-xs bg-white group-hover:bg-emerald-100 px-2 py-1 rounded-md transition shrink-0 ml-2 shadow-2xs">
                    <span>जॉइन</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>

                {/* 2. Telegram Channel */}
                <a
                  href={portalSettings?.headerFooter?.socialLinks?.telegramChannel || 'https://t.me/example'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0077b5] hover:bg-[#0088cc] active:scale-98 p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-white border border-sky-400/50 shadow-xs hover:shadow-md transition-all group cursor-pointer overflow-hidden"
                  title="Telegram चैनल से जुड़ें - तुरंत बुलेटिन"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-300/25 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="text-xs sm:text-sm font-black text-white truncate">
                        Telegram Group
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-sky-200 truncate">
                        इंस्टेंट न्यूज़ बुलेटिन
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center space-x-1 text-sky-950 font-black text-[11px] sm:text-xs bg-white group-hover:bg-sky-100 px-2 py-1 rounded-md transition shrink-0 ml-2 shadow-2xs">
                    <span>जुड़ें</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              </div>

              {/* Social Media Follow Line */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                <span className="font-semibold text-slate-700 text-[11px]">
                  सोशल मीडिया पर फॉलो करें:
                </span>
                <div className="flex items-center space-x-2">
                  <a
                    href={portalSettings?.headerFooter?.socialLinks?.youtube || 'https://youtube.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition shadow-2xs"
                    title="YouTube Official"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href={portalSettings?.headerFooter?.socialLinks?.twitter || 'https://x.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition shadow-2xs"
                    title="X (Twitter) Official"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={portalSettings?.headerFooter?.socialLinks?.facebook || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition shadow-2xs"
                    title="Facebook Official"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={portalSettings?.headerFooter?.socialLinks?.instagram || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-2xs"
                    title="Instagram Official"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* COMMENTS SECTION (Controlled by Admin Settings) */}
          {sidebarWidgets.showCommentsSection !== false && (
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-kd-headline text-lg text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  <span>पाठकों की प्रतिक्रियाएं ({comments.length})</span>
                </h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="इस खबर पर अपनी राय साझा करें..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition font-kd-body"
                />
                <div className="flex justify-between items-center font-kd-meta">
                  <span className="text-[11px] text-slate-500">
                    {user ? `टिप्पणीकर्ता: ${user.displayName}` : 'साइन-इन आवश्यक'}
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingComment ? 'भेज रहे हैं...' : 'टिप्पणी भेजें'}</span>
                  </button>
                </div>
              </form>

              <div className="space-y-3 pt-2 font-kd-body">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    अभी तक कोई टिप्पणी नहीं है। अपनी राय साझा करने वाले पहले पाठक बनें!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm space-y-1">
                      <div className="flex items-center justify-between font-kd-meta">
                        <span className="font-bold text-slate-800">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatHindiTimeAgo(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RICH INTERACTIVE SIDEBAR WITH MODULAR ADS & OPINION POLL (4 COLS) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Admin Quick Controls Bar */}
          {isAdmin && onOpenAdminSettings && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center justify-between shadow-2xs font-kd-meta">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-red-600" />
                <span>Sidebar Admin Controls</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAdminSettings('sidebar_ads')}
                  className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded transition cursor-pointer"
                  title="Configure Modular Sidebar Ads"
                >
                  Sidebar Ads 📢
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAdminSettings('sidebar_widgets')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white font-bold px-2 py-0.5 rounded transition cursor-pointer"
                  title="Configure Sidebar Widgets"
                >
                  Widgets ⚙
                </button>
              </div>
            </div>
          )}

          {/* 1. TOP ADVERTISEMENT SPACE (MODULAR SLOT 1) */}
          {sidebarAds.topSlot?.enabled !== false && (
            <AdBanner
              slot="sidebar"
              type={sidebarAds.topSlot?.adType || portalSettings.adSettings.sidebarAdType}
              privateBannerUrl={sidebarAds.topSlot?.bannerUrl || portalSettings.adSettings.privateBannerUrl}
              privateBannerLink={sidebarAds.topSlot?.bannerLink || portalSettings.adSettings.privateBannerLink}
              privateBannerTitle={sidebarAds.topSlot?.bannerTitle || portalSettings.adSettings.privateBannerTitle}
              breakpoints={sidebarAds.topSlot?.breakpoints || sidebarAds.globalBreakpoints || portalSettings.adSettings.responsiveBreakpoints?.sidebar}
            />
          )}

          {/* 2. TRENDING STORIES (VERTICAL BOTTOM-TO-TOP SLIDER) */}
          {sidebarWidgets.showTrendingNews !== false && trendingSidebarArticles.length > 0 && (
            <div
              onMouseEnter={() => setIsTrendingHovered(true)}
              onMouseLeave={() => setIsTrendingHovered(false)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 overflow-hidden animate-fadeIn"
            >
              <div className="border-b border-slate-100 pb-2 mb-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm shrink-0 border border-red-200/50">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="font-bold font-kd-headline text-slate-900 text-sm sm:text-base flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="truncate">ट्रेंडिंग ख़बरें</span>
                      {sidebarWidgets.trendingCategoryFilter && sidebarWidgets.trendingCategoryFilter !== 'all' && (
                        <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded font-bold font-kd-meta shrink-0">
                          {sidebarWidgets.trendingCategoryFilter}
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 p-0.5 rounded-lg shrink-0">
                    {/* Play/Pause Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsTrendingPaused(!isTrendingPaused)}
                      title={isTrendingPaused ? 'स्लाइडिंग जारी रखें' : 'स्लाइडिंग रोकें'}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      {isTrendingPaused ? <Play className="w-3 h-3 fill-red-600 text-red-600" /> : <Pause className="w-3 h-3" />}
                    </button>

                    {/* Manual Step Jump Buttons */}
                    <button
                      type="button"
                      onClick={() => {
                        if (trendingScrollRef.current) {
                          trendingScrollRef.current.scrollTop -= 80;
                        }
                      }}
                      title="ऊपर स्क्रॉल करें"
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (trendingScrollRef.current) {
                          trendingScrollRef.current.scrollTop += 80;
                        }
                      }}
                      title="नीचे स्क्रॉल करें"
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Decorative Line (Simple line ke niche line) */}
                <div className="w-full flex items-center">
                  <div className="w-12 h-0.5 bg-red-600 rounded-full"></div>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
              </div>

              {/* Slider Viewport: Smooth bottom-to-top continuous sliding marquee like homepage */}
              {isTrendingSliderEnabled ? (
                <div
                  ref={trendingScrollRef}
                  className="relative overflow-hidden min-h-[250px] max-h-[300px]"
                >
                {/* Top and bottom subtle fade overlays for smooth appearance */}
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

                {/* The Animated Moving Track */}
                <div
                  className={`space-y-1.5 pt-0.5 pb-2 ${!isTrendingPaused && !isTrendingHovered ? 'animate-vertical-ticker' : ''}`}
                  style={{
                    animationPlayState: (isTrendingPaused || isTrendingHovered) ? 'paused' : 'running',
                  }}
                >
                  {/* Render articles repeated for continuous upwards looping */}
                  {trendingSidebarArticles.concat(trendingSidebarArticles).map((art, idx) => {
                    const displayRank = (idx % trendingSidebarArticles.length) + 1;
                    return (
                      <div
                        key={`${art.id}-${idx}`}
                        onClick={() => onSelectArticle(art)}
                        className="flex items-start gap-2 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-100 group min-h-[58px]"
                      >
                        <span className="text-sm font-black text-slate-300 group-hover:text-red-600 transition font-serif w-4 text-center shrink-0 mt-0.5">
                          {displayRank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-red-600 uppercase block mb-0.5 font-kd-meta">
                            {art.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-red-700 transition leading-snug font-kd-headline line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block font-kd-meta">
                            {formatHindiTimeAgo(art.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              ) : (
                /* Static List Mode fallback */
                <div className="space-y-1.5">
                  {trendingSidebarArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art)}
                      className="flex items-start gap-2 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-100 group"
                    >
                      <span className="text-sm font-black text-slate-300 group-hover:text-red-600 transition font-serif w-4 text-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-red-600 uppercase block mb-0.5 font-kd-meta">
                          {art.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-red-700 transition leading-snug font-kd-headline">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-kd-meta">
                          {formatHindiTimeAgo(art.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TODAY'S GOLD & SILVER RATE WIDGET (Simple & Suitable News Portal Style) */}
          {sidebarWidgets.showGoldRate !== false && (
            <GoldRateWidget
              config={sidebarWidgets}
              isAdmin={isAdmin}
              onOpenAdminSettings={() => onOpenAdminSettings && onOpenAdminSettings('sidebar_widgets')}
            />
          )}

          {/* TODAY'S RASHIFAL WIDGET (Simple & Suitable News Portal Style) */}
          {sidebarWidgets.showRashifal !== false && (
            <RashifalWidget
              config={sidebarWidgets}
              isAdmin={isAdmin}
              onOpenAdminSettings={() => onOpenAdminSettings && onOpenAdminSettings('sidebar_widgets')}
            />
          )}

          {/* 3. MIDDLE ADVERTISEMENT SPACE (MODULAR SLOT 2) */}
          {sidebarAds.middleSlot?.enabled !== false && (
            <AdBanner
              slot="sidebar"
              type={sidebarAds.middleSlot?.adType || portalSettings.adSettings.sidebarAdType}
              privateBannerUrl={sidebarAds.middleSlot?.bannerUrl || portalSettings.adSettings.privateBannerUrl}
              privateBannerLink={sidebarAds.middleSlot?.bannerLink || portalSettings.adSettings.privateBannerLink}
              privateBannerTitle={sidebarAds.middleSlot?.bannerTitle || portalSettings.adSettings.privateBannerTitle}
              breakpoints={sidebarAds.middleSlot?.breakpoints || sidebarAds.globalBreakpoints || portalSettings.adSettings.responsiveBreakpoints?.sidebar}
            />
          )}

          {/* 4. MODULAR OPINION POLL WIDGET WITH MULTIPLE CHOICE & RESULTS PERCENTAGE BAR */}
          {sidebarWidgets.showOpinionPoll !== false && (
            <OpinionPollWidget
              pollId={`poll_${article.id}`}
              question={sidebarWidgets.pollQuestion}
              optionA={sidebarWidgets.pollOptionA}
              optionB={sidebarWidgets.pollOptionB}
              optionC={sidebarWidgets.pollOptionC}
              optionD={sidebarWidgets.pollOptionD}
              isAdmin={isAdmin}
              onOpenAdminSettings={() => onOpenAdminSettings && onOpenAdminSettings('sidebar_widgets')}
            />
          )}

          {/* 4.5 DAILY NEWSPAPER SUDOKU GAME WIDGET */}
          {onOpenSudokuModal && (
            <SudokuGameWidget
              onOpenSudokuModal={onOpenSudokuModal}
              isAdmin={isAdmin}
            />
          )}

          {/* 5. BOTTOM ADVERTISEMENT SPACE (MODULAR SLOT 3) */}
          {sidebarAds.bottomSlot?.enabled !== false && (
            <AdBanner
              slot="sidebar"
              type={sidebarAds.bottomSlot?.adType || portalSettings.adSettings.sidebarAdType}
              privateBannerUrl={sidebarAds.bottomSlot?.bannerUrl || portalSettings.adSettings.privateBannerUrl}
              privateBannerLink={sidebarAds.bottomSlot?.bannerLink || portalSettings.adSettings.privateBannerLink}
              privateBannerTitle={sidebarAds.bottomSlot?.bannerTitle || portalSettings.adSettings.privateBannerTitle}
              breakpoints={sidebarAds.bottomSlot?.breakpoints || sidebarAds.globalBreakpoints || portalSettings.adSettings.responsiveBreakpoints?.sidebar}
            />
          )}
        </aside>
      </div>

      {/* RELATED ARTICLES SECTION (Strictly from the same category with admin choice of 3, 4, 6 or more) */}
      {sidebarWidgets.showRelatedStories !== false && relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
            {/* Header Bar with Admin Count & Typography Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b-2 border-red-600 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <h3
                    style={{
                      fontSize: portalSettings.typography?.relatedHeadingCustomPx
                        ? `${portalSettings.typography.relatedHeadingCustomPx}px`
                        : undefined,
                    }}
                    className="font-black font-kd-headline text-base sm:text-lg text-slate-900 tracking-tight"
                  >
                    संबंधित ख़बरें
                  </h3>
                  <span
                    style={{
                      fontSize: portalSettings.typography?.relatedCategoryBadgePx
                        ? `${portalSettings.typography.relatedCategoryBadgePx}px`
                        : undefined,
                    }}
                    className="text-[11px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full uppercase font-kd-meta"
                  >
                    {article.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-kd-body mt-0.5">
                  इस विषय ({article.category}) से जुड़ी अन्य प्रमुख एवं ताज़ा ख़बरें
                </p>
              </div>

              {/* Admin Option: Choose 3, 4, or 6 articles & Heading Size */}
              {isAdmin && (
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-kd-meta border border-slate-200 self-start sm:self-auto">
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] font-bold text-slate-600 pl-1 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-red-600" />
                      <span>संख्या:</span>
                    </span>
                    {[3, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetRelatedCount(num)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          adminRelatedCount === num
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200'
                        }`}
                        title={`Show ${num} related articles`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {onOpenAdminSettings && (
                    <div className="flex items-center space-x-1 pl-2 border-l border-slate-300">
                      <button
                        type="button"
                        onClick={() => onOpenAdminSettings('typography')}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 underline flex items-center gap-0.5 cursor-pointer"
                        title="कस्टमाइज़ फ़ॉन्ट साइज़"
                      >
                        फ़ॉन्ट बदलें ✎
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Grid: 3 columns, 4 columns, or 6 columns */}
            <div
              className={`grid gap-5 ${
                adminRelatedCount === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : adminRelatedCount === 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {relatedArticles.map((relArt) => (
                <div
                  key={relArt.id}
                  onClick={() => {
                    onSelectArticle(relArt);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-50 hover:bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-slate-200 relative">
                      <img
                        src={relArt.imageUrl}
                        alt={relArt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase font-kd-meta shadow-xs">
                        {relArt.category}
                      </span>
                      {relArt.location && (
                        <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded font-kd-meta flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{relArt.location}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h4
                        style={{
                          fontSize: portalSettings.typography?.relatedCardTitlePx
                            ? `${portalSettings.typography.relatedCardTitlePx}px`
                            : undefined,
                        }}
                        className="text-xs sm:text-sm font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2"
                      >
                        {relArt.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-kd-body line-clamp-2 leading-relaxed">
                        {relArt.summary || relArt.content.slice(0, 110)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-400 font-kd-meta">
                    <span>{formatHindiTimeAgo(relArt.createdAt)}</span>
                    <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      पढ़ें ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* E-PAPER CLIPPING & PRINT / PDF MODAL */}
      {showClippingModal && (
        <ArticleEPaperClippingModal
          article={article}
          portalSettings={portalSettings}
          onClose={() => setShowClippingModal(false)}
        />
      )}
    </article>
  );
};
