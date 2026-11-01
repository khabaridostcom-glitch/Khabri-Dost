import React, { useState, useMemo } from 'react';
import {
  X,
  Sliders,
  Flame,
  Hash,
  Eye,
  Share2,
  DollarSign,
  Save,
  Check,
  Plus,
  Type,
  Sparkles,
  Tv,
  Layers,
  RotateCcw,
  Search,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Monitor,
  Globe,
  Layout,
  Zap,
  Key,
  Newspaper,
  Image as ImageIcon,
} from 'lucide-react';
import { NewsArticle, PortalSettings, NewsCategory, TrendingSectionConfig, MediaAsset } from '../types/news';
import {
  FONT_OPTIONS,
  DEFAULT_SPOTLIGHT_LAYOUT,
  DEFAULT_PORTAL_SETTINGS,
  DEFAULT_ARTICLE_META_SETTINGS,
  DEFAULT_ARTICLE_PAGE_CONFIG,
  DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  DEFAULT_MOBILE_STICKY_BAR_CONFIG,
  DEFAULT_TRENDING_CONFIG,
} from '../data/portalDefaults';
import { SpotlightSettingsTab } from './admin/SpotlightSettingsTab';
import { ArticleMetaSettingsTab } from './admin/ArticleMetaSettingsTab';
import { ArticleWidgetsSettingsTab } from './admin/ArticleWidgetsSettingsTab';
import { HeaderFooterSettingsTab } from './admin/HeaderFooterSettingsTab';
import { HomepageSectionsSettingsTab } from './admin/HomepageSectionsSettingsTab';
import { GoogleSuiteSettingsTab } from './admin/GoogleSuiteSettingsTab';
import { SpeedWebVitalsTab } from './admin/SpeedWebVitalsTab';
import { SEOAuditTab } from './admin/SEOAuditTab';
import { ApiConfigTab } from './admin/ApiConfigTab';
import { SidebarAdConfigTab } from './admin/SidebarAdConfigTab';
import { MobileSidebarSettingsTab } from './admin/MobileSidebarSettingsTab';
import { EPaperSettingsTab } from './admin/EPaperSettingsTab';
import { TypographySettingsTab } from './admin/TypographySettingsTab';
import { MediaLibraryTab } from './admin/MediaLibraryTab';

export type AdminSettingsTab =
  | 'api_config'
  | 'homepage_sections'
  | 'spotlight'
  | 'articlemeta'
  | 'sidebar_widgets'
  | 'sidebar_ads'
  | 'cards'
  | 'typography'
  | 'media_library'
  | 'header'
  | 'footer'
  | 'mobile_footer'
  | 'mobile_sidebar'
  | 'epaper'
  | 'speed_vitals'
  | 'google_suite'
  | 'seo_schema'
  | 'ticker'
  | 'livevideo'
  | 'share'
  | 'ads';

interface AdminSettingsModalProps {
  onClose: () => void;
  settings: PortalSettings;
  onSaveSettings: (settings: PortalSettings) => void;
  articles?: NewsArticle[];
  initialTab?: AdminSettingsTab;
  mediaAssets?: MediaAsset[];
  onAddMedia?: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  onUpdateMedia?: (media: Partial<MediaAsset> & { id: string }) => void;
  onDeleteMedia?: (id: string) => void;
}

