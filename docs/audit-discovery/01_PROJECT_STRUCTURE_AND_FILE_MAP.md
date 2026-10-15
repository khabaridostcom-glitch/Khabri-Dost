# 01 — Project Structure & Comprehensive File Map
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Granular inventory of all active source files, structural dependencies, and component responsibilities.

---

## 1. Directory Hierarchy

```
.
├── server.ts                               # Full-Stack Express Server (Port 3000)
├── index.html                              # HTML entry point, font CDNs, PWA tags
├── package.json                            # Node package manifest & scripts
├── tsconfig.json & tsconfig.node.json       # TypeScript compiler options
├── vite.config.ts                          # Vite build tool configuration
├── firestore.rules                         # Cloud Firestore RBAC & security rules
├── firebase-applet-config.json             # Firebase project provisioning credentials
├── metadata.json                           # Applet title, permissions, capabilities
├── docs/                                   # Architectural & discovery documentation
│   ├── audit-discovery/                    # Fresh audit files (current discovery)
│   └── *.md                                # Prior reference documentation
├── src/
│   ├── main.tsx                            # React 19 DOM bootstrap
│   ├── App.tsx                             # Master App orchestrator (2,546 lines)
│   ├── index.css                           # Tailwind v4 directives & root variables
│   ├── firebase.ts                         # Firebase SDK initialization & error handler
│   ├── types/
│   │   └── news.ts                         # Universal TypeScript interfaces (755 lines)
│   ├── data/
│   │   ├── portalDefaults.ts               # Default settings, typography & mock models
│   │   ├── seedNews.ts                     # Pre-populated Hindi news articles
│   │   └── rashifalData.ts                 # Astrological rashifal data
│   ├── context/
│   │   └── AuthContext.tsx                 # Firebase Auth context & user state provider
│   ├── services/
│   │   └── newsService.ts                  # Firestore CRUD & real-time sync (1,098 lines)
│   ├── utils/
│   │   ├── cssDefaults.ts                  # Root CSS variable reset definitions
│   │   ├── pdfGenerator.ts                 # Client-side PDF generation utility
│   │   ├── aiSeoGenerator.ts               # Fallback algorithmic SEO generator
│   │   ├── sudokuGenerator.ts              # Interactive Sudoku puzzle generator
│   │   ├── articleContentParser.tsx        # HTML/Markdown sanitizer & renderer
│   │   ├── hindiHelpers.ts                 # Devanagari date formatters & reading time
│   │   ├── imageCompressor.ts              # HTML5 canvas WebP image compression
│   │   ├── articleHighlights.ts            # Key takeaways extractor
│   │   └── useGoogleServices.ts            # GA4, GTM & AdSense script injector hook
│   └── components/
│       ├── Header.tsx                      # Main public header & navigation
│       ├── Footer.tsx                      # Multi-column footer & legal links
│       ├── ArticlePageView.tsx             # Full single news article page (2,137 lines)
│       ├── ArticleCard.tsx                 # Modular grid/list card component
│       ├── ArticleDetailModal.tsx          # Quick popup modal for reading articles
│       ├── SpotlightHeroSlider.tsx         # Homepage top stories slider
│       ├── SpotlightBriefTicker.tsx        # Animated breaking news ticker
│       ├── LiveFeedPageView.tsx            # Full live breaking news feed view
│       ├── LiveBlogReaderModal.tsx         # Real-time event reader modal
│       ├── SubmitNewsPageView.tsx          # Citizen journalism news submission desk
│       ├── ContactUsPageView.tsx           # Contact form & grievance details
│       ├── AboutUsPageView.tsx             # Editorial mission & staff credentials
│       ├── LegalPolicyPageView.tsx         # Privacy Policy & Terms page
│       ├── LegalPolicyModal.tsx            # Policy terms modal view
│       ├── ArchivePageView.tsx             # Date & category filterable archive
│       ├── VideoSection.tsx                # Video bulletins & reels grid
│       ├── PhotoGallerySection.tsx         # Full-width photo stories gallery
│       ├── AudioNewsPlayer.tsx             # Text-to-speech audio reader widget
│       ├── AdBanner.tsx                    # Responsive advertisement banner component
│       ├── PortalPopup.tsx                 # Urgent alert / subscription modal popup
│       ├── BookmarksModal.tsx              # Saved articles viewer
│       ├── ReadLaterModal.tsx              # Read-later drawer viewer
│       ├── EPaperModal.tsx                 # PDF digital e-paper viewer
│       ├── ArticleEPaperClippingModal.tsx  # Article-to-clipping generator modal
│       ├── ArticleKeyHighlights.tsx        # 3-bullet key summary widget
│       ├── OpinionPollWidget.tsx           # Interactive reader opinion poll
│       ├── NotificationToast.tsx           # Toast notification banner
│       ├── StaffLoginModal.tsx             # Editorial staff login modal
│       ├── SubscriberPreferencesModal.tsx  # Newsletter preferences modal
│       ├── TypographyCustomizerModal.tsx   # Live typography adjustment modal
│       ├── AdminFrontendCustomizerBar.tsx  # Floating frontend customizer bar
│       ├── AdminBackendPanel.tsx           # Comprehensive WordPress-style Admin CMS (3,085 lines)
│       ├── PublisherCMS.tsx                # Alternate standalone CMS modal (1,665 lines)
│       ├── AdminSettingsModal.tsx          # Alternate appearance settings modal (1,720 lines)
│       ├── RichPostEditorModal.tsx         # Standalone rich text post editor modal
│       ├── MediaManagerModal.tsx           # Media asset manager modal
│       ├── widgets/
│       │   ├── SudokuGameWidget.tsx        # Daily interactive Hindi Sudoku widget
│       │   ├── GoldRateWidget.tsx          # Daily commodities & gold rate widget
│       │   └── RashifalWidget.tsx          # Daily astrological horoscope widget
│       └── admin/                          # Granular Admin Studio Tabs
│           ├── TypographySettingsTab.tsx   # Global font & heading size controls
│           ├── ArticleWidgetsSettingsTab.tsx # Widgets toggle & order controls
│           ├── ArticleMetaSettingsTab.tsx  # Article layout & meta configuration
│           ├── MediaLibraryTab.tsx         # Image gallery & WebP asset manager
│           ├── AdvertisementTab.tsx        # AdSense & banner slot manager
│           ├── SidebarAdConfigTab.tsx      # Sidebar ad positioning controls
│           ├── AdBreakpointEditor.tsx      # Responsive ad dimensions editor
│           ├── LiveNewsManagerTab.tsx      # Real-time event management
│           ├── EPaperSettingsTab.tsx       # Digital PDF edition manager
│           ├── GoogleSuiteSettingsTab.tsx  # GA4, GTM & Search Console tokens
│           ├── GoogleTrendsTab.tsx         # Real-time trending keywords tracker
│           ├── LiveTrendingKeywordsWidget.tsx # Trending ticker widget
│           ├── SEOAuditTab.tsx             # Technical SEO health & XML generator
│           ├── BulkSeoMetaEditor.tsx       # Batch SEO meta modifier
│           ├── BulkArticleManager.tsx      # Multi-article batch actions
│           ├── AiSeoAssistantTab.tsx       # AI article generation workspace
│           ├── AiSeoAssistantModule.tsx    # AI SEO assistance card
│           ├── AiSeoAssistantModal.tsx     # AI prompt modal dialog
│           ├── AiSeoMetaGenerator.tsx      # AI meta title/description generator
│           ├── HomepageSectionsSettingsTab.tsx # Section order & visibility editor
│           ├── SpotlightSettingsTab.tsx    # Hero slider story selection
│           ├── HeaderFooterSettingsTab.tsx # Header & footer text customizer
│           ├── MobileSidebarSettingsTab.tsx # Mobile drawer menu customizer
│           ├── UserManagementTab.tsx       # Editorial user roles & staff
│           ├── AdminManagementTab.tsx      # Super admin access credentials
│           ├── SpeedWebVitalsTab.tsx       # Performance & Core Web Vitals monitor
│           ├── ContactInquiriesTab.tsx     # Reader contact submissions inbox
│           ├── CitizenSubmissionsTab.tsx   # Citizen journalism submissions desk
│           └── ApiConfigTab.tsx            # Cloud API keys & credentials manager
```

