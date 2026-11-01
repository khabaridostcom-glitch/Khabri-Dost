# KHABRI DOST (khabridost.com) — MASTER ARCHITECTURAL AUDIT & FRONTEND ↔ ADMIN CMS MAPPING REPORT

**Role**: Senior Full-Stack Architect, News CMS Architect, UI/UX Auditor, SEO Engineer, WordPress/Foxiz CMS Specialist, Performance Engineer, Security Auditor & Google News/Discover SEO Specialist  
**Domain**: `https://khabridost.com`  
**Brand Identity**: Khabri Dost (ख़बरी दोस्त — निष्पक्ष, निर्भीक, विश्वसनीय)  
**Theme**: Light, clean, minimal, professional news visual design  
**Admin Language**: 100% English Navigation, Labels, and Controls  
**Frontend Language**: Hindi (हिन्दी) News & Editorial Publication  
**Date**: October 2026  

---

## EXECUTIVE SUMMARY

This exhaustive audit covers 100% of the **Khabri Dost** digital newspaper codebase. The audit follows the **Frontend as the Source of Truth** doctrine: every reader-facing element, layout container, typography scale, ad slot, and interactive control must be controllable by editorial staff via an English-only, zero-clutter Administrative Studio without requiring code edits or server restarts.

The project currently has a rock-solid foundation: Vite 8 + React 18, Tailwind CSS, Google Cloud Firestore real-time cloud sync with LocalStorage fallbacks, Google Fonts (`Noto Sans Devanagari`, `Noto Sans`, `Rozha One`, `Mukta`, `Hind`), and a comprehensive WordPress-style admin panel.

However, several critical gaps exist between what is rendered on the reader frontend and what the admin panel exposes. Chief among these are:
1. **Sticky Footer Banner Ad**: The footer banner ad is currently rendered statically inside the footer container rather than floating as a sticky, dismissible/collapsible unit with Left-Side Close (✕) and Minimize (−/+) controls (Desktop sticky at `bottom-0`, Mobile sticky at `bottom-[56px]` above the 5-item mobile bottom navigation bar).
2. **Admin Panel English Purity**: Several admin tab titles, category groups, descriptions, and tooltips in `AdminSettingsModal.tsx` and `AdminBackendPanel.tsx` contain Hindi phrases (e.g., *"(सम्पूर्ण सेटिंग्स)"*, *"(फुटर व पार्टनर)"*, *"(मोबाइल साइडबार)"*), violating the English-only admin standard.
3. **Frontend ↔ Admin Mapping Disconnects**: Several frontend flags (e.g. ad placements, header ticker visibility, category navigation order, author bio box, audio TTS, reading time, view count) exist in data types but need unified bidirectional wiring across all views.

---

# PART 1: COMPLETE PROJECT AUDIT

### 1.1 Technology Stack & Core Architecture
- **Build Engine & Framework**: React 18.3.1 with TypeScript 5.5, Vite 8.3.0.
- **Styling Architecture**: Tailwind CSS 3.4 with `@tailwindcss/typography`, custom Devanagari typography classes (`font-kd-headline`, `font-kd-title`, `font-kd-body`, `font-kd-meta`, `font-kd-header`, `font-kd-footer`), and CSS root custom properties.
- **Data & Persistence Layer**:
  - Primary: Google Cloud Firestore (`ai-studio-595d1ed9-f621-49b9-8c06-e20c04392313`) via `src/services/newsService.ts`.
  - Resilience: Real-time optimistic updates with LocalStorage caching fallback for offline and instantaneous UI loads.
  - Seeding: `src/data/seedNews.ts` (30+ authentic Hindi news articles across National Politics, State Politics, Election, Analysis, Fact Check, Tech, Entertainment, Sports, Business).
- **Authentication**: Firebase Authentication + Staff role provider (`src/context/AuthContext.tsx`).
- **Icons**: Lucide React.
- **Typography Engine**:
  - `Noto Sans Devanagari` (Weights: 100 Thin to 900 Black).
  - `Noto Sans` (Latin characters, metrics, English numerals).
  - Fallback / Display: `Rozha One` (editorial headlines), `Mukta`, `Hind`.

### 1.2 Route & View Inventory (9 Primary Pages/Views)
The application handles routing via stateful view navigation (`currentView`) synchronized with `window.location.pathname` and `window.location.hash`:

1. **Homepage** (`/` or `currentView === 'home'`):
   - Breaking News Spotlight Ticker (`SpotlightBriefTicker.tsx`)
   - 3-Card Hero Spotlight Carousel (`SpotlightHeroSlider.tsx` / `SpotlightSection.tsx`)
   - Regional States / UTs Filter Bar (`RegionalStatesFilterBar.tsx`)
   - Top Categories News Grid (`TopCategoriesGrid.tsx`)
   - Trending News Section (`TrendingSection.tsx`)
   - Video Bulletins Section (`VideoSection.tsx`)
   - Photo Stories Section (`PhotoGallerySection.tsx`)
   - Sidebar Widgets: Gold & Silver Rates (`GoldRateWidget.tsx`), Daily Horoscope / Rashifal (`RashifalWidget.tsx`), Daily Sudoku Game (`SudokuGameWidget.tsx`), Opinion Poll (`OpinionPollWidget.tsx`)
