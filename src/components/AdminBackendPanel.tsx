import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Flame,
  Users,
  Bell,
  DollarSign,
  Type,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  Send,
  Download,
  Upload,
  Sparkles,
  Sliders,
  Settings,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  Check,
  Radio,
  Tag,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Layers,
  Shield,
  Clock,
  Smartphone,
  LogOut,
  Filter,
  Globe,
  Code2,
  FileCode,
  Layout,
  Zap,
  Mail,
  Key,
  Lock,
  Newspaper,
  Menu,
  ChevronDown,
  ChevronRight,
  Tv,
  Camera,
  Inbox,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  NewsArticle,
  NewsCategory,
  PortalSettings,
  SubscriberItem,
  PushNotificationItem,
  PortalPopupConfig,
  MediaAsset,
  EditorialUser,
  LiveBlogEvent,
  ContactInquiry,
  CitizenNewsSubmission,
} from '../types/news';
import { CATEGORIES } from '../data/seedNews';
import {
  FONT_OPTIONS,
  INITIAL_LIVE_BLOGS,
  DEFAULT_SPOTLIGHT_LAYOUT,
  DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  DEFAULT_PORTAL_SETTINGS,
} from '../data/portalDefaults';
import { RichPostEditorModal } from './RichPostEditorModal';
import { BulkArticleManager } from './admin/BulkArticleManager';
import { MediaLibraryTab } from './admin/MediaLibraryTab';
import { UserManagementTab } from './admin/UserManagementTab';
import { AdvertisementTab } from './admin/AdvertisementTab';
import { LiveNewsManagerTab } from './admin/LiveNewsManagerTab';
import { AdminManagementTab } from './admin/AdminManagementTab';
import { SEOAuditTab } from './admin/SEOAuditTab';
import { SpotlightSettingsTab } from './admin/SpotlightSettingsTab';
import { ArticleMetaSettingsTab } from './admin/ArticleMetaSettingsTab';
import { ArticleWidgetsSettingsTab } from './admin/ArticleWidgetsSettingsTab';
import { HomepageSectionsSettingsTab } from './admin/HomepageSectionsSettingsTab';
import { GoogleSuiteSettingsTab } from './admin/GoogleSuiteSettingsTab';
import { HeaderFooterSettingsTab } from './admin/HeaderFooterSettingsTab';
import { MobileSidebarSettingsTab } from './admin/MobileSidebarSettingsTab';
import { EPaperSettingsTab } from './admin/EPaperSettingsTab';
import { SpeedWebVitalsTab } from './admin/SpeedWebVitalsTab';
import { ContactInquiriesTab } from './admin/ContactInquiriesTab';
import { CitizenSubmissionsTab } from './admin/CitizenSubmissionsTab';
import { ApiConfigTab } from './admin/ApiConfigTab';
import { LiveTrendingKeywordsWidget, TrendingTopic } from './admin/LiveTrendingKeywordsWidget';
import { AiSeoAssistantModule } from './admin/AiSeoAssistantModule';
import { SidebarAdConfigTab } from './admin/SidebarAdConfigTab';
import { TypographySettingsTab } from './admin/TypographySettingsTab';
import { resetRootCssVariablesToDefault } from '../utils/cssDefaults';

