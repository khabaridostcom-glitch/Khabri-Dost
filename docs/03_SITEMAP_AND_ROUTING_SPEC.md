# 03 — सार्वजनिक साइटमैप एवं रूटिंग निर्देशिका (Sitemap & Routing Specification)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**प्रयोजन:** सभी सार्वजनिक रूट्स, नेविगेशन फ्लो, यूआरएल संरचना और एक्सएमएल साइटमैप्स का संपूर्ण विवरण।

---

## 1. वर्तमान यूआरएल संरचना बनाम लक्षित स्वच्छ यूआरएल (Current vs Target URL Architecture)

वर्तमान में एप्लिकेशन एक हाइब्रिड मॉडल (State-driven with History PushState & Hash) का उपयोग करता है। यह मॉडल ब्राउज़र इतिहास में यूआरएल बदलता है, लेकिन सिंगल पेज एप्लिकेशन होने के कारण बैकएंड पर रीलोड होने पर `server.ts` द्वारा कैच-ऑल हैंडलर पर भेजा जाता है।

| पृष्ठ / मॉड्यूल (Page/Module) | वर्तमान क्रियान्वयन (Current Implementation) | लक्षित स्वच्छ एसईओ यूआरएल (Target Clean URL) | स्थिति एवं विधि (Status) |
|---|---|---|---|
| **होमपेज (Homepage)** | `/` | `https://khabridost.com/` | सक्रिय |
| **एकल समाचार (Single Article)** | `/?article=:id` या `/#article/:id` | `https://khabridost.com/article/:category/:slug-:id` | सक्रिय (कस्टम पुश-स्टेट) |
| **श्रेणी पृष्ठ (Category Page)** | `/?category=:slug` | `https://khabridost.com/category/:slug` | सक्रिय |
| **ई-पेपर (E-Paper Edition)** | `/?view=epaper` या `/#epaper` | `https://khabridost.com/epaper` | सक्रिय |
| **लाइव समाचार (Live Blog)** | `/?view=live` या `/#live` | `https://khabridost.com/live` | सक्रिय |
| **खोज परिणाम (Search)** | `/?search=:query` | `https://khabridost.com/search?q=:query` | सक्रिय |
| **लेखक प्रोफ़ाइल (Author Profile)**| `/?author=:id` | `https://khabridost.com/author/:slug` | सक्रिय |
| **टैग संग्रह (Tag Archive)** | `/?tag=:tag` | `https://khabridost.com/tag/:tag` | सक्रिय |
| **गोपनीयता नीति (Privacy)** | `/?view=privacy` | `https://khabridost.com/privacy-policy` | सक्रिय |
| **नियम एवं शर्तें (Terms)** | `/?view=terms` | `https://khabridost.com/terms-and-conditions` | सक्रिय |
| **शिकायत निवारण (Grievance)** | `/?view=grievance` | `https://khabridost.com/grievance-redressal` | सक्रिय |
| **एडमिन स्टूडियो (Admin)** | `/?view=admin` (पासवर्ड सुरक्षित) | `https://khabridost.com/admin` | सक्रिय |

---

## 2. प्रत्येक सार्वजनिक रूट का विस्तृत विवरण (Detailed Public Route Breakdown)

### 2.1 होमपेज (Homepage: `/`)
- **प्रयोजन:** मुख्य डिजिटल समाचार फ्रंटपेज।
- **मुख्य कंपोनेंट्स:** `Header`, `BreakingNewsTicker`, `HeroSlider`, `CategoryBlock`, `LiveNewsTicker`, `AdBanner`, `Footer`।
- **डेटा स्रोत:** Firestore कलेक्शन्स `articles` (शीर्ष 30 हालिया समाचार), `portal_settings`, `breaking_news`।
- **एसईओ व्यवहार:**
  - टाइटल: `खबरी दोस्त — निष्पक्ष, सटीक और सबसे तेज़ हिंदी समाचार | Khabri Dost`
  - मेटा विवरण: `खबरी दोस्त (khabridost.com) पर पढ़ें देश, विदेश, राज्य, राजनीति, खेल, मनोरंजन और व्यापार की ताज़ा और निष्पक्ष ख़बरें।`
  - स्कीमा: `NewsMediaOrganization`, `WebSite` विथ `SearchAction`।
- **रिस्पॉन्सिव लेआउट:** मोबाइल पर सिंगल कॉलम ग्रिड, टैबलेट पर 2-कॉलम और डेस्कटॉप पर 3-कॉलम लेआउट विथ स्टिकी साइडबार।

---

### 2.2 एकल समाचार पृष्ठ (Single Article Page: `/article/:slug` या `/?article=:id`)
- **प्रयोजन:** समाचार की विस्तृत रिपोर्टिंग, पाठक सहभागिता और मुद्रीकरण।
- **मुख्य कंपोनेंट्स:**
  - ब्रेडक्रम्ब नेविगेशन: `होम > श्रेणी > उप-श्रेणी > शीर्षक`
  - H1 मुख्य शीर्षक: रिसेट एवं डिफ़ॉल्ट आकार **32px** (`articleTitleDesktopPx: 32`), बोल्ड देवनागरी फ़ॉन्ट।
  - मेटा बायलाइन: लेखक का नाम, फोटो, प्रकाशन तिथि (हिंदी प्रारूप: "15 अक्टूबर 2026"), अपडेट का समय, अनुमानित पढ़ने का समय (Reading Time)।
  - सोशल शेयरिंग टूलबार: WhatsApp शेयर (एक क्लिक में शीर्षक + यूआरएल), Facebook, Twitter/X, Telegram, कॉपी लिंक और प्रिंट।
  - मल्टीमीडिया: 16:9 फीचर्ड इमेज, इमेज कैप्शन, फोटो साभार/क्रेडिट।
  - टेक्स्ट-टू-स्पीच (Audio Player): हिंदी में समाचार सुनने की सुविधा (Web Speech API)।
  - मुख्य सामग्री: रिच टेक्स्ट, इनलाइन विज्ञापन, ब्लॉककोट, एम्बेड्स।
  - सहभागिता: लाइक बटन, व्यू काउंटर, संबंधित समाचार (Related Stories), पाठक पोल (Reader Opinion Poll)।
