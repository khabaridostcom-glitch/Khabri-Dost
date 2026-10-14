import React, { useState } from 'react';
import {
  Radio,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Eye,
  Flame,
  Sparkles,
  ExternalLink,
  Tag,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { LiveBlogEvent, LiveNewsUpdate, NewsCategory, PortalSettings, HomepageSectionsConfig } from '../../types/news';
import { CATEGORIES } from '../../data/seedNews';

const defaultHomepageSections: HomepageSectionsConfig = {
  heroSlider: true,
  liveVideoBulletin: true,
  liveFeedCoverage: false,
  headerLiveFeedLink: true,
  briefsTicker: true,
  trendingTopics: true,
  webStories: true,
  photoGallery: true,
  categoryBlocks: true,
};

interface LiveNewsManagerTabProps {
  liveBlogs: LiveBlogEvent[];
  onAddLiveBlog: (blog: LiveBlogEvent) => void;
  onUpdateLiveBlog: (blog: LiveBlogEvent) => void;
  onDeleteLiveBlog: (id: string) => void;
  onOpenLiveViewer?: (blog: LiveBlogEvent) => void;
  portalSettings?: PortalSettings;
  onUpdateSettings?: (settings: Partial<PortalSettings>) => void;
}

export const LiveNewsManagerTab: React.FC<LiveNewsManagerTabProps> = ({
  liveBlogs,
  onAddLiveBlog,
  onUpdateLiveBlog,
  onDeleteLiveBlog,
  onOpenLiveViewer,
  portalSettings,
  onUpdateSettings,
}) => {
  const [selectedBlogId, setSelectedBlogId] = useState<string>(liveBlogs[0]?.id || '');
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  // New Blog form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<NewsCategory>('politics');
  const [newCoverImage, setNewCoverImage] = useState(
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80'
  );

  // New Live Update form state (for adding an update by time)
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateTime, setUpdateTime] = useState(() => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  });
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateAuthor, setUpdateAuthor] = useState('Political Desk');
  const [updateTag, setUpdateTag] = useState('Live Update');
  const [updateIsImportant, setUpdateIsImportant] = useState(false);
  const [updateImageUrl, setUpdateImageUrl] = useState('');

  const currentBlog = liveBlogs.find((b) => b.id === selectedBlogId) || liveBlogs[0];

  // Create new Live Blog
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBlog: LiveBlogEvent = {
      id: `live-${Date.now()}`,
      title: newTitle.trim(),
      summary: newSummary.trim() || 'Real-time coverage and breaking updates from the news desk.',
      category: newCategory,
      isLive: true,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      coverImage: newCoverImage.trim() || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
      keyHighlights: ['Live coverage initiated.'],
      updates: [
        {
          id: `up-${Date.now()}`,
          timestamp: updateTime,
          title: 'Live Coverage Started: Stay tuned for breaking updates',
          content: 'Our reporting team is tracking on-ground developments in real time.',
          authorName: updateAuthor,
          tag: 'Initiation',
          isImportant: true,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    onAddLiveBlog(newBlog);
    setSelectedBlogId(newBlog.id);
    setIsCreatingBlog(false);
    setNewTitle('');
    setNewSummary('');
  };

  // Add a chronological update to the selected blog
  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBlog || !updateTitle.trim() || !updateContent.trim()) return;

    const newUpdate: LiveNewsUpdate = {
      id: `up-${Date.now()}`,
      timestamp: updateTime.trim() || 'Just Now',
      title: updateTitle.trim(),
      content: updateContent.trim(),
      authorName: updateAuthor.trim(),
      tag: updateTag.trim() || 'Live Update',
      isImportant: updateIsImportant,
      imageUrl: updateImageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedBlog: LiveBlogEvent = {
      ...currentBlog,
      lastUpdatedAt: new Date().toISOString(),
      updates: [newUpdate, ...currentBlog.updates],
    };

    onUpdateLiveBlog(updatedBlog);
    setIsAddingUpdate(false);
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateImageUrl('');
    setUpdateIsImportant(false);
  };

  // Toggle Live status (ON AIR vs ENDED)
  const handleToggleLiveStatus = () => {
    if (!currentBlog) return;
    const updated = {
      ...currentBlog,
      isLive: !currentBlog.isLive,
      lastUpdatedAt: new Date().toISOString(),
    };
    onUpdateLiveBlog(updated);
  };

  // Delete an individual update
  const handleDeleteUpdate = (updateId: string) => {
    if (!currentBlog) return;
    if (!window.confirm('Are you sure you want to delete this live update?')) return;
    const updated = {
      ...currentBlog,
      updates: currentBlog.updates.filter((u) => u.id !== updateId),
      lastUpdatedAt: new Date().toISOString(),
    };
    onUpdateLiveBlog(updated);
  };

  const isMenuLiveFeedEnabled = portalSettings?.homepageSections?.headerLiveFeedLink !== false;
  const isHomepageFeedEnabled = portalSettings?.homepageSections?.liveFeedCoverage === true;

  return (
    <div className="space-y-6">
      {/* Header section with high visibility */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-red-100 text-red-600 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Live News & Real-Time Coverage Manager
            </h2>
            <span className="bg-red-600 text-white text-[11px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE DESK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage real-time coverage events, timeline updates, and toggle Live Coverage in the main navigation menu.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreatingBlog(!isCreatingBlog)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Live Blog</span>
          </button>
        </div>
      </div>

      {/* Menu & Display Controls Banner */}
      {portalSettings && onUpdateSettings && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-600" />
              <span>Navigation Menu & Display Settings</span>
            </h4>
            <p className="text-xs text-slate-500">
              Control how readers access Live Feed. When enabled, clicking opens a dedicated full-page timeline view (no intrusive popup).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Header Menu Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="checkbox"
                checked={isMenuLiveFeedEnabled}
                onChange={(e) =>
                  onUpdateSettings({
                    homepageSections: {
                      ...defaultHomepageSections,
                      ...(portalSettings.homepageSections || {}),
                      headerLiveFeedLink: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Menu Item: {isMenuLiveFeedEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>

            {/* Homepage Feed Card Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="checkbox"
                checked={isHomepageFeedEnabled}
                onChange={(e) =>
                  onUpdateSettings({
                    homepageSections: {
                      ...defaultHomepageSections,
                      ...(portalSettings.homepageSections || {}),
                      liveFeedCoverage: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Homepage Banner: {isHomepageFeedEnabled ? 'Enabled' : 'Hidden'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* New Live Blog Creation Form */}
      {isCreatingBlog && (
        <form
          onSubmit={handleCreateBlog}
          className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Start New Live Blog Event</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingBlog(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Live Blog Title *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Union Budget & Parliament Session: Live Coverage & Real-time Analysis"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as NewsCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none capitalize"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.labelEnglish}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Live Summary / Context
            </label>
            <input
              type="text"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Minute-by-minute updates, political developments, and key statements..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={newCoverImage}
              onChange={(e) => setNewCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingBlog(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              🔴 Publish & Start Live Blog
            </button>
          </div>
        </form>
      )}

      {/* Main 2-Column: Left Blog Selector & Status, Right Chronological Updates Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Blogs List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Live Blogs ({liveBlogs.length})
            </h3>

            <div className="space-y-2">
              {liveBlogs.map((blog) => {
                const isSelected = blog.id === currentBlog?.id;
                return (
                  <div
                    key={blog.id}
                    onClick={() => setSelectedBlogId(blog.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-red-600 bg-red-50/70 ring-2 ring-red-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          blog.isLive
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {blog.isLive ? '🔴 LIVE' : 'CONCLUDED'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {blog.updates.length} updates
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {blog.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      {blog.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Blog Meta & Actions */}
          {currentBlog && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">Status</span>
                <button
                  onClick={handleToggleLiveStatus}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    currentBlog.isLive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentBlog.isLive ? 'bg-red-600 animate-ping' : 'bg-slate-500'
                    }`}
                  ></span>
                  <span>{currentBlog.isLive ? 'LIVE ON AIR' : 'CONCLUDED'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <p>
                  <strong className="text-slate-800">Started:</strong>{' '}
                  {new Date(currentBlog.startedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p>
                  <strong className="text-slate-800">Last Update:</strong>{' '}
                  {new Date(currentBlog.lastUpdatedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {onOpenLiveViewer && (
                <button
                  onClick={() => onOpenLiveViewer(currentBlog)}
                  className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reader Page Preview</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this entire live blog?')) {
                    onDeleteLiveBlog(currentBlog.id);
                  }
                }}
                className="w-full py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Delete Live Blog
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Add Update & Chronological Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {currentBlog ? (
            <>
              {/* Blog Title Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                        currentBlog.isLive
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {currentBlog.isLive ? '🔴 LIVE STREAM' : 'ARCHIVED'}
                    </span>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.id === currentBlog.category)?.labelEnglish || currentBlog.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const d = new Date();
                      let hours = d.getHours();
                      const minutes = d.getMinutes().toString().padStart(2, '0');
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12 || 12;
                      setUpdateTime(`${hours}:${minutes} ${ampm}`);
                      setIsAddingUpdate(true);
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Live Update</span>
                  </button>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentBlog.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">{currentBlog.summary}</p>
              </div>

              {/* Form to Post New Live Update */}
              {isAddingUpdate && (
                <form
                  onSubmit={handleAddUpdate}
                  className="bg-white p-5 rounded-2xl border-2 border-red-300 shadow-md space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>Post Time-Stamped Update</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingUpdate(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Timestamp *
                      </label>
                      <input
                        type="text"
                        value={updateTime}
                        onChange={(e) => setUpdateTime(e.target.value)}
                        placeholder="e.g. 11:15 AM or 11:30 AM"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-red-600 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Tag Badge
                      </label>
                      <input
                        type="text"
                        value={updateTag}
                        onChange={(e) => setUpdateTag(e.target.value)}
                        placeholder="e.g. Breaking, Statement, Update"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Author / Correspondent
                      </label>
                      <input
                        type="text"
                        value={updateAuthor}
                        onChange={(e) => setUpdateAuthor(e.target.value)}
                        placeholder="e.g. Special Correspondent"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Headline *
                    </label>
                    <input
                      type="text"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      placeholder="e.g. Major announcement delivered during special press briefing..."
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Detailed Content *
                    </label>
                    <textarea
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      placeholder="Write the full report, statement, or ground update here..."
                      rows={3}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={updateIsImportant}
                        onChange={(e) => setUpdateIsImportant(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>Highlight as Critical Update</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingUpdate(false)}
                        className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Publish Live Update
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Timeline of Live Updates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold uppercase">
                  <span>Timeline Updates ({currentBlog.updates.length})</span>
                  <span>Newest on Top</span>
                </div>

                {currentBlog.updates.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">No live updates yet. Click "+ Add Live Update" to post real-time coverage.</p>
                  </div>
                ) : (
                  currentBlog.updates.map((up) => (
                    <div
                      key={up.id}
                      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs transition hover:shadow-xs relative pl-12 sm:pl-16 ${
                        up.isImportant
                          ? 'border-red-300 ring-1 ring-red-400/20 bg-red-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Left Timeline Badge */}
                      <div className="absolute left-3 sm:left-4 top-4 flex flex-col items-center">
                        <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-xs">
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                        <div className="w-0.5 h-full bg-red-200 mt-2"></div>
                      </div>

                      {/* Header row: Time & Tag */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs sm:text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            {up.timestamp}
                          </span>
                          {up.tag && (
                            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {up.tag}
                            </span>
                          )}
                          {up.isImportant && (
                            <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-0.5">
                              <Flame className="w-3 h-3" />
                              <span>Important</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteUpdate(up.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Delete update"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {up.title}
                      </h4>

                      {/* Body Content */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1.5 whitespace-pre-line">
                        {up.content}
                      </p>

                      {/* Author */}
                      {up.authorName && (
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Reporter: {up.authorName}</span>
                          <span>{new Date(up.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <Radio className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">No live blog selected</p>
              <p className="text-xs text-slate-400 mt-1">Select a live blog from the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
