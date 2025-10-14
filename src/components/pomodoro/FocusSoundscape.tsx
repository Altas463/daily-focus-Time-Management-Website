"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type SoundId = "white" | "brown" | "waves";

type SoundOption = {
  id: SoundId;
  label: string;
  description: string;
};

type SoundHandle = {
  id: SoundId;
  stop: () => void;
};

const soundOptions: SoundOption[] = [
  {
    id: "white",
    label: "White noise",
    description: "Balanced static wall to mask background chatter.",
  },
  {
    id: "brown",
    label: "Deep brown",
    description: "Low frequencies that feel grounded and steady.",
  },
  {
    id: "waves",
    label: "Soft waves",
    description: "Faint swell inspired by shoreline ambience.",
  },
];

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
      try {
        source.stop();
      } catch {
        // ignore if already stopped
      }
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
      try {
        source.stop();
      } catch {
        // ignore if already stopped
      }
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
      } catch {
        // ignore if already stopped
      }
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
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const contextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!contextClass) {
      throw new Error("This browser does not support the Web Audio API.");
    }

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
      try {
        gainRef.current.disconnect();
      } catch {
        // ignore
      }
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
      if (activeHandleRef.current) {
        activeHandleRef.current.stop();
        activeHandleRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => null);
      }
    };
  }, []);

  useEffect(() => {
    if (!gainRef.current || !audioContextRef.current) return;
    gainRef.current.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.15);
  }, [volume]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100/70">Soundscapes</p>
          <p className="mt-1 text-sm text-slate-200/80">Layer gentle ambience without leaving the page.</p>
        </div>
        <button
          type="button"
          onClick={() => stopCurrent()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-200/70 transition hover:border-white/20 hover:text-white"
          aria-label="Stop ambient sound"
          disabled={!activeSound}
        >
          {activeSound ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-60" />}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {soundOptions.map((option) => {
          const active = option.id === activeSound;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleSound(option.id)}
              className={[
                "w-full rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60",
                active
                  ? "border-white/30 bg-white/10 text-white shadow-lg shadow-blue-500/10"
                  : "border-white/10 bg-white/5 text-slate-100/80 hover:border-white/20 hover:text-white",
              ].join(" ")}
              aria-pressed={active}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="mt-1 text-xs text-slate-200/70">{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <label className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-blue-100/70">
          Volume
          <span className="font-mono text-[11px] text-slate-200/80">{Math.round(volume * 100)}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.02}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-blue-400"
          aria-valuemin={0}
          aria-valuemax={60}
          aria-valuenow={Math.round(volume * 100)}
        />
      </div>
    </section>
  );
}
