import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Wind,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';
import { BreathingPersonVisual } from './BreathingPersonVisual';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (minutes: number) => void;
}

type TechniqueType = '4-7-8' | 'box' | 'calm-4-6' | 'belly';

interface PhaseConfig {
  name: 'Inhale' | 'Hold' | 'Exhale' | 'Rest';
  durationSeconds: number;
  instruction: string;
}

const TECHNIQUES: Record<
  TechniqueType,
  { name: string; shortName: string; description: string; phases: PhaseConfig[] }
> = {
  '4-7-8': {
    name: '4-7-8 Calming Breath',
    shortName: '4-7-8 Relax',
    description: 'Dr. Andrew Weil’s relaxation breath stimulating the vagus nerve.',
    phases: [
      { name: 'Inhale', durationSeconds: 4, instruction: 'Breathe in quietly through your nose' },
      { name: 'Hold', durationSeconds: 7, instruction: 'Hold breath with gentle softness' },
      { name: 'Exhale', durationSeconds: 8, instruction: 'Release all air slowly through mouth' },
    ],
  },
  box: {
    name: 'Box Breathing (4-4-4-4)',
    shortName: 'Box 4-4-4-4',
    description: 'Used by athletes to reset autonomic balance and sharpen focus.',
    phases: [
      { name: 'Inhale', durationSeconds: 4, instruction: 'Inhale smoothly through nose' },
      { name: 'Hold', durationSeconds: 4, instruction: 'Hold lungs full and calm' },
      { name: 'Exhale', durationSeconds: 4, instruction: 'Exhale steadily through mouth' },
      { name: 'Rest', durationSeconds: 4, instruction: 'Rest empty in stillness' },
    ],
  },
  'calm-4-6': {
    name: 'Calm 4-6 Resonance',
    shortName: 'Calm 4-6',
    description: 'Gentle heart rate variability pacing without breath holding.',
    phases: [
      { name: 'Inhale', durationSeconds: 4, instruction: 'Breathe deep into abdomen' },
      { name: 'Exhale', durationSeconds: 6, instruction: 'Slow soothing exhale' },
    ],
  },
  belly: {
    name: 'Diaphragmatic 4-2-6',
    shortName: 'Belly 4-2-6',
    description: 'Deep belly expansion to relieve somatic anxiety and tension.',
    phases: [
      { name: 'Inhale', durationSeconds: 4, instruction: 'Expand belly like a gentle balloon' },
      { name: 'Hold', durationSeconds: 2, instruction: 'Pause briefly at peak' },
      { name: 'Exhale', durationSeconds: 6, instruction: 'Let belly soften back down' },
    ],
  },
};

