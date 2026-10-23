import React, { useRef, useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw } from 'lucide-react';

const MANDALA_COLORS = ['#2DD4BF', '#38BDF8', '#818CF8', '#C084FC', '#F472B6', '#FBBF24', '#FFFFFF'];

interface MandalaGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const MandalaGame: React.FC<MandalaGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#2DD4BF');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const drawStrokeCount = useRef(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F172A'; // Deep Slate
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle center star guide
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 200, cy + Math.sin(angle) * 200);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
    initCanvas();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    isDrawing.current = true;
    lastPoint.current = { x, y };

    if (!isMuted) audioManager.playWaterDrop(0.12);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const p1 = { x: lastPoint.current.x - cx, y: lastPoint.current.y - cy };
    const p2 = { x: currentX - cx, y: currentY - cy };

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 4;
    ctx.shadowColor = selectedColor;

    // 8-fold rotational symmetry
    const sectors = 8;
    for (let i = 0; i < sectors; i++) {
      const angle = (i * 2 * Math.PI) / sectors;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Normal rotation
      ctx.beginPath();
      ctx.moveTo(cx + (p1.x * cos - p1.y * sin), cy + (p1.x * sin + p1.y * cos));
      ctx.lineTo(cx + (p2.x * cos - p2.y * sin), cy + (p2.x * sin + p2.y * cos));
      ctx.stroke();

      // Mirrored rotation
      ctx.beginPath();
      ctx.moveTo(cx + (-p1.x * cos - p1.y * sin), cy + (-p1.x * sin + p1.y * cos));
      ctx.lineTo(cx + (-p2.x * cos - p2.y * sin), cy + (-p2.x * sin + p2.y * cos));
      ctx.stroke();
    }

    lastPoint.current = { x: currentX, y: currentY };
    drawStrokeCount.current += 1;
    if (drawStrokeCount.current >= 40 && drawStrokeCount.current % 40 === 0) {
      onComplete?.();
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div className="flex flex-col items-center space-y-3 max-w-md mx-auto select-none">
      {/* Palette Bar */}
      <div className="flex items-center justify-between w-full p-2.5 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          {MANDALA_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition transform ${
                selectedColor === c ? 'scale-125 border-white ring-2 ring-teal-400' : 'border-transparent'
              }`}
            />
          ))}
        </div>

        <button
          onClick={initCanvas}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] cursor-crosshair block"
        />
      </div>

      <p className="text-xs text-slate-500">
        Draw with your finger or mouse to create hypnotic, kaleidoscopic symmetry.
      </p>
    </div>
  );
};
