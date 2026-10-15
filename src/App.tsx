import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticlePageView } from './components/ArticlePageView';
import { PublisherCMS } from './components/PublisherCMS';
import { AdminBackendPanel } from './components/AdminBackendPanel';
import { BookmarksModal } from './components/BookmarksModal';
import { ReadLaterModal } from './components/ReadLaterModal';
import { EPaperModal } from './components/EPaperModal';
import { AdminSettingsModal, AdminSettingsTab } from './components/AdminSettingsModal';
import { SpotlightHeroSlider } from './components/SpotlightHeroSlider';
import { SpotlightBriefTicker } from './components/SpotlightBriefTicker';
import { PortalPopup } from './components/PortalPopup';
import { NotificationToast } from './components/NotificationToast';
import { VideoSection } from './components/VideoSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { LiveFeedPageView } from './components/LiveFeedPageView';
import { StaffLoginModal } from './components/StaffLoginModal';
import { SubscriberPreferencesModal } from './components/SubscriberPreferencesModal';
import { TypographyCustomizerModal } from './components/TypographyCustomizerModal';
import { AdminFrontendCustomizerBar } from './components/AdminFrontendCustomizerBar';
import { ContactUsPageView } from './components/ContactUsPageView';
import { AboutUsPageView } from './components/AboutUsPageView';
import { SubmitNewsPageView } from './components/SubmitNewsPageView';
import { LegalPolicyPageView, LegalPolicyType } from './components/LegalPolicyPageView';
import { ArchivePageView } from './components/ArchivePageView';
import { DailySudokuModal } from './components/DailySudokuModal';
import {
  NewsArticle,
  NewsBookmark,
  NewsReadLater,
  NewsCategory,
  PortalSettings,
  SubscriberItem,
  PushNotificationItem,
  MediaAsset,
  EditorialUser,
  LiveBlogEvent,
  ContactInquiry,
  CitizenNewsSubmission,
} from './types/news';
import {
  subscribeToArticles,
  subscribeToUserBookmarks,
  toggleBookmark,
  subscribeToUserReadLater,
  toggleReadLater,
  removeReadLaterItem,
  clearAllUserReadLater,
  fetchArticles,
  seedInitialArticlesIfEmpty,
  publishArticle,
  updateArticle,
  deleteArticle,
  subscribeToPortalSettings,
  savePortalSettings,
  seedPortalSettingsIfEmpty,
  submitContactInquiry,
  subscribeToContactInquiries,
  updateContactInquiryStatus,
  deleteContactInquiry,
  subscribeMediaAssets,
  saveMediaAsset,
  updateMediaAssetRecord,
  deleteMediaAssetRecord,
  subscribeLiveBlogs,
  saveLiveBlogRecord,
  updateLiveBlogRecord,
  deleteLiveBlogRecord,
  checkAndPublishScheduledArticles,
} from './services/newsService';
import { CATEGORIES, MAJOR_INDIAN_STATES, ALL_INDIAN_STATES_BY_REGION } from './data/seedNews';
import {
  DEFAULT_PORTAL_SETTINGS,
  DEFAULT_SPOTLIGHT_LAYOUT,
  DEFAULT_ARTICLE_META_SETTINGS,
  INITIAL_SUBSCRIBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_EDITORIAL_USERS,
  INITIAL_LIVE_BLOGS,
  INITIAL_CONTACT_INQUIRIES,
  INITIAL_CITIZEN_SUBMISSIONS,
} from './data/portalDefaults';
import {
  Flame,
  TrendingUp,
  Newspaper,
  ChevronRight,
  Tv,
  Camera,
  ArrowRight,
  PenTool,
  Hash,
  Sliders,
  Bell,
  Sparkles,
  ShieldCheck,
  Radio,
  Clock,
  MapPin,
  X,
  Eye,
  Star,
  Award,
} from 'lucide-react';
import { formatHindiTimeAgo } from './utils/hindiHelpers';
import { useGoogleServices } from './utils/useGoogleServices';
import { resetRootCssVariablesToDefault } from './utils/cssDefaults';

