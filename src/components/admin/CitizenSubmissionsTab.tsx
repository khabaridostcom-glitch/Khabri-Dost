import React, { useState } from 'react';
import {
  Inbox,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { CitizenNewsSubmission, NewsArticle } from '../../types/news';

interface CitizenSubmissionsTabProps {
  submissions: CitizenNewsSubmission[];
  onUpdateStatus: (id: string, status: CitizenNewsSubmission['status']) => void;
  onDeleteSubmission: (id: string) => void;
  onConvertToArticle: (submission: CitizenNewsSubmission) => void;
}

export const CitizenSubmissionsTab: React.FC<CitizenSubmissionsTabProps> = ({
  submissions = [],
  onUpdateStatus,
  onDeleteSubmission,
  onConvertToArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected' | 'published'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<CitizenNewsSubmission | null>(null);

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-kd-body text-slate-800">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <Inbox className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-kd-headline">
              नागरिक पत्रकारिता डेस्क (Citizen News Desk)
            </h2>
            {pendingCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono animate-pulse">
                {pendingCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-kd-meta mt-1">
            पाठकों द्वारा 'अपनी खबर भेजें' (/submit-news) फ़ॉर्म के माध्यम से भेजी गई लोकल ख़बरें, तस्वीरें व वीडियो। यहाँ से 1-क्लिक में न्यूज़ पोस्ट में बदलें।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Total Submissions: {submissions.length}
          </span>
        </div>
      </div>

      {/* 2. Search & Status Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शीर्षक, स्थान, या प्रेषक का नाम खोजें..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {(['all', 'pending', 'verified', 'published', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? `सभी (${submissions.length})`
                : st === 'pending'
                ? `पेंडिंग (${submissions.filter((s) => s.status === 'pending').length})`
                : st === 'verified'
                ? 'सत्यापित'
                : st === 'published'
                ? 'प्रकाशित'
                : 'अस्वीकृत'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Submissions Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">कोई खबर नहीं मिली</p>
          <p className="text-xs text-slate-400">
            जब पाठक फ़्रंटएंड पर /submit-news से अपनी खबरें भेजेंगे, वे यहाँ स्वचालित रूप से दिखाई देंगी।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const statusBadge = {
              pending: { text: 'समीक्षाधीन (Pending)', class: 'bg-amber-100 text-amber-800 border-amber-200' },
              verified: { text: 'सत्यापित (Verified)', class: 'bg-blue-100 text-blue-800 border-blue-200' },
              published: { text: 'प्रकाशित (Published)', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
              rejected: { text: 'अस्वीकृत (Rejected)', class: 'bg-rose-100 text-rose-800 border-rose-200' },
            }[item.status];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      ID: {item.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-kd-meta ${statusBadge.class}`}
                    >
                      {statusBadge.text}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 font-kd-headline mt-2 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Thumbnail Preview */}
                  {item.images && item.images.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden rounded-xl border border-slate-100">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-28 object-cover group-hover:scale-102 transition duration-200"
                      />
                    </div>
                  )}

                  {/* Metadata: Location, Date, Sender */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-500 font-kd-meta">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{item.location || 'स्थान उपलब्ध नहीं'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">
                          {item.isAnonymous ? 'गुमनाम प्रेषक (Anonymous)' : item.senderName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.incidentDate || item.submittedAt}
                      </span>
                    </div>
                    {item.senderPhone && (
                      <div className="flex items-center space-x-1.5 text-slate-500 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.senderPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    title="पूरी खबर और फोटो देखें"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onConvertToArticle(item)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-2xs cursor-pointer"
                      title="संपादकीय एडिटर में खोलकर पब्लिश करें"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Convert to Article</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSubmission(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">
                  टिकट ID: {selectedSubmission.id}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kd-headline mt-0.5">
                  {selectedSubmission.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Images */}
            {selectedSubmission.images && selectedSubmission.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedSubmission.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Citizen photo"
                    className="w-full h-44 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            )}

            {/* Video link */}
            {selectedSubmission.videoUrl && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between border border-slate-200">
                <span className="text-slate-600 font-semibold">संलग्न वीडियो लिंक:</span>
                <a
                  href={selectedSubmission.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>वीडियो देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Full text */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">पूरा विवरण (Report Description):</span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedSubmission.description}
              </p>
            </div>

            {/* Reporter details */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-kd-meta">
              <div className="font-bold text-slate-700">प्रेषक जानकारी (Sender Info):</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>नाम: <span className="font-semibold text-slate-900">{selectedSubmission.senderName}</span></div>
                <div>फोन: <span className="font-mono text-slate-900">{selectedSubmission.senderPhone || 'एन/ए'}</span></div>
                <div>ईमेल: <span className="text-slate-900">{selectedSubmission.senderEmail || 'एन/ए'}</span></div>
                <div>स्थान: <span className="text-slate-900">{selectedSubmission.location}</span></div>
              </div>
            </div>

            {/* Status change toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-150">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-500 font-semibold">स्थिति बदलें:</span>
                {(['pending', 'verified', 'published', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(selectedSubmission.id, st);
                      setSelectedSubmission({ ...selectedSubmission, status: st });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                      selectedSubmission.status === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onConvertToArticle(selectedSubmission);
                  setSelectedSubmission(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>इस खबर को आर्टिकल बनाकर पब्लिश करें →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
