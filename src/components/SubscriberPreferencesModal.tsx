import React, { useState } from 'react';
import {
  Bell,
  Mail,
  CheckCircle2,
  X,
  Sparkles,
  Sliders,
  Check,
  Flame,
  Clock,
  Radio,
  Newspaper,
  Send,
} from 'lucide-react';
import { NewsCategory, SubscriberItem } from '../types/news';
import { CATEGORIES } from '../data/seedNews';

interface SubscriberPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSubscriber: (subscriber: Omit<SubscriberItem, 'id' | 'subscribedAt'>) => void;
  initialEmail?: string;
}

export const SubscriberPreferencesModal: React.FC<SubscriberPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSaveSubscriber,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>([
    'politics',
    'national',
    'sports',
    'business',
  ]);
  const [digestPreference, setDigestPreference] = useState<
    'daily_morning' | 'breaking_instant' | 'weekly_digest' | 'all'
  >('daily_morning');
  const [deliveryChannel, setDeliveryChannel] = useState<'email' | 'push' | 'both'>('email');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (catId: NewsCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleSelectAllCategories = () => {
    const validCats = CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.id as NewsCategory);
    if (selectedCategories.length === validCats.length) {
      setSelectedCategories(['national', 'politics']);
    } else {
      setSelectedCategories(validCats);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    onSaveSubscriber({
      email: email.trim(),
      name: name.trim() || undefined,
      status: 'active',
      source: 'popup',
      preferredCategories: selectedCategories,
      digestPreference,
      deliveryChannel,
      tags: selectedCategories,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="p-2 bg-white/10 rounded-xl border border-white/20">
              <Bell className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-200 uppercase bg-red-900/60 px-2 py-0.5 rounded">
                कस्टमाइज़ न्यूज़लेटर एवं अलर्ट
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-kd-headline text-white mt-0.5">
                पसंदीदा विषय एवं सामग्री सेटिंग्स
              </h2>
            </div>
          </div>
          <p className="text-xs text-red-100 font-kd-meta">
            केवल वही ख़बरें पाएं जो आपके लिए महत्वपूर्ण हैं।
          </p>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl flex items-center space-x-2.5 text-emerald-900 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">आपकी प्राथमिकताएं सफलतापूर्वक सहेजी गईं!</p>
                <p className="text-emerald-700">अब आपको आपके पसंदीदा विषयों के अनुसार बुलेटिन प्राप्त होंगे।</p>
              </div>
            </div>
          )}

          {/* User Email & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ईमेल पता (Email Address) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="उदा. reader@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आपका नाम (वैकल्पिक)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. अमित शर्मा"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* 1. Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <span className="w-1.5 h-3.5 bg-red-600 rounded-xs"></span>
                <span>पसंदीदा विषय चुनें (Select Topics)</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllCategories}
                className="text-[11px] text-red-600 font-semibold hover:underline cursor-pointer"
              >
                {selectedCategories.length === CATEGORIES.filter((c) => c.id !== 'all').length
                  ? 'कम करें'
                  : 'सभी चुनें'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const isSelected = selectedCategories.includes(cat.id as NewsCategory);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id as NewsCategory)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-red-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{cat.labelHindi}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Content & Frequency Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-xs"></span>
              <span>सामग्री प्रारूप एवं आवृत्ति (Content Options)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  id: 'daily_morning',
                  title: 'दैनिक सुबह का मुख्य बुलेटिन',
                  desc: 'प्रतिदिन सुबह 7:00 बजे दिनभर की बड़ी ख़बरें',
                  icon: Clock,
                },
                {
                  id: 'breaking_instant',
                  title: 'तुरंत ताज़ा व ब्रेकिंग अलर्ट्स',
                  desc: 'बड़ी राजनीतिक, खेल व राष्ट्रीय ख़बर आते ही',
                  icon: Flame,
                },
                {
                  id: 'weekly_digest',
                  title: 'साप्ताहिक संपादकीय विश्लेषण',
                  desc: 'सप्ताह की सबसे महत्वपूर्ण ख़बरों की गहराई से समीक्षा',
                  icon: Newspaper,
                },
                {
                  id: 'all',
                  title: 'सभी समाचार व लाइव कवरेज',
                  desc: 'पूर्ण कवरेज, लाइव इवेंट्स एवं विशेष रिपोर्ट',
                  icon: Radio,
                },
              ].map((item) => {
                const isSelected = digestPreference === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDigestPreference(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-start space-x-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 text-amber-950 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight">{item.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Delivery Channel */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">प्राप्ति माध्यम (Delivery Channel)</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              {[
                { id: 'email', label: '✉️ ईमेल न्यूज़लेटर' },
                { id: 'push', label: '🔔 वेब पुश अलर्ट' },
                { id: 'both', label: '⚡ दोनों (Email + Push)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDeliveryChannel(opt.id as any)}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    deliveryChannel === opt.id
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={savedSuccess}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
            >
              <Send className="w-4 h-4" />
              <span>मेरी सदस्यता प्राथमिकताएं सहेजें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
