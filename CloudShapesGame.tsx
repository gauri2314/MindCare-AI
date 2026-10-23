import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
  shapeEmoji: string;
  shapeName: string;
  isDiscovered: boolean;
}

const CLOUD_SHAPES = [
  { emoji: '🐰', name: 'Fluffy Rabbit' },
  { emoji: '🤍', name: 'Gentle Heart' },
  { emoji: '🕊️', name: 'Peaceful Dove' },
  { emoji: '🐳', name: 'Singing Whale' },
  { emoji: '🐱', name: 'Sleeping Kitten' },
  { emoji: '🌞', name: 'Warm Sun' },
];

interface CloudShapesGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const CloudShapesGame: React.FC<CloudShapesGameProps> = ({
  isMuted,
  isPaused,
  onComplete,
}) => {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [discoveredCount, setDiscoveredCount] = useState(0);

  useEffect(() => {
    const initial: Cloud[] = CLOUD_SHAPES.map((shape, i) => ({
      id: i,
      x: (i * 18) % 85 + 5,
      y: 15 + ((i * 22) % 65),
      speed: 0.06 + (i % 3) * 0.03,
      shapeEmoji: shape.emoji,
      shapeName: shape.name,
      isDiscovered: false,
    }));
    setClouds(initial);
  }, []);

  // Float loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => {
          let newX = c.x + c.speed;
          if (newX > 105) newX = -20;
          return { ...c, x: newX };
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCloudTap = (id: number) => {
    if (isPaused) return;

    if (!isMuted) audioManager.playChimeNote(659.25, 'sine', 1.0, 0.25);

    setClouds((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isDiscovered: !c.isDiscovered } : c))
    );

    const count = discoveredCount + 1;
    setDiscoveredCount(count);
    if (count >= 6 && count % 6 === 0) {
      onComplete?.();
    }
  };

  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden bg-linear-to-b from-sky-400 via-sky-300 to-sky-200 border-2 border-sky-300/60 shadow-xl select-none">
      {/* Sun glow */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-amber-200/50 blur-xl pointer-events-none" />

      {/* Helper banner */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/50 text-sky-900 text-xs font-bold pointer-events-none">
        <span>☁️</span>
        <span>Tap any cloud to reveal the shape dreaming inside</span>
      </div>

      {/* Floating Clouds */}
      {clouds.map((cloud) => (
        <button
          key={cloud.id}
          onClick={() => handleCloudTap(cloud.id)}
          style={{ left: `${cloud.x}%`, top: `${cloud.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md rounded-full border border-white shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {cloud.isDiscovered ? (
            <div className="flex items-center gap-2 px-2 animate-in zoom-in-90 duration-300">
              <span className="text-3xl">{cloud.shapeEmoji}</span>
              <span className="text-xs font-extrabold text-sky-900">{cloud.shapeName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sky-200/80 font-bold text-2xl">
              <span>☁️</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
