'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ============================================================================
 * Award-Winning AdSlot Component
 * ============================================================================
 * Provides zero-CLS (Cumulative Layout Shift) ad placements across all pages.
 * Supports Google AdSense, Google Ad Manager (GPT), and direct sponsor campaigns.
 *
 * SUPPORTED POSITIONS & DIMENSIONS:
 * ----------------------------------------------------------------------------
 * 1. 'skyscraper-left'  : 160x600 / 120x600 vertical ad in the left screen gutter.
 * 2. 'skyscraper-right' : 160x600 / 120x600 vertical ad in the right screen gutter.
 * 3. 'banner'           : Full-width horizontal strip between major sections.
 * 4. 'leaderboard'      : 728x90 standard horizontal banner between content modules.
 * 5. 'medium-rectangle' : 300x250 slot placed directly below the prompt container.
 * 6. 'below-video'      : In-feed slot placed below the video player / specs.
 * 7. 'native-grid'      : Card-shaped ad matching VideoCard geometry in grids.
 *
 * GOOGLE ADSENSE CONFIGURATION INSTRUCTIONS:
 * ----------------------------------------------------------------------------
 * To activate live ads in production:
 * 1. Update your `.env.local` or hosting provider environment variables:
 *      NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_BANNER=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_LEFT=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_RIGHT=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_BELOW_PROMPT=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_BELOW_VIDEO=XXXXXXXXXX
 *      NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED=XXXXXXXXXX
 * 2. In Google AdSense Dashboard:
 *      - Create a "Display ad unit" -> Choose "Vertical" (160x600) for Skyscrapers.
 *      - Create a "Display ad unit" -> Choose "Horizontal" (728x90 / responsive) for Banners.
 *      - Create an "In-feed ad unit" -> Choose "Card" for Native Grid.
 * ============================================================================
 */
