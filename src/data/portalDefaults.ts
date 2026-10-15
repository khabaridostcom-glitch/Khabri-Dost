import {
  PortalSettings,
  HeaderFooterSettings,
  ArticleMetaSettings,
  ArticleSidebarWidgets,
  VideoNewsItem,
  PhotoStoryItem,
  SubscriberItem,
  PushNotificationItem,
  PortalPopupConfig,
  LiveBlogEvent,
  SpotlightLayoutSettings,
  HomepageSectionsConfig,
  GoogleServicesConfig,
  SpeedAndWebVitalsConfig,
  AdvancedSeoConfig,
  MobileSettingsConfig,
  ContactInquiry,
  ApiConfiguration,
  SidebarAdsConfig,
  AiSeoConfig,
  GoogleTrendsConfig,
  MobileSidebarMenuConfig,
  EPaperSettings,
  AdResponsiveBreakpoints,
  CitizenNewsSubmission,
} from '../types/news';

export const FONT_OPTIONS = [
  // Hindi / Devanagari
  { id: "'Rozha One', serif", name: 'रोज़ा वन (Rozha One - अख़बारी बोल्ड)', category: 'hindi' },
  { id: "'Mukta', sans-serif", name: 'मुक्ता (Mukta - आधुनिक पठनीय)', category: 'hindi' },
  { id: "'Noto Sans Devanagari', sans-serif", name: 'नोटो सैन्स (Noto Sans Hindi)', category: 'hindi' },
  { id: "'Noto Serif Devanagari', serif", name: 'नोटो सेरिफ (Noto Serif - संपादकीय)', category: 'hindi' },
  { id: "'Yatra One', cursive", name: 'यात्रा वन (Yatra One - पारम्परिक)', category: 'hindi' },
  { id: "'Tiro Devanagari Hindi', serif", name: 'तीरो देवनागरी (Tiro Devanagari)', category: 'hindi' },
  { id: "'Kalam', cursive", name: 'कलम (Kalam - हस्तलिखित)', category: 'hindi' },

  // English & Universal Sans / Serif
  { id: "'Poppins', sans-serif", name: 'Poppins (पॉपिन्स - मॉडर्न जियोमेट्रिक)', category: 'english' },
  { id: "'Inter', sans-serif", name: 'Inter (इंटर - डिजिटल क्लीन)', category: 'english' },
  { id: "'Roboto', sans-serif", name: 'Roboto (रोबोटो - न्यूट्रल सैन्स)', category: 'english' },
  { id: "'Merriweather', serif", name: 'Merriweather (मेरीवेदर - क्लासिक)', category: 'english' },
];

export const DEFAULT_POPUP_CONFIG: PortalPopupConfig = {
  enabled: true,
  type: 'breaking_alert',
  title: '🔴 बड़ी ख़बर: गगनयान क्रू मॉड्यूल का सफल परीक्षण!',
  description: 'इसरो ने रचा नया इतिहास। भारतीय अंतरिक्ष यात्रियों की सुरक्षा प्रणाली का सफल ट्रायल संपन्न। विस्तृत रिपोर्ट व विश्लेषण पढ़ें।',
  imageUrl: 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80',
  ctaText: 'पूरी ख़बर अभी पढ़ें →',
  ctaLink: 'news-1',
  delaySeconds: 2,
  showFrequency: 'once_session',
};

export const DEFAULT_SPOTLIGHT_LAYOUT: SpotlightLayoutSettings = {
  heroSlider: {
    enabled: true,
    source: 'recent',
    category: 'all',
    selectedArticleIds: [],
    slideIntervalSeconds: 5,
    autoPlay: true,
    showArrows: true,
    showDots: true,
  },
  secondaryCol: {
    newsCount: 3, // 3 news cards to fill blank space
    source: 'recent',
    category: 'all',
    selectedArticleIds: [],
  },
  briefTicker: {
    enabled: true,
    title: 'बड़ी सुर्खियां • FAST BRIEFS',
    showCategoryBadge: true,
    source: 'recent',
    category: 'all',
    selectedArticleIds: [],
    slideSpeed: 'normal',
    direction: 'bottom_to_top',
    pauseOnHover: true,
    itemCount: 8,
  },
};

export const DEFAULT_ARTICLE_META_SETTINGS: ArticleMetaSettings = {
  showAuthorAvatar: true,
  showAuthorName: true,
  showAuthorRole: true,
  showPublishDate: true,
  showRelativeTime: true,
  showViewsCount: true,
  showListenButton: true,
  showPdfButton: true,
  showLocationBadge: true,
  showLikesButton: true,
  showBookmarkButton: true,
  showNativeShare: true,
  showSocialIcons: true,
  compactSingleLine: true,
  platforms: {
    whatsapp: true,
    telegram: true,
    twitter: true,
    facebook: true,
    copyLink: true,
  },
};

export const DEFAULT_ARTICLE_SIDEBAR_WIDGETS: ArticleSidebarWidgets = {
  showReadingProgressBar: true,
  showSidebarAd: true,
  showTrendingNews: true,
  showEditorPicks: true,
  showNewsletterSubscribe: true,
  showOpinionPoll: true,
  showEPaperPromo: true,
  showMarketGlance: false,
  showAuthorBio: true,
  showEditorialDisclaimer: false,
  showCommentsSection: true,
  showRelatedStories: true,
  showFollowUsChannels: true,
  relatedArticlesCount: 4, // 3, 4 or 6 (admin configurable)
  sidebarSliderMode: true, // Interactive slider carousel for single page content sidebar
  trendingSliderEnabled: true, // Vertical bottom-to-top auto-sliding
  trendingStoriesCount: 5, // Top 5 trending stories
  trendingCategoryFilter: 'all', // All categories or specific
  trendingSlideSpeed: 3500, // 3.5 seconds per slide
  pollQuestion: 'क्या 2026 में डिजिटल मीडिया पारंपरिक प्रिंट अखबारों से आगे निकल जाएगा?',
  pollOptionA: 'हाँ, पूरी तरह डिजिटल होगा',
  pollOptionB: 'नहीं, प्रिंट की विश्वसनीयता बनी रहेगी',
  pollOptionC: 'कुछ हद तक असर पड़ेगा',
  pollOptionD: 'कह नहीं सकते / तटस्थ',
  // Gold Rate Widget Defaults
  showGoldRate: true,
  goldRateWidgetTitle: 'आज के सोने-चांदी का भाव',
  goldRateCity: 'दिल्ली (Delhi NCR)',
  goldRate24k: 78450,
  goldRate22k: 71920,
  silverRate1kg: 92500,
  goldRateUpdateDate: 'आज ताज़ा भाव',
  // Daily Rashifal Widget Defaults
  showRashifal: true,
  rashifalWidgetTitle: 'दैनिक राशिफल',
  rashifalAutoUpdate: true,
  rashifalDate: 'आज का राशिफल',
};

export const DEFAULT_MOBILE_SIDEBAR_MENU: MobileSidebarMenuConfig = {
  showLogo: true,
  showSiteTitle: true,
  showEPaperButton: true,
  showSubmitNewsButton: true,
  showCategories: true,
  showOfficialChannels: true,
  showWhatsAppButton: true,
  showTelegramButton: true,
  showSocialMediaIcons: true,
  showSubscriberCard: true,
  fontSize: 'normal',
  fontFamily: "'Mukta', sans-serif",
  customLinks: [
    {
      id: 'link-live',
      labelHindi: 'लाइव कवरेज (Live Feed)',
      labelEnglish: 'Live News Feed',
      linkType: 'page',
      target: 'live-feed',
      enabled: true,
    },
    {
      id: 'link-about',
      labelHindi: 'हमारे बारे में (About Us)',
      labelEnglish: 'About Us',
      linkType: 'page',
      target: 'about',
      enabled: true,
    },
    {
      id: 'link-contact',
      labelHindi: 'संपर्क करें (Contact)',
      labelEnglish: 'Contact Us',
      linkType: 'page',
      target: 'contact',
      enabled: true,
    },
  ],
};

export const DEFAULT_SIDEBAR_AD_BREAKPOINTS: AdResponsiveBreakpoints = {
  mobile: {
    maxWidth: 640,
    minHeightPx: 140,
    maxHeightPx: 220,
    aspectRatio: '300/200',
    hideOnBreakpoint: false,
  },
  tablet: {
    maxWidth: 1024,
    minHeightPx: 160,
    maxHeightPx: 260,
    aspectRatio: '300/220',
    hideOnBreakpoint: false,
  },
  desktop: {
    minHeightPx: 180,
    maxHeightPx: 300,
    aspectRatio: '300/250',
    hideOnBreakpoint: false,
  },
  enableCustomBreakpoints: true,
};

export const DEFAULT_ARTICLE_BANNER_BREAKPOINTS: AdResponsiveBreakpoints = {
  mobile: {
    maxWidth: 640,
    minHeightPx: 70,
    maxHeightPx: 120,
    aspectRatio: '320/100',
    hideOnBreakpoint: false,
  },
  tablet: {
    maxWidth: 1024,
    minHeightPx: 80,
    maxHeightPx: 140,
    aspectRatio: '468/60',
    hideOnBreakpoint: false,
  },
  desktop: {
    minHeightPx: 90,
    maxHeightPx: 160,
    aspectRatio: '728/90',
    hideOnBreakpoint: false,
  },
  enableCustomBreakpoints: true,
};

