'use client';

import { useState } from 'react';
import { Sparkles, Camera, Sun, Cpu, Copy, Check, Layers } from 'lucide-react';

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
    directorNote: 'Orbital rotation paired with low motion value (4) locks camera perspective, preventing mechanical gears from hallucinating or warping during video synthesis.'
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
    directorNote: 'Low-angle tracking with specified ground surface reflections forces third-party diffusion models to maintain consistent horizon depth across frames.'
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
    directorNote: 'Specifying 1000fps phantom slow-motion triggers temporal coherence models to preserve discrete fluid droplets rather than blending them into blurry noise.'
  }
];

export default function PromptFormulaInspector() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeLayer, setActiveLayer] = useState('camera');
  const [copied, setCopied] = useState(false);

  const current = SAMPLES[selectedIdx];
  const fullPromptText = `${current.layers.camera}, featuring ${current.layers.subject}, shot on ${current.layers.lighting}. ${current.layers.parameters}`;

  const handleCopy = async () => {
    let successful = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullPromptText);
        successful = true;
      }
    } catch (err) {}

    if (!successful) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullPromptText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {}
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#141d28] border border-white/10 glass-panel space-y-8 relative overflow-hidden shadow-2xl">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#45A29E]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#45A29E]">
            <Layers className="w-3.5 h-3.5 text-[#66FCF1]" />
            <span>Signature Director's HUD</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Anatomy of a Studio-Grade AI Video Prompt
          </h2>
          <p className="text-sm sm:text-base text-[#8B949E] max-w-2xl leading-relaxed">
            See how professional prompt engineers structure camera motion, subject physics, optics, and syntax flags to eliminate AI distortion.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#090d14] p-1.5 rounded-xl border border-white/10 self-start lg:self-auto shrink-0">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => setSelectedIdx(idx)}
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

      {/* Interactive Layer Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'camera', label: '1. Camera Motion', icon: Camera, color: '#66FCF1' },
          { id: 'subject', label: '2. Subject & Physics', icon: Sparkles, color: '#45A29E' },
          { id: 'lighting', label: '3. Optics & Lighting', icon: Sun, color: '#F7B731' },
          { id: 'parameters', label: '4. Engine Flags', icon: Cpu, color: '#C9D1D9' },
        ].map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-[#1b2636] border-[#66FCF1] shadow-[0_0_18px_rgba(102,252,241,0.2)]'
                  : 'bg-[#0e141d] border-white/5 hover:border-white/20 hover:bg-[#121a24]'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Icon className="w-4 h-4 shrink-0" style={{ color: layer.color }} />
                <span className="text-xs font-semibold text-white tracking-wide">{layer.label}</span>
              </div>
              <div className="text-xs text-[#8B949E] truncate font-mono">
                {current.layers[layer.id]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Monospace Breakdown Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#090d14] border border-white/10 space-y-5">
        <div className="flex items-center justify-between text-xs text-[#8B949E] font-mono border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white font-medium">{current.title}</span>
            <span>·</span>
            <span className="text-[#45A29E] font-medium">{current.category}</span>
            <span>·</span>
            <span className="text-[#8B949E]">{current.format}</span>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 text-xs text-[#66FCF1] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Formula Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Tokenized Syntax Highlighting with Generous Line Height */}
        <p className="font-['Fira_Code'] text-sm sm:text-base leading-[1.8] text-[#C9D1D9]">
          <span className={`transition-all duration-200 px-1.5 py-0.5 rounded ${activeLayer === 'camera' ? 'bg-[#66FCF1]/25 text-[#66FCF1] font-semibold ring-1 ring-[#66FCF1]' : ''}`}>
            {current.layers.camera}
          </span>
          , featuring{' '}
          <span className={`transition-all duration-200 px-1.5 py-0.5 rounded ${activeLayer === 'subject' ? 'bg-[#45A29E]/25 text-[#45A29E] font-semibold ring-1 ring-[#45A29E]' : ''}`}>
            {current.layers.subject}
          </span>
          , shot on{' '}
          <span className={`transition-all duration-200 px-1.5 py-0.5 rounded ${activeLayer === 'lighting' ? 'bg-[#F7B731]/25 text-[#F7B731] font-semibold ring-1 ring-[#F7B731]' : ''}`}>
            {current.layers.lighting}
          </span>
          .{' '}
          <span className={`transition-all duration-200 px-1.5 py-0.5 rounded font-bold ${activeLayer === 'parameters' ? 'bg-white/20 text-white ring-1 ring-white' : 'text-[#8B949E]'}`}>
            {current.layers.parameters}
          </span>
        </p>
      </div>

      {/* Director's Engineering Insight */}
      <div className="p-6 rounded-2xl bg-[#45A29E]/10 border border-[#45A29E]/30 text-sm text-[#C9D1D9] flex items-start gap-3.5 leading-relaxed">
        <Sparkles className="w-5 h-5 text-[#66FCF1] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#66FCF1]">Director's Engineering Insight: </span>
          {current.directorNote}
        </div>
      </div>
    </div>
  );
}
