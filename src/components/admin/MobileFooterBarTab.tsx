import React, { useState } from 'react';
import {
  Smartphone,
  Share2,
  Megaphone,
  X,
  Check,
  Save,
  RotateCcw,
  ExternalLink,
  Code2,
  Image as ImageIcon,
  Link as LinkIcon,
  Copy,
  Eye,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { PortalSettings, MobileStickyBarConfig, ArticlePageConfig } from '../../types/news';
import {
  DEFAULT_MOBILE_STICKY_BAR_CONFIG,
  DEFAULT_ARTICLE_PAGE_CONFIG,
} from '../../data/portalDefaults';

interface MobileFooterBarTabProps {
  settings: PortalSettings;
  onUpdateSettings: (settings: PortalSettings) => void;
}

export const MobileFooterBarTab: React.FC<MobileFooterBarTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [barConfig, setBarConfig] = useState<MobileStickyBarConfig>(() => ({
    ...DEFAULT_MOBILE_STICKY_BAR_CONFIG,
    ...(settings.mobileStickyBar || settings.articlePageConfig?.mobileStickyBar || {}),
    sharePlatforms: {
      ...DEFAULT_MOBILE_STICKY_BAR_CONFIG.sharePlatforms,
      ...(settings.mobileStickyBar?.sharePlatforms || settings.articlePageConfig?.mobileStickyBar?.sharePlatforms || {}),
    },
  }));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateConfig = <K extends keyof MobileStickyBarConfig>(
    key: K,
    value: MobileStickyBarConfig[K]
  ) => {
    setBarConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePlatform = (
    platform: keyof NonNullable<MobileStickyBarConfig['sharePlatforms']>,
    value: boolean
  ) => {
    setBarConfig((prev) => ({
      ...prev,
      sharePlatforms: {
        ...(prev.sharePlatforms || DEFAULT_MOBILE_STICKY_BAR_CONFIG.sharePlatforms),
        [platform]: value,
      },
    }));
  };

  const handleSave = () => {
    const updatedArticlePageConfig: ArticlePageConfig = {
      ...(settings.articlePageConfig || DEFAULT_ARTICLE_PAGE_CONFIG),
      mobileStickyBar: barConfig,
    };

    onUpdateSettings({
      ...settings,
      mobileStickyBar: barConfig,
      articlePageConfig: updatedArticlePageConfig,
      adSettings: {
        ...settings.adSettings,
        showMobileStickyAd: barConfig.enabled && (barConfig.mode === 'ad' || barConfig.mode === 'both'),
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setBarConfig(DEFAULT_MOBILE_STICKY_BAR_CONFIG);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-kd-body text-slate-800 pb-10">
      {/* 1. Header & Direct Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-kd-headline">
            <Smartphone className="w-6 h-6 text-emerald-600" />
            <span>Mobile Footer: Social Sharing Bar vs Sticky Advertisement</span>
          </h2>
          <p className="text-xs text-slate-500 font-kd-meta mt-1">
            मोबाइल उपयोगकर्ताओं के लिए बॉटम बार नियंत्रित करें — सोशल मीडिया शेयरिंग बटन्स या 320x50 स्टिकी विज्ञापन चुनें।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer shadow-2xs"
            title="डिफ़ॉल्ट सेटिंग्स रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-kd-meta animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">
            मोबाइल बॉटम बार सेटिंग्स सफलतापूर्वक सहेज ली गईं! (Settings saved successfully!)
          </span>
        </div>
      )}

      {/* 2. Master Toggle: Enable / Disable Bar */}
      <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${barConfig.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <h3 className="font-bold text-base sm:text-lg font-kd-headline text-slate-900">
              Mobile Bottom Sticky Floating Bar
            </h3>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
              Mobile Viewport
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            जब सक्रिय हो, यह बार स्मार्टफ़ोन स्क्रीन्स के नीचे डॉक रहता है। एडमिन यहाँ से तय कर सकते हैं कि पाठकों को शेयरिंग बटन्स दिखें या प्रायोजित विज्ञापन।
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-700 font-kd-meta">
            {barConfig.enabled ? 'सक्रिय (Enabled)' : 'छुपा हुआ (Disabled)'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={barConfig.enabled}
              onChange={(e) => updateConfig('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* 3. Primary Mode Selector: Social Sharing Bar vs Sticky Advertisement */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>मोबाइल फुटर मोड चुनें (Choose Mobile Footer Bar Mode)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            चुनें कि मोबाइल उपयोगकर्ताओं को क्या दिखाया जाए: 'Social Sharing Bar' या 'Sticky Advertisement'।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Social Sharing Bar */}
          <button
            type="button"
            onClick={() => {
              updateConfig('enabled', true);
              updateConfig('mode', 'share');
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
              barConfig.enabled && barConfig.mode === 'share'
                ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                <Share2 className="w-4 h-4" />
              </span>
              {barConfig.enabled && barConfig.mode === 'share' && (
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  चयनित (Active)
                </span>
              )}
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs">Social Sharing Bar</h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                WhatsApp, Telegram, X, Facebook और लिंक कॉपी बटन्स।
              </p>
            </div>
          </button>

          {/* Card 2: Sticky Advertisement */}
          <button
            type="button"
            onClick={() => {
              updateConfig('enabled', true);
              updateConfig('mode', 'ad');
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
              barConfig.enabled && barConfig.mode === 'ad'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Megaphone className="w-4 h-4" />
              </span>
              {barConfig.enabled && barConfig.mode === 'ad' && (
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  चयनित (Active)
                </span>
              )}
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs">Sticky Advertisement</h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                320x50 मोबाइल एंकर विज्ञापन (इमेज बैनर या कस्टम स्क्रिप्ट)।
              </p>
            </div>
          </button>

          {/* Card 3: Dual Mode (Both) */}
          <button
            type="button"
            onClick={() => {
              updateConfig('enabled', true);
              updateConfig('mode', 'both');
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
              barConfig.enabled && barConfig.mode === 'both'
                ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                ⚡
              </span>
              {barConfig.enabled && barConfig.mode === 'both' && (
                <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  चयनित (Active)
                </span>
              )}
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs">Dual Mode (Combo)</h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                स्टिकी विज्ञापन बैनर व सोशल शेयरिंग दोनों एक साथ।
              </p>
            </div>
          </button>

          {/* Card 4: Hide Bar Completely */}
          <button
            type="button"
            onClick={() => {
              updateConfig('enabled', false);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
              !barConfig.enabled
                ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-400/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                <X className="w-4 h-4" />
              </span>
              {!barConfig.enabled && (
                <span className="text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded-full">
                  छुपा हुआ (Hidden)
                </span>
              )}
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs">Hide Bar Completely</h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                मोबाइल स्क्रीन पर कोई भी बॉटम बार प्रदर्शित न करें।
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Sticky Advertisement Configuration Section */}
      {(barConfig.mode === 'ad' || barConfig.mode === 'both') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                <span>स्टिकी विज्ञापन विवरण (Sticky Advertisement Inputs)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                इमेज, रीडायरेक्ट लिंक या कस्टम Google AdSense / जावास्क्रिप्ट कोड सेट करें।
              </p>
            </div>

            {/* Ad Format Selector: Image Banner vs Custom Script */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => updateConfig('adType', 'image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  (barConfig.adType || 'image') === 'image'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image Banner</span>
              </button>
              <button
                type="button"
                onClick={() => updateConfig('adType', 'script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  barConfig.adType === 'script'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Custom Script</span>
              </button>
            </div>
          </div>

          {(barConfig.adType || 'image') === 'image' ? (
            <div className="space-y-4">
              {/* Input: Ad Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ad Image URL (320x50 Banner Image):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Recommended: 320x50 or 640x100</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={barConfig.adImageUrl || ''}
                    onChange={(e) => updateConfig('adImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateConfig(
                        'adImageUrl',
                        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Preset Sample
                  </button>
                </div>
              </div>

              {/* Input: Ad Link Destination */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ad Destination Link (URL to open on tap):</span>
                </label>
                <input
                  type="text"
                  value={barConfig.adTargetUrl || ''}
                  onChange={(e) => updateConfig('adTargetUrl', e.target.value)}
                  placeholder="#contact या https://sponsor-domain.com/campaign"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Input: Ad Alt Text / Sponsor Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sponsor Name / Image Alt Text (प्रायोजक का नाम):
                </label>
                <input
                  type="text"
                  value={barConfig.adAltText || ''}
                  onChange={(e) => updateConfig('adAltText', e.target.value)}
                  placeholder="खबरी दोस्त मीडिया नेटवर्क • प्रायोजित विज्ञापन"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Live Image Banner Preview */}
              {barConfig.adImageUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5 font-kd-meta">
                    लाइव इमेज बैनर पूर्वावलोकन (Live Banner Preview):
                  </span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                    <img
                      src={barConfig.adImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&auto=format&fit=crop&q=80'}
                      alt={barConfig.adAltText || 'Ad Preview'}
                      className="h-[50px] max-w-[320px] object-contain rounded shadow-2xs"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Input: Custom Script / HTML */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Custom Ad Script / Google AdSense Anchor Tag (कस्टम स्क्रिप्ट या AdSense कोड):</span>
                </label>
                <textarea
                  rows={5}
                  value={barConfig.adScriptCode || ''}
                  onChange={(e) => updateConfig('adScriptCode', e.target.value)}
                  placeholder="<!-- Google AdSense 320x50 Mobile Anchor Script -->&#10;<ins class='adsbygoogle'&#10;     style='display:inline-block;width:320px;height:50px'&#10;     data-ad-client='ca-pub-XXXXXXXXXXXXXXXX'&#10;     data-ad-slot='YYYYYYYYYY'></ins>&#10;<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
                  className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  यह जावास्क्रिप्ट या HTML कोड मोबाइल उपयोगकर्ताओं के बॉटम स्टिकी बार में सुरक्षित रूप से लोड होगा।
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Social Sharing Bar Configuration Section */}
      {(barConfig.mode === 'share' || barConfig.mode === 'both') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-red-600" />
                <span>सोशल शेयरिंग विकल्प (Social Sharing Platforms)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                चुनें कि मोबाइल शेयरिंग बार में कौन-कौन से बटन दिखाई दें।
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
                checked={barConfig.sharePlatforms?.whatsapp ?? true}
                onChange={(e) => updatePlatform('whatsapp', e.target.checked)}
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
                checked={barConfig.sharePlatforms?.telegram ?? true}
                onChange={(e) => updatePlatform('telegram', e.target.checked)}
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
                checked={barConfig.sharePlatforms?.twitter ?? true}
                onChange={(e) => updatePlatform('twitter', e.target.checked)}
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
                checked={barConfig.sharePlatforms?.facebook ?? true}
                onChange={(e) => updatePlatform('facebook', e.target.checked)}
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
                checked={barConfig.sharePlatforms?.copyLink ?? true}
                onChange={(e) => updatePlatform('copyLink', e.target.checked)}
                className="w-4 h-4 text-slate-700 rounded cursor-pointer"
              />
            </label>

            {/* Native OS Share Drawer */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 bg-slate-50/50 cursor-pointer">
              <span className="font-bold text-slate-800 flex items-center space-x-2">
                <Share2 className="w-3.5 h-3.5 text-red-600" />
                <span>Native Share Drawer</span>
              </span>
              <input
                type="checkbox"
                checked={barConfig.sharePlatforms?.nativeShare ?? true}
                onChange={(e) => updatePlatform('nativeShare', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">
              'Share:' / 'शेयर करें' टेक्स्ट लेबल दिखाएं:
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={barConfig.showShareLabel ?? true}
                onChange={(e) => updateConfig('showShareLabel', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* 6. Footer Clearance & UX Protection */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>फुटर सुरक्षा व दृश्यता (Footer Clearance & Anti-Overlap Protection)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            वेबसाइट के फुटर का विवरण (All Rights Reserved, RNI नंबर, टेक्नोलॉजी पार्टनर ब्रांडिंग) कभी न दबे।
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Auto-Hide On Footer */}
          <label className="flex items-start justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                <span>फुटर आने पर स्वतः छुपाएं (Auto-Clear on Footer View)</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                  Recommended
                </span>
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                जब पाठक वेबसाइट के अंत तक स्क्रोल करते हैं, तो स्टिकी बार अपने-आप नीचे चला जाता है, जिससे फुटर की ब्रांडिंग और नीतियां 100% साफ दिखती हैं।
              </p>
            </div>
            <input
              type="checkbox"
              checked={barConfig.autoHideOnFooter ?? true}
              onChange={(e) => updateConfig('autoHideOnFooter', e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer mt-0.5"
            />
          </label>

          {/* Dismissible by Reader */}
          <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800">
                उपयोगकर्ता के लिए बंद करने का बटन ('X' Close Button)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                पाठकों को स्टिकी बार या विज्ञापन बंद करने की सुविधा दें।
              </p>
            </div>
            <input
              type="checkbox"
              checked={barConfig.dismissible ?? true}
              onChange={(e) => updateConfig('dismissible', e.target.checked)}
              className="w-4 h-4 text-red-600 rounded cursor-pointer mt-0.5"
            />
          </label>
        </div>
      </div>

      {/* 7. Live Smartphone Interactive Simulation Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>स्मार्टफ़ोन पूर्वावलोकन (Live Mobile Screen Simulation)</span>
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            Width: 360px
          </span>
        </div>

        <div className="max-w-xs mx-auto bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl relative min-h-[170px] flex flex-col justify-between">
          <div className="p-3 text-[11px] text-slate-300 space-y-1.5 opacity-60">
            <div className="h-3 bg-slate-600 rounded w-3/4"></div>
            <div className="h-2 bg-slate-700 rounded w-full"></div>
            <div className="h-2 bg-slate-700 rounded w-5/6"></div>
          </div>

          {/* Simulated Mobile Bottom Bar */}
          {barConfig.enabled ? (
            <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 text-slate-900 flex items-center justify-between shadow-md">
              {barConfig.mode === 'share' && (
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

              {barConfig.mode === 'ad' && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[8px] font-black uppercase text-amber-700 bg-amber-100 px-1 rounded">AD</span>
                  <span className="text-[10px] font-bold text-slate-700 truncate mx-2">
                    {barConfig.adAltText || 'प्रायोजित विज्ञापन (320x50)'}
                  </span>
                  <span className="text-[10px] text-slate-400">✕</span>
                </div>
              )}

              {barConfig.mode === 'both' && (
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
  );
};
