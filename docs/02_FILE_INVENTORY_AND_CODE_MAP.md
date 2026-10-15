# 02 — संपूर्ण फ़ाइल इन्वेंटरी एवं कोड मैप (File Inventory & Code Map)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**प्रयोजन:** प्रत्येक महत्वपूर्ण फ़ाइल का तकनीकी दायरा, निर्भरता विश्लेषण और ऑडिट स्थिति

---

## 1. एप्लीकेशन एंट्री पॉइंट्स (Application Entry Points)

### 1.1 `server.ts`
- **पथ:** `/server.ts`
- **प्रयोजन:** फुल-स्टैक बैकएंड एक्सप्रेस सर्वर, एसएसआर मेटा-टैग्स इंजेक्शन, गूगल न्यूज एक्सएमएल साइटमैप, जेमिनी एआई प्रॉक्सी।
- **मुख्य कार्य/घटक:** `app.use(...)` सुरक्षा हेडर्स, `generateSitemapXml()`, `generateGoogleNewsXml()`, `POST /api/gemini/summarize`, बॉट यूजर-एजेंट डिटेक्शन।
- **निर्भरताएं:** `express`, `vite`, `fs`, `path`, `@google/genai`।
- **नियंत्रित सेटिंग्स:** पोर्ट 3000, HTTP सुरक्षा नीतियां, कैश-कंट्रोल, ओपनग्राफ मेटा प्री-रेंडर।
- **स्थिति:** **सक्रिय (Actively Used)** — प्रोडक्शन और डेवलपमेंट दोनों का प्राथमिक सर्वर एंट्री पॉइंट।
- **भविष्य ऑडिट नोट:** फायरस्टोर के साथ सर्वर-साइड डेटा फेचिंग की लेटेंसी और कैशिंग को सत्यापित करना।

### 1.2 `index.html`
- **पथ:** `/index.html`
- **प्रयोजन:** क्लाइंट-साइड HTML शैल, गूगल फ़ॉन्ट्स प्रीलोड (Mukta, Yantramanav, Rozha One), PWA मैनिफेस्ट लिंक।
- **मुख्य घटक:** `<div id="root"></div>`, फ़ॉन्ट सीडीएन लिंक्स, डिफ़ॉल्ट टाइटल व मेटा विवरण।
- **स्थिति:** **सक्रिय (Actively Used)**।
- **भविष्य ऑडिट नोट:** सुनिश्चित करें कि टाइटल और मेटा विवरण `metadata.json` से हमेशा सिंक रहें।

### 1.3 `src/main.tsx`
- **पथ:** `/src/main.tsx`
- **प्रयोजन:** रिएक्ट 19 वर्चुअल डोम माउंटिंग और स्ट्रिक्ट मोड निष्पादन।
- **मुख्य घटक:** `createRoot(document.getElementById('root')!).render(<App />)`।
- **स्थिति:** **सक्रिय (Actively Used)**।

---

## 2. कोर एप्लीकेशन स्टेट एवं रूटिंग (Core App & Routing)

### 2.1 `src/App.tsx`
- **पथ:** `/src/App.tsx` (~1400 पंक्तियां)
- **प्रयोजन:** संपूर्ण पोर्टल का केंद्रीय आर्केस्ट्रेटर (Master Controller)। यह सभी स्टेट्स, फायरस्टोर सब्सक्रिप्शन, व्यू-स्विचिंग, एडमिन गेटवे और मोडल प्रबंधन को नियंत्रित करता है।
- **मुख्य कार्य:** `handleSelectArticle()`, `handleCategorySelect()`, `handleResetTypography()`, `handleSaveSettings()`, `currentView` स्टेट स्विच।
- **स्थिति:** **सक्रिय एवं अति-महत्वपूर्ण (Core Active Engine)**।
- **भविष्य ऑडिट नोट:** इसे छोटे कस्टम हुक्स (`useArticles`, `usePortalSettings`, `useRouting`) में विभाजित किया जा सकता है ताकि रखरखाव आसान हो सके।

### 2.2 `src/types.ts`
- **पथ:** `/src/types.ts`
- **प्रयोजन:** संपूर्ण एप्लिकेशन के लिए टाइपस्क्रिप्ट इंटरफेस और डेटा अनुबंध।
- **मुख्य इंटरफेस:** `NewsArticle`, `PortalSettings`, `TypographySettings`, `CategoryItem`, `AdBannerItem`, `LiveNewsItem`, `EPaperEdition`, `StaffMember`।
- **स्थिति:** **सक्रिय (Actively Used)**।