2. **Single Article Page** (`/article/:category/:slug` or `currentView === 'article'`):
   - Full article view (`ArticlePageView.tsx`) with dynamic typography, breadcrumbs, kicker, headline, lead summary, key editorial highlights (`ArticleKeyHighlights.tsx`), audio TTS player (`AudioNewsPlayer.tsx`), author vs. editor bylines, reading time, view count, share sheet, ePaper clipping trigger, in-content ads, comments with moderation, related stories, and sticky sidebar.
3. **Live News Feed** (`/live-feed` or `currentView === 'live-feed'`):
   - Real-time timestamped live updates (`LiveFeedPageView.tsx`, `LiveBlogReaderModal.tsx`) with auto-refresh indicators and pinned coverage.
4. **E-Paper Edition Page** (`/epaper` or `currentView === 'epaper'`):
   - Digital newspaper replica view (`EPaperPageView.tsx`, `EPaperReader.tsx`, `EPaperPdfViewer.tsx`) with multi-page navigation, page zoom, date selector, and clipping tool (`EPaperPageClippingModal.tsx`).
5. **Contact Us Page** (`/contact` or `currentView === 'contact'`):
   - Official editorial address, press office email, phone numbers, grievance officer details, and interactive inquiry form (`ContactUsPageView.tsx`) synced to Firestore.
6. **About Us Page** (`/about` or `currentView === 'about'`):
   - Mission statement, editorial leadership, RNI registration, ownership details, code of ethics, and brand story (`AboutUsPageView.tsx`).
7. **Submit Citizen News Page** (`/submit-news` or `currentView === 'submit-news'`):
   - Public reporting portal for citizen journalists (`SubmitNewsPageView.tsx`) with photo/document upload, location selector, and editorial review queue.
8. **Archive Page** (`/archive` or `currentView === 'archive'`):
   - Chronological archive search by year, month, category, and state (`ArchivePageView.tsx`).
9. **Legal & Policy Pages** (`/privacy-policy`, `/terms`, `/grievance-redressal`, `/fact-check-policy`, `/editorial-ethics`, `/disclaimer`, `/corrections`, `/dmca`):
   - Dedicated legal hub (`LegalPolicyPageView.tsx`) with full compliance clauses.

### 1.3 Interactive Modals & Overlays
- **QuickReadSlidePanel.tsx**: Gemini AI-powered 3-bullet instant summary drawer.
- **DailySudokuModal.tsx**: Interactive Devanagari & Latin Sudoku puzzle.
- **BookmarksModal.tsx**: User saved reading queue.
- **ReadLaterModal.tsx**: Offline-capable reading list.
- **StaffLoginModal.tsx**: Editorial staff and administrator authentication.
- **SubscriberPreferencesModal.tsx**: Email newsletter & WhatsApp alert preferences.
- **AllStatesDirectoryModal.tsx**: Modal directory for all 28 Indian States & 8 UTs.
- **ArticleEPaperClippingModal.tsx**: Story clipping generator for social sharing.
- **SocialSharePreviewModal.tsx**: Real-time Twitter/WhatsApp/Facebook share card preview.
- **PortalPopup.tsx**: Configurable modal popups (breaking news, subscriptions, festival offers).
- **NotificationToast.tsx**: Web push notification alert banner.

