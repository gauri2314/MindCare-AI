import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Music, CloudRain, Wind, Waves, Bird, Disc, ChevronUp, ChevronDown } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface MusicBarProps {
  onOpenFullPlayer?: () => void;
}

type InstrumentType = 'Piano' | 'Flute' | 'Guitar' | 'Vina' | 'Violin';
type NatureType = 'Rain' | 'Ocean Waves' | 'Birds' | 'Forest' | 'Wind' | 'Water Streams';

export const MusicBar: React.FC<MusicBarProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('Piano');
  const [selectedNature, setSelectedNature] = useState<NatureType>('Rain');
  const [instrumentVol, setInstrumentVol] = useState(0.4);
  const [natureVol, setNatureVol] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePlayback = () => {
    if (isPlaying) {
      audioManager.stopAll();
      setIsPlaying(false);
    } else {
      audioManager.startInstrumentSound(selectedInstrument, instrumentVol);
      audioManager.startNatureSound(selectedNature, natureVol);
      setIsPlaying(true);
    }
  };

  const handleInstrumentChange = (inst: InstrumentType) => {
    setSelectedInstrument(inst);
    if (isPlaying) {
      audioManager.startInstrumentSound(inst, instrumentVol);
    }
  };

  const handleNatureChange = (nat: NatureType) => {
    setSelectedNature(nat);
    if (isPlaying) {
      audioManager.startNatureSound(nat, natureVol);
    }
  };

  const handleInstrumentVolChange = (val: number) => {
    setInstrumentVol(val);
    audioManager.setInstrumentVolume(val);
  };

  const handleNatureVolChange = (val: number) => {
    setNatureVol(val);
    audioManager.setNatureVolume(val);
  };

  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 shadow-lg transition-all duration-300">
      {/* Mini top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={togglePlayback}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
              isPlaying
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Disc className={`h-3.5 w-3.5 text-teal-600 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>
                {selectedInstrument} + {selectedNature}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {isPlaying ? 'Active Audio Ambience' : 'Acoustic & Nature Mixer'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100 transition"
          >
            <span>Mixer</span>
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Mixer Controls */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
          {/* Instrument selector & volume */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-teal-600" />
                Instrument:
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {Math.round(instrumentVol * 100)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(['Piano', 'Flute', 'Guitar', 'Vina', 'Violin'] as InstrumentType[]).map((inst) => (
                <button
                  key={inst}
                  onClick={() => handleInstrumentChange(inst)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    selectedInstrument === inst
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={instrumentVol}
              onChange={(e) => handleInstrumentVolChange(parseFloat(e.target.value))}
              className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Nature selector & volume */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CloudRain className="h-3.5 w-3.5 text-sky-600" />
                Nature Sound:
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {Math.round(natureVol * 100)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(['Rain', 'Ocean Waves', 'Birds', 'Wind', 'Water Streams'] as NatureType[]).map((nat) => (
                <button
                  key={nat}
                  onClick={() => handleNatureChange(nat)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    selectedNature === nat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {nat}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={natureVol}
              onChange={(e) => handleNatureVolChange(parseFloat(e.target.value))}
              className="w-full accent-sky-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
