import React, { useState, useRef } from 'react';
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
  Eye,
  Sparkles,
  FileText,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { MediaAsset } from '../types/news';
import { compressImage, CompressionResult } from '../utils/imageCompressor';

export interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaAsset[];
  onAddMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  onUpdateMedia?: (media: Partial<MediaAsset> & { id: string }) => void;
  onDeleteMedia?: (id: string) => void;
  onSelectMedia?: (
    media: MediaAsset,
    articleMetadata?: { caption?: string; credit?: string; altText?: string }
  ) => void;
  isPickerMode?: boolean;
  pickerTitle?: string;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  mediaList = [],
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onSelectMedia,
  isPickerMode = false,
  pickerTitle = 'Select Media Asset',
}) => {
  // Navigation Tabs: Media Library | Upload Files
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  // Library State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(() => {
    return mediaList.length > 0 ? mediaList[0] : null;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Metadata Panel State (for selected asset)
  const [editTitle, setEditTitle] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCredit, setEditCredit] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editCategory, setEditCategory] = useState('national');
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  // Upload Tab State (supports multiple / bulk files)
  const [uploadFiles, setUploadFiles] = useState<
    {
      file: File;
      preview: string;
      title: string;
      altText: string;
      caption: string;
      credit: string;
      description: string;
      category: string;
      dimensions: string;
      fileSize: string;
      status: 'pending' | 'compressing' | 'ready' | 'error';
    }[]
  >([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Sync edit form whenever selectedAsset changes
  const handleSelectForInspection = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditTitle(asset.title || '');
    setEditAltText(asset.altText || '');
    setEditCaption(asset.caption || '');
    setEditDescription((asset as any).description || '');
    setEditCredit((asset as any).credit || '');
    setEditKeywords(asset.focusKeywords || '');
    setEditCategory(asset.category || 'national');
    setIsSavedMessage(false);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMetadata = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedAsset) return;

    const updatedData: Partial<MediaAsset> & { id: string } = {
      id: selectedAsset.id,
      title: editTitle.trim() || selectedAsset.title,
      altText: editAltText.trim(),
      caption: editCaption.trim(),
      category: editCategory,
      focusKeywords: editKeywords.trim(),
      ...({
        description: editDescription.trim(),
        credit: editCredit.trim(),
      } as any),
    };

    if (onUpdateMedia) {
      onUpdateMedia(updatedData);
    }

    // Update local selectedAsset view
    setSelectedAsset((prev) => (prev ? { ...prev, ...updatedData } : null));
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  const handlePickAsset = () => {
    if (!selectedAsset || !onSelectMedia) return;
    onSelectMedia(selectedAsset, {
      caption: editCaption || selectedAsset.caption,
      credit: editCredit || (selectedAsset as any).credit,
      altText: editAltText || selectedAsset.altText || selectedAsset.title,
    });
    onClose();
  };

  // Bulk File Selection Handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingBulk(true);
    const newItems: typeof uploadFiles = [];

    for (const file of files) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1600,
          quality: 0.8,
          format: 'image/webp',
        });
        newItems.push({
          file,
          preview: compressed.dataUrl,
          title: cleanName,
          altText: cleanName,
          caption: `${cleanName} — Khabri Dost Editorial`,
          credit: 'Khabri Dost Newsroom',
          description: `Photograph taken for ${cleanName} news coverage.`,
          category: 'national',
          dimensions: `${compressed.compressedWidth}x${compressed.compressedHeight}`,
          fileSize: `${compressed.compressedSizeFormatted} WebP`,
          status: 'ready',
        });
      } catch {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (ev) => {
            newItems.push({
              file,
              preview: ev.target?.result as string,
              title: cleanName,
              altText: cleanName,
              caption: cleanName,
              credit: 'Editorial Team',
              description: '',
              category: 'national',
              dimensions: '1600x900',
              fileSize: `${Math.round(file.size / 1024)} KB`,
              status: 'ready',
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    setUploadFiles((prev) => [...prev, ...newItems]);
    setIsUploadingBulk(false);
  };

  // Save all processed upload files to the media library
  const handleSaveAllUploadedFiles = () => {
    if (uploadFiles.length === 0) return;

    uploadFiles.forEach((item) => {
      onAddMedia({
        title: item.title,
        url: item.preview,
        altText: item.altText,
        caption: item.caption,
        category: item.category,
        type: 'image',
        fileSize: item.fileSize,
        dimensions: item.dimensions,
        focusKeywords: item.altText,
        uploadedBy: 'Editorial Admin',
        ...({
          credit: item.credit,
          description: item.description,
        } as any),
      });
    });

    setUploadFiles([]);
    setActiveTab('library');
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.caption && m.caption.toLowerCase().includes(search.toLowerCase())) ||
      (m.altText && m.altText.toLowerCase().includes(search.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{isPickerMode ? pickerTitle : 'Media Library & Asset Manager'}</span>
                <span className="text-[11px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {mediaList.length} Assets
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Light-mode editorial media library with image SEO metadata and bulk upload
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Buttons */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'library'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Files</span>
                {uploadFiles.length > 0 && (
                  <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {uploadFiles.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: MEDIA LIBRARY */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-white">
            {/* Left Column: Search & Gallery Grid */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 overflow-hidden">
              {/* Search & Category Filter Toolbar */}
              <div className="p-3 sm:px-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, caption, alt text..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
                  />
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  {['all', 'national', 'politics', 'sports', 'business', 'tech', 'entertainment'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
                          categoryFilter === cat
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Grid of Images */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {filteredMedia.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No media assets found</p>
                    <p className="text-xs">Upload new photos in the 'Upload Files' tab.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredMedia.map((item) => {
                      const isSelected = selectedAsset?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectForInspection(item)}
                          className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition flex flex-col aspect-square bg-slate-100 shadow-2xs ${
                            isSelected
                              ? 'border-red-600 ring-2 ring-red-500/20 shadow-md'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={item.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                            alt={item.altText || item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 pt-4 text-white">
                            <p className="text-[10px] font-bold truncate">{item.title}</p>
                            {item.dimensions && (
                              <p className="text-[9px] text-slate-300 font-mono truncate">
                                {item.dimensions}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Complete Image SEO & Metadata Inspector */}
            <div className="w-full md:w-80 lg:w-96 bg-slate-50 flex flex-col shrink-0 overflow-y-auto p-4 sm:p-5 space-y-4">
              {selectedAsset ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Attachment Details & SEO</span>
                    </h4>
                    {isPickerMode && onSelectMedia && (
                      <button
                        type="button"
                        onClick={handlePickAsset}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-200 shadow-2xs">
                    <img
                      src={selectedAsset.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                      alt={selectedAsset.altText || selectedAsset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File specs */}
                  <div className="text-[11px] text-slate-500 space-y-0.5 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <strong className="text-slate-700">{selectedAsset.dimensions || '1600x900'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File size:</span>
                      <strong className="text-slate-700">{selectedAsset.fileSize || '240 KB WebP'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <strong className="text-slate-700 capitalize">{selectedAsset.category || 'National'}</strong>
                    </div>
                  </div>

                  {/* Metadata Editing Form */}
                  <form onSubmit={handleSaveMetadata} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Title (फ़ाइल का शीर्षक):
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">
                          Alt Text (SEO इमेज विवरण) *:
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold">Google Image SEO</span>
                      </div>
                      <input
                        type="text"
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        placeholder="वर्णनात्मक टेक्स्ट जो स्क्रीन रीडर व सर्च इंजन पढ़ते हैं"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Caption (आर्टिकल में फ़ोटो के नीचे दिखने वाला कैप्शन):
                      </label>
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="e.g. नई दिल्ली में आयोजित उच्चस्तरीय बैठक की तस्वीर"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Photo Credit / Source (फ़ोटो साभार):
                      </label>
                      <input
                        type="text"
                        value={editCredit}
                        onChange={(e) => setEditCredit(e.target.value)}
                        placeholder="e.g. PTI / ANI / विशेष व्यवस्था"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Description (आंतरिक विवरण / नोट्स):
                      </label>
                      <textarea
                        rows={2}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="मीडिया लाइब्रेरी में खोज हेतु अतिरिक्त विवरण..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Keywords / Tags:
                      </label>
                      <input
                        type="text"
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        placeholder="ताज़ा ख़बर, राजनीति, राष्ट्रीय"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-1 flex items-center justify-between gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition cursor-pointer shadow-2xs"
                      >
                        Save Metadata
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(selectedAsset.url, selectedAsset.id)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                        title="Copy direct image URL"
                      >
                        {copiedId === selectedAsset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>URL</span>
                      </button>
                      {onDeleteMedia && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('क्या आप इस मीडिया एसेट को हटाना चाहते हैं?')) {
                              onDeleteMedia(selectedAsset.id);
                              setSelectedAsset(null);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition cursor-pointer"
                          title="Delete from Media Library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isSavedMessage && (
                      <p className="text-[11px] text-emerald-600 font-bold text-center bg-emerald-50 py-1 rounded border border-emerald-200">
                        ✓ Metadata saved successfully!
                      </p>
                    )}
                  </form>
                </>
              ) : (
                <div className="py-20 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-medium">Click any image to inspect or edit SEO metadata</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD FILES (Single & Bulk Support) */}
        {activeTab === 'upload' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
            {/* Drag & Drop Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-red-300 hover:border-red-500 bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 cursor-pointer transition shadow-2xs group"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 group-hover:bg-red-100 text-red-600 flex items-center justify-center mx-auto transition">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Click to select photos or drag & drop files here
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supports multiple files (Bulk upload) • JPG, PNG, WebP • Auto-compressed for 100% Core Web Vitals
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="hidden"
              />
              <button
                type="button"
                className="bg-red-600 group-hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
              >
                Browse Files
              </button>
            </div>

            {/* List of Selected Files to Upload & Inspect */}
            {uploadFiles.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span>Uploaded Items ({uploadFiles.length})</span>
                    <span className="text-xs font-normal text-slate-500">
                      Edit metadata for each asset before saving to library
                    </span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setUploadFiles([])}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAllUploadedFiles}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save All to Library</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {uploadFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-start"
                    >
                      <img
                        src={item.preview || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-24 h-20 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100"
                      />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Title:
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...uploadFiles];
                              updated[idx].title = e.target.value;
                              setUploadFiles(updated);
                            }}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Alt Text (SEO):
                          </label>
                          <input
                            type="text"
                            value={item.altText}
                            onChange={(e) => {
                              const updated = [...uploadFiles];
                              updated[idx].altText = e.target.value;
                              setUploadFiles(updated);
                            }}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Caption:
                          </label>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => {
                              const updated = [...uploadFiles];
                              updated[idx].caption = e.target.value;
                              setUploadFiles(updated);
                            }}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUploadFiles(uploadFiles.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Remove from upload queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer (Sticky in picker mode) */}
        {isPickerMode && selectedAsset && (
          <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-xs text-slate-600 truncate">
              <span className="font-bold text-slate-800">Selected:</span>
              <span className="truncate max-w-xs">{selectedAsset.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePickAsset}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-1.5 rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <span>Use Selected Media</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
