import React from 'react';
import {
  Tv,
  Layers,
  Flame,
  Camera,
  Layout,
  Radio,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { PortalSettings, HomepageSectionsConfig } from '../../types/news';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../../data/portalDefaults';

interface HomepageSectionsSettingsTabProps {
  settings: PortalSettings;
  onChange: (updated: PortalSettings) => void;
}

export const HomepageSectionsSettingsTab: React.FC<HomepageSectionsSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const sections: HomepageSectionsConfig =
    settings.homepageSections || DEFAULT_HOMEPAGE_SECTIONS;

  const isVideoEnabled = sections.liveVideoBulletin !== false && settings.liveVideoSectionEnabled !== false;

  const handleToggleVideoSection = () => {
    const nextState = !isVideoEnabled;
    onChange({
      ...settings,
      liveVideoSectionEnabled: nextState,
      homepageSections: {
        ...sections,
        liveVideoBulletin: nextState,
      },
    });
  };

  const handleToggleSection = (key: keyof HomepageSectionsConfig) => {
    const updatedSections = {
      ...sections,
      [key]: !sections[key],
    };

    // If toggling liveVideoBulletin, keep liveVideoSectionEnabled synchronized
    const updated: PortalSettings = {
      ...settings,
      homepageSections: updatedSections,
      liveVideoSectionEnabled:
        key === 'liveVideoBulletin' ? updatedSections.liveVideoBulletin : settings.liveVideoSectionEnabled,
      liveFeedCoverageEnabled:
        key === 'liveFeedCoverage' ? updatedSections.liveFeedCoverage : settings.liveFeedCoverageEnabled,
      headerLiveFeedLinkEnabled:
        key === 'headerLiveFeedLink' ? updatedSections.headerLiveFeedLink : settings.headerLiveFeedLinkEnabled,
    };

    onChange(updated);
  };

  const handleUpdateLiveVideo = (field: 'liveVideoTitle' | 'liveVideoYoutubeId', value: string) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-800">
      {/* Top Banner */}
      <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
            <Layout className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Homepage Sections & Live Studio Controls
              </h2>
              <span className="bg-red-50 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-200">
                LIVE TOGGLES
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Control the visibility of any section on your homepage and navigation bar in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Live Feed & Coverage Page Controls (Requested Feature) */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Live News Updates & Dedicated Page Mode
                </h3>
                <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  PAGE STYLE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live Coverage opens as a clean full-page experience (no popup modal). Control where readers can access it.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
          {/* Header Navigation Menu Link */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Header Menu "Live Coverage" Link</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Recommended</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Shows a dedicated red LIVE button in the top navigation bar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('headerLiveFeedLink')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0 ml-2 shadow-xs ${
                sections.headerLiveFeedLink !== false
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {sections.headerLiveFeedLink !== false ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Disabled</span>
                </>
              )}
            </button>
          </div>

          {/* Homepage Live Feed Strip */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Homepage Live Feed Strip
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Displays the live coverage banner card directly on the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('liveFeedCoverage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0 ml-2 shadow-xs ${
                sections.liveFeedCoverage
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {sections.liveFeedCoverage ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hidden</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Digital Studio & Live Video Bulletin */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Digital Studio & Live Video Bulletin
                </h3>
                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Broadcast Player
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Display 24x7 YouTube live video stream and news bulletin grid on the homepage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVideoSection}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs ${
              isVideoEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {isVideoEnabled ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hidden</span>
              </>
            )}
          </button>
        </div>

        {/* Live Video Configuration Inputs */}
        {isVideoEnabled && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Broadcast Header Title
              </label>
              <input
                type="text"
                value={settings.liveVideoTitle || 'Khabri Dost Digital Studio • 24x7 Live Stream'}
                onChange={(e) => handleUpdateLiveVideo('liveVideoTitle', e.target.value)}
                placeholder="Digital Studio Live Broadcast"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                YouTube Live Video ID
              </label>
              <input
                type="text"
                value={settings.liveVideoYoutubeId || 'jfKfPfyJRdk'}
                onChange={(e) => handleUpdateLiveVideo('liveVideoYoutubeId', e.target.value)}
                placeholder="jfKfPfyJRdk or live stream ID"
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-red-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Extract from YouTube URL: e.g. <code>v=VIDEO_ID</code>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Grid of Other Homepage Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-red-600" />
          <span>Additional Homepage Sections</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Hero Slider Spotlight */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Hero Slider & Top Stories</h4>
                <p className="text-[11px] text-slate-500">Top headline carousel and 3-card lead stories</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('heroSlider')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                sections.heroSlider
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {sections.heroSlider ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Photo Gallery */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Photo Stories & Albums</h4>
                <p className="text-[11px] text-slate-500">Curated high-res editorial photo album grid</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('photoGallery')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                sections.photoGallery
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {sections.photoGallery ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Trending Topics Strip */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Trending Topics Strip</h4>
                <p className="text-[11px] text-slate-500">Viral hashtags and search keywords</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('trendingTopics')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                sections.trendingTopics
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {sections.trendingTopics ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Breaking News Briefs Ticker */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Breaking News Ticker</h4>
                <p className="text-[11px] text-slate-500">24x7 scrolling live headlines strip</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('briefsTicker')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                sections.briefsTicker
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {sections.briefsTicker ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Morning 60-Second News Capsule (सुबह का 60-सेकंड कैप्सूल) */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-50 text-red-600">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">सुबह का 60-सेकंड कैप्सूल (Morning Brief)</h4>
                <p className="text-[11px] text-slate-500">Quick 4-card morning brief strip on homepage</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('morningCapsule')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                sections.morningCapsule !== false
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {sections.morningCapsule !== false ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
