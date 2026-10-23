import {
  UserProfile,
  DailyTrackerEntry,
  MealItem,
  JournalEntry,
  MentalHealthReport,
  Appointment,
  ReminderItem,
  WellnessAssessment,
} from '../types';
import {
  DEMO_TRACKER_ENTRIES,
  DEMO_MEALS,
  DEMO_JOURNALS,
  DEMO_REPORT,
} from '../data/initialData';

export const STORAGE_KEYS = {
  USER: 'mindcare_user',
  PROFILE: 'mindcare_profile',
  TRACKER: 'mindcare_tracker',
  MEALS: 'mindcare_meals',
  JOURNAL: 'mindcare_journal',
  ASSESSMENT: 'mindcare_assessment',
  REPORTS: 'mindcare_reports',
  APPOINTMENTS: 'mindcare_appointments',
  REMINDERS: 'mindcare_reminders',
  STREAK: 'mindcare_streak',
  SETTINGS: 'mindcare_settings',
};

// BMI Calculation
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Healthy Weight' | 'Overweight' | 'Obesity';
} {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Healthy Weight' };
  }
  const heightM = heightCm / 100;
  const bmiValue = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category: 'Underweight' | 'Healthy Weight' | 'Overweight' | 'Obesity' = 'Healthy Weight';
  if (bmiValue < 18.5) {
    category = 'Underweight';
  } else if (bmiValue <= 24.9) {
    category = 'Healthy Weight';
  } else if (bmiValue <= 29.9) {
    category = 'Overweight';
  } else {
    category = 'Obesity';
  }

  return { bmi: bmiValue, category };
}

// Unit converters
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft, in: inches };
}

export function ftInToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54);
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462);
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Storage loaders with defaults
export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadTrackerEntries(): DailyTrackerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRACKER);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveTrackerEntries(entries: DailyTrackerEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRACKER, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save tracker entries', e);
  }
}

export function getOrCreateTodayEntry(): DailyTrackerEntry {
  const today = getTodayDateString();
  const all = loadTrackerEntries();
  const existing = all.find((e) => e.date === today);
  if (existing) return existing;

  const newEntry: DailyTrackerEntry = {
    date: today,
    mood: null,
    stress: null,
    sleepHours: 7.0,
    waterGlasses: 0,
    exerciseMinutes: 0,
    yogaMinutes: 0,
    meditationMinutes: 0,
    dailyNote: '',
  };
  all.push(newEntry);
  saveTrackerEntries(all);
  return newEntry;
}

export function updateTodayEntry(partial: Partial<DailyTrackerEntry>): DailyTrackerEntry {
  const today = getTodayDateString();
  const all = loadTrackerEntries();
  let idx = all.findIndex((e) => e.date === today);
  if (idx === -1) {
    all.push({
      date: today,
      mood: null,
      stress: null,
      sleepHours: 7.0,
      waterGlasses: 0,
      exerciseMinutes: 0,
      yogaMinutes: 0,
      meditationMinutes: 0,
      dailyNote: '',
      ...partial,
    });
    idx = all.length - 1;
  } else {
    all[idx] = { ...all[idx], ...partial };
  }
  saveTrackerEntries(all);
  return all[idx];
}

export function loadMeals(): MealItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveMeals(meals: MealItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  } catch (e) {
    console.error('Failed to save meals', e);
  }
}

export function loadJournals(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveJournals(journals: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journals));
  } catch (e) {
    console.error('Failed to save journals', e);
  }
}

export function loadAssessments(): WellnessAssessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveAssessments(assessments: WellnessAssessment[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessments));
  } catch (e) {
    console.error('Failed to save assessments', e);
  }
}

export function loadReports(): MentalHealthReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => ({
      ...r,
      hospitalOrganization: r.hospitalOrganization || r.hospitalName || 'MindCare Wellness & University Health Center',
      gad7Score: r.gad7Score || { score: 6, severity: 'Mild' },
      phq9Score: r.phq9Score || { score: 5, severity: 'Mild' },
    }));
  } catch (e) {
    return [];
  }
}

