'use client';

import { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import VideoCard from './VideoCard';
import AdSlot from './AdSlot';
import { Search, RotateCcw, ArrowDown } from 'lucide-react';
import { getLatestVideos } from '@/lib/trending-filters';

const BATCH_SIZE = 8;
const DESKTOP_COLUMN_GAP = 28;
const INITIAL_COLUMN_COUNT = 2;
const MOBILE_COLUMN_GAP = 8;

function getColumnCount(width) {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 2;
}

function getColumnGap(width) {
  return width < 768 ? MOBILE_COLUMN_GAP : DESKTOP_COLUMN_GAP;
}

function getColumnWidth(galleryWidth, columnCount, columnGap) {
  return Math.max(1, (galleryWidth - columnGap * (columnCount - 1)) / columnCount);
}

function getEstimatedItemHeight(item, columnWidth, columnGap) {
  if (item.type === 'ad') {
    const adHeight = columnWidth < 300 ? Math.min(240, Math.max(180, columnWidth * 1.2)) : 440;
    return adHeight + columnGap;
  }

  const [ratioWidth, ratioHeight] = (item.video.aspectRatio || '16:9').split(':').map(Number);
  const mediaHeight = ratioWidth && ratioHeight ? columnWidth * ratioHeight / ratioWidth : columnWidth * 9 / 16;
  return mediaHeight + columnGap;
}

function createGalleryEntries(videos, startIndex, totalCount) {
  const entries = [];

  videos.forEach((video, offset) => {
    const absoluteIndex = startIndex + offset;

    if (absoluteIndex > 0 && absoluteIndex % BATCH_SIZE === 0) {
      entries.push({ type: 'ad', key: `native-ad-${absoluteIndex}` });
    }

    entries.push({ type: 'video', key: `video-${video._id}`, video });
  });

  return entries.filter((entry) => entry.type !== 'ad' || Number(entry.key.split('-').at(-1)) < totalCount);
}

function distributeEntries(columns, entries, heights, columnWidth, columnGap) {
  entries.forEach((entry) => {
    let shortestColumn = 0;

    for (let index = 1; index < heights.length; index += 1) {
      if (heights[index] < heights[shortestColumn]) shortestColumn = index;
    }

    columns[shortestColumn].push(entry);
    heights[shortestColumn] += getEstimatedItemHeight(entry, columnWidth, columnGap);
  });
}

function createMasonryLayout(videos, visibleCount, totalCount, columnCount, columnWidth, columnGap) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = Array(columnCount).fill(0);
  const entries = createGalleryEntries(videos.slice(0, visibleCount), 0, totalCount);

  distributeEntries(columns, entries, heights, columnWidth, columnGap);
  return { columns, heights };
}

