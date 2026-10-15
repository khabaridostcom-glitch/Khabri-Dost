import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Search,
  BookMarked,
  Newspaper,
  PenTool,
  LogIn,
  LogOut,
  Sun,
  TrendingUp,
  Settings,
  ChevronRight,
  Menu,
  X,
  Hash,
  Sliders,
  Play,
  Pause,
  FastForward,
  Type,
  Calendar,
  Clock,
  CloudSun,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Bell,
  Lock,
  Tv,
  Check,
  Radio,
  Mail,
  ShieldCheck,
  FileText,
  AlertCircle,
  BookOpen,
  Layout,
  Home,
  MapPin,
  Gamepad2,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NewsCategory, PortalSettings, NewsArticle, MobileSidebarMenuConfig } from '../types/news';
import { CATEGORIES, ALL_INDIAN_STATES_BY_REGION } from '../data/seedNews';
import { DEFAULT_MOBILE_SIDEBAR_MENU } from '../data/portalDefaults';
import { getTodayHindiDate, formatHindiTimeAgo } from '../utils/hindiHelpers';

interface HeaderProps {
  currentCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPublisherCMS: () => void;
  onOpenBookmarks: () => void;
  onOpenReadLater?: () => void;
  onOpenEPaper: () => void;
  onOpenAdminSettings: (tab?: any) => void;
  onOpenAdminBackend?: () => void;
  onOpenStaffLogin?: () => void;
  onOpenSubscriberModal?: () => void;
  onScrollToLiveVideo?: () => void;
  onOpenTypography?: () => void;
  onOpenAllStatesModal?: () => void;
  bookmarksCount: number;
  readLaterCount?: number;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onResetTypography?: () => void;
  portalSettings: PortalSettings;
  onUpdateSettings: (newSettings: Partial<PortalSettings>) => void;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onOpenLiveFeed?: () => void;
  onOpenContactPage?: () => void;
  onOpenAboutUsPage?: () => void;
  onOpenSubmitNews?: () => void;
  onOpenLegalPolicy?: (type: any) => void;
  onOpenArchivePage?: () => void;
  onOpenSudokuGame?: () => void;
  onBackToHome?: () => void;
}

const CITY_WEATHER_LIST = [
  { city: 'नई दिल्ली', temp: '28°C', condition: 'साफ़ धूप', aqi: 'AQI 108' },
  { city: 'लखनऊ', temp: '29°C', condition: 'आंशिक बादल', aqi: 'AQI 115' },
  { city: 'पटना', temp: '30°C', condition: 'धूप खिली', aqi: 'AQI 122' },
  { city: 'भोपाल', temp: '27°C', condition: 'सुहावना मौसम', aqi: 'AQI 94' },
  { city: 'जयपुर', temp: '31°C', condition: 'शुष्क व गर्म', aqi: 'AQI 110' },
  { city: 'मुंबई', temp: '32°C', condition: 'हल्की धूप', aqi: 'AQI 88' },
];

