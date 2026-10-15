# 08 — Implementation Planning Inputs & Phased Roadmap
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Strategic engineering sequence, safety guardrails, testing protocols, and rollback mechanisms for future development.
**Governing Rule:** *No implementation changes during this turn; planning inputs only.*

---

## 1. Phased Implementation Roadmap

When authorized to begin modifications, work should proceed in 4 strictly sequential phases to avoid regression and maintain system stability:

```
[Phase 1: Foundation & Typography Stabilization]
  ├── Remove !important specificities from src/index.css
  ├── Unify cssDefaults.ts with portalDefaults.ts
  └── Lock H1 to 32px (Desktop) & 24-26px (Mobile clamp)
           │
           ▼
[Phase 2: Administrative Consolidation & Light Mode]
  ├── Retire PublisherCMS.tsx & AdminSettingsModal.tsx
  ├── Clean English-only sidebar labels in AdminBackendPanel.tsx
  └── Implement WordPress-style light mode (#ffffff / slate-100)
           │
           ▼
[Phase 3: Editorial Gutenberg-Style Layout]
  ├── Refactor Article Editor into 2 columns (Content Left, Settings Right)
  ├── Group metadata into collapsible cards (SEO, Categories, Image)
  └── Streamline AI writing assistant integration
           │
           ▼
[Phase 4: Missing SEO Endpoints & Production Polish]
  ├── Implement GET /news-sitemap.xml (Google News XML) in server.ts
  ├── Implement GET /rss.xml in server.ts
  └── Final multi-device responsive verification & QA signoff
```

---

## 2. Granular Phase Details

### Phase 1: Foundation & Typography Stabilization (Priority P0)
- **Objective:** Fix the known font bug so font size changes and resets behave predictably across all devices.
- **Prerequisites:** None.
- **Specific Actions:**
  1. In `src/index.css`, remove `!important` from `.font-kd-headline`'s `font-size`.
  2. In `src/utils/cssDefaults.ts`, align `INDEX_CSS_ROOT_VARIABLES` with `DEFAULT_PORTAL_SETTINGS.typography` (`articleTitleDesktopPx: 32`, `headlineFont: "'Mukta', sans-serif"`).
  3. In `src/components/ArticlePageView.tsx`, implement a responsive CSS clamp:
     ```tsx
     fontSize: `clamp(24px, 4.5vw, ${portalSettings.typography?.articleTitleDesktopPx || 32}px)`
     ```
  4. Verify that "Reset Fonts" instantly restores the canonical 32px headline in the UI and synchronizes with Firestore.

---

### Phase 2: Administrative Consolidation & Light Mode (Priority P1)
- **Objective:** Eliminate redundant CMS panels and create a clean, modern, WordPress-like administrative experience.
- **Prerequisites:** Phase 1 complete.
- **Specific Actions:**
  1. Audit all triggers opening `PublisherCMS.tsx` and `AdminSettingsModal.tsx` in `src/App.tsx` and `src/components/Header.tsx`, redirecting them exclusively to `AdminBackendPanel.tsx`.
  2. Deprecate the redundant component files, shedding ~3,300 lines of dead code.
  3. Refactor `AdminBackendPanel.tsx` styling:
     - Replace dark slate gradients (`from-slate-900 to-slate-800`) with clean white (`bg-white`) and soft gray (`bg-slate-50`).
     - Standardize all sidebar labels into clean English.

---

### Phase 3: Editorial Gutenberg-Style Layout (Priority P1 / P2)
- **Objective:** Reorganize the news creation workflow for maximum editorial velocity.
- **Prerequisites:** Phase 2 complete.
- **Specific Actions:**
  1. Restructure `new_article` in `AdminBackendPanel.tsx` into a 2-column layout:
     - **Left Column (70%):** Article Headline, Slug, 3-point AI summary, and Rich WYSIWYG editor.
     - **Right Column (30%):** Sticky collapsible panels for *Publishing Actions*, *Category & Subcategory*, *Featured Image & Watermark*, and *SEO Metadata*.

---

### Phase 4: Missing SEO Endpoints & Production Polish (Priority P1 / P2)
- **Objective:** Meet 100% of Google News and news syndication technical standards.
- **Prerequisites:** Phase 1–3 complete.
- **Specific Actions:**
  1. Add `GET /news-sitemap.xml` to `server.ts` to output compliant `<news:news>` XML for articles published within the last 48 hours.
  2. Add `GET /rss.xml` to `server.ts` for standard RSS 2.0 readers.
  3. Execute multi-breakpoint responsive testing (320px to 1440px) to verify zero clipping, horizontal scroll, or typography overlap.

---

## 3. Safety Guardrails & Rollback Strategy

1. **Zero Database Disruption:** No data migration scripts should touch existing article documents in Firestore. All schema enhancements must remain backward-compatible with legacy fields.
2. **Offline Fallback Preservation:** `localStorage` caching logic in `newsService.ts` must never be bypassed, ensuring the portal continues to render if Firestore network latency spikes.
3. **Compile & Lint Verification:** Every incremental code edit must be validated with `compile_applet` and `lint_applet` to maintain zero TypeScript errors.
4. **Git Checkpoints:** Atomic commits should follow each phase completion to enable instantaneous rollback if an unexpected regression occurs.