---

## 2. Granular Inventory of Important Files

### 2.1 Core Infrastructure & Entry Points

#### `/server.ts`
- **Purpose:** Full-stack Express HTTP/HTTPS backend running on port 3000. Serves static production assets, provides security hardening, SSR bot meta injection, rate limiting, and AI proxies.
- **Key Functions/Variables:** `apiRateLimiter`, `sanitizeString`, `generateFallbackSeo`, `app.post('/api/ai/draft-article-seo')`, `app.get('/sitemap.xml')`.
- **Connected Modules:** Browser clients, search crawlers (Googlebot, Facebook, Twitter, WhatsApp), Vite development middleware.
- **Features Controlled:** Port binding (3000), HTTP security headers, XML sitemap generation, AI content proxies, citizen news staging.
- **Status:** **Actively Used (Core Backend)**.
- **Audit Focus:** Verify caching strategy on Firestore reads; investigate absence of `/news-sitemap.xml` and `/rss.xml` routes.

#### `/src/main.tsx`
- **Purpose:** Client-side React 19 entry point.
- **Key Functions:** `ReactDOM.createRoot().render(<React.StrictMode><App /></React.StrictMode>)`.
- **Status:** **Actively Used**.
- **Audit Focus:** Standard clean mounting point.

#### `/src/App.tsx` (2,546 lines)
- **Purpose:** Central coordinator of the entire portal. Holds global state for articles, portal settings, current routed views, user authentication status, and active modals.
- **Key Functions:** `handleSelectArticle`, `handleCategorySelect`, `handleSaveSettings`, `handleResetTypography`, `handleOpenAdmin`, `handleSaveArticle`.
- **Connected Modules:** Connects almost all public and admin components.
- **Features Controlled:** View routing (`home`, `article`, `live-feed`, `contact`, `about`, `legal`, `submit-news`, `archive`), history pushState synchronization, Firestore subscription triggers.
- **Status:** **Actively Used (Core Orchestrator)**.
- **Audit Focus:** Needs architectural decomposition into specialized hooks (`useArticles`, `usePortalSettings`, `useRouting`) to reduce cognitive load and file size.