export const DEFAULT_SIDEBAR_ADS_CONFIG: SidebarAdsConfig = {
  topSlot: {
    enabled: true,
    adType: 'private',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    bannerLink: '#contact',
    bannerTitle: 'शीर्ष साइडबार विज्ञापन (Top Slot) • खबरी दोस्त बिजनेस नेटवर्क',
    altText: 'Top Sidebar Advertisement',
    breakpoints: DEFAULT_SIDEBAR_AD_BREAKPOINTS,
  },
  middleSlot: {
    enabled: true,
    adType: 'private',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    bannerLink: '#contact',
    bannerTitle: 'मध्य साइडबार स्पॉन्सरशिप (Middle Slot) • विशेष ब्रांड प्रमोशन',
    altText: 'Middle Sidebar Advertisement',
    breakpoints: DEFAULT_SIDEBAR_AD_BREAKPOINTS,
  },
  bottomSlot: {
    enabled: true,
    adType: 'private',
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    bannerLink: '#contact',
    bannerTitle: 'निचला साइडबार पार्टनरशिप (Bottom Slot) • डिजिटल एडवरटाइजिंग',
    altText: 'Bottom Sidebar Advertisement',
    breakpoints: DEFAULT_SIDEBAR_AD_BREAKPOINTS,
  },
  globalBreakpoints: DEFAULT_SIDEBAR_AD_BREAKPOINTS,
};

export const DEFAULT_AI_SEO_CONFIG: AiSeoConfig = {
  apiKey: '',
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  defaultLanguage: 'hi',
  autoExtractKeywords: true,
  autoGenerateSlug: true,
};

export const DEFAULT_GOOGLE_TRENDS_CONFIG: GoogleTrendsConfig = {
  region: 'IN',
  category: 'all',
  autoSync: true,
  refreshIntervalMinutes: 30,
  lastFetchedAt: 'अभी-अभी',
  customKeywords: ['बजट 2026', 'क्रिकेट लाइव स्कोर', 'सोना चांदी भाव'],
  apiKey: '',
};

