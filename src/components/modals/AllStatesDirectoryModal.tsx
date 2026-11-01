import React, { useState } from 'react';
import { MapPin, Star, ArrowRight, X } from 'lucide-react';
import { MAJOR_INDIAN_STATES, ALL_INDIAN_STATES_BY_REGION } from '../../data/seedNews';
import { NewsArticle } from '../../types/news';

export interface PopularStateMeta {
  name: string;
  articleCount: number;
  views: number;
  topStory: NewsArticle | null;
  regionShort: string;
  badgeClass: string;
  dotClass: string;
  cardHoverClass: string;
  score: number;
}

interface AllStatesDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSelectState: (stateName: string) => void;
  onClearSearch: () => void;
  topPopularStates: PopularStateMeta[];
}

/**
 * AllStatesDirectoryModal
 * Provides a comprehensive, color-coded directory of all 28 Indian States & 8 UTs.
 * Features:
 * 1. Region-wise categorization (North, South, East, West, Central & Northeast).
 * 2. Top 3 trending/popular states based on live ground reporting & reader activity.
 * 3. Instant search & filter bar.
 */
export const AllStatesDirectoryModal: React.FC<AllStatesDirectoryModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSelectState,
  onClearSearch,
  topPopularStates,
}) => {
  const [stateModalTab, setStateModalTab] = useState<'region' | 'popular'>('region');
  const [stateModalSearch, setStateModalSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-kd-meta">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 text-slate-900 p-4 sm:p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900 leading-tight flex items-center gap-2">
                <span>भारत के राज्य व केंद्र शासित प्रदेश</span>
                <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-sans font-medium hidden sm:inline">
                  All States & UTs
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                रंगीन क्षेत्रवार वर्गीकरण एवं दैनिक समाचार गतिविधि के आधार पर लोकप्रिय राज्य
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              setStateModalSearch('');
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition cursor-pointer"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs: 'By Region' and 'Most Popular' */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setStateModalTab('region')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                stateModalTab === 'region'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>क्षेत्र अनुसार सभी राज्य</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  stateModalTab === 'region' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                5 क्षेत्र
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStateModalTab('popular')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                stateModalTab === 'popular'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>सर्वाधिक लोकप्रिय राज्य</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                Top 3
              </span>
            </button>
          </div>

          {searchQuery && (
            <div className="flex items-center space-x-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
              <span className="font-semibold">सक्रिय फ़िल्टर: {searchQuery}</span>
              <button
                type="button"
                onClick={() => {
                  onClearSearch();
                  onClose();
                }}
                className="hover:underline font-bold ml-1 cursor-pointer"
              >
                हटाएं ✕
              </button>
            </div>
          )}
        </div>

        {/* Quick State Search Input inside Modal */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="राज्य का नाम खोजें (उदा: राजस्थान, उत्तर प्रदेश, मध्य प्रदेश, गुजरात)..."
              value={stateModalSearch}
              onChange={(e) => setStateModalSearch(e.target.value)}
              className="w-full bg-white text-xs pl-8 pr-7 py-2 rounded-xl border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 font-medium"
            />
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            {stateModalSearch && (
              <button
                type="button"
                onClick={() => setStateModalSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-red-600 text-xs font-bold p-0.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: MOST POPULAR STATES (TOP 3 BASED ON NEWS ACTIVITY) */}
          {stateModalTab === 'popular' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-r from-amber-50 via-red-50 to-amber-50 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    🔥
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-kd-headline">
                      दैनिक समाचार गतिविधि के आधार पर शीर्ष 3 लोकप्रिय राज्य
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      प्रादेशिक ग्राउंड रिपोर्टिंग, पाठक संख्या और ताज़ा अपडेट्स पर आधारित रीयल-टाइम रैंकिंग
                    </p>
                  </div>
                </div>
              </div>

              {/* Top 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {topPopularStates.map((st, idx) => {
                  const rankBadge =
                    idx === 0
                      ? { label: '#1 सर्वाधिक सक्रिय', color: 'bg-red-600 text-white' }
                      : idx === 1
                      ? { label: '#2 ट्रेंडिंग कवरेज', color: 'bg-amber-500 text-slate-950' }
                      : { label: '#3 सक्रिय कवरेज', color: 'bg-blue-600 text-white' };

                  const isSelected = searchQuery === st.name;

                  return (
                    <div
                      key={st.name}
                      className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md ${
                        isSelected
                          ? 'border-red-600 bg-red-50/40 ring-2 ring-red-600/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${rankBadge.color}`}
                          >
                            {rankBadge.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeClass}`}>
                            {st.regionShort}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-black font-kd-headline text-slate-900">
                            {st.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-kd-meta">
                            <span className="font-bold text-red-600">{st.articleCount} ताज़ा ख़बरें</span>
                            <span>•</span>
                            <span>{st.views} पाठक</span>
                          </div>
                        </div>

                        {st.topStory && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                              ताज़ा सुर्खी:
                            </span>
                            <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                              "{st.topStory.title}"
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectState(st.name);
                          onClose();
                          setStateModalSearch('');
                        }}
                        className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                          isSelected ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-900 hover:bg-red-600 text-white'
                        }`}
                      >
                        <span>{isSelected ? '✓ चयनित है' : 'राज्य समाचार पढ़ें'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Secondary Quick Jump to Other States */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2 font-kd-meta">
                  अन्य प्रमुख राज्य (Quick Select):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MAJOR_INDIAN_STATES.slice(3, 15).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onSelectState(st);
                        onClose();
                        setStateModalSearch('');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 transition cursor-pointer"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BY REGION (COLOR-CODED REGIONS & COMPLETE NAMES) */}
          {stateModalTab === 'region' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Quick Region Jump Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
                <button
                  type="button"
                  onClick={() => setSelectedRegionFilter('all')}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer border ${
                    selectedRegionFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  सभी क्षेत्र
                </button>
                {ALL_INDIAN_STATES_BY_REGION.map((g) => {
                  const isSel = selectedRegionFilter === g.regionShort;
                  return (
                    <button
                      key={g.regionShort}
                      type="button"
                      onClick={() => setSelectedRegionFilter(isSel ? 'all' : g.regionShort)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer border flex items-center space-x-1.5 ${
                        isSel ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : `${g.badgeClass} hover:opacity-85`
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${g.dotClass}`}></span>
                      <span>{g.regionShort}</span>
                    </button>
                  );
                })}
              </div>

              {/* Render Regions */}
              {ALL_INDIAN_STATES_BY_REGION.filter((group) =>
                selectedRegionFilter === 'all' ? true : group.regionShort === selectedRegionFilter
              ).map((group, idx) => {
                const filteredStates = stateModalSearch.trim()
                  ? group.states.filter((s) => s.toLowerCase().includes(stateModalSearch.toLowerCase().trim()))
                  : group.states;

                if (filteredStates.length === 0) return null;

                return (
                  <div key={idx} className="space-y-2.5">
                    {/* Region Section Header with Color Badge */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${group.dotClass}`}></span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 font-kd-headline">
                          {group.region}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${group.badgeClass}`}>
                          {group.regionShort}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium font-kd-meta">
                        {filteredStates.length} राज्य व प्रदेश
                      </span>
                    </div>

                    {/* State Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {filteredStates.map((st) => {
                        const isCurrent = searchQuery === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              onSelectState(st);
                              onClose();
                              setStateModalSearch('');
                            }}
                            className={`p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between border ${
                              isCurrent
                                ? 'bg-red-600 text-white font-bold border-red-600 shadow-xs'
                                : `bg-slate-50 text-slate-800 border-slate-200/90 ${group.cardHoverClass} hover:text-slate-950`
                            }`}
                          >
                            <span className="flex items-center space-x-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isCurrent ? 'bg-white' : group.dotClass
                                }`}
                              />
                              <span className="font-medium">{st}</span>
                            </span>
                            {isCurrent && <span className="text-xs ml-1 font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            {searchQuery ? `सक्रिय फ़िल्टर: ${searchQuery}` : 'सभी राज्यों की प्रादेशिक खबरें उपलब्ध'}
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              setStateModalSearch('');
            }}
            className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg font-bold cursor-pointer transition shadow-2xs"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
