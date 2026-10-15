# 05 — Typography Engine, Known Font Bug & UI/UX Audit
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Technical root-cause analysis of the font customization failure, CSS specificity conflicts, responsive behavior, and editorial typography standards.

---

## 1. Technical Root-Cause Analysis of the Known Font Bug

The reported bug states:
> *"The font controls sometimes fail to apply changes, and resetting fonts does not reliably change the H1 title on single-article pages."*

Through exhaustive code tracing, we have uncovered **four intersecting architectural conflicts** that cause this defect:

```
[The Specificity Conflict & Desynchronization Triangle]

           1. React State & Firestore (portalSettings.typography)
           └── articleTitleDesktopPx: 32, headlineFont: "'Mukta'"
                              ▲
                             / \
                            /   \  DESYNCHRONIZATION GAP
                           /     \
                          ▼       ▼
2. Root CSS Variables (:root)   3. Stylesheet Rules (src/index.css)
└── resetRootCssVariablesToDefault()  └── .font-kd-headline {
    sets: --size-heading-scale: 1          font-size: calc(...) !important;
          --font-headline: 'Rozha One' }   (OVERRIDES INLINE STYLES!)
```

### 1.1 Root Cause 1: CSS Specificity Override via `!important` in `src/index.css`
In `src/index.css` (lines 56–61), the utility class `.font-kd-headline` is defined as:
```css
.font-kd-headline {
  font-family: var(--font-headline) !important;
  font-weight: var(--weight-headline) !important;
  font-size: calc(1em * var(--size-heading-scale, 1) * var(--size-homepage-title-scale, 1)) !important;
  line-height: 1.35 !important;
}
```
**The CSS Specificity Law:** According to W3C CSS specifications, a declaration with `!important` inside an external stylesheet rule beats any inline `style="..."` attribute that lacks `!important`.

In `src/components/ArticlePageView.tsx` (line 1112), the H1 heading is rendered with:
```tsx
<h1
  style={{
    fontSize: `${portalSettings.typography?.articleTitleDesktopPx || 32}px`,
    lineHeight: 1.28,
  }}
  className="font-black font-kd-headline text-slate-900 tracking-tight break-words transition-all duration-150"
>
  {inlineTitle || article.title}
</h1>
```
Because `className` includes `font-kd-headline`, the browser applies `font-size: calc(...) !important` from `src/index.css`, **completely ignoring** the inline `style={{ fontSize: ... }}` unless the inline style also specifies `!important`!

### 1.2 Root Cause 2: Incoherent Reset Actions (`resetRootCssVariablesToDefault`)
When the admin clicks "Reset Fonts" in `TypographySettingsTab.tsx` (line 37):
```typescript
const handleResetTypography = () => {
  onUpdateTypography(DEFAULT_PORTAL_SETTINGS.typography);
  resetRootCssVariablesToDefault();
  ...
};
```
- `resetRootCssVariablesToDefault()` in `src/utils/cssDefaults.ts` resets CSS variables directly on `document.documentElement` to:
  - `--size-heading-scale: '1'`
  - `--font-headline: "'Rozha One', 'Noto Serif Devanagari', serif"`
- In contrast, `DEFAULT_PORTAL_SETTINGS.typography` specifies:
  - `articleTitleDesktopPx: 32`
  - `headlineFont: "'Mukta', sans-serif"`
