import React, { useState } from 'react';
import {
  Layout,
  Sliders,
  TrendingUp,
  Mail,
  HelpCircle,
  Newspaper,
  DollarSign,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  BarChart3,
  Check,
  RotateCcw,
  Smartphone,
  Monitor,
  Coins,
  Compass,
  RefreshCw,
  Eye,
  EyeOff,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  Image,
} from 'lucide-react';
import { ArticleSidebarWidgets } from '../../types/news';
import { DEFAULT_ARTICLE_SIDEBAR_WIDGETS } from '../../data/portalDefaults';
import { OFFICIAL_ZODIAC_LIST, getDailyDynamicRashifal } from '../../data/rashifalData';

interface ArticleWidgetsSettingsTabProps {
  settings: ArticleSidebarWidgets;
  onChange: (updated: ArticleSidebarWidgets) => void;
}

export const ArticleWidgetsSettingsTab: React.FC<ArticleWidgetsSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const current: ArticleSidebarWidgets = {
    ...DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
    ...settings,
  };

  const [selectedZodiacId, setSelectedZodiacId] = useState<string>('aries');
  const [autoUpdatedMsg, setAutoUpdatedMsg] = useState<string | null>(null);

  const handleToggle = (key: keyof ArticleSidebarWidgets) => {
    onChange({
      ...current,
      [key]: !current[key],
    });
  };

  const handleTextChange = (
    key: 'pollQuestion' | 'pollOptionA' | 'pollOptionB' | 'pollOptionC' | 'pollOptionD' | 'goldRateCity',
    value: string
  ) => {
    onChange({
      ...current,
      [key]: value,
    });
  };

  // 1-Click Auto Update Gold Rates (Live Market Simulator)
  const handleAutoUpdateGoldRate = () => {
    const base24k = 78000 + Math.floor(Math.random() * 800);
    const base22k = Math.round((base24k * 22) / 24);
    const baseSilver = 92000 + Math.floor(Math.random() * 1200);
    const now = new Date();
    const dateStr = `${now.getDate()} ${['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'][now.getMonth()]} ${now.getFullYear()}`;

    onChange({
      ...current,
      goldRate24k: base24k,
      goldRate22k: base22k,
      silverRate1kg: baseSilver,
      goldRateUpdateDate: `आज का ताज़ा भाव (${dateStr})`,
    });

    setAutoUpdatedMsg('सोने-चांदी का ताज़ा भाव अपडेट हो गया!');
    setTimeout(() => setAutoUpdatedMsg(null), 3000);
  };

  // 1-Click Auto Update Rashifal
  const handleAutoUpdateRashifal = () => {
    const dynamicList = getDailyDynamicRashifal().map((item) => ({
      id: item.id,
      sign: `${item.sign} (${item.signEnglish})`,
      symbol: item.symbol,
      ruler: item.ruler,
      prediction: item.prediction,
      luckyNumber: item.luckyNumber,
      luckyColor: item.luckyColor,
    }));

    const now = new Date();
    const dateStr = `${now.getDate()} ${['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'][now.getMonth()]} ${now.getFullYear()}`;

    onChange({
      ...current,
      rashifalDate: dateStr,
      customRashifalList: dynamicList,
    });

    setAutoUpdatedMsg('दैनिक राशिफल सफलतापूर्वक अपडेट हो गया!');
    setTimeout(() => setAutoUpdatedMsg(null), 3000);
  };

  // Custom prediction change for single sign
  const handleUpdateSingleRashi = (
    field: 'prediction' | 'luckyNumber' | 'luckyColor',
    val: any
  ) => {
    const list = current.customRashifalList && current.customRashifalList.length > 0
      ? [...current.customRashifalList]
      : OFFICIAL_ZODIAC_LIST.map((item) => ({
          id: item.id,
          sign: `${item.sign} (${item.signEnglish})`,
          symbol: item.symbol,
          ruler: item.ruler,
          prediction: item.prediction,
          luckyNumber: item.luckyNumber,
          luckyColor: item.luckyColor,
        }));

    const idx = list.findIndex((x) => x.id === selectedZodiacId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], [field]: val };
      onChange({
        ...current,
        customRashifalList: list,
      });
    }
  };

  const activeRashiItem = (current.customRashifalList || []).find((x) => x.id === selectedZodiacId) ||
    OFFICIAL_ZODIAC_LIST.find((x) => x.id === selectedZodiacId) ||
    OFFICIAL_ZODIAC_LIST[0];

  const handleReset = () => {
    onChange(DEFAULT_ARTICLE_SIDEBAR_WIDGETS);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* 1. HEADER BANNER */}
      <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600">
              <Layout className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
              Article Page & Sidebar Widgets Studio
            </h3>
            <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Customize which interactive widgets and content sections appear on the single article reader view and right-hand desktop sidebar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 2. MAIN GRID: ARTICLE PAGE BODY MODULES vs SIDEBAR WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: ARTICLE BODY MODULES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Article Page Content Modules
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              Main Column
            </span>
          </div>

          <div className="space-y-3">
            {/* Reading Progress Bar */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Top Reading Progress Bar
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Dynamic top indicator showing how much of the news story the visitor has read.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showReadingProgressBar !== false}
                onChange={() => handleToggle('showReadingProgressBar')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Author / Writer / Editor Profile Card */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Author & Reporter Profile Card
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Display author name, avatar, designation, and editorial verification badge below article.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showAuthorBio !== false}
                onChange={() => handleToggle('showAuthorBio')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Editorial Disclaimer */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Editorial Disclaimer & Ethics Notice
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Grievance officer contact and adherence to Press Council / digital journalism ethics.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showEditorialDisclaimer !== false}
                onChange={() => handleToggle('showEditorialDisclaimer')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Comments Section */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Reader Comments & Discussions
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Allow authenticated users to post feedback and join civilized news debates.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showCommentsSection !== false}
                onChange={() => handleToggle('showCommentsSection')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Related Stories & Cards Studio (Full Admin Customization) */}
            <div className="p-4 rounded-xl border-2 border-purple-200/80 bg-purple-50/20 space-y-4">
              <label className="flex items-start justify-between cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition mt-0.5">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <span>Related Stories & Cards Section</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                        Full Customization
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Admin controls card category, location, dates, number of cards, and mobile layout.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.showRelatedStories !== false}
                  onChange={() => handleToggle('showRelatedStories')}
                  className="w-4 h-4 mt-1 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                />
              </label>

              {current.showRelatedStories !== false && (
                <div className="pt-3 border-t border-purple-200/70 space-y-4 text-xs">
                  {/* Card Display Count (Increase / Decrease) */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-purple-600" />
                        <span>कार्ड्स की कुल संख्या (Cards Count):</span>
                      </span>
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-xs">
                        {current.relatedArticlesCount || 4} Cards
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {[3, 4, 6, 8, 10, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => onChange({ ...current, relatedArticlesCount: num })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            (current.relatedArticlesCount || 4) === num
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      {/* Increment / Decrement Controls */}
                      <div className="flex items-center space-x-1 ml-auto">
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...current,
                              relatedArticlesCount: Math.max(1, (current.relatedArticlesCount || 4) - 1),
                            })
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          title="1 कार्ड कम करें"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...current,
                              relatedArticlesCount: Math.min(24, (current.relatedArticlesCount || 4) + 1),
                            })
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          title="1 कार्ड बढ़ाएं"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Heading Settings */}
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-800 block text-xs">
                      सेक्शन शीर्षक एवं बैज (Heading & Subtitle):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-500 font-medium block mb-1">
                          मुख्य शीर्षक (Heading):
                        </label>
                        <input
                          type="text"
                          value={current.relatedHeadingTitle ?? 'यह भी पढ़ें'}
                          onChange={(e) =>
                            onChange({ ...current, relatedHeadingTitle: e.target.value })
                          }
                          placeholder="यह भी पढ़ें"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 font-medium block mb-1">
                          उप-शीर्षक (Subtitle):
                        </label>
                        <input
                          type="text"
                          value={current.relatedHeadingSubtitleText ?? 'अन्य ताज़ा ख़बरें'}
                          onChange={(e) =>
                            onChange({ ...current, relatedHeadingSubtitleText: e.target.value })
                          }
                          placeholder="अन्य ताज़ा ख़बरें"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={current.showRelatedHeadingCategoryBadge === true}
                          onChange={(e) =>
                            onChange({
                              ...current,
                              showRelatedHeadingCategoryBadge: e.target.checked,
                            })
                          }
                          className="w-3.5 h-3.5 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-700">
                          शीर्षक में केटेगरी बैज दिखाएं (उदा. Business / Politics)
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={current.showRelatedHeadingSubtitle !== false}
                          onChange={(e) =>
                            onChange({
                              ...current,
                              showRelatedHeadingSubtitle: e.target.checked,
                            })
                          }
                          className="w-3.5 h-3.5 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-700">
                          उप-शीर्षक (Subtitle) दिखाएं
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Cards Data Elements Customizer (Category, Location, Date, Read More, Summary, Image) */}
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-800 block text-xs flex items-center justify-between">
                      <span>कार्ड्स डेटा कस्टमाइज़ेशन (Cards Elements Visibility):</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Show / Hide Any Element
                      </span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {/* 1. Category Badge on Cards */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            कार्ड पर केटेगरी (Business, Sports, आदि)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowCategory === true}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowCategory: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>

                      {/* 2. Location Badge on Cards */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            लोकेशन बैज (New Delhi, Melbourne, आदि)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowLocation === true}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowLocation: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>

                      {/* 3. Date / Time on Cards (23 दिन पहले) */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            समय / दिन (&apos;23 दिन पहले&apos;)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowDate !== false}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowDate: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>

                      {/* 4. Read More Button on Cards (पढ़ें ➔) */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <ArrowRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            &apos;पढ़ें ➔&apos; बटन
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowReadMore !== false}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowReadMore: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>

                      {/* 5. Summary / Excerpt on Cards */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Newspaper className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            संक्षिप्त विवरण (Summary)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowSummary !== false}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowSummary: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>

                      {/* 6. Image on Cards */}
                      <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Image className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="text-xs text-slate-800">
                            फ़ोटो / थंबनेल (Image)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={current.relatedCardShowImage !== false}
                          onChange={(e) =>
                            onChange({ ...current, relatedCardShowImage: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Mobile Layout & Gap Setting */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-800 block text-xs flex items-center justify-between">
                      <span>मोबाइल लेआउट एवं कार्ड्स गैप (Mobile Card Layout):</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onChange({ ...current, relatedMobileLayout: 'grid1' })}
                        className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                          (current.relatedMobileLayout || 'grid1') === 'grid1'
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-[11px]">1-कॉलम कॉम्पैक्ट</span>
                        <span className="block text-[9px] text-slate-400">संतुलित चौड़ाई & कम गैप</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onChange({ ...current, relatedMobileLayout: 'grid2' })}
                        className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                          current.relatedMobileLayout === 'grid2'
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-[11px]">2-कॉलम ग्रिड</span>
                        <span className="block text-[9px] text-slate-400">साइड-बाय-साइड</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onChange({ ...current, relatedMobileLayout: 'list' })}
                        className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                          current.relatedMobileLayout === 'list'
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-[11px]">हॉरिजॉन्टल लिस्ट</span>
                        <span className="block text-[9px] text-slate-400">थंबनेल बायीं तरफ</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Slider Carousel Mode */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Sidebar Slider / Carousel Mode
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Converts single-page article sidebar into an interactive tabbed slider carousel.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.sidebarSliderMode !== false}
                onChange={() => handleToggle('sidebarSliderMode')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Follow Us Cards (WhatsApp / Telegram) */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Follow Channels (WhatsApp & Telegram)
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Promotional links for readers to join Khabri Dost broadcast channels.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showFollowUsChannels !== false}
                onChange={() => handleToggle('showFollowUsChannels')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: RIGHT SIDEBAR WIDGETS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Right Sidebar Widgets
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              Desktop Sidebar
            </span>
          </div>

          <div className="space-y-3">
            {/* Trending News Feed & Vertical Slider Controls */}
            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-3">
              <label className="flex items-start justify-between cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Trending Stories Feed
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Sidebar widget showcasing trending and most-read articles.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.showTrendingNews !== false}
                  onChange={() => handleToggle('showTrendingNews')}
                  className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {current.showTrendingNews !== false && (
                <div className="pt-2.5 border-t border-slate-100 space-y-3 bg-slate-50/80 p-3 rounded-xl text-xs">
                  {/* Vertical Bottom-to-Top Slider Toggle */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">
                        Bottom-to-Top Vertical Slide
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Smoothly auto-scroll trending articles upwards in the sidebar.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={current.trendingSliderEnabled !== false}
                      onChange={(e) =>
                        onChange({ ...current, trendingSliderEnabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                    />
                  </label>

                  {/* Stories Count Option (3, 5, 8, 10, 15) */}
                  <div className="space-y-1.5 pt-1">
                    <span className="font-semibold text-slate-700 block">
                      Stories to Display & Slide:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[3, 5, 8, 10, 15].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => onChange({ ...current, trendingStoriesCount: cnt })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            (current.trendingStoriesCount || 5) === cnt
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {cnt} Stories
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter Dropdown */}
                  <div className="space-y-1.5 pt-1">
                    <span className="font-semibold text-slate-700 block">
                      Category Filter:
                    </span>
                    <select
                      value={current.trendingCategoryFilter || 'all'}
                      onChange={(e) =>
                        onChange({ ...current, trendingCategoryFilter: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-red-500 cursor-pointer"
                    >
                      <option value="all">🌐 All Top Trends</option>
                      <option value="देश">🇮🇳 National</option>
                      <option value="राजनीति">🏛️ Politics</option>
                      <option value="राज्य">📍 State News</option>
                      <option value="व्यापार">📈 Business & Economy</option>
                      <option value="खेल">🏏 Sports</option>
                      <option value="मनोरंजन">🎬 Entertainment</option>
                      <option value="विदेश">🌍 International</option>
                      <option value="टेक्नोलॉजी">💻 Technology</option>
                    </select>
                  </div>

                  {/* Slide Speed Option */}
                  {current.trendingSliderEnabled !== false && (
                    <div className="space-y-1.5 pt-1">
                      <span className="font-semibold text-slate-700 block">
                        Slide Duration (Speed):
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Fast (2.5s)', ms: 2500 },
                          { label: 'Normal (3.5s)', ms: 3500 },
                          { label: 'Slow (5.0s)', ms: 5000 },
                        ].map((spd) => (
                          <button
                            key={spd.ms}
                            type="button"
                            onClick={() => onChange({ ...current, trendingSlideSpeed: spd.ms })}
                            className={`py-1 px-1.5 rounded-lg text-center text-[11px] font-bold transition cursor-pointer truncate ${
                              (current.trendingSlideSpeed || 3500) === spd.ms
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {spd.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gold & Silver Rate Widget Controls */}
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
              <label className="flex items-start justify-between cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 group-hover:bg-amber-200 transition mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <span>Gold & Silver Rate Widget</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                        Daily Market
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Displays real-time 24K/22K Gold and Silver rates in the article sidebar.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.showGoldRate !== false}
                  onChange={() => handleToggle('showGoldRate')}
                  className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {current.showGoldRate !== false && (
                <div className="pt-2.5 border-t border-amber-200/60 space-y-3 bg-white p-3 rounded-xl text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Market Rates Configuration:</span>
                    <button
                      type="button"
                      onClick={handleAutoUpdateGoldRate}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto-Update Rates</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Market City / Region:
                      </label>
                      <input
                        type="text"
                        value={current.goldRateCity || 'नई दिल्ली (Delhi)'}
                        onChange={(e) => handleTextChange('goldRateCity', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-red-500"
                        placeholder="e.g. New Delhi, Mumbai, Jaipur"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        24K Gold Rate (per 10g):
                      </label>
                      <input
                        type="number"
                        value={current.goldRate24k || 78450}
                        onChange={(e) => onChange({ ...current, goldRate24k: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-medium text-slate-800 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        22K Gold Rate (per 10g):
                      </label>
                      <input
                        type="number"
                        value={current.goldRate22k || 71920}
                        onChange={(e) => onChange({ ...current, goldRate22k: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-medium text-slate-800 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Silver Rate (per 1 KG):
                      </label>
                      <input
                        type="number"
                        value={current.silverRate1kg || 92500}
                        onChange={(e) => onChange({ ...current, silverRate1kg: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-medium text-slate-800 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Rashifal Widget Controls */}
            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/20 space-y-3">
              <label className="flex items-start justify-between cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <span>Daily Rashifal (Horoscope) Widget</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                        Zodiac Symbols
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Daily astrological predictions with authentic zodiac symbols (♈, ♉, ♊...) in the sidebar.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.showRashifal !== false}
                  onChange={() => handleToggle('showRashifal')}
                  className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
              </label>

              {current.showRashifal !== false && (
                <div className="pt-2.5 border-t border-purple-200/60 space-y-3 bg-white p-3 rounded-xl text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">12 Zodiac Signs Prediction Management:</span>
                    <button
                      type="button"
                      onClick={handleAutoUpdateRashifal}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto-Update Daily Rashifal</span>
                    </button>
                  </div>

                  {/* Sign picker pills */}
                  <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1 border-b border-slate-100">
                    {OFFICIAL_ZODIAC_LIST.map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setSelectedZodiacId(z.id)}
                        className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                          selectedZodiacId === z.id
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{z.symbol}</span>
                        <span>{z.sign}</span>
                      </button>
                    ))}
                  </div>

                  {/* Single Sign Editor */}
                  <div className="space-y-2 bg-purple-50/40 p-2.5 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">{activeRashiItem.symbol}</span>
                        <span>{activeRashiItem.sign} (Ruler: {activeRashiItem.ruler})</span>
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Today's Astrological Prediction:
                      </label>
                      <textarea
                        rows={2}
                        value={activeRashiItem.prediction}
                        onChange={(e) => handleUpdateSingleRashi('prediction', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                          Lucky Number:
                        </label>
                        <input
                          type="number"
                          value={activeRashiItem.luckyNumber}
                          onChange={(e) => handleUpdateSingleRashi('luckyNumber', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                          Lucky Color:
                        </label>
                        <input
                          type="text"
                          value={activeRashiItem.luckyColor}
                          onChange={(e) => handleUpdateSingleRashi('luckyColor', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Newsletter Subscription Box */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Newsletter Subscription Box
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    1-Click email subscription box for daily morning digests and breaking alerts.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showNewsletterSubscribe !== false}
                onChange={() => handleToggle('showNewsletterSubscribe')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Interactive Opinion Poll */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Interactive Opinion Poll
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Live survey question where visitors can vote and see instant aggregated percentages.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showOpinionPoll !== false}
                onChange={() => handleToggle('showOpinionPoll')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* E-Paper Digital Edition Promo */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition mt-0.5">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    E-Paper Edition Promo Card
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Clickable card opening the interactive page-flip digital newspaper edition.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showEPaperPromo !== false}
                onChange={() => handleToggle('showEPaperPromo')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Sidebar Ad Placement */}
            <label className="flex items-start justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Sidebar 300x250 Ad Banner
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block">
                    Display Google AdSense or private direct sponsor banner in the right sidebar.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showSidebarAd !== false}
                onChange={() => handleToggle('showSidebarAd')}
                className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. OPINION POLL QUESTION CUSTOMIZATION (If Opinion Poll is Enabled) */}
      {current.showOpinionPoll !== false && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-900">
              Live Reader Opinion Poll Customization
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Poll Question / Issue:
              </label>
              <input
                type="text"
                value={current.pollQuestion || ''}
                onChange={(e) => handleTextChange('pollQuestion', e.target.value)}
                placeholder="e.g. Will digital media completely replace traditional newspapers in 2026?"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Option A (विकल्प A):
                </label>
                <input
                  type="text"
                  value={current.pollOptionA || ''}
                  onChange={(e) => handleTextChange('pollOptionA', e.target.value)}
                  placeholder="e.g. Yes, digital will dominate completely"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Option B (विकल्प B):
                </label>
                <input
                  type="text"
                  value={current.pollOptionB || ''}
                  onChange={(e) => handleTextChange('pollOptionB', e.target.value)}
                  placeholder="e.g. No, print credibility remains strong"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Option C (वैकल्पिक विकल्प C):
                </label>
                <input
                  type="text"
                  value={current.pollOptionC || ''}
                  onChange={(e) => handleTextChange('pollOptionC', e.target.value)}
                  placeholder="e.g. Both will co-exist in hybrid mode"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Option D (वैकल्पिक विकल्प D / तटस्थ):
                </label>
                <input
                  type="text"
                  value={current.pollOptionD || ''}
                  onChange={(e) => handleTextChange('pollOptionD', e.target.value)}
                  placeholder="e.g. Can't say / Neutral"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WORDPRESS-STYLE MODULAR SIDEBAR WIDGET MANAGER (ALL-IN-ONE VISIBILITY CONTROL) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-150">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span>WordPress-Style Modular Widget Manager</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                  फुल कस्टमाइजेशन
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                वर्डप्रेस की तरह साइडबार के किसी भी विजेट या विज्ञापन को एक क्लिक में दिखाएं या छिपाएं:
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Active Widgets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            {
              id: 'showTrendingNews',
              title: 'ट्रेंडिंग ख़बरें (Trending Slider)',
              desc: 'नीचे से ऊपर ऑटो-स्लाइडिंग',
              icon: TrendingUp,
              active: current.showTrendingNews !== false,
              color: 'text-red-600 bg-red-50',
            },
            {
              id: 'showGoldRate',
              title: 'सोने-चांदी का भाव (Gold Rate)',
              desc: 'लाइव 24K/22K व चांदी बाज़ार दर',
              icon: Coins,
              active: current.showGoldRate !== false,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              id: 'showRashifal',
              title: 'दैनिक राशिफल (Horoscope)',
              desc: '12 राशियां आधिकारिक चिह्नों सहित',
              icon: Compass,
              active: current.showRashifal !== false,
              color: 'text-purple-600 bg-purple-50',
            },
            {
              id: 'showOpinionPoll',
              title: 'ओपिनियन पोल (Reader Poll)',
              desc: 'लाइव वोटिंग व प्रतिशत परिणाम',
              icon: HelpCircle,
              active: current.showOpinionPoll !== false,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              id: 'showSidebarAd',
              title: 'विज्ञापन स्लॉट (Sidebar Ads)',
              desc: 'गूगल या निजी प्रायोजक बैनर',
              icon: DollarSign,
              active: current.showSidebarAd !== false,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              id: 'showNewsletterSubscribe',
              title: 'न्यूज़लेटर (Newsletter Box)',
              desc: 'ईमेल अलर्ट्स व डेली बुलेटिन',
              icon: Mail,
              active: current.showNewsletterSubscribe !== false,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              id: 'showEPaperPromo',
              title: 'ई-पेपर प्रोमो (E-Paper Promo)',
              desc: 'डिजिटल अखबार सीधा लिंक',
              icon: Newspaper,
              active: current.showEPaperPromo !== false,
              color: 'text-indigo-600 bg-indigo-50',
            },
          ].map((widget) => {
            const Icon = widget.icon;
            return (
              <div
                key={widget.id}
                onClick={() => handleToggle(widget.id as any)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between select-none ${
                  widget.active
                    ? 'border-slate-300 bg-slate-50/60 shadow-2xs hover:border-slate-400'
                    : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${widget.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {widget.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {widget.desc}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      widget.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {widget.active ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
