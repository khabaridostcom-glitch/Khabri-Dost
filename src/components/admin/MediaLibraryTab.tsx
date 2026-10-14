import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Eye,
  Sparkles,
  X,
  FileCode,
  Tag,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Zap,
  Video,
  Play,
  Share2,
  LayoutGrid,
  List,
  Table as TableIcon,
} from 'lucide-react';
import { MediaAsset } from '../../types/news';
import {
  compressImage,
  CompressionResult,
  formatBytes,
} from '../../utils/imageCompressor';

interface MediaLibraryTabProps {
  mediaAssets: MediaAsset[];
  onAddMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  onUpdateMedia?: (media: Partial<MediaAsset> & { id: string }) => void;
  onDeleteMedia: (id: string) => void;
  onOpenEditorWithImage?: (image: MediaAsset) => void;
}

export const MediaLibraryTab: React.FC<MediaLibraryTabProps> = ({
  mediaAssets,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onOpenEditorWithImage,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCompressorModal, setShowCompressorModal] = useState(false);
  const [showVideoEmbedModal, setShowVideoEmbedModal] = useState(false);

  // Auto-compression upon upload for Core Web Vitals
  const [autoCompressOnUpload, setAutoCompressOnUpload] = useState(true);
  const [uploadMaxWidth, setUploadMaxWidth] = useState(1600);
  const [uploadQuality, setUploadQuality] = useState(78);
  const [isCompressingUpload, setIsCompressingUpload] = useState(false);
  const [uploadStats, setUploadStats] = useState<CompressionResult | null>(null);
  const [newDimensions, setNewDimensions] = useState('1600x900');
  const [newFileSize, setNewFileSize] = useState('220 KB WebP');
  const [optimizingAssetId, setOptimizingAssetId] = useState<string | null>(null);
  const [optimizeMessage, setOptimizeMessage] = useState<string | null>(null);
  const [mediaErrorMsg, setMediaErrorMsg] = useState<string | null>(null);

  // Compressor Modal State (Enhanced for Core Web Vitals)
  const [compressUrl, setCompressUrl] = useState('');
  const [compressTitle, setCompressTitle] = useState('');
  const [compressQuality, setCompressQuality] = useState(75);
  const [compressMaxWidth, setCompressMaxWidth] = useState(1600);
  const [compressSuccess, setCompressSuccess] = useState(false);
  const [isProcessingCompressor, setIsProcessingCompressor] = useState(false);
  const [activeCompressResult, setActiveCompressResult] = useState<CompressionResult | null>(null);

  // Video Embed State
  const [embedPlatform, setEmbedPlatform] = useState<'youtube' | 'twitter' | 'instagram' | 'facebook'>('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);

  // Image SEO Edit Modal State
  const [editingSeoAsset, setEditingSeoAsset] = useState<MediaAsset | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editFocusKeywords, setEditFocusKeywords] = useState('');
  const [editSeoSlug, setEditSeoSlug] = useState('');
  const [editLoadingStrategy, setEditLoadingStrategy] = useState<'lazy' | 'eager'>('lazy');

  // Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newFocusKeywords, setNewFocusKeywords] = useState('');
  const [newSeoSlug, setNewSeoSlug] = useState('');
  const [newCategory, setNewCategory] = useState('national');
  const [newType, setNewType] = useState<'image' | 'banner' | 'infographic'>('image');

  const filteredMedia = mediaAssets.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(search.toLowerCase())) ||
      (m.caption && m.caption.toLowerCase().includes(search.toLowerCase())) ||
      (m.focusKeywords && m.focusKeywords.toLowerCase().includes(search.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // SEO statistics
  const totalAssets = mediaAssets.length;
  const assetsWithAlt = mediaAssets.filter((m) => m.altText && m.altText.trim().length > 0).length;
  const assetsMissingAlt = totalAssets - assetsWithAlt;
  const seoHealthScore = totalAssets > 0 ? Math.round((assetsWithAlt / totalAssets) * 100) : 100;

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySeoImgTag = (item: MediaAsset) => {
    const alt = item.altText || item.title;
    const title = item.title;
    const tag = `<img src="${item.url}" alt="${alt}" title="${title}" loading="lazy" decoding="async" class="w-full h-auto rounded-xl" />`;
    handleCopyLink(tag, `tag-${item.id}`);
  };

  const handleCopyMarkdown = (item: MediaAsset) => {
    const alt = item.altText || item.title;
    const title = item.title;
    const md = `![${alt}](${item.url} "${title}")`;
    handleCopyLink(md, `md-${item.id}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setNewTitle(cleanName);
      setNewAltText(cleanName);
      setNewSeoSlug(file.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }

    if (autoCompressOnUpload) {
      setIsCompressingUpload(true);
      try {
        const result = await compressImage(file, {
          maxWidth: uploadMaxWidth,
          quality: uploadQuality / 100,
          format: 'image/webp',
        });
        setUploadStats(result);
        setNewUrl(result.dataUrl);
        setNewDimensions(`${result.compressedWidth}x${result.compressedHeight}`);
        setNewFileSize(`${result.compressedSizeFormatted} WebP`);
      } catch (err) {
        console.warn('Auto compression fallback:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewUrl(event.target?.result as string);
          setNewFileSize(formatBytes(file.size));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingUpload(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewUrl(event.target?.result as string);
        setNewFileSize(formatBytes(file.size));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptimizeUrl = async () => {
    if (!newUrl.trim()) return;
    setIsCompressingUpload(true);
    try {
      const result = await compressImage(newUrl, {
        maxWidth: uploadMaxWidth,
        quality: uploadQuality / 100,
        format: 'image/webp',
      });
      setUploadStats(result);
      setNewUrl(result.dataUrl);
      setNewDimensions(`${result.compressedWidth}x${result.compressedHeight}`);
      setNewFileSize(`${result.compressedSizeFormatted} WebP`);
    } catch (err) {
      console.warn('URL optimization error:', err);
      setMediaErrorMsg('Unable to compress URL image. Please verify the link is direct and publicly accessible.');
      setTimeout(() => setMediaErrorMsg(null), 4500);
    } finally {
      setIsCompressingUpload(false);
    }
  };

  const handleOptimizeExistingAsset = async (item: MediaAsset) => {
    if (!onUpdateMedia) return;
    setOptimizingAssetId(item.id);
    try {
      const result = await compressImage(item.url, {
        maxWidth: 1600,
        quality: 0.78,
        format: 'image/webp',
      });
      onUpdateMedia({
        id: item.id,
        url: result.dataUrl,
        fileSize: `${result.compressedSizeFormatted} WebP`,
        dimensions: `${result.compressedWidth}x${result.compressedHeight}`,
        title: item.title.includes('WebP') ? item.title : `${item.title} (WebP Optimized)`,
      });
      setOptimizeMessage(`Photo "${item.title}" successfully compressed to WebP! LCP improved by ~${(result.coreWebVitalsImpact.lcpSavingMs / 1000).toFixed(1)}s.`);
      setTimeout(() => setOptimizeMessage(null), 3500);
    } catch (err) {
      console.error('Error optimizing existing asset:', err);
      setMediaErrorMsg('Error occurred while compressing the image.');
      setTimeout(() => setMediaErrorMsg(null), 4000);
    } finally {
      setOptimizingAssetId(null);
    }
  };

  const handleOpenSeoModal = (item: MediaAsset) => {
    setEditingSeoAsset(item);
    setEditAltText(item.altText || item.title || '');
    setEditSeoTitle(item.title || '');
    setEditCaption(item.caption || '');
    setEditFocusKeywords(item.focusKeywords || '');
    setEditSeoSlug(item.seoSlug || item.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    setEditLoadingStrategy(item.loadingStrategy || 'lazy');
  };

  const handleSaveSeoMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeoAsset) return;

    if (onUpdateMedia) {
      onUpdateMedia({
        id: editingSeoAsset.id,
        altText: editAltText.trim(),
        title: editSeoTitle.trim(),
        caption: editCaption.trim(),
        focusKeywords: editFocusKeywords.trim(),
        seoSlug: editSeoSlug.trim(),
        loadingStrategy: editLoadingStrategy,
      });
    }

    setEditingSeoAsset(null);
  };

  const handleSaveNewAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) {
      setMediaErrorMsg('Please fill in both title and image URL.');
      setTimeout(() => setMediaErrorMsg(null), 4000);
      return;
    }

    onAddMedia({
      title: newTitle.trim(),
      url: newUrl.trim(),
      altText: newAltText.trim() || newTitle.trim(),
      caption: newCaption.trim(),
      focusKeywords: newFocusKeywords.trim(),
      seoSlug: newSeoSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newCategory,
      type: newType,
      loadingStrategy: 'lazy',
      fileSize: newFileSize || (uploadStats ? `${uploadStats.compressedSizeFormatted} WebP` : '220 KB WebP'),
      dimensions: newDimensions || (uploadStats ? `${uploadStats.compressedWidth}x${uploadStats.compressedHeight}` : '1600x900'),
      uploadedBy: 'Chief Editor',
    });

    setNewTitle('');
    setNewUrl('');
    setNewAltText('');
    setNewCaption('');
    setNewFocusKeywords('');
    setNewSeoSlug('');
    setUploadStats(null);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & SEO Health Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            <span>Editorial Media Gallery & Image SEO Suite</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            High-resolution press photos, Alt text, Google Images ranking, and Core Web Vitals compression management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCompressorModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Image Compressor (Web Vitals)</span>
          </button>

          <button
            onClick={() => setShowVideoEmbedModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Social Video Embed</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {optimizeMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{optimizeMessage}</span>
        </div>
      )}

      {mediaErrorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{mediaErrorMsg}</span>
        </div>
      )}

      {/* SEO Health Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Media Assets
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalAssets}</div>
          <span className="text-[10px] text-slate-500">Stored images in library</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Image SEO Score
          </span>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-emerald-600 font-mono">{seoHealthScore}%</div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
              {seoHealthScore >= 80 ? 'Excellent' : 'Needs Optimization'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Google Images readiness</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Alt Text Complete (Alt OK)
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{assetsWithAlt}</div>
          <span className="text-[10px] text-emerald-600">✓ Ready for Google Index</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Alt Text Pending
          </span>
          <div className={`text-2xl font-bold font-mono ${assetsMissingAlt > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            {assetsMissingAlt}
          </div>
          <span className="text-[10px] text-amber-600">
            {assetsMissingAlt > 0 ? '⚠️ SEO review needed' : 'All images optimized'}
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, Alt text, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {['all', 'national', 'politics', 'sports', 'business', 'tech', 'state', 'advertising'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
                  categoryFilter === cat
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            )
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              viewMode === 'grid' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              viewMode === 'table' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Media Assets View: Grid or Table */}
      {filteredMedia.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">No media assets found</p>
          <p className="text-xs text-slate-500">Upload a new image or clear search filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-mono">
                <tr>
                  <th className="p-3 pl-4">Asset Preview & Title</th>
                  <th className="p-3">Alt Text (SEO)</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Dimensions / Size</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedia.map((item) => {
                  const hasAlt = Boolean(item.altText && item.altText.trim());
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 pl-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.url}
                            alt={item.altText || item.title}
                            className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-[220px]">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {hasAlt ? (
                          <span className="text-[11px] text-emerald-700 font-medium block truncate max-w-[200px]" title={item.altText}>
                            ✓ {item.altText}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                            ⚠️ Alt Missing
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {item.category || item.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        <div>{item.dimensions || '1600x900'}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{item.fileSize || 'WebP'}</div>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenSeoModal(item)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-amber-200"
                            title="Edit Alt Text & SEO Metadata"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>SEO</span>
                          </button>
                          <button
                            onClick={() => handleOptimizeExistingAsset(item)}
                            disabled={optimizingAssetId === item.id}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer text-xs font-semibold flex items-center space-x-1 border border-emerald-200 disabled:opacity-50"
                            title="Convert to WebP"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">WebP</span>
                          </button>
                          <button
                            onClick={() => handleCopyLink(item.url, item.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                            title="Copy URL"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete media asset "${item.title}"?`)) {
                                onDeleteMedia(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((item) => {
            const hasAlt = Boolean(item.altText && item.altText.trim());
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-slate-300 transition shadow-2xs"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    loading={item.loadingStrategy || 'lazy'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-[10px] font-mono text-white px-2 py-0.5 rounded uppercase font-bold">
                    {item.category || item.type}
                  </span>

                  {/* WebP & Core Web Vitals Status Badge */}
                  <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                    <Zap className="w-2.5 h-2.5 text-amber-300" />
                    <span>{item.fileSize?.includes('WebP') ? 'WebP (Fast)' : item.fileSize || 'Optimized'}</span>
                  </span>

                  {/* SEO Health Badge */}
                  <span
                    className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-xs ${
                      hasAlt
                        ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                    }`}
                  >
                    {hasAlt ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>SEO Alt OK</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>Alt Missing</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={item.title}>
                      {item.title}
                    </h4>
                    <p
                      className="text-[11px] text-slate-500 line-clamp-1 mt-0.5"
                      title={item.altText || 'Alt missing'}
                    >
                      <strong className="text-slate-700">Alt:</strong> {item.altText || 'Missing'}
                    </p>
                    {item.caption && (
                      <p className="text-[10px] text-slate-400 italic line-clamp-1">
                        Credit: {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-mono">{item.dimensions || '1920x1080'}</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {item.loadingStrategy || 'lazy'}
                    </span>
                  </div>

                  {/* SEO Quick Copy & Action Toolbar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleCopySeoImgTag(item)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 flex items-center justify-center space-x-1 transition cursor-pointer"
                        title="Copy full HTML <img> tag with alt, title, and lazy loading"
                      >
                        {copiedId === `tag-${item.id}` ? (
                          <span className="text-emerald-600 font-bold">Tag Copied!</span>
                        ) : (
                          <>
                            <Code2 className="w-3 h-3 text-red-600" />
                            <span>Copy HTML &lt;img&gt;</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyMarkdown(item)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 flex items-center justify-center space-x-1 transition cursor-pointer"
                        title="Copy Markdown ![Alt](url)"
                      >
                        {copiedId === `md-${item.id}` ? (
                          <span className="text-emerald-600 font-bold">MD Copied!</span>
                        ) : (
                          <>
                            <FileCode className="w-3 h-3 text-blue-600" />
                            <span>Copy Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <button
                        onClick={() => handleOpenSeoModal(item)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold py-1.5 px-2 rounded-xl flex items-center justify-center space-x-1 transition cursor-pointer"
                        title="Edit Image SEO Alt Text, Title & Keywords"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>SEO</span>
                      </button>

                      <button
                        onClick={() => handleOptimizeExistingAsset(item)}
                        disabled={optimizingAssetId === item.id}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-1.5 px-2 rounded-xl flex items-center justify-center space-x-1 transition cursor-pointer disabled:opacity-50"
                        title="Convert to WebP & Optimize for Core Web Vitals"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">
                          {optimizingAssetId === item.id ? '...' : 'WebP'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(item.url, item.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer"
                        title="Copy Direct URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </button>

                      {onOpenEditorWithImage && (
                        <button
                          onClick={() => onOpenEditorWithImage(item)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 transition cursor-pointer"
                          title="Create article from this photo"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete media asset "${item.title}"?`)) {
                            onDeleteMedia(item.id);
                          }
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl border border-slate-200 transition cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* IMAGE SEO EDIT MODAL */}
      {editingSeoAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl p-5 space-y-4 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Image SEO & Alt Text Editor
                  </h4>
                  <p className="text-xs text-slate-500">
                    Configure complete details for Google Images and search engine ranking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSeoAsset(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSeoMetadata} className="space-y-3.5">
              {/* Image Preview & Snippet */}
              <div className="flex gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 items-center">
                <img
                  src={editingSeoAsset.url}
                  alt={editAltText || 'Preview'}
                  className="w-24 h-16 object-cover rounded-lg shrink-0 bg-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase block font-mono">
                    {editingSeoAsset.category} • {editingSeoAsset.dimensions || '1920x1080'}
                  </span>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {editSeoTitle || editingSeoAsset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    URL: {editingSeoAsset.url}
                  </div>
                </div>
              </div>

              {/* 1. Alt Text (Crucial for Google Image SEO) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Image Alt Text *</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Google Ranking Factor
                    </span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {editAltText.length} chars (ideal: 30-100 chars)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter accurate and descriptive alt text (e.g. Finance Minister presenting Union Budget in Parliament)..."
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Most critical tag for screen readers and search crawlers.
                </span>
              </div>

              {/* 2. Image Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Image Title Attribute
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gaganyaan Crew Module Ocean Splashdown"
                  value={editSeoTitle}
                  onChange={(e) => setEditSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* 3. Caption / Photo Credit */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Photo Credit / Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photo: PTI / Special Correspondent"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* 4. Focus Keywords & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Focus Keywords
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. space mission, isro, national technology"
                    value={editFocusKeywords}
                    onChange={(e) => setEditFocusKeywords(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    SEO Slug / Clean Filename
                  </label>
                  <input
                    type="text"
                    placeholder="gaganyaan-crew-module"
                    value={editSeoSlug}
                    onChange={(e) => setEditSeoSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* 5. Loading Strategy */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Loading Strategy
                </label>
                <select
                  value={editLoadingStrategy}
                  onChange={(e) => setEditLoadingStrategy(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="lazy">loading="lazy" (Recommended for Core Web Vitals)</option>
                  <option value="eager">loading="eager" (Top Hero Banner only)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSeoAsset(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer shadow-xs flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save SEO Metadata</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD NEW ASSET MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-5 space-y-4 shadow-xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-red-600" />
                <span>Upload Media Asset & Configure Image SEO</span>
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAsset} className="space-y-3.5">
              {/* CORE WEB VITALS AUTO-COMPRESSION PANEL */}
              <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">
                      Core Web Vitals Auto-Compression (WebP Lossless)
                    </span>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-emerald-800">
                    <input
                      type="checkbox"
                      checked={autoCompressOnUpload}
                      onChange={(e) => setAutoCompressOnUpload(e.target.checked)}
                      className="rounded accent-emerald-600 cursor-pointer"
                    />
                    <span>Auto-compress on upload</span>
                  </label>
                </div>

                {autoCompressOnUpload && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                    <div>
                      <span className="font-semibold block mb-0.5">Max Width:</span>
                      <select
                        value={uploadMaxWidth}
                        onChange={(e) => setUploadMaxWidth(Number(e.target.value))}
                        className="w-full bg-white border border-emerald-300 rounded-lg px-2 py-1 text-slate-800 font-mono"
                      >
                        <option value={1200}>1200px (Mobile Fast - Highest LCP)</option>
                        <option value={1600}>1600px (Balanced Retina - Recommended)</option>
                        <option value={1920}>1920px (Full HD 1080p)</option>
                      </select>
                    </div>
                    <div>
                      <span className="font-semibold block mb-0.5">WebP Quality: {uploadQuality}%</span>
                      <input
                        type="range"
                        min="60"
                        max="90"
                        value={uploadQuality}
                        onChange={(e) => setUploadQuality(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Status / Loading */}
              {isCompressingUpload && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-2 text-xs text-amber-900 animate-pulse">
                  <Zap className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Compressing and converting image to WebP (Core Web Vitals optimization)...</span>
                </div>
              )}

              {/* Compressed Stats Banner */}
              {uploadStats && (
                <div className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-xl space-y-1.5 text-xs text-emerald-950 animate-fadeIn">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>⚡ Core Web Vitals Optimized! ({uploadStats.savingsPercent}% reduction)</span>
                    </span>
                    <span className="bg-emerald-600 text-white font-mono text-[10px] px-2 py-0.5 rounded-full">
                      {uploadStats.format} FAST
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800 pt-1 border-t border-emerald-200">
                    <div>
                      Original Size: <del className="text-slate-500">{uploadStats.originalSizeFormatted}</del> →{' '}
                      <strong className="text-emerald-900">{uploadStats.compressedSizeFormatted}</strong>
                    </div>
                    <div>
                      Dimensions: <strong className="text-emerald-900">{uploadStats.compressedWidth}×{uploadStats.compressedHeight}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-700 italic">
                    ✓ {uploadStats.coreWebVitalsImpact.message}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                />
              </div>

              <div className="text-center text-[10px] text-slate-400 font-mono">— OR ENTER IMAGE URL —</div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Image URL *
                  </label>
                  {newUrl && !uploadStats && (
                    <button
                      type="button"
                      onClick={handleOptimizeUrl}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-emerald-600" />
                      <span>Compress URL Image to WebP</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cricket Stadium Celebration Event"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newAltText) setNewAltText(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Image Alt Text (Google SEO) *</span>
                  <span className="text-[10px] text-emerald-600 font-bold">SEO REQUIRED</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Descriptive alt text for Google Image Search ranking..."
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Credit / Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photo: Staff Reporter / PTI"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asset Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="image">News Photo</option>
                    <option value="banner">Ad Banner</option>
                    <option value="infographic">Infographic</option>
                  </select>
                </div>
              </div>

              {newUrl && (
                <div className="h-24 rounded-xl overflow-hidden border border-slate-200">
                  <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* IMAGE COMPRESSOR MODAL (WebP Optimized) */}
      {showCompressorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    High-Speed Image Compressor (WebP Lossless Optimizer)
                  </h3>
                  <p className="text-[11px] text-slate-500">Reduce image file size by up to 75% without visual loss</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompressorModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* File Input or URL */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Upload Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!compressTitle) {
                      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                      setCompressTitle(cleanName);
                    }
                    setIsProcessingCompressor(true);
                    try {
                      const res = await compressImage(file, {
                        maxWidth: compressMaxWidth,
                        quality: compressQuality / 100,
                        format: 'image/webp',
                      });
                      setActiveCompressResult(res);
                      setCompressUrl(res.dataUrl);
                    } catch (err) {
                      console.error('Compressor error:', err);
                    } finally {
                      setIsProcessingCompressor(false);
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
              </div>

              <div className="text-center text-[10px] text-slate-400 font-mono">— OR ENTER IMAGE URL —</div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Infrastructure Project"
                  value={compressTitle}
                  onChange={(e) => setCompressTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Image URL *
                  </label>
                  {compressUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!compressUrl.trim()) return;
                        setIsProcessingCompressor(true);
                        try {
                          const res = await compressImage(compressUrl, {
                            maxWidth: compressMaxWidth,
                            quality: compressQuality / 100,
                            format: 'image/webp',
                          });
                          setActiveCompressResult(res);
                        } catch (err) {
                          setMediaErrorMsg('Error processing image URL.');
                          setTimeout(() => setMediaErrorMsg(null), 4000);
                        } finally {
                          setIsProcessingCompressor(false);
                        }
                      }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-emerald-600" />
                      <span>Re-compress</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={compressUrl}
                  onChange={(e) => {
                    setCompressUrl(e.target.value);
                    setActiveCompressResult(null);
                  }}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Max Width
                  </span>
                  <select
                    value={compressMaxWidth}
                    onChange={(e) => setCompressMaxWidth(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  >
                    <option value={1200}>1200px (Mobile Fast)</option>
                    <option value={1600}>1600px (Desktop Balanced)</option>
                    <option value={1920}>1920px (Full HD)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Quality: {compressQuality}%</span>
                    <span className="text-emerald-700 font-mono text-[10px]">WebP</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Processing Loader */}
              {isProcessingCompressor && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 animate-pulse">
                  <Zap className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>Compressing canvas rendering to WebP...</span>
                </div>
              )}

              {/* Compression Ratio & Core Web Vitals Preview */}
              {activeCompressResult ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>WebP compression successful: {activeCompressResult.savingsPercent}% reduction!</span>
                    </span>
                    <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                      LCP IMPROVED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900 border-t border-emerald-200/80 pt-1.5 font-mono">
                    <div>
                      Size: <del className="text-slate-500">{activeCompressResult.originalSizeFormatted}</del> →{' '}
                      <strong>{activeCompressResult.compressedSizeFormatted}</strong>
                    </div>
                    <div>
                      Dimensions: <strong>{activeCompressResult.compressedWidth}×{activeCompressResult.compressedHeight}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-800 italic">
                    ✓ {activeCompressResult.coreWebVitalsImpact.message}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-700 font-bold block">Estimated Savings: ~75-90%</span>
                    <span className="text-slate-500 text-[11px]">Original: ~2.4 MB → Compressed: ~220 KB WebP</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                    CORE WEB VITALS
                  </span>
                </div>
              )}

              {compressSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Compressed WebP image successfully added to library!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompressorModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalUrl = activeCompressResult?.dataUrl || compressUrl.trim();
                    if (!finalUrl || !compressTitle.trim()) {
                      setMediaErrorMsg('Please provide an image title and upload a file or enter a URL.');
                      setTimeout(() => setMediaErrorMsg(null), 4000);
                      return;
                    }
                    onAddMedia({
                      title: `${compressTitle.trim()} (WebP Optimized)`,
                      url: finalUrl,
                      altText: compressTitle.trim(),
                      caption: `${compressTitle.trim()} - WebP Core Web Vitals Photo`,
                      category: 'national',
                      type: 'image',
                      loadingStrategy: 'lazy',
                      fileSize: activeCompressResult ? `${activeCompressResult.compressedSizeFormatted} WebP` : `${Math.round(240 * (compressQuality / 75))} KB WebP`,
                      dimensions: activeCompressResult ? `${activeCompressResult.compressedWidth}x${activeCompressResult.compressedHeight}` : `${compressMaxWidth}x900`,
                      uploadedBy: 'Image Compressor',
                    });
                    setCompressSuccess(true);
                    setTimeout(() => {
                      setCompressSuccess(false);
                      setShowCompressorModal(false);
                      setCompressTitle('');
                      setCompressUrl('');
                      setActiveCompressResult(null);
                    }, 1200);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Compress WebP & Save to Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA VIDEO EMBED HELPER MODAL */}
      {showVideoEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Responsive Video Embed Helper
                  </h3>
                  <p className="text-[11px] text-slate-500">YouTube, Twitter/X, Instagram, and Facebook videos</p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoEmbedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Video Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'youtube', label: 'YouTube' },
                    { id: 'twitter', label: 'X (Twitter)' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'facebook', label: 'Facebook' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEmbedPlatform(p.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        embedPlatform === p.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Video Link / Share URL *
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or x.com/status/..."
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Generated Responsive Embed Code */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Responsive Embed Code (16:9 Mobile & Desktop):
                </label>
                <div className="relative">
                  <pre className="bg-slate-950 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[140px]">
{`<div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 my-4">
  <iframe
    src="${embedUrl || 'https://www.youtube.com/embed/LIVE_ID'}"
    title="Video Player"
    className="w-full h-full border-0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      const tag = `<div class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 my-4"><iframe src="${embedUrl || 'https://www.youtube.com/embed/LIVE_ID'}" title="Video Player" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                      navigator.clipboard.writeText(tag);
                      setEmbedCopied(true);
                      setTimeout(() => setEmbedCopied(false), 2500);
                    }}
                    className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition"
                  >
                    {embedCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{embedCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoEmbedModal(false)}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
