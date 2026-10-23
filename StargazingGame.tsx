import React, { useState } from 'react';
import { audioManager } from '../../utils/audio';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Star {
  id: number;
  x: number;
  y: number;
}

const CONSTELLATIONS = [
  {
    name: 'Ursa Major (Great Bear)',
    stars: [
      { id: 0, x: 25, y: 35 },
      { id: 1, x: 40, y: 38 },
      { id: 2, x: 55, y: 48 },
      { id: 3, x: 62, y: 65 },
      { id: 4, x: 78, y: 62 },
      { id: 5, x: 82, y: 45 },
      { id: 6, x: 66, y: 42 },
    ],
  },
  {
    name: 'The Sacred Lotus',
    stars: [
      { id: 0, x: 50, y: 25 },
      { id: 1, x: 30, y: 45 },
      { id: 2, x: 70, y: 45 },
      { id: 3, x: 20, y: 65 },
      { id: 4, x: 80, y: 65 },
      { id: 5, x: 50, y: 75 },
    ],
  },
];

interface StargazingGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const StargazingGame: React.FC<StargazingGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [constIndex, setConstIndex] = useState(0);
  const [connectedStars, setConnectedStars] = useState<number[]>([]);

  const current = CONSTELLATIONS[constIndex];

  const handleStarClick = (id: number) => {
    if (isPaused) return;

    if (!connectedStars.includes(id)) {
      const updated = [...connectedStars, id];
      setConnectedStars(updated);
      if (!isMuted) audioManager.playChimeNote(440 + id * 80, 'sine', 0.8, 0.3);

      if (updated.length === current.stars.length) {
        if (!isMuted) audioManager.playSuccessChime(0.4);
        onComplete?.();
      }
    }
  };

  const resetConstellation = () => {
    setConnectedStars([]);
  };

  const nextConstellation = () => {
    setConstIndex((i) => (i + 1) % CONSTELLATIONS.length);
    setConnectedStars([]);
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-md mx-auto select-none">
      {/* Controls */}
      <div className="flex items-center justify-between w-full p-2.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-white">
        <span className="font-bold text-teal-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          {current.name}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={nextConstellation}
            className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            Next Pattern
          </button>
          <button
            onClick={resetConstellation}
            className="p-1 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sky Canvas */}
      <div className="relative w-full aspect-square max-w-[380px] rounded-3xl overflow-hidden bg-radial from-indigo-950 via-slate-950 to-black border-4 border-slate-900 shadow-2xl">
        {/* Subtle background star dust */}
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            style={{
              left: `${(i * 37) % 95}%`,
              top: `${(i * 53) % 95}%`,
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
            }}
            className="absolute rounded-full bg-white/40 pointer-events-none"
          />
        ))}

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connectedStars.map((starId, idx) => {
            if (idx === 0) return null;
            const prevStar = current.stars.find((s) => s.id === connectedStars[idx - 1]);
            const thisStar = current.stars.find((s) => s.id === starId);
            if (!prevStar || !thisStar) return null;

            return (
              <line
                key={`line-${idx}`}
                x1={`${prevStar.x}%`}
                y1={`${prevStar.y}%`}
                x2={`${thisStar.x}%`}
                y2={`${thisStar.y}%`}
                stroke="#5EEAD4"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Interactive Constellation Stars */}
        {current.stars.map((star) => {
          const isConnected = connectedStars.includes(star.id);
          return (
            <button
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isConnected
                  ? 'bg-amber-300 text-amber-950 ring-4 ring-amber-400/50 shadow-lg shadow-amber-400/80 scale-125'
                  : 'bg-white/80 hover:bg-white text-slate-800 ring-2 ring-white/30 animate-pulse'
              }`}
            >
              <span className="text-[10px] font-extrabold">✦</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Tap the twinkling stars in sequence to trace glowing celestial constellations.
      </p>
    </div>
  );
};
