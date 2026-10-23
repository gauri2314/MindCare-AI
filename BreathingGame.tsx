import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { Wind } from 'lucide-react';

interface BreathingGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const BreathingGame: React.FC<BreathingGameProps> = ({
  isMuted,
  isPaused,
  onComplete,
}) => {
  const [pattern, setPattern] = useState<'box' | 'calm' | 'relax'>('calm'); // box: 4-4-4-4, calm: 4-7-8, relax: 4-6
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const getPhaseDurations = () => {
      if (pattern === 'box') return { Inhale: 4, Hold: 4, Exhale: 4, Rest: 4 };
      if (pattern === 'calm') return { Inhale: 4, Hold: 7, Exhale: 8, Rest: 0 };
      return { Inhale: 4, Hold: 2, Exhale: 6, Rest: 0 };
    };

    const durations = getPhaseDurations();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Switch to next phase
        let nextPhase: typeof phase = 'Inhale';
        if (phase === 'Inhale') {
          nextPhase = 'Hold';
          if (!isMuted) audioManager.playChimeNote(659.25, 'sine', 1.2, 0.2);
        } else if (phase === 'Hold') {
          nextPhase = 'Exhale';
          if (!isMuted) audioManager.playChimeNote(440.0, 'sine', 1.4, 0.2);
        } else if (phase === 'Exhale') {
          if (durations.Rest > 0) {
            nextPhase = 'Rest';
          } else {
            nextPhase = 'Inhale';
            setCyclesCompleted((c) => {
              const next = c + 1;
              if (next >= 4 && next % 4 === 0) onComplete?.();
              return next;
            });
            if (!isMuted) audioManager.playChimeNote(523.25, 'sine', 1.2, 0.2);
          }
        } else {
          nextPhase = 'Inhale';
          setCyclesCompleted((c) => {
            const next = c + 1;
            if (next >= 4 && next % 4 === 0) onComplete?.();
            return next;
          });
          if (!isMuted) audioManager.playChimeNote(523.25, 'sine', 1.2, 0.2);
        }

        setPhase(nextPhase);
        return durations[nextPhase];
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, pattern, isPaused, isMuted]);

  const isExpanding = phase === 'Inhale';
  const isContracting = phase === 'Exhale';

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto select-none py-2">
      {/* Pattern selector */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
        <button
          onClick={() => {
            setPattern('calm');
            setPhase('Inhale');
            setCountdown(4);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            pattern === 'calm'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          4-7-8 Calming
        </button>
        <button
          onClick={() => {
            setPattern('box');
            setPhase('Inhale');
            setCountdown(4);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            pattern === 'box'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          4-4-4-4 Box
        </button>
        <button
          onClick={() => {
            setPattern('relax');
            setPhase('Inhale');
            setCountdown(4);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            pattern === 'relax'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          4-6 Deep Flow
        </button>
      </div>

      {/* Visual Breathing Orb */}
      <div className="relative w-72 h-72 rounded-full flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div
          style={{
            transform: `scale(${isExpanding ? 1.35 : isContracting ? 0.85 : 1.25})`,
            transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="absolute inset-0 rounded-full bg-linear-to-tr from-teal-400/20 via-cyan-300/30 to-emerald-400/20 blur-xl pointer-events-none"
        />

        {/* Middle geometric aura */}
        <div
          style={{
            transform: `scale(${isExpanding ? 1.2 : isContracting ? 0.9 : 1.15})`,
            transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="absolute w-56 h-56 rounded-full border-4 border-teal-300/60 shadow-lg shadow-teal-500/20"
        />

        {/* Central Breathing Core */}
        <div
          style={{
            transform: `scale(${isExpanding ? 1.15 : isContracting ? 0.88 : 1.08})`,
            transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="w-40 h-40 rounded-full bg-linear-to-br from-teal-500 via-teal-600 to-emerald-700 flex flex-col items-center justify-center text-white shadow-2xl text-center px-2"
        >
          <Wind className="h-6 w-6 text-teal-200 mb-1" />
          <span className="text-sm font-extrabold uppercase tracking-widest">{phase}</span>
          <span className="text-3xl font-black mt-0.5">{countdown}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span>Cycles Completed:</span>
        <span className="text-teal-700 font-bold text-sm">{cyclesCompleted}</span>
      </div>
    </div>
  );
};
