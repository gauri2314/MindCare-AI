import React, { useState, useEffect, useRef } from 'react';
import { ExerciseItem, ExerciseStep } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseData';
import { ExercisePostureVisual } from '../components/ExercisePostureVisual';
import { audioManager } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  ListFilter,
  Plus,
  Minus,
  Settings2,
  Heart,
  X,
  Search,
  Activity,
  Flame,
  ShieldAlert,
  Music,
  Wind,
  Trophy,
  Repeat,
  Check,
  CheckCircle,
  Mic,
  MicOff,
} from 'lucide-react';

interface ExerciseViewProps {
  onOpenVideoModal?: (item: ExerciseItem) => void;
  onOpenTimerModal?: (title: string, mins: number) => void;
  showToast?: (msg: string) => void;
}

const CATEGORIES = [
  'All',
  'Full Body',
  'Strength',
  'Cardio',
  'Flexibility',
  'Mobility',
  'Beginner',
  'Low Impact',
  'Warm-up',
  'Cool-down',
  'Core',
] as const;

const TIMER_PRESETS = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
];

const REP_PRESETS = [5, 8, 10, 12, 15, 20];

const SOUND_TRACKS = [
  { id: 'Light Workout Beats', name: 'Light Workout Beats', category: 'Workout Beats', type: 'instrument' },
  { id: 'Piano', name: 'Gentle Piano', category: 'Instrumental', type: 'instrument' },
  { id: 'Guitar', name: 'Acoustic Guitar', category: 'Instrumental', type: 'instrument' },
  { id: 'Instrumental Music', name: 'Instrumental Flow', category: 'Instrumental', type: 'instrument' },
  { id: 'Birds', name: 'Morning Birds', category: 'Nature / Calm', type: 'nature' },
  { id: 'Forest', name: 'Forest Breeze', category: 'Nature / Calm', type: 'nature' },
  { id: 'Water', name: 'River Stream', category: 'Nature / Calm', type: 'nature' },
] as const;