interface MenuItem {
  id: AdminSettingsTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface MenuCategory {
  group: string;
  items: MenuItem[];
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  onClose,
  settings,
  onSaveSettings,
  articles = [],
  initialTab = 'typography',
  mediaAssets = [],
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
}) => {
  const [current, setCurrent] = useState<PortalSettings>(() => ({
    ...settings,
    spotlightLayout: settings.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT,
    articleMetaSettings: settings.articleMetaSettings || DEFAULT_ARTICLE_META_SETTINGS,
    articlePageConfig: settings.articlePageConfig || DEFAULT_ARTICLE_PAGE_CONFIG,
    mobileStickyBar: settings.mobileStickyBar || settings.articlePageConfig?.mobileStickyBar || DEFAULT_MOBILE_STICKY_BAR_CONFIG,
    sidebarWidgets: settings.sidebarWidgets || DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  }));

  const [activeTab, setActiveTab] = useState<AdminSettingsTab>(initialTab);

  const [newTopic, setNewTopic] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sidebar Menu Items - Organized with Symmetry & Sequential Precision
  const menuCategories: MenuCategory[] = [
    {
      group: 'HOMEPAGE & EDITORIAL',
      items: [
        {
          id: 'homepage_sections',
          label: 'Homepage & Studio Sections',
          description: 'Hide/Enable live studio, photo gallery, ticker',
          icon: Layout,
          badge: 'NEW',
        },
        {
          id: 'spotlight',
          label: '3-Cards Spotlight & Sliders',
          description: 'Hero carousel, columns 2 & 3',
          icon: Layers,
          badge: 'HOT',
        },
        {
          id: 'articlemeta',
          label: 'Article Meta & Actions',
          description: '1-line action bar, views & author',
          icon: Sliders,
        },
        {
          id: 'sidebar_widgets',
          label: 'Single Page & Sidebar Widgets',
          description: 'Trending news, polls, bio & progress',
          icon: Layout,
        },
        {
          id: 'sidebar_ads',
          label: 'Sidebar Ad Config',
          description: 'Modular slots (Top, Middle, Bottom)',
          icon: DollarSign,
          badge: 'NEW',
        },
        {
          id: 'cards',
          label: 'News Card Visibility',
          description: 'Excerpts, authors & timestamps',
          icon: Eye,
        },
        {
          id: 'media_library',
          label: 'Media Library & Assets',
          description: 'Aspect ratio cropping, Khabri Dost watermarks & stock photos',
          icon: ImageIcon,
          badge: 'DAM PRO',
        },
      ],
    },
    {
      group: 'BRANDING & TYPOGRAPHY',
      items: [
        {
          id: 'typography',
          label: 'Typography & Body Fonts',
          description: 'Headlines, body fonts & scale',
          icon: Type,
        },
        {
          id: 'header',
          label: 'Website Settings & Header/Footer',
          description: 'Header, footer, navigation menu order, social media & ads',
          icon: Globe,
          badge: 'ALL-IN-ONE',
        },
        {
          id: 'footer',
          label: 'Footer, Social & Legal',
          description: 'Footer about, branding partner, social links & RNI',
          icon: Sliders,
          badge: 'CORE',
        },
        {
          id: 'mobile_footer',
          label: 'Mobile Bottom Nav & Footer',
          description: '5-button bottom nav, 1-click presets, e-paper slot & sticky bar',
          icon: Smartphone,
          badge: 'PRESETS',
        },
        {
          id: 'mobile_sidebar',
          label: 'Mobile Sidebar Menu',
          description: 'Links, buttons, fonts, channels & logo',
          icon: Smartphone,
          badge: 'NEW',
        },
        {
          id: 'epaper',
          label: 'E-Paper Edition Manager',
          description: 'Upload, validate and publish daily newspaper PDF editions',
          icon: Newspaper,
          badge: 'PDF',
        },
      ],
    },
    {
      group: 'SPEED & CORE WEB VITALS',
      items: [
        {
          id: 'speed_vitals',
          label: 'Super Fast Speed & Web Vitals',
          description: 'LCP, FID, CLS, WebP & mobile scale',
          icon: Zap,
          badge: 'FAST',
        },
      ],
    },
    {
      group: 'ADVANCED SEO & GOOGLE SUITE',
      items: [
        {
          id: 'api_config',
          label: 'API Configuration & Keys',
          description: 'Gemini, OpenAI, Anthropic & Google Trends',
          icon: Key,
          badge: 'AI KEYS',
        },
        {
          id: 'google_suite',
          label: 'Google Suite (GA4/GSC/GTM)',
          description: 'Analytics, Search Console & AdSense',
          icon: Globe,
          badge: 'PRO',
        },
        {
          id: 'seo_schema',
          label: 'SEO Audit, Schema & Links',
          description: 'Rich snippets, broken links & sitemaps',
          icon: Sparkles,
          badge: 'SEO',
        },
      ],
    },
    {
      group: 'REAL-TIME & MONETIZATION',
      items: [
        {
          id: 'livevideo',
          label: 'Live Video Bulletin',
          description: 'Digital broadcast stream setup',
          icon: Tv,
        },
        {
          id: 'ticker',
          label: 'Ticker & Trending Topics',
          description: 'Speed controls & live hashtags',
          icon: Flame,
        },
        {
          id: 'share',
          label: 'Social Share Platforms',
          description: 'WhatsApp, Telegram, X & Meta',
          icon: Share2,
        },
        {
          id: 'ads',
          label: 'Ads & Monetization',
          description: 'Header banners & sponsor slots',
          icon: DollarSign,
        },
      ],
    },
  ];

  const filteredCategories = useMemo(() => {
    if (!menuSearch.trim()) return menuCategories;
    const q = menuSearch.toLowerCase();
    return menuCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menuSearch]);

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      const formatted = newTopic.trim().startsWith('#') ? newTopic.trim() : `#${newTopic.trim()}`;
      if (!current.trendingTopics.includes(formatted)) {
        setCurrent({
          ...current,
          trendingTopics: [...current.trendingTopics, formatted],
        });
      }
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    const updated = [...current.trendingTopics];
    updated.splice(index, 1);
    setCurrent({ ...current, trendingTopics: updated });
  };

  const handleSave = () => {
    onSaveSettings(current);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetModalScope, setResetModalScope] = useState<'typography' | 'all'>('typography');

  const handleExecuteReset = (scope: 'typography' | 'all') => {
    if (scope === 'typography') {
      const updated = {
        ...current,
        typography: { ...DEFAULT_PORTAL_SETTINGS.typography },
      };
      setCurrent(updated);
      onSaveSettings(updated);
    } else {
      const updated = {
        ...DEFAULT_PORTAL_SETTINGS,
        apiConfig: current.apiConfig,
      };
      setCurrent(updated);
      onSaveSettings(updated);
    }
    setResetModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col animate-fadeIn font-sans">
      {/* 1. TOP STUDIO HEADER */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                Portal Settings & Studio
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Configure typography, article meta actions, spotlight cards, ticker and advertising
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved successfully</span>
            </span>
          )}

          {/* Reset Settings / Fonts button */}
          <button
            type="button"
            onClick={() => {
              setResetModalScope(activeTab === 'typography' ? 'typography' : 'all');
              setResetModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            title="फ़ॉन्ट या पोर्टल सेटिंग्स रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">
              {activeTab === 'typography' ? 'Reset Fonts' : 'Reset Settings'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close Settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR WITH MENUS + CONTENT CANVAS */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Quick Search */}
          <div className="p-3 border-b border-slate-200/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Categorized Sidebar Menus */}
          <div className="p-3 space-y-4 flex-1">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                  {cat.group}
                </span>
                <div className="space-y-0.5">
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 hover:text-red-700 hover:bg-white font-medium'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-500'
                            }`}
                          />
                          <div className="min-w-0">
                            <span className="text-xs truncate block leading-tight">
                              {item.label}
                            </span>
                            <span
                              className={`text-[10px] truncate block leading-tight ${
                                isActive ? 'text-white/80' : 'text-slate-400'
                              }`}
                            >
                              {item.description}
                            </span>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
                              isActive
                                ? 'bg-black/25 text-white'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-100/70 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setResetModalScope('typography');
                  setResetModalOpen(true);
                }}
                className="flex items-center space-x-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold transition cursor-pointer"
                title="फ़ॉन्ट सेटिंग्स रीसेट करें"
              >
                <Type className="w-3 h-3" />
                <span>Reset Fonts</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  setResetModalScope('all');
                  setResetModalOpen(true);
                }}
                className="flex items-center space-x-1 text-[11px] text-red-600 hover:text-red-800 font-semibold transition cursor-pointer"
                title="संपूर्ण एडमिन सेटिंग्स रीसेट करें"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v2.6 Stable</span>
          </div>
        </aside>

        {/* RIGHT MAIN SETTINGS CANVAS */}
        <main className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* API CONFIGURATION & KEYS */}
          {activeTab === 'api_config' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <ApiConfigTab
                apiConfig={current.apiConfig}
                onSave={(newApiConfig) => {
                  const updated = { ...current, apiConfig: newApiConfig };
                  setCurrent(updated);
                  onSaveSettings(updated);
                }}
              />
            </div>
          )}

          {/* HOMEPAGE SECTIONS & STUDIO */}
          {activeTab === 'homepage_sections' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <HomepageSectionsSettingsTab
                settings={current}
                onChange={(updated) => setCurrent(updated)}
              />
            </div>
          )}

          {/* SPEED & CORE WEB VITALS */}
          {activeTab === 'speed_vitals' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <SpeedWebVitalsTab
                settings={current}
                onChange={(updated) => setCurrent(updated)}
              />
            </div>
          )}

          {/* GOOGLE SUITE */}
          {activeTab === 'google_suite' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <GoogleSuiteSettingsTab
                settings={current}
                onChange={(updated) => setCurrent(updated)}
              />
            </div>
          )}

          {/* SEO & SCHEMA */}
          {activeTab === 'seo_schema' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <SEOAuditTab
                articles={articles}
                mediaAssets={[]}
                portalSettings={current}
                onUpdateSettings={(updated) => setCurrent(updated)}
                onSaveArticle={async () => {}}
              />
            </div>
          )}

          {/* SECTION: 1. TYPOGRAPHY & FONTS */}
          {activeTab === 'typography' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <TypographySettingsTab
                settings={current}
                onUpdateTypography={(updated) =>
                  setCurrent((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, ...updated },
                  }))
                }
                onUpdateSettings={(updated) => setCurrent(updated)}
                onOpenAdminReset={() => {
                  setResetModalScope('typography');
                  setResetModalOpen(true);
                }}
              />
            </div>
          )}

          {/* SECTION: MEDIA LIBRARY & DAM */}
          {activeTab === 'media_library' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <MediaLibraryTab
                mediaAssets={mediaAssets || []}
                onAddMedia={onAddMedia || (() => {})}
                onUpdateMedia={onUpdateMedia}
                onDeleteMedia={onDeleteMedia || (() => {})}
                articles={articles}
              />
            </div>
          )}

          {/* SECTION: HEADER, BRANDING & FOOTER SETTINGS (UNIFIED WEBSITE CUSTOMIZER) */}
          {(activeTab === 'header' || activeTab === 'footer' || activeTab === 'mobile_footer') && (
            <div className="max-w-5xl mx-auto space-y-5">
              <HeaderFooterSettingsTab
                settings={current}
                onChange={(updated) => {
                  setCurrent(updated);
                  onSaveSettings(updated);
                }}
                defaultSection={
                  activeTab === 'mobile_footer'
                    ? 'mobile_footer'
                    : activeTab === 'footer'
                    ? 'footer'
                    : 'branding'
                }
              />
            </div>
          )}

          {/* SECTION: MOBILE SIDEBAR MENU & DRAWER STUDIO */}
          {activeTab === 'mobile_sidebar' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <MobileSidebarSettingsTab
                settings={current}
                onChange={(updated) => {
                  setCurrent(updated);
                  onSaveSettings(updated);
                }}
              />
            </div>
          )}

          {/* SECTION: E-PAPER & PDF ISSUE STUDIO */}
          {activeTab === 'epaper' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <EPaperSettingsTab
                settings={current}
                onChange={(updated) => {
                  setCurrent(updated);
                  onSaveSettings(updated);
                }}
              />
            </div>
          )}

          {/* SECTION: 2. ARTICLE META & ACTIONS STUDIO */}
          {activeTab === 'articlemeta' && (
            <ArticleMetaSettingsTab
              settings={current.articleMetaSettings}
              articlePageConfig={current.articlePageConfig || DEFAULT_ARTICLE_PAGE_CONFIG}
              sidebarWidgets={current.sidebarWidgets || DEFAULT_ARTICLE_SIDEBAR_WIDGETS}
              portalSettings={current}
              onChange={(updated) =>
                setCurrent({
                  ...current,
                  articleMetaSettings: updated,
                })
              }
              onUpdateArticlePageConfig={(updated) =>
                setCurrent({
                  ...current,
                  articlePageConfig: updated,
                  mobileStickyBar: updated.mobileStickyBar || current.mobileStickyBar,
                })
              }
              onUpdateSidebarWidgets={(updated) =>
                setCurrent({
                  ...current,
                  sidebarWidgets: updated,
                })
              }
              onUpdateSettings={(updated) => setCurrent(updated)}
            />
          )}

          {/* SECTION: ARTICLE PAGE & SIDEBAR WIDGETS */}
          {activeTab === 'sidebar_widgets' && (
            <ArticleWidgetsSettingsTab
              settings={current.sidebarWidgets || DEFAULT_ARTICLE_SIDEBAR_WIDGETS}
              onChange={(updated) =>
                setCurrent({
                  ...current,
                  sidebarWidgets: updated,
                })
              }
            />
          )}

          {/* SECTION: MODULAR SIDEBAR AD CONFIG */}
          {activeTab === 'sidebar_ads' && (
            <SidebarAdConfigTab
              settings={current}
              onUpdateSettings={(updated) => {
                setCurrent(updated);
                onSaveSettings(updated);
              }}
            />
          )}

          {/* SECTION: 3. SPOTLIGHT 3-CARDS & SLIDERS */}
          {activeTab === 'spotlight' && (
            <SpotlightSettingsTab
              settings={current.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT}
              onChange={(updated) =>
                setCurrent({
                  ...current,
                  spotlightLayout: updated,
                })
              }
              articles={articles}
            />
          )}

          {/* SECTION: 4. TICKER & TRENDING TOPICS */}
          {activeTab === 'ticker' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>Ticker & Trending Studio</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Headline Ticker & Trending Topics Strip
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust scrolling speed of breaking news tickers and manage trending hashtags.
                </p>
              </div>

              {/* Homepage Trending News Division Settings */}
              {(() => {
                const trendingConfig: TrendingSectionConfig = {
                  ...DEFAULT_TRENDING_CONFIG,
                  ...(current.trendingConfig || {}),
                };

                const updateTrending = (partial: Partial<TrendingSectionConfig>) => {
                  setCurrent({
                    ...current,
                    trendingConfig: {
                      ...trendingConfig,
                      ...partial,
                    },
                  });
                };

                return (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                          🔥
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Homepage Trending News Division (होमपेज ट्रेंडिंग सेक्शन)
                          </h4>
                          <p className="text-xs text-slate-500">
                            होमपेज पर ट्रेंडिंग खबरों का मुख्य ब्लॉक दिखाएं या छुपाएं
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trendingConfig.enabled !== false}
                          onChange={(e) => updateTrending({ enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    {trendingConfig.enabled !== false && (
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              सेक्शन मुख्य शीर्षक
                            </label>
                            <input
                              type="text"
                              value={trendingConfig.title}
                              onChange={(e) => updateTrending({ title: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              बैज टेक्स्ट (Badge)
                            </label>
                            <input
                              type="text"
                              value={trendingConfig.badgeText || ''}
                              onChange={(e) => updateTrending({ badgeText: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            लेआउट स्टाइल
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'hero_grid', label: 'Hero 1+4 Showcase' },
                              { id: 'grid', label: '4-Col Card Grid' },
                              { id: 'ranked_list', label: 'Numbered 01-08' },
                              { id: 'carousel', label: 'Horizontal Slider' },
                            ].map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => updateTrending({ displayStyle: s.id as any })}
                                className={`p-2 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                                  trendingConfig.displayStyle === s.id
                                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              प्रदर्शित खबरों की संख्या
                            </label>
                            <div className="flex gap-1.5">
                              {[4, 6, 8, 10, 12].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => updateTrending({ itemCount: num })}
                                  className={`flex-1 py-1 rounded-lg border text-xs font-bold ${
                                    (trendingConfig.itemCount || 8) === num
                                      ? 'bg-red-600 text-white border-red-600'
                                      : 'bg-slate-50 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              ऑटो-ट्रेंडिंग व्यूज सीमा: {trendingConfig.autoTrendingViewsThreshold || 500}
                            </label>
                            <input
                              type="range"
                              min="100"
                              max="2000"
                              step="50"
                              value={trendingConfig.autoTrendingViewsThreshold || 500}
                              onChange={(e) =>
                                updateTrending({
                                  autoTrendingViewsThreshold: Number(e.target.value),
                                })
                              }
                              className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Ticker Speed Slider */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Breaking Ticker Speed
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { id: 'ultra_slow', label: 'Ultra Slow', sec: 140 },
                    { id: 'slow', label: 'Slow (Recommended)', sec: 90 },
                    { id: 'normal', label: 'Normal', sec: 65 },
                    { id: 'fast', label: 'Fast', sec: 35 },
                    { id: 'paused', label: 'Paused', sec: 0 },
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() =>
                        setCurrent({
                          ...current,
                          tickerSpeed: speed.id as any,
                          tickerSpeedSeconds: speed.sec,
                        })
                      }
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                        current.tickerSpeed === speed.id
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Custom Duration:</span>
                    <span className="font-mono font-bold text-red-600">
                      {current.tickerSpeedSeconds || 65} Seconds per loop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="5"
                    value={current.tickerSpeedSeconds || 65}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        tickerSpeedSeconds: Number(e.target.value),
                        tickerSpeed: 'custom',
                      })
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-red-600"
                  />
                </div>
              </div>

              {/* Trending Topics Manager */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-red-600" />
                  <span>Trending Topics Strip Manager</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. #Budget2026 or #TechSummit"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {current.trendingTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2"
                    >
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(i)}
                        className="text-slate-400 hover:text-red-600 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 5. LIVE VIDEO BULLETIN */}
          {activeTab === 'livevideo' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                  <Tv className="w-4 h-4" />
                  <span>Live Video Bulletin</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Digital Broadcast Stream Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Embed YouTube Live streams or digital video bulletins directly on the portal homepage.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Enable Live Video Section
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Show or hide the dedicated video bulletin player on the homepage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={current.liveVideoSectionEnabled !== false}
                      onChange={(e) =>
                        setCurrent({ ...current, liveVideoSectionEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      YouTube Video ID / Embed Key
                    </label>
                    <input
                      type="text"
                      value={current.liveVideoYoutubeId || ''}
                      onChange={(e) =>
                        setCurrent({ ...current, liveVideoYoutubeId: e.target.value })
                      }
                      placeholder="e.g., jfKfPfyJRdk (DD News Live)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bulletin Section Title
                    </label>
                    <input
                      type="text"
                      value={current.liveVideoTitle || ''}
                      onChange={(e) =>
                        setCurrent({ ...current, liveVideoTitle: e.target.value })
                      }
                      placeholder="Live Video Bulletin Title"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 6. NEWS CARD VISIBILITY */}
          {activeTab === 'cards' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Card Visibility</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  News Card Display Options
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle which elements appear on cards across the homepage feed.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Excerpt on Mobile</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showExcerptOnMobile}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showExcerptOnMobile: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Author / Reporter Name</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showAuthor}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showAuthor: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Publication Timestamp</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showDate}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showDate: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Reader Views Counter</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showViews}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showViews: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show City / Location Badge</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showLocation}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showLocation: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Bookmark Button (बुकमार्क)</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showBookmark !== false}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showBookmark: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Social Share Button (शेयर)</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showShare !== false}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showShare: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Show Read Later Button (रीड लेटर)</span>
                    <input
                      type="checkbox"
                      checked={current.displayOptions.showReadLater !== false}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          displayOptions: {
                            ...current.displayOptions,
                            showReadLater: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 7. SOCIAL SHARE PLATFORMS */}
          {activeTab === 'share' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                  <Share2 className="w-4 h-4" />
                  <span>Social Share Networks</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Global Social Sharing Platforms
                </h3>
                <p className="text-xs text-slate-500">
                  Enable or disable social networks appearing across headers, article cards, and reader action bars.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    ['whatsapp', 'WhatsApp Sharing'],
                    ['telegram', 'Telegram Sharing'],
                    ['twitter', 'X (Twitter) Sharing'],
                    ['facebook', 'Facebook Sharing'],
                    ['copyLink', 'Copy Link Button'],
                    ['googleNews', 'Google News Card'],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800">{label}</span>
                      <input
                        type="checkbox"
                        checked={current.sharePlatforms[key as keyof typeof current.sharePlatforms]}
                        onChange={(e) =>
                          setCurrent({
                            ...current,
                            sharePlatforms: {
                              ...current.sharePlatforms,
                              [key]: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-red-600 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 8. ADS & MONETIZATION */}
          {activeTab === 'ads' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>Monetization & Ads</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Advertisement Slots & Sponsor Banners
                </h3>
                <p className="text-xs text-slate-500">
                  Configure Google AdSense slots and direct private sponsor banners.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">
                  Active Advertisement Placements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Top Header Leaderboard Ad</span>
                    <input
                      type="checkbox"
                      checked={current.adSettings.showTopAd}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, showTopAd: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">In-Article Mid Content Ad</span>
                    <input
                      type="checkbox"
                      checked={current.adSettings.showMidContentAd}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, showMidContentAd: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Sidebar Sticky Banner Ad</span>
                    <input
                      type="checkbox"
                      checked={current.adSettings.showSidebarAd}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, showSidebarAd: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="font-semibold text-slate-800">Bottom Banner Ad</span>
                    <input
                      type="checkbox"
                      checked={current.adSettings.showBottomAd}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, showBottomAd: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Private Sponsor Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">
                  Private Sponsor Banner Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={current.adSettings.privateBannerUrl || ''}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, privateBannerUrl: e.target.value },
                        })
                      }
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Destination Target Link
                    </label>
                    <input
                      type="text"
                      value={current.adSettings.privateBannerLink || ''}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          adSettings: { ...current.adSettings, privateBannerLink: e.target.value },
                        })
                      }
                      placeholder="https://advertiser.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {resetModalScope === 'typography'
                    ? 'फ़ॉन्ट सेटिंग्स रीसेट करें?'
                    : 'पोर्टल सेटिंग्स रीसेट करें?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {resetModalScope === 'typography'
                    ? 'Reset Font Settings to System Defaults'
                    : 'Reset Admin Settings to Factory Defaults'}
                </p>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setResetModalScope('typography')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  resetModalScope === 'typography'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-red-600" />
                <span>फ़ॉन्ट केवल (Fonts Only)</span>
              </button>
              <button
                type="button"
                onClick={() => setResetModalScope('all')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  resetModalScope === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>सभी सेटिंग्स (All Settings)</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              {resetModalScope === 'typography' ? (
                <>
                  <p className="font-semibold text-slate-800">
                    क्या आप हेडलाइन (Rozha One), बॉडी (Mukta) और सभी पिक्सल साइज़ को संपादकीय डिफ़ॉल्ट पर रीसेट करना चाहते हैं?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    आपके लेख, विज्ञापन व अन्य विन्यास सुरक्षित रहेंगे।
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-800">
                    क्या आप टाइपोग्राफी, टिकर, लेआउट व डिस्प्ले ऑप्शन्स को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करना चाहते हैं?
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ आपकी API कुंजियां व क्रेडेंशियल्स सुरक्षित रहेंगे।
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={() => handleExecuteReset(resetModalScope)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>हाँ, रीसेट करें (Confirm Reset)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
