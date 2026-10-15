# 03 — Admin Panel Architecture & Publishing Workflows
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Exhaustive audit of all administrative modules, CMS publishing lifecycles, role permissions, and interface redundancies.

---

## 1. Current Administrative Sidebar Architecture

The primary administrative interface is defined in `src/components/AdminBackendPanel.tsx` (3,085 lines). It mimics the WordPress CMS administrative interface, organized into **5 parent menu sections** containing **32 functional modules**:

```
[Khabri Dost Admin Studio (AdminBackendPanel.tsx)]
 ├── 1. DASHBOARD SECTION (menu: 'dashboard')
 │    ├── Overview Dashboard (`dashboard`)
 │    └── Speed & Web Vitals Monitor (`speed_vitals`)
 │
 ├── 2. NEWS & CONTENT (menu: 'news')
 │    ├── All News Articles (`articles`)
 │    ├── Add New Article (`new_article`)
 │    ├── Citizen News Desk (`citizen_news`)
 │    ├── Live Coverage Manager (`live`)
 │    ├── Trending Tickers & Topics (`trending`)
 │    ├── Digital E-Paper Manager (`epaper`)
 │    └── AI SEO Assistant (`ai_seo_assistant`)
 │
 ├── 3. MEDIA LIBRARY (menu: 'media')
 │    ├── Media Library & WebP Compression (`media`)
 │    ├── Video Bulletins & Reels (`video_gallery`)
 │    └── Photo Stories Gallery (`photo_stories`)
 │
 ├── 4. APPEARANCE & CUSTOMIZATION (menu: 'appearance')
 │    ├── Homepage Sections & Grid Order (`homepage_sections`)
 │    ├── Top Stories Spotlight Hero (`spotlight`)
 │    ├── Header & Navigation Settings (`settings_header`)
 │    ├── Footer & Legal Section (`settings_footer`)
 │    ├── Sidebar Widgets & Rashifal (`sidebar_widgets`)
 │    ├── Sidebar Ad Slot Placements (`sidebar_ads`)
 │    ├── Article Layout & Metadata (`article_meta`)
 │    ├── Mobile Drawer Navigation (`mobile_sidebar`)
 │    └── Typography & Hindi Fonts (`typography`)
 │
 └── 5. SETTINGS & SEO (menu: 'settings')
      ├── General Site Identity (`settings_general`)
      ├── SEO Health & XML Sitemaps (`seo_audit`)
      ├── Google Suite & Analytics (`google_suite`)
      ├── Monetization & AdSense (`monetization`)
      ├── Contact Inquiries Inbox (`inquiries`)
      ├── Editorial Staff & RBAC Roles (`users`)
      ├── Administrator Credentials (`admins`)
      ├── Newsletter Subscribers (`subscribers`)
      ├── Push Notification Dispatcher (`notifications`)
      ├── Popups & Reader Alerts (`popups`)
      ├── Cloud API Configuration (`api_config`)
      └── Factory Reset & System Defaults (`factory_reset`)
```

---

## 2. Exhaustive Audit of All 32 Admin Modules

### 2.1 Dashboard Section

#### `dashboard` — System Overview & Analytics
- **Purpose:** Central editorial dashboard displaying aggregate metrics (total articles, published today, total views, active readers, breaking alerts).
- **Files:** `AdminBackendPanel.tsx` (lines 1127–1370).
- **Data Source:** Firestore `articles`, `settings/portal_config`, and in-memory analytics.
- **RBAC Required:** All logged-in staff (`reporter`, `editor`, `admin`, `super_admin`).
- **Gaps/Limitations:** View counts are derived from loaded client articles; not connected to a server-side analytics rollup.

#### `speed_vitals` — Performance & Core Web Vitals
- **Purpose:** Monitors First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).
- **Files:** `src/components/admin/SpeedWebVitalsTab.tsx`.
- **Status:** Evaluates browser client metrics; displays helpful optimization suggestions.

---

### 2.2 News & Content Section

#### `articles` — Article Manager & Bulk Actions
- **Purpose:** Filterable data table of all articles (Search by title, filter by category, filter by status: draft/published/scheduled).
- **Files:** `src/components/admin/BulkArticleManager.tsx`, `AdminBackendPanel.tsx`.
- **Functions:** Quick edit, delete, preview, change status, batch delete.
- **Data Source:** Firestore `articles` collection.
- **RBAC:** Editor, Super Admin.

#### `new_article` — Rich Article Editor & AI Studio
- **Purpose:** Core news publishing form with headline input, slug generator, 3-point AI summary, rich WYSIWYG editor, category dropdown, tag chips, featured image uploader, and scheduling picker.
- **Files:** `AdminBackendPanel.tsx` (lines 1412–1438), `src/components/RichPostEditorModal.tsx`.
- **RBAC:** Reporter (draft only), Editor (direct publish), Super Admin.

#### `citizen_news` — Citizen Journalism Review Desk
- **Purpose:** Review reports submitted by citizens via `/submit-news`.
- **Files:** `src/components/admin/CitizenSubmissionsTab.tsx`.
- **Functions:** Verify factuality, reject, or convert directly into a published article draft.
- **Data Source:** `citizenSubmissionsStore` staged in `server.ts`.

#### `live` — Real-Time Breaking Blog Manager
- **Purpose:** Create, edit, and post time-stamped live bulletins.
- **Files:** `src/components/admin/LiveNewsManagerTab.tsx`.
- **Data Source:** Firestore `live_blogs` collection.

