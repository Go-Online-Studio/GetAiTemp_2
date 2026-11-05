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
        <main className="w-full py-4 sm:py-8 lg:py-12 space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* HERO SECTION */}
          <section className="relative rounded-3xl px-4 py-6 sm:px-10 sm:py-12 lg:px-16 lg:py-16 overflow-hidden border border-white/10 hero-mesh-gradient text-center flex flex-col items-center shadow-2xl">
            {/* Subtle Ambient Light Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#66FCF1]/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-[#45A29E]/15 blur-[120px] rounded-full pointer-events-none" />

            {/* Status Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161f2c] border border-white/10 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#45A29E] mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
              <span>Studio-Grade AI Video Prompt Blueprints</span>
            </div>

            {/* Headline H1 */}
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.05] mb-3">
              Studio-Quality AI Video, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C9D1D9] to-[#66FCF1]">
                Powered by Perfect Prompts.
              </span>
            </h1>

            {/* Subheadline H2 */}
            <p className="text-sm sm:text-base text-[#C9D1D9] max-w-xl font-normal leading-relaxed mb-5">
              Cinematic video prompts, ready to use.
            </p>

            <div className="flex items-center w-full sm:w-auto">
              <Link href="#trending" className="btn-primary w-full sm:w-auto text-sm px-7 py-2.5 shadow-xl">
                <span>Explore Prompts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div aria-label="How it works" className="mt-3 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap text-[11px] sm:text-xs font-mono text-[#C9D1D9]">
              <span>Find Style</span>
              <ArrowRight aria-hidden="true" className="w-3 h-3 text-[#45A29E]" />
              <span>Copy Prompt</span>
              <ArrowRight aria-hidden="true" className="w-3 h-3 text-[#45A29E]" />
              <span>Generate</span>
            </div>
          </section>

          {/* TRENDING PROMPTS GRID WITH CATEGORY FILTERS (STRICT 8 ITEMS PER CATEGORY) */}
          <section id="trending" className="space-y-5 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-2">
                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Trending Prompts
                </h2>
                <p className="text-sm sm:text-base text-[#8B949E]">
                  Top unlocked prompts this week.
                </p>
              </div>
              <Link href="/videos" className="hidden sm:flex text-sm font-semibold text-[#66FCF1] hover:underline items-center gap-1.5 self-start sm:self-auto">
                <span>Explore full library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <HomeTrendingTabs videos={trendingVideos} />
          </section>

          {/* IN-BETWEEN SECTION ADVERTISEMENT 3: Pre-Trending Leaderboard */}
          <section className="w-full">
            <AdSlot position="leaderboard" />
          </section>

          

          {/* SIGNATURE ELEMENT: INTERACTIVE ANATOMY OF AN AI VIDEO PROMPT */}
          <section className="pt-2">
            <PromptFormulaInspector />
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
