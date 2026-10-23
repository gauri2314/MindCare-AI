import React, { useState } from 'react';
import { audioManager } from '../../utils/audio';

interface NoteTile {
  note: string;
  name: string;
  freq: number;
  color: string;
}

const SCALE_NOTES: NoteTile[] = [
  { note: 'C4', name: 'Root Calm', freq: 261.63, color: 'from-teal-400 to-teal-600' },
  { note: 'D4', name: 'Presence', freq: 293.66, color: 'from-cyan-400 to-cyan-600' },
  { note: 'E4', name: 'Harmony', freq: 329.63, color: 'from-sky-400 to-sky-600' },
  { note: 'G4', name: 'Insight', freq: 392.0, color: 'from-indigo-400 to-indigo-600' },
  { note: 'A4', name: 'Serenity', freq: 440.0, color: 'from-purple-400 to-purple-600' },
  { note: 'C5', name: 'Pure Clarity', freq: 523.25, color: 'from-pink-400 to-pink-600' },
  { note: 'D5', name: 'Transcend', freq: 587.33, color: 'from-rose-400 to-rose-600' },
];

interface MusicTilesGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const MusicTilesGame: React.FC<MusicTilesGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [instrument, setInstrument] = useState<'sine' | 'triangle'>('triangle');
  const [playCount, setPlayCount] = useState(0);

  const handleTilePress = (tile: NoteTile) => {
    if (isPaused) return;
    setActiveTile(tile.note);

    if (!isMuted) {
      audioManager.playChimeNote(tile.freq, instrument, 1.4, 0.4);
    }

    setTimeout(() => {
      setActiveTile(null);
    }, 250);

    const count = playCount + 1;
    setPlayCount(count);
    if (count >= 15 && count % 15 === 0) {
      onComplete?.();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto select-none">
      {/* Instrument Switcher */}
      <div className="flex items-center justify-between w-full p-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-600 ml-2">Harmonic Chime Scale</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setInstrument('triangle')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              instrument === 'triangle'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Acoustic Bell
          </button>
          <button
            onClick={() => setInstrument('sine')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              instrument === 'sine'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Soft Flute
          </button>
        </div>
      </div>

      {/* Musical Chime Bars */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 w-full h-[320px] p-4 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl">
        {SCALE_NOTES.map((tile, idx) => {
          const isActive = activeTile === tile.note;
          const heightPercent = 50 + (idx * 50) / (SCALE_NOTES.length - 1);

          return (
            <button
              key={tile.note}
              onClick={() => handleTilePress(tile)}
              style={{ height: `${heightPercent}%` }}
              className={`flex-1 rounded-2xl bg-linear-to-t ${tile.color} flex flex-col justify-between items-center p-2 text-white shadow-lg transition-all duration-150 active:scale-95 ${
                isActive ? 'scale-105 ring-4 ring-white shadow-2xl brightness-125' : 'hover:brightness-110'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase opacity-80">{tile.note}</span>
              <div className="w-2 h-2 rounded-full bg-white/70" />
              <span className="text-[9px] font-bold text-center leading-none hidden sm:inline">
                {tile.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Every note is tuned to an ancient pentatonic scale. Tap freely to compose soothing resonance.
      </p>
    </div>
  );
};
