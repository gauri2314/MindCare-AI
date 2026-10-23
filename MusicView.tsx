import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  CloudRain,
  Wind,
  Waves,
  Bird,
  Trees,
  Droplets,
  Volume2,
  Sparkles,
  Disc,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

type InstrumentType = 'Piano' | 'Flute' | 'Guitar' | 'Vina' | 'Violin';
type NatureType = 'Rain' | 'Ocean Waves' | 'Birds' | 'Forest' | 'Wind' | 'Water Streams';

interface PresetCombo {
  name: string;
  instrument: InstrumentType;
  nature: NatureType;
  instVol: number;
  natVol: number;
  description: string;
}

const PRESETS: PresetCombo[] = [
  {
    name: 'Rainy Afternoon Piano',
    instrument: 'Piano',
    nature: 'Rain',
    instVol: 0.5,
    natVol: 0.4,
    description: 'Gentle chord progressions woven with soft rhythmic raindrops.',
  },
  {
    name: 'Forest Stream Flute',
    instrument: 'Flute',
    nature: 'Forest',
    instVol: 0.45,
    natVol: 0.35,
    description: 'Airy melodic flutes harmonizing with deep woodland leaves.',
  },
  {
    name: 'Ocean Sunset Guitar',
    instrument: 'Guitar',
    nature: 'Ocean Waves',
    instVol: 0.5,
    natVol: 0.4,
    description: 'Acoustic warm picking backed by rolling tidal waves.',
  },
  {
    name: 'Meditative Temple Vina',
    instrument: 'Vina',
    nature: 'Birds',
    instVol: 0.4,
    natVol: 0.3,
    description: 'Traditional resonating strings with peaceful morning birdsong.',
  },
  {
    name: 'Midnight Stream Violin',
    instrument: 'Violin',
    nature: 'Water Streams',
    instVol: 0.45,
    natVol: 0.35,
    description: 'Rich bowed strings paired with babbling river currents.',
  },
];

export const MusicView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentInstrument, setCurrentInstrument] = useState<InstrumentType>('Piano');
  const [currentNature, setCurrentNature] = useState<NatureType>('Rain');
  const [instrumentVol, setInstrumentVol] = useState(0.4);
  const [natureVol, setNatureVol] = useState(0.3);

  const startPlayback = (inst: InstrumentType, nat: NatureType, ivol: number, nvol: number) => {
    setCurrentInstrument(inst);
    setCurrentNature(nat);
    setInstrumentVol(ivol);
    setNatureVol(nvol);
    audioManager.startInstrumentSound(inst, ivol);
    audioManager.startNatureSound(nat, nvol);
    setIsPlaying(true);
  };

  const toggleMasterPlay = () => {
    if (isPlaying) {
      audioManager.stopAll();
      setIsPlaying(false);
    } else {
      startPlayback(currentInstrument, currentNature, instrumentVol, natureVol);
    }
  };

  const handleInstrumentChange = (inst: InstrumentType) => {
    setCurrentInstrument(inst);
    if (isPlaying) {
      audioManager.startInstrumentSound(inst, instrumentVol);
    }
  };

  const handleNatureChange = (nat: NatureType) => {
    setCurrentNature(nat);
    if (isPlaying) {
      audioManager.startNatureSound(nat, natureVol);
    }
  };

  const handleInstVol = (val: number) => {
    setInstrumentVol(val);
    audioManager.setInstrumentVolume(val);
  };

  const handleNatVol = (val: number) => {
    setNatureVol(val);
    audioManager.setNatureVolume(val);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🎵</span>
            Acoustic & Nature Sound Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synthesized Web Audio soundscapes. Blend calming acoustic instruments with natural field recordings.
          </p>
        </div>

        <button
          onClick={toggleMasterPlay}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
              : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" /> Stop Ambient Audio
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" /> Play Current Mix
            </>
          )}
        </button>
      </div>

      {/* Featured Mix Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Featured Ambient Presets</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESETS.map((p) => {
            const isSelected =
              isPlaying &&
              currentInstrument === p.instrument &&
              currentNature === p.nature;
            return (
              <div
                key={p.name}
                onClick={() => startPlayback(p.instrument, p.nature, p.instVol, p.natVol)}
                className={`flex flex-col justify-between rounded-2xl p-4 border transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {p.instrument} + {p.nature}
                    </span>
                    {isSelected && (
                      <Disc className="h-3.5 w-3.5 text-teal-600 animate-spin" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700">
                  <span>{isSelected ? 'Now Playing' : 'Start Preset'}</span>
                  <Play className="h-3 w-3 fill-current" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Studio Mixer */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Disc className={`h-5 w-5 text-teal-600 ${isPlaying ? 'animate-spin' : ''}`} />
              Studio Soundboard Controls
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize each channel independently in real-time
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isPlaying
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isPlaying ? '● Audio Active' : '○ Audio Silent'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Channel A: Acoustic Instrument */}
          <div className="rounded-2xl bg-slate-50/70 p-5 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Music className="h-4 w-4 text-teal-600" />
                Channel 1: Acoustic Instrument
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {Math.round(instrumentVol * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Piano', 'Flute', 'Guitar', 'Vina', 'Violin'] as InstrumentType[]).map((inst) => (
                <button
                  key={inst}
                  onClick={() => handleInstrumentChange(inst)}
                  className={`rounded-xl py-2 px-3 text-xs font-bold transition ${
                    currentInstrument === inst
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Instrument Volume Gain
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={instrumentVol}
                onChange={(e) => handleInstVol(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Channel B: Nature Soundscape */}
          <div className="rounded-2xl bg-slate-50/70 p-5 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-sky-600" />
                Channel 2: Ambient Nature Sound
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {Math.round(natureVol * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Rain', 'Ocean Waves', 'Birds', 'Forest', 'Wind', 'Water Streams'] as NatureType[]).map(
                (nat) => (
                  <button
                    key={nat}
                    onClick={() => handleNatureChange(nat)}
                    className={`rounded-xl py-2 px-3 text-xs font-bold transition ${
                      currentNature === nat
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {nat}
                  </button>
                )
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Nature Ambience Volume Gain
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={natureVol}
                onChange={(e) => handleNatVol(parseFloat(e.target.value))}
                className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
