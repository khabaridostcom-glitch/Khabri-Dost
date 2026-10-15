export type NewsCategory = 
  | 'all'
  | 'national'
  | 'politics'
  | 'world'
  | 'sports'
  | 'business'
  | 'tech'
  | 'entertainment'
  | 'lifestyle'
  | 'state';

export interface CategoryItem {
  id: NewsCategory;
  labelHindi: string;
  labelEnglish: string;
  icon?: string;
}

export type ReactionType = 'like' | 'love' | 'insightful' | 'funny';

export interface ArticleReactions {
  like: number;
  love: number;
  insightful: number;
  funny: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  imageUrl: string;
  imageCaption?: string;
  imageAltText?: string;
  authorName: string;
  authorEmail?: string;
  authorUid: string;
  authorRole?: string;
  authorPhotoUrl?: string;
  location: string;
  isBreaking?: boolean;
  isTopStory?: boolean;
  isPinned?: boolean;
  isEditorsPick?: boolean;
  status?: 'published' | 'draft' | 'scheduled' | 'archived';
  scheduledFor?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string;
  canonicalUrl?: string;
  urlSlug?: string;
  highlights?: string[];
  ogImage?: string;
  viewsCount: number;
  likesCount: number;
  reactions?: ArticleReactions;
  readTimeMinutes?: number;
  tags?: string[];
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  altText?: string;
  caption?: string;
  type: 'image' | 'banner' | 'infographic' | 'icon';
  category?: string;
  fileSize?: string;
  dimensions?: string;
  uploadedAt: string;
  uploadedBy?: string;
  seoSlug?: string;
  focusKeywords?: string;
  loadingStrategy?: 'lazy' | 'eager';
  aspectRatio?: string;
}

export type StaffRole =
  | 'super_admin'
  | 'editor'
  | 'sub_editor'
  | 'reporter'
  | 'contributor'
  | 'analyst'
  | 'seo_manager'
  | 'editor_in_chief'
  | 'senior_editor'
  | 'journalist'
  | 'fact_checker';

export interface StaffPermissions {
  canPublishDirectly: boolean; // Direct live publishing vs submit draft for review
  canEditAllArticles: boolean; // Edit any article vs only their own articles
  canDeleteArticles: boolean; // Can delete articles
  canAccessMediaLibrary: boolean; // Upload & manage media
  canAccessSEO: boolean; // Access to Advance SEO Optimization & Sitemap
  canAccessSettings: boolean; // Access website branding & settings
  canManageUsers: boolean; // User management access
  canManageMonetization: boolean; // Ads & banners
  allowedCategories?: NewsCategory[]; // Category restrictions (empty = all)
}

export interface EditorialUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'suspended' | 'pending';
  photoURL?: string;
  articlesCount: number;
  lastLogin?: string;
  joinedAt: string;
  bio?: string;
  assignedCategories?: NewsCategory[];
  permissions?: StaffPermissions;
  accessPin?: string;
  assignedStates?: string[];
  phone?: string;
  department?: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  slot: 'top_leaderboard' | 'in_article' | 'bottom_banner' | 'sidebar_sticky' | 'mobile_sticky';
  type: 'adsense' | 'private_sponsor' | 'affiliate';
  bannerUrl?: string;
  targetUrl?: string;
  advertiserName?: string;
  impressions: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'paused' | 'expired';
  cpmRate?: number;
}

export interface NewsComment {
  id: string;
  articleId: string;
  authorUid: string;
  authorName: string;
  authorEmail?: string;
  authorPhoto?: string;
  content: string;
  likesCount?: number;
  createdAt: string;
}

export interface NewsBookmark {
  id: string;
  userId: string;
  articleId: string;
  articleTitle: string;
  articleCategory: string;
  articleImageUrl: string;
  createdAt: string;
}

