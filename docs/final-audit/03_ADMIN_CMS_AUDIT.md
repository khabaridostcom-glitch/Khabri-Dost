# 03 — ADMIN CMS & EDITORIAL WORKFLOW AUDIT
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Hindi News Content Management System  
**Audit Date:** October 2026  
**Auditor:** Senior Full-Stack & News CMS Architect  

---

## 1. Executive Overview: Admin Architecture

The Khabri Dost Admin Panel is an enterprise-grade newsroom publishing platform built entirely in **React + TypeScript**, with all navigation, forms, tab headers, helper tooltips, and system notifications presented in **English**, while supporting full Devanagari Hindi content input, previewing, and scheduling.

### Key Architectural Standards:
- **Authentication:** Protected admin route guarded by Firebase Auth (`onAuthStateChanged`) with role-based access levels (Super Admin, Editor, Staff Reporter, Contributor).
- **Theme Standard:** 100% Strict Light Mode. Every admin tab, card, header banner, modal, data table, and input field is styled with clean white cards (`bg-white`), slate borders (`border-slate-200`), and dark slate text (`text-slate-900` / `text-slate-700`). All legacy dark slate headers have been converted to high-contrast light mode.
- **Data Persistence:** Synchronized with Firebase Firestore when provisioned, and instantly cached via resilient local state fallbacks with backup export/import capabilities.

---

## 2. Admin Modules Deep Dive

### 2.1. Articles & News Publisher (`PublisherCMS.tsx`)
- **Core Functionality:** Creation, editing, drafting, scheduling, publishing, and archiving of news articles.
- **WordPress-Style Visual & Code Editor Parity:**
  - **Visual Mode:** Real-time WYSIWYG editor with live bold (`<strong>`), italic (`<em>`), underline, strikethrough, heading dropdown (H1–H4), blockquote, bullet/numbered lists, inline link insertion, and table insertion.
  - **Code Mode:** Direct HTML/Markdown source editor with syntax highlighting, tag auto-closing, and instant preview toggle.
  - **Defect Resolution Verification:** The previous defect where Markdown symbols like `**bold**` appeared instead of bold text has been resolved. The formatting engine now injects semantic HTML elements directly, rendering bold and italic text immediately in both the editor workspace and the public article view.
- **Editorial Fields:**
  - Headline (Hindi Devanagari)
  - Sub-headline / Deck
  - Slug / Permalink generator (auto-slugifies with Devanagari transliteration or English Latin keywords)
  - Primary Category & Subcategory selection
  - Region / State / District tagging
  - Primary Featured Image with credit, caption, and alt text
  - Image Gallery attachment
  - Video Embed URL (YouTube, Vimeo, Facebook Video)
  - Tags & Keywords (comma-separated or pill input)
  - Author selection (assign to any newsroom journalist or guest contributor)
  - Breaking News toggle & Breaking Ticker duration
  - Priority weight (Spotlight, Hero Lead, Top Story, Standard)
  - Scheduled Publishing (Date & Time picker with timezone indicator)
  - Custom Meta Title and Meta Description for Google Search & Discover

### 2.2. Categories & Taxonomy Manager (`CategoriesSettingsTab.tsx`)
- **Capabilities:**
  - Add, edit, reorder, and archive categories.
  - Custom category color accents (e.g., Red for Politics, Green for Sports, Blue for Tech).
  - Slug management and SEO category descriptions.
  - Parent/child category hierarchies (e.g., States > Uttar Pradesh > Lucknow).

### 2.3. E-Paper Management (`EpaperSettingsTab.tsx`)
- **Capabilities:**
  - Upload physical digital print editions as multi-page PDF or high-res WebP/JPEG images.
  - Manage regional editions (Delhi, UP, Bihar, MP, Rajasthan, Maharashtra).
  - Date stamping, volume number, issue number, and publication metadata.
  - Archive manager to retire older editions to cold storage or delete.

### 2.4. Media Library & Asset Manager (`MediaLibraryTab.tsx`)
- **Capabilities:**
  - Multi-file drag-and-drop upload.
  - Automatic image optimization, WebP conversion, and thumbnail generation.
  - Metadata tagging: Alt text, Caption, Photographer Credit, Copyright license.
  - Search media by keyword, upload date, and file format.
  - 1-click URL copy and instant insertion into the news editor.

### 2.5. Video & Web Stories Manager (`VideoSectionSettingsTab.tsx` / `WebStoriesTab.tsx`)
- **Capabilities:**
  - Manage YouTube playlists and standalone video articles.
  - Create vertical 9:16 Web Stories with multi-slide story builder (background image, heading, tap-to-read link, publisher logo).

### 2.6. Advertising & Monetization Engine (`SidebarAdConfigTab.tsx`, `HeaderFooterSettingsTab.tsx`)
- **Capabilities:**
  - **Ad Formats Supported:**
    1. Custom Image Banners (with click-through tracking and redirect URL).
    2. Google AdSense / Ad Exchange responsive script snippets.
    3. Custom HTML/JavaScript rich media tags.
  - **Placement Slots:**
    - Top Header Leaderboard (728x90 / 970x90).
    - In-Article Top (below featured image).
    - In-Article Middle (after paragraph 3/5).
    - Sidebar Sticky Ad (300x250 / 300x600).
    - Desktop Sticky Bottom Bar (with minimize and close controls).
    - Mobile Sticky Bottom Ad (with 56px bottom offset to prevent dock overlap).
    - Interstitial / Exit-intent popup slot (optional, toggleable).

