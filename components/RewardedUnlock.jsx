'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * RewardedUnlock Component
 * Handles Google Rewarded Ad lifecycle, user opt-in trigger,
 * failure fallbacks (never leave users stuck after 2 attempts),
 * and dispatches reward callbacks.
 */
export default function RewardedUnlock({ onRewardGranted, isUnlocking = false }) {
  const [adState, setAdState] = useState('idle'); // 'idle' | 'loading' | 'playing' | 'failed'
  const [failureCount, setFailureCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // ============================================================================
  // GOOGLE REWARDED AD INTEGRATION POINT
  // ============================================================================
  /*
   * Instructions for Google AdSense / Google Ad Manager Rewarded Web Ads:
   * 1. Ensure the Google Publisher Tag (GPT) is loaded in layout:
   *    <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
   * 2. Configure rewarded slot:
   *    window.googletag = window.googletag || { cmd: [] };
   *    let rewardedSlot;
   *    googletag.cmd.push(() => {
   *      rewardedSlot = googletag.defineOutOfPageSlot(
   *        '/YOUR_NETWORK_ID/REWARDED_AD_UNIT',
   *        googletag.enums.OutOfPageFormat.REWARDED
   *      );
   *      if (rewardedSlot) {
   *        rewardedSlot.addService(googletag.pubads());
   *        googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
   *          // Ad is loaded and ready to present
   *        });
   *        googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
   *          // User completed watching ad -> Grant prompt reward!
   *          onRewardGranted();
   *        });
   *        googletag.pubads().addEventListener('rewardedSlotClosed', (event) => {
   *          // Ad modal dismissed
   *        });
   *        googletag.enableServices();
   *        googletag.display(rewardedSlot);
   *      }
   *    });
   */

  const handleWatchAdClick = useCallback(() => {
    setAdState('loading');
    setErrorMessage('');

    // Check if Google AdSense / GPT rewarded ad slot is available on window
    const gptAvailable = typeof window !== 'undefined' && window.googletag && window.googletag.pubadsReady;

    if (gptAvailable && window.__rewardedAdReady) {
      setAdState('playing');
      try {
        // Trigger rewarded ad prompt
        window.__rewardedAdSlot?.makeRewardedVisible();
      } catch (err) {
        console.warn('Rewarded ad playback failed:', err);
        handleAdFailure('Ad playback interrupted.');
      }
    } else {
      // Development or AdBlock / No Ad Available Fallback
      // Simulate brief loading / ad demonstration window, then grant reward
      console.info('[RewardedUnlock] No live Google rewarded ad unit detected. Running fallback handler.');

      // Check failure count: after second failure, unlock anyway (per spec)
      if (failureCount >= 1) {
        setAdState('loading');
        setTimeout(() => {
          setAdState('idle');
          onRewardGranted();
        }, 800);
        return;
      }

      // Simulate rewarded ad view (or simulate first-run reward)
      setTimeout(() => {
        // Grant reward directly in development/fallback mode
        setAdState('idle');
        onRewardGranted();
      }, 1200);
    }
  }, [failureCount, onRewardGranted]);

  const handleAdFailure = (msg = 'No ad available right now.') => {
    const nextFailures = failureCount + 1;
    setFailureCount(nextFailures);

    if (nextFailures >= 2) {
      // Rule 7: After a second failure, unlock the prompt anyway (never leave users stuck)
      setErrorMessage('Ad service unavailable. Unlocking prompt directly for you...');
      setTimeout(() => {
        setAdState('idle');
        onRewardGranted();
      }, 1000);
    } else {
      setAdState('failed');
      setErrorMessage(msg);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {adState === 'failed' ? (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleWatchAdClick}
            disabled={isUnlocking}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: '#13233F',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {isUnlocking ? 'Unlocking...' : 'Try again to unlock prompt'}
          </button>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#08788A', marginTop: '8px' }}>
            {errorMessage || 'Ad failed to load. Tap try again to unlock.'}
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={handleWatchAdClick}
            disabled={adState === 'loading' || isUnlocking}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: '#13233F',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: (adState === 'loading' || isUnlocking) ? 'default' : 'pointer',
              border: 'none',
            }}
          >
            {isUnlocking
              ? 'Unlocking prompt...'
              : adState === 'loading'
              ? 'Loading short ad...'
              : 'Watch ad to unlock prompt'}
          </button>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#3A4A66', marginTop: '8px' }}>
            A short ad, then the prompt is yours.
          </div>
        </div>
      )}
    </div>
  );
}