export interface NewsReadLater {
  id: string;
  userId: string;
  articleId: string;
  articleTitle: string;
  articleCategory: string;
  articleImageUrl: string;
  createdAt: string;
  estimatedReadTime?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'reader' | 'reporter' | 'editor' | 'admin';
  createdAt: string;
}

export interface VideoNewsItem {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  isLive?: boolean;
}

export interface PhotoStoryItem {
  id: string;
  title: string;
  imageUrl: string;
  photosCount: number;
  location: string;
  category: string;
  caption?: string;
  seoAltText?: string;
}

export interface TypographySettings {
  headerFont: string;
  footerFont?: string;
  headlineFont: string;
  bodyFont: string;
  metaFont: string;
  headlineWeight: number;
  bodyWeight: number;
  mobileScale: 'compact' | 'normal' | 'large';
  baseSize: 'small' | 'normal' | 'large' | 'xlarge';
  baseFontSizePx?: number;
  headingSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  titleSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  contentSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  archiveSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  metaSize?: 'sm' | 'normal' | 'large';
  headerFontSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  footerFontSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  homepageTitleSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  articleTitleSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  articleTitleDesktopPx?: number;
  articleTitleMobilePx?: number;
  articleLeadSubtitlePx?: number;
  articleBodyFontSizePx?: number;
  articleBodyLineHeight?: number;
  articleExcerptSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  metaDescriptionSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  headerLogoHeightPx?: number;
  headerTitleCustomPx?: number;
  navLinkFontSizePx?: number;
  tickerFontSizePx?: number;
  sectionHeadingPx?: number;
  heroTitlePx?: number;
  gridCardTitlePx?: number;
  gridCardExcerptPx?: number;
  cardMetaFontSizePx?: number;
  relatedHeadingSize?: 'sm' | 'normal' | 'large' | 'xlarge';
  relatedHeadingCustomPx?: number;
  relatedCategoryBadgePx?: number;
  relatedCardTitlePx?: number;
  sidebarHeadingPx?: number;
  sidebarItemTitlePx?: number;
  footerHeadingPx?: number;
  footerTextPx?: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: 'editorial' | 'grievance' | 'news_tip' | 'advertising' | 'press_release' | 'general';
  subject: string;
  message: string;
  sourceUrl?: string;
  submittedAt: string;
  status: 'new' | 'in_review' | 'replied' | 'archived';
  adminNotes?: string;
}

export interface SubscriberItem {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'vip';
  source: 'popup' | 'footer' | 'sidebar' | 'article_page' | 'manual';
  subscribedAt: string;
  tags?: string[];
  preferredCategories?: NewsCategory[];
  digestPreference?: 'daily_morning' | 'breaking_instant' | 'weekly_digest' | 'all';
  deliveryChannel?: 'email' | 'push' | 'both';
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  url?: string;
  icon?: string;
  status: 'sent' | 'scheduled' | 'draft';
  targetAudience: 'all' | 'breaking' | 'sports' | 'business';
  sentAt: string;
  clicksCount: number;
  reachCount: number;
}

export interface PortalPopupConfig {
  enabled: boolean;
  type: 'breaking_alert' | 'newsletter_subscribe' | 'special_coverage' | 'festive_greeting' | 'app_install';
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  delaySeconds: number;
  showFrequency: 'once_session' | 'every_visit';
}

export interface SpotlightLayoutSettings {
  heroSlider: {
    enabled: boolean;
    source: 'recent' | 'category' | 'manual';
    category: NewsCategory | 'all';
    selectedArticleIds: string[];
    slideIntervalSeconds: number;
    autoPlay: boolean;
    showArrows: boolean;
    showDots: boolean;
  };
  secondaryCol: {
    newsCount: number; // default 3 news as requested
    source: 'recent' | 'category' | 'manual';
    category?: NewsCategory | 'all';
    selectedArticleIds?: string[];
  };
  briefTicker: {
    enabled: boolean;
    title: string;
    showCategoryBadge: boolean; // admin option whether to show category or not
    source: 'recent' | 'category' | 'manual'; // which news or category to show
    category: NewsCategory | 'all';
    selectedArticleIds: string[];
    slideSpeed: 'slow' | 'normal' | 'fast';
    direction: 'bottom_to_top'; // niche se upar ki taraf sliding
    pauseOnHover: boolean;
    itemCount: number;
  };
}

