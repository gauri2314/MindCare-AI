import React, { useState } from 'react';
import { UserProfile, ActivityLevel, WellnessGoal } from '../types';
import { calculateBMI, saveProfile, initializeDemoData } from '../utils/storage';
import {
  Settings,
  User,
  Scale,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Save,
  Volume2,
  Trash2,
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface SettingsViewProps {
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
  onReloadDemo: () => void;
  showToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onReloadDemo,
  showToast,
}) => {
  const [name, setName] = useState(profile?.name || 'Alex Johnson');
  const [preferredName, setPreferredName] = useState(profile?.preferredName || 'Alex');
  const [age, setAge] = useState<number>(profile?.age || 21);
  const [heightCm, setHeightCm] = useState<number>(profile?.heightCm || 172);
  const [weightKg, setWeightKg] = useState<number>(profile?.weightKg || 65);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activityLevel || 'Moderately Active'
  );
  const [wellnessGoal, setWellnessGoal] = useState<WellnessGoal>(
    profile?.wellnessGoal || 'Manage everyday stress'
  );

  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name,
      preferredName,
      age,
      heightCm,
      weightKg,
      activityLevel,
      wellnessGoal,
      bmi,
      bmiCategory,
      isCompleted: true,
      registeredAt: profile?.registeredAt || new Date().toISOString().split('T')[0],
    };

    saveProfile(updated);
    onUpdateProfile(updated);
    showToast('✓ Profile updated successfully');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear your local data and restart the onboarding flow?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>⚙️</span>
          Application Settings & Profile Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal metrics, screening parameters, and session data.
        </p>
      </div>

      {/* Profile & Health Metrics Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Health Profile & Screening Baseline</h2>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
          >
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Name</label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
            <input
              type="number"
              min="12"
              max="120"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="250"
              value={heightCm}
              onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 170)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              min="30"
              max="300"
              value={weightKg}
              onChange={(e) => setWeightKg(parseInt(e.target.value, 10) || 60)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs focus:border-teal-500 focus:outline-none"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          </div>
        </div>

        {/* Calculated BMI Badge in Settings */}
        <div className="rounded-2xl bg-teal-50/70 p-4 border border-teal-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Screening Body Mass Index (BMI)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-teal-950 font-mono">{bmi}</span>
              <span className="rounded-md bg-teal-200/80 px-2 py-0.5 text-xs font-bold text-teal-900">
                {bmiCategory}
              </span>
            </div>
            <p className="text-[10px] text-teal-800 mt-1">
              "BMI is a general screening measure and does not independently determine health status."
            </p>
          </div>
          <Scale className="h-8 w-8 text-teal-600/30" />
        </div>
      </form>

      {/* College Project & Demo Management */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold">College Project & Demonstration Controls</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          MindCare AI was engineered with full offline-ready local persistence. You can populate rich demonstration data (7-day wellness history, meals, medical screening report, and reminders) to showcase all platform capabilities.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              initializeDemoData();
              onReloadDemo();
              showToast('🎓 Loaded realistic college demo data');
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Realistic Demo Data
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <Trash2 className="h-4 w-4" />
            Reset All Data to Blank
          </button>
        </div>
      </div>

      {/* Regulatory & Healthcare Privacy Notice */}
      <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Data Protection & Clinical Advisory
        </div>
        <p className="text-[11px] leading-relaxed">
          MindCare AI complies with wellness data hygiene practices. All personal logs remain in client-side storage within your secure browser sandbox. Chat queries sent to the Gemini API are processed in-memory to provide empathetic, contextual responses and are not stored in any external database.
        </p>
      </div>
    </div>
  );
};