- **एसईओ व्यवहार:**
  - डायनामिक `NewsArticle` JSON-LD स्कीमा।
  - OpenGraph Tags: `og:title`, `og:description`, `og:image`, `og:type="article"`।
  - Twitter Card: `summary_large_image`।
  - कैनोनिकल यूआरएल: `https://khabridost.com/article/:slug-:id`।

---

### 2.3 श्रेणी एवं उप-श्रेणी पृष्ठ (Category Pages)
- **मानक 9 प्राथमिक श्रेणियां:**
  1. **देश (National):** राष्ट्रीय महत्व की खबरें, सरकारी नीतियां।
  2. **विदेश (International):** वैश्विक घटनाएं और कूटनीति।
  3. **राज्य (State/Regional):** उत्तर प्रदेश, बिहार, मध्य प्रदेश, राजस्थान आदि।
  4. **राजनीति (Politics):** चुनाव, संसद, राजनीतिक दल।
  5. **व्यापार (Business):** शेयर बाजार, अर्थव्यवस्था, स्टार्टअप्स, बजट।
  6. **खेल (Sports):** क्रिकेट, ओलंपिक, फुटबॉल, आईपीएल।
  7. **मनोरंजन (Entertainment):** बॉलीवुड, सिनेमा, टीवी, ओटीटी।
  8. **टेक-ऑटो (Tech & Auto):** नए गैजेट्स, मोबाइल, ऑटोमोबाइल।
  9. **धर्म-अध्यात्म (Spiritual):** राशिफल, पंचांग, पर्व एवं त्योहार।
- **टेम्पलेट:** शीर्ष पर श्रेणी शीर्षक एवं विवरण, फ़िल्टर बार (ताज़ा / लोकप्रिय), 3-कॉलम ग्रिड।

---

### 2.4 डिजिटल ई-पेपर (E-Paper Page: `/?view=epaper`)
- **प्रयोजन:** प्रिंट समाचार पत्र का डिजिटल प्रतिकृति (PDF Edition Viewer)।
- **विशेषताएं:**
  - संस्करण चयन ड्रॉपडाउन (जैसे: दिल्ली, लखनऊ, भोपाल संस्करण)।
  - कैलेंडर द्वारा पुरानी तारीखों का संग्रह।
  - ज़ूम-इन, ज़ूम-आउट, फुल-स्क्रीन मोड और पीडीएफ डाउनलोड विकल्प।
- **डेटा स्रोत:** Firestore कलेक्शन `epaper_editions`।

---

### 2.5 लाइव समाचार कवरेज (Live Blog: `/?view=live`)
- **प्रयोजन:** ब्रेकिंग घटनाओं, चुनावी परिणामों या क्रिकेट मैचों की पल-पल की लाइव रिपोर्टिंग।
- **विशेषताएं:**
  - स्वचालित रीफ्रेश (Auto-poll every 60s)।
  - टाइमस्टैम्प्ड बुलेटिन कार्ड्स (जैसे: "10:45 AM - सुप्रीम कोर्ट का बड़ा फैसला")।
  - लाइव पल्स एनीमेशन (Red Pulsing Dot)।

---

## 3. स्वचालित XML साइटमैप्स एवं फीड्स (XML Sitemaps Architecture)

`server.ts` सीधे निम्नलिखित तीन आवश्यक एसईओ एंडपॉइंट्स परोसता है:

### 3.1 Google News XML Sitemap (`/news-sitemap.xml`)
गूगल न्यूज क्रॉलर केवल पिछले 48 घंटों में प्रकाशित आलेखों को स्वीकार करता है:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://khabridost.com/article/desh/chandrayaan-mission-update-102</loc>
    <news:news>
      <news:publication>
        <news:name>Khabri Dost</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>2026-10-15T08:30:00+05:30</news:publication_date>
      <news:title>चंद्रयान मिशन पर इसरो का नया अपडेट, वैज्ञानिकों ने दी जानकारी</news:title>
    </news:news>
  </url>
</urlset>
```

### 3.2 सामान्य सर्च इंजन साइटमैप (`/sitemap.xml`)
- सभी स्थिर पृष्ठ (Static Pages: Home, About, Privacy, Categories)।
- सभी प्रकाशित स्थायी आलेखों की सूची विथ `<lastmod>` और `<changefreq>hourly</changefreq>`।

### 3.3 आरएसएस 2.0 सिंडिकेशन फीड (`/rss.xml`)
- मानक RSS 2.0 XML जिसमें `<title>`, `<link>`, `<description>`, `<content:encoded>`, और `<enclosure>` (छवियों के लिए) शामिल हैं।
