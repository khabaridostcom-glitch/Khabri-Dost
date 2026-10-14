import React, { useState } from 'react';
import { Type, Smartphone, Check, Sparkles, Sliders, RotateCcw, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { PortalSettings, TypographySettings } from '../../types/news';
import { DEFAULT_PORTAL_SETTINGS } from '../../data/portalDefaults';

export interface TypographySettingsTabProps {
  settings: PortalSettings;
  onUpdateTypography: (updated: Partial<TypographySettings>) => void;
  onUpdateSettings: (settings: PortalSettings) => void;
  onOpenAdminReset?: () => void;
}

const FONT_OPTIONS = [
  { id: "'Rozha One', serif", name: 'Rozha One (क्लासिक संपादकीय - Classical Editorial)' },
  { id: "'Yantramanav', sans-serif", name: 'Yantramanav (आधुनिक व स्पष्ट - Modern & Crisp)' },
  { id: "'Tiro Devanagari Hindi', serif", name: 'Tiro Devanagari (साहित्यिक व गंभीर - Journalistic)' },
  { id: "'Noto Sans Devanagari', sans-serif", name: 'Noto Sans Devanagari (सर्वश्रेष्ठ डिजिटल पठनीयता)' },
  { id: "'Mukta', sans-serif", name: 'Mukta (दैनिक भास्कर / नवभारत टाइम्स स्टाइल)' },
  { id: "'Gotu', sans-serif", name: 'Gotu (बोल्ड हेडलाइन्स)' },
  { id: "'Poppins', sans-serif", name: 'Poppins (इंटरनेशनल क्लीन लुक)' },
  { id: "'Inter', sans-serif", name: 'Inter (UI प्रोफेशनल)' },
  { id: "system-ui, -apple-system, sans-serif", name: 'System Native (तेज़ व डिफ़ॉल्ट)' },
];

export const TypographySettingsTab: React.FC<TypographySettingsTabProps> = ({
  settings,
  onUpdateTypography,
  onUpdateSettings,
  onOpenAdminReset,
}) => {
  const typo = settings.typography;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetToast, setResetToast] = useState<string | null>(null);

  // Reset to original system defaults
  const handleResetTypography = () => {
    onUpdateTypography(DEFAULT_PORTAL_SETTINGS.typography);
    setShowResetConfirm(false);
    setResetToast('✓ सभी फ़ॉन्ट सेटिंग्स मूल डिफ़ॉल्ट पर रीसेट कर दी गईं!');
    setTimeout(() => setResetToast(null), 3500);
  };

  // Apply curated font presets
  const applyPreset = (presetName: string, presetData: Partial<TypographySettings>) => {
    onUpdateTypography(presetData);
    setResetToast(`✓ फ़ॉन्ट प्रीसेट लागू: ${presetName}`);
    setTimeout(() => setResetToast(null), 3000);
  };

  const renderCustomControl = (
    label: string,
    currentVal: number,
    onChange: (val: number) => void,
    min: number,
    max: number,
    step = 1,
    quickChips: number[] = [],
    unit = 'px',
    description?: string
  ) => (
    <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition">
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800 block">{label}</label>
          {description && <p className="text-[10px] text-slate-400">{description}</p>}
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={currentVal}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (!isNaN(num) && num > 0) onChange(num);
            }}
            className="w-16 px-2 py-1 text-xs text-right font-mono font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-900 shadow-2xs"
          />
          <span className="text-xs text-slate-500 font-bold">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentVal}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
      />
      {quickChips.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 pt-0.5">
          <span className="text-[10px] text-slate-400 mr-0.5 font-medium">Quick:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChange(chip)}
              className={`px-1.5 py-0.5 text-[10px] rounded font-bold transition cursor-pointer ${
                currentVal === chip
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {chip}{unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Reset Success Toast */}
      {resetToast && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resetToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setResetToast(null)}
            className="text-emerald-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner with Reset Font Settings Button */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold">
                  Typography & Font Settings (फ़ॉन्ट कस्टमाइज़ेशन)
                </h2>
                <span className="bg-red-500/20 text-red-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-500/40">
                  LIVE APPLIED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                पोर्टल के प्रत्येक हिस्से (हेडर, हेडलाइन, बॉडी, साइडबार) के लिए कस्टम फ़ॉन्ट फ़ैमिली व exact px साइज़ सेट करें।
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="फ़ॉन्ट सेटिंग्स को मूल डिफ़ॉल्ट पर रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>फ़ॉन्ट सेटिंग्स रीसेट करें (Reset Fonts)</span>
            </button>
            {onOpenAdminReset && (
              <button
                type="button"
                onClick={onOpenAdminReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                title="संपूर्ण एडमिन सेटिंग्स रीसेट करें"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>एडमिन सेटिंग्स रीसेट (Reset Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>त्वरित प्रीसेट्स (Quick Presets):</span>
          </span>
          <button
            type="button"
            onClick={() =>
              applyPreset('दैनिक समाचार डिफ़ॉल्ट', {
                headerFont: "'Rozha One', serif",
                headlineFont: "'Rozha One', serif",
                bodyFont: "'Mukta', sans-serif",
                footerFont: "'Mukta', sans-serif",
                articleTitleDesktopPx: 38,
                articleBodyFontSizePx: 17,
                articleBodyLineHeight: 1.75,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium cursor-pointer transition"
          >
            📰 क्लासिक हिंदी न्यूज़ (Rozha + Mukta)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset('आधुनिक डिजिटल', {
                headerFont: "'Noto Sans Devanagari', sans-serif",
                headlineFont: "'Noto Sans Devanagari', sans-serif",
                bodyFont: "'Noto Sans Devanagari', sans-serif",
                footerFont: "'Noto Sans Devanagari', sans-serif",
                articleTitleDesktopPx: 36,
                articleBodyFontSizePx: 16.5,
                articleBodyLineHeight: 1.7,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium cursor-pointer transition"
          >
            ⚡ आधुनिक डिजिटल (Noto Sans All)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset('साहित्यिक गंभीर', {
                headerFont: "'Tiro Devanagari Hindi', serif",
                headlineFont: "'Tiro Devanagari Hindi', serif",
                bodyFont: "'Yantramanav', sans-serif",
                footerFont: "'Yantramanav', sans-serif",
                articleTitleDesktopPx: 40,
                articleBodyFontSizePx: 18,
                articleBodyLineHeight: 1.8,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium cursor-pointer transition"
          >
            📖 साहित्यिक गंभीर (Tiro + Yantra)
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Fonts */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                फ़ॉन्ट सेटिंग्स रीसेट करें (Reset Font Settings)?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                क्या आप सभी फ़ॉन्ट फ़ैमिली (Rozha One, Mukta) और पिक्सल आकार को मूल संपादकीय डिफ़ॉल्ट पर पुनर्स्थापित करना चाहते हैं?
              </p>
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
                <div>• हेडलाइन फ़ॉन्ट: <strong>Rozha One, serif</strong></div>
                <div>• बॉडी फ़ॉन्ट: <strong>Mukta, sans-serif</strong></div>
                <div>• लेख शीर्षक: <strong>38px Desktop / 28px Mobile</strong></div>
                <div>• लेख बॉडी: <strong>17px (लाइन हाइट: 1.75x)</strong></div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleResetTypography}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>हाँ, फ़ॉन्ट रीसेट करें (Confirm Reset)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER, LOGO & NAVIGATION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              H
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Header, Logo & Navigation (हेडर, लोगो एवं मेन्यू)</h3>
              <p className="text-[11px] text-slate-500">वेबसाइट का मुख्य नाम, लोगो इमेज की ऊंचाई, मेन्यू लिंक्स और ब्रेकिंग न्यूज़ टिकर</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Header Font Family</label>
            <select
              value={typo.headerFont}
              onChange={(e) => onUpdateTypography({ headerFont: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Header Title Text Custom Size */}
          {renderCustomControl(
            'Site Title / Brand Text Font Size (वेबसाइट नाम का फ़ॉन्ट)',
            settings.headerFooter?.headerTitleCustomPx || typo.headerTitleCustomPx || 36,
            (val) => {
              onUpdateTypography({ headerTitleCustomPx: val });
              if (settings.headerFooter) {
                onUpdateSettings({
                  ...settings,
                  headerFooter: { ...settings.headerFooter, headerTitleCustomPx: val },
                });
              }
            },
            18,
            72,
            1,
            [26, 32, 36, 42, 48],
            'px',
            'हेडर में दिखने वाले टेक्स्ट लोगो का वास्तविक साइज़'
          )}

          {/* Header Logo Image Height */}
          {renderCustomControl(
            'Header Logo Image Height (लोगो इमेज की ऊंचाई)',
            settings.headerFooter?.headerLogoHeight || typo.headerLogoHeightPx || 52,
            (val) => {
              onUpdateTypography({ headerLogoHeightPx: val });
              if (settings.headerFooter) {
                onUpdateSettings({
                  ...settings,
                  headerFooter: { ...settings.headerFooter, headerLogoHeight: val },
                });
              }
            },
            24,
            110,
            2,
            [40, 48, 52, 60, 72],
            'px',
            'अपलोड किए गए लोगो की ऊंचाई'
          )}

          {/* Navigation Links Font Size */}
          {renderCustomControl(
            'Navbar Category Links Size (मेन्यू बार लिंक्स)',
            typo.navLinkFontSizePx || 14,
            (val) => onUpdateTypography({ navLinkFontSizePx: val }),
            11,
            22,
            1,
            [12, 13, 14, 15, 16],
            'px',
            'मुख्य नेविगेशन बार में श्रेणियों का फ़ॉन्ट साइज़'
          )}

          {/* Breaking News Ticker Font Size */}
          {renderCustomControl(
            'Breaking News Ticker Font Size (बड़ी ख़बर टिकर)',
            typo.tickerFontSizePx || 13,
            (val) => onUpdateTypography({ tickerFontSizePx: val }),
            11,
            22,
            1,
            [12, 13, 14, 15, 16],
            'px',
            'लाल पट्टी में चलने वाली ब्रेकिंग न्यूज़ हेडलाइन्स'
          )}
        </div>
      </div>

      {/* 2. HOMEPAGE & SECTION HEADINGS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
              H1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">2. Homepage & Section Headings (होमपेज व सेक्शन हेडिंग्स)</h3>
              <p className="text-[11px] text-slate-500">सेक्शन टाइटल ('ताज़ा ख़बरें', 'राजनीति'), मुख्य लीड स्टोरी, ग्रिड कार्ड शीर्षक और सारांश</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline Font Family</label>
            <select
              value={typo.headlineFont}
              onChange={(e) => onUpdateTypography({ headlineFont: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline Font Weight</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[600, 700, 800].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onUpdateTypography({ headlineWeight: w })}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition cursor-pointer ${
                    (typo.headlineWeight || 700) === w
                      ? 'bg-red-600 border-red-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {w === 600 ? 'Med (600)' : w === 700 ? 'Bold (700)' : 'Heavy (800)'}
                </button>
              ))}
            </div>
          </div>

          {/* Section Headings */}
          {renderCustomControl(
            'Category Section Block Headings (सेक्शन हेडिंग्स)',
            typo.sectionHeadingPx || 20,
            (val) => onUpdateTypography({ sectionHeadingPx: val }),
            14,
            34,
            1,
            [16, 18, 20, 22, 24, 28],
            'px',
            "'ताज़ा ख़बरें', 'राजनीति', 'मनोरंजन' जैसे ब्लॉक टाइटल्स"
          )}

          {/* Hero / Big Story Headline */}
          {renderCustomControl(
            'Hero / Lead Big Story Headline (लीड स्टोरी टाइटल)',
            typo.heroTitlePx || 26,
            (val) => onUpdateTypography({ heroTitlePx: val }),
            18,
            42,
            1,
            [22, 24, 26, 28, 32],
            'px',
            'होमपेज पर सबसे बड़ी मुख्य लीड स्टोरी का हेडलाइन साइज़'
          )}

          {/* Standard Grid Card Title */}
          {renderCustomControl(
            'News Card Story Headline (ग्रिड कार्ड समाचार शीर्षक)',
            typo.gridCardTitlePx || 16,
            (val) => onUpdateTypography({ gridCardTitlePx: val }),
            12,
            26,
            1,
            [13, 14, 15, 16, 18, 20],
            'px',
            'होमपेज व सेक्शन ग्रिड में सभी समाचार कार्ड्स के टाइटल'
          )}

          {/* News Card Excerpt / Summary */}
          {renderCustomControl(
            'News Card Summary / Excerpt (समाचार कार्ड सारांश)',
            typo.gridCardExcerptPx || 13,
            (val) => onUpdateTypography({ gridCardExcerptPx: val }),
            11,
            20,
            1,
            [11, 12, 13, 14, 15],
            'px',
            'कार्ड्स में नीचे दिखने वाले 2-लाइन सारांश का साइज़'
          )}

          {/* Card Meta & Category Badges */}
          {renderCustomControl(
            'Card Category Badges & Meta Tags (कैटेगरी बैज व समय)',
            typo.cardMetaFontSizePx || 11,
            (val) => onUpdateTypography({ cardMetaFontSizePx: val }),
            9,
            16,
            1,
            [10, 11, 12, 13],
            'px',
            'कार्ड्स के ऊपर लाल कैटेगरी टैग और तारीख का साइज़'
          )}
        </div>
      </div>

      {/* 3. SINGLE ARTICLE PAGE TYPOGRAPHY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3. Single Article Page Typography (संपूर्ण आर्टिकल पेज फ़ॉन्ट्स)</h3>
              <p className="text-[11px] text-slate-500">डेस्कटॉप व मोबाइल मुख्य H1 शीर्षक, सबटाइटल, पैराग्राफ कंटेंट, लाइन हाइट एवं संबंधित ख़बरें</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Body & Article Font Family</label>
            <select
              value={typo.bodyFont}
              onChange={(e) => onUpdateTypography({ bodyFont: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Body Text Weight</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[400, 500, 600].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onUpdateTypography({ bodyWeight: w })}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition cursor-pointer ${
                    (typo.bodyWeight || 400) === w
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {w === 400 ? 'Regular (400)' : w === 500 ? 'Medium (500)' : 'Semi-Bold (600)'}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Article Title Size */}
          {renderCustomControl(
            'Desktop Article H1 Title Size (डेस्कटॉप शीर्षक)',
            typo.articleTitleDesktopPx || 38,
            (val) => onUpdateTypography({ articleTitleDesktopPx: val }),
            24,
            60,
            1,
            [30, 34, 38, 42, 48],
            'px',
            'डेस्कटॉप व लैपटॉप स्क्रीन पर आर्टिकल का मुख्य H1 हेडिंग साइज़'
          )}

          {/* Mobile Article Title Size */}
          {renderCustomControl(
            'Mobile Article H1 Title Size (मोबाइल शीर्षक)',
            typo.articleTitleMobilePx || 28,
            (val) => onUpdateTypography({ articleTitleMobilePx: val }),
            18,
            42,
            1,
            [22, 26, 28, 30, 34],
            'px',
            'स्मार्टफोन पर आर्टिकल हेडिंग का प्राकृतिक साइज़'
          )}

          {/* Article Lead Subtitle */}
          {renderCustomControl(
            'Article Lead Subtitle (सबटाइटल/लीड)',
            typo.articleLeadSubtitlePx || 18,
            (val) => onUpdateTypography({ articleLeadSubtitlePx: val }),
            12,
            26,
            1,
            [14, 16, 18, 20, 22],
            'px',
            'हेडिंग के ठीक नीचे लाल बॉर्डर वाला मुख्य सबटाइटल'
          )}

          {/* Article Body Paragraph Size */}
          {renderCustomControl(
            'Article Body Paragraph Size (पैराग्राफ टेक्स्ट)',
            typo.articleBodyFontSizePx || 17,
            (val) => onUpdateTypography({ articleBodyFontSizePx: val }),
            13,
            26,
            1,
            [15, 16, 17, 18, 20],
            'px',
            'आर्टिकल की मुख्य ख़बर के अनुच्छेदों (Paragraphs) का फ़ॉन्ट साइज़'
          )}

          {/* Article Body Line Height */}
          {renderCustomControl(
            'Article Body Line Height Spacing (पंक्तियों के बीच दूरी)',
            typo.articleBodyLineHeight || 1.75,
            (val) => onUpdateTypography({ articleBodyLineHeight: val }),
            1.3,
            2.4,
            0.05,
            [1.5, 1.65, 1.75, 1.9, 2.0],
            'x',
            'आर्टिकल पढ़ने में आसानी हेतु लाइनों का अंतराल'
          )}

          {/* Related Articles Section Heading */}
          {renderCustomControl(
            'संबंधित ख़बरें (Related Articles) Heading Size',
            typo.relatedHeadingCustomPx || 18,
            (val) => onUpdateTypography({ relatedHeadingCustomPx: val }),
            14,
            32,
            1,
            [14, 16, 18, 22, 26],
            'px',
            'आर्टिकल के अंत में संबंधित ख़बरें सेक्शन का हेडर'
          )}

          {/* Related Card Story Title */}
          {renderCustomControl(
            'Related Card Story Title (संबंधित कार्ड शीर्षक)',
            typo.relatedCardTitlePx || 15,
            (val) => onUpdateTypography({ relatedCardTitlePx: val }),
            12,
            22,
            1,
            [13, 14, 15, 16, 18],
            'px',
            'संबंधित ख़बरों के ग्रिड में कार्ड टाइटल'
          )}

          {/* Related Category Badge */}
          {renderCustomControl(
            'Related Category Badge (संबंधित कैटेगरी बैज)',
            typo.relatedCategoryBadgePx || 12,
            (val) => onUpdateTypography({ relatedCategoryBadgePx: val }),
            9,
            16,
            1,
            [10, 11, 12, 14],
            'px',
            'संबंधित ख़बरों के कार्ड पर लाल कैटेगरी टैग'
          )}
        </div>
      </div>

      {/* 4. SIDEBAR & WIDGETS TYPOGRAPHY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              W
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">4. Sidebar & Widgets Typography (साइडबार विजेट्स)</h3>
              <p className="text-[11px] text-slate-500">ट्रेंडिंग ख़बरें, सोने-चांदी का भाव, दैनिक राशिफल और विजेट्स के शीर्षकों का आकार</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sidebar Widget Headings */}
          {renderCustomControl(
            'Sidebar Widget Header Title Size (विजेट हेडर शीर्षक)',
            typo.sidebarHeadingPx || 15,
            (val) => onUpdateTypography({ sidebarHeadingPx: val }),
            12,
            24,
            1,
            [13, 14, 15, 16, 18],
            'px',
            "'ट्रेंडिंग ख़बरें', 'आज के सोने-चांदी का भाव', 'दैनिक राशिफल'"
          )}

          {/* Sidebar Item Titles */}
          {renderCustomControl(
            'Trending Sidebar Story Titles (ट्रेंडिंग आइटम शीर्षक)',
            typo.sidebarItemTitlePx || 13,
            (val) => onUpdateTypography({ sidebarItemTitlePx: val }),
            11,
            20,
            1,
            [11, 12, 13, 14, 15],
            'px',
            'साइडबार में स्क्रॉल होने वाले समाचारों का टाइटल साइज़'
          )}
        </div>
      </div>

      {/* 5. FOOTER TYPOGRAPHY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
            F
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">5. Footer Typography (फ़ूटर फ़ॉन्ट्स)</h3>
            <p className="text-[11px] text-slate-500">फ़ूटर कॉलम शीर्षकों और डायरेक्टरी लिंक्स का फ़ॉन्ट साइज़</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Footer Font Family</label>
            <select
              value={typo.footerFont || typo.bodyFont}
              onChange={(e) => onUpdateTypography({ footerFont: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Column Headings */}
          {renderCustomControl(
            'Footer Column Titles (कॉलम हेडिंग्स)',
            typo.footerHeadingPx || 16,
            (val) => onUpdateTypography({ footerHeadingPx: val }),
            12,
            24,
            1,
            [13, 14, 16, 18, 20],
            'px',
            'प्रमुख विषय, राज्य, कानूनी नीतियां आदि'
          )}

          {/* Footer Directory Links Text */}
          {renderCustomControl(
            'Footer Links & About Text (लिंक्स व विवरण)',
            typo.footerTextPx || 13,
            (val) => onUpdateTypography({ footerTextPx: val }),
            10,
            18,
            1,
            [11, 12, 13, 14, 15],
            'px',
            'फ़ूटर लिंक्स, कॉपीराइट और परिचय पाठ'
          )}
        </div>
      </div>

      {/* 6. GLOBAL BASE SCALE & META DETAILS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-700" />
          <span>6. Global Base Scale & Meta Details (ग्लोबल बेस स्केल व मेटा फ़ॉन्ट)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meta Font Family</label>
            <select
              value={typo.metaFont}
              onChange={(e) => onUpdateTypography({ metaFont: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Global Base HTML Font */}
          {renderCustomControl(
            'Global Base HTML Font (समस्त वेबसाइट बेस साइज़)',
            typo.baseFontSizePx || 16,
            (val) => onUpdateTypography({ baseFontSizePx: val }),
            12,
            22,
            1,
            [14, 15, 16, 17, 18],
            'px',
            'वेबसाइट का मुख्य आधारभूत फ़ॉन्ट साइज़'
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Scale Preset</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'compact', label: 'Compact' },
                { id: 'normal', label: 'Standard' },
                { id: 'large', label: 'Large' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateTypography({ mobileScale: item.id as any })}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition cursor-pointer ${
                    (typo.mobileScale || 'normal') === item.id
                      ? 'bg-red-600 border-red-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. REAL-TIME LIVE TYPOGRAPHY PREVIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Real-Time Typography Preview (लाइव पूर्वावलोकन)
          </span>
          <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Applied Live in Portal</span>
          </span>
        </div>

        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          {/* Header Preview */}
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between flex-wrap gap-2">
            <span
              className="font-black text-red-700"
              style={{
                fontFamily: typo.headerFont,
                fontSize: `${settings.headerFooter?.headerTitleCustomPx || typo.headerTitleCustomPx || 36}px`,
              }}
            >
              खबरी दोस्त • KHABRI DOST
            </span>
            <span className="text-xs text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
              Header Text: {settings.headerFooter?.headerTitleCustomPx || typo.headerTitleCustomPx || 36}px
            </span>
          </div>

          {/* Section Block Sample */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h4
              className="font-bold text-slate-900"
              style={{
                fontFamily: typo.headlineFont,
                fontSize: `${typo.sectionHeadingPx || 20}px`,
              }}
            >
              ताज़ा ख़बरें (Section Heading: {typo.sectionHeadingPx || 20}px)
            </h4>
            <span className="text-xs text-red-600 font-bold">सभी देखें →</span>
          </div>

          {/* Hero Headline Title */}
          <h3
            className="text-slate-900 leading-snug"
            style={{
              fontFamily: typo.headlineFont,
              fontWeight: typo.headlineWeight || 700,
              fontSize: `${typo.heroTitlePx || 26}px`,
            }}
          >
            संसद बजट सत्र: भारतीय अर्थव्यवस्था, रक्षा एवं डिजिटल इनोवेशन पर ऐतिहासिक फैसले (Hero Title: {typo.heroTitlePx || 26}px)
          </h3>

          {/* Meta Description / Tag */}
          <div
            className="flex items-center gap-2 text-slate-500"
            style={{
              fontFamily: typo.metaFont,
              fontSize: `${typo.cardMetaFontSizePx || 11}px`,
            }}
          >
            <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">राष्ट्रीय</span>
            <span>• 10 मिनट पहले</span>
            <span>• नई दिल्ली ब्यूरो</span>
            <span>• 14.5K व्यूज़</span>
          </div>

          {/* Article Lead Subtitle */}
          <div
            className="border-l-4 border-red-600 pl-3 italic text-slate-700 font-semibold"
            style={{
              fontFamily: typo.bodyFont,
              fontSize: `${typo.articleLeadSubtitlePx || 18}px`,
            }}
          >
            यह आर्टिकल का मुख्य लीड सबटाइटल है (Lead Subtitle: {typo.articleLeadSubtitlePx || 18}px)
          </div>

          {/* Article Paragraph Content */}
          <p
            className="text-slate-700"
            style={{
              fontFamily: typo.bodyFont,
              fontWeight: typo.bodyWeight || 400,
              fontSize: `${typo.articleBodyFontSizePx || 17}px`,
              lineHeight: typo.articleBodyLineHeight || 1.75,
            }}
          >
            खबरी दोस्त डिजिटल न्यूज़ पोर्टल पर देश एवं दुनिया की सभी महत्वपूर्ण खबरें निष्पक्षता, सत्यता और संपूर्ण विश्लेषण के साथ। आपके द्वारा चुना गया फ़ॉन्ट और पिक्सल साइज़ अब पूरे पोर्टल में सक्रिय है। (Paragraph Text: {typo.articleBodyFontSizePx || 17}px, Line Height: {typo.articleBodyLineHeight || 1.75}x)
          </p>

          {/* Footer Sample */}
          <div
            className="pt-2 border-t border-slate-200 text-slate-500"
            style={{
              fontFamily: typo.footerFont || typo.bodyFont,
              fontSize: `${typo.footerTextPx || 13}px`,
            }}
          >
            © 2026 Khabri Dost Media Network. सर्वाधिकार सुरक्षित। (Footer Text: {typo.footerTextPx || 13}px)
          </div>
        </div>
      </div>
    </div>
  );
};
