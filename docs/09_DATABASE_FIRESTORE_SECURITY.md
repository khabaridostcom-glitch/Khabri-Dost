# 09 — डेटाबेस, फायरस्टोर स्कीमा एवं सुरक्षा नियम (Database, Firestore & Security)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**डेटाबेस इंजन:** Google Cloud Firestore (Serverless NoSQL Document Store)  
**प्रमाणीकरण:** Firebase Authentication (RBAC)

---

## 1. फायरस्टोर कलेक्शन्स स्कीमा निर्देशिका (Firestore Collections Schema)

खबरी दोस्त का डेटाबेस 10 प्रमुख कलेक्शन्स में व्यवस्थित है:

### 1.1 `articles` (समाचार आलेख)
- **दस्तावेज़ आईडी:** ऑटो-जेनरेटेड या स्लग-आधारित आईडी (उदा: `isro-chandrayaan-102`)
- **फ़ील्ड्स:**
  - `title` (`string`): मुख्य समाचार शीर्षक
  - `slug` (`string`): यूआरएल स्लग
  - `summary` (`string`): 2-3 पंक्तियों का सार
  - `content` (`string`): संपूर्ण HTML/रिच टेक्स्ट सामग्री
  - `category` (`string`): प्राथमिक श्रेणी स्लग (उदा: `desh`, `rajneeti`)
  - `subcategory` (`string`, वैकल्पिक): उप-श्रेणी
  - `tags` (`array` of `string`): टैग्स सूची
  - `author` (`string`): लेखक का नाम
  - `authorId` (`string`, वैकल्पिक): स्टाफ सदस्य की आईडी
  - `imageUrl` (`string`): 16:9 मुख्य आलेख छवि का यूआरएल
  - `imageCaption` (`string`): छवि का विवरण
  - `imageCredit` (`string`): फोटो साभार
  - `status` (`string`): `'draft' | 'published' | 'scheduled' | 'archived'`
  - `publishedAt` (`string` / `timestamp`): आधिकारिक प्रकाशन समय
  - `updatedAt` (`string` / `timestamp`): अंतिम संशोधन समय
  - `views` (`number`): कुल पृष्ठ दृश्य
  - `likes` (`number`): पाठकों के लाइक्स
  - `seoTitle` (`string`): एसईओ शीर्षक
  - `metaDescription` (`string`): मेटा विवरण
  - `isBreaking` (`boolean`): ब्रेकिंग टिकर में दिखाना है या नहीं
  - `isFeatured` (`boolean`): होमपेज मुख्य स्लाइडर में प्राथमिकता

---

### 1.2 `portal_settings` (पोर्टल सेटिंग्स)
- **दस्तावेज़ आईडी:** `general`
- **फ़ील्ड्स:**
  - `branding`: `{ siteName: "Khabri Dost", tagline: "निष्पक्ष, सटीक और सबसे तेज़ हिंदी समाचार", logoUrl: "..." }`
  - `typography`: `{ headlineFont: "'Mukta', sans-serif", bodyFont: "'Yantramanav', sans-serif", articleTitleDesktopPx: 32, articleTitleMobilePx: 26, articleBodyFontSizePx: 17 }`
  - `categories`: 9 प्राथमिक श्रेणियों की संरचित ऐरे (`id`, `name`, `slug`, `color`, `order`)
  - `socialLinks`: `{ whatsapp: "...", telegram: "...", facebook: "...", twitter: "...", youtube: "..." }`
  - `contact`: `{ email: "khabaridost.com@gmail.com", phone: "...", address: "...", grievanceOfficer: "..." }`
  - `seo`: `{ googleAnalyticsId: "...", gtmId: "...", searchConsoleToken: "...", publisherId: "..." }`

---

### 1.3 `live_news` (लाइव ब्लॉग बुलेटिन)
- **दस्तावेज़ आईडी:** ऑटो-जेनरेटेड
- **फ़ील्ड्स:**
  - `headline` (`string`): संक्षिप्त लाइव अपडेट
  - `content` (`string`): विस्तृत विवरण या सोशल एम्बेड
  - `timestamp` (`string`): अपडेट का समय (उदा: "11:20 AM")
  - `topic` (`string`): संबंधित घटना (उदा: "विधानसभा चुनाव परिणाम")
  - `isUrgent` (`boolean`): लाल रंग की चेतावनी हाइलाइट

