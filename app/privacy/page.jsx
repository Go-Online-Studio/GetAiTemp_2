import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — GetYourAIPrompt',
  description: 'Privacy Policy, advertising disclosure, and data practices for GetYourAIPrompt users.',
};

export default function PrivacyPage() {
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
                <Lock className="w-3.5 h-3.5 text-[#66FCF1]" />
                <span>User Data Protection & Privacy</span>
              </div>
              
              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Privacy Policy
              </h1>
              
              <div className="flex items-center gap-3 text-xs font-mono text-[#8B949E]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Last Updated: {currentDate}</span>
                <span>·</span>
                <span>Global Standard Compliance</span>
              </div>
            </div>

            {/* Body Sections with Strict Mathematical Heading Scale & Line-Height */}
            <div className="space-y-10 text-[15px] sm:text-base text-[#C9D1D9] leading-[1.8]">
              
              {/* Section 1 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    01
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Information We Collect
                  </h2>
                </div>
                <p>
                  We collect information you provide directly to us when you submit a prompt, use our contact form, or sign up for our newsletter. This includes your name, email address, and the contents of your message.
                </p>
                <p>
                  We also automatically collect standard usage analytics, including browser type, device type, IP address, and pages visited, to ensure the site functions correctly, eliminate layout errors, and understand user behavior.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    02
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Advertising, Cookies & Tracking
                  </h2>
                </div>
                <p>
                  This site relies on advertising revenue to remain free. Third-party vendors, including Google, use cookies and web beacons to serve ads based on a user&apos;s prior visits to this website or other websites on the internet.
                </p>
                <p>
                  These advertising cookies enable our partners to serve personalized advertisements to you based on your browsing history. You may opt out of personalized advertising by visiting the applicable ad network&apos;s settings (such as Google Ads Settings or the Network Advertising Initiative opt-out page).
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
                    How We Use Your Information
                  </h2>
                </div>
                <p>We use the information we collect to:</p>
                <ul className="space-y-2.5 pl-2 text-sm text-[#C9D1D9]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] mt-2 shrink-0" />
                    <span>Operate, maintain, and continuously improve the Website design and features.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] mt-2 shrink-0" />
                    <span>Respond directly to your prompt engineering questions and technical support requests.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] mt-2 shrink-0" />
                    <span>Track the popularity of specific AI prompt formulas to expand our curated library.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] mt-2 shrink-0" />
                    <span>Monitor against fraudulent activity, spam, or automated bot scraping.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    04
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Data Sharing and AI Training
                  </h2>
                </div>
                <p>
                  We respect your privacy. We do not sell, trade, or rent your personally identifiable information to third parties.
                </p>
                <p>
                  Furthermore, the search queries and direct interactions you have on GetYourAIPrompt are used strictly for our own web analytics and are not sold to data brokers.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    05
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Data Retention and Security
                  </h2>
                </div>
                <p>
                  We retain personal correspondence from contact inquiries only as long as necessary to address your request. We employ industry-standard encryption, SSL/TLS data transfer protocols, and secure cloud storage to protect your submissions against unauthorized access or tampering.
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-4 p-7 sm:p-8 rounded-2xl bg-[#141d28] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#45A29E]/15 text-[#66FCF1] font-mono text-xs font-bold border border-[#45A29E]/30">
                    06
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Contact Us
                  </h2>
                </div>
                <p>
                  If you have questions, feedback, or data requests regarding this Privacy Policy, please contact our team via our{' '}
                  <Link href="/contact" className="text-[#66FCF1] hover:underline font-semibold">
                    Contact Form
                  </Link>{' '}
                  or email us directly at{' '}
                  <span className="text-white font-mono text-sm">privacy@getyouraiprompt.com</span>.
                </p>
              </section>

            </div>

            {/* IN-BETWEEN SECTION ADVERTISEMENT 2: Bottom Banner before Footer */}
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
