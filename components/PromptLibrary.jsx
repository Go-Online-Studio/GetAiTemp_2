'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';
import CardSkeleton from './CardSkeleton';
import AdSlot from './AdSlot';
import { Search, RotateCcw, ArrowDown, Sparkles } from 'lucide-react';

const BATCH_SIZE = 8;

export default function PromptLibrary({ initialVideos = [], categories = [], initialSearch = '', initialCategory = 'all' }) {
  const [search, setSearch] = useState(initialSearch);
  const [aspectRatioFilter, setAspectRatioFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState(initialCategory);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  // Synchronize styleFilter if initialCategory prop changes (e.g. from homepage category link)
  useEffect(() => {
    if (initialCategory) {
      setStyleFilter(initialCategory);
    }
  }, [initialCategory]);

  // Filter videos (pure category, ratio, search - NO Gemini / Flow AI model filters)
  const filteredVideos = useMemo(() => {
    return initialVideos.filter((video) => {
      // Aspect Ratio match
      if (aspectRatioFilter !== 'all') {
        if ((video.aspectRatio || '16:9') !== aspectRatioFilter) return false;
      }

      // Style & Category match
      if (styleFilter !== 'all') {
        const catSlug = (video.category?.slug || '').toLowerCase();
        const catName = (video.category?.name || '').toLowerCase();
        const style = (video.style || '').toLowerCase();
        const target = styleFilter.toLowerCase();
        const isMatch =
          catSlug === target ||
          catName.includes(target) ||
          style.includes(target) ||
          (target === 'social' && video.aspectRatio === '9:16');

        if (!isMatch) {
          return false;
        }
      }

      // Search query match
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = (video.title || '').toLowerCase().includes(query);
        const descMatch = (video.description || '').toLowerCase().includes(query);
        const promptMatch = (video.prompt || '').toLowerCase().includes(query);
        const tagsMatch = (video.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!titleMatch && !descMatch && !promptMatch && !tagsMatch) return false;
      }

      return true;
    });
  }, [initialVideos, aspectRatioFilter, styleFilter, search]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setIsLoadingMore(false);
  }, [search, aspectRatioFilter, styleFilter]);

  const hasMore = visibleCount < filteredVideos.length;

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Smooth realistic delay to display minimal CSS skeleton loader cards
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredVideos.length));
      setIsLoadingMore(false);
    }, 350);
  };

  // IntersectionObserver for dynamic auto-loading as user scrolls
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredVideos.length]);

  const handleReset = () => {
    setSearch('');
    setAspectRatioFilter('all');
    setStyleFilter('all');
    setVisibleCount(BATCH_SIZE);
  };

  const displayedVideos = filteredVideos.slice(0, visibleCount);

  // Build grid items with a Native Grid Ad inserted every 8th item
  const gridElements = useMemo(() => {
    const items = [];
    displayedVideos.forEach((video, index) => {
      items.push(<VideoCard key={video._id} video={video} />);
      if ((index + 1) % 8 === 0 && index + 1 < displayedVideos.length) {
        items.push(
          <AdSlot
            key={`native-ad-${index}`}
            position="native-grid"
          />
        );
      }
    });
    return items;
  }, [displayedVideos]);

  return (
    <div className="space-y-10">
      {/* Top Filter Bar per Blueprint */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141d28] border border-white/10 glass-panel space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          
          {/* Search Input with high contrast */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[#8B949E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompt formulas by camera, mood, subject..."
              className="w-full h-12 bg-[#1c2636] text-white placeholder-[#8B949E] text-sm pl-11 pr-16 rounded-xl border border-white/15 focus:border-[#66FCF1] focus:ring-2 focus:ring-[#66FCF1]/20 focus:outline-none transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8B949E] hover:text-white px-2 py-1 rounded bg-[#141d28] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid (NO model dropdown) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Aspect Ratio Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#8B949E] hidden sm:inline">Ratio:</span>
              <select
                value={aspectRatioFilter}
                onChange={(e) => setAspectRatioFilter(e.target.value)}
                className="h-11 bg-[#1c2636] text-white text-xs font-medium px-3.5 rounded-xl border border-white/15 focus:border-[#66FCF1] focus:outline-none cursor-pointer shadow-inner"
              >
                <option value="all">All Ratios</option>
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Vertical Reel</option>
              </select>
            </div>

            {/* Category / Style Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#8B949E] hidden sm:inline">Category:</span>
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="h-11 bg-[#1c2636] text-white text-xs font-medium px-3.5 rounded-xl border border-white/15 focus:border-[#66FCF1] focus:outline-none cursor-pointer shadow-inner"
              >
                <option value="all">All Categories</option>
                <option value="commercial">Commercial & Ads</option>
                <option value="cinematic">Cinematic</option>
                <option value="product-macro">Product Macro</option>
                <option value="social">Social & Reels</option>
                <option value="3d-motion">3D Motion</option>
                <option value="narrative">Narrative</option>
              </select>
            </div>

            {/* Reset button */}
            {(aspectRatioFilter !== 'all' || styleFilter !== 'all' || search) && (
              <button
                onClick={handleReset}
                className="h-11 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-medium text-[#66FCF1] bg-[#45A29E]/15 border border-[#45A29E]/30 hover:bg-[#45A29E]/25 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Count Feedback */}
        <div className="flex items-center justify-between text-xs text-[#8B949E] pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="text-white font-mono font-medium">{displayedVideos.length}</span>
            <span>of</span>
            <span className="text-[#66FCF1] font-mono font-semibold">{filteredVideos.length}</span>
            <span>prompt formulas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" />
            <span>Ready for instant clipboard copy</span>
          </div>
        </div>
      </div>

      {/* Main Grid with Dynamic Cards & Skeleton Loading */}
      {filteredVideos.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-[#141d28]/40 border border-white/5 space-y-4">
          <p className="text-lg text-white font-semibold">No prompts match your current filters</p>
          <p className="text-sm text-[#8B949E] max-w-md mx-auto leading-relaxed">
            Try resetting your category or search query to explore other commercial formulas.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 btn-secondary text-xs px-5 py-2.5"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Responsive Masonry Gallery for 1000+ cards */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-7 [column-fill:_balance]">
            {gridElements}

            {/* Skeleton Cards with alternating aspect ratios while dynamically loading */}
            {isLoadingMore && (
              <>
                <CardSkeleton aspectRatio="9:16" />
                <CardSkeleton aspectRatio="16:9" />
                <CardSkeleton aspectRatio="16:9" />
                <CardSkeleton aspectRatio="9:16" />
              </>
            )}
          </div>

          {/* Dynamic Scroll Sentinel & Load More Trigger */}
          <div ref={sentinelRef} className="pt-6 flex flex-col items-center justify-center">
            {hasMore ? (
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#141d28] border border-white/10 text-xs font-semibold text-[#C9D1D9] hover:text-white hover:border-[#66FCF1]/50 hover:bg-[#1a2636] transition-all cursor-pointer shadow-lg"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#66FCF1] border-t-transparent rounded-full animate-spin" />
                    <span>Loading more formulas...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-[#66FCF1]" />
                    <span>Load More Prompts ({filteredVideos.length - displayedVideos.length} remaining)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-xs font-mono text-[#8B949E] flex items-center gap-2 py-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>All {filteredVideos.length} curated blueprints loaded</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
