import React, { useState } from 'react';
import { GameItem, NavigationSection } from '../../types';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Wind,
  Music,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

// Import game components
import { BubblePopGame } from './BubblePopGame';
import { ZenGardenGame } from './ZenGardenGame';
import { AquariumGame } from './AquariumGame';
import { JigsawGame } from './JigsawGame';
import { ColoringGame } from './ColoringGame';
import { MemoryGame } from './MemoryGame';
import { GrowPlantGame } from './GrowPlantGame';
import { WaterFlowGame } from './WaterFlowGame';
import { MandalaGame } from './MandalaGame';
import { MusicTilesGame } from './MusicTilesGame';
import { RainDropGame } from './RainDropGame';
import { StargazingGame } from './StargazingGame';
import { CandleFocusGame } from './CandleFocusGame';
import { CloudShapesGame } from './CloudShapesGame';
import { NatureMatchGame } from './NatureMatchGame';
import { BreathingGame } from './BreathingGame';

interface GameModalProps {
  game: GameItem | null;
  onClose: () => void;
  onNavigate: (section: NavigationSection) => void;
  onOpenBreathingModal: () => void;
}

const POSITIVE_AFFIRMATIONS = [
  'Nice break! 🌿',
  'You took a moment for yourself.',
  'Feeling calmer?',
  'Great job taking a peaceful mental break.',
  'Your mind is lighter and more centered.',
];

export const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  onNavigate,
  onOpenBreathingModal,
}) => {
  if (!game) return null;

  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameKey, setGameKey] = useState(1);
  const [affirmation, setAffirmation] = useState(POSITIVE_AFFIRMATIONS[0]);

  const handleStart = () => {
    setHasStarted(true);
    setIsPaused(false);
    setIsCompleted(false);
    if (!isMuted) audioManager.playSuccessChime(0.2);
  };

  const handleRestart = () => {
    setGameKey((k) => k + 1);
    setIsPaused(false);
    setIsCompleted(false);
    if (!isMuted) audioManager.playSuccessChime(0.2);
  };

  const handleTriggerComplete = () => {
    const randomAffirmation =
      POSITIVE_AFFIRMATIONS[Math.floor(Math.random() * POSITIVE_AFFIRMATIONS.length)];
    setAffirmation(randomAffirmation);
    setIsCompleted(true);
    if (!isMuted) audioManager.playSuccessChime(0.4);
  };

  const renderActiveGame = () => {
    switch (game.id) {
      case 'bubblepop':
        return (
          <BubblePopGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'zengarden':
        return <ZenGardenGame key={gameKey} isMuted={isMuted} isPaused={isPaused} />;
      case 'aquarium':
        return <AquariumGame key={gameKey} isMuted={isMuted} isPaused={isPaused} />;
      case 'jigsaw':
        return (
          <JigsawGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'coloring':
        return (
          <ColoringGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'memory':
        return (
          <MemoryGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'growplant':
        return (
          <GrowPlantGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'waterflow':
        return (
          <WaterFlowGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'mandala':
        return (
          <MandalaGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'musictiles':
        return (
          <MusicTilesGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'raindrops':
        return (
          <RainDropGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'stargazing':
        return (
          <StargazingGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'candle':
        return (
          <CandleFocusGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'clouds':
        return (
          <CloudShapesGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'naturematch':
        return (
          <NatureMatchGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
      case 'breathinggame':
      default:
        return (
          <BreathingGame
            key={gameKey}
            isMuted={isMuted}
            isPaused={isPaused}
            onComplete={handleTriggerComplete}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{game.icon}</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {game.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {game.category} • {game.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasStarted && !isCompleted && (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/80 transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-teal-600" />}
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/80 transition"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="h-4 w-4 text-teal-600" /> : <Pause className="h-4 w-4" />}
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/80 transition"
                  title="Restart"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={handleTriggerComplete}
                  className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition ml-1"
                >
                  Done
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {!hasStarted ? (
            /* START SCREEN (Section 108) */
            <div className="w-full max-w-md flex flex-col items-center text-center space-y-5 py-4">
              <div className="relative w-full h-52 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-200">
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                  <div className="text-left text-white">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/90 backdrop-blur-xs text-[10px] font-extrabold uppercase tracking-wider">
                      {game.category}
                    </span>
                    <h2 className="text-xl font-black mt-1">{game.name}</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">{game.shortPurpose}</p>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span>⏱️ {game.duration}</span>
                  <span>•</span>
                  <span>✨ {game.difficulty}</span>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 fill-white" />
                START GAME
              </button>
            </div>
          ) : isCompleted ? (
            /* COMPLETION SCREEN (Section 108.1) */
            <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center text-4xl shadow-md">
                🌿
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {affirmation}
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  You took valuable time to refresh your nervous system. What would you like to explore next?
                </p>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 active:scale-95 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Play Again</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate('meditation');
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>Try Meditation</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate('music');
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  <Music className="h-4 w-4 text-purple-600" />
                  <span>Listen to Music</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenBreathingModal();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  <Wind className="h-4 w-4 text-cyan-600" />
                  <span>Try Breathing</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('home');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 pt-1"
              >
                Return to Home
              </button>
            </div>
          ) : (
            /* ACTIVE IN-GAME SCREEN */
            <div className="w-full">{renderActiveGame()}</div>
          )}
        </div>
      </div>
    </div>
  );
};
