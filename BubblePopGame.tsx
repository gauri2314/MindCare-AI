import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audio';

interface Bubble {
  id: number;
  x: number; // percentage 5 - 95
  y: number; // percentage
  size: number; // px 40 - 90
  speed: number;
  color: string;
  popping?: boolean;
}

const PASTEL_COLORS = [
  'from-teal-300/40 to-cyan-400/40 border-teal-200/60 shadow-teal-500/20',
  'from-pink-300/40 to-rose-400/40 border-pink-200/60 shadow-pink-500/20',
  'from-sky-300/40 to-blue-400/40 border-sky-200/60 shadow-sky-500/20',
  'from-violet-300/40 to-purple-400/40 border-violet-200/60 shadow-violet-500/20',
  'from-amber-200/40 to-yellow-300/40 border-amber-200/60 shadow-amber-500/20',
  'from-emerald-300/40 to-teal-400/40 border-emerald-200/60 shadow-emerald-500/20',
];

interface BubblePopGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onScoreUpdate?: (score: number) => void;
  onComplete?: () => void;
}

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  isMuted,
  isPaused,
  onScoreUpdate,
  onComplete,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const nextId = useRef(1);

  // Initialize bubbles
  useEffect(() => {
    const initial: Bubble[] = [];
    for (let i = 0; i < 14; i++) {
      initial.push({
        id: nextId.current++,
        x: Math.random() * 85 + 7,
        y: Math.random() * 80 + 15,
        size: Math.floor(Math.random() * 38) + 48,
        speed: 0.12 + Math.random() * 0.15,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      });
    }
    setBubbles(initial);
  }, []);

  // Float animation loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setBubbles((prev) => {
        let changed = false;
        const updated = prev
          .map((b) => {
            if (b.popping) return b;
            const newY = b.y - b.speed;
            if (newY < -15) {
              changed = true;
              return {
                ...b,
                y: 105,
                x: Math.random() * 85 + 7,
                size: Math.floor(Math.random() * 38) + 48,
                color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
              };
            }
            return { ...b, y: newY };
          })
          .filter(Boolean);

        return updated;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused]);

  const popBubble = (id: number) => {
    if (isPaused) return;

    if (!isMuted) {
      audioManager.playPop(0.35);
    }

    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popping: true } : b))
    );

    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                popping: false,
                y: 105,
                x: Math.random() * 85 + 7,
                size: Math.floor(Math.random() * 38) + 48,
                color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
              }
            : b
        )
      );
    }, 200);

    setPoppedCount((c) => {
      const next = c + 1;
      onScoreUpdate?.(next);
      if (next >= 25 && next % 25 === 0) {
        onComplete?.();
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden rounded-3xl bg-linear-to-b from-teal-900/90 via-slate-900 to-indigo-950 select-none cursor-pointer">
      {/* Soft atmospheric ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_30%,rgba(45,212,191,0.25),transparent_70%)]" />

      {/* Counter banner */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 border border-white/15 text-white shadow-xs">
          <span className="text-base">🫧</span>
          <span className="text-xs font-bold tracking-wide">
            Popped: <span className="text-teal-300 font-extrabold text-sm">{poppedCount}</span>
          </span>
        </div>

        <div className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/15 text-slate-300 text-[11px] font-medium">
          Tap anywhere on bubbles to pop
        </div>
      </div>

      {/* Floating Bubbles */}
      {bubbles.map((b) => (
        <button
          key={b.id}
          onClick={(e) => {
            e.stopPropagation();
            popBubble(b.id);
          }}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            transform: `translate(-50%, -50%) scale(${b.popping ? 1.4 : 1})`,
            opacity: b.popping ? 0 : 0.9,
            transition: b.popping ? 'transform 180ms ease-out, opacity 180ms ease-out' : 'none',
          }}
          className={`absolute rounded-full bg-linear-to-br border shadow-lg backdrop-blur-xs flex items-center justify-center group active:scale-90 transition-transform ${b.color}`}
          aria-label="Pop bubble"
        >
          {/* Shimmer light reflection dot */}
          <div className="absolute top-2 left-2.5 w-2.5 h-2.5 rounded-full bg-white/80 blur-[0.5px]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
        </button>
      ))}

      {/* Calming bottom water wave silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-linear-to-t from-teal-950/80 to-transparent pointer-events-none" />
    </div>
  );
};
