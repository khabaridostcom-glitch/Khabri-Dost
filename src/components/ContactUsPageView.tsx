import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Lock,
  Flame,
  DollarSign,
  Radio,
  Share2,
  Compass,
  FileCheck2,
  Scale,
  Award,
} from 'lucide-react';
import { PortalSettings, ContactInquiry } from '../types/news';
import { DEFAULT_HEADER_FOOTER_SETTINGS } from '../data/portalDefaults';
import { LegalPolicyType } from './LegalPolicyPageView';

interface ContactUsPageViewProps {
  onBackToHome: () => void;
  portalSettings?: PortalSettings;
  onAddInquiry?: (inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>) => void;
  onOpenLegalPolicy?: (type: LegalPolicyType) => void;
  onOpenAboutUsPage?: () => void;
}

const DEPARTMENTS = [
  {
    id: 'news_tip' as const,
    label: 'न्यूज़ टिप व ग्राउंड रिपोर्ट',
    english: 'Breaking News Tip & Whistleblower',
    icon: Flame,
    color: 'red',
    sla: '< 1 घंटा',
    desc: 'ब्रेकिंग न्यूज़, भ्रष्टाचार उजागर करने वाली सूचना या जनहितैषी ग्राउंड रिपोर्ट प्रेषित करें।',
  },
  {
    id: 'general' as const,
    label: 'सामान्य संपादकीय पूछताछ',
    english: 'General Editorial Inquiry',
    icon: MessageSquare,
    color: 'blue',
    sla: '24 घंटे',
    desc: 'संपादकीय बोर्ड से संवाद, पाठकीय सुझाव या सामान्य जानकारी के लिए।',
  },
  {
    id: 'advertising' as const,
    label: 'विज्ञापन एवं ब्रांड साझेदारी',
    english: 'Advertising & Direct Sponsorship',
    icon: DollarSign,
    color: 'amber',
    sla: '12 घंटे',
    desc: 'डिजिटल बैनर विज्ञापन, प्रायोजित ब्रांड अभियान और व्यापारिक साझेदारियों हेतु।',
  },
  {
    id: 'grievance' as const,
    label: 'शिकायत निवारण (नियम 11)',
    english: 'Statutory Grievance Redressal',
    icon: AlertCircle,
    color: 'emerald',
    sla: '15 दिन (विधिक)',
    desc: 'सूचना प्रौद्योगिकी (डिजिटल मीडिया आचार संहिता) नियम 2021 के तहत वैधानिक शिकायत।',
  },
  {
    id: 'press_release' as const,
    label: 'प्रेस विज्ञप्ति एवं आधिकारिक संचार',
    english: 'Press Releases & Official Statements',
    icon: Radio,
    color: 'purple',
    sla: '48 घंटे',
    desc: 'सरकारी, कॉर्पोरेट अथवा गैर-सरकारी संस्थाओं की आधिकारिक प्रेस विज्ञप्तियां।',
  },
];

const STATE_BUREAUS = [
  { state: 'राष्ट्रीय मुख्यालय (नई दिल्ली)', head: 'श्री आलोक नाथ त्रिपाठी', email: 'delhi@khabridost.com', phone: '+91 11 2345 6789' },
  { state: 'उत्तर प्रदेश ब्यूरो (लखनऊ)', head: 'श्री विक्रम राठौर', email: 'updesk@khabridost.com', phone: '+91 522 234 5678' },
  { state: 'बिहार व झारखंड ब्यूरो (पटना)', head: 'श्री संतोष झा', email: 'bihardesk@khabridost.com', phone: '+91 612 234 5678' },
  { state: 'मध्य प्रदेश व छत्तीसगढ़ (भोपाल)', head: 'श्रीमती रीता सक्सेना', email: 'mpdesk@khabridost.com', phone: '+91 755 234 5678' },
  { state: 'राजस्थान ब्यूरो (जयपुर)', head: 'श्री मयंक शर्मा', email: 'rajdesk@khabridost.com', phone: '+91 141 234 5678' },
];

