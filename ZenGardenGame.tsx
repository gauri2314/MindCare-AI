import React, { useRef, useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw, Sparkles } from 'lucide-react';

interface ZenObject {
  id: string;
  type: 'stone' | 'blossom' | 'bamboo' | 'lantern' | 'bonsai';
  icon: string;
  label: string;
  x: number;
  y: number;
}

const PALETTE: { type: ZenObject['type']; icon: string; label: string }[] = [
  { type: 'stone', icon: '🪨', label: 'River Stone' },
  { type: 'blossom', icon: '🌸', label: 'Blossom' },
  { type: 'bamboo', icon: '🎋', label: 'Bamboo' },
  { type: 'lantern', icon: '🏮', label: 'Lantern' },
  { type: 'bonsai', icon: '🪴', label: 'Bonsai' },
];

interface ZenGardenGameProps {
  isMuted: boolean;
  isPaused: boolean;
}

export const ZenGardenGame: React.FC<ZenGardenGameProps> = ({ isMuted, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<ZenObject['type'] | 'rake'>('rake');
  const [objects, setObjects] = useState<ZenObject[]>([
    { id: 'init-1', type: 'stone', icon: '🪨', label: 'Stone', x: 25, y: 35 },
    { id: 'init-2', type: 'bonsai', icon: '🪴', label: 'Bonsai', x: 75, y: 60 },
    { id: 'init-3', type: 'blossom', icon: '🌸', label: 'Blossom', x: 30, y: 70 },
  ]);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Initialize sand pattern on canvas
  const initSand = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill soft sand tone
    ctx.fillStyle = '#E8DFCE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle gentle concentric sand ring ripples
    ctx.strokeStyle = '#D9CFBC';
    ctx.lineWidth = 2.5;
    for (let r = 30; r < canvas.width; r += 28) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 420;
    initSand();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'rake') {
      isDrawing.current = true;
      lastPoint.current = { x, y };
      if (!isMuted) audioManager.playWaterDrop(0.15);
    } else {
      // Place selected zen item
      const itemDef = PALETTE.find((p) => p.type === selectedTool);
      if (itemDef) {
        setObjects((prev) => [
          ...prev,
          {
            id: `zen-${Date.now()}`,
            type: itemDef.type,
            icon: itemDef.icon,
            label: itemDef.label,
            x: (x / canvas.width) * 100,
            y: (y / canvas.height) * 100,
          },
        ]);
        if (!isMuted) audioManager.playChimeNote(660, 'sine', 0.8, 0.25);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || isPaused || selectedTool !== 'rake') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Draw rake lines (triple groove)
    const offsets = [-6, 0, 6];
    offsets.forEach((offset) => {
      ctx.beginPath();
      ctx.strokeStyle = '#D1C4AC';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.moveTo(lastPoint.current!.x + offset, lastPoint.current!.y + offset);
      ctx.lineTo(currentX + offset, currentY + offset);
      ctx.stroke();
    });

    lastPoint.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearGarden = () => {
    initSand();
    setObjects([]);
    if (!isMuted) audioManager.playSuccessChime(0.2);
  };

  return (
    <div className="space-y-3">
      {/* Garden Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-100 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedTool('rake')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
              selectedTool === 'rake'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <span>🎋</span>
            <span>Rake Sand</span>
          </button>

          {PALETTE.map((p) => (
            <button
              key={p.type}
              onClick={() => setSelectedTool(p.type)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedTool === p.type
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <span>{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={clearGarden}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:text-stone-900 border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Smooth Sand</span>
        </button>
      </div>

      {/* Sand Canvas Area */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-stone-300 shadow-inner bg-[#E8DFCE] select-none touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-[400px] cursor-crosshair block"
        />

        {/* Placed Zen items */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute text-3xl pointer-events-none select-none drop-shadow-md transition-all duration-300 hover:scale-110"
          >
            {obj.icon}
          </div>
        ))}

        <div className="absolute bottom-3 left-4 bg-stone-900/60 backdrop-blur-xs text-stone-200 px-3 py-1 rounded-full text-[11px] pointer-events-none">
          {selectedTool === 'rake' ? 'Drag finger or cursor to rake soothing ripples' : 'Tap on the sand to place item'}
        </div>
      </div>
    </div>
  );
};
