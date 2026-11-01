import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Scissors,
  Sparkles,
  Move,
  RotateCcw,
} from 'lucide-react';

interface EPaperPageClippingModalProps {
  pageCanvas: HTMLCanvasElement | null;
  pageNumber: number;
  editionTitle: string;
  dateString: string;
  onClose: () => void;
}

export const EPaperPageClippingModal: React.FC<EPaperPageClippingModalProps> = ({
  pageCanvas,
  pageNumber,
  editionTitle,
  dateString,
  onClose,
}) => {
  // Normalized crop coordinates [0..1]
  const [crop, setCrop] = useState({
    x: 0.1,
    y: 0.15,
    width: 0.8,
    height: 0.5,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    mode: 'move' | 'se' | 'sw' | 'ne' | 'nw';
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    initW: number;
    initH: number;
  } | null>(null);

  // Generate cropped branded image
  const generateClipImage = useCallback((): string | null => {
    if (!pageCanvas) return null;

    const sourceW = pageCanvas.width;
    const sourceH = pageCanvas.height;

    const sx = Math.max(0, Math.floor(crop.x * sourceW));
    const sy = Math.max(0, Math.floor(crop.y * sourceH));
    const sWidth = Math.min(sourceW - sx, Math.floor(crop.width * sourceW));
    const sHeight = Math.min(sourceH - sy, Math.floor(crop.height * sourceH));

    if (sWidth <= 10 || sHeight <= 10) return null;

    // Create target canvas with branded header & footer
    const target = document.createElement('canvas');
    const headerHeight = 70;
    const footerHeight = 44;

    target.width = Math.max(640, sWidth);
    const contentWidth = target.width;
    const contentHeight = Math.round((sHeight * contentWidth) / sWidth);
    target.height = headerHeight + contentHeight + footerHeight;

    const ctx = target.getContext('2d');
    if (!ctx) return null;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, target.width, target.height);

    // 1. Header (Red Brand Strip)
    ctx.fillStyle = '#dc2626'; // Red-600
    ctx.fillRect(0, 0, target.width, headerHeight);

    // Masthead text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('खबरी दोस्त', 20, 36);

    ctx.fillStyle = '#fef08a'; // Amber-200
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ई-पेपर डिजिटल संस्करण', 20, 56);

    // Date & Page on Right
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${dateString} • पृष्ठ ${pageNumber}`, target.width - 20, 36);

    ctx.fillStyle = '#fee2e2';
    ctx.font = 'normal 11px sans-serif';
    ctx.fillText(editionTitle, target.width - 20, 56);
    ctx.textAlign = 'left';

    // 2. Draw Cropped Article Canvas Region
    ctx.drawImage(
      pageCanvas,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      headerHeight,
      contentWidth,
      contentHeight
    );

    // 3. Footer (Slate Bar with URL and Watermark)
    ctx.fillStyle = '#0f172a'; // Slate-900
    ctx.fillRect(0, target.height - footerHeight, target.width, footerHeight);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('khabridost.com', 20, target.height - 18);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'normal 11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('भारत का सबसे विश्वसनीय हिंदी न्यूज़ नेटवर्क', target.width - 20, target.height - 18);
    ctx.textAlign = 'left';

    return target.toDataURL('image/png');
  }, [pageCanvas, crop, pageNumber, editionTitle, dateString]);

  // Update preview when crop changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const dataUrl = generateClipImage();
      setPreviewDataUrl(dataUrl);
    }, 100);
    return () => clearTimeout(timer);
  }, [generateClipImage]);

  // Pointer drag handling for crop box
  const handlePointerDown = (
    e: React.PointerEvent,
    mode: 'move' | 'se' | 'sw' | 'ne' | 'nw'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    dragStartRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      initX: crop.x,
      initY: crop.y,
      initW: crop.width,
      initH: crop.height,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dx = (e.clientX - dragStartRef.current.startX) / rect.width;
    const dy = (e.clientY - dragStartRef.current.startY) / rect.height;
    const { mode, initX, initY, initW, initH } = dragStartRef.current;

    setCrop(() => {
      if (mode === 'move') {
        const nextX = Math.max(0, Math.min(1 - initW, initX + dx));
        const nextY = Math.max(0, Math.min(1 - initH, initY + dy));
        return { ...crop, x: nextX, y: nextY };
      } else if (mode === 'se') {
        const nextW = Math.max(0.15, Math.min(1 - initX, initW + dx));
        const nextH = Math.max(0.1, Math.min(1 - initY, initH + dy));
        return { ...crop, width: nextW, height: nextH };
      }
      return crop;
    });
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  // Download Clip Image
  const handleDownloadClip = () => {
    setIsGenerating(true);
    try {
      const dataUrl = generateClipImage();
      if (!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Khabri-Dost-Clip-Page-${pageNumber}-${dateString}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Tap WhatsApp Share
  const handleWhatsAppShare = async () => {
    setIsGenerating(true);
    const dataUrl = generateClipImage();
    if (!dataUrl) {
      setIsGenerating(false);
      return;
    }

    try {
      // If Web Share API with files is supported (modern mobile browsers)
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `khabri-dost-clip-p${pageNumber}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `खबरी दोस्त ई-पेपर कतरन (पेज ${pageNumber})`,
          text: `यह खबर खबरी दोस्त ई-पेपर (पृष्ठ ${pageNumber}) से है: https://khabridost.com/#epaper`,
        });
        setIsGenerating(false);
        return;
      }
    } catch {
      // Fallback
    }

    // Direct WhatsApp share fallback: auto-download image & open WhatsApp web/app
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Khabri-Dost-Clip-Page-${pageNumber}-${dateString}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const shareText = encodeURIComponent(
      `📰 *खबरी दोस्त ई-पेपर कतरन* (पृष्ठ ${pageNumber}, ${dateString})\nपूरा अखबार यहाँ पढ़ें: https://khabridost.com/#epaper`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    setIsGenerating(false);
  };

  const handleResetCrop = () => {
    setCrop({
      x: 0.1,
      y: 0.15,
      width: 0.8,
      height: 0.5,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in duration-150 font-kd-body">
      {/* 1. Header Toolbar */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 font-kd-headline flex items-center gap-1.5">
              <span>अखबार कतरन काटें</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-mono">
                पृष्ठ {pageNumber}
              </span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-kd-meta">
              बॉक्स को खबर के अनुसार सेट करें और सीधे शेयर करें
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handleResetCrop}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="रीसेट करें"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Crop Area */}
      <div className="flex-1 w-full max-w-2xl flex items-center justify-center overflow-hidden relative my-auto">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative max-w-full max-h-[65vh] select-none touch-none shadow-2xl rounded-xs border border-slate-300 overflow-hidden bg-slate-900"
        >
          {/* Base Page Canvas Image */}
          {pageCanvas && (
            <img
              src={pageCanvas.toDataURL('image/jpeg', 0.8)}
              alt="Page background"
              className="max-w-full max-h-[65vh] block opacity-40 pointer-events-none"
            />
          )}

          {/* Interactive Crop Highlight Frame */}
          <div
            style={{
              left: `${crop.x * 100}%`,
              top: `${crop.y * 100}%`,
              width: `${crop.width * 100}%`,
              height: `${crop.height * 100}%`,
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
            className="absolute border-2 border-dashed border-red-500 bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move flex items-center justify-center"
          >
            <div className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 pointer-events-none shadow-xs font-kd-meta">
              <Move className="w-3 h-3" />
              <span>कतरन क्षेत्र</span>
            </div>

            {/* Southeast Corner Resize Handle */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'se')}
              className="absolute -right-2 -bottom-2 w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-md cursor-se-resize touch-none flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Bar (Ultra-Compact & Thumb-Friendly) */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 sm:p-3 flex items-center justify-between gap-2 shrink-0 mt-2 font-kd-meta">
        <div className="text-[11px] text-slate-600 hidden sm:block">
          <span className="font-bold text-slate-900">ब्रांडेड क्लिप:</span> खबरी दोस्त लोगो व दिनांक सहित
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDownloadClip}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-300 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>इमेज डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp शेयर</span>
          </button>
        </div>
      </div>
    </div>
  );
};
