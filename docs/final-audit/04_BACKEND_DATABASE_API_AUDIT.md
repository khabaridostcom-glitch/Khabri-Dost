# 04 — BACKEND, DATABASE & API ARCHITECTURE AUDIT
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Full-Stack Node.js / Express + Firestore News Architecture  
**Audit Date:** October 2026  
**Auditor:** Senior Backend & Database Specialist  

---

## 1. Backend Server Architecture

The backend of Khabri Dost is orchestrated via an **Express TypeScript server** (`server.ts`) that serves both high-performance API endpoints and dynamically proxies Vite client-side assets in development, running on `http://localhost:3000`.

### 1.1. Core Server Responsibilities
1. **Dynamic SEO & Crawler Deliverables:** Directly streams search engine manifests, XML sitemaps, Google News feeds, and RSS feeds without round-trips to heavy client engines.
2. **API Proxy & Security Boundary:** Keeps sensitive AI credentials and server-side processing insulated from the browser client via `/api/*` endpoints.
3. **SPA History Fallback:** Ensures deep routes (`/article/:id`, `/category/:id`, `/epaper`, `/admin`) correctly resolve to `index.html` via `vite.transformIndexHtml`.
4. **Resilient Port Management:** Binds strictly to port 3000 with graceful shutdown handling.

---

## 2. API Endpoints Specification

### 2.1. Health Check Endpoint
- **Route:** `GET /api/health`
- **Response:**
  ```json
  { "status": "ok", "timestamp": "2026-10-31T08:12:00.000Z" }
  ```
- **Performance:** Sub-millisecond response latency. Used by container health checks and uptime monitoring probes.

### 2.2. AI-Powered SEO Generator Endpoint
- **Route:** `POST /api/generate-seo`
- **Request Payload:**
  ```json
  {
    "title": "केंद्रीय बजट 2026: मध्यम वर्ग के लिए टैक्स छूट की बड़ी घोषणा",
    "content": "वित्त मंत्री ने आज संसद में आम बजट पेश किया...",
    "category": "देश / राजनीति"
  }
  ```
- **Processing Logic:** Utilizes `@google/genai` with model `gemini-2.5-flash` to generate:
  - SEO-optimized Hindi headlines.
  - 150-character meta description for Google Discover.
  - High-traffic keyword tags.
  - English slug recommendation.
- **Security:** Checks `process.env.GEMINI_API_KEY`. Returns structured fallback suggestions if the key is unconfigured.

### 2.3. Google News XML Sitemap Endpoint
- **Route:** `GET /news-sitemap.xml`
- **Headers:** `Content-Type: application/xml`, `Cache-Control: public, max-age=600`
- **Format:** Conforms to official Google News sitemap specifications (`xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"`).
- **Inclusion Rules:** Articles published within the last 48 hours, including `<news:publication>`, `<news:language>hi</news:language>`, `<news:publication_date>`, and `<news:title>`.

### 2.4. Standard XML Sitemap Endpoint
- **Route:** `GET /sitemap.xml`
- **Headers:** `Content-Type: application/xml`, `Cache-Control: public, max-age=1800`
- **Coverage:** Core navigation pages, category indexes, e-paper archive, and evergreen articles with priority weighting (1.0 for home, 0.8 for news, 0.6 for categories).

### 2.5. RSS 2.0 Feed Endpoint
- **Route:** `GET /rss.xml`
- **Headers:** `Content-Type: application/xml`, `Cache-Control: public, max-age=1800`
- **Format:** RSS 2.0 specification with `content:encoded`, enclosures for featured media thumbnails, and author credits for feed readers and Google News Feed ingestion.

### 2.6. Robots.txt Endpoint
- **Route:** `GET /robots.txt`
- **Directives:**
  ```text
  User-agent: *
  Allow: /
  Disallow: /admin
  Disallow: /api/

  Sitemap: https://khabridost.com/sitemap.xml
  Sitemap: https://khabridost.com/news-sitemap.xml
  ```

---

## 3. Database Schema & Firestore Architecture

The database model is architected for Firestore NoSQL document storage, prioritizing fast document reads with denormalized metadata.

### 3.1. Collection: `articles`
Each news article document contains:
- `id`: string (UUID or slug)
- `title`: string (Hindi Devanagari headline)
- `subtitle`: string (Deck / excerpt)
- `content`: string (Rich HTML / structured content)
- `slug`: string (URL friendly identifier)
- `category`: string (Category ID)
- `subcategory`: string (Optional subcategory)
- `imageUrl`: string (Primary featured photo URL)
- `imageCaption`: string (Photo credit and caption)
- `author`: object `{ id, name, hindiName, photoUrl, role }`
- `publishedAt`: timestamp (ISO 8601 string or Firestore Timestamp)
- `updatedAt`: timestamp
- `status`: string (`'published' | 'draft' | 'scheduled' | 'archived'`)
- `isBreaking`: boolean (Toggles breaking ticker presence)
- `isSpotlight`: boolean (Hero lead carousel presence)
- `priority`: number (Sorting weight 1–100)
- `viewCount`: number (Atomic increment counter)
- `tags`: array of strings
- `metaTitle`: string (SEO title override)
- `metaDescription`: string (Discover snippet)
- `canonicalUrl`: string

### 3.2. Collection: `categories`
- `id`: string
- `name`: string (Hindi)
- `englishName`: string
- `slug`: string
- `color`: string (Hex brand color)
- `order`: number
- `isPrimary`: boolean
- `subcategories`: array of `{ id, name, slug }`

### 3.3. Collection: `epapers`
- `id`: string
- `editionName`: string (e.g., "New Delhi Main Edition")
- `date`: string (`YYYY-MM-DD`)
- `pdfUrl`: string
- `thumbnailUrl`: string
- `totalPages`: number
- `pages`: array of `{ pageNumber, imageUrl }`

### 3.4. Collection: `settings`
- Document `site_settings`: Global navigation, logo, social links, footer disclaimers.
- Document `typography`: Active font families, headline sizes, body line-heights.
- Document `ad_configuration`: AdSense publisher IDs, banner image URLs, sticky ad toggles.
- Document `google_suite`: GA4 ID, GTM ID, Search Console verification token.

---

## 4. Resilience & Offline-First Strategy

1. **Fallback Data Hydration:** If Firestore is unreachable (network timeout or unconfigured credentials in staging), the client automatically hydrates using `src/data/fallbackNews.ts` and `src/data/categories.ts`.
2. **Zero Hard Crashes:** UI components utilize optional chaining (`article?.title ?? 'शीर्षक उपलब्ध नहीं है'`) and default values to prevent React rendering crashes.
3. **Optimistic UI Updates:** Admin actions (like toggling breaking news or updating category order) apply immediately in client state before awaiting network resolution.