export default function PromptLibrary({ initialVideos = [], categories = [], initialSearch = '', initialCategory = 'all' }) {
  const [search, setSearch] = useState(initialSearch);
  const [aspectRatioFilter, setAspectRatioFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState(initialCategory);

  // Synchronize styleFilter if initialCategory prop changes (e.g. from homepage category link)
  useEffect(() => {
    if (initialCategory) {
      setStyleFilter(initialCategory);
    }
  }, [initialCategory]);

  // Filter videos (pure category, ratio, search - NO Gemini / Flow AI model filters)
  const filteredVideos = useMemo(() => {
    const sourceVideos = styleFilter === 'latest' ? getLatestVideos(initialVideos) : initialVideos;

    return sourceVideos.filter((video) => {
      // Aspect Ratio match
      if (aspectRatioFilter !== 'all') {
        if ((video.aspectRatio || '16:9') !== aspectRatioFilter) return false;
      }

      // Style & Category match
      if (styleFilter !== 'all' && styleFilter !== 'latest') {
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

  const initialVisibleCount = Math.min(BATCH_SIZE, filteredVideos.length);
  const [columnCount, setColumnCount] = useState(INITIAL_COLUMN_COUNT);
  const [columnGap, setColumnGap] = useState(MOBILE_COLUMN_GAP);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [columns, setColumns] = useState(() => createMasonryLayout(
    filteredVideos,
    initialVisibleCount,
    filteredVideos.length,
    INITIAL_COLUMN_COUNT,
    getColumnWidth(320, INITIAL_COLUMN_COUNT, MOBILE_COLUMN_GAP),
    MOBILE_COLUMN_GAP
  ).columns);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const galleryRef = useRef(null);
  const columnRefs = useRef([]);
  const columnsRef = useRef(columns);
  const columnHeightsRef = useRef(Array(columnCount).fill(0));
  const visibleCountRef = useRef(initialVisibleCount);
  const filteredVideosRef = useRef(filteredVideos);
  const isLoadingMoreRef = useRef(false);
  const loadMoreTimeoutRef = useRef(null);

  useEffect(() => {
    const updateColumns = () => {
      setColumnCount(getColumnCount(window.innerWidth));
      setColumnGap(getColumnGap(window.innerWidth));
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useLayoutEffect(() => {
    const sourceChanged = filteredVideosRef.current !== filteredVideos;
    const nextVisibleCount = sourceChanged
      ? Math.min(BATCH_SIZE, filteredVideos.length)
      : Math.min(visibleCountRef.current, filteredVideos.length);

    filteredVideosRef.current = filteredVideos;
    visibleCountRef.current = nextVisibleCount;
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);

    if (loadMoreTimeoutRef.current !== null) {
      window.clearTimeout(loadMoreTimeoutRef.current);
      loadMoreTimeoutRef.current = null;
    }

    const width = getColumnWidth(galleryRef.current?.clientWidth || 320, columnCount, columnGap);
    const nextLayout = createMasonryLayout(
      filteredVideos,
      nextVisibleCount,
      filteredVideos.length,
      columnCount,
      width,
      columnGap
    );

    columnsRef.current = nextLayout.columns;
    columnHeightsRef.current = nextLayout.heights;
    setColumns(nextLayout.columns);
    setVisibleCount(nextVisibleCount);
  }, [filteredVideos, columnCount, columnGap]);

  useLayoutEffect(() => {
    columnHeightsRef.current = columns.map((_, index) => (
      columnRefs.current[index]?.getBoundingClientRect().height || 0
    ));
  }, [columns]);

  const hasMore = visibleCount < filteredVideos.length;

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current || visibleCountRef.current >= filteredVideos.length) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    loadMoreTimeoutRef.current = window.setTimeout(() => {
      const startIndex = visibleCountRef.current;
      const nextVisibleCount = Math.min(startIndex + BATCH_SIZE, filteredVideos.length);
      const newVideos = filteredVideos.slice(startIndex, nextVisibleCount);
      const nextColumns = columnsRef.current.map((column) => [...column]);
      const nextHeights = columnHeightsRef.current.length === columnCount
        ? [...columnHeightsRef.current]
        : Array(columnCount).fill(0);
      const width = getColumnWidth(galleryRef.current?.clientWidth || 320, columnCount, columnGap);

      distributeEntries(
        nextColumns,
        createGalleryEntries(newVideos, startIndex, filteredVideos.length),
        nextHeights,
        width,
        columnGap
      );

      columnsRef.current = nextColumns;
      columnHeightsRef.current = nextHeights;
      visibleCountRef.current = nextVisibleCount;
      setColumns(nextColumns);
      setVisibleCount(nextVisibleCount);
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
      loadMoreTimeoutRef.current = null;
    }, 350);
  }, [columnCount, columnGap, filteredVideos]);

  // IntersectionObserver for dynamic auto-loading as user scrolls
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  useEffect(() => () => {
    if (loadMoreTimeoutRef.current !== null) {
      window.clearTimeout(loadMoreTimeoutRef.current);
    }
  }, []);

  const handleReset = () => {
    setSearch('');
    setAspectRatioFilter('all');
    setStyleFilter('all');
  };

  const displayedVideos = filteredVideos.slice(0, visibleCount);

  return (
    <div className="space-y-10">
      {/* Top Filter Bar per Blueprint */}
      <div className="filter-bar-container sticky top-[calc(var(--main-nav-height)_+_8px)] z-40 p-2 sm:p-3 max-[767px]:!px-2 max-[767px]:!py-1 !rounded-xl md:rounded-3xl bg-[#141d28]/95 border border-white/10 glass-panel space-y-2 max-[767px]:!space-y-0 shadow-xl">
        <div className="filter-controls-row flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 max-[767px]:!flex-row max-[767px]:!gap-2 max-[767px]:!overflow-x-auto">
          
          {/* Search Input with high contrast */}
          <div className="relative flex-1 max-w-lg max-[767px]:!w-40 max-[767px]:!min-w-[10rem] max-[767px]:!flex-none">
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="w-full h-10 max-[767px]:!h-8 bg-[#1c2636] text-white placeholder-[#8B949E] text-sm max-[767px]:!text-xs pl-9 pr-14 max-[767px]:!pr-9 rounded-xl max-[767px]:!rounded-lg border border-white/15 focus:border-[#66FCF1] focus:ring-2 focus:ring-[#66FCF1]/20 focus:outline-none transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8B949E] hover:text-white px-1.5 py-0.5 rounded bg-[#141d28] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid (NO model dropdown) */}
          <div className="flex flex-wrap items-center gap-3 max-[767px]:!flex-nowrap max-[767px]:!shrink-0 max-[767px]:!gap-2">
            {/* Aspect Ratio Dropdown */}
            <div className="flex items-center gap-2 max-[767px]:!gap-1">
              <span className="text-[11px] font-mono uppercase text-[#8B949E] hidden sm:inline">Ratio:</span>
              <select
                value={aspectRatioFilter}
                onChange={(e) => setAspectRatioFilter(e.target.value)}
                className="h-9 max-[767px]:!h-8 bg-[#1c2636] text-white text-xs font-medium px-3 max-[767px]:!px-1.5 rounded-xl max-[767px]:!rounded-lg border border-white/15 focus:border-[#66FCF1] focus:outline-none cursor-pointer shadow-inner"
              >
                <option value="all">All Ratios</option>
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Vertical Reel</option>
              </select>
            </div>

            {/* Category / Style Dropdown */}
            <div className="flex items-center gap-2 max-[767px]:!gap-1">
              <span className="text-[11px] font-mono uppercase text-[#8B949E] hidden sm:inline">Category:</span>
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="h-9 max-[767px]:!h-8 bg-[#1c2636] text-white text-xs font-medium px-3 max-[767px]:!px-1.5 rounded-xl max-[767px]:!rounded-lg border border-white/15 focus:border-[#66FCF1] focus:outline-none cursor-pointer shadow-inner"
              >
                <option value="all">All Categories</option>
                <option value="latest">Latest Trends</option>
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
                className="h-9 max-[767px]:!h-8 inline-flex items-center gap-1 px-3 max-[767px]:!px-1.5 rounded-xl max-[767px]:!rounded-lg text-xs font-medium text-[#66FCF1] bg-[#45A29E]/15 border border-[#45A29E]/30 hover:bg-[#45A29E]/25 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Count Feedback */}
        <div className="flex items-center justify-between text-xs text-[#8B949E] pt-3 border-t border-white/5 max-[767px]:hidden">
          <div className="flex items-center gap-2 max-[480px]:flex-wrap max-[480px]:justify-center max-[480px]:gap-x-1.5 max-[480px]:gap-y-1">
            <span>Showing</span>
            <span className="text-white font-mono font-medium">{displayedVideos.length}</span>
            <span>of</span>
            <span className="text-[#66FCF1] font-mono font-semibold">{filteredVideos.length}</span>
            <span>prompt formulas</span>
          </div>
          <div className="flex items-center gap-2 max-[768px]:justify-center">
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
          {/* Explicit columns keep existing cards in place as later batches append. */}
          <div
            ref={galleryRef}
            className="grid items-start"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              gap: `${columnGap}px`,
            }}
          >
            {columns.map((column, columnIndex) => (
              <div
                key={`masonry-column-${columnIndex}`}
                ref={(element) => { columnRefs.current[columnIndex] = element; }}
                data-masonry-column={columnIndex}
                className="flex min-w-0 flex-col gap-2 md:gap-7"
              >
                {column.map((item) => item.type === 'video' ? (
                  <VideoCard key={item.key} video={item.video} />
                ) : (
                  <AdSlot key={item.key} position="native-grid" />
                ))}
              </div>
            ))}
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
