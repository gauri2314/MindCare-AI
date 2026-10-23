import React, { useState, useEffect, useRef } from 'react';
import { YogaPose, YogaStep } from '../types';
import { YOGA_LIBRARY } from '../data/initialData';
import { YogaPostureVisual } from '../components/YogaPostureVisual';
import { audioManager } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
  ListFilter,
  Plus,
  Minus,
  Heart,
  X,
  Search,
  Wind,
  Shield,
  Music,
  Trees,
  Sliders,
  Mic,
  MicOff,
} from 'lucide-react';

interface YogaViewProps {
  onOpenTimerModal?: (title: string, mins: number) => void;
  showToast?: (msg: string) => void;
}

const CATEGORIES = [
  'All',
  'Beginner Yoga',
  'Morning Yoga',
  'Evening Yoga',
  'Flexibility',
  'Relaxation',
  'Stress Relief',
  'Balance',
  'Strength',
  'Mobility',
  'Gentle Yoga',
  'Yoga for Focus',
  'Yoga for Better Sleep',
] as const;

const PRESET_DURATIONS = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
];

const MUSIC_TRACKS = [
  { id: 'None', label: 'No Music' },
  { id: 'Flute', label: 'Zen Bamboo Flute' },
  { id: 'Piano', label: 'Gentle Piano Arpeggio' },
  { id: 'Guitar', label: 'Acoustic Meditative Guitar' },
  { id: 'Violin', label: 'Serene String Harmonics' },
  { id: 'Vina', label: 'Indian Classical Vina' },
] as const;

const NATURE_TRACKS = [
  { id: 'None', label: 'No Nature Sound' },
  { id: 'Ocean', label: 'Calm Ocean Tide' },
  { id: 'Rain', label: 'Soft Rain on Leaves' },
  { id: 'Birds', label: 'Morning Forest Birds' },
  { id: 'Forest', label: 'Pine Forest Breeze' },
  { id: 'Wind', label: 'Mountain Wind' },
  { id: 'Flowing Water', label: 'Flowing Zen Stream' },
] as const;

