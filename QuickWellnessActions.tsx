import React from 'react';
import {
  Sparkles,
  Heart,
  Activity,
  Wind,
  Music,
  BookOpen,
  Salad,
  Droplet,
  Play,
  Clock,
  ArrowRight,
  Gamepad2,
  Users,
} from 'lucide-react';
import { NavigationSection } from '../types';

interface QuickActionItem {
  id: string;
  name: string;
  section: NavigationSection;
  icon: any;
  tagline: string;
  duration?: string;
  actionText: string;
  imageUrl: string;
  colorScheme: 'teal' | 'emerald' | 'sky' | 'indigo' | 'purple' | 'amber' | 'blue';
  specialTrigger?: 'breathing_modal' | 'timer_modal' | 'water_increment';
}

interface QuickWellnessActionsProps {
  onNavigate: (section: NavigationSection) => void;
  onOpenBreathingModal: () => void;
  onOpenTimerModal: (title: string, mins: number) => void;
  onAddWaterGlass: () => void;
}

export const QuickWellnessActions: React.FC<QuickWellnessActionsProps> = ({
  onNavigate,
  onOpenBreathingModal,
  onOpenTimerModal,
  onAddWaterGlass,
}) => {
  const actions: QuickActionItem[] = [
    {
      id: 'qa-safespace',
      name: 'SafeSpace 🫂',
      section: 'safespace',
      icon: Users,
      tagline: 'Anonymous peer support & compassionate listening.',
      duration: 'Anytime',
      actionText: 'Connect',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'teal',
    },
    {
      id: 'qa-games',
      name: 'Games & Chill',
      section: 'games',
      icon: Gamepad2,
      tagline: '16 calming mini-games to unwind and reset your mind.',
      duration: '2–5 min',
      actionText: 'Play',
      imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'teal',
    },
    {
      id: 'qa-meditation',
      name: 'Meditation',
      section: 'meditation',
      icon: Sparkles,
      tagline: 'Slow down and create a few calm minutes for yourself.',
      duration: '5–10 min',
      actionText: 'Start',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'teal',
    },
    {
      id: 'qa-yoga',
      name: 'Yoga',
      section: 'yoga',
      icon: Heart,
      tagline: 'Gentle movement and spinal stretching.',
      duration: '10 min',
      actionText: 'Start',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'indigo',
    },
    {
      id: 'qa-exercise',
      name: 'Exercise',
      section: 'exercise',
      icon: Activity,
      tagline: 'Move your body with a guided wellness activity.',
      duration: '10–30 min',
      actionText: 'Start',
      imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'emerald',
    },
    {
      id: 'qa-breathing',
      name: 'Breathing',
      section: 'home',
      icon: Wind,
      tagline: 'Try a simple guided diaphragmatic breathing session.',
      duration: '2–10 min',
      actionText: 'Start',
      imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'sky',
      specialTrigger: 'breathing_modal',
    },
    {
      id: 'qa-music',
      name: 'Music',
      section: 'music',
      icon: Music,
      tagline: 'Relax with acoustic instruments and nature sounds.',
      duration: 'Ambient',
      actionText: 'Listen',
      imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'purple',
    },
    {
      id: 'qa-journal',
      name: 'Mood Journal',
      section: 'journal',
      icon: BookOpen,
      tagline: 'Record how you are feeling and reflecting today.',
      duration: '3 min',
      actionText: 'Write',
      imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'amber',
    },
    {
      id: 'qa-nutrition',
      name: 'Nutrition',
      section: 'nutrition',
      icon: Salad,
      tagline: 'Explore your general nourishment suggestions.',
      duration: 'Daily Plan',
      actionText: 'View Plan',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'emerald',
    },
    {
      id: 'qa-hydration',
      name: 'Hydration',
      section: 'tracker',
      icon: Droplet,
      tagline: 'Track your daily water intake with one click.',
      duration: '8 Glasses',
      actionText: 'Track Water',
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
      colorScheme: 'blue',
      specialTrigger: 'water_increment',
    },
  ];

  const handleCardClick = (item: QuickActionItem) => {
    if (item.specialTrigger === 'breathing_modal') {
      onOpenBreathingModal();
    } else if (item.specialTrigger === 'water_increment') {
      onAddWaterGlass();
      onNavigate('tracker');
    } else {
      onNavigate(item.section);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Quick Wellness Actions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hand-picked restorative practices for your body and mind
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 cursor-pointer"
            >
              {/* Image banner */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 backdrop-blur-xs text-teal-800 shadow-xs">
                    <Icon className="h-4 w-4" />
                  </div>
                  {item.duration && (
                    <span className="flex items-center gap-1 rounded-md bg-black/40 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white">
                      <Clock className="h-2.5 w-2.5" />
                      {item.duration}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-2.5 text-white">
                  <h4 className="text-sm font-bold tracking-tight text-white drop-shadow-xs">
                    {item.name}
                  </h4>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {item.tagline}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-700 group-hover:text-teal-800 flex items-center gap-1">
                    {item.actionText}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="h-6 w-6 rounded-full bg-teal-50 group-hover:bg-teal-600 group-hover:text-white text-teal-700 flex items-center justify-center transition-colors">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
