import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Globe2,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink,
  Target,
  FileCheck2,
  Scale,
  Sparkles,
  Newspaper,
  Copy,
  Check,
  Lock,
  Compass,
  FileText,
  AlertCircle,
  Eye,
  HeartHandshake,
} from 'lucide-react';
import { PortalSettings } from '../types/news';
import { DEFAULT_HEADER_FOOTER_SETTINGS } from '../data/portalDefaults';

interface AboutUsPageViewProps {
  onBackToHome: () => void;
  portalSettings?: PortalSettings;
  onOpenContactPage?: () => void;
  onOpenLegalPolicy?: (type: any) => void;
  onOpenEPaper?: () => void;
}

export const AboutUsPageView: React.FC<AboutUsPageViewProps> = ({
  onBackToHome,
  portalSettings,
  onOpenContactPage,
  onOpenLegalPolicy,
  onOpenEPaper,
}) => {
  const hf = portalSettings?.headerFooter || DEFAULT_HEADER_FOOTER_SETTINGS;
  const officialRni = hf.rniNumber || 'DELHIN/2024/84920';
  const officialEmail = hf.contactEmail || 'khabridost.com@gmail.com';
  const officialAddress = hf.contactAddress || 'प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001, भारत';
  const officialPhone = hf.contactPhone || '+91 11 2345 6789';
  const editorialMotto = 'सत्य, निष्पक्षता एवं जन-सरोकार';

  const [copiedRni, setCopiedRni] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'team' | 'verification' | 'transparency'>('mission');

  const copyRni = () => {
    try {
      navigator.clipboard.writeText(officialRni);
      setCopiedRni(true);
      setTimeout(() => setCopiedRni(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fadeIn font-kd-body">
      {/* 1. TOP BREADCRUMB STRIP */}
      <div className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="bg-white/10 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition cursor-pointer border border-white/15"
              title="मुख्य पृष्ठ पर वापस जाएं"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-slate-400 font-kd-meta">
              <span className="cursor-pointer hover:text-white" onClick={onBackToHome}>
                Home
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-red-400 font-bold">हमारे बारे में (About Us)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center space-x-1.5 bg-red-950/70 border border-red-700/60 text-red-300 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Official Editorial Profile</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO HEADER - EDITORIAL IDENTITY */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-12 sm:py-16 border-b border-red-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>राष्ट्रीय डिजिटल समाचार संस्थान</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रेस काउंसिल ऑफ इंडिया मानकों के अनुरूप</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-kd-header tracking-tight text-white leading-tight">
              {hf.siteTitle || 'खबरी दोस्त'} (Khabri Dost)
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-amber-400 font-kd-headline flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>संपादकीय ध्येय वाक्य: {editorialMotto}</span>
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed font-kd-body">
            खबरी दोस्त भारत का एक स्वतंत्र, निष्पक्ष एवं जन-सरोकारों को समर्पित डिजिटल समाचार नेटवर्क है। हमारा उद्देश्य बिना किसी राजनीतिक, धार्मिक या कॉरपोरेट समझौते के जमीनी भारत की सच्ची रिपोर्ट, तथ्यपरक विश्लेषण और खोजी पत्रकारिता को पाठकों तक पहुँचाना है।
          </p>

          {/* CREDENTIALS BADGE BAR */}
          <div className="pt-2 flex flex-wrap gap-3">
            {/* RNI Reg */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-md">
              <span className="text-slate-400 text-xs font-semibold">RNI Reg:</span>
              <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">
                {officialRni}
              </span>
              <button
                type="button"
                onClick={copyRni}
                className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                title="Copy RNI Number"
              >
                {copiedRni ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Email */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-md">
              <Mail className="w-4 h-4 text-red-400" />
              <span className="text-white font-mono font-bold text-xs sm:text-sm">
                {officialEmail}
              </span>
            </div>

            {/* Bureau HQ */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-md">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 text-xs sm:text-sm font-semibold">
                नई दिल्ली राष्ट्रीय संपादकीय ब्यूरो
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'mission', label: 'संपादकीय मिशन एवं विज़न', icon: Target },
            { id: 'team', label: 'संपादकीय नेतृत्व एवं टीम', icon: Users },
            { id: 'verification', label: '4-स्तरीय तथ्य सत्यापन', icon: FileCheck2 },
            { id: 'transparency', label: 'स्वामित्व एवं आचार संहिता', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* TAB 1: MISSION & VISION */}
        {activeTab === 'mission' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Story & Foundation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    हमारी स्थापना एवं इतिहास
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-kd-headline text-slate-900">
                    पत्रकारिता की साख और जनता का सच्चा दोस्त
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    आज के दौर में जब डिजिटल मीडिया सनसनीखेज हेडलाइंस, फेक न्यूज़, क्लिकबैट और वैचारिक पक्षपात की गंभीर चुनौतियों से जूझ रहा है, ऐसे समय में <strong>खबरी दोस्त (Khabri Dost)</strong> की नींव एक स्पष्ट संकल्प के साथ रखी गई: <em>'सत्य, निष्पक्षता एवं जन-सरोकार'</em>।
                  </p>
                  <p>
                    हमारा मानना है कि सच्चा लोकतंत्र तभी सशक्त हो सकता है जब उसके नागरिकों तक बिना किसी लाग-लपेट के सत्य, निष्पक्ष और प्रमाणिक सूचनाएं पहुँचे। हमारा संपादकीय एजेंडा किसी कॉरपोरेट घराने या राजनीतिक दल के दबाव में नहीं, बल्कि भारतीय संविधान के सिद्धांतों और जनता की रोज़मर्रा की समस्याओं से तय होता है।
                  </p>
                  <p>
                    खबरी दोस्त दिल्ली, उत्तर प्रदेश, बिहार, मध्य प्रदेश, राजस्थान, हरियाणा सहित पूरे भारत के छोटे-बड़े शहरों, कस्बों और गांवों से जुड़े ज़मीनी मुद्दों को अपनी प्राथमिकता मानता है।
                  </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">सत्य एवं निष्पक्ष रिपोर्टिंग</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      बिना किसी पक्षपात के सभी पक्षों का बयान और वस्तुनिष्ठ दृष्टिकोण रखना हमारा अनिवार्य नियम है।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">शून्य पेड न्यूज़ नीति</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      हम कभी भी पैसे लेकर समाचार नहीं छापते। संपादकीय सामग्री और विज्ञापन में सख्त अलगाव है।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">जन-समस्याओं की पैरवी</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      शिक्षा, स्वास्थ्य, किसान, रोजगार, बुनियादी ढांचे और जनहित के सवालों पर निरंतर जमीनी पड़ताल।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">स्रोतों की सर्वोच्च सुरक्षा</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      जनहित में भ्रष्टाचार का खुलासा करने वाले व्हिसलब्लोअर्स की पहचान को सुरक्षित रखना हमारी कानूनी जिम्मेदारी है।
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Cards */}
              <div className="lg:col-span-4 space-y-6">
                {/* Accreditation & Registration Box */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>वैधानिक पंजीकरण एवं मान्यता</span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">RNI Registration Number:</span>
                      <span className="text-amber-400 font-mono font-bold text-sm">{officialRni}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Digital Media Publisher:</span>
                      <span className="text-white font-semibold">खबरी दोस्त मीडिया नेटवर्क</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">पंजीकृत मुख्यालय:</span>
                      <span className="text-slate-200">{officialAddress}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">आधिकारिक संपर्क ईमेल:</span>
                      <a href={`mailto:${officialEmail}`} className="text-red-400 font-mono font-semibold hover:underline">
                        {officialEmail}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenContactPage) onOpenContactPage();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>संपादकीय डेस्क से संपर्क करें</span>
                  </button>
                </div>

                {/* Quick Link to E-Paper */}
                {onOpenEPaper && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-950 space-y-3 shadow-md border border-amber-300">
                    <div className="flex items-center space-x-2">
                      <Newspaper className="w-5 h-5 text-slate-950" />
                      <h4 className="font-black text-base">खबरी दोस्त ई-पेपर (E-Paper)</h4>
                    </div>
                    <p className="text-xs text-slate-900 font-medium">
                      दैनिक समाचार पत्र के ई-पेपर को किसी भी समय, कहीं भी पढ़ें।
                    </p>
                    <button
                      onClick={onOpenEPaper}
                      className="bg-slate-950 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-900 transition cursor-pointer flex items-center space-x-1.5"
                    >
                      <span>ई-पेपर अभी पढ़ें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDITORIAL TEAM & LEADERSHIP */}
        {activeTab === 'team' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Editorial Board & Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-kd-headline text-slate-900">
                अनुभवी एवं निष्पक्ष संपादकीय नेतृत्व
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                खबरी दोस्त का संचालन वरिष्ठ संपादकों, खोजी पत्रकारों और कानूनी सलाहकारों की एक प्रतिष्ठित टीम द्वारा किया जाता है।
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'श्री आलोक नाथ त्रिपाठी',
                  role: 'प्रधान संपादक एवं संस्थापक (Chief Editor)',
                  exp: '25+ वर्षों का अनुभव',
                  desc: 'राष्ट्रीय दैनिकों व टीवी न्यूज़ चैनलों में वरिष्ठ संपादकीय पदों पर कार्यरत रहे हैं। जमीनी राजनीति और संवैधानिक मामलों के विशेषज्ञ।',
                  badge: 'Chief Editor',
                  email: 'editor@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                },
                {
                  name: 'श्रीमती वंदना अग्निहोत्री',
                  role: 'कार्यकारी संपादक (Executive Editor)',
                  exp: '18+ वर्षों का अनुभव',
                  desc: 'खोजी पत्रकारिता, संसद व नीतिगत कवरेज की प्रमुख। प्रेस क्लब ऑफ इंडिया की सक्रिय सदस्य।',
                  badge: 'Executive Editor',
                  email: 'vandana@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
                },
                {
                  name: 'श्री राजेश कुमार शर्मा',
                  role: 'विधिक सलाहकार एवं शिकायत अधिकारी (Grievance Officer)',
                  exp: 'सूचना प्रौद्योगिकी नियम 2021 प्राधिकृत',
                  desc: 'डिजिटल मीडिया आचार संहिता, कॉपीराइट एवं पाठक शिकायत निवारण के नोडल अधिकारी।',
                  badge: 'Grievance Officer',
                  email: 'grievance@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
                },
                {
                  name: 'डॉ. सुमित कश्यप',
                  role: 'तथ्य-जांच एवं डिजिटल फोरेंसिक प्रमुख (Fact-Check Lead)',
                  exp: '12+ वर्षों का अनुभव',
                  desc: 'ओपन-सोर्स इंटेलिजेंस (OSINT), डीपफेक डिटेक्शन और वायरल दावों की तकनीकी पड़ताल के प्रमुख।',
                  badge: 'Fact-Check Bureau',
                  email: 'factcheck@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
                },
                {
                  name: 'श्री विक्रम राठौर',
                  role: 'ब्यूरो प्रमुख - उत्तर प्रदेश (State Bureau Chief)',
                  exp: '15+ वर्षों का अनुभव',
                  desc: 'लखनऊ स्थित राज्य सचिवालय, ग्रामीण जन-समस्याओं और अपराध रिपोर्टिंग के प्रमुख।',
                  badge: 'UP Bureau',
                  email: 'updesk@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
                },
                {
                  name: 'श्री संतोष झा',
                  role: 'ब्यूरो प्रमुख - बिहार एवं झारखंड',
                  exp: '14+ वर्षों का अनुभव',
                  desc: 'पटना स्थित राज्य संवाददाता, बाढ़, जनसरोकार एवं चुनावी विश्लेषण के अनुभवी पत्रकार।',
                  badge: 'Bihar Bureau',
                  email: 'bihardesk@khabridost.com',
                  photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
                },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                      {member.badge}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{member.exp}</span>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <img
                      src={member.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-red-100 shadow-sm shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kd-headline truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-red-600 truncate">{member.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{member.desc}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px] text-slate-400">{member.email}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>प्रमाणित</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 4-STAGE FACT VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Verification Methodology
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-kd-headline text-slate-900">
                  4-चरणीय तथ्य-सत्यापन प्रक्रिया (4-Stage Verification Protocol)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  खबरी दोस्त पर प्रकाशित होने वाली प्रत्येक ब्रेकिंग न्यूज़, सरकारी घोषणा या वायरल दावे को प्रकाशन से पूर्व निम्नलिखित कठोर परीक्षणों से गुज़रना होता है:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-base">
                      01
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">प्राथमिक स्रोतों की पड़ताल</h4>
                      <span className="text-[11px] text-slate-500">Primary Source Verification</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    किसी भी घटना की रिपोर्टिंग में आधिकारिक राजपत्र, एफआईआर, कोर्ट आर्डर अथवा सीधे संबंधित पक्ष के ऑन-रिकॉर्ड बयान की अनिवार्यता।
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-base">
                      02
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">बहु-स्तरीय पुष्टि</h4>
                      <span className="text-[11px] text-slate-500">Multi-Source Cross Verification</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    संवेदनशील या विवादास्पद दावों के लिए कम से कम दो परस्पर स्वतंत्र एवं असंबंधित प्राथमिक स्रोतों से पुष्टि की जाती है।
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-base">
                      03
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">डिजिटल फोरेंसिक व इमेज जांच</h4>
                      <span className="text-[11px] text-slate-500">Reverse Image & Video Forensics</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    सोशल मीडिया पर वायरल तस्वीरों व वीडियो के मेटाडेटा, लोकेशन और मूल समय की पुष्टि के लिए उन्नत टूल्स का उपयोग किया जाता है।
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base">
                      04
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">पारदर्शी सुधार नीति</h4>
                      <span className="text-[11px] text-slate-500">Transparent Corrections Policy</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    यदि किसी खबर में अनजाने में कोई तथ्यात्मक त्रुटि होती है, तो उसे छिपाने के बजाय 24 घंटे में शीर्ष पर संशोधन नोट प्रकाशित किया जाता है।
                  </p>
                </div>
              </div>

              {/* Full Policy Access */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                <span className="text-xs text-slate-600">
                  हमारी संपूर्ण तथ्य-जांच नीति एवं मानकों को विस्तार से पढ़ें:
                </span>
                <button
                  onClick={() => onOpenLegalPolicy && onOpenLegalPolicy('factCheck')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>तथ्य-जांच नीति (Fact Check Policy) पढ़ें</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSPARENCY, OWNERSHIP & ETHICS */}
        {activeTab === 'transparency' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Ownership & Financial Transparency
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-kd-headline text-slate-900">
                  स्वामित्व, वित्तीय प्रकटीकरण एवं आचार संहिता
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  हम पाठकों के विश्वास को अपनी सबसे बड़ी पूंजी मानते हैं। भारतीय कानून और साफ-सुथरे पत्रकारिता मानकों के तहत हमारी जानकारी:
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-red-600" />
                    <span>स्वामित्व संरचना (Ownership Structure)</span>
                  </h4>
                  <p>
                    खबरी दोस्त पोर्टल का संचालन <strong>खबरी दोस्त मीडिया नेटवर्क प्राइवेट लिमिटेड</strong> द्वारा किया जाता है। इस कंपनी में किसी भी राजनीतिक दल, राजनीतिक नेता, धार्मिक संगठन या विदेशी संस्था का कोई शेयर या वित्तीय हित नहीं है।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                    <HeartHandshake className="w-4 h-4 text-amber-600" />
                    <span>राजस्व मॉडल (Revenue Disclosure)</span>
                  </h4>
                  <p>
                    हमारे संचालन का खर्च केवल नैतिक डिजिटल विज्ञापन (Google AdSense एवं प्रत्यक्ष गैर-विवादास्पद वाणिज्यिक स्पॉन्सरशिप्स) तथा पाठकों के सहयोग से पूरा होता है। विज्ञापनदाता का हमारी संपादकीय सामग्री या किसी समाचार के चयन में शून्य हस्तक्षेप होता है।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span>डिजिटल मीडिया नियम 2021 अनुपालन (IT Rules 2021 Compliance)</span>
                  </h4>
                  <p>
                    हम सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11 के तहत पंजीकृत हैं। हमारे शिकायत निवारण अधिकारी श्री राजेश कुमार शर्मा हैं, जिनका संपर्क ईमेल <strong>grievance@khabridost.com</strong> है। शिकायतों का 15 दिनों में समयबद्ध निस्तारण किया जाता है।
                  </p>
                </div>
              </div>

              {/* Direct links to all legal policies */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  वैधानिक नीतियां एवं प्रलेख:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'privacy', label: 'Privacy Policy' },
                    { id: 'terms', label: 'Terms & Conditions' },
                    { id: 'grievance', label: 'Grievance Redressal' },
                    { id: 'ethics', label: 'Editorial Ethics' },
                    { id: 'factCheck', label: 'Fact-Check Standards' },
                  ].map((pol) => (
                    <button
                      key={pol.id}
                      onClick={() => onOpenLegalPolicy && onOpenLegalPolicy(pol.id as any)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      {pol.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. BOTTOM EDITORIAL PLEDGE BANNER */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-red-200">
              Reader Partnership
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-kd-headline text-white">
              क्या आपके पास कोई महत्वपूर्ण खबर या सूचना है?
            </h3>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-kd-body">
              हमारे ग्राउंड रिपोर्टर नेटवर्क से जुड़ें या हमारे विधिक व्हिसलब्लोअर डेस्क पर गोपनीय सूचना साझा करें। हम आपके स्रोत की सुरक्षा की 100% गारंटी देते हैं।
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => {
                if (onOpenContactPage) onOpenContactPage();
              }}
              className="bg-white hover:bg-slate-100 text-red-700 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-md flex items-center space-x-2"
            >
              <Mail className="w-4 h-4 text-red-600" />
              <span>न्यूज़ टिप या रिपोर्ट भेजें</span>
            </button>

            <button
              onClick={onBackToHome}
              className="bg-red-950/60 hover:bg-red-950 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition cursor-pointer border border-red-400/30 flex items-center space-x-1.5"
            >
              <span>मुख्य पृष्ठ पढ़ें</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