export const YogaView: React.FC<YogaViewProps> = ({ showToast: parentShowToast }) => {
  // Category & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [poseIndex, setPoseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Filtered poses list based on category
  const filteredPoses = YOGA_LIBRARY.filter((pose) => {
    if (selectedCategory === 'All') return true;
    return pose.category === selectedCategory;
  });

  const activePoses = filteredPoses.length > 0 ? filteredPoses : YOGA_LIBRARY;
  const safePoseIndex = Math.min(poseIndex, activePoses.length - 1);
  const currentPose: YogaPose = activePoses[safePoseIndex] || YOGA_LIBRARY[0];

  const steps: YogaStep[] = currentPose?.steps && currentPose.steps.length > 0
    ? currentPose.steps
    : [
        {
          stepNumber: 1,
          title: 'Starting Position',
          instruction: currentPose.instructions?.[0] || 'Maintain balanced posture with relaxed breathing.',
          imageKey: 'mountain-step-1',
          duration: 30,
          postureCue: 'Keep your spine straight',
          keyAlignment: 'Relax shoulders and breathe slowly',
        },
      ];

  const totalSteps = steps.length;
  const safeStepIndex = Math.min(currentStepIndex, Math.max(0, totalSteps - 1));
  const currentStep: YogaStep = steps[safeStepIndex] || steps[0];

  // Timer & Round State
  const [practiceMode, setPracticeMode] = useState<'timer' | 'rounds'>('timer');
  const [targetSeconds, setTargetSeconds] = useState<number>(() => currentStep.duration || 30);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => currentStep.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [soundChimeEnabled, setSoundChimeEnabled] = useState(true);
  const [voiceGuidance, setVoiceGuidance] = useState(true);

  // Flow Round State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(4);

  // Breathing Guide State
  const [enableBreathingGuide, setEnableBreathingGuide] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathProgress, setBreathProgress] = useState(0);

  // Audio Player State
  const [selectedMusic, setSelectedMusic] = useState<string>('Flute');
  const [selectedNature, setSelectedNature] = useState<string>('Ocean');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(55);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioPanel, setShowAudioPanel] = useState(false);

  // UI state
  const [showDetails, setShowDetails] = useState(false);
  const [showLibraryDrawer, setShowLibraryDrawer] = useState(false);
  const [showCustomTimerModal, setShowCustomTimerModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState('1');
  const [customSecondsInput, setCustomSecondsInput] = useState('00');
  const [stepCompleteToast, setStepCompleteToast] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('mindcare_fav_yoga');
      return raw ? JSON.parse(raw) : ['yoga-tree', 'yoga-child', 'yoga-cat-cow'];
    } catch {
      return ['yoga-tree', 'yoga-child', 'yoga-cat-cow'];
    }
  });

  const intervalRef = useRef<any>(null);
  const breathIntervalRef = useRef<any>(null);

  const showNotification = (msg: string) => {
    setStepCompleteToast(msg);
    if (parentShowToast) {
      setTimeout(() => {
        parentShowToast(msg);
      }, 0);
    }
    setTimeout(() => {
      setStepCompleteToast(null);
    }, 3200);
  };

  // Sync step duration when pose changes
  useEffect(() => {
    setCurrentStepIndex(0);
    const firstStepDuration = currentPose.steps?.[0]?.duration || 20;
    setTargetSeconds(firstStepDuration);
    setSecondsLeft(firstStepDuration);
    setIsRunning(false);
  }, [currentPose.id]);

  // Audio synchronization
  useEffect(() => {
    if (isAudioPlaying && !isMuted) {
      const effectiveVol = audioVolume / 100;
      if (selectedNature !== 'None') {
        audioManager.startNatureSound(selectedNature as any, effectiveVol);
      } else {
        audioManager.stopNatureSound();
      }

      if (selectedMusic !== 'None') {
        audioManager.startInstrumentSound(selectedMusic as any, effectiveVol);
      } else {
        audioManager.stopInstrumentSound();
      }
    } else {
      audioManager.stopAll();
    }

    return () => {
      audioManager.stopAll();
    };
  }, [isAudioPlaying, selectedMusic, selectedNature, isMuted]);

  useEffect(() => {
    if (isAudioPlaying && !isMuted) {
      const effectiveVol = audioVolume / 100;
      audioManager.setNatureVolume(effectiveVol);
      audioManager.setInstrumentVolume(effectiveVol);
    }
  }, [audioVolume]);

  // Toggle favorite
  const toggleFavorite = (poseId: string) => {
    const isCurrentlyFav = favorites.includes(poseId);
    const updated = isCurrentlyFav
      ? favorites.filter((id) => id !== poseId)
      : [...favorites, poseId];
    setFavorites(updated);
    try {
      localStorage.setItem('mindcare_fav_yoga', JSON.stringify(updated));
    } catch (e) {}
    showNotification(
      !isCurrentlyFav ? 'Added to favorite poses' : 'Removed from favorites'
    );
  };

  // Breathing guidance rhythmic loop
  useEffect(() => {
    if (!enableBreathingGuide) return;

    const cadence = currentPose.breathingCadence || { inhale: 4, hold: 2, exhale: 6 };
    let currentP: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
    let duration = cadence.inhale;
    let elapsedInPhase = 0;

    setBreathPhase('Inhale');
    setBreathTimer(duration);
    setBreathProgress(0);

    breathIntervalRef.current = setInterval(() => {
      elapsedInPhase += 0.2;
      const remainingSecs = Math.max(0, Math.ceil(duration - elapsedInPhase));
      setBreathTimer(remainingSecs);
      setBreathProgress(Math.min(1, elapsedInPhase / duration));

      if (elapsedInPhase >= duration) {
        elapsedInPhase = 0;
        if (currentP === 'Inhale') {
          if (cadence.hold && cadence.hold > 0) {
            currentP = 'Hold';
            duration = cadence.hold;
          } else {
            currentP = 'Exhale';
            duration = cadence.exhale;
          }
        } else if (currentP === 'Hold') {
          currentP = 'Exhale';
          duration = cadence.exhale;
        } else {
          currentP = 'Inhale';
          duration = cadence.inhale;
        }
        setBreathPhase(currentP);
        setBreathTimer(duration);
        setBreathProgress(0);
      }
    }, 200);

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [enableBreathingGuide, currentPose.id]);

  // Step-by-step guided progression
  const advanceToNextStep = (keepRunning: boolean) => {
    if (safeStepIndex < totalSteps - 1) {
      const nextIdx = safeStepIndex + 1;
      const nextStep = steps[nextIdx];
      const nextDur = nextStep?.duration || 20;

      setCurrentStepIndex(nextIdx);
      setTargetSeconds(nextDur);
      setSecondsLeft(nextDur);
      setIsRunning(keepRunning);

      if (soundChimeEnabled) {
        audioManager.playCompletionSound('Singing Bowl', 0.5);
      }
      showNotification(`✓ Step ${safeStepIndex + 1} completed! → Step ${nextIdx + 1}: ${nextStep?.title}`);

      if (voiceGuidance) {
        audioManager.speakGuidance(`Step ${nextIdx + 1}: ${nextStep?.title}. ${nextStep?.instruction || ''}`);
      }
    } else {
      // Completed all steps of this yoga pose!
      if (soundChimeEnabled) {
        audioManager.playCompletionSound('Singing Bowl', 0.7);
      }
      showNotification(`✨ ${currentPose.englishName || currentPose.name} completed!`);

      if (voiceGuidance) {
        audioManager.speakGuidance(`Wonderful mindfulness. You have completed ${currentPose.englishName || currentPose.name}.`);
      }

      if (autoNext && safePoseIndex < activePoses.length - 1) {
        const nextPoseIdx = safePoseIndex + 1;
        const nextPose = activePoses[nextPoseIdx];
        const nextFirstDur = nextPose?.steps?.[0]?.duration || 20;

        setPoseIndex(nextPoseIdx);
        setCurrentStepIndex(0);
        setTargetSeconds(nextFirstDur);
        setSecondsLeft(nextFirstDur);
        setIsRunning(keepRunning);
        showNotification(`Beginning Next Pose: ${nextPose.englishName || nextPose.name}`);
        if (voiceGuidance) {
          audioManager.speakGuidance(`Next pose: ${nextPose.englishName || nextPose.name}. Step 1: ${nextPose?.steps?.[0]?.title || 'Starting Position'}`);
        }
      } else {
        setIsRunning(false);
        setSecondsLeft(0);
      }
    }
  };

  const goToStep = (idx: number, preserveRunning = false) => {
    const clamped = Math.max(0, Math.min(idx, totalSteps - 1));
    const targetStep = steps[clamped];
    const dur = targetStep?.duration || 20;
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

  const handlePrevPose = (goToLastStep = false) => {
    if (safePoseIndex > 0) {
      const newPoseIdx = safePoseIndex - 1;
      setPoseIndex(newPoseIdx);
      const prevPoseSteps = activePoses[newPoseIdx]?.steps || [];
      const newStepIdx = goToLastStep && prevPoseSteps.length > 0 ? prevPoseSteps.length - 1 : 0;
      setCurrentStepIndex(newStepIdx);
      const dur = prevPoseSteps[newStepIdx]?.duration || 20;
      setTargetSeconds(dur);
      setSecondsLeft(dur);
      setIsRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (safeStepIndex > 0) {
      goToStep(safeStepIndex - 1, isRunning);
    } else if (safePoseIndex > 0) {
      handlePrevPose(true);
    }
  };

  const handleNextPose = () => {
    if (safePoseIndex < activePoses.length - 1) {
      const nextIdx = safePoseIndex + 1;
      setPoseIndex(nextIdx);
      setCurrentStepIndex(0);
      const dur = activePoses[nextIdx]?.steps?.[0]?.duration || 20;
      setTargetSeconds(dur);
      setSecondsLeft(dur);
      setIsRunning(false);
    } else {
      showNotification('Congratulations! You completed all poses in this category.');
    }
  };

  // Main Timer countdown interval (pure countdown, no side effects inside setState)
  useEffect(() => {
    if (!isRunning || practiceMode !== 'timer') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, practiceMode]);

  // Automatic Step Progression: Handle completion when secondsLeft reaches 0
  useEffect(() => {
    if (isRunning && practiceMode === 'timer' && secondsLeft === 0) {
      advanceToNextStep(autoNext);
    }
  }, [secondsLeft, isRunning, practiceMode, autoNext, safeStepIndex, totalSteps, safePoseIndex]);

  const handleTogglePlayPause = () => {
    if (secondsLeft === 0) {
      const dur = currentStep?.duration || 20;
      setSecondsLeft(dur);
      setTargetSeconds(dur);
    }
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    if (nextRunning && voiceGuidance && secondsLeft === targetSeconds) {
      audioManager.speakGuidance(`Step ${safeStepIndex + 1}: ${currentStep.title}. ${currentStep.instruction || ''}`);
    }
  };

  const handleSelectPresetDuration = (secs: number) => {
    setTargetSeconds(secs);
    setSecondsLeft(secs);
    showNotification(`Step duration set to ${secs}s`);
  };

  const adjustStepDuration = (deltaSecs: number) => {
    const newTarget = Math.max(5, targetSeconds + deltaSecs);
    setTargetSeconds(newTarget);
    setSecondsLeft((prev) => Math.max(1, prev + deltaSecs));
    showNotification(`Step duration: ${newTarget}s (${deltaSecs > 0 ? '+' : ''}${deltaSecs}s)`);
  };

  const handleApplyCustomTimer = () => {
    const mins = parseInt(customMinutesInput, 10) || 0;
    const secs = parseInt(customSecondsInput, 10) || 0;
    const total = Math.max(5, mins * 60 + secs);
    setTargetSeconds(total);
    setSecondsLeft(total);
    setShowCustomTimerModal(false);
    showNotification(`Timer set to ${mins}m ${secs}s`);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    const dur = currentStep?.duration || 20;
    setTargetSeconds(dur);
    setSecondsLeft(dur);
    showNotification(`Reset Step ${safeStepIndex + 1} (${dur}s)`);
  };

  const handleResetToStep1 = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    const firstDur = steps[0]?.duration || 20;
    setTargetSeconds(firstDur);
    setSecondsLeft(firstDur);
    showNotification(`Reset to Step 1: ${steps[0]?.title}`);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Overall session completion percentage
  const totalSessionSteps = activePoses.reduce((acc, p) => acc + (p.steps?.length || 1), 0);
  const currentCompletedSteps =
    activePoses.slice(0, safePoseIndex).reduce((acc, p) => acc + (p.steps?.length || 1), 0) +
    safeStepIndex;
  const progressPercent = Math.min(
    100,
    Math.round((currentCompletedSteps / Math.max(1, totalSessionSteps)) * 100)
  );

  const isFavorite = favorites.includes(currentPose.id);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Step Completion Toast Alert */}
      {stepCompleteToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-slate-700 animate-in slide-in-from-top-3">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{stepCompleteToast}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePrevPose()}
              disabled={safePoseIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Yoga Pose"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {currentPose.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  Pose {safePoseIndex + 1} of {activePoses.length}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-teal-700">
                  Step {safeStepIndex + 1} of {totalSteps}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
                <span>{currentPose.englishName || currentPose.name}</span>
                {currentPose.sanskritName && (
                  <span className="text-xs font-normal text-slate-500 italic">
                    ({currentPose.sanskritName})
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons in Top Bar */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => toggleFavorite(currentPose.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition shadow-2xs ${
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Bookmarked' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => setShowLibraryDrawer(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              <ListFilter className="h-3.5 w-3.5 text-teal-600" />
              <span>Library ({activePoses.length})</span>
            </button>

            <button
              onClick={() => handleNextPose()}
              disabled={safePoseIndex === activePoses.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Yoga Pose"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPoseIndex(0);
                  setCurrentStepIndex(0);
                  setIsRunning(false);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Unified Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================
            LEFT COLUMN (Desktop 7 cols): Human Yoga Dummy Visual Area
           ======================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Visual Header Cues */}
            <div className="flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white text-[11px] font-bold">
                  {safeStepIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {currentStep.title}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                <Clock className="h-3 w-3 text-teal-600" />
                <span>{currentStep.duration || 30}s recommended</span>
              </div>
            </div>

            {/* Central Human Dummy SVG Canvas */}
            <div className="relative my-4 flex-1 flex items-center justify-center">
              <YogaPostureVisual
                poseId={currentPose.id}
                stepNumber={currentStep.stepNumber}
                imageKey={currentStep.imageKey}
                title={currentStep.title}
                instruction={currentStep.instruction}
                motionDirection={currentStep.motionDirection}
                motionArrowLabel={currentStep.motionArrowLabel}
                postureCue={currentStep.postureCue}
                keyAlignment={currentStep.keyAlignment}
                breathPhase={breathPhase}
                breathProgress={breathProgress}
                showBreathingRing={enableBreathingGuide}
              />
            </div>

            {/* Step Instruction Card */}
            <div className="z-10 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  Step Instruction
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {safeStepIndex + 1} of {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Step Sequence Navigator Pills */}
            <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
              {steps.map((st, idx) => {
                const isActive = idx === safeStepIndex;
                const isPassed = idx < safeStepIndex;
                return (
                  <button
                    key={st.stepNumber}
                    onClick={() => goToStep(idx, false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/20'
                        : isPassed
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Step {st.stepNumber}</span>
                    {isPassed && <CheckCircle2 className="h-3 w-3 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Clinical Alignment & Precautions Accordion */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-teal-700 transition"
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-600" />
                Posture Alignment Tips & Clinical Benefits
              </span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {showDetails && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-600 animate-in fade-in duration-150">
                <p className="leading-relaxed">{currentPose.description}</p>

                {currentPose.benefits && currentPose.benefits.length > 0 && (
                  <div className="rounded-xl bg-teal-50/70 p-3 border border-teal-100 text-teal-950">
                    <span className="font-bold text-teal-900 block mb-1">
                      🌿 Holistic Benefits:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-teal-900/90">
                      {currentPose.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPose.commonMistakes && currentPose.commonMistakes.length > 0 && (
                  <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200 text-amber-950">
                    <span className="font-bold text-amber-900 block mb-1">
                      ⚠️ Avoid Common Posture Mistakes:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/90">
                      {currentPose.commonMistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPose.safetyPrecautions && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Safety note: </span>
                    {currentPose.safetyPrecautions}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (Desktop 5 cols): Timer, Breathing, Controls, Audio
           ======================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Integrated Yoga Timer Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            {/* Mode Switcher (Hold Timer vs Flow Rounds) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                Practice Counter
              </span>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
                <button
                  onClick={() => setPracticeMode('timer')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    practiceMode === 'timer'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hold Timer
                </button>
                <button
                  onClick={() => setPracticeMode('rounds')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    practiceMode === 'rounds'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Flow Rounds
                </button>
              </div>
            </div>

            {/* Display: Timer Countdown or Flow Round Counter */}
            {practiceMode === 'timer' ? (
              <div className="py-5 text-center flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRunning ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {isRunning ? 'Holding Pose' : 'Timer Ready'}
                </div>

                <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight my-1">
                  {formatTime(secondsLeft)}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  {isRunning
                    ? 'Maintain calm breathing while holding posture'
                    : 'Tap Start to begin step countdown'}
                </p>

                {/* Preset Time Badges & Adjustments */}
                <div className="mt-4 flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    onClick={() => adjustStepDuration(-5)}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-0.5 active:scale-95"
                    title="Subtract 5 seconds"
                  >
                    <Minus className="h-3 w-3" /> 5s
                  </button>
                  {PRESET_DURATIONS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleSelectPresetDuration(preset.seconds)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        targetSeconds === preset.seconds
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
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
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Custom...
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Breath Flow Repetition
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight my-2">
                  Round {currentRound} of {totalRounds}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setCurrentRound((p) => Math.max(1, p - 1))}
                    disabled={currentRound <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition font-bold"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentRound < totalRounds) {
                        setCurrentRound((p) => p + 1);
                        showNotification(`Completed Round ${currentRound}!`);
                      } else {
                        showNotification('All flow rounds complete!');
                        handleNextStep();
                      }
                    }}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition shadow-2xs"
                  >
                    Next Round
                  </button>
                  <button
                    onClick={() => setCurrentRound((p) => Math.min(12, p + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Next Step Preview */}
            {safeStepIndex < totalSteps - 1 && (
              <div className="my-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600 truncate">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Next: <strong className="text-slate-800">Step {safeStepIndex + 2} — {steps[safeStepIndex + 1]?.title}</strong></span>
                </span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0 ml-2">
                  {steps[safeStepIndex + 1]?.duration || 20}s
                </span>
              </div>
            )}

            {/* Quick Timer Controls: Reset, Voice, Sound, AutoNext */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetTimer}
                  className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition"
                  title="Reset step duration"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleResetToStep1}
                  className="font-semibold text-slate-600 hover:text-slate-900 transition"
                  title="Restart pose from Step 1"
                >
                  Step 1
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const nextVal = !voiceGuidance;
                    setVoiceGuidance(nextVal);
                    if (nextVal) {
                      audioManager.speakGuidance('Voice coach enabled');
                      showNotification('Voice coach enabled');
                    } else {
                      audioManager.cancelSpeech();
                      showNotification('Voice coach muted');
                    }
                  }}
                  className={`flex items-center gap-1 font-semibold transition ${
                    voiceGuidance ? 'text-teal-700' : 'text-slate-400'
                  }`}
                  title="Toggle Voice Guidance"
                >
                  {voiceGuidance ? (
                    <Mic className="h-3.5 w-3.5" />
                  ) : (
                    <MicOff className="h-3.5 w-3.5" />
                  )}
                  <span>Voice</span>
                </button>

                <button
                  onClick={() => setSoundChimeEnabled(!soundChimeEnabled)}
                  className={`flex items-center gap-1 font-semibold transition ${
                    soundChimeEnabled ? 'text-teal-700' : 'text-slate-400'
                  }`}
                  title="Toggle Completion Chime"
                >
                  {soundChimeEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                  <span>Chime</span>
                </button>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                    className="h-3.5 w-3.5 rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Auto Next</span>
                </label>
              </div>
            </div>
          </div>

          {/* Synchronized Breathing Guidance Box */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Wind className="h-3.5 w-3.5 text-teal-600" />
                Breathing Guidance
              </span>

              <button
                onClick={() => setEnableBreathingGuide(!enableBreathingGuide)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg transition ${
                  enableBreathingGuide
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {enableBreathingGuide ? 'Active' : 'Muted'}
              </button>
            </div>

            {enableBreathingGuide ? (
              <div className="flex items-center justify-between gap-3 p-2 bg-teal-50/60 rounded-2xl border border-teal-100/80">
                {/* Visual Breathing Ring */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <div
                    className="absolute rounded-full transition-transform duration-300 ease-out"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor:
                        breathPhase === 'Inhale'
                          ? '#14b8a6'
                          : breathPhase === 'Hold'
                          ? '#38bdf8'
                          : '#6366f1',
                      transform: `scale(${
                        breathPhase === 'Inhale'
                          ? 0.75 + breathProgress * 0.45
                          : breathPhase === 'Hold'
                          ? 1.2
                          : 1.2 - breathProgress * 0.45
                      })`,
                      opacity: 0.35,
                    }}
                  />
                  <span className="relative z-10 text-xs font-black text-slate-800 font-mono">
                    {breathTimer}s
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${
                        breathPhase === 'Inhale'
                          ? 'text-teal-700'
                          : breathPhase === 'Hold'
                          ? 'text-sky-700'
                          : 'text-indigo-700'
                      }`}
                    >
                      {breathPhase}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({currentPose.breathingCadence?.inhale || 4}s • {currentPose.breathingCadence?.hold || 2}s • {currentPose.breathingCadence?.exhale || 6}s)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {currentPose.breathingFocus ||
                      'Inhale deeply through your nose; exhale smoothly to root down.'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-1 text-center">
                Breathing cues paused. Practice at your natural comfortable cadence.
              </p>
            )}
          </div>

          {/* Session Progress Bar Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Overall Session Progress</span>
              <span className="font-extrabold text-teal-700">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>
                Pose {safePoseIndex + 1} of {activePoses.length}
              </span>
              <span>
                Step {safeStepIndex + 1} of {totalSteps}
              </span>
            </div>
          </div>

          {/* Calming Background Music & Nature Sounds Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-teal-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Ambient Yoga Sounds
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isAudioPlaying && !isMuted
                      ? `${selectedMusic !== 'None' ? selectedMusic : ''} ${
                          selectedNature !== 'None' ? `+ ${selectedNature}` : ''
                        }`
                      : 'Audio paused'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                    isAudioPlaying
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="h-3 w-3 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-slate-700" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowAudioPanel(!showAudioPanel)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                  title="Audio track settings"
                >
                  <Sliders className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Audio Settings Panel */}
            {showAudioPanel && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                {/* Music Select */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Calming Music
                  </label>
                  <select
                    value={selectedMusic}
                    onChange={(e) => {
                      setSelectedMusic(e.target.value);
                      if (!isAudioPlaying) setIsAudioPlaying(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  >
                    {MUSIC_TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nature Sounds Select */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nature Ambience
                  </label>
                  <select
                    value={selectedNature}
                    onChange={(e) => {
                      setSelectedNature(e.target.value);
                      if (!isAudioPlaying) setIsAudioPlaying(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  >
                    {NATURE_TRACKS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volume Slider & Mute */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-rose-500" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-teal-600" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : audioVolume}
                    onChange={(e) => {
                      setAudioVolume(parseInt(e.target.value, 10));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-500 w-8 text-right">
                    {isMuted ? '0%' : `${audioVolume}%`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Main Action Navigation Controls */}
          <div className="rounded-3xl bg-slate-900 text-white p-4 shadow-md flex items-center justify-between gap-3">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition text-slate-200"
              title="Previous Step"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleTogglePlayPause}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-98 text-slate-950 font-black text-sm transition shadow-md shadow-teal-500/20"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 fill-slate-950" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Start Practice</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition text-slate-200"
              title="Next Step"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Safety Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed px-2">
            Yoga guidance is for general wellness support. Move within your comfort level
            and stop if you experience pain, dizziness, or discomfort.
          </p>
        </div>
      </div>

      {/* Library Drawer Modal */}
      {showLibraryDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Yoga Pose Sanctuary</h3>
                <p className="text-xs text-slate-500">
                  Select any yoga pose to practice with step-by-step human dummy visual guidance
                </p>
              </div>
              <button
                onClick={() => setShowLibraryDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activePoses.map((p, idx) => {
                const isCurrent = idx === safePoseIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPoseIndex(idx);
                      setCurrentStepIndex(0);
                      setIsRunning(false);
                      setShowLibraryDrawer(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                      isCurrent
                        ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 font-bold text-xs">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {p.englishName || p.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic truncate">
                        {p.sanskritName || p.category}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{p.steps?.length || 4} steps</span>
                        <span>•</span>
                        <span>{p.difficulty}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom Timer Input Modal */}
      {showCustomTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Custom Pose Timer</h4>
              <button
                onClick={() => setShowCustomTimerModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={customMinutesInput}
                  onChange={(e) => setCustomMinutesInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-center font-bold text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={customSecondsInput}
                  onChange={(e) => setCustomSecondsInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-center font-bold text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCustomTimerModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomTimer}
                className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition shadow-2xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
