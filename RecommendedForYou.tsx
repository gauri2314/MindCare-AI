import React from 'react';
import { UserProfile, DailyTrackerEntry, NavigationSection } from '../types';
import { Sparkles, Moon, Wind, Footprints, Droplet, Apple, ArrowRight } from 'lucide-react';

interface RecommendedForYouProps {
  profile: UserProfile | null;
  todayEntry: DailyTrackerEntry;
  onNavigate: (section: NavigationSection) => void;
  onOpenBreathingModal: () => void;
  onOpenTimerModal: (title: string, mins: number) => void;
}

export const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  profile,
  todayEntry,
  onNavigate,
  onOpenBreathingModal,
  onOpenTimerModal,
}) => {
  const recommendations = [];

  // Stress-based
  if (todayEntry.stress === 'high' || todayEntry.stress === 'moderate') {
    recommendations.push({
      id: 'rec-stress',
      title: 'Elevated Stress Detected',
      description: 'Engage your vagus nerve with a 5-minute 4-7-8 breathing session to lower cortisol.',
      actionText: 'Try 5-Min Breathing',
      icon: Wind,
      color: 'teal',
      onClick: () => onOpenBreathingModal(),
    });
  }

  // Sleep-based
  if (todayEntry.sleepHours < 7.0) {
    recommendations.push({
      id: 'rec-sleep',
      title: 'Restorative Sleep Priority',
      description: `You logged ${todayEntry.sleepHours} hrs of sleep. A 10-minute evening body scan meditation can help reduce sleep latency.`,
      actionText: 'Open Sleep Meditation',
      icon: Moon,
      color: 'indigo',
      onClick: () => onNavigate('meditation'),
    });
  }

  // Hydration-based
  if (todayEntry.waterGlasses < 5) {
    recommendations.push({
      id: 'rec-water',
      title: 'Hydration Target',
      description: `You have logged ${todayEntry.waterGlasses} of 8 glasses today. Mild dehydration impairs cognitive stamina and mood.`,
      actionText: 'Update Water Tracker',
      icon: Droplet,
      color: 'sky',
      onClick: () => onNavigate('tracker'),
    });
  }

  // Activity-based
  if (todayEntry.exerciseMinutes < 15) {
    recommendations.push({
      id: 'rec-activity',
      title: 'Physical Movement Break',
      description: 'A brief 10-minute beginner walk or light mobility stretch releases endorphins and reduces postural stiffness.',
      actionText: 'View 10-Min Walk',
      icon: Footprints,
      color: 'emerald',
      onClick: () => onNavigate('exercise'),
    });
  }

  // Goal-based: Nutrition
  if (profile?.wellnessGoal === 'Improve nutrition' || !recommendations.length) {
    recommendations.push({
      id: 'rec-nutrition',
      title: 'Nourishment Balance',
      description: 'Review your general whole-food nutrition guide to maintain balanced blood sugar and mental clarity.',
      actionText: 'Explore Nutrition Plan',
      icon: Apple,
      color: 'amber',
      onClick: () => onNavigate('nutrition'),
    });
  }

  // Take top 3 recommendations
  const displayItems = recommendations.slice(0, 3);

  return (
    <div className="rounded-2xl bg-linear-to-br from-teal-50/50 via-white to-sky-50/40 p-5 md:p-6 border border-teal-100 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Recommended For You Today</h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Personalized from your self-reported logs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {displayItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl bg-white p-4 border border-slate-200/70 shadow-2xs hover:shadow-xs transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-lg bg-teal-50 p-1.5 text-teal-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <button
                onClick={item.onClick}
                className="mt-3.5 flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-900 group"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center text-[10px] text-slate-400">
        * MindCare AI recommendations are supportive general suggestions and do not constitute clinical treatment or diagnosis.
      </div>
    </div>
  );
};
