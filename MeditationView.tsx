import React, { useState, useEffect, useRef } from 'react';
import {
  MeditationItem,
} from '../types';
import { MEDITATION_LIBRARY } from '../data/initialData';
import { BreathingPersonVisual } from '../components/BreathingPersonVisual';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Heart,
  ListFilter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  Search,
  Music,
  CloudRain,
  Waves,
  Trees,
  Wind,
  Droplets,
  Bird,
  Settings2,
  Flame,
  Award,
  RefreshCw,
} from 'lucide-react';

interface MeditationViewProps {
  onOpenTimerModal?: (title: string, mins: number) => void;
  showToast?: (msg: string) => void;
}

const CATEGORIES = [
  'All',
  'Mindful Breathing',
  'Stress Relief',
  'Relaxation',
  'Sleep',
  'Focus',
  'Body Scan',
  'Gratitude',
  'Calm Mind',
  'Morning Meditation',
  'Evening Meditation',
] as const;

const DURATION_PRESETS = [
  { label: '2m', minutes: 2 },
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '15m', minutes: 15 },
  { label: '20m', minutes: 20 },
  { label: '30m', minutes: 30 },
];

const BREATHING_PRESETS = [
  {
    name: '4-4-6 Calm Wave',
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
    desc: 'Gentle autonomic balance',
  },
  {
    name: '4-7-8 Stress Reset',
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 0,
    desc: 'Vagus nerve down-regulation',
  },
  {
    name: 'Box 4-4-4-4',
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    desc: 'Focus & tactical composure',
  },
  {
    name: '4-2-6 Parasympathetic Flow',
    inhale: 4,
    hold: 2,
    exhale: 6,
    rest: 0,
    desc: 'Deep muscle release',
  },
];

type NatureTrack = 'Rain' | 'Ocean' | 'Birds' | 'Forest' | 'Wind' | 'Flowing Water';
type MusicTrack = 'Flute' | 'Piano' | 'Guitar' | 'Violin' | 'Vina';

