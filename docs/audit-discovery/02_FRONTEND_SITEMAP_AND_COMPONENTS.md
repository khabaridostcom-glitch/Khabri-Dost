# 02 — Frontend Sitemap, Routing Architecture & Component Hierarchy
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Comprehensive mapping of all public screens, routing mechanisms, SEO handling, and responsive behaviors.

---

## 1. Discovered Routing Mechanism in `src/App.tsx`

The public website operates on a **State-Driven Hybrid Routing Architecture** with browser history synchronization:

1. **Active View State:** Defined on line 123 of `src/App.tsx`:
   ```typescript
   const [currentView, setCurrentView] = useState<
     'home' | 'article' | 'live-feed' | 'contact' | 'about' | 'legal' | 'submit-news' | 'archive'
   >('home');
   ```
2. **History Synchronization:** When a user selects an article or navigates to a section, `App.tsx` calls:
   ```typescript
   window.history.pushState({ view: 'article', id: activeArticle.id }, '', `/article/${activeArticle.id}`);
   ```
3. **Browser Popstate Handling:** A `popstate` event listener detects the browser's Back and Forward buttons, restoring the appropriate view and article model without performing a full HTTP reload.
4. **Server-Side Catch-All:** `server.ts` line 1197 serves `index.html` for all unmatched GET paths (`app.get('*', ...)`), ensuring direct URL entries and bookmarks load properly.

---

## 2. Public Route Inventory: Existing vs. Proposed Clean URLs

