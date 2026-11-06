import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getVideos, getCategories } from '@/lib/data-source';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptLibrary from '@/components/PromptLibrary';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  const slugs = (categories || []).map((c) => ({ slug: c.slug }));
  return [{ slug: 'all' }, ...slugs];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === 'all') {
    return {
      title: 'All Categories — GetYourAIPrompt',
      description: 'Explore AI video prompts across all production styles.',
    };
  }
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} AI Video Prompts — Studio Blueprints`,
    description: `Curated ${category.name} commercial video prompts engineered for next-generation generative video.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const allCategories = await getCategories();
  const category = slug === 'all'
    ? { name: 'All Categories', slug: 'all', description: 'Complete library of video generation prompts.' }
    : allCategories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const { videos, total } = await getVideos({
    page: 1,
    limit: 8,
    category: slug === 'all' ? undefined : slug,
    includePrompt: false,
    status: 'published',
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-12 md:py-16 space-y-12">
          <div className="space-y-3 border-b border-white/10 pb-8">
            <div className="text-xs font-mono uppercase tracking-widest text-[#45A29E]">
              Style Category
            </div>
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-base text-[#C9D1D9] max-w-2xl leading-relaxed">
              {category.description || `Specialized video prompts for ${category.name} generation.`}
            </p>
          </div>

          {/* IN-BETWEEN ADVERTISEMENT: Top Leaderboard strip */}
          <section className="w-full">
            <AdSlot position="leaderboard" />
          </section>

          <Suspense fallback={<div className="py-20 text-center text-white/50 font-mono text-sm">Loading category prompts...</div>}>
            <PromptLibrary
              initialVideos={videos || []}
              initialTotal={total || 0}
              categories={allCategories || []}
              initialCategory={slug === 'all' ? 'all' : slug}
            />
          </Suspense>

          {/* IN-BETWEEN ADVERTISEMENT: Bottom Banner */}
          <section className="w-full pt-8">
            <AdSlot position="banner" />
          </section>
        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
