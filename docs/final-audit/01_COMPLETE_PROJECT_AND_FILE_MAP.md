# KHABRI DOST — FINAL MASTER AUDIT & QUALITY ASSURANCE REPORT
## 01. Complete Project & File Map

### 1. Technology Stack Architecture

- **Runtime Environment:** Node.js v22.23.4 (Linux x86_64 container)
- **Frontend Framework:** React 19.0.1 (Single Page Application architecture)
- **Build Tool:** Vite 8.3.0 with `@vitejs/plugin-react` and `@tailwindcss/vite` (Tailwind CSS v4.3.3)
- **Backend / API Server:** Express 4.21.2 mounted with Vite dev middleware (`server.ts`)
- **Database & Auth:** Firebase Firestore (Database ID: `ai-studio-595d1ed9-f621-49b9-8c06-e20c04392313`), Firebase Authentication v12.19.0
- **AI Integration:** `@google/genai` v2.4.0 (Gemini 3.8 Flash model for automated SEO metadata & articles)
- **Document / Media Utilities:** `jspdf` v4.2.1, `pdfjs-dist` v6.4.299, `html2canvas-pro` v2.5.2, `lucide-react` v0.546.0

---

### 2. Comprehensive Directory & Component Inventory

```
/
├── index.html                    # Single entry HTML with SEO meta tags, color-scheme: light, JSON-LD schema
├── metadata.json                 # AI Studio applet configuration & capabilities
├── package.json                  # Dependencies, devDependencies, and run scripts
├── tsconfig.json                 # TypeScript strict compiler configuration
├── vite.config.ts                # Vite plugins, aliases, and server configuration
├── server.ts                     # Express server, API proxy, AI endpoints, sitemaps, RSS, rate limiting
├── firestore.rules               # Server-side Firebase security rules with RBAC validation
├── firebase-applet-config.json   # Provisioned Firebase client credentials
├── firebase-blueprint.json       # Intermediate schema definition
├── docs/                         # Audit reports and technical documentation
│   └── final-audit/              # Final master audit suite (00 through 12)
└── src/
    ├── main.tsx                  # React DOM client entry point with StrictMode
    ├── App.tsx                   # Primary application controller, routing, touch gestures & view manager
    ├── index.css                 # Master CSS file with Tailwind CSS v4, Noto Sans typography tokens
    ├── firebase.ts               # Firebase SDK initialization, auth helpers & Firestore error handlers
    │
    ├── context/
    │   └── AuthContext.tsx       # Auth provider, role resolver (reader, reporter, editor, admin, super_admin)
    │
    ├── hooks/
    │   └── useNewsPortalData.ts  # Master hook for Firestore listeners, real-time sync, offline fallback
    │
    ├── services/
    │   └── newsService.ts        # Article CRUD, reactions, settings, media, subscribers & inquiries
    │
    ├── types/
    │   ├── news.ts               # Master TypeScript interfaces (NewsArticle, PortalSettings, Typography, etc.)
    │   ├── epaper.ts             # E-paper edition, page clipping and PDF viewer types
    │   └── pdfjs.d.ts            # Type declarations for PDF rendering engine
    │
    ├── data/
    │   ├── portalDefaults.ts     # System default configurations, initial spotlight layout, typography tokens
    │   ├── seedNews.ts           # Curated seed news stories, state lists, category mappings
    │   └── rashifalData.ts       # Daily zodiac (Rashifal) astrology readings in Hindi
    │
    ├── utils/
    │   ├── aiSeoGenerator.ts      # Client-side AI SEO generation helper
    │   ├── articleContentParser.tsx # Semantic HTML and rich embed parser (YouTube, quotes, callouts)
    │   ├── articleHighlights.ts   # Automated 3-bullet takeaway generator
    │   ├── cssDefaults.ts         # Global CSS variable reset functions
    │   ├── epaperEngine.ts        # PDF to canvas rendering and clipping engine
    │   ├── headlineHelper.tsx     # Hindi headline styling and badge helpers
    │   ├── hindiHelpers.ts        # Devanagari numerals, time-ago formatting, date utilities
    │   ├── imageCompressor.ts     # Client-side canvas image compression (<300KB web-friendly)
    │   ├── pdfGenerator.ts        # E-paper clipping export to PDF/PNG
    │   ├── sudokuGenerator.ts     # 9x9 daily newspaper sudoku puzzle generator
    │   └── useGoogleServices.ts   # GA4, GTM, AdSense, and Search Console script injector
    │
    └── components/
        ├── Header.tsx             # Responsive header with branding, weather, ticker, language selector
        ├── Footer.tsx             # Light theme footer with quick links, RNI badge, sticky bottom ad
        ├── PublisherCMS.tsx       # Complete newsroom publisher modal with AI, preview & scheduling
        ├── AdminBackendPanel.tsx  # Master admin dashboard with 15 module tabs
        ├── AdminFrontendCustomizerBar.tsx # Floating editorial customizer bar for staff
        ├── ArticlePageView.tsx    # Single article full page view with related news, audio & widgets
        ├── ArticleDetailModal.tsx # Quick-read article preview modal
        ├── ArticleKeyHighlights.tsx # Key takeaways bullet point card for Google Discover
        ├── AudioNewsPlayer.tsx    # Text-to-speech audio reader in natural Hindi
        ├── LiveFeedPageView.tsx   # Real-time breaking news feed with auto-refresh
        ├── LiveBlogReaderModal.tsx # Interactive live blog timeline viewer
        ├── EPaperPageView.tsx     # Full-page newspaper edition reader
        ├── EPaperReader.tsx       # Multi-page newspaper PDF reader with zoom, clip & download
        ├── VideoSection.tsx       # Video news gallery with embedded YouTube player
        ├── PhotoGallerySection.tsx # High-resolution photo stories and image galleries
        ├── SpotlightSection.tsx   # 3-column homepage spotlight (slider, stack, sliding ticker)
        ├── TrendingSection.tsx    # Trending topics and viral story cards
        ├── AdBanner.tsx           # Configurable responsive advertising banner slot
        ├── AdSlot.tsx             # Breakpoint-aware in-article ad injector
        ├── StaffLoginModal.tsx    # Security-hardened admin/staff login modal
        ├── DailySudokuModal.tsx   # Interactive daily newspaper 9x9 Sudoku game
        ├── BookmarksModal.tsx     # Reader saved articles modal
        ├── ReadLaterModal.tsx     # Reader offline reading queue
        ├── NotificationToast.tsx  # Real-time push notification toaster
        ├── PortalPopup.tsx        # Timed promotional pop-up modal
        ├── ContactUsPageView.tsx  # Contact bureau and inquiry submission form
        ├── AboutUsPageView.tsx    # Editorial board, mission and ethics page
        ├── SubmitNewsPageView.tsx # Citizen journalist news submission portal
        ├── LegalPolicyPageView.tsx # Grievance redressal, privacy, terms, and ethics policies
        ├── ArchivePageView.tsx    # Historical news archive and date-picker browser
        │
        ├── admin/                 # 35 Admin and CMS Studio Tabs
        │   ├── WordPressVisualEditor.tsx # Dual visual/code rich text editor with Noto Sans support
        │   ├── AiSeoMetaGenerator.tsx    # Automated Gemini SEO metadata generator
        │   ├── AiSeoAssistantModal.tsx   # Press note to article converter
        │   ├── AiSeoAssistantModule.tsx  # Smart newsroom AI assistant
        │   ├── AiSeoAssistantTab.tsx     # AI engine settings & provider selection
        │   ├── GoogleTrendsTab.tsx       # Real-time Google Trends radar & writer
        │   ├── GoogleSuiteSettingsTab.tsx # GA4, GTM, Search Console & AdSense settings
        │   ├── HeaderFooterSettingsTab.tsx # Header branding, nav ordering, footer settings
        │   ├── TypographySettingsTab.tsx # 18-section global typography customizer
        │   ├── SpeedWebVitalsTab.tsx     # Core Web Vitals monitoring and caching toggles
        │   ├── EPaperSettingsTab.tsx     # Newspaper PDF upload and edition manager
        │   ├── LiveNewsManagerTab.tsx    # Live coverage blog event manager
        │   ├── MediaLibraryTab.tsx       # Digital asset manager (DAM) with image uploads
        │   ├── SEOAuditTab.tsx           # Live sitemap, robots.txt, and metadata inspector
        │   ├── ScheduledPipelineCalendarTab.tsx # Editorial publishing schedule calendar
        │   ├── CitizenSubmissionsTab.tsx # Citizen reporter verification desk
        │   ├── ContactInquiriesTab.tsx   # Reader message and grievance inbox
        │   ├── UserManagementTab.tsx     # Staff roles, reporters, and editor management
        │   ├── DatabaseBackupRestoreTab.tsx # JSON data backup and restore manager
        │   ├── BulkArticleManager.tsx    # Multi-article batch status updater
        │   ├── BulkSeoMetaEditor.tsx     # Batch SEO meta title and slug editor
        │   ├── MobileFooterBarTab.tsx    # Mobile sticky floating ad & share bar customizer
        │   ├── MobileSidebarSettingsTab.tsx # Mobile drawer menu customizer
        │   ├── SidebarAdConfigTab.tsx    # Desktop sidebar advertising slot manager
        │   ├── ArticleMetaSettingsTab.tsx # Single article layout & schema controls
        │   ├── ArticleWidgetsSettingsTab.tsx # Interactive sidebar widget toggles
        │   ├── HomepageSectionsSettingsTab.tsx # Homepage layout & section toggles
        │   ├── SpotlightSettingsTab.tsx  # Spotlight carousel and ticker customizer
        │   ├── VideoManagerTab.tsx       # Video bulletins and YouTube playlist manager
        │   └── SocialSharePreviewModal.tsx # Open Graph and Twitter card live previewer
        │
        ├── home/
        │   ├── RegionalStatesFilterBar.tsx # Dynamic Indian state news selector
        │   └── TopCategoriesGrid.tsx     # Category card grid with news counters
        │
        ├── navigation/
        │   └── MobileBottomNav.tsx       # 5-item smartphone bottom navigation dock
        │
        └── widgets/
            ├── GoldRateWidget.tsx        # Live gold & silver bullion price tracker
            ├── RashifalWidget.tsx        # Daily Hindi horoscope reader
            └── SudokuGameWidget.tsx      # Sidebar mini-game widget
```