export const MAJOR_INDIAN_STATES = [
  'उत्तर प्रदेश',
  'बिहार',
  'दिल्ली NCR',
  'मध्य प्रदेश',
  'राजस्थान',
  'महाराष्ट्र',
  'हरियाणा',
  'गुजरात',
  'पंजाब',
  'उत्तराखंड',
  'झारखंड',
  'छत्तीसगढ़',
  'हिमाचल प्रदेश',
  'पश्चिम बंगाल',
  'ओडिशा',
  'असम',
  'जम्मू-कश्मीर',
  'कर्नाटक',
  'तमिलनाडु',
  'तेलंगाना',
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenPublisherCMS,
  onOpenBookmarks,
  onOpenReadLater,
  onOpenEPaper,
  onOpenAdminSettings,
  onOpenAdminBackend,
  onOpenStaffLogin,
  onOpenSubscriberModal,
  onScrollToLiveVideo,
  onOpenTypography,
  onOpenAllStatesModal,
  bookmarksCount,
  readLaterCount = 0,
  fontSize,
  onChangeFontSize,
  onResetTypography,
  portalSettings,
  onUpdateSettings,
  articles,
  onSelectArticle,
  onOpenLiveFeed,
  onOpenContactPage,
  onOpenAboutUsPage,
  onOpenSubmitNews,
  onOpenLegalPolicy,
  onOpenArchivePage,
  onOpenSudokuGame,
  onBackToHome,
}) => {
  const { user, isStaff, isAdmin, staffSession, signInWithGoogle, logout, logoutStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMegaMenuOpen, setDesktopMegaMenuOpen] = useState(false);
  const [statesMenuOpen, setStatesMenuOpen] = useState(false);
  const [megaMenuCategory, setMegaMenuCategory] = useState<NewsCategory>('all');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [customSpeedInput, setCustomSpeedInput] = useState(portalSettings.tickerSpeedSeconds || 65);
  const [showCustomSpeedForm, setShowCustomSpeedForm] = useState(false);
  const [cityIndex, setCityIndex] = useState(0);
  const [weatherMenuOpen, setWeatherMenuOpen] = useState(false);
  const [mobileStatesExpanded, setMobileStatesExpanded] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statesMenuRef = useRef<HTMLDivElement>(null);
  const statesTriggerRef = useRef<HTMLButtonElement>(null);
  const statesHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setStatesMenuOpen(false);
    setDesktopMegaMenuOpen(true);
  };

  const handleMouseLeaveMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setDesktopMegaMenuOpen(false);
    }, 450);
  };

  const handleMouseEnterStatesMenu = () => {
    if (statesHoverTimeoutRef.current) {
      clearTimeout(statesHoverTimeoutRef.current);
      statesHoverTimeoutRef.current = null;
    }
    setDesktopMegaMenuOpen(false);
    setStatesMenuOpen(true);
  };

  const handleMouseLeaveStatesMenu = () => {
    if (statesHoverTimeoutRef.current) {
      clearTimeout(statesHoverTimeoutRef.current);
    }
    statesHoverTimeoutRef.current = setTimeout(() => {
      setStatesMenuOpen(false);
    }, 400);
  };

  // Filtered stories inside Mega Menu based on active category
  const megaMenuArticles = React.useMemo(() => {
    let pool = articles || [];
    if (megaMenuCategory !== 'all') {
      pool = pool.filter((a) => a.category === megaMenuCategory);
    }
    return pool.slice(0, 5);
  }, [articles, megaMenuCategory]);

  // Top trending stories for Mega Menu
  const megaTrendingArticles = React.useMemo(() => {
    return [...(articles || [])]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 4);
  }, [articles]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Close desktop mega menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // If clicked inside the menu itself, let it handle its own events
      if (megaMenuRef.current && megaMenuRef.current.contains(target)) {
        return;
      }
      // If clicked on trigger button or inside it, ignore here so button's onClick can toggle cleanly
      if (target.closest && target.closest('[data-megamenu-trigger]')) {
        return;
      }
      if (megaMenuTriggerRef.current && megaMenuTriggerRef.current.contains(target)) {
        return;
      }
      setDesktopMegaMenuOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDesktopMegaMenuOpen(false);
      }
    };

    if (desktopMegaMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [desktopMegaMenuOpen]);

  const todayHindi = getTodayHindiDate();
  const [currentTime, setCurrentTime] = useState<string>('');

  const siteTitle = portalSettings.headerFooter?.siteTitle || 'खबरी दोस्त';
  const siteTagline = portalSettings.headerFooter?.siteTagline || 'KHABRI DOST • भारत का विश्वसनीय हिंदी न्यूज़ पोर्टल';
  const socialLinks = portalSettings.headerFooter?.socialLinks || {
    whatsappChannel: 'https://whatsapp.com/channel/example',
    telegramChannel: 'https://t.me/example',
    facebook: 'https://facebook.com',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
  };

  const hfSettings = portalSettings.headerFooter;

  // Custom ordered and filtered categories for desktop and mobile navigation
  const sortedCategories = React.useMemo(() => {
    const rawOrder = hfSettings?.navCategoryOrder || [
      'national',
      'state',
      'politics',
      'business',
      'entertainment',
      'sports',
      'tech',
      'lifestyle',
      'world',
    ];
    const disabled = hfSettings?.disabledCategories || [];
    const baseCats = CATEGORIES.filter((c) => c.id !== 'all' && !disabled.includes(c.id));

    // Sort according to admin's custom sequence
    return [...baseCats].sort((a, b) => {
      const idxA = rawOrder.indexOf(a.id);
      const idxB = rawOrder.indexOf(b.id);
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      return posA - posB;
    });
  }, [hfSettings?.navCategoryOrder, hfSettings?.disabledCategories]);

  const mobileSidebarConfig: MobileSidebarMenuConfig = {
    ...DEFAULT_MOBILE_SIDEBAR_MENU,
    ...(portalSettings.mobileSidebarMenu || {}),
  };

  // Live real-time clock for top header bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchModalOpen]);

  // Extract recent news for breaking ticker
  const recentBreakingHeadlines = React.useMemo(() => {
    const list: { id?: string; title: string; article?: NewsArticle }[] = [];
    
    articles
      .filter((a) => a.isBreaking)
      .slice(0, 5)
      .forEach((a) => list.push({ id: a.id, title: a.title, article: a }));

    [...articles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .forEach((a) => {
        if (!list.some((item) => item.id === a.id)) {
          list.push({ id: a.id, title: a.title, article: a });
        }
      });

    return list;
  }, [articles]);

  // Filtered articles inside the search modal for live results preview
  const searchPreviewArticles = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.location && a.location.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [searchQuery, articles]);

  const speedDuration = React.useMemo(() => {
    if (portalSettings.tickerSpeed === 'paused') return '0s';
    if (portalSettings.tickerSpeed === 'custom') {
      const sec = portalSettings.tickerSpeedSeconds || customSpeedInput || 65;
      return `${sec}s`;
    }
    const map: Record<string, string> = {
      ultra_slow: '140s',
      slow: '90s',
      normal: '65s',
      fast: '35s',
    };
    return map[portalSettings.tickerSpeed || 'slow'] || '90s';
  }, [portalSettings.tickerSpeed, portalSettings.tickerSpeedSeconds, customSpeedInput]);

  const isPaused = portalSettings.tickerSpeed === 'paused';

  // Sequenced and enabled categories according to Admin settings
  const navOrder = portalSettings.headerFooter?.navCategoryOrder || [
    'national',
    'state',
    'politics',
    'business',
    'entertainment',
    'sports',
    'tech',
    'lifestyle',
    'world',
  ];
  const disabledCats = portalSettings.headerFooter?.disabledCategories || [];
  const customCatLabels = portalSettings.headerFooter?.customCategoryLabels || {};

  const activeCategories = React.useMemo(() => {
    return navOrder
      .map((id) => CATEGORIES.find((c) => c.id === id))
      .filter((c): c is (typeof CATEGORIES)[0] => Boolean(c && !disabledCats.includes(c.id)));
  }, [navOrder, disabledCats]);

  // Custom sequenced states
  const customStatesList =
    portalSettings.headerFooter?.customStates && portalSettings.headerFooter.customStates.length > 0
      ? portalSettings.headerFooter.customStates
      : MAJOR_INDIAN_STATES;
  const disabledStatesList = portalSettings.headerFooter?.disabledStates || [];
  const activeStatesList = React.useMemo(() => {
    return customStatesList.filter((s) => !disabledStatesList.includes(s));
  }, [customStatesList, disabledStatesList]);

  // Duplicate trending topics array to ensure smooth continuous marquee sliding
  const duplicatedTopics = React.useMemo(() => {
    const topics = portalSettings.trendingTopics || [];
    return [...topics, ...topics, ...topics];
  }, [portalSettings.trendingTopics]);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. TOP UTILITY STRIP (MOBILE: STRICTLY ONLY E-PAPER, LIVE TV & SOCIAL MEDIA. ALL ELSE HIDDEN) */}
      <div className="w-full bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-1 sm:py-1.5 border-b border-slate-850 select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Date & Time Only (HIDDEN ON MOBILE) */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 shrink-0 py-0.5 font-kd-meta">
            {/* Hindi Date */}
            <div className="flex items-center space-x-1.5 text-slate-200 whitespace-nowrap font-medium">
              <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{todayHindi}</span>
            </div>

            <span className="text-slate-700 hidden sm:inline">•</span>

            {/* Live Real-time Clock */}
            <div className="flex items-center space-x-1.5 text-slate-300 whitespace-nowrap font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs">{currentTime || '11:45 AM'}</span>
            </div>
          </div>

          {/* Mobile & Desktop: Live TV, e-Paper, and Social Media Icons (Bookmarks strictly hidden on mobile) */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 sm:gap-3 font-kd-meta">
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* 1. Live TV Button */}
              {portalSettings.headerFooter?.headerShowLiveTv !== false && onScrollToLiveVideo && (
                <button
                  onClick={onScrollToLiveVideo}
                  className="flex items-center space-x-1 sm:space-x-1.5 bg-red-950/90 hover:bg-red-900 text-red-100 hover:text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-red-700/80 transition text-[11px] sm:text-xs font-bold shadow-2xs relative cursor-pointer group shrink-0"
                  title="लाइव टीवी (Live TV)"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 shrink-0 group-hover:scale-110 transition" />
                  <span className="whitespace-nowrap">Live TV</span>
                </button>
              )}

              {/* 2. e-Paper Button */}
              {portalSettings.headerFooter?.headerShowEPaper !== false && (
                <button
                  onClick={onOpenEPaper}
                  className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition text-[11px] sm:text-xs font-medium shadow-2xs cursor-pointer shrink-0"
                  title="Digital e-Paper (ई-पेपर)"
                >
                  <Newspaper className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                  <span className="whitespace-nowrap">e-Paper</span>
                </button>
              )}
            </div>

            {/* 3. Bookmarks Button (Strictly Hidden on Mobile) */}
            {portalSettings.headerFooter?.headerShowBookmarks !== false && (
              <button
                onClick={onOpenBookmarks}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition text-xs font-medium shadow-2xs relative cursor-pointer shrink-0"
                title="सहेजी गई ख़बरें (Bookmarks)"
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Bookmarks</span>
                {bookmarksCount > 0 && (
                  <span className="bg-red-600 text-white rounded-full text-[9px] px-1.5 min-w-[15px] h-[15px] flex items-center justify-center font-bold">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            )}

            {/* 3.05 Read Later Queue Button */}
            {onOpenReadLater && (
              <button
                onClick={onOpenReadLater}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-indigo-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition text-[11px] sm:text-xs font-medium shadow-2xs relative cursor-pointer shrink-0"
                title="बाद में पढ़ें (Read Later Queue) - ऑफ़लाइन व क्लाउड सिंक"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">Read Later</span>
                <span className="sm:hidden">रीड लेटर</span>
                {readLaterCount > 0 && (
                  <span className="bg-indigo-600 text-white rounded-full text-[9px] px-1.5 min-w-[15px] h-[15px] flex items-center justify-center font-bold">
                    {readLaterCount}
                  </span>
                )}
              </button>
            )}

            {/* 3.1 Quick Font Size Control & Reset (A / A+ / A++) */}
            {onChangeFontSize && (
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 space-x-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeFontSize('normal')}
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition cursor-pointer ${
                    fontSize === 'normal'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="सामान्य फ़ॉन्ट आकार (Default Normal Font Size 100%)"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFontSize('large')}
                  className={`px-1.5 py-0.5 text-xs font-bold rounded transition cursor-pointer ${
                    fontSize === 'large'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="बड़ा फ़ॉन्ट आकार (Large Font Size)"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFontSize('xlarge')}
                  className={`px-1.5 py-0.5 text-xs font-black rounded transition cursor-pointer ${
                    fontSize === 'xlarge'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="विशाल फ़ॉन्ट आकार (Extra Large Font Size)"
                >
                  A++
                </button>
                {onResetTypography && (
                  <button
                    type="button"
                    onClick={onResetTypography}
                    className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition cursor-pointer border-l border-slate-800"
                    title="सभी फ़ॉन्ट व आकार डिफ़ॉल्ट पर रीसेट करें (Reset All Fonts & Font Size to Default)"
                  >
                    <RotateCcw className="w-3 h-3 inline" />
                  </button>
                )}
              </div>
            )}

            {/* 3.11 Typography / Font Size Customizer Button */}
            {onOpenTypography && (
              <button
                onClick={onOpenTypography}
                className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-rose-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition text-[11px] sm:text-xs font-medium shadow-2xs cursor-pointer shrink-0"
                title="फ़ॉन्ट व लिखावट अनुकूलन (Font & Typography Settings)"
              >
                <Type className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="hidden xs:inline">फ़ॉन्ट</span>
              </button>
            )}

            {/* 3.15 Daily Newspaper Sudoku Game Button */}
            {onOpenSudokuGame && (
              <button
                onClick={onOpenSudokuGame}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition text-[11px] sm:text-xs font-medium shadow-2xs cursor-pointer shrink-0"
                title="दैनिक सुडोकू पहेली (Daily Sudoku Puzzle) - पेंसिल मोड व Undo के साथ"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden xs:inline">सुडोकू</span>
              </button>
            )}

            {/* 3.2 Staff / Admin Quick Access Trigger */}
            {isAdmin ? (
              <button
                onClick={() => {
                  if (onOpenAdminBackend) onOpenAdminBackend();
                  else onOpenAdminSettings('dashboard');
                }}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer shrink-0"
                title="मुख्य व्यवस्थापक स्टूडियो (Admin Hub)"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-200" />
                <span className="font-kd-meta">👑 एडमिन हब</span>
              </button>
            ) : isStaff ? (
              <button
                onClick={onOpenPublisherCMS}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer shrink-0"
                title="संपादकीय न्यूज़रूम (Newsroom Desk)"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-kd-meta">न्यूज़रूम</span>
              </button>
            ) : onOpenStaffLogin ? (
              <button
                onClick={onOpenStaffLogin}
                className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-700 transition text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer shrink-0"
                title="संपादक एवं व्यवस्थापक लॉगिन (Staff & Admin Login)"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span className="font-kd-meta">एडमिन लॉगिन</span>
              </button>
            ) : null}

            {/* Divider before Social Media Icons (Strictly Hidden on Mobile) */}
            <span className="text-slate-800 hidden sm:inline">|</span>

            {/* 4. Social Media Icons (Visible on Mobile & Desktop) */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              {/* WhatsApp */}
              <a
                href={socialLinks.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={socialLinks.telegramChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#229ED9] hover:bg-[#1f8fc4] active:scale-95 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                title="Telegram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-slate-900 hover:bg-black active:scale-95 text-white border border-slate-700 flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                title="X (Twitter)"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#FF0000] hover:bg-[#e60000] active:scale-95 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Custom Social Channels */}
              {portalSettings.headerFooter?.customSocialChannels
                ?.filter((c) => c.enabled && c.url)
                .map((ch) => (
                  <a
                    key={ch.id}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-6 px-2 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform hover:scale-105"
                    title={ch.platform}
                  >
                    <span>{ch.platform}</span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD WITH STRICT HORIZONTALLY CENTERED LOGO AND SEARCH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 grid grid-cols-3 items-center border-b border-slate-100 relative">
        {/* Left Column: Mobile Menu Toggle ONLY */}
        <div className="flex items-center space-x-2 sm:space-x-3 justify-self-start">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex items-center space-x-1.5 p-1 text-slate-800 hover:text-red-600 transition cursor-pointer group bg-transparent border-0 shadow-none outline-none"
            aria-label="मेनू खोलें"
            title="मेनू खोलें (Menu)"
          >
            <Menu className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Center Column (STRICTLY CENTERED LOGO AS REQUESTED) */}
        <div
          className="flex flex-col items-center justify-center text-center justify-self-center cursor-pointer group select-none min-w-0"
          onClick={() => {
            onSelectCategory('all');
            onSearchChange('');
            if (onBackToHome) onBackToHome();
          }}
        >
          {portalSettings.headerFooter?.logoUrl ? (
            <div className="flex flex-col items-center justify-center py-0.5">
              <img
                src={portalSettings.headerFooter.logoUrl}
                alt={siteTitle}
                style={{
                  height: `${portalSettings.headerFooter?.headerLogoHeight || portalSettings.typography?.headerLogoHeightPx || 52}px`,
                  maxHeight: '90px',
                }}
                className="w-auto object-contain transition-all duration-200"
              />
              {portalSettings.headerFooter?.showSiteTitleText && (
                <span
                  style={{
                    fontSize: portalSettings.headerFooter?.headerTitleCustomPx || portalSettings.typography?.headerTitleCustomPx
                      ? `${portalSettings.headerFooter?.headerTitleCustomPx || portalSettings.typography?.headerTitleCustomPx}px`
                      : undefined,
                  }}
                  className="text-base sm:text-lg font-black font-kd-header tracking-tight text-slate-900 group-hover:text-red-700 transition"
                >
                  {siteTitle}
                </span>
              )}
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide -mt-0.5 whitespace-nowrap font-kd-meta">
                {siteTagline}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h1
                  style={{
                    fontSize: portalSettings.headerFooter?.headerTitleCustomPx || portalSettings.typography?.headerTitleCustomPx
                      ? `${portalSettings.headerFooter?.headerTitleCustomPx || portalSettings.typography?.headerTitleCustomPx}px`
                      : undefined,
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black font-kd-header tracking-tight text-slate-900 group-hover:text-red-700 transition"
                >
                  {siteTitle}
                </h1>
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide -mt-0.5 whitespace-nowrap font-kd-meta">
                {siteTagline}
              </p>
            </>
          )}
        </div>

        {/* Right Column (aligned right): SEARCH + STAFF CMS / ADMIN SETTINGS */}
        <div className="flex items-center space-x-2 justify-self-end">
          {/* Desktop Search Input (Clean, streamlined, no card box background) */}
          <div className="hidden md:flex items-center relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="ख़बरें खोजें..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-36 lg:w-52 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs pl-8 pr-7 py-1.5 rounded-full border border-slate-200/90 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none font-medium text-slate-800 placeholder-slate-400 shadow-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-slate-400 hover:text-red-600 text-xs font-bold cursor-pointer"
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Button (Toggles mobile-tailored search strip below header) */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden flex items-center p-1.5 text-slate-700 hover:text-red-600 transition cursor-pointer bg-transparent border-0 shadow-none"
            title="Search News (ख़बरें खोजें)"
          >
            <Search className={`w-5 h-5 ${mobileSearchOpen || searchQuery ? 'text-red-600' : 'text-slate-700'}`} />
          </button>

          {/* Editorial / Write news CMS button */}
          {(isStaff || isAdmin) && (
            <button
              onClick={onOpenPublisherCMS}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Editorial Desk - Compose News"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Newsroom</span>
              <span className="sm:hidden">Write</span>
            </button>
          )}

          {/* Admin Header & Branding Settings Button or Staff Login Trigger */}
          {isAdmin ? (
            <button
              onClick={() => {
                if (onOpenAdminBackend) onOpenAdminBackend();
                else onOpenAdminSettings('header');
              }}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 shadow-xs transition cursor-pointer"
              title="Admin Panel & Header Settings"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Admin Panel</span>
            </button>
          ) : (
            onOpenStaffLogin && (
              <button
                onClick={onOpenStaffLogin}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-700 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 hover:border-red-300 shadow-xs transition cursor-pointer"
                title="एडमिन एवं स्टाफ लॉगिन (Staff & Admin Access)"
              >
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">एडमिन / स्टाफ</span>
                <span className="sm:hidden">एडमिन</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* MOBILE SEARCH STRIP (Toggled on mobile via search button, perfectly tailored for phones) */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-2.5 px-4 animate-fadeIn shadow-xs font-kd-body">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-red-600 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              autoFocus
              placeholder="ख़बरें, मुद्दे या शहर खोजें..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-100 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-300 focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none text-slate-800 font-medium"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-red-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            ) : (
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Mobile Trending Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none text-[11px] font-kd-meta">
            <span className="text-[10px] text-slate-400 font-bold shrink-0">ट्रेंडिंग:</span>
            {(portalSettings.trendingTopics || ['#Budget2026', '#Election2026', '#Cricket', '#TechNews']).slice(0, 4).map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSearchChange(t.replace(/^#/, ''));
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:text-red-600 hover:bg-red-50 text-[10px] whitespace-nowrap cursor-pointer shrink-0 border border-slate-200"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH MODAL / DIALOG OVERLAY (CLEAN, POWERFUL, INSTANT SEARCH) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-fadeIn font-kd-body">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[85vh]">
            {/* Modal Search Header */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-red-600 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search topics, news stories, leaders, or sports..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trending Quick Search Tags inside Search Modal */}
            <div className="p-3 sm:p-4 bg-white border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-kd-meta">
                Trending Topics (Click to search):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(portalSettings.trendingTopics || []).map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSearchChange(topic.replace(/^#/, ''));
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-xs font-medium transition cursor-pointer font-kd-meta"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Results Preview inside Modal */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
              {searchQuery.trim() ? (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-kd-meta">
                    <span>
                      Results for "{searchQuery}" ({searchPreviewArticles.length})
                    </span>
                    <button
                      onClick={() => setSearchModalOpen(false)}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      View all results on homepage →
                    </button>
                  </div>

                  {searchPreviewArticles.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
                      No stories found. Try searching with different keywords.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchPreviewArticles.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => {
                            onSelectArticle(art);
                            setSearchModalOpen(false);
                          }}
                          className="flex items-start gap-3 p-2.5 bg-white hover:bg-red-50/50 rounded-xl border border-slate-200/80 transition cursor-pointer group"
                        >
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-16 h-14 sm:w-20 sm:h-16 rounded-lg object-cover shrink-0 bg-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-red-600 uppercase font-kd-meta">
                              {art.category} {art.location && `• ${art.location}`}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 font-kd-headline leading-snug">
                              {art.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block font-kd-meta">
                              {formatHindiTimeAgo(art.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  किसी भी विषय, शीर्षक या स्थान का नाम लिखकर तुरंत खोजें।
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-3 border-t border-slate-200 flex justify-between items-center text-xs font-kd-meta">
              <span className="text-slate-500">
                {searchQuery ? `खोज परिणाम` : 'समाचार खोजें'}
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg font-semibold cursor-pointer"
              >
                खोज बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CATEGORY NAVIGATION & DESKTOP MEGA MENU */}
      <nav className="w-full bg-slate-900 text-white border-t border-slate-800 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div
            style={{
              fontSize: portalSettings.typography?.navLinkFontSizePx
                ? `${portalSettings.typography.navLinkFontSizePx}px`
                : undefined,
            }}
            className="hidden md:flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none font-kd-meta"
          >
            {/* 1. HOMEPAGE BUTTON */}
            <button
              type="button"
              onClick={() => {
                setDesktopMegaMenuOpen(false);
                onSelectCategory('all');
                onSearchChange('');
                if (onBackToHome) onBackToHome();
              }}
              className={`px-3 py-1.5 text-sm font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 shrink-0 mr-1 ${
                currentCategory === 'all' && !searchQuery
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="होमपेज (Homepage)"
            >
              <Home className="w-4 h-4" />
              <span>होम</span>
            </button>

            {/* 2. HOVER-BASED MEGA MENU TRIGGER ('प्रमुख ख़बरें') */}
            <div
              className="relative z-50 flex items-center shrink-0"
              onMouseEnter={handleMouseEnterMegaMenu}
              onMouseLeave={handleMouseLeaveMegaMenu}
            >
              <button
                ref={megaMenuTriggerRef}
                data-megamenu-trigger="true"
                type="button"
                onClick={() => setDesktopMegaMenuOpen((prev) => !prev)}
                className={`px-3 py-1.5 text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 shrink-0 mr-1.5 rounded-lg ${
                  desktopMegaMenuOpen
                    ? 'text-amber-400 font-black bg-slate-800/80 shadow-2xs'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800/50'
                }`}
                title="प्रमुख ख़बरें (Hover or click to view top news & categories)"
              >
                <Layout className="w-4 h-4 text-amber-400" />
                <span>प्रमुख ख़बरें</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopMegaMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
            </div>

            {/* 3. LOGICALLY SEQUENCED NEWS CATEGORIES (CONFIGURED BY ADMIN) */}
            {activeCategories.filter((cat) => cat.id !== 'all').map((cat) => {
              const catDisplayLabel = customCatLabels[cat.id] || cat.labelHindi;
              if (cat.id === 'state') {
                const isActive = currentCategory === 'state' || (Boolean(searchQuery) && activeStatesList.includes(searchQuery));
                return (
                  <div
                    key={cat.id}
                    className="relative z-50 flex items-center shrink-0"
                    onMouseEnter={handleMouseEnterStatesMenu}
                    onMouseLeave={handleMouseLeaveStatesMenu}
                  >
                    <button
                      ref={statesTriggerRef}
                      type="button"
                      onClick={() => {
                        setStatesMenuOpen((prev) => !prev);
                        setDesktopMegaMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1 shrink-0 ${
                        statesMenuOpen || isActive
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="राज्य समाचार (Hover to view all states by region)"
                    >
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{catDisplayLabel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${statesMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
                    </button>
                  </div>
                );
              }

              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setDesktopMegaMenuOpen(false);
                    setStatesMenuOpen(false);
                    onSelectCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {catDisplayLabel}
                </button>
              );
            })}

            {/* 4. LIVE COVERAGE DEDICATED BUTTON */}
            {portalSettings.headerFooter?.headerShowLiveCoverage !== false &&
              portalSettings.homepageSections?.headerLiveFeedLink !== false &&
              onOpenLiveFeed && (
              <button
                onClick={() => {
                  setDesktopMegaMenuOpen(false);
                  onOpenLiveFeed();
                }}
                className="px-3 py-1.5 text-sm font-bold rounded-lg transition whitespace-nowrap cursor-pointer bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 shadow-xs shrink-0 mr-1 ml-1"
                title="Live News Updates & Coverage"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <Radio className="w-4 h-4" />
                <span>Live Coverage</span>
              </button>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto py-1.5 scrollbar-none w-full font-kd-meta">
            {/* Mobile Homepage Button */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                if (onBackToHome) onBackToHome();
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1 shrink-0 ${
                currentCategory === 'all' && !searchQuery
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>होम</span>
            </button>

            {/* Mobile Live Coverage Button */}
            {portalSettings.headerFooter?.headerShowLiveCoverage !== false &&
              portalSettings.homepageSections?.headerLiveFeedLink !== false &&
              onOpenLiveFeed && (
              <button
                onClick={onOpenLiveFeed}
                className="px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap bg-red-600 text-white flex items-center space-x-1 shrink-0 shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <Radio className="w-3 h-3" />
                <span>LIVE</span>
              </button>
            )}

            {activeCategories.filter((cat) => cat.id !== 'all').map((cat) => {
              const catDisplayLabel = customCatLabels[cat.id] || cat.labelHindi;
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition whitespace-nowrap ${
                    isActive ? 'bg-red-600 text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  {catDisplayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* BACKDROP OVERLAY WHEN DESKTOP MEGA MENU IS OPEN (Positioned safely below nav so cursor never leaves nav bar) */}
        {desktopMegaMenuOpen && (
          <div
            className="hidden md:block fixed inset-x-0 bottom-0 top-[100%] bg-slate-950/45 backdrop-blur-2xs z-30 transition-opacity cursor-pointer"
            onClick={() => setDesktopMegaMenuOpen(false)}
          />
        )}

        {/* DESKTOP MEGA MENU DROPDOWN PANEL (HOVER-PERSISTENT WITH RICH NEWS CARDS & STATE DIRECTORY) */}
        {desktopMegaMenuOpen && (
          <div
            ref={megaMenuRef}
            onMouseEnter={handleMouseEnterMegaMenu}
            onMouseLeave={handleMouseLeaveMegaMenu}
            className="hidden md:block absolute left-0 right-0 top-full bg-white text-slate-900 border-b-4 border-red-600 shadow-2xl z-50 border-t border-slate-200 animate-fadeIn font-kd-meta"
          >
            {/* Top Toolbar with Clear Title 'प्रमुख ख़बरें', Quick Category Switcher and Close Button */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h3 className="font-bold text-sm sm:text-base font-kd-headline text-slate-900 tracking-wide flex items-center gap-2">
                  <span>प्रमुख ख़बरें</span>
                  <span className="text-[10px] font-medium text-slate-500 font-kd-meta hidden lg:inline">• ताज़ा व मुख्य समाचार</span>
                </h3>
              </div>

              {/* Quick Category Filter Tabs inside Mega Menu */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">विषय:</span>
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setMegaMenuCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                      megaMenuCategory === cat.id
                        ? 'bg-red-600 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat.labelHindi}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDesktopMegaMenuOpen(false)}
                className="bg-slate-200 hover:bg-red-600 hover:text-white text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-2xs shrink-0"
                title="बंद करें (Esc)"
              >
                <X className="w-3.5 h-3.5" />
                <span>बंद करें</span>
              </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
              <div className="grid grid-cols-12 gap-5">
                {/* COLUMNS 1-6: TOP NEWS CARDS (CLICKING OPENS THE ARTICLE DIRECTLY) */}
                <div className="col-span-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-kd-headline">
                        {megaMenuCategory === 'all'
                          ? 'ताज़ा प्रमुख समाचार'
                          : `${CATEGORIES.find((c) => c.id === megaMenuCategory)?.labelHindi || 'प्रमुख'} समाचार`}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCategory(megaMenuCategory);
                        setDesktopMegaMenuOpen(false);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <span>सभी ख़बरें देखें</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {megaMenuArticles.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Lead Story */}
                      {megaMenuArticles[0] && (
                        <div
                          onClick={() => {
                            onSelectArticle(megaMenuArticles[0]);
                            setDesktopMegaMenuOpen(false);
                          }}
                          className="col-span-2 group bg-slate-50 hover:bg-red-50/50 p-2.5 rounded-xl border border-slate-200 hover:border-red-300 transition cursor-pointer flex gap-3.5 items-center"
                        >
                          <div className="w-36 h-24 rounded-lg overflow-hidden bg-slate-200 shrink-0 relative">
                            <img
                              src={megaMenuArticles[0].imageUrl}
                              alt={megaMenuArticles[0].title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              {megaMenuArticles[0].category}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition font-kd-headline leading-snug">
                              {megaMenuArticles[0].title}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {megaMenuArticles[0].summary}
                            </p>
                            <div className="text-[10px] text-slate-400 font-kd-meta pt-0.5 flex items-center gap-2">
                              <span>{formatHindiTimeAgo(megaMenuArticles[0].createdAt)}</span>
                              {megaMenuArticles[0].location && <span>• {megaMenuArticles[0].location}</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Secondary Stories */}
                      {megaMenuArticles.slice(1, 5).map((art) => (
                        <div
                          key={art.id}
                          onClick={() => {
                            onSelectArticle(art);
                            setDesktopMegaMenuOpen(false);
                          }}
                          className="group bg-white hover:bg-slate-50 p-2 rounded-xl border border-slate-200/90 hover:border-slate-300 transition cursor-pointer flex gap-2.5 items-center"
                        >
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-16 h-14 rounded-lg object-cover bg-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-red-600 uppercase block">
                              {art.category}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition leading-snug">
                              {art.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {formatHindiTimeAgo(art.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">कोई खबर उपलब्ध नहीं है।</p>
                  )}
                </div>

                {/* COLUMNS 7-9: TRENDING HEADLINES PREVIEW */}
                <div className="col-span-3 space-y-3 border-l border-slate-200 pl-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-kd-headline">
                      ट्रेंडिंग सुर्खियां
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {megaTrendingArticles.map((art, idx) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onSelectArticle(art);
                          setDesktopMegaMenuOpen(false);
                        }}
                        className="flex items-start space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer group"
                      >
                        <div className="w-12 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200">
                          <img
                            src={art.imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-0 left-0 bg-red-600 text-[8px] font-black text-white px-1">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-red-600 font-bold uppercase block">
                            {art.category}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition leading-tight">
                            {art.title}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNS 10-12: REGIONAL STATES DIRECTORY & QUICK SERVICES */}
                <div className="col-span-3 space-y-3 border-l border-slate-200 pl-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-kd-headline">
                        राज्य समाचार
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">प्रमुख राज्य</span>
                  </div>

                  {/* Quick Major States Grid */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                    {MAJOR_INDIAN_STATES.slice(0, 12).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onSearchChange(st);
                          onSelectCategory('all');
                          setDesktopMegaMenuOpen(false);
                        }}
                        className="text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200/80 transition cursor-pointer truncate"
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Services & Quick Links */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <button
                      onClick={() => {
                        onOpenEPaper();
                        setDesktopMegaMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 flex items-center justify-between border border-amber-200 transition cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Newspaper className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold">ई-पेपर (E-Paper)</span>
                      </div>
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">पढ़ें ➔</span>
                    </button>

                    {onOpenLiveFeed && (
                      <button
                        onClick={() => {
                          onOpenLiveFeed();
                          setDesktopMegaMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-950 flex items-center justify-between border border-red-200 transition cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Radio className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-xs font-bold">लाइव कवरेज</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BACKDROP OVERLAY WHEN STATES MEGA MENU IS OPEN */}
        {statesMenuOpen && (
          <div
            className="hidden md:block fixed inset-x-0 bottom-0 top-[100%] bg-slate-950/45 backdrop-blur-2xs z-30 transition-opacity cursor-pointer"
            onClick={() => setStatesMenuOpen(false)}
          />
        )}

        {/* DESKTOP STATES MEGA MENU DROPDOWN (ALL STATES GROUPED BY REGION WITH COLOR BADGES) */}
        {statesMenuOpen && (
          <div
            ref={statesMenuRef}
            onMouseEnter={handleMouseEnterStatesMenu}
            onMouseLeave={handleMouseLeaveStatesMenu}
            className="hidden md:block absolute left-0 right-0 top-full bg-white text-slate-900 border-b-4 border-red-600 shadow-2xl z-50 border-t border-slate-200 animate-fadeIn font-kd-meta"
          >
            {/* Top Bar inside States Menu */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h3 className="font-bold text-sm sm:text-base font-kd-headline text-slate-900 tracking-wide flex items-center gap-2">
                  <span>📍 भारत के सभी राज्य व केंद्र शासित प्रदेश</span>
                </h3>
              </div>

              {/* Popular States Quick Tags */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                {activeStatesList.slice(0, 10).map((stName) => {
                  const stateIcons: Record<string, string> = {
                    'उत्तर प्रदेश': '🚩',
                    'बिहार': '🌿',
                    'मध्य प्रदेश': '🌲',
                    'राजस्थान': '🏰',
                    'दिल्ली': '🏛️',
                    'दिल्ली NCR': '🏛️',
                    'पंजाब': '🌾',
                    'हरियाणा': '🏙️',
                    'महाराष्ट्र': '⚡',
                    'गुजरात': '🦁',
                    'उत्तराखंड': '⛰️',
                    'झारखंड': '⛏️',
                    'छत्तीसगढ़': '🏞️',
                  };
                  const icon = stateIcons[stName] || '📍';
                  return (
                    <button
                      key={stName}
                      type="button"
                      onClick={() => {
                        onSearchChange(stName);
                        onSelectCategory('all');
                        setStatesMenuOpen(false);
                        if (onBackToHome) onBackToHome();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 flex items-center space-x-1 ${
                        searchQuery === stName
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200'
                      }`}
                    >
                      <span>{icon}</span>
                      <span>{stName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {onOpenAllStatesModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatesMenuOpen(false);
                      onOpenAllStatesModal();
                    }}
                    className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-red-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>विस्तृत डायरेक्टरी</span>
                    <span>→</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStatesMenuOpen(false)}
                  className="bg-slate-200 hover:bg-red-600 hover:text-white text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>बंद करें</span>
                </button>
              </div>
            </div>

            {/* 5 Geographic Regions Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 sm:gap-4">
                {ALL_INDIAN_STATES_BY_REGION.map((reg) => (
                  <div key={reg.regionShort} className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-2">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${reg.dotClass}`}></span>
                          <h4 className="text-xs font-bold text-slate-900 font-kd-headline truncate">
                            {reg.region}
                          </h4>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${reg.badgeClass}`}>
                          {reg.states.length}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {reg.states.map((st) => {
                          const isSelected = searchQuery === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                onSearchChange(st);
                                onSelectCategory('all');
                                setStatesMenuOpen(false);
                                if (onBackToHome) onBackToHome();
                              }}
                              className={`w-full text-left px-2 py-1 rounded-md text-xs transition cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-red-600 text-white font-bold'
                                  : 'text-slate-700 hover:text-red-600 hover:bg-white'
                              }`}
                            >
                              <span className="truncate">{st}</span>
                              {isSelected && <span className="text-[10px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 3. BREAKING NEWS TICKER (POSITIONED DIRECTLY BELOW NAVIGATION BAR & ABOVE TRENDING BAR) */}
      <div
        style={{
          fontSize: portalSettings.typography?.tickerFontSizePx
            ? `${portalSettings.typography.tickerFontSizePx}px`
            : undefined,
        }}
        className="w-full bg-red-700 text-white py-1.5 text-xs sm:text-sm flex items-center shadow-inner overflow-hidden font-kd-headline"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0 mr-3">
            <span className="flex items-center space-x-1 bg-white text-red-700 px-2.5 py-0.5 rounded font-black text-xs tracking-wide uppercase shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>बड़ी ख़बर</span>
            </span>

            {/* Ticker Speed Quick Controller */}
            <div className="relative">
              <button
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                className="p-1 rounded hover:bg-red-800 text-white/90 text-xs flex items-center space-x-1 border border-red-500/50 cursor-pointer"
                title={`Ticker Speed: ${
                  portalSettings.tickerSpeed === 'ultra_slow'
                    ? 'Ultra Slow (140s)'
                    : portalSettings.tickerSpeed === 'slow'
                    ? 'Slow (90s - Recommended)'
                    : portalSettings.tickerSpeed === 'normal'
                    ? 'Normal (65s)'
                    : portalSettings.tickerSpeed === 'fast'
                    ? 'Fast (35s)'
                    : portalSettings.tickerSpeed === 'custom'
                    ? `Custom (${portalSettings.tickerSpeedSeconds || 90}s)`
                    : 'Paused'
                }`}
              >
                {isPaused ? <Pause className="w-3 h-3 text-amber-300" /> : <FastForward className="w-3 h-3" />}
                <span className="hidden xs:inline text-[10px] font-sans font-semibold">
                  {portalSettings.tickerSpeed === 'ultra_slow'
                    ? '140s'
                    : portalSettings.tickerSpeed === 'slow'
                    ? '90s'
                    : portalSettings.tickerSpeed === 'normal'
                    ? '65s'
                    : portalSettings.tickerSpeed === 'fast'
                    ? '35s'
                    : portalSettings.tickerSpeed === 'custom'
                    ? `${portalSettings.tickerSpeedSeconds || 90}s`
                    : 'Paused'}
                </span>
              </button>

              {speedMenuOpen && (
                <div className="absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs z-50 flex flex-col space-y-1 min-w-[170px]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase px-2 py-0.5 border-b border-slate-800">
                    स्लाइडिंग गति (Ticker Speed)
                  </span>
                  {[
                    { id: 'ultra_slow', label: 'Ultra Slow (140s)' },
                    { id: 'slow', label: 'Slow (90s - अनुशंसित)' },
                    { id: 'normal', label: 'Normal (65s)' },
                    { id: 'fast', label: 'Fast (35s)' },
                    { id: 'paused', label: 'Pause Ticker' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      onClick={() => {
                        onUpdateSettings({ tickerSpeed: spd.id as any });
                        setSpeedMenuOpen(false);
                        setShowCustomSpeedForm(false);
                      }}
                      className={`text-left px-2.5 py-1 rounded-lg transition flex items-center justify-between cursor-pointer ${
                        portalSettings.tickerSpeed === spd.id
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{spd.label}</span>
                      {portalSettings.tickerSpeed === spd.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}

                  {/* Custom Speed in seconds */}
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => setShowCustomSpeedForm(!showCustomSpeedForm)}
                      className={`w-full text-left px-2.5 py-1 rounded-lg transition flex items-center justify-between text-amber-300 hover:bg-slate-800 cursor-pointer ${
                        portalSettings.tickerSpeed === 'custom' ? 'bg-amber-950/60 font-bold' : ''
                      }`}
                    >
                      <span>⚙️ Custom Speed</span>
                      {portalSettings.tickerSpeed === 'custom' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    {showCustomSpeedForm && (
                      <div className="p-2 mt-1 bg-slate-950 rounded-lg space-y-1.5 border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Duration (20s - 180s):</span>
                          <span className="font-mono text-white font-bold">{customSpeedInput}s</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="180"
                          step="5"
                          value={customSpeedInput}
                          onChange={(e) => setCustomSpeedInput(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-red-600"
                        />
                        <button
                          onClick={() => {
                            onUpdateSettings({
                              tickerSpeed: 'custom',
                              tickerSpeedSeconds: customSpeedInput,
                            });
                            setSpeedMenuOpen(false);
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 rounded transition cursor-pointer"
                        >
                          Apply ({customSpeedInput}s)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Marquee Content */}
          <div className="flex-1 overflow-hidden whitespace-nowrap relative">
            <div
              style={{
                animation: isPaused ? 'none' : `marquee ${speedDuration} linear infinite`,
              }}
              className="inline-block hover:[animation-play-state:paused]"
            >
              {recentBreakingHeadlines.map((item, idx) => (
                <span
                  key={idx}
                  onClick={() => item.article && onSelectArticle(item.article)}
                  className="mx-5 font-medium tracking-wide hover:underline cursor-pointer inline-flex items-center text-xs sm:text-sm text-white"
                >
                  <span className="text-amber-300 mr-2 font-bold">●</span>
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRENDING TOPICS SLIDING STRIP (POSITIONED DIRECTLY BELOW NEWS TICKER) */}
      <div className="w-full bg-slate-100/95 border-b border-slate-200 text-slate-700 py-1.5 text-xs sm:text-sm overflow-hidden font-kd-meta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Label Badge */}
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 shrink-0 text-xs uppercase tracking-wider bg-slate-200/90 px-2.5 py-1 rounded-md z-10 shadow-2xs font-kd-meta">
            <Hash className="w-3.5 h-3.5 text-red-600" />
            <span>ट्रेंडिंग:</span>
          </div>

          {/* Continuous Sliding Container */}
          <div className="flex-1 overflow-hidden relative mx-2">
            <div className="animate-trending-slide flex items-center space-x-3 py-0.5">
              {duplicatedTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onSearchChange(topic.replace(/^#/, ''))}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-slate-200 text-xs sm:text-[13px] font-semibold transition cursor-pointer shrink-0 shadow-2xs font-kd-meta"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Edit button - Only visible for Admin */}
          {isAdmin && (
            <button
              onClick={onOpenAdminSettings}
              className="hidden sm:inline-flex text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded font-bold shrink-0 font-kd-meta z-10 transition cursor-pointer"
              title="Edit Trending Topics & Portal Settings (Admin Only)"
            >
              Edit ✎
            </button>
          )}
        </div>
      </div>

      {/* FULL SLIDE-OVER SIDEBAR DRAWER (ALL WEBSITE PAGES ACCESSIBLE VIA SIDEBAR MENU) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-kd-meta animate-fadeIn">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div
              style={{
                fontFamily: mobileSidebarConfig.fontFamily || undefined,
              }}
              className="w-screen max-w-xs sm:max-w-sm bg-white text-slate-800 shadow-2xl flex flex-col border-r border-slate-200"
            >
              {/* Drawer Header (Light Theme) with uploaded logo or favicon - Zero Hindi menu text */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div
                  className="flex items-center space-x-2.5 cursor-pointer select-none"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onBackToHome) onBackToHome();
                  }}
                >
                  {mobileSidebarConfig.showLogo !== false && (
                    portalSettings.headerFooter?.logoUrl ? (
                      <img
                        src={portalSettings.headerFooter.logoUrl}
                        alt={siteTitle}
                        className="h-8 sm:h-9 w-auto max-w-[150px] object-contain"
                      />
                    ) : portalSettings.headerFooter?.faviconUrl ? (
                      <img
                        src={portalSettings.headerFooter.faviconUrl}
                        alt={siteTitle}
                        className="w-8 h-8 rounded-lg object-contain bg-slate-200 p-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-sm">
                        K
                      </div>
                    )
                  )}

                  {mobileSidebarConfig.showSiteTitle !== false && (
                    <div>
                      <h3 className="font-black text-sm sm:text-base font-kd-header tracking-tight text-slate-900 leading-none">
                        {siteTitle}
                      </h3>
                      {portalSettings.headerFooter?.siteTagline && (
                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-[170px] mt-0.5">
                          {portalSettings.headerFooter.siteTagline}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content: 2-Column Clean Layout */}
              <div
                className={`flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 scrollbar-thin bg-white ${
                  mobileSidebarConfig.fontSize === 'sm'
                    ? 'text-xs'
                    : mobileSidebarConfig.fontSize === 'large'
                    ? 'text-base'
                    : 'text-sm'
                }`}
              >
                {/* 0. READER BOOKMARKS & READ LATER QUICK BUTTONS */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBookmarks();
                    }}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition cursor-pointer flex items-center justify-between border border-slate-700 shadow-2xs"
                  >
                    <div className="flex items-center space-x-2">
                      <BookMarked className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">बुकमार्क</span>
                    </div>
                    {bookmarksCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {bookmarksCount}
                      </span>
                    )}
                  </button>

                  {onOpenReadLater && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenReadLater();
                      }}
                      className="p-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl transition cursor-pointer flex items-center justify-between border border-indigo-800 shadow-2xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold">रीड लेटर</span>
                      </div>
                      {readLaterCount > 0 && (
                        <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {readLaterCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* 0.5 READER FONT SIZE & RESET CONTROLS */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center space-x-1">
                      <Type className="w-3.5 h-3.5 text-red-600" />
                      <span>फ़ॉन्ट आकार (Font Size):</span>
                    </span>
                    {onResetTypography && (
                      <button
                        type="button"
                        onClick={() => {
                          onResetTypography();
                          setMobileMenuOpen(false);
                        }}
                        className="text-[10px] font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
                        title="मूल डिफ़ॉल्ट पर रीसेट करें"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>डिफ़ॉल्ट रीसेट</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onChangeFontSize?.('normal')}
                      className={`py-1 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                        fontSize === 'normal'
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      सामान्य (A)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeFontSize?.('large')}
                      className={`py-1 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                        fontSize === 'large'
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      बड़ा (A+)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeFontSize?.('xlarge')}
                      className={`py-1 text-xs font-black rounded-lg border transition cursor-pointer text-center ${
                        fontSize === 'xlarge'
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      विशाल (A++)
                    </button>
                  </div>
                </div>

                {/* 1. NEWS ARCHIVE QUICK ACCESS BUTTON */}
                {onOpenArchivePage && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenArchivePage();
                    }}
                    className="w-full p-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white rounded-xl transition cursor-pointer flex items-center justify-between shadow-xs border border-red-500 font-kd-headline text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black leading-tight text-white">समाचार पुरालेख (Archive)</div>
                        <div className="text-[10px] text-red-100 font-medium">विगत तिथिवार व श्रेणीवार खोजें ➔</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0 ml-1">
                      कैलेंडर
                    </span>
                  </button>
                )}

                {/* 1.5 DAILY NEWSPAPER SUDOKU GAME BUTTON */}
                {onOpenSudokuGame && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSudokuGame();
                    }}
                    className="w-full p-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-98 text-white rounded-xl transition cursor-pointer flex items-center justify-between shadow-xs border border-amber-500 font-kd-headline text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white shadow-2xs">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black leading-tight text-white">दैनिक सुडोकू पहेली (Daily Sudoku)</div>
                        <div className="text-[10px] text-amber-100 font-medium">पेंसिल मोड व Undo के साथ खेलें ➔</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0 ml-1">
                      पहेली
                    </span>
                  </button>
                )}

                {/* 3. ALL NEWS CATEGORIES (2 COLUMNS) */}
                {mobileSidebarConfig.showCategories !== false && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        प्रमुख विषय
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{CATEGORIES.length} विषय</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSelectCategory('all');
                          if (onBackToHome) onBackToHome();
                        }}
                        className={`p-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer border truncate ${
                          currentCategory === 'all'
                            ? 'bg-red-600 text-white font-bold border-red-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-red-50/60 text-slate-700 hover:text-red-700 border-slate-200/80'
                        }`}
                      >
                        <span className="truncate block">ताज़ा ख़बरें (Top)</span>
                      </button>
                      {activeCategories.filter((c) => c.id !== 'all').map((cat) => {
                        const isActive = currentCategory === cat.id;
                        const catDisplayLabel = customCatLabels[cat.id] || cat.labelHindi;

                        if (cat.id === 'state') {
                          return (
                            <div
                              key={cat.id}
                              className="col-span-2 rounded-xl border border-red-200/90 bg-gradient-to-br from-red-50/80 via-white to-amber-50/50 p-2.5 shadow-2xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    onSelectCategory('state');
                                    if (onBackToHome) onBackToHome();
                                  }}
                                  className="flex items-center space-x-1.5 text-xs font-bold text-red-700 hover:text-red-800 cursor-pointer"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                                  <span>{catDisplayLabel} (सभी राज्य)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMobileStatesExpanded((prev) => !prev)}
                                  className="text-[11px] font-bold text-slate-700 bg-white hover:bg-red-50 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>{mobileStatesExpanded ? 'सब-मेनू बंद ▲' : 'सब-मेनू राज्य ▼'}</span>
                                </button>
                              </div>

                              {/* Mobile Submenu States Grid */}
                              {mobileStatesExpanded && (
                                <div className="pt-1.5 border-t border-red-100 space-y-1.5 animate-fadeIn">
                                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                    <span>प्रमुख राज्य सीधे चुनें (Tap State):</span>
                                    {onOpenAllStatesModal && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMobileMenuOpen(false);
                                          onOpenAllStatesModal();
                                        }}
                                        className="text-red-600 font-bold hover:underline"
                                      >
                                        डायरेक्टरी ➔
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto scrollbar-thin py-0.5">
                                    {activeStatesList.map((stateName) => {
                                      const isSelected = searchQuery === stateName;
                                      return (
                                        <button
                                          key={stateName}
                                          type="button"
                                          onClick={() => {
                                            onSearchChange(stateName);
                                            onSelectCategory('all');
                                            setMobileMenuOpen(false);
                                            if (onBackToHome) onBackToHome();
                                          }}
                                          className={`text-[11px] px-2 py-1 rounded-lg font-semibold transition border flex items-center space-x-1 cursor-pointer ${
                                            isSelected
                                              ? 'bg-red-600 text-white font-bold border-red-600 shadow-2xs'
                                              : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200'
                                          }`}
                                        >
                                          <span>{stateName}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              onSelectCategory(cat.id);
                              if (onBackToHome) onBackToHome();
                            }}
                            className={`p-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer border truncate ${
                              isActive
                                ? 'bg-red-600 text-white font-bold border-red-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-red-50/60 text-slate-700 hover:text-red-700 border-slate-200/80'
                            }`}
                          >
                            <span className="truncate block">{catDisplayLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. OFFICIAL CHANNELS & MORE SOCIAL MEDIA (EXPANDED SOCIAL PRESENCE) */}
                {mobileSidebarConfig.showOfficialChannels !== false && (
                  <div className="space-y-2 pt-1 font-kd-meta">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>चैनल एवं सोशल मीडिया (Join Channels)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Connect With Us</span>
                    </span>

                    {/* 4 Branded Channel Cards (WhatsApp, Telegram, Instagram, YouTube) */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* 1. WhatsApp Channel */}
                      {mobileSidebarConfig.showWhatsAppButton !== false && (
                        <a
                          href={socialLinks.whatsappChannel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex items-center justify-between p-2 rounded-xl bg-[#075E54] hover:bg-[#128C7E] active:scale-98 text-white transition-all shadow-xs hover:shadow-md border border-emerald-600/40 cursor-pointer overflow-hidden"
                          title="WhatsApp चैनल जॉइन करें - तुरंत ब्रेकिंग न्यूज़"
                        >
                          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-400/25 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                              </svg>
                            </div>
                            <div className="min-w-0 leading-tight">
                              <div className="text-xs font-black text-white truncate">WhatsApp</div>
                              <div className="text-[10px] text-emerald-200 font-medium truncate">फ्री अपडेट्स</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black bg-white text-emerald-900 px-1.5 py-0.5 rounded shadow-2xs shrink-0 ml-1 group-hover:bg-emerald-100 transition-colors">
                            जॉइन ➔
                          </span>
                        </a>
                      )}

                      {/* 2. Telegram Channel */}
                      {mobileSidebarConfig.showTelegramButton !== false && (
                        <a
                          href={socialLinks.telegramChannel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex items-center justify-between p-2 rounded-xl bg-[#0077b5] hover:bg-[#0088cc] active:scale-98 text-white transition-all shadow-xs hover:shadow-md border border-sky-400/40 cursor-pointer overflow-hidden"
                          title="Telegram अलर्ट्स से जुड़ें - ब्रेकिंग न्यूज़"
                        >
                          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-sky-300/25 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                              </svg>
                            </div>
                            <div className="min-w-0 leading-tight">
                              <div className="text-xs font-black text-white truncate">Telegram</div>
                              <div className="text-[10px] text-sky-200 font-medium truncate">न्यूज़ बुलेटिन</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black bg-white text-sky-900 px-1.5 py-0.5 rounded shadow-2xs shrink-0 ml-1 group-hover:bg-sky-100 transition-colors">
                            जुड़ें ➔
                          </span>
                        </a>
                      )}

                      {/* 3. Instagram Channel / Profile */}
                      <a
                        href={socialLinks.instagram || 'https://instagram.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-between p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 active:scale-98 text-white transition-all shadow-xs hover:shadow-md border border-pink-400/40 cursor-pointer overflow-hidden"
                        title="Instagram पर फॉलो करें - रील्स व फोटो स्टोरीज़"
                      >
                        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div className="min-w-0 leading-tight">
                            <div className="text-xs font-black text-white truncate">Instagram</div>
                            <div className="text-[10px] text-pink-100 font-medium truncate">रील्स व फोटोज़</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-white text-pink-900 px-1.5 py-0.5 rounded shadow-2xs shrink-0 ml-1 group-hover:bg-pink-100 transition-colors">
                          फॉलो ➔
                        </span>
                      </a>

                      {/* 4. YouTube Channel */}
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-between p-2 rounded-xl bg-[#CC0000] hover:bg-[#FF0000] active:scale-98 text-white transition-all shadow-xs hover:shadow-md border border-red-500/40 cursor-pointer overflow-hidden"
                        title="YouTube चैनल सब्सक्राइब करें - वीडियो बुलेटिन"
                      >
                        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </div>
                          <div className="min-w-0 leading-tight">
                            <div className="text-xs font-black text-white truncate">YouTube</div>
                            <div className="text-[10px] text-red-100 font-medium truncate">वीडियो न्यूज़</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-white text-red-900 px-1.5 py-0.5 rounded shadow-2xs shrink-0 ml-1 group-hover:bg-red-100 transition-colors">
                          जुड़ें ➔
                        </span>
                      </a>
                    </div>

                    {/* Social Media Follow Icons (All Supported Platforms) */}
                    {mobileSidebarConfig.showSocialMediaIcons !== false && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span>सोशल मीडिया पर कनेक्ट करें:</span>
                          <span className="text-slate-400">सभी प्लेटफ़ॉर्म</span>
                        </div>
                        <div className="flex items-center justify-start flex-wrap gap-2">
                          {/* Facebook */}
                          <a
                            href={socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                            title="Facebook"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>

                          {/* X / Twitter */}
                          <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-slate-900 text-white border border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                            title="Twitter / X"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>

                          {/* Instagram */}
                          <a
                            href={socialLinks.instagram || 'https://instagram.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                            title="Instagram"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>

                          {/* YouTube */}
                          <a
                            href={socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                            title="YouTube"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={socialLinks.whatsappChannel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                            title="WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                              </svg>
                            </a>

                            {/* Telegram */}
                            <a
                              href={socialLinks.telegramChannel}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-full bg-[#229ED9] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                              title="Telegram"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                              </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                              href="https://linkedin.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-xs"
                              title="LinkedIn"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                            </a>

                            {/* Custom Channels */}
                            {portalSettings?.headerFooter?.customSocialChannels &&
                              portalSettings.headerFooter.customSocialChannels
                                .filter((c) => c.enabled)
                                .map((c) => (
                                  <a
                                    key={c.id}
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold border border-slate-300 transition shadow-2xs"
                                    title={c.platform}
                                  >
                                    {c.platform}
                                  </a>
                                ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. SUBSCRIBER CARD (Light Theme) */}
                {mobileSidebarConfig.showSubscriberCard !== false && onOpenSubscriberModal && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mt-2 text-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4 text-red-600" />
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">News Alert</div>
                        <div className="text-[10px] text-slate-500">लाइव अपडेट्स, दैनिक समाचार एवं विशेष कवरेज</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenSubscriberModal) onOpenSubscriberModal();
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <span>सब्सक्राइब करें (Free Alerts)</span>
                    </button>
                  </div>
                )}

                {/* Authenticated Staff/Admin Session Bar or Login Prompt (Light Theme) */}
                {(isStaff || isAdmin) ? (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="text-[10px] text-amber-700 font-semibold flex items-center justify-between">
                      <span>सक्रिय सत्र: {user?.displayName || staffSession?.name || 'Staff'}</span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded text-[9px] uppercase font-bold">
                        {isAdmin ? 'ADMIN' : 'STAFF'}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (onOpenAdminBackend) onOpenAdminBackend();
                          else onOpenAdminSettings('dashboard');
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs p-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer border border-slate-700"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>👑 एडमिन हब (Admin Panel)</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenPublisherCMS();
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs p-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Newsroom Desk</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (staffSession) logoutStaff();
                        else logout();
                      }}
                      className="w-full text-xs text-red-600 hover:text-red-700 p-1 text-center transition cursor-pointer font-semibold"
                    >
                      साइन आउट करें (Sign Out)
                    </button>
                  </div>
                ) : onOpenStaffLogin ? (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenStaffLogin();
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs p-2.5 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer border border-slate-700 shadow-xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>🔐 स्टाफ व एडमिन लॉगिन (Staff & Admin Access)</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
