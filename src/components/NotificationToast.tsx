import React from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { PushNotificationItem, NewsArticle } from '../types/news';

interface NotificationToastProps {
  notification: PushNotificationItem | null;
  onClose: () => void;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  articles,
  onSelectArticle,
}) => {
  if (!notification) return null;

  const handleClick = () => {
    if (notification.url) {
      const art = articles.find((a) => a.id === notification.url);
      if (art) {
        onSelectArticle(art);
      }
    }
    onClose();
  };

  return (
    <div className="fixed top-14 right-4 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 animate-slideInRight font-sans">
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-red-500 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0" onClick={handleClick}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
              {notification.icon || '🔴'} ताज़ा वेब अलर्ट
            </span>
            <span className="text-[10px] text-slate-500">अभी-अभी</span>
          </div>

          <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-2 hover:text-red-400 cursor-pointer">
            {notification.title}
          </h4>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 cursor-pointer">
            {notification.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
        <span className="text-slate-500">खबरी दोस्त डिजिटल नेटवर्क</span>
        <button
          onClick={handleClick}
          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
        >
          <span>ख़बर देखें</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