function NewsPortalMain() {
  const { user, isStaff, isAdmin } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [bookmarks, setBookmarks] = useState<NewsBookmark[]>([]);
  const [readLaterItems, setReadLaterItems] = useState<NewsReadLater[]>([]);
  const [currentCategory, setCurrentCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation State: 'home', 'article', 'live-feed', 'contact', 'about', 'legal', 'submit-news', or 'archive' (Full page views as requested, not popup)
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'live-feed' | 'contact' | 'about' | 'legal' | 'submit-news' | 'archive'>('home');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Modals & Panels
  const [showAdminBackend, setShowAdminBackend] = useState(false);
  const [showPublisherCMS, setShowPublisherCMS] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showReadLater, setShowReadLater] = useState(false);
  const [showEPaper, setShowEPaper] = useState(false);
  const [showSudokuModal, setShowSudokuModal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('dashboard');

  const openAdminStudio = (tab: string = 'dashboard') => {
    let targetTab = tab;
    if (tab === 'header' || tab === 'footer') targetTab = 'header_footer';
    else if (tab === 'ads') targetTab = 'monetization';
    else if (tab === 'mobile') targetTab = 'mobile_sidebar';
    setAdminInitialTab(targetTab);
    setShowAdminBackend(true);
  };

  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showAllStatesModal, setShowAllStatesModal] = useState(false);
  const [stateModalTab, setStateModalTab] = useState<'region' | 'popular'>('region');
  const [stateModalSearch, setStateModalSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [activeLegalPolicyType, setActiveLegalPolicyType] = useState<LegalPolicyType>('privacy');

  const handleOpenSpotlightSettings = () => {
    if (!isAdmin) {
      setAdminInitialTab('spotlight');
      setShowStaffLogin(true);
      return;
    }
    openAdminStudio('spotlight');
  };

  // Push Notification Toast state
  const [activePushToast, setActivePushToast] = useState<PushNotificationItem | null>(null);

  // Subscribers state (persisted)
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(() => {
    try {
      const saved = localStorage.getItem('kd_subscribers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUBSCRIBERS;
  });

  // Push Notifications history (persisted)
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('kd_push_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  // Media Assets (persisted)
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('kd_media_assets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEDIA_ASSETS;
  });

  const handleAddMedia = (newMedia: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const item: MediaAsset = {
      ...newMedia,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setMediaAssets((prev) => [item, ...prev]);
    saveMediaAsset(item).catch(() => {});
  };

  const handleDeleteMedia = (id: string) => {
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    deleteMediaAssetRecord(id).catch(() => {});
  };

  const handleUpdateMedia = (updatedMedia: Partial<MediaAsset> & { id: string }) => {
    setMediaAssets((prev) =>
      prev.map((m) => (m.id === updatedMedia.id ? { ...m, ...updatedMedia } : m))
    );
    updateMediaAssetRecord(updatedMedia).catch(() => {});
  };

  // Editorial Team / Users (persisted)
  const [editorialUsers, setEditorialUsers] = useState<EditorialUser[]>(() => {
    try {
      const saved = localStorage.getItem('kd_editorial_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EDITORIAL_USERS;
  });

  const handleAddEditorialUser = (newUser: Omit<EditorialUser, 'id' | 'joinedAt'>) => {
    const item: EditorialUser = {
      ...newUser,
      id: `user-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    };
    setEditorialUsers((prev) => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('kd_editorial_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateEditorialUser = (updatedUser: Partial<EditorialUser> & { id: string }) => {
    setEditorialUsers((prev) => {
      const updated = prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      try {
        localStorage.setItem('kd_editorial_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteEditorialUser = (id: string) => {
    setEditorialUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem('kd_editorial_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Live Blogs & Real-time Political News 2026 state
  const [liveBlogs, setLiveBlogs] = useState<LiveBlogEvent[]>(() => {
    try {
      const saved = localStorage.getItem('kd_live_blogs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LIVE_BLOGS;
  });
  const [activeLiveBlog, setActiveLiveBlog] = useState<LiveBlogEvent | null>(null);

  const handleAddLiveBlog = (newBlog: LiveBlogEvent) => {
    setLiveBlogs((prev) => [newBlog, ...prev]);
    saveLiveBlogRecord(newBlog).catch(() => {});
  };

  const handleUpdateLiveBlog = (updatedBlog: LiveBlogEvent) => {
    setLiveBlogs((prev) =>
      prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
    );
    updateLiveBlogRecord(updatedBlog).catch(() => {});
  };

  const handleDeleteLiveBlog = (id: string) => {
    setLiveBlogs((prev) => prev.filter((b) => b.id !== id));
    deleteLiveBlogRecord(id).catch(() => {});
  };

  // Contact Desk Inquiries (persisted in localStorage)
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kd_contact_inquiries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONTACT_INQUIRIES;
  });

  const handleAddContactInquiry = async (newInq: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>) => {
    try {
      const created = await submitContactInquiry(newInq);
      setContactInquiries((prev) => [created, ...prev.filter((i) => i.id !== created.id)]);
    } catch {
      const item: ContactInquiry = {
        ...newInq,
        id: `inq-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'new',
      };
      setContactInquiries((prev) => {
        const updated = [item, ...prev];
        try {
          localStorage.setItem('kd_contact_inquiries', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleUpdateInquiryStatus = (
    id: string,
    status: ContactInquiry['status'],
    adminNotes?: string
  ) => {
    setContactInquiries((prev) => {
      const updated = prev.map((i) =>
        i.id === id ? { ...i, status, adminNotes: adminNotes !== undefined ? adminNotes : i.adminNotes } : i
      );
      try {
        localStorage.setItem('kd_contact_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    updateContactInquiryStatus(id, status, adminNotes).catch(() => {});
  };

  const handleDeleteInquiry = (id: string) => {
    setContactInquiries((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('kd_contact_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteContactInquiry(id).catch(() => {});
  };

  // Citizen Journalism Submissions (persisted in localStorage)
  const [citizenSubmissions, setCitizenSubmissions] = useState<CitizenNewsSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('kd_citizen_submissions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CITIZEN_SUBMISSIONS;
  });

  const handleAddCitizenSubmission = (submission: CitizenNewsSubmission) => {
    setCitizenSubmissions((prev) => {
      const updated = [submission, ...prev];
      try {
        localStorage.setItem('kd_citizen_submissions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateCitizenSubmissionStatus = (
    id: string,
    status: CitizenNewsSubmission['status']
  ) => {
    setCitizenSubmissions((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status } : s));
      try {
        localStorage.setItem('kd_citizen_submissions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteCitizenSubmission = (id: string) => {
    setCitizenSubmissions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('kd_citizen_submissions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Font size
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [loading, setLoading] = useState(true);

  // Portal Settings (Persisted in localStorage with default fallback)
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(() => {
    try {
      const saved = localStorage.getItem('kd_portal_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PORTAL_SETTINGS,
          ...parsed,
          typography: {
            ...DEFAULT_PORTAL_SETTINGS.typography,
          },
          displayOptions: {
            ...DEFAULT_PORTAL_SETTINGS.displayOptions,
            ...(parsed.displayOptions || {}),
          },
          sharePlatforms: {
            ...DEFAULT_PORTAL_SETTINGS.sharePlatforms,
            ...(parsed.sharePlatforms || {}),
          },
          adSettings: {
            ...DEFAULT_PORTAL_SETTINGS.adSettings,
            ...(parsed.adSettings || {}),
          },
          sidebarAdsConfig: {
            ...DEFAULT_PORTAL_SETTINGS.sidebarAdsConfig!,
            ...(parsed.sidebarAdsConfig || {}),
          },
          popupConfig: {
            ...DEFAULT_PORTAL_SETTINGS.popupConfig,
            ...(parsed.popupConfig || {}),
          },
          articleMetaSettings: {
            ...DEFAULT_ARTICLE_META_SETTINGS,
            ...(parsed.articleMetaSettings || {}),
            platforms: {
              ...DEFAULT_ARTICLE_META_SETTINGS.platforms,
              ...(parsed.articleMetaSettings?.platforms || {}),
            },
          },
          spotlightLayout: {
            ...DEFAULT_SPOTLIGHT_LAYOUT,
            ...(parsed.spotlightLayout || {}),
            heroSlider: {
              ...DEFAULT_SPOTLIGHT_LAYOUT.heroSlider,
              ...(parsed.spotlightLayout?.heroSlider || {}),
            },
            secondaryCol: {
              ...DEFAULT_SPOTLIGHT_LAYOUT.secondaryCol,
              ...(parsed.spotlightLayout?.secondaryCol || {}),
            },
            briefTicker: {
              ...DEFAULT_SPOTLIGHT_LAYOUT.briefTicker,
              ...(parsed.spotlightLayout?.briefTicker || {}),
            },
          },
        };
      }
    } catch {}
    return DEFAULT_PORTAL_SETTINGS;
  });

  // Ensure default font sizes and typography CSS variables are completely clean on load
  useEffect(() => {
    resetRootCssVariablesToDefault();
    try {
      localStorage.removeItem('kd_reader_font_size');
      localStorage.removeItem('kd_reader_font_family');
    } catch {}
  }, []);

  // Completely reset font size and all default typography settings across the portal
  const handleResetTypography = () => {
    setFontSize('normal');
    setPortalSettings((prev) => {
      const updated: PortalSettings = {
        ...prev,
        typography: { ...DEFAULT_PORTAL_SETTINGS.typography },
      };
      try {
        localStorage.setItem('kd_portal_settings', JSON.stringify(updated));
        localStorage.removeItem('kd_reader_font_size');
        localStorage.removeItem('kd_reader_font_family');
      } catch {}
      savePortalSettings(updated).catch(() => {});
      return updated;
    });
    resetRootCssVariablesToDefault();
  };

  // Apply typography CSS variables dynamically to the document
  useEffect(() => {
    if (portalSettings?.typography) {
      const root = document.documentElement;
      root.style.setProperty('--font-headline', portalSettings.typography.headlineFont);
      root.style.setProperty('--font-body', portalSettings.typography.bodyFont);
      root.style.setProperty('--font-header', portalSettings.typography.headerFont);
      root.style.setProperty('--font-footer', portalSettings.typography.footerFont || portalSettings.typography.bodyFont);
      root.style.setProperty('--font-meta', portalSettings.typography.metaFont);
      root.style.setProperty('--weight-headline', String(portalSettings.typography.headlineWeight || 700));
      root.style.setProperty('--weight-body', String(portalSettings.typography.bodyWeight || 400));

      const scaleMap = { compact: '0.94', normal: '1', large: '1.1' };
      const baseMap = { small: '0.92', normal: '1', large: '1.08', xlarge: '1.16' };
      root.style.setProperty('--scale-font', baseMap[portalSettings.typography.baseSize || 'normal'] || '1');
      root.style.setProperty('--mobile-scale', scaleMap[portalSettings.typography.mobileScale || 'normal'] || '1');

      const sizeScaleMap = { sm: '0.9', normal: '1', large: '1.12', xlarge: '1.24' };
      const metaScaleMap = { sm: '0.88', normal: '1', large: '1.1' };
      root.style.setProperty('--size-heading-scale', sizeScaleMap[portalSettings.typography.headingSize || 'normal'] || '1');
      root.style.setProperty('--size-title-scale', sizeScaleMap[portalSettings.typography.titleSize || 'normal'] || '1');
      root.style.setProperty('--size-content-scale', sizeScaleMap[portalSettings.typography.contentSize || 'normal'] || '1');
      root.style.setProperty('--size-archive-scale', sizeScaleMap[portalSettings.typography.archiveSize || 'normal'] || '1');
      root.style.setProperty('--size-meta-scale', metaScaleMap[portalSettings.typography.metaSize || 'normal'] || '1');
      root.style.setProperty('--size-header-scale', sizeScaleMap[portalSettings.typography.headerFontSize || 'normal'] || '1');
      root.style.setProperty('--size-footer-scale', sizeScaleMap[portalSettings.typography.footerFontSize || 'normal'] || '1');
      root.style.setProperty('--size-homepage-title-scale', sizeScaleMap[portalSettings.typography.homepageTitleSize || 'normal'] || '1');
      root.style.setProperty('--size-article-title-scale', sizeScaleMap[portalSettings.typography.articleTitleSize || 'normal'] || '1');
      root.style.setProperty('--size-excerpt-scale', sizeScaleMap[portalSettings.typography.articleExcerptSize || 'normal'] || '1');
      root.style.setProperty('--size-meta-desc-scale', sizeScaleMap[portalSettings.typography.metaDescriptionSize || 'normal'] || '1');

      // Custom Pixel Inputs from Admin Typography Customizer
      if (portalSettings.typography.baseFontSizePx) {
        root.style.setProperty('--base-font-size', `${portalSettings.typography.baseFontSizePx}px`);
      }
      if (portalSettings.typography.sectionHeadingPx) {
        root.style.setProperty('--font-section-heading-size', `${portalSettings.typography.sectionHeadingPx}px`);
      }
      if (portalSettings.typography.heroTitlePx) {
        root.style.setProperty('--font-hero-title-size', `${portalSettings.typography.heroTitlePx}px`);
      }
      if (portalSettings.typography.gridCardTitlePx) {
        root.style.setProperty('--font-grid-card-title-size', `${portalSettings.typography.gridCardTitlePx}px`);
      }
      if (portalSettings.typography.gridCardExcerptPx) {
        root.style.setProperty('--font-grid-card-excerpt-size', `${portalSettings.typography.gridCardExcerptPx}px`);
      }
      if (portalSettings.typography.cardMetaFontSizePx) {
        root.style.setProperty('--font-card-meta-size', `${portalSettings.typography.cardMetaFontSizePx}px`);
      }
      if (portalSettings.typography.navLinkFontSizePx) {
        root.style.setProperty('--font-nav-link-size', `${portalSettings.typography.navLinkFontSizePx}px`);
      }
      if (portalSettings.typography.tickerFontSizePx) {
        root.style.setProperty('--font-ticker-size', `${portalSettings.typography.tickerFontSizePx}px`);
      }
      if (portalSettings.typography.articleLeadSubtitlePx) {
        root.style.setProperty('--font-article-lead-size', `${portalSettings.typography.articleLeadSubtitlePx}px`);
      }
      if (portalSettings.typography.articleBodyFontSizePx) {
        root.style.setProperty('--font-article-body-size', `${portalSettings.typography.articleBodyFontSizePx}px`);
      }
      if (portalSettings.typography.articleBodyLineHeight) {
        root.style.setProperty('--line-height-article-body', `${portalSettings.typography.articleBodyLineHeight}`);
      }
      if (portalSettings.typography.sidebarHeadingPx) {
        root.style.setProperty('--font-sidebar-heading-size', `${portalSettings.typography.sidebarHeadingPx}px`);
      }
      if (portalSettings.typography.sidebarItemTitlePx) {
        root.style.setProperty('--font-sidebar-item-title', `${portalSettings.typography.sidebarItemTitlePx}px`);
      }
      if (portalSettings.typography.footerHeadingPx) {
        root.style.setProperty('--font-footer-heading-size', `${portalSettings.typography.footerHeadingPx}px`);
      }
      if (portalSettings.typography.footerTextPx) {
        root.style.setProperty('--font-footer-text-size', `${portalSettings.typography.footerTextPx}px`);
      }
    }
  }, [portalSettings.typography]);

  // Dynamic Google Services Injection (GA4, GTM, GSC, AdSense)
  useGoogleServices(portalSettings, {
    path: currentView === 'article' && activeArticle ? `/article/${activeArticle.id}` : `/${currentView === 'home' ? '' : currentView}`,
    title: currentView === 'article' && activeArticle ? activeArticle.title : document.title,
  });

  // URL Route Detection for Staff / Admin Login, About, Contact, and Legal Policies
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        path === '/admin' ||
        path.endsWith('/admin')
      ) {
        if (isAdmin || isStaff) {
          setShowAdminBackend(true);
        } else {
          setShowStaffLogin(true);
        }
      } else if (
        hash === '#login' ||
        hash === '#/login' ||
        hash === '#staff' ||
        path === '/login' ||
        path.endsWith('/login')
      ) {
        setShowStaffLogin(true);
      } else if (hash === '#about' || path === '/about' || path.endsWith('/about')) {
        setCurrentView('about');
        setActiveArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#contact' || path === '/contact' || path.endsWith('/contact')) {
        setCurrentView('contact');
        setActiveArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#submit-news' || hash === '#reporter' || path === '/submit-news' || path.endsWith('/submit-news')) {
        setCurrentView('submit-news');
        setActiveArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#archive' || path === '/archive' || path.endsWith('/archive')) {
        setCurrentView('archive');
        setActiveArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#sudoku' ||
        hash === '#/sudoku' ||
        hash === '#game' ||
        hash === '#puzzle' ||
        path === '/sudoku' ||
        path.endsWith('/sudoku')
      ) {
        setShowSudokuModal(true);
      } else if (
        hash.startsWith('#legal-') ||
        hash === '#privacy-policy' ||
        hash === '#terms-of-service' ||
        hash === '#grievance-redressal' ||
        hash === '#fact-check-policy' ||
        hash === '#editorial-ethics' ||
        hash === '#disclaimer' ||
        hash === '#corrections' ||
        hash === '#dmca'
      ) {
        let policy: LegalPolicyType = 'privacy';
        if (hash.includes('terms')) policy = 'terms';
        else if (hash.includes('grievance')) policy = 'grievance';
        else if (hash.includes('fact')) policy = 'factCheck';
        else if (hash.includes('ethics')) policy = 'ethics';
        else if (hash.includes('disclaimer')) policy = 'disclaimer';
        else if (hash.includes('corrections')) policy = 'corrections';
        else if (hash.includes('dmca') || hash.includes('copyright')) policy = 'dmca';
        setActiveLegalPolicyType(policy);
        setCurrentView('legal');
        setActiveArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  // Discrete Keyboard shortcut for Admin & Editors: Ctrl + Shift + A or Alt + L
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'l' || e.key === 'L'))
      ) {
        e.preventDefault();
        setShowStaffLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateSettings = (newSettings: Partial<PortalSettings>) => {
    setPortalSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        typography: {
          ...prev.typography,
          ...(newSettings.typography || {}),
        },
        displayOptions: {
          ...prev.displayOptions,
          ...(newSettings.displayOptions || {}),
        },
        sharePlatforms: {
          ...prev.sharePlatforms,
          ...(newSettings.sharePlatforms || {}),
        },
        adSettings: {
          ...prev.adSettings,
          ...(newSettings.adSettings || {}),
        },
        sidebarAdsConfig: {
          ...(prev.sidebarAdsConfig || DEFAULT_PORTAL_SETTINGS.sidebarAdsConfig!),
          ...(newSettings.sidebarAdsConfig || {}),
        },
        popupConfig: {
          ...(prev.popupConfig || DEFAULT_PORTAL_SETTINGS.popupConfig!),
          ...(newSettings.popupConfig || {}),
        },
      };
      try {
        localStorage.setItem('kd_portal_settings', JSON.stringify(updated));
      } catch {}
      // Sync to Firestore for real-time global reader updates
      savePortalSettings(updated).catch(() => {});
      return updated;
    });
  };

  // Custom sequenced states configured by admin
  const customStatesList =
    portalSettings.headerFooter?.customStates && portalSettings.headerFooter.customStates.length > 0
      ? portalSettings.headerFooter.customStates
      : MAJOR_INDIAN_STATES;
  const disabledStatesList = portalSettings.headerFooter?.disabledStates || [];
  const activeStatesList = React.useMemo(() => {
    return customStatesList.filter((s) => !disabledStatesList.includes(s));
  }, [customStatesList, disabledStatesList]);

  // Live subscription to Firestore articles
  useEffect(() => {
    seedInitialArticlesIfEmpty().catch(() => {});

    const unsubscribe = subscribeToArticles((loadedArticles) => {
      setArticles(loadedArticles);
      setLoading(false);
    }, currentCategory);

    return () => unsubscribe();
  }, [currentCategory]);

  // Synchronize published articles with server-side dynamic XML sitemap
  useEffect(() => {
    if (articles.length > 0) {
      fetch('/api/sitemap/sync-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      }).catch(() => {});
    }
  }, [articles]);

  // Live subscription to global portal settings from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPortalSettings((syncedSettings) => {
      setPortalSettings(syncedSettings);
    });
    return () => unsubscribe();
  }, []);

  // Live subscription to Media Assets from Firestore (ISSUE-03)
  useEffect(() => {
    const unsubscribe = subscribeMediaAssets((syncedMedia) => {
      setMediaAssets(syncedMedia);
    });
    return () => unsubscribe();
  }, []);

  // Live subscription to Live Blogs & Breaking Coverage from Firestore
  useEffect(() => {
    const unsubscribe = subscribeLiveBlogs((syncedBlogs) => {
      setLiveBlogs(syncedBlogs);
      setActiveLiveBlog((prev) => {
        if (!prev) return syncedBlogs[0] || null;
        const matching = syncedBlogs.find((b) => b.id === prev.id);
        return matching || syncedBlogs[0] || null;
      });
    });
    return () => unsubscribe();
  }, []);

  // Automated scheduled publishing check every 60 seconds
  useEffect(() => {
    const runScheduledCheck = async () => {
      if (articles.length === 0) return;
      const result = await checkAndPublishScheduledArticles(articles);
      if (result.publishedCount > 0) {
        setArticles(result.updatedArticles);
      }
    };

    runScheduledCheck();
    const interval = setInterval(runScheduledCheck, 60000);
    return () => clearInterval(interval);
  }, [articles]);

  // Live subscription to contact inquiries for staff/admin
  useEffect(() => {
    if (!isAdmin && !isStaff) return;
    const unsubscribe = subscribeToContactInquiries((syncedInquiries) => {
      setContactInquiries(syncedInquiries);
    });
    return () => unsubscribe();
  }, [isAdmin, isStaff]);

  // Live subscription to bookmarks
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    const unsubscribe = subscribeToUserBookmarks(user.uid, (userBookmarks) => {
      setBookmarks(userBookmarks);
    });
    return () => unsubscribe();
  }, [user]);

  // Seed portal settings in Firestore if admin is logged in
  useEffect(() => {
    if (isAdmin) {
      seedPortalSettingsIfEmpty().catch(() => {});
    }
  }, [isAdmin]);

  // Handle bookmark toggle
  const handleToggleBookmark = async (article: NewsArticle) => {
    if (!user) {
      setActivePushToast({
        id: 'toast-' + Date.now(),
        title: 'लॉगिन आवश्यक है',
        message: 'खबरों को बुकमार्क करने के लिए कृपया Google से लॉगिन करें।',
        status: 'sent',
        targetAudience: 'all',
        sentAt: new Date().toISOString(),
        clicksCount: 0,
        reachCount: 1,
      });
      return;
    }
    const isCurrentlyBookmarked = bookmarks.some((b) => b.articleId === article.id);
    try {
      await toggleBookmark(user.uid, article, isCurrentlyBookmarked);
    } catch {
      setActivePushToast({
        id: 'toast-' + Date.now(),
        title: 'बुकमार्क सुरक्षित नहीं हो सका',
        message: 'कृपया इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
        status: 'sent',
        targetAudience: 'all',
        sentAt: new Date().toISOString(),
        clicksCount: 0,
        reachCount: 1,
      });
    }
  };

  const isArticleBookmarked = (articleId: string) => {
    return bookmarks.some((b) => b.articleId === articleId);
  };

  // Live subscription to Read Later queue (Firestore + local profile fallback)
  useEffect(() => {
    const unsubscribe = subscribeToUserReadLater(user?.uid || '', (items) => {
      setReadLaterItems(items);
    });
    return () => unsubscribe();
  }, [user]);

  // Handle Read Later toggle
  const handleToggleReadLater = async (article: NewsArticle) => {
    const isCurrentlySaved = readLaterItems.some((r) => r.articleId === article.id);
    try {
      const added = await toggleReadLater(user?.uid || '', article, isCurrentlySaved);
      setActivePushToast({
        id: 'toast-' + Date.now(),
        title: added ? 'बाद में पढ़ें (कतार में जोड़ा)' : 'रीड लेटर से हटाया गया',
        message: added
          ? `"${article.title.slice(0, 42)}..." को आपकी निजी पठन कतार में सहेज लिया गया है।`
          : 'लेख आपकी पठन कतार से हटा दिया गया है।',
        status: 'sent',
        targetAudience: 'all',
        sentAt: new Date().toISOString(),
        clicksCount: 0,
        reachCount: 1,
      });
    } catch {
      setActivePushToast({
        id: 'toast-' + Date.now(),
        title: 'त्रुटि',
        message: 'रीड लेटर सूची अपडेट नहीं हो सकी।',
        status: 'sent',
        targetAudience: 'all',
        sentAt: new Date().toISOString(),
        clicksCount: 0,
        reachCount: 1,
      });
    }
  };

  const isArticleInReadLater = (articleId: string) => {
    return readLaterItems.some((r) => r.articleId === articleId);
  };

  const handleRemoveReadLater = async (articleId: string) => {
    try {
      await removeReadLaterItem(user?.uid || '', articleId);
    } catch (err) {
      console.warn('Error removing read later item:', err);
    }
  };

  const handleClearAllReadLater = async () => {
    try {
      await clearAllUserReadLater(user?.uid || '', readLaterItems);
      setReadLaterItems([]);
    } catch (err) {
      console.warn('Error clearing read later:', err);
    }
  };

  // Open Article in Dedicated Page View (NOT A POPUP)
  const handleSelectArticle = (article: NewsArticle) => {
    setActiveArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContactPage = () => {
    setCurrentView('contact');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAboutUsPage = () => {
    setCurrentView('about');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSubmitNews = () => {
    setCurrentView('submit-news');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegalPolicy = (type: LegalPolicyType) => {
    setActiveLegalPolicyType(type);
    setCurrentView('legal');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArchivePage = () => {
    setCurrentView('archive');
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Article CRUD for Admin Panel
  const handleSaveArticle = async (artData: Partial<NewsArticle>) => {
    if (artData.id) {
      // Update existing
      try {
        await updateArticle(artData.id, artData);
      } catch {
        // Local update fallback if offline or permission
        setArticles((prev) =>
          prev.map((a) => (a.id === artData.id ? ({ ...a, ...artData } as NewsArticle) : a))
        );
      }
    } else {
      // Create new
      try {
        await publishArticle(artData as any);
      } catch {
        const fallbackId = 'art_' + Date.now();
        const fallbackArticle: NewsArticle = {
          ...(artData as any),
          id: fallbackId,
          viewsCount: 1,
          likesCount: 0,
          createdAt: new Date().toISOString(),
        };
        setArticles((prev) => [fallbackArticle, ...prev]);
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id);
    } catch {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Subscriber handlers
  const handleAddSubscriber = (newSub: Omit<SubscriberItem, 'id' | 'subscribedAt'>) => {
    const item: SubscriberItem = {
      ...newSub,
      id: 'sub_' + Date.now(),
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.email.toLowerCase() === item.email.toLowerCase()
      );
      let updated: SubscriberItem[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...item,
          id: updated[existingIndex].id,
          subscribedAt: updated[existingIndex].subscribedAt,
        };
      } else {
        updated = [item, ...prev];
      }
      try {
        localStorage.setItem('kd_subscribers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteSubscriber = (id: string) => {
    const updated = subscribers.filter((s) => s.id !== id);
    setSubscribers(updated);
    try {
      localStorage.setItem('kd_subscribers', JSON.stringify(updated));
    } catch {}
  };

  // Notification handlers
  const handleSendNotification = (
    notifData: Omit<PushNotificationItem, 'id' | 'sentAt' | 'clicksCount' | 'reachCount'>
  ) => {
    const newNotif: PushNotificationItem = {
      ...notifData,
      id: 'notif_' + Date.now(),
      sentAt: new Date().toISOString(),
      clicksCount: 1,
      reachCount: subscribers.length * 150 + 2400,
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    try {
      localStorage.setItem('kd_push_notifications', JSON.stringify(updated));
    } catch {}

    // Trigger in-app reader toast
    setActivePushToast(newNotif);
    setTimeout(() => {
      setActivePushToast(null);
    }, 8000);
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = articles;
    if (currentCategory !== 'all') {
      result = result.filter((a) => a.category === currentCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [articles, currentCategory, searchQuery]);

  // 3-Column Spotlight Layout configuration & story segmenting
  const spotlightConfig = portalSettings.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT;

  // Card 1: Main Hero Slider Articles Pool
  // "1st card mein sliding add kar do, bs admin apne hisab se bhi addon kar ske liye kis category ki news slide karvani hain ya automatically recently or choosed by admin."
  const heroSliderArticles = useMemo(() => {
    const config = spotlightConfig.heroSlider || DEFAULT_SPOTLIGHT_LAYOUT.heroSlider;
    if (config.source === 'manual' && config.selectedArticleIds && config.selectedArticleIds.length > 0) {
      const selected = articles.filter((a) => config.selectedArticleIds.includes(a.id));
      if (selected.length > 0) return selected;
    }
    if (config.source === 'category' && config.category && config.category !== 'all') {
      const catArticles = articles.filter((a) => a.category === config.category);
      if (catArticles.length > 0) return catArticles;
    }
    // Default / Automatic Recently Published:
    return filteredArticles.slice(0, 6);
  }, [articles, filteredArticles, spotlightConfig.heroSlider]);

  const heroArticle = heroSliderArticles[0] || filteredArticles[0];

  // Column 2: 4 Secondary Featured stories (user requested: "is division mein 4 cards kar do")
  const topSecondaryStories = useMemo(() => {
    const config = spotlightConfig.secondaryCol || DEFAULT_SPOTLIGHT_LAYOUT.secondaryCol;
    const heroIds = new Set(heroSliderArticles.map((a) => a.id));

    let pool = filteredArticles.filter((a) => !heroIds.has(a.id));
    if (config.category && config.category !== 'all') {
      const catFiltered = pool.filter((a) => a.category === config.category);
      if (catFiltered.length >= 4) pool = catFiltered;
    }
    // If pool is less than 4, fallback to other filtered articles excluding top hero
    if (pool.length < 4 && heroArticle) {
      pool = filteredArticles.filter((a) => a.id !== heroArticle.id);
    }
    return pool.slice(0, 4);
  }, [filteredArticles, heroSliderArticles, heroArticle, spotlightConfig.secondaryCol]);

  // Column 3: Upward sliding brief ticker stories (bottom-to-top continuous sliding)
  // "3rd selected card division mein admin ko choose karne ki option do ki category show karni hain ya nahi aur konsi kharein ya category show karvani hain aur ismein bottom se top ki taraf sliding karti rehni chahie news, means niche se upar ki taraf sliding."
  const topBriefStories = useMemo(() => {
    const config = spotlightConfig.briefTicker || DEFAULT_SPOTLIGHT_LAYOUT.briefTicker;
    if (config.source === 'manual' && config.selectedArticleIds && config.selectedArticleIds.length > 0) {
      const manual = articles.filter((a) => config.selectedArticleIds.includes(a.id));
      if (manual.length > 0) return manual.slice(0, 5);
    }
    if (config.source === 'category' && config.category && config.category !== 'all') {
      const catArticles = articles.filter((a) => a.category === config.category);
      if (catArticles.length > 0) return catArticles.slice(0, 5);
    }
    // Recent / General: exclude hero and secondary if possible, return exactly 4-5 stories as requested
    const usedIds = new Set([
      heroArticle?.id,
      ...topSecondaryStories.map((a) => a.id),
    ].filter(Boolean));
    const pool = articles.filter((a) => !usedIds.has(a.id));
    return pool.length >= 4 ? pool.slice(0, 5) : articles.slice(0, 5);
  }, [articles, heroArticle, topSecondaryStories, spotlightConfig.briefTicker]);

  // Top 3 Most Popular States based on daily news activity & coverage
  const topPopularStates = useMemo(() => {
    return MAJOR_INDIAN_STATES.map((st) => {
      const stateArticles = articles.filter(
        (a) =>
          a.location === st ||
          a.title.toLowerCase().includes(st.toLowerCase()) ||
          a.content.toLowerCase().includes(st.toLowerCase())
      );
      const views = stateArticles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
      const topStory = stateArticles[0] || null;
      const regionGroup = ALL_INDIAN_STATES_BY_REGION.find((g) => g.states.includes(st));
      return {
        name: st,
        articleCount: stateArticles.length,
        views,
        topStory,
        regionShort: regionGroup?.regionShort || 'प्रमुख राज्य',
        badgeClass: regionGroup?.badgeClass || 'bg-slate-100 text-slate-800 border-slate-200',
        dotClass: regionGroup?.dotClass || 'bg-red-500',
        cardHoverClass: regionGroup?.cardHoverClass || 'hover:bg-slate-50',
        score: stateArticles.length * 1000 + views,
      };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [articles]);

  // Synchronize Card 2 & Card 3 heights strictly with Card 1 (Hero Slider) height
  const heroCardColRef = useRef<HTMLDivElement>(null);
  const [heroCardHeight, setHeroCardHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = heroCardColRef.current;
    if (!el) return;

    const measureAndSync = () => {
      if (window.innerWidth >= 1024) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 100) {
          setHeroCardHeight(Math.round(rect.height));
        }
      } else {
        setHeroCardHeight(null);
      }
    };

    measureAndSync();

    const ro = new ResizeObserver(() => {
      measureAndSync();
    });
    ro.observe(el);

    window.addEventListener('resize', measureAndSync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureAndSync);
    };
  }, [heroSliderArticles, currentCategory, fontSize]);

  // Dynamic SEO & Schema.org JSON-LD updates based on current view / active article
  useEffect(() => {
    if (currentView === 'article' && activeArticle) {
      document.title = `${activeArticle.seoTitle || activeArticle.title} | खबरी दोस्त`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', activeArticle.seoDescription || activeArticle.summary);
      }
      let schemaScript = document.getElementById('schema-news-article');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-news-article';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: activeArticle.seoTitle || activeArticle.title,
        description: activeArticle.seoDescription || activeArticle.summary,
        image: [activeArticle.imageUrl],
        datePublished: activeArticle.createdAt,
        dateModified: activeArticle.updatedAt || activeArticle.createdAt,
        author: [{
          '@type': 'Person',
          name: activeArticle.authorName,
        }],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'खबरी दोस्त',
          url: 'https://khabridost.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300',
          },
        },
        inLanguage: 'hi-IN',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://khabridost.com/${activeArticle.category}/${activeArticle.id}`,
        },
      });
    } else if (currentView === 'contact') {
      document.title = 'Contact News Desk (संपर्क केंद्र) | खबरी दोस्त';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'खबरी दोस्त न्यूज़ डेस्क से संपर्क करें। संपादकीय टीम, विज्ञापन, शिकायत निवारण और प्रेस विज्ञप्ति के लिए संपर्क जानकारी।'
        );
      }
      const schemaScript = document.getElementById('schema-news-article');
      if (schemaScript) {
        schemaScript.remove();
      }
    } else {
      document.title = 'Khabri Dost - Hindi News Publisher Portal | खबरी दोस्त न्यूज़';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'खबरी दोस्त - भारत का विश्वसनीय और निष्पक्ष हिंदी समाचार पोर्टल। राष्ट्रीय, राजनीति, खेल, व्यापार और मनोरंजन की ताज़ा ख़बरें।'
        );
      }
      const schemaScript = document.getElementById('schema-news-article');
      if (schemaScript) {
        schemaScript.remove();
      }
    }
  }, [currentView, activeArticle]);

  // Smooth scroll helper for Header Live Video button
  const handleScrollToLiveVideo = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('live-video-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('live-video-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trending articles: Prioritize admin-curated pinned article IDs!
  const trendingArticles = useMemo(() => {
    const pinnedIds = portalSettings.pinnedTrendingArticleIds || [];
    const pinned = articles.filter((a) => pinnedIds.includes(a.id));
    const remaining = articles
      .filter((a) => !pinnedIds.includes(a.id))
      .sort((a, b) => b.viewsCount - a.viewsCount);
    return [...pinned, ...remaining].slice(0, 6);
  }, [articles, portalSettings.pinnedTrendingArticleIds]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === currentCategory);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-['Mukta',sans-serif]">
      {/* 1. Header with centered logo, search icon & utility bar */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          if (currentView !== 'home') {
            setCurrentView('home');
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'home') {
            setCurrentView('home');
          }
        }}
        onOpenPublisherCMS={() => {
          if (isStaff) setShowAdminBackend(true);
          else setShowPublisherCMS(true);
        }}
        onOpenBookmarks={() => setShowBookmarks(true)}
        onOpenReadLater={() => setShowReadLater(true)}
        onOpenEPaper={() => setShowEPaper(true)}
        onOpenAdminSettings={(tab) => {
          if (!isAdmin) {
            setAdminInitialTab(tab || 'header_footer');
            setShowStaffLogin(true);
            return;
          }
          openAdminStudio(tab || 'header_footer');
        }}
        onOpenAdminBackend={() => {
          if (isStaff || isAdmin) setShowAdminBackend(true);
          else setShowStaffLogin(true);
        }}
        onOpenStaffLogin={() => setShowStaffLogin(true)}
        onOpenSubscriberModal={() => setShowSubscriberModal(true)}
        onOpenTypography={() => openAdminStudio('typography')}
        onScrollToLiveVideo={handleScrollToLiveVideo}
        bookmarksCount={bookmarks.length}
        readLaterCount={readLaterItems.length}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        portalSettings={portalSettings}
        onUpdateSettings={handleUpdateSettings}
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onOpenLiveFeed={() => setCurrentView('live-feed')}
        onOpenContactPage={handleOpenContactPage}
        onOpenAboutUsPage={handleOpenAboutUsPage}
        onOpenSubmitNews={handleOpenSubmitNews}
        onOpenLegalPolicy={handleOpenLegalPolicy}
        onOpenArchivePage={handleOpenArchivePage}
        onOpenSudokuGame={() => setShowSudokuModal(true)}
        onResetTypography={handleResetTypography}
        onBackToHome={handleBackToHome}
      />

      {/* 2. VIEW SWITCHER: Dedicated Article Page OR Live Feed Page OR Contact Us Page OR About Us Page OR Legal Policy Page OR Homepage */}
      {currentView === 'article' && activeArticle ? (
        <ArticlePageView
          article={activeArticle}
          onBackToHome={handleBackToHome}
          onSelectArticle={handleSelectArticle}
          allArticles={articles}
          isBookmarked={isArticleBookmarked(activeArticle.id)}
          onToggleBookmark={handleToggleBookmark}
          isReadLater={isArticleInReadLater(activeArticle.id)}
          onToggleReadLater={handleToggleReadLater}
          fontSize={fontSize}
          portalSettings={portalSettings}
          onOpenAdminSettings={(tab) => {
            if (!isAdmin) {
              setAdminInitialTab(tab || 'sidebar_widgets');
              setShowStaffLogin(true);
              return;
            }
            openAdminStudio(tab || 'sidebar_widgets');
          }}
          onOpenTypography={() => openAdminStudio('typography')}
          onResetTypography={handleResetTypography}
          onUpdateSettings={handleUpdateSettings}
          onOpenEPaper={() => setShowEPaper(true)}
          onEditArticle={(art) => {
            setActiveArticle(art);
            setArticles((prev) => prev.map((a) => (a.id === art.id ? art : a)));
          }}
          onOpenSudokuModal={() => setShowSudokuModal(true)}
        />
      ) : currentView === 'live-feed' ? (
        <LiveFeedPageView
          liveBlog={activeLiveBlog || liveBlogs[0] || INITIAL_LIVE_BLOGS[0]}
          allLiveBlogs={liveBlogs}
          onSelectLiveBlog={(blog) => setActiveLiveBlog(blog)}
          onBackToHome={handleBackToHome}
          onSelectArticle={handleSelectArticle}
          articles={articles}
          fontSize={fontSize}
          portalSettings={portalSettings}
          onOpenAdminSettings={() => {
            if (!isAdmin) {
              setAdminInitialTab('live_feed');
              setShowStaffLogin(true);
              return;
            }
            setShowAdminBackend(true);
          }}
        />
      ) : currentView === 'contact' ? (
        <ContactUsPageView
          onBackToHome={handleBackToHome}
          portalSettings={portalSettings}
          onAddInquiry={handleAddContactInquiry}
          onOpenLegalPolicy={handleOpenLegalPolicy}
          onOpenAboutUsPage={handleOpenAboutUsPage}
        />
      ) : currentView === 'about' ? (
        <AboutUsPageView
          onBackToHome={handleBackToHome}
          portalSettings={portalSettings}
          onOpenContactPage={handleOpenContactPage}
          onOpenLegalPolicy={handleOpenLegalPolicy}
          onOpenEPaper={() => setShowEPaper(true)}
        />
      ) : currentView === 'legal' ? (
        <LegalPolicyPageView
          initialPolicyType={activeLegalPolicyType}
          onBackToHome={handleBackToHome}
          portalSettings={portalSettings}
          isAdmin={isAdmin}
          onUpdateSettings={handleUpdateSettings}
          onOpenContactPage={handleOpenContactPage}
          onOpenAboutUsPage={handleOpenAboutUsPage}
          onOpenAdminSettings={() => {
            openAdminStudio('footer');
          }}
        />
      ) : currentView === 'submit-news' ? (
        <SubmitNewsPageView
          onBackToHome={handleBackToHome}
          portalSettings={portalSettings}
          onOpenContactPage={handleOpenContactPage}
          onSubmitNews={(submission) => {
            handleAddCitizenSubmission(submission);
            setActivePushToast({
              id: 'toast-' + Date.now(),
              title: 'खबर सफलतापूर्वक प्राप्त हुई!',
              message: `टिकट ${submission.id}: आपकी खबर संपादकीय डेस्क को भेज दी गई है।`,
              status: 'sent',
              targetAudience: 'all',
              sentAt: new Date().toISOString(),
              clicksCount: 0,
              reachCount: 1,
            });
          }}
        />
      ) : currentView === 'archive' ? (
        <ArchivePageView
          articles={articles}
          onSelectArticle={handleSelectArticle}
          onBackToHome={handleBackToHome}
          portalSettings={portalSettings}
          fontSize={fontSize}
        />
      ) : (
        /* HOMEPAGE VIEW (COMPACT, BEAUTIFUL, MODULAR AS REQUESTED) */
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          {/* Active Search Notification */}
          {searchQuery && (
            <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200 flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                "{searchQuery}" के लिए खोज परिणाम ({filteredArticles.length} ख़बरें)
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
              >
                खोज हटाएं
              </button>
            </div>
          )}

          {/* Category Filter Title Banner */}
          {currentCategory !== 'all' && !searchQuery && (
            <div className="bg-white p-4 rounded-xl shadow-2xs border-l-4 border-red-600 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block font-mono">
                  विशेष कवरेज
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-kd-headline text-slate-900">
                  {currentCategoryObj?.labelHindi}
                </h2>
              </div>
              <button
                onClick={() => setCurrentCategory('all')}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 transition cursor-pointer font-medium"
              >
                ← ताज़ा ख़बरों पर लौटें
              </button>
            </div>
          )}

          {/* State Category Dedicated Sub-Navigation */}
          {currentCategory === 'state' && !searchQuery && (
            <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200 space-y-2.5 font-kd-meta">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>अपना राज्य चुनें (Select State News):</span>
                </span>
                <button
                  onClick={() => setShowAllStatesModal(true)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>सभी भारतीय राज्य व UTs देखें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {activeStatesList.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSearchQuery(st);
                      setCurrentCategory('all');
                    }}
                    className="text-xs px-3 py-1 rounded-full whitespace-nowrap bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 hover:border-red-300 border border-slate-200 transition cursor-pointer font-medium shrink-0"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TOP LEADERBOARD ADVERTISEMENT SPACE */}
          {portalSettings.adSettings.showTopAd && (
            <AdBanner
              slot="leaderboard"
              type={portalSettings.adSettings.topAdType}
              privateBannerUrl={portalSettings.adSettings.privateBannerUrl}
              privateBannerLink={portalSettings.adSettings.privateBannerLink}
              privateBannerTitle={portalSettings.adSettings.privateBannerTitle}
              onOpenContactPage={handleOpenContactPage}
              breakpoints={portalSettings.adSettings.responsiveBreakpoints?.leaderboard}
            />
          )}

          {/* Loading Skeleton */}
          {loading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              <div className="md:col-span-2 h-72 bg-slate-200 rounded-xl" />
              <div className="h-72 bg-slate-200 rounded-xl" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
              <Newspaper className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">
                इस विषय में अभी कोई खबर उपलब्ध नहीं है
              </h3>
              <p className="text-xs text-slate-500">
                जल्द ही इस विषय पर ताज़ा अपडेट प्रकाशित किए जाएंगे।
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminBackend(true)}
                  className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-semibold inline-flex items-center space-x-1 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>नई खबर लिखें</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DEDICATED CATEGORY & SEARCH RESULTS ARTICLE GRID (Shown when viewing specific Category or Search) */}
              {(currentCategory !== 'all' || searchQuery) && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900">
                        {searchQuery ? `खोज परिणाम: ${searchQuery}` : `${currentCategoryObj?.labelHindi || 'श्रेणी'} के सभी मुख्य समाचार`}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-kd-meta">
                      कुल {filteredArticles.length} ख़बरें उपलब्ध
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => handleSelectArticle(art)}
                        className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-red-300 transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1">
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-kd-meta shadow-xs">
                              {art.category}
                            </span>
                            {art.isBreaking && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md font-kd-meta shadow-xs">
                                ब्रेकिंग
                              </span>
                            )}
                          </div>
                          {art.location && (
                            <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded font-kd-meta flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-red-400" />
                              <span>{art.location}</span>
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-kd-meta">
                              <span>{art.authorName}</span>
                              <span>{formatHindiTimeAgo(art.createdAt)}</span>
                            </div>
                            {/* COMPLETE HEADLINE - NO TRUNCATION */}
                            <h3
                              style={{ fontSize: 'var(--font-grid-card-title-size, 16px)' }}
                              className="font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition leading-snug"
                            >
                              {art.title}
                            </h3>
                            <p
                              style={{ fontSize: 'var(--font-grid-card-excerpt-size, 13px)' }}
                              className="text-slate-600 font-kd-body leading-relaxed mt-2"
                            >
                              {art.summary}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-100 font-kd-meta">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>{art.viewsCount || 0} व्यूज</span>
                            </span>
                            <span className="text-red-600 font-bold group-hover:translate-x-0.5 transition-transform">
                              पूरी खबर पढ़ें →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 1. TOP SPOTLIGHT SECTION (3 Columns on Desktop for Compact Editorial Density) */}
              {currentCategory === 'all' && !searchQuery && heroArticle && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5">
                    <h2 className="text-base sm:text-lg font-black font-kd-headline text-slate-900 flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-red-600 fill-red-600" />
                      <span>Top Headlines</span>
                    </h2>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleOpenSpotlightSettings}
                        title="Spotlight Layout & Slider Settings"
                        className="text-[11px] text-red-600 hover:text-white hover:bg-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Layout Settings</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                    {/* Column 1: Main Hero Story / Carousel Slider (5 Cols) - Master Reference Height */}
                    <div ref={heroCardColRef} className="lg:col-span-5 flex flex-col">
                      {spotlightConfig.heroSlider.enabled !== false ? (
                        <SpotlightHeroSlider
                          articles={heroSliderArticles}
                          sliderConfig={spotlightConfig.heroSlider}
                          onSelectArticle={handleSelectArticle}
                          isBookmarked={isArticleBookmarked}
                          onToggleBookmark={handleToggleBookmark}
                          isReadLater={isArticleInReadLater}
                          onToggleReadLater={handleToggleReadLater}
                          displayOptions={portalSettings.displayOptions}
                          mobileScale={portalSettings.typography?.mobileScale || 'normal'}
                          onOpenSettings={isAdmin ? handleOpenSpotlightSettings : undefined}
                        />
                      ) : (
                        <ArticleCard
                          article={heroArticle}
                          layout="hero"
                          onSelectArticle={handleSelectArticle}
                          isBookmarked={isArticleBookmarked(heroArticle.id)}
                          onToggleBookmark={handleToggleBookmark}
                          isReadLater={isArticleInReadLater(heroArticle.id)}
                          onToggleReadLater={handleToggleReadLater}
                          displayOptions={portalSettings.displayOptions}
                          mobileScale={portalSettings.typography?.mobileScale || 'normal'}
                        />
                      )}
                    </div>

                    {/* Column 2: 4 Secondary Featured Cards (4 Cols) - Complete headline visibility without clipping */}
                    <div className="lg:col-span-4 flex flex-col gap-2.5">
                      {topSecondaryStories.map((art) => (
                        <div key={art.id} className="w-full">
                          <ArticleCard
                            article={art}
                            layout="compact"
                            onSelectArticle={handleSelectArticle}
                            isBookmarked={isArticleBookmarked(art.id)}
                            onToggleBookmark={handleToggleBookmark}
                            isReadLater={isArticleInReadLater(art.id)}
                            onToggleReadLater={handleToggleReadLater}
                            displayOptions={portalSettings.displayOptions}
                            mobileScale={portalSettings.typography?.mobileScale || 'normal'}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Column 3: Fast-read Briefs with Bottom-to-Top Upward Sliding (3 Cols) - Height synchronized exactly with Card 1 */}
                    <div
                      className="md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden"
                      style={{
                        height: heroCardHeight ? `${heroCardHeight}px` : undefined,
                      }}
                    >
                      <SpotlightBriefTicker
                        articles={topBriefStories}
                        config={spotlightConfig.briefTicker}
                        onSelectArticle={handleSelectArticle}
                        onOpenSettings={isAdmin ? handleOpenSpotlightSettings : undefined}
                        onViewAllCategory={(cat) => setCurrentCategory(cat as any)}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* EDITOR'S PICKS & TRENDING IN-DEPTH ANALYSIS (4-COLUMN CARD STRIP) */}
              {currentCategory === 'all' && !searchQuery && trendingArticles.length >= 4 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                      <h2 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900 flex items-center space-x-1.5">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span>Editor's Picks & Trending Analysis</span>
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-kd-meta hidden sm:inline">
                      Top trending and viral stories today
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {trendingArticles.slice(0, 4).map((art, idx) => (
                      <div
                        key={art.id}
                        onClick={() => handleSelectArticle(art)}
                        className="group bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-red-300 transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 flex items-center space-x-1">
                            <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs font-kd-meta">
                              {art.category}
                            </span>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/75 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                            #{idx + 1} Trending
                          </span>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1 font-kd-meta">
                              {art.location && <span>{art.location} •</span>}
                              <span>{art.authorName}</span>
                            </div>
                            <h3
                              style={{ fontSize: 'var(--font-grid-card-title-size, 16px)' }}
                              className="font-bold font-kd-headline text-slate-900 group-hover:text-red-700 transition leading-snug"
                            >
                              {art.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-slate-100 font-kd-meta">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{art.readTimeMinutes || 3} Min Read</span>
                            </span>
                            <span className="text-red-600 font-bold group-hover:underline">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 2. REGIONAL STATES QUICK FILTER STRIP */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider shrink-0 bg-slate-100 px-2 py-1 rounded font-kd-meta flex items-center space-x-1">
                    <span>📍</span>
                    <span>राज्य व शहर:</span>
                  </span>
                  <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
                    {activeStatesList.map((stateName) => {
                      const isSelected = searchQuery === stateName;
                      return (
                        <button
                          key={stateName}
                          onClick={() => {
                            if (isSelected) setSearchQuery('');
                            else setSearchQuery(stateName);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-kd-meta shrink-0 flex items-center space-x-1 ${
                            isSelected
                              ? 'bg-red-600 text-white font-bold shadow-xs'
                              : 'bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200'
                          }`}
                        >
                          <span>{stateName}</span>
                          {isSelected && <span className="text-[10px] ml-0.5">✕</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* View All States Button */}
                <button
                  type="button"
                  onClick={() => setShowAllStatesModal(true)}
                  className="shrink-0 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-2.5 py-1 rounded-full transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                  title="सभी भारतीय राज्य व केंद्र शासित प्रदेश देखें"
                >
                  <span>सभी राज्य</span>
                  <span className="text-[10px]">▾</span>
                </button>
              </div>

              {/* 3. COMPACT CATEGORIES GRID (HIGH-DENSITY, BEAUTIFUL, NON-BULKY) */}
              {currentCategory === 'all' && !searchQuery && (
                <section className="space-y-3.5">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                      <h2
                        style={{ fontSize: 'var(--font-section-heading-size, 20px)' }}
                        className="font-bold font-kd-headline text-slate-900"
                      >
                        Top Categories & Stories • News Desk
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-kd-meta hidden sm:inline">
                      National, State, Politics, Business, Entertainment, Tech, Sports & World
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(['national', 'state', 'politics', 'business', 'entertainment', 'tech', 'sports', 'lifestyle', 'world'] as const).map(
                      (catKey) => {
                        const catMeta = CATEGORIES.find((c) => c.id === catKey);
                        const catNews = articles
                          .filter((a) => a.category === catKey)
                          .slice(0, 3);

                        if (catNews.length === 0) return null;

                        return (
                          <div
                            key={catKey}
                            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col justify-between"
                          >
                            {/* Mini Category Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                              <h3 className="font-bold text-sm font-kd-headline text-slate-900 flex items-center space-x-1.5">
                                <span className="w-1.5 h-3.5 bg-red-600 rounded-xs"></span>
                                <span>{catMeta?.labelEnglish} ({catMeta?.labelHindi})</span>
                              </h3>
                              <button
                                onClick={() => setCurrentCategory(catKey)}
                                className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center font-kd-meta cursor-pointer"
                              >
                                <span>View All</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>

                            {/* 3 Compact items with complete titles */}
                            <div className="space-y-2">
                              {catNews.map((item) => (
                                <ArticleCard
                                  key={item.id}
                                  article={item}
                                  layout="compact"
                                  onSelectArticle={handleSelectArticle}
                                  isBookmarked={isArticleBookmarked(item.id)}
                                  onToggleBookmark={handleToggleBookmark}
                                  isReadLater={isArticleInReadLater(item.id)}
                                  onToggleReadLater={handleToggleReadLater}
                                  displayOptions={portalSettings.displayOptions}
                                  mobileScale={portalSettings.typography?.mobileScale || 'normal'}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </section>
              )}

              {/* 3. MULTIMEDIA SECTION: LIVE VIDEO & EMBEDDED BULLETINS (ADMIN TOGGLEABLE) */}
              {portalSettings.homepageSections?.liveVideoBulletin !== false && portalSettings.liveVideoSectionEnabled !== false && (
                <VideoSection
                  title={portalSettings.liveVideoTitle || 'Live Video Bulletin'}
                  youtubeId={portalSettings.liveVideoYoutubeId || 'jfKfPfyJRdk'}
                />
              )}

              {/* 4. MULTIMEDIA SECTION: PHOTO GALLERY & WEB STORIES (ADMIN TOGGLEABLE) */}
              {portalSettings.homepageSections?.photoGallery !== false && (
                <PhotoGallerySection />
              )}

              {/* 5. HOMEPAGE BOTTOM ADVERTISEMENT */}
              {portalSettings.adSettings.showBottomAd && (
                <div className="pt-2">
                  <AdBanner
                    slot="bottom"
                    type="adsense"
                    onOpenContactPage={handleOpenContactPage}
                    breakpoints={portalSettings.adSettings.responsiveBreakpoints?.bottom}
                  />
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* FLOATING EDITORIAL LAUNCH BUTTON - Only shown to non-admin Staff (Admin uses the comprehensive AdminFrontendCustomizerBar) */}
      {isStaff && !isAdmin && (
        <button
          onClick={() => setShowAdminBackend(true)}
          className="fixed bottom-5 right-5 z-40 bg-slate-950/90 hover:bg-slate-900 text-white p-3 rounded-full shadow-2xl border border-red-600/40 flex items-center space-x-2 transition hover:scale-105 group cursor-pointer"
          title="Open Editorial & Author Studio"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <Sliders className="w-4 h-4 text-red-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-bold font-sans pr-1 hidden sm:inline">
            Editor Desk
          </span>
        </button>
      )}

      {/* COMPREHENSIVE FRONTEND ADMIN CUSTOMIZER BAR - STRICTLY VISIBLE ONLY TO ADMIN */}
      <AdminFrontendCustomizerBar
        onOpenSettingsTab={(tab) => {
          openAdminStudio(tab);
        }}
        onOpenAdminBackend={() => openAdminStudio('dashboard')}
        onNewArticle={() => openAdminStudio('articles')}
      />

      {/* IN-APP PUSH NOTIFICATION TOAST */}
      <NotificationToast
        notification={activePushToast}
        onClose={() => setActivePushToast(null)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* HOMEPAGE POPUP (CONTROLLED BY ADMIN SETTINGS) */}
      <PortalPopup
        config={portalSettings.popupConfig}
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onSubscribeEmail={(email) => {
          handleAddSubscriber({
            email,
            source: 'popup',
            status: 'active',
          });
        }}
      />

      {/* FULL-POWER ADMIN BACKEND DASHBOARD (ONE UNIFIED ADMIN & SETTINGS STUDIO) */}
      {showAdminBackend && (
        <AdminBackendPanel
          initialTab={adminInitialTab}
          onClose={() => setShowAdminBackend(false)}
          articles={articles}
          portalSettings={portalSettings}
          onUpdateSettings={handleUpdateSettings}
          onSaveArticle={handleSaveArticle}
          onDeleteArticle={handleDeleteArticle}
          subscribers={subscribers}
          onAddSubscriber={handleAddSubscriber}
          onDeleteSubscriber={handleDeleteSubscriber}
          notifications={notifications}
          onSendNotification={handleSendNotification}
          onSelectArticleToView={(art) => {
            setShowAdminBackend(false);
            handleSelectArticle(art);
          }}
          mediaAssets={mediaAssets}
          onAddMedia={handleAddMedia}
          onUpdateMedia={handleUpdateMedia}
          onDeleteMedia={handleDeleteMedia}
          editorialUsers={editorialUsers}
          onAddEditorialUser={handleAddEditorialUser}
          onUpdateEditorialUser={handleUpdateEditorialUser}
          onDeleteEditorialUser={handleDeleteEditorialUser}
          liveBlogs={liveBlogs}
          onAddLiveBlog={handleAddLiveBlog}
          onUpdateLiveBlog={handleUpdateLiveBlog}
          onDeleteLiveBlog={handleDeleteLiveBlog}
          onOpenLiveViewer={(blog) => {
            setActiveLiveBlog(blog);
            setCurrentView('live-feed');
            setShowAdminBackend(false);
          }}
          inquiries={contactInquiries}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          onDeleteInquiry={handleDeleteInquiry}
          citizenSubmissions={citizenSubmissions}
          onUpdateCitizenSubmissionStatus={handleUpdateCitizenSubmissionStatus}
          onDeleteCitizenSubmission={handleDeleteCitizenSubmission}
        />
      )}

      {/* CLASSIC PUBLISHER CMS MODAL (SECONDARY) */}
      {showPublisherCMS && (
        <PublisherCMS
          onClose={() => setShowPublisherCMS(false)}
          articles={articles}
          onArticlePublished={() => {
            fetchArticles(currentCategory).then(setArticles);
          }}
          onSelectArticleToView={(art) => {
            handleSelectArticle(art);
          }}
          apiConfig={portalSettings.apiConfig}
        />
      )}

      {/* BOOKMARKS MODAL */}
      {showBookmarks && (
        <BookmarksModal
          onClose={() => setShowBookmarks(false)}
          bookmarks={bookmarks}
          allArticles={articles}
          onSelectArticle={handleSelectArticle}
          onRemoveBookmark={handleToggleBookmark}
        />
      )}

      {/* READ LATER MODAL (SEPARATE FROM BOOKMARKS) */}
      {showReadLater && (
        <ReadLaterModal
          onClose={() => setShowReadLater(false)}
          readLaterItems={readLaterItems}
          allArticles={articles}
          bookmarks={bookmarks}
          onSelectArticle={handleSelectArticle}
          onRemoveReadLater={handleRemoveReadLater}
          onToggleBookmark={handleToggleBookmark}
          onClearAllReadLater={handleClearAllReadLater}
        />
      )}

      {/* E-PAPER MODAL */}
      {showEPaper && <EPaperModal onClose={() => setShowEPaper(false)} portalSettings={portalSettings} />}

      {/* DAILY NEWSPAPER SUDOKU PUZZLE MODAL */}
      {showSudokuModal && (
        <DailySudokuModal
          isOpen={showSudokuModal}
          onClose={() => {
            setShowSudokuModal(false);
            if (
              window.location.hash.toLowerCase().includes('sudoku') ||
              window.location.hash.toLowerCase().includes('game') ||
              window.location.hash.toLowerCase().includes('puzzle')
            ) {
              window.history.replaceState(null, '', '/');
            }
          }}
        />
      )}

      {/* RESTRICTED STAFF & ADMIN LOGIN MODAL (/login) */}
      {showStaffLogin && (
        <StaffLoginModal
          isOpen={showStaffLogin}
          onClose={() => {
            setShowStaffLogin(false);
            if (
              window.location.hash.toLowerCase().includes('login') ||
              window.location.hash.toLowerCase().includes('staff') ||
              window.location.hash.toLowerCase().includes('admin') ||
              window.location.pathname.toLowerCase().includes('/login')
            ) {
              window.history.replaceState(null, '', '/');
            }
          }}
          onLoginSuccess={() => {
            setShowStaffLogin(false);
            if (
              window.location.hash.toLowerCase().includes('login') ||
              window.location.hash.toLowerCase().includes('staff') ||
              window.location.hash.toLowerCase().includes('admin') ||
              window.location.pathname.toLowerCase().includes('/login')
            ) {
              window.history.replaceState(null, '', '/');
            }
            setShowAdminBackend(true);
          }}
        />
      )}

      {/* SUBSCRIBER CATEGORY & CONTENT PREFERENCES MODAL */}
      {showSubscriberModal && (
        <SubscriberPreferencesModal
          isOpen={showSubscriberModal}
          onClose={() => setShowSubscriberModal(false)}
          onSaveSubscriber={handleAddSubscriber}
        />
      )}

      {/* ALL INDIAN STATES & UTS MODAL DIRECTORY */}
      {showAllStatesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-kd-meta">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-kd-headline text-white leading-tight flex items-center gap-2">
                    <span>भारत के राज्य व केंद्र शासित प्रदेश</span>
                    <span className="text-[10px] bg-red-500/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-sans font-medium hidden sm:inline">
                      All States & UTs
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    रंगीन क्षेत्रवार वर्गीकरण एवं दैनिक समाचार गतिविधि के आधार पर लोकप्रिय राज्य
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAllStatesModal(false);
                  setStateModalSearch('');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition cursor-pointer"
                title="बंद करें (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs: 'By Region' and 'Most Popular' */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setStateModalTab('region')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    stateModalTab === 'region'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>क्षेत्र अनुसार सभी राज्य</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    stateModalTab === 'region' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    5 क्षेत्र
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStateModalTab('popular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    stateModalTab === 'popular'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>सर्वाधिक लोकप्रिय राज्य</span>
                  <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                    Top 3
                  </span>
                </button>
              </div>

              {searchQuery && (
                <div className="flex items-center space-x-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">सक्रिय फ़िल्टर: {searchQuery}</span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowAllStatesModal(false);
                    }}
                    className="hover:underline font-bold ml-1 cursor-pointer"
                  >
                    हटाएं ✕
                  </button>
                </div>
              )}
            </div>

            {/* Quick State Search Input inside Modal */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="राज्य का नाम खोजें (उदा: राजस्थान, उत्तर प्रदेश, मध्य प्रदेश, गुजरात)..."
                  value={stateModalSearch}
                  onChange={(e) => setStateModalSearch(e.target.value)}
                  className="w-full bg-white text-xs pl-8 pr-7 py-2 rounded-xl border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 font-medium"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {stateModalSearch && (
                  <button
                    onClick={() => setStateModalSearch('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-red-600 text-xs font-bold p-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Switch between 'popular' and 'region' */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
              {/* TAB 1: MOST POPULAR STATES (TOP 3 BASED ON NEWS ACTIVITY) */}
              {stateModalTab === 'popular' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="bg-gradient-to-r from-amber-50 via-red-50 to-amber-50 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                        🔥
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-kd-headline">
                          दैनिक समाचार गतिविधि के आधार पर शीर्ष 3 लोकप्रिय राज्य
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          प्रादेशिक ग्राउंड रिपोर्टिंग, पाठक संख्या और ताज़ा अपडेट्स पर आधारित रीयल-टाइम रैंकिंग
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top 3 Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {topPopularStates.map((st, idx) => {
                      const rankBadge = idx === 0
                        ? { label: '#1 सर्वाधिक सक्रिय', color: 'bg-red-600 text-white' }
                        : idx === 1
                        ? { label: '#2 ट्रेंडिंग कवरेज', color: 'bg-amber-500 text-slate-950' }
                        : { label: '#3 सक्रिय कवरेज', color: 'bg-blue-600 text-white' };

                      const isSelected = searchQuery === st.name;

                      return (
                        <div
                          key={st.name}
                          className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md ${
                            isSelected
                              ? 'border-red-600 bg-red-50/40 ring-2 ring-red-600/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${rankBadge.color}`}>
                                {rankBadge.label}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeClass}`}>
                                {st.regionShort}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-lg sm:text-xl font-black font-kd-headline text-slate-900">
                                {st.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-kd-meta">
                                <span className="font-bold text-red-600">{st.articleCount} ताज़ा ख़बरें</span>
                                <span>•</span>
                                <span>{st.views} पाठक</span>
                              </div>
                            </div>

                            {st.topStory && (
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">ताज़ा सुर्खी:</span>
                                <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                                  "{st.topStory.title}"
                                </p>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(st.name);
                              setCurrentCategory('all');
                              setCurrentView('home');
                              setShowAllStatesModal(false);
                              setStateModalSearch('');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                              isSelected
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-red-600 text-white'
                            }`}
                          >
                            <span>{isSelected ? '✓ चयनित है' : 'राज्य समाचार पढ़ें'}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Secondary Quick Jump to Other States */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 block mb-2 font-kd-meta">
                      अन्य प्रमुख राज्य (Quick Select):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {MAJOR_INDIAN_STATES.slice(3, 15).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setSearchQuery(st);
                            setCurrentCategory('all');
                            setCurrentView('home');
                            setShowAllStatesModal(false);
                            setStateModalSearch('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 transition cursor-pointer"
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BY REGION (COLOR-CODED REGIONS & COMPLETE NAMES) */}
              {stateModalTab === 'region' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Quick Region Jump Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRegionFilter('all')}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer border ${
                        selectedRegionFilter === 'all'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      सभी क्षेत्र
                    </button>
                    {ALL_INDIAN_STATES_BY_REGION.map((g) => {
                      const isSel = selectedRegionFilter === g.regionShort;
                      return (
                        <button
                          key={g.regionShort}
                          type="button"
                          onClick={() => setSelectedRegionFilter(isSel ? 'all' : g.regionShort)}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer border flex items-center space-x-1.5 ${
                            isSel
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : `${g.badgeClass} hover:opacity-85`
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${g.dotClass}`}></span>
                          <span>{g.regionShort}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Render Regions */}
                  {ALL_INDIAN_STATES_BY_REGION.filter((group) =>
                    selectedRegionFilter === 'all' ? true : group.regionShort === selectedRegionFilter
                  ).map((group, idx) => {
                    const filteredStates = stateModalSearch.trim()
                      ? group.states.filter((s) => s.toLowerCase().includes(stateModalSearch.toLowerCase().trim()))
                      : group.states;

                    if (filteredStates.length === 0) return null;

                    return (
                      <div key={idx} className="space-y-2.5">
                        {/* Region Section Header with Color Badge */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${group.dotClass}`}></span>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 font-kd-headline">
                              {group.region}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${group.badgeClass}`}>
                              {group.regionShort}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium font-kd-meta">
                            {filteredStates.length} राज्य व प्रदेश
                          </span>
                        </div>

                        {/* State Cards Grid - Full titles, color-coded borders and hover styles */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {filteredStates.map((st) => {
                            const isCurrent = searchQuery === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(st);
                                  setCurrentCategory('all');
                                  setCurrentView('home');
                                  setShowAllStatesModal(false);
                                  setStateModalSearch('');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between border ${
                                  isCurrent
                                    ? 'bg-red-600 text-white font-bold border-red-600 shadow-xs'
                                    : `bg-slate-50 text-slate-800 border-slate-200/90 ${group.cardHoverClass} hover:text-slate-950`
                                }`}
                              >
                                <span className="flex items-center space-x-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCurrent ? 'bg-white' : group.dotClass}`} />
                                  <span className="font-medium">{st}</span>
                                </span>
                                {isCurrent && <span className="text-xs ml-1 font-bold">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {searchQuery ? `सक्रिय फ़िल्टर: ${searchQuery}` : 'सभी राज्यों की प्रादेशिक खबरें उपलब्ध'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowAllStatesModal(false);
                  setStateModalSearch('');
                }}
                className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg font-bold cursor-pointer transition shadow-2xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          setCurrentView('home');
        }}
        onOpenEPaper={() => setShowEPaper(true)}
        onOpenPublisherCMS={() => {
          if (isStaff) setShowAdminBackend(true);
          else setShowStaffLogin(true);
        }}
        onOpenStaffLogin={() => setShowStaffLogin(true)}
        onOpenSubscriberPreferences={() => setShowSubscriberModal(true)}
        portalSettings={portalSettings}
        onOpenAdminSettings={(tab) => {
          if (!isAdmin) {
            setAdminInitialTab(tab || 'footer');
            setShowStaffLogin(true);
            return;
          }
          openAdminStudio(tab || 'footer');
        }}
        onOpenLegalPolicy={handleOpenLegalPolicy}
        onOpenContactPage={handleOpenContactPage}
        onOpenAboutUsPage={handleOpenAboutUsPage}
        onOpenSubmitNews={handleOpenSubmitNews}
        onOpenArchivePage={handleOpenArchivePage}
        onOpenSudokuGame={() => setShowSudokuModal(true)}
        onSearchState={(stateName) => {
          setSearchQuery(stateName);
          setCurrentCategory('all');
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NewsPortalMain />
    </AuthProvider>
  );
}
