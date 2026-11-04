import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — GetYourAIPrompt',
  description: 'Terms and conditions for utilizing GetYourAIPrompt commercial and cinematic AI video prompts.',
};

export default function TermsPage() {
  const currentDate = 'November 4, 2026';

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-16 sm:py-20 lg:py-24 space-y-12">
          {/* Breadcrumb */}
          <div className="max-w-[700px] mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161f2c] border border-white/10 text-xs text-[#8B949E] hover:text-[#66FCF1] hover:border-[#66FCF1]/30 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Constrained Measure Editorial Container (~65-70ch) Centered */}
          <article className="max-w-[700px] mx-auto space-y-12">
            
            {/* Header Block */}
            <div className="space-y-4 border-b border-white/10 pb-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#45A29E]">
                <Shield className="w-3.5 h-3.5 text-[#66FCF1]" />
                <span>Legal Agreement & Usage Terms</span>
              </div>
              
              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Terms of Service
              </h1>
              
              <div className="flex items-center gap-3 text-xs font-mono text-[#8B949E]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Last Updated: {currentDate}</span>
                <span>·</span>
                <span>Commercial License Directives</span>
              </div>
            </div>

            {/* Body Sections */}
            <div className="space-y-10 text-[15px] sm:text-base text-[#C9D1D9] leading-[1.8]">
              
              {/* Section 1 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    01
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Acceptance of Terms
                  </h2>
                </div>
                <p>
                  By accessing and using GetYourAIPrompt.com (&quot;the Website&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Website.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    02
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Description of Service
                  </h2>
                </div>
                <p>
                  GetYourAIPrompt provides a curated repository of text-based prompts intended for use with third-party generative AI platforms to create commercial, product, and cinematic video content.
                </p>
              </section>

              {/* IN-BETWEEN SECTION ADVERTISEMENT 1: Mid-Document Leaderboard */}
              <section className="w-full pt-2">
                <AdSlot position="leaderboard" />
              </section>

              {/* Section 3 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    03
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    AI Content Disclaimer & Liability
                  </h2>
                </div>
                <p>
                  The prompts provided are intended as structural guidelines. We do not guarantee the final video output, as AI generation involves algorithmic variance and randomness. Results may differ based on updates to third-party models, platform limitations, or your specific usage tiers.
                </p>
                <p>
                  The prompts are provided &quot;as-is&quot; without warranty of specific results, merchantability, or fitness for a particular purpose. We are not liable for any financial loss or production delays caused by the use of our prompts.
                </p>
              </section>

              {/* Section 4 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    04
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Third-Party Tool Compliance
                  </h2>
                </div>
                <p>
                  Users are strictly responsible for complying with the Terms of Service, Acceptable Use Policies, and licensing agreements of the respective AI platforms where they execute our prompts.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    05
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Intellectual Property & Fair Use
                  </h2>
                </div>
                <p>
                  The text prompts published on GetYourAIPrompt are freely provided for your personal and commercial video generation workflows. The compilation, curation, design system, and custom website branding remain the intellectual property of GetYourAIPrompt.
                </p>
              </section>

            </div>

            {/* IN-BETWEEN SECTION ADVERTISEMENT 2: Bottom Banner */}
            <section className="w-full pt-4">
              <AdSlot position="banner" />
            </section>
          </article>
        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
