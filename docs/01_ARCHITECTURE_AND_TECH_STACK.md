# 01 — आर्किटेक्चर एवं टेक्नोलॉजी स्टैक (Architecture & Tech Stack)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**प्रकार:** Full-Stack Enterprise Hindi News Publishing Engine & Progressive Web App

---

## 1. सामान्य प्रणाली अवलोकन (High-Level System Architecture)

खबरी दोस्त (`khabridost.com`) एक आधुनिक, उच्च-प्रदर्शन वाला डिजिटल समाचार और संपादकीय प्रकाशन प्लेटफ़ॉर्म (Digital News & Media CMS) है। यह प्लेटफ़ॉर्म हाइब्रिड आर्किटेक्चर का पालन करता है:
- **क्लाइंट-साइड (Frontend):** React 19 (SPA) विथ टाइपस्क्रिप्ट (TypeScript) और टेलविंड सीएसएस v4 (Tailwind CSS v4)
- **सर्वर-साइड (Backend):** Node.js 20+ एवं Express.js 4.x सर्वर जो SSR-तुल्य डायनामिक मेटा-टैग्स (OpenGraph/Twitter Cards), XML साइटमैप्स (Google News XML), RSS/Atom फीड्स और सिक्योर API प्रॉक्सी रूट्स प्रदान करता है।
- **डेटाबेस एवं क्लाउड ऑथेंटिकेशन:** Google Cloud Firestore (NoSQL Document Store) और Firebase Authentication (Email/Password + RBAC टोकन्स)।
- **स्थानीय एवं ऑफ़लाइन क्षमताएं:** लोकलस्टोरेज (LocalStorage) फ़ॉलबैक सिंक्रोनाइज़ेशन, PWA सर्विस वर्कर कैशिंग, और रियल-टाइम वेबसॉकेट-मुक्त फायरस्टोर स्नैपशॉट लिसनर्स (`onSnapshot`)।

```
                                  [खबरी दोस्त (khabridost.com) आर्किटेक्चर]
                                                      │
         ┌────────────────────────────────────────────┴────────────────────────────────────────────┐
         ▼                                                                                         ▼
[सार्वजनिक पाठक (Public Readers)]                                                         [संपादकीय दल (Editorial & Admin)]
   ├── PWA / Mobile Browser                                                                   ├── WordPress-शैली एडमिन स्टूडियो
   ├── Google News Bot / Crawlers                                                             ├── AI-असिस्टेड एडिटर
   └── Social Media Scrapers (FB/WhatsApp)                                                    └── लाइव बुलेटिन व ई-पेपर प्रबंधक
         │                                                                                         │
         ▼                                                                                         ▼
   [Express HTTP/HTTPS Server (Port 3000 / server.ts)] ───────────────────────────────┐
   ├── Security Hardening (CSP, HSTS, X-Frame-Options, X-Content-Type)                 │
   ├── Dynamic HTML Ingestion (Meta Tags Injection for crawlers/scrapers)              │
   ├── XML Endpoints (/sitemap.xml, /news-sitemap.xml, /rss.xml)                       │
   ├── Secure AI Proxy (/api/gemini/summarize, /api/gemini/translate)                  │
   └── Express Compression & Static Asset Serving (Vite Middlewares in Dev)            │
         │                                                                             │
         ▼                                                                             ▼
   [React 19 Single Page Application (Client-Side App.tsx)]                       [Google Cloud Services]
   ├── Vite Bundler + ESBuild                                                          ├── Firebase Firestore (Database)
   ├── Lucide React Icons (300+ UI Icons)                                              ├── Firebase Auth (RBAC)
   ├── Tailwind CSS v4 Engine + Custom Google Fonts (Mukta, Yantramanav, etc.)        ├── Google Generative AI (Gemini 3.8)
   └── Client-side State + LocalStorage Cache Manager                                  └── Google Trends / RSS Feeds
```

---

## 2. कोर टेक्नोलॉजी स्टैक विवरण (Core Technology Stack)

