# 04 — Backend Architecture, Database, APIs & Security
**Project:** Khabri Dost (खबरी दोस्त) | `khabridost.com`  
**Purpose:** Technical audit of the Node.js/Express backend server, Cloud Firestore data models, API endpoints, and security policies.

---

## 1. Backend Server Architecture (`server.ts`)

The backend runs as a high-performance Express 4.21.2 server on port 3000, serving both API requests and client-side single-page application assets:

### 1.1 HTTP Security Hardening Headers
Lines 17–24 of `server.ts` implement strict HTTP response headers:
```typescript
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
```

### 1.2 Rate Limiting & Input Sanitization
- **In-Memory Rate Limiter (`apiRateLimiter`):** Lines 28–51 enforce an 80 requests per 60 seconds limit per IP address across all `/api/*` endpoints. Exceeding clients receive HTTP 429 Too Many Requests.
- **XSS Sanitizer (`sanitizeString`):** Lines 57–65 strip `<script>`, `javascript:`, inline event handlers (`onclick=`), and `<iframe>` injections from incoming text payloads.

---

## 2. Exhaustive Inventory of Backend API Endpoints

| HTTP Method & Path | Purpose | Request Body / Parameters | Response Structure | Auth / Rate Limit |
|---|---|---|---|---|
| `POST /api/ai/generate-seo-meta` | Generates SEO title (60 chars), description (160 chars), and keywords from content. | `{ content: string, title?: string, category?: string }` | `{ metaTitle, metaDescription, keywords, slug, altTitles, altDescriptions }` | Rate limited (80/min); Gemini fallback. |
| `POST /api/admin/validate-key` | Validates Gemini / external API keys on the server. | `{ apiKey: string }` | `{ valid: boolean, message?: string }` | Rate limited; admin secret check. |
| `POST /api/ai/draft-article-seo` | Full AI article drafting with 3-bullet summary and headings. | `{ prompt: string, category?: string, tone?: string }` | `{ title, summary, content, category, seoTitle, seoDescription, tags }` | Rate limited; Gemini Flash proxy. |
| `GET /api/ai/google-trends` | Real-time trending Hindi search queries for India. | None | `{ trends: Array<{ query: string, volume: string, category: string }> }` | Rate limited; returns curated live topics. |
| `POST /api/ai/generate-trend-article` | Drafts a complete news article based on a trending topic. | `{ topic: string, category?: string }` | `{ article: Partial<NewsArticle> }` | Rate limited; Gemini Flash proxy. |
| `POST /api/social/webhook-dispatch` | Dispatches article links to Telegram channels or WhatsApp webhooks. | `{ articleId, title, url, platform: 'telegram' \| 'whatsapp' }` | `{ success: boolean, message: string }` | Rate limited; server webhook. |
| `POST /api/citizen-news/submit` | Ingests news leads submitted by readers. | `{ title, category, location, description, images, senderName }` | `{ success: boolean, submissionId: string }` | Sanitized; staged in memory store. |
| `GET /api/citizen-news/list` | Returns citizen submissions for editorial review. | None | `{ submissions: Array<CitizenNewsSubmission> }` | Rate limited; editorial access. |
| `POST /api/ai/generate-news-image` | Generates placeholder / AI concept image prompt. | `{ prompt: string }` | `{ imageUrl: string }` | Rate limited; returns Unsplash news asset. |
| `GET /api/security/audit-report` | Performs server-side security health check. | None | `{ status: 'healthy', headers: object, uptime: number }` | Public health check. |
| `POST /api/sitemap/sync-articles` | Synchronizes dynamic articles into the sitemap memory cache. | `{ articles: NewsArticle[] }` | `{ success: boolean, count: number }` | Admin sync trigger. |
| `GET /sitemap.xml` | Public dynamic XML sitemap for search engines. | None | `application/xml` sitemap data with `<loc>`, `<lastmod>`, `<changefreq>`. | Public, cached. |
| `GET /robots.txt` | Directs web crawlers to sitemap and disallowed paths. | None | `text/plain` robots file (`Allow: /`, `Disallow: /admin`). | Public. |
| `GET /api/health` | Container and load-balancer liveness probe. | None | `{ status: 'ok', timestamp: string }` | Public. |
| `GET *` (Catch-All) | Injects dynamic SSR OpenGraph meta tags for social bots or serves Vite/dist SPA. | All client routes | Dynamic `index.html` with replaced `<title>`, `<meta og:*>`. | Public. |