---

## 3. सार्वजनिक फ्रंटएंड घटक (Public Frontend Components)

### 3.1 `src/components/Header.tsx`
- **पथ:** `/src/components/Header.tsx`
- **प्रयोजन:** मुख्य सार्वजनिक हेडर, ब्रेकिंग न्यूज़ टिकर, दिनांक/समय, 9-श्रेणी नेविगेशन बार, लाइव टीवी बटन, सर्च बार, फ़ॉन्ट आकार टॉगल (A- / A+)।
- **नियंत्रित सेटिंग्स:** `portalSettings.header`, `portalSettings.breakingNews`, `portalSettings.branding`।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.2 `src/components/Footer.tsx`
- **पथ:** `/src/components/Footer.tsx`
- **प्रयोजन:** बहु-स्तंभ पादलेख (Multi-column Footer), संपादकीय डिस्क्लेमर, कानूनी पृष्ठ लिंक (गोपनीयता, नियम, शिकायत अधिकारी), सोशल लिंक्स, एडमिन लॉगिन लिंक।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.3 `src/components/ArticlePageView.tsx`
- **पथ:** `/src/components/ArticlePageView.tsx` (~1300 पंक्तियां)
- **प्रयोजन:** पूर्ण सिंगल आर्टिकल व्यू (Full Single Article Page)।
- **मुख्य कार्य:** H1 शीर्षक (32px), लेखक बायलाइन, रीडिंग टाइम, सोशल शेयरिंग (WhatsApp, FB, Twitter, Telegram, Copy Link), टेक्स्ट-टू-स्पीच रीडर, संबंधित समाचार, इनलाइन व बॉटम विज्ञापन, पोल घटक।
- **स्थिति:** **सक्रिय (Actively Used)**।
- **भविष्य ऑडिट नोट:** इनलाइन शैलियों और सीएसएस क्लासों की विशिष्टता (CSS specificity) का सत्यापन।

### 3.4 `src/components/ArticleCard.tsx`
- **पथ:** `/src/components/ArticleCard.tsx`
- **प्रयोजन:** ग्रिड और लिस्ट व्यू के लिए मॉड्यूलर समाचार कार्ड घटक।
- **प्रारूप:** ग्रिड कार्ड, कॉम्पैक्ट लिस्ट कार्ड, ट्रेंडिंग कार्ड और वीडियो बैज।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.5 `src/components/BreakingNewsTicker.tsx`
- **पथ:** `/src/components/BreakingNewsTicker.tsx`
- **प्रयोजन:** लाल रंग की एनिमेटेड ब्रेकिंग न्यूज़ पट्टी।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.6 `src/components/HeroSlider.tsx`
- **पथ:** `/src/components/HeroSlider.tsx`
- **प्रयोजन:** होमपेज का मुख्य लीड स्टोरी स्लाइडर और प्रमुख 4 समाचार ग्रिड।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.7 `src/components/LiveNewsSection.tsx`
- **पथ:** `/src/components/LiveNewsSection.tsx`
- **प्रयोजन:** वास्तविक समय की लाइव ब्लॉगिंग और पल-पल की खबरें।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.8 `src/components/EPaperSection.tsx`
- **पथ:** `/src/components/EPaperSection.tsx`
- **प्रयोजन:** डिजिटल ई-पेपर संस्करण, पीडीएफ दर्शक और ज़ूम नियंत्रण।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 3.9 `src/components/StaticPages.tsx`
- **पथ:** `/src/components/StaticPages.tsx`
- **प्रयोजन:** कानूनी पृष्ठ — गोपनीयता नीति (Privacy Policy), नियम एवं शर्तें (Terms & Conditions), हमारे बारे में (About Us), संपर्क एवं शिकायत निवारण (Grievance Redressal)।
- **स्थिति:** **सक्रिय (Actively Used)**।

---

## 4. एडमिन पैनल एवं सीएमएस घटक (Admin Studio & CMS Modules)

