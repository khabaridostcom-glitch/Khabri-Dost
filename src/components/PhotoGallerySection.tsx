import React, { useState, useEffect, useCallback } from 'react';
import { Camera, MapPin, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PhotoStoryItem } from '../types/news';
import { INITIAL_PHOTO_STORIES } from '../data/portalDefaults';

interface PhotoGallerySectionProps {
  customPhotoStories?: PhotoStoryItem[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  customPhotoStories,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const photoList =
    customPhotoStories && customPhotoStories.length > 0
      ? customPhotoStories
      : INITIAL_PHOTO_STORIES;

  const activePhoto = activeIndex !== null ? photoList[activeIndex] : null;

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photoList.length - 1));
  }, [activeIndex, photoList.length]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < photoList.length - 1 ? prev + 1 : 0));
  }, [activeIndex, photoList.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handlePrev, handleNext]);

  return (
    <section className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900">
                तस्वीरों में भारत • Photo Stories
              </h3>
              <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>Web Stories</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Stories Reel: Swipeable portrait on Mobile, 4-Column Grid on Desktop */}
      <div className="flex sm:grid overflow-x-auto sm:overflow-visible gap-3 sm:gap-4 pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory sm:grid-cols-2 lg:grid-cols-4 -mx-1 px-1 sm:mx-0 sm:px-0">
        {photoList.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveIndex(idx)}
            className="w-[165px] xs:w-[185px] sm:w-auto shrink-0 snap-start aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden relative cursor-pointer group shadow-2xs hover:shadow-md border border-slate-200/90 transition-all duration-300 select-none bg-slate-950"
          >
            {/* Background Image */}
            <img
              src={item.imageUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
              alt={item.seoAltText || item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
              decoding="async"
            />

            {/* Top gradient & story badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-black/40" />

            {/* Story Indicator Ring on Mobile */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-white/15 shadow-xs">
                <Camera className="w-2.5 h-2.5 text-amber-400" />
                <span>{item.photosCount || 5} फ़ोटो</span>
              </span>

              {/* Mobile story badge */}
              <span className="sm:hidden w-2 h-2 rounded-full bg-amber-400 shadow-xs ring-2 ring-white/30" />
            </div>

            {/* Bottom Content Area - Clean, Never Overlaps */}
            <div className="absolute inset-x-0 bottom-0 p-3 pt-6 text-white space-y-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase flex items-center space-x-1 font-kd-meta drop-shadow-xs">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>

              <h4 className="text-xs sm:text-sm font-bold font-kd-headline leading-snug line-clamp-2 text-white group-hover:text-amber-200 transition drop-shadow-xs">
                {item.title}
              </h4>

              {item.caption && (
                <p className="text-[10px] text-slate-300 font-kd-body line-clamp-1 opacity-90 hidden xs:block">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Full-Screen Mobile Experience & Next/Prev Controls */}
      {activePhoto && activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-slate-800 text-white bg-slate-950/80">
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold font-kd-headline truncate">
                  {activePhoto.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                  ({activeIndex + 1}/{photoList.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                title="बंद करें (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Viewport with Prev / Next Navigation Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[260px] sm:min-h-[420px]">
              <img
                src={activePhoto.imageUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=1000&auto=format&fit=crop&q=80'}
                alt={activePhoto.seoAltText || activePhoto.title}
                className="w-full h-full max-h-[65vh] object-contain select-none"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg cursor-pointer border border-white/20 hover:scale-105"
                title="पिछली तस्वीर (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg cursor-pointer border border-white/20 hover:scale-105"
                title="अगली तस्वीर (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Bottom Bar with Location & Story Info */}
            <div className="p-3 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border-t border-slate-800">
              <div className="flex items-center space-x-2.5 flex-wrap">
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activePhoto.location}</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">विषय: {activePhoto.category}</span>
                {activePhoto.caption && (
                  <>
                    <span className="text-slate-500 hidden sm:inline">•</span>
                    <span className="text-slate-200 hidden sm:inline">{activePhoto.caption}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>खबरी दोस्त विजुअल डेस्क</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