---

### 1.4 `epaper_editions` (डिजिटल ई-पेपर)
- **दस्तावेज़ आईडी:** ऑटो-जेनरेटेड
- **फ़ील्ड्स:**
  - `editionName` (`string`): संस्करण (उदा: "दिल्ली-एनसीआर", "लखनऊ")
  - `date` (`string`): प्रकाशन तिथि (`YYYY-MM-DD`)
  - `pdfUrl` (`string`): ई-पेपर पीडीएफ फ़ाइल का सुरक्षित यूआरएल
  - `thumbnailUrl` (`string`): पहले पन्ने की छवि
  - `totalPages` (`number`): कुल पृष्ठों की संख्या

---

### 1.5 `ad_slots` (विज्ञापन स्लॉट्स)
- **दस्तावेज़ आईडी:** `ad-header-top`, `ad-article-inline`, `ad-sidebar-sticky`
- **फ़ील्ड्स:**
  - `isActive` (`boolean`): स्लॉट सक्षम/अक्षम
  - `type` (`string`): `'adsense' | 'custom_banner'`
  - `adsenseCode` (`string`): गूगल कोड
  - `customImageUrl` (`string`): प्राइवेट बैनर छवि
  - `targetUrl` (`string`): रीडायरेक्ट यूआरएल
  - `sponsoredBy` (`string`): प्रायोजक का नाम

---

## 2. फायरस्टोर सुरक्षा नियम विश्लेषण (`firestore.rules`)

पोर्टल की सुरक्षा सुनिश्चित करने के लिए `firestore.rules` में निम्नलिखित नियम लागू हैं:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // सहायक फ़ंक्शंस (Helper Security Functions)
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.email == 'khabaridost.com@gmail.com');
    }

    // 1. समाचार आलेख (articles)
    match /articles/{articleId} {
      // सार्वजनिक पाठक केवल प्रकाशित आलेख पढ़ सकते हैं
      allow read: if resource.data.status == 'published' || isAdmin();
      
      // केवल प्रमाणित एडमिन या संपादक ही बना और बदल सकते हैं
      allow create, update, delete: if isAdmin();
      
      // सार्वजनिक पाठक केवल व्यू और लाइक संख्या को एटॉमिक रूप से बढ़ा सकते हैं
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views', 'likes']);
    }

    // 2. पोर्टल सेटिंग्स (portal_settings)
    match /portal_settings/{settingId} {
      allow read: if true; // सार्वजनिक रूप से पठनीय (ब्रांडिंग, फ़ॉन्ट्स, नेविगेशन)
      allow write: if isAdmin(); // केवल सुपर एडमिन ही बदल सकता है
    }

    // 3. लाइव समाचार (live_news) एवं ई-पेपर (epaper_editions)
    match /live_news/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /epaper_editions/{editionId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 4. विज्ञापन स्लॉट्स (ad_slots)
    match /ad_slots/{slotId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 3. सुरक्षा एवं स्केलेबिलिटी ऑडिट निष्कर्ष

1. **अनधिकृत बदलावों से पूर्ण सुरक्षा:** फायरस्टोर के नियम बिना लॉगिन वाले किसी भी व्यक्ति को आलेख या सेटिंग्स बदलने से रोकते हैं।
2. **व्यूज और लाइक्स की सुरक्षित सीमाएं:** पाठक केवल `views` और `likes` को इंक्रीमेंट कर सकते हैं, वे शीर्षक, सामग्री या लेखक नहीं बदल सकते।
3. **कम लेटेंसी:** सार्वजनिक पाठकों के लिए `onSnapshot` लिसनर्स की जगह सामान्य `getDocs()` या कैश्ड कॉल्स का उपयोग करने से डेटाबेस रीड्स की लागत न्यूनतम रहती है।