export interface ArticleMetaSettings {
  showAuthorAvatar: boolean;
  showAuthorName: boolean;
  showAuthorRole: boolean;
  showPublishDate: boolean;
  showRelativeTime: boolean;
  showViewsCount: boolean;
  showListenButton?: boolean;
  showPdfButton?: boolean;
  showLocationBadge?: boolean;
  showLikesButton: boolean;
  showBookmarkButton: boolean;
  showNativeShare: boolean;
  showSocialIcons: boolean;
  compactSingleLine: boolean;
  platforms: {
    whatsapp: boolean;
    telegram: boolean;
    twitter: boolean;
    facebook: boolean;
    copyLink: boolean;
  };
}

export interface ArticleSidebarWidgets {
  showReadingProgressBar: boolean;
  showSidebarAd: boolean;
  showTrendingNews: boolean;
  showEditorPicks: boolean;
  showNewsletterSubscribe: boolean;
  showOpinionPoll: boolean;
  showEPaperPromo: boolean;
  showMarketGlance: boolean;
  showAuthorBio: boolean;
  showEditorialDisclaimer: boolean;
  showCommentsSection: boolean;
  showRelatedStories: boolean;
  showFollowUsChannels: boolean;
  relatedArticlesCount?: number; // 3, 4, 6 or more (admin configurable)
  sidebarSliderMode?: boolean; // Interactive slider / carousel for sidebar widgets
  // Trending Stories vertical slider options (bottom-to-top auto-sliding)
  trendingSliderEnabled?: boolean;
  trendingStoriesCount?: number; // 3, 5, 8, 10, or all
  trendingCategoryFilter?: string; // 'all' or category name
  trendingSlideSpeed?: number; // ms speed
  pollQuestion?: string;
  pollOptionA?: string;
  pollOptionB?: string;
  pollOptionC?: string;
  pollOptionD?: string;
  // Extended Modular Sidebar Widgets (Gold Rate, Rashifal, Quotes, etc.)
  showGoldRate?: boolean;
  goldRateWidgetTitle?: string; // Customizable title e.g. 'सोने-चांदी का भाव'
  goldRateCity?: string; // e.g. 'दिल्ली (Delhi)', 'मुंबई', 'लखनऊ', 'जयपुर'
  goldRate24k?: number; // per 10g in Rs
  goldRate22k?: number; // per 10g in Rs
  silverRate1kg?: number; // per 1kg in Rs
  goldRateUpdateDate?: string;
  showRashifal?: boolean;
  rashifalWidgetTitle?: string; // Customizable title e.g. 'दैनिक राशिफल'
  rashifalAutoUpdate?: boolean; // Auto daily calculation/simulation or manual
  rashifalDate?: string;
  customRashifalList?: Array<{
    id: string;
    sign: string; // e.g. 'मेष (Aries)'
    symbol: string; // e.g. '♈'
    ruler: string; // e.g. 'मंगल'
    prediction: string;
    luckyNumber: number;
    luckyColor: string;
  }>;
}

export interface AdSlotBreakpointSize {
  maxWidth?: number; // e.g. 640 (Mobile), 1024 (Tablet), undefined (Desktop)
  minHeightPx?: number; // e.g. 60, 90, 140, 250
  maxHeightPx?: number; // e.g. 100, 160, 320
  aspectRatio?: string; // e.g. '300/250', '320/100', '728/90', 'auto'
  hideOnBreakpoint?: boolean; // optionally hide banner on this screen size
}

