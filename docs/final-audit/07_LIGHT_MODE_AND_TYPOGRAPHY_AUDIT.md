# 07 — LIGHT MODE & TYPOGRAPHY ARCHITECTURE AUDIT
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Editorial News Portal & CMS  
**Audit Date:** October 2026  
**Auditor:** Senior Design Systems & Typography Engineer  

---

## 1. Mandatory 100% Strict Light Mode Implementation

### 1.1. Core Directive & Rationale
News readers demand high-contrast, clean, paper-like reading surfaces that maximize editorial credibility and legibility. Khabri Dost strictly enforces a **100% Light Mode standard** across all public-facing screens and internal administrative modules. Dark Mode is completely prohibited.

### 1.2. Design System Tokens & Global CSS Enforcement
In `src/index.css`, system-level dark mode triggers have been completely excised and replaced with immutable light mode tokens:

```css
:root {
  color-scheme: light !important;
  --bg-page: #f8fafc;        /* Slate-50 background for subtle depth */
  --bg-card: #ffffff;        /* Pure white card backgrounds */
  --text-primary: #0f172a;   /* Slate-900 for maximum readability */
  --text-secondary: #475569; /* Slate-600 for decks and metadata */
  --border-color: #e2e8f0;   /* Slate-200 subtle divider line */
  --brand-red: #dc2626;      /* Khabri Dost primary brand red */
  --brand-red-hover: #b91c1c;
}

body {
  background-color: var(--bg-page);
  color: var(--text-primary);
  font-family: 'Noto Sans Devanagari', 'Noto Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 1.3. Comprehensive Admin Header Banner Modernization
All 15 administrative modules previously utilizing dark slate banners (`bg-slate-900`) have been audited and upgraded to clean, high-contrast light mode containers:
- `SpeedWebVitalsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `TypographySettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800` (presets: `bg-slate-50 border-slate-200`)
- `GoogleTrendsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `GoogleSuiteSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `SpotlightSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `HomepageSectionsSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `MobileSidebarSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `ArticleWidgetsSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `SidebarAdConfigTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `MobileFooterBarTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `ArticleMetaSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `ApiConfigTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `AiSeoAssistantTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `HeaderFooterSettingsTab.tsx` -> `bg-white border border-slate-200 text-slate-800`
- `AiSeoAssistantModule.tsx` -> `bg-white border border-slate-200 text-slate-800`

### 1.4. Footer Theme Sanitization
- In `src/types/news.ts` and `src/components/admin/HeaderFooterSettingsTab.tsx`, the default `footerTheme` was updated from `'dark'` to `'light'`.
- All legacy dark presets (`bg-slate-900 text-white`) were eliminated, ensuring the footer renders on a crisp `#f8fafc` / `#ffffff` card with slate dividers and readable charcoal text.

---

## 2. Complete Noto Sans Font Library & Typography Architecture

### 2.1. Dual-Stack Typography Strategy
Devanagari script requires specialized vertical metric accommodations due to ascenders (matras like ो, ै, ी, ौ) and descenders (ु, ू, ृ). Standard Latin fonts or poorly engineered system fonts cause matra clipping, uneven line rhythms, and eye fatigue.

Khabri Dost deploys Google Fonts' official package:
1. **Noto Sans Devanagari:**
   - **Weights Loaded:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).
   - **Role:** Article headlines, H1–H4 headings, subheadings, article excerpts/decks, body paragraphs, category pills, author names, and image captions.
2. **Noto Sans (Latin):**
   - **Weights Loaded:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).
   - **Role:** English news copy, numerals, dates, time badges, tag slugs, URL breadcrumbs, and Admin Panel navigation.

### 2.2. Heading Hierarchy & Matra Clearance Standards
To eliminate matra truncation, all heading levels enforce generous line-height ratios:

| Element | Tag | Desktop Size | Mobile Size | Line-Height | Font-Weight |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Article Main Headline** | `H1` | 36px – 40px | 24px – 28px | `leading-[1.35]` (54px) | 700 / 800 Bold |
| **Major Section Heading** | `H2` | 28px – 32px | 20px – 22px | `leading-[1.4]` (42px) | 700 Bold |
| **Card / Sub-Section Heading** | `H3` | 20px – 24px | 18px – 20px | `leading-[1.45]` (32px) | 600 SemiBold |
| **Sidebar / Minor Heading** | `H4` | 16px – 18px | 15px – 16px | `leading-[1.5]` (26px) | 600 SemiBold |
| **Deck / Lead Excerpt** | `p.deck` | 18px | 16px | `leading-[1.6]` (28px) | 500 Medium |
| **Article Body Paragraphs** | `p` | 17px – 18px | 16px | `leading-relaxed` (1.75)| 400 Regular |

### 2.3. Typography Customizer Module (`TypographySettingsTab.tsx`)
Newsroom administrators have fine-grained control over typography without code edits:
- Sliders for headline font sizes (`h1Size`, `h2Size`, `h3Size`, `bodySize`).
- Line-height modifiers for body readability.
- One-click presets:
  - *Standard Editorial:* Default balanced configuration.
  - *Compact Foxiz Style:* Dense headlines for high news volume.
  - *High Legibility Large:* Enhanced font sizing for elderly demographic readership.
- Real-time side-by-side preview showing both Hindi and English sentences as adjustments are made.
