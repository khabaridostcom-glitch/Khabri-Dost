import React from 'react';
import {
  Eye,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  User,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { ArticleMetaSettings } from '../../types/news';
import { DEFAULT_ARTICLE_META_SETTINGS } from '../../data/portalDefaults';

interface ArticleMetaSettingsTabProps {
  settings?: ArticleMetaSettings;
  onChange: (updated: ArticleMetaSettings) => void;
}

export const ArticleMetaSettingsTab: React.FC<ArticleMetaSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const current: ArticleMetaSettings = {
    ...DEFAULT_ARTICLE_META_SETTINGS,
    ...(settings || {}),
    platforms: {
      ...DEFAULT_ARTICLE_META_SETTINGS.platforms,
      ...(settings?.platforms || {}),
    },
  };

  const updateSetting = <K extends keyof ArticleMetaSettings>(key: K, value: ArticleMetaSettings[K]) => {
    onChange({
      ...current,
      [key]: value,
    });
  };

  const updatePlatform = (platform: keyof ArticleMetaSettings['platforms'], value: boolean) => {
    onChange({
      ...current,
      platforms: {
        ...current.platforms,
        [platform]: value,
      },
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_ARTICLE_META_SETTINGS);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Article Meta & Action Bar Studio
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Configure which article metadata (view counter, author details, publication timestamp) to display to visitors,
            and customize the single-line compact social sharing bar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer self-start sm:self-auto shrink-0"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SECTION 1: LINE 1 META DETAILS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <User className="w-4 h-4 text-red-600" />
              <span>Line 1: Author, Timestamp & Views</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Article author credentials and reader engagement counters
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Show Views Count */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Eye className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-semibold text-slate-800 block">पाठक संख्या / Views Counter</span>
                  <span className="text-[10px] text-slate-500">खबर पर पाठकों की संख्या (Views) दिखाएं या छिपाएं</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showViewsCount}
                onChange={(e) => updateSetting('showViewsCount', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Listen Button */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">ऑडियो / खबर सुनें बटन (Listen Audio Button)</span>
                  <span className="text-[10px] text-slate-500">शीर्ष बार में खबर को आवाज में सुनने का बटन दिखाएं</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showListenButton !== false}
                onChange={(e) => updateSetting('showListenButton', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show PDF Button */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-red-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">खबर PDF बनाएं बटन (Article PDF Button)</span>
                  <span className="text-[10px] text-slate-500">पाठकों के लिए खबर को PDF व ई-पेपर क्लिप में सेव करने का बटन दिखाएं</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showPdfButton !== false}
                onChange={(e) => updateSetting('showPdfButton', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Location Badge */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">📍</span>
                <div>
                  <span className="font-semibold text-slate-800 block">स्थान / लोकेशन बैज (Location Badge)</span>
                  <span className="text-[10px] text-slate-500">विषय / सेक्शन के साथ रिपोर्टर का स्थान (Location) दिखाएं</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showLocationBadge !== false}
                onChange={(e) => updateSetting('showLocationBadge', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Author Name */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-semibold text-slate-800 block">Author / Reporter Name</span>
                  <span className="text-[10px] text-slate-500">Display reporter byline text</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showAuthorName}
                onChange={(e) => updateSetting('showAuthorName', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Author Avatar */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold">
                  A
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Author Avatar Circle</span>
                  <span className="text-[10px] text-slate-500">Circular photo badge with author initial</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showAuthorAvatar}
                onChange={(e) => updateSetting('showAuthorAvatar', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Author Role */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">Role</span>
                <div>
                  <span className="font-semibold text-slate-800 block">Designation / Role Badge</span>
                  <span className="text-[10px] text-slate-500">e.g., "Special Correspondent" or "Senior Editor"</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showAuthorRole}
                onChange={(e) => updateSetting('showAuthorRole', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Publish Date */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-red-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Publication Date & Time</span>
                  <span className="text-[10px] text-slate-500">Calendar date and publication clock</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showPublishDate}
                onChange={(e) => updateSetting('showPublishDate', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Show Relative Time Ago */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="font-semibold text-slate-800 block">Relative Time Ago</span>
                  <span className="text-[10px] text-slate-500">e.g., "2 hours ago", "Just now"</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showRelativeTime}
                onChange={(e) => updateSetting('showRelativeTime', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>
          </div>
        </div>

        {/* SECTION 2: LINE 2 COMPACT ACTION & SOCIAL BAR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-red-600" />
              <span>Line 2: 1-Line Compact Action & Share Bar</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Likes, bookmarks, native sharing, and individual social buttons
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* 1-Line Compact Mode Highlight Box */}
            <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl space-y-1.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-bold text-red-950 block">Single-Line Compact Mode</span>
                    <span className="text-[10px] text-red-700">
                      Keeps all actions in a single tidy horizontal line without awkward wrapping
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.compactSingleLine}
                  onChange={(e) => updateSetting('compactSingleLine', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 shrink-0 ml-2"
                />
              </label>
            </div>

            {/* Like Button */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 text-red-500 fill-red-100" />
                <div>
                  <span className="font-semibold text-slate-800 block">Like / Heart Button & Counter</span>
                  <span className="text-[10px] text-slate-500">Allows readers to upvote and view like counts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showLikesButton}
                onChange={(e) => updateSetting('showLikesButton', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Bookmark Button */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-100" />
                <div>
                  <span className="font-semibold text-slate-800 block">Bookmark / Save Article</span>
                  <span className="text-[10px] text-slate-500">Quick button for saving stories to read later</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showBookmarkButton}
                onChange={(e) => updateSetting('showBookmarkButton', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Native Quick Share Button */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">
                  <Share2 className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Native One-Click Share Pill</span>
                  <span className="text-[10px] text-slate-500">Launches device native share sheet dialog</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showNativeShare}
                onChange={(e) => updateSetting('showNativeShare', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Social Media Icons Master Switch */}
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Share2 className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-semibold text-slate-800 block">Social Icons Strip</span>
                  <span className="text-[10px] text-slate-500">Toggle individual social platform buttons</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.showSocialIcons}
                onChange={(e) => updateSetting('showSocialIcons', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </label>

            {/* Individual Social Platforms */}
            {current.showSocialIcons && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Select Active Social Platforms:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={current.platforms.whatsapp}
                      onChange={(e) => updatePlatform('whatsapp', e.target.checked)}
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-emerald-700 font-semibold">WhatsApp</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={current.platforms.telegram}
                      onChange={(e) => updatePlatform('telegram', e.target.checked)}
                      className="w-3.5 h-3.5 text-sky-600 rounded"
                    />
                    <span className="text-sky-700 font-semibold">Telegram</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={current.platforms.twitter}
                      onChange={(e) => updatePlatform('twitter', e.target.checked)}
                      className="w-3.5 h-3.5 text-slate-800 rounded"
                    />
                    <span className="text-slate-800 font-semibold">X (Twitter)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={current.platforms.facebook}
                      onChange={(e) => updatePlatform('facebook', e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="text-blue-700 font-semibold">Facebook</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 col-span-2">
                    <input
                      type="checkbox"
                      checked={current.platforms.copyLink}
                      onChange={(e) => updatePlatform('copyLink', e.target.checked)}
                      className="w-3.5 h-3.5 text-slate-700 rounded"
                    />
                    <span className="text-slate-700 font-semibold">Copy Link Button</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIVE INTERACTIVE CARD PREVIEW */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-slate-900 text-sm">
              Live Container Preview
            </h4>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            Realtime Preview
          </span>
        </div>

        <p className="text-xs text-slate-500">
          This preview dynamically renders the exact container appearance for website visitors:
        </p>

        {/* PREVIEW CONTAINER */}
        <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-3 sm:p-4 space-y-2.5 shadow-2xs">
          {/* Subtitle placeholder */}
          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed border-l-3 border-red-600 pl-2.5 py-0.5">
            Parliament Budget Session 2026: Economic Growth & National Development Overview
          </p>

          {/* Line 1 Preview: Author, Date, Views */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70 text-xs text-slate-600 font-kd-meta">
            <div className="flex items-center space-x-2 min-w-0">
              {current.showAuthorAvatar && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-white shadow-2xs">
                  A
                </div>
              )}
              <div className="min-w-0 leading-tight">
                {(current.showAuthorName || current.showAuthorRole) && (
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                    {current.showAuthorName && (
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        Amit Kumar
                      </span>
                    )}
                    {current.showAuthorName && current.showAuthorRole && (
                      <span className="text-[10px] text-slate-300">•</span>
                    )}
                    {current.showAuthorRole && (
                      <span className="text-[10px] text-red-700 bg-red-50 border border-red-200/60 font-medium px-1.5 py-0.2 rounded truncate">
                        Special Correspondent
                      </span>
                    )}
                  </div>
                )}
                {(current.showPublishDate || current.showRelativeTime) && (
                  <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-500 mt-0.5 flex-wrap gap-y-0.5">
                    {current.showPublishDate && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-red-600 shrink-0" />
                        <span>Sep 24, 2026 • 04:30 PM</span>
                      </span>
                    )}
                    {current.showPublishDate && current.showRelativeTime && (
                      <span className="text-slate-300">•</span>
                    )}
                    {current.showRelativeTime && (
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>2 hours ago</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Views Count */}
            {current.showViewsCount && (
              <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-mono bg-white px-2 py-0.5 rounded-full border border-slate-200/80 shadow-2xs shrink-0">
                <Eye className="w-3 h-3 text-slate-400" />
                <span>842 Readers</span>
              </div>
            )}
          </div>

          {/* Line 2 Preview: 1-Line Compact Bar */}
          <div className={`flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs ${
            current.compactSingleLine ? 'flex-nowrap overflow-x-auto no-scrollbar py-0.5' : 'flex-wrap'
          }`}>
            {/* Left Actions */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {current.showLikesButton && (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs">
                  <Heart className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-mono text-xs">148</span>
                </div>
              )}

              {current.showBookmarkButton && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium shadow-2xs">
                  <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] hidden sm:inline">Save</span>
                </div>
              )}
            </div>

            {/* Right Social & Share Group */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-0.5">
                Share:
              </span>

              {current.showSocialIcons && current.platforms.whatsapp && (
                <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <span className="text-[10px] font-bold">WA</span>
                </div>
              )}

              {current.showSocialIcons && current.platforms.telegram && (
                <div className="w-7 h-7 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <span className="text-[10px] font-bold">TG</span>
                </div>
              )}

              {current.showSocialIcons && current.platforms.twitter && (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0">
                  <span className="text-[10px] font-bold">X</span>
                </div>
              )}

              {current.showSocialIcons && current.platforms.facebook && (
                <div className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <span className="text-[10px] font-bold">FB</span>
                </div>
              )}

              {current.showNativeShare && (
                <div className="flex items-center space-x-1 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs shrink-0">
                  <Share2 className="w-3 h-3" />
                  <span className="text-[11px]">Share</span>
                </div>
              )}

              {current.showSocialIcons && current.platforms.copyLink && (
                <div className="w-7 h-7 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
