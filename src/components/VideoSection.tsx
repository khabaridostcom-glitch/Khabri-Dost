import React, { useState } from 'react';
import { Play, Tv } from 'lucide-react';
import { VideoNewsItem } from '../types/news';
import { INITIAL_VIDEOS } from '../data/portalDefaults';

interface VideoSectionProps {
  title?: string;
  youtubeId?: string;
  videos?: VideoNewsItem[];
  onSelectVideo?: (video: VideoNewsItem) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  title = 'लाइव वीडियो बुलेटिन',
  youtubeId = 'jfKfPfyJRdk',
  videos,
  onSelectVideo,
}) => {
  const effectiveVideos = videos && videos.length > 0 ? videos : INITIAL_VIDEOS;
  const initialFeatured = effectiveVideos.find((v) => v.isLive) || effectiveVideos[0];
  const [selectedVideo, setSelectedVideo] = useState<VideoNewsItem>(initialFeatured);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync when prop changes
  React.useEffect(() => {
    const active = effectiveVideos.find((v) => v.isLive) || effectiveVideos[0];
    setSelectedVideo(active);
  }, [videos]);

  const currentYoutubeId = selectedVideo.youtubeId || youtubeId;

  return (
    <section
      id="live-video-section"
      className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 p-3.5 sm:p-5 scroll-mt-28"
    >
      {/* Compact Header Strip */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold font-kd-headline text-slate-900 tracking-tight">
                {title}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-kd-meta">
          <span className="hidden sm:inline">डिजिटल स्टूडियो कवरेज</span>
        </div>
      </div>

      {/* Compact Player & Playlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Main Video Player: 7 Cols */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-2xs">
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
                  src={selectedVideo.thumbnailUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
                  alt={selectedVideo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-300 ring-4 ring-white/30">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2.5">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block font-kd-meta">
              {selectedVideo.category} • स्टूडियो विश्लेषण
            </span>
            <h4 className="text-sm sm:text-base font-bold font-kd-headline text-slate-900 leading-snug mt-0.5">
              {selectedVideo.title}
            </h4>
          </div>
        </div>

        {/* Compact Playlist: 5 Cols */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-2">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between pb-1.5 border-b border-slate-100 font-kd-meta">
            <span>अन्य मुख्य वीडियो बुलेटिन</span>
            <span className="text-[10px] text-red-600 font-bold">कुल {effectiveVideos.length}</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[230px] sm:max-h-[260px] pr-1 scrollbar-thin">
            {effectiveVideos.map((item) => {
              const isSelected = selectedVideo.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedVideo(item);
                    setIsPlaying(true);
                    if (onSelectVideo) onSelectVideo(item);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-red-50 border-red-300 ring-1 ring-red-400/80 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="relative w-18 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1517976487502-5f714249a5b4?w=800&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-red-600 uppercase block font-kd-meta">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 font-kd-headline">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
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
