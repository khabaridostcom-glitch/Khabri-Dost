import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  DollarSign,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Code2,
  Save,
  Radio,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { PortalSettings, GoogleServicesConfig } from '../../types/news';
import { DEFAULT_GOOGLE_SERVICES } from '../../data/portalDefaults';

interface GoogleSuiteSettingsTabProps {
  settings: PortalSettings;
  onChange: (updated: PortalSettings) => void;
}

export const GoogleSuiteSettingsTab: React.FC<GoogleSuiteSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const currentGoogle: GoogleServicesConfig =
    settings.googleServices || DEFAULT_GOOGLE_SERVICES;

  const [gaId, setGaId] = useState(currentGoogle.googleAnalyticsId || '');
  const [gscToken, setGscToken] = useState(currentGoogle.searchConsoleVerification || '');
  const [gtmId, setGtmId] = useState(currentGoogle.googleTagManagerId || '');
  const [adsenseId, setAdsenseId] = useState(currentGoogle.adsenseClientId || '');
  const [autoAds, setAutoAds] = useState(currentGoogle.adsenseAutoAds !== false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedServices: GoogleServicesConfig = {
      ...currentGoogle,
      googleAnalyticsId: gaId.trim(),
      searchConsoleVerification: gscToken.trim(),
      googleTagManagerId: gtmId.trim(),
      adsenseClientId: adsenseId.trim(),
      adsenseAutoAds: autoAds,
    };

    const updatedSettings: PortalSettings = {
      ...settings,
      googleServices: updatedServices,
      adSettings: {
        ...settings.adSettings,
        adsenseClientId: adsenseId.trim() || settings.adSettings.adsenseClientId,
      },
    };

    onChange(updatedSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900">
                Google Services Suite & Monetization
              </h2>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                OFFICIAL APIS
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage official integrations for Google Analytics 4, Search Console, Tag Manager, and Google AdSense in one unified dashboard.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Google Services settings updated and saved successfully!</span>
        </div>
      )}

      {/* Grid of Google Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Google Analytics 4 (GA4) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-sm">
                GA4
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Google Analytics 4</h3>
                <p className="text-[11px] text-slate-500">Real-time visitors, page views, and traffic insights</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              gaId && /^G-[A-Z0-9]+$/i.test(gaId)
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : gaId
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {gaId && /^G-[A-Z0-9]+$/i.test(gaId)
                ? '🟢 Active & Injected in DOM'
                : gaId
                ? '⚠️ Format: G-XXXXXXXXXX'
                : '⚪ Unset'}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Measurement ID
            </label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Found in Google Analytics console under Admin &gt; Data Streams. Automatically injects <code>gtag.js</code> into document head.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Analytics Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. Google Search Console (GSC) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-sm">
                GSC
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Google Search Console</h3>
                <p className="text-[11px] text-slate-500">Indexing, sitemaps, and Google ranking health</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              gscToken
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {gscToken ? '🟢 Active in <head>' : '⚪ Pending'}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Verification Meta Tag / Token
            </label>
            <input
              type="text"
              value={gscToken}
              onChange={(e) => setGscToken(e.target.value)}
              placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXX"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Paste the verification token or entire meta tag from the HTML Tag verification method.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Search Console Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3. Google Tag Manager (GTM) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-black text-sm">
                GTM
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Google Tag Manager</h3>
                <p className="text-[11px] text-slate-500">Marketing pixels, conversion tracking, and custom tags</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              gtmId && /^GTM-[A-Z0-9]+$/i.test(gtmId)
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : gtmId
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {gtmId && /^GTM-[A-Z0-9]+$/i.test(gtmId)
                ? '🟢 Injected in DOM'
                : gtmId
                ? '⚠️ Format: GTM-XXXXXXX'
                : '⚪ Optional'}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              GTM Container ID
            </label>
            <input
              type="text"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Entering container ID automatically injects the GTM container loader script into <code>&lt;head&gt;</code>.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://tagmanager.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open GTM Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 4. Google AdSense */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-sm">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Google AdSense</h3>
                <p className="text-[11px] text-slate-500">Ad Monetization & Auto Ads</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {adsenseId ? '🟢 Monetized' : '⚪ Inactive'}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              AdSense Publisher Client ID
            </label>
            <input
              type="text"
              value={adsenseId}
              onChange={(e) => setAdsenseId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto Ads</span>
              <span className="text-[10px] text-slate-500">Google AI automatically optimizes ad placements on page</span>
            </div>
            <button
              type="button"
              onClick={() => setAutoAds(!autoAds)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                autoAds ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {autoAds ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://adsense.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open AdSense Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Google Suite Configurations</span>
        </button>
      </div>
    </form>
  );
};
