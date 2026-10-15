# 04 — एडमिन पैनल एवं सीएमएस संरचना (Admin Panel & CMS Map)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**प्रयोजन:** एडमिन साइडबार, सभी 28+ प्रबंधन मॉड्यूल्स, भूमिका आधारित अनुमतियां (RBAC) एवं यूआई/यूएक्स विसंगतियों का विस्तृत तकनीकी मानचित्रण।

---

## 1. एडमिन पैनल का वर्तमान स्वरूप एवं वर्डप्रेस-शैली लेआउट

खबरी दोस्त का एडमिन स्टूडियो (`src/components/admin/AdminDashboard.tsx`) वर्डप्रेस सीएमएस (WordPress CMS) के क्लासिक और कुशल वर्कफ्लो पर आधारित है:
- **बायां साइडबार (Left Sidebar):** फिक्स्ड 260px चौड़ा नेविगेशन पैनल, जिसमें स्पष्ट अनुभाग (Sections), आइकन और सक्रिय टैब संकेतक हैं।
- **शीर्ष पट्टी (Top Bar):** त्वरित एक्शन बटन्स — "नया समाचार लिखें" (Write News), "वेबसाइट देखें" (View Site), सिंक स्थिति और लॉगआउट।
- **मुख्य कार्यक्षेत्र (Main Canvas):** चयनित मॉड्यूल का फॉर्म, तालिका (Data Table), पूर्वावलोकन और सेव नियंत्रण।

---

## 2. साइडबार मॉड्यूल्स का विस्तृत ऑडिट (Complete 28+ Modules Specification)

