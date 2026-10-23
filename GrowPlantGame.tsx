import React, { useState } from 'react';
import { audioManager } from '../../utils/audio';
import { Droplet, Sun, Wind, Music, Sparkles } from 'lucide-react';

interface GrowPlantGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const GrowPlantGame: React.FC<GrowPlantGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [growthStage, setGrowthStage] = useState(1); // 1: Sprout, 2: Seedling, 3: Branch, 4: Leafy, 5: Blooming
  const [nurtureCount, setNurtureCount] = useState(0);

  const nurtureActions = [
    {
      id: 'water',
      label: 'Water Plant',
      icon: Droplet,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      sound: () => audioManager.playWaterDrop(0.3),
    },
    {
      id: 'sun',
      label: 'Sunlight',
      icon: Sun,
      color: 'bg-amber-500 hover:bg-amber-600',
      sound: () => audioManager.playChimeNote(523.25, 'triangle', 0.8, 0.25),
    },
    {
      id: 'breeze',
      label: 'Breeze',
      icon: Wind,
      color: 'bg-teal-500 hover:bg-teal-600',
      sound: () => audioManager.playChimeNote(659.25, 'sine', 0.9, 0.25),
    },
    {
      id: 'music',
      label: 'Music',
      icon: Music,
      color: 'bg-purple-500 hover:bg-purple-600',
      sound: () => audioManager.playChimeNote(783.99, 'sine', 1.0, 0.25),
    },
  ];

  const handleNurture = (action: (typeof nurtureActions)[0]) => {
    if (isPaused) return;
    if (!isMuted) action.sound();

    const nextCount = nurtureCount + 1;
    setNurtureCount(nextCount);

    if (nextCount % 3 === 0 && growthStage < 5) {
      const nextStage = growthStage + 1;
      setGrowthStage(nextStage);
      if (!isMuted) audioManager.playSuccessChime(0.3);
      if (nextStage === 5) {
        onComplete?.();
      }
    }
  };

  const getStageVisual = () => {
    switch (growthStage) {
      case 1:
        return { emoji: '🌱', title: 'Gentle Sprout', desc: 'A tiny seed drinking in morning warmth' };
      case 2:
        return { emoji: '🌿', title: 'Young Stem', desc: 'Reaching upward with vitality and calm' };
      case 3:
        return { emoji: '🪴', title: 'Flourishing Bonsai', desc: 'Developing strong roots and balanced foliage' };
      case 4:
        return { emoji: '🌳', title: 'Lush Foliage', desc: 'Brimming with fresh green leaves' };
      case 5:
      default:
        return { emoji: '🌸', title: 'Blossoming Orchid', desc: 'Radiant harmony and peaceful bloom achieved' };
    }
  };

  const visual = getStageVisual();

  return (
    <div className="flex flex-col items-center space-y-5 max-w-md mx-auto select-none">
      {/* Plant Pot & Stage Display */}
      <div className="relative w-full h-[280px] rounded-3xl bg-linear-to-b from-amber-50/50 via-teal-50/40 to-emerald-100/60 border-2 border-emerald-200/80 shadow-inner flex flex-col items-center justify-center overflow-hidden">
        {/* Sun Aura */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />

        {/* Growth emoji */}
        <div className="text-7xl transition-all duration-700 transform hover:scale-110 drop-shadow-md">
          {visual.emoji}
        </div>

        {/* Ceramic pot graphic */}
        <div className="w-24 h-12 mt-2 bg-linear-to-b from-amber-700 to-amber-900 rounded-b-2xl shadow-md border-t-4 border-amber-950 flex items-center justify-center">
          <span className="text-[10px] text-amber-200/80 font-bold tracking-widest uppercase">Zen</span>
        </div>

        {/* Stage Label */}
        <div className="mt-4 text-center">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            {visual.title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{visual.desc}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Bloom Progress</span>
          <span className="text-teal-700 font-bold">{growthStage * 20}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${growthStage * 20}%` }}
          />
        </div>
      </div>

      {/* Nurture Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
        {nurtureActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleNurture(action)}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl text-white font-bold text-xs shadow-xs transition transform active:scale-95 ${action.color}`}
            >
              <Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Tap care actions to shower your plant with love and watch it blossom.
      </p>
    </div>
  );
};