export const MeditationView: React.FC<MeditationViewProps> = ({ showToast }) => {
  // Category & Active Meditation
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [meditationIndex, setMeditationIndex] = useState(0);

  const filteredMeditations = MEDITATION_LIBRARY.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const activeMeditations =
    filteredMeditations.length > 0 ? filteredMeditations : MEDITATION_LIBRARY;
  const safeIndex = Math.min(meditationIndex, activeMeditations.length - 1);
  const currentMeditation: MeditationItem =
    activeMeditations[safeIndex] || MEDITATION_LIBRARY[0];

  // Session Duration & Timer State
  const [targetMinutes, setTargetMinutes] = useState<number>(
    () => currentMeditation.durationMinutes || 5
  );
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Breathing Cycle State
  const [breathingConfig, setBreathingConfig] = useState(() => {
    return (
      currentMeditation.breathingPattern || {
        name: '4-4-6 Calm Wave',
        inhale: 4,
        hold: 4,
        exhale: 6,
        rest: 2,
      }
    );
  });

  type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0); // 0 to 1 for smooth aura scaling

  // Background Audio State
  const [audioCategory, setAudioCategory] = useState<'nature' | 'music'>('nature');
  const [selectedNatureTrack, setSelectedNatureTrack] = useState<NatureTrack>('Ocean');
  const [selectedMusicTrack, setSelectedMusicTrack] = useState<MusicTrack>('Flute');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const [pauseAudioWithTimer, setPauseAudioWithTimer] = useState(true);

  // UI state
  const [showLibraryDrawer, setShowLibraryDrawer] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showBreathingSelector, setShowBreathingSelector] = useState(false);
  const [customMinsInput, setCustomMinsInput] = useState('10');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mindcare_meditation_streak');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_fav_meditations');
      return saved ? JSON.parse(saved) : ['med-mindful-breathing', 'med-stress'];
    } catch {
      return ['med-mindful-breathing', 'med-stress'];
    }
  });

  const isFavorite = favorites.includes(currentMeditation.id);
  const toggleFavorite = () => {
    let next: string[];
    if (isFavorite) {
      next = favorites.filter((id) => id !== currentMeditation.id);
      showToast?.(`Removed "${currentMeditation.title}" from favorites`);
    } else {
      next = [...favorites, currentMeditation.id];
      showToast?.(`Added "${currentMeditation.title}" to favorites`);
    }
    setFavorites(next);
    try {
      localStorage.setItem('mindcare_fav_meditations', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync breathing config and duration when currentMeditation changes
  useEffect(() => {
    if (currentMeditation.breathingPattern) {
      setBreathingConfig(currentMeditation.breathingPattern);
      setPhaseSecondsLeft(currentMeditation.breathingPattern.inhale);
    } else {
      setPhaseSecondsLeft(4);
    }
    setBreathPhase('Inhale');
    setTargetMinutes(currentMeditation.durationMinutes || 5);
    setSecondsElapsed(0);
    setIsRunning(false);

    // Set suggested sound if available
    if (currentMeditation.suggestedSound) {
      if (currentMeditation.suggestedSound.type === 'music') {
        setAudioCategory('music');
        setSelectedMusicTrack(currentMeditation.suggestedSound.name as MusicTrack);
      } else {
        setAudioCategory('nature');
        setSelectedNatureTrack(currentMeditation.suggestedSound.name as NatureTrack);
      }
    }
  }, [currentMeditation.id]);

  // Audio Playback Controller
  const startActiveAudio = (forceVol?: number) => {
    const vol = forceVol !== undefined ? forceVol : isMuted ? 0 : volume;
    if (audioCategory === 'nature') {
      audioManager.stopInstrumentSound();
      audioManager.startNatureSound(
        selectedNatureTrack === 'Ocean' ? 'Ocean Waves' : selectedNatureTrack === 'Flowing Water' ? 'Water Streams' : selectedNatureTrack,
        vol
      );
    } else {
      audioManager.stopNatureSound();
      audioManager.startInstrumentSound(selectedMusicTrack, vol);
    }
    setIsAudioPlaying(true);
  };

  const stopActiveAudio = () => {
    audioManager.stopAll();
    setIsAudioPlaying(false);
  };

  // Change volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
    if (audioCategory === 'nature') {
      audioManager.setNatureVolume(newVol);
    } else {
      audioManager.setInstrumentVolume(newVol);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      handleVolumeChange(volume || 0.45);
    } else {
      setIsMuted(true);
      if (audioCategory === 'nature') {
        audioManager.setNatureVolume(0);
      } else {
        audioManager.setInstrumentVolume(0);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioManager.stopAll();
    };
  }, []);

  // Main Session Countdown & Breathing Synchronizer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const totalTargetSeconds = targetMinutes * 60;

    if (isRunning) {
      interval = setInterval(() => {
        // 1. Advance total session elapsed time
        setSecondsElapsed((prevElapsed) => {
          const nextElapsed = prevElapsed + 1;
          if (nextElapsed >= totalTargetSeconds) {
            // Completed session!
            handleSessionComplete();
            return totalTargetSeconds;
          }
          return nextElapsed;
        });

        // 2. Advance breathing phase
        setPhaseSecondsLeft((prevPhaseSecs) => {
          if (prevPhaseSecs <= 1) {
            // Transition to next breathing phase
            advanceBreathPhase();
            return 0; // Temporary before state updates in advanceBreathPhase
          }
          return prevPhaseSecs - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, targetMinutes, breathPhase, breathingConfig]);

  // Advance to next breathing phase
  const advanceBreathPhase = () => {
    const inhaleDuration = breathingConfig.inhale || 4;
    const holdDuration = breathingConfig.hold || 0;
    const exhaleDuration = breathingConfig.exhale || 6;
    const restDuration = breathingConfig.rest || 0;

    if (breathPhase === 'Inhale') {
      if (holdDuration > 0) {
        setBreathPhase('Hold');
        setPhaseSecondsLeft(holdDuration);
      } else {
        setBreathPhase('Exhale');
        setPhaseSecondsLeft(exhaleDuration);
      }
    } else if (breathPhase === 'Hold') {
      setBreathPhase('Exhale');
      setPhaseSecondsLeft(exhaleDuration);
    } else if (breathPhase === 'Exhale') {
      if (restDuration > 0) {
        setBreathPhase('Rest');
        setPhaseSecondsLeft(restDuration);
      } else {
        setBreathPhase('Inhale');
        setPhaseSecondsLeft(inhaleDuration);
        setCompletedBreathCycles((prev) => prev + 1);
      }
    } else {
      // Rest -> Inhale
      setBreathPhase('Inhale');
      setPhaseSecondsLeft(inhaleDuration);
      setCompletedBreathCycles((prev) => prev + 1);
    }
  };

  // Calculate phase progress (0 to 1) for the visual aura expansion
  useEffect(() => {
    let phaseTotal = 4;
    if (breathPhase === 'Inhale') phaseTotal = breathingConfig.inhale || 4;
    else if (breathPhase === 'Hold') phaseTotal = breathingConfig.hold || 4;
    else if (breathPhase === 'Exhale') phaseTotal = breathingConfig.exhale || 6;
    else if (breathPhase === 'Rest') phaseTotal = breathingConfig.rest || 2;

    const remaining = Math.max(0, phaseSecondsLeft);
    const progress = Math.max(0, Math.min(1, (phaseTotal - remaining) / phaseTotal));
    setCycleProgress(progress);
  }, [phaseSecondsLeft, breathPhase, breathingConfig]);

  // Session Completion Handler
  const handleSessionComplete = () => {
    setIsRunning(false);
    audioManager.playCompletionSound('Singing Bowl', 0.6);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#0d9488', '#14b8a6', '#6366f1', '#a855f7'],
    });

    // Update streak
    const nextStreak = streakCount + 1;
    setStreakCount(nextStreak);
    try {
      localStorage.setItem('mindcare_meditation_streak', nextStreak.toString());
    } catch (e) {}

    setShowCompletionModal(true);
  };

  // Primary Control Handlers
  const handleTogglePlayPause = () => {
    if (!isRunning) {
      // Start or Resume
      setIsRunning(true);
      // Auto-start ambient audio if not already playing
      if (!isAudioPlaying) {
        startActiveAudio();
      }
    } else {
      // Pause
      setIsRunning(false);
      if (pauseAudioWithTimer && isAudioPlaying) {
        stopActiveAudio();
      }
    }
  };

  const handleResetSession = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setBreathPhase('Inhale');
    setPhaseSecondsLeft(breathingConfig.inhale || 4);
    setCompletedBreathCycles(0);
  };

  const handleEndSessionEarly = () => {
    if (secondsElapsed >= 30) {
      handleSessionComplete();
    } else {
      handleResetSession();
      showToast?.('Session reset');
    }
  };

  // Switch sound track directly
  const handleSelectSoundTrack = (category: 'nature' | 'music', name: string) => {
    setAudioCategory(category);
    if (category === 'nature') {
      setSelectedNatureTrack(name as NatureTrack);
    } else {
      setSelectedMusicTrack(name as MusicTrack);
    }

    if (isAudioPlaying || isRunning) {
      // Immediate switch
      const vol = isMuted ? 0 : volume;
      if (category === 'nature') {
        audioManager.stopInstrumentSound();
        audioManager.startNatureSound(
          name === 'Ocean' ? 'Ocean Waves' : name === 'Flowing Water' ? 'Water Streams' : (name as any),
          vol
        );
      } else {
        audioManager.stopNatureSound();
        audioManager.startInstrumentSound(name as any, vol);
      }
      setIsAudioPlaying(true);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTargetSecs = targetMinutes * 60;
  const remainingSecs = Math.max(0, totalTargetSecs - secondsElapsed);
  const percentComplete = totalTargetSecs > 0 ? Math.min(100, Math.round((secondsElapsed / totalTargetSecs) * 100)) : 0;

  // Drawer search filter
  const drawerList = activeMeditations.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Instructions based on breath phase
  const getInstruction = () => {
    switch (breathPhase) {
      case 'Inhale':
        return {
          title: 'Breathe In',
          subtitle: 'Slowly breathe in through your nose',
          indicator: `INHALE • ${breathingConfig.inhale || 4} sec`,
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'Hold':
        return {
          title: 'Hold',
          subtitle: 'Gently hold your breath in calm awareness',
          indicator: `HOLD • ${breathingConfig.hold || 4} sec`,
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'Exhale':
        return {
          title: 'Breathe Out',
          subtitle: 'Slowly breathe out and relax all tension',
          indicator: `EXHALE • ${breathingConfig.exhale || 6} sec`,
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'Rest':
      default:
        return {
          title: 'Stillness',
          subtitle: 'Rest in tranquil space before the next breath',
          indicator: `REST • ${breathingConfig.rest || 2} sec`,
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
    }
  };

  const instruction = getInstruction();

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* ================= 1. TOP BAR & CATEGORY SWITCHER ================= */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Back / Library Picker Button & Meditation Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLibraryDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95"
              title="Browse all meditation routines"
            >
              <ListFilter className="h-3.5 w-3.5 text-teal-600" />
              <span>Change Meditation</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  {currentMeditation.title}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200/80">
                  {currentMeditation.category}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200/70">
                  {targetMinutes} min session
                </span>
              </div>
            </div>
          </div>

          {/* Right Top Status: Target & Favorite Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              <span>
                {formatTime(remainingSecs)} remaining
              </span>
            </div>

            {/* Favorite / Bookmark Toggle */}
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-xl border transition active:scale-95 ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                  : 'bg-white text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
              title={isFavorite ? 'Saved in favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Ribbon */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Focus:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setMeditationIndex(0);
                  handleResetSession();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2 & 3. MAIN WORKOUT / SESSION AREA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ================= LEFT COLUMN: Visual Guidance + Breathing Animation (lg:col-span-7) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between overflow-hidden relative">
            {/* Ambient Background Aura Gradient */}
            <div className="absolute top-0 right-0 left-0 h-40 bg-radial from-teal-50/70 via-indigo-50/30 to-transparent pointer-events-none -z-0" />

            {/* Visual Header Cues */}
            <div className="relative z-10 flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${instruction.badgeClass}`}>
                {instruction.indicator}
              </span>

              {/* Breathing Rhythm Selector button */}
              <button
                onClick={() => setShowBreathingSelector((prev) => !prev)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                <Settings2 className="h-3 w-3 text-teal-600" />
                <span>{breathingConfig.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </div>

            {/* Breathing Rhythm Drawer Selector if toggled */}
            {showBreathingSelector && (
              <div className="relative z-20 mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
                <span className="font-extrabold text-slate-800 block">Select Breathing Rhythm:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BREATHING_PRESETS.map((bp) => (
                    <button
                      key={bp.name}
                      onClick={() => {
                        setBreathingConfig(bp);
                        setBreathPhase('Inhale');
                        setPhaseSecondsLeft(bp.inhale);
                        setShowBreathingSelector(false);
                      }}
                      className={`text-left p-2 rounded-xl border transition ${
                        breathingConfig.name === bp.name
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{bp.name}</div>
                      <div className="text-[10px] text-slate-500">{bp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= CALMING VISUAL GUIDANCE ================= */}
            <div className="relative z-10 py-2 flex flex-col items-center justify-center min-h-[300px]">
              {/* Dynamic Breathing Circle / Radiant Halo behind Figure */}
              <div
                className="absolute rounded-full transition-all duration-700 ease-out pointer-events-none -z-10"
                style={{
                  width: `${210 + cycleProgress * 110}px`,
                  height: `${210 + cycleProgress * 110}px`,
                  background:
                    breathPhase === 'Inhale'
                      ? 'radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, rgba(20, 184, 166, 0.05) 60%, rgba(255, 255, 255, 0) 75%)'
                      : breathPhase === 'Hold'
                      ? 'radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(56, 189, 248, 0.08) 60%, rgba(255, 255, 255, 0) 75%)'
                      : breathPhase === 'Exhale'
                      ? 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0.05) 60%, rgba(255, 255, 255, 0) 75%)'
                      : 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 60%, rgba(255, 255, 255, 0) 75%)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Meditating Figure SVG */}
              <BreathingPersonVisual
                phase={breathPhase}
                progress={cycleProgress}
                secondsLeft={phaseSecondsLeft}
              />
            </div>

            {/* ================= STEP-BY-STEP GUIDANCE ================= */}
            <div className="relative z-10 mt-3 pt-3 border-t border-slate-100 space-y-2 text-center">
              <div className="text-xl font-black text-slate-900 tracking-tight transition-all">
                {instruction.title}
              </div>
              <p className="text-sm font-semibold text-slate-600">
                {instruction.subtitle}
              </p>

              {/* Wisdom cue from meditation roadmap */}
              {currentMeditation.guideText && currentMeditation.guideText.length > 0 && (
                <div className="mt-2 inline-block rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 text-xs text-slate-600 italic">
                  "{currentMeditation.guideText[completedBreathCycles % currentMeditation.guideText.length]}"
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400">
                <span>Cycle: {completedBreathCycles + 1}</span>
                <span>•</span>
                <span>{breathingConfig.name}</span>
                <span>•</span>
                <span>Soft Nasal Inhale</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Timer + Progress + Sound Controls + Controls (lg:col-span-5) ================= */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-5">
            {/* ================= 4. INTEGRATED TIMER ================= */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Session Timer
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 select-none">
                {formatTime(remainingSecs)}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                {isRunning ? (
                  <span className="text-teal-600 font-bold flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping inline-block" />
                    Meditation in progress
                  </span>
                ) : secondsElapsed > 0 ? (
                  'Session Paused'
                ) : (
                  `${targetMinutes} minute session ready`
                )}
              </div>

              {/* Dynamic Session Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
                <div
                  className="h-full bg-linear-to-r from-teal-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>

              {/* Elapsed / Total Progress text */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2 pt-0.5">
                <span>{formatTime(secondsElapsed)} elapsed</span>
                <span>{percentComplete}%</span>
                <span>{formatTime(totalTargetSecs)} total</span>
              </div>

              {/* Duration Presets */}
              <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected = targetMinutes === preset.minutes;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setTargetMinutes(preset.minutes);
                        handleResetSession();
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                <button
                  onClick={() => setShowCustomModal(true)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                >
                  Custom
                </button>
              </div>
            </div>

            {/* ================= 6. MUSIC & NATURE SOUNDS SECTION ================= */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-teal-50 text-teal-700">
                    <Music className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">Background Ambience</span>
                </div>

                {/* Sound Tab Switcher: Nature vs Music */}
                <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => {
                      setAudioCategory('nature');
                      if (isAudioPlaying) handleSelectSoundTrack('nature', selectedNatureTrack);
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      audioCategory === 'nature' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Nature
                  </button>
                  <button
                    onClick={() => {
                      setAudioCategory('music');
                      if (isAudioPlaying) handleSelectSoundTrack('music', selectedMusicTrack);
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      audioCategory === 'music' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Music
                  </button>
                </div>
              </div>

              {/* Sound Tracks Selector Pills */}
              {audioCategory === 'nature' ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { name: 'Ocean', icon: Waves },
                    { name: 'Rain', icon: CloudRain },
                    { name: 'Birds', icon: Bird },
                    { name: 'Forest', icon: Trees },
                    { name: 'Wind', icon: Wind },
                    { name: 'Flowing Water', icon: Droplets },
                  ].map((track) => {
                    const isSelected = selectedNatureTrack === track.name;
                    const Icon = track.icon;
                    return (
                      <button
                        key={track.name}
                        onClick={() => handleSelectSoundTrack('nature', track.name)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-left border text-xs font-bold transition active:scale-95 ${
                          isSelected
                            ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="truncate text-[11px]">{track.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { name: 'Flute', desc: 'Serene breath' },
                    { name: 'Piano', desc: 'Gentle chords' },
                    { name: 'Guitar', desc: 'Warm acoustic' },
                    { name: 'Violin', desc: 'Sustained harmony' },
                    { name: 'Vina', desc: 'Meditative drone' },
                  ].map((track) => {
                    const isSelected = selectedMusicTrack === track.name;
                    return (
                      <button
                        key={track.name}
                        onClick={() => handleSelectSoundTrack('music', track.name)}
                        className={`p-2 rounded-xl text-left border text-xs font-bold transition active:scale-95 ${
                          isSelected
                            ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span className="truncate block text-[11px]">{track.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Volume Slider & Sound Toggle Controls */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5 flex items-center justify-between gap-3">
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-xl border transition ${
                    isMuted
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>

                {/* Standalone sound play/pause */}
                <button
                  onClick={() => {
                    if (isAudioPlaying) stopActiveAudio();
                    else startActiveAudio();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                    isAudioPlaying
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isAudioPlaying ? 'Playing' : 'Play Sound'}
                </button>
              </div>
            </div>

            {/* ================= 8. MAIN MEDITATION CONTROLS ================= */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-12 gap-2">
                {/* Reset button */}
                <button
                  onClick={handleResetSession}
                  className="col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95"
                  title="Reset session to start"
                >
                  <RotateCcw className="h-4 w-4 mb-0.5" />
                  <span>Reset</span>
                </button>

                {/* Large Primary Pause / Resume / Start Button */}
                <button
                  onClick={handleTogglePlayPause}
                  className={`col-span-6 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all active:scale-95 ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25 ring-4 ring-teal-50'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 fill-white" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 fill-white" />
                      <span>{secondsElapsed === 0 ? 'Start Meditation' : 'Resume Session'}</span>
                    </>
                  )}
                </button>

                {/* End Session Button */}
                <button
                  onClick={handleEndSessionEarly}
                  disabled={secondsElapsed === 0}
                  className="col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 disabled:opacity-40"
                  title="Complete session now"
                >
                  <Square className="h-4 w-4 mb-0.5 text-slate-600" />
                  <span>End</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Ribbon */}
          <div className="rounded-3xl bg-linear-to-r from-teal-50 via-purple-50 to-indigo-50 border border-teal-100 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-teal-200">
                <img
                  src={currentMeditation.imageUrl}
                  alt={currentMeditation.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Active Routine
                </span>
                <span className="text-xs font-black text-slate-900 truncate block">
                  {currentMeditation.title}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLibraryDrawer(true)}
              className="text-xs font-bold text-teal-800 bg-white hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs transition"
            >
              All Meditations
            </button>
          </div>
        </div>
      </div>

      {/* ================= EXPANDABLE GUIDANCE ACCORDION ================= */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-teal-50 text-teal-700">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Meditation Guidance & Clinical Benefits
              </h3>
              <p className="text-xs text-slate-500">
                Explore the scientific focus, mental roadmap, and autonomic benefits
              </p>
            </div>
          </div>

          <div className="p-1 rounded-lg text-slate-400">
            {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {showDetails && (
          <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-200 text-xs">
            <p className="text-slate-700 leading-relaxed">
              {currentMeditation.description}
            </p>

            <div className="space-y-1.5">
              <span className="font-extrabold text-slate-800 block">Mental Roadmap & Awareness Steps:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentMeditation.guideText.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 14. SAFETY & WELLNESS DISCLAIMER ================= */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-3.5 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Info className="h-4 w-4 text-slate-400 shrink-0" />
        <span>
          MindCare AI provides meditation and relaxation guidance for general wellness support. It is not a substitute for professional mental-health care.
        </span>
      </div>

      {/* ================= 9. COMPLETION EXPERIENCE OVERLAY ================= */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-3xl">
              🌿
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Meditation Complete 🌿
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                You completed {Math.max(1, Math.round(secondsElapsed / 60))} minutes of {currentMeditation.title}.
              </p>
            </div>

            {/* Session Summary Card */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Duration
                </span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  {formatTime(secondsElapsed)}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Breath Cycles
                </span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  {completedBreathCycles} Cycles
                </span>
              </div>
            </div>

            {/* Streak update */}
            <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3 flex items-center justify-center gap-2 text-amber-900 text-xs font-bold">
              <Flame className="h-4 w-4 text-amber-600 fill-amber-500" />
              <span>{streakCount} Day Meditation Streak! Keep it going gently.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  handleResetSession();
                  handleTogglePlayPause();
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Meditate Again</span>
              </button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  handleResetSession();
                }}
                className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL / DRAWER: MEDITATION LIBRARY PICKER ================= */}
      {showLibraryDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Select Meditation Routine</h3>
              </div>
              <button
                onClick={() => setShowLibraryDrawer(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input & Category Pills */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search meditation by topic or feeling..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of meditations */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {drawerList.map((item, idx) => {
                const isCurrent = item.id === currentMeditation.id;
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setMeditationIndex(idx);
                      setShowLibraryDrawer(false);
                      handleResetSession();
                    }}
                    className={`group flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      isCurrent
                        ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                            {item.title}
                          </h4>
                          {isFav && <Heart className="h-3 w-3 fill-rose-500 text-rose-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold">
                          <span className="text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{item.durationMinutes} min</span>
                          <span>•</span>
                          <span>{item.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                        isCurrent
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700'
                      }`}
                    >
                      {isCurrent ? 'Active' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CUSTOM TIMER DURATION ================= */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                Custom Session Duration
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Minutes (1 to 60)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinsInput}
                  onChange={(e) => setCustomMinsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-center text-xl font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const mins = Math.max(1, Math.min(60, parseInt(customMinsInput, 10) || 10));
                    setTargetMinutes(mins);
                    handleResetSession();
                    setShowCustomModal(false);
                    showToast?.(`Timer set to ${mins} minutes`);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs"
                >
                  Set Duration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
