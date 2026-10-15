# 08 — एसईओ, गूगल सूट एवं एआई सेवाएं (SEO, Google Suite & AI Services)
**परियोजना:** खबरी दोस्त (Khabri Dost) | `khabridost.com`  
**प्रयोजन:** तकनीकी एसईओ, गूगल इकोसिस्टम (Search Console, GA4, GTM, Google News) और जेमिनी एआई एकीकरण।

---

## 1. तकनीकी एसईओ एवं संरचित डेटा (Technical SEO & JSON-LD Schemas)

खबरी दोस्त सर्च इंजनों, विशेषकर गूगल सर्च और गूगल डिस्कवर (Google Discover) में शीर्ष रैंकिंग प्राप्त करने के लिए कठोर तकनीकी एसईओ मानकों का पालन करता है:

### 1.1 संरचित स्कीमा मार्कअप (JSON-LD Schemas)
प्रत्येक समाचार पृष्ठ पर `src/components/ArticlePageView.tsx` द्वारा निम्नलिखित डायनामिक स्कीमा इंजेक्ट की जाती है:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://khabridost.com/article/desh/chandrayaan-mission-update-102"
  },
  "headline": "चंद्रयान मिशन पर इसरो का नया अपडेट, वैज्ञानिकों ने दी जानकारी",
  "image": [
    "https://khabridost.com/images/isro-moon-mission.webp"
  ],
  "datePublished": "2026-10-15T08:30:00+05:30",
  "dateModified": "2026-10-15T09:15:00+05:30",
  "author": {
    "@type": "Person",
    "name": "राजेश शर्मा",
    "jobTitle": "वरिष्ठ संवाददाता",
    "url": "https://khabridost.com/author/rajesh-sharma"
  },
  "publisher": {
    "@type": "NewsMediaOrganization",
    "name": "Khabri Dost",
    "url": "https://khabridost.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://khabridost.com/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "description": "इसरो के वैज्ञानिकों ने चंद्रयान के अगले चरण की तैयारी शुरू कर दी है...",
  "inLanguage": "hi"
}
```

### 1.2 ब्रेडक्रम्ब स्कीमा (`BreadcrumbList`)
क्रॉलर को साइट पदानुक्रम समझाने के लिए:
`होम (Home) > देश (Desh) > चंद्रयान मिशन...`

---

## 2. गूगल सूट एकीकरण (Google Suite Ecosystem)

`src/components/admin/SeoGoogleServicesTab.tsx` के माध्यम से प्रकाशक निम्नलिखित सेवाओं को बिना कोड बदले सीधे सक्रिय कर सकते हैं:

| सेवा (Service) | विन्यास पैरामीटर (Config Parameter) | स्थिति (Status) | कार्य एवं प्रभाव (Functionality) |
|---|---|---|---|
| **Google Search Console** | HTML Verification Token (`<meta name="google-site-verification" ...>`) | एकीकृत (Configurable) | स्वामित्व सत्यापन, क्रॉल त्रुटियां, इंडेक्सिंग अनुरोध। |
| **Google Analytics 4** | GA4 Measurement ID (`G-XXXXXXXXXX`) | एकीकृत (Configurable) | रीयल-टाइम पाठक ट्रैकिंग, बाउंस रेट, सर्वाधिक पढ़े गए समाचार। |
| **Google Tag Manager** | GTM Container ID (`GTM-XXXXXXX`) | एकीकृत (Configurable) | कस्टम मार्केटिंग पिक्सल, ईवेंट ट्रैकिंग। |
| **Google News Publisher** | Publisher Center Publication ID | एकीकृत (Configurable) | गूगल न्यूज ऐप और टैब में प्रकाशन की आधिकारिक उपस्थिति। |
| **Google Trends India** | `/api/trends/india` (प्रॉक्सी एंडपॉइंट) | सक्रिय (Server-side) | भारत में ट्रेंड कर रहे ताज़ा कीवर्ड्स सीधे एडिटर में दिखाना। |

---

## 3. जेमिनी एआई संपादकीय सहायक (Gemini 3.8 Flash Integration)

समाचार कक्ष (Newsroom) की गति बढ़ाने के लिए Google Gemini 3.8 Flash मॉडल का आधिकारिक `@google/genai` एसडीके के साथ सर्वर-साइड एकीकरण किया गया है:

### 3.1 सर्वर-साइड प्रॉक्सी आर्किटेक्चर (`server.ts`)
सुरक्षा के लिए, `GEMINI_API_KEY` को कभी भी ब्राउज़र में उजागर नहीं किया जाता। सभी एआई अनुरोध सर्वर के माध्यम से रूट होते हैं:

1. **त्वरित 3-बिंदु सारांश (`POST /api/gemini/summarize`):**
   - **प्रॉम्प्ट निर्देश:** "दिए गए हिंदी समाचार का 3 स्पष्ट, निष्पक्ष और बुलेट-पॉइंट सारांश तैयार करें जो व्यस्त पाठकों के लिए उपयुक्त हो।"
   - **आउटपुट:** त्वरित बुलेट्स जो सीधे `summary` फ़ील्ड में भर जाते हैं।
2. **एसईओ हेडलाइन जनरेटर (`POST /api/gemini/headline-suggestions`):**
   - **प्रॉम्प्ट निर्देश:** "इस समाचार सामग्री के आधार पर 5 अलग-अलग शैलियों (सनसनीखेज रहित, तथ्यात्मक, प्रश्नवाचक, विश्लेषणपरक) में आकर्षक हिंदी शीर्षक सुझाएं।"
   - **उपयोग:** संपादक एक क्लिक में सर्वश्रेष्ठ हेडलाइन चुन सकता है।
3. **तथ्य-जांच एवं वर्तनी सुधार (`POST /api/gemini/fact-check-brief`):**
   - देवनागरी वर्तनी, व्याकरण और प्रमुख तिथियों व नामों की पुष्टि के लिए संपादकीय सुझाव।

---

## 4. सोशल मीडिया एवं मैसेजिंग ऑटो-सिंडिकेशन

- **WhatsApp चैनल एवं ग्रुप विजेट:** प्रत्येक समाचार के अंत में "खबरी दोस्त के व्हाट्सएप चैनल से जुड़ें" कॉल-टू-एक्शन बटन।
- **Telegram बॉट सिंडिकेशन:** प्रकाशित होते ही टेलीग्राम चैनल में आलेख का शीर्षक, छवि और लिंक स्वचालित रूप से पोस्ट करने का वेबहुक ढांचा।
- **OneSignal पुश नोटिफिकेशन्स:** ब्रेकिंग न्यूज के समय डेस्कटॉप व मोबाइल सब्सक्राइबर्स को तत्काल वेब पुश अलर्ट भेजना।
