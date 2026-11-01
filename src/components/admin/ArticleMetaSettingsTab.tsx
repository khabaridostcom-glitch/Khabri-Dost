import React, { useState } from 'react';
import {
  Eye,
  Bookmark,
  Share2,
  Clock,
  User,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Layout,
  Type,
  FileText,
  MapPin,
  Tag,
  Volume2,
  Printer,
  Copy,
  Scissors,
  Info,
  Grid,
  Smartphone,
  MessageSquare,
  Smile,
  Maximize2,
  Megaphone,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ArticleMetaSettings,
  ArticlePageConfig,
  ArticleSidebarWidgets,
  PortalSettings,
  MobileStickyBarConfig,
} from '../../types/news';
import {
  DEFAULT_ARTICLE_META_SETTINGS,
  DEFAULT_ARTICLE_PAGE_CONFIG,
  DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  DEFAULT_MOBILE_STICKY_BAR_CONFIG,
} from '../../data/portalDefaults';

interface ArticleMetaSettingsTabProps {
  settings?: ArticleMetaSettings;
  articlePageConfig?: ArticlePageConfig;
  sidebarWidgets?: ArticleSidebarWidgets;
  portalSettings?: PortalSettings;
  onChange: (updated: ArticleMetaSettings) => void;
  onUpdateArticlePageConfig?: (updated: ArticlePageConfig) => void;
  onUpdateSidebarWidgets?: (updated: ArticleSidebarWidgets) => void;
  onUpdateSettings?: (updated: PortalSettings) => void;
}

