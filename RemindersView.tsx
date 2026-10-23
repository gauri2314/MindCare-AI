import React, { useState } from 'react';
import { ReminderItem } from '../types';
import { getReminders, saveReminders } from '../utils/storage';
import {
  Bell,
  Clock,
  Droplets,
  Moon,
  BookOpen,
  Sparkles,
  Activity,
  Salad,
  Volume2,
  Check,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface RemindersViewProps {
  showToast: (msg: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ showToast }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>(() => getReminders());

  const handleToggle = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setReminders(updated);
    saveReminders(updated);
    showToast('Reminder setting updated');
  };

  const handleTimeChange = (id: string, newTime: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, time: newTime } : r));
    setReminders(updated);
    saveReminders(updated);
    showToast('Reminder time saved');
  };

  const handleTestSound = () => {
    audioManager.playCompletionSound('Bell', 0.6);
    showToast('🔔 Chime sound played');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplets className="h-4 w-4 text-sky-600" />;
      case 'sleep':
        return <Moon className="h-4 w-4 text-indigo-600" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case 'meditation':
        return <Sparkles className="h-4 w-4 text-teal-600" />;
      case 'exercise':
        return <Activity className="h-4 w-4 text-emerald-600" />;
      case 'nutrition':
        return <Salad className="h-4 w-4 text-emerald-600" />;
      default:
        return <Bell className="h-4 w-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>⏰</span>
            Wellness Reminders & Routine Prompts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build healthy daily micro-habits through timely, gentle auditory and visual notifications.
          </p>
        </div>

        <button
          onClick={handleTestSound}
          className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition"
        >
          <Volume2 className="h-4 w-4 text-teal-600" />
          Test Notification Chime
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`rounded-3xl p-5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              r.enabled
                ? 'bg-white border-slate-200/80 shadow-xs'
                : 'bg-slate-50/60 border-slate-200/40 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                {getIcon(r.type)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-500">{r.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-slate-400">Repeats:</span>
                  <div className="flex gap-1">
                    {(r.days && r.days.length > 0
                      ? r.days
                      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    ).map((day) => (
                      <span
                        key={day}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <input
                  type="time"
                  value={r.time}
                  onChange={(e) => handleTimeChange(r.id, e.target.value)}
                  className="bg-transparent font-mono text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => handleToggle(r.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  r.enabled ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    r.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
