import React, { useState } from 'react';
import {
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';
import { MediaAsset } from '../types/news';
import { compressImage, CompressionResult } from '../utils/imageCompressor';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaAsset[];
  onAddMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  onDeleteMedia: (id: string) => void;
  onSelectMedia?: (media: MediaAsset) => void;
  isPickerMode?: boolean;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  onAddMedia,
  onDeleteMedia,
  onSelectMedia,
  isPickerMode = false,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('national');
  const [newType, setNewType] = useState<'image' | 'banner' | 'infographic'>('image');

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.caption && m.caption.toLowerCase().includes(search.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressStats, setCompressStats] = useState<CompressionResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    setIsCompressing(true);
    try {
      const res = await compressImage(file, {
        maxWidth: 1600,
        quality: 0.78,
        format: 'image/webp',
      });
      setCompressStats(res);
      setNewUrl(res.dataUrl);
    } catch (err) {
      console.warn('Auto compression fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveNewAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) {
      alert('कृपया शीर्षक और इमेज URL भरें।');
      return;
    }

    onAddMedia({
      title: newTitle.trim(),
      url: newUrl.trim(),
      altText: newAltText.trim() || newTitle.trim(),
      caption: newCaption.trim(),
      category: newCategory,
      type: newType,
      fileSize: compressStats ? `${compressStats.compressedSizeFormatted} WebP` : '240 KB WebP',
      dimensions: compressStats ? `${compressStats.compressedWidth}x${compressStats.compressedHeight}` : '1600x900',
      uploadedBy: 'मुख्य संपादक',
    });

    // Reset
    setNewTitle('');
    setNewUrl('');
    setNewAltText('');
    setNewCaption('');
    setCompressStats(null);
    setShowUploadModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Media Library & Assets Manager</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {mediaList.length} Assets
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage high-resolution news photos, ad banners, and infographics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:px-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assets by title, caption, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['all', 'national', 'politics', 'sports', 'business', 'tech', 'advertising'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer capitalize ${
                    categoryFilter === cat
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredMedia.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No media assets found</p>
              <p className="text-xs">Upload new image or clear your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-[10px] font-mono text-slate-300 px-1.5 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <h4 className="text-xs font-bold text-white line-clamp-1" title={item.title}>
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.caption}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>{item.category || 'General'}</span>
                      <span>{item.dimensions || '1920x1080'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1.5 pt-2">
                      {isPickerMode && onSelectMedia ? (
                        <button
                          onClick={() => onSelectMedia(item)}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-1.5 rounded-lg transition"
                        >
                          Use This Image
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopyLink(item.url, item.id)}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium py-1.5 px-2 rounded-lg border border-slate-800 flex items-center justify-center space-x-1 transition"
                            title="Copy Image URL"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy URL</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete media asset "${item.title}"?`)) {
                                onDeleteMedia(item.id);
                              }
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg border border-slate-800 transition"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPLOAD MODAL OVERLAY */}
        {showUploadModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-red-500" />
                  <span>Upload or Add Media Asset</span>
                </h4>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNewAsset} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Image File / Local Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                  />
                </div>

                <div className="text-center text-[10px] text-slate-500 font-mono">— OR ENTER IMAGE URL —</div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Asset Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cricket Stadium Trophy Win"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Caption in Hindi (इमेज कैप्शन)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. फ़ोटो: पीटीआई संवाददाता"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                {/* Image SEO Alt Text */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Image SEO & Alt Text (गूगल इमेज एसईओ)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Accessibility</span>
                  </div>
                  <input
                    type="text"
                    placeholder="ऑल्ट टेक्स्ट (Google Images इंडेक्सिंग व स्क्रीन रीडर हेतु)"
                    value={newAltText}
                    onChange={(e) => setNewAltText(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-750 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option value="national">National</option>
                      <option value="politics">Politics</option>
                      <option value="sports">Sports</option>
                      <option value="business">Business</option>
                      <option value="tech">Technology</option>
                      <option value="state">States</option>
                      <option value="advertising">Ad Banner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option value="image">News Image</option>
                      <option value="banner">Ad Banner</option>
                      <option value="infographic">Infographic</option>
                    </select>
                  </div>
                </div>

                {newUrl && (
                  <div className="h-24 rounded-lg overflow-hidden border border-slate-800">
                    <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition"
                  >
                    Save to Media Library
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
