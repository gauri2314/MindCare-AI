import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';

interface CandleFocusGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const CandleFocusGame: React.FC<CandleFocusGameProps> = ({
  isMuted,
  isPaused,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes

  useEffect(() => {
    if (isPaused) return;

    // 4s Inhale, 2s Hold, 4s Exhale
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p === 'inhale') {
          if (!isMuted) audioManager.playChimeNote(523.25, 'sine', 1.5, 0.15);
          return 'hold';
        }
        if (p === 'hold') return 'exhale';
        if (!isMuted) audioManager.playChimeNote(392.0, 'sine', 1.5, 0.15);
        return 'inhale';
      });
    }, 4000);

    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          onComplete?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isPaused, isMuted]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto select-none py-4">
      {/* Timer & Breath Phase */}
      <div className="flex items-center gap-3">
        <div className="px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs font-bold">
          {mins}:{secs < 10 ? `0${secs}` : secs}
        </div>
        <div className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          {phase === 'inhale' && 'Inhale gently'}
          {phase === 'hold' && 'Soft pause'}
          {phase === 'exhale' && 'Release slowly'}
        </div>
      </div>

      {/* Atmospheric Dark Chamber with Candle */}
      <div className="relative w-full h-[320px] rounded-3xl bg-radial from-amber-950/40 via-slate-950 to-black border-2 border-slate-900 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Expanding Breath Halo */}
        <div
          style={{
            transform: `scale(${phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.35 : 0.95})`,
            transition: 'transform 4s ease-in-out',
          }}
          className="absolute w-44 h-44 rounded-full bg-amber-400/15 blur-3xl pointer-events-none"
        />

        {/* Animated Candle Flame */}
        <div className="relative flex flex-col items-center">
          {/* Flame teardrop */}
          <div
            style={{
              transform: `scale(${phase === 'inhale' ? 1.25 : phase === 'hold' ? 1.2 : 0.88})`,
              transition: 'transform 4s ease-in-out',
            }}
            className="w-8 h-14 rounded-full bg-linear-to-t from-amber-600 via-yellow-400 to-white shadow-lg shadow-amber-500/80 animate-pulse duration-1000 origin-bottom"
          />

          {/* Wick */}
          <div className="w-1 h-3 bg-slate-800 -mt-1 rounded-full" />

          {/* Wax Pillar */}
          <div className="w-14 h-24 bg-linear-to-b from-amber-100 via-amber-200 to-amber-300 rounded-t-md rounded-b-xl shadow-inner border border-amber-300/40 flex items-center justify-center">
            <div className="w-0.5 h-12 bg-amber-400/30 rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">
        Rest your eyes softly on the warm flame. Let your breath expand and soften with the light.
      </p>
    </div>
  );
};
