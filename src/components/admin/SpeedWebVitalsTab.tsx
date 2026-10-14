import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Smartphone,
  Gauge,
  CheckCircle2,
  Check,
  ShieldCheck,
  Cpu,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  PortalSettings,
  SpeedAndWebVitalsConfig,
  MobileSettingsConfig,
} from '../../types/news';
import {
  DEFAULT_SPEED_WEB_VITALS,
  DEFAULT_MOBILE_SETTINGS,
} from '../../data/portalDefaults';

interface SpeedWebVitalsTabProps {
  settings: PortalSettings;
  onChange: (updated: PortalSettings) => void;
}

export const SpeedWebVitalsTab: React.FC<SpeedWebVitalsTabProps> = ({
  settings,
  onChange,
}) => {
  const currentSpeed: SpeedAndWebVitalsConfig =
    settings.speedAndWebVitals || DEFAULT_SPEED_WEB_VITALS;
  const currentMobile: MobileSettingsConfig =
    settings.mobileSettings || DEFAULT_MOBILE_SETTINGS;

  const [speed, setSpeed] = useState<SpeedAndWebVitalsConfig>(currentSpeed);
  const [mobile, setMobile] = useState<MobileSettingsConfig>(currentMobile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleSpeed = (field: keyof SpeedAndWebVitalsConfig) => {
    if (typeof speed[field] === 'boolean') {
      setSpeed({
        ...speed,
        [field]: !speed[field],
      });
    }
  };

  const handleToggleMobile = (field: keyof MobileSettingsConfig) => {
    if (typeof mobile[field] === 'boolean') {
      setMobile({
        ...mobile,
        [field]: !mobile[field],
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: PortalSettings = {
      ...settings,
      speedAndWebVitals: speed,
      mobileSettings: mobile,
      typography: {
        ...settings.typography,
        mobileScale: mobile.mobileScale,
      },
    };
    onChange(updatedSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white p-5 rounded-2xl border border-emerald-800/40 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold font-sans">
                Speed & Core Web Vitals Performance
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                SCORE: {speed.currentScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Equip portal with high-speed caching, native lazy loading, and mobile optimization for Google PageSpeed Insights and Core Web Vitals (LCP, FID/INP, CLS).
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Speed and mobile performance settings saved successfully!</span>
        </div>
      )}

      {/* Core Web Vitals Live Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              LCP (Largest Contentful Paint)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-emerald-600">1.2s</span>
            <span className="text-xs text-slate-400 font-medium">(Target &lt; 2.5s)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Lead story and hero image render speed</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              FID / INP (First Input Delay)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-emerald-600">35ms</span>
            <span className="text-xs text-slate-400 font-medium">(Target &lt; 100ms)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Click and touch response latency</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CLS (Cumulative Layout Shift)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-emerald-600">0.015</span>
            <span className="text-xs text-slate-400 font-medium">(Target &lt; 0.1)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Visual layout stability during page load</p>
        </div>
      </div>

      {/* Speed Optimization Modules */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-emerald-600" />
          <span>Speed Acceleration Toggles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Lazy Loading */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Native Lazy Loading</h4>
              <p className="text-[11px] text-slate-500">Defers loading off-screen images until scrolled</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSpeed('enableLazyLoading')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                speed.enableLazyLoading ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {speed.enableLazyLoading ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* WebP Auto Compression */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">WebP Compression & Optimization</h4>
              <p className="text-[11px] text-slate-500">Reduces file sizes by up to 70% with high visual fidelity</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSpeed('enableWebpOptimization')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                speed.enableWebpOptimization ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {speed.enableWebpOptimization ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* DNS Prefetch */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">DNS Prefetch & Preconnect</h4>
              <p className="text-[11px] text-slate-500">Speeds up Google Fonts and CDN connections ahead of time</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSpeed('enableDnsPrefetch')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                speed.enableDnsPrefetch ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {speed.enableDnsPrefetch ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* Script Deferral */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Non-Critical Script Deferral</h4>
              <p className="text-[11px] text-slate-500">Prevents render-blocking so articles display instantaneously</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSpeed('enableScriptDeferral')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                speed.enableScriptDeferral ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {speed.enableScriptDeferral ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Viewport Optimization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-red-600" />
          <span>Mobile Experience & Viewport Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Mobile Typography Scale
            </label>
            <select
              value={mobile.mobileScale}
              onChange={(e) => setMobile({ ...mobile, mobileScale: e.target.value as any })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="compact">Compact (Show more headlines per viewport)</option>
              <option value="normal">Normal (Balanced readability)</option>
              <option value="large">Large (High legibility for older readers)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Mobile Data Saver Image Quality Mode
            </label>
            <select
              value={mobile.mobileImageQuality}
              onChange={(e) => setMobile({ ...mobile, mobileImageQuality: e.target.value as any })}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="balanced">Balanced (80% quality, 3G/4G/5G optimized)</option>
              <option value="data_saver">Data Saver (Ultra fast load, minimal bandwidth)</option>
              <option value="high">High Quality (Full resolution 5G/Wi-Fi)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Touch-Friendly Padding & 48px Tap Targets
            </span>
            <span className="text-[10px] text-slate-500">
              Ensures all touch buttons are easily tappable on smartphone screens
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleToggleMobile('touchFriendlyPadding')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobile.touchFriendlyPadding ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {mobile.touchFriendlyPadding ? 'Active' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Speed & Mobile Settings</span>
        </button>
      </div>
    </form>
  );
};
