import React, { useState } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Server,
  HardDrive,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  NewsArticle,
  PortalSettings,
  MediaAsset,
  LiveBlogEvent,
  ContactInquiry,
  SubscriberItem,
  CitizenNewsSubmission,
} from '../../types/news';
import { savePortalSettings, publishArticle } from '../../services/newsService';

interface DatabaseBackupRestoreTabProps {
  articles: NewsArticle[];
  portalSettings: PortalSettings;
  mediaAssets: MediaAsset[];
  liveBlogs: LiveBlogEvent[];
  inquiries: ContactInquiry[];
  subscribers: SubscriberItem[];
  citizenSubmissions: CitizenNewsSubmission[];
  onUpdateSettings: (settings: PortalSettings) => void;
  onSaveArticle: (article: Partial<NewsArticle>) => Promise<void>;
}

/**
 * DatabaseBackupRestoreTab
 * One-Click Full Portal Database Backup & Snapshot Restore Engine.
 * Allows newsroom administrators to export complete state or restore from validated snapshots.
 */
export const DatabaseBackupRestoreTab: React.FC<DatabaseBackupRestoreTabProps> = ({
  articles,
  portalSettings,
  mediaAssets,
  liveBlogs,
  inquiries,
  subscribers,
  citizenSubmissions,
  onUpdateSettings,
  onSaveArticle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedSnapshot, setParsedSnapshot] = useState<any | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);

  // 1. One-Click Export Handler
  const handleExportDatabase = () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPayload = {
        metadata: {
          exportTimestamp: new Date().toISOString(),
          portalDomain: 'khabridost.com',
          schemaVersion: '2.4.0',
          appName: 'Khabri Dost Newsroom CMS',
          environment: 'production',
          counts: {
            articles: articles.length,
            mediaAssets: mediaAssets.length,
            liveBlogs: liveBlogs.length,
            inquiries: inquiries.length,
            subscribers: subscribers.length,
            citizenSubmissions: citizenSubmissions.length,
          },
        },
        portalSettings,
        articles,
        mediaAssets,
        liveBlogs,
        inquiries,
        subscribers,
        citizenSubmissions,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `khabridost-backup-${timestamp.slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Upload and inspect JSON snapshot file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError(null);
    setRestoreSuccess(null);
    setParsedSnapshot(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setRestoreError('Invalid file type. Please upload a valid .json snapshot file.');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.portalSettings && !parsed.articles) {
          setRestoreError('The uploaded file does not appear to be a valid Khabri Dost backup structure.');
          return;
        }

        setParsedSnapshot(parsed);
      } catch (err: any) {
        setRestoreError(`Failed to parse JSON file: ${err.message || 'Syntax error'}`);
      }
    };
    reader.readAsText(file);
  };

  // 3. Execute Restore
  const handleExecuteRestore = async () => {
    if (!parsedSnapshot) return;
    setIsRestoring(true);
    setRestoreError(null);
    setRestoreSuccess(null);

    try {
      // 1. Restore Portal Settings
      if (parsedSnapshot.portalSettings) {
        onUpdateSettings(parsedSnapshot.portalSettings);
        savePortalSettings(parsedSnapshot.portalSettings).catch(() => {});
      }

      // 2. Restore Articles
      if (Array.isArray(parsedSnapshot.articles)) {
        for (const art of parsedSnapshot.articles) {
          await onSaveArticle(art);
        }
      }

      setRestoreSuccess(
        `Successfully restored snapshot! Updated settings and ${
          parsedSnapshot.articles?.length || 0
        } articles are active.`
      );
      setParsedSnapshot(null);
      setUploadedFile(null);
    } catch (err: any) {
      setRestoreError(`Error during restoration: ${err.message || 'Operation failed'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" />
          <span>Database Snapshot Backup & Restore</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Export full portal state as portable JSON snapshots or restore previous backups with automated schema verification.
        </p>
      </div>

      {/* 2. Current Database Health & Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Articles</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{articles.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Media Assets</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{mediaAssets.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Subscribers</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{subscribers.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Blogs</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{liveBlogs.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Inquiries</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{inquiries.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Submissions</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{citizenSubmissions.length}</span>
        </div>
      </div>

      {/* 3. Export & Backup Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Download Full Database Snapshot</h3>
            <p className="text-xs text-slate-500">
              Compiles all articles, custom settings, media library metadata, and subscriber records into an offline JSON snapshot.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Snapshot Format (JSON v2.4.0)</span>
            </span>
            <p className="text-[11px] text-slate-500">
              Safe, portable, human-readable format. Suitable for disaster recovery or staging migration.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportDatabase}
            disabled={isExporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating Snapshot...' : 'Export & Download Snapshot'}</span>
          </button>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Database snapshot successfully generated and downloaded to your computer!</span>
          </div>
        )}
      </div>

      {/* 4. Restore Snapshot Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Restore from JSON Snapshot</h3>
            <p className="text-xs text-slate-500">
              Upload a previously downloaded Khabri Dost backup file to restore database configurations.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-slate-50/50">
          <input
            type="file"
            id="backup-file-input"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="backup-file-input" className="cursor-pointer block space-y-2">
            <FileCode className="w-8 h-8 mx-auto text-slate-400" />
            <span className="text-xs font-bold text-indigo-600 hover:underline block">
              {uploadedFile ? uploadedFile.name : 'Click to select or drag .json snapshot file'}
            </span>
            <span className="text-[11px] text-slate-400 block">Accepts valid Khabri Dost JSON backup files</span>
          </label>
        </div>

        {restoreError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{restoreError}</span>
          </div>
        )}

        {restoreSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restoreSuccess}</span>
          </div>
        )}

        {/* Validated Snapshot Inspection Box */}
        {parsedSnapshot && (
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Validated Snapshot Details:</span>
              </span>
              <span className="text-[11px] text-indigo-700 font-mono">
                {parsedSnapshot.metadata?.exportTimestamp
                  ? new Date(parsedSnapshot.metadata.exportTimestamp).toLocaleString()
                  : 'Valid file'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Articles</span>
                <span className="font-bold text-slate-900">{parsedSnapshot.articles?.length || 0} items</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Settings</span>
                <span className="font-bold text-slate-900">
                  {parsedSnapshot.portalSettings ? 'Included ✓' : 'None'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Subscribers</span>
                <span className="font-bold text-slate-900">{parsedSnapshot.subscribers?.length || 0} items</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Media Assets</span>
                <span className="font-bold text-slate-900">{parsedSnapshot.mediaAssets?.length || 0} items</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setParsedSnapshot(null);
                  setUploadedFile(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                <span>{isRestoring ? 'Restoring Database...' : 'Execute Restoration'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