export default function AdSlot({ position = 'banner', className = '', style = {} }) {
  const adRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adPushed, setAdPushed] = useState(false);
  const [isAuthorizedHost, setIsAuthorizedHost] = useState(false);

  // Environment variable lookup with fallback defaults
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4726881193237202';
  const slot01 = process.env.NEXT_PUBLIC_ADSENSE_SLOT_01 || '7039432431';
  const slot02 = process.env.NEXT_PUBLIC_ADSENSE_SLOT_02 || '8755838785';

  const slotMap = {
    'native-grid': process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED || slot02,
    'medium-rectangle': process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_PROMPT || slot02,
    'below-video': process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_VIDEO || slot01,
    'below-prompt': process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_PROMPT || slot02,
    'banner': process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || slot01,
    'leaderboard': process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD || slot01,
    'skyscraper-left': process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_LEFT || slot01,
    'skyscraper-right': process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER_RIGHT || slot02,
  };

  const slot = slotMap[position] || slot01;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const isLocalhost = host === 'localhost' || host === '127.0.0.1';
      setIsAuthorizedHost(!isLocalhost);
    }
  }, []);

  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && isAuthorizedHost && client && slot && !adPushed) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdPushed(true);
        }
      } catch (err) {
        console.warn('AdSense push caught safely:', err);
      }
    }
  }, [isVisible, isAuthorizedHost, client, slot, adPushed]);

  // --------------------------------------------------------------------------
  // 1. SKYSCRAPER ADS (Left & Right Gutters beside the containers)
  // --------------------------------------------------------------------------
  if (position === 'skyscraper-left' || position === 'skyscraper-right') {
    const isLeft = position === 'skyscraper-left';
    return (
      <div
        ref={adRef}
        aria-label={`Advertisement Skyscraper ${isLeft ? 'Left' : 'Right'}`}
        className={`w-[140px] 2xl:w-[160px] min-h-[600px] h-[600px] rounded-2xl bg-[#141d28]/70 border border-white/10 glass-panel p-3.5 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden backdrop-blur-md transition-all hover:border-[#66FCF1]/30 ${className}`}
        style={style}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#45A29E]/40 to-transparent" />

        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-[#8B949E] border-b border-white/5 pb-2">
          <span className="text-[#45A29E] font-semibold">Sponsor</span>
          <span>160×600</span>
        </div>

        <div className="my-auto py-4 flex flex-col items-center justify-center space-y-3 w-full">
          {isAuthorizedHost && client && isVisible ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '160px', height: '600px' }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="vertical"
              data-full-width-responsive="false"
            />
          ) : (
            <div className="space-y-4 px-1">
              <div className="w-10 h-10 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/30 flex items-center justify-center mx-auto text-[#66FCF1] font-mono text-xs font-bold shadow-[0_0_12px_rgba(102,252,241,0.2)]">
                ADS
              </div>
              <div className="space-y-1">
                <div className="text-xs font-['Space_Grotesk'] font-bold text-white tracking-tight">
                  {isLeft ? 'AI Video Compute' : 'Cloud GPU Clusters'}
                </div>
                <div className="text-[11px] text-[#8B949E] leading-relaxed">
                  {isLeft
                    ? 'Deploy 4K generative video pipelines with zero latency.'
                    : 'Rent instant H100 & A100 GPUs for prompt synthesis.'}
                </div>
              </div>
              <div className="pt-2">
                <span className="inline-block text-[10px] font-mono font-semibold text-[#66FCF1] px-2.5 py-1 rounded bg-[#45A29E]/15 border border-[#45A29E]/30 hover:bg-[#45A29E]/30 transition-colors cursor-pointer">
                  Learn More →
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full pt-2 border-t border-white/5 text-[9px] text-[#8B949E] font-mono tracking-wider uppercase">
          Advertisement
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. NATIVE GRID CARD (Matches VideoCard geometry)
  // --------------------------------------------------------------------------
  if (position === 'native-grid') {
    return (
      <div
        ref={adRef}
        aria-label="Sponsored In-Feed Announcement"
        className={`native-grid-ad flex flex-col justify-between p-6 rounded-3xl bg-[#141d28]/70 border border-dashed border-[#45A29E]/40 min-h-[380px] text-center relative overflow-hidden backdrop-blur-md shadow-xl hover:border-[#66FCF1]/60 transition-all break-inside-avoid mb-7 w-full inline-block align-top ${className}`}
        style={style}
      >
        <div className="native-ad-header flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-[#8B949E]">
          <span className="text-[#45A29E] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" />
            Sponsored Blueprint
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Ad</span>
        </div>

        <div className="native-ad-content my-auto py-6 flex flex-col items-center justify-center space-y-4">
          {isAuthorizedHost && client && isVisible ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '240px' }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="native-ad-promo space-y-3 max-w-[240px] mx-auto">
              <div className="native-ad-icon w-12 h-12 rounded-2xl bg-gradient-to-br from-[#45A29E]/20 to-[#141d28] border border-[#45A29E]/40 flex items-center justify-center mx-auto text-[#66FCF1] font-mono text-sm font-bold shadow-[0_0_16px_rgba(102,252,241,0.25)]">
                GPU
              </div>
              <div className="native-ad-title text-base font-['Space_Grotesk'] text-white font-bold leading-snug">
                Accelerate Generative Video Production
              </div>
              <p className="native-ad-description text-xs text-[#8B949E] leading-relaxed">
                Unlock enterprise GPU instances optimized for large-scale camera synthesis and commercial rendering.
              </p>
              <div className="pt-2">
                <span className="native-ad-cta inline-flex items-center gap-1.5 text-xs font-semibold text-[#66FCF1] bg-[#45A29E]/15 px-3.5 py-1.5 rounded-xl border border-[#45A29E]/30 hover:bg-[#45A29E]/30 transition-all cursor-pointer">
                  Explore GPU Cloud →
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="native-ad-footer text-[10px] text-[#8B949E] font-mono uppercase tracking-wider pt-3 border-t border-white/5">
          Advertisement · Supports Free Video Blueprints
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. MEDIUM RECTANGLE / BELOW-PROMPT (300x250)
  // --------------------------------------------------------------------------
  if (position === 'medium-rectangle' || position === 'below-prompt' || position === 'below-video') {
    return (
      <div
        ref={adRef}
        aria-label="Sponsored Content 300x250"
        className={`w-full max-w-[360px] mx-auto min-h-[260px] rounded-2xl bg-[#141d28]/70 border border-white/10 glass-panel flex flex-col items-center justify-between p-4.5 relative overflow-hidden shadow-xl backdrop-blur-md ${className}`}
        style={style}
      >
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#8B949E] uppercase tracking-wider mb-2">
          <span className="text-[#45A29E] font-semibold">Sponsored Recommendation</span>
          <span>300×250</span>
        </div>

        {isAuthorizedHost && client && isVisible ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="rectangle"
          />
        ) : (
          <div className="text-center py-6 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#45A29E]/10 border border-[#45A29E]/30 flex items-center justify-center mx-auto text-[#66FCF1] font-mono text-xs font-bold">
              AI
            </div>
            <div className="text-xs font-['Space_Grotesk'] font-bold text-white">
              Studio Video Generator Pipeline
            </div>
            <p className="text-[11px] text-[#8B949E] max-w-[220px] mx-auto leading-relaxed">
              Direct API integrations for high-speed automated video generation.
            </p>
          </div>
        )}

        <div className="text-[9px] font-mono text-[#8B949E] uppercase tracking-wider pt-2 border-t border-white/5 w-full text-center">
          Advertisement
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. BANNER / LEADERBOARD (Horizontal In-Between Sections)
  // --------------------------------------------------------------------------
  return (
    <div
      ref={adRef}
      aria-label="Horizontal Banner Advertisement"
      className={`w-full min-h-[96px] rounded-2xl bg-[#141d28]/70 border border-white/10 glass-panel flex flex-col items-center justify-center p-3.5 relative overflow-hidden shadow-xl backdrop-blur-md transition-all hover:border-white/20 ${className}`}
      style={style}
    >
      <div className="w-full flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-widest text-[#8B949E] mb-1">
        <span className="text-[#45A29E] font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1]" />
          Sponsored Partner Strip
        </span>
        <span>Leaderboard 728×90 / Responsive</span>
      </div>

      {isAuthorizedHost && client && isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="text-xs text-[#C9D1D9] py-2.5 px-4 flex flex-wrap items-center justify-center gap-4 text-center">
          <span className="font-['Space_Grotesk'] font-semibold text-white">
            High-Performance AI Video Cloud Partners
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="text-[#8B949E] text-xs">
            Commercial GPU clusters & zero-distortion video generation pipelines
          </span>
          <span className="text-[11px] font-mono text-[#66FCF1] bg-[#45A29E]/15 px-2.5 py-0.5 rounded border border-[#45A29E]/30">
            Official Cloud Tier
          </span>
        </div>
      )}
    </div>
  );
}