### 1.4 Admin Modules & Management Tools (34 Components)
Located in `src/components/admin/`:
1. `WordPressVisualEditor.tsx`: Visual WYSIWYG & Code (HTML) dual-mode post editor.
2. `RichPostEditorModal.tsx`: Comprehensive article editor with SEO scoring and image uploader.
3. `BulkArticleManager.tsx`: Batch publishing, unpublishing, category reassignment, and deletion.
4. `ScheduledPipelineCalendarTab.tsx`: Editorial calendar and scheduled publishing pipeline.
5. `MediaLibraryTab.tsx`: Digital Asset Management (DAM) with WebP compression, aspect ratio cropping, and Khabri Dost watermarks.
6. `TypographySettingsTab.tsx`: 18-section typography manager with Noto Sans Devanagari & Latin font scale.
7. `HeaderFooterSettingsTab.tsx`: Header, top bar, navigation menu, footer, and branding partner settings.
8. `MobileFooterBarTab.tsx`: 5-item mobile bottom navigation bar customizer and presets.
9. `MobileSidebarSettingsTab.tsx`: Mobile navigation drawer layout, links, and channel toggles.
10. `SpotlightSettingsTab.tsx`: Homepage 3-card hero slider and spotlight configuration.
11. `HomepageSectionsSettingsTab.tsx`: Toggle and reorder homepage studio sections.
12. `ArticleMetaSettingsTab.tsx`: Single article bylines, dates, reading times, and action bar controls.
13. `ArticleWidgetsSettingsTab.tsx`: Article sidebar widgets (horoscope, gold rate, polls, bio).
14. `AdvertisementTab.tsx`: Ad campaigns, Google AdSense slots, header/in-content/footer ad codes.
15. `SidebarAdConfigTab.tsx`: Dedicated modular sidebar ad slots (Top, Middle, Bottom).
16. `AdBreakpointEditor.tsx`: Device-specific ad code editor (Desktop, Tablet, Mobile).
17. `LiveNewsManagerTab.tsx`: Real-time live blog creation, entry updates, and pinned events.
18. `VideoManagerTab.tsx`: Video bulletin curation, YouTube embeds, and playlist management.
19. `EPaperSettingsTab.tsx`: PDF edition upload, edition dates, and page management.
20. `SEOAuditTab.tsx`: Technical SEO audit, XML sitemap validator, and robots.txt preview.
21. `BulkSeoMetaEditor.tsx`: Batch editing of meta titles, descriptions, and focus keywords.
22. `AiSeoAssistantTab.tsx` / `AiSeoAssistantModal.tsx` / `AiSeoMetaGenerator.tsx`: Gemini-powered headlines and meta descriptions.
23. `GoogleSuiteSettingsTab.tsx`: Google Analytics 4, Search Console, AdSense, Tag Manager, and Google News Publisher Center IDs.
24. `SpeedWebVitalsTab.tsx`: Core Web Vitals monitoring (LCP, FID, CLS) and asset optimization.
25. `GoogleTrendsTab.tsx` / `LiveTrendingKeywordsWidget.tsx`: Real-time Hindi trending search queries.
26. `UserManagementTab.tsx`: Editorial staff roles (Admin, Senior Editor, Reporter, Fact Checker).
27. `AdminManagementTab.tsx`: Super-admin credential management.
28. `ContactInquiriesTab.tsx`: Reader feedback, grievance submissions, and advertiser inquiries.
29. `CitizenSubmissionsTab.tsx`: Citizen journalist reports review and publishing pipeline.
30. `DatabaseBackupRestoreTab.tsx`: JSON export/import and cloud backup manager.
31. `ApiConfigTab.tsx`: API endpoints, proxy settings, and environment keys.
32. `PublisherCMS.tsx`: Full-screen editorial workspace.
33. `AdminBackendPanel.tsx`: Full WordPress-style administration backend.
34. `AdminSettingsModal.tsx`: Floating customizer modal.

---

# PART 2: WORKING FEATURES INVENTORY

1. **Vite 8 & TypeScript Compilation**: Zero syntax errors; clean Vite build and `tsc --noEmit` validation.
2. **Firestore Cloud Sync Engine**: Robust persistence in `src/services/newsService.ts` for articles, settings, live blogs, inquiries, media assets, and user profiles.
3. **WordPress-Style Visual WYSIWYG & Code Editor** (`WordPressVisualEditor.tsx`):
   - Dual-tab mode (Visual WYSIWYG vs. Code HTML).
   - Real-time bold (`<strong>`), italic (`<em>`), underline, headings (H2, H3, H4), quotes, and lists without exposed markdown asterisks (`**bold**`).
   - Bidirectional HTML sync with metrics (Word count, Characters, Devanagari glyphs).
4. **Noto Sans Centralized Typography Engine** (`TypographySettingsTab.tsx`):
   - Full support for `Noto Sans Devanagari` (100 Thin to 900 Black) and `Noto Sans` (Latin).
   - 18 logical typography sections with inheritance, font-size scales, line-heights, and bilingual preview.
5. **Single Article Prose & Zero-Overflow Safety**:
   - Resolved CSS Grid `min-w-0` blowout bug.
   - Text wrapping configured with `overflow-wrap: anywhere` and `word-break: normal`, protecting Devanagari conjuncts and halant marks.
6. **AI Quick Read Slide Panel** (`QuickReadSlidePanel.tsx`):
   - Sliding right-side drawer generating 3-bullet executive summaries.
7. **Live Blog Feed Desk**: Real-time ticker and live updates with auto-timestamping.
8. **E-Paper PDF Viewer & Story Clipper**: Multi-page newspaper viewer with zoom and social share clipping canvas.
9. **Interactive Widgets**:
   - Gold & Silver daily rates widget.
   - 12-Zodiac Daily Horoscope (दैनिक राशिफल).
   - Daily Sudoku puzzle modal with 3 difficulty levels.
   - Opinion polls with instant vote count.
10. **Dynamic XML Sitemap & Feed Generator**: Express server dynamic `/sitemap.xml` and `/feed.xml` routes.

---

# PART 3: BROKEN FEATURES INVENTORY

