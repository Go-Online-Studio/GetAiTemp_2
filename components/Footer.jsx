import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#090d14] mt-32 md:mt-40 pt-20 pb-16 text-sm text-[#8B949E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10 max-[768px]:gap-8">
          
          {/* Brand Col (6 cols on lg) */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5 max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#45A29E] to-[#161f2c] flex items-center justify-center border border-[#66FCF1]/30 group-hover:border-[#66FCF1] transition-colors shadow-[0_0_12px_rgba(102,252,241,0.2)]">
                <Film className="w-4 h-4 text-[#66FCF1]" />
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-xl text-white tracking-tight">
                GetYour<span className="text-[#66FCF1]">AI</span>Prompt
              </span>
            </Link>

            <p className="text-sm text-[#C9D1D9] max-w-md leading-relaxed max-[768px]:mx-auto max-[768px]:px-3">
              Curated commercial and cinematic video prompts engineered for next-generation generative video pipelines. Copy proven camera setups, lighting rigs, and pacing formulas with direct execution blueprints.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#8B949E] max-[768px]:justify-center">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161f2c] border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1]"></span>
                <span className="text-[#C9D1D9]">4K Cinema Directives</span>
              </div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161f2c] border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#45A29E]"></span>
                <span className="text-[#C9D1D9]">High Temporal Coherence</span>
              </div>
            </div>
          </div>

          {/* Prompt Formats (3 cols on lg) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4 max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center">
            <h4 className="font-['Space_Grotesk'] text-white text-xs font-bold uppercase tracking-wider">
              Core Formats
            </h4>
            <ul className="space-y-3.5 text-sm max-[768px]:text-center">
              <li>
                <Link href="/category/commercial" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Commercial & Ads
                </Link>
              </li>
              <li>
                <Link href="/category/cinematic" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Cinematic Narratives
                </Link>
              </li>
              <li>
                <Link href="/category/product-macro" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Product Macro & Luxury
                </Link>
              </li>
              <li>
                <Link href="/category/social" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  9:16 Social Reels
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-[#45A29E] hover:text-[#66FCF1] transition-colors font-medium">
                  Browse All Prompts →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal (3 cols on lg) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4 max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center">
            <h4 className="font-['Space_Grotesk'] text-white text-xs font-bold uppercase tracking-wider">
              Platform & Legal
            </h4>
            <ul className="space-y-3.5 text-sm max-[768px]:text-center">
              <li>
                <Link href="/about" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Contact Prompt Engineers
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=Prompt%20Submission" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Submit a Prompt
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#8B949E] hover:text-[#66FCF1] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8B949E] max-[768px]:text-center">
          <p className="max-[768px]:px-3">© {currentYear} GetYourAIPrompt. All rights reserved. Text prompts for generative AI models.</p>
          <div className="flex items-center gap-6 max-[768px]:justify-center">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
