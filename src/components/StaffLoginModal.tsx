import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  KeyRound,
  UserCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../context/AuthContext';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginAsStaffWithGoogle, loginAsStaffWithEmail, loginAsSuperAdminDirectly } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<'admin' | 'google' | 'email'>('admin');
  const [successInfo, setSuccessInfo] = useState<{ name: string; role: string } | null>(null);

  if (!isOpen) return null;

  const handleDirectAdminLogin = async (targetEmail: string = ADMIN_EMAIL) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAsSuperAdminDirectly(targetEmail);
      if (res.success && res.staff) {
        setSuccessInfo({ name: res.staff.name, role: res.staff.role });
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 800);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'एडमिन प्रमाणीकरण विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAsStaffWithGoogle();
      if (res.success && res.staff) {
        setSuccessInfo({ name: res.staff.name, role: res.staff.role });
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'लॉगिन विफल रहा। कृपया अधिकृत ईमेल का उपयोग करें।');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('कृपया अपना स्टाफ ईमेल दर्ज करें।');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAsStaffWithEmail(emailInput.trim());
      if (res.success && res.staff) {
        setSuccessInfo({ name: res.staff.name, role: res.staff.role });
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'यह ईमेल अधिकृत स्टाफ सूची में नहीं मिला।');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'सत्यापन विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative text-slate-900">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2">
            <span className="p-2 bg-white/10 rounded-xl border border-white/20">
              <Lock className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-200 uppercase bg-red-900/60 px-2 py-0.5 rounded">
                RESTRICTED NEWSROOM DESK (/login)
              </span>
              <h2 className="text-lg sm:text-xl font-black font-kd-headline text-white mt-0.5">
                स्टाफ एवं संपादक लॉगिन पोर्टल
              </h2>
            </div>
          </div>
          <p className="text-xs text-red-100 font-kd-meta">
            केवल खबरी दोस्त के अधिकृत संपादकों, पत्रकारों एवं व्यवस्थापक के लिए आरक्षित।
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Success Banner */}
          {successInfo && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center space-x-3 text-emerald-900 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold font-kd-headline text-emerald-900">
                  प्रवेश स्वीकृत! स्वागत है, {successInfo.name}
                </p>
                <p className="text-[11px] text-emerald-700 font-kd-meta">
                  भूमिका: {successInfo.role.toUpperCase()} • एडमिन पैनल खोला जा रहा है...
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-300 p-3.5 rounded-xl flex items-start space-x-2.5 text-red-900 animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-800">लॉगिन अस्वीकृत (Access Denied)</p>
                <p className="text-red-700 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Method Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveMethod('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeMethod === 'admin'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>👑 मुख्य व्यवस्थापक</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMethod('google');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer ${
                activeMethod === 'google'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMethod('email');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeMethod === 'email'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <span>स्टाफ ईमेल</span>
            </button>
          </div>

          {/* METHOD 0: DIRECT SUPER ADMIN 1-CLICK ACCESS */}
          {activeMethod === 'admin' && (
            <div className="space-y-4 pt-1">
              <div className="bg-gradient-to-br from-amber-50 to-red-50 border border-amber-300 rounded-xl p-4 text-xs text-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-red-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
                  <span>मुख्य व्यवस्थापक त्वरित सत्यापन (Super Admin)</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-kd-meta">
                  Khabri Dost के स्वामी और मुख्य व्यवस्थापक के रूप में पूरे पोर्टल का सीधा नियंत्रण प्राप्त करें। आप तुरंत एडमिन पैनल, मोनेटाइजेशन, थीम, और सभी सेटिंग्स एक्सेस कर सकते हैं।
                </p>
                <div className="pt-1 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                    <span className="text-slate-500">व्यवस्थापक आईडी:</span>
                    <span className="font-bold text-red-700">khabridost.com@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                    <span className="text-slate-500">वैकल्पिक खाता:</span>
                    <span className="font-bold text-slate-700">khabaridost.com@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDirectAdminLogin('khabridost.com@gmail.com')}
                  disabled={loading || !!successInfo}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2.5 shadow-md cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'एडमिन सत्र प्रारंभ हो रहा है...' : '👑 मुख्य व्यवस्थापक के रूप में सीधे लॉगिन करें'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectAdminLogin('khabaridost.com@gmail.com')}
                  disabled={loading || !!successInfo}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 border border-slate-300 cursor-pointer disabled:opacity-50 text-xs shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>वैकल्पिक ईमेल (khabaridost.com@gmail.com) से प्रवेश करें</span>
                </button>
              </div>
            </div>
          )}

          {/* METHOD 1: GOOGLE / GMAIL LOGIN */}
          {activeMethod === 'google' && (
            <div className="space-y-4 pt-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 font-kd-meta">
                <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>व्हाइटलिस्ट सुरक्षा सत्यापन (Whitelist Security)</span>
                </div>
                <p>
                  अपने आधिकारिक Google खाते से लॉगिन करें। सिस्टम स्वचालित रूप से जांच करेगा कि क्या आपका ईमेल व्यवस्थापक द्वारा अनुमत स्टाफ सूची में शामिल है।
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || !!successInfo}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-3 border border-slate-300 shadow-xs cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'सत्यापित किया जा रहा है...' : 'Gmail से अधिकृत स्टाफ लॉगिन करें'}</span>
              </button>
            </div>
          )}

          {/* METHOD 2: STAFF REGISTERED EMAIL */}
          {activeMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  आधिकारिक स्टाफ ईमेल पता (Registered Staff Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="उदा. yourname@khabridost.com या khabridost.com@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  वही ईमेल दर्ज करें जो मुख्य व्यवस्थापक द्वारा संपादकीय टीम में पंजीकृत है।
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !!successInfo}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'जांच हो रही है...' : 'सत्यापित करें एवं न्यूज़रूम में प्रवेश करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Staff Security Notice */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-700">सुरक्षा नियम:</strong> आम पाठक न्यूज़लेटर या टिप्पणियों के लिए साइन इन कर सकते हैं, किंतु एडमिन कक्ष में केवल व्यवस्थापक द्वारा बनाए गए संपादक ही प्रवेश पा सकते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
