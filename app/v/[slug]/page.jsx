import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVideoBySlug, getVideos } from '@/lib/data-source';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import PromptBox from '@/components/PromptBox';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import VideoCard from '@/components/VideoCard';
import { ArrowLeft, Sparkles, Clapperboard, Monitor, Clock, Cpu } from 'lucide-react';

export const revalidate = 60;

export async function generateStaticParams() {
  const { videos } = await getVideos({ limit: 100 });
  return (videos || []).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const video = await getVideoBySlug(slug, false);

    if (!video) {
      return { title: 'Video Prompt Not Found' };
    }

    const title = `${video.title} — AI Video Prompt Blueprint`;
    const description = video.description || `Copy the exact AI video prompt for ${video.title}. Verified camera directives and lighting setup.`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getyouraiprompt.com';
    const canonicalUrl = `${siteUrl}/v/${video.slug}`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'GetYourAIPrompt',
        type: 'video.other',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (e) {
    return { title: 'AI Video Prompt' };
  }
}

export default async function VideoPage({ params }) {
  const { slug } = await params;

  // Retrieve video including prompt
  const video = await getVideoBySlug(slug, true);

  if (!video) {
    notFound();
  }

  // Related videos
  const categorySlug = video.category?.slug || 'all';
  const { videos: relatedVideos } = await getVideos({
    category: categorySlug,
    limit: 5,
  });

  const filteredRelated = (relatedVideos || [])
    .filter((v) => v.slug !== video.slug)
    .slice(0, 4);

  const categoryName = video.category?.name || 'Commercial';
  const modelName = video.aiTool || 'Studio AI';
  const promptRequiresReferenceImage = /\b(?:reference image|product image|attach|upload|image-to-video)\b/i.test(video.prompt || '');
  const description = video.description?.trim()
    || `A ${categoryName.toLowerCase()} video prompt blueprint for ${video.title}, prepared for ${modelName}.`;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-10 md:py-14 space-y-16">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#8B949E]">
            <Link href="/videos" className="hover:text-[#66FCF1] flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prompt Library</span>
            </Link>
            <span aria-hidden="true" className="text-white/20">/</span>
            <Link href={`/category/${video.category?.slug || 'commercial'}`} className="hover:text-white transition-colors">
              {categoryName}
            </Link>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="text-[#C9D1D9] truncate max-w-[200px]">{video.title}</span>
          </div>

          {/* 60/40 SPLIT-SCREEN LAYOUT FOR DESKTOP (PER BLUEPRINT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Large Video Player & Technical Metadata (60% Desktop Split) */}
            <div className="lg:col-span-7 lg:self-stretch space-y-8">
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <VideoPlayer
                  videoId={video._id}
                  videoUrl={video.videoUrl}
                  thumbnailUrl={video.thumbnailUrl}
                  title={video.title}
                  aspectRatio={video.aspectRatio || '16:9'}
                />
              </div>

              <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                {/* In-feed ad unit below video player */}
                <div className="pt-1">
                  <AdSlot position="below-video" />
                </div>

                {/* Structured Metadata Strip Below Video per Blueprint */}
                <div className="p-6 rounded-3xl bg-[#141d28] border border-white/10 shadow-lg space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
                    Production Specifications
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-sm">

                    {/* Aspect Ratio */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/5 text-[#45A29E] shrink-0">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B949E] uppercase font-mono">Aspect Ratio</div>
                        <div className="font-bold text-white mt-0.5">{video.aspectRatio || '16:9'}</div>
                      </div>
                    </div>

                    {/* Resolution */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/5 text-[#66FCF1] shrink-0">
                        <Clapperboard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B949E] uppercase font-mono">Resolution</div>
                        <div className="font-bold text-white mt-0.5">{video.resolution || '4K HDR'}</div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/5 text-[#45A29E] shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B949E] uppercase font-mono">Duration</div>
                        <div className="font-bold text-white mt-0.5">{video.duration ? `${video.duration} sec` : '10 sec'}</div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/5 text-[#66FCF1] shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B949E] uppercase font-mono">Category</div>
                        <div className="font-bold text-[#66FCF1] mt-0.5">{categoryName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Title, Technique Notes, Rewarded Prompt Container & Medium Rectangle Ad */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* H1 Title & Technique */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#45A29E] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
                  <span>{categoryName} Prompt Blueprint</span>
                </div>
                <div className="space-y-3">
                  <h1 className="font-['Space_Grotesk'] text-2xl font-bold leading-snug tracking-tight text-white sm:text-4xl">
                    {video.title}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#66FCF1]/30 bg-[#45A29E]/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-[#66FCF1]">
                    <Cpu className="h-3 w-3" />
                    {modelName}
                  </span>
                </div>
              </div>

              {/* One consolidated description and usage guide directly above the prompt. */}
              <section className="space-y-4 rounded-3xl border border-white/10 bg-[#141d28]/70 p-5 shadow-lg sm:p-6" aria-labelledby="prompt-guide-title">
                <div>
                  <h2 id="prompt-guide-title" className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    Prompt Directives & How to Use
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#C9D1D9]">
                    {description}
                  </p>
                </div>

                {(video.directorialTechnique || video.technique) && (
                  <p className="rounded-xl border border-[#45A29E]/30 bg-[#45A29E]/10 p-3 text-sm leading-relaxed text-[#C9D1D9]">
                    <span className="font-bold text-[#66FCF1]">Directorial technique: </span>
                    {video.directorialTechnique || video.technique}
                  </p>
                )}

                <div className="rounded-2xl border border-white/10 bg-[#0d1117]/70 p-4">
                  <h3 className="mb-2 text-xs font-mono font-semibold uppercase tracking-wide text-[#66FCF1]">
                    Recommended workflow
                  </h3>
                  <ol className="list-decimal space-y-2 pl-4 text-xs leading-relaxed text-[#C9D1D9] sm:text-sm">
                    <li>
                      <strong className="text-white">Generate the video in {modelName}.</strong>{' '}
                      This prompt is designed for {modelName}; other generators may interpret its camera and motion instructions differently.
                    </li>
                    <li>
                      <strong className="text-white">Prepare reference images separately.</strong>{' '}
                      {promptRequiresReferenceImage
                        ? `The prompt calls for an image input. Create or choose that still in an image tool, then upload it to ${modelName} if image references are supported.`
                        : `A source image is not required by this prompt. If you choose to use one, create it with an image tool and attach it in ${modelName} only if supported.`}
                    </li>
                    <li>
                      <strong className="text-white">Personalize before generating.</strong>{' '}
                      Replace bracketed placeholders, set the aspect ratio and duration in the video tool, then keep the scene, camera, and lighting directives together when you run it.
                    </li>
                  </ol>
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-white/10 bg-[#1c2636] px-2.5 py-1 text-[11px] font-mono text-[#8B949E]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* REWARDED AD GATED PROMPT CONTAINER:
                  Prompt is blurred and locked behind a sponsor ad until user watches */}
              <PromptBox
                promptText={video.prompt}
                aiTool={modelName}
                title={video.title}
                videoId={video._id}
                slug={video.slug}
              />

            </div>

          </div>

          {/* IN-BETWEEN SECTION BANNER ADVERTISEMENT */}
          <section className="w-full pt-6">
            <AdSlot position="banner" />
          </section>

          {/* RELATED VIDEOS SECTION */}
          {filteredRelated.length > 0 && (
            <section className="pt-16 border-t border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    More in {categoryName}
                  </h2>
                  <p className="text-sm text-[#8B949E]">
                    Explore other battle-tested commercial prompts.
                  </p>
                </div>
                <Link href={`/category/${categorySlug}`} className="text-sm font-semibold text-[#66FCF1] hover:underline">
                  View category →
                </Link>
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-7 [column-fill:_balance]">
                {filteredRelated.map((rel) => (
                  <VideoCard key={rel._id} video={rel} />
                ))}
              </div>
            </section>
          )}

          {/* BOTTOM LEADERBOARD AD */}
          <section className="w-full pt-8">
            <AdSlot position="leaderboard" />
          </section>

        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
