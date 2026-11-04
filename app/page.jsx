import Link from 'next/link';
import { getVideos } from '@/lib/data-source';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import HomeTrendingTabs from '@/components/HomeTrendingTabs';
import PromptFormulaInspector from '@/components/PromptFormulaInspector';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const { videos } = await getVideos({ limit: 60, status: 'published' });
  const trendingVideos = videos || [];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-12 md:py-20 space-y-24 md:space-y-32">
          
          {/* HERO SECTION */}
          <section className="relative rounded-3xl p-8 sm:p-16 lg:p-24 overflow-hidden border border-white/10 hero-mesh-gradient text-center flex flex-col items-center shadow-2xl">
            {/* Subtle Ambient Light Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#66FCF1]/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-[#45A29E]/15 blur-[120px] rounded-full pointer-events-none" />

            {/* Status Kicker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161f2c] border border-white/10 text-xs font-mono uppercase tracking-widest text-[#45A29E] mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
              <span>Studio-Grade AI Video Prompt Blueprints</span>
            </div>

            {/* Headline H1 */}
            <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-8">
              Studio-Quality AI Video, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C9D1D9] to-[#66FCF1]">
                Powered by Perfect Prompts.
              </span>
            </h1>

            {/* Subheadline H2 */}
            <p className="text-base sm:text-xl text-[#C9D1D9] max-w-2xl font-normal leading-relaxed mb-12">
              Copy and paste proven, commercial-grade video prompts engineered for next-generation generative video. Stop guessing and start generating cinematic results.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link href="/videos" className="btn-primary w-full sm:w-auto text-base px-9 py-4 shadow-xl">
                <span>Browse Prompts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a href="#trending" className="btn-secondary w-full sm:w-auto text-base px-9 py-4">
                <span>Explore Trending</span>
              </a>
            </div>

            {/* Feature Directives Strip */}
            <div className="mt-16 pt-10 border-t border-white/10 w-full max-w-2xl flex flex-wrap items-center justify-around gap-4 text-xs text-[#8B949E] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#66FCF1]" />
                <span>4K Cinema Directives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#45A29E]" />
                <span>Optical Macro Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span>High Temporal Coherence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#66FCF1]/60" />
                <span>16:9 & 9:16 Ratios</span>
              </div>
            </div>
          </section>

          {/* IN-BETWEEN SECTION ADVERTISEMENT 1: Top Leaderboard */}
          <section className="w-full">
            <AdSlot position="leaderboard" />
          </section>

          {/* HOW IT WORKS (3-COLUMN ROW) */}
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
                From Prompt to Production in 3 Steps
              </h2>
              <p className="text-base text-[#8B949E] leading-relaxed">
                Engineered text blueprints designed for direct copy-paste execution into generative AI video pipelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#141d28] border border-white/10 hover:border-[#66FCF1]/30 transition-all card-glow flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#45A29E]/10 border border-[#45A29E]/30 text-2xl font-['Space_Grotesk'] font-bold text-[#45A29E] mb-6">
                    01
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">
                    Find your style
                  </h3>
                  <p className="text-sm sm:text-base text-[#C9D1D9] leading-relaxed">
                    Search our curated library of commercial AI video structures, camera rigs, and cinematic formulas.
                  </p>
                </div>
                <div className="text-xs font-mono text-[#8B949E] pt-4 border-t border-white/5">
                  Filtered by category & aspect ratio
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#141d28] border border-white/10 hover:border-[#66FCF1]/40 transition-all card-glow flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-2xl font-['Space_Grotesk'] font-bold text-[#66FCF1] mb-6">
                    02
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">
                    Copy the prompt
                  </h3>
                  <p className="text-sm sm:text-base text-[#C9D1D9] leading-relaxed">
                    Get the exact camera movements, lighting cues, and pacing structures with one click.
                  </p>
                </div>
                <div className="text-xs font-mono text-[#8B949E] pt-4 border-t border-white/5">
                  Instant clipboard copy ready
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#141d28] border border-white/10 hover:border-[#66FCF1]/30 transition-all card-glow flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#45A29E]/10 border border-[#45A29E]/30 text-2xl font-['Space_Grotesk'] font-bold text-[#45A29E] mb-6">
                    03
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">
                    Generate
                  </h3>
                  <p className="text-sm sm:text-base text-[#C9D1D9] leading-relaxed">
                    Paste into your generative video tool to produce your commercial in minutes.
                  </p>
                </div>
                <div className="text-xs font-mono text-[#8B949E] pt-4 border-t border-white/5">
                  Zero studio budget required
                </div>
              </div>
            </div>
          </section>

          {/* IN-BETWEEN SECTION ADVERTISEMENT 2: Mid-page Banner */}
          <section className="w-full">
            <AdSlot position="banner" />
          </section>

          {/* SIGNATURE ELEMENT: INTERACTIVE ANATOMY OF AN AI VIDEO PROMPT */}
          <section className="pt-2">
            <PromptFormulaInspector />
          </section>

          {/* IN-BETWEEN SECTION ADVERTISEMENT 3: Pre-Trending Leaderboard */}
          <section className="w-full">
            <AdSlot position="leaderboard" />
          </section>

          {/* TRENDING PROMPTS GRID WITH CATEGORY FILTERS (STRICT 8 ITEMS PER CATEGORY) */}
          <section id="trending" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-2">
                <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Trending Prompts
                </h2>
                <p className="text-sm sm:text-base text-[#8B949E]">
                  Highest unlocked video prompts this week with full scene directions.
                </p>
              </div>
              <Link href="/videos" className="text-sm font-semibold text-[#66FCF1] hover:underline flex items-center gap-1.5 self-start sm:self-auto">
                <span>Explore full library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <HomeTrendingTabs videos={trendingVideos} />
          </section>

          {/* IN-BETWEEN SECTION ADVERTISEMENT 4: Bottom Banner before Footer */}
          <section className="w-full pt-4">
            <AdSlot position="banner" />
          </section>

        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
