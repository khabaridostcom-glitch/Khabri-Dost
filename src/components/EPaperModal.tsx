import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  FileText,
  Calendar,
  Layers,
  MapPin,
  AlertCircle,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { PortalSettings } from '../types/news';
import { ResolvedEPaperMode } from '../types/epaper';
import {
  getKolkataDateString,
  formatHindiNewspaperDate,
  resolveEPaperEdition,
} from '../utils/epaperEngine';
import { EPaperReader } from './EPaperReader';
import { AdBanner } from './AdBanner';
import { downloadDailyEPaperPdf } from '../utils/pdfGenerator';

interface EPaperModalProps {
  onClose: () => void;
  portalSettings?: PortalSettings;
  articles?: any[];
  onSelectArticle?: (article: any) => void;
  onOpenAdminSettings?: () => void;
  isAdmin?: boolean;
}

export const EPaperModal: React.FC<EPaperModalProps> = ({
  onClose,
  portalSettings,
  onOpenAdminSettings,
  isAdmin = false,
}) => {
  const epaperSettings = portalSettings?.epaperSettings;
  const todayKolkata = getKolkataDateString();

  // Selected Date and Edition
  const [selectedDate, setSelectedDate] = useState<string>(
    epaperSettings?.activeEditionDate || todayKolkata
  );
  const [selectedEditionCode, setSelectedEditionCode] = useState<string>(
    epaperSettings?.activeEditionCode || 'national'
  );

  const [page, setPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // URL Route Synchronization: read on mount and keep sync
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const queryStr = hash.split('?')[1];
        const params = new URLSearchParams(queryStr);
        const urlDate = params.get('date');
        const urlEdition = params.get('edition');
        const urlPage = params.get('page');
        if (urlDate) setSelectedDate(urlDate);
        if (urlEdition) setSelectedEditionCode(urlEdition);
        if (urlPage) {
          const p = parseInt(urlPage, 10);
          if (!isNaN(p) && p >= 1) setPage(p);
        }
      }
    } catch {}
  }, []);

  // Sync state to URL hash so page refreshes preserve edition and page
  useEffect(() => {
    try {
      const newHash = `#epaper?date=${selectedDate}&edition=${selectedEditionCode}&page=${page}`;
      window.history.replaceState(null, '', newHash);
    } catch {}
  }, [selectedDate, selectedEditionCode, page]);

  // Clean URL on close
  const handleModalClose = () => {
    try {
      if (window.location.hash.startsWith('#epaper')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {}
    onClose();
  };

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleModalClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Brand masthead metadata
  const hf = portalSettings?.headerFooter;
  const siteTitle = hf?.siteTitle || 'खबरी दोस्त';
  const siteTagline = hf?.siteTagline || 'राष्ट्र का सबसे विश्वसनीय एवं निष्पक्ष दैनिक समाचार पत्र';

  // Available Editions list
  const availableEditions = useMemo(() => {
    return [
      { code: 'national', name: 'राष्ट्रीय संस्करण (नई दिल्ली)', city: 'नई दिल्ली' },
      { code: 'up', name: 'उत्तर प्रदेश एवं उत्तराखंड', city: 'लखनऊ / देहरादून' },
      { code: 'bihar', name: 'बिहार एवं झारखंड संस्करण', city: 'पटना / रांची' },
      { code: 'rajasthan', name: 'राजस्थान संस्करण', city: 'जयपुर' },
    ];
  }, []);

  // Quick past dates (Past 7 days)
  const quickDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() - i * 86400000);
      const ds = getKolkataDateString(d);
      dates.push({
        dateStr: ds,
        label: i === 0 ? 'आज' : i === 1 ? 'कल' : formatHindiNewspaperDate(ds).split(',')[0],
        fullHindi: formatHindiNewspaperDate(ds),
      });
    }
    return dates;
  }, []);

  // Central Resolution Engine: Pure PDF reader resolver
  const resolvedMode: ResolvedEPaperMode = useMemo(() => {
    return resolveEPaperEdition(
      selectedDate,
      selectedEditionCode,
      epaperSettings
    );
  }, [selectedDate, selectedEditionCode, epaperSettings]);

  // Reset page to 1 when date or edition changes
  useEffect(() => {
    setPage(1);
  }, [selectedDate, selectedEditionCode]);

  // Total pages
  const totalPages = resolvedMode.type === 'pdf' ? resolvedMode.totalPages : 1;

  // Active Edition Name
  const currentEditionName =
    resolvedMode.type === 'pdf'
      ? resolvedMode.edition.editionName
      : availableEditions.find((e) => e.code === selectedEditionCode)?.name || 'राष्ट्रीय संस्करण';

  // Handle Download PDF
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      if (resolvedMode.type === 'pdf' && resolvedMode.pdfUrl) {
        await downloadDailyEPaperPdf(
          portalSettings,
          undefined,
          undefined,
          currentEditionName,
          selectedDate,
          resolvedMode.pdfUrl
        );
      }
    } catch {
      if (resolvedMode.type === 'pdf' && resolvedMode.pdfUrl) {
        window.open(resolvedMode.pdfUrl, '_blank');
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Share handlers
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *${siteTitle} • दैनिक ई-पेपर (${formatHindiNewspaperDate(selectedDate)})*\n\nआज का पूरा अखबारी PDF संस्करण यहाँ ऑनलाइन पढ़ें:\n${window.location.origin}/#epaper?date=${selectedDate}&edition=${selectedEditionCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `${window.location.origin}/#epaper?date=${selectedDate}&edition=${selectedEditionCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="epaper-workspace-container"
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xs flex flex-col overflow-hidden animate-fadeIn select-none"
    >
      {/* 1. TOP BRAND MASTHEAD & TOOLBAR */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0 z-30 shadow-xs">
        {/* Left: Brand Identity & Current Date */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 font-kd-headline tracking-tight">
                  {siteTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-mono">
                  ई-पेपर
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block truncate max-w-xs">
                {siteTagline}
              </p>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-slate-200" />

          {/* Current Date Display */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span className="font-medium">{formatHindiNewspaperDate(selectedDate)}</span>
          </div>
        </div>

        {/* Center: Edition & Date Selector Controls */}
        <div className="flex items-center space-x-2">
          {/* Edition Selector */}
          <div className="relative">
            <select
              value={selectedEditionCode}
              onChange={(e) => setSelectedEditionCode(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-2.5 sm:px-3 py-1.5 pr-7 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer transition shadow-2xs"
            >
              {availableEditions.map((ed) => (
                <option key={ed.code} value={ed.code}>
                  {ed.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Date Picker Input */}
          <input
            type="date"
            value={selectedDate}
            max={todayKolkata}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-2 sm:px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-red-500 cursor-pointer transition shadow-2xs"
            title="प्रकाशन तिथि चुनें"
          />
        </div>

        {/* Right: Actions, Share, Admin Shortcut, Close */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* WhatsApp Share */}
          {epaperSettings?.allowShare !== false && (
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer flex items-center space-x-1 text-xs font-semibold shadow-2xs"
              title="व्हाट्सएप पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">शेयर</span>
            </button>
          )}

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer flex items-center space-x-1 text-xs font-medium shadow-2xs"
            title="ई-पेपर लिंक कॉपी करें"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{copied ? 'कॉपी हुआ' : 'लिंक'}</span>
          </button>

          {/* Admin Settings Shortcut */}
          {isAdmin && onOpenAdminSettings && (
            <button
              type="button"
              onClick={onOpenAdminSettings}
              className="p-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer hidden md:flex items-center"
              title="एडमिन ई-पेपर सेटिंग्स"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
            </button>
          )}

          {/* Close Modal */}
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 transition cursor-pointer shadow-2xs"
            title="ई-पेपर बंद करें (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. QUICK DATE NAVIGATION STRIP */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0 z-20 text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          तिथि चुनें:
        </span>
        {quickDates.map((item) => {
          const isSelected = item.dateStr === selectedDate;
          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => setSelectedDate(item.dateStr)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-red-600 text-white font-bold border-red-600 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span>{item.label}</span>
              <span className="hidden md:inline font-mono text-[10px] ml-1 opacity-80">
                ({item.dateStr.slice(5)})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-200/60">
        {/* CASE A: UPLOADED PDF VIEWER */}
        {resolvedMode.type === 'pdf' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <EPaperReader
              pdfUrl={resolvedMode.pdfUrl}
              page={page}
              onPageChange={setPage}
              totalPages={totalPages}
              editionTitle={currentEditionName}
              dateString={resolvedMode.dateString}
              allowDownload={epaperSettings?.allowDownload !== false}
              allowPrint={epaperSettings?.allowPrint !== false}
              className="flex-1"
            />

            {/* PHASE 9: ADVERTISEMENT SPACE AT THE BOTTOM */}
            {portalSettings?.adSettings?.showBottomAd && (
              <div className="bg-slate-100 border-t border-slate-200 py-2 px-4 flex justify-center shrink-0 z-10">
                <div className="w-full max-w-4xl flex justify-center">
                  <AdBanner
                    slot="bottom"
                    type={portalSettings.adSettings.bottomAdSlotId ? 'adsense' : 'private'}
                    privateBannerUrl={portalSettings.adSettings.privateBannerUrl}
                    privateBannerLink={portalSettings.adSettings.privateBannerLink}
                    privateBannerTitle={portalSettings.adSettings.privateBannerTitle}
                    customScriptOrHtml={portalSettings.adSettings.customScriptOrHtml}
                    adsenseClientId={portalSettings.adSettings.adsenseClientId}
                    adsenseSlotId={portalSettings.adSettings.bottomAdSlotId}
                    breakpoints={portalSettings.adSettings.responsiveBreakpoints?.bottom}
                    className="max-h-[90px] overflow-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* CASE B: NO PDF AVAILABLE FOR THIS DATE (CLEAN UNAVAILABLE STATE) */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-10 max-w-md w-full text-center border border-slate-300 shadow-xl space-y-4">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold font-kd-headline text-slate-900">
                  ई-पेपर संस्करण उपलब्ध नहीं है
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {resolvedMode.message}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayKolkata)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>आज का संस्करण पढ़ें</span>
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  वेबसाइट पर वापस जाएं
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
