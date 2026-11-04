'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { getOptimizedVideoUrl, getOptimizedImageUrl } from '@/lib/cloudinary-client';

export default function VideoPlayer({ videoId, videoUrl, thumbnailUrl, title, aspectRatio = '16:9' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const videoRef = useRef(null);

  const optimizedVideo = getOptimizedVideoUrl(videoUrl);
  const optimizedThumb = getOptimizedImageUrl(thumbnailUrl, 1080);
  const is916 = aspectRatio === '9:16';

  const recordView = async () => {
    if (hasRecordedView || !videoId) return;
    setHasRecordedView(true);
    try {
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });
    } catch (e) {}
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    recordView();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className={`relative w-full ${is916 ? 'aspect-[9/14] max-w-[420px] mx-auto' : 'aspect-video'} bg-[#0B0C10] rounded-[12px] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group`}>
      {videoUrl && isPlaying ? (
        <video
          ref={videoRef}
          src={optimizedVideo}
          controls
          autoPlay
          playsInline
          poster={optimizedThumb}
          className="w-full h-full object-contain bg-black"
          onPlay={recordView}
        />
      ) : (
        <div
          onClick={handlePlayClick}
          style={{ position: 'relative' }}
          className="w-full h-full relative cursor-pointer flex items-center justify-center overflow-hidden"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayClick(); }}
          aria-label={`Play generated video preview: ${title}`}
        >
          {optimizedThumb ? (
            <Image
              src={optimizedThumb}
              alt={title || 'AI Generated Video Preview'}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[#1F2833] flex items-center justify-center text-[#8E9BAE]">
              <Play className="w-12 h-12 opacity-50" />
            </div>
          )}

          {/* Cinematic Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 pointer-events-none" />

          {/* Center Play Button Overlay */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0B0C10]/80 border border-[#66FCF1]/60 flex items-center justify-center text-[#66FCF1] shadow-[0_0_24px_rgba(102,252,241,0.3)] group-hover:scale-110 group-hover:border-[#66FCF1] group-hover:bg-[#45A29E] group-hover:text-[#0B0C10] transition-all duration-300">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
          </div>

          {/* Quick HUD indicator */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-[#C5C6C7] pointer-events-none">
            <span className="font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
              Click to Play Result
            </span>
            <span className="font-mono bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
              {aspectRatio}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
