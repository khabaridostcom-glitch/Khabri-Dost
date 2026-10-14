import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Sliders,
  Check,
  Lock,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  PenTool,
  ExternalLink,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { PortalSettings } from '../types/news';
import { DEFAULT_HEADER_FOOTER_SETTINGS } from '../data/portalDefaults';

export type PolicyType = 'factCheck' | 'ethics' | 'grievance' | 'privacy' | 'terms';

interface LegalPolicyModalProps {
  policyType: PolicyType;
  onClose: () => void;
  settings: PortalSettings;
  isAdmin: boolean;
  onUpdateSettings?: (newSettings: PortalSettings) => void;
  onOpenAdminSettings?: () => void;
}

interface PolicyInfo {
  title: string;
  englishTitle: string;
  key: keyof NonNullable<typeof DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies>;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const POLICY_INFO_MAP: Record<PolicyType, PolicyInfo> = {
  privacy: {
    title: 'गोपनीयता नीति',
    englishTitle: 'Privacy & Data Protection Policy (DPDP & GDPR Compliance)',
    key: 'privacyPolicy',
    badge: 'Reader Data Protection',
    icon: Lock,
  },
  terms: {
    title: 'नियम एवं शर्तें',
    englishTitle: 'Terms of Service & User Agreement (Copyright & Fair Use)',
    key: 'termsOfService',
    badge: 'Legal Agreement',
    icon: FileText,
  },
  grievance: {
    title: 'शिकायत निवारण अधिकारी',
    englishTitle: 'Grievance Redressal Mechanism (Rule 11 IT Rules 2021)',
    key: 'grievanceRedressal',
    badge: 'Statutory Redressal (15 Days)',
    icon: AlertCircle,
  },
  factCheck: {
    title: 'तथ्य-जांच नीति',
    englishTitle: 'Fact-Checking Policy & 4-Stage Verification Protocol',
    key: 'factCheckPolicy',
    badge: '100% Verified Standards',
    icon: ShieldCheck,
  },
  ethics: {
    title: 'संपादकीय आचार संहिता',
    englishTitle: 'Code of Editorial Ethics & Journalistic Standards',
    key: 'editorialEthics',
    badge: 'Journalistic Independence',
    icon: FileText,
  },
};

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  policyType: initialPolicyType,
  onClose,
  settings,
  isAdmin,
  onUpdateSettings,
  onOpenAdminSettings,
}) => {
  const [currentPolicy, setCurrentPolicy] = useState<PolicyType>(initialPolicyType);
  const info = POLICY_INFO_MAP[currentPolicy];
  const hf = settings.headerFooter || DEFAULT_HEADER_FOOTER_SETTINGS;
  const currentText =
    hf.legalPolicies?.[info.key] || DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies![info.key];

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(currentText);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Switch policy tab
  const handleSelectPolicy = (p: PolicyType) => {
    setCurrentPolicy(p);
    setIsEditing(false);
    const newInfo = POLICY_INFO_MAP[p];
    const newText =
      hf.legalPolicies?.[newInfo.key] || DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies![newInfo.key];
    setEditText(newText);
  };

  const handleSave = () => {
    if (!onUpdateSettings) return;
    const updated: PortalSettings = {
      ...settings,
      headerFooter: {
        ...hf,
        legalPolicies: {
          ...(hf.legalPolicies || DEFAULT_HEADER_FOOTER_SETTINGS.legalPolicies!),
          [info.key]: editText,
        },
      },
    };
    onUpdateSettings(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const IconComponent = info.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn font-kd-body">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* 1. Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center border border-red-500/40 shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black font-kd-headline text-white">
                  {info.title}
                </h3>
                <span className="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {info.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-kd-meta">{info.englishTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Interactive Policy Tabs Selector (All 5 Policies Accessible Directly) */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto scrollbar-none font-kd-meta">
          {[
            { id: 'privacy', label: 'गोपनीयता नीति (Privacy)' },
            { id: 'terms', label: 'नियम एवं शर्तें (Terms)' },
            { id: 'grievance', label: 'शिकायत निवारण (Grievance)' },
            { id: 'factCheck', label: 'तथ्य-जांच (Fact-Check)' },
            { id: 'ethics', label: 'आचार संहिता (Ethics)' },
          ].map((tab) => {
            const isActive = currentPolicy === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectPolicy(tab.id as PolicyType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Admin In-Place Customizer Banner (Visible Only to Admin) */}
        {isAdmin && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0 font-kd-meta">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-bold">एडमिन इन-प्लेस एडिटर:</span>
              <span className="hidden sm:inline">आप इस नीति का टेक्स्ट यहीं से बदल सकते हैं।</span>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <PenTool className="w-3 h-3" />
                  <span>एडिट करें</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>सहेजें (Save)</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditText(currentText);
                      setIsEditing(false);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    रद्द करें
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 4. Scrollable Policy Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-sm leading-relaxed scrollbar-thin">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn font-bold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>नीति सफलतापूर्वक अपडेट हो गई है!</span>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-kd-meta">
                नीति सामग्री (Policy Content Markdown Editor)
              </label>
              <textarea
                rows={14}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-kd-body leading-relaxed font-mono"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formatted Policy Body with clear paragraphs */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-kd-body whitespace-pre-line text-xs sm:text-sm shadow-inner">
                {currentText}
              </div>

              {/* Verified Editorial Seal & IT Rules Statutory Tag */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 font-kd-meta">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">
                      {hf.siteTitle || 'खबरी दोस्त (Khabri Dost)'} • डिजिटल न्यूज़ नेटवर्क
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    भारत सरकार के आईटी नियम 2021 व Google AdSense पब्लिशर पॉलिसी अनुपालन
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <div>RNI No: {hf.rniNumber}</div>
                  <div>अंतिम नवीनीकरण: 2026</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 font-kd-meta">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{hf.contactEmail}</span>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && onOpenAdminSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminSettings();
                }}
                className="text-red-600 hover:text-red-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer mr-2"
              >
                <Sliders className="w-3 h-3" />
                <span>सभी सेटिंग्स</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-black text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
