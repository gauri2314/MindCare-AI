import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw } from 'lucide-react';

const NATURE_ITEMS = ['🌿', '🌸', '🐚', '🍃', '🎋', '🪨'];

interface NatureMatchGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const NatureMatchGame: React.FC<NatureMatchGameProps> = ({
  isMuted,
  isPaused,
  onComplete,
}) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);

  const initGrid = () => {
    const items: string[] = [];
    for (let i = 0; i < 16; i++) {
      items.push(NATURE_ITEMS[Math.floor(Math.random() * NATURE_ITEMS.length)]);
    }
    setGrid(items);
    setSelectedIdx(null);
    setMatches(0);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const handleTileClick = (idx: number) => {
    if (isPaused) return;

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      if (!isMuted) audioManager.playPop(0.2);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }

      // Check if same item
      if (grid[selectedIdx] === grid[idx]) {
        // Matched! Replace both with fresh nature icons
        const updated = [...grid];
        updated[selectedIdx] = NATURE_ITEMS[Math.floor(Math.random() * NATURE_ITEMS.length)];
        updated[idx] = NATURE_ITEMS[Math.floor(Math.random() * NATURE_ITEMS.length)];
        setGrid(updated);
        setSelectedIdx(null);

        const newMatches = matches + 1;
        setMatches(newMatches);
        if (!isMuted) audioManager.playChimeNote(587.33, 'sine', 0.8, 0.3);

        if (newMatches >= 10 && newMatches % 10 === 0) {
          onComplete?.();
        }
      } else {
        setSelectedIdx(idx);
        if (!isMuted) audioManager.playPop(0.15);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200">
        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
          <span>🌿</span>
          <span>
            Gathered: <span className="text-emerald-700 font-extrabold">{matches}</span>
          </span>
        </span>
        <button
          onClick={initGrid}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-emerald-900 rounded-3xl border-4 border-emerald-800 shadow-xl w-full aspect-square max-w-[320px]">
        {grid.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`rounded-2xl flex items-center justify-center text-3xl font-bold transition-all duration-200 active:scale-95 shadow-md ${
                isSelected
                  ? 'bg-amber-300 text-amber-950 ring-4 ring-white scale-105 shadow-xl'
                  : 'bg-emerald-800/80 hover:bg-emerald-700/80 text-white'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Tap two matching botanical treasures to gather peaceful energy.
      </p>
    </div>
  );
};
