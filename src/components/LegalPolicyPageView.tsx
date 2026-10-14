import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Lock,
  AlertCircle,
  CheckCircle2,
  Scale,
  Printer,
  Share2,
  Copy,
  Check,
  Mail,
  Building2,
  MapPin,
  ChevronRight,
  PenTool,
  Clock,
  ExternalLink,
  BookOpen,
  Info,
  Sliders,
} from 'lucide-react';
import { PortalSettings } from '../types/news';
import { DEFAULT_HEADER_FOOTER_SETTINGS } from '../data/portalDefaults';

export type LegalPolicyType =
  | 'privacy'
  | 'terms'
  | 'grievance'
  | 'factCheck'
  | 'ethics'
  | 'disclaimer'
  | 'corrections'
  | 'dmca';

interface LegalPolicyPageViewProps {
  initialPolicyType?: LegalPolicyType;
  onBackToHome: () => void;
  portalSettings: PortalSettings;
  isAdmin: boolean;
  onUpdateSettings?: (newSettings: PortalSettings) => void;
  onOpenContactPage?: () => void;
  onOpenAboutUsPage?: () => void;
  onOpenAdminSettings?: () => void;
}

interface PolicyDefinition {
  id: LegalPolicyType;
  title: string;
  englishTitle: string;
  key: keyof NonNullable<typeof DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies>;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const POLICY_DEFINITIONS: PolicyDefinition[] = [
  {
    id: 'privacy',
    title: 'गोपनीयता नीति',
    englishTitle: 'Privacy & Data Protection Policy (DPDP Act & GDPR)',
    key: 'privacyPolicy',
    badge: 'DPDP & GDPR Compliant',
    icon: Lock,
    description: 'पाठक डेटा संरक्षण, कुकीज़ नीति, Google AdSense और DART विज्ञापन प्रकटीकरण।',
  },
  {
    id: 'terms',
    title: 'नियम एवं शर्तें',
    englishTitle: 'Terms of Service & Reader Agreement',
    key: 'termsOfService',
    badge: 'Legal Agreement',
    icon: FileText,
    description: 'वेबसाइट उपयोग की वैधानिक शर्तें, उपयोगकर्ता आचरण, कॉपीराइट और बौद्धिक संपदा अधिकार।',
  },
  {
    id: 'grievance',
    title: 'शिकायत निवारण अधिकारी',
    englishTitle: 'Grievance Redressal Mechanism (Rule 11 IT Rules 2021)',
    key: 'grievanceRedressal',
    badge: 'Statutory 15-Day SLA',
    icon: AlertCircle,
    description: 'सूचना प्रौद्योगिकी (डिजिटल मीडिया आचार संहिता) नियम 2021 के तहत शिकायत दर्ज करने की व्यवस्था।',
  },
  {
    id: 'factCheck',
    title: 'तथ्य-जांच नीति',
    englishTitle: 'Fact-Checking & 4-Stage Verification Protocol',
    key: 'factCheckPolicy',
    badge: 'IFCN Standards',
    icon: CheckCircle2,
    description: 'गलत सूचना और अफवाहों के विरुद्ध 4-चरणीय सत्यापन प्रक्रिया और ग्राउंड रिपोर्टिंग नियम।',
  },
  {
    id: 'ethics',
    title: 'संपादकीय आचार संहिता',
    englishTitle: 'Code of Editorial Ethics & Journalistic Independence',
    key: 'editorialEthics',
    badge: 'Journalistic Independence',
    icon: ShieldCheck,
    description: 'प्रेस काउंसिल ऑफ इंडिया मानकों के अनुरूप निष्पक्षता, पेड न्यूज़ पर रोक और हितों का टकराव।',
  },
  {
    id: 'disclaimer',
    title: 'अस्वीकरण एवं दायित्व सीमा',
    englishTitle: 'Editorial, Financial & Medical Disclaimer',
    key: 'disclaimer',
    badge: 'Legal Disclaimer',
    icon: Scale,
    description: 'सूचनात्मक उद्देश्य, शेयर बाजार/वित्तीय परामर्श अस्वीकरण और बाह्य वेबसाइट लिंक।',
  },
  {
    id: 'corrections',
    title: 'सुधार एवं संशोधन नीति',
    englishTitle: 'Transparent Corrections & Retractions Policy',
    key: 'correctionPolicy',
    badge: '24-Hour Transparency',
    icon: Clock,
    description: 'तथ्यात्मक त्रुटियों के पारदर्शी सुधार, संशोधन नोट और समाचार वापसी प्रोटोकॉल।',
  },
  {
    id: 'dmca',
    title: 'कॉपीराइट एवं DMCA नोटिस',
    englishTitle: 'Copyright Infringement & DMCA Takedown Notice',
    key: 'dmcaNotice',
    badge: 'Copyright Protection',
    icon: BookOpen,
    description: 'बौद्धिक संपदा संरक्षण, कॉपीराइट उल्लंघन शिकायत एवं सामग्री हटाने की विधिक प्रक्रिया।',
  },
];

export const LegalPolicyPageView: React.FC<LegalPolicyPageViewProps> = ({
  initialPolicyType = 'privacy',
  onBackToHome,
  portalSettings,
  isAdmin,
  onUpdateSettings,
  onOpenContactPage,
  onOpenAboutUsPage,
  onOpenAdminSettings,
}) => {
  const [currentPolicyId, setCurrentPolicyId] = useState<LegalPolicyType>(initialPolicyType);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync if initialPolicyType prop changes
  useEffect(() => {
    if (initialPolicyType) {
      setCurrentPolicyId(initialPolicyType);
      setIsEditing(false);
    }
  }, [initialPolicyType]);

  const hf = portalSettings?.headerFooter || DEFAULT_HEADER_FOOTER_SETTINGS;
  const currentDef = POLICY_DEFINITIONS.find((p) => p.id === currentPolicyId) || POLICY_DEFINITIONS[0];

  const currentText =
    hf.legalPolicies?.[currentDef.key] ||
    (DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies as any)?.[currentDef.key] ||
    'सामग्री उपलब्ध नहीं है।';

  useEffect(() => {
    setEditText(currentText);
    setIsEditing(false);
  }, [currentPolicyId, currentText]);

  const handleSelectPolicy = (id: LegalPolicyType) => {
    setCurrentPolicyId(id);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = `#legal-${id}`;
    } catch {}
  };