export const DEFAULT_HEADER_FOOTER_SETTINGS: HeaderFooterSettings = {
  siteTitle: 'खबरी दोस्त',
  siteTagline: 'KHABARI DOST • भारत का विश्वसनीय हिंदी न्यूज़ पोर्टल',
  logoUrl: '',
  headerLogoHeight: 52,
  headerTitleCustomPx: 36,
  showSiteTitleText: true,
  footerLogoUrl: '',
  faviconUrl: '',
  contactEmail: 'khabridost.com@gmail.com',
  contactAddress: 'प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001',
  contactPhone: '+91 11 2345 6789',
  rniNumber: 'DELHIN/2024/84920',
  showRniNumber: false,
  footerTheme: 'dark_slate',
  footerAboutHeading: 'खबरी दोस्त • निष्पक्ष पत्रकारिता का संकल्प',
  footerAboutText: 'खबरी दोस्त आपका अपना सच्चा और निष्पक्ष हिंदी न्यूज़ पोर्टल है। यहाँ आपको देश, राजनीति, खेल, मनोरंजन और आपके शहर की हर ताज़ा खबर सबसे पहले और आसान भाषा में मिलती है। हम बिना किसी पक्षपात के सिर्फ सच और जरूरी जानकारी आप तक पहुँचाने के लिए प्रतिबद्ध हैं।',
  footerBrandingPartnerName: 'iTree Network Solutions',
  footerBrandingPartnerUrl: 'https://itreenet.com',
  footerBottomName: 'खबरी दोस्त डिजिटल न्यूज़ नेटवर्क',
  whatsappNewsBulletinUrl: 'https://whatsapp.com/channel/example',
  whatsappNewsBulletinText: 'WhatsApp News Bulletin (WhatsApp Community Channel)',
  headerShowLiveTv: true,
  headerShowEPaper: true,
  headerShowBookmarks: true,
  headerShowNewsTicker: true,
  headerShowMegaMenu: true,
  headerShowSearch: true,
  headerShowAdminButton: true,
  headerShowLiveCoverage: true,
  socialLinks: {
    whatsappChannel: 'https://whatsapp.com/channel/example',
    telegramChannel: 'https://t.me/example',
    facebook: 'https://facebook.com',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
  },
  customSocialChannels: [
    {
      id: 'soc-threads',
      platform: 'Threads',
      url: 'https://threads.net/@khabridost',
      enabled: true,
    },
    {
      id: 'soc-linkedin',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/khabridost',
      enabled: true,
    },
  ],
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
  customCategoryLabels: {},
  customStates: [
    'उत्तर प्रदेश',
    'बिहार',
    'मध्य प्रदेश',
    'राजस्थान',
    'दिल्ली-NCR',
    'महाराष्ट्र',
    'हरियाणा',
    'पंजाब',
    'गुजरात',
    'झारखंड',
    'उत्तराखंड',
    'छत्तीसगढ़',
    'पश्चिम बंगाल',
    'हिमाचल प्रदेश',
  ],
  disabledStates: [],
  legalPolicies: {
    factCheckPolicy: `1. तथ्य-जांच का मूल सिद्धांत (Commitment to Accuracy):
खबरी दोस्त (Khabri Dost) डिजिटल न्यूज़ नेटवर्क में हमारा सर्वोच्च ध्येय वाक्य 'सत्य, निष्पक्षता एवं जन-सरोकार' है। हम सोशल मीडिया पर फैलाई जा रही अफवाहों, भ्रामक दावों, डीपफेक और अपुष्ट सूचनाओं के विरुद्ध जीरो-टॉलरेंस की नीति का पालन करते हैं।

2. चार-चरणीय सत्यापन प्रक्रिया (Four-Stage Verification Protocol):
(क) प्राथमिक स्रोतों की पुष्टि (Primary Source Verification): किसी भी ब्रेकिंग खबर, नीतिगत घोषणा या आपराधिक घटना की रिपोर्टिंग से पूर्व आधिकारिक सरकारी राजपत्र, न्यायालयीन आदेश, पुलिस प्राथमिकी (FIR) अथवा संबंधित पक्ष के आधिकारिक बयान की पड़ताल की जाती है।
(ख) बहु-स्तरीय पुष्टि (Multi-Source Corroboration): विवादास्पद अथवा सनसनीखेज दावों के लिए कम से कम दो स्वतंत्र एवं परस्पर असंबंधित प्राथमिक स्रोतों से पुष्टि अनिवार्य है।
(ग) जमीनी संवाददाताओं द्वारा पड़ताल (Ground Level Fact-Check): देश भर के प्रमुख राज्यों में उपस्थित हमारे मान्यता प्राप्त ब्यूरो प्रतिनिधि जमीनी स्तर पर जाकर दावों की भौतिक पुष्टि करते हैं।
(घ) डिजिटल फोरेंसिक व इमेज जांच (Digital Forensics): वायरल तस्वीरों और वीडियो क्लिप्स के लिए रिवर्स इमेज सर्च, मेटाडेटा विश्लेषण तथा वीडियो टाइमस्टैम्प की तकनीकी जांच की जाती है।

3. समाचार, विश्लेषण एवं विचार का स्पष्ट अंतर (News vs Opinion):
हम निष्पक्ष रिपोर्टिंग और संपादकीय राय (Op-Ed/Opinion) के बीच स्पष्ट सीमा रेखा बनाए रखते हैं। सभी विचारपरक लेखों पर लेखक का नाम, विशेषज्ञता और अस्वीकरण (Disclaimer) स्पष्ट रूप से अंकित होता है ताकि पाठक किसी निजी राय को आधिकारिक समाचार न समझें।

4. सुधार एवं संशोधन नीति (Transparent Correction Policy):
यदि हमारे किसी प्रकाशित समाचार में अनजाने में कोई तथ्यात्मक त्रुटि रह जाती है, तो उसकी सूचना मिलते ही हमारी संपादकीय टीम 24 घंटे के भीतर उस आर्टिकल के शीर्ष पर 'संशोधन नोट (Correction Note)' प्रकाशित करती है। इसमें स्पष्ट किया जाता है कि मूल समाचार में क्या त्रुटि थी, कब संशोधन किया गया और सही तथ्य क्या है।

5. पाठकों द्वारा तथ्य-जांच अनुरोध (Reader Submissions):
पाठक किसी भी संदिग्ध समाचार अथवा सोशल मीडिया पर वायरल दावे की स्वतंत्र पड़ताल के लिए सीधे हमारे संपर्क डेस्क 'khabridost.com@gmail.com' अथवा संपर्क पृष्ठ (Contact Us Page) के माध्यम से जांच का अनुरोध भेज सकते हैं। हमारी फैक्ट-चेक टीम 48 घंटे के भीतर विस्तृत पड़ताल रिपोर्ट प्रकाशित करती है।`,

    editorialEthics: `1. संपादकीय स्वतंत्रता एवं निष्पक्षता (Editorial Independence):
खबरी दोस्त किसी भी राजनीतिक दल, धार्मिक संगठन, कॉरपोरेट घराने अथवा दबाव समूह के प्रभाव से पूर्णतः मुक्त एक स्वतंत्र डिजिटल मीडिया संगठन है। हमारा संपादकीय एजेंडा केवल भारतीय संविधान के मूल्यों, लोकतंत्र और जनता के सरोकारों से निर्देशित होता है।

2. पत्रकारिता के पेशेवर मानक (Professional Standards):
हम निष्पक्ष, संतुलित और तथ्यपरक पत्रकारिता के उच्चतम मानकों का पालन करते हैं। किसी भी आरोप या विवाद की स्थिति में संबंधित सभी पक्षों को अपनी बात रखने का समान अवसर प्रदान करना हमारा अनिवार्य संपादकीय नियम है। एकतरफा अथवा मीडिया ट्रायल आधारित रिपोर्टिंग हमारे सिद्धांतों के विरुद्ध है।

3. 'सशुल्क समाचार' (Paid News) पर पूर्ण प्रतिबंध:
खबरी दोस्त में किसी भी रूप में 'पेड न्यूज़' (Paid News) अथवा छद्म विज्ञापन पूर्णतः प्रतिबंधित है। वाणिज्यिक विज्ञापनों और संपादकीय सामग्री के बीच स्पष्ट दृष्टिगोचर विभाजन रेखा होती है। प्रायोजित सामग्री पर 'Sponsored / Advertisement' का स्पष्ट लेबल लगाया जाता है।

4. हितों का टकराव (Conflict of Interest):
हमारे पत्रकारों एवं संपादकीय कर्मचारियों के लिए यह अनिवार्य है कि वे किसी भी ऐसे विषय, कंपनी अथवा संगठन पर रिपोर्टिंग से अलग रहें, जिसमें उनका कोई प्रत्यक्ष या अप्रत्यक्ष वित्तीय, व्यक्तिगत अथवा पारिवारिक हित जुड़ा हो।

5. संवेदनशील विषयों पर आचार संहिता (Human Dignity & Sensitivity):
आपदा, दुर्घटना, अपराध अथवा व्यक्तिगत त्रासदियों की रिपोर्टिंग करते समय हम मानवीय गरिमा का सर्वोच्च सम्मान करते हैं। पीड़ितों, महिलाओं तथा नाबालिगों की पहचान उजागर न करने से संबंधित भारतीय कानूनों (POCSO, CrPC आदि) का अक्षरशः पालन किया जाता है।

6. स्रोतों की गोपनीयता की सुरक्षा (Source Protection):
जनहित में भ्रष्टाचार अथवा अनियमितताओं का पर्दाफाश करने वाले व्हिसलब्लोअर्स तथा गोपनीय सूत्रों की पहचान को हर हाल में सुरक्षित रखा जाता है।`,

    grievanceRedressal: `सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11 के अंतर्गत वैधानिक घोषणा:

1. शिकायत निवारण तंत्र (Grievance Redressal Mechanism):
खबरी दोस्त (Khabri Dost) पोर्टल पर प्रकाशित किसी भी समाचार, लेख, फोटो अथवा वीडियो से संबंधित यदि किसी पाठक, नागरिक अथवा संगठन को कोई शिकायत (तथ्यात्मक त्रुटि, मानहानि, गोपनीयता उल्लंघन, या आचार संहिता उल्लंघन) है, तो वह हमारे प्राधिकृत शिकायत निवारण अधिकारी के समक्ष अपनी औपचारिक शिकायत दर्ज करा सकते हैं।

2. नियुक्त शिकायत निवारण अधिकारी का विवरण (Grievance Redressal Officer):
- नाम व पदनाम: श्री राजेश कुमार शर्मा (वरिष्ठ संपादकीय निदेशक एवं शिकायत निवारण अधिकारी)
- संगठन: खबरी दोस्त डिजिटल मीडिया नेटवर्क (Khabri Dost Digital News)
- पंजीकृत कार्यालय: प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001
- आधिकारिक शिकायत ईमेल: grievance@khabridost.com
- वैकल्पिक संपर्क ईमेल: khabridost.com@gmail.com
- हेल्पलाइन फोन: +91 11 2345 6789
- कार्य दिवस व समय: सोमवार से शनिवार, प्रातः 10:00 बजे से सायं 06:00 बजे तक (IST)

3. शिकायत दर्ज करने की प्रक्रिया (Filing Procedure):
शिकायतकर्ता को अपनी शिकायत में निम्नलिखित अनिवार्य विवरण प्रदान करना होगा:
(क) शिकायतकर्ता का पूरा नाम, पता, संपर्क नंबर और ईमेल।
(ख) संबंधित समाचार का सटीक वेब लिंक (URL) और प्रकाशन तिथि।
(ग) आपत्तिजनक पैराग्राफ अथवा सामग्री का सटीक उल्लेख।
(घ) आपत्ति का कानूनी/तथ्यात्मक आधार तथा अपने दावे के समर्थन में साक्ष्य/दस्तावेज।
(ङ) यह घोषणा कि दी गई जानकारी शिकायतकर्ता के सर्वोत्तम ज्ञान के अनुसार सत्य है।

4. समयबद्ध निस्तारण की वैधानिक समयसीमा (Timebound Disposal):
- शिकायत प्राप्ति की आधिकारिक अभिस्वीकृति (Acknowledgment): 24 घंटे के भीतर जारी की जाएगी।
- शिकायत की विस्तृत संपादकीय जांच एवं अंतिम निस्तारण (Resolution): प्राप्ति की तिथि से 15 दिनों के भीतर अनिवार्य रूप से पूरा किया जाएगा और शिकायतकर्ता को लिखित निर्णय से अवगत कराया जाएगा।

5. द्वितीय-स्तरीय अपील (Appellate Mechanism):
यदि शिकायतकर्ता 15 दिनों के भीतर दिए गए निवारण से संतुष्ट नहीं हैं, तो वे सूचना एवं प्रसारण मंत्रालय (MIB), भारत सरकार द्वारा मान्यता प्राप्त स्व-नियामक निकाय (Self-Regulatory Body) के समक्ष नियमानुसार अपील दायर कर सकते हैं।`,

    privacyPolicy: `Khabri Dost (खबरी दोस्त) Privacy & Data Protection Policy (अंतिम अद्यतन: 2026)

खबरी दोस्त पाठकों की डिजिटल गोपनीयता का पूर्ण सम्मान करता है। यह नीति स्पष्ट करती है कि जब आप हमारी वेबसाइट (khabridost.com) पर आते हैं, तो आपकी कौन सी जानकारी एकत्रित की जाती है, उसका उपयोग कैसे होता है और आपकी गोपनीयता की सुरक्षा के क्या उपाय हैं। यह नीति भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act 2023) तथा वैश्विक गोपनीयता मानकों (GDPR / Google Publisher Policies) के पूर्णतः अनुरूप है।

1. एकत्रित की जाने वाली सामान्य जानकारी (Information We Collect):
(क) लॉग फाइल्स (Log Files): अन्य सभी समाचार पोर्टलों की तरह, खबरी दोस्त मानक लॉग फाइलों का उपयोग करता है। इसमें इंटरनेट प्रोटोकॉल (IP) पते, ब्राउज़र का प्रकार, इंटरनेट सेवा प्रदाता (ISP), दिनांक/समय मोहर, संदर्भित पृष्ठ और क्लिक्स की संख्या शामिल होती है। यह जानकारी किसी भी व्यक्तिगत पहचान योग्य डेटा से जुड़ी नहीं होती है और इसका उपयोग केवल पोर्टल के तकनीकी प्रदर्शन और सर्वर सुरक्षा के लिए किया जाता है।
(ख) स्वैच्छिक जानकारी: जब आप हमारे न्यूज़लेटर की सदस्यता लेते हैं, ब्रेकिंग अलर्ट्स एक्टिवेट करते हैं अथवा संपर्क फॉर्म भरते हैं, तो आपका नाम, ईमेल और मोबाइल नंबर सुरक्षित रूप से केवल संबंधित सेवा प्रदान करने हेतु संग्रहीत किया जाता है।

2. कुकीज़ एवं वेब बीकन्स (Cookies and Web Beacons):
खबरी दोस्त पाठकों की प्राथमिकताओं को रिकॉर्ड करने और वेबसाइट के पेजों को उपयोगकर्ता के ब्राउज़र प्रकार के आधार पर अनुकूलित करने के लिए कुकीज़ का उपयोग करता है। पाठक चाहें तो अपने ब्राउज़र सेटिंग्स से किसी भी समय कुकीज़ को अक्षम (disable) कर सकते हैं।

3. Google AdSense एवं DoubleClick DART कुकी नीति (Third-Party Ad Serving Compliance):
(क) Google हमारी वेबसाइट पर एक आधिकारिक तृतीय-पक्ष विक्रेता (Third-Party Vendor) है। Google हमारी साइट और इंटरनेट पर अन्य साइटों के आपके पूर्व दौरों के आधार पर विज्ञापन प्रदर्शित करने के लिए DART कुकीज़ का उपयोग करता है।
(ख) उपयोगकर्ता Google विज्ञापन और सामग्री नेटवर्क गोपनीयता नीति (Google Ad and Content Network Privacy Policy) पर जाकर DART कुकीज़ के उपयोग से बाहर निकल सकते हैं: https://policies.google.com/technologies/ads
(ग) तीसरे पक्ष के विज्ञापन सर्वर या विज्ञापन नेटवर्क तकनीक का उपयोग करते हैं जो खबरी दोस्त पर दिखाई देने वाले विज्ञापनों और लिंक में उपयोग की जाती हैं। वे स्वचालित रूप से आपका आईपी पता प्राप्त करते हैं। खबरी दोस्त का इन तृतीय-पक्ष विज्ञापनदाताओं द्वारा उपयोग की जाने वाली इन कुकीज़ पर कोई नियंत्रण या पहुंच नहीं है।

4. Google Analytics प्रकटीकरण (Analytics Disclosure):
हम वेबसाइट ट्रैफिक, पृष्ठ दृश्यों (pageviews) और लोकप्रिय विषयों का विश्लेषण करने के लिए Google Analytics का उपयोग करते हैं। यह डेटा पूरी तरह से अनामीकृत (anonymized) होता है और इसका उपयोग केवल पाठकों के लिए उच्च गुणवत्ता वाली समाचार सामग्री तैयार करने के लिए किया जाता है।

5. डेटा सुरक्षा एवं एन्क्रिप्शन (Data Security):
हम पाठकों के डेटा को अनधिकृत पहुंच, परिवर्तन या प्रकटीकरण से बचाने के लिए 256-बिट SSL/TLS एन्क्रिप्शन और सुरक्षित फायरवॉल प्रोटोकॉल का उपयोग करते हैं। हम आपका व्यक्तिगत डेटा कभी भी किसी तीसरे पक्ष को बेचते या किराए पर नहीं देते हैं।

6. बच्चों की ऑनलाइन गोपनीयता सुरक्षा (COPPA Compliance):
खबरी दोस्त 13 वर्ष से कम आयु के बच्चों से जानबूझकर कोई व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करता है। यदि माता-पिता या अभिभावक को लगता है कि हमारे डेटाबेस में उनके बच्चे की कोई जानकारी है, तो वे तुरंत हमसे संपर्क करें; हम उसे तत्काल हटा देंगे।

7. डेटा संबंधी अधिकारों हेतु संपर्क (Contact Information):
यदि इस गोपनीयता नीति के संबंध में आपके कोई प्रश्न हैं अथवा आप अपने डेटा को हटाने का अनुरोध करना चाहते हैं, तो कृपया हमारे डेटा संरक्षण डेस्क पर संपर्क करें:
ईमेल: khabridost.com@gmail.com | डाक पता: प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001`,

    termsOfService: `खबरी दोस्त (Khabri Dost) - नियम एवं शर्तें (Terms of Service)

1. नियमों की स्वीकृति (Acceptance of Agreement):
खबरी दोस्त (khabridost.com) डिजिटल न्यूज़ पोर्टल का उपयोग करने से पहले कृपया इन नियमों एवं शर्तों को ध्यानपूर्वक पढ़ें। इस वेबसाइट का उपयोग अथवा सामग्री को देखना यह प्रमाणित करता है कि आप इन शर्तों से पूर्णतः सहमत हैं और भारतीय कानूनों के तहत बाध्य होने की सहमति देते हैं।

2. बौद्धिक संपदा एवं कॉपीराइट (Intellectual Property & Copyright):
(क) खबरी दोस्त पर प्रकाशित समस्त सामग्री जिसमें समाचार, विशेष रिपोर्ट, लेख, हेडलाइंस, विश्लेषण, तस्वीरें, ग्राफिक्स, ऑडियो-वीडियो, लोगो तथा लेआउट शामिल हैं, खबरी दोस्त की विशेष बौद्धिक संपदा है और भारतीय कॉपीराइट अधिनियम, 1957 तथा अंतर्राष्ट्रीय कॉपीराइट संधियों द्वारा संरक्षित है।
(ख) संपादकीय अनुमति के बिना इस वेबसाइट की किसी भी सामग्री की व्यावसायिक नकल, स्वचालित वेब-स्क्रैपिंग (Automated Web Scraping), पुनरुत्पादन, सिंडिकेशन अथवा अन्य किसी डिजिटल माध्यम में पुनर्वितरण सख्त वर्जित है। उचित संदर्भ और लाइव बैकलिंक के साथ सीमित निष्पक्ष उपयोग (Fair Dealing) ही अनुमत है।

3. पाठक टिप्पणियां एवं उपयोगकर्ता आचरण (User Comments & Conduct):
(क) पोर्टल के लेखों पर पाठकों द्वारा की जाने वाली टिप्पणियां उनकी व्यक्तिगत राय होती हैं। खबरी दोस्त टिप्पणियों में व्यक्त विचारों के लिए उत्तरदायी नहीं है।
(ख) उपयोगकर्ताओं को ऐसी टिप्पणियां करने की सख्त मनाही है जो मानहानिकारक, अश्लील, भड़काऊ, देश की संप्रभुता या सुरक्षा के विरुद्ध, कॉपीराइट का उल्लंघन करने वाली अथवा किसी समुदाय की धार्मिक भावनाओं को आहत करने वाली हों।
(ग) संपादकीय टीम को बिना कोई पूर्व सूचना दिए किसी भी अनुचित अथवा स्पैम टिप्पणी को हटाने तथा संबंधित उपयोगकर्ता को ब्लॉक करने का पूर्ण अधिकार सुरक्षित है।

4. सामग्री अस्वीकरण (Editorial & Information Disclaimer):
(क) खबरी दोस्त निष्पक्ष, सटीक और समय पर समाचार प्रदान करने के लिए हर संभव प्रयास करता है। तथापि, डिजिटल पोर्टल पर उपलब्ध सामग्री सामान्य जन-जागरूकता और सूचनात्मक उद्देश्य के लिए है।
(ख) शेयर बाजार, वित्तीय निवेश, कानूनी अथवा चिकित्सा संबंधी समाचारों को पेशेवर वित्तीय या चिकित्सीय सलाह नहीं माना जाना चाहिए। पाठकों को सलाह दी जाती है कि वे कोई भी वित्तीय या व्यक्तिगत निर्णय लेने से पूर्व संबंधित विशेषज्ञ से परामर्श लें।

5. तृतीय-पक्ष वेबसाइटों के लिंक (Third-Party External Links):
हमारे पोर्टल पर पाठकों के संदर्भ हेतु अन्य वेबसाइटों अथवा आधिकारिक पोर्टलों के हाइपरलिंक्स हो सकते हैं। उन बाहरी वेबसाइटों की सामग्री, सटीकता अथवा उनकी गोपनीयता नीतियों पर खबरी दोस्त का कोई नियंत्रण नहीं है।

6. दायित्व की सीमा (Limitation of Liability):
खबरी दोस्त अथवा उसके संपादक, लेखक एवं कर्मचारी पोर्टल के उपयोग, तकनीकी व्यवधान, सर्वर डाउनटाइम अथवा प्रकाशित सामग्री पर विश्वास करने से होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष या आकस्मिक नुकसान के लिए उत्तरदायी नहीं होंगे।

7. अधिकार क्षेत्र एवं कानूनी क्षेत्राधिकार (Governing Law & Legal Jurisdiction):
ये नियम एवं शर्तें भारत के गणराज्य के कानूनों द्वारा शासित होंगी। खबरी दोस्त के उपयोग से संबंधित किसी भी विवाद या दावे का निपटारा केवल नई दिल्ली, भारत स्थित सक्षम न्यायालयों के अनन्य क्षेत्राधिकार के अंतर्गत होगा।`,

    disclaimer: `खबरी दोस्त (Khabri Dost) - अस्वीकरण एवं उपयोग नीति (Disclaimer)

1. सामान्य सूचनात्मक उद्देश्य (General Information Only):
खबरी दोस्त (khabridost.com) पर प्रकाशित समस्त समाचार, विश्लेषण, संपादकीय, रिपोर्ट, आंकड़े और तस्वीरें केवल सामान्य जन-सूचना, शिक्षा और जागरूकता के उद्देश्य से प्रस्तुत की जाती हैं। यद्यपि हम सटीकता और समयबद्धता सुनिश्चित करने के लिए हर संभव प्रयास करते हैं, फिर भी किसी अनजाने में हुई चूक या मानवीय त्रुटि के लिए पूर्ण कानूनी गारंटी नहीं दी जा सकती।

2. वित्तीय एवं निवेश संबंधी अस्वीकरण (Financial & Market Disclaimer):
पोर्टल के बिज़नेस, अर्थव्यवस्था और शेयर बाजार अनुभाग में प्रकाशित कोई भी लेख, स्टॉक विश्लेषण, म्यूचुअल फंड समीक्षा अथवा क्रिप्टोकरेंसी से संबंधित समाचार वित्तीय या निवेश सलाह (Investment Advice) नहीं है। शेयर बाज़ार अथवा किसी भी वित्तीय साधन में निवेश बाजार जोखिमों के अधीन है। कोई भी वित्तीय निर्णय लेने से पहले सेबी (SEBI) पंजीकृत वित्तीय सलाहकार से परामर्श अवश्य लें।

3. स्वास्थ्य एवं चिकित्सा अस्वीकरण (Health & Medical Disclaimer):
जीवनशैली, स्वास्थ्य और फिटनेस से जुड़े लेख केवल सामान्य जानकारी के लिए हैं। इन्हें किसी योग्य चिकित्सक या स्वास्थ्य विशेषज्ञ की चिकित्सीय सलाह, निदान अथवा उपचार का विकल्प न माना जाए।

4. तृतीय-पक्ष लिंक एवं बाह्य वेबसाइटें (Third-Party External Links):
हमारी वेबसाइट पर पाठकों की सुविधा के लिए अन्य वेबसाइटों, सरकारी पोर्टलों अथवा संदर्भ स्रोतों के लिंक हो सकते हैं। खबरी दोस्त का इन बाहरी वेबसाइटों की सामग्री, कार्यप्रणाली अथवा उनकी गोपनीयता नीतियों पर कोई नियंत्रण या उत्तरदायित्व नहीं है।

5. निष्पक्ष उपयोग अस्वीकरण (Fair Dealing / Fair Use Notice):
इस पोर्टल पर प्रकाशित कुछ रिपोर्टों में जनहित, समाचार समीक्षा, आलोचना अथवा शोध के उद्देश्य से आवश्यक संदर्भ सामग्री का निष्पक्ष उपयोग (Fair Use under Section 52 of Indian Copyright Act, 1957) किया जा सकता है। सर्वाधिकार संबंधित मूल स्वामियों के पास सुरक्षित हैं।`,

    correctionPolicy: `खबरी दोस्त (Khabri Dost) - सुधार एवं संशोधन नीति (Corrections Policy)

1. सत्यता एवं पारदर्शिता के प्रति प्रतिबद्धता (Commitment to Accuracy):
खबरी दोस्त अपने पाठकों को निष्पक्ष और सटीक समाचार उपलब्ध कराने के लिए समर्पित है। हमारा सिद्धांत है कि गलतियों को छिपाने के बजाय उन्हें तुरंत और पारदर्शी तरीके से सुधारना ही एक जिम्मेदार मीडिया संस्थान की असली पहचान है।

2. सुधार की प्रक्रिया (Correction Workflow):
(क) यदि किसी प्रकाशित लेख में तथ्यात्मक त्रुटि, वर्तनी की बड़ी चूक, गलत नाम, पद अथवा आंकड़ों की गलती पाई जाती है, तो हमारी संपादकीय टीम द्वारा 24 घंटे के भीतर आवश्यक संशोधन किया जाता है।
(ख) सामान्य सुधार (Typo): यदि कोई सामान्य वर्तनी या व्याकरण सुधार है जिससे समाचार के अर्थ पर प्रभाव नहीं पड़ता, तो उसे बिना विशेष नोट के सुधारा जा सकता है।
(ग) वास्तविक तथ्यात्मक सुधार (Substantive Correction): यदि समाचार के मूल अर्थ, आंकड़ों या किसी व्यक्ति/संस्था पर लगे आरोपों से जुड़ा तथ्य सुधारा जाता है, तो आर्टिकल के शीर्ष पर स्पष्ट रूप से 'संशोधन नोट (Correction Note)' अंकित किया जाता है। इस नोट में संशोधन की तिथि, समय और मूल त्रुटि का स्पष्ट विवरण होता है।

3. खंडन एवं अधिकार का प्रत्युत्तर (Right of Reply):
यदि किसी व्यक्ति, संस्थान अथवा कंपनी को लगता है कि हमारे किसी समाचार में उनकी छवि या पक्ष को गलत तरीके से पेश किया गया है, तो वे अपना पक्ष हमारे संपादकीय डेस्क (khabridost.com@gmail.com) पर भेज सकते हैं। सत्यापन के पश्चात उनके आधिकारिक पक्ष को समाचार के साथ प्रमुखता से शामिल किया जाएगा।

4. समाचार वापसी नीति (Retraction Policy):
यदि कोई प्रकाशित समाचार पूरी तरह से अपुष्ट, भ्रामक अथवा कानूनी रूप से अस्वीकार्य पाया जाता है, तो उसे तत्काल वापस (Retract) लिया जाता है और उसके स्थान पर संपादकीय क्षमा-याचना एवं वापसी का स्पष्ट कारण प्रकाशित किया जाता है।`,

    dmcaNotice: `खबरी दोस्त (Khabri Dost) - कॉपीराइट उल्लंघन एवं DMCA नीति (Copyright & Takedown Notice)

1. बौद्धिक संपदा का सम्मान (Intellectual Property Rights):
खबरी दोस्त (Khabri Dost) अन्य सभी रचनाकारों, छायाकारों, लेखकों और संस्थानों के बौद्धिक संपदा अधिकारों का पूर्ण सम्मान करता है। हमारा नीतिगत नियम है कि कॉपीराइट उल्लंघन की किसी भी वैध सूचना पर त्वरित संज्ञान लिया जाए।

2. कॉपीराइट उल्लंघन की शिकायत दर्ज करना (DMCA / Copyright Takedown Procedure):
यदि आप किसी सामग्री के वैधानिक कॉपीराइट स्वामी हैं और आपको लगता है कि खबरी दोस्त पर प्रकाशित कोई तस्वीर, वीडियो, पाठ्य सामग्री अथवा ग्राफिक्स आपके कॉपीराइट का उल्लंघन करता है, तो आप हमारे प्राधिकृत कॉपीराइट एजेंट को लिखित में निम्नलिखित विवरणों के साथ नोटिस भेज सकते हैं:
(क) कॉपीराइट स्वामी अथवा उनके अधिकृत प्रतिनिधि के हस्ताक्षर।
(ख) जिस मूल कृति का उल्लंघन हुआ है, उसका सटीक विवरण एवं कॉपीराइट पंजीकरण प्रमाण।
(ग) खबरी दोस्त पर उल्लंघनकारी सामग्री का सटीक वेब पता (URL)।
(घ) आपका पूरा नाम, डाक पता, टेलीफोन नंबर और आधिकारिक ईमेल।
(ङ) एक सद्भावनापूर्ण बयान कि संबंधित सामग्री का उपयोग कॉपीराइट स्वामी, उनके एजेंट अथवा कानून द्वारा अधिकृत नहीं है।
(च) शपथपूर्वक यह बयान कि नोटिस में दी गई जानकारी सत्य है और आप कॉपीराइट के वैधानिक स्वामी हैं।

3. प्राधिकृत विधिक एवं कॉपीराइट डेस्क (Designated Legal Agent):
- ईमेल: legal@khabridost.com | khabridost.com@gmail.com
- डाक पता: विधिक अनुभाग, खबरी दोस्त मीडिया नेटवर्क, प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001
- संज्ञान समयसीमा: वैध नोटिस प्राप्ति के 48 घंटे के भीतर समीक्षा कर उल्लंघनकारी सामग्री को हटा दिया जाता है।`,
  },
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionsConfig = {
  heroSlider: true,
  liveVideoBulletin: true,
  liveFeedCoverage: false, // Hidden from homepage by default as requested ("yha se hta do")
  headerLiveFeedLink: true, // Visible in Header navigation menu to open Live Feed in Page Style
  briefsTicker: true,
  trendingTopics: true,
  webStories: true,
  photoGallery: true,
  categoryBlocks: true,
};

export const DEFAULT_GOOGLE_SERVICES: GoogleServicesConfig = {
  googleAnalyticsId: 'G-KD2026IN',
  searchConsoleVerification: 'google-site-verification=kd_news_portal_master_2026_verified',
  googleTagManagerId: 'GTM-KD2026X',
  adsenseClientId: 'ca-pub-9840284729482910',
  adsenseAutoAds: true,
  adsenseStatus: 'active',
};

export const DEFAULT_SPEED_WEB_VITALS: SpeedAndWebVitalsConfig = {
  enableLazyLoading: true,
  enableWebpOptimization: true,
  enableDnsPrefetch: true,
  enableScriptDeferral: true,
  targetLcpMs: 1200,
  targetFidMs: 45,
  targetCls: 0.02,
  currentScore: 98,
};

export const DEFAULT_ADVANCED_SEO: AdvancedSeoConfig = {
  defaultMetaTitle: 'खबरी दोस्त (Khabri Dost) - निष्पक्ष, निर्भीक, सबसे आगे | ताज़ा हिंदी समाचार',
  defaultMetaDescription: 'खबरी दोस्त भारत का विश्वसनीय हिंदी न्यूज़ मंच है। देश-दुनिया, राजनीति, खेल, बिज़नेस, तकनीक और आम जनजीवन की सबसे ताज़ा व सटीक ख़बरें।',
  defaultFocusKeywords: 'हिंदी समाचार, ताज़ा ख़बरें, Khabri Dost, Breaking News Hindi, भारत न्यूज़',
  canonicalDomain: 'https://khabridost.com',
  newsOrganizationSchema: true,
  newsArticleSchema: true,
  breadcrumbSchema: true,
  robotsDirectives: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /#login\nSitemap: https://khabridost.com/sitemap.xml',
  brokenLinkCheck: {
    totalChecked: 142,
    brokenCount: 0,
    lastAuditTime: new Date().toISOString(),
    status: 'healthy',
  },
};

export const DEFAULT_MOBILE_SETTINGS: MobileSettingsConfig = {
  mobileScale: 'normal',
  stickyMobileBottomNav: true,
  mobileImageQuality: 'balanced',
  touchFriendlyPadding: true,
};

export const DEFAULT_API_CONFIG: ApiConfiguration = {
  geminiApiKey: '',
  openaiApiKey: '',
  anthropicApiKey: '',
  googleTrendsApiKey: '',
  activeAiProvider: 'gemini',
  googleTrendsRegion: 'IN',
  googleTrendsLanguage: 'hi',
  googleTrendsAutoRefresh: true,
  googleTrendsRefreshIntervalMinutes: 15,
};

export const DEFAULT_EPAPER_SETTINGS: EPaperSettings = {
  mode: 'dynamic',
  customPdfUrl: '',
  customPdfTitle: 'खबरी दोस्त • दैनिक राष्ट्रीय समाचार पत्र',
  customPdfEdition: 'राष्ट्रीय संस्करण (नई दिल्ली)',
  customPdfDate: 'आज का अंक',
  customPdfThumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
  customPdfPageCount: 8,
  featuredHeadline: 'गगनयान मिशन के क्रू मॉड्यूल का सफल परीक्षण, अंतरिक्ष में भारत की ऐतिहासिक छलांग',
  allowDownload: true,
  allowShare: true,
};

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  apiConfig: DEFAULT_API_CONFIG,
  headerFooter: DEFAULT_HEADER_FOOTER_SETTINGS,
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
  googleServices: DEFAULT_GOOGLE_SERVICES,
  speedAndWebVitals: DEFAULT_SPEED_WEB_VITALS,
  advancedSeoSettings: DEFAULT_ADVANCED_SEO,
  mobileSettings: DEFAULT_MOBILE_SETTINGS,
  tickerSpeed: 'slow',
  tickerSpeedSeconds: 90,
  liveVideoSectionEnabled: true,
  liveVideoYoutubeId: 'jfKfPfyJRdk',
  liveVideoTitle: 'खबरी दोस्त डिजिटल स्टूडियो • लाइव वीडियो बुलेटिन',
  liveFeedCoverageEnabled: false,
  headerLiveFeedLinkEnabled: true,
  trendingTopics: [
    '#गगनयान_मिशन',
    '#टी20_वर्ल्डकप',
    '#नीरज_चोपड़ा',
    '#सेंसेक्स_81400',
    '#संसद_सत्र',
    '#डिजिटल_सुरक्षा',
    '#मेक_इन_इंडिया',
    '#वंदे_भारत_स्लीपर',
    '#यूपी_एक्सप्रेसवे',
  ],
  pinnedTrendingArticleIds: ['news-1', 'news-3', 'news-12', 'news-4'],
  spotlightLayout: DEFAULT_SPOTLIGHT_LAYOUT,
  displayOptions: {
    showExcerptOnMobile: false,
    showAuthor: true,
    showDate: true,
    showViews: true,
    showLocation: true,
    cardStyle: 'compact',
  },
  articleMetaSettings: DEFAULT_ARTICLE_META_SETTINGS,
  sidebarWidgets: DEFAULT_ARTICLE_SIDEBAR_WIDGETS,
  typography: {
    headerFont: "'Rozha One', serif",
    footerFont: "'Mukta', sans-serif",
    headlineFont: "'Rozha One', serif",
    bodyFont: "'Mukta', sans-serif",
    metaFont: "'Mukta', sans-serif",
    headlineWeight: 700,
    bodyWeight: 400,
    mobileScale: 'normal',
    baseSize: 'normal',
    headingSize: 'normal',
    titleSize: 'normal',
    contentSize: 'normal',
    archiveSize: 'normal',
    metaSize: 'normal',
    headerFontSize: 'normal',
    footerFontSize: 'normal',
    homepageTitleSize: 'normal',
    articleTitleSize: 'normal',
    articleTitleDesktopPx: 32,
    articleTitleMobilePx: 26,
    articleLeadSubtitlePx: 18,
    articleBodyFontSizePx: 17,
    articleBodyLineHeight: 1.75,
    articleExcerptSize: 'normal',
    metaDescriptionSize: 'normal',
    headerLogoHeightPx: 52,
    headerTitleCustomPx: 36,
    navLinkFontSizePx: 14,
    tickerFontSizePx: 13,
    sectionHeadingPx: 20,
    heroTitlePx: 26,
    gridCardTitlePx: 16,
    gridCardExcerptPx: 13,
    cardMetaFontSizePx: 11,
    relatedHeadingSize: 'normal',
    relatedHeadingCustomPx: 18,
    relatedCategoryBadgePx: 12,
    relatedCardTitlePx: 15,
    sidebarHeadingPx: 15,
    sidebarItemTitlePx: 13,
    footerHeadingPx: 16,
    footerTextPx: 13,
    baseFontSizePx: 16,
  },
  sharePlatforms: {
    whatsapp: true,
    telegram: true,
    twitter: true,
    facebook: true,
    copyLink: true,
    googleNews: true,
  },
  adSettings: {
    showTopAd: true,
    showMidContentAd: true,
    showBottomAd: true,
    showSidebarAd: true,
    topAdType: 'adsense',
    sidebarAdType: 'private',
    privateBannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    privateBannerLink: '#contact',
    privateBannerTitle: 'खबरी दोस्त मीडिया नेटवर्क पर विज्ञापन दें | 5 लाख+ सक्रिय पाठकों तक ब्रांड पहुंच',
    customScriptOrHtml: '',
    responsiveBreakpoints: {
      leaderboard: DEFAULT_ARTICLE_BANNER_BREAKPOINTS,
      inContent: DEFAULT_ARTICLE_BANNER_BREAKPOINTS,
      sidebar: DEFAULT_SIDEBAR_AD_BREAKPOINTS,
      bottom: DEFAULT_ARTICLE_BANNER_BREAKPOINTS,
    },
  },
  customPhotoStories: [],
  sidebarAdsConfig: DEFAULT_SIDEBAR_ADS_CONFIG,
  popupConfig: DEFAULT_POPUP_CONFIG,
  mobileSidebarMenu: DEFAULT_MOBILE_SIDEBAR_MENU,
  epaperSettings: DEFAULT_EPAPER_SETTINGS,
};

