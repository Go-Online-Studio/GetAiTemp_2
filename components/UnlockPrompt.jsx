'use client';

import { useState, useEffect } from 'react';
import RewardedUnlock from './RewardedUnlock';

/**
 * UnlockPrompt Component
 * Controls prompt locked/unlocked state, localStorage persistence,
 * API unlock request, and prompt copy feedback.
 */
export default function UnlockPrompt({ videoId, initialTool = '', prompt = '' }) {
  const [unlocked, setUnlocked] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [aiTool, setAiTool] = useState(initialTool);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const storageKey = `unlocked_prompt_${videoId}`;

  // 1. Check localStorage on mount so refresh doesn't re-lock
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.prompt) {
          setPromptText(parsed.prompt);
          if (parsed.aiTool) setAiTool(parsed.aiTool);
          setUnlocked(true);
        }
      }
    } catch (e) {
      // LocalStorage access restricted or unavailable
    }
  }, [storageKey]);

  // 2. Called when Google rewarded ad is completed
  const handleRewardGranted = async () => {
    setIsUnlocking(true);
    setError('');

    if (prompt) {
      setPromptText(prompt);
      setUnlocked(true);
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          prompt,
          aiTool: initialTool,
          unlockedAt: Date.now(),
        }));
      } catch (e) {}
      setIsUnlocking(false);
      return;
    }

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to unlock prompt');
      }

      setPromptText(data.prompt);
      if (data.aiTool) setAiTool(data.aiTool);
      setUnlocked(true);

      // Persist unlock in localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          prompt: data.prompt,
          aiTool: data.aiTool,
          unlockedAt: Date.now(),
        }));
      } catch (e) {}
    } catch (err) {
      console.error('Unlock error:', err);
      setError(err.message || 'Error unlocking prompt. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // 3. Copy prompt action with feedback
  const handleCopy = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {!unlocked ? (
        <>
          {/* Unlock action button */}
          <RewardedUnlock onRewardGranted={handleRewardGranted} isUnlocking={isUnlocking} />

          {error && (
            <div style={{ color: '#c02626', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Locked prompt placeholder strictly matching UI template */}
          <div style={{ border: '1px solid #13233F', padding: '16px' }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: '#08788A',
            }}>
              PROMPT · LOCKED
            </div>
            <div style={{ height: '10px', background: '#B5D8E0', marginTop: '16px' }} />
            <div style={{ height: '10px', background: '#B5D8E0', marginTop: '10px', width: '92%' }} />
            <div style={{ height: '10px', background: '#B5D8E0', marginTop: '10px', width: '96%' }} />
            <div style={{ height: '10px', background: '#B5D8E0', marginTop: '10px', width: '58%' }} />
          </div>
        </>
      ) : (
        /* Unlocked prompt box with copy state */
        <div style={{
          border: '1px solid #13233F',
          padding: '16px',
          background: 'transparent',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: '#08788A',
            }}>
              PROMPT · UNLOCKED
            </div>
            {aiTool && (
              <span style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#3A4A66',
                fontWeight: 600,
              }}>
                {aiTool}
              </span>
            )}
          </div>

          <div style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#13233F',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {promptText}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: '#13233F',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '2px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {copied ? 'Copied to clipboard!' : 'Copy prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
