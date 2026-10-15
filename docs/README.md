# 📚 खबरी दोस्त (Khabri Dost) — संपूर्ण तकनीकी प्रलेखन (Technical Documentation)

**परियोजना:** Khabri Dost (खबरी दोस्त)  
**आधिकारिक डोमेन:** `khabridost.com`  
**प्रारूप:** पूर्ण-स्टैक डिजिटल समाचार मंच (Full-Stack Hindi News CMS & Portal)  
**संस्करण:** 2.0 (ऑडिट एवं डिस्कवरी संस्करण)  
**दस्तावेज़ निर्माण तिथि:** अक्टूबर 2026

---

## 📌 दस्तावेज़ अनुक्रमणिका (Documentation Index)

यह निर्देशिका (`/docs`) खबरी दोस्त डिजिटल समाचार पोर्टल के संपूर्ण आर्किटेक्चर, कोडबेस संरचना, सुरक्षा नियमों, टाइपोग्राफी, डेटाबेस स्कीमा और एडमिन मॉड्यूल का संपूर्ण, ऑडिट-रेडी तकनीकी विवरण प्रस्तुत करती है:

| फ़ाइल का नाम | मुख्य विषय (Topic) | विवरण |
|---|---|---|
| [`01_ARCHITECTURE_AND_TECH_STACK.md`](./01_ARCHITECTURE_AND_TECH_STACK.md) | **आर्किटेक्चर एवं टेक्नोलॉजी स्टैक** | React 19, TypeScript, Express बैकएंड, Vite, टेलविंड v4, सुरक्षात्मक हेडर्स व डिपेंडेंसी विश्लेषण |
| [`02_FILE_INVENTORY_AND_CODE_MAP.md`](./02_FILE_INVENTORY_AND_CODE_MAP.md) | **संपूर्ण फ़ाइल इन्वेंटरी एवं कोड मैप** | प्रोजेक्ट की प्रत्येक महत्वपूर्ण फ़ाइल, उसका कार्य, घटक संबंध और ऑडिट स्थिति |
| [`03_SITEMAP_AND_ROUTING_SPEC.md`](./03_SITEMAP_AND_ROUTING_SPEC.md) | **सार्वजनिक साइटमैप एवं रूटिंग निर्देशिका** | सभी सार्वजनिक यूआरएल, स्टेट + हैश रूटिंग, अपेक्षित स्वच्छ URL संरचना और डायनामिक XML साइटमैप |
| [`04_ADMIN_PANEL_AND_CMS_MAP.md`](./04_ADMIN_PANEL_AND_CMS_MAP.md) | **एडमिन स्टूडियो एवं सीएमएस संरचना** | वर्तमान वर्डप्रेस-शैली साइडबार, सभी 28+ एडमिन टैब्स, अनुमतियां (RBAC) और यूआई विसंगतियां |
| [`05_ARTICLE_PUBLISHING_LIFECYCLE.md`](./05_ARTICLE_PUBLISHING_LIFECYCLE.md) | **समाचार प्रकाशन जीवनचक्र (Publishing Lifecycle)** | विचार → AI ड्राफ्ट → संपादन → समीक्षा → शेड्यूलिंग → प्रकाशन → एक्सएमएल सिंक → वेबहुक वितरण |
| [`06_TYPOGRAPHY_AND_FONT_BUG_ANALYSIS.md`](./06_TYPOGRAPHY_AND_FONT_BUG_ANALYSIS.md) | **वैश्विक टाइपोग्राफी एवं 'फ़ॉन्ट बग' का विश्लेषण** | डिफ़ॉल्ट 32px H1 शीर्षक, CSS वेरिएबल्स, index.css की `!important` समस्या का मूल कारण |
| [`07_MEDIA_ADS_MONETIZATION.md`](./07_MEDIA_ADS_MONETIZATION.md) | **मीडिया, विज्ञापन एवं मुद्रीकरण** | WebP कंप्रेशन, मीडिया गैलरी, गूगल एडसेंस, प्राइवेट स्पॉन्सर्ड बैनर्स और रिस्पॉन्सिव ब्रेकपॉइंट्स |
| [`08_SEO_GOOGLE_SUITE_AI_SERVICES.md`](./08_SEO_GOOGLE_SUITE_AI_SERVICES.md) | **एसईओ, गूगल सूट एवं एआई सेवाएं** | Google News XML स्कीमा, GA4, GTM, Search Console, Google Trends और जेमिनी 3.8 फ्लैश एकीकरण |
| [`09_DATABASE_FIRESTORE_SECURITY.md`](./09_DATABASE_FIRESTORE_SECURITY.md) | **डेटाबेस, फायरस्टोर स्कीमा एवं सुरक्षा नियम** | 10 फायरस्टोर कलेक्शन्स, `firestore.rules` का आरबीएसी विश्लेषण और एक्सप्रेस एपीआई रूट्स |
| [`10_AUDIT_RECOMMENDATIONS_AND_FILE_SHARING.md`](./10_AUDIT_RECOMMENDATIONS_AND_FILE_SHARING.md) | **ऑडिट अनुशंसाएं एवं फ़ाइल-शेयरिंग चेकलिस्ट** | प्राथमिकता 1 से 6 तक की फ़ाइलों की सूची, संभावित जोखिम और विकास हेतु अगला कार्ययोजना |

---

## 🔒 गोपनीयता एवं सुरक्षा चेतावनी (Security Notice)
इन दस्तावेज़ों में वास्तविक सर्वर और आर्किटेक्चरल पाथ का उल्लेख है। किसी भी बाहरी ऑडिटर या डेवलपर के साथ साझा करते समय संवेदनशील कुंजियां (API Keys / Service Account Credentials) कभी साझा न करें। केवल `.env.example` का उपयोग करें।
