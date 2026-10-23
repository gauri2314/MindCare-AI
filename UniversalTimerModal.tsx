import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, Bell, CheckCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface UniversalTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  defaultMinutes?: number;
  activityType?: 'meditation' | 'yoga' | 'exercise' | 'breathing' | 'general';
  onCompleted?: (minutes: number) => void;
}

const PRESETS = [2, 5, 10, 15, 20, 30];
const SOUNDS: Array<'Bell' | 'Chime' | 'Singing Bowl' | 'Gong' | 'Soft Bell'> = [
  'Bell',
  'Chime',
  'Singing Bowl',
  'Gong',
  'Soft Bell',
];

export const UniversalTimerModal: React.FC<UniversalTimerModalProps> = ({
  isOpen,
  onClose,
  title,
  defaultMinutes = 5,
  activityType = 'general',
  onCompleted,
}) => {
  const [targetSeconds, setTargetSeconds] = useState(defaultMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'Bell' | 'Chime' | 'Singing Bowl' | 'Gong' | 'Soft Bell'>('Bell');
  const [volume, setVolume] = useState(0.7);
  const [customInputMinutes, setCustomInputMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setTargetSeconds(defaultMinutes * 60);
    setRemainingSeconds(defaultMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [defaultMinutes, isOpen]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            audioManager.playCompletionSound(selectedSound, volume);
            try {
              confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
            const completedMins = Math.round(targetSeconds / 60);
            if (onCompleted) {
              onCompleted(completedMins);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetSeconds, selectedSound, volume, onCompleted]);

  if (!isOpen) return null;

  const handleSelectPreset = (mins: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setShowCustomInput(false);
    setTargetSeconds(mins * 60);
    setRemainingSeconds(mins * 60);
  };

  const handleApplyCustom = () => {
    const mins = parseInt(customInputMinutes, 10);
    if (mins && mins > 0 && mins <= 180) {
      handleSelectPreset(mins);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(targetSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = targetSeconds > 0 ? ((targetSeconds - remainingSeconds) / targetSeconds) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        id="universal-timer-dialog"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Universal Wellness Timer
            </span>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          <button
            id="timer-close-btn"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close timer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative flex h-52 w-52 items-center justify-center">
            {/* SVG circular progress */}
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-teal-500 transition-all duration-500 ease-out"
                strokeWidth="7"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              {isCompleted ? (
                <div className="flex flex-col items-center text-teal-600">
                  <CheckCircle className="h-10 w-10 animate-bounce mb-1" />
                  <span className="text-sm font-semibold">Completed!</span>
                  <span className="text-xs text-slate-500">Mindful Session Done</span>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
                    {formatTime(remainingSeconds)}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {isRunning ? 'Session in progress' : 'Ready to start'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <button
            id="timer-reset-btn"
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            id="timer-play-pause-btn"
            onClick={() => {
              if (isCompleted) {
                handleReset();
              } else {
                setIsRunning(!isRunning);
              }
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition"
          >
            {isRunning ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
          </button>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">Preset Durations:</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => handleSelectPreset(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  targetSeconds === m * 60 && !showCustomInput
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m}m
              </button>
            ))}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                showCustomInput
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Custom
            </button>
          </div>

          {showCustomInput && (
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="180"
                placeholder="Minutes"
                value={customInputMinutes}
                onChange={(e) => setCustomInputMinutes(e.target.value)}
                className="w-28 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleApplyCustom}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
              >
                Set
              </button>
            </div>
          )}
        </div>

        {/* Sound Selection & Volume */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Bell className="h-3.5 w-3.5 text-teal-600" />
              Completion Sound:
            </span>
            <select
              value={selectedSound}
              onChange={(e) => {
                const s = e.target.value as any;
                setSelectedSound(s);
                audioManager.playCompletionSound(s, volume);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              {SOUNDS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Volume2 className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] w-6 text-right">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
