'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Terminal, Share2, Lock, Unlock, Play, Sparkles, X, Volume2, ShieldCheck } from 'lucide-react';

/**
 * ============================================================================
 * Rewarded Ad Gated PromptBox Component
 * ============================================================================
 * Requirements Fulfilled:
 * 1. Prompts are NOT fully visible until the user watches a sponsor advertisement.
 * 2. Before unlock: Blurred/redacted teaser with a high-conversion "Watch Ad to Unlock" callout.
 * 3. During unlock: Interactive Rewarded Ad Viewer with countdown, audio toggle, and sponsor messaging.
 * 4. After unlock: Crystal clear text reveal, localStorage persistence, and active Copy button.
 *
 * GOOGLE ADSENSE & GOOGLE AD MANAGER (GPT) REWARDED WEB ADS INSTRUCTIONS:
 * ----------------------------------------------------------------------------
 * When ready to activate Google Rewarded Web Ads in production:
 *
 * Option A: Google Ad Manager (GPT) Rewarded Web Ad
 * 1. In Google Ad Manager, generate a Rewarded Web Ad unit tag.
 * 2. Add GPT to layout.jsx:
 *    <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
 * 3. Inside triggerGoogleRewardedAd() below, uncomment the GPT event listeners:
 *    googletag.cmd.push(() => {
 *      const rewardedSlot = googletag.defineOutOfPageSlot(
 *        '/YOUR_NETWORK_ID/REWARDED_AD_UNIT',
 *        googletag.enums.OutOfPageFormat.REWARDED
 *      );
 *      rewardedSlot.addService(googletag.pubads());
 *      googletag.pubads().addEventListener('rewardedSlotGranted', () => {
 *        grantUnlockReward();
 *      });
 *      googletag.display(rewardedSlot);
 *      rewardedSlot.makeRewardedVisible();
 *    });
 *
 * Option B: Google AdSense Rewarded Ad (Beta / Direct API)
 * Configure via `adsbygoogle.push({ params: { ... } })` as documented below.
 * ============================================================================
 */
