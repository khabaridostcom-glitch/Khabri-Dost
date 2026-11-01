import React, { useState } from 'react';
import {
  Type,
  Check,
  Sparkles,
  Sliders,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Smartphone,
  Monitor,
  Layers,
  Heading,
  FileText,
  Bookmark,
  Compass,
  Layout,
  User,
  Camera,
  Shield,
  Edit3,
  AlignLeft,
} from 'lucide-react';
import { PortalSettings, TypographySettings, TypographySectionOverride } from '../../types/news';
import { DEFAULT_PORTAL_SETTINGS, FONT_OPTIONS, TYPOGRAPHY_PRESETS } from '../../data/portalDefaults';
import { resetRootCssVariablesToDefault } from '../../utils/cssDefaults';

export interface TypographySettingsTabProps {
  settings: PortalSettings;
  onUpdateTypography: (updated: Partial<TypographySettings>) => void;
  onUpdateSettings: (settings: PortalSettings) => void;
  onOpenAdminReset?: () => void;
}

interface SectionDefinition {
  id: 'global' | keyof NonNullable<TypographySettings['sections']>;
  name: string;
  description: string;
  icon: React.ElementType;
  defaultDesktopPx: number;
  defaultMobilePx: number;
  defaultWeight: number;
}

const SECTIONS_METADATA: SectionDefinition[] = [
  {
    id: 'global',
    name: '1. Global Typography',
    description: 'Universal default font family, weight, and base sizing applied across the entire portal.',
    icon: Type,
    defaultDesktopPx: 16,
    defaultMobilePx: 15,
    defaultWeight: 400,
  },
  {
    id: 'header',
    name: '2. Header & Top Bar',
    description: 'Portal logo title, tagline, date & weather bar, breaking news ticker.',
    icon: Layout,
    defaultDesktopPx: 26,
    defaultMobilePx: 20,
    defaultWeight: 700,
  },
  {
    id: 'navigation',
    name: '3. Navigation & Menus',
    description: 'Category navigation links, dropdown menus, mobile drawer items.',
    icon: Compass,
    defaultDesktopPx: 14,
    defaultMobilePx: 14,
    defaultWeight: 600,
  },
  {
    id: 'homepage',
    name: '4. Homepage Layout',
    description: 'General grid content, section separators, layout text containers.',
    icon: Layout,
    defaultDesktopPx: 16,
    defaultMobilePx: 15,
    defaultWeight: 400,
  },
  {
    id: 'homepageHeadings',
    name: '5. Homepage Headings',
    description: 'Major section titles (National, State, Business, Entertainment).',
    icon: Heading,
    defaultDesktopPx: 22,
    defaultMobilePx: 18,
    defaultWeight: 800,
  },
  {
    id: 'newsCards',
    name: '6. News Cards',
    description: 'Story headlines in grid cards, excerpt previews, bylines, and timestamps.',
    icon: Bookmark,
    defaultDesktopPx: 17,
    defaultMobilePx: 15,
    defaultWeight: 700,
  },
  {
    id: 'categoryPages',
    name: '7. Category & Archive Pages',
    description: 'Category hero headline, breadcrumbs, filter buttons, and story lists.',
    icon: Layers,
    defaultDesktopPx: 28,
    defaultMobilePx: 22,
    defaultWeight: 800,
  },
  {
    id: 'singleArticle',
    name: '8. Single Article Container',
    description: 'Main article reading viewport container and background text sizing.',
    icon: FileText,
    defaultDesktopPx: 18,
    defaultMobilePx: 16,
    defaultWeight: 400,
  },
  {
    id: 'articleHeadline',
    name: '9. Article Headline (H1)',
    description: 'Main article title at top of the article view (Fixes previous font reset bug).',
    icon: Heading,
    defaultDesktopPx: 38,
    defaultMobilePx: 26,
    defaultWeight: 800,
  },
  {
    id: 'articleBody',
    name: '10. Article Body & Content',
    description: 'Reading body paragraphs in news stories (Optimized line height & letter spacing).',
    icon: AlignLeft,
    defaultDesktopPx: 18,
    defaultMobilePx: 16,
    defaultWeight: 400,
  },
  {
    id: 'articleSubheadings',
    name: '11. Article Subheadings (H2, H3, H4)',
    description: 'In-article sectional sub-headings created in the WordPress editor.',
    icon: Heading,
    defaultDesktopPx: 24,
    defaultMobilePx: 20,
    defaultWeight: 700,
  },
  {
    id: 'articleDescription',
    name: '12. Article Description / Standfirst',
    description: 'Lead intro paragraph and editorial summary below the headline.',
    icon: FileText,
    defaultDesktopPx: 20,
    defaultMobilePx: 16,
    defaultWeight: 600,
  },
  {
    id: 'authorProfiles',
    name: '13. Author Profiles & Bylines',
    description: 'Author names, editor credentials, reporter bylines, and bio boxes.',
    icon: User,
    defaultDesktopPx: 14,
    defaultMobilePx: 13,
    defaultWeight: 600,
  },
  {
    id: 'imageCaptions',
    name: '14. Image Captions & Credits',
    description: 'Photo captions, agency credit tags (ANI, PTI), and illustration metadata.',
    icon: Camera,
    defaultDesktopPx: 12,
    defaultMobilePx: 11,
    defaultWeight: 400,
  },
  {
    id: 'sidebar',
    name: '15. Sidebar & Trending Stories',
    description: 'Related stories sidebar list, trending articles, newsletter subscription box.',
    icon: Layers,
    defaultDesktopPx: 14,
    defaultMobilePx: 13,
    defaultWeight: 600,
  },
  {
    id: 'widgetHeadings',
    name: '16. Widget Headings',
    description: 'Sidebar widget block titles (Opinion Poll, Trending Now, Top Stories).',
    icon: Heading,
    defaultDesktopPx: 16,
    defaultMobilePx: 15,
    defaultWeight: 700,
  },
  {
    id: 'footer',
    name: '17. Footer & Copyright',
    description: 'Footer column headers, policy links, company information, copyright statement.',
    icon: Layout,
    defaultDesktopPx: 13,
    defaultMobilePx: 12,
    defaultWeight: 400,
  },
  {
    id: 'legalPages',
    name: '18. Legal & Policy Pages',
    description: 'Privacy Policy, Terms of Service, Grievance Officer, About Us content.',
    icon: Shield,
    defaultDesktopPx: 16,
    defaultMobilePx: 15,
    defaultWeight: 400,
  },
  {
    id: 'adminEditor',
    name: '19. Admin Visual Editor Canvas',
    description: 'Font family and styling rendered inside the WordPress Visual WYSIWYG editor.',
    icon: Edit3,
    defaultDesktopPx: 16,
    defaultMobilePx: 15,
    defaultWeight: 400,
  },
];

