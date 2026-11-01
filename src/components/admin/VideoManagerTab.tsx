import React, { useState } from 'react';
import {
  Tv,
  Play,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ExternalLink,
  Radio,
  Clock,
  Tag,
  Check,
  Save,
  Image as ImageIcon,
  Upload,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { VideoNewsItem, PortalSettings } from '../../types/news';
import { INITIAL_VIDEOS } from '../../data/portalDefaults';
import { compressImage } from '../../utils/imageCompressor';

interface VideoManagerTabProps {
  settings: PortalSettings;
  onUpdateSettings: (newSettings: PortalSettings) => void;
}

export const VideoManagerTab: React.FC<VideoManagerTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const currentVideos = settings.videoMediaList && settings.videoMediaList.length > 0
    ? settings.videoMediaList
    : INITIAL_VIDEOS;

  const [videos, setVideos] = useState<VideoNewsItem[]>(currentVideos);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewVideo, setPreviewVideo] = useState<VideoNewsItem | null>(null);
  const [isEditing, setIsEditing] = useState<VideoNewsItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formYoutubeIdOrUrl, setFormYoutubeIdOrUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formThumbnailAltText, setFormThumbnailAltText] = useState('');
  const [formDuration, setFormDuration] = useState('04:00');
  const [formCategory, setFormCategory] = useState('राष्ट्रीय');
  const [formDescription, setFormDescription] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formCredit, setFormCredit] = useState('खबरी दोस्त न्यूज़ डेस्क');
  const [formIsLive, setFormIsLive] = useState(false);

  // Extract clean YouTube ID from full URL or return ID
  const extractYoutubeId = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1].split('?')[0];
    }
    if (trimmed.includes('youtube.com/watch')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match) return match[1];
    }
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed.split('youtube.com/embed/')[1].split('?')[0];
    }
    return trimmed;
  };

  const handleOpenAdd = () => {
    setFormTitle('');
    setFormYoutubeIdOrUrl('');
    setFormThumbnailUrl('');
    setFormThumbnailAltText('');
    setFormDuration('03:30');
    setFormCategory('राष्ट्रीय');
    setFormDescription('');
    setFormCaption('');
    setFormCredit('खबरी दोस्त डिजिटल टीम');
    setFormIsLive(false);
    setIsAddingNew(true);
    setIsEditing(null);
  };

  const handleOpenEdit = (v: VideoNewsItem) => {
    setIsEditing(v);
    setIsAddingNew(false);
    setFormTitle(v.title || '');
    setFormYoutubeIdOrUrl(v.youtubeId || v.videoUrl || '');
    setFormThumbnailUrl(v.thumbnailUrl || '');
    setFormThumbnailAltText(v.thumbnailAltText || '');
    setFormDuration(v.duration || '03:30');
    setFormCategory(v.category || 'राष्ट्रीय');
    setFormDescription(v.description || '');
    setFormCaption(v.caption || '');
    setFormCredit(v.credit || 'खबरी दोस्त डिजिटल टीम');
    setFormIsLive(!!v.isLive);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, {
        maxWidth: 1280,
        quality: 0.8,
        format: 'image/webp',
      });
      setFormThumbnailUrl(compressed.dataUrl);
      if (!formThumbnailAltText) {
        setFormThumbnailAltText(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormThumbnailUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFetchYoutubeThumbnail = () => {
    const id = extractYoutubeId(formYoutubeIdOrUrl);
    if (id) {
      setFormThumbnailUrl(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
      if (!formThumbnailAltText) {
        setFormThumbnailAltText(formTitle || 'वीडियो थंबनेल');
      }
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalYoutubeId = extractYoutubeId(formYoutubeIdOrUrl);
    const finalThumb = formThumbnailUrl.trim() || (finalYoutubeId ? `https://img.youtube.com/vi/${finalYoutubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80');

    let updatedList: VideoNewsItem[];

    if (isEditing) {
      updatedList = videos.map((item) =>
        item.id === isEditing.id
          ? {
              ...item,
              title: formTitle.trim(),
              youtubeId: finalYoutubeId,
              thumbnailUrl: finalThumb,
              thumbnailAltText: formThumbnailAltText.trim() || formTitle.trim(),
              duration: formDuration.trim() || '03:00',
              category: formCategory,
              description: formDescription.trim(),
              caption: formCaption.trim(),
              credit: formCredit.trim(),
              isLive: formIsLive,
            }
          : item
      );
    } else {
      const newItem: VideoNewsItem = {
        id: `vid-${Date.now()}`,
        title: formTitle.trim(),
        youtubeId: finalYoutubeId,
        thumbnailUrl: finalThumb,
        thumbnailAltText: formThumbnailAltText.trim() || formTitle.trim(),
        duration: formDuration.trim() || '03:00',
        category: formCategory,
        description: formDescription.trim(),
        caption: formCaption.trim(),
        credit: formCredit.trim(),
        isLive: formIsLive,
      };
      updatedList = [newItem, ...videos];
    }

    setVideos(updatedList);
    onUpdateSettings({
      ...settings,
      videoMediaList: updatedList,
      liveVideoTitle: formIsLive ? formTitle.trim() : settings.liveVideoTitle,
      liveVideoYoutubeId: formIsLive && finalYoutubeId ? finalYoutubeId : settings.liveVideoYoutubeId,
    });

    setIsAddingNew(false);
    setIsEditing(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप वाकई इस वीडियो को लाइब्रेरी से हटाना चाहते हैं?')) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      onUpdateSettings({
        ...settings,
        videoMediaList: updated,
      });
      if (previewVideo?.id === id) setPreviewVideo(null);
    }
  };

  const handleSetFeaturedLive = (v: VideoNewsItem) => {
    const updated = videos.map((item) => ({
      ...item,
      isLive: item.id === v.id,
    }));
    setVideos(updated);
    onUpdateSettings({
      ...settings,
      videoMediaList: updated,
      liveVideoTitle: v.title,
      liveVideoYoutubeId: v.youtubeId,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefaults = () => {
    if (confirm('क्या आप डिफ़ॉल्ट वीडियो लिस्ट पुनर्स्थापित करना चाहते हैं?')) {
      setVideos(INITIAL_VIDEOS);
      onUpdateSettings({
        ...settings,
        videoMediaList: INITIAL_VIDEOS,
      });
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(search.toLowerCase())) ||
      (v.category && v.category.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-kd-body">
      {/* 1. Top Header Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-kd-headline">
            <Tv className="w-6 h-6 text-red-600" />
            <span>Video Media Management (वीडियो मीडिया प्रबंधन)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-kd-meta mt-0.5">
            वेबसाइट के 'लाइव वीडियो बुलेटिन' और वीडियो लाइब्रेरी को प्रबंधित करें। वीडियो जोड़ें, थंबनेल बदलें, मेटाडेटा एडिट करें और लाइव स्ट्रीम सेट करें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
            title="Reset to default video list"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">डिफ़ॉल्ट रीसेट</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नया वीडियो जोड़ें (Add Video)</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn font-kd-meta">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>वीडियो मीडिया लाइब्रेरी सफलतापूर्वक अपडेट हो गई! वेबसाइट के लाइव बुलेटिन पर तुरंत उपलब्ध है।</span>
        </div>
      )}

      {/* 2. Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 font-kd-meta">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="वीडियो खोजें (शीर्षक, श्रेणी, विवरण)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'राष्ट्रीय', 'राजनीति', 'खेल', 'विज्ञान', 'व्यापार', 'मनोरंजन'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'सभी वीडियो' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden group">
              <img
                src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
                alt={video.thumbnailAltText || video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => setPreviewVideo(video)}
                  className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:scale-110 shadow-lg cursor-pointer"
                  title="वीडियो चलाएं / Preview"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  {video.category}
                </span>
                {video.isLive && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                    <Radio className="w-2.5 h-2.5" />
                    <span>LIVE</span>
                  </span>
                )}
              </div>

              <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                {video.duration || '00:00'}
              </span>
            </div>

            {/* Video Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-kd-headline line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-xs text-slate-500 font-kd-body line-clamp-2 mt-1">
                    {video.description}
                  </p>
                )}
                {video.credit && (
                  <span className="text-[10px] text-slate-400 font-kd-meta block mt-1">
                    स्रोत: {video.credit}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs font-kd-meta">
                <button
                  type="button"
                  onClick={() => handleSetFeaturedLive(video)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    video.isLive
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Make this the featured live bulletin on the homepage"
                >
                  <Radio className="w-3 h-3 text-red-600" />
                  <span>{video.isLive ? 'मुख्य लाइव है' : 'लाइव बनाएं'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(video)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="एडिट करें"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MODAL: ADD / EDIT VIDEO */}
      {(isAddingNew || isEditing) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 my-auto space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-kd-headline">
                <Tv className="w-5 h-5 text-red-600" />
                <span>{isEditing ? 'वीडियो विवरण संपादित करें (Edit Video)' : 'नया वीडियो बुलेटिन जोड़ें (Add Video)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setIsEditing(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-kd-meta">
              {/* Video Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वीडियो शीर्षक (Video Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="उदा. संसद में डिजिटल डेटा बिल पर तीखी बहस..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* YouTube ID / Video URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    YouTube URL या Video ID (e.g. jfKfPfyJRdk या https://youtube.com/watch?v=...) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFetchYoutubeThumbnail}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Auto-fetch YouTube Thumbnail</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formYoutubeIdOrUrl}
                  onChange={(e) => setFormYoutubeIdOrUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=jfKfPfyJRdk"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Thumbnail URL & Upload */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span>वीडियो थंबनेल (Video Thumbnail URL):</span>
                  </label>
                  <label className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer transition shadow-2xs flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>थंबनेल अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={formThumbnailUrl}
                  onChange={(e) => setFormThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://img.youtube.com/vi/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {formThumbnailUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={formThumbnailUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
                      alt="Thumbnail Preview"
                      className="w-24 h-14 object-cover rounded-lg border border-slate-300 shadow-2xs"
                    />
                    <div className="text-[11px] text-slate-500">
                      <span className="font-bold text-emerald-700 block">✓ थंबनेल तैयार है</span>
                      <span>यह छवि वेबसाइट और प्लेलिस्ट में दिखाई देगी</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Alt Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  थंबनेल Alt Text (SEO अनुकूल विवरण):
                </label>
                <input
                  type="text"
                  value={formThumbnailAltText}
                  onChange={(e) => setFormThumbnailAltText(e.target.value)}
                  placeholder="उदा. गगनयान परीक्षण विश्लेषण वीडियो"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category):
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="राष्ट्रीय">राष्ट्रीय (National)</option>
                    <option value="राजनीति">राजनीति (Politics)</option>
                    <option value="खेल">खेल (Sports)</option>
                    <option value="विज्ञान">विज्ञान (Science & Space)</option>
                    <option value="व्यापार">व्यापार (Business)</option>
                    <option value="मनोरंजन">मनोरंजन (Entertainment)</option>
                    <option value="राज्य">राज्य (State News)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अवधि (Duration / Live Tag):
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="04:25 या लाइव 24x7"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Description & Credit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    क्रेडिट / स्रोत (Credit / Source):
                  </label>
                  <input
                    type="text"
                    value={formCredit}
                    onChange={(e) => setFormCredit(e.target.value)}
                    placeholder="उदा. खबरी दोस्त डिजिटल डेस्क / एएनआई"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    कैप्शन / उपशीर्षक (Caption):
                  </label>
                  <input
                    type="text"
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    placeholder="उदा. ग्राउंड जीरो से विशेष रिपोर्ट"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विस्तृत विवरण (Description):
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="वीडियो का संक्षिप्त विवरण..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Is Live Toggle */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">🔴 लाइव बुलेटिन के रूप में सेट करें (Set as LIVE Bulletin)</span>
                  <span className="text-[11px] text-amber-800">होमपेज पर इस वीडियो को लाइव बैज और मुख्य खिलाड़ी के रूप में दिखाएं</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsLive}
                  onChange={(e) => setFormIsLive(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setIsEditing(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'बदलाव सहेजें (Update Video)' : 'वीडियो प्रकाशित करें (Save Video)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: LIVE PREVIEW PLAYER */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden space-y-3 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h4 className="text-sm font-bold text-white font-kd-headline truncate">
                  {previewVideo.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.youtubeId}?autoplay=1&mute=0`}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-kd-meta">
              <span>श्रेणी: <strong className="text-amber-400">{previewVideo.category}</strong></span>
              <span>अवधि: <strong className="text-slate-200">{previewVideo.duration}</strong></span>
              <span>स्रोत: <strong className="text-slate-200">{previewVideo.credit || 'खबरी दोस्त'}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
