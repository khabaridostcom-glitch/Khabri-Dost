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
} from 'lucide-react';
import { NewsArticle, PortalSettings, NewsCategory } from '../types/news';
import {
  FONT_OPTIONS,
  DEFAULT_SPOTLIGHT_LAYOUT,
  DEFAULT_PORTAL_SETTINGS,
  DEFAULT_ARTICLE_META_SETTINGS,
  DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
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

export type AdminSettingsTab =
  | 'api_config'
  | 'homepage_sections'
  | 'spotlight'
  | 'articlemeta'
  | 'sidebar_widgets'
  | 'sidebar_ads'
  | 'cards'
  | 'typography'
  | 'header'
  | 'footer'
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
}) => {
  const [current, setCurrent] = useState<PortalSettings>(() => ({
    ...settings,
    spotlightLayout: settings.spotlightLayout || DEFAULT_SPOTLIGHT_LAYOUT,
    articleMetaSettings: settings.articleMetaSettings || DEFAULT_ARTICLE_META_SETTINGS,
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
          label: 'Website Settings & Header/Footer (सम्पूर्ण सेटिंग्स)',
          description: 'हेडर, फुटर, नेविगेशन मेनू क्रम, सोशल मीडिया व विज्ञापन',
          icon: Globe,
          badge: 'ALL-IN-ONE',
        },
        {
          id: 'footer',
          label: 'Footer, Social & Legal (फुटर व पार्टनर)',
          description: 'फुटर अबाउट, पार्टनर कंपनी, सोशल व RNI',
          icon: Sliders,
          badge: 'CORE',
        },
        {
          id: 'mobile_sidebar',
          label: 'Mobile Sidebar Menu (मोबाइल साइडबार)',
          description: 'Links, buttons, fonts, channels & logo',
          icon: Smartphone,
          badge: 'NEW',
        },
        {
          id: 'epaper',
          label: 'E-Paper & PDF Issue (ई-पेपर व PDF)',
          description: 'Upload print PDF or auto-generate edition',
          icon: Newspaper,
          badge: 'EDITION',
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col animate-fadeIn font-sans">
      {/* 1. TOP STUDIO HEADER */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Portal Settings & Studio
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Configure typography, article meta actions, spotlight cards, ticker and advertising
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
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
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            title="फ़ॉन्ट या पोर्टल सेटिंग्स रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
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
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close Settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR WITH MENUS + CONTENT CANVAS */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Quick Search */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Categorized Sidebar Menus */}
          <div className="p-3 space-y-4 flex-1">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
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
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-400'
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
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
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
          <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setResetModalScope('typography');
                  setResetModalOpen(true);
                }}
                className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-white font-semibold transition cursor-pointer"
                title="फ़ॉन्ट सेटिंग्स रीसेट करें"
              >
                <Type className="w-3 h-3" />
                <span>Reset Fonts</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => {
                  setResetModalScope('all');
                  setResetModalOpen(true);
                }}
                className="flex items-center space-x-1 text-[11px] text-red-400 hover:text-white font-semibold transition cursor-pointer"
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
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                    <Type className="w-4 h-4" />
                    <span>Typography Studio</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Font Family, Weights & Scaling
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select primary headline and article body fonts. These settings dynamically apply across the entire portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResetModalScope('typography');
                    setResetModalOpen(true);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-2xs"
                  title="फ़ॉन्ट सेटिंग्स डिफ़ॉल्ट पर रीसेट करें"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reset Font Settings</span>
                </button>
              </div>

              {/* Font Family Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Headline Font */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <label className="block font-bold text-slate-800 text-xs">
                    Primary Headline & Title Font
                  </label>
                  <select
                    value={current.typography.headlineFont}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        typography: { ...current.typography, headlineFont: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <optgroup label="Hindi / Devanagari Editorial Fonts">
                      {FONT_OPTIONS.filter((f) => f.category === 'hindi').map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="English Sans / Serif Fonts">
                      {FONT_OPTIONS.filter((f) => f.category === 'english').map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1.5">
                      Headline Font Weight:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[600, 700, 800, 900].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, headlineWeight: wt },
                            })
                          }
                          className={`py-1.5 rounded-xl border text-xs text-center font-bold transition cursor-pointer ${
                            current.typography.headlineWeight === wt
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Body Font */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <label className="block font-bold text-slate-800 text-xs">
                    Article Body & Paragraph Font
                  </label>
                  <select
                    value={current.typography.bodyFont}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        typography: { ...current.typography, bodyFont: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <optgroup label="Hindi / Devanagari Editorial Fonts">
                      {FONT_OPTIONS.filter((f) => f.category === 'hindi').map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="English Sans / Serif Fonts">
                      {FONT_OPTIONS.filter((f) => f.category === 'english').map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1.5">
                      Body Font Weight:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[300, 400, 500, 600].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, bodyWeight: wt },
                            })
                          }
                          className={`py-1.5 rounded-xl border text-xs text-center font-bold transition cursor-pointer ${
                            current.typography.bodyWeight === wt
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Scale & Base Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Mobile Viewport Font Scaling
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'compact', label: 'Compact (96%)' },
                      { id: 'normal', label: 'Normal (100%)' },
                      { id: 'large', label: 'Spacious (114%)' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCurrent({
                            ...current,
                            typography: {
                              ...current.typography,
                              mobileScale: item.id as any,
                            },
                          })
                        }
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                          current.typography.mobileScale === item.id
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Global Base Font Size
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: 'small', label: 'Small' },
                      { id: 'normal', label: 'Normal' },
                      { id: 'large', label: 'Large' },
                      { id: 'xlarge', label: 'X-Large' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCurrent({
                            ...current,
                            typography: {
                              ...current.typography,
                              baseSize: item.id as any,
                            },
                          })
                        }
                        className={`py-2 px-1 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                          current.typography.baseSize === item.id
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* GRANULAR FONT SIZES CUSTOMIZATION (HEADINGS, TITLES, CONTENT, ARCHIVE & META) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-kd-headline flex items-center gap-1.5">
                      <span>विस्तृत फ़ॉन्ट साइज कस्टमाइज़ेशन</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        Detailed Sizing
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      वेबसाइट के प्रत्येक घटक (शीर्षक, समाचार टाइटल्स, सिंगल पेज कंटेंट, आर्काइव एवं मेटा) का फॉन्ट आकार अलग-अलग सेट करें
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* 1. Section Headings (H1/H2) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        1. मुख्य हेडिंग्स (H1 / H2)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {current.typography.headingSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, headingSize: sz },
                            })
                          }
                          className={`py-1.5 rounded-lg font-bold border transition cursor-pointer text-center ${
                            (current.typography.headingSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'normal' ? 'मध्यम' : sz === 'large' ? 'बड़ा' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Article Card Titles & Headlines */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        2. समाचार टाइटल्स (Cards)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {current.typography.titleSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, titleSize: sz },
                            })
                          }
                          className={`py-1.5 rounded-lg font-bold border transition cursor-pointer text-center ${
                            (current.typography.titleSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'normal' ? 'मध्यम' : sz === 'large' ? 'बड़ा' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Single Page Content / Reading Body */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        3. सिंगल पेज कंटेंट (Body)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {current.typography.contentSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, contentSize: sz },
                            })
                          }
                          className={`py-1.5 rounded-lg font-bold border transition cursor-pointer text-center ${
                            (current.typography.contentSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'normal' ? 'मध्यम' : sz === 'large' ? 'बड़ा' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Archive & Category List Size */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        4. आर्काइव व कैटेगरी सूची
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {current.typography.archiveSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, archiveSize: sz },
                            })
                          }
                          className={`py-1.5 rounded-lg font-bold border transition cursor-pointer text-center ${
                            (current.typography.archiveSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'normal' ? 'मध्यम' : sz === 'large' ? 'बड़ा' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Meta, Timestamps & Author Info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        5. मेटा, लेखक व समय (Meta)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {current.typography.metaSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {(['sm', 'normal', 'large'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setCurrent({
                              ...current,
                              typography: { ...current.typography, metaSize: sz },
                            })
                          }
                          className={`py-1.5 rounded-lg font-bold border transition cursor-pointer text-center ${
                            (current.typography.metaSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'normal' ? 'मध्यम' : 'बड़ा'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Typography Preview */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Live Typography Preview
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    Active in CSS Variables
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  {/* Heading 1 / Section Banner Preview */}
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block font-mono">
                      हेडिंग प्रीव्यू (Section Heading):
                    </span>
                    <h2
                      className="text-xl sm:text-2xl text-slate-900 leading-snug"
                      style={{
                        fontFamily: current.typography.headlineFont,
                        fontWeight: current.typography.headlineWeight || 700,
                      }}
                    >
                      संसद बजट सत्र 2026: आर्थिक विकास, नवाचार और राष्ट्रीय सुरक्षा पर ऐतिहासिक चर्चा
                    </h2>
                  </div>

                  {/* Article Card Title Preview */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block font-mono">
                      कार्ड टाइटल प्रीव्यू (News Card Title):
                    </span>
                    <h3
                      className="text-base sm:text-lg font-bold text-slate-900 leading-snug hover:text-red-600"
                      style={{
                        fontFamily: current.typography.headlineFont,
                        fontWeight: current.typography.headlineWeight || 700,
                      }}
                    >
                      डिजिटल मीडिया और स्वतंत्र पत्रकारिता: जनहित व तथ्य-जांच का सशक्त संकल्प
                    </h3>
                  </div>

                  {/* Single Page Content Body Preview */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block font-mono">
                      सिंगल पेज कंटेंट प्रीव्यू (Body Text):
                    </span>
                    <p
                      className="text-xs sm:text-sm text-slate-700 leading-relaxed font-kd-body"
                      style={{
                        fontFamily: current.typography.bodyFont,
                        fontWeight: current.typography.bodyWeight || 400,
                      }}
                    >
                      खबरी दोस्त डिजिटल समाचार मंच देश के नागरिकों तक निष्पक्ष, सटीक और त्वरित सूचनाएं पहुंचाने के लिए प्रतिबद्ध है।
                    </p>
                  </div>

                  {/* Meta Tag Preview */}
                  <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-kd-meta">
                    <span>वरिष्ठ राजनीतिक संवाददाता • नई दिल्ली</span>
                    <span>10 मिनट पहले • 1,420 व्यूज</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: HEADER, BRANDING & FOOTER SETTINGS (UNIFIED WEBSITE CUSTOMIZER) */}
          {(activeTab === 'header' || activeTab === 'footer') && (
            <div className="max-w-5xl mx-auto space-y-5">
              <HeaderFooterSettingsTab
                settings={current}
                onChange={(updated) => {
                  setCurrent(updated);
                  onSaveSettings(updated);
                }}
                defaultSection={activeTab === 'footer' ? 'footer' : 'branding'}
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
              onChange={(updated) =>
                setCurrent({
                  ...current,
                  articleMetaSettings: updated,
                })
              }
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