#### `/src/types/news.ts` (755 lines)
- **Purpose:** Universal TypeScript data models and interfaces.
- **Key Interfaces:** `NewsArticle`, `PortalSettings`, `TypographySettings`, `CategoryItem`, `MediaAsset`, `StaffRole`, `StaffPermissions`, `LiveBlogEvent`, `CitizenNewsSubmission`.
- **Status:** **Actively Used**.
- **Audit Focus:** Ensure data contracts precisely match Firestore document field names.

---

### 2.2 Public Frontend Views & Components

#### `/src/components/ArticlePageView.tsx` (2,137 lines)
- **Purpose:** Single news article page. Renders H1 headline, author byline, publication timestamp, reading time, featured media, rich HTML body, social sharing buttons, text-to-speech player, related stories, and in-article ad slots.
- **Key Functions:** Direct inline title editing for admins, reaction tallying, comment submission, clipping generation.
- **Controlled Elements:** Article H1 size (`portalSettings.typography?.articleTitleDesktopPx`), inline ads, TTS reader.
- **Status:** **Actively Used**.
- **Audit Focus:** Resolving the specificity clash between the inline `fontSize` style and `font-kd-headline` in `index.css`; responsive mobile headline clamping.

#### `/src/components/Header.tsx`
- **Purpose:** Main top navigation bar. Displays date, live clock, breaking news marquee ticker, category tabs, search input, live feed button, e-paper button, font-size scaler (A- / A+), and admin portal trigger.
- **Status:** **Actively Used**.
- **Audit Focus:** Sticky navigation performance and mobile menu drawer rendering.

#### `/src/components/Footer.tsx`
- **Purpose:** Multi-column footer. Displays editorial disclaimer, grievance officer contact, category directory, copyright notice, legal page links, and admin login gateway.
- **Status:** **Actively Used**.