export const ContactUsPageView: React.FC<ContactUsPageViewProps> = ({
  onBackToHome,
  portalSettings,
  onAddInquiry,
  onOpenLegalPolicy,
  onOpenAboutUsPage,
}) => {
  const hf = portalSettings?.headerFooter || DEFAULT_HEADER_FOOTER_SETTINGS;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'news_tip' as ContactInquiry['department'],
    subject: '',
    message: '',
    sourceUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const officialRni = hf.rniNumber || 'DELHIN/2024/84920';
  const officialEmail = hf.contactEmail || 'khabridost.com@gmail.com';
  const officialAddress = hf.contactAddress || 'प्रेस एंक्लेव, कनाट प्लेस, नई दिल्ली - 110001, भारत';
  const officialPhone = hf.contactPhone || '+91 11 2345 6789';
  const editorialMotto = 'सत्य, निष्पक्षता एवं जन-सरोकार';

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !formData.subject.trim()) {
      alert('कृपया सभी आवश्यक फ़ील्ड (नाम, ईमेल, विषय एवं संदेश) भरें।');
      return;
    }

    setIsSubmitting(true);
    const ticketNumber = `KD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      if (onAddInquiry) {
        onAddInquiry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          department: formData.department,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          sourceUrl: formData.sourceUrl.trim() || undefined,
          adminNotes: `Ticket: ${ticketNumber} • Submitted via Redesigned Contact Desk`,
        });
      }
      setIsSubmitting(false);
      setSubmittedTicket(ticketNumber);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'news_tip',
      subject: '',
      message: '',
      sourceUrl: '',
    });
    setSubmittedTicket(null);
  };

  const handleOpenEmailClient = () => {
    const subjectEncoded = encodeURIComponent(`[${formData.department.toUpperCase()}] ${formData.subject || 'Editorial Inquiry'}`);
    const bodyEncoded = encodeURIComponent(
      `प्रेषक (Name): ${formData.name}\nईमेल (Email): ${formData.email}\nफ़ोन (Phone): ${formData.phone || 'N/A'}\nविभाग (Department): ${formData.department}\n\nसंदेश (Message):\n${formData.message}\n\nसंदर्भ लिंक (URL): ${formData.sourceUrl || 'N/A'}`
    );
    window.location.href = `mailto:${officialEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;
  };

  const activeDeptInfo = DEPARTMENTS.find((d) => d.id === formData.department) || DEPARTMENTS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fadeIn font-kd-body">
      {/* 1. TOP BREADCRUMB & UTILITY STRIP */}
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
              <span className="text-red-400 font-bold">संपर्क केंद्र (Contact Desk)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center space-x-1.5 bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>24x7 Editorial Newsroom Desk Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO HEADER - EDITORIAL CREDENTIALS STRIP (Strictly here as requested) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-12 sm:py-16 border-b border-red-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>राष्ट्रीय संपादकीय ब्यूरो एवं संचार केंद्र</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रेस काउंसिल एवं डिजिटल मीडिया आचार संहिता 2021 अनुपालन</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-kd-header tracking-tight text-white leading-tight">
              {hf.siteTitle || 'खबरी दोस्त'} संपर्क केंद्र
            </h1>
            {/* The Official Editorial Motto strictly placed on contact page */}
            <p className="text-lg sm:text-2xl font-bold text-amber-400 font-kd-headline flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>संपादकीय ध्येय वाक्य: {editorialMotto}</span>
            </p>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-kd-body">
            खबरी दोस्त डिजिटल न्यूज़ नेटवर्क के संपादकीय बोर्ड, इन्वेस्टिगेटिव जर्नलिज्म विंग, विज्ञापन विभाग और वैधानिक शिकायत निवारण अधिकारी से सीधा संपर्क स्थापित करें। हम स्रोतों की गोपनीयता का भारतीय कानून के अनुसार पूर्ण सम्मान करते हैं।
          </p>

          {/* OFFICIAL LEGAL CREDENTIALS BADGE BAR */}
          <div className="pt-2 flex flex-wrap gap-3">
            {/* RNI Reg */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center space-x-3 shadow-md">
              <span className="text-slate-400 text-xs font-semibold">RNI Reg:</span>
              <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">
                {officialRni}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(officialRni, 'rni')}
                className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                title="Copy RNI Number"
              >
                {copiedField === 'rni' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Email */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center space-x-3 shadow-md">
              <Mail className="w-4 h-4 text-red-400" />
              <span className="text-white font-mono font-bold text-xs sm:text-sm">
                {officialEmail}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(officialEmail, 'email')}
                className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                title="Copy Official Email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Phone */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center space-x-3 shadow-md">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-mono font-bold text-xs sm:text-sm">
                {officialPhone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION GRID: INTERACTIVE FORM + DIRECTORY + COMPLIANCE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 space-y-8">
        {/* DEPARTMENT SELECTOR CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isSelected = formData.department === dept.id;
            return (
              <div
                key={dept.id}
                onClick={() => setFormData((prev) => ({ ...prev, department: dept.id }))}
                className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-50/90 border-red-500 ring-2 ring-red-400 shadow-md'
                    : 'bg-white border-slate-200/90 hover:border-red-200 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-full font-bold">
                      {dept.sla}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                      {dept.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                      {dept.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${isSelected ? 'text-red-600' : 'text-slate-400'}`}>
                    {isSelected ? 'चयनित' : 'चुनें'}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-red-600 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-COLUMN MAIN BODY: FORM (7 COLS) + DIRECTORY & STATUTORY (5 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: INTERACTIVE FORM & SUBMISSION */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  {activeDeptInfo.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-kd-headline text-slate-900">
                सीधा संदेश अथवा सूचना प्रेषित करें
              </h2>
              <p className="text-xs text-slate-500 font-kd-meta">
                प्रतिक्रिया समय: औसतन {activeDeptInfo.sla} • गोपनीयता संरक्षण गारंटी
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 animate-fadeIn text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-900">संदेश सफलतापूर्वक प्राप्त हुआ!</h3>
                  <p className="text-xs text-emerald-800">
                    आपका ट्रैकिंग टिकट नंबर नीचे अंकित है। हमारी संबंधित टीम आपसे शीघ्र संपर्क करेगी।
                  </p>
                </div>

                <div className="inline-block p-3 rounded-xl bg-white border border-emerald-300 font-mono font-bold text-sm text-slate-900 shadow-xs">
                  टिकट ID: {submittedTicket}
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    नया संदेश भेजें
                  </button>
                  <button
                    onClick={onBackToHome}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer border border-slate-300"
                  >
                    मुख्य पृष्ठ पर जाएं
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">
                      आपका पूरा नाम <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="उदा. राहुल वर्मा"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">
                      आधिकारिक ईमेल <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">मोबाइल / व्हाट्सएप नंबर</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210 (ऐच्छिक)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm"
                    />
                  </div>

                  {/* Reference URL */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">संदर्भ लिंक अथवा सोशल मीडिया URL</label>
                    <input
                      type="url"
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                      placeholder="https://... (यदि कोई हो)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    विषय (Subject) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="संदेश या न्यूज़ टिप का मुख्य विषय संक्षेप में लिखें..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    विस्तृत संदेश अथवा ग्राउंड रिपोर्ट <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="घटना का स्थान, समय, तथ्य, संबंधित पक्ष एवं साक्ष्य का विस्तृत विवरण लिखें..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body text-xs sm:text-sm leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'प्रेषित हो रहा है...' : 'सुरक्षित संदेश प्रेषित करें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenEmailClient}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 border border-slate-300"
                    title="डिफ़ॉल्ट ईमेल सॉफ्टवेयर में खोलें"
                  >
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span>ईमेल ऐप से भेजें</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center font-kd-meta pt-1">
                  🔒 आपकी प्रेषित सूचना पूर्णतः एन्क्रिप्टेड है और केवल अधिकृत संपादकीय टीम तक पहुँचती है।
                </p>
              </form>
            )}
          </div>

          {/* RIGHT 5 COLS: OFFICIAL DIRECTORY, GRIEVANCE & LEGAL PAGES ACCESS */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Official Bureau Card with RNI & Registered Address */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400">
                  <Building2 className="w-4 h-4 text-red-500" />
                  <span>पंजीकृत कार्यालय एवं राष्ट्रीय ब्यूरो</span>
                </div>
                <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-mono">
                  HQ New Delhi
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div>
                  <h4 className="font-black text-base text-white">
                    {hf.siteTitle || 'खबरी दोस्त मीडिया नेटवर्क'}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{officialAddress}</span>
                  </p>
                </div>

                {/* RNI Reg Highlight */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">आरएनआई पंजीकरण:</span>
                    <span className="text-amber-400 font-mono font-bold">{officialRni}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">आधिकारिक ईमेल:</span>
                    <a href={`mailto:${officialEmail}`} className="text-red-400 font-mono font-semibold hover:underline">
                      {officialEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">हेल्पलाइन:</span>
                    <span className="text-slate-200 font-mono">{officialPhone}</span>
                  </div>
                </div>

                {/* Google Maps link */}
                <div className="pt-1">
                  <a
                    href="https://maps.google.com/?q=Connaught+Place+New+Delhi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Google Maps पर राष्ट्रीय कार्यालय देखें</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. STATUTORY GRIEVANCE REDRESSAL OFFICER DETAILS (IT Rules 2021) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    शिकायत निवारण अधिकारी (Grievance Officer)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-kd-meta">
                    सूचना प्रौद्योगिकी (डिजिटल मीडिया आचार संहिता) नियम, 2021
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">अधिकारी:</span>
                  <span className="font-bold text-slate-900">श्री राजेश कुमार शर्मा</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">पदनाम:</span>
                  <span className="font-semibold text-slate-800">वरिष्ठ विधिक निदेशक</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ईमेल:</span>
                  <a href="mailto:grievance@khabridost.com" className="font-mono text-red-600 hover:underline">
                    grievance@khabridost.com
                  </a>
                </div>
                <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  <span>निस्तारण समयसीमा:</span>
                  <span>15 दिवस (Timebound)</span>
                </div>
              </div>

              {onOpenLegalPolicy && (
                <button
                  onClick={() => onOpenLegalPolicy('grievance')}
                  className="w-full text-center text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  शिकायत निवारण प्रक्रिया का संपूर्ण विवरण पढ़ें ➔
                </button>
              )}
            </div>

            {/* 3. DIRECT LEGAL PAGES DIRECTORY (NO POPUP - OPENS FULL PAGE AS REQUESTED) */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>कानूनी नीतियां एवं अनुपालन (Legal Pages)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Full Pages</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'privacy' as const, label: 'गोपनीयता नीति (Privacy Policy)', icon: Lock },
                  { id: 'terms' as const, label: 'नियम एवं शर्तें (Terms of Service)', icon: FileText },
                  { id: 'grievance' as const, label: 'शिकायत निवारण नीति (Grievance Redressal)', icon: AlertCircle },
                  { id: 'factCheck' as const, label: 'तथ्य-जांच नीति (Fact-Checking Standards)', icon: CheckCircle2 },
                  { id: 'ethics' as const, label: 'संपादकीय आचार संहिता (Editorial Ethics)', icon: ShieldCheck },
                  { id: 'disclaimer' as const, label: 'अस्वीकरण (Disclaimer & Fair Use)', icon: Scale },
                  { id: 'corrections' as const, label: 'सुधार एवं संशोधन नीति (Corrections)', icon: Clock },
                  { id: 'dmca' as const, label: 'कॉपीराइट एवं DMCA नोटिस', icon: FileCheck2 },
                ].map((policy) => {
                  const Icon = policy.icon;
                  return (
                    <button
                      key={policy.id}
                      onClick={() => onOpenLegalPolicy && onOpenLegalPolicy(policy.id)}
                      className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer border border-slate-700/50 group"
                    >
                      <span className="flex items-center space-x-2.5 truncate">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition shrink-0" />
                        <span className="text-left font-medium truncate">{policy.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition shrink-0" />
                    </button>
                  );
                })}
              </div>

              {onOpenAboutUsPage && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onOpenAboutUsPage}
                    className="w-full p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white flex items-center justify-between transition cursor-pointer border border-red-800/50"
                  >
                    <span className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-red-400" />
                      <span className="font-bold">हमारे बारे में (About Us) पढ़ें</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-red-300" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. REGIONAL STATE BUREAUS DIRECTORY */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
                राज्य संवाददाता एवं ब्यूरो नेटवर्क (Regional Bureaus)
              </span>

              <div className="space-y-2 text-xs">
                {STATE_BUREAUS.map((bureau, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="font-bold text-slate-900">{bureau.state}</div>
                    <div className="text-slate-600 flex items-center justify-between text-[11px]">
                      <span>{bureau.head}</span>
                      <a href={`mailto:${bureau.email}`} className="text-red-600 font-mono hover:underline">
                        {bureau.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