#### `trending` — Trending Topics & Marquee Ticker
- **Purpose:** Set breaking news marquee text, manage trending hashtags (#Election2026, #IPL2026).
- **Files:** `src/components/admin/LiveTrendingKeywordsWidget.tsx`.

#### `epaper` — Digital E-Paper Edition Manager
- **Purpose:** Upload PDF files of print newspapers, select edition date, manage page count.
- **Files:** `src/components/admin/EPaperSettingsTab.tsx`.

#### `ai_seo_assistant` — Google Gemini News Assistant
- **Purpose:** Automated article generation, SEO title optimization, and fact-checking prompts using Gemini Flash.
- **Files:** `src/components/admin/AiSeoAssistantTab.tsx`, `AiSeoAssistantModule.tsx`.

---

### 2.3 Media Library Section

#### `media` — WebP Media Asset Manager
- **Purpose:** Upload images with automatic in-browser canvas compression (WebP, quality 0.82), apply "Khabri Dost" watermark, manage alt text and captions.
- **Files:** `src/components/admin/MediaLibraryTab.tsx`, `src/utils/imageCompressor.ts`.
- **Data Source:** Firestore `media` collection.

#### `video_gallery` & `photo_stories`
- **Purpose:** Manage video bulletins (YouTube IDs) and curated multi-image photo stories.
- **Files:** `AdminBackendPanel.tsx`.

---

### 2.4 Appearance & Customization Section

#### `homepage_sections` — Homepage Section Grid Customizer
- **Purpose:** Reorder homepage sections (Lead Slider, Breaking News, National, Politics, Sports, Sudoku, Rashifal).
- **Files:** `src/components/admin/HomepageSectionsSettingsTab.tsx`.

#### `typography` — Global Typography & Hindi Fonts
- **Purpose:** Configure H1 headline font, body font, font sizes (`articleTitleDesktopPx: 32`, `articleTitleMobilePx: 26`, `articleBodyFontSizePx: 17`), line heights, and reset to defaults.
- **Files:** `src/components/admin/TypographySettingsTab.tsx`.
- **Root Conflict Discovered:** Overridden by `src/index.css` `!important` rule on `.font-kd-headline`.

#### `sidebar_ads` & `monetization` — Advertisement Placements
- **Purpose:** Configure Google AdSense publisher ID (`ca-pub-XXXXXXXXXX`) and direct sponsored banners (Header Leaderboard 728x90, In-Article 300x250, Sticky Sidebar 300x600).
- **Files:** `src/components/admin/AdvertisementTab.tsx`, `SidebarAdConfigTab.tsx`, `AdBreakpointEditor.tsx`.

---

### 2.5 Settings & SEO Section

#### `google_suite` & `seo_audit` — Analytics & XML Sitemaps
- **Purpose:** Input GA4 Measurement ID, GTM ID, Search Console verification meta tag, and trigger sitemap sync.
- **Files:** `src/components/admin/GoogleSuiteSettingsTab.tsx`, `SEOAuditTab.tsx`.

#### `users` & `admins` — Role-Based Access Control (RBAC)
- **Purpose:** Manage staff profiles, author bios, assign roles (`super_admin`, `editor`, `reporter`, `contributor`).
- **Files:** `src/components/admin/UserManagementTab.tsx`, `AdminManagementTab.tsx`.
- **Security Check:** Backed by Firestore collection `users` and `firestore.rules`.

---

## 3. Discovered Architectural Duplications & Overbuild

An important finding for the future refactor is that **three competing admin interfaces exist simultaneously in the codebase**:

1. **`AdminBackendPanel.tsx` (3,085 lines):** The primary, feature-complete WordPress-style studio containing all 32 tabs.
2. **`PublisherCMS.tsx` (1,665 lines):** A redundant standalone modal launched from certain header buttons that independently implements article drafting, category picking, and publishing.
3. **`AdminSettingsModal.tsx` (1,720 lines):** An older tabbed settings modal duplicating appearance, typography, and site configuration controls.
4. **`AdminFrontendCustomizerBar.tsx`:** A floating bottom toolbar attempting live frontend modifications.

**Recommendation:** Retire `PublisherCMS.tsx`, `AdminSettingsModal.tsx`, and `AdminFrontendCustomizerBar.tsx`. Funnel all administrative, drafting, and configuration workflows exclusively into `AdminBackendPanel.tsx`.

---

## 4. End-to-End Article Publishing Workflow

```
[Step 1: Initiation]
  └── Reporter or Editor opens `new_article` in AdminBackendPanel.
        │
[Step 2: Content Drafting]
  ├── Title: Auto-generates URL slug in Romanized Hindi (e.g., "chandrayaan-mission-update").
  ├── Summary: 2-3 lines or generated via Gemini AI Assistant.
  ├── Body: Formatted using rich text tools (headings, bold, quotes, embeds).
  └── Media: Selected from Media Library with WebP compression and "Khabri Dost" watermark.
        │
[Step 3: Categorization & SEO]
  ├── Category: Assigned to 1 of 9 primary categories (Desh, Videsh, Rajneeti, etc.).
  ├── Tags: Comma-separated search keywords.
  ├── SEO Meta: Custom SEO Title (<=60 chars) and Meta Description (<=160 chars).
  └── Byline: Author name and ID automatically linked to authenticated user.
        │
[Step 4: Editorial Status]
  ├── 'draft' -> Saved for internal review.
  ├── 'scheduled' -> Publication delayed until specified ISO timestamp.
  └── 'published' -> Immediately made live.
        │
[Step 5: Persistence & Live Sync]
  ├── Written to Firestore collection `articles` via `publishArticle()` in `newsService.ts`.
  ├── Local cache updated in `localStorage` ('kd_articles').
  ├── Real-time `onSnapshot` in `App.tsx` immediately renders the article on the public site.
  └── Bot requests dynamically receive OpenGraph meta tags via `server.ts`.
```
