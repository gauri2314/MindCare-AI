import React, { useState } from 'react';
import { GameCategory, GameItem, MoodType, StressLevel } from '../types';
import { ALL_GAMES, GAME_CATEGORIES } from '../data/gamesData';
import { Play, Sparkles, Heart, Zap, ShieldAlert, Smile, Brain } from 'lucide-react';

interface GamesViewProps {
  onSelectGame: (game: GameItem) => void;
  currentMood?: MoodType | null;
  currentStress?: StressLevel | null;
}

export const GamesView: React.FC<GamesViewProps> = ({
  onSelectGame,
  currentMood,
  currentStress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'All'>('All');

  // Personalization recommendations (Section 110)
  const getPersonalizedRecommendations = (): GameItem[] => {
    if (currentStress === 'high') {
      return ALL_GAMES.filter((g) => ['bubblepop', 'breathinggame', 'zengarden'].includes(g.id));
    }
    if (currentMood === 'sad' || currentMood === 'very_sad') {
      return ALL_GAMES.filter((g) => ['growplant', 'clouds', 'aquarium'].includes(g.id));
    }
    // Default calming favorites
    return ALL_GAMES.filter((g) => ['bubblepop', 'breathinggame', 'stargazing'].includes(g.id));
  };

  const recommendations = getPersonalizedRecommendations();

  const filteredGames =
    selectedCategory === 'All'
      ? ALL_GAMES
      : ALL_GAMES.filter((g) => g.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-teal-900 via-teal-800 to-indigo-950 p-6 md:p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-bold border border-white/15">
            <Sparkles className="h-3.5 w-3.5" />
            Relaxation & Sensory Rest
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Mindful Games & Mini Breaks
          </h1>

          <p className="text-xs md:text-sm text-teal-100/80 leading-relaxed">
            Gentle, unhurried interactions designed to lower cortisol, steady the breath, and refresh cognitive focus. No countdowns, no penalties, pure calm.
          </p>
        </div>
      </div>

      {/* SECTION 110: Personalization Recommended for You */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>Recommended for you</span>
            <span className="text-teal-600">🌿</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Based on current wellness balance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectGame(rec)}
              className="group relative rounded-3xl bg-linear-to-br from-white to-teal-50/50 border border-teal-200/80 p-4 shadow-sm hover:shadow-md hover:border-teal-400 transition cursor-pointer flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-xs relative">
                <img
                  src={rec.imageUrl}
                  alt={rec.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                  {rec.icon}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  {rec.category}
                </span>
                <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-teal-700 transition">
                  {rec.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">{rec.duration} • {rec.difficulty}</p>
              </div>

              <button className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs group-hover:bg-teal-700 transition shrink-0">
                <Play className="h-3.5 w-3.5 fill-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
              selectedCategory === cat.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 109: Visual Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Header with Badge */}
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src={game.imageUrl}
                alt={game.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                  {game.category}
                </span>
              </div>

              {/* Duration & Difficulty */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow-xs">
                <span>⏱️ {game.duration}</span>
                <span className="bg-teal-600/90 px-2 py-0.5 rounded-md text-[10px]">
                  {game.difficulty}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{game.icon}</span>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition">
                    {game.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {game.shortPurpose}
                </p>
              </div>

              {/* One Tap Play Now Button */}
              <button
                onClick={() => onSelectGame(game)}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                PLAY NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