const WEIGHT_OPTIONS = [
  { value: 100, label: '100 Thin' },
  { value: 200, label: '200 ExtraLight' },
  { value: 300, label: '300 Light' },
  { value: 400, label: '400 Regular' },
  { value: 500, label: '500 Medium' },
  { value: 600, label: '600 SemiBold' },
  { value: 700, label: '700 Bold' },
  { value: 800, label: '800 ExtraBold' },
  { value: 900, label: '900 Black' },
];

export const TypographySettingsTab: React.FC<TypographySettingsTabProps> = ({
  settings,
  onUpdateTypography,
  onUpdateSettings,
  onOpenAdminReset,
}) => {
  const typo = settings.typography || DEFAULT_PORTAL_SETTINGS.typography;
  const sections = typo.sections || DEFAULT_PORTAL_SETTINGS.typography.sections || {};

  const [expandedSection, setExpandedSection] = useState<string>('global');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply typography preset
  const applyPreset = (presetName: string, presetData: Partial<TypographySettings>) => {
    onUpdateTypography(presetData);
    setToastMessage(`Typography preset applied: ${presetName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset typography to original defaults
  const handleResetTypography = () => {
    onUpdateTypography(DEFAULT_PORTAL_SETTINGS.typography);
    resetRootCssVariablesToDefault();
    try {
      localStorage.removeItem('kd_reader_font_size');
      localStorage.removeItem('kd_reader_font_family');
    } catch {}
    setShowResetConfirm(false);
    setToastMessage('Typography settings successfully reset to editorial defaults.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update a specific section override
  const handleUpdateSection = (
    sectionKey: 'global' | keyof NonNullable<TypographySettings['sections']>,
    updates: Partial<TypographySectionOverride>
  ) => {
    if (sectionKey === 'global') return;
    const existing = sections[sectionKey] || {
      enabled: false,
      fontFamily: typo.defaultFontFamily || "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
      fontWeight: 400,
    };

    const updatedSection: TypographySectionOverride = {
      ...existing,
      ...updates,
    };

    const updatedSections = {
      ...sections,
      [sectionKey]: updatedSection,
    };

    onUpdateTypography({
      sections: updatedSections,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-lg border border-emerald-700 animate-fadeIn">
          <div className="flex items-center space-x-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER BANNER */}
      <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs shrink-0">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Typography & Font Management
                </h2>
                <span className="bg-red-50 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-200">
                  NOTO SANS READY
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                  18 SECTIONS
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Centralized global font system for Khabri Dost. Set universal defaults or customize any of the 18 sections independently.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              title="Reset typography to original system defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Fonts</span>
            </button>
            {onOpenAdminReset && (
              <button
                type="button"
                onClick={onOpenAdminReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                title="Reset all admin settings"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* 1-CLICK TYPOGRAPHY PRESETS */}
        <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1-Click Curated Presets:</span>
            </span>
            <span className="text-[10px] text-amber-800 font-mono font-semibold">6 Curated Styles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {TYPOGRAPHY_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.name, p.settings)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-white text-left border border-slate-200 hover:border-red-400 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition truncate">
                    {p.name}
                  </span>
                  <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 font-bold px-1.5 py-0.5 rounded shrink-0">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-medium truncate">{p.hindiName}</div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL: RESET TYPOGRAPHY */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Reset Typography Settings?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Are you sure you want to revert all global font families, section overrides, and pixel dimensions to default Noto Sans / Rozha One settings?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetTypography}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE BILINGUAL TYPOGRAPHY PREVIEW BOX */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Real-Time Typography Preview
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Font: {typo.defaultFontFamily ? typo.defaultFontFamily.split(',')[0].replace(/['"]/g, '') : 'Noto Sans Devanagari'} • Weight: {typo.defaultFontWeight || 400}
          </span>
        </div>
        <div
          className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 transition-all"
          style={{
            fontFamily: typo.defaultFontFamily || "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
            lineHeight: typo.globalLineHeight || 1.6,
            letterSpacing: typo.globalLetterSpacing ? `${typo.globalLetterSpacing}px` : 'normal',
          }}
        >
          <h3
            className="text-xl sm:text-2xl text-slate-900 tracking-tight"
            style={{
              fontWeight: typo.headlineWeight || typo.defaultFontWeight || 700,
              fontFamily: typo.headlineFont || typo.defaultFontFamily,
            }}
          >
            खबरी दोस्त — निष्पक्ष, सटीक व निर्भीक पत्रकारिता
          </h3>
          <p
            className="text-sm text-slate-700 leading-relaxed"
            style={{
              fontWeight: typo.bodyWeight || typo.defaultFontWeight || 400,
              fontFamily: typo.bodyFont || typo.defaultFontFamily,
            }}
          >
            Breaking News & Editorial Coverage: देश, विदेश, राज्य, राजनीति, व्यापार और खेल जगत की हर बड़ी खबर पर सबसे सटीक व विश्वसनीय विश्लेषण।
          </p>
        </div>
      </div>

      {/* 18 SECTIONS ACCORDION / EDITORS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Portal Typography Sections ({SECTIONS_METADATA.length} Total)
          </h3>
          <span className="text-xs text-slate-400">
            Click any section to customize font family, weight, and responsive sizes
          </span>
        </div>

        {SECTIONS_METADATA.map((sec) => {
          const isExpanded = expandedSection === sec.id;
          const isGlobal = sec.id === 'global';
          const secConfig: TypographySectionOverride = (sections as any)[sec.id] || {
            enabled: false,
            fontFamily: typo.defaultFontFamily,
            fontWeight: sec.defaultWeight,
            desktopFontSizePx: sec.defaultDesktopPx,
            mobileFontSizePx: sec.defaultMobilePx,
          };

          const isOverridden = !isGlobal && secConfig.enabled;
          const SectionIcon = sec.icon;

          return (
            <div
              key={sec.id}
              className={`rounded-2xl border transition shadow-2xs overflow-hidden ${
                isExpanded ? 'bg-white border-red-200 ring-2 ring-red-500/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* SECTION HEADER ROW */}
              <div
                onClick={() => setExpandedSection(isExpanded ? '' : sec.id)}
                className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                      isExpanded
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <SectionIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {sec.name}
                      </span>
                      {isGlobal ? (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          PRIMARY DEFAULT
                        </span>
                      ) : isOverridden ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-amber-700" />
                          <span>CUSTOM OVERRIDE</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          INHERITS GLOBAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* EXPANDED SECTION EDITING CONTROLS */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-5 bg-white animate-fadeIn">
                  {/* OVERRIDE TOGGLE (FOR NON-GLOBAL SECTIONS) */}
                  {!isGlobal && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Enable Section Custom Override
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {isOverridden
                            ? 'This section uses its own independent font family, weights, and pixel sizing.'
                            : 'This section automatically inherits the universal settings from Section 1 (Global Typography).'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={isOverridden}
                          onChange={(e) =>
                            handleUpdateSection(sec.id, { enabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  )}

                  {/* CONTROLS (IF GLOBAL OR IF OVERRIDDEN) */}
                  {(isGlobal || isOverridden) && (
                    <div className="space-y-4">
                      {/* FONT FAMILY SELECTOR */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Font Family Selection
                        </label>
                        <select
                          value={
                            isGlobal
                              ? typo.defaultFontFamily || "'Noto Sans Devanagari', 'Noto Sans', sans-serif"
                              : secConfig.fontFamily || typo.defaultFontFamily
                          }
                          onChange={(e) => {
                            if (isGlobal) {
                              onUpdateTypography({ defaultFontFamily: e.target.value });
                            } else {
                              handleUpdateSection(sec.id, { fontFamily: e.target.value });
                            }
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* FONT WEIGHT SELECTOR (100 THIN TO 900 BLACK) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">
                            Font Weight Range (100 Thin to 900 Black)
                          </label>
                          <span className="text-xs font-mono font-bold text-red-700">
                            Current: {isGlobal ? typo.defaultFontWeight || 400 : secConfig.fontWeight || 400}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                          {WEIGHT_OPTIONS.map((w) => {
                            const currentW = isGlobal
                              ? typo.defaultFontWeight || 400
                              : secConfig.fontWeight || 400;
                            const isSelected = currentW === w.value;
                            return (
                              <button
                                key={w.value}
                                type="button"
                                onClick={() => {
                                  if (isGlobal) {
                                    onUpdateTypography({ defaultFontWeight: w.value });
                                  } else {
                                    handleUpdateSection(sec.id, { fontWeight: w.value });
                                  }
                                }}
                                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer border ${
                                  isSelected
                                    ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {w.label.replace(' ', '\n')}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* RESPONSIVE FONT SIZING: DESKTOP & MOBILE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Desktop Font Size */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5 text-slate-500" />
                              <span>Desktop Font Size</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                min={10}
                                max={80}
                                value={
                                  isGlobal
                                    ? typo.globalDesktopFontSize || 16
                                    : secConfig.desktopFontSizePx || sec.defaultDesktopPx
                                }
                                onChange={(e) => {
                                  const num = Number(e.target.value);
                                  if (!isNaN(num) && num > 0) {
                                    if (isGlobal) {
                                      onUpdateTypography({ globalDesktopFontSize: num });
                                    } else {
                                      handleUpdateSection(sec.id, { desktopFontSizePx: num });
                                    }
                                  }
                                }}
                                className="w-16 px-2 py-1 text-xs text-right font-mono font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                              />
                              <span className="text-xs text-slate-500 font-bold">px</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={60}
                            value={
                              isGlobal
                                ? typo.globalDesktopFontSize || 16
                                : secConfig.desktopFontSizePx || sec.defaultDesktopPx
                            }
                            onChange={(e) => {
                              const num = Number(e.target.value);
                              if (isGlobal) {
                                onUpdateTypography({ globalDesktopFontSize: num });
                              } else {
                                handleUpdateSection(sec.id, { desktopFontSizePx: num });
                              }
                            }}
                            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                        </div>

                        {/* Mobile Font Size */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                              <span>Mobile Font Size</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                min={10}
                                max={50}
                                value={
                                  isGlobal
                                    ? typo.globalMobileFontSize || 15
                                    : secConfig.mobileFontSizePx || sec.defaultMobilePx
                                }
                                onChange={(e) => {
                                  const num = Number(e.target.value);
                                  if (!isNaN(num) && num > 0) {
                                    if (isGlobal) {
                                      onUpdateTypography({ globalMobileFontSize: num });
                                    } else {
                                      handleUpdateSection(sec.id, { mobileFontSizePx: num });
                                    }
                                  }
                                }}
                                className="w-16 px-2 py-1 text-xs text-right font-mono font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                              />
                              <span className="text-xs text-slate-500 font-bold">px</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={44}
                            value={
                              isGlobal
                                ? typo.globalMobileFontSize || 15
                                : secConfig.mobileFontSizePx || sec.defaultMobilePx
                            }
                            onChange={(e) => {
                              const num = Number(e.target.value);
                              if (isGlobal) {
                                onUpdateTypography({ globalMobileFontSize: num });
                              } else {
                                handleUpdateSection(sec.id, { mobileFontSizePx: num });
                              }
                            }}
                            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* LINE HEIGHT & LETTER SPACING */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>Line Height</span>
                            <span className="font-mono text-red-700">
                              {isGlobal ? typo.globalLineHeight || 1.6 : secConfig.lineHeight || 1.6}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1.0}
                            max={2.4}
                            step={0.05}
                            value={isGlobal ? typo.globalLineHeight || 1.6 : secConfig.lineHeight || 1.6}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isGlobal) {
                                onUpdateTypography({ globalLineHeight: val });
                              } else {
                                handleUpdateSection(sec.id, { lineHeight: val });
                              }
                            }}
                            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>Letter Spacing</span>
                            <span className="font-mono text-red-700">
                              {isGlobal ? typo.globalLetterSpacing || 0 : secConfig.letterSpacingPx || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min={-1}
                            max={3}
                            step={0.25}
                            value={isGlobal ? typo.globalLetterSpacing || 0 : secConfig.letterSpacingPx || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isGlobal) {
                                onUpdateTypography({ globalLetterSpacing: val });
                              } else {
                                handleUpdateSection(sec.id, { letterSpacingPx: val });
                              }
                            }}
                            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