#### `/src/components/ArticleCard.tsx`
- **Purpose:** Reusable news article card. Supports grid layout, compact list layout, trending card layout, and video badge indicators.
- **Status:** **Actively Used**.

#### `/src/components/LiveFeedPageView.tsx` & `/src/components/LiveBlogReaderModal.tsx`
- **Purpose:** Live breaking news coverage feed with auto-polling and chronological time-stamped cards.
- **Status:** **Actively Used**.

#### `/src/components/EPaperModal.tsx` & `/src/components/ArticleEPaperClippingModal.tsx`
- **Purpose:** Interactive digital e-paper viewing, edition date selection, and article screenshot/clipping generator.
- **Status:** **Actively Used**.

#### `/src/components/SubmitNewsPageView.tsx`
- **Purpose:** Citizen journalism intake portal allowing readers to submit news leads, photos, and location details for editorial review.
- **Status:** **Actively Used**.

---

### 2.3 Administrative & CMS Management Panels

#### `/src/components/AdminBackendPanel.tsx` (3,085 lines)
- **Purpose:** Comprehensive WordPress-style admin panel featuring a fixed 260px sidebar and 32 modular administrative tabs grouped into 5 categories (`dashboard`, `news`, `media`, `appearance`, `settings`).
- **Status:** **Actively Used (Primary CMS Engine)**.
- **Audit Focus:** Transitioning bilingual labels to clean English; replacing dark gradient containers with standard light-mode styling.

#### `/src/components/PublisherCMS.tsx` (1,665 lines)
- **Purpose:** Standalone alternate publishing modal with rich text formatting, AI prompts, and category pickers.
- **Status:** **DUPLICATIVE / OVERCOMPLICATED**.
- **Audit Focus:** Duplicates capabilities already present in `AdminBackendPanel.tsx` (`new_article` tab). Recommend consolidating into `AdminBackendPanel.tsx` to eliminate redundant code.

#### `/src/components/AdminSettingsModal.tsx` (1,720 lines)
- **Purpose:** Tabbed modal for appearance, typography, and site configuration.
- **Status:** **DUPLICATIVE / OVERCOMPLICATED**.
- **Audit Focus:** Overlaps directly with settings tabs in `AdminBackendPanel.tsx`. Recommend retirement after consolidating into the primary admin panel.

#### `/src/components/AdminFrontendCustomizerBar.tsx`
- **Purpose:** Floating bottom customizer bar allowing live inline font and layout adjustments directly on the public page.
- **Status:** **UNCERTAIN / OVERBUILD**.
- **Audit Focus:** Can cause state synchronization confusion with the main admin settings panel.

---

### 2.4 Services, Data & Utilities

#### `/src/services/newsService.ts` (1,098 lines)
- **Purpose:** Complete Firestore client service layer. Implements CRUD for `articles`, `settings` (`portal_config`), `comments`, `bookmarks`, `read_laters`, `inquiries`, `media`, and `live_blogs`.
- **Key Functions:** `fetchArticles`, `subscribeToArticles`, `publishArticle`, `updateArticle`, `deleteArticle`, `fetchPortalSettings`, `savePortalSettings`.
- **Status:** **Actively Used (Core Data Service)**.
- **Audit Focus:** Ensure error handling gracefully catches permission-denied errors without breaking offline fallback.

#### `/src/utils/cssDefaults.ts`
- **Purpose:** Holds `INDEX_CSS_ROOT_VARIABLES` and `resetRootCssVariablesToDefault()` to restore CSS custom properties on `:root`.
- **Status:** **Actively Used (Conflicting with React State)**.
- **Audit Focus:** Resetting CSS variables on `:root` does not automatically update React state in `portalSettings.typography`, creating a desynchronization gap.

#### `/src/utils/useGoogleServices.ts`
- **Purpose:** React hook dynamically injecting Google Analytics 4 (`gtag.js`), Google Tag Manager (`gtm.js`), and Google AdSense (`adsbygoogle.js`) based on keys in `portalSettings.seo`.
- **Status:** **Actively Used**.
- **Audit Focus:** Verify script injection handles re-renders cleanly without inserting duplicate DOM script tags.