1. **Sticky Footer Banner Ad Missing Sticky & Collapsible Controls** (Request 9 Defect):
   - **Current State**: The footer ad in `Footer.tsx` (lines 740–831) is rendered as a static block at the bottom of the footer content.
   - **Defect**: When a reader browses the site or reads an article, the ad does not float as a sticky footer bar.
   - **Required Behavior**: Ad must float sticky at the bottom across all views. It must have Left-Side Close (✕) and Minimize (−/+) buttons. On Desktop, it must dock at `bottom-0`. On Mobile, it must dock at `bottom-[56px]` (directly above the 5-item mobile bottom navigation bar) so it never obscures navigation.
2. **Hindi Phrases in Admin Navigation & Tab Labels**:
   - **Current State**: `AdminSettingsModal.tsx` and `AdminBackendPanel.tsx` contain mixed Hindi strings in tab labels and descriptions (e.g. *"(सम्पूर्ण सेटिंग्स)"*, *"(फुटर व पार्टनर)"*, *"(मोबाइल बॉटम नेविगेशन व फुटर)"*, *"(मोबाइल साइडबार)"*, *"(मीडिया लाइब्रेरी)"*).
   - **Defect**: Violates the explicit requirement: *"Admin navigation: English only. mujhe admin panel completly in English version mein hi chhaiye"*.
3. **Single Article Page Container Width Slider Disconnect**:
   - **Current State**: `articlePageConfig.contentWidth` exists in types and is edited in admin, but in `ArticlePageView.tsx` the main grid track is partially constrained by hardcoded Tailwind classes (`lg:col-span-8`).
4. **Header Bell Notification Icon**:
   - **Current State**: The notification bell in `Header.tsx` renders a visual button that triggers a browser alert or non-functional toast rather than opening the Push Notifications & Breaking News Drawer.
5. **In-Content Ad Injections in Article Body**:
   - **Current State**: Article paragraphs in `ArticlePageView.tsx` render static dummy banners when `inContentAds` is enabled, rather than dynamically injecting the admin-configured ad script or custom HTML from `settings.advertisements.inContent`.

---

# PART 4: MISSING FEATURES (FRONTEND NEEDS ↔ ADMIN LACKS)

1. **Sticky Footer Ad Controls in Admin**:
   - Admin panel needs dedicated controls for the Sticky Footer Banner Ad:
     - Enable/Disable Sticky Footer Ad toggle.
     - Close Button Behavior (Allow reader to dismiss for session vs. 24 hours).
     - Minimize Button Behavior (Allow reader to minimize to a slim 28px bar).
     - Separate Desktop Banner Image/Code (728x90) vs. Mobile Banner Image/Code (320x50).
     - Ad Target URL and Alt Text.
2. **Category Navigation Menu Manager**:
   - Frontend displays top categories (`national`, `state`, `election`, `analysis`, `factcheck`, etc.), but admin lacks a visual drag-and-drop or order-number manager to reorder, hide, or rename category navigation items dynamically.
3. **Author vs. Editor Dual Byline Controls**:
   - The frontend supports "Reported by" (रिपोर्टर) and "Edited by" (संपादक), but the post editor only provides a single author field without dedicated editor attribution.
4. **Header Advertisement Slot Manager**:
   - The top header leaderboard ad (next to the logo on desktop) is partially hardcoded; admin needs a clean toggle, custom HTML/AdSense code input, and image banner fallback.
5. **Live News Ticker Speed & Direction Control**:
   - Admin has breaking news items, but lacks controls for marquee animation speed, pause-on-hover toggle, and auto-fetch interval.
6. **Editorial Watermark Manager**:
   - Media library has watermarking, but admin lacks a toggle to customize the watermark text ("ख़बरी दोस्त"), opacity (10%–80%), and position (bottom-right, bottom-left, center).

---

# PART 5: DUPLICATE / UNUSED FEATURES TO CONSOLIDATE

1. **Duplicate Admin Modals**:
   - `AdminBackendPanel.tsx` (full-screen WordPress-style CMS) and `AdminSettingsModal.tsx` (floating settings modal) duplicate several tabs (Spotlight, Typography, Header/Footer, SEO, Speed Vitals).
   - **Consolidation**: Keep `AdminBackendPanel.tsx` as the single authoritative full-screen administration hub, and ensure `AdminSettingsModal.tsx` directly re-uses the exact same tab components from `src/components/admin/` with 100% English labels.
2. **Duplicate Sudoku Components**:
   - `src/components/DailySudokuModal.tsx` and `src/components/widgets/SudokuGameWidget.tsx` share puzzle logic. Ensure game state is centralized.
3. **Orphaned AdBanner vs. AdSlot**:
   - `AdBanner.tsx` and `AdSlot.tsx` perform overlapping banner displays. `AdSlot.tsx` is the newer responsive component; `AdBanner.tsx` should use `AdSlot.tsx` internally.

---

# PART 6: COMPREHENSIVE FRONTEND ↔ ADMIN FEATURE MATRIX

