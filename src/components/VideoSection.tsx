import React, { useState } from 'react';
import { Play, Tv, Radio, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { VideoNewsItem } from '../types/news';
import { INITIAL_VIDEOS } from '../data/portalDefaults';

interface VideoSectionProps {
  title?: string;
  youtubeId?: string;
  onSelectVideo?: (video: VideoNewsItem) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  title = 'लाइव वीडियो बुलेटिन',
  youtubeId = 'jfKfPfyJRdk',
  onSelectVideo,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoNewsItem>(INITIAL_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentYoutubeId = selectedVideo.youtubeId || youtubeId;

  return (
    <section
      id="live-video-section"
      className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-lg border border-slate-800 p-3.5 sm:p-4 scroll-mt-28"
    >
      {/* Compact Header Strip */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-white">
                {title}
              </h3>
              <span className="flex items-center space-x-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                <span>LIVE</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline">डिजिटल स्टूडियो कवरेज</span>
          <span className="text-red-500 font-bold">•</span>
          <span className="text-slate-300 font-medium">अपडेटेड 2026</span>
        </div>
      </div>

      {/* Compact Player & Playlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Main Video Player: 7 Cols */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
            {isPlaying ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${currentYoutubeId}?autoplay=1&mute=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="w-full h-full cursor-pointer relative"
              >
                <img
                  src={selectedVideo.thumbnailUrl}
                  alt={selectedVideo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-300 ring-4 ring-white/20">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold backdrop-blur-xs">
                  {selectedVideo.duration}
                </span>

                {selectedVideo.isLive && (
                  <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5"></span>
                    <span>लाइव कवरेज</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-2">
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block">
              {selectedVideo.category} • स्टूडियो विश्लेषण
            </span>
            <h4 className="text-xs sm:text-sm font-bold font-['Rozha_One',serif] text-white leading-snug">
              {selectedVideo.title}
            </h4>
          </div>
        </div>

        {/* Compact Playlist: 5 Cols */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-1.5">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-800">
            <span>अन्य मुख्य वीडियो बुलेटिन</span>
            <span className="text-[10px] text-amber-400">कुल {INITIAL_VIDEOS.length}</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[220px] sm:max-h-[250px] pr-1 scrollbar-thin">
            {INITIAL_VIDEOS.map((item) => {
              const isSelected = selectedVideo.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedVideo(item);
                    setIsPlaying(true);
                    if (onSelectVideo) onSelectVideo(item);
                  }}
                  className={`p-1.5 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-red-950/70 border-red-600 ring-1 ring-red-600/60'
                      : 'bg-slate-900 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="relative w-18 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-amber-400 uppercase block">
                      {item.category}
                    </span>
                    <h5 className="text-[11px] font-bold text-white leading-snug">
                      {item.title}
                    </h5>
                    <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">
                      {item.duration} {item.isLive && '• LIVE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
