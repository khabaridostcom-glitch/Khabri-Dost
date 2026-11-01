# 02. Single Article / Single Content Page Customization Audit — Khabri Dost

**Target Component:** `src/components/ArticlePageView.tsx`  
**Related Admin Panels:** `PublisherCMS.tsx`, `ArticleMetaSettingsTab.tsx`, `ArticleWidgetsSettingsTab.tsx`, `TypographySettingsTab.tsx`  
**Auditor:** Senior News Website Architect & QA Auditor  

---

## 1. Article Identity & Content Fields Audit

| Field | Source in Data Model (`NewsArticle`) | Admin Input Form | Rendered on Single Article Page? | Status | Implementation Chain Notes |
|---|---|---|---|---|---|
| **Title** | `article.title` | `PublisherCMS.tsx` (Title input) | Yes (`<h1>` in `ArticlePageView`) | **AVAILABLE** | Full chain works. Rendered in H1 headline with inline editing fallback. |
| **Subtitle / Lead Summary** | `article.summary` | `PublisherCMS.tsx` (Summary textarea) | Yes (lead paragraph with red left-border) | **AVAILABLE** | Rendered with `articleLeadSubtitlePx` typography override if set. |
| **Key Highlights (मुख्य बिंदु)** | `article.highlights` | `PublisherCMS.tsx` (Highlights tagger) | Yes (`ArticleKeyHighlights.tsx`) | **AVAILABLE** | Highlights render as bullet cards above featured photo. |
| **Featured Image** | `article.imageUrl` | `PublisherCMS.tsx` (Media selector) | Yes (`16:9` responsive image) | **AVAILABLE** | Rendered with `imageAltText` and `imageCaption`. |
| **Image Caption & Credit** | `article.imageCaption` | `PublisherCMS.tsx` (Caption input) | Yes (`फोटो: {caption}`) | **AVAILABLE** | Rendered in italic meta font under featured image. |
| **Category & Breadcrumbs** | `article.category` | `PublisherCMS.tsx` (Category dropdown) | Yes (Breadcrumb link + red badge) | **AVAILABLE** | Click navigates back to category feed. |
| **Location / Bureau** | `article.location` | `PublisherCMS.tsx` (Location input) | Yes (`• {article.location}`) | **AVAILABLE** | Rendered in editorial byline row. |
| **Author Name & Role** | `article.authorName`, `article.authorRole` | `PublisherCMS.tsx` (Author dropdown) | Yes (Author name + role pill) | **AVAILABLE** | Connected with `ArticleMetaSettingsTab` avatar toggles. |
| **Author Photo / Avatar** | `article.authorPhotoUrl` | `PublisherCMS.tsx` & `seedNews.ts` | Yes (Circle avatar in byline) | **AVAILABLE** | Fallback to default avatar if empty. |
| **Published & Updated Date** | `article.createdAt`, `article.updatedAt` | Automatic ISO string in Firestore | Yes (`formatHindiTimeAgo`) | **AVAILABLE** | Relative time shown in byline. |
| **Reading Time** | `article.readTimeMinutes` | Auto-calculated from words | Yes (`{readTime} मिनट`) | **AVAILABLE** | Dynamically calculated and displayed. |
| **View Count** | `article.viewsCount` | Incremented on mount | Yes (`viewsCount + 1`) | **AVAILABLE** | Displays total read count. |
| **Tags (हैशटैग्स)** | `article.tags` | `PublisherCMS.tsx` (Tags input) | Yes (Bottom pill tags) | **AVAILABLE** | Rendered right below content paragraphs. |
| **SEO Title, Description, Slug**| `seoTitle`, `seoDescription`, `urlSlug` | `PublisherCMS.tsx` & SEO Generator | Yes (Browser `<title>`, meta, OG) | **AVAILABLE** | Dynamically bound to `document.title` and meta. |

---

## 2. Article Layout & Typography Audit