export interface AdResponsiveBreakpoints {
  mobile: AdSlotBreakpointSize; // < 640px
  tablet: AdSlotBreakpointSize; // 640px - 1024px
  desktop: AdSlotBreakpointSize; // >= 1024px
  enableCustomBreakpoints?: boolean;
}

export interface SidebarAdSlotConfig {
  enabled: boolean;
  adType: 'private' | 'adsense';
  bannerUrl?: string;
  bannerLink?: string;
  bannerTitle?: string;
  altText?: string;
  adSlotId?: string;
  breakpoints?: AdResponsiveBreakpoints;
}

export interface SidebarAdsConfig {
  topSlot: SidebarAdSlotConfig;
  middleSlot: SidebarAdSlotConfig;
  bottomSlot: SidebarAdSlotConfig;
  globalBreakpoints?: AdResponsiveBreakpoints;
}

export interface CitizenNewsSubmission {
  id: string;
  title: string;
  category: NewsCategory | string;
  location: string;
  incidentDate: string;
  description: string;
  images: string[];
  videoUrl?: string;
  senderName: string;
  senderPhone?: string;
  senderEmail?: string;
  isAnonymous: boolean;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'published';
}

export interface CustomSocialChannel {
  id: string;
  platform: string; // e.g. 'Threads', 'LinkedIn', 'Koo', 'Dailyhunt'
  url: string;
  enabled: boolean;
}

export interface HeaderFooterSettings {
  siteTitle: string;
  siteTagline: string;
  logoUrl?: string;
  headerLogoHeight?: number; // Custom height in px (e.g. 36px to 90px)
  headerTitleCustomPx?: number; // Custom font size for siteTitle text in px
  showSiteTitleText?: boolean; // Whether to display site title text alongside/below logo
  footerLogoUrl?: string; // Dedicated logo URL for footer
  faviconUrl?: string;
  contactEmail: string;
  contactAddress: string;
  contactPhone?: string;
  rniNumber: string;
  showRniNumber?: boolean;
  footerTheme?: 'dark_red' | 'light' | 'dark_slate';
  // Comprehensive footer custom settings
  footerAboutHeading?: string;
  footerAboutText?: string;
  footerBrandingPartnerName?: string;
  footerBrandingPartnerUrl?: string;
  footerBottomName?: string;
  // WhatsApp News Bulletin Channel
  whatsappNewsBulletinUrl?: string;
  whatsappNewsBulletinText?: string;
  // Header element toggles
  headerShowLiveTv?: boolean;
  headerShowEPaper?: boolean;
  headerShowBookmarks?: boolean;
  headerShowNewsTicker?: boolean;
  headerShowMegaMenu?: boolean;
  headerShowSearch?: boolean;
  headerShowAdminButton?: boolean;
  headerShowLiveCoverage?: boolean;
  socialLinks: {
    whatsappChannel: string;
    telegramChannel: string;
    facebook: string;
    twitter: string;
    youtube: string;
    instagram?: string;
  };
  customSocialChannels?: CustomSocialChannel[];
  // Desktop & mobile navigation category ordering and enable/disable
  navCategoryOrder?: string[]; // IDs of categories in custom sequence
  categoryOrder?: string[]; // Alias for navCategoryOrder
  disabledCategories?: string[]; // IDs of hidden categories
  customCategoryLabels?: Record<string, string>; // ID -> custom heading label
  // States sequence & enable/disable
  customStates?: string[]; // list of states in sequence
  disabledStates?: string[]; // hidden states
  legalPolicies?: {
    factCheckPolicy: string;
    editorialEthics: string;
    grievanceRedressal: string;
    privacyPolicy: string;
    termsOfService: string;
    disclaimer?: string;
    correctionPolicy?: string;
    dmcaNotice?: string;
  };
}