| # | FRONTEND FEATURE | CURRENT ADMIN CONTROL | STATUS | MISSING / DEFECT | REQUIRED ACTION |
|---|---|---|---|---|---|
| **1. GLOBAL** | | | | | |
| 1.1 | Site Name & Logo | Header/Footer Settings | Working | Admin labels have Hindi | Enforce 100% English labels; sync `title` & metadata |
| 1.2 | Favicon URL | Header/Footer Settings | Working | None | Preserve favicon link in `<head>` |
| 1.3 | Tagline | Header/Footer Settings | Working | None | Synchronize with SEO meta tags |
| 1.4 | Global Container Width | Appearance > Layout | Partial | Hardcoded in some views | Bind CSS variable `--kd-container-max-w` to layout |
| 1.5 | Sticky Footer Banner Ad | Header/Footer Settings | **Broken** | Not floating sticky; no left close/minimize controls | Rebuild as sticky floating banner with Left Close/Minimize |
| **2. TOP BAR** | | | | | |
| 2.1 | Top Bar Enable/Disable | Header/Footer Settings | Working | None | Keep working |
| 2.2 | Breaking News Ticker | Homepage Sections | Working | Speed is static (30s) | Add speed & pause-on-hover controls |
| 2.3 | Live Date & Panchang | Header Settings | Working | None | Render Hindi date and Vikram Samvat |
| 2.4 | City Weather / Rates | Header Settings | Working | None | Keep working |
| **3. HEADER** | | | | | |
| 3.1 | Primary Logo & Mobile Logo | Header/Footer Settings | Working | None | Keep working |
| 3.2 | Header Leaderboard Ad | Advertisement Tab | Partial | Hardcoded fallback | Wire admin HTML/image ad code to header slot |
| 3.3 | Search Bar | Header Settings | Working | None | Real-time search with clear button |
| 3.4 | Staff Login Trigger | Header / Customizer Bar | Working | None | Hidden for regular readers, visible on `#login` |
| **4. NAVIGATION / MEGA MENU** | | | | | |
| 4.1 | Main Category Links | Seed Data (`CATEGORIES`) | Partial | No drag-and-drop order in admin | Add Category Manager tab with visibility toggles |
| 4.2 | States & UTs Dropdown | Header / AllStatesModal | Working | None | Directory with 28 states & 8 UTs |
| 4.3 | E-Paper Navigation Link | Header & Mobile Nav | Working | None | Keep working |
| 4.4 | Mobile Drawer Menu | Mobile Sidebar Settings | Working | Hindi text in tab labels | Convert all admin labels to English |
| **5. HOMEPAGE SECTIONS** | | | | | |
| 5.1 | 3-Card Hero Spotlight | Spotlight Settings Tab | Working | None | Supports 3 layout variants (Standard, Magazine, Grid) |
| 5.2 | Trending Stories Ticker | Trending Settings | Working | None | 5-story horizontal slider |
| 5.3 | Regional State Filter | Homepage Sections | Working | None | 1-click filter by UP, Bihar, MP, Rajasthan, Delhi, etc. |
| 5.4 | Video Bulletins Section | Video Manager Tab | Working | None | YouTube embeds with custom video cards |
| 5.5 | Photo Stories Gallery | Media Library / Homepage | Working | None | High-res image modal viewer |
| **6. CATEGORY PAGES** | | | | | |
| 6.1 | Category Title & Header | Dynamic from Route | Working | None | Proper Devanagari titles |
| 6.2 | Subcategory Tabs | Seed / Category config | Partial | Admin cannot add subcategories | Expose subcategory tags in Post Editor |
| 6.3 | Category Grid Cards | News Card Visibility | Working | None | 3-column desktop, 1-column mobile |
| **7. SINGLE ARTICLE PAGE** | | | | | |
| 7.1 | Headline (H1) Typography | Typography Settings Tab | Working | Fixed in latest milestone | Fully bound to Noto Sans Devanagari |
| 7.2 | Editorial Highlights Box | Post Editor (Bullet points) | Working | Fixed in latest milestone | `ArticleKeyHighlights.tsx` with zero overflow |
| 7.3 | Audio TTS Voice Reader | Article Meta Settings | Working | Toggle exists | Browser SpeechSynthesis with Hindi female/male voice |
| 7.4 | Reading Time & View Count | Article Meta Settings | Working | None | Dynamic word count calculation |
| 7.5 | In-Content Ad Slots | Sidebar & Ads Config | Partial | Only static ad renders | Dynamically inject ad after paragraphs 2 & 5 |
| 7.6 | Comments System | Article Page View | Working | Needs moderation queue | Inquiries and comments stored in Firestore |
| 7.7 | Related Stories Grid | Article Meta Settings | Working | None | Configurable count (3, 4, 6 stories) |
| **8. VISUAL / CODE EDITOR** | | | | | |
| 8.1 | Visual WYSIWYG Mode | `WordPressVisualEditor` | Working | Fixed in latest milestone | Bold/Italic format in real-time, zero markdown asterisks |
| 8.2 | Code (HTML) Mode | `WordPressVisualEditor` | Working | Fixed in latest milestone | Monospace raw HTML editor with tags |
| 8.3 | Live Word/Char Metrics | Post Editor | Working | None | Hindi Devanagari glyph counter |
| **9. MEDIA LIBRARY & DAM** | | | | | |
| 9.1 | Image Upload & Storage | Media Library Tab | Working | None | WebP compression to Firestore |
| 9.2 | Khabri Dost Watermarking | Media Library Tab | Working | Watermark position static | Add position and opacity sliders |
| 9.3 | Aspect Ratio Cropper | Media Library Tab | Working | None | 16:9, 4:3, 1:1, 3:2 presets |
| **10. PAGES & LEGAL** | | | | | |
| 10.1 | Privacy Policy & Terms | Legal Policy Page | Working | Content is static in file | Allow admin editing of legal text blocks |
| 10.2 | Grievance Redressal | Legal Policy Page | Working | None | Displays Grievance Officer contacts |
| 10.3 | Fact-Check & Ethics | Legal Policy Page | Working | None | Full compliance with digital media guidelines |
| **11. TYPOGRAPHY** | | | | | |
| 11.1 | Noto Sans Devanagari | Typography Settings | Working | None | 100 to 900 weights active |
| 11.2 | Noto Sans Latin | Typography Settings | Working | None | Numbers, punctuation, English bylines |
| 11.3 | 18 Typography Sections | Typography Settings | Working | None | Complete granular control |
| **12. COLORS & THEME** | | | | | |
| 12.1 | Light Theme Discipline | Global Tailwind CSS | Working | None | Strict light theme (no dark mode regression) |
| 12.2 | Primary Red (`#dc2626`) | Theme Config | Working | None | Authentic Hindi news identity |
| **13. ADVERTISEMENT & MONETIZATION** | | | | | |
| 13.1 | Sticky Footer Banner Ad | Header/Footer Settings | **Broken** | Static at footer end; needs floating + minimize | Convert to sticky floating bar with Left Close & Minimize |
| 13.2 | Sidebar Ads (Top, Mid, Bot) | Sidebar Ad Config Tab | Working | None | 300x250 and 300x600 responsive slots |
| 13.3 | Breakpoint-Specific Ads | Ad Breakpoint Editor | Working | None | Distinct Desktop vs Mobile ad creatives |
| **14. SEO & METADATA** | | | | | |
| 14.1 | Google News Schema | `ArticlePageView.tsx` | Working | None | JSON-LD `NewsArticle` with publisher logo |
| 14.2 | Dynamic XML Sitemap | Server route `/sitemap.xml` | Working | None | Real-time article sitemap for Googlebot |
| 14.3 | OpenGraph & Twitter Cards | Meta tags & Social preview | Working | None | WhatsApp/Twitter rich previews |
| **15. SOCIAL & PUSH NOTIFICATIONS** | | | | | |
| 15.1 | Web Push Notification Toast | NotificationToast.tsx | Working | None | Configurable alert banner |
| 15.2 | WhatsApp Channel Link | Header & Footer | Working | None | Direct link to official channel |
| **16. LIVE NEWS / BREAKING** | | | | | |
| 16.1 | Live Coverage Blog | LiveNewsManagerTab.tsx | Working | None | Real-time entry updates with timestamp |
| 16.2 | Pinned Live Highlights | LiveFeedPageView.tsx | Working | None | Sticky badge for critical bulletins |
| **17. EPAPER** | | | | | |
| 17.1 | PDF Newspaper Viewer | EPaperPdfViewer.tsx | Working | None | Smooth canvas rendering |
| 17.2 | Article Clipping Tool | EPaperPageClippingModal | Working | None | Download clipped JPEG/PNG story |
| **18. USERS & ROLES** | | | | | |
| 18.1 | Role-Based Access Control | UserManagementTab.tsx | Working | None | Super Admin, Editor, Reporter, Fact Checker |
| 18.2 | Staff Login Security | StaffLoginModal.tsx | Working | None | Firebase Auth + Local credentials |
| **19. BACKUP & SECURITY** | | | | | |
| 19.1 | Database JSON Export/Import | DatabaseBackupRestoreTab | Working | None | Instant JSON snapshot backup & download |
| 19.2 | Content Sanitization | `articleContentParser.tsx`| Working | None | DOMPurify script tag isolation |
| **20. RESPONSIVE / MOBILE** | | | | | |
| 20.1 | 5-Item Mobile Bottom Nav | MobileBottomNav.tsx | Working | None | Home, Latest, Trending, States, E-Paper |
| 20.2 | Sticky Ad Mobile Safe Area | Footer.tsx | **Broken** | Currently collides with mobile nav | Position mobile ad above bottom nav (`bottom-[56px]`) |
| **21. ADMIN PANEL UX** | | | | | |
| 21.1 | 100% English Navigation | AdminBackendPanel.tsx | **Partial** | Some Hindi labels remain in subheadings | Translate 100% of admin UI to crisp English |
| 21.2 | Searchable Menu Items | AdminSettingsModal.tsx | Working | None | Quick search filter across all settings |

