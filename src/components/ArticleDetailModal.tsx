import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  Eye,
  ThumbsUp,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Trash2,
  Check,
  Tag,
  User as UserIcon,
  LogIn,
} from 'lucide-react';
import { NewsArticle, NewsComment } from '../types/news';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToComments,
  postComment,
  deleteComment,
  incrementArticleLikes,
  incrementArticleViews,
} from '../services/newsService';
import { formatHindiTimeAgo, speakHindiText, stopSpeaking } from '../utils/hindiHelpers';
import { AudioNewsPlayer } from './AudioNewsPlayer';
import { ArticleKeyHighlights } from './ArticleKeyHighlights';

interface ArticleDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  isReadLater?: boolean;
  onToggleReadLater?: (article: NewsArticle) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isReadLater = false,
  onToggleReadLater,
  fontSize,
}) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likes, setLikes] = useState(article?.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (!article) return;
    setLikes(article.likesCount || 0);
    setHasLiked(false);
    stopSpeaking();
    setIsSpeaking(false);

    // Increment view count in background
    incrementArticleViews(article.id, article.viewsCount || 0);

    // Subscribe to comments
    const unsubscribe = subscribeToComments(article.id, (loadedComments) => {
      setComments(loadedComments);
    });

    return () => {
      stopSpeaking();
      unsubscribe();
    };
  }, [article?.id]);

  if (!article) return null;

  const timeAgo = formatHindiTimeAgo(article.createdAt);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    const newLikes = await incrementArticleLikes(article.id, likes);
    setLikes(newLikes);
  };

  const handleSpeak = () => {
    setShowAudioPlayer((prev) => !prev);
  };

  const handleShareWhatsApp = () => {
    const text = `*${article.title}*\n\n${article.summary}\n\nविस्तार से पढ़ें: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `${article.title} - खबरी दोस्त न्यूज़`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      signInWithGoogle();
      return;
    }

    setIsPostingComment(true);
    try {
      await postComment(article.id, commentText, {
        uid: user.uid,
        name: user.displayName || 'सम्मानित पाठक',
        email: user.email || '',
        photoURL: user.photoURL || '',
      });
      setCommentText('');
    } catch (err) {
      alert('टिप्पणी पोस्ट करने में विफल रहा।');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('क्या आप इस टिप्पणी को हटाना चाहते हैं?')) {
      try {
        await deleteComment(commentId);
      } catch (err) {
        alert('हटाने में समस्या आई।');
      }
    }
  };

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl leading-loose'
      : fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header Sticky Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">
              {article.category}
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center text-slate-500">
              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
              {article.location || 'विशेष ब्यूरो'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Listen Audio */}
            <button
              onClick={handleSpeak}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                showAudioPlayer
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {showAudioPlayer ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-600" />}
              <span>{showAudioPlayer ? 'ऑडियो चालू' : 'ख़बर सुनें'}</span>
            </button>

            {/* Read Later Button */}
            {onToggleReadLater && (
              <button
                onClick={() => onToggleReadLater(article)}
                className={`p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer ${
                  isReadLater ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
                }`}
                title={isReadLater ? 'रीड लेटर से हटाएं' : 'बाद में पढ़ें (Read Later)'}
              >
                <Clock className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer ${
                isBookmarked ? 'text-red-600 bg-red-50' : 'text-slate-500'
              }`}
              title="बुकमार्क करें"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-red-600' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Breaking badge if active */}
          {article.isBreaking && (
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>ताज़ा ब्रेकिंग न्यूज़</span>
            </div>
          )}

          {/* Headline */}
          <h1
            style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}
            className="text-2xl sm:text-3xl md:text-4xl font-black font-['Rozha_One',serif] text-slate-900 leading-tight [overflow-wrap:anywhere] [word-break:normal] min-w-0"
          >
            {article.title}
          </h1>

          {/* Subtitle / Summary */}
          {article.summary && (
            <div
              style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}
              className="p-4 bg-slate-50 border-l-4 border-red-600 rounded-r-lg text-slate-700 font-medium text-sm sm:text-base italic leading-relaxed [overflow-wrap:anywhere] [word-break:normal] min-w-0"
            >
              {article.summary}
            </div>
          )}

          {/* Reporter Byline & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow">
                {article.authorName?.charAt(0) || 'ख'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{article.authorName}</p>
                <p className="text-slate-500">{article.authorRole || 'विशेष संवाददाता'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(article.createdAt).toLocaleString('hi-IN', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.viewsCount} पाठक</span>
              </div>
            </div>
          </div>

          {/* AUDIO NEWS PLAYER */}
          {showAudioPlayer && (
            <div className="my-2">
              <AudioNewsPlayer
                title={article.title}
                textToRead={`${article.title}। ${article.summary ? article.summary + '।' : ''} ${article.content}`}
                isOpen={showAudioPlayer}
                onClose={() => {
                  setShowAudioPlayer(false);
                  stopSpeaking();
                }}
              />
            </div>
          )}

          {/* EDITORIAL KEY HIGHLIGHTS (मुख्य बिंदु) */}
          <ArticleKeyHighlights article={article} />

          {/* Featured Image */}
          <figure className="space-y-2">
            <div className="rounded-xl overflow-hidden shadow-sm bg-slate-100 aspect-[16/9] max-h-[460px]">
              <img
                src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <figcaption className="text-xs text-slate-500 text-center italic">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>

          {/* Article Full Body */}
          <div className={`text-slate-800 font-normal space-y-4 font-['Mukta',sans-serif] min-w-0 max-w-full article-content-container ${fontSizeClass}`}>
            {article.content.split('\n\n').map((para, i) => (
              <p
                key={i}
                style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}
                className="text-justify leading-relaxed [overflow-wrap:anywhere] [word-break:normal] min-w-0"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                <Tag className="w-3 h-3 mr-1" />
                टैग्स:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement & Social Sharing Bar */}
          <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition ${
                hasLiked
                  ? 'bg-red-600 text-white'
                  : 'bg-white hover:bg-red-50 text-slate-700 border border-slate-300'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-white' : 'text-red-600'}`} />
              <span>{likes} पसंद किया</span>
            </button>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">शेयर करें:</span>
              <button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
              >
                <span>X / Twitter</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold font-['Rozha_One',serif] text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>पाठकों की राय & विचार ({comments.length})</span>
              </h3>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handlePostComment} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    {user.photoURL && user.photoURL.trim() !== '' ? (
                      <img src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-semibold">{user.displayName || user.email}</span>
                    <span className="text-slate-400">के रूप में टिप्पणी कर रहे हैं</span>
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="इस समाचार पर अपनी निष्पक्ष राय लिखें..."
                    rows={3}
                    maxLength={1000}
                    required
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isPostingComment || !commentText.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPostingComment ? 'भेजा जा रहा है...' : 'टिप्पणी भेजें'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-slate-600">
                    इस समाचार पर टिप्पणी करने के लिए Google से लॉगिन करें।
                  </p>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Google से साइन इन करें</span>
                  </button>
                </div>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">
                  अभी तक कोई टिप्पणी नहीं है। सबसे पहले अपनी राय साझा करें!
                </p>
              ) : (
                comments.map((com) => {
                  const isAuthor = user && (user.uid === com.authorUid || isAdmin);
                  return (
                    <div
                      key={com.id}
                      className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm flex items-start justify-between space-x-3"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        {com.authorPhoto && com.authorPhoto.trim() !== '' ? (
                          <img
                            src={com.authorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full shrink-0 border border-slate-200 mt-0.5"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                            {com.authorName?.charAt(0) || 'प'}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-xs text-slate-800">{com.authorName}</span>
                            <span className="text-[10px] text-slate-400">
                              {formatHindiTimeAgo(com.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {com.content}
                          </p>
                        </div>
                      </div>

                      {isAuthor && (
                        <button
                          onClick={() => handleDeleteComment(com.id)}
                          className="text-slate-300 hover:text-red-600 p-1 transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