---

### 3. Server Endpoints & Route Mapping

| HTTP Method | Route | Handler / Service | Access Control |
|---|---|---|---|
| `GET` | `/` | Vite Dev Middleware / Static `dist/index.html` | Public |
| `GET` | `/article/:id` | SPA routing fallback to `index.html` with deep-link resolution | Public |
| `GET` | `/category/:category` | SPA routing fallback to `index.html` with category filter | Public |
| `GET` | `/live-feed` | Live news coverage view | Public |
| `GET` | `/epaper` | Digital newspaper viewer | Public |
| `GET` | `/archive` | Historical archive viewer | Public |
| `GET` | `/contact` | Contact bureau view | Public |
| `GET` | `/about` | About editorial board | Public |
| `GET` | `/privacy-policy` | Privacy policy & terms | Public |
| `GET` | `/sitemap.xml` | Dynamic XML sitemap generator with priority tags | Public / Crawlers |
| `GET` | `/news-sitemap.xml` | Google News compliant XML sitemap (48h rolling window) | Googlebot-News |
| `GET` | `/rss.xml` | RSS 2.0 syndication feed | Feed Readers |
| `GET` | `/robots.txt` | Crawler directives & sitemap references | Public / Crawlers |
| `GET` | `/api/health` | System health check (`status: ok`) | Public |
| `GET` | `/api/ai/google-trends` | Real-time curated Google Trends feed (India 2026) | Staff / Admin |
| `POST` | `/api/ai/generate-seo-meta` | Gemini 3.8 Flash automated SEO metadata generator | Staff / Admin |
| `POST` | `/api/ai/quick-read` | Gemini 3.8 Flash 3-bullet takeaway generator | Staff / Admin |
| `POST` | `/api/ai/draft-article-seo` | Gemini 3.8 Flash full news story drafter | Staff / Admin |
| `POST` | `/api/ai/generate-trend-article` | Humanized Hindi news article from trends | Staff / Admin |
| `POST` | `/api/admin/validate-key` | Validates Gemini, OpenAI, Claude, SerpApi keys | Super Admin |
| `GET` | `/api/citizen-news/list` | Returns citizen journalist submissions | Staff / Admin |
| `POST` | `/api/citizen-news/submit` | Ingests reader news submission with photos | Public (Rate-limited) |
| `POST` | `/api/sitemap/sync-articles`| Synchronizes published articles with sitemap store | Internal / Admin |
