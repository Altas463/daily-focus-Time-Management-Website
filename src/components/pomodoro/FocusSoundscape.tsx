"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Waves, Wind, Zap } from "lucide-react";

type SoundId = "white" | "brown" | "waves";

type SoundOption = {
  id: SoundId;
  label: string;
  description: string;
  icon: any;
};

type SoundHandle = {
  id: SoundId;
  stop: () => void;
};

const soundOptions: SoundOption[] = [
  {
    id: "white",
    label: "White Noise",
    description: "Static masking",
    icon: Zap,
  },
  {
    id: "brown",
    label: "Brown Noise",
    description: "Deep rumble",
    icon: Wind,
  },
  {
    id: "waves",
    label: "Ocean Waves",
    description: "Natural swell",
    icon: Waves,
  },
];

// Audio generation functions (kept same logic, just moved for brevity if needed, but including full logic here)
const createWhiteNoise = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;

  source.connect(filter);
  source.start();

  return {
    node: filter,
    stop: () => {
      try { source.stop(); } catch {}
      source.disconnect();
      filter.disconnect();
    },
  };
};

const createBrownNoise = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  filter.Q.value = 0.8;

  source.connect(filter);
  source.start();

  return {
    node: filter,
    stop: () => {
      try { source.stop(); } catch {}
      source.disconnect();
      filter.disconnect();
    },
  };
};

const createSoftWaves = (ctx: AudioContext) => {
  const mainGain = ctx.createGain();
  mainGain.gain.value = 1;

  const carrier = ctx.createOscillator();
  carrier.type = "sine";
  carrier.frequency.value = 110;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.18;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 32;

  const shimmer = ctx.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.value = 440;

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.05;

  lfo.connect(lfoGain).connect(carrier.frequency);
  carrier.connect(mainGain);
  shimmer.connect(shimmerGain).connect(mainGain);

  carrier.start();
  shimmer.start();
  lfo.start();

  return {
    node: mainGain,
    stop: () => {
      try {
        carrier.stop();
        shimmer.stop();
        lfo.stop();
      } catch {}
      carrier.disconnect();
      shimmer.disconnect();
      lfo.disconnect();
      lfoGain.disconnect();
      shimmerGain.disconnect();
      mainGain.disconnect();
    },
  };
};

const builders: Record<SoundId, (ctx: AudioContext) => { node: AudioNode; stop: () => void }> = {
  white: createWhiteNoise,
  brown: createBrownNoise,
  waves: createSoftWaves,
};

export default function FocusSoundscape() {
  const [activeSound, setActiveSound] = useState<SoundId | null>(null);
  const [volume, setVolume] = useState(0.25);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const activeHandleRef = useRef<SoundHandle | null>(null);

  const ensureContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    const contextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!contextClass) throw new Error("Web Audio API not supported.");
    const ctx = new contextClass();
    audioContextRef.current = ctx;
    return ctx;
  }, []);

  const stopCurrent = useCallback(async () => {
    if (activeHandleRef.current) {
      activeHandleRef.current.stop();
      activeHandleRef.current = null;
    }
    if (gainRef.current) {
      try { gainRef.current.disconnect(); } catch {}
      gainRef.current = null;
    }
    setActiveSound(null);
  }, []);

  const playSound = useCallback(
    async (id: SoundId) => {
      const ctx = ensureContext();
      await ctx.resume();
      await stopCurrent();

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      const { node, stop } = builders[id](ctx);
      node.connect(gain);
      gain.connect(ctx.destination);

      activeHandleRef.current = { id, stop: () => stop() };
      gainRef.current = gain;
      setActiveSound(id);
    },
    [ensureContext, stopCurrent, volume],
  );

  const toggleSound = useCallback(
    async (id: SoundId) => {
      if (activeSound === id) {
        await stopCurrent();
        return;
      }
      await playSound(id);
    },
    [activeSound, playSound, stopCurrent],
  );

  useEffect(() => {
    return () => {
      if (activeHandleRef.current) activeHandleRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close().catch(() => null);
    };
  }, []);

  useEffect(() => {
    if (!gainRef.current || !audioContextRef.current) return;
    gainRef.current.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.15);
  }, [volume]);

  return (
    <section className="bento-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="label-tech">AUDIO ENVIRONMENT</span>
        </div>
        <button
          type="button"
          onClick={() => stopCurrent()}
          className="text-slate-400 hover:text-red-500 transition-colors"
          disabled={!activeSound}
        >
          <VolumeX className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {soundOptions.map((option) => {
          const active = option.id === activeSound;
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleSound(option.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-sm border transition-all ${
                active
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-surface-base border-border-subtle text-slate-500 hover:border-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <div className="text-left flex-1">
                <div className="text-sm font-bold font-mono uppercase">{option.label}</div>
                <div className="text-[10px] opacity-70">{option.description}</div>
              </div>
              {active && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border-subtle">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Master Volume</span>
          <span className="text-[10px] font-mono font-bold text-primary">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.02}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
        />
      </div>
    </section>
  );
}
