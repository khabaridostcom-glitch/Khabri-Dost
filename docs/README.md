# 📚 खबरी दोस्त (Khabri Dost) — संपूर्ण तकनीकी प्रलेखन (Technical Documentation)

**परियोजना:** Khabri Dost (खबरी दोस्त)  
**आधिकारिक डोमेन:** `khabridost.com`  
**प्रारूप:** पूर्ण-स्टैक डिजिटल समाचार मंच (Full-Stack Hindi News CMS & Portal)  
**संस्करण:** 2.0 (ऑडिट एवं डिस्कवरी संस्करण)  
**दस्तावेज़ निर्माण तिथि:** अक्टूबर 2026

---

## 📌 दस्तावेज़ अनुक्रमणिका (Documentation Index)

यह निर्देशिका (`/docs`) खबरी दोस्त डिजिटल समाचार पोर्टल के संपूर्ण आर्किटेक्चर, कोडबेस संरचना, सुरक्षा नियमों, टाइपोग्राफी, डेटाबेस स्कीमा और एडमिन मॉड्यूल का संपूर्ण, ऑडिट-रेडी तकनीकी विवरण प्रस्तुत करती है:

### 1. मुख्य तकनीकी संदर्भ प्रलेखन (Primary Technical Documentation — Hindi/Devanagari)

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

### 2. स्वतंत्र ऑडिट एवं डिस्कवरी डॉसियर (Audit-Discovery Dossier — English Suite)

विस्तृत आर्किटेक्चरल एवं कोड-लेवल ऑडिट रिपोर्ट `/docs/audit-discovery/` फ़ोल्डर में उपलब्ध है:

| फ़ाइल का नाम | मॉड्यूल / विषय | उद्देश्य |
|---|---|---|
| [`00_EXECUTIVE_SUMMARY.md`](./audit-discovery/00_EXECUTIVE_SUMMARY.md) | **Executive Summary & System Discovery** | संपूर्ण प्रोजेक्ट की उच्च-स्तरीय ऑडिट समरी, मुख्य निष्कर्ष एवं स्कोरकार्ड |
| [`01_PROJECT_STRUCTURE_AND_FILE_MAP.md`](./audit-discovery/01_PROJECT_STRUCTURE_AND_FILE_MAP.md) | **Project Structure & Comprehensive File Map** | सभी सक्रिय फ़ाइलों, उनकी लाइन्स, मुख्य कंपोनेंट्स और स्टेटस का विस्तृत विवरण |
| [`02_FRONTEND_SITEMAP_AND_COMPONENTS.md`](./audit-discovery/02_FRONTEND_SITEMAP_AND_COMPONENTS.md) | **Frontend Sitemap & Public Architecture** | सार्वजनिक रूट्स, लेआउट, रिस्पॉन्सिव बिहेवियर (320px–1440px) व कंपोनेंट ट्री |
| [`03_ADMIN_PANEL_AND_PUBLISHING_WORKFLOWS.md`](./audit-discovery/03_ADMIN_PANEL_AND_PUBLISHING_WORKFLOWS.md) | **Admin Panel & Publishing Workflows** | 3,085 लाइनों वाले `AdminBackendPanel.tsx` के 32 टैब्स एवं प्रकाशक जीवनचक्र का ऑडिट |
| [`04_BACKEND_DATABASE_API_AND_SECURITY.md`](./audit-discovery/04_BACKEND_DATABASE_API_AND_SECURITY.md) | **Backend, Database, API & Security Rules** | Express सर्वर (`server.ts`), 10 Firestore कलेक्शन्स व 176 लाइनों के सुरक्षा नियम |
| [`05_TYPOGRAPHY_RESPONSIVE_AND_UI_ISSUES.md`](./audit-discovery/05_TYPOGRAPHY_RESPONSIVE_AND_UI_ISSUES.md) | **Typography, Font Bug & UI Consistency** | 'फ़ॉन्ट बग' का पूर्ण ट्रेस, `!important` टकराव, 32px H1 मानक और डार्क ग्रेडिएंट विसंगतियां |
| [`06_SEO_INTEGRATIONS_PERFORMANCE_AND_MEDIA.md`](./audit-discovery/06_SEO_INTEGRATIONS_PERFORMANCE_AND_MEDIA.md) | **SEO, External Integrations & Media** | Google News XML, JSON-LD, GA4/GTM, Ads और WebP मीडिया पाइपलाइन |
| [`07_GAP_REGISTER_AND_RECOMMENDATIONS.md`](./audit-discovery/07_GAP_REGISTER_AND_RECOMMENDATIONS.md) | **Architectural Gap Register & Recommendations** | 12 चिन्हित गैप्स, उनकी गंभीरता (P0-P2), और समाधान की विस्तृत सिफ़ारिशें |
| [`08_IMPLEMENTATION_PLANNING_INPUTS.md`](./audit-discovery/08_IMPLEMENTATION_PLANNING_INPUTS.md) | **Implementation Planning Inputs & Roadmap** | 4-चरणीय चरणबद्ध कार्यान्वयन रोडमैप, सुरक्षा गार्डरेल्स एवं रोलबैक रणनीति |
| [`09_CRITICAL_FILES_FOR_EXTERNAL_AUDIT.md`](./audit-discovery/09_CRITICAL_FILES_FOR_EXTERNAL_AUDIT.md) | **Critical Files for External Independent Audit** | बाहरी ऑडिटर हेतु Tier 1 (10 फ़ाइलें), Tier 2 (10 फ़ाइलें) व Tier 3 (5 फ़ाइलें) चेकलिस्ट |

---

## 🔒 गोपनीयता एवं सुरक्षा चेतावनी (Security Notice)
इन दस्तावेज़ों में वास्तविक सर्वर और आर्किटेक्चरल पाथ का उल्लेख है। किसी भी बाहरी ऑडिटर या डेवलपर के साथ साझा करते समय संवेदनशील कुंजियां (API Keys / Service Account Credentials) कभी साझा न करें। केवल `.env.example` का उपयोग करें।