export const INITIAL_SUBSCRIBERS: SubscriberItem[] = [
  {
    id: 'sub-1',
    email: 'khabridost.com@gmail.com',
    name: 'Chief Editor Admin',
    status: 'vip',
    source: 'manual',
    subscribedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    tags: ['Admin', 'Editorial', 'VIP'],
  },
  {
    id: 'sub-2',
    email: 'amit.verma92@gmail.com',
    name: 'अमित वर्मा',
    status: 'active',
    source: 'popup',
    subscribedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    tags: ['Daily Digest', 'Breaking News'],
  },
  {
    id: 'sub-3',
    email: 'priya.sharma.delhi@outlook.com',
    name: 'प्रिया शर्मा',
    status: 'active',
    source: 'footer',
    subscribedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    tags: ['Tech', 'Business'],
  },
  {
    id: 'sub-4',
    email: 'rajesh.patel.ahmedabad@gmail.com',
    name: 'राजेश पटेल',
    status: 'active',
    source: 'article_page',
    subscribedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    tags: ['Market Watch', 'National'],
  },
  {
    id: 'sub-5',
    email: 'vikram.singh.lucknow@yahoo.com',
    name: 'विक्रम सिंह',
    status: 'vip',
    source: 'sidebar',
    subscribedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: ['States', 'Politics', 'VIP'],
  },
];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif-1',
    title: '🔴 ऐतिहासिक जीत: भारत पहुंचा T20 वर्ल्ड कप फाइनल में!',
    message: 'ऑस्ट्रेलिया को रोमांचक मुकाबले में 5 विकेट से हराया। अंतिम ओवर में रिंकू सिंह के दो छक्के। पूरी रिपोर्ट देखें।',
    url: 'news-3',
    icon: '🏏',
    status: 'sent',
    targetAudience: 'sports',
    sentAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    clicksCount: 842,
    reachCount: 14250,
  },
  {
    id: 'notif-2',
    title: '🚀 गगनयान मिशन: क्रू मॉड्यूल पैराशूट रिकवरी सफल',
    message: 'इसरो का बड़ा कारनामा। बंगाल की खाड़ी से नौसेना ने सुरक्षित रिकवर किया कैप्सूल।',
    url: 'news-1',
    icon: '🚀',
    status: 'sent',
    targetAudience: 'breaking',
    sentAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    clicksCount: 1250,
    reachCount: 18400,
  },
  {
    id: 'notif-3',
    title: '📈 सेंसेक्स 81,400 के पार, बाजार में तूफानी तेजी',
    message: 'विदेशी निवेशकों की भारी लिवाली। आईटी और बैंकिंग शेयरों में 4% तक का उछाल।',
    url: 'news-4',
    icon: '📈',
    status: 'sent',
    targetAudience: 'business',
    sentAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    clicksCount: 420,
    reachCount: 9100,
  },
];