### 4.1 `src/components/admin/AdminDashboard.tsx`
- **पथ:** `/src/components/admin/AdminDashboard.tsx`
- **प्रयोजन:** संपूर्ण एडमिन का मुख्य लेआउट और वर्डप्रेस-शैली का साइडबार।
- **टैब संख्या:** 28+ एकीकृत टैब्स।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.2 `src/components/admin/ArticleEditorModal.tsx`
- **पथ:** `/src/components/admin/ArticleEditorModal.tsx`
- **प्रयोजन:** पूर्ण समाचार संपादक (Rich Article Editor) — हेडलाइन, स्लग, सारांश, रिच टेक्स्ट कंटेंट, श्रेणियां, टैग्स, लेखक, फीचर्ड इमेज, एसईओ मेटा, फोकस कीवर्ड्स, शेड्यूलिंग।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.3 `src/components/admin/TypographySettingsTab.tsx`
- **पथ:** `/src/components/admin/TypographySettingsTab.tsx`
- **प्रयोजन:** वैश्विक टाइपोग्राफी, फ़ॉन्ट चयन (हिंदी देवनागरी फ़ॉन्ट्स), H1 शीर्षक आकार (32px), बॉडी फ़ॉन्ट, हेडर फ़ॉन्ट और सीएसएस चर जनरेटर।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.4 `src/components/admin/CategoryManagementTab.tsx`
- **पथ:** `/src/components/admin/CategoryManagementTab.tsx`
- **प्रयोजन:** श्रेणियों और उप-श्रेणियों का प्रबंधन, रंग कोडिंग और क्रम निर्धारण।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.5 `src/components/admin/AdManagementTab.tsx`
- **पथ:** `/src/components/admin/AdManagementTab.tsx`
- **प्रयोजन:** विज्ञापन स्लॉट प्रबंधन (हेडर लीडरबोर्ड, आर्टिकल इन-कंटेंट, साइडबार, पादलेख)।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.6 `src/components/admin/LiveNewsAdminTab.tsx`
- **पथ:** `/src/components/admin/LiveNewsAdminTab.tsx`
- **प्रयोजन:** लाइव कवरेज फीड जोड़ना, संपादित करना और हटाना।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.7 `src/components/admin/EPaperAdminTab.tsx`
- **पथ:** `/src/components/admin/EPaperAdminTab.tsx`
- **प्रयोजन:** ई-पेपर पीडीएफ अपलोड, संस्करण तिथि और थंबनेल प्रबंधन।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 4.8 `src/components/admin/SeoGoogleServicesTab.tsx`
- **पथ:** `/src/components/admin/SeoGoogleServicesTab.tsx`
- **प्रयोजन:** गूगल सर्च कंसोल, एनालिटिक्स (GA4), गूगल टैग मैनेजर (GTM), और गूगल न्यूज पब्लिशर आईडी विन्यास।
- **स्थिति:** **सक्रिय (Actively Used)**।

---

## 5. सेवाएं, डेटा लेयर एवं सुरक्षा (Services & Security)

### 5.1 `src/services/newsService.ts`
- **पथ:** `/src/services/newsService.ts`
- **प्रयोजन:** फायरस्टोर के साथ सभी डेटाबेस ऑपरेशन्स — आर्टिकल्स CRUD, व्यूज/लाइक्स इंक्रीमेंट, पोर्टल्स सेटिंग्स फेच/सेव।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 5.2 `src/firebase.ts`
- **पथ:** `/src/firebase.ts`
- **प्रयोजन:** फायरबेस इनिशियलाइज़ेशन, फायरस्टोर और ऑथ ऑब्जेक्ट का निर्यात।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 5.3 `firestore.rules`
- **पथ:** `/firestore.rules`
- **प्रयोजन:** उत्पादन सुरक्षा नियम — सार्वजनिक पाठकों के लिए केवल-पठन (read-only) और केवल प्रमाणित एडमिन/संपादकों के लिए लेखन (write)।
- **स्थिति:** **सक्रिय (Actively Used)**।

### 5.4 `src/data/portalDefaults.ts`
- **पथ:** `/src/data/portalDefaults.ts`
- **प्रयोजन:** फ़ॉलबैक और प्रारंभिक पोर्टल सेटिंग्स — 9 श्रेणियां, 32px डिफ़ॉल्ट H1 शीर्षक, 17px बॉडी टेक्स्ट, सोशल लिंक्स, वॉटरमार्क।
- **स्थिति:** **सक्रिय (Actively Used)**।