export interface HomepageSectionsConfig {
  heroSlider: boolean;
  liveVideoBulletin: boolean; // digital studio / live video bulletin hide/enable
  liveFeedCoverage: boolean; // homepage live news updates card/strip
  headerLiveFeedLink: boolean; // header menu 'Live Coverage' link
  briefsTicker: boolean;
  trendingTopics: boolean;
  webStories: boolean;
  photoGallery: boolean;
  categoryBlocks: boolean;
}

export interface GoogleServicesConfig {
  googleAnalyticsId: string; // e.g. G-XXXXXXXXXX
  searchConsoleVerification: string; // e.g. google-site-verification=...
  googleTagManagerId: string; // e.g. GTM-XXXXXXX
  adsenseClientId: string; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  adsenseAutoAds: boolean;
  adsenseStatus?: 'active' | 'pending' | 'disabled';
}

export interface SpeedAndWebVitalsConfig {
  enableLazyLoading: boolean;
  enableWebpOptimization: boolean;
  enableDnsPrefetch: boolean;
  enableScriptDeferral: boolean;
  targetLcpMs: number; // Largest Contentful Paint target
  targetFidMs: number; // First Input Delay target
  targetCls: number; // Cumulative Layout Shift target
  currentScore: number;
}

export interface AdvancedSeoConfig {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultFocusKeywords: string;
  canonicalDomain: string;
  newsOrganizationSchema: boolean;
  newsArticleSchema: boolean;
  breadcrumbSchema: boolean;
  robotsDirectives?: string;
  brokenLinkCheck?: {
    totalChecked: number;
    brokenCount: number;
    lastAuditTime: string;
    status: 'healthy' | 'warnings' | 'error';
  };
}

export interface MobileSettingsConfig {
  mobileScale: 'compact' | 'normal' | 'large';
  stickyMobileBottomNav: boolean;
  mobileImageQuality: 'high' | 'balanced' | 'data_saver';
  touchFriendlyPadding: boolean;
}

export interface ApiConfiguration {
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  googleTrendsApiKey?: string;
  activeAiProvider: 'gemini' | 'openai' | 'anthropic';
  googleTrendsRegion: string;
  googleTrendsLanguage: string;
  googleTrendsAutoRefresh: boolean;
  googleTrendsRefreshIntervalMinutes?: number;
}

export interface AiSeoConfig {
  apiKey?: string;
  provider?: 'gemini' | 'openai';
  model?: string;
  modelName?: string;
  defaultLanguage?: string;
  defaultTone?: string;
  autoExtractKeywords?: boolean;
  autoKeywordsEnabled?: boolean;
  autoGenerateSlug?: boolean;
  autoSlugEnabled?: boolean;
}

export interface GoogleTrendsConfig {
  region?: string;
  category?: string;
  provider?: string;
  rssFeedUrl?: string;
  autoSync?: boolean;
  refreshIntervalMinutes?: number;
  lastFetchedAt?: string;
  customKeywords?: string[];
  apiKey?: string;
}

