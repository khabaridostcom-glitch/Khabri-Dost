import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { PortalPopupConfig, NewsArticle } from '../types/news';

interface PortalPopupProps {
  config?: PortalPopupConfig;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onSubscribeEmail: (email: string) => void;
}

export const PortalPopup: React.FC<PortalPopupProps> = ({
  config,
  articles,
  onSelectArticle,
  onSubscribeEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribedDone, setSubscribedDone] = useState(false);

  useEffect(() => {
    if (!config || !config.enabled) {
      setIsOpen(false);
      return;
    }

    // Check session storage if frequency is once_session
    if (config.showFrequency === 'once_session') {
      const shownInSession = sessionStorage.getItem('kd_popup_dismissed');
      if (shownInSession === 'true') {
        return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, (config.delaySeconds || 2) * 1000);

    return () => clearTimeout(timer);
  }, [config]);

  const handleClose = () => {
    setIsOpen(false);
    if (config?.showFrequency === 'once_session') {
      sessionStorage.setItem('kd_popup_dismissed', 'true');
    }
  };

  const handleAction = () => {
    if (config?.type === 'newsletter_subscribe') {
      if (emailInput.trim()) {
        onSubscribeEmail(emailInput.trim());
        setSubscribedDone(true);
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
      return;
    }

    // If there is an article link (e.g. news-1)
    if (config?.ctaLink) {
      const targetArticle = articles.find((a) => a.id === config.ctaLink);
      if (targetArticle) {
        onSelectArticle(targetArticle);
      }
    }
    handleClose();
  };

  if (!isOpen || !config || !config.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-200 relative my-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition shadow-md"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Featured Image */}
        {config.imageUrl && config.imageUrl.trim() !== '' && (
          <div className="relative h-44 sm:h-48 w-full bg-slate-900">
            <img
              src={config.imageUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm tracking-wide">
                {config.type === 'breaking_alert' && '🔴 ताज़ा ख़बर अलर्ट'}
                {config.type === 'newsletter_subscribe' && '✉️ दैनिक ई-मेल बुलेटिन'}
                {config.type === 'special_coverage' && '⭐ विशेष कवरेज'}
                {config.type === 'festive_greeting' && '🎉 विशेष शुभकामना'}
                {config.type === 'app_install' && '📱 मोबाइल ऐप'}
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-3 font-sans">
          {!config.imageUrl && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide inline-block">
              {config.type.replace('_', ' ')}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {config.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {config.description}
          </p>

          {/* If Newsletter Subscription mode */}
          {config.type === 'newsletter_subscribe' ? (
            <div className="space-y-2 pt-1">
              {subscribedDone ? (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl text-center border border-emerald-200">
                  ✓ धन्यवाद! आप सफलतापूर्वक सब्सक्राइब हो चुके हैं।
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="अपना ई-मेल दर्ज करें..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    onClick={handleAction}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    सब्सक्राइब
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                <span>{config.ctaText || 'अभी पढ़ें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="text-center pt-1">
            <button
              onClick={handleClose}
              className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
            >
              बाद में पढ़ें (Dismiss)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