### 2.7. Typography & Design Customizer (`TypographySettingsTab.tsx`)
- **Capabilities:**
  - Centralized typography control center for the entire website.
  - Font family selectors for Devanagari (Noto Sans Devanagari) and Latin (Noto Sans).
  - Fine-grained font size, weight (400, 500, 600, 700), line height, and letter spacing sliders for:
    - Article Headlines (H1)
    - Section Headings (H2, H3, H4)
    - Body Paragraphs
    - Deck / Lead Excerpts
    - Meta Text / Byline
  - Preset profiles: "Standard Editorial", "Compact Foxiz Style", "High Legibility Large", "Modern Clean".
  - Live preview sandbox showing both Hindi headlines and English body text simultaneously.

### 2.8. SEO, Google Suite & Search Console (`GoogleSuiteSettingsTab.tsx`, `AiSeoAssistantTab.tsx`)
- **Capabilities:**
  - Google Search Console verification meta tag injection.
  - Google Analytics 4 (GA4) Measurement ID (`G-XXXXXXXXXX`).
  - Google Tag Manager (GTM) Container ID.
  - Google News Publication ID & Publisher Center verification.
  - AI SEO Assistant for headline optimization, meta description generation, and keyword density auditing.

### 2.9. Speed & Core Web Vitals Manager (`SpeedWebVitalsTab.tsx`)
- **Capabilities:**
  - Real-time Core Web Vitals monitor (LCP, FID/INP, CLS).
  - Image lazy-loading toggle and preloading rules for LCP hero images.
  - Script loading optimizations (async/defer for third-party tags).
  - Cache policy inspector.

### 2.10. Layout & Homepage Sections Builder (`HomepageSectionsSettingsTab.tsx`, `SpotlightSettingsTab.tsx`)
- **Capabilities:**
  - Drag-and-drop homepage reordering of content blocks.
  - Enable/disable individual blocks: Breaking Ticker, Hero Grid, Trending Rail, Video Carousel, Regional News, Opinion/Editorial, Photo Gallery.
  - Grid density controls: Standard (3 columns), Dense (4 columns), Magazine (featured left + 2 right).

### 2.11. Header & Footer Customizer (`HeaderFooterSettingsTab.tsx`)
- **Capabilities:**
  - Topbar navigation toggle and ticker configuration.
  - Logo dimensions, margin, and mobile fallback text.
  - Menu builder: Add, remove, and reorder navigation items with direct URL or category binding.
  - Footer column builder: 4 customizable columns for Quick Links, Categories, Legal, and Contact info.
  - Copyright text and digital news compliance disclaimers.

### 2.12. Mobile Bottom Bar & Drawer Settings (`MobileFooterBarTab.tsx`, `MobileSidebarSettingsTab.tsx`)
- **Capabilities:**
  - Configure the 5 icons of the mobile bottom navigation dock.
  - Configure mobile drawer quick action items and social badges.

### 2.13. Team, Authors & Access Control (`UsersRolesSettingsTab.tsx`)
- **Capabilities:**
  - User role assignment: Admin, Chief Editor, Sub-Editor, Reporter.
  - Author bio management: Display name, Hindi name, designation, photo, Twitter/X handle, email.

### 2.14. API & External Credentials (`ApiConfigTab.tsx`)
- **Capabilities:**
  - Gemini AI API Key configuration for newsroom automation.
  - Weather API endpoint & key.
  - Cricket scorecard RSS/API feed configuration.
  - Secure credential storage (read-only masked display).

---

## 3. Setting-to-Frontend Parity Matrix

Every setting modified in the admin dashboard immediately syncs to the frontend:

| Admin Setting Section | Storage Target | Sync Method | Frontend Component Affected | Parity Status |
|:---|:---|:---|:---|:---:|
| **Typography (Font & Sizes)** | `localStorage:khabridost_typography` | CSS Variable Injection & Custom Event | All headings, body, and cards | **100% Synchronized** |
| **Header & Navigation Menus** | `localStorage:khabridost_nav_settings` | React Context / State Broadcast | `Header.tsx`, `Navigation.tsx`, `MobileDrawer.tsx` | **100% Synchronized** |
| **Footer & Compliance Text** | `localStorage:khabridost_footer_settings` | React Context / State Broadcast | `Footer.tsx` | **100% Synchronized** |
| **Homepage Section Ordering** | `localStorage:khabridost_layout_settings` | Dynamic section order array | `MainFeed.tsx` | **100% Synchronized** |
| **Ad Slots & Scripts** | `localStorage:khabridost_ad_settings` | Ad Renderer Component | `Header.tsx`, `Sidebar.tsx`, `Footer.tsx`, `ArticlePageView.tsx` | **100% Synchronized** |
| **Breaking News Ticker** | Firestore `articles` (where `isBreaking=true`) | Real-time query + fallback | `BreakingTicker.tsx` | **100% Synchronized** |
| **Google Suite IDs** | `localStorage:khabridost_google_suite` | DOM `<head>` script injector | `index.html` runtime tags | **100% Synchronized** |
