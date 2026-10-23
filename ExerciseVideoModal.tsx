import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  Flame,
  Info,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ExerciseItem, ExerciseStep } from '../types';
import { ExercisePostureVisual } from './ExercisePostureVisual';
import { audioManager } from '../utils/audio';

interface ExerciseVideoModalProps {
  exercise: ExerciseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (minutes: number, name: string) => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartTimer,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFormDetails, setShowFormDetails] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);

  const steps: ExerciseStep[] = exercise?.steps || [];
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || {
    stepNumber: 1,
    title: 'Posture Step',
    instruction: 'Maintain balanced posture with relaxed breathing.',
    image: 'squat-step-1',
    duration: 10,
    motionDirection: 'hold',
    motionArrowLabel: 'Hold Position',
  };

  // Reset state whenever exercise changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsAutoAdvancing(false);
      setShowFormDetails(false);
      const initialDuration = steps[0]?.duration || 10;
      setStepSecondsLeft(initialDuration);
    }
  }, [isOpen, exercise]);

  // Sync timer with active step duration
  useEffect(() => {
    if (steps[currentStepIndex]?.duration) {
      setStepSecondsLeft(steps[currentStepIndex].duration);
    } else {
      setStepSecondsLeft(10);
    }
  }, [currentStepIndex, steps]);

  // Auto-advance interval
  useEffect(() => {
    let timer: any = null;
    if (isAutoAdvancing && isOpen && totalSteps > 0) {
      timer = setInterval(() => {
        setStepSecondsLeft((prev) => {
          if (prev <= 1) {
            // Advance to next step or loop
            setCurrentStepIndex((currIdx) => {
              const nextIdx = (currIdx + 1) % totalSteps;
              if (soundEnabled) {
                audioManager.playChimeNote(880, 'triangle', 0.5, 0.25);
              }
              return nextIdx;
            });
            const nextStepDuration = steps[(currentStepIndex + 1) % totalSteps]?.duration || 10;
            return nextStepDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoAdvancing, isOpen, totalSteps, currentStepIndex, steps, soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsAutoAdvancing((prev) => !prev);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, totalSteps]);

  const goToNext = () => {
    if (totalSteps === 0) return;
    const nextIdx = (currentStepIndex + 1) % totalSteps;
    setCurrentStepIndex(nextIdx);
    if (soundEnabled) {
      audioManager.playWaterDrop(0.2);
    }
  };

  const goToPrevious = () => {
    if (totalSteps === 0) return;
    const prevIdx = (currentStepIndex - 1 + totalSteps) % totalSteps;
    setCurrentStepIndex(prevIdx);
    if (soundEnabled) {
      audioManager.playWaterDrop(0.2);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStartX.current = null;
  };

  if (!isOpen || !exercise) return null;

  const currentStepDuration = currentStep.duration || 10;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStepDuration - stepSecondsLeft) / currentStepDuration) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="exercise-detail-dialog"
        className="relative my-auto w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-100/80 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200/60">
              {exercise.category}
            </span>
            <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {exercise.difficulty}
            </span>
            {exercise.caloriesBurned && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
                <Flame className="h-3 w-3 text-amber-500" />
                ~{exercise.caloriesBurned} kcal
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`rounded-full p-2 text-slate-500 hover:bg-slate-200/60 transition ${
                soundEnabled ? 'text-teal-600' : 'text-slate-400'
              }`}
              title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
              aria-label="Toggle audio cues"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
              title="Close modal"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {/* Exercise Title & Session Meta */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {exercise.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Step-by-step visual posture guide & alignment
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              <span>{exercise.durationMinutes} min total</span>
            </div>
          </div>

          {/* DEDICATED VISUAL POSTURE CANVAS */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-50 via-teal-50/20 to-sky-50/30 p-2 sm:p-3 border border-slate-200/80 shadow-inner">
            {/* Step Posture Component */}
            <ExercisePostureVisual
              imageKey={currentStep.image}
              stepNumber={currentStep.stepNumber}
              totalSteps={totalSteps}
              title={currentStep.title}
              instruction={currentStep.instruction}
              motionDirection={currentStep.motionDirection}
              motionArrowLabel={currentStep.motionArrowLabel}
              bodyHighlight={currentStep.bodyHighlight}
              keyAlignment={currentStep.keyAlignment}
            />

            {/* Step Navigation Floating Arrows (overlay on desktop for fast clicking) */}
            <button
              onClick={goToPrevious}
              disabled={totalSteps <= 1}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
              title="Previous Step (Left Arrow)"
              aria-label="Previous step"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToNext}
              disabled={totalSteps <= 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
              title="Next Step (Right Arrow)"
              aria-label="Next step"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* INTERACTIVE STEP PROGRESS & TIMER BAR */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                Step {currentStepIndex + 1} of {totalSteps}: {currentStep.title}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {stepSecondsLeft}s {isAutoAdvancing ? 'remaining' : 'hold duration'}
              </span>
            </div>

            {/* Smooth animated progress line */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step Dots indicator (clickable) */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {steps.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    if (soundEnabled) audioManager.playWaterDrop(0.15);
                  }}
                  className={`group relative flex items-center justify-center transition-all ${
                    currentStepIndex === idx
                      ? 'scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  title={`Go to Step ${s.stepNumber}: ${s.title}`}
                  aria-label={`Go to step ${s.stepNumber}`}
                >
                  <span
                    className={`h-2.5 rounded-full transition-all ${
                      currentStepIndex === idx
                        ? 'w-7 bg-teal-600'
                        : 'w-2.5 bg-slate-300 group-hover:bg-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* PRIMARY STEP CONTROLS (Previous, Auto-Advance Play/Pause, Next) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={totalSteps <= 1}
                className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Step</span>
              </button>

              <button
                onClick={() => {
                  setIsAutoAdvancing(!isAutoAdvancing);
                  if (!isAutoAdvancing && soundEnabled) {
                    audioManager.playChimeNote(660, 'sine', 0.4, 0.2);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs active:scale-95 ${
                  isAutoAdvancing
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isAutoAdvancing ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause Auto
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> Auto-Advance
                  </>
                )}
              </button>

              <button
                onClick={goToNext}
                disabled={totalSteps <= 1}
                className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition disabled:opacity-40"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Reset / restart step */}
            <button
              onClick={() => {
                setStepSecondsLeft(currentStep.duration || 10);
                if (soundEnabled) audioManager.playWaterDrop(0.2);
              }}
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Reset step timer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Timer</span>
            </button>
          </div>

          {/* Alignment Highlights & Tips (Concise, Visual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-teal-50/70 p-3 border border-teal-100 text-xs">
              <div className="flex items-center gap-1.5 text-teal-900 font-bold mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                <span>Form Cue</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {currentStep.keyAlignment || exercise.correctPosture}
              </p>
            </div>

            <div className="rounded-xl bg-sky-50/70 p-3 border border-sky-100 text-xs">
              <div className="flex items-center gap-1.5 text-sky-900 font-bold mb-1">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                <span>Breathing Sync</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {exercise.breathingGuidance}
              </p>
            </div>
          </div>

          {/* Optional Form Details Accordion (Low cognitive load) */}
          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => setShowFormDetails(!showFormDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
            >
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                {showFormDetails ? 'Hide Safety & Mistakes Guide' : 'View Safety Precautions & Common Mistakes'}
              </span>
              <span className="text-slate-400 font-bold">{showFormDetails ? '−' : '+'}</span>
            </button>

            {showFormDetails && (
              <div className="mt-3 space-y-2.5 animate-in fade-in duration-200">
                {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                  <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      Mistakes to Avoid
                    </span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {exercise.commonMistakes.map((mistake, idx) => (
                        <li key={idx}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exercise.safetyPrecautions && (
                  <div className="rounded-xl bg-rose-50/70 p-3 border border-rose-200/60 text-xs text-slate-700">
                    <span className="font-bold text-rose-900 block mb-0.5">
                      Safety Notice
                    </span>
                    {exercise.safetyPrecautions} Stop if you experience sharp pain.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar: Start Full Workout Session */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span className="hidden sm:inline">Use </span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">←</kbd>
            <span className="mx-1">/</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">→</kbd>
            <span className="hidden sm:inline"> to switch steps</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartTimer(exercise.durationMinutes, exercise.name);
            }}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition"
          >
            <Clock className="h-4 w-4" />
            <span>Start {exercise.durationMinutes}m Workout Timer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
