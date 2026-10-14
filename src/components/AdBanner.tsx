import React, { useState, useEffect } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { AdResponsiveBreakpoints, AdSlotBreakpointSize } from '../types/news';

interface AdBannerProps {
  slot: 'leaderboard' | 'in-content' | 'sidebar' | 'bottom' | 'mobile_sticky';
  type?: 'adsense' | 'private';
  privateBannerUrl?: string;
  privateBannerLink?: string;
  privateBannerTitle?: string;
  customScriptOrHtml?: string;
  onOpenContactPage?: () => void;
  className?: string;
  breakpoints?: AdResponsiveBreakpoints;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  type = 'adsense',
  privateBannerUrl,
  privateBannerLink = '#contact',
  privateBannerTitle = 'खबरी दोस्त मीडिया नेटवर्क | प्रायोजित विज्ञापन',
  customScriptOrHtml,
  onOpenContactPage,
  className = '',
  breakpoints,
}) => {
  const isPrivate = type === 'private' && privateBannerUrl;

  // Window width listener for responsive custom breakpoint evaluation
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active responsive breakpoint config based on custom admin break-points
  const activeBreakpoint: AdSlotBreakpointSize | undefined = (() => {
    if (!breakpoints || breakpoints.enableCustomBreakpoints === false) return undefined;
    const mobileMaxWidth = breakpoints.mobile?.maxWidth ?? 640;
    const tabletMaxWidth = breakpoints.tablet?.maxWidth ?? 1024;

    if (windowWidth < mobileMaxWidth) {
      return breakpoints.mobile;
    } else if (windowWidth < tabletMaxWidth) {
      return breakpoints.tablet;
    } else {
      return breakpoints.desktop;
    }
  })();

  // Check if admin configured hiding this banner on this specific breakpoint
  if (activeBreakpoint?.hideOnBreakpoint) {
    return null;
  }

  const handleSponsorClick = (e: React.MouseEvent) => {
    if (privateBannerLink === '#contact' || privateBannerLink === '/contact') {
      e.preventDefault();
      if (onOpenContactPage) {
        onOpenContactPage();
      } else {
        window.location.hash = 'contact';
      }
    }
  };

  // Compute container dimensions from admin breakpoints or fallback defaults
  const containerStyle: React.CSSProperties = {};
  if (activeBreakpoint) {
    if (activeBreakpoint.minHeightPx) {
      containerStyle.minHeight = `${activeBreakpoint.minHeightPx}px`;
    }
    if (activeBreakpoint.maxHeightPx) {
      containerStyle.maxHeight = `${activeBreakpoint.maxHeightPx}px`;
    }
    if (activeBreakpoint.aspectRatio && activeBreakpoint.aspectRatio !== 'auto') {
      containerStyle.aspectRatio = activeBreakpoint.aspectRatio;
    }
  }

  return (
    <div
      className={`relative my-4 w-full bg-slate-50/90 border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs text-center transition-all duration-200 ${className}`}
      data-ad-slot={slot}
    >
      {/* Distinction Header Tag as required by Google AdSense & Advertising Standards */}
      <div className="bg-slate-200/70 px-3 py-1 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans tracking-wider uppercase">
        <span className="flex items-center space-x-1 font-semibold">
          <Info className="w-3 h-3 text-slate-400" />
          <span>विज्ञापन • ADVERTISEMENT</span>
        </span>
        <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 font-mono">
          {activeBreakpoint && (
            <span className="hidden sm:inline-block bg-slate-300/60 px-1.5 py-0.2 rounded text-[8px] font-bold">
              {windowWidth < 640 ? 'MOBILE' : windowWidth < 1024 ? 'TABLET' : 'DESKTOP'}
            </span>
          )}
          <span>
            {customScriptOrHtml ? 'कस्टम Ad स्क्रिप्ट' : type === 'adsense' ? 'Google AdSense' : 'प्रायोजित / Sponsored'}
          </span>
        </div>
      </div>

      {customScriptOrHtml ? (
        <div
          style={containerStyle}
          className="p-3 sm:p-4 bg-white flex items-center justify-center min-h-[90px]"
        >
          <div
            className="w-full flex justify-center items-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: customScriptOrHtml }}
          />
        </div>
      ) : isPrivate ? (
        <a
          href={privateBannerLink}
          onClick={handleSponsorClick}
          target={privateBannerLink.startsWith('http') ? '_blank' : undefined}
          rel={privateBannerLink.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="group block relative overflow-hidden"
        >
          <div
            style={containerStyle}
            className={`relative w-full bg-slate-800 flex items-center justify-center overflow-hidden ${
              !activeBreakpoint
                ? slot === 'sidebar'
                  ? 'aspect-[300/220] sm:aspect-[300/200] min-h-[140px] max-h-60'
                  : 'aspect-[320/100] sm:aspect-[728/90] min-h-[75px] sm:min-h-[90px] max-h-40'
                : ''
            }`}
          >
            <img
              src={privateBannerUrl}
              alt="प्रायोजित विज्ञापन"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent flex ${
                slot === 'sidebar'
                  ? 'flex-col justify-end p-3.5 text-left'
                  : 'items-center justify-between px-4 sm:px-8 text-left'
              }`}
            >
              <div className={slot === 'sidebar' ? 'w-full mb-1' : 'max-w-md'}>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase font-mono">
                  विशेष ऑफर
                </span>
                <p className="text-white text-xs sm:text-sm font-bold mt-1 line-clamp-2">
                  {privateBannerTitle}
                </p>
                {slot !== 'sidebar' && (
                  <p className="text-[10px] text-slate-300 hidden sm:block">
                    खबरी दोस्त के 5 लाख+ पाठकों तक अपना ब्रांड पहुंचाएं
                  </p>
                )}
              </div>
              <span
                className={`bg-red-600 group-hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs transition shrink-0 ${
                  slot === 'sidebar' ? 'self-start mt-1' : ''
                }`}
              >
                <span>क्लिक करें</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </a>
      ) : (
        /* Responsive Google AdSense Simulator Slot */
        <div
          style={containerStyle}
          className="p-4 sm:p-5 flex flex-col items-center justify-center min-h-[90px] sm:min-h-[105px] bg-gradient-to-b from-slate-100/60 to-slate-200/40"
        >
          <div className="max-w-lg text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 font-sans tracking-wide">
              Google AdSense Responsive Unit ({slot.toUpperCase()})
            </span>
            <p className="text-[11px] text-slate-500">
              [ca-pub-XXXXXXXXXXXXX] • लाइव प्रोडक्शन में AdSense स्क्रिप्ट यहाँ स्वचालित रूप से विज्ञापन लोड करेगी
            </p>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenContactPage) onOpenContactPage();
                  else window.location.hash = 'contact';
                }}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer transition"
              >
                इस स्लॉट पर डायरेक्ट विज्ञापन एवं पार्टनरशिप हेतु संपर्क करें →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
