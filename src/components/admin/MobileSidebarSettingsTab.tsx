import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  Trash2,
  Check,
  Eye,
  Type,
  Newspaper,
  PenTool,
  Share2,
  Sliders,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Link,
  MessageCircle,
  Send,
  HelpCircle,
} from 'lucide-react';
import { PortalSettings, MobileSidebarMenuConfig, MobileSidebarCustomLink } from '../../types/news';
import { DEFAULT_MOBILE_SIDEBAR_MENU, FONT_OPTIONS } from '../../data/portalDefaults';
import { CATEGORIES } from '../../data/seedNews';

interface MobileSidebarSettingsTabProps {
  settings: PortalSettings;
  onChange: (updatedSettings: PortalSettings) => void;
}

export const MobileSidebarSettingsTab: React.FC<MobileSidebarSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const currentConfig: MobileSidebarMenuConfig = {
    ...DEFAULT_MOBILE_SIDEBAR_MENU,
    ...(settings.mobileSidebarMenu || {}),
  };

  const [newLabelHindi, setNewLabelHindi] = useState('');
  const [newLabelEnglish, setNewLabelEnglish] = useState('');
  const [newLinkType, setNewLinkType] = useState<'page' | 'category' | 'external'>('page');
  const [newTarget, setNewTarget] = useState('live-feed');
  const [showAddForm, setShowAddForm] = useState(false);

  const updateConfig = (changes: Partial<MobileSidebarMenuConfig>) => {
    onChange({
      ...settings,
      mobileSidebarMenu: {
        ...currentConfig,
        ...changes,
      },
    });
  };

  const handleAddCustomLink = () => {
    if (!newLabelEnglish.trim() && !newLabelHindi.trim()) {
      alert('Please enter a label for the menu item.');
      return;
    }

    const newLink: MobileSidebarCustomLink = {
      id: `link-${Date.now()}`,
      labelHindi: newLabelHindi.trim() || newLabelEnglish.trim(),
      labelEnglish: newLabelEnglish.trim() || newLabelHindi.trim(),
      linkType: newLinkType,
      target: newTarget.trim(),
      enabled: true,
    };

    const updatedLinks = [...(currentConfig.customLinks || []), newLink];
    updateConfig({ customLinks: updatedLinks });
    setNewLabelHindi('');
    setNewLabelEnglish('');
    setShowAddForm(false);
  };

  const handleToggleCustomLink = (id: string) => {
    const updated = (currentConfig.customLinks || []).map((link) =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    );
    updateConfig({ customLinks: updated });
  };

  const handleDeleteCustomLink = (id: string) => {
    const updated = (currentConfig.customLinks || []).filter((link) => link.id !== id);
    updateConfig({ customLinks: updated });
  };

  const handleReset = () => {
    if (window.confirm('Do you want to reset mobile sidebar settings to default?')) {
      updateConfig(DEFAULT_MOBILE_SIDEBAR_MENU);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl text-slate-800 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Smartphone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Mobile Sidebar Menu Customizer</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
                Admin Control
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Manage sidebar menu, buttons, fonts, logo, social links and navigation for mobile devices
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONTROLS & TOGGLES (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Header Branding & Logo Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>1. Sidebar Header & Branding</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900">Show Brand Logo</div>
                  <div className="text-[11px] text-slate-500">Display uploaded site logo</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showLogo !== false}
                  onChange={(e) => updateConfig({ showLogo: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900">Show Site Title</div>
                  <div className="text-[11px] text-slate-500">Display textual website brand title</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSiteTitle !== false}
                  onChange={(e) => updateConfig({ showSiteTitle: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 2. Top Quick Action Buttons */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>2. Top Quick Action Buttons</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">E-Paper Button</div>
                    <div className="text-[11px] text-slate-500">Direct link to digital edition</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showEPaperButton !== false}
                  onChange={(e) => updateConfig({ showEPaperButton: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Submit News Button</div>
                    <div className="text-[11px] text-slate-500">Citizen journalist tip line</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSubmitNewsButton !== false}
                  onChange={(e) => updateConfig({ showSubmitNewsButton: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 3. Official Channels: WhatsApp & Telegram */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>3. Official Channel Cards (WhatsApp & Telegram Join)</span>
              </h4>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Simple & Compact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-900">Show Channels Block</div>
                  <div className="text-[11px] text-slate-500">Entire block on / off</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showOfficialChannels !== false}
                  onChange={(e) => updateConfig({ showOfficialChannels: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-[#25D366] text-white flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showWhatsAppButton !== false}
                  onChange={(e) => updateConfig({ showWhatsAppButton: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-[#229ED9] text-white flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Telegram</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showTelegramButton !== false}
                  onChange={(e) => updateConfig({ showTelegramButton: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 4. Menu Items & Custom Links (Add / Remove) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>4. Menu Navigation & Custom Links</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Link</span>
              </button>
            </div>

            {/* Toggle standard categories */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Show News Categories Grid ({CATEGORIES.length} Categories)
                </div>
                <div className="text-[11px] text-slate-500">
                  National, Politics, Business, Entertainment, Sports, Tech, etc.
                </div>
              </div>
              <input
                type="checkbox"
                checked={currentConfig.showCategories !== false}
                onChange={(e) => updateConfig({ showCategories: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 cursor-pointer"
              />
            </label>

            {/* Add Custom Link Form */}
            {showAddForm && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-slate-900">Add New Sidebar Menu Link:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Menu Label (Hindi / Local)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ग्राउंड रिपोर्ट"
                      value={newLabelHindi}
                      onChange={(e) => setNewLabelHindi(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Menu Label (English)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ground Report"
                      value={newLabelEnglish}
                      onChange={(e) => setNewLabelEnglish(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Link Type
                    </label>
                    <select
                      value={newLinkType}
                      onChange={(e) => setNewLinkType(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="page">Portal Page (Internal)</option>
                      <option value="category">Category Filter</option>
                      <option value="external">External Website (URL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Target / URL
                    </label>
                    {newLinkType === 'page' ? (
                      <select
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="live-feed">Live Feed</option>
                        <option value="about">About Us</option>
                        <option value="contact">Contact Us</option>
                        <option value="submit-news">Submit News</option>
                        <option value="legal">Legal Policy</option>
                      </select>
                    ) : newLinkType === 'category' ? (
                      <select
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.labelEnglish} ({c.labelHindi})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    className="px-3.5 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-2xs cursor-pointer"
                  >
                    Add Link
                  </button>
                </div>
              </div>
            )}

            {/* List of Custom Links */}
            <div className="space-y-2 pt-1">
              {(currentConfig.customLinks || []).map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        link.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800">
                        {link.labelEnglish || link.labelHindi}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1.5">
                        ({link.linkType}: {link.target})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleCustomLink(link.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        link.enabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {link.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomLink(link.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Typography, Font & Styling */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>5. Sidebar Typography & Font Styling</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sidebar Font Family
                </label>
                <select
                  value={currentConfig.fontFamily || "'Mukta', sans-serif"}
                  onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Menu Font Scale
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {[
                    { id: 'sm', label: 'Small' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'large', label: 'Large' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => updateConfig({ fontSize: sz.id as any })}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                        (currentConfig.fontSize || 'normal') === sz.id
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Social Media & Subscriber Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>6. Social Icons & Newsletter</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">Show Social Media Icons</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSocialMediaIcons !== false}
                  onChange={(e) => updateConfig({ showSocialMediaIcons: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">Newsletter Subscriber Card</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSubscriberCard !== false}
                  onChange={(e) => updateConfig({ showSubscriberCard: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MOBILE PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Live Mobile Drawer Preview:</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Real-time simulation</span>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="mx-auto max-w-[320px] bg-slate-900 rounded-[32px] p-2.5 shadow-xl border-4 border-slate-800">
            {/* Phone Screen */}
            <div
              style={{
                fontFamily: currentConfig.fontFamily || "'Mukta', sans-serif",
              }}
              className="bg-white rounded-[24px] overflow-hidden flex flex-col h-[580px] text-slate-800 text-xs shadow-inner"
            >
              {/* Drawer Mock Header */}
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center space-x-2">
                  {currentConfig.showLogo !== false && (
                    <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                      K
                    </div>
                  )}
                  {currentConfig.showSiteTitle !== false && (
                    <span className="font-bold text-xs text-slate-900">
                      {settings.headerFooter?.siteTitle || 'खबरी दोस्त'}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200">
                  ✕
                </span>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
                {/* 1. Top Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                  {currentConfig.showEPaperButton !== false && (
                    <div className="p-2 bg-amber-500 text-slate-950 rounded-lg flex items-center space-x-1.5">
                      <Newspaper className="w-3.5 h-3.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold leading-tight truncate">ई-पेपर</div>
                        <div className="text-[8px] opacity-80 truncate">आज का अंक ➔</div>
                      </div>
                    </div>
                  )}
                  {currentConfig.showSubmitNewsButton !== false && (
                    <div className="p-2 bg-red-50 text-red-900 border border-red-200 rounded-lg flex items-center space-x-1.5">
                      <PenTool className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold leading-tight truncate">खबर भेजें</div>
                        <div className="text-[8px] text-red-600 truncate">फोटो/वीडियो ➔</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Custom Links */}
                {(currentConfig.customLinks || [])
                  .filter((l) => l.enabled)
                  .map((link) => (
                    <div
                      key={link.id}
                      className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-800"
                    >
                      <span className="truncate">{link.labelHindi}</span>
                      <span className="text-[9px] text-slate-400">➔</span>
                    </div>
                  ))}

                {/* 3. Categories Grid */}
                {currentConfig.showCategories !== false && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block border-b border-slate-100 pb-0.5">
                      प्रमुख विषय ({CATEGORIES.length})
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {CATEGORIES.slice(0, 6).map((c) => (
                        <div
                          key={c.id}
                          className="p-1.5 rounded-md bg-slate-50 text-[10px] font-medium text-slate-700 truncate"
                        >
                          {c.labelHindi}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Compact WhatsApp & Telegram Channel Cards */}
                {currentConfig.showOfficialChannels !== false && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block border-b border-slate-100 pb-0.5">
                      चैनल जॉइन करें
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {currentConfig.showWhatsAppButton !== false && (
                        <div className="p-1.5 bg-[#075E54] text-white rounded-lg flex items-center justify-between shadow-2xs border border-emerald-600/40">
                          <div className="flex items-center space-x-1 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-emerald-400/25 text-white flex items-center justify-center shrink-0">
                              <MessageCircle className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 leading-tight">
                              <div className="text-[10px] font-black text-white truncate">WhatsApp</div>
                              <div className="text-[7.5px] text-emerald-200 truncate">अलर्ट्स</div>
                            </div>
                          </div>
                          <span className="text-[7.5px] font-black bg-white text-emerald-950 px-1 py-0.2 rounded shrink-0 ml-0.5">
                            ➔
                          </span>
                        </div>
                      )}
                      {currentConfig.showTelegramButton !== false && (
                        <div className="p-1.5 bg-[#0077b5] text-white rounded-lg flex items-center justify-between shadow-2xs border border-sky-400/40">
                          <div className="flex items-center space-x-1 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-sky-300/25 text-white flex items-center justify-center shrink-0">
                              <Send className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 leading-tight">
                              <div className="text-[10px] font-black text-white truncate">Telegram</div>
                              <div className="text-[7.5px] text-sky-200 truncate">बुलेटिन</div>
                            </div>
                          </div>
                          <span className="text-[7.5px] font-black bg-white text-sky-950 px-1 py-0.2 rounded shrink-0 ml-0.5">
                            ➔
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Social Media Icons */}
                {currentConfig.showSocialMediaIcons !== false && (
                  <div className="pt-1 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
                    <span>फॉलो करें:</span>
                    <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] font-bold">
                      f
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                      𝕏
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[9px] font-bold">
                      ▶
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
