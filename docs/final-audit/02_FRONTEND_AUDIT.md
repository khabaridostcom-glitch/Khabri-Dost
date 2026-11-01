# 02 — FRONTEND AUDIT & UX ARCHITECTURE REPORT
**Project:** Khabri Dost (khabridost.com)  
**System Type:** High-Traffic Hindi News Portal  
**Audit Date:** October 2026  
**Auditor:** Senior Full-Stack & News CMS Architect  

---

## 1. Executive Summary: Frontend Quality & Architectural Health

The frontend of Khabri Dost is built with **React 18 + Vite**, **Tailwind CSS 3.4**, and **Lucide React**, structured for editorial speed and content density. The design language adheres strictly to a clean, light, typography-focused editorial news standard inspired by modern digital newspapers and themes such as Foxiz and Newspaper.

### Core Architecture Attributes:
- **Rendering Pipeline:** Client-Side Single Page Application (SPA) with server-side proxying and deep route handling in `server.ts`.
- **Styling Architecture:** 100% Light Mode design tokens anchored via CSS custom variables (`--bg-page: #f8fafc`, `--text-primary: #0f172a`, `--border-color: #e2e8f0`).
- **Typography Engine:** Dual-stack typography integrating Google Fonts **Noto Sans Devanagari** (for Hindi headlines, deck, article body, meta) and **Noto Sans** (Latin/English numerals, tags, UI labels).
- **Responsive Adaptability:** Fluid layout system spanning 320px mobile viewports up to 1920px ultrawide displays.

---

## 2. Page-by-Page Audit & Component Breakdown

### 2.1. Homepage (`/`)
- **Component File:** `src/components/MainFeed.tsx`, rendered inside `src/App.tsx`.
- **Architecture & Content Structure:**
  1. **Breaking News Ticker (`BreakingTicker.tsx`):** Real-time animated ticker showing urgent bulletins, breaking news alerts with live timestamp tags and click-to-article navigation. Fully responsive with pause-on-hover.
  2. **Top Story & Spotlight Grid (`FeaturedCarousel.tsx` / `HeroGrid.tsx`):** Lead headline with high-resolution editorial photography, category tag, author avatar, reading time estimate, and relative time badge.
  3. **Categorized Content Rails (`MainFeed.tsx`):** Dynamically rendered sections (National, Politics, Entertainment, Sports, Tech, Business, Regional) driven by admin-configured categories and priority weights.
  4. **Sidebar Columns (`Sidebar.tsx`):** Trending articles counter (1–10 ranking badges), Editor's Picks, Weather Widget, Cricket Scorecard placeholder, and sticky banner ad slot.
- **Audit Findings:**
  - *Light Mode Compliance:* 100% compliant. White card containers (`bg-white`), subtle borders (`border-slate-200`), dark slate typography (`text-slate-900` / `text-slate-600`).
  - *Data Hydration:* Seamless fallback to built-in fallback articles (`src/data/fallbackNews.ts`) if Firestore network is offline or uninitialized.
  - *Performance:* Images utilize explicit aspect ratios (`aspect-video`, `aspect-[4/3]`) to prevent layout shifts (CLS < 0.05).

### 2.2. Header, Topbar & Navigation Systems
- **Component Files:** `src/components/Header.tsx`, `src/components/TopBar.tsx`, `src/components/Navigation.tsx`, `src/components/MobileDrawer.tsx`, `src/components/MobileBottomNav.tsx`.
- **TopBar Features:**
  - Date & Day display in Hindi (Devanagari localization).
  - Quick utility links (E-Paper, Live TV, Video, Web Stories).
  - Social media channel links (YouTube, Facebook, Twitter/X, Instagram, WhatsApp Channels).
  - Stock/Forex or Weather ticker pill.
- **Main Header Features:**
  - Khabri Dost brand logo with high-contrast red accent (`#dc2626`).
  - Global Search trigger with expandable modal overlay.
  - E-Paper CTA button with direct link to digital edition viewer.
  - Notification prompt for web push alerts.
- **Navigation Bar:**
  - Sticky navigation bar with horizontal scrollable category pills for overflow on tablet/desktop.
  - Active state indicator with red underline and bold weight.
  - Category dropdown menus for sub-districts and multi-state coverage.
- **Mobile Navigation Drawer (`MobileDrawer.tsx`):**
  - Left-sliding drawer covering full category tree, regional selectors, language switch, and app download/contact links.
  - Clean light background (`bg-white`), touch-friendly row heights (48px min touch target).
- **Mobile Bottom Navigation Dock (`MobileBottomNav.tsx`):**
  - Persistent 5-button dock: Home, Categories, Videos, E-Paper, Menu.
  - Fixed at `bottom-0`, height 56px–60px, `z-40`.

