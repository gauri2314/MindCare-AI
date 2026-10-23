import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';

interface Drop {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  popping?: boolean;
}

interface RainDropGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const RainDropGame: React.FC<RainDropGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [tappedCount, setTappedCount] = useState(0);

  useEffect(() => {
    // Generate initial rain beads on window
    const initial: Drop[] = [];
    for (let i = 0; i < 18; i++) {
      initial.push({
        id: i,
        x: Math.random() * 88 + 6,
        y: Math.random() * 80 + 10,
        size: Math.floor(Math.random() * 18) + 14,
        speed: 0.08 + Math.random() * 0.12,
      });
    }
    setDrops(initial);
  }, []);

  // Trickle down animation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDrops((prev) =>
        prev.map((d) => {
          let newY = d.y + d.speed;
          if (newY > 96) {
            newY = 2;
            return {
              ...d,
              y: newY,
              x: Math.random() * 88 + 6,
            };
          }
          return { ...d, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTapDrop = (id: number) => {
    if (isPaused) return;

    if (!isMuted) {
      audioManager.playWaterDrop(0.35);
    }

    setDrops((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, popping: true, y: 2, x: Math.random() * 88 + 6 } : d
      )
    );

    const count = tappedCount + 1;
    setTappedCount(count);
    if (count >= 20 && count % 20 === 0) {
      onComplete?.();
    }
  };

  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl select-none">
      {/* Misty rainy window backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-xs opacity-60 pointer-events-none scale-105"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px] pointer-events-none" />

      {/* Top tip banner */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-cyan-200 text-xs font-medium z-10 pointer-events-none">
        <span>🌧️</span>
        <span>Tap gentle beads on the misty pane ({tappedCount} absorbed)</span>
      </div>

      {/* Rain droplets */}
      {drops.map((drop) => (
        <button
          key={drop.id}
          onClick={() => handleTapDrop(drop.id)}
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 1.3}px`,
          }}
          className="absolute -translate-x-1/2 rounded-full bg-linear-to-b from-white/80 via-cyan-200/50 to-blue-300/60 backdrop-blur-md shadow-md shadow-cyan-500/20 border border-white/40 cursor-pointer active:scale-125 transition-transform"
          aria-label="Tap raindrop"
        >
          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white blur-[0.5px]" />
        </button>
      ))}
    </div>
  );
};
