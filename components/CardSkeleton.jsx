import { getMediaAspectClass } from '@/lib/trending-filters';

export default function CardSkeleton({ aspectRatio = '16:9' }) {
  const mediaAspectClass = getMediaAspectClass(aspectRatio);

  return (
    <div className="relative flex flex-col bg-[#141d28] rounded-3xl border border-white/10 overflow-hidden shadow-lg break-inside-avoid mb-7 w-full inline-block align-top">
      {/* Media Thumbnail Skeleton matching natural aspect ratio */}
      <div className={`relative w-full ${mediaAspectClass} bg-[#182230] shimmer-effect shrink-0`}>
        <div className="absolute top-3 left-3 w-20 h-5 rounded-md bg-white/10" />
        <div className="absolute top-3 right-3 w-12 h-5 rounded-md bg-white/10" />
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4 bg-[#141d28]">
        <div className="space-y-3">
          {/* Category & duration */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 bg-white/10 rounded shimmer-effect" />
            <div className="h-3 w-8 bg-white/5 rounded shimmer-effect" />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-5 w-4/5 bg-white/15 rounded shimmer-effect" />
            <div className="h-5 w-2/3 bg-white/10 rounded shimmer-effect" />
          </div>

          {/* Technique */}
          <div className="space-y-1 pt-1">
            <div className="h-3 w-full bg-white/5 rounded shimmer-effect" />
            <div className="h-3 w-5/6 bg-white/5 rounded shimmer-effect" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 w-16 bg-white/10 rounded shimmer-effect" />
          <div className="h-6 w-16 bg-[#45A29E]/20 rounded-md shimmer-effect" />
        </div>
      </div>
    </div>
  );
}