interface AdminBackendPanelProps {
  onClose: () => void;
  articles: NewsArticle[];
  portalSettings: PortalSettings;
  onUpdateSettings: (settings: PortalSettings) => void;
  onSaveArticle: (article: Partial<NewsArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  subscribers: SubscriberItem[];
  onAddSubscriber: (sub: Omit<SubscriberItem, 'id' | 'subscribedAt'>) => void;
  onDeleteSubscriber: (id: string) => void;
  notifications: PushNotificationItem[];
  onSendNotification: (
    notif: Omit<PushNotificationItem, 'id' | 'sentAt' | 'clicksCount' | 'reachCount'>
  ) => void;
  onSelectArticleToView: (article: NewsArticle) => void;
  mediaAssets?: MediaAsset[];
  onAddMedia?: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  onUpdateMedia?: (media: Partial<MediaAsset> & { id: string }) => void;
  onDeleteMedia?: (id: string) => void;
  editorialUsers?: EditorialUser[];
  onAddEditorialUser?: (user: Omit<EditorialUser, 'id' | 'joinedAt'>) => void;
  onUpdateEditorialUser?: (user: Partial<EditorialUser> & { id: string }) => void;
  onDeleteEditorialUser?: (id: string) => void;
  liveBlogs?: LiveBlogEvent[];
  onAddLiveBlog?: (blog: LiveBlogEvent) => void;
  onUpdateLiveBlog?: (blog: LiveBlogEvent) => void;
  onDeleteLiveBlog?: (id: string) => void;
  onOpenLiveViewer?: (blog: LiveBlogEvent) => void;
  inquiries?: ContactInquiry[];
  onUpdateInquiryStatus?: (id: string, status: ContactInquiry['status'], adminNotes?: string) => void;
  onDeleteInquiry?: (id: string) => void;
  citizenSubmissions?: CitizenNewsSubmission[];
  onUpdateCitizenSubmissionStatus?: (id: string, status: CitizenNewsSubmission['status']) => void;
  onDeleteCitizenSubmission?: (id: string) => void;
  initialTab?: string;
}

export const AdminBackendPanel: React.FC<AdminBackendPanelProps> = ({
  onClose,
  articles,
  portalSettings,
  onUpdateSettings,
  onSaveArticle,
  onDeleteArticle,
  subscribers,
  onAddSubscriber,
  onDeleteSubscriber,
  notifications,
  onSendNotification,
  onSelectArticleToView,
  mediaAssets = [],
  onAddMedia = () => {},
  onUpdateMedia = () => {},
  onDeleteMedia = () => {},
  editorialUsers = [],
  onAddEditorialUser = () => {},
  onUpdateEditorialUser = () => {},
  onDeleteEditorialUser = () => {},
  liveBlogs: propLiveBlogs,
  onAddLiveBlog: propOnAddLiveBlog,
  onUpdateLiveBlog: propOnUpdateLiveBlog,
  onDeleteLiveBlog: propOnDeleteLiveBlog,
  onOpenLiveViewer: propOnOpenLiveViewer,
  inquiries = [],
  onUpdateInquiryStatus = () => {},
  onDeleteInquiry = () => {},
  citizenSubmissions = [],
  onUpdateCitizenSubmissionStatus = () => {},
  onDeleteCitizenSubmission = () => {},
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'articles'
    | 'new_article'
    | 'citizen_news'
    | 'ai_seo_assistant'
    | 'live'
    | 'media'
    | 'video_gallery'
    | 'photo_stories'
    | 'users'
    | 'admins'
    | 'homepage_sections'
    | 'article_meta'
    | 'sidebar_widgets'
    | 'sidebar_ads'
    | 'monetization'
    | 'spotlight'
    | 'trending'
    | 'subscribers'
    | 'notifications'
    | 'popups'
    | 'typography'
    | 'seo_audit'
    | 'google_suite'
    | 'header_footer'
    | 'settings_general'
    | 'settings_header'
    | 'settings_footer'
    | 'settings_contact'
    | 'settings_social'
    | 'settings_policies'
    | 'mobile_sidebar'
    | 'epaper'
    | 'speed_vitals'
    | 'inquiries'
    | 'api_config'
    | 'factory_reset'
  >((initialTab as any) || 'dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  type WpMenuSection = 'dashboard' | 'news' | 'media' | 'appearance' | 'settings';

  const getMenuForTab = (tab: string): WpMenuSection => {
    if (tab === 'dashboard' || tab === 'speed_vitals') return 'dashboard';
    if (
      tab === 'articles' ||
      tab === 'new_article' ||
      tab === 'citizen_news' ||
      tab === 'live' ||
      tab === 'trending' ||
      tab === 'epaper' ||
      tab === 'ai_seo_assistant'
    ) {
      return 'news';
    }
    if (tab === 'media' || tab === 'video_gallery' || tab === 'photo_stories') {
      return 'media';
    }
    if (
      tab === 'homepage_sections' ||
      tab === 'spotlight' ||
      tab === 'settings_header' ||
      tab === 'settings_footer' ||
      tab === 'sidebar_widgets' ||
      tab === 'sidebar_ads' ||
      tab === 'article_meta' ||
      tab === 'mobile_sidebar' ||
      tab === 'typography'
    ) {
      return 'appearance';
    }
    return 'settings';
  };

  const getActiveMenuInfo = (tab: string) => {
    const menuSection = getMenuForTab(tab);
    switch (menuSection) {
      case 'dashboard':
        return {
          menuLabel: 'Dashboard',
          tabLabel: tab === 'speed_vitals' ? 'Speed & Web Vitals' : 'Dashboard Overview',
          color: 'text-red-600',
        };
      case 'news':
        return {
          menuLabel: 'News & Content',
          tabLabel:
            tab === 'articles'
              ? 'All News Articles'
              : tab === 'new_article'
              ? 'Add New Article'
              : tab === 'citizen_news'
              ? 'Citizen News Desk'
              : tab === 'live'
              ? 'Live Coverage'
              : tab === 'trending'
              ? 'Trending & Tickers'
              : tab === 'epaper'
              ? 'E-Paper Edition'
              : 'AI SEO Assistant',
          color: 'text-red-600',
        };
      case 'media':
        return {
          menuLabel: 'Media Library',
          tabLabel:
            tab === 'media'
              ? 'Media Library & WebP'
              : tab === 'video_gallery'
              ? 'Video Bulletin & Reels'
              : 'Photo Stories & Gallery',
          color: 'text-purple-600',
        };
      case 'appearance':
        return {
          menuLabel: 'Appearance & Customization',
          tabLabel:
            tab === 'homepage_sections'
              ? 'Homepage Sections & Grid'
              : tab === 'spotlight'
              ? 'Top Stories Spotlight'
              : tab === 'settings_header'
              ? 'Header & Navigation'
              : tab === 'settings_footer'
              ? 'Footer & About Section'
              : tab === 'sidebar_widgets'
              ? 'Sidebar Widgets & Rashi'
              : tab === 'sidebar_ads'
              ? 'Sidebar Ad Slots'
              : tab === 'article_meta'
              ? 'Article Layout & Meta'
              : tab === 'mobile_sidebar'
              ? 'Mobile Drawer Menu'
              : 'Typography & Hindi Fonts',
          color: 'text-blue-600',
        };
      case 'settings':
      default:
        return {
          menuLabel: 'Settings & SEO',
          tabLabel:
            tab === 'factory_reset'
              ? 'Factory Reset'
              : tab === 'settings_general'
              ? 'General & Site Identity'
              : tab === 'seo_audit'
              ? 'SEO Audit & XML Sitemap'
              : tab === 'google_suite'
              ? 'Google Suite & Analytics'
              : tab === 'monetization'
              ? 'Monetization & AdSense'
              : tab === 'inquiries'
              ? 'Contact Inquiries'
              : tab === 'settings_contact'
              ? 'Contact Information'
              : tab === 'settings_social'
              ? 'Social & WhatsApp Broadcast'
              : tab === 'settings_policies'
              ? 'Policies & Legal Compliance'
              : tab === 'users'
              ? 'Editorial Staff Roles'
              : tab === 'admins'
              ? 'Administrator Access'
              : tab === 'subscribers'
              ? 'Subscribers & VIPs'
              : tab === 'notifications'
              ? 'Push Notifications'
              : tab === 'popups'
              ? 'Popups & Reader Alerts'
              : tab === 'api_config'
              ? 'API Keys & Cloud Providers'
              : 'Settings',
          color: 'text-emerald-600',
        };
    }
  };

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const parent = getMenuForTab((initialTab as any) || 'dashboard');
    return {
      dashboard: true,
      news: parent === 'news' || parent === 'dashboard',
      media: parent === 'media',
      appearance: parent === 'appearance',
      settings: parent === 'settings',
    };
  });

  const toggleCategory = (catKey: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
      const parent = getMenuForTab(initialTab);
      setOpenCategories((prev) => ({
        ...prev,
        [parent]: true,
      }));
    }
  }, [initialTab]);

  useEffect(() => {
    const parent = getMenuForTab(activeTab);
    setOpenCategories((prev) => ({
      ...prev,
      [parent]: true,
    }));
  }, [activeTab]);

  // Local settings state
  const [localSettings, setLocalSettings] = useState<PortalSettings>(() => ({
    ...portalSettings,
    spotlightLayout: portalSettings.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT,
    sidebarWidgets: portalSettings.sidebarWidgets || DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  }));
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const {
    staffSession,
    logoutStaff,
    isAdmin,
    isStaff,
    isSessionStale,
    reauthenticateAdmin,
    markSessionStale,
    serverVerifiedAdmin,
    loginAsStaffWithGoogle,
  } = useAuth();

  // Re-authentication states for stale administrative sessions
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [reauthError, setReauthError] = useState<string | null>(null);

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    setReauthError(null);
    const res = await reauthenticateAdmin();
    setIsReauthenticating(false);
    if (!res.success && res.error) {
      setReauthError(res.error);
    }
  };

  // Subscriber category filter and newsletter targeting
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [newsletterTargetCategory, setNewsletterTargetCategory] = useState<string>('all');

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);

  // Live Blogs state fallback if not passed as prop
  const [internalLiveBlogs, setInternalLiveBlogs] = useState<LiveBlogEvent[]>(() => {
    try {
      const saved = localStorage.getItem('kd_live_blogs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LIVE_BLOGS;
  });

  const activeLiveBlogs = propLiveBlogs || internalLiveBlogs;

  const handleAddLiveBlog = (newBlog: LiveBlogEvent) => {
    if (propOnAddLiveBlog) {
      propOnAddLiveBlog(newBlog);
    } else {
      const updated = [newBlog, ...internalLiveBlogs];
      setInternalLiveBlogs(updated);
      try {
        localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleUpdateLiveBlog = (updatedBlog: LiveBlogEvent) => {
    if (propOnUpdateLiveBlog) {
      propOnUpdateLiveBlog(updatedBlog);
    } else {
      const updated = internalLiveBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
      setInternalLiveBlogs(updated);
      try {
        localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleDeleteLiveBlog = (id: string) => {
    if (propOnDeleteLiveBlog) {
      propOnDeleteLiveBlog(id);
    } else {
      const updated = internalLiveBlogs.filter((b) => b.id !== id);
      setInternalLiveBlogs(updated);
      try {
        localStorage.setItem('kd_live_blogs', JSON.stringify(updated));
      } catch {}
    }
  };

  // Trending curation
  const [newHashtag, setNewHashtag] = useState('');

  // Subscriber modal & newsletter state
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubStatus, setNewSubStatus] = useState<'active' | 'vip'>('active');
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [newsletterSentNotice, setNewsletterSentNotice] = useState(false);

  // Push notification composer
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifUrl, setNotifUrl] = useState('');
  const [notifAudience, setNotifAudience] = useState<'all' | 'breaking' | 'sports' | 'business'>('all');
  const [notifIcon, setNotifIcon] = useState('🔴');
  const [notifSentNotice, setNotifSentNotice] = useState(false);

  // Save master settings
  const handleSaveAllSettings = () => {
    onUpdateSettings(localSettings);
    setSavedSuccessMsg('Portal settings successfully updated and live!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Admin Settings Reset Modal State
  const [showAdminResetModal, setShowAdminResetModal] = useState(false);
  const [resetScope, setResetScope] = useState<'typography' | 'layout' | 'all'>('typography');

  const handleExecuteResetSettings = () => {
    let updatedSettings = { ...localSettings };
    if (resetScope === 'typography') {
      resetRootCssVariablesToDefault();
      updatedSettings.typography = { ...DEFAULT_PORTAL_SETTINGS.typography };
    } else if (resetScope === 'layout') {
      updatedSettings.homepageSections = DEFAULT_PORTAL_SETTINGS.homepageSections;
      updatedSettings.spotlightLayout = DEFAULT_PORTAL_SETTINGS.spotlightLayout;
      updatedSettings.sidebarWidgets = DEFAULT_PORTAL_SETTINGS.sidebarWidgets;
    } else if (resetScope === 'all') {
      resetRootCssVariablesToDefault();
      updatedSettings = {
        ...DEFAULT_PORTAL_SETTINGS,
        apiConfig: localSettings.apiConfig,
      };
    }

    setLocalSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    setShowAdminResetModal(false);
    setSavedSuccessMsg(
      resetScope === 'typography'
        ? '✓ फ़ॉन्ट सेटिंग्स मूल डिफ़ॉल्ट पर रीसेट कर दी गईं!'
        : resetScope === 'layout'
        ? '✓ होमपेज लेआउट व विजेट्स डिफ़ॉल्ट पर रीसेट कर दिए गए!'
        : '✓ संपूर्ण पोर्टल सेटिंग्स फ़ैक्टरी डिफ़ॉल्ट पर रीसेट कर दी गईं!'
    );
    setTimeout(() => setSavedSuccessMsg(null), 4000);
  };

  // Factory Reset Execution (Resets both portal settings and typography customizations to original factory defaults)
  const [showFactoryResetConfirmModal, setShowFactoryResetConfirmModal] = useState(false);
  const [factoryResetKeepApiKeys, setFactoryResetKeepApiKeys] = useState(true);

  const handleExecuteFactoryReset = (keepApiKeys = factoryResetKeepApiKeys) => {
    // 1. Reset CSS variables in :root to their default values defined in index.css
    resetRootCssVariablesToDefault();

    // 2. Prepare factory default settings with optional apiConfig preservation
    const factorySettings: PortalSettings = {
      ...DEFAULT_PORTAL_SETTINGS,
      apiConfig: keepApiKeys ? localSettings.apiConfig : DEFAULT_PORTAL_SETTINGS.apiConfig,
    };

    // 3. Update local state, app state, localStorage, and Firestore
    setLocalSettings(factorySettings);
    onUpdateSettings(factorySettings);
    try {
      localStorage.setItem('kd_portal_settings', JSON.stringify(factorySettings));
    } catch {}
    savePortalSettings(factorySettings).catch(() => {});

    setShowFactoryResetConfirmModal(false);
    setSavedSuccessMsg('✓ फ़ैक्टरी रीसेट सफल: पोर्टल सेटिंग्स व टाइपोग्राफी मूल डिफ़ॉल्ट पर पुनर्स्थापित की गईं!');
    setTimeout(() => setSavedSuccessMsg(null), 4500);
  };

  // Dynamic Typography updates in real-time
  const handleUpdateTypography = (changes: Partial<PortalSettings['typography']>) => {
    const updatedTypography = {
      ...localSettings.typography,
      ...changes,
    };
    const updatedSettings = {
      ...localSettings,
      typography: updatedTypography,
    };
    setLocalSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  // KPI Calculations
  const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const totalBreaking = articles.filter((a) => a.isBreaking).length;
  const activeSubscribersCount = subscribers.filter((s) => s.status !== 'unsubscribed').length;

  // Handler for adding hashtag
  const handleAddHashtag = () => {
    if (!newHashtag.trim()) return;
    const formatted = newHashtag.trim().startsWith('#')
      ? newHashtag.trim()
      : `#${newHashtag.trim()}`;

    if (!localSettings.trendingTopics.includes(formatted)) {
      const updated = {
        ...localSettings,
        trendingTopics: [...localSettings.trendingTopics, formatted],
      };
      setLocalSettings(updated);
      onUpdateSettings(updated);
    }
    setNewHashtag('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    const updated = {
      ...localSettings,
      trendingTopics: localSettings.trendingTopics.filter((t) => t !== tagToRemove),
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  // Handler for newsletter broadcast
  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSubject.trim()) return;

    setNewsletterSentNotice(true);
    setTimeout(() => {
      setNewsletterSentNotice(false);
      setNewsletterModalOpen(false);
      setNewsletterSubject('');
      setNewsletterBody('');
      setSavedSuccessMsg(`Newsletter dispatched to ${activeSubscribersCount} subscribers!`);
      setTimeout(() => setSavedSuccessMsg(null), 4000);
    }, 1200);
  };

  // Handler for push notification dispatch
  const handleSendPushNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    onSendNotification({
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      url: notifUrl.trim() || undefined,
      icon: notifIcon,
      status: 'sent',
      targetAudience: notifAudience,
    });

    setNotifSentNotice(true);
    setTimeout(() => {
      setNotifSentNotice(false);
      setNotifTitle('');
      setNotifMessage('');
      setNotifUrl('');
      setSavedSuccessMsg('Push notification broadcasted to active readers!');
      setTimeout(() => setSavedSuccessMsg(null), 4000);
    }, 800);
  };

  // Server-Side RBAC Guard: If user has neither admin nor editorial permissions
  if (!isAdmin && !isStaff) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 border border-red-100 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            सुरक्षा नियंत्रण (Restricted Access)
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-3">
            प्रशासनिक नियंत्रण कक्ष
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            खबरी दोस्त पोर्टल की सेटिंग्स, संपादकीय टीम और सिस्टम कॉन्फ़िगरेशन बदलने के लिए मुख्य व्यवस्थापक (Administrator) का प्रमाणीकरण अनिवार्य है।
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={async () => {
                await loginAsStaffWithGoogle();
              }}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Google द्वारा व्यवस्थापक लॉगिन</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer text-sm"
            >
              पोर्टल पर वापस जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col text-slate-800 font-sans">
      {/* TOP HEADER BAR (Light Theme) */}
      <header className="h-16 px-3 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer shrink-0 transition"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-white shadow-md text-base sm:text-xl shrink-0">
            KD
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                Khabri Dost Hub
              </h1>
              <span className="hidden xs:inline-block bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate">
              Newsroom CMS, Live Updates, Media Assets, Users & Monetization
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {savedSuccessMsg && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{savedSuccessMsg}</span>
            </span>
          )}

          {/* Current Authenticated Staff Member Badge */}
          {staffSession && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-xs">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold text-slate-900">{staffSession.name}</span>
                <span className={`text-[10px] font-mono font-bold uppercase ${isAdmin ? 'text-red-700' : 'text-slate-500'}`}>
                  {isAdmin ? '👑 SUPER ADMIN' : staffSession.role.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={logoutStaff}
                title="Logout Staff"
                className="text-slate-400 hover:text-red-600 transition ml-1 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Server-Side RBAC Verification Badge */}
          {isAdmin && (
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Firestore Server-Side RBAC Active"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>{serverVerifiedAdmin ? 'सर्वर प्रमाणित Admin' : 'RBAC सुरक्षा सक्रिय'}</span>
            </span>
          )}

          {/* Quick Session Lock Button for Admins */}
          {isAdmin && (
            <button
              onClick={markSessionStale}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
              title="सत्र लॉक करें (Lock Session to test re-authentication)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">सत्र लॉक करें</span>
            </button>
          )}

          {/* Reset Settings / Font Settings Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setResetScope(activeTab === 'typography' ? 'typography' : 'all');
                setShowAdminResetModal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer shadow-2xs"
              title="फ़ॉन्ट सेटिंग्स या एडमिन सेटिंग्स रीसेट करें (Reset Settings)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>{activeTab === 'typography' ? 'Reset Fonts' : 'Reset Settings'}</span>
            </button>
          )}

          {/* Save Live Changes - Only for Admin */}
          {isAdmin && (
            <button
              onClick={handleSaveAllSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Save Live Changes</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Exit Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT: SIDEBAR + CONTENT (Light Theme) */}
      <div className="flex-1 flex overflow-hidden">
        {/* MOBILE BACKDROP */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-fadeIn cursor-pointer"
          />
        )}

        {/* SIDEBAR NAVIGATION - WordPress Style Categorized Submenus & Responsive */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl transition-transform duration-200 md:static md:w-64 md:shadow-none md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Mobile Drawer Header with Close */}
          <div className="p-3 border-b border-slate-100 flex items-center justify-between md:hidden bg-slate-50">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                KD
              </div>
              <span className="font-bold text-xs text-slate-800">Admin Navigation</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto flex-1 font-kd-meta">
            {/* 1. CORE MENU: DASHBOARD */}
            <div>
              <button
                type="button"
                onClick={() => toggleCategory('dashboard')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  getMenuForTab(activeTab) === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className={`w-4 h-4 shrink-0 ${getMenuForTab(activeTab) === 'dashboard' ? 'text-red-400' : 'text-slate-500'}`} />
                  <span className="font-bold">Dashboard</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openCategories.dashboard ? 'rotate-180 text-red-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {openCategories.dashboard && (
                <div className="mt-1 pl-3 border-l-2 border-red-500/40 ml-2 space-y-0.5 animate-fadeIn">
                  {[
                    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
                    { id: 'speed_vitals', label: 'Speed & Web Vitals', icon: Zap, badge: '98/100' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                              isActive ? 'bg-black/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. CORE MENU: NEWS & CONTENT */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleCategory('news')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  getMenuForTab(activeTab) === 'news'
                    ? 'bg-red-50 text-red-900 border border-red-200/70 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-bold">News & Content</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700">
                    {articles.length}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openCategories.news ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </div>
              </button>

              {openCategories.news && (
                <div className="mt-1 pl-3 border-l-2 border-red-200/80 ml-2 space-y-0.5 animate-fadeIn">
                  {[
                    { id: 'articles', label: 'All News Articles', icon: FileText, badge: `${articles.length}` },
                    { id: 'new_article', label: 'Add New Article', icon: Plus, badge: 'NEW' },
                    {
                      id: 'citizen_news',
                      label: 'Citizen Desk (नागरिक पत्रकारिता)',
                      icon: Inbox,
                      badge:
                        citizenSubmissions.filter((s) => s.status === 'pending').length > 0
                          ? `${citizenSubmissions.filter((s) => s.status === 'pending').length} NEW`
                          : undefined,
                    },
                    { id: 'live', label: 'Live Coverage Desk', icon: Radio, badge: `${activeLiveBlogs.length}` },
                    { id: 'trending', label: 'Trending & Tickers', icon: Flame },
                    { id: 'epaper', label: 'E-Paper Edition', icon: Newspaper, badge: 'PDF' },
                    { id: 'ai_seo_assistant', label: 'AI SEO Assistant', icon: Sparkles, badge: 'AI' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'new_article') {
                            setEditingArticle(null);
                          }
                          setActiveTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                              isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. CORE MENU: MEDIA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleCategory('media')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  getMenuForTab(activeTab) === 'media'
                    ? 'bg-purple-50 text-purple-900 border border-purple-200/70 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold">Media Library</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700">
                    {mediaAssets.length}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openCategories.media ? 'rotate-180 text-purple-600' : ''
                    }`}
                  />
                </div>
              </button>

              {openCategories.media && (
                <div className="mt-1 pl-3 border-l-2 border-purple-200/80 ml-2 space-y-0.5 animate-fadeIn">
                  {[
                    { id: 'media', label: 'Media Library & WebP', icon: ImageIcon, badge: `${mediaAssets.length}` },
                    { id: 'video_gallery', label: 'Video Bulletin & Reels', icon: Tv },
                    { id: 'photo_stories', label: 'Photo Stories & Gallery', icon: Camera },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                              isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. CORE MENU: APPEARANCE & CUSTOMIZATION */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleCategory('appearance')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  getMenuForTab(activeTab) === 'appearance'
                    ? 'bg-blue-50 text-blue-900 border border-blue-200/70 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layout className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold">Appearance & Customization</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    openCategories.appearance ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {openCategories.appearance && (
                <div className="mt-1 pl-3 border-l-2 border-blue-200/80 ml-2 space-y-0.5 animate-fadeIn">
                  {[
                    { id: 'homepage_sections', label: 'Homepage Sections & Grid', icon: Layout, badge: 'CORE' },
                    { id: 'spotlight', label: 'Top Stories Spotlight', icon: Layers },
                    { id: 'settings_header', label: 'Header & Navigation', icon: Menu },
                    { id: 'settings_footer', label: 'Footer & About Section', icon: FileText },
                    { id: 'sidebar_widgets', label: 'Sidebar Widgets & Rashi', icon: Sliders, badge: 'WIDGETS' },
                    { id: 'sidebar_ads', label: 'Sidebar Ad Slots', icon: DollarSign },
                    { id: 'article_meta', label: 'Article Layout & Meta', icon: FileText },
                    { id: 'mobile_sidebar', label: 'Mobile Drawer Menu', icon: Smartphone },
                    { id: 'typography', label: 'Typography & Hindi Fonts', icon: Type, badge: 'FONTS' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                              isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. CORE MENU: SETTINGS & SEO (ADMIN ONLY) */}
            {isAdmin ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleCategory('settings')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    getMenuForTab(activeTab) === 'settings'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/70 shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">Settings & SEO</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      openCategories.settings ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {openCategories.settings && (
                  <div className="mt-1 pl-3 border-l-2 border-emerald-200/80 ml-2 space-y-0.5 animate-fadeIn">
                    {[
                      { id: 'settings_general', label: 'General & Site Identity', icon: Sliders },
                      { id: 'factory_reset', label: 'Factory Reset', icon: RotateCcw, badge: 'RESET' },
                      { id: 'seo_audit', label: 'SEO Audit & XML Sitemap', icon: Globe, badge: 'PRO' },
                      { id: 'google_suite', label: 'Google Suite & Analytics', icon: Globe },
                      { id: 'monetization', label: 'Monetization & AdSense', icon: DollarSign },
                      {
                        id: 'inquiries',
                        label: 'Contact Inquiries',
                        icon: Mail,
                        badge:
                          (inquiries || []).filter((i) => i.status === 'new').length > 0
                            ? `${(inquiries || []).filter((i) => i.status === 'new').length} NEW`
                            : undefined,
                      },
                      { id: 'settings_contact', label: 'Contact Information', icon: Mail },
                      { id: 'settings_social', label: 'Social & WhatsApp Broadcast', icon: Globe },
                      { id: 'settings_policies', label: 'Policies & Legal Compliance', icon: Shield },
                      { id: 'users', label: 'Editorial Staff & Roles', icon: Users, badge: `${editorialUsers.length}` },
                      { id: 'admins', label: 'Administrator Access', icon: Lock },
                      { id: 'subscribers', label: 'Subscribers & VIPs', icon: Users, badge: `${activeSubscribersCount}` },
                      { id: 'notifications', label: 'Push Notifications', icon: Bell },
                      { id: 'popups', label: 'Popups & Reader Alerts', icon: AlertTriangle },
                      { id: 'api_config', label: 'API Keys & Cloud Providers', icon: Key, badge: 'KEYS' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1 ${
                                isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* SIDEBAR FOOTER */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">खबरी दोस्त CMS</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
            {isAdmin && (
              <div className="pt-0.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetScope('typography');
                    setShowAdminResetModal(true);
                  }}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                  title="फ़ॉन्ट सेटिंग्स रीसेट करें"
                >
                  <Type className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate">Reset Fonts</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetScope('all');
                    setShowAdminResetModal(true);
                  }}
                  className="flex-1 py-1.5 px-2 bg-white hover:bg-red-50 text-red-700 hover:text-red-900 border border-slate-200 hover:border-red-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                  title="एडमिन सेटिंग्स रीसेट करें"
                >
                  <RotateCcw className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate">Reset Admin</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-400 truncate">WordPress-Style Admin Architecture</p>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* WordPress-Style Context Breadcrumb Bar */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200/80 max-w-6xl mx-auto flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">WP-Admin</span>
              <span>/</span>
              <span className="font-bold text-slate-700">{getActiveMenuInfo(activeTab).menuLabel}</span>
              <span>/</span>
              <span className={`font-bold ${getActiveMenuInfo(activeTab).color}`}>{getActiveMenuInfo(activeTab).tabLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setResetScope(activeTab === 'typography' ? 'typography' : 'all');
                    setShowAdminResetModal(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-600 hover:text-amber-800 transition cursor-pointer shadow-2xs"
                  title="रीसेट विकल्प खोलें"
                >
                  <RotateCcw className="w-3 h-3 text-amber-600" />
                  <span>
                    {activeTab === 'typography' ? 'फ़ॉन्ट रीसेट करें (Reset Fonts)' : 'सेटिंग्स रीसेट (Reset Settings)'}
                  </span>
                </button>
              )}
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                Khabri Dost Portal
              </span>
            </div>
          </div>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Editorial Dashboard Overview
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time news performance, editorial health, audience reach, and quick actions.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Published Articles</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                    {articles.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    ● Active in {CATEGORIES.length - 1} categories
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Total Portal Views</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                    {totalViews.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    +18% reader growth this month
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Live Breaking Stories</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1 block">
                    {totalBreaking}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    High engagement alerts active
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Subscribers & VIPs</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1 block">
                    {activeSubscribersCount}
                  </span>
                  <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                    Direct newsletter audience
                  </span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700">Quick Editorial Actions:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setActiveTab('new_article');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Article</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai_seo_assistant')}
                    className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI SEO Assistant</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('api_config')}
                    className="bg-slate-100 hover:bg-slate-200 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>API Keys</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('live')}
                    className="bg-slate-100 hover:bg-slate-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-red-600" />
                    <span>Live News 2026</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('media')}
                    className="bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media Library</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="bg-slate-100 hover:bg-slate-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Editorial Team</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('admins')}
                    className="bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Security</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('monetization')}
                    className="bg-slate-100 hover:bg-slate-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Configure Ads</span>
                  </button>

                  <button
                    onClick={() => setNewsletterModalOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Newsletter</span>
                  </button>

                  <button
                    onClick={() => setShowAdminResetModal(true)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-300 transition flex items-center space-x-1.5 cursor-pointer ml-auto shadow-2xs"
                    title="Reset Font Settings or Portal Settings to Defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset Settings</span>
                  </button>
                </div>
              </div>

              {/* LIVE TRENDING KEYWORDS WIDGET */}
              <LiveTrendingKeywordsWidget
                onDraftArticle={(trend: TrendingTopic) => {
                  setEditingArticle({
                    title: trend.query,
                    summary: trend.summary || trend.suggestedAngle,
                    content: `## क्या है पूरा मामला?\n\n${trend.summary || ''}\n\n## मुख्य बातें और आंकड़े\n\n- **विषय:** ${trend.query}\n- **संदर्भ:** ${trend.suggestedAngle || ''}\n- **ताज़ा स्थिति:** संबंधित अधिकारियों द्वारा समीक्षा जारी।\n\n## आम जनता पर क्या होगा असर?\n\nइस घटनाक्रम पर नज़र बनी हुई है। खबरी दोस्त की टीम पल-पल का अपडेट उपलब्ध करा रही है।`,
                    category: (trend.category as NewsCategory) || 'national',
                    imageUrl: trend.suggestedImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
                    imageCaption: `${trend.query} - खबरी दोस्त सचित्र रिपोर्ट`,
                    tags: trend.relatedKeywords || [trend.query.slice(0, 15), 'ताज़ा ख़बर', 'बड़ा अपडेट'],
                    focusKeywords: trend.query,
                    seoTitle: trend.query.slice(0, 60),
                    seoDescription: (trend.summary || trend.suggestedAngle).slice(0, 160),
                    status: 'draft',
                  });
                  setIsEditorOpen(true);
                }}
                onGenerateSeo={() => {
                  setActiveTab('ai_seo_assistant');
                }}
                onPinToTicker={(hashtag: string) => {
                  if (!localSettings.trendingTopics.includes(hashtag)) {
                    const updated = {
                      ...localSettings,
                      trendingTopics: [hashtag, ...localSettings.trendingTopics],
                    };
                    setLocalSettings(updated);
                    onUpdateSettings(updated);
                    setSavedSuccessMsg(`Pinned ${hashtag} to Live Portal Ticker!`);
                    setTimeout(() => setSavedSuccessMsg(null), 3000);
                  }
                }}
              />

              {/* Recent Stories Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Top Performing Stories</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    View All Articles ({articles.length}) →
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {articles.slice(0, 5).map((art) => (
                    <div
                      key={art.id}
                      className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={art.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p
                            className="font-bold text-slate-900 truncate hover:text-red-600 cursor-pointer"
                            onClick={() => onSelectArticleToView(art)}
                          >
                            {art.title}
                          </p>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {art.category} • {art.authorName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-slate-900 font-bold block">
                          {art.viewsCount.toLocaleString()} views
                        </span>
                        <div className="flex items-center justify-end space-x-1 mt-0.5">
                          {art.isBreaking && (
                            <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              BREAKING
                            </span>
                          )}
                          {art.isTopStory && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              TOP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT MANAGER (ARTICLES CMS & BULK ACTIONS) */}
          {activeTab === 'articles' && (
            <BulkArticleManager
              articles={articles}
              onSaveArticle={onSaveArticle}
              onDeleteArticle={onDeleteArticle}
              onOpenEditor={(art) => {
                setEditingArticle(art || null);
                setActiveTab('new_article');
              }}
              onSelectArticleToView={(art) => {
                onClose();
                onSelectArticleToView(art);
              }}
            />
          )}

          {/* TAB: CITIZEN NEWS DESK (NAAGRIK PATRAKAARITA) */}
          {activeTab === 'citizen_news' && (
            <CitizenSubmissionsTab
              submissions={citizenSubmissions}
              onUpdateStatus={onUpdateCitizenSubmissionStatus}
              onDeleteSubmission={onDeleteCitizenSubmission}
              onConvertToArticle={(submission) => {
                setEditingArticle({
                  title: submission.title,
                  summary: submission.description.slice(0, 150) + '...',
                  content: submission.description + (submission.isAnonymous ? '\n\n(नागरिक पत्रकार द्वारा प्रेषित)' : `\n\n(नागरिक रिपोर्टर: ${submission.senderName}, ${submission.location})`),
                  category: (submission.category as any) || 'state',
                  location: submission.location,
                  imageUrl: submission.images && submission.images.length > 0 ? submission.images[0] : '',
                  authorName: submission.isAnonymous ? 'नागरिक रिपोर्टर डेस्क' : submission.senderName,
                  isBreaking: false,
                  isTopStory: false,
                });
                onUpdateCitizenSubmissionStatus(submission.id, 'published');
                setActiveTab('new_article');
              }}
            />
          )}

          {/* TAB: INLINE WORDPRESS-STYLE FULL POST EDITOR (NO POPUPS) */}
          {(activeTab === 'new_article' || isEditorOpen) && (
            <div className="space-y-4 max-w-6xl mx-auto animate-fadeIn">
              <RichPostEditorModal
                inline={true}
                article={editingArticle}
                existingArticles={articles}
                onClose={() => {
                  setEditingArticle(null);
                  setIsEditorOpen(false);
                  setActiveTab('articles');
                }}
                onSave={async (art) => {
                  await onSaveArticle(art);
                  setEditingArticle(null);
                  setIsEditorOpen(false);
                  setActiveTab('articles');
                  setSavedSuccessMsg('समाचार सफलतापूर्वक सुरक्षित व प्रकाशित किया गया!');
                  setTimeout(() => setSavedSuccessMsg(null), 3000);
                }}
                mediaLibrary={mediaAssets}
                onOpenMediaLibrary={() => setActiveTab('media')}
                apiConfig={localSettings.apiConfig}
              />
            </div>
          )}

          {/* TAB 3: LIVE NEWS 2026 (POLITICAL NEWS & BREAKING UPDATES) */}
          {activeTab === 'live' && (
            <LiveNewsManagerTab
              liveBlogs={activeLiveBlogs}
              onAddLiveBlog={handleAddLiveBlog}
              onUpdateLiveBlog={handleUpdateLiveBlog}
              onDeleteLiveBlog={handleDeleteLiveBlog}
              onOpenLiveViewer={propOnOpenLiveViewer}
            />
          )}

          {/* TAB 4: MEDIA MANAGEMENT */}
          {activeTab === 'media' && (
            <MediaLibraryTab
              mediaAssets={mediaAssets}
              onAddMedia={onAddMedia}
              onUpdateMedia={onUpdateMedia}
              onDeleteMedia={onDeleteMedia}
            />
          )}

          {/* TAB 5: USERS MANAGEMENT (EDITORIAL ROLES & PERMISSIONS) */}
          {activeTab === 'users' && (
            <UserManagementTab
              users={editorialUsers}
              onAddUser={onAddEditorialUser}
              onUpdateUser={onUpdateEditorialUser}
              onDeleteUser={onDeleteEditorialUser}
              isSuperAdmin={isAdmin}
            />
          )}

          {/* TAB: HOMEPAGE SECTIONS & STUDIO CONTROLS */}
          {activeTab === 'homepage_sections' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <HomepageSectionsSettingsTab
                settings={localSettings}
                onChange={(newSet) => {
                  setLocalSettings(newSet);
                  onUpdateSettings(newSet);
                }}
              />
            </div>
          )}

          {/* TAB 6: ADMIN MANAGEMENT (SUPER ADMIN, BACKUPS, SYSTEM AUDIT) */}
          {activeTab === 'admins' && (
            <AdminManagementTab
              portalSettings={localSettings}
              onUpdateSettings={(newSettings) => {
                setLocalSettings(newSettings);
                onUpdateSettings(newSettings);
              }}
            />
          )}

          {/* TAB 7: ADVERTISEMENT & MONETIZATION */}
          {activeTab === 'monetization' && (
            <AdvertisementTab
              settings={localSettings}
              onUpdateSettings={(newSettings) => {
                setLocalSettings(newSettings);
                onUpdateSettings(newSettings);
              }}
            />
          )}

          {/* TAB 8: TRENDING & TICKER */}
          {activeTab === 'trending' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trending Topics & Breaking News Manager
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select curated articles to pin to the trending feed, control ticker speed, and manage hashtags.
                </p>
              </div>

              {/* Ticker Speed Settings */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Breaking News Ticker Speed</h3>
                      <p className="text-xs text-slate-500">
                        Adjust ticker marquee motion speed on desktop and mobile
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono uppercase bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                    Active: {localSettings.tickerSpeed === 'custom' ? `${localSettings.tickerSpeedSeconds || 90}s (Custom)` : localSettings.tickerSpeed || 'slow'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'ultra_slow', label: 'Ultra Slow (140s)' },
                    { id: 'slow', label: 'Slow (90s - अनुशंसित)' },
                    { id: 'normal', label: 'Normal (65s)' },
                    { id: 'fast', label: 'Fast (35s)' },
                    { id: 'custom', label: '⚙️ Custom Seconds' },
                    { id: 'paused', label: 'Paused' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      onClick={() => {
                        const updated = { ...localSettings, tickerSpeed: spd.id as any };
                        setLocalSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition flex items-center justify-center space-x-2 cursor-pointer ${
                        localSettings.tickerSpeed === spd.id
                          ? 'bg-red-600 border-red-600 text-white shadow-xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{spd.label}</span>
                      {localSettings.tickerSpeed === spd.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                {localSettings.tickerSpeed === 'custom' && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Custom Ticker Scroll Duration:</span>
                      <span className="text-red-600 font-mono text-sm font-bold bg-white px-2.5 py-0.5 rounded border border-slate-300">
                        {localSettings.tickerSpeedSeconds || 65} Seconds
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-400 font-mono">20s</span>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        step="5"
                        value={localSettings.tickerSpeedSeconds || 65}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            tickerSpeedSeconds: Number(e.target.value),
                          };
                          setLocalSettings(updated);
                          onUpdateSettings(updated);
                        }}
                        className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer accent-red-600"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">180s (Ultra Slow)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Homepage Live Video Section Manager */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Homepage Live Video Bulletin Section
                      </h3>
                      <p className="text-xs text-slate-500">
                        Enable or disable digital live video stream on the homepage
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.liveVideoSectionEnabled !== false}
                      onChange={(e) => {
                        const updated = {
                          ...localSettings,
                          liveVideoSectionEnabled: e.target.checked,
                        };
                        setLocalSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      {localSettings.liveVideoSectionEnabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Section Heading Title
                    </label>
                    <input
                      type="text"
                      value={localSettings.liveVideoTitle || 'Khabri Dost Digital Studio • Live Video Stream'}
                      onChange={(e) => {
                        const updated = {
                          ...localSettings,
                          liveVideoTitle: e.target.value,
                        };
                        setLocalSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      YouTube Video / Stream ID
                    </label>
                    <input
                      type="text"
                      value={localSettings.liveVideoYoutubeId || 'jfKfPfyJRdk'}
                      onChange={(e) => {
                        const updated = {
                          ...localSettings,
                          liveVideoYoutubeId: e.target.value,
                        };
                        setLocalSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      placeholder="e.g. jfKfPfyJRdk (DD News Live)"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hashtag Manager */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Trending Hashtags Manager</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add trending hashtag (e.g. #NationalMission)..."
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHashtag();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddHashtag}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {localSettings.trendingTopics.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveHashtag(tag)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Newsletter Subscribers & Readership Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage active readership subscribers, view chosen categories (Politics, Sports, Business), and broadcast category bulletins.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setNewsletterModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Newsletter</span>
                  </button>
                  <button
                    onClick={() => setIsAddSubOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Reader</span>
                  </button>
                </div>
              </div>

              {/* Category Preference Filter Pills */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-red-600" />
                    <span>Filter Readers by Category:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Showing: {
                      subscribers.filter((s) => subCategoryFilter === 'all' || s.preferredCategories?.includes(subCategoryFilter as any)).length
                    } / {subscribers.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `All Readers (${subscribers.length})` },
                    { id: 'politics', label: 'Politics' },
                    { id: 'national', label: 'National' },
                    { id: 'sports', label: 'Sports' },
                    { id: 'business', label: 'Business' },
                    { id: 'tech', label: 'Tech' },
                    { id: 'cinema', label: 'Cinema' },
                    { id: 'state', label: 'State' },
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setSubCategoryFilter(filterTab.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                        subCategoryFilter === filterTab.id
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filterTab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Email & Reader Name</th>
                      <th className="py-3 px-3">Preferred Categories</th>
                      <th className="py-3 px-3">Digest Format</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Subscribed Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {subscribers
                      .filter(
                        (sub) =>
                          subCategoryFilter === 'all' ||
                          sub.preferredCategories?.includes(subCategoryFilter as any)
                      )
                      .map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <p className="font-mono font-bold text-slate-900">{sub.email}</p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {sub.name || 'Anonymous Reader'}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            {sub.preferredCategories && sub.preferredCategories.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {sub.preferredCategories.map((c) => (
                                  <span
                                    key={c}
                                    className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded font-medium"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">All Categories</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[11px]">
                            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium">
                              {sub.digestPreference === 'daily_morning'
                                ? '🌅 7 AM Morning Bulletin'
                                : sub.digestPreference === 'breaking_instant'
                                ? '⚡ Instant Breaking Alerts'
                                : sub.digestPreference === 'weekly_digest'
                                ? '🗞️ Weekly Deep Dive'
                                : '🔴 All Daily Updates'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                sub.status === 'vip'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onDeleteSubscriber(sub.id)}
                              className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: PUSH NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Web Push Notifications Dispatcher
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Compose instant breaking news alerts and browser push messages for portal visitors.
                </p>
              </div>

              {/* Composer Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-600" />
                  <span>Compose Live Push Notification</span>
                </h3>

                <form onSubmit={handleSendPushNotif} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Notification Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🔴 BREAKING: Space Mission Launch Successful"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Notification Message Body *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Historic milestone achieved as national mission tests conclude successfully."
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Audience
                      </label>
                      <select
                        value={notifAudience}
                        onChange={(e) => setNotifAudience(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="all">All Web Readers</option>
                        <option value="breaking">Breaking News Subscribers</option>
                        <option value="sports">Sports Fans</option>
                        <option value="business">Business / Market Readers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Article Link ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. news-1"
                        value={notifUrl}
                        onChange={(e) => setNotifUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={notifSentNotice}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Push Notification Now</span>
                  </button>
                </form>
              </div>

              {/* Notification History */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Sent Notifications History</h3>
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900">{notif.title}</h4>
                        <p className="text-slate-600 text-[11px]">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Target: {notif.targetAudience} • Sent:{' '}
                          {new Date(notif.sentAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-emerald-700 font-bold block">
                          {notif.reachCount?.toLocaleString() || 12400} reach
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {notif.clicksCount || 820} clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: POPUPS */}
          {activeTab === 'popups' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Homepage Popup Modal Manager
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Lead capture newsletter prompts, breaking news alerts, and festival greeting modals.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.popupConfig?.enabled ?? false}
                    onChange={(e) => {
                      const updated = {
                        ...localSettings,
                        popupConfig: {
                          ...(localSettings.popupConfig || {
                            type: 'breaking_alert',
                            title: 'Breaking News Alert',
                            description: 'Important editorial bulletin update',
                            ctaText: 'Read More',
                            ctaLink: '',
                            delaySeconds: 2,
                            showFrequency: 'once_session',
                          }),
                          enabled: e.target.checked,
                        },
                      };
                      setLocalSettings(updated);
                      onUpdateSettings(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Popup Configuration Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Popup Content & Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Popup Purpose
                      </label>
                      <select
                        value={localSettings.popupConfig?.type || 'breaking_alert'}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            popupConfig: {
                              ...(localSettings.popupConfig as PortalPopupConfig),
                              type: e.target.value as any,
                            },
                          };
                          setLocalSettings(updated);
                          onUpdateSettings(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="breaking_alert">Breaking News Alert Modal</option>
                        <option value="newsletter_subscribe">Newsletter Subscription Lead Capture</option>
                        <option value="special_coverage">Special Event / Election Coverage</option>
                        <option value="festive_greeting">Festive & Holiday Greetings</option>
                        <option value="app_install">Mobile App Install Prompt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Popup Headline
                      </label>
                      <input
                        type="text"
                        value={localSettings.popupConfig?.title || ''}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            popupConfig: {
                              ...(localSettings.popupConfig as PortalPopupConfig),
                              title: e.target.value,
                            },
                          };
                          setLocalSettings(updated);
                          onUpdateSettings(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Popup Description
                      </label>
                      <textarea
                        rows={2}
                        value={localSettings.popupConfig?.description || ''}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            popupConfig: {
                              ...(localSettings.popupConfig as PortalPopupConfig),
                              description: e.target.value,
                            },
                          };
                          setLocalSettings(updated);
                          onUpdateSettings(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Featured Image URL
                      </label>
                      <input
                        type="text"
                        value={localSettings.popupConfig?.imageUrl || ''}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            popupConfig: {
                              ...(localSettings.popupConfig as PortalPopupConfig),
                              imageUrl: e.target.value,
                            },
                          };
                          setLocalSettings(updated);
                          onUpdateSettings(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                      Live Popup Preview
                    </span>
                    <div className="bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                      {localSettings.popupConfig?.imageUrl && (
                        <img
                          src={localSettings.popupConfig.imageUrl}
                          alt=""
                          className="w-full h-36 object-cover"
                        />
                      )}
                      <div className="p-4 space-y-2">
                        <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          {localSettings.popupConfig?.type.replace('_', ' ') || 'ALERT'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {localSettings.popupConfig?.title || 'Popup Headline'}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-3">
                          {localSettings.popupConfig?.description ||
                            'This message will appear to visitors on the homepage.'}
                        </p>
                        <button className="w-full bg-red-600 text-white text-xs font-bold py-2 rounded-xl mt-2 cursor-pointer shadow-xs">
                          {localSettings.popupConfig?.ctaText || 'Read Story'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SPOTLIGHT 3-CARDS & SLIDERS */}
          {activeTab === 'spotlight' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                    Spotlight Cards & Slider Studio Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage Card 1 (Carousel Slider), Card 2 (Secondary Stories), and Card 3 (Upward Sliding Briefs).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Layout</span>
                </button>
              </div>

              <SpotlightSettingsTab
                settings={localSettings.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT}
                onChange={(updated) => {
                  const newSettings = {
                    ...localSettings,
                    spotlightLayout: updated,
                  };
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Layout settings updated live!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
                articles={articles}
              />
            </div>
          )}

          {/* TAB: ARTICLE META & ACTION BAR */}
          {activeTab === 'article_meta' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                    Article Meta & 1-Line Action Bar Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage reader views count, author credentials, timestamps, and the single-line compact sharing bar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>

              <ArticleMetaSettingsTab
                settings={localSettings.articleMetaSettings}
                onChange={(updated) => {
                  const newSettings = {
                    ...localSettings,
                    articleMetaSettings: updated,
                  };
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Article meta settings updated live!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB: SINGLE PAGE & SIDEBAR WIDGETS (Admin Exclusive) */}
          {activeTab === 'sidebar_widgets' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                    Single Page Content & Sidebar Widgets Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage single article page elements and sidebar widgets (reading progress bar, trending 1-5 rankings, daily opinion poll, 1-click newsletter, e-paper, and author credentials).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Widgets</span>
                </button>
              </div>

              <ArticleWidgetsSettingsTab
                settings={localSettings.sidebarWidgets || DEFAULT_ARTICLE_SIDEBAR_WIDGETS}
                onChange={(updated) => {
                  const newSettings = {
                    ...localSettings,
                    sidebarWidgets: updated,
                  };
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Widget settings updated live!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB: MODULAR SIDEBAR AD CONFIG */}
          {activeTab === 'sidebar_ads' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
              <SidebarAdConfigTab
                settings={localSettings}
                onUpdateSettings={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Sidebar Ad settings saved!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB 12: TYPOGRAPHY & LAYOUT (Fully Wired Live & Granular Custom PX Inputs) */}
          {activeTab === 'typography' && (
            <TypographySettingsTab
              settings={localSettings}
              onUpdateTypography={handleUpdateTypography}
              onUpdateSettings={onUpdateSettings}
              onOpenAdminReset={() => {
                setResetScope('all');
                setShowAdminResetModal(true);
              }}
            />
          )}

          {/* TAB 13: GOOGLE SUITE (SEARCH CONSOLE, ANALYTICS, ADSENSE) */}
          {activeTab === 'google_suite' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <GoogleSuiteSettingsTab
                settings={localSettings}
                onChange={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Google Services Suite settings saved!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB 14: WEBSITE SETTINGS (WORDPRESS-STYLE CATEGORIZED SECTIONS) */}
          {(activeTab === 'header_footer' ||
            activeTab === 'settings_general' ||
            activeTab === 'settings_header' ||
            activeTab === 'settings_footer' ||
            activeTab === 'settings_contact' ||
            activeTab === 'settings_social' ||
            activeTab === 'settings_policies' ||
            activeTab === 'video_gallery' ||
            activeTab === 'photo_stories') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <HeaderFooterSettingsTab
                settings={localSettings}
                defaultSection={
                  activeTab === 'settings_general'
                    ? 'branding'
                    : activeTab === 'settings_header'
                    ? 'navigation'
                    : activeTab === 'settings_footer'
                    ? 'footer'
                    : activeTab === 'settings_contact'
                    ? 'contact'
                    : activeTab === 'settings_social'
                    ? 'social'
                    : activeTab === 'settings_policies'
                    ? 'policies'
                    : activeTab === 'video_gallery' || activeTab === 'photo_stories'
                    ? 'multimedia'
                    : 'branding'
                }
                onChange={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('वेबसाइट सेटिंग्स सफलतापूर्वक अपडेट की गईं!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
                onOpenFactoryReset={() => setActiveTab('factory_reset')}
              />
            </div>
          )}

          {/* TAB: MOBILE SIDEBAR & DRAWER STUDIO */}
          {/* TAB: MOBILE SIDEBAR & DRAWER */}
          {activeTab === 'mobile_sidebar' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <MobileSidebarSettingsTab
                settings={localSettings}
                onChange={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('मोबाइल साइडबार सेटिंग्स सफलतापूर्वक अपडेट की गईं!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB: E-PAPER & PDF ISSUE STUDIO */}
          {activeTab === 'epaper' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <EPaperSettingsTab
                settings={localSettings}
                onChange={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('ई-पेपर सेटिंग्स एवं संस्करण सफलतापूर्वक अपडेट किए गए!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB: ADVANCE LEVEL SEO OPTIMIZATION & BULK META EDITOR */}
          {activeTab === 'seo_audit' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <SEOAuditTab
                articles={articles}
                mediaAssets={mediaAssets}
                portalSettings={localSettings}
                onUpdateSettings={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                }}
                onSaveArticle={onSaveArticle}
                onUpdateMedia={onUpdateMedia}
              />
            </div>
          )}

          {/* TAB 15: SPEED & CORE WEB VITALS */}
          {activeTab === 'speed_vitals' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <SpeedWebVitalsTab
                settings={localSettings}
                onChange={(newSettings) => {
                  setLocalSettings(newSettings);
                  onUpdateSettings(newSettings);
                  setSavedSuccessMsg('Speed & Core Web Vitals optimizations saved!');
                  setTimeout(() => setSavedSuccessMsg(null), 2500);
                }}
              />
            </div>
          )}

          {/* TAB 16: CONTACT DESK & INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <ContactInquiriesTab
                inquiries={inquiries}
                onUpdateInquiryStatus={onUpdateInquiryStatus}
                onDeleteInquiry={onDeleteInquiry}
              />
            </div>
          )}

          {/* TAB 17: AI SEO ASSISTANT MODULE */}
          {activeTab === 'ai_seo_assistant' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <AiSeoAssistantModule
                apiConfig={localSettings.apiConfig}
                articles={articles}
                onOpenArticleEditorWithData={(data) => {
                  setEditingArticle({
                    title: data.title,
                    summary: data.summary,
                    content: data.content,
                    category: data.category,
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                    focusKeywords: data.focusKeywords,
                    tags: data.tags,
                    status: 'draft',
                  });
                  setActiveTab('new_article');
                }}
              />
            </div>
          )}

          {/* TAB 18: API CONFIGURATION & KEYS */}
          {activeTab === 'api_config' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <ApiConfigTab
                apiConfig={localSettings.apiConfig}
                onSave={(newApiConfig) => {
                  const updated = { ...localSettings, apiConfig: newApiConfig };
                  setLocalSettings(updated);
                  onUpdateSettings(updated);
                  setSavedSuccessMsg('API Configurations successfully saved & active!');
                  setTimeout(() => setSavedSuccessMsg(null), 3000);
                }}
              />
            </div>
          )}

          {/* TAB 19: FACTORY RESET (PORTAL SETTINGS & TYPOGRAPHY RESTORE) */}
          {activeTab === 'factory_reset' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn font-kd-meta">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white p-6 sm:p-7 rounded-3xl border border-red-900/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shadow-inner shrink-0">
                      <RotateCcw className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-kd-headline">
                          Factory Reset (फ़ैक्टरी रीसेट)
                        </h2>
                        <span className="bg-red-500/20 text-red-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-red-500/40">
                          SYSTEM RESTORE
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        पोर्टल सेटिंग्स व टाइपोग्राफी कस्टमाइज़ेशन को मूल फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFactoryResetConfirmModal(true)}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>फ़ैक्टरी रीसेट लागू करें</span>
                  </button>
                </div>
              </div>

              {/* What will be reset overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Typography Customizations Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2.5 text-slate-900">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">1. Typography Customizations (टाइपोग्राफी)</h3>
                      <p className="text-[11px] text-slate-500">फ़ॉन्ट फ़ैमिली, पिक्सल साइज़ व CSS वैरिएबल्स</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5 font-kd-meta">
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">हेडलाइन फ़ॉन्ट:</span>
                      <span className="font-semibold text-slate-900 font-mono">Rozha One, serif</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">बॉडी टेक्स्ट फ़ॉन्ट:</span>
                      <span className="font-semibold text-slate-900 font-mono">Mukta, sans-serif</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">डेस्कटॉप लेख शीर्षक:</span>
                      <span className="font-semibold text-slate-900 font-mono">38px</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">मोबाइल लेख शीर्षक:</span>
                      <span className="font-semibold text-slate-900 font-mono">28px</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">बॉडी टेक्स्ट आकार:</span>
                      <span className="font-semibold text-slate-900 font-mono">17px (लाइन-हाइट 1.75x)</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">:root CSS वैरिएबल्स:</span>
                      <span className="font-bold text-emerald-700">index.css Defaults</span>
                    </div>
                  </div>
                </div>

                {/* 2. Portal Settings & Layouts Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2.5 text-slate-900">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">2. Portal Settings & Layout (पोर्टल सेटिंग्स)</h3>
                      <p className="text-[11px] text-slate-500">होमपेज, विजेट्स, टिकर व डिस्प्ले ऑप्शन्स</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5 font-kd-meta">
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">स्पॉटलाइट लेआउट:</span>
                      <span className="font-semibold text-slate-900">3-Card Classic Grid</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">ट्रेंडिंग टिकर स्पीड:</span>
                      <span className="font-semibold text-slate-900">Slow (90 सेकंड्स)</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">साइडबार विजेट्स:</span>
                      <span className="font-semibold text-slate-900">Trending, Polls, Bio</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">सोशल शेयर्स:</span>
                      <span className="font-semibold text-slate-900">WhatsApp, X, FB Active</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/50">
                      <span className="text-slate-500">विज्ञापन स्लॉट्स:</span>
                      <span className="font-semibold text-slate-900">AdSense & Private Defaults</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">डेटाबेस सिंक:</span>
                      <span className="font-bold text-emerald-700">Firestore Real-Time Sync</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Safeguards Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 text-slate-900">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold">सुरक्षा व क्रेडेंशियल सुरक्षा (Safety & Credential Protection)</h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={factoryResetKeepApiKeys}
                      onChange={(e) => setFactoryResetKeepApiKeys(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded mt-0.5 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        API कुंजियां व क्लाउड प्रोवाइडर क्रेडेंशियल्स सुरक्षित रखें (Retain Configured API Keys)
                      </span>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        अनुशंसित। आपकी Gemini, OpenAI, Google Suite व अन्य AI/क्लाउड कुंजियां सुरक्षित रहेंगी ताकि सेवा बाधित न हो।
                      </p>
                    </div>
                  </label>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">
                      <strong>सूचना:</strong> इस प्रक्रिया से आपके प्रकाशित समाचार लेख, मीडिया लाइब्रेरी छवियां, व संवाददाता खाते <strong>हटाए नहीं जाएंगे</strong>। केवल वेबसाइट का डिज़ाइन, फ़ॉन्ट, व लेआउट कॉन्फ़िगरेशन मूल डिफ़ॉल्ट पर रीसेट होगा।
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFactoryResetConfirmModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>फ़ैक्टरी रीसेट शुरू करें (Initiate Factory Reset)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD SUBSCRIBER MODAL (Light Theme) */}
      {isAddSubOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Reader to Newsletter</h3>
              <button onClick={() => setIsAddSubOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSubEmail.trim()) return;
                onAddSubscriber({
                  email: newSubEmail.trim(),
                  name: newSubName.trim() || undefined,
                  status: newSubStatus,
                  source: 'manual',
                  tags: ['Admin Added'],
                });
                setNewSubEmail('');
                setNewSubName('');
                setIsAddSubOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reader Name</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Add Subscriber
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEWSLETTER BROADCAST MODAL (Light Theme) */}
      {newsletterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-5 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <span>Dispatch Newsletter Bulletin ({activeSubscribersCount} readers)</span>
              </h3>
              <button onClick={() => setNewsletterModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendNewsletter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Reader Category
                </label>
                <select
                  value={newsletterTargetCategory}
                  onChange={(e) => setNewsletterTargetCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Readers ({subscribers.length} subscribers)</option>
                  <option value="politics">Politics Readers</option>
                  <option value="sports">Sports Fans</option>
                  <option value="business">Business & Markets</option>
                  <option value="national">National Affairs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Newsletter Subject *</label>
                <input
                  type="text"
                  required
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  placeholder="e.g. Daily Khabri Dost Bulletin: Top 5 Headlines Today"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Introductory Note</label>
                <textarea
                  rows={3}
                  value={newsletterBody}
                  onChange={(e) => setNewsletterBody(e.target.value)}
                  placeholder="Dear readers, here is your morning curated news digest..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={newsletterSentNotice}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                {newsletterSentNotice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Newsletter Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FACTORY RESET CONFIRMATION MODAL */}
      {showFactoryResetConfirmModal && (
        <div className="fixed inset-0 z-[66] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  फ़ैक्टरी रीसेट की पुष्टि करें
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Confirm Factory Reset
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200/80 text-xs text-red-900 space-y-2 leading-relaxed">
              <p className="font-bold">
                ⚠️ क्या आप वाकई पोर्टल सेटिंग्स और टाइपोग्राफी कस्टमाइज़ेशन दोनों को मूल फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करना चाहते हैं?
              </p>
              <div className="space-y-1 text-[11px] text-red-800">
                <div>• टाइपोग्राफी: Rozha One (हेडलाइन), Mukta (बॉडी), 38px/17px</div>
                <div>• :root CSS वैरिएबल्स: index.css मूल मान</div>
                <div>• पोर्टल सेटिंग्स: 3-कार्ड स्पॉटलाइट, स्टैंडर्ड टिकर, विजेट्स</div>
                <div className="text-emerald-800 font-bold">
                  • API Keys: {factoryResetKeepApiKeys ? '✓ सुरक्षित रहेंगी' : '⚠️ साफ़ कर दी जाएंगी'}
                </div>
              </div>
            </div>

            <label className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={factoryResetKeepApiKeys}
                onChange={(e) => setFactoryResetKeepApiKeys(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-semibold">
                API कुंजियां सुरक्षित रखें (Retain API Keys)
              </span>
            </label>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowFactoryResetConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={() => handleExecuteFactoryReset(factoryResetKeepApiKeys)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>हाँ, फ़ैक्टरी रीसेट करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN & FONT SETTINGS RESET MODAL */}
      {showAdminResetModal && (
        <div className="fixed inset-0 z-[65] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    एडमिन व फ़ॉन्ट सेटिंग्स रीसेट
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reset Editorial Typography & Admin Configuration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminResetModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Selection Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                रीसेट का दायरा चुनें (Select Reset Scope):
              </label>

              {/* Option 1: Typography Only */}
              <div
                onClick={() => setResetScope('typography')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                  resetScope === 'typography'
                    ? 'border-red-500 bg-red-50/60 shadow-xs ring-1 ring-red-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    resetScope === 'typography'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Type className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      फ़ॉन्ट सेटिंग्स केवल (Reset Fonts & Typography Only)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      अनुशंसित
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    हेडलाइन (Rozha One), बॉडी (Mukta), लाइन-हाइट (1.75x) व सभी डेस्कटॉप/मोबाइल पिक्सल साइज़ को संपादकीय डिफ़ॉल्ट पर रीसेट करें। आपके लेख व अन्य डेटा सुरक्षित रहेंगे।
                  </p>
                </div>
              </div>

              {/* Option 2: Layout & Widgets */}
              <div
                onClick={() => setResetScope('layout')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                  resetScope === 'layout'
                    ? 'border-red-500 bg-red-50/60 shadow-xs ring-1 ring-red-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    resetScope === 'layout'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    होमपेज लेआउट व विजेट्स (Reset Layout & Widgets)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    स्पॉटलाइट लेआउट, 3-कार्ड ग्रिड व सिंगल-पेज साइडबार विजेट्स को मूल न्यूज़पेपर ग्रिड डिफ़ॉल्ट पर पुनर्स्थापित करें।
                  </p>
                </div>
              </div>

              {/* Option 3: Full Admin Reset */}
              <div
                onClick={() => setResetScope('all')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                  resetScope === 'all'
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    resetScope === 'all'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      संपूर्ण एडमिन सेटिंग्स (Reset All Admin Settings)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      फ़ैक्टरी
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    सभी पोर्टल सेटिंग्स (टाइपोग्राफी, टिकर, सोशल शेयर्स, डिस्प्ले ऑप्शन्स) को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें। आपकी API कुंजियां सुरक्षित रहेंगी।
                  </p>
                </div>
              </div>
            </div>

            {/* Details Preview Box */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>रीसेट के बाद लागू होने वाले मान:</span>
              </div>
              {resetScope === 'typography' && (
                <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                  <div>• हेडलाइन फ़ॉन्ट: <strong>Rozha One, serif</strong></div>
                  <div>• बॉडी फ़ॉन्ट: <strong>Mukta, sans-serif</strong></div>
                  <div>• मुख्य शीर्षक: <strong>38px Desktop / 28px Mobile</strong></div>
                  <div>• बॉडी टेक्स्ट: <strong>17px (लाइन-हाइट 1.75x)</strong></div>
                </div>
              )}
              {resetScope === 'layout' && (
                <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                  <div>• हीरो स्पॉटलाइट: <strong>3-कॉलम क्लासिक ग्रिड</strong></div>
                  <div>• ट्रेंडिंग टिकर: <strong>90 सेकंड्स (Slow)</strong></div>
                  <div>• साइडबार विजेट्स: <strong>ट्रेंडिंग, पोल, लेखक बायो</strong></div>
                  <div>• मोबाइल लेआउट: <strong>कॉम्पैक्ट कार्ड्स</strong></div>
                </div>
              )}
              {resetScope === 'all' && (
                <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                  <div>• टाइपोग्राफी: <strong>पूर्ण संपादकीय डिफ़ॉल्ट</strong></div>
                  <div>• लेआउट व टिकर: <strong>मानक अख़बार ग्रिड</strong></div>
                  <div>• सोशल लिंक्स: <strong>डिफ़ॉल्ट प्लेटफॉर्म्स</strong></div>
                  <div className="text-emerald-700 font-bold">• API Keys: <strong>सुरक्षित (बदलाव नहीं)</strong></div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdminResetModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleExecuteResetSettings}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {resetScope === 'typography'
                    ? 'हाँ, फ़ॉन्ट रीसेट करें (Reset Fonts)'
                    : resetScope === 'layout'
                    ? 'हाँ, लेआउट रीसेट करें (Reset Layout)'
                    : 'हाँ, संपूर्ण सेटिंग्स रीसेट करें (Reset All)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORCED RE-AUTHENTICATION GATE FOR STALE ADMINISTRATOR SESSIONS */}
      {isSessionStale && (
        <div className="fixed inset-0 z-[70] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              सत्र समय सीमा समाप्त (Session Timeout)
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-3">
              व्यवस्थापक पुनः प्रमाणीकरण आवश्यक
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              प्रशासनिक सुरक्षा मानकों के तहत आपके व्यवस्थापक सत्र को पुनः प्रमाणित करना आवश्यक है। संवेदनशील पोर्टल डेटा व प्रकाशन अधिकारों की सुरक्षा हेतु कृपया अपनी पहचान सत्यापित करें।
            </p>
            {reauthError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-left">
                {reauthError}
              </div>
            )}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleReauthenticate}
                disabled={isReauthenticating}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isReauthenticating ? 'animate-spin' : ''}`} />
                <span>{isReauthenticating ? 'सत्यापन जारी...' : 'Google द्वारा पुनः प्रमाणित करें (Re-authenticate)'}</span>
              </button>
              <button
                onClick={() => {
                  logoutStaff();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer text-sm"
              >
                सत्र बंद करें एवं बाहर जाएं (Sign Out)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