  const handleSave = () => {
    if (!onUpdateSettings) return;
    const updated: PortalSettings = {
      ...portalSettings,
      headerFooter: {
        ...hf,
        legalPolicies: {
          ...(hf.legalPolicies || DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies!),
          [currentDef.key]: editText,
        },
      },
    };
    onUpdateSettings(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const IconComponent = currentDef.icon;

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
              <span className="text-slate-300">कानूनी नीतियां (Legal)</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-red-400 font-bold">{currentDef.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <button
              onClick={handlePrint}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center space-x-1.5 cursor-pointer text-xs"
              title="प्रिंट करें (Print Document)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center space-x-1.5 cursor-pointer text-xs"
              title="लिंक कॉपी करें (Share / Copy Link)"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO HEADER - LEGAL & COMPLIANCE DESK */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-10 sm:py-14 border-b border-red-900/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>विधिक एवं नियामक अनुपालन केंद्र</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono">
              {currentDef.badge}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black font-kd-header tracking-tight text-white leading-tight">
              {currentDef.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-kd-meta">
              {currentDef.englishTitle} • {hf.siteTitle || 'खबरी दोस्त डिजिटल न्यूज़ नेटवर्क'}
            </p>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-kd-body">
            {currentDef.description} यह प्रलेख भारतीय संविधान, प्रेस काउंसिल ऑफ इंडिया दिशानिर्देश, डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP) तथा Google प्रकाशक नीतियों के पूर्ण अनुपालन में निर्मित है।
          </p>
        </div>
      </div>

      {/* 3. MAIN SECTION GRID: SIDEBAR POLICY INDEX + FULL DOCUMENT BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 4 COLS: FULL POLICY DIRECTORY MENU */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-16">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>सभी नीतियां एवं नियम (Directory)</span>
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                  {POLICY_DEFINITIONS.length} Policies
                </span>
              </div>

              <div className="space-y-1.5">
                {POLICY_DEFINITIONS.map((def) => {
                  const Icon = def.icon;
                  const isActive = currentPolicyId === def.id;
                  return (
                    <button
                      key={def.id}
                      onClick={() => handleSelectPolicy(def.id)}
                      className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex items-center justify-between border ${
                        isActive
                          ? 'bg-red-600 text-white font-bold border-red-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate text-xs">{def.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 space-y-3.5 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>सहायता एवं संपर्क केंद्र</span>
              </span>

              <div className="space-y-2 text-xs">
                {onOpenContactPage && (
                  <button
                    onClick={onOpenContactPage}
                    className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white flex items-center justify-between transition cursor-pointer border border-slate-800"
                  >
                    <span className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                      <span>संपर्क केंद्र (Contact Desk)</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}

                {onOpenAboutUsPage && (
                  <button
                    onClick={onOpenAboutUsPage}
                    className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white flex items-center justify-between transition cursor-pointer border border-slate-800"
                  >
                    <span className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>हमारे बारे में (About Us)</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 8 COLS: COMPLETE LONG-FORM LEGAL POLICY DOCUMENT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-kd-headline text-slate-900">
                      {currentDef.title}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      आधिकारिक प्रलेख • प्रभावी वर्ष 2026
                    </span>
                  </div>
                </div>

                {/* Admin Quick Editor Action */}
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>एडिट करें</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>सहेजें</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditText(currentText);
                            setIsEditing(false);
                          }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
                        >
                          रद्द करें
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {saveSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>नीति सफलतापूर्वक अपडेट हो गई है!</span>
                </div>
              )}

              {/* In-Place Admin Markdown / Textarea Editor */}
              {isEditing ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-kd-meta">
                    नीति की सामग्री संपादित करें (Direct Content Editor)
                  </label>
                  <textarea
                    rows={18}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500">
                    💡 सुझाव: परिवर्तन सहेजने पर यह तुरंत सभी पाठकों के लिए लाइव हो जाएगा।
                  </p>
                </div>
              ) : (
                /* Pristine Long-Form Editorial Body */
                <div className="space-y-6">
                  {/* Grievance Quick Action Callout if on Grievance Redressal */}
                  {currentPolicyId === 'grievance' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-900">
                      <div className="flex items-center space-x-2 font-bold text-sm text-amber-950">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>त्वरित वैधानिक शिकायत प्रेषण</span>
                      </div>
                      <p>
                        यदि आप खबरी दोस्त पर प्रकाशित किसी समाचार के संबंध में वैधानिक शिकायत दर्ज करना चाहते हैं, तो कृपया हमारे शिकायत अधिकारी को सीधे <strong>grievance@khabridost.com</strong> पर विवरण भेजें अथवा संपर्क पृष्ठ के माध्यम से टिकट दर्ज करें।
                      </p>
                    </div>
                  )}

                  <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm sm:leading-relaxed whitespace-pre-line font-kd-body bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
                    {currentText}
                  </div>
                </div>
              )}

              {/* Bottom Document Stamp & Assurance */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>वैधानिक रूप से प्रमाणित एवं अद्यतन (Legal Stamp Verified)</span>
                </div>
                <span className="font-mono text-[11px]">
                  RNI: {hf.rniNumber || 'DELHIN/2024/84920'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
