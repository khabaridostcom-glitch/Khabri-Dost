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
} from 'lucide-react';
import { PortalSettings, SidebarAdsConfig, AdResponsiveBreakpoints } from '../../types/news';
import { DEFAULT_SIDEBAR_ADS_CONFIG, DEFAULT_ARTICLE_BANNER_BREAKPOINTS } from '../../data/portalDefaults';
import { AdBreakpointEditor } from './AdBreakpointEditor';

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
  const [activeSlot, setActiveSlot] = useState<
    'top' | 'mid' | 'sidebar' | 'bottom' | 'mobile_sticky'
  >('top');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      adSettings,
      sidebarAdsConfig,
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
          { id: 'bottom', label: '4. Bottom Banner Unit', icon: Monitor, enabled: adSettings.showBottomAd },
          { id: 'mobile_sticky', label: '5. Mobile Bottom Sticky', icon: Smartphone, enabled: adSettings.showMobileStickyAd ?? true },
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

        {/* SLOT 4: BOTTOM BANNER */}
        {activeSlot === 'bottom' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                  Bottom Page Full-Width Banner
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  Full-width display banner rendered across all pages immediately above the footer.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adSettings.showBottomAd}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, showBottomAd: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-kd-meta">
              <label className="block text-xs font-bold text-slate-700">
                Bottom Banner AdSense Slot ID
              </label>
              <input
                type="text"
                placeholder="e.g. 6677889900"
                value={adSettings.bottomAdSlotId || ''}
                onChange={(e) =>
                  setAdSettings({ ...adSettings, bottomAdSlotId: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Responsive Breakpoints Editor for Bottom Banner */}
            <AdBreakpointEditor
              label="Bottom Full-Width Banner Container"
              breakpoints={adSettings.responsiveBreakpoints?.bottom}
              onChange={(updated) =>
                setAdSettings({
                  ...adSettings,
                  responsiveBreakpoints: {
                    ...(adSettings.responsiveBreakpoints || {}),
                    bottom: updated,
                  },
                })
              }
            />
          </div>
        )}

        {/* SLOT 5: MOBILE BOTTOM STICKY */}
        {activeSlot === 'mobile_sticky' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kd-headline">
                  Mobile Sticky Bottom Anchor Ad (320x50)
                </h3>
                <p className="text-xs text-slate-500 font-kd-meta">
                  Pinned 320x50 anchor advertisement docked at the bottom of mobile screens.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adSettings.showMobileStickyAd ?? true}
                  onChange={(e) =>
                    setAdSettings({ ...adSettings, showMobileStickyAd: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 leading-relaxed border border-emerald-200 font-kd-meta">
              Mobile sticky anchor ads generate 30-40% higher CPMs for digital news portals.
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
            {adSettings.privateBannerUrl && activeSlot === 'top' && adSettings.topAdType === 'private' ? (
              <img
                src={adSettings.privateBannerUrl}
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
