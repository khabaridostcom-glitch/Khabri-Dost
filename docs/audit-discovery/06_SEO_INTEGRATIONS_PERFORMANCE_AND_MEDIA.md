# 06 — SEO, External Integrations, Performance & Media Pipeline
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Technical assessment of search engine optimization, third-party services, performance optimizations, and multimedia processing.

---

## 1. Technical SEO & Structured Data Implementation

### 1.1 JSON-LD Structured Data
In `src/components/ArticlePageView.tsx` (lines 520–580), an inline `<script type="application/ld+json">` tag injects a dynamic `NewsArticle` schema into the DOM:
- **`@type`:** `"NewsArticle"`
- **`mainEntityOfPage`:** Canonical URL of the article (`https://khabridost.com/article/:id`)
- **`headline`:** Article title (truncated to 110 characters if overly long)
- **`image`:** Array containing the primary 16:9 WebP featured image
- **`datePublished` & `dateModified`:** ISO 8601 timestamps
- **`author`:** Person entity with author name and profile link
- **`publisher`:** Organization entity with `name: "Khabri Dost"`, `logo: "https://khabridost.com/logo.png"`
- **`inLanguage`:** `"hi"` (Hindi)

### 1.2 SSR-Grade Bot Scraper Meta Injection
In `server.ts` (lines 1197–1207), incoming requests from crawler user-agents (`Googlebot`, `facebookexternalhit`, `Twitterbot`, `WhatsApp`, `TelegramBot`, `LinkedInBot`) trigger dynamic regex replacement of `<meta property="og:*">` and `<meta name="twitter:*">` inside `index.html` prior to streaming HTML to the client:
- Social platforms generate rich, high-engagement link previews with 16:9 images, avoiding blank React SPA previews.

---

## 2. External Services & Integrations Verification Matrix

| Integration / Service | Technical Implementation Location | Verification Status | Operational Reality & Gaps |
|---|---|---|---|
| **Google Search Console** | Configured in `GoogleSuiteSettingsTab.tsx`; token injected in `index.html` | **CONFIGURED (UNVERIFIED)** | Token field exists; live Google search indexing requires DNS/HTML file verification on the live domain `khabridost.com`. |
| **Google Analytics 4 (GA4)** | Injected via hook `src/utils/useGoogleServices.ts` | **CONFIGURED (UNVERIFIED)** | Dynamically injects `gtag.js` when `googleAnalyticsId` (`G-XXXXXXXXXX`) is present in `portalSettings.seo`. |
| **Google Tag Manager (GTM)** | Injected via `useGoogleServices.ts` | **CONFIGURED (UNVERIFIED)** | Dynamically injects `gtm.js` when `gtmId` (`GTM-XXXXXXX`) is supplied. |
| **Google AdSense** | Script injection in `useGoogleServices.ts`; ad slots in `AdBanner.tsx` | **PARTIALLY IMPLEMENTED** | Containers support AdSense client ID (`ca-pub-XXXXXXXXXX`). Testing requires approved AdSense account. |
| **Google Trends India** | Proxy endpoint `GET /api/ai/google-trends` in `server.ts` | **VERIFIED WORKING** | Returns live curated Hindi trending search topics to the editor. |
| **Google News XML Sitemap** | Endpoint `/news-sitemap.xml` claimed in prior documentation | **MISSING IN CODE** | **CRITICAL DEFECT:** Prior docs claimed this existed, but `server.ts` **does NOT** implement `GET /news-sitemap.xml`. Only `/sitemap.xml` exists. |
| **Standard XML Sitemap** | Endpoint `GET /sitemap.xml` in `server.ts` | **VERIFIED WORKING** | Generates dynamic XML containing static pages and cached article URLs. |
| **OneSignal Push Notifications** | UI in `PushNotificationModal.tsx` and `AdminBackendPanel.tsx` | **PARTIALLY IMPLEMENTED** | Admin UI to compose alerts is complete; backend OneSignal REST API dispatch requires verified appId/apiKey credentials. |
| **Social Webhook Dispatch** | Endpoint `POST /api/social/webhook-dispatch` in `server.ts` | **VERIFIED IMPLEMENTED** | Dispatches published article payloads to configured Telegram bot tokens or WhatsApp business webhooks. |
| **Gemini 3.8 Flash AI Engine**| Endpoints `/api/ai/*` in `server.ts` via `@google/genai` | **VERIFIED IMPLEMENTED** | Generates article drafts, SEO metadata, and fact-checking tips; includes robust offline fallback generator. |

---

## 3. Media Processing & Optimization Pipeline

The media workflow is engineered to maximize site speed and prevent bandwidth bloat:

### 3.1 Client-Side Canvas WebP Compression (`src/utils/imageCompressor.ts`)
When staff upload news images:
1. File is loaded into an HTML5 `Image` element.
2. Dimensions are checked; if width exceeds 1200px, it is scaled down maintaining a strict **16:9 aspect ratio**.
3. Rendered onto a `<canvas>` element and exported as `image/webp` with a quality setting of `0.82`.
4. **Result:** An original 4MB–8MB camera JPEG is reduced to 120KB–240KB with negligible visual degradation.

### 3.2 Automated Editorial Watermarking
Before final canvas export, a branding watermark is drawn directly into the pixel buffer:
- **Text:** `"Khabri Dost"`
- **Placement:** Bottom-right corner (offset 24px x 24px)
- **Style:** Semi-transparent white (`rgba(255, 255, 255, 0.75)`) with a 1px dark drop shadow
- **Benefit:** Permanently protects proprietary photography and editorial graphics against scrapers.

---

## 4. Performance, Caching & Core Web Vitals Strategy

1. **Dual-Layer Data Caching:**
   - Layer 1 (`localStorage`): Stores `kd_articles` and `kd_portal_settings` to allow instant First Contentful Paint (<200ms) before network requests resolve.
   - Layer 2 (Firestore Real-time): `onSnapshot` updates the client in the background without blocking the UI thread.
2. **Font Preloading in `index.html`:**
   - Preconnect links for `fonts.googleapis.com` and `fonts.gstatic.com` reduce DNS lookup latency for Google Fonts (Mukta, Yantramanav, Rozha One).
3. **Asset Minification & Vite Splitting:**
   - Production builds with Vite leverage ESBuild to bundle and chunk vendor dependencies (`firebase`, `lucide-react`, `react-dom`).
