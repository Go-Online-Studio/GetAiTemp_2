import { getVideos, getCategories } from '@/lib/data-source';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptLibrary from '@/components/PromptLibrary';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';

export const metadata = {
  title: 'Prompt Library — Studio AI Video Prompts & Blueprints',
  description: 'Explore the complete curated repository of commercial video prompts with exact camera angles and lighting setups.',
};

export const revalidate = 60;

export default async function VideosPage(props) {
  const searchParams = await props?.searchParams;
  const search = searchParams?.search || '';
  const category = searchParams?.category || 'all';

  const [categories, { videos, total }] = await Promise.all([
    getCategories(),
    getVideos({ limit: 100, includePrompt: true, status: 'published' }),
  ]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-12 md:py-16 space-y-12">
          {/* Page Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  Prompt Library
                </h1>
                <p className="text-base text-[#C9D1D9] max-w-2xl leading-relaxed">
                  Ready-to-generate text formulas engineered specifically for high-performance generative video.
                </p>
              </div>

              {/* Total Prompt Count Dynamically Displayed */}
              <div className="text-xs font-mono text-[#45A29E] bg-[#45A29E]/10 px-4 py-2 rounded-xl border border-[#45A29E]/25 self-start sm:self-auto shadow-sm">
                Total Verified Formulas: <span className="font-bold text-white ml-1">{total || videos.length}</span>
              </div>
            </div>
          </div>

          {/* IN-BETWEEN ADVERTISEMENT: Top Leaderboard strip */}
          <section className="w-full">
            <AdSlot position="leaderboard" />
          </section>

          {/* Interactive Library with Filters & Native Grid Ad every 8 items */}
          <PromptLibrary
            initialVideos={videos}
            categories={categories}
            initialSearch={search}
            initialCategory={category}
          />

          {/* IN-BETWEEN ADVERTISEMENT: Bottom Banner before Footer */}
          <section className="w-full pt-8">
            <AdSlot position="banner" />
          </section>
        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