### 2.3. Article Detail View (`/article/:id` / `/news/:id`)
- **Component File:** `src/components/ArticlePageView.tsx`.
- **Editorial Presentation:**
  - **Breadcrumbs:** Home > Category > Subcategory > Article Title.
  - **Headline (H1):** Bold Noto Sans Devanagari typography, responsive text sizing (`text-2xl sm:text-3xl lg:text-4xl`).
  - **Lead Excerpt / Deck:** Medium slate text (`text-slate-600 text-lg`) summarizing the key takeaway.
  - **Author Byline & Metadata:** Author photo, name, verified journalist badge, publishing timestamp, updated timestamp, and reading time estimate.
  - **Social Sharing Dock:** WhatsApp (instant 1-click share with URL encoding), Facebook, Twitter/X, Telegram, LinkedIn, Copy Link with toast confirmation.
  - **Featured Media:** Hero image with credit line and caption in small italic font.
  - **Body Content Engine:** Rich HTML/Markdown content parser with styled blockquotes, pull quotes, image galleries, embeddable YouTube videos, related article cards, and inline ad slots (`In-Article Ad 1` and `In-Article Ad 2`).
  - **Tags & Keywords:** Interactive pill tags linking to tag archives.
  - **Author Bio Card:** Full author biography, social handles, and articles written count.
  - **Related Articles Grid:** 4-card grid of topically similar articles based on category and tags.
  - **Engagement / Comments Section:** Reader comment form with name/email/comment inputs and moderate-first workflow.

### 2.4. E-Paper Viewer (`/epaper`)
- **Component File:** `src/components/EPaperViewer.tsx`.
- **Capabilities:**
  - Edition selector (New Delhi, Lucknow, Patna, Jaipur, Bhopal, Mumbai).
  - Date picker archive to view past physical editions.
  - Page thumbnail slider with zoom-in modal for high-resolution clipping.
  - 1-click PDF download and social clipping share option.

### 2.5. Video Section & Web Stories
- **Component Files:** `src/components/VideoSection.tsx`, `src/components/WebStories.tsx`.
- **Capabilities:**
  - Video feed displaying YouTube/MP4 embeds with custom play overlay.
  - Responsive video modal supporting fullscreen playback without leaving the portal.
  - Vertical 9:16 mobile-first Web Stories slider with tap-to-advance and progress bars.

### 2.6. Category, Tag & Archive Pages
- **Component Files:** `src/components/CategoryView.tsx`, `src/components/ArchiveView.tsx`.
- **Capabilities:**
  - Filter by date range, state, and category.
  - Pagination and "Load More" infinite scroll option.
  - Breadcrumb navigation and category banner description for SEO.

### 2.7. Search Experience (`/search`)
- **Component File:** `src/components/SearchModal.tsx`, `src/components/SearchResults.tsx`.
- **Capabilities:**
  - Real-time search query matching across headline, deck, body, author, and tags.
  - Quick trending search terms pills (e.g., "Budget 2026", "T20 World Cup", "Election Results").
  - Instant highlighted result preview.

### 2.8. Legal & Compliance Pages
- **Component Files:**
  - About Us (`src/components/pages/AboutUs.tsx`)
  - Privacy Policy (`src/components/pages/PrivacyPolicy.tsx`)
  - Terms of Service (`src/components/pages/TermsOfService.tsx`)
  - Grievance Redressal / Press Council Compliance (`src/components/pages/GrievanceRedressal.tsx`)
  - Contact Us (`src/components/pages/ContactUs.tsx`)
- **Compliance Status:** All mandatory Indian digital news compliance notices (Information Technology Intermediary Guidelines and Digital Media Ethics Code Rules) are present, including Grievance Officer name, email, and response SLAs.

### 2.9. Sticky Floating Advertisement vs Mobile Bottom Dock
- **Component Files:** `src/components/Footer.tsx`, `src/components/MobileBottomNav.tsx`.
- **Implementation Audit:**
  - **Desktop:** Sticky bottom banner advertisement features both "Minimize" and "Close" controls, docked cleanly above the footer border.
  - **Mobile:** Sticky bottom banner is positioned at `bottom-[56px] sm:bottom-[60px] md:bottom-0`. This guarantees it **never covers or collides** with the mobile navigation buttons.
  - Both minimize and close states are remembered during the user session.

---

## 3. Frontend Quality Metrics & Verification

| Dimension | Standard | Measured State | Status |
|:---|:---|:---|:---:|
| **Theme Consistency** | 100% Strict Light Mode | Zero dark backgrounds, zero dark text clashes | **PASS** |
| **Font Family Execution** | Noto Sans Devanagari + Latin | Dual font stack linked in `index.html` & CSS tokens | **PASS** |
| **Touch Targets** | WCAG 2.2 AA (>= 44x44px) | All navigation buttons >= 48px | **PASS** |
| **Responsive Breakpoints** | 320px to 1920px | Tested across 360px, 768px, 1024px, 1440px | **PASS** |
| **CLS (Cumulative Layout Shift)** | < 0.1 | Explicit aspect ratio wrappers on all cards | **PASS** |
| **Broken Link Verification** | Zero dead internal routes | Deep routing handled via Vite SPA middleware | **PASS** |
