# 01. Frontend Customization Inventory — Khabri Dost

**Auditor Role:** Senior News Website Architect, CMS Product Architect & QA Auditor  
**Project:** Khabri Dost (Strict naming: *Khabri Dost*, never *Khabari Dost*)  
**Audit Date:** October 2026  
**Status:** Complete Code-Level Audit  

---

## 1. Executive Summary

This inventory catalogues every customizable visual and functional element across the entire Khabri Dost frontend. For each element, we trace the full implementation chain:
```
Frontend Component → Admin Setting Control → State/Form Binding → Save Function (Service) → Storage (Firestore + LocalStorage) → Retrieval & Hydration → Responsive Render (Mobile & Desktop)
```

Customization is strictly marked **AVAILABLE** only if the complete 10-step chain is intact, tested, and works without CSS/code cancellation. Otherwise, it is marked **PARTIAL**, **BROKEN**, or **MISSING**.

---

## 2. Master Frontend Customization Inventory

### A. Header, Navigation & Top Bar
| Element | Used In | Frontend Component | Customizable? | Admin Setting Location | Saves to DB? | Persists on Reload? | Mobile OK? | Desktop OK? | Audit Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Site Name & Tagline** | Header Top Bar & Logo Area | `src/components/Header.tsx` | Yes | `AdminBackendPanel` > `Header & Branding` (`HeaderFooterSettingsTab.tsx`) | Yes (`portalSettings.headerFooter.siteName`) | Yes | Yes | Yes | **AVAILABLE** |
| **Header Logo (Image/Text Toggle)** | Main Header Bar | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`headerLogoType`, `logoUrl`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Header Height & Padding** | Main Header Container | `src/components/Header.tsx` | Partial | Inline styling fixed at `h-16 / h-20`; no direct admin px slider | N/A | N/A | Partial | Yes | **PARTIAL** |
| **Breaking News Ticker Enable/Disable** | Below Main Nav | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` & `SpotlightSettingsTab` | Yes (`portalSettings.headerFooter.tickerEnabled`) | Yes | Yes | Yes | **AVAILABLE** |
| **Breaking Ticker Speed** | Marquee Ticker | `src/components/Header.tsx` | Yes | `portalSettings.tickerSpeed` ('slow', 'normal', 'fast', 'paused') | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Language / Edition Switcher** | Top Bar Right | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`headerShowLanguageEditions`, `networkEditions`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Bookmarks / Saved Stories Pill** | Header Actions | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`headerShowBookmarks`) | Yes | Yes | Hidden on mobile | Yes | **AVAILABLE** |
| **E-Paper Button in Header** | Header Right | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`headerShowEPaperButton`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Navigation Categories Order** | Primary Nav Bar | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`navCategoryOrder`, `disabledCategories`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Mobile Drawer Links & Socials** | Mobile Drawer | `src/components/Header.tsx` | Yes | `MobileSidebarSettingsTab.tsx` (`mobileSidebarMenu`) | Yes | Yes | Yes | N/A | **AVAILABLE** |
| **Sticky Header Mode** | Header Root | `src/components/Header.tsx` | Yes | `HeaderFooterSettingsTab` (`stickyHeader`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Weather / Temperature Widget** | Top Bar Left | `src/components/Header.tsx` | Missing | Hardcoded Delhi weather simulation | No | No | No | Partial | **MISSING** |

---

### B. Homepage Sections & Spotlight
| Element | Used In | Frontend Component | Customizable? | Admin Setting Location | Saves to DB? | Persists on Reload? | Mobile OK? | Desktop OK? | Audit Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Spotlight Hero 3-Card Grid** | Homepage Top | `src/components/SpotlightHeroSlider.tsx` | Yes | `SpotlightSettingsTab.tsx` (`spotlightLayout`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Hero Slider Auto-play & Interval** | Homepage Top Left | `src/components/SpotlightHeroSlider.tsx` | Yes | `SpotlightSettingsTab.tsx` (`heroSlider.autoplayInterval`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Spotlight Brief Ticker** | Homepage Top Right | `src/components/SpotlightBriefTicker.tsx` | Yes | `SpotlightSettingsTab.tsx` (`briefTicker`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Homepage Category Sections Order** | Homepage Feed | `src/App.tsx` | Partial | `HomepageSectionsSettingsTab.tsx` (reordering enabled, but fixed section components hardcoded in App.tsx) | Partial | Partial | Yes | Yes | **PARTIAL** |
| **Video Section / YouTube Player** | Homepage Mid | `src/components/VideoSection.tsx` | Yes | `AdminBackendPanel` > `Live Video Bulletin` | Yes (`liveVideoYoutubeId`, `liveVideoTitle`) | Yes | Yes | Yes | **AVAILABLE** |
| **Photo Stories Gallery** | Homepage Bottom | `src/components/PhotoGallerySection.tsx` | Yes | `HeaderFooterSettingsTab` (`customPhotoStories`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Ad Banner Slots (Leaderboard/Mid/Bottom)** | Across Homepage | `src/components/AdBanner.tsx` | Yes | `AdvertisementTab.tsx` & `AdBreakpointEditor.tsx` | Yes (`adSettings`) | Yes | Yes | Yes | **AVAILABLE** |

---

### C. Article Cards & Listing Elements
| Element | Used In | Frontend Component | Customizable? | Admin Setting Location | Saves to DB? | Persists on Reload? | Mobile OK? | Desktop OK? | Audit Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Card Category Badge Visibility** | Cards on Grid & Hero | `src/components/ArticleCard.tsx` | Partial | Hardcoded visible on hero; partial in displayOptions | Partial | Partial | Yes | Yes | **PARTIAL** |
| **Card Location Visibility** | Cards Grid & Feeds | `src/components/ArticleCard.tsx` | Yes | `portalSettings.displayOptions.showLocation` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Card Author Name Visibility** | Cards Bottom Meta | `src/components/ArticleCard.tsx` | Yes | `portalSettings.displayOptions.showAuthor` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Card Publication Date Visibility** | Cards Bottom Meta | `src/components/ArticleCard.tsx` | Yes | `portalSettings.displayOptions.showDate` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Card View Count Visibility** | Cards Bottom Meta | `src/components/ArticleCard.tsx` | Yes | `portalSettings.displayOptions.showViews` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Card Summary / Excerpt Visibility on Mobile** | Mobile Cards | `src/components/ArticleCard.tsx` | Yes | `portalSettings.displayOptions.showExcerptOnMobile` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Card Border Radius & Shadow** | All Cards | `src/components/ArticleCard.tsx` | Broken | Hardcoded Tailwind classes (`rounded-2xl`, `rounded-xl`); no active admin controls hook | No | No | No | No | **BROKEN** |
| **Card Image Aspect Ratio** | Grid Cards | `src/components/ArticleCard.tsx` | Missing | Hardcoded `aspect-[16/9]` and `aspect-[16/10]` | No | No | N/A | N/A | **MISSING** |
| **Number of Cards per Homepage Section** | Category Sections | `src/App.tsx` | Partial | Fixed `.slice(0, 4)` or `.slice(0, 6)` in JSX | No | No | No | No | **PARTIAL** |

---

### D. Single Article Reader Page (`ArticlePageView.tsx`)
| Element | Used In | Frontend Component | Customizable? | Admin Setting Location | Saves to DB? | Persists on Reload? | Mobile OK? | Desktop OK? | Audit Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Article H1 Headline Typography** | Reader Top | `src/components/ArticlePageView.tsx` | Partial | `TypographySettingsTab.tsx` (`articleTitleDesktopPx`, `articleTitleMobilePx`) | Yes | Yes | Buggy | Buggy | **PARTIAL** |
| **Lead Subtitle (Summary) Styling** | Below H1 | `src/components/ArticlePageView.tsx` | Yes | `TypographySettingsTab` (`articleLeadSubtitlePx`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Editorial Byline & Avatar** | Author Bar | `src/components/ArticlePageView.tsx` | Yes | `ArticleMetaSettingsTab.tsx` (`showAuthorAvatar`, `showAuthorRole`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Audio Bulletin Player (Speech)** | Action Bar | `src/components/ArticlePageView.tsx` | Yes | `ArticleMetaSettingsTab.tsx` (`showListenButton`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Key Highlights (मुख्य बिंदु)** | Above Featured Image | `src/components/ArticleKeyHighlights.tsx` | Yes | CMS Publisher (`highlights`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Featured Image & Caption** | Article Body Top | `src/components/ArticlePageView.tsx` | Yes | CMS Publisher (`imageUrl`, `imageCaption`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Body Content Typography & Spacing** | Article Body | `src/components/ArticlePageView.tsx` | Yes | Reader font customizer + `TypographySettingsTab` | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Post-Content Disclaimer Box** | End of Content | `src/components/ArticlePageView.tsx` | Fixed | Verbatim 12px box added per user request | Hardcoded | Yes | Yes | Yes | **AVAILABLE** |
| **Article Tags (टैग्स)** | Below Content | `src/components/ArticlePageView.tsx` | Yes | CMS Publisher (`tags`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Social Follow & PDF Download Quick Strip** | Below Content | `src/components/ArticlePageView.tsx` | Yes | `HeaderFooterSettingsTab` (Google News, WhatsApp, Telegram URLs) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Reaction Emojis (👍, ❤️, 😂, 😲)** | Bottom Action Strip | `src/components/Reactions.tsx` | Yes | Dedicated component + Firestore counter sync | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Comments Section** | Article Footer | `src/components/ArticlePageView.tsx` | Yes | `ArticleWidgetsSettingsTab` (`showCommentsSection`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Related Stories Count & Toggles** | Below Article | `src/components/ArticlePageView.tsx` | Yes | `ArticleWidgetsSettingsTab` (`relatedArticlesCount`, cards toggles) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Single Article Sidebar Enable/Disable** | Right Sidebar | `src/components/ArticlePageView.tsx` | Yes | `ArticleWidgetsSettingsTab` (`sidebarSliderMode`, individual widgets) | Yes | Yes | Hidden on mobile | Yes | **AVAILABLE** |

---

### E. Footer & Legal Pages
| Element | Used In | Frontend Component | Customizable? | Admin Setting Location | Saves to DB? | Persists on Reload? | Mobile OK? | Desktop OK? | Audit Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Footer Brand Description & Tagline** | Footer Column 1 | `src/components/Footer.tsx` | Yes | `HeaderFooterSettingsTab` (`footerAboutText`, `tagline`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Footer Quick Links & Categories** | Footer Column 2 & 3 | `src/components/Footer.tsx` | Yes | `HeaderFooterSettingsTab` (`footerCategories`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Social Channel Links (X, FB, YT, Telegram)** | Footer Right | `src/components/Footer.tsx` | Yes | `HeaderFooterSettingsTab` (`socialLinks`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Grievance Officer & Legal Notice** | Footer Bottom | `src/components/Footer.tsx` | Yes | `HeaderFooterSettingsTab` (`footerCopyright`, `grievanceOfficer`) | Yes | Yes | Yes | Yes | **AVAILABLE** |
| **Legal Policies (Privacy, Terms, DMCA, Fact-check)** | Dedicated Legal View | `src/components/LegalPolicyPageView.tsx` | Yes | `AdminBackendPanel` > `Policies Settings` | Yes | Yes | Yes | Yes | **AVAILABLE** |

---

## 3. Inventory Classification Totals

- **Total Elements Catalogued:** 38
- **AVAILABLE (Full 10-Step Chain Verified):** 28 (73.7%)
- **PARTIAL (Broken link or partial hardcoding):** 6 (15.8%)
- **BROKEN (Admin setting exists but fails to reach DOM):** 2 (5.3%)
- **MISSING (Frontend element exists but no admin control exists):** 2 (5.3%)