export const INITIAL_VIDEOS: VideoNewsItem[] = [
  {
    id: 'vid-1',
    title: '🔴 लाइव विशेष बुलेटिन: गगनयान परीक्षण की सफलता पर वैज्ञानिकों से विशेष बातचीत',
    youtubeId: 'live_stream_placeholder',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80',
    duration: 'लाइव 24x7',
    category: 'विज्ञान',
    isLive: true,
  },
  {
    id: 'vid-2',
    title: 'टी-20 वर्ल्ड कप सेमीफाइनल में भारत की तूफानी जीत: देखिए मैच के टर्निंग पॉइंट्स',
    youtubeId: 'match_highlights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    duration: '04:25',
    category: 'खेल',
    isLive: false,
  },
  {
    id: 'vid-3',
    title: 'संसद में डिजिटल डेटा बिल पर तीखी बहस: पक्ष-विपक्ष के मुख्य तर्कों का विश्लेषण',
    youtubeId: 'parliament_debate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    duration: '06:10',
    category: 'राजनीति',
    isLive: false,
  },
  {
    id: 'vid-4',
    title: 'बाज़ार की चाल: सेंसेक्स में 685 अंकों के उछाल के बाद इन 5 शेयरों में निवेश की सलाह',
    youtubeId: 'market_insights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    duration: '05:40',
    category: 'व्यापार',
    isLive: false,
  },
];

