import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { Check, RotateCcw, Image as ImageIcon } from 'lucide-react';

const PUZZLE_IMAGES = [
  {
    title: 'Peaceful Mountain Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Zen Bamboo Garden',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Warm Sunset Beach',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
  },
];

interface JigsawGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const JigsawGame: React.FC<JigsawGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [gridSize, setGridSize] = useState<2 | 3>(3);
  const [imageIndex, setImageIndex] = useState(0);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  const currentImage = PUZZLE_IMAGES[imageIndex];
  const totalTiles = gridSize * gridSize;

  // Initialize and shuffle
  const initPuzzle = (size: 2 | 3 = gridSize) => {
    setIsWon(false);
    setSelectedIdx(null);
    const original = Array.from({ length: size * size }, (_, i) => i);
    // Shuffle ensuring not already solved
    let shuffled = [...original].sort(() => Math.random() - 0.5);
    // If by chance solved, swap first two
    if (shuffled.every((val, i) => val === i)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    setPieces(shuffled);
  };

  useEffect(() => {
    initPuzzle(gridSize);
  }, [gridSize, imageIndex]);

  const handleTileClick = (index: number) => {
    if (isWon || isPaused) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
      if (!isMuted) audioManager.playChimeNote(440, 'sine', 0.2, 0.2);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }
      // Swap the two pieces
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx];
      newPieces[selectedIdx] = newPieces[index];
      newPieces[index] = temp;
      setPieces(newPieces);
      setSelectedIdx(null);

      if (!isMuted) audioManager.playWaterDrop(0.25);

      // Check win condition
      const won = newPieces.every((val, i) => val === i);
      if (won) {
        setIsWon(true);
        if (!isMuted) audioManager.playSuccessChime(0.4);
        onComplete?.();
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto select-none">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between w-full gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setGridSize(2);
              initPuzzle(2);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              gridSize === 2
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            2 × 2 Easy
          </button>
          <button
            onClick={() => {
              setGridSize(3);
              initPuzzle(3);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              gridSize === 3
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            3 × 3 Relaxed
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setImageIndex((idx) => (idx + 1) % PUZZLE_IMAGES.length)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-medium"
          >
            <ImageIcon className="h-3.5 w-3.5 text-teal-600" />
            <span>Next Photo</span>
          </button>
          <button
            onClick={() => initPuzzle()}
            className="p-1.5 rounded-xl bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            title="Reshuffle"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Puzzle Board */}
      <div
        className={`relative w-full aspect-square max-w-[420px] rounded-3xl overflow-hidden border-4 ${
          isWon ? 'border-teal-400 shadow-teal-500/30' : 'border-slate-300 shadow-md'
        } grid gap-1 p-1 bg-slate-900 transition-all duration-300`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {pieces.map((pieceVal, slotIdx) => {
          const row = Math.floor(pieceVal / gridSize);
          const col = pieceVal % gridSize;
          const isCorrect = pieceVal === slotIdx;
          const isSelected = selectedIdx === slotIdx;

          return (
            <button
              key={slotIdx}
              onClick={() => handleTileClick(slotIdx)}
              className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-4 ring-amber-400 scale-95 z-20 shadow-xl'
                  : 'hover:brightness-105 active:scale-95'
              }`}
              style={{
                backgroundImage: `url(${currentImage.url})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
              }}
            >
              {/* Correct match dot indicator */}
              {isCorrect && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                  ✓
                </div>
              )}
            </button>
          );
        })}

        {/* Victory Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-teal-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in-95 duration-300">
            <span className="text-4xl mb-2">🌿 ✨</span>
            <h3 className="text-xl font-extrabold text-teal-200">Puzzle Complete!</h3>
            <p className="text-xs text-slate-300 text-center mt-1">
              You restored harmony to {currentImage.title}.
            </p>
            <button
              onClick={() => initPuzzle()}
              className="mt-4 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition"
            >
              Play Another
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Tap a piece to select it, then tap another piece to swap them into place.
      </p>
    </div>
  );
};
