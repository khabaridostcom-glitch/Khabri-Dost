# 07 — Gap Register, Defects & Prioritized Recommendations
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Actionable, evidence-based defect register categorizing confirmed bugs, architectural bloat, missing endpoints, and prioritized solutions.
**Governing Rule:** *SIMPLIFY BEFORE ADDING.*

---

## 1. Classification Methodology

- **P0 (Blocker / Critical):** Severe defects breaking core functionality, conflicting styling systems, or structural security risks.
- **P1 (High Priority):** Major architectural duplications, missing standard SEO endpoints, or significant UX impediments.
- **P2 (Medium Priority):** Polish, label cleanups, code refactoring to reduce bundle size, or workflow enhancements.
- **P3 (Low Priority / Nice-to-Have):** Future micro-optimizations, non-blocking aesthetic tweaks.

---

## 2. Comprehensive Defect & Gap Register

### 2.1 Broken Functionality

#### [P0-01] The Known Font Bug: Specificity Collision in `src/index.css`
- **Location:** `src/index.css` (lines 56–61) & `src/components/ArticlePageView.tsx` (line 1112).
- **Evidence:** `.font-kd-headline` declares `font-size: calc(1em * var(--size-heading-scale, 1) * var(--size-homepage-title-scale, 1)) !important;`. The `!important` rule overrides inline styles on `<h1 style={{ fontSize: ... }}>`, preventing font changes and resets from updating the visual H1 size reliably.
- **Impact:** Headline typography controls and font resets appear non-functional or inconsistent to administrators.
- **Recommended Solution:** Remove the `!important` declaration from `.font-kd-headline` in `src/index.css`. Standardize typography cascading so `portalSettings.typography.articleTitleDesktopPx` serves as the sole source of truth.
- **Priority:** **P0**.

#### [P0-02] Font Reset Desynchronization between CSS Variables & React State
- **Location:** `src/utils/cssDefaults.ts` vs. `src/data/portalDefaults.ts`.
- **Evidence:** `handleResetTypography` calls `resetRootCssVariablesToDefault()`, which sets `--font-headline` to `'Rozha One'` and `--size-heading-scale` to `'1'` (which computes to `16px * 1 = 16px`), whereas `portalDefaults.ts` defines `headlineFont: "'Mukta'"` and `articleTitleDesktopPx: 32`.
- **Impact:** Resetting fonts collapses or misaligns headings between different views.
- **Recommended Solution:** Align `INDEX_CSS_ROOT_VARIABLES` in `cssDefaults.ts` precisely with `DEFAULT_PORTAL_SETTINGS.typography` and bind React state directly to CSS custom properties.
- **Priority:** **P0**.

---

### 2.2 Missing Features

#### [P1-01] Missing Dedicated Google News XML Sitemap (`/news-sitemap.xml`)
- **Location:** `server.ts`.
- **Evidence:** Prior documentation asserted that `/news-sitemap.xml` exists. Code inspection of `server.ts` confirms **only `/sitemap.xml` is implemented**. No route exists for `GET /news-sitemap.xml`.
- **Impact:** Google News crawlers require a specialized news sitemap containing `<news:news>`, `<news:publication>`, and `<news:publication_date>` limited to articles published in the preceding 48 hours. Without this endpoint, Google News inclusion is degraded.
- **Recommended Solution:** Implement an explicit Express route in `server.ts` for `GET /news-sitemap.xml` that queries the latest 48-hour published articles and renders valid Google News XML.
- **Priority:** **P1**.

#### [P1-02] Missing RSS 2.0 Syndication Feed (`/rss.xml`)
- **Location:** `server.ts`.
- **Evidence:** No route for `/rss.xml` exists in `server.ts`.
- **Impact:** News aggregators, RSS readers, and automated syndication feeds cannot consume portal updates.
- **Recommended Solution:** Implement `GET /rss.xml` in `server.ts` outputting standard RSS 2.0 with `<item>` elements.
- **Priority:** **P1**.

---