export const INITIAL_PHOTO_STORIES: PhotoStoryItem[] = [
  {
    id: 'photo-1',
    title: 'तस्वीरों में देखिए गगनयान के क्रू मॉड्यूल की समुद्र से सफल रिकवरी',
    imageUrl: 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80',
    photosCount: 8,
    location: 'श्रीहरिकोटा',
    category: 'राष्ट्रीय',
  },
  {
    id: 'photo-2',
    title: 'विक्ट्री सेलिब्रेशन: मेलबर्न में तिरंगा लहराते भारतीय क्रिकेट फैंस की खुशियां',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    photosCount: 12,
    location: 'मेलबर्न',
    category: 'खेल',
  },
  {
    id: 'photo-3',
    title: 'उत्तर भारत में मौसम का बदला मिजाज: पहाड़ों पर पहली बर्फबारी की मनमोहक तस्वीरें',
    imageUrl: 'https://images.unsplash.com/photo-1517030330234-94c4fb948ebc?w=800&auto=format&fit=crop&q=80',
    photosCount: 6,
    location: 'मनाली / शिमला',
    category: 'मौसम',
  },
  {
    id: 'photo-4',
    title: 'राष्ट्रीय फिल्म पुरस्कार 2026: राष्ट्रपति भवन में सम्मानित सितारों की विशेष झलकियां',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    photosCount: 15,
    location: 'नई दिल्ली',
    category: 'सिनेमा',
  },
];