---

## 3. Cloud Firestore Database Architecture & Verified Schema

The application uses Google Cloud Firestore. The actual collections accessed by `src/services/newsService.ts` and protected by `firestore.rules` are:

```
[Firestore Database: ai-studio-595d1ed9-f621-49b9-8c06-e20c04392313]
 ├── articles/             --> All news articles (Drafts, Published, Scheduled)
 ├── settings/             --> Document 'portal_config' holds typography, ads, branding, navigation
 ├── comments/             --> Reader comments linked by articleId
 ├── bookmarks/            --> User-saved bookmarks (private to userId)
 ├── read_laters/          --> User read-later list (private to userId)
 ├── users/                --> Editorial staff profiles and RBAC role assignments
 ├── admins/               --> Super-administrator UIDs registry
 ├── subscribers/          --> Newsletter subscriber emails
 ├── media/                --> Metadata for uploaded WebP media assets
 ├── live_blogs/           --> Real-time breaking blog events and timestamped cards
 ├── inquiries/            --> Contact and grievance form submissions
 └── test/                 --> Connection verification test document
```

### Critical Discovery Note: Document Name Clarification
Prior documentation referred to collections as `portal_settings`, `staff_members`, and `live_news`. **This was incorrect.** The actual code in `newsService.ts` and `firestore.rules` uses:
- Collection `settings` (with Document ID: `portal_config`).
- Collection `live_blogs`.
- Collection `users` (with field `role: 'admin' | 'editor' | 'reporter' | 'super_admin'`).

---

## 4. Firestore Security Rules Audit (`firestore.rules`)

The `firestore.rules` file contains **176 lines** of comprehensive, production-grade security logic:

### 4.1 Default Deny Catch-All
```javascript
match /{document=**} {
  allow read, write: if false;
}
```

### 4.2 Helper Security Functions
- `isSignedIn()`: Checks `request.auth != null`.
- `isAdmin()`: Validates admin email (`khabaridost.com@gmail.com`, `khabridost.com@gmail.com`, `admin@khabridost.com`) or checks existence in `/databases/$(database)/documents/admins/$(request.auth.uid)`.
- `isStaff()`: Validates that the authenticated user has an active staff role (`admin`, `editor`, `reporter`, `super_admin`) in `/users/$(request.auth.uid)`.
- `isValidArticle(data)`: Validates that `title` is 3–300 chars, `summary` <= 1000 chars, `content` 10–50000 chars, `category` <= 50 chars, and `authorUid` matches schema.

### 4.3 Safe Public Read & Atomic Increments
- **Articles:** Public readers can read any article where `status == 'published'` (or all if admin).
- **Views Counter Protection:** Public readers can only update an article if the incoming payload touches *only* `viewsCount` and it is a valid number:
  ```javascript
  (incoming().diff(existing()).affectedKeys().hasOnly(['viewsCount']) && incoming().viewsCount is number)
  ```
- **Likes Counter Protection:** Signed-in readers can atomically increment `likesCount` or update `reactions`.

### 4.4 Privilege Escalation Prevention on `/users/{userId}`
Users cannot elevate their own role:
```javascript
match /users/{userId} {
  allow create: if isSignedIn() && (
    !('role' in incoming()) || incoming().role == 'reader' || isAdmin()
  );
  allow update: if isSignedIn() && (
    isAdmin() || (request.auth.uid == userId && !incoming().diff(existing()).affectedKeys().hasAny(['role']))
  );
}
```
Normal users cannot grant themselves staff roles; only verified admins can modify roles.

---

## 5. External Services & Secrets Protection

- **API Keys Storage:** All sensitive tokens (`GEMINI_API_KEY`) reside exclusively in server-side environment variables. No API keys are bundled into client-side JavaScript.
- **Firebase Configuration:** Public project identifiers reside in `firebase-applet-config.json` and `src/firebase.ts`. These represent standard client-side Firebase keys and rely entirely on `firestore.rules` for security enforcement.