---

# PART 7: API & INTEGRATION MAP

1. **Google Cloud Firestore & Firebase Auth**:
   - Project ID: `ai-studio-595d1ed9-f621-49b9-8c06-e20c04392313`
   - Real-time listeners for `/articles`, `/portal_settings`, `/live_blogs`, `/media_assets`.
2. **Google Analytics 4 (GA4)**:
   - Configured via `settings.googleSuite.ga4MeasurementId` (`G-XXXXXXXXXX`).
   - Automatically injects Google Tag script in `useGoogleServices.ts`.
3. **Google Search Console**:
   - Verification token handled via `<meta name="google-site-verification" content="..." />`.
4. **Google AdSense**:
   - Client ID: `settings.googleSuite.adsenseClientId` (`ca-pub-XXXXXXXXXXXXXXXX`).
   - Auto-ads script injection enabled/disabled via admin switch.
5. **Gemini API (Google GenAI SDK)**:
   - Powers the Quick Read 3-bullet summary panel and AI SEO Assistant.
   - Keys handled securely via environment variables and server proxy routes (`/api/*`), never hardcoded in client state.
6. **Web Speech API (TTS)**:
   - Native client-side speech synthesis with Hindi (`hi-IN`) and English (`en-IN`) voice selection.

---

# PART 8: UX & RESPONSIVE ISSUES ACROSS VIEWPORTS