| स्तर (Tier) | घटक / लाइब्रेरी | संस्करण (Version) | कार्य एवं भूमिका (Role & Purpose) |
|---|---|---|---|
| **Frontend Framework** | `react`, `react-dom` | `^19.0.0` (React 19) | मुख्य यूआई रेंडरिंग, समवर्ती रेंडरिंग (Concurrent Features), और कंपोनेंट जीवनचक्र। |
| **Language** | `typescript` | `~5.8.2` | स्थिर टाइप-सुरक्षा (Static Type Safety), इंटरफेस विनिर्देश (`types.ts`), रिफैक्टरिंग सुरक्षा। |
| **Build Tool & Bundler** | `vite`, `@vitejs/plugin-react` | `^6.2.0` | विकास के दौरान तीव्र HMR और उत्पादन के लिए अत्यधिक अनुकूलित ESBuild + Rollup बंडलिंग। |
| **Backend Framework** | `express` | `^4.21.2` | पोर्ट 3000 पर सर्वर, डायनामिक हेड इंजेक्शन, सुरक्षात्मक हेडर्स, API एंडपॉइंट्स और साइटमैप रेंडरर। |
| **Styling & Design System**| `tailwindcss`, `@tailwindcss/vite` | `^4.0.0` | यूटिलिटी-फ़र्स्ट स्टाइलिंग, आधुनिक CSS वेरिएबल्स, डार्क/लाइट मोड थीम्स। |
| **Database & Auth** | `firebase` | `^11.4.0` | क्लाउड फायरस्टोर रियल-टाइम डेटाबेस, क्लाउड ऑथेंटिकेशन और सुरक्षा नियम। |
| **Icons Library** | `lucide-react` | `^1.16.0` | आधुनिक, लाइटवेट एसवीजी आइकॉन्स (आलेख, एडमिन, नेविगेशन और सोशल शेयरिंग)। |
| **AI Integration** | `@google/genai` | `^0.1.2` | जेमिनी 3.8 फ्लैश मॉडल द्वारा समाचार सारांश, हेडलाइन जनरेशन और स्वचालित अनुवाद। |
| **HTML Parser & Utility** | `canvas-confetti`, `clsx` | `^1.9.4` | पाठकों के लिए इंटरैक्टिव पोल व यूआई यूटिलिटीज। |
| **Development Engine** | `tsx` | `^4.19.3` | नोड पर बिना ट्रांसपाइल किए सीधे टाइपस्क्रिप्ट निष्पादित करने वाला रनटाइम। |

---

## 3. सर्वर-साइड आर्किटेक्चर (`server.ts` विश्लेषण)

खबरी दोस्त का बैकएंड सर्वर `server.ts` पर स्थित है और इसमें निम्नलिखित महत्वपूर्ण कार्य शामिल हैं:

### 3.1 सुरक्षा हेडर्स (Hardened HTTP Security Headers)
सर्वर में एंटरप्राइज-ग्रेड सुरक्षा नीतियां सीधे एक्सप्रेस मिडलवेयर द्वारा लागू की गई हैं:
1. `X-Content-Type-Options: nosniff`: माइम-टाइप स्निफिंग को रोकता है।
2. `X-Frame-Options: SAMEORIGIN`: क्लिकजैकिंग हमलों से सुरक्षा।
3. `X-XSS-Protection: 1; mode=block`: पुराने ब्राउज़रों में क्रॉस-साइट स्क्रिप्टिंग फिल्टर सक्षम करता है।
4. `Referrer-Policy: strict-origin-when-cross-origin`: संवेदनशील रेफरल डेटा रिसाव को रोकता है।
5. `Permissions-Policy: camera=(), microphone=(), geolocation=()`: अवांछित हार्डवेयर अनुमतियों को ब्लॉक करता है।

### 3.2 सर्च इंजन व सोशल बॉट्स के लिए डायनामिक मेटा टैग इंजेक्शन (SSR-Grade Meta Scraper)
चूंकि React SPA क्लाइंट-साइड रेंडर होता है, फेसबुक क्रॉलर, व्हाट्सएप स्क्रैपर और ट्विटर बॉट्स जावास्क्रिप्ट नहीं चलाते। `server.ts` में एक उन्नत बॉट-डिटेक्शन एल्गोरिदम लागू है:
- **डिटेक्टेड बॉट्स:** `facebookexternalhit`, `Facebot`, `Twitterbot`, `WhatsApp`, `TelegramBot`, `LinkedInBot`, `Googlebot`, `bingbot`, `Slackbot`.
- **कार्यप्रणाली:** जब कोई बॉट `/article/:slug` या `/?article=:id` पर हिट करता है, सर्वर फायरस्टोर या कैश्ड डेटा से समाचार का शीर्षक, सारांश, फीचर्ड इमेज और कैनोनिकल यूआरएल प्राप्त करता है और `index.html` में `<meta property="og:title">`, `<meta property="og:image">`, `<meta name="twitter:card">` को स्ट्रिंग रिप्लेसमेंट के माध्यम से इनलाइन इंजेक्ट कर भेजता है।

