import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import AdSlot from '@/components/AdSlot';
import PageContainerWithGutters from '@/components/PageContainerWithGutters';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Contact Prompt Engineers — GetYourAIPrompt',
  description: 'Get in touch with our team of AI video prompt engineers for inquiries, prompt submissions, or brand sponsorships.',
};

export default async function ContactPage(props) {
  const searchParams = await props?.searchParams;
  const initialSubject = searchParams?.subject || 'General Inquiry';

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
      <Header />

      {/* Skyscraper Gutters flank container on desktop (Left & Right 160x600) */}
      <PageContainerWithGutters>
        <main className="w-full py-16 sm:py-20 lg:py-24 space-y-16">
          {/* Breadcrumb */}
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161f2c] border border-white/10 text-xs text-[#8B949E] hover:text-[#66FCF1] hover:border-[#66FCF1]/30 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* SPLIT SCREEN LAYOUT WITH GENEROUS BREATHING ROOM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
            
            {/* LEFT COLUMN CONTENT */}
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#45A29E]">
                  <Mail className="w-3.5 h-3.5 text-[#66FCF1]" />
                  <span>Direct Communications</span>
                </div>
                <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                  Get in Touch with Our Prompt Engineers
                </h1>
              </div>

              <div className="text-base sm:text-lg text-[#C9D1D9] leading-[1.8] space-y-5">
                <p>
                  Whether you have a question about a specific cinematic formula, want to submit a highly effective prompt you&apos;ve discovered, or are looking to partner with us for brand advertising, our team is here to help.
                </p>
                <div className="flex items-center gap-3 text-sm text-[#45A29E] font-medium pt-2">
                  <Clock className="w-4 h-4 text-[#66FCF1] shrink-0" />
                  <span>Fill out the form, and a member of our team will get back to you within 24–48 hours.</span>
                </div>
              </div>

              {/* Note on Technical Support per Blueprint */}
              <div className="p-7 sm:p-8 rounded-3xl bg-[#141d28] border border-[#45A29E]/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 text-base font-['Space_Grotesk'] font-bold text-white">
                  <AlertTriangle className="w-5 h-5 text-[#66FCF1] shrink-0" />
                  <span>Note on Technical Support:</span>
                </div>
                <p className="text-sm text-[#C9D1D9] leading-relaxed">
                  We provide the text-based prompt blueprints. We do not provide technical support, API troubleshooting, or account assistance for third-party generative video platforms. If your video generation fails on those platforms, please consult their respective support documentation.
                </p>
              </div>

              {/* Operational Info Card */}
              <div className="p-7 rounded-2xl bg-[#141d28]/70 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#8B949E]">
                <div className="space-y-1">
                  <span className="block font-mono uppercase tracking-wider text-[11px] text-white font-semibold">General Inquiries</span>
                  <span className="text-[#C9D1D9] font-mono text-sm">team@getyouraiprompt.com</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono uppercase tracking-wider text-[11px] text-white font-semibold">Engineering Ops</span>
                  <span className="text-[#C9D1D9] text-sm">Mon – Fri · 9am – 6pm EST</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Form */}
            <div className="lg:col-span-6 w-full space-y-8">
              <ContactForm initialSubject={initialSubject} />
              
              {/* Contextual Ad Placement below contact form */}
              <AdSlot position="medium-rectangle" />
            </div>

          </div>

          {/* IN-BETWEEN SECTION ADVERTISEMENT: Bottom Banner before Footer */}
          <section className="w-full pt-8">
            <AdSlot position="banner" />
          </section>
        </main>
      </PageContainerWithGutters>

      <Footer />
    </div>
  );
}
