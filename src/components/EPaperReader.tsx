import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  X,
  Layers,
  RotateCcw,
  RotateCw,
  Check,
  BookOpen,
  Scissors,
  Share2,
  ChevronDown,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { EPaperPageClippingModal } from './EPaperPageClippingModal';

// Setup local PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface EPaperReaderProps {
  pdfUrl: string;
  initialPage?: number;
  page?: number;
  onPageChange?: (newPage: number) => void;
  totalPages?: number;
  onTotalPagesDetected?: (pages: number) => void;
  editionTitle?: string;
  dateString?: string;
  allowDownload?: boolean;
  allowPrint?: boolean;
  showToolbar?: boolean;
  showThumbnails?: boolean;
  className?: string;
}

/**
 * EPaperReader Component
 * 
 * High-performance PDF reader powered by PDF.js:
 * - On-demand page rendering on high-DPI HTML5 Canvas
 * - Navigation controls for previous/next pages with direct numeric jump
 * - Zoom controls (zoom in, zoom out, 100% reset)
 * - Fit-to-width and Fit-to-page auto-scalers
 * - Page thumbnail selector carousel with lazy loading
 * - In-document text search with match counts and jumping
 * - Fullscreen, print, and direct original PDF download
 * - Mobile touch swipe gestures
 */
