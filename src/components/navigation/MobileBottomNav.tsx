import React from 'react';
import {
  Home,
  Zap,
  Flame,
  Newspaper,
  Tv,
  Camera,
  Gamepad2,
  Send,
  Archive,
  PhoneCall,
  Eye,
  ShieldCheck,
  Hash,
  Link2,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import {
  NewsCategory,
  MobileBottomNavConfig,
  BottomNavItemConfig,
} from '../../types/news';
import { LegalPolicyType } from '../LegalPolicyPageView';

interface MobileBottomNavProps {
  currentView: string;
  currentCategory: NewsCategory;
  activeArticle: any | null;
  activeLegalPolicyType?: LegalPolicyType;
  config?: MobileBottomNavConfig;
  onNavigateHome: () => void;
  onNavigateLatest: () => void;
  onNavigateTrending: () => void;
  onNavigateStates: () => void;
  onOpenEPaper: () => void;
  onScrollToVideos: () => void;
  onScrollToPhotos: () => void;
  onOpenSudoku: () => void;
  onOpenSubmitNews: () => void;
  onOpenArchivePage: () => void;
  onOpenContactPage: () => void;
  onOpenAboutUsPage: () => void;
  onOpenLegalPolicy: (type: LegalPolicyType) => void;
  onSelectCategory: (category: NewsCategory) => void;
}

/**
 * MobileBottomNav
 * 5-slot mobile bottom navigation bar with configurable actions, labels, icons, and safe-area insets.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  currentCategory,
  activeArticle,
  activeLegalPolicyType = 'privacy',
  config,
  onNavigateHome,
  onNavigateLatest,
  onNavigateTrending,
  onNavigateStates,
  onOpenEPaper,
  onScrollToVideos,
  onScrollToPhotos,
  onOpenSudoku,
  onOpenSubmitNews,
  onOpenArchivePage,
  onOpenContactPage,
  onOpenAboutUsPage,
  onOpenLegalPolicy,
  onSelectCategory,
}) => {
  if (config?.enabled === false) return null;

  const showLabels = config?.showLabels !== false;

  const rawItems: BottomNavItemConfig[] =
    config?.items && config.items.length === 5
      ? config.items
      : [
          { id: 'slot-1', type: 'home', label: config?.homeLabel || 'होम', icon: '🏠' },
          { id: 'slot-2', type: 'latest', label: config?.latestLabel || 'ताज़ा', icon: '⚡' },
          { id: 'slot-3', type: 'trending', label: config?.trendingLabel || 'ट्रेंडिंग', icon: '🔥' },
          { id: 'slot-4', type: 'states', label: config?.statesLabel || 'राज्य', icon: '📍' },
          {
            id: 'slot-5',
            type: (config?.fifthItem as any) || 'epaper',
            label:
              config?.customLabel ||
              (config?.fifthItem === 'videos'
                ? 'वीडियो'
                : config?.fifthItem === 'photos'
                ? 'फ़ोटो'
                : config?.fifthItem === 'games'
                ? 'सुडोकू'
                : config?.fifthItem === 'submit_news'
                ? 'खबर भेजें'
                : config?.fifthItem === 'archive'
                ? 'पुरालेख'
                : config?.fifthItem === 'contact'
                ? 'संपर्क'
                : config?.fifthItem === 'about'
                ? 'हमारे बारे में'
                : config?.fifthItem === 'legal'
                ? 'नीतियां'
                : config?.fifthItem === 'complaint'
                ? 'शिकायत'
                : 'ई-पेपर'),
            icon:
              config?.customIcon ||
              (config?.fifthItem === 'videos'
                ? '📺'
                : config?.fifthItem === 'photos'
                ? '📸'
                : config?.fifthItem === 'games'
                ? '🎮'
                : config?.fifthItem === 'submit_news'
                ? '✍️'
                : config?.fifthItem === 'archive'
                ? '📂'
                : config?.fifthItem === 'contact'
                ? '📞'
                : config?.fifthItem === 'about'
                ? '🏢'
                : config?.fifthItem === 'legal'
                ? '🛡️'
                : config?.fifthItem === 'complaint'
                ? '⚖️'
                : '📰'),
            targetCategory: config?.customCategory,
            targetUrl: config?.customUrl,
            openInNewTab: config?.openInNewTab,
          },
        ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[calc(0.35rem+env(safe-area-inset-bottom))] transition-all duration-200"
    >
      <div className="grid grid-cols-5 items-center text-center">
        {rawItems.map((item, idx) => {
          let isActive = false;
          if (item.type === 'home') {
            isActive = currentView === 'home' && currentCategory === 'all' && !activeArticle;
          } else if (item.type === 'latest') {
            isActive = currentView === 'home' && currentCategory === 'national';
          } else if (item.type === 'states') {
            isActive = currentView === 'home' && currentCategory === 'state';
          } else if (item.type === 'contact') {
            isActive = currentView === 'contact' || (currentView === 'legal' && activeLegalPolicyType === 'contact');
          } else if (item.type === 'about') {
            isActive = currentView === 'about' || (currentView === 'legal' && activeLegalPolicyType === 'about');
          } else if (item.type === 'legal') {
            isActive =
              currentView === 'legal' &&
              activeLegalPolicyType !== 'contact' &&
              activeLegalPolicyType !== 'about' &&
              activeLegalPolicyType !== 'complaint';
          } else if (item.type === 'complaint') {
            isActive = currentView === 'legal' && activeLegalPolicyType === 'complaint';
          } else if (item.type === 'archive') {
            isActive = currentView === 'archive';
          } else if (item.type === 'submit_news') {
            isActive = currentView === 'submit-news';
          } else if (item.type === 'trending') {
            isActive = currentView === 'home' && currentCategory === 'trending';
          } else if (item.type === 'epaper') {
            isActive = currentView === 'epaper';
          } else if (item.type === 'category' && item.targetCategory) {
            isActive = currentView === 'home' && currentCategory === item.targetCategory;
          }

          const handleClick = () => {
            switch (item.type) {
              case 'home':
                onNavigateHome();
                break;
              case 'latest':
                onNavigateLatest();
                break;
              case 'trending':
                onNavigateTrending();
                break;
              case 'states':
                onNavigateStates();
                break;
              case 'epaper':
                onOpenEPaper();
                break;
              case 'videos':
                onScrollToVideos();
                break;
              case 'photos':
                onScrollToPhotos();
                break;
              case 'games':
                onOpenSudoku();
                break;
              case 'submit_news':
                onOpenSubmitNews();
                break;
              case 'archive':
                onOpenArchivePage();
                break;
              case 'contact':
                onOpenContactPage();
                break;
              case 'about':
                onOpenAboutUsPage();
                break;
              case 'legal':
                onOpenLegalPolicy('privacy');
                break;
              case 'complaint':
                onOpenLegalPolicy('complaint');
                break;
              case 'category':
                if (item.targetCategory) {
                  onSelectCategory(item.targetCategory as any);
                }
                break;
              case 'custom_link':
                if (item.targetUrl) {
                  if (item.targetUrl.startsWith('http')) {
                    if (item.openInNewTab) {
                      window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = item.targetUrl;
                    }
                  } else if (item.targetUrl.startsWith('#')) {
                    const targetEl = document.querySelector(item.targetUrl);
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = item.targetUrl;
                  }
                }
                break;
              default:
                onOpenEPaper();
            }
          };

          const renderIcon = () => {
            if (item.icon && item.icon.trim().length > 0) {
              return <span className="text-lg leading-none">{item.icon}</span>;
            }
            switch (item.type) {
              case 'home':
                return <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />;
              case 'latest':
                return <Zap className={`w-5 h-5 ${isActive ? 'fill-red-600' : ''}`} />;
              case 'trending':
                return <Flame className="w-5 h-5 text-amber-500" />;
              case 'states':
                return <MapPin className={`w-5 h-5 ${isActive ? 'fill-red-600' : ''}`} />;
              case 'videos':
                return <Tv className="w-5 h-5 text-purple-600" />;
              case 'photos':
                return <ImageIcon className="w-5 h-5 text-blue-600" />;
              case 'games':
                return <Gamepad2 className="w-5 h-5 text-emerald-600" />;
              case 'submit_news':
                return <Send className="w-5 h-5 text-amber-600" />;
              case 'archive':
                return <Archive className="w-5 h-5 text-indigo-600" />;
              case 'contact':
                return <PhoneCall className="w-5 h-5 text-emerald-600" />;
              case 'about':
                return <Eye className="w-5 h-5 text-blue-600" />;
              case 'legal':
                return <ShieldCheck className="w-5 h-5 text-red-600" />;
              case 'complaint':
                return <span className="text-lg leading-none">⚖️</span>;
              case 'category':
                return <Hash className="w-5 h-5 text-slate-700" />;
              case 'custom_link':
                return <Link2 className="w-5 h-5 text-blue-600" />;
              case 'epaper':
              default:
                return <Newspaper className="w-5 h-5 text-red-600" />;
            }
          };

          return (
            <button
              key={item.id || `slot-${idx}`}
              type="button"
              onClick={handleClick}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {renderIcon()}
              {showLabels && (
                <span className="text-[10px] mt-0.5 tracking-tight font-kd-meta truncate max-w-[64px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
