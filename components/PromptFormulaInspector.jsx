'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Camera, Sun, Cpu, Layers } from 'lucide-react';

const LAYERS = [
  { id: 'camera', label: '1. Camera Motion', icon: Camera },
  { id: 'subject', label: '2. Subject & Physics', icon: Sparkles },
  { id: 'lighting', label: '3. Optics & Lighting', icon: Sun },
  { id: 'parameters', label: '4. Engine Flags', icon: Cpu },
];

const SAMPLES = [
  {
    title: 'Luxury Chronograph Macro Commercial',
    category: 'Product Macro',
    format: '16:9 Landscape',
    layers: {
      camera: 'Ultra-slow 360-degree orbital dolly rotation, rising 15 degrees on the z-axis',
      subject: 'Rose gold luxury chronograph watch with exposed mechanical tourbillon movement',
      lighting: 'Anamorphic 85mm macro lens, deep rim lighting with soft golden hour tungsten reflection, zero lens distortion',
      parameters: '--ar 16:9 --motion 4 --fps 60 --cinematic-color'
    },
    insights: {
      camera: 'Orbital motion with a restrained motion value keeps the watch’s mechanical details stable across frames.',
      subject: 'Naming the watch material and exposed tourbillon anchors the model to one subject and reduces detail drift.',
      lighting: 'Anamorphic macro optics and soft rim light preserve reflective edges without flattening the gold finish.',
      parameters: 'A 16:9 frame, controlled motion, and consistent 60fps give the clip a stable cinematic finish.'
    }
  },
  {
    title: 'Cyberpunk Midnight Rain Alleyway',
    category: 'Cinematic Narrative',
    format: '16:9 Cinematic',
    layers: {
      camera: 'Low-angle tracking push-in shot at ankle level through wet asphalt puddles',
      subject: 'Silhouette of a trenchcoat-clad protagonist walking towards a towering neon billboard',
      lighting: 'Cyan and magenta neon volumetric fog, rain streak refraction on lens, hyper-realistic wet reflections',
      parameters: '--ar 16:9 --style raw --motion 6 --render photoreal'
    },
    insights: {
      camera: 'A low tracking angle and ankle-level framing anchor the shot to the wet street, preserving horizon continuity.',
      subject: 'A clear silhouette, coat, and destination keep the character readable against the dense alley.',
      lighting: 'Cyan-magenta fog and wet reflections define the palette while rain adds depth between camera and subject.',
      parameters: 'Explicit aspect ratio and motion style keep the output framing and render treatment consistent.'
    }
  },
  {
    title: 'Organic Vitamin C Serum Splash',
    category: 'E-Commerce Ad',
    format: '9:16 Vertical Reel',
    layers: {
      camera: 'High-speed 1000fps phantom flex slow-motion lock-off shot with micro zoom',
      subject: 'Frosted amber glass dropper bottle landing into pristine orange-blossom water',
      lighting: 'Diffused top softbox, crystalline water crown splash, hyper-detailed caustics and fluid droplet suspension',
      parameters: '--ar 9:16 --motion 3 --high-definition'
    },
    insights: {
      camera: 'A locked high-speed camera and restrained zoom isolate the bottle splash without motion blur.',
      subject: 'Material, bottle color, and landing action make the product the clear focal point of the splash.',
      lighting: 'Soft top light and visible caustics define the glass and suspended droplets.',
      parameters: 'Vertical framing, low motion, and HD output keep the reel composed for mobile product viewing.'
    }
  }
];

export default function PromptFormulaInspector() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const current = SAMPLES[selectedIdx];
  const activeLayer = LAYERS[activeLayerIdx];

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveLayerIdx((currentIdx) => (currentIdx + 1) % LAYERS.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [selectedIdx, isPaused]);

  const selectPreset = (idx) => {
    setSelectedIdx(idx);
    setActiveLayerIdx(0);
  };

  return (
    <div
      className="p-4 sm:p-8 lg:p-10 rounded-3xl bg-[#141d28] border border-white/10 glass-panel space-y-4 sm:space-y-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 border-b border-white/10 pb-4 sm:pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#45A29E]">
            <Layers className="w-3.5 h-3.5 text-[#66FCF1]" />
            <span>Signature Director&apos;s HUD</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Anatomy of a Studio-Grade AI Video Prompt
          </h2>
          <p className="text-xs sm:text-base text-[#8B949E] max-w-2xl leading-relaxed">
            Explore how camera, subject, lighting, and engine flags shape each prompt.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#090d14] p-1.5 rounded-xl border border-white/10 self-start lg:self-auto shrink-0">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => selectPreset(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedIdx === idx
                  ? 'bg-[#45A29E] text-[#0a0e14] font-bold shadow-[0_0_12px_rgba(69,162,158,0.5)]'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Monospace Breakdown Box */}
      <div className="p-3 sm:p-6 rounded-2xl bg-[#090d14] border border-white/10 space-y-3 sm:space-y-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs text-[#8B949E] font-mono border-b border-white/5 pb-2 sm:pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white font-medium">{current.title}</span>
            <span>·</span>
            <span className="text-[#45A29E] font-medium">{current.category}</span>
            <span>·</span>
            <span className="text-[#8B949E]">{current.format}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-[#66FCF1]/20 bg-[#66FCF1]/5 px-2.5 py-1.5 text-[10px] sm:text-xs font-mono text-[#66FCF1]">
          <activeLayer.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Currently highlighting: {activeLayer.label}</span>
        </div>

        <p
          className="font-['Fira_Code'] text-[12px] sm:text-base leading-[1.65] text-[#C9D1D9]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <span className={`rounded px-1.5 py-0.5 transition-colors duration-300 ease-in-out ${activeLayer.id === 'camera' ? 'bg-[#66FCF1]/20 text-[#66FCF1] font-semibold ring-1 ring-[#66FCF1]/70' : ''}`}>
            {current.layers.camera}
          </span>
          , featuring{' '}
          <span className={`rounded px-1.5 py-0.5 transition-colors duration-300 ease-in-out ${activeLayer.id === 'subject' ? 'bg-[#66FCF1]/20 text-[#66FCF1] font-semibold ring-1 ring-[#66FCF1]/70' : ''}`}>
            {current.layers.subject}
          </span>
          , shot on{' '}
          <span className={`rounded px-1.5 py-0.5 transition-colors duration-300 ease-in-out ${activeLayer.id === 'lighting' ? 'bg-[#66FCF1]/20 text-[#66FCF1] font-semibold ring-1 ring-[#66FCF1]/70' : ''}`}>
            {current.layers.lighting}
          </span>
          .{' '}
          <span className={`rounded px-1.5 py-0.5 font-bold transition-colors duration-300 ease-in-out ${activeLayer.id === 'parameters' ? 'bg-[#66FCF1]/20 text-[#66FCF1] ring-1 ring-[#66FCF1]/70' : 'text-[#8B949E]'}`}>
            {current.layers.parameters}
          </span>
        </p>
      </div>

      {/* Director's Engineering Insight */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#45A29E]/10 border border-[#45A29E]/30 text-sm text-[#C9D1D9] flex items-start gap-3.5 leading-relaxed">
        <Sparkles className="w-5 h-5 text-[#66FCF1] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#66FCF1]">Director&apos;s Engineering Insight: </span>
          {current.insights[activeLayer.id]}
        </div>
      </div>
    </div>
  );
}
