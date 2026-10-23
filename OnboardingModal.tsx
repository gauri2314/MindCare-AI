import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Scale,
  Target,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, ActivityLevel, WellnessGoal } from '../types';
import { calculateBMI, cmToFtIn, ftInToCm, kgToLbs, lbsToKg, saveProfile } from '../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onCompleted: (profile: UserProfile) => void;
  onExploreDemo: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onCompleted,
  onExploreDemo,
}) => {
  const [step, setStep] = useState<'welcome' | 'step1' | 'step2' | 'summary'>('welcome');

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [age, setAge] = useState<number | ''>(21);
  const [email, setEmail] = useState('');

  // Step 2: Health Profile
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft_in'>('cm');
  const [heightCm, setHeightCm] = useState<number | ''>(172);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(8);

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weightKg, setWeightKg] = useState<number | ''>(65);
  const [weightLbs, setWeightLbs] = useState<number | ''>(143);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Moderately Active');
  const [wellnessGoal, setWellnessGoal] = useState<WellnessGoal>('Manage everyday stress');

  if (!isOpen) return null;

  // Real-time BMI computation
  const effectiveHeightCm =
    heightUnit === 'cm'
      ? Number(heightCm) || 170
      : ftInToCm(Number(heightFt) || 5, Number(heightIn) || 7);

  const effectiveWeightKg =
    weightUnit === 'kg'
      ? Number(weightKg) || 65
      : lbsToKg(Number(weightLbs) || 143);

  const { bmi, category: bmiCategory } = calculateBMI(effectiveWeightKg, effectiveHeightCm);

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      name: name.trim() || 'Alex',
      preferredName: preferredName.trim() || name.trim() || 'Alex',
      age: Number(age) || 21,
      email: email.trim() || undefined,
      heightCm: effectiveHeightCm,
      heightUnit,
      heightFt: heightUnit === 'ft_in' ? Number(heightFt) : undefined,
      heightIn: heightUnit === 'ft_in' ? Number(heightIn) : undefined,
      weightKg: effectiveWeightKg,
      weightUnit,
      activityLevel,
      wellnessGoal,
      bmi,
      bmiCategory,
      registeredAt: new Date().toISOString().split('T')[0],
      isCompleted: true,
    };
    saveProfile(finalProfile);
    onCompleted(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        id="onboarding-dialog"
        className="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Step Indicator */}
        {step !== 'welcome' && (
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
                {step === 'step1' ? '1' : step === 'step2' ? '2' : '✓'}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {step === 'step1'
                  ? 'Step 1: Basic Information'
                  : step === 'step2'
                  ? 'Step 2: Health & Wellness Profile'
                  : 'Profile Confirmation'}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {step === 'step1' ? '1 of 2' : step === 'step2' ? '2 of 2' : 'Review'}
            </span>
          </div>
        )}

        {/* WELCOME SCREEN */}
        {step === 'welcome' && (
          <div className="text-center py-4 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-xs">
              <Sparkles className="h-9 w-9 text-teal-600" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
                MindCare AI
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                Your Mental Wellness & Health Companion
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                "Understand yourself. Build healthier habits. Take care of your mind."
              </p>
            </div>

            {/* Safety Disclaimer Banner */}
            <div className="rounded-2xl bg-teal-50/60 p-4 border border-teal-100 text-left text-xs text-teal-950 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                MindCare AI provides general wellness support, lifestyle tracking, and screening information. It does not replace professional medical care, psychiatric diagnosis, or clinical emergency services.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="welcome-get-started-btn"
                onClick={() => setStep('step1')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-md shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="welcome-explore-demo-btn"
                onClick={onExploreDemo}
                className="w-full sm:w-auto rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Explore Demo (College Project)
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 'step1' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us how you would like the application to address you.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    placeholder="e.g. 21"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Optional for prototype)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setStep('welcome')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <button
                onClick={() => setStep('step2')}
                disabled={!name.trim()}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-50 transition"
              >
                Continue to Health Profile
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Health Profile & BMI */}
        {step === 'step2' && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Health & Wellness Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Used to tailor physical activity, hydration, and general nutrition suggestions.
              </p>
            </div>

            {/* Height input */}
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">Height</label>
                <div className="flex items-center rounded-lg bg-slate-200 p-0.5 text-[11px] font-medium">
                  <button
                    onClick={() => setHeightUnit('cm')}
                    className={`rounded-md px-2.5 py-0.5 ${
                      heightUnit === 'cm' ? 'bg-white shadow-xs font-bold text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    onClick={() => setHeightUnit('ft_in')}
                    className={`rounded-md px-2.5 py-0.5 ${
                      heightUnit === 'ft_in' ? 'bg-white shadow-xs font-bold text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    ft / in
                  </button>
                </div>
              </div>

              {heightUnit === 'cm' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-500">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-slate-500">ft</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-slate-500">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight input */}
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">Body Weight</label>
                <div className="flex items-center rounded-lg bg-slate-200 p-0.5 text-[11px] font-medium">
                  <button
                    onClick={() => setWeightUnit('kg')}
                    className={`rounded-md px-2.5 py-0.5 ${
                      weightUnit === 'kg' ? 'bg-white shadow-xs font-bold text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setWeightUnit('lbs')}
                    className={`rounded-md px-2.5 py-0.5 ${
                      weightUnit === 'lbs' ? 'bg-white shadow-xs font-bold text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>

              {weightUnit === 'kg' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-500">kg</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="65"
                    max="660"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-500">lbs</span>
                </div>
              )}
            </div>

            {/* Calculated BMI Callout */}
            <div className="rounded-2xl bg-teal-50/70 p-4 border border-teal-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    Calculated Screening BMI
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-teal-950 font-mono">{bmi}</span>
                    <span className="rounded-md bg-teal-200/70 px-2 py-0.5 text-xs font-bold text-teal-900">
                      {bmiCategory}
                    </span>
                  </div>
                </div>
                <Scale className="h-8 w-8 text-teal-600/40" />
              </div>

              <p className="mt-2 text-[10px] text-teal-900 leading-normal">
                "BMI is a general screening measure and does not independently determine health status."
              </p>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Current Activity Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] as ActivityLevel[]).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActivityLevel(lvl)}
                      className={`rounded-xl p-2.5 text-xs font-semibold text-left transition ${
                        activityLevel === lvl
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Wellness Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Primary Wellness Goal
              </label>
              <select
                value={wellnessGoal}
                onChange={(e) => setWellnessGoal(e.target.value as WellnessGoal)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
              >
                <option value="Improve general wellness">Improve general wellness</option>
                <option value="Improve sleep habits">Improve sleep habits</option>
                <option value="Increase physical activity">Increase physical activity</option>
                <option value="Improve nutrition">Improve nutrition</option>
                <option value="Manage everyday stress">Manage everyday stress</option>
                <option value="Build healthy routines">Build healthy routines</option>
                <option value="Improve mindfulness">Improve mindfulness</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setStep('step1')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <button
                onClick={() => setStep('summary')}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
              >
                Review Profile
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Summary & Dashboard Confirmation */}
        {step === 'summary' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Summary Review
              </span>
              <h2 className="text-xl font-bold text-slate-900">Your Wellness Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your profile information before entering MindCare AI.
              </p>
            </div>

            {/* Profile Card Preview */}
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">👤 {name}</span>
                <span className="text-slate-500">Age: {age}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  Height: <strong>{effectiveHeightCm} cm</strong>
                </div>
                <div>
                  Weight: <strong>{effectiveWeightKg} kg</strong>
                </div>
                <div>
                  Screening BMI: <strong>{bmi}</strong>
                </div>
                <div>
                  Category: <strong>{bmiCategory}</strong>
                </div>
                <div>
                  Activity: <strong>{activityLevel}</strong>
                </div>
                <div>
                  Goal: <strong>{wellnessGoal}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 border border-amber-200/60 text-[11px] text-amber-900 leading-normal">
              Notice: MindCare AI stores your data in your browser's local storage for this prototype session. You can update or edit your metrics anytime from Settings or Profile.
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep('step2')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                [Edit Profile]
              </button>

              <button
                id="onboarding-complete-btn"
                onClick={handleFinish}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition"
              >
                <Check className="h-4 w-4" />
                Enter MindCare AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