| Public Screen / Feature | Current Implemented URL Structure | Proposed Clean SEO URL Structure | Implemented View / Component | Status in Code |
|---|---|---|---|---|
| **Main Homepage** | `https://khabridost.com/` | `https://khabridost.com/` | `currentView === 'home'` (`HeroSlider`, `ArticleCard`, widgets) | **VERIFIED IMPLEMENTED** |
| **Single News Article** | `https://khabridost.com/article/:id` or `/?article=:id` | `https://khabridost.com/article/:category/:slug-:id` | `currentView === 'article'` (`ArticlePageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **Category Archive** | In-page filter (`selectedCategory` state in `App.tsx`) | `https://khabridost.com/category/:category-slug` | `App.tsx` filtered grid | **PARTIAL (State Filter)** |
| **Live News / Live Blog** | `https://khabridost.com/live-feed` | `https://khabridost.com/live/` or `/live-news/` | `currentView === 'live-feed'` (`LiveFeedPageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **Citizen News Desk** | `https://khabridost.com/submit-news` | `https://khabridost.com/submit-news` | `currentView === 'submit-news'` (`SubmitNewsPageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **News Archive / Calendar**| `https://khabridost.com/archive` | `https://khabridost.com/archive/:year/:month` | `currentView === 'archive'` (`ArchivePageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **About Us / Editorial** | `https://khabridost.com/about` | `https://khabridost.com/about-us` | `currentView === 'about'` (`AboutUsPageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **Contact & Grievance** | `https://khabridost.com/contact` | `https://khabridost.com/contact-us` | `currentView === 'contact'` (`ContactUsPageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **Legal & Policies** | `https://khabridost.com/legal` | `https://khabridost.com/privacy-policy` | `currentView === 'legal'` (`LegalPolicyPageView.tsx`) | **VERIFIED IMPLEMENTED** |
| **E-Paper Edition** | Modal overlay (`EPaperModal.tsx`) | `https://khabridost.com/epaper/:edition/:date` | `EPaperModal.tsx` | **MODAL ONLY (No dedicated route)** |
| **Author Profile Page** | Modal / popup display | `https://khabridost.com/author/:author-slug` | In-modal author card | **PROPOSED (Not standalone route)** |
| **Tag Archive Page** | Modal / filtered search | `https://khabridost.com/tag/:tag-slug` | In-modal tag filter | **PROPOSED (Not standalone route)** |
| **Search Results Page** | Header dropdown search overlay | `https://khabridost.com/search?q=:keyword` | `Header.tsx` search drawer | **OVERLAY ONLY (No dedicated route)** |

---

## 3. Granular Page Specifications

### 3.1 Main Homepage (`/`)
- **Purpose:** Primary digital news showcase for Khabri Dost. Displays breaking developments, featured lead stories, category content blocks, multimedia, and reader widgets.
- **Key Components:**
  - `Header.tsx`: Date, time, marquee breaking ticker, navigation, search.
  - `SpotlightHeroSlider.tsx`: Top 5 lead stories with automatic slide intervals.
  - `SpotlightBriefTicker.tsx`: High-priority red news alerts.
  - `ArticleCard.tsx`: Multi-format news cards (Lead, Grid 3-column, Compact List).
  - `VideoSection.tsx`: Video news reels and YouTube embeds.
  - `PhotoGallerySection.tsx`: Photo stories carousel.
  - `SudokuGameWidget.tsx` & `RashifalWidget.tsx`: Daily engagement modules.
  - `Footer.tsx`: Multi-column footer.
- **Data Source:** Firestore `articles` collection (filtered by status `'published'`), `settings/portal_config`, and `INITIAL_NEWS` fallback.
- **SEO Handling:** Generates `NewsMediaOrganization` and `WebSite` JSON-LD schemas. Canonical URL points to `https://khabridost.com/`.
- **Responsive Layout:**
  - Mobile (<640px): Single-column vertical stream, horizontal scrollable category tabs, compact card sizes.
  - Tablet (640px–1024px): 2-column article grid with embedded ad units.
  - Desktop (>1024px): 3-column magazine layout (Main Feed 8 cols, Sticky Sidebar 4 cols).

---

### 3.2 Single News Article Page (`/article/:id`)
- **Purpose:** Deep reading view for published news reports.
- **Key Components (`src/components/ArticlePageView.tsx`):**
  - **Breadcrumbs:** `Home > Category > Title` hierarchy.
  - **Headline (H1):** Bound to `portalSettings.typography?.articleTitleDesktopPx || 32px`.
  - **Editorial Byline:** Author avatar, name, designation, publication date in Hindi ("15 अक्टूबर 2026"), updated timestamp, and estimated reading time.
  - **Social Sharing Bar:** Instant WhatsApp share (with pre-filled title and link), Facebook, Twitter/X, Telegram, Copy Link, and Print.
  - **Audio News Player (`AudioNewsPlayer.tsx`):** Web Speech API text-to-speech engine reading Hindi content aloud.
  - **Featured Media:** 16:9 featured WebP image with caption and photo credit.
  - **Article Body:** Rendered via `articleContentParser.tsx`, supporting headings, quotes, bullet points, and embedded Twitter/YouTube cards.
  - **In-Article Ad Slot:** Mid-content responsive ad container.
  - **Reader Reactions:** Interactive reaction counter (Like, Love, Insightful, Funny).
  - **Comment Section:** Real-time reader comments with moderation checks.
  - **Opinion Poll (`OpinionPollWidget.tsx`):** Interactive voting card.
  - **Related Stories:** 4 contextually relevant articles based on matching category and tags.
- **Data Source:** Firestore document `articles/:id` + real-time view increment (`increment(1)`).
- **SEO Handling:**
  - Dynamic `NewsArticle` schema injected into `<head>`.
  - OpenGraph tags: `og:title`, `og:description`, `og:image`, `og:url`.
  - Twitter Card: `summary_large_image`.
- **Responsive Layout:**
  - Mobile (<640px): Full-width text, sticky bottom share bar, stacked related news cards.
  - Desktop (>1024px): 2-column layout with 70% content width and 30% sticky sidebar containing ads and trending stories.

---

### 3.3 Live Breaking Feed Page (`/live-feed`)
- **Purpose:** Real-time event coverage (e.g., elections, natural disasters, cricket matches).
- **Key Components (`src/components/LiveFeedPageView.tsx`):**
  - Pulsing red "LIVE" indicator badge.
  - Auto-refresh mechanism polling updates every 60 seconds.
  - Reverse-chronological timeline with exact timestamps (e.g., "11:45 AM").
  - Urgent alert highlights for major flash updates.
- **Data Source:** Firestore `live_blogs` collection.
- **SEO Handling:** `LiveBlogPosting` schema.

---

### 3.4 Citizen Journalism News Desk (`/submit-news`)
- **Purpose:** Empowers readers to submit eyewitness news reports, local incidents, and civic grievances.
- **Key Components (`src/components/SubmitNewsPageView.tsx`):**
  - Incident title, location/district selector, category picker.
  - Multi-image file upload with client-side canvas compression.
  - Anonymous submission toggle for whistleblower protection.
  - Direct submission to backend endpoint `/api/citizen-news/submit`.
- **Data Source:** Staged in `citizenSubmissionsStore` in `server.ts` for editorial review.

---

### 3.5 News Archive Page (`/archive`)
- **Purpose:** Historical news retrieval by date, year, month, and category.
- **Key Components (`src/components/ArchivePageView.tsx`):**
  - Date picker and category filter.
  - Paginated results grid.
- **Data Source:** Querying Firestore `articles` with compound indexes.
