import React, { useState } from 'react';
import { GameItem, NavigationSection, DailyTrackerEntry } from '../types';
import { GamesView } from './GamesView';
import { MeditationView } from './MeditationView';
import { YogaView } from './YogaView';
import { ExerciseView } from './ExerciseView';
import { MusicView } from './MusicView';
import { QuizView } from './QuizView';
import {
  Gamepad2,
  Sparkles,
  Heart,
  Activity,
  Wind,
  Music,
  HelpCircle,
  Play,
} from 'lucide-react';

interface ActivitiesViewProps {
  initialTab?: 'games' | 'meditation' | 'yoga' | 'exercise' | 'music' | 'quiz';
  onSelectGame: (game: GameItem) => void;
  onOpenTimerModal: (title: string, mins: number) => void;
  onOpenBreathingModal: () => void;
  onOpenPostureModal?: (exercise: any) => void;
  todayEntry: DailyTrackerEntry;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  initialTab = 'games',
  onSelectGame,
  onOpenTimerModal,
  onOpenBreathingModal,
  onOpenPostureModal,
  todayEntry,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'meditation' | 'yoga' | 'exercise' | 'music' | 'quiz'>(
    initialTab
  );

  interface TabItem {
    id: 'games' | 'meditation' | 'yoga' | 'exercise' | 'music' | 'quiz';
    label: string;
    icon: any;
    color: string;
    badge?: string;
  }

  const TABS: TabItem[] = [
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'text-amber-600', badge: '16 Games' },
    { id: 'meditation', label: 'Meditation', icon: Sparkles, color: 'text-teal-600' },
    { id: 'yoga', label: 'Yoga', icon: Heart, color: 'text-rose-600' },
    { id: 'exercise', label: 'Exercise', icon: Activity, color: 'text-emerald-600' },
    { id: 'music', label: 'Sound Studio', icon: Music, color: 'text-purple-600' },
    { id: 'quiz', label: 'Wellness Quiz', icon: HelpCircle, color: 'text-sky-600' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Visual Navigation Pill Switcher */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto p-1.5 bg-white rounded-3xl border border-slate-200/80 shadow-xs no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Breathing Action shortcut */}
        <button
          onClick={onOpenBreathingModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold hover:bg-cyan-100 transition shrink-0"
        >
          <Wind className="h-3.5 w-3.5 text-cyan-600" />
          <span>Breathing Orb</span>
        </button>
      </div>

      {/* Render selected view */}
      {activeTab === 'games' && (
        <GamesView
          onSelectGame={onSelectGame}
          currentMood={todayEntry.mood}
          currentStress={todayEntry.stress}
        />
      )}

      {activeTab === 'meditation' && (
        <MeditationView onOpenTimerModal={onOpenTimerModal} />
      )}

      {activeTab === 'yoga' && (
        <YogaView onOpenTimerModal={onOpenTimerModal} />
      )}

      {activeTab === 'exercise' && (
        <ExerciseView
          onOpenTimerModal={onOpenTimerModal}
          onOpenPostureModal={onOpenPostureModal || (() => {})}
        />
      )}

      {activeTab === 'music' && <MusicView />}

      {activeTab === 'quiz' && <QuizView />}
    </div>
  );
};