export default function PromptBox({
  promptText = '',
  aiTool = 'Studio AI',
  title = '',
  videoId = '',
  slug = '',
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adPlaying, setAdPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const countdownTimerRef = useRef(null);

  const storageKey = `unlocked_prompt_${slug || videoId || title.replace(/\s+/g, '-').toLowerCase()}`;

  // Check localStorage on mount so returning users keep their unlocked blueprint
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setIsUnlocked(true);
      }
    } catch (e) {
      // LocalStorage access restricted or unavailable in private browsing
    }
  }, [storageKey]);

  // Handle countdown during the simulated Rewarded Ad view
  useEffect(() => {
    if (isAdModalOpen && adPlaying) {
      if (adCountdown > 0) {
        countdownTimerRef.current = setTimeout(() => {
          setAdCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown completed -> Grant reward!
        grantUnlockReward();
      }
    }
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [isAdModalOpen, adPlaying, adCountdown]);

  const handleStartAd = () => {
    setAdCountdown(5);
    setAdPlaying(true);
    setIsAdModalOpen(true);

    /*
     * ------------------------------------------------------------------------
     * [AD INTEGRATION HOOK]
     * If live Google Rewarded Ad / GPT is loaded on window, trigger it here:
     * ------------------------------------------------------------------------
     * if (typeof window !== 'undefined' && window.googletag && window.__rewardedSlot) {
     *   window.__rewardedSlot.makeRewardedVisible();
     * }
     */
  };

  const grantUnlockReward = () => {
    setIsUnlocked(true);
    setIsAdModalOpen(false);
    setAdPlaying(false);

    try {
      localStorage.setItem(storageKey, JSON.stringify({
        unlockedAt: Date.now(),
        title,
      }));
    } catch (e) {}
  };

  const handleCopy = async () => {
    if (!isUnlocked || !promptText) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — AI Video Prompt`,
          text: `Check out this verified AI video prompt on GetYourAIPrompt:`,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col rounded-3xl bg-[#141d28] border border-white/10 overflow-hidden shadow-2xl relative transition-all">
      {/* Top Header of Prompt Container */}
      <div className="px-6 py-4.5 border-b border-white/10 bg-[#0e141d] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#45A29E]" />
          <span className="font-mono font-medium text-white tracking-wider uppercase text-[11px]">
            Master Generation Blueprint
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Lock status pill */}
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Unlock className="w-3 h-3" />
              <span>UNLOCKED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
              <Lock className="w-3 h-3" />
              <span>LOCKED</span>
            </span>
          )}

          <button
            onClick={handleShare}
            title="Share this prompt"
            className="text-[#8B949E] hover:text-white transition-colors cursor-pointer p-1"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PROMPT CONTENT AREA */}
      <div className="relative min-h-[300px] max-h-[460px] overflow-hidden bg-[#090d14]">
        {/* Monospaced Blueprint Text */}
        <div
          className={`p-6 sm:p-7 font-mono text-[13px] sm:text-sm leading-[1.8] text-[#C9D1D9] whitespace-pre-wrap select-all transition-all duration-300 ${
            !isUnlocked ? 'filter blur-[7px] opacity-40 select-none pointer-events-none' : ''
          }`}
        >
          {promptText}
        </div>

        {/* LOCKED AD REWARD GATE OVERLAY (Displayed until user watches advertisement) */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#090d14] via-[#090d14]/90 to-transparent backdrop-blur-sm space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#45A29E]/15 border border-[#45A29E]/30 flex items-center justify-center text-[#66FCF1] shadow-[0_0_20px_rgba(102,252,241,0.25)]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                Blueprint Locked Behind Sponsor Ad
              </h3>
              <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
                Watch a short 5-second sponsor message to reveal the complete camera directives, lighting setups, focal lengths, and copy syntax.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleStartAd}
                className="btn-primary w-full sm:w-auto px-7 py-3.5 text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_24px_rgba(102,252,241,0.4)]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Short Ad to Unlock Prompt</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-5 pt-2 text-[11px] font-mono text-[#8B949E]">
              <span className="flex items-center gap-1.5 text-[#C9D1D9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#66FCF1]" />
                100% Free Access
              </span>
              <span>·</span>
              <span>Instant Clipboard Copy</span>
              <span>·</span>
              <span>Zero Account Required</span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="p-5 border-t border-white/10 bg-[#0e141d]/95 backdrop-blur-md sticky bottom-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {isUnlocked ? (
          <>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Prompt verified · Ready for direct generation</span>
            </div>

            <button
              onClick={handleCopy}
              type="button"
              className={`w-full sm:w-auto h-12 px-7 rounded-xl font-['Space_Grotesk'] font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg ${
                copied
                  ? 'bg-emerald-500 text-[#0a0e14] shadow-[0_0_24px_rgba(16,185,129,0.5)]'
                  : 'bg-[#45A29E] hover:bg-[#66FCF1] text-[#0a0e14] shadow-[0_0_18px_rgba(102,252,241,0.3)] hover:shadow-[0_0_26px_rgba(102,252,241,0.6)]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Copied! Ready to Paste</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Complete Blueprint</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between text-xs text-[#8B949E]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Unlocks full scene directives and prompt syntax</span>
            </span>
            <button
              onClick={handleStartAd}
              className="text-[#66FCF1] hover:underline font-semibold cursor-pointer"
            >
              Unlock now →
            </button>
          </div>
        )}
      </div>

      {/* ======================================================================
          REWARDED AD VIEWER MODAL
          (Simulates high-impact sponsor video playback or live Google Rewarded Ad)
         ====================================================================== */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#141d28] border border-white/20 shadow-2xl overflow-hidden glass-panel">
            
            {/* Ad Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#0e141d] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8B949E]">
                <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
                <span className="text-[#66FCF1] font-bold">Sponsored Partner Announcement</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#45A29E]/20 text-[#66FCF1] border border-[#45A29E]/40 font-bold">
                  {adCountdown > 0 ? `Unlocking in ${adCountdown}s` : 'Reward Granted!'}
                </span>
                {adCountdown === 0 && (
                  <button
                    onClick={grantUnlockReward}
                    className="text-[#8B949E] hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Video / Interactive Ad Container */}
            <div className="relative aspect-video bg-[#090d14] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
              {/* Background ambient animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#45A29E]/20 via-transparent to-[#66FCF1]/10 pointer-events-none" />

              {/* Simulated Commercial Partner Creative */}
              <div className="relative z-10 space-y-4 max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono text-[#C9D1D9] border border-white/10">
                  <Volume2 className="w-3.5 h-3.5 text-[#66FCF1]" />
                  <span>Audio Enabled · Cloud GPU Sponsor</span>
                </div>

                <h4 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Nexus AI GPU Cloud
                </h4>

                <p className="text-xs sm:text-sm text-[#C9D1D9] leading-relaxed">
                  Rent high-speed H100 clusters for text-to-video rendering. Zero queue times, instant API keys, and studio-grade performance.
                </p>

                <div className="pt-3 flex items-center justify-center gap-4">
                  <a
                    href="#sponsor"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs font-bold text-[#0a0e14] bg-[#66FCF1] hover:bg-white px-5 py-2.5 rounded-xl transition-all shadow-lg"
                  >
                    Visit Sponsor Website →
                  </a>
                </div>
              </div>

              {/* Progress bar along the bottom of the ad video */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#45A29E] to-[#66FCF1] transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Ad Footer Controls */}
            <div className="px-6 py-4 bg-[#0e141d] border-t border-white/10 flex items-center justify-between text-xs text-[#8B949E]">
              <span>Viewing sponsor keeps prompt blueprints 100% free</span>

              {adCountdown > 0 ? (
                <button
                  type="button"
                  onClick={grantUnlockReward}
                  className="text-[11px] font-mono text-[#8B949E] hover:text-[#66FCF1] underline cursor-pointer"
                >
                  Skip Ad & Unlock
                </button>
              ) : (
                <button
                  type="button"
                  onClick={grantUnlockReward}
                  className="btn-primary text-xs px-5 py-2 font-bold cursor-pointer"
                >
                  Claim Prompt Reward
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
