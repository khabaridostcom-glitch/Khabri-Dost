import React, { useState } from 'react';
import {
  Send,
  Check,
  Sliders,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { CATEGORIES, MAJOR_INDIAN_STATES } from '../data/seedNews';
import { NewsCategory, PortalSettings } from '../types/news';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_HEADER_FOOTER_SETTINGS } from '../data/portalDefaults';
import { LegalPolicyType } from './LegalPolicyPageView';

interface FooterProps {
  onSelectCategory: (cat: NewsCategory) => void;
  onOpenEPaper: () => void;
  onOpenPublisherCMS: () => void;
  onOpenStaffLogin?: () => void;
  onOpenSubscriberPreferences?: () => void;
  portalSettings?: PortalSettings;
  onOpenAdminSettings?: (tab?: any) => void;
  onOpenLegalPolicy?: (type: LegalPolicyType) => void;
  onOpenContactPage?: () => void;
  onOpenAboutUsPage?: () => void;
  onOpenSubmitNews?: () => void;
  onOpenArchivePage?: () => void;
  onOpenSudokuGame?: () => void;
  onSearchState?: (stateName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEPaper,
  onOpenPublisherCMS,
  onOpenStaffLogin,
  onOpenSubscriberPreferences,
  portalSettings,
  onOpenAdminSettings,
  onOpenLegalPolicy,
  onOpenContactPage,
  onOpenAboutUsPage,
  onOpenSubmitNews,
  onOpenArchivePage,
  onOpenSudokuGame,
  onSearchState,
}) => {
  const { isAdmin } = useAuth();
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const hf = portalSettings?.headerFooter || DEFAULT_HEADER_FOOTER_SETTINGS;
  const footerTheme = hf.footerTheme || 'dark_slate';
  const isLight = footerTheme === 'light';
  const isDarkRed = footerTheme === 'dark_red';

  const navOrder: string[] = hf.categoryOrder || hf.navCategoryOrder || [
    'national',
    'state',
    'politics',
    'crime',
    'entertainment',
    'sports',
    'business',
    'tech',
    'lifestyle',
    'world',
  ];
  const disabledCats: string[] = hf.disabledCategories || [];
  const customCatLabels: Record<string, string> = hf.customCategoryLabels || {};

  const activeCategories = React.useMemo(() => {
    return navOrder
      .map((id: string) => CATEGORIES.find((cat) => cat.id === id))
      .filter((cat): cat is (typeof CATEGORIES)[0] => Boolean(cat && !disabledCats.includes(cat.id)));
  }, [navOrder, disabledCats]);

  const customStatesList =
    hf.customStates && hf.customStates.length > 0 ? hf.customStates : MAJOR_INDIAN_STATES;
  const disabledStatesList = hf.disabledStates || [];
  const activeStatesList = React.useMemo(() => {
    return customStatesList.filter((s) => !disabledStatesList.includes(s));
  }, [customStatesList, disabledStatesList]);

  // Mobile Accordion state: 'categories' open by default so readers instantly see topics, others collapsible
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    states: false,
    policies: false,
    services: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Professional, balanced editorial styling with high contrast and zero eye strain
  const theme = {
    wrapper: isLight
      ? 'bg-slate-50 text-slate-700 border-t border-slate-200'
      : isDarkRed
      ? 'bg-[#140b0e] text-stone-300 border-t-2 border-red-900/60'
      : 'bg-[#0b1120] text-slate-300 border-t-2 border-slate-800',
    headerText: isLight ? 'text-slate-900' : 'text-white',
    sectionBorder: isLight ? 'border-slate-200' : isDarkRed ? 'border-stone-800' : 'border-slate-800',
    link: isLight
      ? 'text-slate-600 hover:text-red-700 transition-colors'
      : isDarkRed
      ? 'text-stone-300 hover:text-white transition-colors'
      : 'text-slate-300 hover:text-white transition-colors',
    mutedText: isLight ? 'text-slate-500' : isDarkRed ? 'text-stone-400' : 'text-slate-400',
    divider: isLight ? 'border-slate-200' : isDarkRed ? 'border-stone-800' : 'border-slate-800/80',
    inputBg: isLight
      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-600'
      : isDarkRed
      ? 'bg-stone-900/80 border-stone-800 text-white placeholder-stone-400 focus:border-red-500'
      : 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-400 focus:border-red-500',
    socialBtn: isLight
      ? 'bg-white hover:bg-slate-100 text-slate-700 hover:text-red-700 border border-slate-200'
      : isDarkRed
      ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800'
      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800',
    bottomBar: isLight
      ? 'border-slate-200 text-slate-500'
      : isDarkRed
      ? 'border-stone-900 text-stone-400'
      : 'border-slate-800/90 text-slate-400',
    bottomLink: isLight
      ? 'text-slate-700 hover:text-red-600'
      : isDarkRed
      ? 'text-stone-200 hover:text-white'
      : 'text-slate-200 hover:text-white',
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSubscriberPreferences) {
      onOpenSubscriberPreferences();
      return;
    }
    if (emailSub.trim()) {
      setSubSuccess(true);
      setTimeout(() => {
        setEmailSub('');
        setSubSuccess(false);
      }, 3000);
    }
  };

  const handleCategoryClick = (cat: NewsCategory, e: React.MouseEvent) => {
    e.preventDefault();
    onSelectCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegalClick = (type: LegalPolicyType, e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenLegalPolicy) {
      onOpenLegalPolicy(type);
    }
  };

  const handleStateClick = (stateName: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSearchState) {
      onSearchState(stateName);
    } else {
      onSelectCategory('state');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      aria-label="साइट फुटर"
      className={`${theme.wrapper} pt-12 pb-8 font-kd-body font-kd-footer transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Admin Quick Trigger Banner (Visible Only to Admin) */}
        {isAdmin && onOpenAdminSettings && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3 px-4 flex items-center justify-between flex-wrap gap-2 text-xs font-kd-meta">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-amber-300">Admin Footer Control:</span>
              <span className="text-slate-300">Theme (Dark Slate / Light / Crimson), RNI, Policies</span>
            </div>
            <button
              onClick={() => onOpenAdminSettings('footer')}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Footer Settings</span>
            </button>
          </div>
        )}

        {/* 1. TOP EDITORIAL BANNER: BRAND MASTHEAD + COMPACT NEWSLETTER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-inherit">
          {/* Brand Identity */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              {(hf.footerLogoUrl || hf.logoUrl) ? (
                <img
                  src={hf.footerLogoUrl || hf.logoUrl}
                  alt={hf.siteTitle || 'खबरी दोस्त'}
                  className="h-28 sm:h-36 w-auto max-w-[480px] object-contain"
                />
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full bg-red-600 shrink-0"></span>
                  <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black font-kd-header tracking-tight ${theme.headerText}`}>
                    {hf.siteTitle || 'खबरी दोस्त'}
                  </h2>
                </>
              )}
            </div>
            {hf.footerAboutHeading && (
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide">
                {hf.footerAboutHeading}
              </p>
            )}
            <div className={`text-xs sm:text-sm leading-relaxed space-y-1.5 ${theme.link}`}>
              <p>
                {hf.footerAboutText ||
                  'खबरी दोस्त आपका अपना सच्चा और निष्पक्ष हिंदी न्यूज़ पोर्टल है। यहाँ आपको देश, राजनीति, खेल, मनोरंजन और आपके शहर की हर ताज़ा खबर सबसे पहले और आसान भाषा में मिलती है। हम बिना किसी पक्षपात के सिर्फ सच और जरूरी जानकारी आप तक पहुँचाने के लिए प्रतिबद्ध हैं।'}
              </p>
            </div>
          </div>

          {/* Newsletter & Social Links (Clean, Compact, Natural) */}
          <div className="flex flex-col sm:items-start lg:items-end space-y-3">
            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="w-full sm:w-80">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="अपना ईमेल दर्ज करें..."
                  className={`flex-1 rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-1 ${theme.inputBg}`}
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  {subSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Send className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">सब्सक्राइब</span>
                </button>
              </div>
            </form>

            {/* Social Icons + WhatsApp Bulletin Channel */}
            <div className="flex items-center flex-wrap gap-2">
              {/* WhatsApp News Bulletin Channel Pill */}
              {(hf.whatsappNewsBulletinUrl || hf.socialLinks?.whatsappChannel) && (
                <a
                  href={hf.whatsappNewsBulletinUrl || hf.socialLinks?.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-xs"
                  title="WhatsApp News Bulletin (WhatsApp Community Channel)"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp बुलेटिन चैनल</span>
                </a>
              )}

              {/* Standard Social Icons */}
              <div className="flex items-center space-x-1.5">
              {/* WhatsApp */}
              <a
                href={hf.socialLinks?.whatsappChannel || 'https://whatsapp.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                title="WhatsApp Channel"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={hf.socialLinks?.telegramChannel || 'https://t.me/example'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Channel"
                title="Telegram Channel"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={hf.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                title="YouTube Channel"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={hf.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                title="Facebook Page"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={hf.socialLinks?.twitter || 'https://x.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
                title="X Twitter"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              {hf.socialLinks?.instagram && (
                <a
                  href={hf.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${theme.socialBtn}`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* Custom Social Channels added by Admin */}
              {hf.customSocialChannels &&
                hf.customSocialChannels
                  .filter((c) => c.enabled)
                  .map((ch) => (
                    <a
                      key={ch.id}
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={ch.platform}
                      className={`px-2.5 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition cursor-pointer ${theme.socialBtn}`}
                    >
                      <span>{ch.platform}</span>
                    </a>
                  ))}
            </div>
          </div>
        </div>
        </div>

        {/* 2. SYMMETRICAL 4-COLUMN EDITORIAL DIRECTORY WITH MOBILE ACCORDIONS */}
        <div
          style={{
            fontSize: portalSettings?.typography?.footerTextPx
              ? `${portalSettings.typography.footerTextPx}px`
              : undefined,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10 text-xs font-kd-meta"
        >
          {/* COLUMN 1: PRAMUKH VISHAY */}
          <div className={`border-b sm:border-b-0 ${theme.sectionBorder} pb-3 sm:pb-0`}>
            {/* Header: Clickable button on mobile to toggle accordion, static title on desktop */}
            <button
              type="button"
              onClick={() => toggleSection('categories')}
              className={`w-full flex items-center justify-between sm:cursor-default py-1.5 sm:py-0 border-b sm:border-b ${theme.sectionBorder} pb-2 text-left`}
            >
              <h3
                style={{
                  fontSize: portalSettings?.typography?.footerHeadingPx
                    ? `${portalSettings.typography.footerHeadingPx}px`
                    : undefined,
                }}
                className={`text-xs sm:text-sm font-bold tracking-wider uppercase font-kd-headline ${theme.headerText}`}
              >
                प्रमुख विषय
              </h3>
              <ChevronDown
                className={`w-4 h-4 sm:hidden transition-transform duration-200 ${
                  openSections.categories ? 'rotate-180 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
            <div className={`${openSections.categories ? 'block' : 'hidden'} sm:!block pt-2 sm:pt-3`}>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-2">
                {activeCategories.filter((c) => c.id !== 'all').map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#category/${cat.id}`}
                      onClick={(e) => handleCategoryClick(cat.id, e)}
                      className={`${theme.link} block py-0.5 truncate`}
                    >
                      {customCatLabels[cat.id] || cat.labelHindi}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 2: REGIONAL / STATES */}
          <div className={`border-b sm:border-b-0 ${theme.sectionBorder} pb-3 sm:pb-0`}>
            <button
              type="button"
              onClick={() => toggleSection('states')}
              className={`w-full flex items-center justify-between sm:cursor-default py-1.5 sm:py-0 border-b sm:border-b ${theme.sectionBorder} pb-2 text-left`}
            >
              <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase font-kd-headline ${theme.headerText}`}>
                राज्य व शहर
              </h3>
              <ChevronDown
                className={`w-4 h-4 sm:hidden transition-transform duration-200 ${
                  openSections.states ? 'rotate-180 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
            <div className={`${openSections.states ? 'block' : 'hidden'} sm:!block pt-2 sm:pt-3`}>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-2">
                {activeStatesList.slice(0, 16).map((state) => (
                  <li key={state}>
                    <a
                      href={`#state/${encodeURIComponent(state)}`}
                      onClick={(e) => handleStateClick(state, e)}
                      className={`${theme.link} block py-0.5 truncate`}
                    >
                      {state}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: EDITORIAL & LEGAL POLICIES */}
          <div className={`border-b sm:border-b-0 ${theme.sectionBorder} pb-3 sm:pb-0`}>
            <button
              type="button"
              onClick={() => toggleSection('policies')}
              className={`w-full flex items-center justify-between sm:cursor-default py-1.5 sm:py-0 border-b sm:border-b ${theme.sectionBorder} pb-2 text-left`}
            >
              <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase font-kd-headline ${theme.headerText}`}>
                नीतियां एवं नियम
              </h3>
              <ChevronDown
                className={`w-4 h-4 sm:hidden transition-transform duration-200 ${
                  openSections.policies ? 'rotate-180 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
            <div className={`${openSections.policies ? 'block' : 'hidden'} sm:!block pt-2 sm:pt-3`}>
              <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-y-2 gap-x-2">
                {onOpenAboutUsPage && (
                  <li>
                    <button
                      onClick={onOpenAboutUsPage}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate`}
                    >
                      हमारे बारे में (About Us)
                    </button>
                  </li>
                )}
                <li>
                  <a
                    href="#privacy-policy"
                    onClick={(e) => handleLegalClick('privacy', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    गोपनीयता नीति (Privacy Policy)
                  </a>
                </li>
                <li>
                  <a
                    href="#terms-of-service"
                    onClick={(e) => handleLegalClick('terms', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    नियम एवं शर्तें (Terms)
                  </a>
                </li>
                <li>
                  <a
                    href="#grievance-redressal"
                    onClick={(e) => handleLegalClick('grievance', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    शिकायत दर्ज करें (Grievance)
                  </a>
                </li>
                <li>
                  <a
                    href="#fact-check-policy"
                    onClick={(e) => handleLegalClick('factCheck', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    तथ्य-जांच नीति (Fact-Checking)
                  </a>
                </li>
                <li>
                  <a
                    href="#editorial-ethics"
                    onClick={(e) => handleLegalClick('ethics', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    संपादकीय आचार संहिता
                  </a>
                </li>
                <li>
                  <a
                    href="#disclaimer"
                    onClick={(e) => handleLegalClick('disclaimer', e)}
                    className={`${theme.link} block py-0.5 truncate`}
                  >
                    डिस्क्लेमर (Disclaimer)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMN 4: SERVICES & NEWSROOM CONTACT */}
          <div className="pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className={`w-full flex items-center justify-between sm:cursor-default py-1.5 sm:py-0 border-b sm:border-b ${theme.sectionBorder} pb-2 text-left`}
            >
              <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase font-kd-headline ${theme.headerText}`}>
                सेवाएं एवं संपर्क
              </h3>
              <ChevronDown
                className={`w-4 h-4 sm:hidden transition-transform duration-200 ${
                  openSections.services ? 'rotate-180 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
            <div className={`${openSections.services ? 'block' : 'hidden'} sm:!block pt-2 sm:pt-3 space-y-3`}>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={onOpenEPaper}
                    className={`${theme.link} text-left cursor-pointer block py-0.5 font-medium truncate`}
                  >
                    ई-पेपर (E-Paper)
                  </button>
                </li>
                {onOpenArchivePage && (
                  <li>
                    <button
                      onClick={onOpenArchivePage}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate`}
                    >
                      समाचार पुरालेख (Archive)
                    </button>
                  </li>
                )}
                {onOpenSubmitNews && (
                  <li>
                    <button
                      onClick={onOpenSubmitNews}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate`}
                    >
                      खबर भेजें (Submit News)
                    </button>
                  </li>
                )}
                {onOpenSudokuGame && (
                  <li>
                    <button
                      onClick={onOpenSudokuGame}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate font-medium text-amber-400`}
                    >
                      दैनिक सुडोकू पहेली (Daily Sudoku) 🎯
                    </button>
                  </li>
                )}
                {onOpenContactPage && (
                  <li>
                    <button
                      onClick={onOpenContactPage}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate font-semibold text-red-500`}
                    >
                      संपादकीय संपर्क व कार्यालय विवरण ➔
                    </button>
                  </li>
                )}
                {onOpenSubscriberPreferences && (
                  <li>
                    <button
                      onClick={onOpenSubscriberPreferences}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate`}
                    >
                      अलर्ट एवं पसंदीदा विषय
                    </button>
                  </li>
                )}
                {onOpenStaffLogin && (
                  <li>
                    <button
                      onClick={onOpenStaffLogin}
                      className={`${theme.link} text-left cursor-pointer block py-0.5 truncate font-semibold text-amber-400 hover:text-red-400 flex items-center space-x-1`}
                    >
                      <span>🔐</span>
                      <span>एडमिन एवं स्टाफ लॉगिन (Admin Desk)</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM COPYRIGHT & ATTRIBUTION BAR */}
        <div className={`pt-6 border-t ${theme.bottomBar} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-kd-meta`}>
          <div className="flex items-center flex-wrap gap-2 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} {hf.footerBottomName || hf.siteTitle || 'खबरी दोस्त'} • All Rights Reserved.
            </span>
            {hf.showRniNumber === true && hf.rniNumber && (
              <span className="opacity-75 font-mono text-[11px]">| RNI: {hf.rniNumber}</span>
            )}
          </div>
          <div>
            <span className="opacity-80 flex items-center space-x-1.5 flex-wrap justify-center sm:justify-end">
              <span>Technology & Growth Partner:</span>
              <a
                href={hf.footerBrandingPartnerUrl || 'https://itreenet.com'}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.bottomLink} font-bold underline underline-offset-2 transition hover:text-red-500`}
                title={hf.footerBrandingPartnerName || 'iTree Network Solutions'}
              >
                {hf.footerBrandingPartnerName || 'iTree Network Solutions'}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