export const INITIAL_MEDIA_ASSETS = [
  {
    id: 'media-1',
    title: 'Gaganyaan Space Capsule Sea Recovery',
    url: 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=1200&auto=format&fit=crop&q=80',
    altText: 'Gaganyaan space crew module ocean splashdown',
    caption: 'इसरो गगनयान क्रू मॉड्यूल समुद्र परीक्षण',
    type: 'image' as const,
    category: 'national',
    fileSize: '1.4 MB',
    dimensions: '1920x1080',
    uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    uploadedBy: 'मुख्य संपादक',
  },
  {
    id: 'media-2',
    title: 'Parliament House New Delhi Session',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    altText: 'Indian Parliament building session proceedings',
    caption: 'नई दिल्ली संसद भवन विशेष सत्र',
    type: 'image' as const,
    category: 'politics',
    fileSize: '2.1 MB',
    dimensions: '2048x1365',
    uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    uploadedBy: 'दीपक चौहान',
  },
  {
    id: 'media-3',
    title: 'Cricket Stadium Match Trophy Win',
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&auto=format&fit=crop&q=80',
    altText: 'Cricket stadium floodlights celebration',
    caption: 'टी-20 वर्ल्ड कप सेमीफाइनल जीत का जश्न',
    type: 'image' as const,
    category: 'sports',
    fileSize: '1.8 MB',
    dimensions: '1920x1280',
    uploadedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    uploadedBy: 'संगीता राव',
  },
  {
    id: 'media-4',
    title: 'Stock Market Bull & Trading Terminal',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    altText: 'Stock market bull and green candles graph',
    caption: 'सेंसेक्स रिकॉर्ड 81,420 ऑल-टाइम हाई',
    type: 'image' as const,
    category: 'business',
    fileSize: '1.6 MB',
    dimensions: '1800x1200',
    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    uploadedBy: 'मनीषा कपूर',
  },
  {
    id: 'media-5',
    title: 'Vande Bharat High Speed Train Track',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80',
    altText: 'Modern aerodynamic high speed electric train',
    caption: 'वंदे भारत स्लीपर एक्सप्रेस 180 किमी/घंटा ट्रायल',
    type: 'image' as const,
    category: 'national',
    fileSize: '1.9 MB',
    dimensions: '1920x1080',
    uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    uploadedBy: 'मुख्य संपादक',
  },
  {
    id: 'media-6',
    title: 'Ayodhya Shri Ram Mandir Heritage',
    url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    altText: 'Indian temple architectural heritage',
    caption: 'अयोध्या-काशी रैपिड रेल व भव्य मंदिर परिसर',
    type: 'image' as const,
    category: 'state',
    fileSize: '2.5 MB',
    dimensions: '2400x1600',
    uploadedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    uploadedBy: 'राजेश शर्मा',
  },
  {
    id: 'media-7',
    title: 'AI Neural Network & Microchips',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    altText: 'Artificial intelligence digital neural network',
    caption: 'स्वदेशी भारत-जेन 14 भाषाई एआई मॉडल',
    type: 'image' as const,
    category: 'tech',
    fileSize: '1.2 MB',
    dimensions: '1600x1000',
    uploadedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    uploadedBy: 'दीपक चौहान',
  },
  {
    id: 'media-8',
    title: 'Top Leaderboard Advertisement Banner',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    altText: 'Khabri Dost Media Ad Network Banner',
    caption: 'खबरी दोस्त मीडिया नेटवर्क पर विज्ञापन दें',
    type: 'banner' as const,
    category: 'advertising',
    fileSize: '450 KB',
    dimensions: '728x90',
    uploadedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    uploadedBy: 'मुख्य संपादक',
  },
];

export const INITIAL_EDITORIAL_USERS = [
  {
    id: 'user-1',
    name: 'Khabri Dost Admin',
    email: 'khabridost.com@gmail.com',
    role: 'super_admin' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    articlesCount: 18,
    lastLogin: 'Just now',
    joinedAt: '2025-01-10T10:00:00Z',
    bio: 'संस्थापक एवं मुख्य व्यवस्थापक (Chief Administrator & Publisher)',
    assignedCategories: ['all'] as any,
  },
  {
    id: 'user-2',
    name: 'राजेश शर्मा (Rajesh Sharma)',
    email: 'rajesh.editor@khabridost.com',
    role: 'editor_in_chief' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    articlesCount: 42,
    lastLogin: '2 hours ago',
    joinedAt: '2025-02-01T09:30:00Z',
    bio: 'वरिष्ठ पत्रकार, 18 वर्षों का राष्ट्रीय व राजनीतिक रिपोर्टिंग अनुभव।',
    assignedCategories: ['politics', 'national', 'state'] as any,
  },
  {
    id: 'user-3',
    name: 'संगीता राव (Sangeeta Rao)',
    email: 'sangeeta.sports@khabridost.com',
    role: 'senior_editor' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    articlesCount: 29,
    lastLogin: 'Yesterday',
    joinedAt: '2025-03-15T11:00:00Z',
    bio: 'खेल डेस्क प्रमुख, क्रिकेट व ओलंपिक विशेषज्ञ।',
    assignedCategories: ['sports'] as any,
  },
  {
    id: 'user-4',
    name: 'दीपक चौहान (Deepak Chauhan)',
    email: 'deepak.bureau@khabridost.com',
    role: 'journalist' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    articlesCount: 35,
    lastLogin: '3 days ago',
    joinedAt: '2025-04-10T14:20:00Z',
    bio: 'संसद व रक्षा मामलों के विशेष संवाददाता।',
    assignedCategories: ['national', 'politics'] as any,
  },
  {
    id: 'user-5',
    name: 'अनुज मिश्रा (Anuj Mishra)',
    email: 'anuj.factcheck@khabridost.com',
    role: 'fact_checker' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    articlesCount: 14,
    lastLogin: 'Today',
    joinedAt: '2025-05-01T10:15:00Z',
    bio: 'डिजिटल फैक्ट चेक व सोशल मीडिया सत्यापन प्रभारी।',
    assignedCategories: ['national', 'tech', 'politics'] as any,
  },
  {
    id: 'user-6',
    name: 'विकास खन्ना (Vikas Khanna)',
    email: 'vikas.analyst@khabridost.com',
    role: 'analyst' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    articlesCount: 8,
    lastLogin: 'Today',
    joinedAt: '2025-06-10T12:00:00Z',
    bio: 'वेबसाइट ट्रैफ़िक, कोर वेब वाइटल्स और पाठक सहभागिता विश्लेषक।',
    assignedCategories: ['all'] as any,
  },
  {
    id: 'user-7',
    name: 'रोहन मेहरा (Rohan Mehra)',
    email: 'rohan.seo@khabridost.com',
    role: 'seo_manager' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    articlesCount: 12,
    lastLogin: 'Yesterday',
    joinedAt: '2025-06-12T14:30:00Z',
    bio: 'सर्च इंजन ऑप्टिमाइज़ेशन, स्कीमा रिच स्निपेट्स और गूगल सर्च कंसोल विशेषज्ञ।',
    assignedCategories: ['all'] as any,
  },
  {
    id: 'user-8',
    name: 'नीतू सिंह (Neetu Singh)',
    email: 'neetu.editor@khabridost.com',
    role: 'editor' as const,
    status: 'active' as const,
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    articlesCount: 22,
    lastLogin: '2 days ago',
    joinedAt: '2025-06-15T09:00:00Z',
    bio: 'समाचार डेस्क संपादक, मुख्य पृष्ठ सामग्री व फ़ीचर समीक्षा।',
    assignedCategories: ['national', 'state', 'sports'] as any,
  },
];

export const INITIAL_AD_CAMPAIGNS = [
  {
    id: 'ad-1',
    name: 'Top Leaderboard Direct Sponsor',
    slot: 'top_leaderboard' as const,
    type: 'private_sponsor' as const,
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'mailto:khabridost.com@gmail.com',
    advertiserName: 'Khabri Dost Media Network',
    impressions: 48200,
    clicks: 1420,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active' as const,
    cpmRate: 45,
  },
  {
    id: 'ad-2',
    name: 'In-Article Google AdSense Responsive',
    slot: 'in_article' as const,
    type: 'adsense' as const,
    advertiserName: 'Google AdSense Network',
    impressions: 32400,
    clicks: 980,
    startDate: '2026-01-01',
    status: 'active' as const,
    cpmRate: 35,
  },
  {
    id: 'ad-3',
    name: 'Sticky Sidebar Rectangle Banner',
    slot: 'sidebar_sticky' as const,
    type: 'private_sponsor' as const,
    bannerUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'mailto:khabridost.com@gmail.com',
    advertiserName: 'Digital Finance India',
    impressions: 19800,
    clicks: 520,
    startDate: '2026-02-01',
    endDate: '2026-08-30',
    status: 'active' as const,
    cpmRate: 40,
  },
];