export const ArticleMetaSettingsTab: React.FC<ArticleMetaSettingsTabProps> = ({
  settings,
  articlePageConfig,
  sidebarWidgets,
  portalSettings,
  onChange,
  onUpdateArticlePageConfig,
  onUpdateSidebarWidgets,
  onUpdateSettings,
}) => {
  const [activeSection, setActiveSection] = useState<
    'layout' | 'identity' | 'action_bar' | 'disclaimer' | 'related' | 'mobile_bar'
  >('identity');

  const currentMeta: ArticleMetaSettings = {
    ...DEFAULT_ARTICLE_META_SETTINGS,
    ...(settings || {}),
    platforms: {
      ...DEFAULT_ARTICLE_META_SETTINGS.platforms,
      ...(settings?.platforms || {}),
    },
  };

  const currentConfig: ArticlePageConfig = {
    ...DEFAULT_ARTICLE_PAGE_CONFIG,
    ...(articlePageConfig || portalSettings?.articlePageConfig || {}),
  };

  const currentWidgets: ArticleSidebarWidgets = {
    ...DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
    ...(sidebarWidgets || portalSettings?.sidebarWidgets || {}),
  };

  const updateMeta = <K extends keyof ArticleMetaSettings>(
    key: K,
    value: ArticleMetaSettings[K]
  ) => {
    const updated = { ...currentMeta, [key]: value };
    onChange(updated);
  };

  const updatePlatform = (
    platform: keyof ArticleMetaSettings['platforms'],
    value: boolean
  ) => {
    const updated = {
      ...currentMeta,
      platforms: {
        ...currentMeta.platforms,
        [platform]: value,
      },
    };
    onChange(updated);
  };

  const updatePageConfig = <K extends keyof ArticlePageConfig>(
    key: K,
    value: ArticlePageConfig[K]
  ) => {
    const updated = { ...currentConfig, [key]: value };
    if (onUpdateArticlePageConfig) {
      onUpdateArticlePageConfig(updated);
    } else if (onUpdateSettings && portalSettings) {
      onUpdateSettings({
        ...portalSettings,
        articlePageConfig: updated,
      });
    }
  };

  const updateMobileStickyBar = <K extends keyof MobileStickyBarConfig>(
    key: K,
    value: MobileStickyBarConfig[K]
  ) => {
    const currentSticky: MobileStickyBarConfig = {
      ...DEFAULT_MOBILE_STICKY_BAR_CONFIG,
      ...(currentConfig.mobileStickyBar || portalSettings?.mobileStickyBar || {}),
      [key]: value,
    };
    const updated: ArticlePageConfig = {
      ...currentConfig,
      mobileStickyBar: currentSticky,
    };
    if (onUpdateArticlePageConfig) {
      onUpdateArticlePageConfig(updated);
    } else if (onUpdateSettings && portalSettings) {
      onUpdateSettings({
        ...portalSettings,
        articlePageConfig: updated,
        mobileStickyBar: currentSticky,
      });
    }
  };

  const updateMobileSharePlatform = (
    platform: keyof NonNullable<MobileStickyBarConfig['sharePlatforms']>,
    value: boolean
  ) => {
    const currentSticky: MobileStickyBarConfig = {
      ...DEFAULT_MOBILE_STICKY_BAR_CONFIG,
      ...(currentConfig.mobileStickyBar || portalSettings?.mobileStickyBar || {}),
    };
    const updatedSticky: MobileStickyBarConfig = {
      ...currentSticky,
      sharePlatforms: {
        ...(currentSticky.sharePlatforms || DEFAULT_MOBILE_STICKY_BAR_CONFIG.sharePlatforms),
        [platform]: value,
      },
    };
    const updated: ArticlePageConfig = {
      ...currentConfig,
      mobileStickyBar: updatedSticky,
    };
    if (onUpdateArticlePageConfig) {
      onUpdateArticlePageConfig(updated);
    } else if (onUpdateSettings && portalSettings) {
      onUpdateSettings({
        ...portalSettings,
        articlePageConfig: updated,
        mobileStickyBar: updatedSticky,
      });
    }
  };

  const updateWidgets = <K extends keyof ArticleSidebarWidgets>(
    key: K,
    value: ArticleSidebarWidgets[K]
  ) => {
    const updated = { ...currentWidgets, [key]: value };
    if (onUpdateSidebarWidgets) {
      onUpdateSidebarWidgets(updated);
    } else if (onUpdateSettings && portalSettings) {
      onUpdateSettings({
        ...portalSettings,
        sidebarWidgets: updated,
      });
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_ARTICLE_META_SETTINGS);
    if (onUpdateArticlePageConfig) {
      onUpdateArticlePageConfig(DEFAULT_ARTICLE_PAGE_CONFIG);
    }
    if (onUpdateSidebarWidgets) {
      onUpdateSidebarWidgets(DEFAULT_ARTICLE_SIDEBAR_WIDGETS);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Intro Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Single Article & Content View Studio
              </h3>
              <p className="text-xs text-slate-500">
                Full customization of single news pages: layout, typography, byline, disclaimer, and related cards.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* WordPress-Style Secondary Sub-Tabs for Article View */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSection('identity')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'identity'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Byline & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('action_bar')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'action_bar'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Action Bar & Audio TTS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('disclaimer')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'disclaimer'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Post Disclaimer Box</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('related')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'related'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Related News & Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('layout')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'layout'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Layout & Columns</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('mobile_bar')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeSection === 'mobile_bar'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
          <span>Mobile Sticky Bar & Ads</span>
        </button>
      </div>

      {/* SECTION 1: IDENTITY & METADATA VISIBILITY */}
      {activeSection === 'identity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Article Identity Elements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Tag className="w-4 h-4 text-red-600" />
                <span>Article Identity Badges</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Control the visibility of category and location tags above the headline.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Category Badge Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Category Badge (देश, कारोबार, खेल आदि)</span>
                  <span className="text-[10px] text-slate-500">हेडिंग के ऊपर लाल रंग का केटेगरी बैज दिखाएं या छिपाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showCategoryBadge !== false}
                  onChange={(e) => updatePageConfig('showCategoryBadge', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Location Badge Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Location Tag (नई दिल्ली, मेलबर्न आदि)</span>
                  <span className="text-[10px] text-slate-500">रिपोर्टिंग शहर या स्थान का नाम दिखाएं या छिपाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showLocationTag !== false && currentMeta.showLocationBadge !== false}
                  onChange={(e) => {
                    updatePageConfig('showLocationTag', e.target.checked);
                    updateMeta('showLocationBadge', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Views Counter Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Views Counter (5355 Reads)</span>
                    <span className="text-[10px] text-slate-500">हेडिंग के ऊपर कुल पाठक संख्या काउंटर दिखाएं या छिपाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showViewsCount !== false && currentConfig.showViewCount !== false}
                  onChange={(e) => {
                    updateMeta('showViewsCount', e.target.checked);
                    updatePageConfig('showViewCount', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Desktop Location & Time Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Desktop Location & Time</span>
                  <span className="text-[10px] text-slate-500">डेस्कटॉप स्क्रीन पर स्थान व सापेक्ष समय दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showDesktopLocationTime === true}
                  onChange={(e) => updateMeta('showDesktopLocationTime', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Key Highlights Toggle (मुख्य बिंदु / 5 खास बातें) */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Key Highlights Box (मुख्य बिंदु / 5 खास बातें)</span>
                  <span className="text-[10px] text-slate-500">लेख के मुख्य बिंदुओं का हाइलाइट बॉक्स दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showKeyHighlights !== false}
                  onChange={(e) => updatePageConfig('showKeyHighlights', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Image Caption & Credit Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Featured Image Caption (फोटो कैप्शन व क्रेडिट)</span>
                  <span className="text-[10px] text-slate-500">मुख्य समाचार फ़ोटो के नीचे कैप्शन व स्रोत प्रदर्शित करें</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showImageCaption !== false}
                  onChange={(e) => updatePageConfig('showImageCaption', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Article Tags Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Article Tags (टैग्स व कीवर्ड्स)</span>
                  <span className="text-[10px] text-slate-500">लेख के अंत में विषय से जुड़े #टैग्स प्रदर्शित करें</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showTags !== false}
                  onChange={(e) => updatePageConfig('showTags', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Card 2: Author & Byline Credentials */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <User className="w-4 h-4 text-red-600" />
                <span>Author & Editorial Credentials</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Customize reporter and editor names, avatars, and timestamps.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Author Name Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Author / Reporter Name</span>
                  <span className="text-[10px] text-slate-500">बायलाइन में रिपोर्टर का नाम दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showAuthorName !== false && currentConfig.showAuthorByline !== false}
                  onChange={(e) => {
                    updateMeta('showAuthorName', e.target.checked);
                    updatePageConfig('showAuthorByline', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Author Avatar Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Author Photo / Avatar</span>
                  <span className="text-[10px] text-slate-500">रिपोर्टर की गोल फ़ोटो या अवतार दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showAuthorAvatar !== false}
                  onChange={(e) => updateMeta('showAuthorAvatar', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Author Role Badge */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Reporter Role Tag (विशेष संवाददाता)</span>
                  <span className="text-[10px] text-slate-500">संवाददाता का पद या डिजिग्नेशन बैज दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showAuthorRole !== false}
                  onChange={(e) => updateMeta('showAuthorRole', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Editor Byline Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Editor Byline (संपादक विवरण)</span>
                  <span className="text-[10px] text-slate-500">डेस्क संपादक का नाम व भूमिका प्रदर्शित करें</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showEditorByline !== false}
                  onChange={(e) => updatePageConfig('showEditorByline', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Published Date & Time Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Published Date & Time</span>
                    <span className="text-[10px] text-slate-500">प्रकाशन तिथि और समय प्रदर्शित करें</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showPublishDate !== false && currentConfig.showPublishedDate !== false}
                  onChange={(e) => {
                    updateMeta('showPublishDate', e.target.checked);
                    updatePageConfig('showPublishedDate', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Relative Time Ago Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Relative Time (23 दिन पहले)</span>
                  <span className="text-[10px] text-slate-500">बायलाइन में सापेक्ष समय ("23 दिन पहले") दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showRelativeTime !== false && currentConfig.showRelativeTime !== false}
                  onChange={(e) => {
                    updateMeta('showRelativeTime', e.target.checked);
                    updatePageConfig('showRelativeTime', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Reading Time Toggle (Phase 1 Audit Parity) */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Reading Time (अनुमानित पढ़ने का समय)</span>
                  <span className="text-[10px] text-slate-500">बायलाइन में '२ मिनट पढ़ने का समय' काउंटर दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showReadingTime !== false}
                  onChange={(e) => updatePageConfig('showReadingTime', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Show/Hide Author Details Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-red-200/90 bg-red-50/40 hover:border-red-300 hover:bg-red-50/70 transition cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    <span>Show/Hide Author Details (लेखक विवरण दिखाएं/छिपाएं)</span>
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">
                    When disabled, the author component (rounded image, name, bio paragraph) is completely hidden from the public article view.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showAuthorBioBox !== false && currentMeta.showAuthorBox !== false}
                  onChange={(e) => {
                    const val = e.target.checked;
                    updatePageConfig('showAuthorBioBox', val);
                    updateWidgets('showAuthorBio', val);
                    updateMeta('showAuthorBox', val);
                    if (onUpdateSettings && portalSettings) {
                      onUpdateSettings({
                        ...portalSettings,
                        articlePageConfig: {
                          ...currentConfig,
                          showAuthorBioBox: val,
                        },
                        articleMetaSettings: {
                          ...currentMeta,
                          showAuthorBox: val,
                        },
                        sidebarWidgets: {
                          ...currentWidgets,
                          showAuthorBio: val,
                        },
                      });
                    }
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACTION BAR & AUDIO TTS */}
      {activeSection === 'action_bar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Action Bar Tools */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-red-600" />
                <span>Reading Utilities & Action Bar</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enable or disable interactive buttons across desktop and mobile.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Listen to Story (Audio TTS) */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Listen to Story (Audio TTS)</span>
                    <span className="text-[10px] text-slate-500">खबर को आवाज में सुनने के लिए प्लेयर बटन दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showListenButton !== false && currentConfig.showAudioListen !== false}
                  onChange={(e) => {
                    updateMeta('showListenButton', e.target.checked);
                    updatePageConfig('showAudioListen', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Font Size Sizer A- / A+ */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">A±</span>
                  <div>
                    <span className="font-semibold text-slate-800 block">Font Sizer Controls (A- / A+)</span>
                    <span className="text-[10px] text-slate-500">पाठक के लिए फ़ॉन्ट छोटा-बड़ा करने का बटन दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showFontSizeControl !== false && currentConfig.showFontSizeControls !== false}
                  onChange={(e) => {
                    updateMeta('showFontSizeControl', e.target.checked);
                    updatePageConfig('showFontSizeControls', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* PDF Download Button */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Printer className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Download PDF Button</span>
                    <span className="text-[10px] text-slate-500">खबर को PDF में डाउनलोड करने का बटन दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentMeta.showPdfButton !== false && currentConfig.showPrintPdf !== false}
                  onChange={(e) => {
                    updateMeta('showPdfButton', e.target.checked);
                    updatePageConfig('showPrintPdf', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* E-Paper Clipping Button */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Scissors className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">e-Paper Clipping Tool</span>
                    <span className="text-[10px] text-slate-500">अखबारी कतरन (Clipping Modal) बनाने का बटन दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showClippingModal !== false}
                  onChange={(e) => updatePageConfig('showClippingModal', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {/* Copy Link Button & Toast */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Copy className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Copy Link Button & Toast</span>
                    <span className="text-[10px] text-slate-500">लिंक कॉपी करने का बटन और "Link Copied!" टोस्ट दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showCopyLink !== false && currentMeta.platforms.copyLink !== false}
                  onChange={(e) => {
                    updatePageConfig('showCopyLink', e.target.checked);
                    updatePlatform('copyLink', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Social Platforms & Reader Feedback */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-red-600" />
                <span>Social Sharing & Reader Feedback</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle individual social media icons and community engagement widgets.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <span className="font-medium text-slate-700">WhatsApp Share Icon</span>
                <input
                  type="checkbox"
                  checked={currentMeta.platforms.whatsapp !== false}
                  onChange={(e) => updatePlatform('whatsapp', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <span className="font-medium text-slate-700">Telegram Share Icon</span>
                <input
                  type="checkbox"
                  checked={currentMeta.platforms.telegram !== false}
                  onChange={(e) => updatePlatform('telegram', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <span className="font-medium text-slate-700">X (Twitter) Share Icon</span>
                <input
                  type="checkbox"
                  checked={currentMeta.platforms.twitter !== false}
                  onChange={(e) => updatePlatform('twitter', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                <span className="font-medium text-slate-700">Facebook Share Icon</span>
                <input
                  type="checkbox"
                  checked={currentMeta.platforms.facebook !== false}
                  onChange={(e) => updatePlatform('facebook', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Smile className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Reader Reactions Bar (Emoji Bar)</span>
                    <span className="text-[10px] text-slate-500">खबर पर पाठकों के लाइक व इमोजी रिएक्शंस बार दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showReactionsBar !== false}
                  onChange={(e) => updatePageConfig('showReactionsBar', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Comments Desk (पाठक टिप्पणियां)</span>
                    <span className="text-[10px] text-slate-500">लेख के अंत में टिप्पणी अनुभाग दिखाएं</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showCommentsSection !== false && currentWidgets.showCommentsSection !== false}
                  onChange={(e) => {
                    updatePageConfig('showCommentsSection', e.target.checked);
                    updateWidgets('showCommentsSection', e.target.checked);
                  }}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>

              {/* Bottom Quick Actions Strip (Google News, PDF, WhatsApp, Telegram) */}
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Bottom Quick Action Channels</span>
                  <span className="text-[10px] text-slate-500">लेख के नीचे Google News, WhatsApp, Telegram व PDF डाउनलोड स्ट्रिप दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showQuickActionsStrip !== false}
                  onChange={(e) => updatePageConfig('showQuickActionsStrip', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: POST DISCLAIMER BOX */}
      {activeSection === 'disclaimer' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Post-Content Disclaimer Box Customization</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the legal and AI disclaimer box displayed after every news article.
              </p>
            </div>

            <label className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={currentConfig.showDisclaimerBox !== false}
                onChange={(e) => updatePageConfig('showDisclaimerBox', e.target.checked)}
                className="w-4 h-4 text-amber-600 accent-amber-600 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-900">
                {currentConfig.showDisclaimerBox !== false ? '✓ Box Visible' : '✗ Box Hidden'}
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                अस्वीकरण का विवरण (Disclaimer Text):
              </label>
              <textarea
                value={
                  currentConfig.disclaimerText ||
                  "'खबरी दोस्त' पर मौजूद सभी समाचार सामग्री कंप्यूटर द्वारा तैयार की गई है और इसे थर्ड पार्टी तथा सोशल मीडिया से लिया गया है। चूंकि यह सामग्री केवल जानकारी देने के उद्देश्य से उपलब्ध कराई गई है, इसलिए कृपया इसे पूरी सावधानी के साथ पढ़ें। किसी भी तरह की समस्या उत्पन्न होने पर 'खबरी दोस्त' जिम्मेदार नहीं होगा।"
                }
                onChange={(e) => updatePageConfig('disclaimerText', e.target.value)}
                rows={4}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-hindi leading-relaxed bg-slate-50/50"
                placeholder="अस्वीकरण संदेश दर्ज करें..."
              />
            </div>

            {/* Font Size Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  फ़ॉन्ट साइज़ (Font Size):
                </span>
                <span className="text-[11px] text-slate-500">
                  मोबाइल व डेस्कटॉप पर अस्वीकरण का टेक्स्ट साइज़ (यूज़र की मांग अनुसार डिफ़ॉल्ट 12px)
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {(['12px', '13px', '14px', '16px'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updatePageConfig('disclaimerFontSize', size)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      (currentConfig.disclaimerFontSize || '12px') === size
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {size} {size === '12px' ? '(Recommended)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Visual Preview of Disclaimer */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Live Preview:
              </span>
              <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 shadow-2xs flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-md bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5 text-amber-700">
                  <Info className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <div className="space-y-0.5">
                  <span
                    className="font-bold text-amber-900 block"
                    style={{ fontSize: currentConfig.disclaimerFontSize || '12px' }}
                  >
                    सूचना / अस्वीकरण (Disclaimer):
                  </span>
                  <p
                    className="text-amber-900/90 leading-relaxed font-normal"
                    style={{ fontSize: currentConfig.disclaimerFontSize || '12px' }}
                  >
                    {currentConfig.disclaimerText ||
                      "'खबरी दोस्त' पर मौजूद सभी समाचार सामग्री कंप्यूटर द्वारा तैयार की गई है और इसे थर्ड पार्टी तथा सोशल मीडिया से लिया गया है। चूंकि यह सामग्री केवल जानकारी देने के उद्देश्य से उपलब्ध कराई गई है, इसलिए कृपया इसे पूरी सावधानी के साथ पढ़ें। किसी भी तरह की समस्या उत्पन्न होने पर 'खबरी दोस्त' जिम्मेदार नहीं होगा।"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: RELATED STORIES & MOBILE CARDS STUDIO */}
      {activeSection === 'related' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Grid className="w-4 h-4 text-purple-600" />
                <span>Related News & Cards Studio (संबंधित ख़बरें)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Full control over related cards: hide/show category badges, locations, time ago, and mobile gaps.
              </p>
            </div>

            <label className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={currentConfig.showRelatedStories !== false && currentWidgets.showRelatedStories !== false}
                onChange={(e) => {
                  updatePageConfig('showRelatedStories', e.target.checked);
                  updateWidgets('showRelatedStories', e.target.checked);
                }}
                className="w-4 h-4 text-purple-600 accent-purple-600 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-purple-900">
                {currentConfig.showRelatedStories !== false ? '✓ Section Visible' : '✗ Section Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Heading & Count Controls */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  सेक्शन शीर्षक (Section Heading):
                </span>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">
                    शीर्षक टेक्स्ट (Default: 'यह भी पढ़ें'):
                  </label>
                  <input
                    type="text"
                    value={currentConfig.relatedHeadingTitle ?? currentWidgets.relatedHeadingTitle ?? 'यह भी पढ़ें'}
                    onChange={(e) => {
                      updatePageConfig('relatedHeadingTitle', e.target.value);
                      updateWidgets('relatedHeadingTitle', e.target.value);
                    }}
                    placeholder="यह भी पढ़ें"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  {/* Category in Heading */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700 font-medium">
                      हेडिंग में केटेगरी बैज दिखाएं (उदा. Business / Politics)
                    </span>
                    <input
                      type="checkbox"
                      checked={currentConfig.showRelatedHeadingCategoryBadge === true}
                      onChange={(e) => {
                        updatePageConfig('showRelatedHeadingCategoryBadge', e.target.checked);
                        updateWidgets('showRelatedHeadingCategoryBadge', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>

                  {/* Subtitle in Heading */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700 font-medium">
                      हेडिंग में उप-शीर्षक ('अन्य ताज़ा ख़बरें') दिखाएं
                    </span>
                    <input
                      type="checkbox"
                      checked={currentConfig.showRelatedHeadingSubtitle === true}
                      onChange={(e) => {
                        updatePageConfig('showRelatedHeadingSubtitle', e.target.checked);
                        updateWidgets('showRelatedHeadingSubtitle', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Number of Cards */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    कार्ड्स की संख्या (Total Cards Count):
                  </span>
                  <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-xs">
                    {currentConfig.relatedArticlesCount || currentWidgets.relatedArticlesCount || 4} Cards
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[2, 3, 4, 6, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        updatePageConfig('relatedArticlesCount', num);
                        updateWidgets('relatedArticlesCount', num);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        (currentConfig.relatedArticlesCount || 4) === num
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <div className="flex items-center space-x-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = Math.max(1, (currentConfig.relatedArticlesCount || 4) - 1);
                        updatePageConfig('relatedArticlesCount', newCount);
                        updateWidgets('relatedArticlesCount', newCount);
                      }}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                      title="1 कार्ड कम करें"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = Math.min(24, (currentConfig.relatedArticlesCount || 4) + 1);
                        updatePageConfig('relatedArticlesCount', newCount);
                        updateWidgets('relatedArticlesCount', newCount);
                      }}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                      title="1 कार्ड बढ़ाएं"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Card Elements Visibility & Mobile Layout */}
            <div className="space-y-4">
              {/* Elements on Individual Cards */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  कार्ड्स डेटा कस्टमाइज़ेशन (Cards Elements Visibility):
                </span>

                <div className="space-y-2 text-xs">
                  {/* Category on Cards (User explicitly asked to hide/toggle) */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-slate-800 font-semibold block">
                        कार्ड पर केटेगरी बैज (Business, Politics, आदि)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        कार्ड के ऊपर लाल केटेगरी बैज दिखाएं या छिपाएं
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={currentConfig.relatedCardShowCategory === true}
                      onChange={(e) => {
                        updatePageConfig('relatedCardShowCategory', e.target.checked);
                        updateWidgets('relatedCardShowCategory', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>

                  {/* Location on Cards */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-slate-800 font-semibold block">
                        कार्ड पर लोकेशन (नई दिल्ली, मेलबर्न आदि)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        कार्ड की फ़ोटो पर स्थान बैज दिखाएं या छिपाएं
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={currentConfig.relatedCardShowLocation === true}
                      onChange={(e) => {
                        updatePageConfig('relatedCardShowLocation', e.target.checked);
                        updateWidgets('relatedCardShowLocation', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>

                  {/* Date on Cards ("23 दिन पहले") */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-slate-800 font-semibold block">
                        सापेक्ष समय (उदा. '23 दिन पहले')
                      </span>
                      <span className="text-[10px] text-slate-500">
                        कार्ड के नीचे प्रकाशन का सापेक्ष समय दिखाएं या छिपाएं
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={currentConfig.relatedCardShowDate === true}
                      onChange={(e) => {
                        updatePageConfig('relatedCardShowDate', e.target.checked);
                        updateWidgets('relatedCardShowDate', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>

                  {/* Read More Button ("और पढ़ें") */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-slate-800 font-semibold block">
                        'और पढ़ें' बटन (Read More Link)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        कार्ड के नीचे 'पढ़ें ➔' का लिंक दिखाएं या छिपाएं
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={currentConfig.relatedCardShowReadMore === true}
                      onChange={(e) => {
                        updatePageConfig('relatedCardShowReadMore', e.target.checked);
                        updateWidgets('relatedCardShowReadMore', e.target.checked);
                      }}
                      className="w-4 h-4 text-purple-600 rounded accent-purple-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Mobile Viewport Layout Options */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  मोबाइल वर्ज़न लेआउट (Mobile Viewport Layout):
                </span>
                <p className="text-[11px] text-slate-500">
                  मोबाइल पर कार्ड्स के बीच बड़े गैप को समाप्त करने के लिए लेआउट चुनें:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      updatePageConfig('relatedMobileLayout', 'compact_list');
                      updateWidgets('relatedMobileLayout', 'list');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      currentConfig.relatedMobileLayout === 'compact_list' || currentWidgets.relatedMobileLayout === 'list'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mb-1 text-purple-600" />
                    <span className="block text-xs font-bold">कॉम्पैक्ट लिस्ट (Compact List)</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-normal">
                      थंबनेल बाईं ओर, शून्य गैप (Recommended)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updatePageConfig('relatedMobileLayout', 'grid_2col');
                      updateWidgets('relatedMobileLayout', 'grid2');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      currentConfig.relatedMobileLayout === 'grid_2col' || currentWidgets.relatedMobileLayout === 'grid2'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Grid className="w-4 h-4 mb-1 text-purple-600" />
                    <span className="block text-xs font-bold">2-कॉलम ग्रिड (2-Col Grid)</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-normal">
                      छोटे 2-कॉलम कार्ड्स
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: LAYOUT & COLUMNS */}
      {activeSection === 'layout' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Layout className="w-4 h-4 text-red-600" />
              <span>Container Width & Grid Columns</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the maximum container width and the split between article content and the right sidebar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Container Max Width */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">
                पेज कंटेनर चौड़ाई (Container Max Width):
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'normal', label: 'Normal Width (max-w-6xl • 1152px)', desc: 'क्लासिक अखबार चौड़ाई' },
                  { id: 'wide', label: 'Wide Width (max-w-7xl • 1280px)', desc: 'आधुनिक मानक (Recommended)' },
                  { id: 'full', label: 'Full Proportional (max-w-[96rem] • 1536px)', desc: 'विस्तृत स्क्रीन लेआउट' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      (currentConfig.containerMaxWidth || 'wide') === item.id
                        ? 'border-red-600 bg-red-50/60 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block text-xs">{item.label}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">{item.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="containerMaxWidth"
                      checked={(currentConfig.containerMaxWidth || 'wide') === item.id}
                      onChange={() => updatePageConfig('containerMaxWidth', item.id as any)}
                      className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Content vs Sidebar Column Split */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">
                कंटेंट बनाम साइडबार अनुपात (Column Split):
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'compact', label: '7 Columns Content / 5 Columns Sidebar', desc: 'साइडबार विजेट्स को अधिक स्थान' },
                  { id: 'standard', label: '8 Columns Content / 4 Columns Sidebar', desc: 'संपादकीय मानक (Recommended)' },
                  { id: 'wide', label: '9 Columns Content / 3 Columns Sidebar', desc: 'विस्तृत रीडिंग अनुभव' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      (currentConfig.contentColumnWidth || 'standard') === item.id
                        ? 'border-red-600 bg-red-50/60 font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block text-xs">{item.label}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">{item.desc}</span>
                    </div>
                    <input
                      type="radio"
                      name="contentColumnWidth"
                      checked={(currentConfig.contentColumnWidth || 'standard') === item.id}
                      onChange={() => updatePageConfig('contentColumnWidth', item.id as any)}
                      className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Content Container Width Slider Control (600px to 900px) */}
            <div className="p-4 sm:p-5 rounded-xl border-2 border-red-200/90 bg-gradient-to-br from-red-50/30 via-white to-slate-50/80 space-y-3.5 col-span-1 md:col-span-2 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <Maximize2 className="w-4 h-4 text-red-600" />
                    <span>कंटेंट कंटेनर चौड़ाई स्लाइडर (Content Container Width Slider)</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    डेस्कटॉप स्क्रीन पर लेख/कंटेंट की चौड़ाई (600px से 900px) सेट करें। इससे लंबी पंक्तियों में आंखों को थकान नहीं होती और पढ़ने का अनुभव सुखद रहता है।
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-300 px-3 py-1 rounded-lg shadow-2xs">
                    {currentConfig.contentContainerWidthPx || 780} px
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min={600}
                  max={900}
                  step={10}
                  value={currentConfig.contentContainerWidthPx || 780}
                  onChange={(e) => updatePageConfig('contentContainerWidthPx', Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>600px (संकीर्ण)</span>
                  <span className="text-slate-600 font-semibold">750px (संतुलित)</span>
                  <span className="text-red-600 font-bold">780px (डिफ़ॉल्ट)</span>
                  <span>900px (विस्तृत)</span>
                </div>
              </div>

              {/* Quick Presets for Instant Selection */}
              <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700">त्वरित प्रीसेट (Presets):</span>
                {[
                  { label: '650px • कॉम्पैक्ट', val: 650 },
                  { label: '720px • संपादकीय', val: 720 },
                  { label: '780px • पत्रिका (मानक)', val: 780 },
                  { label: '840px • विस्तृत', val: 840 },
                  { label: '900px • अधिकतम', val: 900 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => updatePageConfig('contentContainerWidthPx', preset.val)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold transition cursor-pointer ${
                      (currentConfig.contentContainerWidthPx || 780) === preset.val
                        ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: MOBILE STICKY FLOATING BAR & ADVERTISEMENT STUDIO */}
      {activeSection === 'mobile_bar' && (
        <div className="space-y-6">
          {/* Master Banner & Toggle */}
          <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-base sm:text-lg font-kd-headline text-slate-900">
                  Mobile Sticky Floating Bar Studio (मोबाइल स्टिकी बॉटम बार)
                </h4>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                स्मार्टफ़ोन पाठकों के लिए स्क्रीन के नीचे फ़िक्स रहने वाला बार। एडमिन यहाँ से सोशल मीडिया शेयरिंग बटन्स, 320x50 स्टिकी विज्ञापन, दोनों का कॉम्बो लगा सकते हैं या आवश्यकतानुसार इसे पूरी तरह बंद / हाइड कर सकते हैं।
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-700">
                {(currentConfig.mobileStickyBar?.enabled ?? DEFAULT_MOBILE_STICKY_BAR_CONFIG.enabled) ? 'सक्रिय (Enabled)' : 'छुपा हुआ (Hidden)'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentConfig.mobileStickyBar?.enabled ?? DEFAULT_MOBILE_STICKY_BAR_CONFIG.enabled}
                  onChange={(e) => updateMobileStickyBar('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Mode Selector: 4 Visual Cards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-red-600" />
                <span>प्रदर्शन मोड चुनें (Select Mobile Bottom Bar Mode)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                एडमिन अपनी प्राथमिकता के अनुसार चुन सकते हैं कि मोबाइल पाठकों को क्या दिखे: शेयरिंग बटन्स, स्पॉन्सर्ड विज्ञापन या दोनों।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option 1: Share Buttons Only */}
              <button
                type="button"
                onClick={() => {
                  updateMobileStickyBar('enabled', true);
                  updateMobileStickyBar('mode', 'share');
                }}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  (currentConfig.mobileStickyBar?.enabled ?? true) && (currentConfig.mobileStickyBar?.mode || 'share') === 'share'
                    ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                    <Share2 className="w-4 h-4" />
                  </span>
                  {(currentConfig.mobileStickyBar?.enabled ?? true) && (currentConfig.mobileStickyBar?.mode || 'share') === 'share' && (
                    <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      सक्रिय (Active)
                    </span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">1. Social Share Only</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    WhatsApp, Telegram, X, Facebook और लिंक कॉपी बटन्स।
                  </p>
                </div>
              </button>

              {/* Option 2: Sticky Ad Only */}
              <button
                type="button"
                onClick={() => {
                  updateMobileStickyBar('enabled', true);
                  updateMobileStickyBar('mode', 'ad');
                }}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  (currentConfig.mobileStickyBar?.enabled ?? true) && currentConfig.mobileStickyBar?.mode === 'ad'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Megaphone className="w-4 h-4" />
                  </span>
                  {(currentConfig.mobileStickyBar?.enabled ?? true) && currentConfig.mobileStickyBar?.mode === 'ad' && (
                    <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      सक्रिय (Active)
                    </span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">2. Sticky Ad Only</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    320x50 मोबाइल एंकर विज्ञापन (इमेज या AdSense स्क्रिप्ट)।
                  </p>
                </div>
              </button>

              {/* Option 3: Dual Mode (Share + Ad) */}
              <button
                type="button"
                onClick={() => {
                  updateMobileStickyBar('enabled', true);
                  updateMobileStickyBar('mode', 'both');
                }}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  (currentConfig.mobileStickyBar?.enabled ?? true) && currentConfig.mobileStickyBar?.mode === 'both'
                    ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </span>
                  {(currentConfig.mobileStickyBar?.enabled ?? true) && currentConfig.mobileStickyBar?.mode === 'both' && (
                    <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      सक्रिय (Active)
                    </span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">3. Dual Mode (Combo)</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    स्टिकी विज्ञापन और शेयरिंग बार दोनों एक साथ।
                  </p>
                </div>
              </button>

              {/* Option 4: Disable / Hide */}
              <button
                type="button"
                onClick={() => {
                  updateMobileStickyBar('enabled', false);
                }}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  currentConfig.mobileStickyBar?.enabled === false
                    ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    <X className="w-4 h-4" />
                  </span>
                  {currentConfig.mobileStickyBar?.enabled === false && (
                    <span className="text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded-full">
                      छुपा हुआ (Hidden)
                    </span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">4. Hide / Disabled</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    मोबाइल पर कोई भी बॉटम स्टिकी बार नहीं दिखेगा।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Social Share Buttons Details (Visible if mode is 'share' or 'both') */}
          {((currentConfig.mobileStickyBar?.mode || 'share') === 'share' || currentConfig.mobileStickyBar?.mode === 'both') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>मोबाइल शेयरिंग बटन्स (Mobile Share Platforms)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    चुनें कि मोबाइल फ्लोटिंग बार में कौन-कौन से सोशल शेयरिंग विकल्प प्रदर्शित हों।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {/* WhatsApp */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                    <span>WhatsApp</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.whatsapp ?? true}
                    onChange={(e) => updateMobileSharePlatform('whatsapp', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* Telegram */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc]" />
                    <span>Telegram</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.telegram ?? true}
                    onChange={(e) => updateMobileSharePlatform('telegram', e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </label>

                {/* Twitter / X */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    <span>X (Twitter)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.twitter ?? true}
                    onChange={(e) => updateMobileSharePlatform('twitter', e.target.checked)}
                    className="w-4 h-4 text-slate-900 rounded cursor-pointer"
                  />
                </label>

                {/* Facebook */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                    <span>Facebook</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.facebook ?? true}
                    onChange={(e) => updateMobileSharePlatform('facebook', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </label>

                {/* Copy Link */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Link (लिंक कॉपी)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.copyLink ?? true}
                    onChange={(e) => updateMobileSharePlatform('copyLink', e.target.checked)}
                    className="w-4 h-4 text-slate-700 rounded cursor-pointer"
                  />
                </label>

                {/* Native OS Share */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 bg-slate-50/50 cursor-pointer">
                  <span className="font-bold text-slate-800 flex items-center space-x-2">
                    <Share2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Native OS Share Drawer</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.sharePlatforms?.nativeShare ?? true}
                    onChange={(e) => updateMobileSharePlatform('nativeShare', e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Show 'Share:' text toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  'Share:' / 'शेयर करें' टेक्स्ट लेबल दिखाएं:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentConfig.mobileStickyBar?.showShareLabel ?? true}
                    onChange={(e) => updateMobileStickyBar('showShareLabel', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Sticky Advertisement Details (Visible if mode is 'ad' or 'both') */}
          {(currentConfig.mobileStickyBar?.mode === 'ad' || currentConfig.mobileStickyBar?.mode === 'both') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    <span>मोबाइल स्टिकी विज्ञापन सेटिंग्स (Sticky Ad Configuration)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    मोबाइल उपयोगकर्ताओं के लिए 320x50 एंकर विज्ञापन की इमेज, लिंक या कस्टम स्क्रिप्ट कोड कॉन्फ़िगर करें।
                  </p>
                </div>
              </div>

              {/* Ad Format Selector: Image Banner vs Script */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateMobileStickyBar('adType', 'image')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    (currentConfig.mobileStickyBar?.adType || 'image') === 'image'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  इमेज बैनर व लिंक (Image Banner + Link)
                </button>
                <button
                  type="button"
                  onClick={() => updateMobileStickyBar('adType', 'script')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentConfig.mobileStickyBar?.adType === 'script'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  कस्टम स्क्रिप्ट / AdSense कोड (HTML / Script)
                </button>
              </div>

              {(currentConfig.mobileStickyBar?.adType || 'image') === 'image' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      बैनर इमेज URL (320x50 Banner Image URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={currentConfig.mobileStickyBar?.adImageUrl || ''}
                        onChange={(e) => updateMobileStickyBar('adImageUrl', e.target.value)}
                        placeholder="https://example.com/banner-320x50.png"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateMobileStickyBar(
                            'adImageUrl',
                            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80'
                          )
                        }
                        className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition shrink-0 cursor-pointer"
                        title="डिफ़ॉल्ट सैंपल बैनर उपयोग करें"
                      >
                        सैंपल बैनर
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      क्लिक डेस्टिनेशन URL (Click Target URL):
                    </label>
                    <input
                      type="text"
                      value={currentConfig.mobileStickyBar?.adTargetUrl || ''}
                      onChange={(e) => updateMobileStickyBar('adTargetUrl', e.target.value)}
                      placeholder="#contact या https://sponsor-brand.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      प्रायोजक का नाम / Alt Text:
                    </label>
                    <input
                      type="text"
                      value={currentConfig.mobileStickyBar?.adAltText || ''}
                      onChange={(e) => updateMobileStickyBar('adAltText', e.target.value)}
                      placeholder="खबरी दोस्त मीडिया नेटवर्क प्रायोजित विज्ञापन"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Live Banner Image Preview */}
                  {currentConfig.mobileStickyBar?.adImageUrl && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                        बैनर पूर्वावलोकन (Preview):
                      </span>
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                        <img
                          src={currentConfig.mobileStickyBar.adImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80'}
                          alt="Ad Preview"
                          className="h-[50px] max-w-[320px] object-contain rounded shadow-2xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      AdSense एंकर कोड या कस्टम जावास्क्रिप्ट / HTML:
                    </label>
                    <textarea
                      rows={4}
                      value={currentConfig.mobileStickyBar?.adScriptCode || ''}
                      onChange={(e) => updateMobileStickyBar('adScriptCode', e.target.value)}
                      placeholder="<!-- Google AdSense Mobile Anchor / Custom Script -->&#10;<ins class='adsbygoogle' ...></ins>"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      यह कोड मोबाइल उपयोगकर्ताओं के बॉटम स्टिकी बार में रेंडर होगा।
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Experience & Footer Overlap Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>उपयोगकर्ता अनुभव व फुटर दृश्यता (UX & Footer Clearance Protection)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                यह सुनिश्चित करता है कि स्टिकी बार के पीछे वेबसाइट का फुटर, 'All Rights Reserved' या टेक्नोलॉजी पार्टनर की ब्रांडिंग कभी न दबे।
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Auto-Hide On Footer */}
              <label className="flex items-start justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                    <span>फुटर आने पर स्वतः छुपाएं (Auto-Clear on Footer View)</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                      अनुशंसित (Recommended)
                    </span>
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    जब पाठक स्क्रोल करके वेबसाइट के फुटर ('All Rights Reserved', RNI नंबर, टेक्नोलॉजी पार्टनर ब्रांडिंग) तक पहुँचेंगे, तो स्टिकी बार स्वतः स्मूथली नीचे चला जाएगा, ताकि फुटर का हर विवरण पूरी तरह साफ दिखाई दे।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.mobileStickyBar?.autoHideOnFooter ?? true}
                  onChange={(e) => updateMobileStickyBar('autoHideOnFooter', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer mt-0.5"
                />
              </label>

              {/* Dismissible by Reader */}
              <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <div className="space-y-0.5 pr-4">
                  <span className="font-bold text-slate-800">
                    उपयोगकर्ता के लिए बंद करने का विकल्प (Reader Dismiss Button 'X')
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    मोबाइल उपयोगकर्ताओं को स्टिकी बार / विज्ञापन बंद करने के लिए 'X' का बटन दें, ताकि वे बिना किसी रुकावट के पूरा लेख पढ़ सकें।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.mobileStickyBar?.dismissible ?? true}
                  onChange={(e) => updateMobileStickyBar('dismissible', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded cursor-pointer mt-0.5"
                />
              </label>
            </div>
          </div>

          {/* Live Mobile Interactive Screen Simulation */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>स्मार्टफ़ोन पूर्वावलोकन (Live Mobile Screen Simulation)</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Width: 360px
              </span>
            </div>

            <div className="max-w-xs mx-auto bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl relative min-h-[160px] flex flex-col justify-between">
              <div className="p-3 text-[11px] text-slate-300 space-y-1.5 opacity-60">
                <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                <div className="h-2 bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-700 rounded w-5/6"></div>
              </div>

              {/* Simulated Mobile Bottom Bar */}
              {(currentConfig.mobileStickyBar?.enabled ?? true) ? (
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 text-slate-900 flex items-center justify-between shadow-md">
                  {(currentConfig.mobileStickyBar?.mode || 'share') === 'share' && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-3 h-3 text-red-600 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-800">Share:</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[9px] font-bold">W</span>
                        <span className="w-5 h-5 rounded-full bg-[#0088cc] text-white flex items-center justify-center text-[9px] font-bold">T</span>
                        <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">X</span>
                        <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] font-bold">F</span>
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">+</span>
                      </div>
                    </>
                  )}

                  {currentConfig.mobileStickyBar?.mode === 'ad' && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[8px] font-black uppercase text-amber-700 bg-amber-100 px-1 rounded">AD</span>
                      <span className="text-[10px] font-bold text-slate-700 truncate mx-2">
                        {currentConfig.mobileStickyBar?.adAltText || 'प्रायोजित विज्ञापन (320x50)'}
                      </span>
                      <span className="text-[10px] text-slate-400">✕</span>
                    </div>
                  )}

                  {currentConfig.mobileStickyBar?.mode === 'both' && (
                    <div className="w-full space-y-1">
                      <div className="flex items-center justify-between text-[9px] text-amber-800 bg-amber-50 px-1 rounded">
                        <span className="font-bold">AD: Sponsored</span>
                        <span className="text-slate-400">✕</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-700">Share:</span>
                        <div className="flex items-center space-x-1">
                          <span className="w-4 h-4 rounded-full bg-[#25D366] text-white text-[8px] flex items-center justify-center">W</span>
                          <span className="w-4 h-4 rounded-full bg-[#0088cc] text-white text-[8px] flex items-center justify-center">T</span>
                          <span className="w-4 h-4 rounded-full bg-black text-white text-[8px] flex items-center justify-center">X</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-950/80">
                  बॉटम स्टिकी बार अक्षम / छुपा हुआ है (Bar Hidden)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
