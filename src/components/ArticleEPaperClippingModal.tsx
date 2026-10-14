import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  ZoomIn,
  ZoomOut,
  Newspaper,
  Calendar,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { NewsArticle, PortalSettings } from '../types/news';
import { getTodayHindiDate } from '../utils/hindiHelpers';
import { generateArticlePdf } from '../utils/pdfGenerator';

interface ArticleEPaperClippingModalProps {
  article: NewsArticle;
  portalSettings?: PortalSettings;
  onClose: () => void;
}

export const ArticleEPaperClippingModal: React.FC<ArticleEPaperClippingModalProps> = ({
  article,
  portalSettings,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);
  const [paperTheme, setPaperTheme] = useState<'classic' | 'modern' | 'sepia'>('classic');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const todayHindiDate = getTodayHindiDate();

  const siteTitle = portalSettings?.headerFooter?.siteTitle || 'खबरी दोस्त';
  const siteTagline = portalSettings?.headerFooter?.siteTagline || 'दैनिक राष्ट्रीय समाचार पत्र';

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateArticlePdf(article, portalSettings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareText = `📰 ${article.title}\n\nखबरी दोस्त दैनिक ई-पेपर क्लिपिंग पढ़ें:\n${url}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const themeStyles = {
    classic: {
      bg: 'bg-[#faf8f5]',
      border: 'border-[#3a2d28]',
      headerBg: 'bg-[#1e1b18] text-[#f7f4ee]',
      accent: 'border-[#8c1d1d]',
      text: 'text-[#1c1917]',
      font: 'font-serif',
      stamp: 'text-[#8c1d1d] border-[#8c1d1d]',
    },
    modern: {
      bg: 'bg-white',
      border: 'border-slate-300',
      headerBg: 'bg-slate-900 text-white',
      accent: 'border-red-600',
      text: 'text-slate-900',
      font: 'font-sans',
      stamp: 'text-red-600 border-red-600',
    },
    sepia: {
      bg: 'bg-[#f4ecd8]',
      border: 'border-[#5c4a36]',
      headerBg: 'bg-[#3b2f21] text-[#faedd7]',
      accent: 'border-[#7a3b1a]',
      text: 'text-[#2b1f14]',
      font: 'font-serif',
      stamp: 'text-[#7a3b1a] border-[#7a3b1a]',
    },
  }[paperTheme];

  // Clean article text paragraphs for newspaper column typesetting
  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith('[youtube:') && !p.startsWith('[tweet:') && !p.startsWith('[factcheck:'));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #newspaper-clipping-print-area, #newspaper-clipping-print-area * {
            visibility: visible;
          }
          #newspaper-clipping-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border: 1px solid #000 !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Toolbar - hidden on print */}
        <div className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white tracking-tight">
                  ई-पेपर न्यूज़ क्लिपिंग (E-Paper News Clipping)
                </h3>
                <span className="text-[10px] bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30 uppercase">
                  PDF & Print Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {article.category?.toUpperCase()} • {todayHindiDate}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Paper Tint Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setPaperTheme('classic')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  paperTheme === 'classic' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                अखबार (Classic)
              </button>
              <button
                onClick={() => setPaperTheme('modern')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  paperTheme === 'modern' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                मॉडर्न (White)
              </button>
              <button
                onClick={() => setPaperTheme('sepia')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  paperTheme === 'sepia' ? 'bg-[#7a3b1a] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                रेट्रो (Sepia)
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer text-slate-300"
                title="ज़ूम आउट"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[11px] font-mono text-slate-200">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.3, zoom + 0.1))}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer text-slate-300"
                title="ज़ूम इन"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-60"
              title="इस खबर का उच्च-गुणवत्ता PDF डाउनलोड करें"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>PDF बन रही है...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF डाउनलोड</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
              title="प्रिंट निकालें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">प्रिंट</span>
            </button>

            {/* Share Clipping Button */}
            <button
              onClick={handleShare}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition cursor-pointer"
              title="क्लिपिंग शेयर करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition cursor-pointer"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Newspaper Canvas */}
        <div className="overflow-auto p-3 sm:p-6 lg:p-8 flex-1 bg-slate-950/60 flex justify-center">
          <div
            id="newspaper-clipping-print-area"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className={`w-full max-w-3xl ${themeStyles.bg} ${themeStyles.text} rounded-xl shadow-2xl p-6 sm:p-10 border-2 ${themeStyles.border} transition-all space-y-6 relative`}
          >
            {/* Authentic Newspaper Masthead */}
            <div className={`border-b-4 ${themeStyles.accent} pb-4 text-center space-y-2`}>
              <div className="flex items-center justify-between border-b border-stone-400/60 pb-1 text-[11px] uppercase font-bold tracking-wider text-stone-600">
                <span>ई-पेपर क्लिपिंग</span>
                <span>वर्ष 2026 • अंक 142</span>
                <span>मूल्य: निःशुल्क</span>
              </div>

              <div className="py-1">
                <h1 className="text-3xl sm:text-5xl font-black font-['Rozha_One',serif] tracking-tight uppercase">
                  {siteTitle}
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-stone-700 mt-0.5">
                  {siteTagline}
                </p>
              </div>

              <div className="flex items-center justify-between border-t-2 border-b-2 border-stone-800/80 py-1 text-xs font-semibold text-stone-800">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  <span>{todayHindiDate}</span>
                </span>
                <span className="font-bold text-red-700 uppercase tracking-wider">
                  विशेष समाचार क्लिपिंग • पेज 01
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  <span>{article.location || 'नई दिल्ली'}</span>
                </span>
              </div>
            </div>

            {/* Headline and Kicker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-100/70 px-2.5 py-0.5 rounded border border-red-300">
                  {article.category?.toUpperCase() || 'TOP STORY'}
                </span>
                <span className="text-xs text-stone-600 font-mono">
                  प्रमाणित समाचार ID: {article.id}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-stone-900 font-['Noto_Serif_Devanagari',serif]">
                {article.title}
              </h2>

              <p className="text-sm sm:text-base font-medium italic text-stone-700 border-l-4 border-red-700 pl-3 py-0.5 leading-relaxed bg-stone-100/60">
                {article.summary}
              </p>
            </div>

            {/* Author Byline & Verification Stamp */}
            <div className="flex items-center justify-between border-y border-stone-300 py-2 text-xs text-stone-700">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-stone-900">विशेष संवाददाता: {article.authorName || 'खबरी दोस्त टीम'}</span>
                <span>•</span>
                <span>{article.location || 'नई दिल्ली'}</span>
              </div>

              <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[11px]">तथ्य-जांच सत्यापित (Fact Checked)</span>
              </div>
            </div>

            {/* Featured Image with Newspaper Style Frame */}
            {article.imageUrl && (
              <div className="space-y-1.5">
                <div className="border border-stone-400 p-1 bg-white shadow-xs">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full max-h-80 sm:max-h-96 object-cover"
                  />
                </div>
                <div className="text-[11px] text-stone-600 italic flex items-center justify-between px-1">
                  <span>फोटो: {article.imageCaption || article.title}</span>
                  <span className="font-mono text-[10px]">खबरी दोस्त डिजिटल ब्यूरो</span>
                </div>
              </div>
            )}

            {/* Multi-column Body Text (Authentic Newspaper Layout) */}
            <div className="sm:columns-2 gap-6 space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed text-justify font-['Noto_Serif_Devanagari',serif]">
              {paragraphs.map((para, i) => (
                <p key={i} className={i === 0 ? 'first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:text-red-800 first-letter:leading-none' : ''}>
                  {para}
                </p>
              ))}
            </div>

            {/* Newspaper Footer Strip & Official Digital Stamp */}
            <div className="pt-6 border-t-2 border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white border border-stone-400 p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-full h-full text-stone-800" />
                </div>
                <div>
                  <div className="font-black text-stone-900">{siteTitle} डिजिटल न्यूज़ नेटवर्क</div>
                  <div className="text-[10px] text-stone-600">सत्य • निष्पक्षता • जन-सरोकार</div>
                  <div className="text-[10px] text-stone-500 font-mono">www.khabridost.com</div>
                </div>
              </div>

              {/* Official Verified Newspaper Stamp */}
              <div className={`border-2 ${themeStyles.stamp} rounded-lg p-2 text-center uppercase tracking-wider font-bold text-[10px] rotate-1 shadow-2xs`}>
                <div>डिजिटल समाचार क्लिपिंग</div>
                <div className="text-[9px] font-mono mt-0.5">VERIFIED EDITORIAL COPY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