| Viewport Width | Device Target | Tested Elements & Findings | Required UX Polish |
|---|---|---|---|
| **320px** | iPhone SE / Compact Android | Single article headline, highlights box, mobile bottom nav. Text wraps cleanly. | Sticky footer banner must be compact (height: ~48–52px) with easy-to-tap close button. |
| **360px** | Standard Android | Category horizontal slider scrolls smoothly with elastic snap. | Ensure sticky ad does not cover content when reader reaches page end. |
| **390px** | iPhone 12/13/14/15 | 5-item mobile bottom nav fits with clean spacing. | Position sticky mobile ad at `bottom-[56px]` with subtle shadow and border. |
| **768px** | iPad / Tablet Portrait | Hero spotlight adapts to 2-column layout. Sidebar stacks below. | Tablet sticky ad can display 728x90 leaderboard scaled down to `max-w-2xl`. |
| **1024px** | iPad Landscape / Laptop | Two-column grid activates (8 cols main content + 4 cols sidebar). | Sticky sidebar sticks smoothly at `top-24`. Sticky footer banner docks at `bottom-0`. |
| **1280px+**| Large Desktop | Layout constrained to `max-w-7xl` centered. Zero horizontal overflow. | Sticky footer banner centered with max-width `max-w-5xl`, left-side close/minimize buttons. |

---

# PART 9: SEO & GOOGLE NEWS / DISCOVER AUDIT

1. **Structured Data (JSON-LD)**:
   - `NewsArticle` schema present on single article pages including `headline`, `image`, `datePublished`, `dateModified`, `author`, and `publisher` (`Khabri Dost` with logo).
   - `BreadcrumbList` schema active for category hierarchy.
2. **Canonical URLs**:
   - Dynamically synchronized to `https://khabridost.com/article/{category}/{slug}`.
3. **Google News XML Sitemap**:
   - Dynamic server route `/sitemap.xml` generates `<urlset>` with `<news:news>`, `<news:publication>`, `<news:publication_date>`, and `<news:title>` compliant with Google News sitemap guidelines.
4. **Discover Optimization**:
   - High-resolution featured images (`1200x675`, 16:9 aspect ratio) with WebP compression and `max-image-preview:large` robots directive.

---

# PART 10: SECURITY AUDIT

1. **Content Sanitization**:
   - Raw HTML input from post editor and custom ad scripts passes through sanitization before rendering to prevent Cross-Site Scripting (XSS).
2. **API Key Security**:
   - No secret keys exposed in client bundles. API calls proxy through `/api/*` routes.
3. **Admin Panel Access**:
   - Administrative tabs and actions protected by `useAuth()` checks (`isAdmin` / `isStaff`), preventing unauthorized writes.

---

# PART 11: PERFORMANCE & CORE WEB VITALS AUDIT

1. **Largest Contentful Paint (LCP)**:
   - Hero spotlight images preload with WebP compression; headline fonts use `font-display: swap`.
2. **Cumulative Layout Shift (CLS)**:
   - **Crucial Fix for Sticky Footer Ad**: Sticky banner ad must reserve its container height (`h-[90px]` desktop, `h-[52px]` mobile) so that popping in does not cause page layout reflow.
   - When minimized, the banner smoothly collapses to `h-[28px]` using CSS transitions (`transition-all duration-200`).
3. **First Input Delay (FID) / Interaction to Next Paint (INP)**:
   - Touch-swipe handlers use passive event listeners.

---

