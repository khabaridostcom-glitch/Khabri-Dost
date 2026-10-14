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
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { AdminSettingsTab } from './AdminSettingsModal';

interface AdminFrontendCustomizerBarProps {
  onOpenSettingsTab: (tab: AdminSettingsTab) => void;
  onOpenAdminBackend: () => void;
  onNewArticle: () => void;
}

export const AdminFrontendCustomizerBar: React.FC<AdminFrontendCustomizerBarProps> = ({
  onOpenSettingsTab,
  onOpenAdminBackend,
  onNewArticle,
}) => {
  const { isAdmin, logoutStaff, staffSession } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  // STRICT REQUIREMENT: Only visible to authenticated Admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl font-kd-meta pointer-events-auto animate-fadeIn">
      <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-2xl border border-red-600/50 shadow-2xl p-2 sm:p-2.5 flex flex-col space-y-2 ring-1 ring-white/10">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-amber-300 font-kd-headline text-xs sm:text-sm">
              एडमिन लाइव कस्टमाइज़र (Admin Live Studio)
            </span>
            <span className="bg-red-800 text-amber-200 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase hidden md:inline">
              SUPER ADMIN • {staffSession?.name || 'Admin'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition flex items-center space-x-1 text-[11px] cursor-pointer"
              title={isExpanded ? 'मिनीमाइज़ करें' : 'कस्टमाइज़र बार खोलें'}
            >
              <span>{isExpanded ? 'छिपाएं' : 'सेटिंग्स बार खोलें'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={logoutStaff}
              title="एडमिन लॉगआउट करें"
              className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Quick Action Grid */}
        {isExpanded && (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-1.5 pt-1 border-t border-slate-800 text-center">
            {/* 1. Homepage & Studio Layout */}
            <button
              onClick={() => onOpenSettingsTab('homepage_sections')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="डिजिटल स्टूडियो, लाइव वीडियो बुलेटिन, फ़ोटो गैलरी व टिकर हाइड/शो"
            >
              <Layout className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">स्टूडियो व होम</span>
            </button>

            {/* 2. Header & Branding */}
            <button
              onClick={() => onOpenSettingsTab('header')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="वेबसाइट नाम, लोगो, टैगलाइन व लाइव टीवी स्ट्रीम"
            >
              <Globe className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">हेडर सेटिंग्स</span>
            </button>

            {/* 3. Typography & Body */}
            <button
              onClick={() => onOpenSettingsTab('typography')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="अख़बारी फ़ॉन्ट (Rozha One), बॉडी फ़ॉन्ट, साइज़ व स्केल"
            >
              <Type className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">फ़ॉन्ट व बॉडी</span>
            </button>

            {/* 4. Speed & Web Vitals */}
            <button
              onClick={() => onOpenSettingsTab('speed_vitals')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="सुपर फ़ास्ट स्पीड, Core Web Vitals, WebP व मोबाइल सेटिंग्स"
            >
              <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">स्पीड व वाइटल्स</span>
            </button>

            {/* 5. Google Suite */}
            <button
              onClick={() => onOpenSettingsTab('google_suite')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="Google Analytics 4, Search Console व AdSense"
            >
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">Google Suite</span>
            </button>

            {/* 6. Article Widgets & Sidebar */}
            <button
              onClick={() => onOpenSettingsTab('sidebar_widgets')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="प्रोग्रेस बार, पोल, ट्रेंडिंग साइडबार, लेखक बायो व चैनल"
            >
              <Sliders className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">विजेट्स</span>
            </button>

            {/* 7. Footer & Social */}
            <button
              onClick={() => onOpenSettingsTab('footer')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="फ़ुटर संपर्क, RNI नंबर, सोशल लिंक्स व नीतियां"
            >
              <Sliders className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">फ़ुटर व सोशल</span>
            </button>

            {/* 8. Ads & Monetization */}
            <button
              onClick={() => onOpenSettingsTab('ads')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-200 hover:text-white transition group cursor-pointer"
              title="लीडरबोर्ड, इन-कंटेंट, साइडबार व स्पॉन्सर विज्ञापन"
            >
              <DollarSign className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">विज्ञापन</span>
            </button>

            {/* 9. New Article Action */}
            <button
              onClick={onNewArticle}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition group cursor-pointer shadow-xs"
              title="नई ख़बर लिखें एवं तुरंत प्रकाशित करें"
            >
              <PenTool className="w-4 h-4 text-white group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">नई ख़बर</span>
            </button>

            {/* 10. Full Admin Dashboard */}
            <button
              onClick={onOpenAdminBackend}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-white transition group cursor-pointer"
              title="सम्पूर्ण एडमिन सीएमएस पैनल (आर्टिकल्स, मीडिया, यूज़र्स)"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold truncate w-full">एडमिन CMS</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