export function saveReports(reports: MentalHealthReport[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports', e);
  }
}

export function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveAppointments(appts: Appointment[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appts));
  } catch (e) {
    console.error('Failed to save appointments', e);
  }
}

export function loadReminders(): ReminderItem[] {
  const defaultReminders: ReminderItem[] = [
    {
      id: 'rem-1',
      title: 'Hydration reminder',
      type: 'water',
      time: '10:00 AM',
      enabled: true,
      message: 'Drink a glass of fresh water to sustain cellular and cognitive energy',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    {
      id: 'rem-2',
      title: 'Midday Mood Check-in',
      type: 'mood',
      time: '01:30 PM',
      enabled: true,
      message: 'Pause for 60 seconds to notice your emotions and tension levels',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    {
      id: 'rem-3',
      title: 'Afternoon Breath & Mobility',
      type: 'meditation',
      time: '04:00 PM',
      enabled: true,
      message: 'Step away from screens and perform a gentle 3-minute breath cycle',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 'rem-4',
      title: 'Evening Reflection & Gratitude',
      type: 'journal',
      time: '09:00 PM',
      enabled: true,
      message: 'Jot down 3 positive reflections before preparing for sleep',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return defaultReminders;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultReminders;
    return parsed.map((item: any) => ({
      ...item,
      type: (item.type || 'water').toLowerCase(),
      days:
        Array.isArray(item.days) && item.days.length > 0
          ? item.days
          : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      message: item.message || 'Scheduled daily wellness prompt',
    }));
  } catch (e) {
    return defaultReminders;
  }
}

export function saveReminders(reminders: ReminderItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders', e);
  }
}

// Load Realistic Demo Data
export function loadDemoDataIntoStorage(): {
  profile: UserProfile;
  tracker: DailyTrackerEntry[];
  meals: MealItem[];
  journals: JournalEntry[];
  reports: MentalHealthReport[];
} {
  const profile: UserProfile = {
    name: 'Alex Johnson',
    preferredName: 'Alex',
    age: 21,
    email: 'alex.johnson@university.edu',
    heightCm: 172,
    heightUnit: 'cm',
    weightKg: 66,
    weightUnit: 'kg',
    activityLevel: 'Moderately Active',
    wellnessGoal: 'Manage everyday stress',
    bmi: 22.3,
    bmiCategory: 'Healthy Weight',
    registeredAt: '2026-09-01',
    isCompleted: true,
  };

  saveProfile(profile);
  saveTrackerEntries(DEMO_TRACKER_ENTRIES);
  saveMeals(DEMO_MEALS);
  saveJournals(DEMO_JOURNALS);
  saveReports([DEMO_REPORT]);

  return {
    profile,
    tracker: DEMO_TRACKER_ENTRIES,
    meals: DEMO_MEALS,
    journals: DEMO_JOURNALS,
    reports: [DEMO_REPORT],
  };
}

// Clear all local storage
export function clearAllMindCareData() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

// Convenient Aliases
export const getProfile = loadProfile;
export const getTrackerEntries = loadTrackerEntries;
export const getTodayTrackerEntry = getOrCreateTodayEntry;
export const saveTodayTrackerEntry = (entry: DailyTrackerEntry) => updateTodayEntry(entry);
export const getMeals = loadMeals;
export const getJournalEntries = loadJournals;
export const saveJournalEntries = saveJournals;
export const getReport = (): MentalHealthReport => {
  const reports = loadReports();
  const base = reports.length > 0 ? reports[0] : DEMO_REPORT;
  return {
    ...base,
    hospitalOrganization: base.hospitalOrganization || base.hospitalName || 'MindCare Wellness & University Health Center',
    gad7Score: base.gad7Score || { score: 6, severity: 'Mild' },
    phq9Score: base.phq9Score || { score: 5, severity: 'Mild' },
  };
};
export const saveReport = (report: MentalHealthReport) => saveReports([report]);
export const getAppointments = loadAppointments;
export const getReminders = loadReminders;
export const initializeDemoData = loadDemoDataIntoStorage;