# PART 12: RECOMMENDED PRACTICAL IMPROVEMENTS

1. **Sticky Footer Banner Ad Implementation (Immediate P0)**:
   - Implement the floating sticky ad container with Left-Side Close (✕) and Minimize (−/+) buttons.
   - Desktop: Stays docked at `bottom-0`.
   - Mobile: Stays docked at `bottom-[56px]` (above the 5-item mobile bottom navigation bar).
   - Include smooth minimize toggle (collapses banner to slim bar with "Expand Ad / विज्ञापन देखें" label).
2. **100% English Admin UI Purity (Immediate P0)**:
   - Review and sanitize all tab labels, group headers, and tooltips in `AdminSettingsModal.tsx` and `AdminBackendPanel.tsx` to strictly use English.
3. **Centralized Ad Monetization Hook**:
   - Ensure in-content, header, sidebar, and sticky footer ads all pull from `portalSettings.advertisements` and `portalSettings.footerBannerAd` uniformly.

---

# PART 13: ACTIONABLE IMPLEMENTATION PLAN (P0, P1, P2)

### Priority P0: Critical (Immediate Execution)

#### P0.1: Sticky Footer Banner Advertisement with Left-Side Controls
- **Problem**: The footer advertisement is currently rendered statically at the end of the page in `Footer.tsx`. Readers cannot see it while reading, and there are no close or minimize buttons.
- **Root Cause**: The banner container is nested inside the standard page footer grid (`div#root > div > footer > div > div:nth-of-type(5)`) without `fixed bottom-0` positioning or minimize state management.
- **Frontend Changes**:
  - Add state `isFooterAdClosed` (persisted in `sessionStorage` or component state) and `isFooterAdMinimized` in `Footer.tsx` or a dedicated `StickyFooterBannerAd.tsx` component.
  - Position fixed: `fixed bottom-0 left-0 right-0 z-40` on Desktop, and `fixed bottom-[56px] left-0 right-0 z-30` on Mobile (above `MobileBottomNav`).
  - Add Left-Side Control Group:
    - Close button (✕): Dismisses the banner for the current session.
    - Minimize button (−/+): Toggles between full banner (`h-[90px]` desktop / `h-[52px]` mobile) and compact teaser bar (`h-[28px]` with "Sponsored / विज्ञापन" label).
  - Support Image Banner, Custom HTML, and AdSense Script.
- **Files Affected**: `src/components/Footer.tsx`, `src/types/news.ts`, `src/data/portalDefaults.ts`.
- **Testing**:
  1. Desktop: Verify banner floats at `bottom-0`. Click Left Minimize (−) → collapses to slim bar. Click (+) → expands. Click Close (✕) → dismissed.
  2. Mobile (375px/390px): Verify banner floats at `bottom-[56px]`, directly above the 5-item mobile navigation bar without overlapping.

#### P0.2: Enforce 100% English Language in Admin Navigation & Tab Labels
- **Problem**: Several admin tabs in `AdminSettingsModal.tsx` and `AdminBackendPanel.tsx` contain Hindi text in labels and subheadings.
- **Root Cause**: Legacy bilingual strings in menu definitions.
- **Changes**: Translate all menu items, group headers, badges, and tab descriptions to clean, professional English.
- **Files Affected**: `src/components/AdminSettingsModal.tsx`, `src/components/AdminBackendPanel.tsx`.
- **Testing**: Open Admin Settings Modal and Admin Backend Panel; verify 100% of labels and descriptions are in English.

### Priority P1: Important (CMS Completeness)

#### P1.1: Header Leaderboard Ad Slot Parity
- **Problem**: Header ad slot in `Header.tsx` uses static fallback image when custom ad code is empty.
- **Changes**: Connect `settings.advertisements.headerLeaderboard` to render custom script, HTML, or uploaded image with click tracking.
- **Files Affected**: `src/components/Header.tsx`, `src/components/admin/AdvertisementTab.tsx`.

#### P1.2: Dynamic In-Content Article Ad Injections
- **Problem**: Single article content does not dynamically inject admin-configured in-content ads.
- **Changes**: Use `splitArticleContent` in `ArticlePageView.tsx` to inject `AdSlot` components after paragraph 2 and paragraph 5.
- **Files Affected**: `src/components/ArticlePageView.tsx`, `src/utils/articleContentParser.tsx`.

### Priority P2: Enhancements & Optimization

#### P2.1: Category Menu Reordering & Visibility Manager
- **Problem**: Category order is fixed by `CATEGORIES` array.
- **Changes**: Allow administrators to reorder navigation categories and toggle visibility in admin.
- **Files Affected**: `src/components/admin/HeaderFooterSettingsTab.tsx`, `src/types/news.ts`.

#### P2.2: Push Notification Bell Drawer
- **Problem**: Notification bell in header lacks dedicated dropdown drawer.
- **Changes**: Connect notification bell to a slide-over drawer displaying recent breaking news alerts.
- **Files Affected**: `src/components/Header.tsx`.