export interface PortalSettings {
  apiConfig?: ApiConfiguration;
  headerFooter?: HeaderFooterSettings;
  homepageSections?: HomepageSectionsConfig;
  googleServices?: GoogleServicesConfig;
  speedAndWebVitals?: SpeedAndWebVitalsConfig;
  advancedSeoSettings?: AdvancedSeoConfig;
  mobileSettings?: MobileSettingsConfig;
  tickerSpeed: 'ultra_slow' | 'slow' | 'normal' | 'fast' | 'paused' | 'custom';
  tickerSpeedSeconds?: number;
  liveVideoSectionEnabled?: boolean;
  liveVideoYoutubeId?: string;
  liveVideoTitle?: string;
  liveFeedCoverageEnabled?: boolean; // controls homepage strip
  headerLiveFeedLinkEnabled?: boolean; // controls header menu link
  trendingTopics: string[];
  pinnedTrendingArticleIds?: string[];
  spotlightLayout?: SpotlightLayoutSettings;
  displayOptions: {
    showExcerptOnMobile: boolean;
    showAuthor: boolean;
    showDate: boolean;
    showViews: boolean;
    showLocation: boolean;
    cardStyle: 'compact' | 'standard';
  };
  articleMetaSettings?: ArticleMetaSettings;
  sidebarWidgets?: ArticleSidebarWidgets;
  typography: TypographySettings;
  sharePlatforms: {
    whatsapp: boolean;
    telegram: boolean;
    twitter: boolean;
    facebook: boolean;
    copyLink: boolean;
    googleNews: boolean;
  };
  adSettings: {
    showTopAd: boolean;
    showMidContentAd: boolean;
    showBottomAd: boolean;
    showSidebarAd: boolean;
    showMobileStickyAd?: boolean;
    topAdType: 'adsense' | 'private';
    sidebarAdType: 'adsense' | 'private';
    adsenseClientId?: string;
    topAdSlotId?: string;
    midAdSlotId?: string;
    sidebarAdSlotId?: string;
    bottomAdSlotId?: string;
    privateBannerUrl?: string;
    privateBannerLink?: string;
    privateBannerTitle?: string;
    advertiserName?: string;
    campaignExpiry?: string;
    customScriptOrHtml?: string;
    responsiveBreakpoints?: {
      leaderboard?: AdResponsiveBreakpoints;
      inContent?: AdResponsiveBreakpoints;
      sidebar?: AdResponsiveBreakpoints;
      bottom?: AdResponsiveBreakpoints;
    };
  };
  customPhotoStories?: PhotoStoryItem[];
  sidebarAdsConfig?: SidebarAdsConfig;
  popupConfig?: PortalPopupConfig;
  mobileSidebarMenu?: MobileSidebarMenuConfig;
  epaperSettings?: EPaperSettings;
}

export interface EPaperSettings {
  mode: 'dynamic' | 'custom_pdf'; // 'dynamic' auto-generated from portal news OR 'custom_pdf' uploaded edition
  customPdfUrl?: string; // Direct URL to uploaded daily PDF
  customPdfTitle?: string; // e.g. 'खबरी दोस्त दैनिक समाचार पत्र'
  customPdfEdition?: string; // e.g. 'राष्ट्रीय संस्करण (नई दिल्ली)'
  customPdfDate?: string; // publication date
  customPdfThumbnail?: string; // attractive front page cover thumbnail
  customPdfPageCount?: number; // total pages e.g. 8 or 12
  featuredHeadline?: string; // front-page banner headline
  allowDownload?: boolean; // allow reader PDF download
  allowShare?: boolean; // allow social sharing
}

export interface MobileSidebarCustomLink {
  id: string;
  labelHindi: string;
  labelEnglish: string;
  linkType: 'category' | 'page' | 'external';
  target: string;
  icon?: string;
  enabled: boolean;
}

export interface MobileSidebarMenuConfig {
  showLogo?: boolean;
  showSiteTitle?: boolean;
  showEPaperButton?: boolean;
  showSubmitNewsButton?: boolean;
  showCategories?: boolean;
  showOfficialChannels?: boolean;
  showWhatsAppButton?: boolean;
  showTelegramButton?: boolean;
  showSocialMediaIcons?: boolean;
  showSubscriberCard?: boolean;
  fontSize?: 'sm' | 'normal' | 'large';
  fontFamily?: string;
  customLinks?: MobileSidebarCustomLink[];
}

export interface LiveNewsUpdate {
  id: string;
  timestamp: string; // e.g. '11:15 AM'
  title: string;
  content: string;
  authorName?: string;
  imageUrl?: string;
  isImportant?: boolean;
  tag?: string; // e.g. 'संसद', 'बड़ा बयान', 'अपडेट'
  createdAt: string;
}

export interface LiveBlogEvent {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  isLive: boolean;
  startedAt: string;
  lastUpdatedAt: string;
  coverImage: string;
  keyHighlights: string[];
  updates: LiveNewsUpdate[];
}
