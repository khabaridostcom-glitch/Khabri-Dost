# 09 — Critical Files for External Independent Audit
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Curated checklist of critical files for independent architects, peer reviewers, and QA auditors.

---

## 1. Overview for the External Auditor

This document provides a prioritized catalog of the source files that an independent senior software architect or QA engineer should inspect to verify the health, security, typography, and architecture of **Khabri Dost** (`khabridost.com`).

---

## 2. Tier 1: Core Architecture, Critical Defects & Security (10 Files)

These 10 files contain the foundation of the platform and the root causes of reported bugs.

### 1. `/src/index.css`
- **Why It Matters:** Contains the `.font-kd-headline` utility class with `!important` on `font-size` (lines 56–61) that overrides inline React heading styles.
- **Auditor Focus:** Verify stylesheet specificity hierarchy and identify conflicting custom property definitions.

### 2. `/src/components/ArticlePageView.tsx`
- **Why It Matters:** Single news article page (2,137 lines). Manages H1 headline rendering, inline editorial headline edits, social sharing, audio playback, comments, and in-article ad units.
- **Auditor Focus:** Inspect line 1112 for H1 inline styling and lack of mobile responsive clamping (`clamp()`).

### 3. `/src/utils/cssDefaults.ts`
- **Why It Matters:** Contains `INDEX_CSS_ROOT_VARIABLES` and `resetRootCssVariablesToDefault()`.
- **Auditor Focus:** Inspect how resetting `--font-headline` to `'Rozha One'` and `--size-heading-scale` to `'1'` conflicts with React state in `portalDefaults.ts`.

### 4. `/src/data/portalDefaults.ts`
- **Why It Matters:** Canonical source of default settings (`DEFAULT_PORTAL_SETTINGS`), default typography (`articleTitleDesktopPx: 32`), and baseline categories.
- **Auditor Focus:** Verify default font family and ensure baseline sizes match editorial standards.

### 5. `/src/components/AdminBackendPanel.tsx`
- **Why It Matters:** Primary WordPress-style administrative panel (3,085 lines). Houses the 260px sidebar and all 32 management tabs.
- **Auditor Focus:** Evaluate dark gradient styling vs. proposed light-mode refactor; verify bilingual labels needing English standardization.

### 6. `/src/components/admin/TypographySettingsTab.tsx`
- **Why It Matters:** Dedicated admin tab for typography controls, font family selection, and reset triggers.
- **Auditor Focus:** Inspect `handleResetTypography` (line 37) and how font preset changes propagate to the application state.

### 7. `/server.ts`
- **Why It Matters:** Express backend server running on port 3000 (1,207 lines). Implements security hardening, rate limiting, SSR bot meta tag injection, and API proxies.
- **Auditor Focus:** Verify the absence of `/news-sitemap.xml` and `/rss.xml`; audit rate-limiting effectiveness.

### 8. `/src/App.tsx`
- **Why It Matters:** Master application orchestrator (2,546 lines). Manages global state, view routing (`home`, `article`, `live-feed`, etc.), and Firestore real-time subscriptions.
- **Auditor Focus:** Audit state management complexity and plan decomposition into custom React hooks.

### 9. `/src/services/newsService.ts`
- **Why It Matters:** Client-side Firestore database layer (1,098 lines). Implements CRUD for `articles`, `settings/portal_config`, `media`, and `live_blogs`.
- **Auditor Focus:** Verify error-handling boundaries and `localStorage` offline fallback integrity.

### 10. `/firestore.rules`
- **Why It Matters:** 176 lines of production Firestore security rules.
- **Auditor Focus:** Verify that public write permissions are strictly blocked; audit the atomic view/like increment exception.

---

## 3. Tier 2: Redundant Components & Secondary Modules (10 Files)

These files represent secondary features or duplicate components identified for deprecation or consolidation:

1. **`/src/components/PublisherCMS.tsx` (1,665 lines):** Alternate publishing modal duplicating `AdminBackendPanel.tsx`. Candidate for deprecation.
2. **`/src/components/AdminSettingsModal.tsx` (1,720 lines):** Alternate appearance modal duplicating `AdminBackendPanel.tsx`. Candidate for deprecation.
3. **`/src/components/AdminFrontendCustomizerBar.tsx`:** Floating live frontend toolbar. Candidate for deprecation.
4. **`/src/types/news.ts` (755 lines):** Universal TypeScript interfaces. Check alignment with Firestore fields.
5. **`/src/components/Header.tsx`:** Public header, breaking news ticker, and navigation. Check mobile responsiveness.
6. **`/src/components/Footer.tsx`:** Multi-column footer and legal disclaimer links.
7. **`/src/components/admin/GoogleSuiteSettingsTab.tsx`:** GA4, GTM, and Search Console credential inputs.
8. **`/src/components/admin/SEOAuditTab.tsx`:** Technical SEO and sitemap sync triggers.
9. **`/src/components/admin/CitizenSubmissionsTab.tsx`:** Review desk for reader-submitted news leads.
10. **`/src/components/admin/SpeedWebVitalsTab.tsx`:** Core Web Vitals monitor.

---

## 4. Tier 3: Configuration & Environment Files (5 Files)

1. **`/package.json`:** Dependencies (`react` 19, `express` 4, `@google/genai`, `tailwindcss` 4).
2. **`/vite.config.ts`:** Vite bundling and development server setup.
3. **`/firebase-applet-config.json`:** Provisioned Firebase project parameters.
4. **`/index.html`:** Google Fonts preconnect tags, PWA headers, and root DOM mount point.
5. **`/metadata.json`:** Applet title, permissions, and server capabilities.

---

## 5. Security & Safe Sharing Protocol

When sharing files with an external reviewer:
- **Never Share Live Secrets:** Ensure `.env` or any production service account keys are excluded.
- **Client Configuration Safety:** `firebase-applet-config.json` contains public client project IDs and is safe to share because all write operations are gated behind `firestore.rules`.
- **Read-Only Inspection:** Reviewers should follow the principle of discovery first before proposing or executing code modifications.