export const BreathingModal: React.FC<BreathingModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [technique, setTechnique] = useState<TechniqueType>('4-7-8');
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentTechniqueConfig = TECHNIQUES[technique];
  const currentPhase = currentTechniqueConfig.phases[currentPhaseIndex] || currentTechniqueConfig.phases[0];

  // Reset when modal opens / closes
  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setCompletedCycles(0);
      setTotalSecondsElapsed(0);
      setCurrentPhaseIndex(0);
      setPhaseSecondsLeft(currentTechniqueConfig.phases[0].durationSeconds);
    }
  }, [isOpen]);

  // Reset phase when technique switches
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(currentTechniqueConfig.phases[0].durationSeconds);
    setCompletedCycles(0);
    setTotalSecondsElapsed(0);
  }, [technique]);

  // Main countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalSecondsElapsed((prev) => prev + 1);

        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            setCurrentPhaseIndex((prevPhaseIdx) => {
              const nextIdx = (prevPhaseIdx + 1) % currentTechniqueConfig.phases.length;

              if (soundEnabled) {
                const nextPhaseName = currentTechniqueConfig.phases[nextIdx].name;
                if (nextPhaseName === 'Inhale') {
                  audioManager.playChimeNote(523.25, 'sine', 0.8, 0.25); // C5
                } else if (nextPhaseName === 'Hold') {
                  audioManager.playChimeNote(659.25, 'sine', 0.6, 0.2); // E5
                } else if (nextPhaseName === 'Exhale') {
                  audioManager.playChimeNote(392.0, 'sine', 0.9, 0.22); // G4
                } else {
                  audioManager.playWaterDrop(0.2);
                }
              }

              if (nextIdx === 0) {
                setCompletedCycles((c) => {
                  const updated = c + 1;
                  if (updated % 3 === 0 && soundEnabled) {
                    audioManager.playCompletionSound('Soft Bell', 0.35);
                  }
                  return updated;
                });
              }

              setPhaseSecondsLeft(currentTechniqueConfig.phases[nextIdx].durationSeconds);
              return nextIdx;
            });
            return 1;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentTechniqueConfig, soundEnabled]);

  if (!isOpen) return null;

  const handleFinish = () => {
    setIsRunning(false);
    if (soundEnabled) {
      audioManager.playCompletionSound('Singing Bowl', 0.5);
    }
    try {
      confetti({ particleCount: 50, spread: 50 });
    } catch (e) {}
    const minutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    if (onCompleted) {
      onCompleted(minutes);
    }
    onClose();
  };

  const currentDuration = currentPhase.durationSeconds;
  const phaseProgress = (currentDuration - phaseSecondsLeft) / currentDuration;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="breathing-exercise-dialog"
        className="relative my-auto w-full max-w-lg rounded-3xl bg-gradient-to-b from-teal-50/60 via-white to-sky-50/40 p-5 sm:p-7 shadow-2xl border border-teal-100/90 overflow-hidden"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-200">
            <Wind className="h-3.5 w-3.5 text-teal-600" />
            Visual Breathwork
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`rounded-full p-2 text-slate-500 hover:bg-slate-100 transition ${
                soundEnabled ? 'text-teal-600' : 'text-slate-400'
              }`}
              title={soundEnabled ? 'Mute sound cues' : 'Enable sound cues'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              id="breathing-close-btn"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Close modal"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {currentTechniqueConfig.name}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
            {currentTechniqueConfig.description}
          </p>
        </div>

        {/* Technique Switcher Pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {(Object.keys(TECHNIQUES) as TechniqueType[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setTechnique(key);
                setIsRunning(false);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                technique === key
                  ? 'bg-teal-700 text-white shadow-xs scale-102'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {TECHNIQUES[key].shortName}
            </button>
          ))}
        </div>

        {/* ANIMATED BREATHING GUIDE (Visual Human Figure & Dynamic Aura) */}
        <div className="my-1 flex items-center justify-center">
          <BreathingPersonVisual
            phase={currentPhase.name}
            progress={phaseProgress}
            secondsLeft={phaseSecondsLeft}
          />
        </div>

        {/* Minimal Short Instruction & Session Stats */}
        <div className="text-center min-h-[46px] my-3">
          <p className="text-sm font-semibold text-slate-700 transition-all duration-300">
            {isRunning ? currentPhase.instruction : 'Press Start Breathing to begin synchronized pacing.'}
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>
              Cycles: <strong className="text-slate-700">{completedCycles}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-teal-600" />
              Elapsed:{' '}
              <strong className="text-slate-700 font-mono">
                {Math.floor(totalSecondsElapsed / 60)}m {totalSecondsElapsed % 60}s
              </strong>
            </span>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              setIsRunning(false);
              setCurrentPhaseIndex(0);
              setPhaseSecondsLeft(currentTechniqueConfig.phases[0].durationSeconds);
              setTotalSecondsElapsed(0);
              setCompletedCycles(0);
              if (soundEnabled) audioManager.playWaterDrop(0.2);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105 active:scale-95 transition"
            title="Reset Breathing Session"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            id="breathing-toggle-btn"
            onClick={() => {
              setIsRunning(!isRunning);
              if (!isRunning && soundEnabled) {
                audioManager.playChimeNote(523.25, 'sine', 0.5, 0.2);
              }
            }}
            className="flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-700 hover:scale-102 active:scale-95 transition"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" /> Pause Session
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" /> Start Breathing
              </>
            )}
          </button>

          {totalSecondsElapsed > 15 && (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 text-xs font-semibold hover:bg-emerald-100 hover:scale-102 active:scale-95 transition shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Log Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
