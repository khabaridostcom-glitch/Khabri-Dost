import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Calendar,
  Share2,
  Check,
  EyeOff,
  BookOpen,
  Smartphone,
  Maximize2,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  FileText,
  Eye,
} from 'lucide-react';
import { getTodayHindiDate } from '../utils/hindiHelpers';
import { PortalSettings } from '../types/news';
import { downloadDailyEPaperPdf } from '../utils/pdfGenerator';

interface EPaperModalProps {
  onClose: () => void;
  portalSettings?: PortalSettings;
}

export const EPaperModal: React.FC<EPaperModalProps> = ({ onClose, portalSettings }) => {
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<'broadsheet' | 'mobile'>('broadsheet');

  const epaperSettings = portalSettings?.epaperSettings;
  const [editionSource, setEditionSource] = useState<'dynamic' | 'custom_pdf'>(
    epaperSettings?.mode || 'dynamic'
  );
  const todayDate = getTodayHindiDate();

  const hf = portalSettings?.headerFooter;
  const siteTitle = hf?.siteTitle || 'खबरी दोस्त';
  const siteTagline = hf?.siteTagline || 'राष्ट्र का सबसे विश्वसनीय एवं निष्पक्ष दैनिक हिंदी समाचार पत्र';
  const showRni = hf?.showRniNumber === true && Boolean(hf?.rniNumber);
  const rniText = showRni ? `RNI No: ${hf.rniNumber}` : null;
  const contactAddress = hf?.contactAddress || 'प्रेस एंक्लेव, नई दिल्ली - 110001';
  const contactEmail = hf?.contactEmail || 'khabridost.com@gmail.com';

  // Automatically adjust view mode on small mobile screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setViewMode('mobile');
    }
  }, []);

  // Handle ESC key to close/hide
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      if (editionSource === 'custom_pdf' && epaperSettings?.customPdfUrl) {
        const link = document.createElement('a');
        link.href = epaperSettings.customPdfUrl;
        link.download = `KhabriDost-EPaper-${new Date().toISOString().slice(0, 10)}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await downloadDailyEPaperPdf(portalSettings);
      }
    } catch (err) {
      console.error('PDF error:', err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *${siteTitle} • दैनिक ई-पेपर*\n\nआज का पूरा अखबार ऑनलाइन पढ़ें या PDF डाउनलोड करें:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`${siteTitle} • दैनिक ई-पेपर (आज का अंक)`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pagesInfo = [
    { p: 1, title: 'मुख्य पृष्ठ (Front Page)', badge: 'Lead Story', color: 'bg-red-600' },
    { p: 2, title: 'देश एवं राजनीति (Nation)', badge: 'National', color: 'bg-blue-700' },
    { p: 3, title: 'व्यापार व खेल (Business & Sports)', badge: 'Markets', color: 'bg-emerald-700' },
    { p: 4, title: 'संपादकीय व विचार (Editorial)', badge: 'Opinion', color: 'bg-amber-700' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white text-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-300 flex flex-col h-[96vh] sm:max-h-[92vh]">
        {/* Controls Toolbar */}
        <div className="bg-slate-900 text-white px-3 sm:px-5 py-2.5 sm:py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base font-kd-headline text-white tracking-tight">
                  {siteTitle} • ई-पेपर (E-Paper)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-kd-meta truncate max-w-xs sm:max-w-md">
                {todayDate} • नई दिल्ली एडिशन {rniText ? `• ${rniText}` : ''} (4 पृष्ठ)
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {/* View Mode Switcher (Broadsheet vs Mobile) */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('broadsheet')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'broadsheet'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="अखबार ब्रॉडशीट पृष्ठ देखें"
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">ब्रॉडशीट</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                  viewMode === 'mobile'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="आसान मोबाइल समाचार रीडिंग मोड"
              >
                <Smartphone className="w-3 h-3" />
                <span>मोबाइल व्यू</span>
              </button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition cursor-pointer"
                title="पिछला पृष्ठ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-1.5 font-bold font-mono text-[11px]">
                पेज {page}/4
              </div>
              <button
                onClick={() => setPage(Math.min(4, page + 1))}
                disabled={page === 4}
                className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition cursor-pointer"
                title="अगला पृष्ठ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls for broadsheet mode */}
            {viewMode === 'broadsheet' && (
              <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                <button
                  onClick={() => setZoom(Math.max(0.65, zoom - 0.1))}
                  className="p-1 hover:bg-slate-700 rounded transition cursor-pointer"
                  title="ज़ूम कम करें"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[10px] font-mono">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}
                  className="p-1 hover:bg-slate-700 rounded transition cursor-pointer"
                  title="ज़ूम बढ़ाएं"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center space-x-1 shadow-xs disabled:opacity-60"
              title="पूरा ई-पेपर PDF में डाउनलोड करें"
            >
              {isDownloadingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="hidden sm:inline">PDF बन रही है...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF डाउनलोड</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg text-xs transition cursor-pointer hidden sm:flex items-center space-x-1"
              title="प्रिंट निकालें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white p-1.5 rounded-lg text-xs transition cursor-pointer flex items-center space-x-1 shadow-2xs"
              title="WhatsApp पर ई-पेपर शेयर करें"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span className="hidden md:inline font-bold">WhatsApp</span>
            </button>

            {/* Telegram Share Button */}
            <button
              onClick={handleShareTelegram}
              className="bg-[#0088cc] hover:bg-[#0077b5] text-white p-1.5 rounded-lg text-xs transition cursor-pointer hidden md:flex items-center space-x-1 shadow-2xs"
              title="Telegram पर ई-पेपर शेयर करें"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
              </svg>
              <span className="font-bold">Telegram</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg text-xs transition cursor-pointer hidden sm:flex items-center space-x-1"
              title="लिंक साझा करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs cursor-pointer ml-0.5"
              title="ई-पेपर बंद करें (ESC)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">बंद करें</span>
            </button>
          </div>
        </div>

        {/* Edition Mode Switcher Bar (Option 1: Dynamic Portal News vs Option 2: Uploaded Print PDF) */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setEditionSource('dynamic')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                editionSource === 'dynamic'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>विकल्प 1: आज का डायनामिक ई-पेपर (Portal News)</span>
            </button>

            <button
              onClick={() => setEditionSource('custom_pdf')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                editionSource === 'custom_pdf'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>विकल्प 2: मुद्रित PDF संस्करण (Print PDF Issue)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400 font-kd-meta">
            <span>दैनिक अंक: {todayDate}</span>
          </div>
        </div>

        {/* If Custom PDF mode is selected: Attractive Full Issue Showcase */}
        {editionSource === 'custom_pdf' ? (
          <div className="flex-1 overflow-auto bg-slate-900 p-3 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-2">
              {/* Left Column: Front Page Cover Mockup */}
              <div className="relative aspect-[3/4] md:aspect-auto bg-slate-950 overflow-hidden flex items-center justify-center group min-h-[360px]">
                <img
                  src={
                    epaperSettings?.customPdfThumbnail ||
                    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="E-Paper Front Page"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Badges on Cover */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    प्रिंट संस्करण
                  </span>
                  <span className="bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-mono border border-white/20">
                    {epaperSettings?.customPdfPageCount || 8} पृष्ठ
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[11px] text-amber-300 font-bold uppercase font-kd-meta">
                    {epaperSettings?.customPdfEdition || 'राष्ट्रीय संस्करण'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-kd-headline text-white leading-snug">
                    {epaperSettings?.featuredHeadline || 'दैनिक खबरी दोस्त • आज का पूरा अंक'}
                  </h3>
                </div>
              </div>

              {/* Right Column: Details, Download & Share */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-50">
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider font-kd-meta">
                      आधिकारिक ई-अखबार
                    </span>
                    <h2 className="text-2xl font-black font-kd-headline text-slate-950 mt-1">
                      {epaperSettings?.customPdfTitle || siteTitle}
                    </h2>
                    <p className="text-xs text-slate-500 font-kd-meta mt-1">
                      {todayDate} • {epaperSettings?.customPdfEdition || 'राष्ट्रीय संस्करण'}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-kd-body">
                    <p>
                      ✓ आज के सभी पृष्ठों (Front Page, देश, व्यापार, खेल, संपादकीय) का पूरा अखबारी PDF संस्करण उपलब्ध है।
                    </p>
                    <p>
                      ✓ आप इसे सीधे डाउनलोड करके ऑफलाइन पढ़ सकते हैं या WhatsApp व Telegram पर साझा कर सकते हैं।
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 font-kd-meta block uppercase">कुल पृष्ठ</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {epaperSettings?.customPdfPageCount || 8} Pages
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 font-kd-meta block uppercase">फॉर्मेट</span>
                      <span className="text-base font-bold text-red-600 font-mono">
                        High-Res PDF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons Bar */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>PDF डाउनलोड हो रही है...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>पूरा ई-पेपर PDF डाउनलोड करें</span>
                      </>
                    )}
                  </button>

                  {epaperSettings?.customPdfUrl && (
                    <a
                      href={epaperSettings.customPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ब्राउज़र PDF रीडर में खोलें</span>
                    </a>
                  )}

                  {/* Social Share Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleShareWhatsApp}
                      className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-xs shadow-2xs cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleShareTelegram}
                      className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition text-xs shadow-2xs cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                      </svg>
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {pagesInfo.map((item) => (
              <button
                key={item.p}
                onClick={() => setPage(item.p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                  page === item.p
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                <span>पेज {item.p}: {item.title}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center text-[11px] text-slate-500 font-kd-meta space-x-3">
            <span>वर्ष 1 • अंक 245</span>
            {rniText && <span className="font-mono text-slate-700 font-bold">{rniText}</span>}
          </div>
        </div>

        {/* Dynamic Content Area: Either Broadsheet or Mobile Reader */}
        <div className="flex-1 overflow-auto bg-slate-200/70 p-2 sm:p-5 flex justify-center">
          {viewMode === 'mobile' ? (
            /* MOBILE / COMFORT READER MODE */
            <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-3.5 sm:p-6 shadow-md border border-slate-300 font-kd-body space-y-5">
              {/* Mobile Masthead */}
              <div className="border-b-2 border-red-600 pb-3 text-center">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-kd-meta pb-1">
                  <span>{todayDate}</span>
                  {rniText ? (
                    <span className="font-mono font-bold text-red-700">{rniText}</span>
                  ) : (
                    <span className="font-bold text-red-700">ई-पेपर</span>
                  )}
                  <span>पेज {page} / 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-kd-header text-slate-950 mt-1">
                  {siteTitle}
                </h2>
                <p className="text-xs text-red-700 font-medium font-kd-meta mt-0.5">
                  {siteTagline}
                </p>
              </div>

              {/* Page Content in Mobile Cards */}
              {page === 1 && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      मुख्य समाचार • Lead Story
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-kd-headline text-slate-950 mt-1.5 leading-snug">
                      गगनयान मिशन के क्रू मॉड्यूल का सफल परीक्षण, अंतरिक्ष में भारत की ऐतिहासिक छलांग
                    </h3>
                    <p className="text-xs text-slate-500 font-kd-meta mt-1">
                      विशेष संवाददाता | नई दिल्ली • {todayDate}
                    </p>
                    <img
                      src="https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=1000&auto=format&fit=crop&q=80"
                      alt="ISRO Gaganyaan"
                      className="w-full h-48 sm:h-60 object-cover rounded-lg mt-2.5 border border-slate-200"
                    />
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 mt-3 font-kd-body">
                      <p>
                        <strong>नई दिल्ली।</strong> भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने महत्वाकांक्षी गगनयान मिशन के लिए बड़ा मील का पत्थर हासिल किया है। क्रू एस्केप सिस्टम और पैराशूट रिकवरी प्रणाली का एकीकृत परीक्षण अत्यंत सफलता के साथ संपन्न हुआ।
                      </p>
                      <p>
                        परीक्षण के दौरान सभी सुरक्षा पैरामीटर सामान्य पाए गए और कैप्सूल सुरक्षित तरीके से बंगाल की खाड़ी में तय स्थान पर उतरा। नौसेना की विशेषज्ञ टीम ने उसे तत्परता से रिकवर किया।
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-red-600 uppercase">बड़ी ख़बर • खेल</span>
                    <h4 className="text-sm font-bold font-kd-headline text-slate-900 leading-snug">
                      टी-20 वर्ल्ड कप सेमीफाइनल: भारत ने ऑस्ट्रेलिया को हराया, फाइनल में प्रवेश
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-kd-body">
                      अंतिम ओवर में रिंकू सिंह और हार्दिक के शानदार प्रदर्शन से टीम इंडिया फाइनल में पहुंची, पूरे देश में जश्न का माहौल।
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">अर्थव्यवस्था व शेयर बाजार</span>
                    <h4 className="text-sm font-bold font-kd-headline text-slate-900 leading-snug">
                      सेंसेक्स 685 अंक चढ़ा, निफ्टी 24,850 के नए शिखर के पार
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-kd-body">
                      विदेशी संस्थागत निवेशकों की मजबूत लिवाली से बाजार में शानदार उछाल देखा गया। ऑटो व आईटी सेक्टर चमके।
                    </p>
                  </div>
                </div>
              )}

              {page === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                    <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      पेज 2 • देश एवं राष्ट्रीय राजनीति
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-kd-headline text-slate-950 mt-1.5 leading-snug">
                      संसद के बजट सत्र में जन-कल्याणकारी विधेयकों पर गहन बहस, डिजिटल इंफ्रास्ट्रक्चर पर जोर
                    </h3>
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 mt-3 font-kd-body">
                      <p>
                        <strong>नई दिल्ली ब्यूरो।</strong> संसद के चालू सत्र में आज ग्रामीण विकास, डिजिटल साक्षरता और युवाओं के रोजगार को प्रोत्साहन देने वाली प्रमुख बजट योजनाओं और नियमों पर सार्थक चर्चा हुई। वित्त मंत्री ने सदन को आश्वस्त किया कि देश की अर्थव्यवस्था 7.2% की वार्षिक दर से मजबूत बनी हुई है।
                      </p>
                      <p>
                        राष्ट्रीय राजमार्गों के विस्तार के लिए अतिरिक्त 25,000 करोड़ का आवंटन और डिजिटल इंडिया 2.0 के तहत 1 लाख नई ग्राम पंचायतों में 5G फाइबर कनेक्टिविटी का लक्ष्य तय किया गया है।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {page === 3 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      पेज 3 • व्यापार, बाज़ार एवं खेल
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-kd-headline text-slate-950 mt-1.5 leading-snug">
                      भारतीय मैन्युफैक्चरिंग सेक्टर में रिकॉर्ड निर्यात, ऑटोमोबाइल और इलेक्ट्रॉनिक्स में भारी तेजी
                    </h3>
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 mt-3 font-kd-body">
                      <p>
                        वैश्विक बाजार में भारतीय सामानों की मांग तेजी से बढ़ रही है। वाणिज्य मंत्रालय के अनुसार इस तिमाही में व्यापार घाटे में उल्लेखनीय कमी दर्ज की गई है।
                      </p>
                      <p>
                        घरेलू क्रिकेट में भारतीय टीम ने लगातार 18वीं द्विपक्षीय सीरीज जीतकर नया कीर्तिमान स्थापित किया।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {page === 4 && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                    <span className="bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      पेज 4 • संपादकीय एवं वैचारिक विमर्श
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-kd-headline text-slate-950 mt-1.5 leading-snug">
                      डिजिटल लोकतंत्र में निष्पक्ष पत्रकारिता और जन-सरोकारों की पुनर्स्थापना
                    </h3>
                    <div className="text-xs text-slate-800 leading-relaxed space-y-2 mt-3 font-kd-body">
                      <p>
                        सूचना के इस तीव्र प्रवाह में भ्रामक खबरों और सनसनीखेज रिपोर्टिंग से हटकर तथ्य-आधारित एवं जनहितैषी पत्रकारिता की आवश्यकता पहले से कहीं अधिक बढ़ गई है।
                      </p>
                      <p>
                        खबरी दोस्त अपनी स्थापना के समय से ही राष्ट्रहित, सत्यनिष्ठा और नागरिक अधिकारों की रक्षा के प्रति संकल्पबद्ध है। संपादकीय स्वतंत्रता और पारदर्शी नीतियों के बल पर ही एक स्वस्थ लोकतंत्र का निर्माण संभव है।
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* BROADSHEET CLASSIC NEWSPAPER VIEW */
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                width: '100%',
                maxWidth: '820px',
              }}
              className="bg-white text-slate-900 p-4 sm:p-8 lg:p-10 shadow-2xl rounded-sm transition-transform duration-200 border border-slate-300 font-kd-body ring-1 ring-slate-200 self-start"
            >
              {/* Newspaper Masthead */}
              <div className="border-b-4 border-slate-900 pb-3 mb-4 text-center">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-700 border-b border-slate-300 pb-1 mb-2 font-kd-meta flex-wrap gap-1">
                  <span className="font-semibold">
                    वर्ष 1 • अंक 245 {rniText ? `• ${rniText}` : ''}
                  </span>
                  <span className="font-bold text-red-700">नई दिल्ली • {todayDate}</span>
                  <span>पृष्ठ {page} / 4 • ई-पेपर</span>
                </div>

                <div className="py-1">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-kd-header tracking-wider text-slate-950">
                    {siteTitle}
                  </h1>
                  <p className="text-[11px] sm:text-xs font-bold tracking-widest text-red-600 uppercase mt-1 font-kd-meta">
                    {siteTagline}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-500 border-t border-slate-200 pt-1 mt-1 font-kd-meta flex-wrap gap-1">
                  <span>कार्यालय: {contactAddress}</span>
                  <span>ईमेल: {contactEmail}</span>
                  <span>वेबसाइट: khabridost.com</span>
                </div>
              </div>

              {/* DYNAMIC BROADSHEET PAGE CONTENT */}
              {page === 1 && (
                <div className="space-y-6">
                  {/* Lead Headline Story */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Left 2 Cols: Main Lead Story */}
                    <div className="md:col-span-2 space-y-3.5 border-r md:pr-5 border-slate-200">
                      <div className="border-b border-slate-200 pb-2">
                        <span className="bg-red-600 text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider">
                          पेज 1 • मुख्य समाचार (Lead Story)
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-kd-headline mt-2 leading-tight text-slate-950">
                          गगनयान मिशन के क्रू मॉड्यूल का सफल परीक्षण, अंतरिक्ष में भारत की ऐतिहासिक छलांग
                        </h2>
                        <p className="text-[11px] text-slate-500 italic mt-1 font-kd-meta">
                          श्रीहरिकोटा ब्यूरो • विशेष संवाददाता द्वारा | नई दिल्ली
                        </p>
                      </div>

                      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                        <img
                          src="https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=1000&auto=format&fit=crop&q=80"
                          alt="ISRO Gaganyaan"
                          className="w-full h-44 sm:h-52 object-cover"
                        />
                        <div className="bg-slate-50 p-2 text-[10px] sm:text-[11px] text-slate-600 italic border-t border-slate-200">
                          इसरो द्वारा गगनयान मिशन के क्रू मॉड्यूल परीक्षण का विहंगम दृश्य (फोटो: इसरो)
                        </div>
                      </div>

                      <div className="text-xs leading-relaxed space-y-2 text-justify columns-1 sm:columns-2 gap-4 text-slate-800 font-kd-body">
                        <p>
                          <strong>नई दिल्ली।</strong> भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने आज अपने महत्वाकांक्षी गगनयान मिशन के लिए एक बड़ा मील का पत्थर हासिल किया है। क्रू एस्केप सिस्टम और पैराशूट रिकवरी प्रणाली का एकीकृत परीक्षण अत्यंत सफलता के साथ संपन्न हुआ।
                        </p>
                        <p>
                          परीक्षण के दौरान सभी सुरक्षा पैरामीटर सामान्य पाए गए और कैप्सूल सुरक्षित तरीके से बंगाल की खाड़ी में तय स्थान पर उतरा। नौसेना की विशेषज्ञ टीम ने उसे तत्परता से रिकवर किया।
                        </p>
                        <p>
                          इसरो प्रमुख ने पुष्टि की कि इस सफल परीक्षण के बाद अब मानवयुक्त उड़ान से पूर्व दो मानवरहित मिशन पूरे किए जाएंगे, जिनमें व्योममित्र रोबोट शामिल होगा।
                        </p>
                      </div>
                    </div>

                    {/* Right Col: Secondary stories & briefs */}
                    <div className="space-y-4">
                      <div className="bg-red-50/80 p-3 rounded-lg border border-red-200">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">बड़ी ख़बर • खेल</span>
                        <h4 className="font-bold text-xs sm:text-sm font-kd-headline mt-1 leading-snug text-slate-900">
                          टी-20 वर्ल्ड कप सेमीफाइनल: भारत ने ऑस्ट्रेलिया को हराया
                        </h4>
                        <p className="text-[11px] text-slate-700 mt-1 leading-snug font-kd-body">
                          अंतिम ओवर में रिंकू सिंह के दो छक्कों से टीम इंडिया फाइनल में पहुंची, पूरे देश में जश्न का माहौल।
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">अर्थव्यवस्था</span>
                        <h4 className="font-bold text-xs sm:text-sm font-kd-headline mt-1 leading-snug text-slate-900">
                          सेंसेक्स 685 अंक चढ़ा, निफ्टी 24,850 के पार
                        </h4>
                        <p className="text-[11px] text-slate-700 mt-1 leading-snug font-kd-body">
                          विदेशी निवेशकों की मजबूत लिवाली से बाजार में शानदार उछाल देखा गया।
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">संपादकीय दृष्टि</span>
                        <p className="text-xs italic text-slate-800 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 font-kd-body">
                          "सच्ची पत्रकारिता जन-सरोकारों से जन्म लेती है। डिजिटल युग में भी सत्य, तथ्य और निष्पक्षता ही समाचार की वास्तविक आत्मा है।"
                        </p>
                        <p className="text-[11px] text-right font-bold text-slate-700 mt-1 font-kd-meta">
                          — प्रधान संपादक, {siteTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {page === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="bg-slate-900 text-white font-bold text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                      पेज 2 • देश एवं राष्ट्रीय राजनीति
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-kd-headline mt-2 leading-tight text-slate-950">
                      संसद के बजट सत्र में जन-कल्याणकारी विधेयकों पर गहन बहस, डिजिटल इंफ्रास्ट्रक्चर पर जोर
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-800 leading-relaxed text-justify font-kd-body">
                    <div className="space-y-3">
                      <p>
                        <strong>नई दिल्ली ब्यूरो।</strong> संसद के चालू सत्र में आज ग्रामीण विकास, डिजिटल साक्षरता और युवाओं के रोजगार को प्रोत्साहन देने वाली प्रमुख बजट योजनाओं और नियमों पर चर्चा हुई। वित्त मंत्री ने सदन को आश्वस्त किया कि देश की अर्थव्यवस्था 7.2% की वार्षिक दर से मजबूत बनी हुई है।
                      </p>
                      <p>
                        विपक्ष ने महंगाई और कृषि क्षेत्र की चुनौतियों पर प्रश्न उठाए, जिस पर सरकार ने विस्तृत आंकड़े प्रस्तुत करते हुए कहा कि खाद्यान्न का पर्याप्त बफर स्टॉक उपलब्ध है।
                      </p>
                    </div>
                    <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-sm text-slate-950 font-kd-headline">मुख्य बिंदु एवं विश्लेषण</h3>
                      <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-700">
                        <li>राष्ट्रीय राजमार्गों के विस्तार के लिए अतिरिक्त 25,000 करोड़ का आवंटन।</li>
                        <li>डिजिटल इंडिया 2.0 के तहत 1 लाख नई ग्राम पंचायतों में 5G फाइबर कनेक्टिविटी।</li>
                        <li>महिला स्वयं सहायता समूहों के लिए रियायती ब्याज दर पर ऋण सुविधा।</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {page === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                      पेज 3 • व्यापार, बाज़ार एवं खेल
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-kd-headline mt-2 leading-tight text-slate-950">
                      भारतीय मैन्युफैक्चरिंग सेक्टर में रिकॉर्ड निर्यात, ऑटोमोबाइल और इलेक्ट्रॉनिक्स में तेजी
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-800 font-kd-body">
                    <div className="space-y-2 border-r md:pr-4 border-slate-200">
                      <h4 className="font-bold text-slate-950 text-sm font-kd-headline">शेयर बाजार समीक्षा</h4>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        बैंकिंग एवं आईटी शेयरों में जोरदार खरीदारी से निफ्टी नए सर्वकालिक शिखर पर बंद हुआ। विदेशी संस्थागत निवेशकों (FII) ने शुद्ध 1,840 करोड़ के शेयर खरीदे।
                      </p>
                    </div>
                    <div className="space-y-2 border-r md:pr-4 border-slate-200">
                      <h4 className="font-bold text-slate-950 text-sm font-kd-headline">क्रिकेट एवं खेल जगत</h4>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        भारतीय क्रिकेट टीम ने घरेलू मैदान पर लगातार 18वीं द्विपक्षीय सीरीज जीतकर नया विश्व कीर्तिमान स्थापित किया। कप्तान ने युवा खिलाड़ियों के प्रदर्शन को सराहा।
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 text-sm font-kd-headline">स्टार्टअप एवं तकनीक</h4>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        भारतीय एआई एवं डीप-टेक स्टार्टअप्स ने इस तिमाही में 1.2 बिलियन डॉलर की नई फंडिंग हासिल की। भारत वैश्विक नवाचार सूचकांक में लगातार ऊपर चढ़ रहा है।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {page === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="bg-amber-700 text-white font-bold text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                      पेज 4 • संपादकीय एवं वैचारिक विमर्श
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-kd-headline mt-2 leading-tight text-slate-950">
                      डिजिटल लोकतंत्र में निष्पक्ष पत्रकारिता और जन-सरोकारों की पुनर्स्थापना
                    </h2>
                  </div>

                  <div className="text-xs text-slate-800 leading-relaxed text-justify space-y-3 columns-1 sm:columns-2 gap-6 font-kd-body">
                    <p>
                      सूचना के इस तीव्र प्रवाह में भ्रामक खबरों और सनसनीखेज रिपोर्टिंग से हटकर तथ्य-आधारित एवं जनहितैषी पत्रकारिता की आवश्यकता पहले से कहीं अधिक बढ़ गई है। {siteTitle} अपनी स्थापना के समय से ही राष्ट्रहित, सत्यनिष्ठा और नागरिक अधिकारों की रक्षा के प्रति संकल्पबद्ध है।
                    </p>
                    <p>
                      जब समाज का अंतिम व्यक्ति अपनी समस्या को लेकर हमारे पन्नों पर देखता है, तभी एक समाचार पत्र का वास्तविक दायित्व पूरा होता है। संपादकीय स्वतंत्रता और पारदर्शी नीतियों के बल पर ही एक स्वस्थ लोकतंत्र का निर्माण संभव है।
                    </p>
                  </div>
                </div>
              )}

              {/* Paper Bottom Footer & Page Navigator */}
              <div className="border-t-2 border-slate-900 mt-8 pt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2 font-kd-meta">
                <div>
                  प्रकाशक: {siteTitle} डिजिटल न्यूज़ नेटवर्क {rniText ? `| ${rniText}` : '| डिजिटल मीडिया एडिशन'}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-40 text-slate-800 font-bold transition cursor-pointer"
                  >
                    ← पिछला
                  </button>
                  <span className="font-bold">पेज {page} / 4</span>
                  <button
                    onClick={() => setPage(Math.min(4, page + 1))}
                    disabled={page === 4}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-40 text-slate-800 font-bold transition cursor-pointer"
                  >
                    अगला →
                  </button>
                  <button
                    onClick={onClose}
                    className="ml-2 text-red-600 hover:text-red-700 font-bold underline transition cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}
      </div>
    </div>
  );
};
