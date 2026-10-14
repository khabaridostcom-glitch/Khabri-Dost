import React from 'react';
import { Smartphone, Tablet, Monitor, Sliders, EyeOff } from 'lucide-react';
import { AdResponsiveBreakpoints, AdSlotBreakpointSize } from '../../types/news';

interface AdBreakpointEditorProps {
  label: string;
  breakpoints?: AdResponsiveBreakpoints;
  onChange: (updated: AdResponsiveBreakpoints) => void;
}

const DEFAULT_BREAKPOINTS: AdResponsiveBreakpoints = {
  mobile: {
    maxWidth: 640,
    minHeightPx: 140,
    maxHeightPx: 220,
    aspectRatio: '300/200',
    hideOnBreakpoint: false,
  },
  tablet: {
    maxWidth: 1024,
    minHeightPx: 160,
    maxHeightPx: 260,
    aspectRatio: '300/220',
    hideOnBreakpoint: false,
  },
  desktop: {
    minHeightPx: 180,
    maxHeightPx: 300,
    aspectRatio: '300/250',
    hideOnBreakpoint: false,
  },
  enableCustomBreakpoints: true,
};

export const AdBreakpointEditor: React.FC<AdBreakpointEditorProps> = ({
  label,
  breakpoints,
  onChange,
}) => {
  const current: AdResponsiveBreakpoints = {
    ...DEFAULT_BREAKPOINTS,
    ...(breakpoints || {}),
    mobile: { ...DEFAULT_BREAKPOINTS.mobile, ...(breakpoints?.mobile || {}) },
    tablet: { ...DEFAULT_BREAKPOINTS.tablet, ...(breakpoints?.tablet || {}) },
    desktop: { ...DEFAULT_BREAKPOINTS.desktop, ...(breakpoints?.desktop || {}) },
  };

  const isCustomEnabled = current.enableCustomBreakpoints !== false;

  const handleToggleCustom = () => {
    onChange({
      ...current,
      enableCustomBreakpoints: !isCustomEnabled,
    });
  };

  const handleUpdateDevice = (
    device: 'mobile' | 'tablet' | 'desktop',
    partial: Partial<AdSlotBreakpointSize>
  ) => {
    onChange({
      ...current,
      [device]: {
        ...current[device],
        ...partial,
      },
    });
  };

  return (
    <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-kd-headline">
              {label} — Responsive Breakpoints & Sizing
            </h4>
            <p className="text-[11px] text-slate-500 font-kd-meta">
              Mobile, Tablet व Desktop स्क्रीन्स के लिए अलग-अलग ऊंचाई, अनुपात और विजिबिलिटी सेट करें
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleCustom}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto ${
            isCustomEnabled
              ? 'bg-red-600 text-white shadow-2xs'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <span>{isCustomEnabled ? '✓ Custom Breakpoints Active' : 'Enable Custom Breakpoints'}</span>
        </button>
      </div>

      {isCustomEnabled ? (
        <>
          {/* Quick Breakpoint Cutoff Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-red-600" />
              <span>Quick Breakpoint Presets:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...current,
                    mobile: { ...current.mobile, maxWidth: 640 },
                    tablet: { ...current.tablet, maxWidth: 1024 },
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  current.mobile.maxWidth === 640 && current.tablet.maxWidth === 1024
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Standard (Mobile 640px | Tablet 1024px)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...current,
                    mobile: { ...current.mobile, maxWidth: 576 },
                    tablet: { ...current.tablet, maxWidth: 992 },
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  current.mobile.maxWidth === 576 && current.tablet.maxWidth === 992
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Bootstrap Grid (576px | 992px)
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...current,
                    mobile: { ...current.mobile, maxWidth: 768 },
                    tablet: { ...current.tablet, maxWidth: 1200 },
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  current.mobile.maxWidth === 768 && current.tablet.maxWidth === 1200
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Large Display (768px | 1200px)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. MOBILE BREAKPOINT (< 640px) */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Mobile (स्मार्टफोन)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                &lt; {current.mobile.maxWidth || 640}px
              </span>
            </div>

            {/* Custom Breakpoint Cutoff for Mobile */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                <span>Breakpoint Cutoff (अधिकतम चौड़ाई):</span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="360"
                    max="800"
                    value={current.mobile.maxWidth || 640}
                    onChange={(e) =>
                      handleUpdateDevice('mobile', { maxWidth: Number(e.target.value) })
                    }
                    className="w-14 px-1.5 py-0.5 text-right font-mono text-xs bg-white border border-slate-300 rounded font-bold text-blue-700"
                  />
                  <span className="text-slate-500 font-mono text-[10px]">px</span>
                </div>
              </div>
              <input
                type="range"
                min="360"
                max="800"
                step="10"
                value={current.mobile.maxWidth || 640}
                onChange={(e) =>
                  handleUpdateDevice('mobile', { maxWidth: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">Show on Mobile:</span>
              <button
                type="button"
                onClick={() =>
                  handleUpdateDevice('mobile', {
                    hideOnBreakpoint: !current.mobile.hideOnBreakpoint,
                  })
                }
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition ${
                  current.mobile.hideOnBreakpoint
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {current.mobile.hideOnBreakpoint ? 'Hidden (छुपाएं)' : 'Visible (सक्रिय)'}
              </button>
            </div>

            {!current.mobile.hideOnBreakpoint && (
              <div className="space-y-2.5 pt-1 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Min Height (न्यूनतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.mobile.minHeightPx || 100}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="280"
                    step="5"
                    value={current.mobile.minHeightPx || 100}
                    onChange={(e) =>
                      handleUpdateDevice('mobile', { minHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Max Height (अधिकतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.mobile.maxHeightPx || 180}px</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="400"
                    step="5"
                    value={current.mobile.maxHeightPx || 180}
                    onChange={(e) =>
                      handleUpdateDevice('mobile', { maxHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Aspect Ratio (पहलू अनुपात):</label>
                  <select
                    value={current.mobile.aspectRatio || '300/200'}
                    onChange={(e) =>
                      handleUpdateDevice('mobile', { aspectRatio: e.target.value })
                    }
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:bg-white focus:outline-none"
                  >
                    <option value="300/200">300 : 200 (Compact Mobile Rectangle)</option>
                    <option value="300/250">300 : 250 (Medium Rectangle MPU)</option>
                    <option value="320/100">320 : 100 (Mobile Large Banner)</option>
                    <option value="320/50">320 : 50 (Mobile Leaderboard)</option>
                    <option value="auto">Auto (मूल छवि अनुसार)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 2. TABLET BREAKPOINT (640px - 1024px) */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Tablet className="w-3.5 h-3.5 text-amber-600" />
                <span>Tablet (टैबलेट / iPad)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {current.mobile.maxWidth || 640}px – {current.tablet.maxWidth || 1024}px
              </span>
            </div>

            {/* Custom Breakpoint Cutoff for Tablet */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                <span>Breakpoint Cutoff (अधिकतम चौड़ाई):</span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="700"
                    max="1440"
                    value={current.tablet.maxWidth || 1024}
                    onChange={(e) =>
                      handleUpdateDevice('tablet', { maxWidth: Number(e.target.value) })
                    }
                    className="w-14 px-1.5 py-0.5 text-right font-mono text-xs bg-white border border-slate-300 rounded font-bold text-amber-700"
                  />
                  <span className="text-slate-500 font-mono text-[10px]">px</span>
                </div>
              </div>
              <input
                type="range"
                min="700"
                max="1440"
                step="20"
                value={current.tablet.maxWidth || 1024}
                onChange={(e) =>
                  handleUpdateDevice('tablet', { maxWidth: Number(e.target.value) })
                }
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">Show on Tablet:</span>
              <button
                type="button"
                onClick={() =>
                  handleUpdateDevice('tablet', {
                    hideOnBreakpoint: !current.tablet.hideOnBreakpoint,
                  })
                }
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition ${
                  current.tablet.hideOnBreakpoint
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {current.tablet.hideOnBreakpoint ? 'Hidden (छुपाएं)' : 'Visible (सक्रिय)'}
              </button>
            </div>

            {!current.tablet.hideOnBreakpoint && (
              <div className="space-y-2.5 pt-1 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Min Height (न्यूनतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.tablet.minHeightPx || 140}px</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="350"
                    step="5"
                    value={current.tablet.minHeightPx || 140}
                    onChange={(e) =>
                      handleUpdateDevice('tablet', { minHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Max Height (अधिकतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.tablet.maxHeightPx || 250}px</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="450"
                    step="5"
                    value={current.tablet.maxHeightPx || 250}
                    onChange={(e) =>
                      handleUpdateDevice('tablet', { maxHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Aspect Ratio (पहलू अनुपात):</label>
                  <select
                    value={current.tablet.aspectRatio || '300/220'}
                    onChange={(e) =>
                      handleUpdateDevice('tablet', { aspectRatio: e.target.value })
                    }
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:bg-white focus:outline-none"
                  >
                    <option value="300/220">300 : 220 (Tablet Optimized)</option>
                    <option value="300/250">300 : 250 (Medium Rectangle MPU)</option>
                    <option value="468/60">468 : 60 (Standard Tablet Banner)</option>
                    <option value="728/90">728 : 90 (Leaderboard)</option>
                    <option value="auto">Auto (मूल छवि अनुसार)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 3. DESKTOP BREAKPOINT (>= 1024px) */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                <span>Desktop (डेस्कटॉप / लैपटॉप)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">&ge; 1024px</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">Show on Desktop:</span>
              <button
                type="button"
                onClick={() =>
                  handleUpdateDevice('desktop', {
                    hideOnBreakpoint: !current.desktop.hideOnBreakpoint,
                  })
                }
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition ${
                  current.desktop.hideOnBreakpoint
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {current.desktop.hideOnBreakpoint ? 'Hidden (छुपाएं)' : 'Visible (सक्रिय)'}
              </button>
            </div>

            {!current.desktop.hideOnBreakpoint && (
              <div className="space-y-2.5 pt-1 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Min Height (न्यूनतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.desktop.minHeightPx || 160}px</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="450"
                    step="5"
                    value={current.desktop.minHeightPx || 160}
                    onChange={(e) =>
                      handleUpdateDevice('desktop', { minHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Max Height (अधिकतम ऊंचाई):</span>
                    <span className="font-mono font-bold text-slate-900">{current.desktop.maxHeightPx || 300}px</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    step="5"
                    value={current.desktop.maxHeightPx || 300}
                    onChange={(e) =>
                      handleUpdateDevice('desktop', { maxHeightPx: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Aspect Ratio (पहलू अनुपात):</label>
                  <select
                    value={current.desktop.aspectRatio || '300/250'}
                    onChange={(e) =>
                      handleUpdateDevice('desktop', { aspectRatio: e.target.value })
                    }
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:bg-white focus:outline-none"
                  >
                    <option value="300/250">300 : 250 (Medium Rectangle MPU)</option>
                    <option value="300/600">300 : 600 (Half Page / Skyscraper)</option>
                    <option value="728/90">728 : 90 (Leaderboard)</option>
                    <option value="970/250">970 : 250 (Billboard)</option>
                    <option value="auto">Auto (मूल छवि अनुसार)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
      ) : (
        <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
          Default fluid responsive behavior is currently active (Standard aspect ratio automatic scaling). Click "Enable Custom Breakpoints" above to fine-tune exact pixel sizes for Mobile, Tablet, and Desktop.
        </div>
      )}
    </div>
  );
};
