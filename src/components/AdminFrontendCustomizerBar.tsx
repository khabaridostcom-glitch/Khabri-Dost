import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Layout,
  Globe,
  DollarSign,
  PenTool,
  LogOut,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Smartphone,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminSettingsTab } from './AdminSettingsModal';

interface AdminFrontendCustomizerBarProps {
  onOpenSettingsTab: (tab: AdminSettingsTab) => void;
  onOpenAdminBackend: () => void;
  onNewArticle: () => void;
}

/**
 * AdminFrontendCustomizerBar
 * Clean, modern English floating toolbar visible strictly to authenticated administrators.
 * Provides instant 1-tap jump to any appearance or layout studio while browsing the frontend.
 */
export const AdminFrontendCustomizerBar: React.FC<AdminFrontendCustomizerBarProps> = ({
  onOpenSettingsTab,
  onOpenAdminBackend,
  onNewArticle,
}) => {
  const { isAdmin, logoutStaff, staffSession } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl font-kd-meta pointer-events-auto animate-fadeIn">
      <div className="bg-white/98 backdrop-blur-md text-slate-900 rounded-2xl border-2 border-red-500/60 shadow-2xl p-2 sm:p-2.5 flex flex-col space-y-2 ring-1 ring-slate-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-bold text-red-600 font-kd-headline text-xs sm:text-sm">
              Admin Live Studio
            </span>
            <span className="bg-red-100 text-red-800 text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase hidden md:inline border border-red-200">
              SUPER ADMIN • {staffSession?.name || 'Admin'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1 text-[11px] cursor-pointer"
              title={isExpanded ? 'Minimize bar' : 'Expand customizer bar'}
            >
              <span>{isExpanded ? 'Hide Bar' : 'Show Studio Bar'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={logoutStaff}
              title="Log out of Admin session"
              className="text-slate-500 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Quick Action Grid */}
        {isExpanded && (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-1.5 pt-1 border-t border-slate-200 text-center">
            {/* 1. Homepage & Studio Layout */}
            <button
              onClick={() => onOpenSettingsTab('homepage_sections')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Configure Digital Studio, Live Video Bulletins, Photo Galleries & Section Toggles"
            >
              <Layout className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Home Sections</span>
            </button>

            {/* 2. Header & Branding */}
            <button
              onClick={() => onOpenSettingsTab('header')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Site title, logo, header height, tagline and live stream links"
            >
              <Globe className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Header & Brand</span>
            </button>

            {/* 3. Typography & Fonts */}
            <button
              onClick={() => onOpenSettingsTab('typography')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Font family, heading font, body font size and mobile font scaling"
            >
              <Type className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Typography</span>
            </button>

            {/* 4. Spotlight Hero Layout */}
            <button
              onClick={() => onOpenSettingsTab('spotlight')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="3-Column Spotlight Hero Slider, Secondary Cards & Continuous Brief Ticker"
            >
              <Layers className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Spotlight Hero</span>
            </button>

            {/* 5. Sidebar Widgets */}
            <button
              onClick={() => onOpenSettingsTab('sidebar_widgets')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Reading progress bar, Gold rate, Daily Rashifal, Opinion poll and Related stories"
            >
              <Sliders className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Sidebar Widgets</span>
            </button>

            {/* 6. Ads & Monetization */}
            <button
              onClick={() => onOpenSettingsTab('ads')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Google AdSense, private sponsor banners, mobile sticky bar & desktop sticky ad"
            >
              <DollarSign className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Monetization</span>
            </button>

            {/* 7. Mobile Bottom Navigation */}
            <button
              onClick={() => onOpenSettingsTab('mobile_footer')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Configure 5 slots on mobile bottom navigation bar and mobile drawer"
            >
              <Smartphone className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Mobile Bottom</span>
            </button>

            {/* 8. SEO & Speed Vitals */}
            <button
              onClick={() => onOpenSettingsTab('speed_vitals')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 transition group cursor-pointer"
              title="Core Web Vitals, Google News sitemap, AI SEO generator and JSON-LD schema"
            >
              <BarChart3 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">SEO & Vitals</span>
            </button>

            {/* 9. Open Full CMS Backend */}
            <button
              onClick={onOpenAdminBackend}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition group cursor-pointer shadow-2xs"
              title="Open full WordPress-style 7-category CMS Admin Control Panel"
            >
              <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">CMS Admin</span>
            </button>

            {/* 10. Write New Article */}
            <button
              onClick={onNewArticle}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-md group cursor-pointer"
              title="Open Rich Newsroom Article Editor"
            >
              <PenTool className="w-4 h-4 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">+ New Post</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
