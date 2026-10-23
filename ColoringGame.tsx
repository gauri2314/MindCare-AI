import React, { useState } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw, Sparkles } from 'lucide-react';

const COLOR_PALETTE = [
  '#2DD4BF', // Teal
  '#0EA5E9', // Sky blue
  '#818CF8', // Indigo
  '#C084FC', // Lavender/Purple
  '#F472B6', // Rose pink
  '#FB7185', // Coral
  '#FBBF24', // Amber
  '#34D399', // Mint emerald
  '#A3E635', // Lime
  '#38BDF8', // Cyan
  '#E2E8F0', // Soft white/grey
  '#0F172A', // Slate dark
];

interface ColoringGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const ColoringGame: React.FC<ColoringGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [selectedColor, setSelectedColor] = useState('#2DD4BF');
  const [fills, setFills] = useState<Record<string, string>>({});
  const [patternType, setPatternType] = useState<'lotus' | 'mandala'>('lotus');

  const handleColorSegment = (segmentId: string) => {
    if (isPaused) return;
    setFills((prev) => ({ ...prev, [segmentId]: selectedColor }));
    if (!isMuted) audioManager.playWaterDrop(0.2);

    // If colored more than 8 segments, trigger complete
    const filledCount = Object.keys(fills).length + 1;
    if (filledCount >= 10 && filledCount % 10 === 0) {
      onComplete?.();
    }
  };

  const clearAll = () => {
    setFills({});
    if (!isMuted) audioManager.playSuccessChime(0.2);
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto select-none">
      {/* Top Selector & Palette */}
      <div className="w-full space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setPatternType('lotus');
                setFills({});
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                patternType === 'lotus'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🌸 Sacred Lotus
            </button>
            <button
              onClick={() => {
                setPatternType('mandala');
                setFills({});
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                patternType === 'mandala'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🌀 Zen Mandala
            </button>
          </div>

          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Color swatches */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              className={`w-7 h-7 rounded-full transition-transform duration-150 border-2 ${
                selectedColor === color
                  ? 'scale-125 border-slate-900 shadow-md ring-2 ring-white'
                  : 'border-white hover:scale-110 shadow-xs'
              }`}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* SVG Coloring Canvas */}
      <div className="w-full max-w-[400px] aspect-square bg-white rounded-3xl p-6 border-4 border-slate-200 shadow-md flex items-center justify-center">
        {patternType === 'lotus' ? (
          <svg viewBox="0 0 300 300" className="w-full h-full cursor-pointer">
            {/* Center core */}
            <circle
              cx="150"
              cy="150"
              r="24"
              fill={fills['core'] || '#F8FAFC'}
              stroke="#334155"
              strokeWidth="2.5"
              onClick={() => handleColorSegment('core')}
            />
            {/* 8 Inner Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <path
                key={`inner-${i}`}
                d="M150 150 C125 105 125 65 150 45 C175 65 175 105 150 150 Z"
                transform={`rotate(${angle} 150 150)`}
                fill={fills[`inner-${i}`] || '#F8FAFC'}
                stroke="#334155"
                strokeWidth="2"
                className="hover:opacity-90 transition-colors"
                onClick={() => handleColorSegment(`inner-${i}`)}
              />
            ))}
            {/* 8 Outer Petals */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <path
                key={`outer-${i}`}
                d="M150 150 C110 90 110 35 150 15 C190 35 190 90 150 150 Z"
                transform={`rotate(${angle} 150 150)`}
                fill={fills[`outer-${i}`] || '#F1F5F9'}
                stroke="#334155"
                strokeWidth="2"
                className="hover:opacity-90 transition-colors"
                onClick={() => handleColorSegment(`outer-${i}`)}
              />
            ))}
          </svg>
        ) : (
          <svg viewBox="0 0 300 300" className="w-full h-full cursor-pointer">
            {/* Concentric rings mandala */}
            <circle
              cx="150"
              cy="150"
              r="20"
              fill={fills['m-core'] || '#F8FAFC'}
              stroke="#334155"
              strokeWidth="2"
              onClick={() => handleColorSegment('m-core')}
            />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={`m-ring1-${i}`}
                cx="150"
                cy="95"
                r="28"
                transform={`rotate(${angle} 150 150)`}
                fill={fills[`m-ring1-${i}`] || '#F8FAFC'}
                stroke="#334155"
                strokeWidth="2"
                onClick={() => handleColorSegment(`m-ring1-${i}`)}
              />
            ))}
            {[30, 90, 150, 210, 270, 330].map((angle, i) => (
              <path
                key={`m-star-${i}`}
                d="M150 150 L135 60 L150 35 L165 60 Z"
                transform={`rotate(${angle} 150 150)`}
                fill={fills[`m-star-${i}`] || '#F1F5F9'}
                stroke="#334155"
                strokeWidth="2"
                onClick={() => handleColorSegment(`m-star-${i}`)}
              />
            ))}
            <circle
              cx="150"
              cy="150"
              r="135"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Tap any petal or shape to fill it with your selected color.
      </p>
    </div>
  );
};
