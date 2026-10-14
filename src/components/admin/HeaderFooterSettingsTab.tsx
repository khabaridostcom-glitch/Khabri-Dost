import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sliders,
  Share2,
  Mail,
  ShieldCheck,
  Sparkles,
  MapPin,
  FileText,
  Tv,
  Newspaper,
  BookMarked,
  Radio,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  Search,
  ExternalLink,
  Code2,
  Camera,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { PortalSettings, HeaderFooterSettings, CustomSocialChannel, PhotoStoryItem } from '../../types/news';
import { CATEGORIES, MAJOR_INDIAN_STATES } from '../../data/seedNews';
import { INITIAL_PHOTO_STORIES } from '../../data/portalDefaults';

interface HeaderFooterSettingsTabProps {
  settings: PortalSettings;
  onChange: (newSettings: PortalSettings) => void;
  defaultSection?: 'branding' | 'navigation' | 'states' | 'social' | 'footer' | 'contact' | 'policies' | 'multimedia' | 'ads';
  onOpenFactoryReset?: () => void;
}

export const HeaderFooterSettingsTab: React.FC<HeaderFooterSettingsTabProps> = ({
  settings,
  onChange,
  defaultSection = 'branding',
  onOpenFactoryReset,
}) => {
  const [activeSection, setActiveSection] = useState<
    'branding' | 'navigation' | 'states' | 'social' | 'footer' | 'contact' | 'policies' | 'multimedia' | 'ads'
  >(defaultSection);

  useEffect(() => {
    if (defaultSection) {
      setActiveSection(defaultSection);
    }
  }, [defaultSection]);

  // New social channel input state
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformUrl, setNewPlatformUrl] = useState('');

  // New state input
  const [newStateName, setNewStateName] = useState('');

  // Category heading rename state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatLabel, setEditingCatLabel] = useState('');

  // New photo story input state
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('राष्ट्रीय');

  const current: HeaderFooterSettings = settings.headerFooter || {
    siteTitle: 'खबरी दोस्त',
    siteTagline: 'KHABRI DOST • भारत का विश्वसनीय हिंदी न्यूज़ पोर्टल',
    contactEmail: 'khabridost.com@gmail.com',
    contactAddress: 'प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001',
    contactPhone: '+91 11 2345 6789',
    rniNumber: 'DELHIN/2024/84920',
    showRniNumber: false,
    footerTheme: 'dark_slate',
    footerAboutHeading: 'खबरी दोस्त • निष्पक्ष पत्रकारिता का संकल्प',
    footerAboutText:
      'भारत का अग्रणी, स्वतंत्र और निष्पक्ष डिजिटल समाचार मंच। सत्य, सटीकता और जनहित की पत्रकारिता के प्रति पूर्णतः समर्पित।',
    footerBrandingPartnerName: 'iTree Network Solutions',
    footerBrandingPartnerUrl: 'https://itreenet.com',
    footerBottomName: 'खबरी दोस्त डिजिटल न्यूज़ नेटवर्क',
    headerShowLiveTv: true,
    headerShowEPaper: true,
    headerShowBookmarks: true,
    headerShowNewsTicker: true,
    headerShowMegaMenu: true,
    headerShowSearch: true,
    headerShowAdminButton: true,
    socialLinks: {
      whatsappChannel: 'https://whatsapp.com/channel/example',
      telegramChannel: 'https://t.me/example',
      facebook: 'https://facebook.com',
      twitter: 'https://x.com',
      youtube: 'https://youtube.com',
      instagram: 'https://instagram.com',
    },
    customSocialChannels: [],
    navCategoryOrder: [
      'national',
      'state',
      'politics',
      'business',
      'entertainment',
      'sports',
      'tech',
      'lifestyle',
      'world',
    ],
    disabledCategories: [],
    legalPolicies: {
      factCheckPolicy: 'We strictly verify all news claims with primary sources, official records, and ground correspondents before publication.',
      editorialEthics: 'We maintain independent reporting, free from bias, ensuring accurate, transparent, and fair journalism.',
      grievanceRedressal: 'Grievance Officer: Desk Head, Email: grievance@khabridost.com. Responses are issued within 24 hours under digital media guidelines.',
      privacyPolicy: 'We respect your privacy. Subscriber emails and visitor data are securely encrypted and never shared with third-party advertisers.',
      termsOfService: 'All portal content is protected by copyright. Reproduction without attribution is strictly prohibited.',
    },
  };

  const updateHeaderFooter = (updates: Partial<HeaderFooterSettings>) => {
    onChange({
      ...settings,
      headerFooter: {
        ...current,
        ...updates,
      },
    });
  };

  const updateSocialLinks = (key: keyof HeaderFooterSettings['socialLinks'], value: string) => {
    updateHeaderFooter({
      socialLinks: {
        ...current.socialLinks,
        [key]: value,
      },
    });
  };

  // Add custom social channel
  const handleAddCustomSocial = () => {
    if (!newPlatformName.trim() || !newPlatformUrl.trim()) return;
    const newChan: CustomSocialChannel = {
      id: `custom-soc-${Date.now()}`,
      platform: newPlatformName.trim(),
      url: newPlatformUrl.trim(),
      enabled: true,
    };
    updateHeaderFooter({
      customSocialChannels: [...(current.customSocialChannels || []), newChan],
    });
    setNewPlatformName('');
    setNewPlatformUrl('');
  };

  const handleToggleCustomSocial = (id: string) => {
    const updated = (current.customSocialChannels || []).map((ch) =>
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    );
    updateHeaderFooter({ customSocialChannels: updated });
  };

  const handleDeleteCustomSocial = (id: string) => {
    const updated = (current.customSocialChannels || []).filter((ch) => ch.id !== id);
    updateHeaderFooter({ customSocialChannels: updated });
  };

  // Navigation category ordering & toggling
  const categoryOrder = current.navCategoryOrder || [
    'national',
    'state',
    'politics',
    'business',
    'entertainment',
    'sports',
    'tech',
    'lifestyle',
    'world',
  ];
  const disabledCats = current.disabledCategories || [];

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...categoryOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    updateHeaderFooter({ navCategoryOrder: newOrder });
  };

  const handleToggleCategory = (catId: string) => {
    const isCurrentlyDisabled = disabledCats.includes(catId);
    const newDisabled = isCurrentlyDisabled
      ? disabledCats.filter((id) => id !== catId)
      : [...disabledCats, catId];
    updateHeaderFooter({ disabledCategories: newDisabled });
  };

  // Category custom heading handler
  const handleSaveCategoryHeading = (catId: string) => {
    if (!editingCatLabel.trim()) return;
    updateHeaderFooter({
      customCategoryLabels: {
        ...(current.customCategoryLabels || {}),
        [catId]: editingCatLabel.trim(),
      },
    });
    setEditingCatId(null);
    setEditingCatLabel('');
  };

  // Indian States Ordering & Customization
  const statesList =
    current.customStates && current.customStates.length > 0
      ? current.customStates
      : MAJOR_INDIAN_STATES;
  const disabledStates = current.disabledStates || [];

  const handleMoveState = (index: number, direction: 'up' | 'down') => {
    const newStates = [...statesList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStates.length) return;
    const temp = newStates[index];
    newStates[index] = newStates[targetIndex];
    newStates[targetIndex] = temp;
    updateHeaderFooter({ customStates: newStates });
  };

  const handleToggleState = (stateName: string) => {
    const isCurrentlyDisabled = disabledStates.includes(stateName);
    const newDisabled = isCurrentlyDisabled
      ? disabledStates.filter((s) => s !== stateName)
      : [...disabledStates, stateName];
    updateHeaderFooter({ disabledStates: newDisabled });
  };

  const handleAddState = () => {
    if (!newStateName.trim()) return;
    const trimmed = newStateName.trim();
    if (statesList.includes(trimmed)) return;
    updateHeaderFooter({ customStates: [...statesList, trimmed] });
    setNewStateName('');
  };

  const handleDeleteState = (stateName: string) => {
    updateHeaderFooter({
      customStates: statesList.filter((s) => s !== stateName),
      disabledStates: disabledStates.filter((s) => s !== stateName),
    });
  };

  // Policies update
  const defaultLegalPolicies = {
    factCheckPolicy: 'We strictly verify all news claims with primary sources, official records, and ground correspondents before publication.',
    editorialEthics: 'We maintain independent reporting, free from bias, ensuring accurate, transparent, and fair journalism.',
    grievanceRedressal: 'Grievance Officer: Desk Head, Email: grievance@khabridost.com. Responses are issued within 24 hours under digital media guidelines.',
    privacyPolicy: 'We respect your privacy. Subscriber emails and visitor data are securely encrypted and never shared with third-party advertisers.',
    termsOfService: 'All portal content is protected by copyright. Reproduction without attribution is strictly prohibited.',
  };

  const updatePolicies = (key: keyof typeof defaultLegalPolicies, value: string) => {
    updateHeaderFooter({
      legalPolicies: {
        ...defaultLegalPolicies,
        ...(current.legalPolicies || {}),
        [key]: value,
      },
    });
  };

  // Photo stories management
  const photoStories: PhotoStoryItem[] =
    settings.customPhotoStories && settings.customPhotoStories.length > 0
      ? settings.customPhotoStories
      : INITIAL_PHOTO_STORIES;

  const handleAddPhotoStory = () => {
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;
    const newStory: PhotoStoryItem = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle.trim(),
      imageUrl: newPhotoUrl.trim(),
      photosCount: 6,
      location: newPhotoLocation.trim() || 'भारत',
      category: newPhotoCategory,
      caption: newPhotoCaption.trim(),
      seoAltText: newPhotoCaption.trim() || newPhotoTitle.trim(),
    };
    onChange({
      ...settings,
      customPhotoStories: [newStory, ...photoStories],
    });
    setNewPhotoTitle('');
    setNewPhotoUrl('');
    setNewPhotoLocation('');
    setNewPhotoCaption('');
  };

  const handleDeletePhotoStory = (id: string) => {
    onChange({
      ...settings,
      customPhotoStories: photoStories.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl text-slate-800">
      {/* Top Banner with Clean Unified Theme */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-red-800/40 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 text-amber-300 flex items-center justify-center border border-red-500/40 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Website Customization & Core Settings (Unified Customizer)</span>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full uppercase">
                  ADMIN CONSOLE
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Header branding, navigation ordering, state editions, social & WhatsApp channels, footer, contact information, and legal policies.
              </p>
            </div>
          </div>
          {onOpenFactoryReset && (
            <button
              type="button"
              onClick={onOpenFactoryReset}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
              title="पोर्टल सेटिंग्स व टाइपोग्राफी को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Factory Reset (फ़ैक्टरी रीसेट)</span>
            </button>
          )}
        </div>

        {/* Unified Sub-Nav Switcher */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800 flex-wrap gap-y-1.5">
          {[
            { id: 'branding', label: '1. Header & Branding', icon: Sliders },
            { id: 'navigation', label: '2. Navigation & Order', icon: Layers },
            { id: 'states', label: '3. State Editions', icon: MapPin },
            { id: 'social', label: '4. Social & WhatsApp', icon: Share2 },
            { id: 'footer', label: '5. Footer & About', icon: Mail },
            { id: 'contact', label: '6. Contact Details', icon: Mail },
            { id: 'multimedia', label: '7. Video & Photo Studio', icon: Camera },
            { id: 'ads', label: '8. Ad Slots & Scripts', icon: Code2 },
            { id: 'policies', label: '9. Legal & Policies', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. HEADER & BRANDING TAB */}
      {activeSection === 'branding' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Website Name, Logo & Tagline</span>
              </h4>
              <span className="text-xs text-slate-400">Desktop & Mobile Header</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal Site Title
                </label>
                <input
                  type="text"
                  value={current.siteTitle}
                  onChange={(e) => updateHeaderFooter({ siteTitle: e.target.value })}
                  placeholder="Khabri Dost"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Tagline
                </label>
                <input
                  type="text"
                  value={current.siteTagline}
                  onChange={(e) => updateHeaderFooter({ siteTagline: e.target.value })}
                  placeholder="KHABRI DOST • India's Trusted News Network"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Logo URL (Optional)
                </label>
                <input
                  type="text"
                  value={current.logoUrl || ''}
                  onChange={(e) => updateHeaderFooter({ logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Favicon / Mobile App Icon URL (Optional)
                </label>
                <input
                  type="text"
                  value={current.faviconUrl || ''}
                  onChange={(e) => updateHeaderFooter({ faviconUrl: e.target.value })}
                  placeholder="https://example.com/icon.png"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition font-mono"
                />
              </div>

              {/* Logo Image Height & Title Size Controls */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Header Logo Image Height
                  </label>
                  <span className="text-xs font-mono font-bold text-red-600">
                    {current.headerLogoHeight || 52}px
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={90}
                  step={2}
                  value={current.headerLogoHeight || 52}
                  onChange={(e) => updateHeaderFooter({ headerLogoHeight: Number(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1">
                  {[36, 44, 52, 64, 76].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updateHeaderFooter({ headerLogoHeight: sz })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        (current.headerLogoHeight || 52) === sz
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Header Title Text Font Size
                  </label>
                  <span className="text-xs font-mono font-bold text-red-600">
                    {current.headerTitleCustomPx || 36}px
                  </span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={60}
                  step={2}
                  value={current.headerTitleCustomPx || 36}
                  onChange={(e) => updateHeaderFooter({ headerTitleCustomPx: Number(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1">
                  {[28, 32, 36, 44, 52].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updateHeaderFooter({ headerTitleCustomPx: sz })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        (current.headerTitleCustomPx || 36) === sz
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Header Utilities Toggles */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Header Elements Visibility (Enable / Disable)</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Realtime</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'headerShowLiveTv', label: 'Live TV Button', icon: Tv, desc: 'Top bar Live TV stream button' },
                { key: 'headerShowLiveCoverage', label: 'Live Coverage (Updates)', icon: Radio, desc: 'Navigation & mobile Live feed button' },
                { key: 'headerShowEPaper', label: 'e-Paper Edition Button', icon: Newspaper, desc: 'Digital newspaper reader button' },
                { key: 'headerShowBookmarks', label: 'Saved Bookmarks', icon: BookMarked, desc: 'Saved articles bookmark counter' },
                { key: 'headerShowNewsTicker', label: 'News Ticker (Breaking)', icon: Sparkles, desc: 'Top breaking news ticker strip' },
                { key: 'headerShowMegaMenu', label: 'Mega Menu Dropdown', icon: Layers, desc: 'Hover-based top stories grid' },
                { key: 'headerShowSearch', label: 'Search Bar', icon: Search, desc: 'Header search input and popup' },
                { key: 'headerShowAdminButton', label: 'Admin Panel Button', icon: Sliders, desc: 'Header quick admin access button' },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = (current as any)[item.key] !== false;
                return (
                  <div
                    key={item.key}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-red-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateHeaderFooter({ [item.key]: !isEnabled })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                        isEnabled
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. NAVIGATION MENU & SEQUENCE TAB */}
      {activeSection === 'navigation' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Navigation Menu Order & Categories (Desktop & Mobile)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Reorder navigation categories using up/down arrows or toggle visibility on frontend.
              </p>
            </div>
            <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
              Live Reorder
            </span>
          </div>

          <div className="space-y-2">
            {categoryOrder.map((catId, index) => {
              const catMeta = CATEGORIES.find((c) => c.id === catId);
              const isDisabled = disabledCats.includes(catId);
              if (!catMeta) return null;

              return (
                <div
                  key={catId}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isDisabled
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      {editingCatId === catId ? (
                        <div className="flex items-center gap-1.5 py-0.5">
                          <input
                            type="text"
                            value={editingCatLabel}
                            onChange={(e) => setEditingCatLabel(e.target.value)}
                            className="bg-white border border-red-400 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold"
                            placeholder={catMeta.labelHindi}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCategoryHeading(catId)}
                            className="bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="bg-slate-200 text-slate-700 text-[11px] px-1.5 py-1 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{current.customCategoryLabels?.[catId] || catMeta.labelHindi}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({catMeta.labelEnglish})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(catId);
                              setEditingCatLabel(current.customCategoryLabels?.[catId] || catMeta.labelHindi);
                            }}
                            className="text-[10px] text-red-600 hover:underline cursor-pointer"
                            title="Rename Category Title"
                          >
                            Rename ✎
                          </button>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">ID: {catId}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveCategory(index, 'up')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer text-slate-700"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === categoryOrder.length - 1}
                      onClick={() => handleMoveCategory(index, 'down')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer text-slate-700"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleCategory(catId)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        !isDisabled
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {!isDisabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{!isDisabled ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INDIAN STATES ORDERING & CUSTOMIZATION TAB */}
      {activeSection === 'states' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>State Editions Ordering & Customization</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Reorder states in header state menu and footer, add new states/regions, or toggle state visibility.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              {statesList.length} States Active
            </span>
          </div>

          {/* Add New State Input Bar */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="text"
              value={newStateName}
              onChange={(e) => setNewStateName(e.target.value)}
              placeholder="New State / Territory Name (e.g. Uttarakhand, Ladakh, Chhattisgarh)..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={handleAddState}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add State</span>
            </button>
          </div>

          {/* States Sequence List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {statesList.map((stateName, index) => {
              const isDisabled = disabledStates.includes(stateName);
              return (
                <div
                  key={stateName}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                    isDisabled
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {stateName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveState(index, 'up')}
                      className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer text-slate-700"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === statesList.length - 1}
                      onClick={() => handleMoveState(index, 'down')}
                      className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer text-slate-700"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleState(stateName)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                        !isDisabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {!isDisabled ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteState(stateName)}
                      className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SOCIAL MEDIA CHANNELS TAB */}
      {activeSection === 'social' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Official Social Media Channels
                </h4>
                <p className="text-xs text-slate-500">
                  Social profile links displayed in top strip, article share cards, and footer directory.
                </p>
              </div>
            </div>

            {/* WhatsApp Community Bulletin Channel Featured Input */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                  <span>WhatsApp News Bulletin (Community Channel)</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Special Channel
                </span>
              </label>
              <p className="text-[11px] text-emerald-700 mb-2">
                Featured WhatsApp community broadcast channel link displayed across the portal.
              </p>
              <input
                type="url"
                value={current.whatsappNewsBulletinUrl || ''}
                onChange={(e) => updateHeaderFooter({ whatsappNewsBulletinUrl: e.target.value })}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'whatsappChannel', label: 'WhatsApp Channel URL', color: '#25D366' },
                { key: 'telegramChannel', label: 'Telegram Channel URL', color: '#229ED9' },
                { key: 'youtube', label: 'YouTube Channel URL', color: '#FF0000' },
                { key: 'facebook', label: 'Facebook Page URL', color: '#1877F2' },
                { key: 'twitter', label: 'X (Twitter) Profile URL', color: '#000000' },
                { key: 'instagram', label: 'Instagram Profile URL', color: '#E1306C' },
              ].map((item) => (
                <div key={item.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </label>
                  <input
                    type="url"
                    value={(current.socialLinks as any)[item.key] || ''}
                    onChange={(e) => updateSocialLinks(item.key as any, e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ADD MORE CUSTOM SOCIAL MEDIA CHANNELS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Add Custom Social Media Channels</span>
              <span className="text-xs text-slate-400">Threads, LinkedIn, Bluesky, etc.</span>
            </h4>

            {/* Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  placeholder="e.g. Threads, LinkedIn"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile / Channel URL</label>
                <input
                  type="url"
                  value={newPlatformUrl}
                  onChange={(e) => setNewPlatformUrl(e.target.value)}
                  placeholder="https://threads.net/@..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddCustomSocial}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Channel</span>
                </button>
              </div>
            </div>

            {/* List of Custom Channels */}
            {current.customSocialChannels && current.customSocialChannels.length > 0 && (
              <div className="space-y-2 pt-2">
                {current.customSocialChannels.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900">{ch.platform}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{ch.url}</div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleCustomSocial(ch.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          ch.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {ch.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomSocial(ch.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. FOOTER & BRAND PARTNER TAB */}
      {activeSection === 'footer' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Footer & Branding Controls
              </h4>
              <p className="text-xs text-slate-500">
                About us narrative, theme mode, bureau contacts, RNI registration, and technology partner credits.
              </p>
            </div>
            <span className="text-xs text-slate-400">Desktop & Mobile</span>
          </div>

          {/* Footer Theme Selector */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-900">
              Footer Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'dark_slate', label: 'Dark Slate (Default)', desc: 'Classic eye-comfort dark background' },
                { id: 'light', label: 'Clean Light', desc: 'White crisp background with dark text' },
                { id: 'dark_red', label: 'Deep Crimson Wine', desc: 'Editorial newspaper burgundy tone' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => updateHeaderFooter({ footerTheme: th.id as any })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    (current.footerTheme || 'dark_slate') === th.id
                      ? 'border-red-600 bg-white ring-2 ring-red-400 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{th.label}</div>
                  <p className="text-[10px] text-slate-500 mt-1">{th.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Dedicated Logo Update */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Dedicated Footer Logo URL
              </label>
              <span className="text-[10px] text-slate-500 font-mono">PNG / SVG / JPG</span>
            </div>
            <p className="text-[11px] text-slate-500">
              High-visibility logo rendered in footer. Falls back to primary logo if omitted.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={current.footerLogoUrl || ''}
                onChange={(e) => updateHeaderFooter({ footerLogoUrl: e.target.value })}
                placeholder="https://example.com/footer-logo.png"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {current.footerLogoUrl && (
                <button
                  type="button"
                  onClick={() => updateHeaderFooter({ footerLogoUrl: '' })}
                  className="px-3 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold cursor-pointer transition shrink-0"
                >
                  Remove
                </button>
              )}
            </div>
            {current.footerLogoUrl && (
              <div className="p-3 bg-slate-900 rounded-lg inline-flex items-center gap-2 border border-slate-800">
                <span className="text-[10px] text-slate-400">Footer Preview:</span>
                <img
                  src={current.footerLogoUrl}
                  alt="Footer Logo Preview"
                  className="h-8 max-w-[180px] object-contain"
                />
              </div>
            )}
          </div>

          {/* About us text inside footer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Footer 'About Us' Heading
            </label>
            <input
              type="text"
              value={current.footerAboutHeading || 'खबरी दोस्त • निष्पक्ष पत्रकारिता का संकल्प'}
              onChange={(e) => updateHeaderFooter({ footerAboutHeading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Footer 'About Us' Description
            </label>
            <textarea
              rows={3}
              value={current.footerAboutText || ''}
              onChange={(e) => updateHeaderFooter({ footerAboutText: e.target.value })}
              placeholder="India's leading independent digital news network..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
            />
          </div>

          {/* Technology partner & bottom branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Technology & Growth Partner
              </label>
              <input
                type="text"
                value={current.footerBrandingPartnerName || 'iTree Network Solutions'}
                onChange={(e) => updateHeaderFooter({ footerBrandingPartnerName: e.target.value })}
                placeholder="iTree Network Solutions"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Partner Website URL
              </label>
              <input
                type="url"
                value={current.footerBrandingPartnerUrl || 'https://itreenet.com'}
                onChange={(e) => updateHeaderFooter({ footerBrandingPartnerUrl: e.target.value })}
                placeholder="https://itreenet.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bottom Copyright Name
              </label>
              <input
                type="text"
                value={current.footerBottomName || 'खबरी दोस्त डिजिटल न्यूज़ नेटवर्क'}
                onChange={(e) => updateHeaderFooter({ footerBottomName: e.target.value })}
                placeholder="Khabri Dost Digital News Network"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                RNI Registration Number (आर.एन.आई नंबर)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={current.rniNumber}
                  onChange={(e) => updateHeaderFooter({ rniNumber: e.target.value })}
                  placeholder="DELHIN/2024/84920"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => updateHeaderFooter({ showRniNumber: !current.showRniNumber })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    current.showRniNumber ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {current.showRniNumber ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={current.contactEmail}
                onChange={(e) => updateHeaderFooter({ contactEmail: e.target.value })}
                placeholder="khabridost.com@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Helpline & News Desk Phone
              </label>
              <input
                type="text"
                value={current.contactPhone || ''}
                onChange={(e) => updateHeaderFooter({ contactPhone: e.target.value })}
                placeholder="+91 11 2345 6789"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Editorial Headquarter Address
              </label>
              <input
                type="text"
                value={current.contactAddress}
                onChange={(e) => updateHeaderFooter({ contactAddress: e.target.value })}
                placeholder="Press Enclave, Connaught Place, New Delhi - 110001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED CONTACT DETAILS TAB */}
      {activeSection === 'contact' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                <span>Contact Details & Bureau Information</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage official editorial email, phone helpline, press enclave headquarters address, and WhatsApp community channel.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Live on Frontend
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={current.contactEmail || 'khabridost.com@gmail.com'}
                onChange={(e) => updateHeaderFooter({ contactEmail: e.target.value })}
                placeholder="khabridost.com@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Displayed on Contact page, footer contact row, and grievance desk</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Newsroom & Helpline Phone
              </label>
              <input
                type="text"
                value={current.contactPhone || '+91 11 2345 6789'}
                onChange={(e) => updateHeaderFooter({ contactPhone: e.target.value })}
                placeholder="+91 11 2345 6789"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Toll-free or news desk landline</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                National Bureau & Headquarters Address
              </label>
              <input
                type="text"
                value={current.contactAddress || 'प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001'}
                onChange={(e) => updateHeaderFooter({ contactAddress: e.target.value })}
                placeholder="प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Displayed on Contact Us page and footer directory</span>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp News Bulletin Channel / Community Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={current.whatsappNewsBulletinUrl || 'https://whatsapp.com/channel/khabridost'}
                  onChange={(e) => updateHeaderFooter({ whatsappNewsBulletinUrl: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Direct invitation link for reader community and instant bulletins</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. MULTIMEDIA: VIDEO & PHOTO GALLERY TAB */}
      {activeSection === 'multimedia' && (
        <div className="space-y-5">
          {/* YouTube Video Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-600" />
                <span>Live Video Bulletin & Studio Controls</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...settings,
                    liveVideoSectionEnabled: !settings.liveVideoSectionEnabled,
                  })
                }
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  settings.liveVideoSectionEnabled !== false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {settings.liveVideoSectionEnabled !== false ? 'Enabled' : 'Disabled'}
              </button>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video Section Headline Title
                </label>
                <input
                  type="text"
                  value={settings.liveVideoTitle || 'Live Video Bulletin • Khabri Dost Studio'}
                  onChange={(e) => onChange({ ...settings, liveVideoTitle: e.target.value })}
                  placeholder="Live Video Bulletin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  YouTube Video / Live ID (e.g. jfKfPfyJRdk)
                </label>
                <input
                  type="text"
                  value={settings.liveVideoYoutubeId || ''}
                  onChange={(e) => onChange({ ...settings, liveVideoYoutubeId: e.target.value })}
                  placeholder="jfKfPfyJRdk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Photo Stories Gallery with SEO Captions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Photo Stories & Editorial Gallery Studio</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const currentHg = settings.homepageSections || {
                    heroSlider: true,
                    liveVideoBulletin: true,
                    liveFeedCoverage: true,
                    headerLiveFeedLink: true,
                    briefsTicker: true,
                    trendingTopics: true,
                    webStories: true,
                    photoGallery: true,
                    categoryBlocks: true,
                  };
                  onChange({
                    ...settings,
                    homepageSections: {
                      ...currentHg,
                      photoGallery: !currentHg.photoGallery,
                    },
                  });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  settings.homepageSections?.photoGallery !== false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {settings.homepageSections?.photoGallery !== false ? 'Enabled' : 'Disabled'}
              </button>
            </h4>

            {/* Add New Photo Story */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Add New Photo Story</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="Story Title..."
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Image URL..."
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
                <input
                  type="text"
                  value={newPhotoLocation}
                  onChange={(e) => setNewPhotoLocation(e.target.value)}
                  placeholder="Location (e.g. New Delhi, Ayodhya)..."
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="SEO Caption & Alt Text..."
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPhotoStory}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Photo Story</span>
              </button>
            </div>

            {/* Existing Photo Stories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {photoStories.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-slate-200 flex gap-2.5 items-center justify-between bg-white shadow-2xs"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-12 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.location} • {item.caption || 'Editorial photo caption'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePhotoStory(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. ADVERTISEMENTS & CUSTOM SCRIPT TAB */}
      {activeSection === 'ads' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-red-600" />
                <span>Ad Slots, Scripts & Banner Customization</span>
              </h4>
              <p className="text-xs text-slate-500">
                Enable or disable top, in-content, sidebar, and bottom ad placements, or insert custom AdSense script / HTML code.
              </p>
            </div>
          </div>

          {/* Ad Slot Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'showTopAd', label: 'Top Header Ad' },
              { key: 'showMidContentAd', label: 'Mid-Content Ad' },
              { key: 'showSidebarAd', label: 'Sidebar Ad' },
              { key: 'showBottomAd', label: 'Bottom Footer Ad' },
            ].map((slot) => {
              const isEnabled = (settings.adSettings as any)[slot.key] !== false;
              return (
                <div
                  key={slot.key}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{slot.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        adSettings: {
                          ...settings.adSettings,
                          [slot.key]: !isEnabled,
                        },
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom Ad Script / HTML Space */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Custom Ad Script / HTML Space (Google AdSense, MGID, Taboola)
            </label>
            <p className="text-[11px] text-slate-500">
              Paste your responsive AdSense snippet, JavaScript tag, or HTML banner code below:
            </p>
            <textarea
              rows={5}
              value={settings.adSettings.customScriptOrHtml || ''}
              onChange={(e) =>
                onChange({
                  ...settings,
                  adSettings: {
                    ...settings.adSettings,
                    customScriptOrHtml: e.target.value,
                  },
                })
              }
              placeholder="<script async src='https://pagead2.googlesyndication.com...'></script> OR <a href='...'><img src='...' /></a>"
              className="w-full p-3 bg-slate-900 text-amber-200 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      )}

      {/* 8. LEGAL POLICIES TAB */}
      {activeSection === 'policies' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Editorial Policies & Code of Ethics
              </h4>
              <p className="text-xs text-slate-500">
                Official transparency standards, grievance mechanism, and policies displayed in footer and about pages.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Fact Check Policy
              </label>
              <textarea
                rows={3}
                value={current.legalPolicies?.factCheckPolicy || ''}
                onChange={(e) => updatePolicies('factCheckPolicy', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Editorial Ethics & Policy
              </label>
              <textarea
                rows={3}
                value={current.legalPolicies?.editorialEthics || ''}
                onChange={(e) => updatePolicies('editorialEthics', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                3. Grievance Redressal Officer
              </label>
              <textarea
                rows={3}
                value={current.legalPolicies?.grievanceRedressal || ''}
                onChange={(e) => updatePolicies('grievanceRedressal', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                4. Privacy Policy
              </label>
              <textarea
                rows={3}
                value={current.legalPolicies?.privacyPolicy || ''}
                onChange={(e) => updatePolicies('privacyPolicy', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                5. Terms of Service
              </label>
              <textarea
                rows={3}
                value={current.legalPolicies?.termsOfService || ''}
                onChange={(e) => updatePolicies('termsOfService', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
