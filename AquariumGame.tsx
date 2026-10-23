import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audio';

interface Fish {
  id: number;
  x: number; // percentage
  y: number; // percentage
  speedX: number;
  speedY: number;
  emoji: string;
  size: number;
  direction: 'left' | 'right';
}

interface Food {
  id: number;
  x: number;
  y: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface AquariumGameProps {
  isMuted: boolean;
  isPaused: boolean;
}

export const AquariumGame: React.FC<AquariumGameProps> = ({ isMuted, isPaused }) => {
  const [fishes, setFishes] = useState<Fish[]>([
    { id: 1, x: 20, y: 35, speedX: 0.22, speedY: 0.05, emoji: '🐠', size: 36, direction: 'right' },
    { id: 2, x: 70, y: 55, speedX: -0.18, speedY: -0.04, emoji: '🐟', size: 32, direction: 'left' },
    { id: 3, x: 40, y: 75, speedX: 0.15, speedY: 0.08, emoji: '🐡', size: 34, direction: 'right' },
    { id: 4, x: 80, y: 25, speedX: -0.2, speedY: 0.03, emoji: '🐠', size: 30, direction: 'left' },
    { id: 5, x: 15, y: 65, speedX: 0.12, speedY: -0.06, emoji: '🐟', size: 38, direction: 'right' },
  ]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(100);

  // Swimming animation loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Update fish position
      setFishes((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.speedX;
          let newY = fish.y + fish.speedY;
          let newDir = fish.direction;
          let newSpeedX = fish.speedX;
          let newSpeedY = fish.speedY;

          // Boundary turn
          if (newX > 92) {
            newSpeedX = -Math.abs(fish.speedX);
            newDir = 'left';
          } else if (newX < 8) {
            newSpeedX = Math.abs(fish.speedX);
            newDir = 'right';
          }

          if (newY > 85) {
            newSpeedY = -Math.abs(fish.speedY);
          } else if (newY < 15) {
            newSpeedY = Math.abs(fish.speedY);
          }

          return {
            ...fish,
            x: newX,
            y: newY,
            direction: newDir,
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );

      // Sink food flakes gently
      setFoods((prev) =>
        prev
          .map((f) => ({ ...f, y: f.y + 0.3 }))
          .filter((f) => f.y < 95)
      );
    }, 45);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleAquariumTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!isMuted) audioManager.playWaterDrop(0.3);

    // Add ripple
    const rId = nextId.current++;
    setRipples((prev) => [...prev, { id: rId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rId));
    }, 800);

    // Drop food flake
    const fId = nextId.current++;
    setFoods((prev) => [...prev.slice(-8), { id: fId, x, y }]);
  };

  return (
    <div
      onClick={handleAquariumTap}
      className="relative w-full h-[420px] md:h-[480px] overflow-hidden rounded-3xl bg-linear-to-b from-cyan-900 via-teal-950 to-blue-950 select-none cursor-pointer border-2 border-teal-800/40 shadow-xl"
    >
      {/* Caustic Light Rays */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4),transparent_60%)]" />

      {/* Gentle water surface shine */}
      <div className="absolute top-0 inset-x-0 h-6 bg-linear-to-b from-cyan-300/30 to-transparent pointer-events-none" />

      {/* Swaying underwater kelp / plants */}
      <div className="absolute bottom-0 left-6 text-5xl opacity-70 pointer-events-none animate-pulse duration-3000">
        🌿
      </div>
      <div className="absolute bottom-0 left-24 text-6xl opacity-60 pointer-events-none animate-pulse duration-4000">
        🪸
      </div>
      <div className="absolute bottom-0 right-12 text-7xl opacity-75 pointer-events-none animate-pulse duration-5000">
        🌿
      </div>
      <div className="absolute bottom-0 right-36 text-5xl opacity-65 pointer-events-none">
        🪨
      </div>

      {/* Rising gentle bubbles */}
      <div className="absolute bottom-4 left-1/4 text-xs text-white/40 animate-bounce duration-3000 pointer-events-none">
        ∘ ᵒ ৹
      </div>
      <div className="absolute bottom-6 right-1/3 text-sm text-white/30 animate-bounce duration-4000 pointer-events-none">
        ᵒ ∘
      </div>

      {/* Water Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-cyan-300/60 pointer-events-none animate-ping duration-700"
        />
      ))}

      {/* Sinking Fish Food */}
      {foods.map((f) => (
        <div
          key={f.id}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
          className="absolute w-2 h-2 rounded-full bg-amber-400/90 shadow-xs shadow-amber-300 pointer-events-none -translate-x-1/2"
        />
      ))}

      {/* Swimming Fish */}
      {fishes.map((fish) => (
        <div
          key={fish.id}
          style={{
            left: `${fish.x}%`,
            top: `${fish.y}%`,
            fontSize: `${fish.size}px`,
            transform: `translate(-50%, -50%) scaleX(${fish.direction === 'left' ? -1 : 1})`,
            transition: 'transform 300ms ease',
          }}
          className="absolute pointer-events-none select-none drop-shadow-lg"
        >
          {fish.emoji}
        </div>
      ))}

      {/* Tip helper */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-cyan-200 text-xs font-medium pointer-events-none">
        <span>🌊</span>
        <span>Tap anywhere to drop food flakes & ripple water</span>
      </div>
    </div>
  );
};
