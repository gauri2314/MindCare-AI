import React, { useState } from 'react';
import {
  DailyTrackerEntry,
  MoodType,
  StressLevel,
} from '../types';
import {
  Smile,
  Droplets,
  Moon,
  Activity,
  Plus,
  Minus,
  Save,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface TrackerViewProps {
  todayEntry: DailyTrackerEntry;
  entries: DailyTrackerEntry[];
  onSaveEntry: (entry: DailyTrackerEntry) => void;
  showToast: (msg: string) => void;
}

const MOODS: Array<{ type: MoodType; emoji: string; label: string }> = [
  { type: 'very_happy', emoji: '😄', label: 'Very Happy' },
  { type: 'happy', emoji: '🙂', label: 'Happy' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'sad', emoji: '🙁', label: 'Sad' },
  { type: 'very_sad', emoji: '😞', label: 'Very Sad' },
];

const STRESS_LEVELS: Array<{ level: StressLevel; label: string; color: string }> = [
  { level: 'low', label: 'Low Stress', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { level: 'moderate', label: 'Moderate Stress', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  { level: 'high', label: 'High Stress', color: 'bg-rose-50 text-rose-700 border-rose-300' },
];

export const TrackerView: React.FC<TrackerViewProps> = ({
  todayEntry,
  entries,
  onSaveEntry,
  showToast,
}) => {
  const [current, setCurrent] = useState<DailyTrackerEntry>({ ...todayEntry });

  const handleUpdate = (partial: Partial<DailyTrackerEntry>) => {
    const updated = { ...current, ...partial };
    setCurrent(updated);
    onSaveEntry(updated);
    showToast('✓ Tracker entry saved');
  };

  const handleAddWater = () => {
    const next = Math.min(16, (current.waterGlasses || 0) + 1);
    handleUpdate({ waterGlasses: next });
  };

  const handleMinusWater = () => {
    const next = Math.max(0, (current.waterGlasses || 0) - 1);
    handleUpdate({ waterGlasses: next });
  };

  // 7-day recent entries for trend view
  const safeEntries = Array.isArray(entries) ? entries : [];
  const last7Days = [...safeEntries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>📊</span>
          Daily Wellness & Lifestyle Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your holistic daily metrics: mood, stress perception, sleep duration, hydration, and movement.
        </p>
      </div>

      {/* Grid of Tracking Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. MOOD TRACKER */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-lg">😊</span>
              Mood Tracker
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Self-report</span>
          </div>

          <p className="text-xs text-slate-600">How are you feeling today?</p>

          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => {
              const isSelected = current.mood === m.type;
              return (
                <button
                  key={m.type}
                  onClick={() => handleUpdate({ mood: m.type })}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 border transition active:scale-95 ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs scale-105'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl mb-1.5">{m.emoji}</span>
                  <span className="text-[11px] text-center leading-tight">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. STRESS TRACKER */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-lg">😰</span>
              Stress Tracker
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Self-report</span>
          </div>

          <p className="text-xs text-slate-600">How stressful did your day feel?</p>

          <div className="grid grid-cols-3 gap-2.5">
            {STRESS_LEVELS.map((s) => {
              const isSelected = current.stress === s.level;
              return (
                <button
                  key={s.level}
                  onClick={() => handleUpdate({ stress: s.level })}
                  className={`rounded-2xl p-3.5 border text-center transition active:scale-95 ${
                    isSelected
                      ? `${s.color} border-2 shadow-xs font-bold scale-102`
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm block font-semibold">{s.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {s.level === 'low'
                      ? '🟢 Calm & manageable'
                      : s.level === 'moderate'
                      ? '🟡 Noticeable pressure'
                      : '🔴 Overwhelmed'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-500 flex items-center gap-2 border border-slate-100">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Clearly labeled as a self-reported wellness entry; not an autonomous clinical measurement.</span>
          </div>
        </div>

        {/* 3. SLEEP TRACKER */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-600" />
              Sleep Tracker
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Target: 7–9 hrs</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-800">Hours Slept Last Night:</label>
              <p className="text-[11px] text-slate-500">Decimals allowed (e.g. 7.5)</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={current.sleepHours}
                onChange={(e) =>
                  handleUpdate({ sleepHours: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                className="w-24 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-base font-bold font-mono text-slate-900 text-center focus:border-teal-500 focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-600">hours</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[11px] font-semibold text-slate-400">Quick set:</span>
            {[6.0, 7.0, 7.5, 8.0, 8.5].map((h) => (
              <button
                key={h}
                onClick={() => handleUpdate({ sleepHours: h })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  current.sleepHours === h
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* 4. WATER TRACKER */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-500" />
              Hydration Tracker
            </h3>
            <span className="text-[11px] font-bold text-sky-600">
              {current.waterGlasses} / 8 Glasses Target
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            <button
              onClick={handleMinusWater}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="Remove glass"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="text-center px-4">
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {current.waterGlasses}
              </div>
              <span className="text-[11px] text-slate-500">glasses (~250ml each)</span>
            </div>

            <button
              onClick={handleAddWater}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/30 hover:bg-sky-700 transition"
              title="Add glass"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* 8 glasses visual display */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
              const isFilled = idx <= current.waterGlasses;
              return (
                <div
                  key={idx}
                  onClick={() => handleUpdate({ waterGlasses: idx })}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition ${
                    isFilled
                      ? 'bg-sky-500 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                  title={`Set to ${idx} glasses`}
                >
                  <Droplets className="h-4 w-4" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. PHYSICAL ACTIVITY & MINDFULNESS MINUTES */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              Exercise & Mindfulness Minutes
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Duration Logs</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Exercise
              </label>
              <input
                type="number"
                min="0"
                value={current.exerciseMinutes}
                onChange={(e) =>
                  handleUpdate({ exerciseMinutes: Math.max(0, parseInt(e.target.value, 10) || 0) })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center text-sm font-bold font-mono focus:border-teal-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 text-center block mt-1">mins</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Yoga
              </label>
              <input
                type="number"
                min="0"
                value={current.yogaMinutes}
                onChange={(e) =>
                  handleUpdate({ yogaMinutes: Math.max(0, parseInt(e.target.value, 10) || 0) })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center text-sm font-bold font-mono focus:border-teal-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 text-center block mt-1">mins</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Meditation
              </label>
              <input
                type="number"
                min="0"
                value={current.meditationMinutes}
                onChange={(e) =>
                  handleUpdate({
                    meditationMinutes: Math.max(0, parseInt(e.target.value, 10) || 0),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center text-sm font-bold font-mono focus:border-teal-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 text-center block mt-1">mins</span>
            </div>
          </div>
        </div>

        {/* 6. DAILY REFLECTIVE NOTE */}
        <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>📝</span>
              Daily Reflection Note
            </h3>
            <button
              onClick={() => handleUpdate({ dailyNote: current.dailyNote })}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <Save className="h-3 w-3" /> Save Note
            </button>
          </div>

          <textarea
            rows={3}
            value={current.dailyNote}
            onChange={(e) => setCurrent({ ...current, dailyNote: e.target.value })}
            onBlur={() => handleUpdate({ dailyNote: current.dailyNote })}
            placeholder="Write a brief reflection on your day, energy levels, or moments of peace..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 7-Day History & Trends Table */}
      <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            7-Day Wellness History Log
          </h3>
          <span className="text-[11px] text-slate-400">Stored locally in your browser</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Mood</th>
                <th className="py-2.5 px-3">Stress</th>
                <th className="py-2.5 px-3">Sleep</th>
                <th className="py-2.5 px-3">Water</th>
                <th className="py-2.5 px-3">Total Movement</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {last7Days.map((entry) => (
                <tr key={entry.date} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-2.5 px-3">
                    {entry.mood ? (
                      <span className="inline-flex items-center gap-1">
                        {MOODS.find((m) => m.type === entry.mood)?.emoji}
                        <span className="capitalize">{entry.mood.replace('_', ' ')}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {entry.stress ? (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold capitalize ${
                          entry.stress === 'low'
                            ? 'bg-emerald-50 text-emerald-700'
                            : entry.stress === 'moderate'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {entry.stress}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono">{entry.sleepHours} hrs</td>
                  <td className="py-2.5 px-3 font-mono text-sky-700 font-bold">
                    {entry.waterGlasses} / 8
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    {entry.exerciseMinutes + entry.yogaMinutes + entry.meditationMinutes} mins
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">
                    {entry.dailyNote || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
