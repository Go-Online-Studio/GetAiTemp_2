'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { getOptimizedVideoUrl } from '@/lib/cloudinary-client';
import { getMediaAspectClass } from '@/lib/trending-filters';
import { recordViewApi } from '@/lib/api';

function VideoCard({ video }) {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  if (!video) return null;

  const mediaAspectClass = getMediaAspectClass(video.aspectRatio);
  const optimizedVideoUrl = getOptimizedVideoUrl(video.videoUrl, 480);

  const handleMouseEnter = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !video.videoUrl) return;
    setVideoError(false);
    setIsVideoLoaded(false);
    setIsPreviewActive(true);
  };

  const handleMouseLeave = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setIsPreviewActive(false);
    setIsVideoLoaded(false);
  };

  const handlePreviewToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPreviewActive) {
      setIsPreviewActive(false);
      setIsVideoLoaded(false);
      return;
    }

    setVideoError(false);
    setIsVideoLoaded(false);
    setIsPreviewActive(true);
  };

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="video-card-container group relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#141d28] shadow-xl transition-all duration-300 hover:border-[#66FCF1]/40"
    >
      <div className={`relative w-full ${mediaAspectClass} overflow-hidden bg-black/80`}>
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title || 'AI Video Prompt'}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className={`z-[1] object-cover transition-transform duration-500 group-hover:scale-105 ${
              isPreviewActive && isVideoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            priority={video.featured}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="z-[1] flex h-full w-full items-center justify-center bg-[#16202c] text-[#8B949E]">
            <Play className="h-8 w-8 opacity-40" />
          </div>
        )}

        {video.videoUrl && isPreviewActive && (
          <video
            src={optimizedVideoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            onPlaying={() => {
              setIsVideoLoaded(true);
              if (video._id) recordViewApi(video._id);
            }}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-300 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {isPreviewActive && !isVideoLoaded && !videoError && (
          <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#66FCF1]/30 border-t-[#66FCF1]" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <Link
          href={`/v/${video.slug}`}
          aria-label={`View ${video.title || 'AI video prompt'}`}
          title={video.title}
          className="absolute inset-0 z-[4] flex items-end"
        >
          <span className="video-card-title w-full line-clamp-1 bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-2.5 pt-8 font-['Space_Grotesk'] text-xs font-semibold leading-tight text-white sm:px-4 sm:pb-4 sm:text-base">
            {video.title}
          </span>
        </Link>

        {video.videoUrl && (
          <button
            type="button"
            onClick={handlePreviewToggle}
            aria-label={isPreviewActive ? `Pause preview of ${video.title}` : `Preview ${video.title}`}
            aria-pressed={isPreviewActive}
            className="touch-preview-button absolute right-2 top-2 z-[5] min-h-10 items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-2.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#66FCF1]"
          >
            {isPreviewActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>{isPreviewActive ? 'Pause' : 'Preview'}</span>
          </button>
        )}

        {videoError && (
          <span role="status" className="absolute left-2 right-2 top-12 z-[5] text-center text-[11px] text-white">
            Preview unavailable
          </span>
        )}
      </div>
    </article>
  );
}

export default memo(VideoCard);
