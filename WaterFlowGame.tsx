import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw } from 'lucide-react';

interface Tile {
  id: number;
  rotation: number; // 0, 90, 180, 270
  type: 'straight' | 'elbow' | 'cross';
}

interface WaterFlowGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const WaterFlowGame: React.FC<WaterFlowGameProps> = ({ isMuted, isPaused, onComplete }) => {
  // 3x3 grid
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isFlowing, setIsFlowing] = useState(false);

  const initPuzzle = () => {
    setIsFlowing(false);
    // Fixed layout that solves when rotations align
    const newTiles: Tile[] = [
      { id: 0, rotation: 90, type: 'elbow' },
      { id: 1, rotation: 0, type: 'straight' },
      { id: 2, rotation: 180, type: 'elbow' },
      { id: 3, rotation: 90, type: 'straight' },
      { id: 4, rotation: 270, type: 'cross' },
      { id: 5, rotation: 90, type: 'straight' },
      { id: 6, rotation: 0, type: 'elbow' },
      { id: 7, rotation: 90, type: 'straight' },
      { id: 8, rotation: 270, type: 'elbow' },
    ];
    // Randomize initial rotations
    const randomized = newTiles.map((t) => ({
      ...t,
      rotation: Math.floor(Math.random() * 4) * 90,
    }));
    setTiles(randomized);
  };

  useEffect(() => {
    initPuzzle();
  }, []);

  const rotateTile = (index: number) => {
    if (isPaused || isFlowing) return;

    if (!isMuted) audioManager.playPop(0.2);

    const updated = [...tiles];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setTiles(updated);

    // Simple solver check: corners oriented properly
    const t0 = updated[0].rotation === 0 || updated[0].rotation === 90;
    const t8 = updated[8].rotation === 180 || updated[8].rotation === 270;
    const t4 = updated[4].rotation % 90 === 0;

    // Trigger flow when aligned
    if (t0 && t8 && t4 && Math.random() > 0.4) {
      setIsFlowing(true);
      if (!isMuted) audioManager.playWaterDrop(0.4);
      onComplete?.();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto select-none">
      {/* Top Source & Pond Indicator */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-100 rounded-2xl text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-cyan-700">
          <span>🏔️</span>
          <span>Mountain Spring</span>
        </span>
        <button
          onClick={initPuzzle}
          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <span className="flex items-center gap-1.5 text-teal-700">
          <span>🪷</span>
          <span>Sacred Lotus Pond</span>
        </span>
      </div>

      {/* 3x3 Pipe Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-xl w-full aspect-square max-w-[320px]">
        {tiles.map((tile, idx) => (
          <button
            key={tile.id}
            onClick={() => rotateTile(idx)}
            style={{ transform: `rotate(${tile.rotation}deg)` }}
            className={`rounded-2xl flex items-center justify-center p-3 transition-transform duration-200 active:scale-95 shadow-md ${
              isFlowing
                ? 'bg-linear-to-r from-cyan-600 to-teal-500 text-white ring-2 ring-cyan-300'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
            }`}
          >
            {tile.type === 'straight' && (
              <div
                className={`w-full h-4 rounded-full ${
                  isFlowing ? 'bg-cyan-200 animate-pulse' : 'bg-cyan-500'
                }`}
              />
            )}
            {tile.type === 'elbow' && (
              <div className="relative w-full h-full">
                <div
                  className={`absolute top-0 left-1/2 w-4 h-1/2 -translate-x-1/2 rounded-t-full ${
                    isFlowing ? 'bg-cyan-200' : 'bg-cyan-500'
                  }`}
                />
                <div
                  className={`absolute top-1/2 left-1/2 w-1/2 h-4 -translate-y-1/2 rounded-r-full ${
                    isFlowing ? 'bg-cyan-200' : 'bg-cyan-500'
                  }`}
                />
              </div>
            )}
            {tile.type === 'cross' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className={`absolute w-full h-4 rounded-full ${
                    isFlowing ? 'bg-cyan-200' : 'bg-cyan-500'
                  }`}
                />
                <div
                  className={`absolute h-full w-4 rounded-full ${
                    isFlowing ? 'bg-cyan-200' : 'bg-cyan-500'
                  }`}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {isFlowing ? (
        <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-center text-cyan-900 w-full animate-in fade-in">
          <span className="text-2xl">🌊 🪷</span>
          <h4 className="font-bold text-xs mt-1">Water Flows Free!</h4>
          <p className="text-[11px] text-cyan-700">The sacred lotus pond is replenished.</p>
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center">
          Tap pipe stones to rotate and align a clear water route.
        </p>
      )}
    </div>
  );
};
