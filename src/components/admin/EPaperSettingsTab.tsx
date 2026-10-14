import React, { useState } from 'react';
import {
  Newspaper,
  Upload,
  FileText,
  Image,
  Share2,
  Download,
  Calendar,
  CheckCircle2,
  Check,
  Sparkles,
  ExternalLink,
  Eye,
  Sliders,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { PortalSettings, EPaperSettings } from '../../types/news';
import { DEFAULT_EPAPER_SETTINGS } from '../../data/portalDefaults';
import { getTodayHindiDate } from '../../utils/hindiHelpers';

interface EPaperSettingsTabProps {
  settings: PortalSettings;
  onChange: (updated: PortalSettings) => void;
}

export const EPaperSettingsTab: React.FC<EPaperSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const currentEpaper: EPaperSettings = {
    ...DEFAULT_EPAPER_SETTINGS,
    ...(settings.epaperSettings || {}),
  };

  const [epaperConfig, setEpaperConfig] = useState<EPaperSettings>(currentEpaper);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const todayHindi = getTodayHindiDate();

  const handleUpdate = (updates: Partial<EPaperSettings>) => {
    const updated = {
      ...epaperConfig,
      ...updates,
    };
    setEpaperConfig(updated);
    onChange({
      ...settings,
      epaperSettings: updated,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'customPdfUrl' | 'customPdfThumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleUpdate({ [field]: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-red-900/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-red-300">
              <Newspaper className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base sm:text-lg tracking-tight text-white font-kd-headline">
              ई-पेपर प्रबंधन एवं दैनिक संस्करण (E-Paper Studio)
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
              2 OPTIONS READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            तय करें कि वेबसाइट पर उस दिन की सभी खबरों का ऑटो-जनरेटेड अखबार दिखेगा या फिर आप अपनी तैयार की हुई प्रिंट ई-पेपर PDF और आकर्षक कवर थंबनेल अपलोड करना चाहते हैं।
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>सेटिंग्स सुरक्षित हुईं</span>
          </div>
        )}
      </div>

      {/* 2. Primary Mode Selection (Option A vs Option B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Dynamic Auto-Generated Edition */}
        <div
          onClick={() => handleUpdate({ mode: 'dynamic' })}
          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
            epaperConfig.mode === 'dynamic'
              ? 'border-red-600 bg-red-50/40 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                विकल्प 1 • स्वचालित (Auto Dynamic)
              </span>
              <input
                type="radio"
                name="epaper_mode"
                checked={epaperConfig.mode === 'dynamic'}
                onChange={() => handleUpdate({ mode: 'dynamic' })}
                className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
              />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              वेबसाइट की उस दिन की खबरों का ई-पेपर
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              पोर्टल पर प्रकाशित दिनभर की प्रमुख खबरों को स्वतः अखबारी 4-पृष्ठीय ब्रॉडशीट व मोबाइल लेआउट में तैयार करता है। पाठक इसे ऑनलाइन पढ़ सकते हैं और हाई-रेजोल्यूशन PDF डाउनलोड कर सकते हैं।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ज़िरो मेहनत • स्वचालित लाइव अपडेट</span>
          </div>
        </div>

        {/* Option 2: Custom Uploaded Print PDF */}
        <div
          onClick={() => handleUpdate({ mode: 'custom_pdf' })}
          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
            epaperConfig.mode === 'custom_pdf'
              ? 'border-red-600 bg-red-50/40 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                विकल्प 2 • कस्टम PDF अपलोड
              </span>
              <input
                type="radio"
                name="epaper_mode"
                checked={epaperConfig.mode === 'custom_pdf'}
                onChange={() => handleUpdate({ mode: 'custom_pdf' })}
                className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
              />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              बना हुआ मुद्रित ई-पेपर PDF अपलोड करें
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              अपनी प्रेस/डिजाइन टीम द्वारा तैयार किया गया पूरा अखबार PDF फाइल अपलोड करें। आकर्षक मुख्य पृष्ठ (Cover Thumbnail), संस्करण, पृष्ठ संख्या और शीर्षक सेट करें।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>मुद्रित अख़बार • असली प्रिन्ट अनुभव</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Customization Form & Live Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-sm text-slate-900 font-kd-headline">
                संस्करण विवरण एवं फाइल सेटिंग्स
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              दैनिक प्रकाशन: {todayHindi}
            </span>
          </div>

          <div className="space-y-4">
            {/* Edition Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ई-पेपर का शीर्षक (Edition Title)
              </label>
              <input
                type="text"
                value={epaperConfig.customPdfTitle || ''}
                onChange={(e) => handleUpdate({ customPdfTitle: e.target.value })}
                placeholder="खबरी दोस्त • दैनिक राष्ट्रीय समाचार पत्र"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* City Edition & Total Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  संस्करण / शहर का नाम (City / Edition)
                </label>
                <input
                  type="text"
                  value={epaperConfig.customPdfEdition || ''}
                  onChange={(e) => handleUpdate({ customPdfEdition: e.target.value })}
                  placeholder="राष्ट्रीय संस्करण (नई दिल्ली)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  कुल पृष्ठ संख्या (Total Pages)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={epaperConfig.customPdfPageCount || 8}
                  onChange={(e) =>
                    handleUpdate({ customPdfPageCount: parseInt(e.target.value) || 4 })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Featured Front-Page Headline */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                मुख्य पृष्ठ की प्रमुख सुर्खी (Lead Headline)
              </label>
              <input
                type="text"
                value={epaperConfig.featuredHeadline || ''}
                onChange={(e) => handleUpdate({ featuredHeadline: e.target.value })}
                placeholder="गगनयान मिशन के क्रू मॉड्यूल का सफल परीक्षण, अंतरिक्ष में भारत की ऐतिहासिक छलांग"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Custom PDF URL or Upload */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>ई-पेपर PDF फाइल (PDF Upload / Direct URL)</span>
                </label>
                <label className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>PDF चुनें</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'customPdfUrl')}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={epaperConfig.customPdfUrl || ''}
                onChange={(e) => handleUpdate({ customPdfUrl: e.target.value })}
                placeholder="https://yourserver.com/daily-editions/epaper-2026-today.pdf"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-500">
                आप सीधे डिवाइस से PDF चुन सकते हैं या अपनी वेबसाइट/ड्राइव का वैध PDF लिंक दर्ज कर सकते हैं।
              </p>
            </div>

            {/* Front-page Thumbnail Image */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Image className="w-4 h-4 text-amber-600" />
                  <span>मुख्य पृष्ठ कवर थंबनेल (Attractive Front Page Thumbnail)</span>
                </label>
                <label className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>फोटो चुनें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'customPdfThumbnail')}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={epaperConfig.customPdfThumbnail || ''}
                onChange={(e) => handleUpdate({ customPdfThumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/... (अखबार का मुख्य पृष्ठ फोटो)"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-500">
                यह आकर्षक थंबनेल पाठकों को ई-पेपर देखने और आकर्षित होकर पढ़ने के लिए प्रेरित करेगा।
              </p>
            </div>

            {/* Download & Share permissions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    PDF डाउनलोड की अनुमति दें
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    पाठक अपने फोन/कंप्यूटर पर PDF सेव कर सकें
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={epaperConfig.allowDownload !== false}
                  onChange={(e) => handleUpdate({ allowDownload: e.target.checked })}
                  className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    सोशल शेयरिंग बटन दिखाएं
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    WhatsApp व Telegram पर ई-पेपर शेयर करने का विकल्प
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={epaperConfig.allowShare !== false}
                  onChange={(e) => handleUpdate({ allowShare: e.target.checked })}
                  className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Live Attractive E-Paper Card Preview */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-red-600" />
                <span>लाइव पाठक प्रीव्यू (Live Card)</span>
              </span>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded uppercase">
                {epaperConfig.mode === 'dynamic' ? 'Dynamic' : 'Custom PDF'}
              </span>
            </div>

            {/* Newspaper Front Page Mockup Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md">
              <div className="relative aspect-[3/4] bg-slate-800 overflow-hidden">
                <img
                  src={
                    epaperConfig.customPdfThumbnail ||
                    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="E-Paper Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    आज का अंक
                  </span>
                  <span className="bg-black/70 backdrop-blur-xs text-slate-200 px-2 py-0.5 rounded-full border border-white/20">
                    {epaperConfig.customPdfPageCount || 8} पृष्ठ
                  </span>
                </div>

                {/* Masthead & Headline on Thumbnail */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                  <div className="text-xs font-black tracking-tight text-white/90 uppercase font-kd-headline border-b border-white/20 pb-1">
                    {epaperConfig.customPdfTitle || 'खबरी दोस्त'}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 font-kd-headline">
                    {epaperConfig.featuredHeadline ||
                      'गगनयान मिशन के क्रू मॉड्यूल का सफल परीक्षण, अंतरिक्ष में भारत की ऐतिहासिक छलांग'}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-kd-meta">
                    {epaperConfig.customPdfEdition || 'राष्ट्रीय संस्करण'} • {todayHindi}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-900/90 space-y-2">
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  <div className="bg-red-600 text-white py-1.5 px-2 rounded-lg text-center flex items-center justify-center space-x-1 shadow-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>ई-पेपर पढ़ें</span>
                  </div>
                  <div className="bg-slate-800 text-slate-200 py-1.5 px-2 rounded-lg text-center flex items-center justify-center space-x-1 border border-slate-700">
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF सेव</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>शेयर: WhatsApp / Telegram</span>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