### 2.3 Duplicate or Overcomplicated Features (Overbuild)

#### [P1-03] Triple Redundant Admin & Publishing Interfaces
- **Location:** `src/components/AdminBackendPanel.tsx` (3,085 lines), `src/components/PublisherCMS.tsx` (1,665 lines), `src/components/AdminSettingsModal.tsx` (1,720 lines), and `src/components/AdminFrontendCustomizerBar.tsx`.
- **Evidence:** Three massive, separate components independently implement article drafting, category selection, typography controls, and settings management.
- **Impact:** Code bloat (6,400+ lines of duplicate logic), synchronization errors between different modals, and developer confusion.
- **Recommended Solution:** Completely consolidate all publishing, editing, and configuration tools into `AdminBackendPanel.tsx`. Safely deprecate and remove `PublisherCMS.tsx`, `AdminSettingsModal.tsx`, and `AdminFrontendCustomizerBar.tsx`.
- **Priority:** **P1**.

---

### 2.4 Features Needing Improvement (UI/UX)

#### [P2-01] Bilingual Admin Sidebar Labels
- **Location:** `src/components/AdminBackendPanel.tsx`.
- **Evidence:** Sidebar items include dual Hindi/English labels like `Typography (टाइपोग्राफी)`, `Ad Management (विज्ञापन)`.
- **Impact:** Creates visual clutter, awkward wrapping, and does not match standard WordPress administrative design.
- **Recommended Solution:** Convert all administrative sidebar labels to clean, concise English (*Dashboard*, *Posts*, *Media*, *Appearance*, *Settings*).
- **Priority:** **P2**.

#### [P2-02] Heavy Dark Gradients in Admin Panels
- **Location:** `AdminBackendPanel.tsx` and child admin tabs.
- **Evidence:** Frequent use of `bg-gradient-to-r from-slate-900 to-slate-800` across cards, headers, and control panels.
- **Impact:** Visually heavy, tiring for prolonged editorial work, and inconsistent with the requested clean light-mode direction.
- **Recommended Solution:** Refactor admin styling to an airy, light theme using clean white (`#ffffff`), soft slate backgrounds (`#f8fafc`), and minimal gray borders (`#e2e8f0`).
- **Priority:** **P2**.

#### [P2-03] Cluttered Article Editor Settings Layout
- **Location:** `AdminBackendPanel.tsx` (`new_article` tab).
- **Evidence:** SEO, scheduling, categories, tags, and featured images are stacked vertically beneath the main text editor.
- **Impact:** Editors must perform excessive scrolling to reach publishing controls.
- **Recommended Solution:** Adopt a WordPress Gutenberg two-column layout: Left column for Headline and Content; Right sticky sidebar with collapsible cards for *Publish Status*, *Categories*, *Featured Image*, and *SEO Metadata*.
- **Priority:** **P2**.

---

### 2.5 Security, Verification & Responsive Findings

#### [P0-03] Strict Brand Name Standardization ("Khabri Dost")
- **Location:** `firestore.rules`, email fallbacks, and templates.
- **Evidence:** Legacy variations like "Khabari Dost" appear in some fallback strings and email regexes in `firestore.rules` (e.g., `khabaridost.com@gmail.com`).
- **Impact:** Brand confusion and minor inconsistency in search engine snippets.
- **Recommended Solution:** Standardize all user-facing copy, logos, and metadata strictly to **Khabri Dost** while preserving legacy authentication email aliases in backend security checks.
- **Priority:** **P0**.

#### [P2-04] Responsive Font Size Clamping on Mobile Devices
- **Location:** `src/components/ArticlePageView.tsx`.
- **Evidence:** Inline font size uses a flat `articleTitleDesktopPx` without mobile media queries.
- **Impact:** Headlines on small devices (320px–360px) can wrap excessively, pushing content below the fold.
- **Recommended Solution:** Use a responsive CSS clamp: `fontSize: clamp(24px, 5vw, 32px)`.
- **Priority:** **P2**.
