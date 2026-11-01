import React, { useState } from 'react';
import {
  X,
  Clock,
  Trash2,
  ExternalLink,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Sparkles,
  UserCheck,
  LogIn,
  Filter,
} from 'lucide-react';
import { NewsReadLater, NewsArticle, NewsBookmark } from '../types/news';
import { formatHindiTimeAgo } from '../utils/hindiHelpers';
import { useAuth } from '../context/AuthContext';

interface ReadLaterModalProps {
  onClose: () => void;
  readLaterItems: NewsReadLater[];
  allArticles: NewsArticle[];
  bookmarks: NewsBookmark[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveReadLater: (articleId: string) => void;
  onToggleBookmark: (article: NewsArticle) => void;
  onClearAllReadLater: () => void;
}

export const ReadLaterModal: React.FC<ReadLaterModalProps> = ({
  onClose,
  readLaterItems,
  allArticles,
  bookmarks,
  onSelectArticle,
  onRemoveReadLater,
  onToggleBookmark,
  onClearAllReadLater,
}) => {
  const { user, userProfile, signInWithGoogle } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  // Derive unique categories from read later items
  const categories = Array.from(new Set(readLaterItems.map((item) => item.articleCategory))).filter(Boolean);

  const filteredItems = selectedCategory === 'all'
    ? readLaterItems
    : readLaterItems.filter((item) => item.articleCategory === selectedCategory);

  const bookmarkedArticleIds = new Set(bookmarks.map((b) => b.articleId));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg font-['Rozha_One',serif] tracking-wide">
                  बाद में पढ़ें (Read Later)
                </h3>
                <span className="bg-indigo-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {readLaterItems.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-kd-meta">
                आपकी निजी पठन कतार (Personal Offline & Cloud Reading Queue)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Local Profile Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {user.photoURL && user.photoURL.trim() !== '' ? (
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-8 h-8 rounded-full border border-indigo-300 object-cover shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-2xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{user.displayName || userProfile?.name || 'पाठक प्रोफ़ाइल'}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold flex items-center space-x-0.5">
                      <UserCheck className="w-2.5 h-2.5" />
                      <span>क्लाउड सिंक</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-kd-meta truncate max-w-[220px]">
                    {user.email}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">लोकल प्रोफ़ाइल मोड (Guest Profile)</div>
                  <div className="text-[11px] text-slate-500 font-kd-meta">
                    लेख आपके ब्राउज़र में सुरक्षित हैं। अन्य डिवाइस से सिंक हेतु लॉगिन करें।
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Quick reading stats */}
            <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <span className="text-indigo-600 font-bold">{readLaterItems.length}</span>
              <span>रीड लेटर</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-bold">{bookmarks.length}</span>
              <span>बुकमार्क</span>
            </div>

            {!user && (
              <button
                onClick={signInWithGoogle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md font-bold transition flex items-center space-x-1 text-[11px] shadow-2xs cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Google सिंक</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters & Clear Actions */}
        {readLaterItems.length > 0 && (
          <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center space-x-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                सभी ({readLaterItems.length})
              </button>
              {categories.map((cat) => {
                const count = readLaterItems.filter((i) => i.articleCategory === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer capitalize ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {confirmClear ? (
              <div className="flex items-center space-x-1.5 shrink-0 bg-red-50 p-1 rounded-lg border border-red-200">
                <span className="text-[11px] text-red-700 font-semibold px-1">सब हटाएं?</span>
                <button
                  onClick={() => {
                    onClearAllReadLater();
                    setConfirmClear(false);
                  }}
                  className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold hover:bg-red-700 transition cursor-pointer"
                >
                  हाँ
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold hover:bg-slate-300 transition cursor-pointer"
                >
                  रद्द
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-[11px] text-slate-500 hover:text-red-600 font-semibold transition flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>कतार साफ़ करें</span>
              </button>
            )}
          </div>
        )}

        {/* Content List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 flex-1 bg-slate-50/50">
          {filteredItems.length === 0 ? (
            <div className="text-center py-14 px-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-500 shadow-2xs">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 font-['Rozha_One',serif]">
                आपकी रीड लेटर सूची खाली है
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                किसी भी समाचार कार्ड या आर्टिकल पेज पर घड़ी (<Clock className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" />) आइकन दबाकर उसे फुर्सत में पढ़ने के लिए सहेजें। यह आपके बुकमार्क्स से अलग निजी कतार है।
              </p>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ताज़ा ख़बरें देखें</span>
                </button>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => {
              const matchedArticle = allArticles.find((a) => a.id === item.articleId);
              const isBookmarked = bookmarkedArticleIds.has(item.articleId);

              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-white hover:bg-indigo-50/40 rounded-xl border border-slate-200 hover:border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group shadow-2xs"
                >
                  {/* Article Info */}
                  <div
                    onClick={() => {
                      if (matchedArticle) {
                        onSelectArticle(matchedArticle);
                        onClose();
                      }
                    }}
                    className="flex items-start sm:items-center space-x-3 flex-1 cursor-pointer min-w-0"
                  >
                    {item.articleImageUrl && item.articleImageUrl.trim() !== '' ? (
                      <img
                        src={item.articleImageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-16 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-16 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded uppercase">
                          {item.articleCategory}
                        </span>
                        {item.estimatedReadTime && (
                          <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>{item.estimatedReadTime}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
                        {item.articleTitle}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-1 font-kd-meta flex items-center space-x-2">
                        <span>कतार में जोड़ा: {formatHindiTimeAgo(item.createdAt)}</span>
                        {matchedArticle && (
                          <span className="text-emerald-600 font-medium flex items-center space-x-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>उपलब्ध</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end sm:justify-center space-x-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    {/* Read Now Button */}
                    {matchedArticle && (
                      <button
                        onClick={() => {
                          onSelectArticle(matchedArticle);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg transition text-xs font-bold flex items-center space-x-1 cursor-pointer border border-indigo-100"
                        title="पूरा पढ़ें"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>पढ़ें</span>
                      </button>
                    )}

                    {/* Bookmark Toggle */}
                    {matchedArticle && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(matchedArticle);
                        }}
                        className={`p-1.5 rounded-lg transition cursor-pointer border ${
                          isBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-slate-100 text-slate-500 hover:text-amber-600 border-slate-200'
                        }`}
                        title={isBookmarked ? 'बुकमार्क में सहेजा हुआ है' : 'बुकमार्क्स में भी जोड़ें'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    )}

                    {/* Remove from Read Later */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveReadLater(item.articleId);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer border border-slate-200 hover:border-red-200"
                      title="रीड लेटर सूची से हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center space-x-1 font-kd-meta">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>रीड लेटर कतार आपके निजी प्रोफ़ाइल एवं Firestore से रीयल-टाइम जुड़ी है।</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
