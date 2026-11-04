'use client';

import AdSlot from './AdSlot';

/**
 * ============================================================================
 * PageContainerWithGutters Component
 * ============================================================================
 * Flanks the main content container with Left and Right Skyscraper Ad units
 * in the page gutters on desktop screens (exactly matching the old website design,
 * but restyled with modern dark-mode glassmorphism and zero CLS).
 *
 * LAYOUT BEHAVIOR:
 * - On 1280px+ (xl / 2xl) screens: Left & Right Skyscrapers sit stickily beside
 *   the central container as the user scrolls down, delivering constant high-value
 *   ad viewability.
 * - On mobile/tablet (<1280px): Side gutters gracefully hide to ensure 100% full-width
 *   content fluidity without horizontal scrolling.
 * ============================================================================
 */
export default function PageContainerWithGutters({ children, className = '' }) {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 flex justify-center items-start gap-4 xl:gap-6 relative">
      {/* LEFT SKYSCRAPER AD GUTTER (160×600) */}
      <aside
        aria-label="Left Skyscraper Advertisement"
        className="hidden xl:block w-[140px] 2xl:w-[160px] shrink-0 sticky top-24 pt-2 z-10"
      >
        <AdSlot position="skyscraper-left" />
      </aside>

      {/* CENTER MAIN CONTENT CONTAINER */}
      <div className={`flex-1 max-w-7xl min-w-0 w-full ${className}`}>
        {children}
      </div>

      {/* RIGHT SKYSCRAPER AD GUTTER (160×600) */}
      <aside
        aria-label="Right Skyscraper Advertisement"
        className="hidden xl:block w-[140px] 2xl:w-[160px] shrink-0 sticky top-24 pt-2 z-10"
      >
        <AdSlot position="skyscraper-right" />
      </aside>
    </div>
  );
}
