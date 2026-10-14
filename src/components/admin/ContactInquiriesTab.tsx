import React, { useState, useMemo } from 'react';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  Flame,
  DollarSign,
  FileText,
  User,
  Phone,
  Send,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ContactInquiry } from '../../types/news';

interface ContactInquiriesTabProps {
  inquiries: ContactInquiry[];
  onUpdateInquiryStatus: (id: string, status: ContactInquiry['status'], adminNotes?: string) => void;
  onDeleteInquiry: (id: string) => void;
}

export const ContactInquiriesTab: React.FC<ContactInquiriesTabProps> = ({
  inquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (deptFilter !== 'all' && inq.department !== deptFilter) return false;
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inq.name.toLowerCase().includes(q) ||
          inq.email.toLowerCase().includes(q) ||
          inq.subject.toLowerCase().includes(q) ||
          inq.message.toLowerCase().includes(q) ||
          (inq.phone && inq.phone.includes(q))
        );
      }
      return true;
    });
  }, [inquiries, deptFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      newCount: inquiries.filter((i) => i.status === 'new').length,
      inReviewCount: inquiries.filter((i) => i.status === 'in_review').length,
      repliedCount: inquiries.filter((i) => i.status === 'replied').length,
      grievanceCount: inquiries.filter((i) => i.department === 'grievance').length,
      advertisingCount: inquiries.filter((i) => i.department === 'advertising').length,
      newsTipCount: inquiries.filter((i) => i.department === 'news_tip').length,
    };
  }, [inquiries]);

  const activeInquiry = useMemo(() => {
    return inquiries.find((i) => i.id === activeInquiryId) || filteredInquiries[0] || null;
  }, [inquiries, activeInquiryId, filteredInquiries]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Department', 'Status', 'Subject', 'Message', 'Notes'];
    const rows = filteredInquiries.map((i) => [
      i.id,
      new Date(i.submittedAt).toLocaleString('en-IN'),
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      i.phone || '',
      i.department,
      i.status,
      `"${i.subject.replace(/"/g, '""')}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.adminNotes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `khabri_dost_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeptBadge = (dept: ContactInquiry['department']) => {
    switch (dept) {
      case 'news_tip':
        return (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Flame className="w-3 h-3" /> News Tip
          </span>
        );
      case 'grievance':
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> IT Rules Grievance
          </span>
        );
      case 'advertising':
        return (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Advertising / Sponsor
          </span>
        );
      case 'press_release':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <FileText className="w-3 h-3" /> Press Release
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            General
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-kd-body">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-kd-headline">
            <Mail className="w-6 h-6 text-red-600" />
            <span>Contact Desk & Inquiries (ईमेल व संपर्क संदेश)</span>
          </h2>
          <p className="text-xs text-slate-500 font-kd-meta">
            संपर्क पृष्ठ (Contact Page) से प्राप्त समाचार सुझाव, विज्ञापन प्रस्ताव एवं पाठक संदेशों का प्रबंधन।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer font-kd-meta"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">कुल प्राप्त संदेश</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-kd-meta">ऑल-टाइम आर्काइव</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-2xs">
          <span className="text-xs text-red-600 font-bold">नए अपठित (Unread)</span>
          <span className="text-2xl font-black text-red-600 mt-1 block">{stats.newCount}</span>
          <span className="text-[11px] text-red-500 mt-0.5 block font-kd-meta">ज़रूरी संदेश</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
          <span className="text-xs text-amber-700 font-bold">जांच जारी (In Review)</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.inReviewCount}</span>
          <span className="text-[11px] text-amber-600 mt-0.5 block font-kd-meta">संपादकीय सत्यापन</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <span className="text-xs text-emerald-700 font-bold">निस्तारित (Replied)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.repliedCount}</span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block font-kd-meta">प्रत्युत्तर प्रेषित</span>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="नाम, ईमेल अथवा विषय खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          />
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-kd-meta">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">सभी विभाग (All Departments)</option>
            <option value="news_tip">समाचार सुझाव (News Tips)</option>
            <option value="grievance">शिकायत निवारण (IT Grievance)</option>
            <option value="advertising">विज्ञापन प्रस्ताव (Advertising)</option>
            <option value="press_release">प्रेस विज्ञप्ति (Press Release)</option>
            <option value="general">सामान्य पूछताछ (General)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">सभी स्थितियां (All Status)</option>
            <option value="new">नया (New)</option>
            <option value="in_review">जांच जारी (In Review)</option>
            <option value="replied">उत्तर दिया (Replied)</option>
            <option value="archived">पुरालेख (Archived)</option>
          </select>
        </div>
      </div>

      {/* 4. MASTER-DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Messages (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden max-h-[650px] flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between font-kd-meta">
            <span>संदेश सूची ({filteredInquiries.length})</span>
            <span className="text-[10px] text-slate-400">नवीनतम प्रथम</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filteredInquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                कोई संदेश उपलब्ध नहीं है।
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = activeInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setActiveInquiryId(inq.id);
                      setAdminNoteInput(inq.adminNotes || '');
                    }}
                    className={`p-3.5 transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-red-50/80 border-l-4 border-red-600'
                        : inq.status === 'new'
                        ? 'bg-amber-50/30 hover:bg-slate-50 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {inq.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(inq.submittedAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 line-clamp-1 font-medium mb-1.5">
                      {inq.subject}
                    </p>

                    <div className="flex items-center justify-between gap-1 font-kd-meta">
                      {getDeptBadge(inq.department)}
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          inq.status === 'new'
                            ? 'bg-red-600 text-white'
                            : inq.status === 'in_review'
                            ? 'bg-amber-500 text-white'
                            : inq.status === 'replied'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Reader View & Actions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
          {activeInquiry ? (
            <>
              {/* Message Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {activeInquiry.id} • {new Date(activeInquiry.submittedAt).toLocaleString('en-IN')}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-kd-headline">
                      {activeInquiry.subject}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('क्या आप इस संदेश को स्थायी रूप से हटाना चाहते हैं?')) {
                        onDeleteInquiry(activeInquiry.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 font-kd-meta">
                  {getDeptBadge(activeInquiry.department)}

                  {/* Status Dropdown */}
                  <select
                    value={activeInquiry.status}
                    onChange={(e) =>
                      onUpdateInquiryStatus(activeInquiry.id, e.target.value as any, activeInquiry.adminNotes)
                    }
                    className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="new">🔴 Status: NEW</option>
                    <option value="in_review">🟡 Status: IN REVIEW</option>
                    <option value="replied">🟢 Status: REPLIED</option>
                    <option value="archived">⚪ Status: ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Sender Details Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-kd-meta">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800">{activeInquiry.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(`Re: [Khabri Dost] ${activeInquiry.subject}`)}`}
                    className="text-red-600 hover:underline font-mono truncate"
                  >
                    {activeInquiry.email}
                  </a>
                </div>
                {activeInquiry.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{activeInquiry.phone}</span>
                  </div>
                )}
                {activeInquiry.sourceUrl && (
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={activeInquiry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {activeInquiry.sourceUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Full Message Body */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-kd-meta">
                  संदेश विवरण (Message Content):
                </span>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-kd-body min-h-[120px]">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Admin Internal Notes & Action */}
              <div className="space-y-2 pt-2 border-t border-slate-200 font-kd-meta">
                <label className="block text-xs font-bold text-slate-700">
                  संपादकीय आंतरिक टिप्पणी (Internal Admin Notes):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="उदा. संवाददाता को जांच सौंपी गई, प्रत्युत्तर भेज दिया..."
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={() => {
                      onUpdateInquiryStatus(activeInquiry.id, activeInquiry.status, adminNoteInput);
                      setNoteSavedFeedback(true);
                      setTimeout(() => setNoteSavedFeedback(false), 2500);
                    }}
                    className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    सहेजें (Save)
                  </button>
                </div>
                {noteSavedFeedback && (
                  <span className="text-[11px] text-emerald-600 font-bold block">✓ टिप्पणी सुरक्षित रूप से सहेज ली गई!</span>
                )}
              </div>

              {/* Direct Action Reply via Email Button */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <a
                  href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(`Re: [Khabri Dost] ${activeInquiry.subject}`)}&body=${encodeURIComponent(`नमस्ते ${activeInquiry.name} जी,\n\nखबरी दोस्त डिजिटल न्यूज़ नेटवर्क से संपर्क करने के लिए धन्यवाद। आपके संदर्भ (ID: ${activeInquiry.id}) के संबंध में:\n\n`)}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ईमेल द्वारा सीधा उत्तर दें (Reply via Email)</span>
                </a>

                <button
                  onClick={() =>
                    onUpdateInquiryStatus(activeInquiry.id, 'replied', adminNoteInput)
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Resolved</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              कृपया बाएं कॉलम से कोई संदेश चुनें।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