export const INITIAL_LIVE_BLOGS: LiveBlogEvent[] = [
  {
    id: 'live-1',
    title: 'Political News 2026 Live Updates: संसद बजट सत्र एवं राष्ट्रीय राजनीतिक हलचल',
    summary: 'संसद में बजट और आर्थिक नीतियों पर तीखी नोकझोंक, विभिन्न राज्यों में आगामी विधानसभा चुनावों को लेकर गठबंधन वार्ता और दलों की रणनीतियों पर पल-पल का लाइव अपडेट।',
    category: 'politics',
    isLive: true,
    startedAt: '2026-09-23T08:00:00Z',
    lastUpdatedAt: '2026-09-23T11:15:00Z',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    keyHighlights: [
      'संसद में आर्थिक सर्वेक्षण व बजट के मुख्य नियमों पर पक्ष-विपक्ष में जोरदार बहस।',
      'गृह मंत्री ने आंतरिक सुरक्षा और सीमा प्रबंधन पर लोकसभा में दिया बयान।',
      'चुनाव आयोग द्वारा राज्यों में मतदाता सूची का नया शेड्यूल जारी।',
    ],
    updates: [
      {
        id: 'up-1',
        timestamp: '11:15 AM',
        title: 'संसद में विपक्ष का वॉकआउट, कृषि व ग्रामीण रोजगार बजट पर सवाल',
        content: 'संसद के दोनों सदनों में प्रश्नकाल के दौरान ग्रामीण विकास और कृषि योजनाओं के बजटीय आवंटन पर विपक्षी सांसदों ने नारेबाजी करते हुए संक्षिप्त वॉकआउट किया। संसदीय कार्य मंत्री ने कहा कि सरकार हर मुद्दे पर चर्चा के लिए तैयार है।',
        authorName: 'दीपक चौहान (विशेष संवाददाता)',
        tag: 'संसद',
        isImportant: true,
        createdAt: '2026-09-23T11:15:00Z',
      },
      {
        id: 'up-2',
        timestamp: '10:45 AM',
        title: 'गृह मंत्री ने सीमावर्ती सुरक्षा व आधुनिक ड्रोन निगरानी प्रणाली पर दी जानकारी',
        content: 'लोकसभा में पूरक प्रश्नों का उत्तर देते हुए गृह मंत्री ने स्पष्ट किया कि अंतरराष्ट्रीय सीमाओं पर लेजर फेंसिंग और AI संचालित ड्रोन कैमरों का जाल बिछाया जा चुका है, जिससे घुसपैठ में 90% से अधिक की गिरावट दर्ज की गई है।',
        authorName: 'राजेश शर्मा (प्रधान संपादक)',
        tag: 'बड़ा बयान',
        isImportant: true,
        createdAt: '2026-09-23T10:45:00Z',
      },
      {
        id: 'up-3',
        timestamp: '10:00 AM',
        title: 'राजनीतिक दलों की समन्वय समिति की बैठक शुरू',
        content: 'राष्ट्रीय राजधानी में आगामी क्षेत्रीय चुनावों के दृष्टिगत प्रमुख गठबंधन दलों के शीर्ष नेताओं की औपचारिक बैठक शुरू हो गई है। साझा घोषणापत्र और सीट शेयरिंग फॉर्मूले पर आम सहमति बनाने का प्रयास जारी है।',
        authorName: 'ब्यूरो रिपोर्ट',
        tag: 'राजनीति 2026',
        isImportant: false,
        createdAt: '2026-09-23T10:00:00Z',
      },
      {
        id: 'up-4',
        timestamp: '09:00 AM',
        title: 'संसद की कार्यवाही आज सुबह 11 बजे तक के लिए स्थगित के बाद दोबारा प्रारंभ',
        content: 'संसद भवन परिसर में गांधी प्रतिमा के समक्ष विभिन्न मुद्दों पर जनप्रतिनिधियों का शांतिपूर्ण प्रदर्शन संपन्न हुआ। दोनों सदनों में विधायी कार्य प्रारंभ।',
        authorName: 'संसदीय डेस्क',
        tag: 'शुरुआती अपडेट',
        isImportant: false,
        createdAt: '2026-09-23T09:00:00Z',
      },
    ],
  },
  {
    id: 'live-2',
    title: 'ISRO Gaganyaan Mission 2026 Live: क्रू एस्केप सिस्टम का अंतिम परीक्षण चरण',
    summary: 'श्रीहरिकोटा सतीश धवन अंतरिक्ष केंद्र से भारतीय अंतरिक्ष यात्रियों की सुरक्षा प्रणाली की लाइव जानकारी एवं वैज्ञानिक अपडेट।',
    category: 'tech',
    isLive: false,
    startedAt: '2026-09-22T06:00:00Z',
    lastUpdatedAt: '2026-09-22T14:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=1200&auto=format&fit=crop&q=80',
    keyHighlights: [
      'क्रू मॉड्यूल बंगाल की खाड़ी में सुरक्षित उतरा।',
      'भारतीय नौसेना ने 20 मिनट के भीतर मॉड्यूल को रिकवर किया।',
    ],
    updates: [
      {
        id: 'up-201',
        timestamp: '02:30 PM',
        title: 'मिशन 100% सफल: इसरो अध्यक्ष ने वैज्ञानिकों की टीम को बधाई दी',
        content: 'सभी मापदंडों पर परीक्षण पूरी तरह खरा उतरा है। भारतीय अंतरिक्ष यात्रियों के सुरक्षित प्रक्षेपण का मार्ग प्रशस्त।',
        authorName: 'विज्ञान संवाददाता',
        tag: 'सफलता',
        isImportant: true,
        createdAt: '2026-09-22T14:30:00Z',
      },
    ],
  },
];

export const INITIAL_CITIZEN_SUBMISSIONS: CitizenNewsSubmission[] = [
  {
    id: 'KD-CITIZEN-8491',
    title: 'वाराणसी-प्रयागराज राष्ट्रीय राजमार्ग पर भारी जलभराव से 10 किमी लंबा जाम',
    category: 'state',
    location: 'वाराणसी, उत्तर प्रदेश (NH-19)',
    incidentDate: 'आज सुबह 08:30 AM',
    description: 'लगातार 4 घंटे की मूसलाधार बारिश के बाद राष्ट्रीय राजमार्ग संख्या 19 पर अंडरपास में 4 फीट पानी भर गया। कई मालवाहक वाहन और एंबुलेंस जाम में फंसी हैं। स्थानीय प्रशासन से जल निकासी के लिए पंप लगाने की मांग की जा रही है।',
    images: [
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    ],
    videoUrl: '',
    senderName: 'रामेश्वर दयाल त्रिपाठी',
    senderPhone: '+91 94501 23456',
    senderEmail: 'rameshwar.varanasi@gmail.com',
    isAnonymous: false,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'pending',
  },
  {
    id: 'KD-CITIZEN-8492',
    title: 'जयपुर के आदर्श नगर पार्क में सौर ऊर्जा संचालित स्मार्ट स्ट्रीट लाइट्स का उद्घाटन',
    category: 'state',
    location: 'जयपुर, राजस्थान',
    incidentDate: 'कल शाम 06:00 PM',
    description: 'आदर्श नगर विकास समिति द्वारा जनसहयोग और निगम की सहायता से पूरे पार्क में 40 स्मार्ट सोलर लाइट्स लगाई गईं। अब शाम और सुबह टहलने वाले वरिष्ठ नागरिकों व महिलाओं के लिए सुरक्षा व्यवस्था बेहतर हुई है।',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    ],
    videoUrl: '',
    senderName: 'मीनाक्षी माथुर',
    senderPhone: '+91 98290 87654',
    senderEmail: 'minakshi.jaipur@rediffmail.com',
    isAnonymous: false,
    submittedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    status: 'verified',
  },
];

export const INITIAL_CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-101',
    name: 'विक्रम राठौर (Vikram Rathore)',
    email: 'vikram.rathore.press@gmail.com',
    phone: '+91 98112 34567',
    department: 'news_tip',
    subject: 'लखनऊ-कानपुर एक्सप्रेसवे परियोजना में निर्माण सामग्री अनियमितता की एक्सक्लूसिव जानकारी',
    message: 'नमस्ते संपादकीय टीम, मेरे पास स्थानीय आरटीआई और ऑडिट रिपोर्ट के दस्तावेज़ हैं जो एक्सप्रेसवे के पैकेज-3 में घटिया सामग्री के प्रयोग को उजागर करते हैं। कृपया गोपनीय पड़ताल हेतु संपर्क करें।',
    sourceUrl: 'https://example.com/documents/audit-report-2026.pdf',
    submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    status: 'new',
    adminNotes: 'लखनऊ ब्यूरो चीफ को सत्यापन हेतु अग्रेषित किया गया।',
  },
  {
    id: 'inq-102',
    name: 'अंजलि शर्मा (Brand Marketing Lead, FinPay)',
    email: 'anjali.s@finpaymedia.in',
    phone: '+91 99201 88442',
    department: 'advertising',
    subject: 'डिजिटल न्यूज़ पोर्टल पर Top Leaderboard व Sponsored Editorial Campaign हेतु वाणिज्यिक प्रस्ताव',
    message: 'महोदय, हम अगले 3 महीनों के लिए खबरी दोस्त के फाइनेंस व बिज़नेस सेक्शन पर 728x90 लीडरबोर्ड तथा 2 स्पॉन्सर्ड आर्टिकल्स की बुकिंग हेतु विज्ञापन दरें (Rate Card) व ट्रैफ़िक आँकड़े जानना चाहते हैं।',
    submittedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    status: 'in_review',
    adminNotes: 'रेट कार्ड और ऑडियंस इनसाइट्स डेक भेज दिया गया है। फॉलो-अप मीटिंग शेड्यूल है।',
  },
  {
    id: 'inq-103',
    name: 'अमित कुमार सक्सेना (एडवोकेट, दिल्ली उच्च न्यायालय)',
    email: 'adv.amit.saxena@jurislegal.in',
    phone: '+91 98100 55112',
    department: 'grievance',
    subject: 'आईटी नियम 2021 के तहत समाचार संख्या 401 में दिनांक व याचिकाकर्ता के नाम में तथ्यात्मक सुधार बाबत',
    message: 'आदरणीय शिकायत निवारण अधिकारी, कल प्रकाशित समाचार में केस नंबर WP(C) 1245/2026 की सुनवाई की तारीख 28 सितंबर के स्थान पर 28 अगस्त लिखी गई है। कृपया इसे संशोधित कर अपडेटेड नोट प्रकाशित करने की कृपा करें।',
    submittedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    status: 'replied',
    adminNotes: 'न्यायालय आदेश से पुष्टि उपरांत आर्टिकल में सुधार कर दिया गया है तथा शिकायतकर्ता को लिखित प्रत्युत्तर प्रेषित किया गया।',
  },
];

