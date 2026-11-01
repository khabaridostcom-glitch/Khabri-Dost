# 09 — BUGS & IMPROVEMENTS REGISTER
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Master Audit Issue Log  
**Audit Date:** October 2026  
**Auditor:** Senior QA Automation & Systems Engineer  

---

## 1. Issue Tracking & Resolution Matrix

The following register documents every defect, architectural vulnerability, and improvement identified during the master audit, along with root cause analysis and verified resolutions:

| Issue ID | File / Subsystem | Category | Severity | Root Cause | Impact | Fix & Resolution Applied | Status |
|:---|:---|:---:|:---:|:---|:---|:---|:---:|
| **BUG-001** | `PublisherCMS.tsx` | Editor | **CRITICAL** | WYSIWYG editor wrapped text in literal Markdown asterisks (`**bold**`) instead of inserting semantic `<strong>` elements. | Writers saw raw markup; articles rendered with asterisks instead of real bold text. | Rewrote editor engine to inject semantic HTML tags (`<strong>`, `<em>`, `<u>`) with real-time visual formatting. | **RESOLVED & VERIFIED** |
| **BUG-002** | `server.ts` | Server / Routing | **HIGH** | Vite dev server lacked an explicit SPA fallback rewrite for non-root routes. | Deep-linking or refreshing `/article/:id` or `/admin` could cause 404 or unhandled proxy routes. | Added explicit `vite.transformIndexHtml` catch-all route handler for all non-API paths. | **RESOLVED & VERIFIED** |
| **BUG-003** | `Footer.tsx` | Mobile UX | **HIGH** | Sticky bottom advertisement hovered at `bottom-0`, directly obscuring the 5-item mobile bottom navigation dock. | Mobile readers could not tap "Home", "Categories", "Videos", or "Menu" when an ad was active. | Added responsive offset `bottom-[56px] sm:bottom-[60px] md:bottom-0` to guarantee zero collision. | **RESOLVED & VERIFIED** |
| **BUG-004** | `src/index.css` | Theme | **HIGH** | `@media (prefers-color-scheme: dark)` media query was triggering dark styles on devices with OS-level dark mode enabled. | Inconsistent color scheme violating the strict Light Mode mandate on iOS/Android dark mode devices. | Removed media query; enforced `color-scheme: light !important;` and fixed CSS variable tokens. | **RESOLVED & VERIFIED** |
| **BUG-005** | `15 Admin Tabs` | Theme / UI | **MEDIUM** | Admin module headers used legacy `bg-slate-900 text-white` dark banners. | Inconsistent admin experience clashing with the light mode newsroom standard. | Replaced all 15 banners with crisp `bg-white border-slate-200 text-slate-800` cards. | **RESOLVED & VERIFIED** |
| **BUG-006** | `news.ts`, `HeaderFooterSettingsTab.tsx` | Theme | **MEDIUM** | Default `footerTheme` was hardcoded to `'dark'`. | New installations defaulted to a dark footer with dark backgrounds. | Updated default to `'light'` and eliminated dark footer preset configurations. | **RESOLVED & VERIFIED** |
| **BUG-007** | `index.html` | Typography | **HIGH** | Incomplete Noto Sans font weights loaded, causing matra clipping and faux-bold rendering in Hindi. | Devanagari vowel signs (matras) appeared truncated or improperly spaced. | Imported full Google Font package for Noto Sans Devanagari (400, 500, 600, 700, 800) with swap display. | **RESOLVED & VERIFIED** |
| **BUG-008** | `firestore.rules` | Security | **HIGH** | Public users needed to increment article view counts without having write access to sensitive article fields. | View count updates would either fail with permission-denied or require wide-open write rules. | Added atomic increment rule: `affectedKeys().hasOnly(['viewCount']) && request.resource.data.viewCount == resource.data.viewCount + 1`. | **RESOLVED & VERIFIED** |
| **BUG-009** | `server.ts` | SEO | **MEDIUM** | Dynamic Google News sitemap endpoint missing from server routes. | Search engines had to rely on static files, delaying discovery of fast-breaking news. | Implemented `/news-sitemap.xml` with automatic 48-hour article filtering and XML schema headers. | **RESOLVED & VERIFIED** |
| **BUG-010** | `server.ts` | SEO | **LOW** | Missing live RSS 2.0 feed generator for syndication and feed readers. | Inability for third-party news aggregators and RSS subscribers to ingest stories. | Added `/rss.xml` endpoint with full content encoding and image enclosure attachments. | **RESOLVED & VERIFIED** |

---

## 2. Issue Resolution Summary

- **Total Identified Issues:** 10
- **Critical / High Severity:** 6
- **Medium / Low Severity:** 4
- **Resolved & Verified:** 10 (100% resolution rate)
- **Pending Blockers:** 0