### 3.3 सर्वर एंडपॉइंट्स (Server Endpoints Inventory)
- `GET /sitemap.xml`: संपूर्ण सार्वजनिक साइटमैप।
- `GET /news-sitemap.xml`: पिछले 48 घंटों में प्रकाशित समाचारों के लिए गूगल न्यूज कंप्लेंट XML साइटमैप (Google News Publication Tag `Khabri Dost`, Language `hi`)।
- `GET /rss.xml`: सिंडिकेशन और फीड एग्रीगेटर्स के लिए मानक RSS 2.0 फीड।
- `POST /api/gemini/summarize`: जेमिनी एपीआई के माध्यम से समाचार का 3-बिंदु बुलेट सारांश तैयार करना।
- `POST /api/gemini/headline-suggestions`: आकर्षक और एसईओ-अनुकूल 5 हेडलाइन सुझाव।
- `POST /api/gemini/fact-check-brief`: त्वरित संपादकीय तथ्य-जांच सुझाव।
- `GET /api/trends/india`: गूगल ट्रेंड्स इंडिया से ट्रेंडिंग कीवर्ड्स प्राप्त करने का प्रॉक्सी एंडपॉइंट।

---

## 4. क्लाइंट-साइड आर्किटेक्चर (`src/App.tsx` एवं कंपोनेंट ट्री)

### 4.1 रूटिंग मॉडल (Hybrid State & Hash-Aware Routing)
एप्लिकेशन एक कस्टम, कुशल और हल्के रूटिंग आर्किटेक्चर का उपयोग करता है जो बिना किसी भारी बाहरी राउटर के काम करता है:
- **`currentView` स्टेट:** `'home' | 'article' | 'category' | 'admin' | 'epaper' | 'live' | 'search' | 'author' | 'tag' | 'privacy' | 'terms'`
- **हैश व हिस्ट्री सिंक्रनाइज़ेशन:** `window.location.hash` और `window.history.pushState` के समन्वय से कार्य करता है।
- **ब्राउज़र बैक/फॉरवर्ड हैंडलिंग:** `window.addEventListener('popstate', ...)` द्वारा उपयोगकर्ता को ब्राउज़र बैक बटन दबाने पर सही पृष्ठ या होमपेज पर वापस ले जाया जाता है।

### 4.2 ग्लोबल स्टेट एवं स्टोरेज लेयर
- **प्राथमिक डेटा स्रोत:** Firestore (`src/services/newsService.ts`)।
- **ऑफ़लाइन फ़ॉलबैक एवं त्वरित बूट:** `localStorage.getItem('kd_articles')` और `localStorage.getItem('kd_portal_settings')`।
- **डिफ़ॉल्ट सेटिंग्स:** `src/data/portalDefaults.ts` (जहां ब्रांड का नाम, 9 प्राथमिक श्रेणियां, सामाजिक लिंक, वॉटरमार्क और टाइपोग्राफी डिफ़ॉल्ट्स सुरक्षित हैं)।

---

## 5. पर्यावरण एवं रनटाइम बाधाएं (Environment & Runtime Constraints)

1. **पोर्ट 3000:** संपूर्ण ऐप को पोर्ट 3000 पर ही चलना अनिवार्य है।
2. **इनलाइन प्रॉम्प्ट्स व अलर्ट्स निषेध:** `window.alert` और `window.prompt` अवरुद्ध हैं; उनके स्थान पर कस्टम रिएक्ट मोडल या टॉस्ट अलर्ट्स का उपयोग किया गया है।
3. **क्लाउड रन एवं कंटेनर रेडी:** `npm run build` द्वारा Vite क्लाइंट को `dist/` में संकलित करता है, और उत्पादन में `node server.ts` दोनों को एक साथ परोसता है।