| # | मॉड्यूल का नाम (Admin Tab) | कार्य एवं उद्देश्य (Purpose & Scope) | नियंत्रित फ़ाइल (Key Files) | संबंधित डेटाबेस तालिका (Firestore Collection) | आवश्यक भूमिका (RBAC) |
|---|---|---|---|---|---|
| 1 | **Dashboard & Health** | समग्र पोर्टल मेट्रिक्स — कुल समाचार, आज के प्रकाशित लेख, कुल पृष्ठ दृश्य (Views), सिस्टम स्थिति। | `AdminDashboard.tsx` | `articles`, `portal_settings` | All Staff |
| 2 | **All Articles (समाचार सूची)** | सभी समाचारों की खोज, फ़िल्टर (ड्राफ्ट, प्रकाशित, शेड्यूल्ड), संपादन, हटाना और त्वरित स्थिति बदलना। | `AdminDashboard.tsx`, `ArticleEditorModal.tsx` | `articles` | Editor, Admin |
| 3 | **Add New Article (नया समाचार)** | समृद्ध WYSIWYG एडिटर, AI जनरेशन टूल्स, मीडिया पिकर, एसईओ मेटा और शेड्यूलिंग फॉर्म। | `ArticleEditorModal.tsx` | `articles` | Reporter, Editor, Admin |
| 4 | **Categories (श्रेणियां)** | 9 प्राथमिक श्रेणियों का संपादन, नई श्रेणियां जोड़ना, रंग कोड, स्लग और प्रदर्शन क्रम। | `CategoryManagementTab.tsx` | `portal_settings` | Admin |
| 5 | **Subcategories (उप-श्रेणियां)**| राज्य स्तर पर जिले या खेल के तहत क्रिकेट जैसी उप-श्रेणियों का श्रेणीबद्ध प्रबंधन। | `CategoryManagementTab.tsx` | `portal_settings` | Admin |
| 6 | **Tags & Keywords (टैग्स)** | समाचारों में प्रयुक्त ट्रेंडिंग टैग्स का केंद्रीकृत प्रबंधन और एसईओ कीवर्ड मैपिंग। | `ArticleEditorModal.tsx` | `articles` | Editor, Admin |
| 7 | **Staff & Authors (संपादकीय दल)**| रिपोर्टरों, वरिष्ठ संपादकों और स्तंभकारों के बायो, सोशल प्रोफाइल्स, पद और अवतार। | `AdminDashboard.tsx` | `staff_members` | Super Admin |
| 8 | **User Roles & RBAC (अनुमतियां)**| उपयोगकर्ता भूमिकाएं: Super Admin, Editor, Sub-Editor, Reporter, Contributor। | `AdminDashboard.tsx`, `firestore.rules` | `users` | Super Admin |
| 9 | **Media Library (मीडिया गैलरी)**| छवियों का वेबपी (WebP) संपीड़न, लाइब्रेरी संग्रह, कॉपी इमेज यूआरएल, वॉटरमार्क लगाना। | `MediaLibraryModal.tsx` | `media` | All Staff |
| 10 | **Homepage Layout (होमपेज लेआउट)**| फीचर्ड हीरो स्लाइडर, ट्रेंडिंग पट्टी, श्रेणी ब्लॉक का क्रम, लेआउट शैली (ग्रिड/मैगज़ीन)। | `AdminDashboard.tsx` | `portal_settings` | Admin |
| 11 | **Header & Navigation (शीर्ष पट्टी)**| लोगो अपलोड, स्टिकी नेविगेशन, टॉप बार दिनांक/मौसम, सर्च बार सक्षम/अक्षम। | `AdminDashboard.tsx` | `portal_settings` | Admin |
| 12 | **Footer & Legal (पादलेख)**| 4-स्तंभ पादलेख टेक्स्ट, कॉपीराइट नोटिस, डिस्क्लेमर, कानूनी पृष्ठ लिंक्स। | `AdminDashboard.tsx` | `portal_settings` | Admin |
| 13 | **Typography (वैश्विक फ़ॉन्ट्स)**| **अति-महत्वपूर्ण:** H1 शीर्षक आकार (32px), बॉडी फ़ॉन्ट आकार (17px), हिंदी फ़ॉन्ट परिवार। | `TypographySettingsTab.tsx` | `portal_settings` | Admin |
| 14 | **Single Article Customizer** | सिंगल आर्टिकल व्यू पर साइडबार स्थिति, फॉन्ट साइज टॉगल, संबंधित समाचार संख्या, ऑथर बॉक्स। | `ArticlePageView.tsx` | `portal_settings` | Admin |
| 15 | **Live News / Live Blog** | ब्रेकिंग घटनाओं की टाइमस्टैम्प्ड लाइव अपडेट्स, ऑटो-रिफ्रेश और लाइव पल्स कंट्रोल। | `LiveNewsAdminTab.tsx` | `live_news` | Editor, Admin |
| 16 | **E-Paper & PDF Manager** | दैनिक ई-पेपर संस्करण पीडीएफ अपलोड, पृष्ठ थंबनेल, तिथि वार संस्करण संग्रह। | `EPaperAdminTab.tsx` | `epaper_editions` | Editor, Admin |
| 17 | **Video & Web Stories** | यूट्यूब वीडियो एम्बेड्स, शॉर्ट वीडियो बुलेटिन और इंस्टाग्राम-शैली वेब स्टोरीज। | `AdminDashboard.tsx` | `articles` (type='video')| Editor, Admin |
| 18 | **Ad Management (विज्ञापन प्रबंधन)**| हेडर लीडरबोर्ड (728x90), आर्टिकल इनलाइन (300x250), साइडबार और कस्टम AdSense कोड। | `AdManagementTab.tsx` | `ad_slots` | Admin |
| 19 | **Push Notifications** | वनसिग्नल (OneSignal) वेब पुश इंटीग्रेशन, तत्काल ब्रेकिंग अलर्ट्स भेजने का फॉर्म। | `PushNotificationModal.tsx` | OneSignal API | Admin |
| 20 | **Social Media Auto-Share** | फेसबुक पेज, एक्स (ट्विटर), टेलीग्राम बॉट और व्हाट्सएप ब्रॉडकास्ट चैनल एकीकरण। | `SocialShareSettingsTab.tsx` | `portal_settings` | Admin |
| 21 | **WhatsApp & Telegram** | सीधे समाचार लेख से व्हाट्सएप ग्रुप/चैनल में जुड़ने वाले विजेट्स का नियंत्रण। | `SocialShareSettingsTab.tsx` | `portal_settings` | Admin |
| 22 | **Google News Publisher** | गूगल न्यूज पब्लिकेशन आईडी, फीड यूआरएल, 48-घंटे की न्यूज़ साइटमैप स्थिति। | `SeoGoogleServicesTab.tsx` | `portal_settings` | Admin |
| 23 | **AI Writing Assistant (Gemini)**| जेमिनी 3.8 फ्लैश मॉडल प्रॉम्प्ट्स: 3-बिंदु सारांश, 5 हेडलाइन विकल्प, तथ्य-जांच सुझाव। | `ArticleEditorModal.tsx`, `server.ts` | Gemini 3.8 Flash | Editor, Admin |
| 24 | **Google Analytics & GTM** | GA4 Measurement ID (`G-XXXXXXXXXX`) और Google Tag Manager कंटेनर कोड इंजेक्शन। | `SeoGoogleServicesTab.tsx` | `portal_settings` | Admin |
| 25 | **Search Console & SEO** | गूगल सर्च कंसोल एचटीएमएल सत्यापन कोड, बिंग वेबमास्टर टूल्स, डिफ़ॉल्ट मेटा रोबोट्स। | `SeoGoogleServicesTab.tsx` | `portal_settings` | Admin |
| 26 | **Static Pages (स्थिर पृष्ठ)** | हमारे बारे में, गोपनीयता नीति, नियम एवं शर्तें, और शिकायत अधिकारी विवरण। | `StaticPages.tsx` | `portal_settings` | Admin |
| 27 | **Watermark & Branding** | छवियों पर लगने वाला 'Khabri Dost' वॉटरमार्क, स्थिति (Bottom-Right), ओपेसिटी (60%)। | `AdminDashboard.tsx` | `portal_settings` | Admin |
| 28 | **Backup & Data Export** | संपूर्ण आर्टिकल्स और सेटिंग्स का JSON बैकअप डाउनलोड और रिस्टोर विकल्प। | `AdminDashboard.tsx` | Firestore / LocalStorage| Super Admin |