export const EPaperReader: React.FC<EPaperReaderProps> = ({
  pdfUrl,
  initialPage = 1,
  page: controlledPage,
  onPageChange,
  totalPages: controlledTotalPages,
  onTotalPagesDetected,
  editionTitle = 'खबरी दोस्त • ई-पेपर',
  dateString = '2026-10-21',
  allowDownload = true,
  allowPrint = true,
  showToolbar = true,
  showThumbnails: initialShowThumbnails = true,
  className = '',
}) => {
  // Support both controlled and uncontrolled page state
  const [internalPage, setInternalPage] = useState<number>(initialPage);
  const activePage = controlledPage !== undefined ? controlledPage : internalPage;

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<'canvas' | 'native'>('canvas');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [detectedTotalPages, setDetectedTotalPages] = useState<number>(controlledTotalPages || 15);
  const totalPages = controlledTotalPages || detectedTotalPages;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Thumbnail drawer & lazy thumbnails
  const [showThumbnails, setShowThumbnails] = useState<boolean>(initialShowThumbnails);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<number, string>>({});

  // Direct page input
  const [pageInputValue, setPageInputValue] = useState<string>(String(activePage));

  // In-document text search
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<{ pageNumber: number; matchCount: number }>>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [searchStatusText, setSearchStatusText] = useState<string>('');

  // Dual-page newspaper spread mode state for wide screens
  const [isSpreadMode, setIsSpreadMode] = useState<boolean>(false);

  // Smart Mobile Drawer & News Clipping State
  const [showClippingModal, setShowClippingModal] = useState<boolean>(false);
  const [showMobilePageDrawer, setShowMobilePageDrawer] = useState<boolean>(false);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secondCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const secondRenderTaskRef = useRef<any>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages));
      if (onPageChange) {
        onPageChange(clamped);
      } else {
        setInternalPage(clamped);
      }
      setPageInputValue(String(clamped));
    },
    [onPageChange, totalPages]
  );

  useEffect(() => {
    setPageInputValue(String(activePage));
  }, [activePage]);

  // 1. Load PDF Document Instance
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setLoadError(null);

    const loadDoc = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: '/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        const count = doc.numPages;
        setDetectedTotalPages(count);
        if (onTotalPagesDetected) {
          onTotalPagesDetected(count);
        }
        setLoading(false);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('PDF.js loading error:', err);
        setLoadError('PDF लोड करने में असमर्थ। कृपया फ़ाइल पथ सत्यापित करें।');
        setLoading(false);
      }
    };

    loadDoc();
    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, onTotalPagesDetected]);

  // 2. Render Active Page On-Demand (Supports Single and Dual Spread Mode)
  const renderPage = useCallback(async () => {
    if (!pdfDoc || renderMode !== 'canvas') return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
    }
    if (secondRenderTaskRef.current) {
      try {
        secondRenderTaskRef.current.cancel();
      } catch {}
    }

    setPageRendering(true);

    try {
      const pageObj = await pdfDoc.getPage(activePage);
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // In spread mode adjust scale so two pages fit comfortably
      const effectiveScale = isSpreadMode ? zoom * 1.05 * dpr : zoom * 1.4 * dpr;
      const viewport = pageObj.getViewport({ scale: effectiveScale, rotation });

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const task = pageObj.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;

      // If in dual-page spread mode and next page exists, render activePage + 1 on second canvas
      if (isSpreadMode && activePage < totalPages && secondCanvasRef.current) {
        try {
          const secondPageObj = await pdfDoc.getPage(activePage + 1);
          const secondCanvas = secondCanvasRef.current;
          const secondContext = secondCanvas.getContext('2d', { alpha: false });
          if (secondContext) {
            const secondViewport = secondPageObj.getViewport({ scale: effectiveScale, rotation });
            secondCanvas.height = secondViewport.height;
            secondCanvas.width = secondViewport.width;
            secondCanvas.style.width = `${secondViewport.width / dpr}px`;
            secondCanvas.style.height = `${secondViewport.height / dpr}px`;

            const secondTask = secondPageObj.render({
              canvasContext: secondContext,
              viewport: secondViewport,
            });
            secondRenderTaskRef.current = secondTask;
            await secondTask.promise;
          }
        } catch (secondErr: any) {
          if (secondErr?.name !== 'RenderingCancelledException') {
            console.warn('Second canvas render interrupted:', secondErr);
          }
        }
      }

      setPageRendering(false);
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') {
        console.warn('Canvas render interrupted:', e);
      }
      setPageRendering(false);
    }
  }, [pdfDoc, activePage, zoom, rotation, renderMode, isSpreadMode, totalPages]);

  useEffect(() => {
    renderPage();
    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
      if (secondRenderTaskRef.current) {
        try {
          secondRenderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [renderPage]);

  // Keyboard navigation shortcuts (Arrow keys, Zoom, Rotate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        if (activePage > 1) handlePageChange(activePage - 1);
      } else if (e.key === 'ArrowRight') {
        if (activePage < totalPages) handlePageChange(activePage + 1);
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))));
      } else if (e.key === '-') {
        setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))));
      } else if (e.key === '0') {
        setZoom(1.0);
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, totalPages, handlePageChange]);

  // 3. Lazy Background Thumbnail Generation
  useEffect(() => {
    if (!pdfDoc) return;
    let isCancelled = false;

    const generateThumbnailsLazily = async () => {
      const total = pdfDoc.numPages;
      const batchSize = 3;

      for (let i = 1; i <= total; i += batchSize) {
        if (isCancelled) break;

        const promises = [];
        for (let j = i; j < i + batchSize && j <= total; j++) {
          promises.push(
            (async (pageNum) => {
              try {
                const p = await pdfDoc.getPage(pageNum);
                const thumbVp = p.getViewport({ scale: 0.18 });
                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = thumbVp.width;
                thumbCanvas.height = thumbVp.height;
                const ctx = thumbCanvas.getContext('2d');
                if (ctx) {
                  await p.render({ canvasContext: ctx, viewport: thumbVp }).promise;
                  return { pageNum, url: thumbCanvas.toDataURL('image/jpeg', 0.65) };
                }
              } catch {
                return null;
              }
              return null;
            })(j)
          );
        }

        const results = await Promise.all(promises);
        if (isCancelled) break;

        setThumbnailUrls((prev) => {
          const next = { ...prev };
          results.forEach((r) => {
            if (r) next[r.pageNum] = r.url;
          });
          return next;
        });

        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    };

    generateThumbnailsLazily();
    return () => {
      isCancelled = true;
    };
  }, [pdfDoc]);

  // 4. Fit-to-Width & Fit-to-Page Auto-Scalers
  const handleFitToWidth = () => {
    if (!scrollWrapperRef.current || !pdfDoc) return;
    pdfDoc.getPage(activePage).then((pageObj: any) => {
      const baseVp = pageObj.getViewport({ scale: 1.0 });
      const availableWidth = scrollWrapperRef.current?.clientWidth || 800;
      const target = Math.max(0.6, Math.min(2.4, (availableWidth - 36) / (baseVp.width * 1.4)));
      setZoom(Number(target.toFixed(2)));
    });
  };

  const handleFitToPage = () => {
    if (!scrollWrapperRef.current || !pdfDoc) return;
    pdfDoc.getPage(activePage).then((pageObj: any) => {
      const baseVp = pageObj.getViewport({ scale: 1.0 });
      const availableHeight = scrollWrapperRef.current?.clientHeight || 900;
      const target = Math.max(0.5, Math.min(1.8, (availableHeight - 48) / (baseVp.height * 1.4)));
      setZoom(Number(target.toFixed(2)));
    });
  };

  // 5. In-Document Full-Text Search
  const handleSearchExecute = async () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !pdfDoc) {
      setSearchResults([]);
      setSearchStatusText('');
      return;
    }

    setIsSearching(true);
    setSearchStatusText('सर्च किया जा रहा है...');
    const found: Array<{ pageNumber: number; matchCount: number }> = [];

    try {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageObj = await pdfDoc.getPage(i);
        const textContent = await pageObj.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .toLowerCase();

        const count = pageText.split(q).length - 1;
        if (count > 0) {
          found.push({ pageNumber: i, matchCount: count });
        }
      }

      setSearchResults(found);
      if (found.length > 0) {
        setCurrentMatchIndex(0);
        handlePageChange(found[0].pageNumber);
        setSearchStatusText(`कुल ${found.length} पृष्ठों पर शब्द मिला (पेज ${found[0].pageNumber})`);
      } else {
        setSearchStatusText('कोई परिणाम नहीं मिला');
      }
    } catch (e) {
      console.warn('Search error in PDF:', e);
      setSearchStatusText('सर्च पूर्ण नहीं हो सका');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNextSearchResult = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchResults.length;
    setCurrentMatchIndex(nextIdx);
    handlePageChange(searchResults[nextIdx].pageNumber);
    setSearchStatusText(`परिणाम ${nextIdx + 1} / ${searchResults.length} (पेज ${searchResults[nextIdx].pageNumber})`);
  };

  const handlePrevSearchResult = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentMatchIndex(prevIdx);
    handlePageChange(searchResults[prevIdx].pageNumber);
    setSearchStatusText(`परिणाम ${prevIdx + 1} / ${searchResults.length} (पेज ${searchResults[prevIdx].pageNumber})`);
  };

  // 6. Direct Page Number Jump Submit
  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(pageInputValue, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      handlePageChange(target);
    } else {
      setPageInputValue(String(activePage));
    }
  };

  // 7. Fullscreen Toggle
  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  // 8. Download Original PDF
  const handleDownload = () => {
    if (!allowDownload) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${editionTitle.replace(/\s+/g, '-')}-${dateString}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 8.5 Download Current Single Page as High-Res PNG Image
  const handleDownloadCurrentPageImage = () => {
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${editionTitle.replace(/\s+/g, '-')}-Page-${activePage}-${dateString}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.warn('Failed to download current page image:', err);
    }
  };

  // 9. Print Handler
  const handlePrint = () => {
    if (!allowPrint) return;
    if (renderMode === 'native') {
      window.print();
    } else {
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.top = '-9999px';
      printFrame.src = pdfUrl;
      document.body.appendChild(printFrame);
      printFrame.onload = () => {
        try {
          printFrame.contentWindow?.print();
        } catch {
          window.open(pdfUrl, '_blank')?.print();
        }
        setTimeout(() => document.body.removeChild(printFrame), 5000);
      };
    }
  };

  // 10. Touch Swipe & Double-Tap for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Double-tap to toggle zoom (1.0x vs 2.0x) on mobile
    if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && deltaTime < 300) {
      const now = Date.now();
      if (lastTapRef.current && now - lastTapRef.current.time < 320) {
        setZoom((prev) => (prev > 1.3 ? 1.0 : 2.0));
        lastTapRef.current = null;
        touchStartRef.current = null;
        return;
      } else {
        lastTapRef.current = {
          time: now,
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };
      }
    }

    // Horizontal Swipe for Page Navigation
    if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50 && deltaTime < 500) {
      if (deltaX < 0 && activePage < totalPages) {
        handlePageChange(activePage + 1);
      } else if (deltaX > 0 && activePage > 1) {
        handlePageChange(activePage - 1);
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col bg-slate-100 select-none relative overflow-hidden ${className}`}
    >
      {/* 1. TOP TOOLBAR */}
      {showToolbar && (
        <div className="bg-white border-b border-slate-200 px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-1.5 z-20 shrink-0 text-xs shadow-2xs">
          {/* Left: Mode switcher, Page Stepper & Jump Input */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setRenderMode('canvas')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  renderMode === 'canvas'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="कस्टम डिजिटल रीडर"
              >
                रीडर
              </button>
              <button
                type="button"
                onClick={() => setRenderMode('native')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  renderMode === 'native'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ब्राउज़र नेटिव व्यूअर"
              >
                नेटिव
              </button>
            </div>

            <span className="hidden sm:inline text-slate-300">|</span>

            {/* Stepper with Numeric Input */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                disabled={activePage <= 1}
                onClick={() => handlePageChange(activePage - 1)}
                className="p-1 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition text-slate-700"
                title="पिछला पृष्ठ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <form onSubmit={handlePageInputSubmit} className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  onBlur={handlePageInputSubmit}
                  className="w-9 sm:w-11 text-center font-mono font-bold text-slate-900 text-xs bg-white border border-slate-300 rounded px-1 py-0.5 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  title="पृष्ठ संख्या दर्ज करें"
                />
                <span className="text-[11px] font-mono text-slate-500 px-1">
                  / {totalPages}
                </span>
              </form>

              <button
                type="button"
                disabled={activePage >= totalPages}
                onClick={() => handlePageChange(activePage + 1)}
                className="p-1 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition text-slate-700"
                title="अगला पृष्ठ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Zoom, Fit-to-Width, Search, Fullscreen & Download */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 ml-auto">
            {/* Zoom Controls */}
            {renderMode === 'canvas' && (
              <div className="flex items-center space-x-0.5 sm:space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
                  className="hover:text-red-600 p-0.5 transition cursor-pointer text-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1 min-w-[36px] sm:min-w-[42px] text-center text-slate-800">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(2.4, zoom + 0.15))}
                  className="hover:text-red-600 p-0.5 transition cursor-pointer text-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setZoom(1.0)}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 border-l border-slate-200 pl-1.5 hidden md:inline cursor-pointer"
                  title="रीसेट 100%"
                >
                  100%
                </button>
              </div>
            )}

            {/* Fit to Width */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={handleFitToWidth}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition cursor-pointer hidden md:flex items-center space-x-1"
                title="चौड़ाई के अनुसार फ़िट करें"
              >
                <span>चौड़ाई फ़िट</span>
              </button>
            )}

            {/* Fit to Page */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={handleFitToPage}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition cursor-pointer hidden lg:flex items-center space-x-1"
                title="पूरा पेज फ़िट करें"
              >
                <span>पेज फ़िट</span>
              </button>
            )}

            {/* 2-Page Spread Mode Toggle for Desktop */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={() => setIsSpreadMode(!isSpreadMode)}
                className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer hidden md:flex items-center space-x-1 ${
                  isSpreadMode
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title={isSpreadMode ? 'एकल पृष्ठ मोड (Single Page)' : 'दोहरा पृष्ठ स्प्रेड (2-Page Spread)'}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isSpreadMode ? 'दोहरा पृष्ठ' : 'स्प्रेड'}</span>
              </button>
            )}

            {/* Text Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center ${
                isSearchOpen
                  ? 'bg-red-50 text-red-600 border-red-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              title="दस्तावेज़ में शब्द खोजें"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Thumbnails Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 rounded-lg border transition cursor-pointer hidden sm:flex items-center ${
                showThumbnails
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              title="पेज थंबनेल्स टॉगल करें"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Rotate Button */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer hidden sm:flex items-center"
                title={`पेज घुमाएं (वर्तमान: ${rotation}°)`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer hidden sm:flex items-center"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Print */}
            {allowPrint && (
              <button
                type="button"
                onClick={handlePrint}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer hidden sm:flex items-center"
                title="अखबार प्रिंट करें"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Crop News Clip Tool Button */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={() => setShowClippingModal(true)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition cursor-pointer hidden md:flex items-center space-x-1"
                title="अखबार की कतरन काटें और WhatsApp पर शेयर करें"
              >
                <Scissors className="w-3.5 h-3.5 text-red-600" />
                <span>कतरन काटें</span>
              </button>
            )}

            {/* Download Current Page as Image */}
            {renderMode === 'canvas' && (
              <button
                type="button"
                onClick={handleDownloadCurrentPageImage}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition cursor-pointer hidden lg:flex items-center space-x-1"
                title="वर्तमान पेज की इमेज डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span>यह पेज</span>
              </button>
            )}

            {/* Download Original PDF */}
            {allowDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                title="मूल मुद्रित PDF डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF डाउनलोड</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. IN-DOCUMENT SEARCH BAR */}
      {isSearchOpen && (
        <div className="bg-amber-50/95 border-b border-amber-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-20 shrink-0 text-xs animate-fadeIn">
          <div className="flex items-center space-x-2 flex-1 max-w-lg">
            <Search className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <input
              type="text"
              placeholder="अखबार में शब्द खोजें (उदा: मोदी, संसद, खेल, व्यापार...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchExecute()}
              className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleSearchExecute}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded font-bold text-xs cursor-pointer disabled:opacity-50 transition shrink-0"
            >
              {isSearching ? 'खोज...' : 'सर्च'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {searchStatusText && (
              <span className="text-[11px] font-medium text-amber-900">
                {searchStatusText}
              </span>
            )}
            {searchResults.length > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handlePrevSearchResult}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 hover:bg-amber-100 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  पिछला
                </button>
                <button
                  type="button"
                  onClick={handleNextSearchResult}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 hover:bg-amber-100 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  अगला
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-amber-800 hover:text-black p-1 cursor-pointer"
              title="सर्च बंद करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div
        ref={scrollWrapperRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-auto bg-slate-200/70 p-2 sm:p-6 flex justify-center items-start relative select-text"
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-30 space-y-3">
            <div className="w-9 h-9 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-800 font-kd-meta">
              ई-पेपर लोड हो रहा है...
            </p>
          </div>
        )}

        {pageRendering && !loading && (
          <div className="absolute top-3 right-4 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-20 flex items-center space-x-1.5 backdrop-blur-xs">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>पृष्ठ {activePage} लोड हो रहा है...</span>
          </div>
        )}

        {loadError && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md my-auto text-center border border-red-200 shadow-xl space-y-3 z-30">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-kd-headline">
              PDF लोड नहीं हो सका
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{loadError}</p>
            <button
              type="button"
              onClick={() => setRenderMode('native')}
              className="bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              ब्राउज़र नेटिव व्यूअर में खोलें
            </button>
          </div>
        )}

        {/* View Mode A: Canvas Render (Single Page or Dual Spread) */}
        {!loadError && renderMode === 'canvas' && (
          <div className="flex flex-col xl:flex-row items-center justify-center gap-4 my-auto transition-all duration-150">
            {/* Left Page (activePage) */}
            <div className="shadow-2xl border border-slate-300 bg-white rounded-xs overflow-hidden flex flex-col items-center">
              {isSpreadMode && (
                <div className="bg-slate-100 text-[10px] font-bold text-slate-600 py-0.5 px-3 w-full text-center border-b border-slate-200 font-kd-meta">
                  पृष्ठ {activePage} {activePage < totalPages ? '(बायां पृष्ठ)' : ''}
                </div>
              )}
              <canvas ref={canvasRef} className="max-w-full h-auto block select-text" />
            </div>

            {/* Right Page (activePage + 1, visible when in Spread Mode) */}
            {isSpreadMode && activePage < totalPages && (
              <div className="shadow-2xl border border-slate-300 bg-white rounded-xs overflow-hidden flex flex-col items-center">
                <div className="bg-slate-100 text-[10px] font-bold text-slate-600 py-0.5 px-3 w-full text-center border-b border-slate-200 font-kd-meta">
                  पृष्ठ {activePage + 1} (दायां पृष्ठ)
                </div>
                <canvas ref={secondCanvasRef} className="max-w-full h-auto block select-text" />
              </div>
            )}
          </div>
        )}

        {/* View Mode B: Native Browser Iframe */}
        {!loadError && renderMode === 'native' && Boolean(pdfUrl && pdfUrl.trim() !== '') && (
          <div className="w-full h-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden border border-slate-300 my-auto">
            <iframe
              src={`${pdfUrl}#page=${activePage}&view=FitH`}
              title="ई-पेपर PDF"
              className="w-full h-full min-h-[75vh] border-0"
            />
          </div>
        )}
      </div>

      {/* 4. BOTTOM THUMBNAIL SELECTOR STRIP (DESKTOP / TABLET ONLY) */}
      {showThumbnails && !loadError && (
        <div className="hidden sm:flex bg-white border-t border-slate-200 px-3 py-2 items-center space-x-2 overflow-x-auto scrollbar-thin shrink-0 z-10 select-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            पृष्ठ चयन:
          </span>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pNum = idx + 1;
            const isSelected = pNum === activePage;
            const thumbUrl = thumbnailUrls[pNum];

            return (
              <button
                key={pNum}
                type="button"
                onClick={() => handlePageChange(pNum)}
                className={`shrink-0 flex flex-col items-center rounded-lg p-1 transition cursor-pointer border ${
                  isSelected
                    ? 'border-red-600 bg-red-50/80 shadow-xs ring-1 ring-red-400'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
                title={`पृष्ठ ${pNum} पर जाएं`}
              >
                {thumbUrl && thumbUrl.trim() !== '' ? (
                  <div className="w-10 sm:w-12 h-14 sm:h-16 bg-white border border-slate-300 overflow-hidden rounded-xs mb-0.5">
                    <img
                      src={thumbUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                      alt={`Page ${pNum}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-10 sm:w-12 h-14 sm:h-16 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xs mb-0.5 text-slate-500 font-mono text-[10px] font-bold">
                    P{pNum}
                  </div>
                )}
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isSelected ? 'text-red-700' : 'text-slate-600'
                  }`}
                >
                  P.{pNum}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 5. ULTRA-COMPACT MOBILE FLOATING THUMB-FRIENDLY NAV BAR (MINIMALIST & CLEAN) */}
      {!loadError && renderMode === 'canvas' && (
        <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/95 backdrop-blur-md text-slate-800 px-2 py-1.5 rounded-full shadow-2xl border border-slate-300 gap-1.5 select-none animate-in fade-in slide-in-from-bottom-2">
          {/* Prev Page Button */}
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => handlePageChange(activePage - 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-slate-700"
            title="पिछला पेज"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Indicator Pill (Tap to Open Mobile Page Sheet) */}
          <button
            type="button"
            onClick={() => setShowMobilePageDrawer(true)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-full text-xs font-mono font-bold text-red-700 flex items-center space-x-1 border border-slate-200 cursor-pointer transition"
            title="पेज चुनें (Tap to choose page)"
          >
            <span>{activePage}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-600">{totalPages}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Next Page Button */}
          <button
            type="button"
            disabled={activePage >= totalPages}
            onClick={() => handlePageChange(activePage + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-slate-700"
            title="अगला पेज"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* 1-Tap Zoom Toggle (1.0x vs 2.0x) */}
          <button
            type="button"
            onClick={() => setZoom((prev) => (prev > 1.3 ? 1.0 : 2.0))}
            className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition cursor-pointer ${
              zoom > 1.3 ? 'bg-red-100 text-red-800 font-bold border border-red-200' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title={zoom > 1.3 ? 'रीसेट 100%' : 'ज़ूम 200%'}
          >
            {zoom > 1.3 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* News Clipping / Crop Button */}
          <button
            type="button"
            onClick={() => setShowClippingModal(true)}
            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 active:scale-90 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
            title="कतरन काटें और शेयर करें"
          >
            <Scissors className="w-4 h-4" />
          </button>

          {/* Download Current Page as Image */}
          <button
            type="button"
            onClick={handleDownloadCurrentPageImage}
            className="w-8 h-8 rounded-full hover:bg-slate-100 active:scale-90 text-slate-700 flex items-center justify-center transition cursor-pointer"
            title="यह पेज इमेज डाउनलोड करें"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. MOBILE PAGE SELECTION BOTTOM SHEET (CLEAN & MINIMALIST) */}
      {showMobilePageDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 font-kd-body sm:hidden">
          <div className="bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
            <div className="p-3.5 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm text-slate-900 font-kd-headline">
                  अखबार के पृष्ठ (कुल {totalPages} पेज)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePageDrawer(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-4 gap-2.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                const isSelected = pNum === activePage;
                const thumbUrl = thumbnailUrls[pNum];

                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => {
                      handlePageChange(pNum);
                      setShowMobilePageDrawer(false);
                    }}
                    className={`flex flex-col items-center rounded-xl p-1.5 transition cursor-pointer border ${
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500 shadow-xs font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="w-full aspect-[3/4] bg-white border border-slate-200 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={`Page ${pNum}`} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="font-mono text-xs font-bold text-slate-400">P.{pNum}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono">पृष्ठ {pNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. NEWSPAPER ARTICLE CLIPPING & WHATSAPP SHARE MODAL */}
      {showClippingModal && (
        <EPaperPageClippingModal
          pageCanvas={canvasRef.current}
          pageNumber={activePage}
          editionTitle={editionTitle}
          dateString={dateString}
          onClose={() => setShowClippingModal(false)}
        />
      )}
    </div>
  );
};
