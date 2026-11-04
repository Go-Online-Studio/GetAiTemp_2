'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Copy, Check } from 'lucide-react';
import { getMediaAspectClass } from '@/lib/trending-filters';

export default function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);

  if (!video) return null;

  const categoryName = video.category?.name || (typeof video.category === 'string' ? video.category : 'Commercial');
  const mediaAspectClass = getMediaAspectClass(video.aspectRatio);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (video.videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  };

  const handleQuickCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (video.prompt) {
      let successful = false;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(video.prompt);
          successful = true;
        }
      } catch (err) {}

      if (!successful) {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = video.prompt;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          successful = document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch (err) {}
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col bg-[#141d28] rounded-3xl border border-white/10 overflow-hidden card-glow transition-all duration-300 break-inside-avoid mb-7 w-full inline-block align-top shadow-xl hover:border-[#66FCF1]/40"
    >
      <Link href={`/v/${video.slug}`} className="flex flex-col bg-[#141d28] w-full">
        {/* Media Container: Responsive Aspect Ratio (9:16 vertical, 16:9 landscape, etc.) */}
        <div className={`relative w-full ${mediaAspectClass} overflow-hidden bg-black/80 shrink-0`}>
          {/* Static Thumbnail Poster */}
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title || 'AI Video Prompt'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-105 z-[1] ${
                isHovered && isVideoLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              priority={video.featured}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[#16202c] flex items-center justify-center text-[#8B949E] z-[1]">
              <Play className="w-8 h-8 opacity-40" />
            </div>
          )}

          {/* Lazy Video Preview on Hover (only mounted when hovered to keep 1000+ cards high-performance) */}
          {video.videoUrl && isHovered && (
            <video
              ref={videoRef}
              src={video.videoUrl}
              muted
              loop
              playsInline
              autoPlay
              onPlaying={() => setIsVideoLoaded(true)}
              onCanPlay={() => setIsVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[2] ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Minimal CSS loading spinner while video is buffering on hover */}
          {isHovered && video.videoUrl && !isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]">
              <div className="w-8 h-8 rounded-full border-2 border-[#66FCF1]/30 border-t-[#66FCF1] animate-spin" />
            </div>
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141d28] via-transparent to-black/30 pointer-events-none z-[4]" />

          {/* Top Badges: Category & Ratio (NO model mentions) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-[5]">
            <span className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md bg-[#161f2c]/90 text-[#66FCF1] border border-[#66FCF1]/30 backdrop-blur-md shadow-sm">
              {categoryName}
            </span>

            <span className="text-[10px] font-mono text-[#C9D1D9] bg-black/80 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
              {video.aspectRatio || '16:9'}
            </span>
          </div>

          {/* Center Play Icon Indicator when not hovered */}
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[4] opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-md text-[#66FCF1] shadow-lg">
                <Play className="w-4 h-4 fill-[#66FCF1] ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Content Body with Ample Padding */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#8B949E]">
              <span className="text-[#45A29E] font-medium">{categoryName}</span>
              <span aria-hidden="true">·</span>
              <span>{video.duration ? `${video.duration}s` : '10s'}</span>
              {video.author && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-[110px]">{video.author}</span>
                </>
              )}
            </div>

            <h3 className="font-['Space_Grotesk'] font-bold text-base text-white group-hover:text-[#66FCF1] transition-colors line-clamp-1">
              {video.title}
            </h3>

            {video.technique && (
              <p className="text-xs text-[#C9D1D9] line-clamp-2 leading-relaxed">
                {video.technique}
              </p>
            )}
          </div>

          {/* Card Footer with Quick Copy */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#8B949E] font-mono text-[11px]">
              {video.unlocks ? `${video.unlocks.toLocaleString()} unlocks` : 'Free prompt'}
            </span>

            <button
              onClick={handleQuickCopy}
              title="Copy prompt text"
              className="inline-flex items-center gap-1.5 text-[#66FCF1] hover:text-white font-medium transition-colors py-1 px-2.5 rounded-md hover:bg-white/5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
