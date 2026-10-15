# 00 — Executive Summary & System Discovery
**Project:** Khabri Dost (खबरी दोस्त)  
**Domain:** `khabridost.com`  
**Environment:** Google AI Studio (Asia-East1 Cloud Run Container)  
**Audit Date:** October 2026  
**Auditor Role:** Senior Software Architect, Full-Stack Engineer, News CMS Specialist, UI/UX Auditor, SEO Engineer & QA Analyst  
**Audit Mode:** Discovery & Technical Audit Only (Zero Code/DB Modifications)

---

## 1. Executive Synopsis

**Khabri Dost** (`khabridost.com`) is a full-stack, enterprise-scale Hindi digital news portal and content management system (CMS). The platform is engineered to deliver high-velocity Hindi news publishing, editorial workflow automation, live breaking news coverage, digital e-paper distribution, citizen journalism submissions, multimedia broadcasting, and monetization management.

This technical discovery was conducted by directly inspecting the physical source tree, runtime entry points (`server.ts`, `src/App.tsx`), database interaction layers (`src/services/newsService.ts`), security configurations (`firestore.rules`), stylesheet rules (`src/index.css`), and administrative management interfaces (`src/components/AdminBackendPanel.tsx`, `src/components/PublisherCMS.tsx`, `src/components/AdminSettingsModal.tsx`).

### Core Discovery Verdict
1. **Actual Technology Stack [VERIFIED]:**
   - **Frontend:** React 19.0.0, TypeScript 5.8.2, Tailwind CSS 4.0.0, Vite 6.2.0, Lucide React 1.16.0 (300+ vector icons), Canvas Confetti 1.9.4.
   - **Backend:** Node.js 20+ runtime, Express.js 4.21.2 server mounted on port 3000 (`server.ts`).
   - **Database & Authentication:** Google Cloud Firestore (multi-collection NoSQL store) + Firebase Authentication (Email/Password + RBAC custom claim checks).
   - **AI Content Engine:** Google Generative AI SDK (`@google/genai` v0.1.2) utilizing the `gemini-2.5-flash` / Gemini 3.8 Flash model via secure server-side proxy routes.
   - **State & Caching:** React 19 local hooks + dual-layer persistence (`localStorage` instant offline bootstrap + Firestore real-time `onSnapshot` listeners).

2. **Structural Scale & Modules Discovered [VERIFIED]:**
   - **Total Frontend Source Files:** 45+ components and utilities across `src/components/`, `src/components/admin/`, `src/components/widgets/`, `src/utils/`, and `src/services/`.
   - **Public Routed Views:** 8 distinct view states (`home`, `article`, `live-feed`, `contact`, `about`, `legal`, `submit-news`, `archive`) orchestrated in `src/App.tsx`.
   - **Administrative Modules:** 32 distinct sub-modules grouped under 5 WordPress-style parent menu sections (`dashboard`, `news`, `media`, `appearance`, `settings`) in `AdminBackendPanel.tsx`, plus 2 legacy/competing CMS interfaces (`PublisherCMS.tsx`, `AdminSettingsModal.tsx`).
   - **Server Endpoints:** 15 distinct Express HTTP routes implemented in `server.ts`.
   - **Firestore Collections:** 8 active collections accessed via `newsService.ts` and governed by 176 lines of security rules in `firestore.rules`.

---

## 2. Status Classification Matrix

