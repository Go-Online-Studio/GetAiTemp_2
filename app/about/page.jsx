import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us — Empowering Creators with Commercial AI Prompts',
  description: 'GetYourAIPrompt curates and refines production-grade AI video prompts engineered for next-generation video generators.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-16 sm:py-20 lg:py-24">
          {/* Breadcrumb */}
          <div className="mb-10 max-w-[760px] mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161f2c] border border-white/10 text-xs text-[#8B949E] hover:text-[#66FCF1] hover:border-[#66FCF1]/30 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Constrained Editorial Container (~65-70ch) Centered */}
          <article className="max-w-[760px] mx-auto space-y-12">
            
            {/* Header Block */}
            <div className="space-y-4 border-b border-white/10 pb-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#45A29E]">
                <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
                <span>About GetYourAIPrompt</span>
              </div>
              
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Empowering Creators with Commercial AI Prompts
              </h1>
              
              <p className="text-sm font-mono text-[#8B949E]">
                The blueprint repository for high-performance generative video.
              </p>
            </div>

            {/* Exact Story Copy with Generous Line-Height & Readability */}
            <div className="text-base sm:text-lg text-[#C9D1D9] leading-[1.85] space-y-8">
              <p>
                GetYourAIPrompt was built for marketers, filmmakers, and creators who need studio-quality video without the studio budget. The secret to great AI video isn&apos;t just the AI model itself—it&apos;s the prompt. We curate, test, and refine commercial and cinematic prompts optimized specifically for industry-leading AI video generators.
              </p>
              <p>
                Whether you are generating a 15-second product ad, a 3D e-commerce render, or a cinematic narrative sequence, our library gives you the exact camera movements, lighting cues, and pacing structures needed to get reliable, professional results. Our mission is to take the guesswork out of generative video and give you the blueprints to create instantly.
              </p>
            </div>

            {/* IN-BETWEEN SECTION ADVERTISEMENT 1: Mid-Story Banner */}
            <section className="w-full pt-4">
              <AdSlot position="leaderboard" />
            </section>

            {/* Core Pillars Cards (Equal Heights, Generous Padding) */}
            <div className="pt-8 border-t border-white/10">
              <div className="mb-6">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-tight">
                  Our Engineering Standards
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="text-2xl font-['Space_Grotesk'] font-bold text-[#66FCF1]">01</div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">Precision Directives</h3>
                    <p className="text-sm text-[#8B949E] leading-relaxed">
                      Tested lens mm focal lengths, f-stops, camera rigs, and realistic physical lighting angles that prevent hallucination.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#45A29E] pt-3 border-t border-white/5">
                    Eliminates AI warping
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="text-2xl font-['Space_Grotesk'] font-bold text-[#45A29E]">02</div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">100% Free Access</h3>
                    <p className="text-sm text-[#8B949E] leading-relaxed">
                      Unrestricted prompt copying supported purely by clean, non-intrusive sponsor ads. No paywalls or subscriptions.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#45A29E] pt-3 border-t border-white/5">
                    Open community index
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="text-2xl font-['Space_Grotesk'] font-bold text-white">03</div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">Production Alignment</h3>
                    <p className="text-sm text-[#8B949E] leading-relaxed">
                      Tailored syntaxes and camera motion flags verified across premier video generation pipelines.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#45A29E] pt-3 border-t border-white/5">
                    Tested on new releases
                  </div>
                </div>
              </div>
            </div>

            {/* IN-BETWEEN SECTION ADVERTISEMENT 2: Bottom Banner */}
            <section className="w-full pt-4">
              <AdSlot position="banner" />
            </section>

            {/* Bottom Action Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10">
              <Link href="/videos" className="btn-primary text-base px-8 py-3.5 shadow-xl w-full sm:w-auto">
                <span>Explore Prompt Library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="text-sm text-[#8B949E] hover:text-[#66FCF1] transition-colors flex items-center gap-1.5">
                <span>Submit your own prompt blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </article>
        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
