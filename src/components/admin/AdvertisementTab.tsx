import React, { useState } from 'react';
import {
  DollarSign,
  Layers,
  Sparkles,
  Check,
  ExternalLink,
  Eye,
  TrendingUp,
  MousePointer,
  HelpCircle,
  Save,
  Shield,
  Smartphone,
  Monitor,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import {
  PortalSettings,
  SidebarAdsConfig,
  AdResponsiveBreakpoints,
  MobileStickyBarConfig,
  DesktopStickyAdConfig,
  FooterBannerAdConfig,
} from '../../types/news';
import {
  DEFAULT_SIDEBAR_ADS_CONFIG,
  DEFAULT_ARTICLE_BANNER_BREAKPOINTS,
  DEFAULT_MOBILE_STICKY_BAR_CONFIG,
  DEFAULT_ARTICLE_PAGE_CONFIG,
  DEFAULT_DESKTOP_STICKY_AD_CONFIG,
  DEFAULT_FOOTER_BANNER_AD_CONFIG,
} from '../../data/portalDefaults';
import { AdBreakpointEditor } from './AdBreakpointEditor';
import { compressImage } from '../../utils/imageCompressor';

interface AdvertisementTabProps {
  settings: PortalSettings;
  onUpdateSettings: (settings: PortalSettings) => void;
}

export const AdvertisementTab: React.FC<AdvertisementTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [adSettings, setAdSettings] = useState({ ...settings.adSettings });
  const [sidebarAdsConfig, setSidebarAdsConfig] = useState<SidebarAdsConfig>({
    ...DEFAULT_SIDEBAR_ADS_CONFIG,
    ...(settings.sidebarAdsConfig || {}),
  });
  const [mobileStickyBar, setMobileStickyBar] = useState<MobileStickyBarConfig>({
    ...DEFAULT_MOBILE_STICKY_BAR_CONFIG,
    ...(settings.mobileStickyBar || settings.articlePageConfig?.mobileStickyBar || {}),
  });
  const [desktopStickyAd, setDesktopStickyAd] = useState<DesktopStickyAdConfig>({
    ...DEFAULT_DESKTOP_STICKY_AD_CONFIG,
    ...(settings.desktopStickyAd || {}),
  });
  const [footerBannerAd, setFooterBannerAd] = useState<FooterBannerAdConfig>({
    ...DEFAULT_FOOTER_BANNER_AD_CONFIG,
    ...(settings.footerBannerAd || settings.headerFooter?.footerBannerAd || {}),
  });

  const [activeSlot, setActiveSlot] = useState<
    'top' | 'mid' | 'sidebar' | 'footer_banner' | 'desktop_sticky' | 'mobile_sticky'
  >('top');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUploadDesktopStickyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const comp = await compressImage(file, { maxWidth: 1200, quality: 0.8, format: 'image/webp' });
      setDesktopStickyAd({ ...desktopStickyAd, imageUrl: comp.dataUrl, type: 'image' });
    } catch {
      const r = new FileReader();
      r.onload = (ev) => {
        setDesktopStickyAd({ ...desktopStickyAd, imageUrl: ev.target?.result as string, type: 'image' });
      };
      r.readAsDataURL(file);
    }
  };

  const handleUploadFooterDesktopImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const comp = await compressImage(file, { maxWidth: 1200, quality: 0.8, format: 'image/webp' });
      setFooterBannerAd({ ...footerBannerAd, desktopImageUrl: comp.dataUrl, type: 'image' });
    } catch {
      const r = new FileReader();
      r.onload = (ev) => {
        setFooterBannerAd({ ...footerBannerAd, desktopImageUrl: ev.target?.result as string, type: 'image' });
      };
      r.readAsDataURL(file);
    }
  };

  const handleUploadFooterMobileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const comp = await compressImage(file, { maxWidth: 640, quality: 0.8, format: 'image/webp' });
      setFooterBannerAd({ ...footerBannerAd, mobileImageUrl: comp.dataUrl, type: 'image' });
    } catch {
      const r = new FileReader();
      r.onload = (ev) => {
        setFooterBannerAd({ ...footerBannerAd, mobileImageUrl: ev.target?.result as string, type: 'image' });
      };
      r.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      adSettings: {
        ...adSettings,
        showMobileStickyAd: mobileStickyBar.enabled && (mobileStickyBar.mode === 'ad' || mobileStickyBar.mode === 'both'),
      },
      sidebarAdsConfig,
      mobileStickyBar,
      desktopStickyAd,
      footerBannerAd,
      ...(settings.headerFooter
        ? {
            headerFooter: {
              ...settings.headerFooter,
              footerBannerAd,
            },
          }
        : {}),
      articlePageConfig: {
        ...(settings.articlePageConfig || DEFAULT_ARTICLE_PAGE_CONFIG),
        mobileStickyBar,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-kd-body">
      {/* 1. Header with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-kd-headline">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>Advertisement & Monetization Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-kd-meta">
            Complete control and placement configuration for Google AdSense and Direct Private Sponsorship slots.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer shrink-0 font-kd-meta"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Ad Settings</span>
            </>
          )}
        </button>
      </div>

      {/* 2. REVENUE & PERFORMANCE OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Estimated Monthly Impressions</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">5,20,000+</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block font-kd-meta">● 5 Active Ad Slots</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Average Click-Through Rate (CTR)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">2.64%</span>
          <span className="text-[11px] text-slate-500 mt-1 block font-kd-meta">Industry Benchmark: 1.2%</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">Active Sponsor Campaigns</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {adSettings.topAdType === 'private' ? '1 Active' : '0 (AdSense Active)'}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block font-kd-meta">Khabri Dost Media Network</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block font-medium">AdSense Publisher Status</span>
          <span className="text-sm font-bold text-blue-600 mt-2 block font-mono">
            {adSettings.adsenseClientId ? 'VERIFIED ID' : 'PENDING CLIENT ID'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            {adSettings.adsenseClientId || 'ca-pub-XXXXXXXXXXXX'}
          </span>
        </div>
      </div>

      {/* 3. GOOGLE ADSENSE GLOBAL CREDENTIALS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 font-kd-headline">
            Google AdSense Publisher Account Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-kd-meta">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google AdSense Publisher ID (ca-pub-XXXXXXXXXXXX)
            </label>
            <input
              type="text"
              placeholder="ca-pub-1234567890123456"
              value={adSettings.adsenseClientId || ''}
              onChange={(e) =>
                setAdSettings({ ...adSettings, adsenseClientId: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Enter your official Publisher ID from your Google AdSense Dashboard.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Direct Ad Inquiries Link
            </label>
            <input
              type="text"
              placeholder="#contact or Custom URL"
              value={adSettings.privateBannerLink || '#contact'}
              onChange={(e) =>
                setAdSettings({ ...adSettings, privateBannerLink: e.target.value })
              }
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Directs readers and advertisers to the contact desk (#contact) by default.
            </p>
          </div>
        </div>
      </div>

      {/* 4. AD SLOTS TABS SELECTOR */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none font-kd-meta">
        {[
          { id: 'top', label: '1. Top Leaderboard (728x90)', icon: Monitor, enabled: adSettings.showTopAd },
          { id: 'mid', label: '2. In-Article Reading Unit', icon: Layers, enabled: adSettings.showMidContentAd },
          { id: 'sidebar', label: '3. Sticky Sidebar Unit', icon: Monitor, enabled: adSettings.showSidebarAd },
          { id: 'footer_banner', label: '4. Footer-End Banner Ad (फुटर बैनर)', icon: Monitor, enabled: footerBannerAd.enabled !== false },
          { id: 'desktop_sticky', label: '5. Desktop Sticky Ad (डेस्कटॉप स्टिकी)', icon: Monitor, enabled: desktopStickyAd.enabled !== false },
          { id: 'mobile_sticky', label: '6. Mobile Sticky Ad (मोबाइल स्टिकी)', icon: Smartphone, enabled: mobileStickyBar.enabled && (mobileStickyBar.mode === 'ad' || mobileStickyBar.mode === 'both') },
        ].map((slot) => {
          const Icon = slot.icon;
          return (
            <button
              key={slot.id}
              onClick={() => setActiveSlot(slot.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 border ${
                activeSlot === slot.id
                  ? 'bg-red-600 border-red-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{slot.label}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  slot.enabled ? 'bg-emerald-400' : 'bg-slate-300'
                }`}
              ></span>
            </button>
          );
        })}
      </div>

      {/* 5. ACTIVE SLOT CONFIGURATION CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {/* SLOT 1: TOP LEADERBOARD */}
        {activeSlot === 'top' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                  Top Header Leaderboard Banner (728x90)
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  High-impact 728x90 leaderboard banner rendered right beneath the primary navigation bar.
                </p>
              </div>

              {/* Slot Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adSettings.showTopAd}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, showTopAd: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Network Choice */}
            <div className="grid grid-cols-2 gap-3 font-kd-meta">
              <button
                type="button"
                onClick={() => setAdSettings({ ...adSettings, topAdType: 'adsense' })}
                className={`p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  adSettings.topAdType === 'adsense'
                    ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-2xs ring-2 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Google AdSense (Auto / Responsive)</span>
              </button>
              <button
                type="button"
                onClick={() => setAdSettings({ ...adSettings, topAdType: 'private' })}
                className={`p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  adSettings.topAdType === 'private'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Direct Sponsorship / Private Ad</span>
              </button>
            </div>

            {adSettings.topAdType === 'adsense' ? (
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200 font-kd-meta">
                <label className="block text-xs font-bold text-slate-800">
                  Google AdSense Top Slot ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={adSettings.topAdSlotId || ''}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, topAdSlotId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">
                  When deployed, Google AdSense automatically serves responsive ads to this slot.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 bg-amber-50/50 p-4 rounded-xl border border-amber-200 font-kd-meta">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Private Banner Image URL (728x90 or 1200x150)
                  </label>
                  <input
                    type="text"
                    value={adSettings.privateBannerUrl || ''}
                    onChange={(e) =>
                      setAdSettings({ ...adSettings, privateBannerUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Click Destination URL
                    </label>
                    <input
                      type="text"
                      value={adSettings.privateBannerLink || '#contact'}
                      onChange={(e) =>
                        setAdSettings({ ...adSettings, privateBannerLink: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sponsor / Brand Headline Label
                    </label>
                    <input
                      type="text"
                      value={adSettings.privateBannerTitle || ''}
                      onChange={(e) =>
                        setAdSettings({ ...adSettings, privateBannerTitle: e.target.value })
                      }
                      placeholder="e.g. Special Monsoon Campaign Offer"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Breakpoints Editor for Leaderboard */}
            <AdBreakpointEditor
              label="Leaderboard Ad Container"
              breakpoints={adSettings.responsiveBreakpoints?.leaderboard}
              onChange={(updated) =>
                setAdSettings({
                  ...adSettings,
                  responsiveBreakpoints: {
                    ...(adSettings.responsiveBreakpoints || {}),
                    leaderboard: updated,
                  },
                })
              }
            />
          </div>
        )}

        {/* SLOT 2: IN-ARTICLE MID CONTENT */}
        {activeSlot === 'mid' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                  In-Article Mid-Content Ad
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  Appears naturally after the 3rd paragraph while reading news articles.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adSettings.showMidContentAd}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, showMidContentAd: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-kd-meta">
              <label className="block text-xs font-bold text-slate-700">
                AdSense In-Article Responsive Slot ID
              </label>
              <input
                type="text"
                placeholder="e.g. 5432167890"
                value={adSettings.midAdSlotId || ''}
                onChange={(e) =>
                  setAdSettings({ ...adSettings, midAdSlotId: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-500">
                In-article format flows smoothly between editorial news paragraphs.
              </p>
            </div>

            {/* Responsive Breakpoints Editor for In-Content */}
            <AdBreakpointEditor
              label="In-Article Mid-Content Ad Container"
              breakpoints={adSettings.responsiveBreakpoints?.inContent}
              onChange={(updated) =>
                setAdSettings({
                  ...adSettings,
                  responsiveBreakpoints: {
                    ...(adSettings.responsiveBreakpoints || {}),
                    inContent: updated,
                  },
                })
              }
            />
          </div>
        )}

        {/* SLOT 3: STICKY SIDEBAR */}
        {activeSlot === 'sidebar' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                  Sticky Sidebar Rectangle Ad (300x250 / 300x600)
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  Fixed or sticky sidebar advertising unit that stays in view as reader scrolls.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adSettings.showSidebarAd}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, showSidebarAd: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 font-kd-meta">
              <button
                type="button"
                onClick={() => setAdSettings({ ...adSettings, sidebarAdType: 'adsense' })}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  adSettings.sidebarAdType === 'adsense'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Google AdSense Sidebar Slot</span>
              </button>
              <button
                type="button"
                onClick={() => setAdSettings({ ...adSettings, sidebarAdType: 'private' })}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  adSettings.sidebarAdType === 'private'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Direct Sponsor Banner</span>
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-kd-meta">
              <label className="block text-xs font-bold text-slate-700">
                Sidebar AdSense Slot ID
              </label>
              <input
                type="text"
                placeholder="e.g. 1122334455"
                value={adSettings.sidebarAdSlotId || ''}
                onChange={(e) =>
                  setAdSettings({ ...adSettings, sidebarAdSlotId: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Responsive Breakpoints Editor for Sidebar */}
            <AdBreakpointEditor
              label="Article Sidebar Ad Container"
              breakpoints={adSettings.responsiveBreakpoints?.sidebar}
              onChange={(updated) =>
                setAdSettings({
                  ...adSettings,
                  responsiveBreakpoints: {
                    ...(adSettings.responsiveBreakpoints || {}),
                    sidebar: updated,
                  },
                })
              }
            />
          </div>
        )}

        {/* SLOT 4: FOOTER-END BANNER ADVERTISEMENT */}
        {activeSlot === 'footer_banner' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">
                    PLACEMENT A
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                    Footer-End Banner Advertisement (फुटर-एंड विज्ञापन बैनर)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-kd-meta mt-1">
                  Appears at the very bottom of the complete footer, strictly AFTER footer branding, about text, navigation links, social links, legal links, and copyright. Zero unnecessary blank whitespace.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerBannerAd.enabled !== false}
                  onChange={(e) =>
                    setFooterBannerAd({ ...footerBannerAd, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Ad Format Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                विज्ञापन प्रकार (Ad Format):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFooterBannerAd({ ...footerBannerAd, type: 'image' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    (footerBannerAd.type || 'image') === 'image'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  इमेज बैनर व लिंक (Image Banner + Link)
                </button>
                <button
                  type="button"
                  onClick={() => setFooterBannerAd({ ...footerBannerAd, type: 'script' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    footerBannerAd.type === 'script'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  कस्टम HTML / AdSense स्क्रिप्ट
                </button>
              </div>

              {(footerBannerAd.type || 'image') === 'image' ? (
                <div className="space-y-4 pt-1 font-kd-meta">
                  {/* 1. Desktop Banner Image (728x90) */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>डेस्कटॉप बैनर इमेज (728x90 Leaderboard Image URL):</span>
                      </label>
                      <label className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                        <Upload className="w-3 h-3" />
                        <span>डेस्कटॉप इमेज अपलोड करें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadFooterDesktopImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={footerBannerAd.desktopImageUrl || ''}
                        onChange={(e) =>
                          setFooterBannerAd({ ...footerBannerAd, desktopImageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/... (728x90 desktop banner)"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFooterBannerAd({
                            ...footerBannerAd,
                            desktopImageUrl:
                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
                          })
                        }
                        className="px-3 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        सैंपल डेस्कटॉप
                      </button>
                    </div>
                  </div>

                  {/* 2. Mobile Banner Image (320x50) */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>मोबाइल बैनर इमेज (320x50 Mobile Banner Image URL):</span>
                      </label>
                      <label className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                        <Upload className="w-3 h-3" />
                        <span>मोबाइल इमेज अपलोड करें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadFooterMobileImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={footerBannerAd.mobileImageUrl || ''}
                        onChange={(e) =>
                          setFooterBannerAd({ ...footerBannerAd, mobileImageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/... (320x50 mobile banner)"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFooterBannerAd({
                            ...footerBannerAd,
                            mobileImageUrl:
                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80',
                          })
                        }
                        className="px-3 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        सैंपल मोबाइल
                      </button>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      क्लिक URL (Click Destination Target Link):
                    </label>
                    <input
                      type="text"
                      value={footerBannerAd.targetUrl || ''}
                      onChange={(e) =>
                        setFooterBannerAd({ ...footerBannerAd, targetUrl: e.target.value })
                      }
                      placeholder="#contact या https://sponsor-brand.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      यदि '#contact' रखेंगे तो क्लिक करने पर वेबसाइट का संपर्क पृष्ठ खुलेगा।
                    </p>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        विज्ञापन मुख्य शीर्षक (Ad Headline):
                      </label>
                      <input
                        type="text"
                        value={footerBannerAd.title || ''}
                        onChange={(e) =>
                          setFooterBannerAd({ ...footerBannerAd, title: e.target.value })
                        }
                        placeholder="खबरी दोस्त डिजिटल न्यूज़ नेटवर्क • विशेष विज्ञापन"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        विज्ञापन उपशीर्षक (Ad Subtitle):
                      </label>
                      <input
                        type="text"
                        value={footerBannerAd.subTitle || ''}
                        onChange={(e) =>
                          setFooterBannerAd({ ...footerBannerAd, subTitle: e.target.value })
                        }
                        placeholder="5 लाख+ पाठकों तक अपने ब्रांड और उत्पादों का प्रचार करें"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      प्रायोजक नाम / Alt Text:
                    </label>
                    <input
                      type="text"
                      value={footerBannerAd.altText || ''}
                      onChange={(e) =>
                        setFooterBannerAd({ ...footerBannerAd, altText: e.target.value })
                      }
                      placeholder="खबरी दोस्त फुटर विज्ञापन बैनर"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google AdSense / कस्टम HTML स्क्रिप्ट:
                  </label>
                  <textarea
                    rows={5}
                    value={footerBannerAd.scriptCode || ''}
                    onChange={(e) =>
                      setFooterBannerAd({ ...footerBannerAd, scriptCode: e.target.value })
                    }
                    placeholder="<!-- Footer Banner Script Code -->&#10;<ins class='adsbygoogle' ...></ins>&#10;<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-slate-900 text-amber-200"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* SLOT 5: DESKTOP STICKY ADVERTISEMENT */}
        {activeSlot === 'desktop_sticky' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                    PLACEMENT B
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                    Desktop Sticky Advertisement (डेस्कटॉप स्टिकी विज्ञापन)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-kd-meta mt-1">
                  Fixed near the bottom of the desktop viewport (≥768px). Includes session dismiss button ('X'), no content overlap, and dismissal persists for the current viewing session.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={desktopStickyAd.enabled !== false}
                  onChange={(e) =>
                    setDesktopStickyAd({ ...desktopStickyAd, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Visibility & UX Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-kd-meta">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-950 block">डेस्कटॉप स्क्रीन हेतु रिस्पॉन्सिव (Desktop Only)</span>
                  <span className="text-[11px] text-blue-800">मोबाइल स्क्रीन पर स्वतः छुपा रहता है</span>
                </div>
                <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  md:flex
                </span>
              </div>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">पाठक हेतु क्लोज़ बटन ('X' Dismissible)</span>
                  <span className="text-[11px] text-slate-500">सेशन के दौरान बंद रहने की अनुमति देता है</span>
                </div>
                <input
                  type="checkbox"
                  checked={desktopStickyAd.dismissible !== false}
                  onChange={(e) =>
                    setDesktopStickyAd({ ...desktopStickyAd, dismissible: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Ad Format Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                विज्ञापन प्रकार (Ad Format):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDesktopStickyAd({ ...desktopStickyAd, type: 'image' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    (desktopStickyAd.type || 'image') === 'image'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  इमेज बैनर व लिंक (Image Banner + Link)
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopStickyAd({ ...desktopStickyAd, type: 'script' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    desktopStickyAd.type === 'script'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  कस्टम HTML / AdSense स्क्रिप्ट
                </button>
              </div>

              {(desktopStickyAd.type || 'image') === 'image' ? (
                <div className="space-y-4 pt-1 font-kd-meta">
                  {/* Image URL + Upload */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>डेस्कटॉप स्टिकी इमेज URL (Image URL):</span>
                      </label>
                      <label className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                        <Upload className="w-3 h-3" />
                        <span>इमेज अपलोड करें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadDesktopStickyImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={desktopStickyAd.imageUrl || ''}
                        onChange={(e) =>
                          setDesktopStickyAd({ ...desktopStickyAd, imageUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/... (Desktop sticky banner)"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDesktopStickyAd({
                            ...desktopStickyAd,
                            imageUrl:
                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
                          })
                        }
                        className="px-3 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        सैंपल इमेज
                      </button>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      क्लिक URL (Click Destination Target Link):
                    </label>
                    <input
                      type="text"
                      value={desktopStickyAd.targetUrl || ''}
                      onChange={(e) =>
                        setDesktopStickyAd({ ...desktopStickyAd, targetUrl: e.target.value })
                      }
                      placeholder="#contact या https://sponsor-brand.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        विज्ञापन मुख्य शीर्षक (Headline):
                      </label>
                      <input
                        type="text"
                        value={desktopStickyAd.title || ''}
                        onChange={(e) =>
                          setDesktopStickyAd({ ...desktopStickyAd, title: e.target.value })
                        }
                        placeholder="खबरी दोस्त मीडिया नेटवर्क • विशेष विज्ञापन"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        विज्ञापन उपशीर्षक (Subtitle):
                      </label>
                      <input
                        type="text"
                        value={desktopStickyAd.subTitle || ''}
                        onChange={(e) =>
                          setDesktopStickyAd({ ...desktopStickyAd, subTitle: e.target.value })
                        }
                        placeholder="5 लाख+ पाठकों तक अपना ब्रांड पहुंचाएं | विशेष पार्टनरशिप दरें"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text / Sponsor Name:
                    </label>
                    <input
                      type="text"
                      value={desktopStickyAd.altText || ''}
                      onChange={(e) =>
                        setDesktopStickyAd({ ...desktopStickyAd, altText: e.target.value })
                      }
                      placeholder="डेस्कटॉप विज्ञापन"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google AdSense / कस्टम HTML स्क्रिप्ट:
                  </label>
                  <textarea
                    rows={5}
                    value={desktopStickyAd.scriptCode || ''}
                    onChange={(e) =>
                      setDesktopStickyAd({ ...desktopStickyAd, scriptCode: e.target.value })
                    }
                    placeholder="<!-- Desktop Sticky Script Code -->&#10;<ins class='adsbygoogle' ...></ins>"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-900 text-amber-200"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* SLOT 5: MOBILE BOTTOM STICKY */}
        {activeSlot === 'mobile_sticky' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Mobile Sticky Bottom Anchor Ad (320x50)</span>
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  Pinned 320x50 anchor advertisement docked at the bottom of mobile screens.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mobileStickyBar.enabled && (mobileStickyBar.mode === 'ad' || mobileStickyBar.mode === 'both')}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setMobileStickyBar({
                      ...mobileStickyBar,
                      enabled: isChecked || mobileStickyBar.enabled,
                      mode: isChecked ? (mobileStickyBar.mode === 'share' ? 'both' : 'ad') : 'share',
                    });
                    setAdSettings({ ...adSettings, showMobileStickyAd: isChecked });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Mode Selector */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                मोबाइल बॉटम बार मोड (Mobile Bottom Bar Mode):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, enabled: true, mode: 'ad' })}
                  className={`px-3 py-2 rounded-lg font-bold transition text-left cursor-pointer border ${
                    mobileStickyBar.enabled && mobileStickyBar.mode === 'ad'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📢 Sticky Ad Only
                </button>
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, enabled: true, mode: 'both' })}
                  className={`px-3 py-2 rounded-lg font-bold transition text-left cursor-pointer border ${
                    mobileStickyBar.enabled && mobileStickyBar.mode === 'both'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ⚡ Dual (Ad + Share)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, enabled: true, mode: 'share' })}
                  className={`px-3 py-2 rounded-lg font-bold transition text-left cursor-pointer border ${
                    mobileStickyBar.enabled && mobileStickyBar.mode === 'share'
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📱 Share Bar Only
                </button>
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, enabled: false })}
                  className={`px-3 py-2 rounded-lg font-bold transition text-left cursor-pointer border ${
                    !mobileStickyBar.enabled
                      ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🚫 Hide Bar
                </button>
              </div>
            </div>

            {/* Ad Format Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                विज्ञापन प्रकार (Ad Format):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, adType: 'image' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    (mobileStickyBar.adType || 'image') === 'image'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  इमेज बैनर व लिंक (Image Banner + Link)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileStickyBar({ ...mobileStickyBar, adType: 'script' })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mobileStickyBar.adType === 'script'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  कस्टम AdSense / HTML स्क्रिप्ट
                </button>
              </div>

              {(mobileStickyBar.adType || 'image') === 'image' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      बैनर इमेज URL (320x50 Banner Image URL):
                    </label>
                    <input
                      type="url"
                      value={mobileStickyBar.adImageUrl || ''}
                      onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, adImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/.../banner.png"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      क्लिक URL (Click Destination Target Link):
                    </label>
                    <input
                      type="text"
                      value={mobileStickyBar.adTargetUrl || ''}
                      onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, adTargetUrl: e.target.value })}
                      placeholder="#contact या https://sponsor-brand.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      प्रायोजक नाम / Alt Text:
                    </label>
                    <input
                      type="text"
                      value={mobileStickyBar.adAltText || ''}
                      onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, adAltText: e.target.value })}
                      placeholder="खबरी दोस्त प्रायोजित विज्ञापन"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google AdSense एंकर कोड / स्क्रिप्ट (HTML Script):
                  </label>
                  <textarea
                    rows={4}
                    value={mobileStickyBar.adScriptCode || ''}
                    onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, adScriptCode: e.target.value })}
                    placeholder="<!-- Mobile 320x50 Anchor Script Code -->&#10;<ins class='adsbygoogle' ...></ins>"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Footer Overlap Protection & Dismissible */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="font-medium text-slate-700">उपयोगकर्ता के लिए बंद करने का बटन ('X'):</span>
                <input
                  type="checkbox"
                  checked={mobileStickyBar.dismissible ?? true}
                  onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, dismissible: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                <span className="font-bold text-emerald-900">फुटर आने पर स्वतः छुपाएं (No Overlap):</span>
                <input
                  type="checkbox"
                  checked={mobileStickyBar.autoHideOnFooter ?? true}
                  onChange={(e) => setMobileStickyBar({ ...mobileStickyBar, autoHideOnFooter: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 leading-relaxed border border-emerald-200 font-kd-meta">
              💡 मोबाइल 320x50 एंकर विज्ञापन 30-40% अधिक सीपीएम प्रदान करते हैं। यह आर्टिकल स्टूडियो के साथ पूरी तरह सिंक्रोनाइज़्ड है।
            </div>
          </div>
        )}

        {/* 6. LIVE AD ZONE PREVIEW */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-kd-meta">
            Live Preview (Active Ad Zone)
          </span>
          <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
            <div className="text-xs font-mono text-emerald-700 uppercase font-bold">
              [ {activeSlot.toUpperCase()} BANNER / RESPONSIVE AD ZONE ]
            </div>
            {activeSlot === 'footer_banner' ? (
              <div className="space-y-2 max-w-2xl mx-auto">
                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 truncate">
                    <img
                      src={footerBannerAd.desktopImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'}
                      alt={footerBannerAd.altText || 'Footer Ad'}
                      className="w-16 h-10 object-cover rounded-lg shrink-0 border border-slate-700"
                    />
                    <div className="text-left truncate">
                      <span className="text-[9px] font-mono uppercase bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-bold mr-1.5">Ad</span>
                      <strong className="text-xs text-white">{footerBannerAd.title || 'खबरी दोस्त फुटर विज्ञापन बैनर'}</strong>
                      <p className="text-[11px] text-slate-300 truncate">{footerBannerAd.subTitle || '5 लाख+ पाठकों तक अपना ब्रांड पहुंचाएं'}</p>
                    </div>
                  </div>
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
                    क्लिक करें ➔
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-kd-meta">
                  फुटर के नीचे कॉपीराइट के बाद स्वच्छ और प्राकृतिक रूप में प्रदर्शित होता है।
                </span>
              </div>
            ) : activeSlot === 'desktop_sticky' ? (
              <div className="space-y-2 max-w-2xl mx-auto">
                <div className="bg-slate-900/95 text-white border border-slate-700 rounded-2xl shadow-xl p-2.5 px-4 flex items-center justify-between gap-4 backdrop-blur-md">
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-mono">AD</span>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Desktop Sticky</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center space-x-3 truncate">
                    <img
                      src={desktopStickyAd.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'}
                      alt={desktopStickyAd.altText || 'Desktop Sticky Ad'}
                      className="w-14 h-9 object-cover rounded-md shrink-0 border border-slate-700"
                    />
                    <div className="truncate text-left">
                      <p className="text-xs font-bold text-white truncate">{desktopStickyAd.title || 'खबरी दोस्त विशेष विज्ञापन'}</p>
                      <p className="text-[10px] text-slate-300 truncate">{desktopStickyAd.subTitle || 'विशेष पार्टनरशिप दरें'}</p>
                    </div>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0">✕</span>
                </div>
                <span className="text-[11px] text-slate-400 block font-kd-meta">
                  डेस्कटॉप स्क्रीन (≥768px) पर नीचे फ़िक्स रहता है। क्लोज़ बटन दबाने पर सेशन के लिए बंद हो जाता है।
                </span>
              </div>
            ) : activeSlot === 'mobile_sticky' ? (
              <div className="space-y-2 max-w-xs mx-auto">
                <div className="bg-white border border-slate-200 rounded-xl shadow-md p-2 flex items-center justify-between gap-2">
                  <span className="text-[8px] font-black uppercase bg-amber-100 text-amber-800 px-1 rounded border border-amber-300 shrink-0">Ad</span>
                  <img
                    src={mobileStickyBar.adImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80'}
                    alt="Mobile Sticky"
                    className="h-8 w-auto max-w-[180px] object-contain rounded"
                  />
                  <span className="text-slate-400 text-xs">✕</span>
                </div>
                <span className="text-[11px] text-slate-400 block font-kd-meta">
                  मोबाइल स्क्रीन (320x50) पर नीचे बॉटम नेविगेशन के ऊपर पिन रहता है।
                </span>
              </div>
            ) : adSettings.privateBannerUrl && activeSlot === 'top' && adSettings.topAdType === 'private' ? (
              <img
                src={adSettings.privateBannerUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'}
                alt="Direct Sponsor"
                className="max-h-24 mx-auto rounded object-contain shadow-xs"
              />
            ) : (
              <p className="text-xs text-slate-500 font-kd-meta">
                Active Slot: {activeSlot.toUpperCase()} • Network:{' '}
                <span className="text-blue-600 font-bold font-mono">
                  {activeSlot === 'top' ? adSettings.topAdType : 'AdSense'}
                </span>{' '}
                • Status: <span className="text-emerald-600 font-bold">LIVE PRODUCTION READY</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