---

## 3. यूआई/यूएक्स विसंगतियों का प्रेक्षण (Observed UI Issues to Address)

### 3.1 द्विभाषी (Bilingual) साइडबार लेबल्स
वर्तमान साइडबार में कुछ लेबल्स में हिंदी और अंग्रेजी दोनों लिखे हैं (जैसे: `Typography (टाइपोग्राफी)`, `Ad Management (विज्ञापन)`).
- **अनुशंसा:** पेशेवर वर्डप्रेस एडमिन मानकों के अनुरूप, साइडबार लेबल्स को **शुद्ध अंग्रेजी (English Only)** में रखा जाए (जैसे: *Dashboard*, *Posts*, *Categories*, *Media*, *Appearance*, *Typography*, *Advertising*, *SEO Tools*), ताकि इंटरफेस अव्यवस्थित (cluttered) न लगे।

### 3.2 डार्क ग्रेडिएंट बनाम स्वच्छ लाइट थीम (Light Mode Clean UI)
वर्तमान में कुछ मॉड्यूल्स में भारी डार्क ग्रेडिएंट्स (`bg-gradient-to-r from-slate-900 to-slate-800`) और अत्यधिक घने बॉर्डर्स हैं।
- **अनुशंसा:** वर्डप्रेस एडमिन जैसी साफ-सुथरी लाइट थीम (Clean white canvas `#ffffff`, slate-100 sidebar `#f8fafc`, slate-200 borders, और उच्च कंट्रास्ट टाइपोग्राफी) अपनाई जाए।

### 3.3 आर्टिकल एडिटर में सेटिंग्स का बिखराव
आर्टिकल एडिटर में एसईओ, सोशल शेयर, पब्लिशिंग टाइम और फीचर्ड इमेज एक साथ नीचे बिखरे हुए हैं।
- **अनुशंसा:** वर्डप्रेस गुटेनबर्ग की तरह दायां साइडबार (Right Settings Sidebar) बनाया जाए, जिसमें स्पष्ट कोलैप्सिबल कार्ड्स हों:
  1. *Publish Status & Date*
  2. *Categories & Primary Category*
  3. *Featured Image & Caption*
  4. *SEO Title & Meta Description*
  5. *Social & Notification Toggles*