- Because `.font-kd-headline` calculates `font-size: calc(1em * var(--size-heading-scale, 1) * ...) !important`, it computes `1em * 1 * 1 = 16px` (or whatever the parent container's font size is), collapsing the headline or locking it to an unexpected scale, rather than the intended 32px!

### 1.3 Root Cause 3: LocalStorage vs. Firestore Race Condition
`App.tsx` initializes `portalSettings` with `localStorage.getItem('kd_portal_settings')`. When an admin resets settings, if the local storage cache is not flushed atomically or if a browser tab reloads before the Firestore write commits, the stale local storage entry immediately re-populates the React state with previous customized sizes.

### 1.4 Root Cause 4: Lack of Responsive Clamp on Article Titles
In `ArticlePageView.tsx`, the inline style passes only `articleTitleDesktopPx` without a CSS `clamp()` function or media queries:
```tsx
fontSize: `${portalSettings.typography?.articleTitleDesktopPx || 32}px`
```
As a result, on a 360px mobile screen, if this inline style is applied, the heading renders at a fixed 32px or 38px, causing severe vertical height consumption and line-wrapping problems on mobile devices.

---

## 2. Proposed Typography Standards Matrix

Based on TV9 Bharatvarsh and Navbharat Times digital news readability patterns, the typography system should adopt clean Devanagari typefaces (`Mukta` for crisp modern headlines, `Yantramanav` for comfortable body reading):

| Element / View | Proposed Font Family | Desktop Size (px) | Mobile Size (px) | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| **Article H1 Headline** | `'Mukta', sans-serif` (weight: 800) | **32px** | **24px–26px** | 1.28 | `tight` (-0.015em) |
| **Article Body Text** | `'Yantramanav', sans-serif` (weight: 400) | **17px** | **16px** | 1.75 | `normal` |
| **Article Lead Paragraph** | `'Mukta', sans-serif` (weight: 600) | **19px** | **17px** | 1.60 | `normal` |
| **Homepage Lead Slider Title**| `'Mukta', sans-serif` (weight: 800) | **26px** | **20px** | 1.30 | `tight` |
| **Grid News Card Title** | `'Mukta', sans-serif` (weight: 700) | **17px** | **15px** | 1.35 | `tight` |
| **Compact List Card Title** | `'Mukta', sans-serif` (weight: 600) | **15px** | **14px** | 1.35 | `normal` |
| **Author Byline & Metadata** | `'Yantramanav', sans-serif` (weight: 500) | **13px** | **12px** | 1.40 | `normal` |
| **Header Navigation Links** | `'Mukta', sans-serif` (weight: 600) | **14px** | **13px** | 1.20 | `normal` |
| **Breaking News Ticker** | `'Mukta', sans-serif` (weight: 700) | **13px** | **12px** | 1.20 | `normal` |
| **Admin Panel UI Text** | `'Inter', system-ui, sans-serif` | **13px–14px**| **13px–14px** | 1.45 | `normal` |

---

## 3. UI/UX & Responsive Breakpoint Discovery

### 3.1 Admin Panel Design Direction Audit
- **Current Observation:** The admin panel in `AdminBackendPanel.tsx` contains heavy dark gradient panels (`from-slate-900 to-slate-800`), dense border treatments, and bilingual labels (e.g., `Typography (टाइपोग्राफी)`, `Ad Management (विज्ञापन)`).
- **Target Direction:**
  - Simple, clean **Light Mode** throughout the admin interface.
  - Backgrounds: Solid white `#ffffff` canvas with slate-50/100 (`#f8fafc`) auxiliary panels.
  - Borders: Crisp, minimal `border-slate-200`.
  - Sidebar Labels: **English-only labels** matching standard WordPress CMS conventions (*Dashboard*, *Posts*, *Media*, *Appearance*, *Settings*).

### 3.2 Responsive Breakpoint Inspection & Testing Status

| Breakpoint Width | Device Category | Verified Behavior in Code | Testing Status |
|---|---|---|---|
| **320px** | Small Mobile (iPhone SE 1st gen) | Header icons compress; category tabs require horizontal touch swipe. | **INSPECTED IN CODE** (Unverified in physical browser) |
| **360px** | Standard Android (Galaxy S8/S9) | Grid cards stack into 1 column; marquee ticker scales cleanly. | **VERIFIED IN DEV CONTAINER** |
| **390px** | Modern Mobile (iPhone 12/13/14/15) | Optimal mobile reading layout; floating WhatsApp share bar visible. | **VERIFIED IN DEV CONTAINER** |
| **414px** | Large Mobile (iPhone Plus/Max) | Cards display comfortable padding; image aspect ratio 16:9 preserved. | **VERIFIED IN DEV CONTAINER** |
| **768px** | Tablet Portrait (iPad Mini/Air) | 2-column article grid activates; sidebar folds beneath main feed. | **INSPECTED IN CODE** |
| **1024px** | Tablet Landscape / Small Laptop | 3-column layout activates; 260px admin sidebar opens in desktop mode. | **VERIFIED IN DEV CONTAINER** |
| **1280px** | Standard Desktop (MacBook / HD) | Ideal magazine layout with sticky right sidebar (ads + trending). | **VERIFIED IN DEV CONTAINER** |
| **1440px+** | Wide Desktop (QHD / 4K) | Max container width constraint (`max-w-7xl` / 1280px) prevents horizontal stretching. | **VERIFIED IN DEV CONTAINER** |

*Note on Testing Limitations:* All breakpoint findings are derived from code inspection and AI Studio preview containers. Physical multi-device touch testing on legacy devices (e.g., 320px screens) remains to be performed during the final QA stage.
