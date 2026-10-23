import React from 'react';
import {
  UserProfile,
  DailyTrackerEntry,
  NavigationSection,
  MoodType,
} from '../types';
import { QuickWellnessActions } from '../components/QuickWellnessActions';
import { RecommendedForYou } from '../components/RecommendedForYou';
import {
  Smile,
  Moon,
  Droplets,
  Activity,
  Calendar,
  Flame,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  profile: UserProfile | null;
  todayEntry: DailyTrackerEntry;
  onUpdateMood: (mood: MoodType) => void;
  onAddWater: () => void;
  onNavigate: (section: NavigationSection) => void;
  onOpenBreathingModal: () => void;
  onOpenTimerModal: (title: string, mins: number) => void;
}

const MOODS: Array<{ type: MoodType; emoji: string; label: string; bg: string }> = [
  { type: 'very_happy', emoji: '😄', label: 'Very Happy', bg: 'hover:bg-emerald-50' },
  { type: 'happy', emoji: '🙂', label: 'Happy', bg: 'hover:bg-teal-50' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', bg: 'hover:bg-slate-50' },
  { type: 'sad', emoji: '🙁', label: 'Sad', bg: 'hover:bg-amber-50' },
  { type: 'very_sad', emoji: '😞', label: 'Very Sad', bg: 'hover:bg-rose-50' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  todayEntry,
  onUpdateMood,
  onAddWater,
  onNavigate,
  onOpenBreathingModal,
  onOpenTimerModal,
}) => {
  const userName = profile?.preferredName || profile?.name || 'Alex';

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header & Mood Check-In Banner */}
      <div className="rounded-3xl bg-linear-to-r from-teal-700 via-teal-800 to-cyan-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold tracking-wide">
              <Calendar className="h-3.5 w-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {greetingTime}, {userName} 👋
            </h1>
            <p className="text-sm text-teal-100/90 font-medium">
              How are you feeling right now? Take a gentle moment to check in.
            </p>
          </div>

          {/* Quick Mood Selector Bar */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-white/15">
            <div className="flex items-center gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.type}
                  onClick={() => onUpdateMood(m.type)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 min-w-[54px] transition active:scale-95 ${
                    todayEntry.mood === m.type
                      ? 'bg-white text-teal-900 shadow-md font-bold scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={m.label}
                >
                  <span className="text-2xl leading-none">{m.emoji}</span>
                  <span className="text-[10px] mt-1 whitespace-nowrap">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended For You Section */}
      <RecommendedForYou
        profile={profile}
        todayEntry={todayEntry}
        onNavigate={onNavigate}
        onOpenBreathingModal={onOpenBreathingModal}
        onOpenTimerModal={onOpenTimerModal}
      />

      {/* Today's Key Wellness Metrics Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Hydration */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-sky-500" />
              Water Intake
            </span>
            <button
              onClick={onAddWater}
              className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md hover:bg-sky-100 transition"
            >
              + Add
            </button>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800 font-mono">
              {todayEntry.waterGlasses} <span className="text-xs font-normal text-slate-400">/ 8 glasses</span>
            </div>
            {/* 8 glass circles */}
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                <span
                  key={g}
                  className={`h-2.5 flex-1 rounded-full transition-colors ${
                    g <= todayEntry.waterGlasses ? 'bg-sky-500' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="h-4 w-4 text-indigo-500" />
              Sleep Rest
            </span>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition"
            >
              Log
            </button>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800 font-mono">
              {todayEntry.sleepHours} <span className="text-xs font-normal text-slate-400">hrs logged</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {todayEntry.sleepHours >= 7 ? '✓ Optimal rest range' : 'Attention: Below 7h target'}
            </div>
          </div>
        </div>

        {/* Stress */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="h-4 w-4 text-amber-500" />
              Reported Stress
            </span>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md hover:bg-slate-100 transition"
            >
              Track
            </button>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800 capitalize">
              {todayEntry.stress ? `${todayEntry.stress} level` : 'Not logged'}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Self-reported wellness entry
            </div>
          </div>
        </div>

        {/* Physical Mobility */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500" />
              Mobility & Exercise
            </span>
            <button
              onClick={() => onNavigate('exercise')}
              className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition"
            >
              Start
            </button>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800 font-mono">
              {todayEntry.exerciseMinutes + todayEntry.yogaMinutes}{' '}
              <span className="text-xs font-normal text-slate-400">mins today</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {todayEntry.meditationMinutes} mins mindfulness completed
            </div>
          </div>
        </div>
      </div>

      {/* QUICK WELLNESS ACTIONS (The Main Attractive Grid) */}
      <QuickWellnessActions
        onNavigate={onNavigate}
        onOpenBreathingModal={onOpenBreathingModal}
        onOpenTimerModal={onOpenTimerModal}
        onAddWaterGlass={onAddWater}
      />

      {/* SafeSpace Peer Support Banner */}
      <div className="rounded-3xl bg-linear-to-r from-teal-50 via-cyan-50 to-indigo-50 p-6 md:p-7 border border-teal-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-3xl shadow-sm shrink-0">
            🫂
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-extrabold text-slate-900">
                SafeSpace: Anonymous Peer Support & Listening
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                New
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              “A place to be heard, not judged.” Connect privately with an empathetic listener or be there to hold space for a fellow peer. 100% anonymous and free.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('safespace')}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2 shrink-0"
        >
          <span>Enter SafeSpace</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Secondary Cards: Hospital Report & Quiz Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mental Health Wellness Report Banner */}
        <div className="rounded-2xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="h-4 w-4" />
              Clinical Screening Document
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Mental Health & Wellness Report
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Synthesize your 7-day mood trends, sleep metrics, and screening assessment into a hospital-quality document prepared for professional psychiatrist/psychologist review.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Status: <strong className="text-amber-600">Awaiting Professional Review</strong>
            </span>
            <button
              onClick={() => onNavigate('report')}
              className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 group"
            >
              <span>Open Report</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Interactive Wellness Quiz Banner */}
        <div className="rounded-2xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              Evidence-Based Learning
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Wellness & Habit Quiz
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Test your knowledge on the circadian science of sleep, diaphragmatic breathing mechanics, and whole-food nutritional neurochemistry.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              5 Questions • Immediate Explanations
            </span>
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 group"
            >
              <span>Take Quiz</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