export const ExerciseView: React.FC<ExerciseViewProps> = ({ showToast: parentShowToast }) => {
  // Category & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Filtered exercises list based on category
  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Beginner') return ex.difficulty === 'Beginner';
    return ex.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeExercises = filteredExercises.length > 0 ? filteredExercises : EXERCISE_LIBRARY;
  const safeExerciseIndex = Math.min(exerciseIndex, activeExercises.length - 1);
  const currentExercise: ExerciseItem = activeExercises[safeExerciseIndex] || EXERCISE_LIBRARY[0];

  const steps: ExerciseStep[] = currentExercise?.steps || [];
  const totalSteps = steps.length;
  const safeStepIndex = Math.min(currentStepIndex, Math.max(0, totalSteps - 1));
  const currentStep: ExerciseStep = steps[safeStepIndex] || {
    stepNumber: 1,
    title: 'Posture Setup',
    instruction: 'Maintain balanced posture with relaxed breathing.',
    image: 'squat-step-1',
    imageKey: 'squat-step-1',
    duration: 30,
    motionDirection: 'hold',
    motionArrowLabel: 'Hold Position',
    postureCue: 'Keep back straight, shoulders relaxed, look forward',
  };

  // Timer & Repetition State
  const [timerMode, setTimerMode] = useState<'timer' | 'reps'>(() => currentExercise.mode || 'timer');
  const [targetSeconds, setTargetSeconds] = useState<number>(() => currentStep.duration || 30);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => currentStep.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceGuidance, setVoiceGuidance] = useState(true);

  // Repetition Mode State
  const [currentReps, setCurrentReps] = useState(0);
  const [targetReps, setTargetReps] = useState(() => currentExercise.defaultReps || 12);

  // Background Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('Light Workout Beats');
  const [audioVolume, setAudioVolume] = useState(0.45);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Breathing Rhythm State (Inhale 4s, Hold 2s, Exhale 4s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  // Completed tracking
  const [completedStepsInExercise, setCompletedStepsInExercise] = useState<number[]>([]);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [sessionStartTime] = useState<number>(Date.now());
  const [showExerciseCompleteModal, setShowExerciseCompleteModal] = useState(false);
  const [showWorkoutCompleteModal, setShowWorkoutCompleteModal] = useState(false);

  // UI Modals
  const [showLibraryDrawer, setShowLibraryDrawer] = useState(false);
  const [showCustomTimerModal, setShowCustomTimerModal] = useState(false);
  const [showCustomRepsModal, setShowCustomRepsModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState('1');
  const [customSecondsInput, setCustomSecondsInput] = useState('0');
  const [customRepsInput, setCustomRepsInput] = useState('15');
  const [stepCompleteToast, setStepCompleteToast] = useState<string | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('mindcare_fav_exercises');
      return raw ? JSON.parse(raw) : ['ex-squats', 'ex-stretch', 'ex-lunges'];
    } catch {
      return ['ex-squats', 'ex-stretch', 'ex-lunges'];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Toast trigger
  const triggerToast = (msg: string) => {
    if (parentShowToast) {
      parentShowToast(msg);
    } else {
      setStepCompleteToast(msg);
      setTimeout(() => setStepCompleteToast(null), 3000);
    }
  };

  // Toggle favorite
  const isFavorite = favorites.includes(currentExercise.id);
  const toggleFavorite = () => {
    let next: string[];
    if (isFavorite) {
      next = favorites.filter((id) => id !== currentExercise.id);
      triggerToast(`Removed "${currentExercise.name}" from favorites`);
    } else {
      next = [...favorites, currentExercise.id];
      triggerToast(`Added "${currentExercise.name}" to favorites`);
    }
    setFavorites(next);
    try {
      localStorage.setItem('mindcare_fav_exercises', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync state when exercise changes
  useEffect(() => {
    setCurrentStepIndex(0);
    const firstStepDuration = currentExercise.steps?.[0]?.duration || 5;
    setTargetSeconds(firstStepDuration);
    setSecondsLeft(firstStepDuration);
    setIsRunning(false);
    setCurrentReps(0);
    setCompletedStepsInExercise([]);
    if (currentExercise.mode) {
      setTimerMode(currentExercise.mode);
    }
    if (currentExercise.defaultReps) {
      setTargetReps(currentExercise.defaultReps);
    }
  }, [currentExercise.id]);

  // Breathing Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathProgress((prev) => {
        const next = (prev + 0.05) % 1;
        if (next < 0.4) {
          setBreathPhase('inhale');
        } else if (next < 0.6) {
          setBreathPhase('hold');
        } else {
          setBreathPhase('exhale');
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Background Audio Handler
  useEffect(() => {
    if (!isAudioPlaying || isAudioMuted) {
      audioManager.stopAll();
      return;
    }

    const currentTrack = SOUND_TRACKS.find((t) => t.id === selectedTrack) || SOUND_TRACKS[0];
    const effVolume = isAudioMuted ? 0 : audioVolume;

    if (currentTrack.type === 'nature') {
      audioManager.stopInstrumentSound();
      audioManager.startNatureSound(currentTrack.id as any, effVolume);
    } else {
      audioManager.stopNatureSound();
      audioManager.startInstrumentSound(currentTrack.id as any, effVolume);
    }

    return () => {
      audioManager.stopAll();
    };
  }, [isAudioPlaying, selectedTrack, audioVolume, isAudioMuted]);

  // Step-by-Step Guided Timer: advance to next step automatically
  const advanceToNextStep = (keepRunning: boolean) => {
    // Record current step as completed
    setCompletedStepsInExercise((prev) => (prev.includes(safeStepIndex) ? prev : [...prev, safeStepIndex]));

    if (safeStepIndex < totalSteps - 1) {
      const nextIdx = safeStepIndex + 1;
      const nextStep = steps[nextIdx];
      const nextDur = nextStep?.duration || 5;

      setCurrentStepIndex(nextIdx);
      setTargetSeconds(nextDur);
      setSecondsLeft(nextDur);
      setIsRunning(keepRunning);

      if (soundEnabled) {
        audioManager.playCompletionSound('Chime', 0.4);
      }
      triggerToast(`✓ Step ${safeStepIndex + 1} complete → Step ${nextIdx + 1}: ${nextStep?.title}`);

      if (voiceGuidance) {
        audioManager.speakGuidance(`Step ${nextIdx + 1}: ${nextStep?.title}. ${nextStep?.instruction || ''}`);
      }
    } else {
      // Completed all steps of this exercise!
      setIsRunning(false);
      setSecondsLeft(0);
      if (soundEnabled) {
        audioManager.playSuccessChime(0.55);
      }
      setCompletedExercisesCount((prev) => prev + 1);
      setShowExerciseCompleteModal(true);
      triggerToast(`🎉 ${currentExercise.name} completed!`);
      if (voiceGuidance) {
        audioManager.speakGuidance(`Great work! You have completed ${currentExercise.name}.`);
      }
    }
  };

  // Jump directly to a specific step
  const goToStep = (idx: number, preserveRunning: boolean = false) => {
    const clamped = Math.max(0, Math.min(idx, totalSteps - 1));
    const targetStep = steps[clamped];
    const dur = targetStep?.duration || 5;
    setCurrentStepIndex(clamped);
    setTargetSeconds(dur);
    setSecondsLeft(dur);
    setIsRunning(preserveRunning ? isRunning : false);
    if (voiceGuidance) {
      audioManager.speakGuidance(`Step ${clamped + 1}: ${targetStep?.title}`);
    }
  };

  const handleNextStep = () => {
    advanceToNextStep(isRunning);
  };

  const handlePrevStep = () => {
    if (safeStepIndex > 0) {
      goToStep(safeStepIndex - 1, isRunning);
    } else if (safeExerciseIndex > 0) {
      const prevExIdx = safeExerciseIndex - 1;
      setExerciseIndex(prevExIdx);
      setCurrentStepIndex(0);
      const prevFirstDur = activeExercises[prevExIdx]?.steps?.[0]?.duration || 5;
      setTargetSeconds(prevFirstDur);
      setSecondsLeft(prevFirstDur);
      setIsRunning(false);
    }
  };

  const handleNextExercise = () => {
    setShowExerciseCompleteModal(false);
    if (safeExerciseIndex < activeExercises.length - 1) {
      setExerciseIndex((prev) => prev + 1);
      setCurrentStepIndex(0);
      setIsRunning(false);
    } else {
      setShowWorkoutCompleteModal(true);
    }
  };

  // Pure countdown timer - decrements active step secondsLeft
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timerMode === 'timer' && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode, secondsLeft]);

  // Automatic Step Progression: triggered when secondsLeft reaches 0
  useEffect(() => {
    if (isRunning && timerMode === 'timer' && secondsLeft === 0) {
      // Automatically advance to the next step and continue the timer if autoNext is enabled!
      advanceToNextStep(autoNext);
    }
  }, [secondsLeft, isRunning, timerMode, autoNext, safeStepIndex, totalSteps]);

  // Timer controls
  const handleTogglePlayPause = () => {
    if (secondsLeft === 0) {
      const dur = currentStep.duration || 5;
      setSecondsLeft(dur);
      setTargetSeconds(dur);
    }
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    if (nextRunning && voiceGuidance && secondsLeft === targetSeconds) {
      audioManager.speakGuidance(`Step ${safeStepIndex + 1}: ${currentStep.title}. ${currentStep.instruction || ''}`);
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    const dur = currentStep.duration || 5;
    setTargetSeconds(dur);
    setSecondsLeft(dur);
    setCurrentReps(0);
    triggerToast(`Step ${safeStepIndex + 1} timer reset to ${dur}s`);
  };

  const handleResetToStep1 = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    const firstDur = steps[0]?.duration || 5;
    setTargetSeconds(firstDur);
    setSecondsLeft(firstDur);
    setCompletedStepsInExercise([]);
    setCurrentReps(0);
    triggerToast(`Reset to Step 1: ${steps[0]?.title}`);
  };

  const adjustStepDuration = (deltaSecs: number) => {
    const newTarget = Math.max(3, targetSeconds + deltaSecs);
    setTargetSeconds(newTarget);
    setSecondsLeft((prev) => Math.max(1, prev + deltaSecs));
    triggerToast(`Step duration: ${newTarget}s (${deltaSecs > 0 ? '+' : ''}${deltaSecs}s)`);
  };

  const handleSetPreset = (secs: number) => {
    setTargetSeconds(secs);
    setSecondsLeft(secs);
    triggerToast(`Step duration set to ${secs}s`);
  };

  const handleApplyCustomTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Math.max(0, parseInt(customMinutesInput, 10) || 0);
    const secs = Math.max(0, parseInt(customSecondsInput, 10) || 0);
    const total = mins * 60 + secs;
    if (total > 0) {
      setTargetSeconds(total);
      setSecondsLeft(total);
      setShowCustomTimerModal(false);
      triggerToast(`Custom step duration set to ${mins}m ${secs}s`);
    }
  };

  // Repetition controls
  const handleAddRep = () => {
    const next = currentReps + 1;
    setCurrentReps(next);
    if (next >= targetReps) {
      if (soundEnabled) {
        audioManager.playCompletionSound('Chime', 0.4);
      }
      triggerToast(`✓ Target ${targetReps} reps completed!`);
      if (autoNext) {
        setTimeout(() => {
          advanceToNextStep(false);
        }, 500);
      }
    }
  };

  const handleSubtractRep = () => {
    setCurrentReps((prev) => Math.max(0, prev - 1));
  };

  const handleApplyCustomReps = (e: React.FormEvent) => {
    e.preventDefault();
    const reps = Math.max(1, parseInt(customRepsInput, 10) || 10);
    setTargetReps(reps);
    setShowCustomRepsModal(false);
    triggerToast(`Target repetitions set to ${reps}`);
  };

  // Formatted timer mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculations
  const stepPercent = totalSteps > 0 ? Math.round(((safeStepIndex + 1) / totalSteps) * 100) : 0;
  const exercisePercent = activeExercises.length > 0 ? Math.round(((safeExerciseIndex + 1) / activeExercises.length) * 100) : 0;
  const timerPercent = targetSeconds > 0 ? Math.max(0, Math.min(100, Math.round(((targetSeconds - secondsLeft) / targetSeconds) * 100))) : 0;
  const repsPercent = targetReps > 0 ? Math.min(100, Math.round((currentReps / targetReps) * 100)) : 0;

  // Drawer search filter
  const drawerList = activeExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* ================= 1. HEADER & CATEGORY BAR ================= */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Guided Movement & Exercise</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  <Sparkles className="h-3 w-3" /> Dummy Visual Guidance
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Step-by-step posture alignment, real-time timer/rep tracking, and supportive soundscapes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLibraryDrawer(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 border border-slate-200/60"
            >
              <ListFilter className="h-4 w-4 text-teal-600" />
              <span>Browse 14 Exercises</span>
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-xl border transition active:scale-95 ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
              title={isFavorite ? 'Saved in favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 no-scrollbar border-t border-slate-100 mt-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExerciseIndex(0);
                  setCurrentStepIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. MAIN UNIFIED WORKOUT INTERFACE (TWO COLUMNS ON DESKTOP) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN (lg:col-span-7): HUMAN-DUMMY VISUAL GUIDANCE & STEP PILLS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            {/* Visual Top Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-teal-100/70 text-teal-800 border border-teal-200/70">
                  {currentExercise.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {currentExercise.difficulty} Level
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Step {safeStepIndex + 1} of {totalSteps}
                </span>
                <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${stepPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Human Dummy SVG Container */}
            <div className="p-4 sm:p-6 bg-linear-to-b from-slate-50/80 via-white to-teal-50/20 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] relative">
              <ExercisePostureVisual
                imageKey={currentStep.imageKey || currentStep.image}
                title={currentStep.title}
                motionDirection={currentStep.motionDirection}
                motionArrowLabel={currentStep.motionArrowLabel}
                postureTips={currentStep.postureTips}
                postureCue={currentStep.postureCue}
                breathPhase={breathPhase}
                breathProgress={breathProgress}
                showBreathingRing={true}
              />
            </div>

            {/* Step Selection Pill Tabs */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                Movement Steps:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {steps.map((st, idx) => {
                  const isActive = idx === safeStepIndex;
                  const isDone = completedStepsInExercise.includes(idx);
                  return (
                    <button
                      key={st.stepNumber || idx}
                      onClick={() => goToStep(idx, false)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between gap-1.5 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs scale-102 ring-2 ring-teal-600/20'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {st.title.split(' ')[0]}
                      </span>
                      {isDone && !isActive && <Check className="h-3 w-3 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Alignment Reference Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-teal-600" />
              Body Alignment Checklist
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Spine</span>
                <span>Straight & Neutral</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Shoulders</span>
                <span>Relaxed & Down</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Knees</span>
                <span>Aligned Over Toes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="block text-[10px] text-slate-400 uppercase font-black">Breathing</span>
                <span>Smooth Diaphragmatic</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-5): STEP DETAILS, TIMER/REPS, BREATHING, AUDIO, CONTROLS */}
        <div className="lg:col-span-5 space-y-4">
          {/* EXERCISE NAME & CURRENT STEP INSTRUCTION CARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700">
                  {currentExercise.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentExercise.name}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
                Step {safeStepIndex + 1}/{totalSteps}
              </span>
            </div>

            {/* Instruction Box */}
            <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100/80 space-y-1.5">
              <div className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-600" />
                {currentStep.title}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Posture Cues Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Correct Posture Cues:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentStep.postureTips || [
                  'Keep back straight',
                  'Relax shoulders',
                  'Look forward',
                  'Move with control',
                ]).map((tip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    <Check className="h-3 w-3 text-teal-600" /> {tip}
                  </span>
                ))}
              </div>
            </div>

            {/* Breathing Guidance Banner */}
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1 text-blue-800">
                  <Wind className="h-3.5 w-3.5 text-blue-600" /> Breathing Guidance
                </span>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-blue-700 px-2 py-0.5 rounded-full bg-blue-100/70">
                  {breathPhase.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                {breathPhase === 'inhale'
                  ? currentExercise.breathingInhale || 'Inhale smoothly through nose as you prepare'
                  : breathPhase === 'hold'
                  ? 'Hold briefly with steady core tension'
                  : currentExercise.breathingExhale || 'Exhale with control through mouth as you execute'}
              </p>
            </div>
          </div>

          {/* TIMER OR REPETITION COUNTER CARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-4">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => {
                    setTimerMode('timer');
                    setIsRunning(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timerMode === 'timer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" /> Timed Hold
                </button>
                <button
                  onClick={() => {
                    setTimerMode('reps');
                    setIsRunning(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timerMode === 'reps'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Repeat className="h-3.5 w-3.5" /> Repetitions
                </button>
              </div>

              {/* Voice Guidance, Chime toggle & Custom Duration */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const nextVal = !voiceGuidance;
                    setVoiceGuidance(nextVal);
                    if (nextVal) {
                      audioManager.speakGuidance('Voice coach enabled');
                      triggerToast('Voice coach enabled');
                    } else {
                      audioManager.cancelSpeech();
                      triggerToast('Voice coach muted');
                    }
                  }}
                  className={`p-2 rounded-xl border transition ${
                    voiceGuidance
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                  title={voiceGuidance ? 'Voice guidance on' : 'Voice guidance muted'}
                >
                  {voiceGuidance ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`p-2 rounded-xl border transition ${
                    soundEnabled
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                  title={soundEnabled ? 'Chime sound on' : 'Chime muted'}
                >
                  {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => (timerMode === 'timer' ? setShowCustomTimerModal(true) : setShowCustomRepsModal(true))}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                  title="Configure target"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Display: Timer Mode vs Reps Mode */}
            {timerMode === 'timer' ? (
              <div className="text-center space-y-3 py-1">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 select-none">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  {isRunning ? '⏱ Timer in progress (auto-advancing)' : secondsLeft === 0 ? '✓ Step Complete!' : 'Ready to start'}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      secondsLeft === 0 ? 'bg-emerald-500' : isRunning ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${timerPercent}%` }}
                  />
                </div>

                {/* Presets & Quick Duration Adjust */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <button
                    onClick={() => adjustStepDuration(-5)}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-0.5 active:scale-95"
                    title="Subtract 5 seconds"
                  >
                    <Minus className="h-3 w-3" /> 5s
                  </button>
                  {TIMER_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSetPreset(p.seconds)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                        targetSeconds === p.seconds
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => adjustStepDuration(5)}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-0.5 active:scale-95"
                    title="Add 5 seconds"
                  >
                    <Plus className="h-3 w-3" /> 5s
                  </button>
                  <button
                    onClick={() => setShowCustomTimerModal(true)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    Custom
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 py-1">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleSubtractRep}
                    className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition"
                    title="Minus 1 Rep"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <div className="min-w-[140px]">
                    <div className="text-5xl font-black text-slate-900 tracking-tight">
                      {currentReps} <span className="text-2xl text-slate-400 font-bold">/ {targetReps}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-bold mt-0.5">Completed Repetitions</div>
                  </div>
                  <button
                    onClick={handleAddRep}
                    className="h-12 w-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center active:scale-95 shadow-xs transition"
                    title="Plus 1 Rep"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {/* Rep Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      currentReps >= targetReps ? 'bg-emerald-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${repsPercent}%` }}
                  />
                </div>

                {/* Reps Presets */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {REP_PRESETS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setTargetReps(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                        targetReps === r
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomRepsModal(true)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    Custom
                  </button>
                </div>
              </div>
            )}

            {/* Next Step Preview */}
            {safeStepIndex < totalSteps - 1 && (
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600 truncate">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Next: <strong className="text-slate-800">Step {safeStepIndex + 2} — {steps[safeStepIndex + 1]?.title}</strong></span>
                </span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0 ml-2">
                  {steps[safeStepIndex + 1]?.duration || 5}s
                </span>
              </div>
            )}

            {/* Auto Next Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Auto-advance to next step
              </span>
              <button
                onClick={() => setAutoNext((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  autoNext ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autoNext ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* BACKGROUND AUDIO PLAYER CARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Music className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                    Background Audio
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isAudioPlaying ? 'Playing ' + selectedTrack : 'Select workout soundscape'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAudioPlaying((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    isAudioPlaying
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isAudioPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>{isAudioPlaying ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
              </div>
            </div>

            {/* Sound Selector dropdown / buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {SOUND_TRACKS.map((t) => {
                const isSelected = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrack(t.id);
                      setIsAudioPlaying(true);
                    }}
                    className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-left transition truncate ${
                      isSelected
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsAudioMuted((prev) => !prev)}
                className="text-slate-400 hover:text-slate-700"
                title={isAudioMuted ? 'Unmute' : 'Mute'}
              >
                {isAudioMuted || audioVolume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-slate-600" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isAudioMuted ? 0 : audioVolume}
                onChange={(e) => {
                  setAudioVolume(parseFloat(e.target.value));
                  setIsAudioMuted(false);
                }}
                className="w-full accent-purple-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                {Math.round((isAudioMuted ? 0 : audioVolume) * 100)}%
              </span>
            </div>
          </div>

          {/* PRIMARY WORKOUT CONTROLS */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handlePrevStep}
                disabled={safeStepIndex === 0 && safeExerciseIndex === 0}
                className="py-3 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 disabled:opacity-40 transition active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleTogglePlayPause}
                className={`col-span-2 py-3 px-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xs transition active:scale-95 text-white ${
                  isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> {secondsLeft < targetSeconds && secondsLeft > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              <button
                onClick={handleNextStep}
                className="py-3 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 transition active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
                <span>Next</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetTimer}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  title="Reset current step duration"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Step
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleResetToStep1}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  title="Restart exercise from Step 1"
                >
                  Restart Step 1
                </button>
              </div>

              <button
                onClick={() => setShowWorkoutCompleteModal(true)}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <Trophy className="h-3.5 w-3.5" /> Finish Workout
              </button>
            </div>
          </div>

          {/* OVERALL WORKOUT PROGRESS */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Overall Routine Progress
              </span>
              <span>
                Exercise {safeExerciseIndex + 1} of {activeExercises.length} ({exercisePercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${exercisePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. SAFETY DISCLAIMER CARD ================= */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-start gap-3 text-slate-600 text-xs leading-relaxed">
        <ShieldAlert className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">Gentle Movement Guidance</span>
          Exercise guidance is for general wellness support. Move within your comfort level and stop if you experience pain, dizziness, or discomfort. Consult a healthcare professional before beginning any new exercise routine.
        </div>
      </div>

      {/* ================= MODAL: LIBRARY DRAWER (14 EXERCISES) ================= */}
      {showLibraryDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <ListFilter className="h-5 w-5 text-teal-600" /> Exercise Library
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select from 14 comprehensive human-dummy guided movements
                </p>
              </div>
              <button
                onClick={() => setShowLibraryDrawer(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by exercise name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
              {drawerList.map((ex, idx) => {
                const isCurrent = ex.id === currentExercise.id;
                const isFav = favorites.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => {
                      const actualIdx = activeExercises.findIndex((item) => item.id === ex.id);
                      if (actualIdx !== -1) {
                        setExerciseIndex(actualIdx);
                        setCurrentStepIndex(0);
                        setIsRunning(false);
                        setShowLibraryDrawer(false);
                      }
                    }}
                    className={`p-3.5 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-teal-50 border border-teal-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-100/60 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {ex.steps.length}s
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{ex.name}</h4>
                          {isFav && <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{ex.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                        {ex.category}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-teal-600 text-white">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CUSTOM TIMER ================= */}
      {showCustomTimerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" /> Custom Step Duration
              </h3>
              <button
                onClick={() => setShowCustomTimerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApplyCustomTimer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-center text-lg font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSecondsInput}
                    onChange={(e) => setCustomSecondsInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-center text-lg font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomTimerModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs"
                >
                  Set Duration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CUSTOM REPS ================= */}
      {showCustomRepsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Repeat className="h-4 w-4 text-teal-600" /> Target Repetitions
              </h3>
              <button
                onClick={() => setShowCustomRepsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApplyCustomReps} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customRepsInput}
                  onChange={(e) => setCustomRepsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-center text-lg font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomRepsModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs"
                >
                  Set Target Reps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXERCISE COMPLETE CELEBRATION ================= */}
      {showExerciseCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Exercise Complete ✓
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {currentExercise.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                You successfully completed all {totalSteps} guided movement steps with proper alignment!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Steps Mastered</span>
                <span className="text-sm font-extrabold text-slate-900 block">{totalSteps} Steps</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Est. Energy</span>
                <span className="text-sm font-extrabold text-teal-700 block">~{currentExercise.caloriesBurned || 40} kcal</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowExerciseCompleteModal(false);
                  setShowWorkoutCompleteModal(true);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Finish Workout
              </button>
              <button
                onClick={handleNextExercise}
                className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition"
              >
                Next Exercise →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: WORKOUT COMPLETE CELEBRATION ================= */}
      {showWorkoutCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                Workout Complete 🎉
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Outstanding Practice!
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                You took mindful care of your body today. Consistency and gentle movement build lasting vitality.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Exercises</span>
                <span className="text-base font-extrabold text-slate-900 block">
                  {Math.max(1, completedExercisesCount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Time Active</span>
                <span className="text-base font-extrabold text-teal-700 block">
                  {Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000))}m
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Streak</span>
                <span className="text-base font-extrabold text-amber-600 block">Active 🔥</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowWorkoutCompleteModal(false);
                  setExerciseIndex(0);
                  setCurrentStepIndex(0);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Start Again
              </button>
              <button
                onClick={() => setShowWorkoutCompleteModal(false)}
                className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP COMPLETE TOAST ================= */}
      {stepCompleteToast && !parentShowToast && (
        <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-slate-900/90 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{stepCompleteToast}</span>
        </div>
      )}
    </div>
  );
};