| Typography / Layout Setting | Admin Setting Control | CSS Implementation | Working on Desktop? | Working on Mobile? | Audit Verdict |
|---|---|---|---|---|---|
| **Article H1 Desktop Font Size** | `typo.articleTitleDesktopPx` | Inline `clamp(..., 3.8vw, ...)` | **PARTIAL** | **BROKEN** | The `clamp()` formula silently overrides admin px setting on non-standard viewport widths. |
| **Article H1 Mobile Font Size** | `typo.articleTitleMobilePx` | Inline `clamp(...)` | **BROKEN** | **PARTIAL** | On small screens (360px-400px), 3.8vw calculates to ~14px, forcing minimum fallback clamp value. |
| **Article Lead Subtitle Size** | `typo.articleLeadSubtitlePx` | `style={{ fontSize: ... }}` | **AVAILABLE** | **AVAILABLE** | Direct inline style override works reliably. |
| **Article Body Font Size** | `typo.articleBodyFontSizePx` | `readerFontSize` state | **AVAILABLE** | **AVAILABLE** | In-reader font tool + admin settings synchronized. |
| **Article Body Line Height** | `typo.articleBodyLineHeight` | `readerLineHeight` state | **AVAILABLE** | **AVAILABLE** | Default `1.75` line-height is clean and readable. |
| **H2, H3, Blockquote Styling** | Hardcoded Tailwind in parser | `articleContentParser.tsx` | Fixed | Fixed | **PARTIAL** (No admin controls for sub-heading sizes). |
| **Main Content Container Width** | Fixed `max-w-7xl` | CSS class `max-w-7xl` | Fixed | Fixed | **PARTIAL** (No admin container width slider). |

---

## 3. Article Metadata & Action Elements Audit

- **Author Avatar & Role Toggle:** `ArticleMetaSettingsTab` (`showAuthorAvatar`, `showAuthorRole`) → Works cleanly in DOM.
- **Audio Listen Bulletin Toggle:** `ArticleMetaSettingsTab` (`showListenButton`) → Works cleanly.
- **Social Sharing Channels:** Desktop bar (`ArticlePageView.tsx` line 1250) + Mobile floating bar (`ArticlePageView.tsx` line 1974) → Fully syncs with `portalSettings.sharePlatforms`.
- **Bookmark & Read Later Actions:** Fully functional with local state and user account synchronization.
- **Article PDF Download:** Generates branded PDF with `pdfGenerator.ts` → Fully working.

---

## 4. Article Sidebar & Widgets Parity

| Sidebar Element | Admin Control | Saves & Persists? | Status |
|---|---|---|---|
| **Reading Progress Bar** | `sidebarWidgets.showReadingProgressBar` | Yes | **AVAILABLE** |
| **Right Sidebar Ads (Top & Bottom)** | `sidebarWidgets.showSidebarAd` & `sidebarAds` | Yes | **AVAILABLE** |
| **Trending Stories Slider** | `sidebarWidgets.showTrendingNews` | Yes | **AVAILABLE** |
| **Gold & Silver Rate Widget** | `sidebarWidgets.showGoldRate` | Yes | **AVAILABLE** |
| **Daily Rashifal (Horoscope) Widget**| `sidebarWidgets.showRashifal` | Yes | **AVAILABLE** |
| **Opinion Poll Widget** | `sidebarWidgets.showOpinionPoll` | Yes | **AVAILABLE** |
| **Newsletter Subscribe Card** | `sidebarWidgets.showNewsletterSubscribe` | Yes | **AVAILABLE** |
| **Sudoku Game Widget** | Removed per user request | Yes | **REMOVED** |

---

## 5. Related Articles Section Parity

- **Heading Title Customization:** Admin can set custom title (defaults to "यह भी पढ़ें", with "(Related News)" removed).
- **Category Badge on Header:** Removed per user request; admin toggleable.
- **Subtitle ("अन्य ताज़ा ख़बरें"):** Removed per user request.
- **Card Elements Visibility:** Category badge, Location badge, Date ("23 दिन पहले"), Read More ("पढ़ें ➔"), Summary, and Image are all independently toggleable in Admin Panel.
- **Card Count:** Admin quick selectors for `3, 4, 6, 8, 12` + direct increment `+` button up to 24 cards.
- **Mobile Spacing:** Fixed to `gap-3` (12px) with 3 mobile layout options (`grid1`, `grid2`, `list`).