| System Domain | Status | Key Verified Findings |
|---|---|---|
| **Public News Delivery** | **VERIFIED WORKING** | Real-time article rendering, category navigation, breaking ticker, social share, reader engagement (views, likes, comments, reactions), and offline caching. |
| **Backend Express Server** | **VERIFIED WORKING** | Express running on port 3000, in-memory rate limiting (80 req/min), XSS sanitization, dynamic bot meta tag injection, and static distribution. |
| **Firestore Database & Rules** | **VERIFIED CONFIGURED** | Strict `firestore.rules` enforcing admin email checks, valid string/length constraints on articles, and atomic view/like increments. |
| **AI Content Automation** | **PARTIALLY CONFIGURED** | Server endpoints `/api/ai/generate-seo-meta` and `/api/ai/draft-article-seo` implemented with intelligent fallback generators when `GEMINI_API_KEY` is absent. |
| **Global Typography System** | **DEFECTIVE / CONFLICTING** | **Known Font Bug Confirmed:** 3 competing styling systems (`index.css` `!important` rules, `:root` CSS variables in `cssDefaults.ts`, and `portalSettings.typography` in React state). |
| **Administrative UX & Theme** | **OVERCOMPLICATED / DUPLICATIVE** | 3 separate admin/publishing panels exist simultaneously (`AdminBackendPanel.tsx`, `PublisherCMS.tsx`, `AdminSettingsModal.tsx`). Dense bilingual labels require English-only standardization. |
| **Google Suite & Analytics** | **CONFIGURED (UNVERIFIED)** | Admin inputs exist for GA4 (`G-XXXXXXXXXX`), GTM (`GTM-XXXXXXX`), and Search Console tokens, but runtime tracking scripts are injected dynamically and unverified in headless audit. |
| **XML Sitemaps** | **PARTIALLY CONFLICTING** | `/sitemap.xml` is implemented in `server.ts`. However, previous docs claimed `/news-sitemap.xml` and `/rss.xml` exist as server routes, which is **FALSE** (they do not exist in `server.ts`). |
| **Push Notifications** | **PARTIAL / MOCK** | UI and schema exist for notifications; backend OneSignal dispatch logic requires credentials verification. |

---

## 3. Discovered Documentation Conflicts (Code vs. Prior Docs)

An essential discovery finding: **Existing documentation in `/docs` contains factual contradictions with the actual codebase**:

1. **Firestore Collections:**
   - *Prior Docs claim:* Collections named `portal_settings`, `staff_members`, `live_news`, `epaper_editions`, `ad_slots`.
   - *Actual Code (`newsService.ts` & `firestore.rules`):* The collection for portal settings is named **`settings`** (document ID: `portal_config`). Live events are stored in **`live_blogs`**. Editorial users are stored in **`users`** with role properties. Ads and e-paper are embedded within `portal_config` inside `settings` or held in `localStorage`.
2. **Server XML Endpoints:**
   - *Prior Docs claim:* Server exposes `GET /news-sitemap.xml` and `GET /rss.xml`.
   - *Actual Code (`server.ts`):* Lines 1061–1170 implement only `GET /sitemap.xml` and `GET /robots.txt`. Dedicated `/news-sitemap.xml` and `/rss.xml` endpoints are **NOT present** in `server.ts`.
3. **AI Proxy Endpoints:**
   - *Prior Docs claim:* Server has `POST /api/gemini/summarize` and `POST /api/gemini/headline-suggestions`.
   - *Actual Code (`server.ts`):* The actual endpoints are `POST /api/ai/generate-seo-meta`, `POST /api/ai/draft-article-seo`, `POST /api/ai/generate-trend-article`, and `POST /api/ai/generate-news-image`.
4. **H1 Title Font Reset:**
   - *Prior Docs claim:* Font reset reliably sets H1 to 32px across the board.
   - *Actual Code:* `src/index.css` line 59 contains `.font-kd-headline { font-size: calc(1em * var(--size-heading-scale, 1) * var(--size-homepage-title-scale, 1)) !important; }`. This `!important` stylesheet rule overrides inline styles in certain rendering branches, explaining why resetting fonts failed to update the visual presentation reliably.

---

## 4. Key Recommendations Summary

1. **Eliminate CSS Specificity Wars (Priority P0):** Remove `!important` font-size rules from `.font-kd-headline` in `src/index.css` and unify the font engine around a single source of truth.
2. **Consolidate CMS Architecture (Priority P0):** Deprecate duplicate CMS components (`PublisherCMS.tsx` and `AdminSettingsModal.tsx`), directing all editorial functions into `AdminBackendPanel.tsx`.
3. **Refactor Admin to Clean Light Mode (Priority P1):** Replace heavy dark gradients and bilingual labels with an English-only, WordPress-standard light theme (`#ffffff` canvas, slate-100/200 borders).
4. **Implement Missing Google News & RSS Endpoints (Priority P1):** Add explicit Express routes for `GET /news-sitemap.xml` and `GET /rss.xml` to fulfill Google News Publisher requirements.
5. **Brand Consistency (Priority P0):** Ensure strict adherence to **Khabri Dost** across all email templates, fallbacks, and schema objects (purging legacy "Khabari Dost" references).
