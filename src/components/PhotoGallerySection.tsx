import React, { useState } from 'react';
import { Camera, Eye, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoStoryItem } from '../types/news';
import { INITIAL_PHOTO_STORIES } from '../data/portalDefaults';

interface PhotoGallerySectionProps {
  customPhotoStories?: PhotoStoryItem[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  customPhotoStories,
}) => {
  const [activePhoto, setActivePhoto] = useState<PhotoStoryItem | null>(null);

  const photoList =
    customPhotoStories && customPhotoStories.length > 0
      ? customPhotoStories
      : INITIAL_PHOTO_STORIES;

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-['Rozha_One',serif] text-slate-900">
              तस्वीरों में भारत • Photo Stories
            </h3>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          विशेष फ़ोटो एलबम
        </span>
      </div>

      {/* Grid of Photo Stories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photoList.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xs border border-slate-200"
          >
            <img
              src={item.imageUrl}
              alt={item.seoAltText || item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Badges */}
            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Camera className="w-2.5 h-2.5 text-amber-400" />
              <span>{item.photosCount} फ़ोटो</span>
            </span>

            {/* Title Overlay */}
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <span className="text-[10px] text-amber-300 font-bold uppercase block flex items-center space-x-0.5">
                <MapPin className="w-2.5 h-2.5" />
                <span>{item.location}</span>
              </span>
              <h4 className="text-xs font-semibold leading-tight group-hover:text-amber-200 transition">
                {item.title}
              </h4>
              {item.caption && (
                <p className="text-[10px] text-slate-300 truncate mt-0.5">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 text-white">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-['Rozha_One',serif]">
                  {activePhoto.title}
                </span>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.seoAltText || activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-amber-400 font-medium">{activePhoto.location}</span>
                <span className="text-slate-400">विषय: {activePhoto.category}</span>
                {activePhoto.caption && (
                  <span className="text-slate-200 border-l border-slate-700 pl-3">
                    {activePhoto.caption}
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-[11px]">खबरी दोस्त फ़ोटो डेस्क</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
