'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import VideoCard from './VideoCard';
import { CATEGORY_TABS, filterVideosByCategory, getTopTrendingVideos } from '@/lib/trending-filters';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomeTrendingTabs({ videos = [] }) {
  // First filter is 'featured' and active by default on page load.
  // "All Prompts" tab button has been removed.
  const [activeTab, setActiveTab] = useState('featured');

  const activeTabMeta = useMemo(() => {
    return CATEGORY_TABS.find((t) => t.id === activeTab) || CATEGORY_TABS[0];
  }, [activeTab]);

  // All matching videos for the category (for total count reference)
  const allCategoryVideos = useMemo(() => {
    return filterVideosByCategory(videos, activeTab);
  }, [videos, activeTab]);

  // Strictly show ONLY 8 videos in total for each category tab on the home page
  const displayedVideos = useMemo(() => {
    return getTopTrendingVideos(videos, activeTab, 8);
  }, [videos, activeTab]);

  return (
    <div className="space-y-8">
      {/* Tab Filter Switcher (Featured first, categories only, NO 'All' button) */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-5">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:pb-0">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer sm:px-4 sm:py-2.5 sm:rounded-xl ${
                  isActive
                    ? 'bg-[#45A29E] text-[#0a0e14] shadow-[0_0_14px_rgba(69,162,158,0.5)] font-bold'
                    : 'bg-[#141d28] text-[#C9D1D9] hover:text-white hover:bg-[#1a2533] border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status Indicator & Quick Link */}
        <div className="hidden items-center gap-3 text-xs font-mono text-[#8B949E] sm:flex">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" />
            <span>Showing top {displayedVideos.length} {activeTabMeta.label} formulas</span>
          </div>
          <Link
            href={activeTabMeta.href}
            className="hidden sm:inline-flex items-center gap-1 text-[#66FCF1] hover:underline"
          >
            <span>View all in Browse →</span>
          </Link>
        </div>
      </div>

      {/* Masonry Gallery of strictly 8 Cards (Height dynamic per aspect ratio) */}
      {displayedVideos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#141d28]/40 border border-white/5 space-y-2">
          <p className="text-sm font-medium text-[#C9D1D9]">No prompt blueprints found in this section yet.</p>
          <p className="text-xs text-[#8B949E]">Check out the Prompt Library to browse all commercial blueprints.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-7 [column-fill:_balance] [&>article]:mb-7">
          {displayedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {/* View More in [Category] CTA Card below the section */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-[#141d28] border border-white/10 glass-panel gap-6 max-[640px]:gap-4 max-[360px]:p-4">
        <div className="space-y-1.5 text-center sm:text-left max-[640px]:w-full">
          <div className="text-base sm:text-lg font-['Space_Grotesk'] font-bold text-white flex items-center justify-center sm:justify-start gap-2.5 max-[640px]:flex-col max-[640px]:gap-2 max-[640px]:text-center">
            <Sparkles className="w-4 h-4 text-[#66FCF1]" />
            <span>Looking for more {activeTabMeta.label} prompts?</span>
            {allCategoryVideos.length > 8 && (
              <span className="text-xs font-mono font-medium text-[#45A29E] bg-[#45A29E]/10 px-2.5 py-0.5 rounded-full border border-[#45A29E]/30 max-[640px]:mx-auto">
                +{allCategoryVideos.length - 8} more available
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-xl leading-relaxed max-[640px]:mx-auto max-[640px]:px-3">
            Access our complete repository of {activeTabMeta.label.toLowerCase()} video prompt formulas with progressive loading, aspect ratio filtering, and instant clipboard copy in the Browse Library.
          </p>
        </div>

        <Link
          href={activeTabMeta.href}
          className="btn-primary text-xs sm:text-sm px-7 py-3.5 shrink-0 flex items-center gap-2 group cursor-pointer shadow-lg w-full sm:w-auto justify-center"
        >
          <span>View More {activeTabMeta.label} Prompts</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#0a0e14]" />
        </Link>
      </div>
    </div>
  );
}
