import React, { useState } from 'react';
import {
  Type,
  X,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Sparkles,
  BookOpen,
  Smartphone,
  Newspaper,
  ZoomIn,
  ZoomOut,
  ChevronRight,
} from 'lucide-react';
import { TypographySettings } from '../types/news';
import { DEFAULT_PORTAL_SETTINGS } from '../data/portalDefaults';
import { resetRootCssVariablesToDefault } from '../utils/cssDefaults';

interface TypographyCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  typography: TypographySettings;
  onUpdateTypography: (updated: Partial<TypographySettings>) => void;
  onResetTypography?: () => void;
}

const FONT_FAMILIES = [
  {
    id: "'Rozha One', 'Noto Serif Devanagari', serif",
    name: 'Rozha One',
    labelHindi: 'रोज़ा वन (पारंपरिक संपादकीय अख़बार)',
    category: 'Serif / Editorial',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Noto Sans Devanagari', sans-serif",
    name: 'Noto Sans Devanagari',
    labelHindi: 'नोटो सैन्स (आधुनिक, स्पष्ट व पठनीय)',
    category: 'Sans-Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Mukta', 'Noto Sans Devanagari', sans-serif",
    name: 'Mukta',
    labelHindi: 'मुक्ता (क्लीन व आधुनिक डिजिटल फ़ॉन्ट)',
    category: 'Sans-Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Hind', 'Noto Sans Devanagari', sans-serif",
    name: 'Hind',
    labelHindi: 'हिन्द (आधिकारिक व संतुलित ब्रॉडकास्ट शैली)',
    category: 'Sans-Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Poppins', sans-serif",
    name: 'Poppins',
    labelHindi: 'पॉपिन्स (जियोमेट्रिक आधुनिक डिज़ाइन)',
    category: 'Sans-Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Tiro Devanagari Hindi', serif",
    name: 'Tiro Devanagari Hindi',
    labelHindi: 'तीरो देवनागरी (क्लासिक साहित्यिक सेरिफ़)',
    category: 'Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Noto Serif Devanagari', serif",
    name: 'Noto Serif Devanagari',
    labelHindi: 'नोटो सेरिफ़ (गंभीर समाचार व विचार)',
    category: 'Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Kalam', cursive",
    name: 'Kalam',
    labelHindi: 'कलम (हस्तलिखित व विशेष फ़ीचर)',
    category: 'Handwritten',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
  {
    id: "'Inter', sans-serif",
    name: 'Inter',
    labelHindi: 'इंटर (अंतरराष्ट्रीय यूआई स्टैंडर्ड)',
    category: 'Sans-Serif',
    preview: 'खबरी दोस्त निष्पक्ष पत्रकारिता',
  },
];

const PRESETS = [
  {
    id: 'default',
    title: 'डिफ़ॉल्ट मानक',
    desc: 'संतुलित समाचार पोर्टल लेआउट (TV9 / News18 मानक)',
    icon: Newspaper,
    settings: {
      headlineFont: "'Rozha One', 'Noto Serif Devanagari', serif",
      bodyFont: "'Mukta', 'Noto Sans Devanagari', sans-serif",
      headlineWeight: 700,
      bodyWeight: 400,
      baseSize: 'normal' as const,
      headingSize: 'normal' as const,
      titleSize: 'normal' as const,
      contentSize: 'normal' as const,
      archiveSize: 'normal' as const,
      metaSize: 'normal' as const,
    },
  },
  {
    id: 'high_readability',
    title: 'आसान पठनीयता (बड़ा आकार)',
    desc: 'वरिष्ठ पाठकों व आसान अध्ययन हेतु बड़ी स्पष्ट लिखावट',
    icon: BookOpen,
    settings: {
      headlineFont: "'Noto Sans Devanagari', sans-serif",
      bodyFont: "'Noto Sans Devanagari', sans-serif",
      headlineWeight: 700,
      bodyWeight: 500,
      baseSize: 'large' as const,
      headingSize: 'large' as const,
      titleSize: 'large' as const,
      contentSize: 'large' as const,
      archiveSize: 'large' as const,
      metaSize: 'normal' as const,
    },
  },
  {
    id: 'broadsheet',
    title: 'क्लासिक अख़बार ब्रॉडशीट',
    desc: 'पारंपरिक मुद्रित दैनिक समाचार पत्र जैसी सेरिफ़ टाइपोग्राफी',
    icon: Sparkles,
    settings: {
      headlineFont: "'Rozha One', 'Noto Serif Devanagari', serif",
      bodyFont: "'Tiro Devanagari Hindi', serif",
      headlineWeight: 700,
      bodyWeight: 400,
      baseSize: 'normal' as const,
      headingSize: 'xlarge' as const,
      titleSize: 'normal' as const,
      contentSize: 'normal' as const,
      archiveSize: 'normal' as const,
      metaSize: 'normal' as const,
    },
  },
  {
    id: 'compact',
    title: 'कॉम्पैक्ट हाई-डेंसिटी',
    desc: 'स्क्रीन पर अधिक समाचार एक साथ देखने के लिए सुगठित आकार',
    icon: Smartphone,
    settings: {
      headlineFont: "'Mukta', 'Noto Sans Devanagari', sans-serif",
      bodyFont: "'Mukta', 'Noto Sans Devanagari', sans-serif",
      headlineWeight: 700,
      bodyWeight: 400,
      baseSize: 'small' as const,
      headingSize: 'sm' as const,
      titleSize: 'sm' as const,
      contentSize: 'sm' as const,
      archiveSize: 'sm' as const,
      metaSize: 'sm' as const,
    },
  },
];

export const TypographyCustomizerModal: React.FC<TypographyCustomizerModalProps> = ({
  isOpen,
  onClose,
  typography,
  onUpdateTypography,
  onResetTypography,
}) => {
  const [activeTab, setActiveTab] = useState<'fonts' | 'sizes' | 'presets'>('sizes');

  if (!isOpen) return null;

  const current = {
    ...DEFAULT_PORTAL_SETTINGS.typography,
    ...(typography || {}),
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    onUpdateTypography(preset.settings);
  };

  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const handleResetTypography = () => {
    // 1. Reset CSS variables in :root to their default values defined in index.css
    resetRootCssVariablesToDefault();

    // 2. Reset typography customizations in React state / portal defaults
    if (onResetTypography) {
      onResetTypography();
    } else {
      onUpdateTypography(DEFAULT_PORTAL_SETTINGS.typography);
    }

    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-kd-headline text-white flex items-center gap-2">
                <span>फ़ॉन्ट व लिखावट अनुकूलन</span>
                <span className="text-[10px] font-sans font-normal bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Typography Studio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                होमपेज, न्यूज़ कार्ड, लेख व समग्र वेबसाइट के फ़ॉन्ट और आकार को कस्टमाइज़ करें
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetTypography}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white px-3 py-1.5 rounded-lg border border-amber-500/40 flex items-center space-x-1.5 transition cursor-pointer font-bold shadow-xs"
              title="Reset typography CSS variables in :root to index.css defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Typography</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('sizes')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'sizes'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>फ़ॉन्ट आकार (Size Controls)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fonts')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'fonts'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>फ़ॉन्ट शैली (Font Family)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'presets'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>त्वरित प्रीसेट्स (Presets)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: SIZES */}
          {activeTab === 'sizes' && (
            <div className="space-y-5 animate-fadeIn">
              {/* 1. Overall Website Base Size */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ZoomIn className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-slate-900 font-kd-headline">
                      समग्र वेबसाइट बेस फ़ॉन्ट आकार (Overall Website Base Scale)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-600 uppercase bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    {current.baseSize || 'normal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  होमपेज, नेविगेशन, कार्ड्स व पूरे पोर्टल का सामान्य टेक्स्ट आकार बदलें
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'small', label: 'छोटा (92%)' },
                    { id: 'normal', label: 'सामान्य (100%)' },
                    { id: 'large', label: 'बड़ा (112%)' },
                    { id: 'xlarge', label: 'अति बड़ा (125%)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onUpdateTypography({ baseSize: item.id as any })}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                        (current.baseSize || 'normal') === item.id
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Specific Element Scales */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                  विशिष्ट तत्वों का आकार नियंत्रण (Element-wise Granular Scaling)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Headline & Spotlight Size */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        📰 मुख्य हेडलाइन व शीर्ष समाचार
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {current.headingSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateTypography({ headingSize: sz })}
                          className={`py-1 text-xs font-bold rounded border transition cursor-pointer text-center ${
                            (current.headingSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'A-' : sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* News Cards Titles (Equal Balanced Titles) */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        📑 न्यूज़ कार्ड टाइटल्स (Card Titles)
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {current.titleSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateTypography({ titleSize: sz })}
                          className={`py-1 text-xs font-bold rounded border transition cursor-pointer text-center ${
                            (current.titleSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'A-' : sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Single Article Content / Reading Text */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        📖 लेख बॉडी व समाचार विवरण (Article Body)
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {current.contentSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateTypography({ contentSize: sz })}
                          className={`py-1 text-xs font-bold rounded border transition cursor-pointer text-center ${
                            (current.contentSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'A-' : sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category & Archive Cards Size */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        🗂️ कैटेगरी व आर्काइव लिस्ट (Archive Cards)
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {current.archiveSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {(['sm', 'normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateTypography({ archiveSize: sz })}
                          className={`py-1 text-xs font-bold rounded border transition cursor-pointer text-center ${
                            (current.archiveSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'A-' : sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meta / Date / Author Scale */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        🏷️ दिनांक, लेखक व व्यूज (Meta & Byline Info)
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {current.metaSize || 'normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {(['sm', 'normal', 'large'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateTypography({ metaSize: sz })}
                          className={`py-1.5 text-xs font-bold rounded border transition cursor-pointer text-center ${
                            (current.metaSize || 'normal') === sz
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा (Small)' : sz === 'normal' ? 'सामान्य (Normal)' : 'बड़ा (Large)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article Title Customization (Desktop & Mobile) */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        📰 न्यूज़ आर्टिकल टाइटल साइज़ (H1 Headline)
                      </span>
                      <span className="text-[11px] font-mono font-bold text-red-600">
                        {current.articleTitleDesktopPx || 32}px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={22}
                        max={54}
                        value={current.articleTitleDesktopPx || 32}
                        onChange={(e) => onUpdateTypography({ articleTitleDesktopPx: Number(e.target.value) })}
                        className="w-full accent-red-600 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>छोटा (24px)</span>
                      <span>नेचुरल (32px)</span>
                      <span>विशाल (54px)</span>
                    </div>
                  </div>

                  {/* Related Stories Heading Size */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        📑 संबंधित ख़बरें हेडिंग साइज़
                      </span>
                      <span className="text-[11px] font-mono font-bold text-red-600">
                        {current.relatedHeadingCustomPx || 18}px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={14}
                        max={28}
                        value={current.relatedHeadingCustomPx || 18}
                        onChange={(e) => onUpdateTypography({ relatedHeadingCustomPx: Number(e.target.value) })}
                        className="w-full accent-red-600 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>कॉम्पैक्ट (14px)</span>
                      <span>सामान्य (18px)</span>
                      <span>बड़ा (28px)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl border-2 border-red-100 bg-red-50/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-red-700">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>रीयल-टाइम प्रिव्यू (Live Typography Preview):</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">परिवर्तन तुरंत लागू होते हैं</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="font-kd-meta text-[11px] text-slate-500 flex items-center justify-between">
                    <span>देश • 10 मिनट पहले</span>
                    <span>1.2K पाठक</span>
                  </div>
                  <h3 className="font-kd-title font-bold text-slate-900 leading-snug">
                    भारतीय अंतरिक्ष अनुसंधान संगठन ने रचा नया कीर्तिमान, गगनयान मिशन का सफल परीक्षण
                  </h3>
                  <p className="font-kd-body text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    श्रीहरिकोटा स्थित सतीश धवन अंतरिक्ष केंद्र से भारतीय वैज्ञानिकों ने अत्याधुनिक क्रू एस्केप सिस्टम का सफल परीक्षण किया।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FONT FAMILIES */}
          {activeTab === 'fonts' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Headline Font Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>मुख्य शीर्षक व हेडलाइन्स फ़ॉन्ट (Headline Font Family)</span>
                  </h4>
                  <span className="text-xs font-medium text-slate-500">
                    {FONT_FAMILIES.find((f) => f.id === current.headlineFont)?.name || 'Rozha One'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FONT_FAMILIES.map((font) => {
                    const isSelected = current.headlineFont === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => onUpdateTypography({ headlineFont: font.id })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{font.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-red-600 font-bold" />}
                        </div>
                        <span className="text-[11px] text-slate-500 mb-1.5">{font.labelHindi}</span>
                        <div
                          style={{ fontFamily: font.id, fontWeight: current.headlineWeight || 700 }}
                          className="text-sm text-slate-900 border-t border-slate-100 pt-1.5"
                        >
                          {font.preview}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Font Selection */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>लेख व समाचार विवरण फ़ॉन्ट (Body & Reading Font)</span>
                  </h4>
                  <span className="text-xs font-medium text-slate-500">
                    {FONT_FAMILIES.find((f) => f.id === current.bodyFont)?.name || 'Mukta'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FONT_FAMILIES.slice(1, 7).map((font) => {
                    const isSelected = current.bodyFont === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => onUpdateTypography({ bodyFont: font.id })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{font.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                        </div>
                        <span className="text-[11px] text-slate-500 mb-1.5">{font.labelHindi}</span>
                        <div
                          style={{ fontFamily: font.id, fontWeight: current.bodyWeight || 400 }}
                          className="text-xs text-slate-800 border-t border-slate-100 pt-1.5 leading-relaxed"
                        >
                          {font.preview} • स्वच्छ एवं सुगम पठन
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Weight Toggles */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    फ़ॉन्ट की मोटाई (Font Weight / Boldness):
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-600 font-medium">हेडलाइन बोल्डनेस:</span>
                    <div className="flex gap-1.5">
                      {[600, 700, 800].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() => onUpdateTypography({ headlineWeight: wt })}
                          className={`flex-1 py-1 text-xs font-bold rounded border cursor-pointer ${
                            (current.headlineWeight || 700) === wt
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-600 font-medium">बॉडी टेक्स्ट मोटाई:</span>
                    <div className="flex gap-1.5">
                      {[400, 500, 600].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() => onUpdateTypography({ bodyWeight: wt })}
                          className={`flex-1 py-1 text-xs font-bold rounded border cursor-pointer ${
                            (current.bodyWeight || 400) === wt
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs text-slate-500">
                एक क्लिक में पूरे पोर्टल की लिखावट को सुसंगत संपादकीय शैली में बदलें:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <div
                      key={preset.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-md bg-white transition space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-kd-headline">
                          {preset.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{preset.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="w-full py-2 bg-slate-900 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>यह प्रीसेट लागू करें</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetTypography}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Reset typography CSS variables in :root to index.css defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Typography</span>
            </button>
            {resetSuccessToast && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>:root CSS variables reset to index.css defaults!</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              पूर्ण व लागू करें (Done)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
