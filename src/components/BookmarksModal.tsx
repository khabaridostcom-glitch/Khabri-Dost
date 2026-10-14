import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { NewsBookmark, NewsArticle } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';

interface BookmarksModalProps {
  onClose: () => void;
  bookmarks: NewsBookmark[];
  allArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  onClose,
  bookmarks,
  allArticles,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="font-bold text-base sm:text-lg font-['Rozha_One',serif]">
              सहेजी गई ख़बरें (बुकमार्क)
            </h3>
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {bookmarks.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium">आपकी बुकमार्क सूची खाली है।</p>
              <p className="text-xs text-slate-400">
                किसी भी समाचार के ऊपर बुकमार्क आइकन दबाकर उसे बाद में पढ़ने के लिए सहेजें।
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => {
              const matchedArticle = allArticles.find((a) => a.id === bm.articleId);
              return (
                <div
                  key={bm.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between space-x-3 transition group"
                >
                  <div
                    onClick={() => {
                      if (matchedArticle) {
                        onSelectArticle(matchedArticle);
                        onClose();
                      }
                    }}
                    className="flex items-center space-x-3 flex-1 cursor-pointer min-w-0"
                  >
                    {bm.articleImageUrl && (
                      <img
                        src={bm.articleImageUrl}
                        alt=""
                        className="w-14 h-12 rounded-lg object-cover shrink-0 bg-slate-200"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-red-600 uppercase block mb-0.5">
                        {bm.articleCategory}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-red-700 transition truncate">
                        {bm.articleTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        सहेजा गया: {formatHindiTimeAgo(bm.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {matchedArticle && (
                      <button
                        onClick={() => {
                          onSelectArticle(matchedArticle);
                          onClose();
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition"
                        title="पढ़ें"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (matchedArticle) {
                          onRemoveBookmark(matchedArticle);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                      title="बुकमार्क हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
