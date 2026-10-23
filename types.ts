export type NavigationSection =
  | 'home'
  | 'chatbot'
  | 'chat'
  | 'tracker'
  | 'nutrition'
  | 'exercise'
  | 'yoga'
  | 'meditation'
  | 'breathing'
  | 'music'
  | 'games'
  | 'activities'
  | 'report'
  | 'journal'
  | 'quiz'
  | 'professionals'
  | 'reminders'
  | 'support'
  | 'safespace'
  | 'settings';

export type ActivityLevel =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active';

export type WellnessGoal =
  | 'Improve general wellness'
  | 'Improve sleep habits'
  | 'Increase physical activity'
  | 'Improve nutrition'
  | 'Manage everyday stress'
  | 'Build healthy routines'
  | 'Improve mindfulness';

export interface UserProfile {
  name: string;
  preferredName?: string;
  age: number;
  email?: string;
  heightCm: number;
  heightUnit?: 'cm' | 'ft_in';
  heightFt?: number;
  heightIn?: number;
  weightKg: number;
  weightUnit?: 'kg' | 'lbs';
  activityLevel: ActivityLevel;
  wellnessGoal: WellnessGoal;
  bmi: number;
  bmiCategory: 'Underweight' | 'Healthy Weight' | 'Overweight' | 'Obesity';
  registeredAt: string;
  isCompleted: boolean;
}

export type MoodType = 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad';
export type StressLevel = 'low' | 'moderate' | 'high';

export interface DailyTrackerEntry {
  date: string; // YYYY-MM-DD
  mood: MoodType | null;
  stress: StressLevel | null;
  sleepHours: number;
  waterGlasses: number; // target 8
  exerciseMinutes: number;
  yogaMinutes: number;
  meditationMinutes: number;
  dailyNote: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
export type HealthClassification = 'Healthy' | 'Normal' | 'Poor' | 'Unhealthy';

export interface MealItem {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName?: string;
  foodItems?: string | string[];
  quantity?: string;
  calories?: number;
  classification: HealthClassification;
  notes?: string;
}

export type MealEntry = MealItem;

export type MotionDirection =
  | 'down'
  | 'up'
  | 'hold'
  | 'forward'
  | 'stretch'
  | 'twist'
  | 'march'
  | 'lateral'
  | 'reach';

export type ExerciseCategory =
  | 'Full Body'
  | 'Strength'
  | 'Cardio'
  | 'Flexibility'
  | 'Mobility'
  | 'Beginner'
  | 'Low Impact'
  | 'Warm-up'
  | 'Cool-down'
  | 'Core'
  | 'Stretching'
  | 'Yoga'
  | 'Relaxation'
  | 'Intermediate';

export interface ExerciseStep {
  stepNumber: number;
  title: string;
  stepName?: string;
  instruction: string;
  image: string;
  imageKey?: string;
  duration?: number;
  motionDirection?: MotionDirection;
  motionArrowLabel?: string;
  postureTips?: string[];
  postureCue?: string;
  bodyHighlight?: string;
  keyAlignment?: string;
  detail?: string;
  voiceCue?: string;
  breathCue?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  imageUrl: string;
  steps: ExerciseStep[];
  correctPosture: string;
  breathingGuidance: string;
  breathingInhale?: string;
  breathingExhale?: string;
  mode?: 'timer' | 'reps';
  defaultReps?: number;
  commonMistakes: string[];
  safetyPrecautions: string;
  videoTitle?: string;
  caloriesBurned?: number;
}

export interface YogaStep {
  stepNumber: number;
  title: string;
  stepName?: string;
  instruction: string;
  imageKey: string;
  duration?: number;
  motionDirection?: 'up' | 'down' | 'forward' | 'hold' | 'stretch' | 'rotate';
  motionArrowLabel?: string;
  postureCue?: string;
  keyAlignment?: string;
  bodyHighlight?: string;
  voiceCue?: string;
  breathCue?: string;
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName?: string;
  englishName?: string;
  category:
    | 'Beginner Yoga'
    | 'Morning Yoga'
    | 'Evening Yoga'
    | 'Flexibility'
    | 'Relaxation'
    | 'Stress Relief'
    | 'Balance'
    | 'Strength'
    | 'Mobility'
    | 'Gentle Yoga'
    | 'Yoga for Focus'
    | 'Yoga for Better Sleep'
    | 'Restoration';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  imageUrl: string;
  instructions: string[];
  steps?: YogaStep[];
  breathingGuidance?: string;
  breathingFocus?: string;
  breathingCadence?: {
    inhale: number;
    hold?: number;
    exhale: number;
    rest?: number;
  };
  benefits?: string[];
  commonMistakes: string[];
  safetyPrecautions: string;
}

export interface MeditationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  poseKey: string;
  postureCues?: string[];
  keyAlignment?: string;
  bodyHighlight?: string;
  durationSeconds?: number;
  breathingCue?: string;
}

export interface MeditationItem {
  id: string;
  title: string;
  category:
    | 'Mindful Breathing'
    | 'Stress Relief'
    | 'Relaxation'
    | 'Sleep'
    | 'Focus'
    | 'Body Scan'
    | 'Gratitude'
    | 'Calm Mind'
    | 'Morning Meditation'
    | 'Evening Meditation'
    | 'Mindfulness'
    | 'Study Break'
    | 'Morning Calm'
    | 'Evening Relaxation';
  durationMinutes: number;
  difficulty: 'Beginner' | 'All Levels';
  description: string;
  imageUrl: string;
  guideText: string[];
  steps?: MeditationStep[];
  breathingPattern?: {
    name: string;
    inhale: number;
    hold?: number;
    exhale: number;
    rest?: number;
  };
  suggestedSound?: {
    type: 'music' | 'nature';
    name: string;
  };
  themeColor?: 'teal' | 'indigo' | 'purple' | 'blue' | 'emerald' | 'amber';
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  mood: MoodType;
  content: string;
  promptUsed?: string;
  tags?: string[];
}

export interface WellnessAssessment {
  id: string;
  date: string;
  answers: Record<string, number>;
  domainScores: {
    mood: { score: number; max: number; label: string };
    stress: { score: number; max: number; label: string };
    sleep: { score: number; max: number; label: string };
    concentration: { score: number; max: number; label: string };
    energy: { score: number; max: number; label: string };
    dailyFunctioning: { score: number; max: number; label: string };
    lifestyle: { score: number; max: number; label: string };
  };
  totalScore: number;
  overallScreeningCategory: 'Low concern' | 'Mild' | 'Moderate' | 'Higher concern';
  observations: string;
  disclaimer: string;
}

export type ReportStatus =
  | 'Draft'
  | 'Awaiting Professional Review'
  | 'Professionally Reviewed'
  | 'Finalized by Professional';

export interface MentalHealthReport {
  reportId: string;
  assessmentDate: string;
  hospitalOrganization?: string;
  hospitalName?: string;
  department: string;
  status: ReportStatus;
  doctorName?: string;
  doctorDesignation?: string;
  licenseNumber?: string;
  reviewDate?: string;
  primaryDiagnosis?: string;
  gad7Score?: { score: number; severity: string };
  phq9Score?: { score: number; severity: string };
  patientInfo?: {
    name: string;
    age: number;
    heightCm: number;
    weightKg: number;
    bmi: number;
    bmiCategory: string;
    activityLevel: string;
    wellnessGoal: string;
  };
  presentingConcerns: string;
  symptomWellnessSummary?: string;
  mentalStatusObservations?: {
    appearance: string;
    behavior: string;
    speech: string;
    mood: string;
    affect: string;
    thoughtProcess: string;
    orientation: string;
    insight: string;
    judgment: string;
    isProfessionalEntry: boolean;
  };
  screeningScores?: Array<{
    name: string;
    score: string | number;
    category: string;
    interpretation: string;
  }>;
  psychosocialFactors?: string;
  safetyInformation?: {
    userReportedConcerns: string;
    professionalRiskAssessment: string;
    status: 'Not assessed / awaiting professional review' | 'Reviewed by professional';
  };
  clinicalImpression: any;
  diagnosis?: {
    status: 'Pending professional review' | 'Confirmed by professional';
    primaryDiagnosis: string;
    secondaryDiagnosis: string;
    diagnosticNotes: string;
  };
  treatmentPlan?: {
    medication: string;
    therapy: string;
    lifestyleRecommendations: string;
    followUp: string;
    isProfessionalEntry: boolean;
  };
  aiWellnessRecommendations?: string[];
  professionalReview?: {
    professionalName: string;
    designation: 'Psychiatrist' | 'Psychologist' | 'Counselor' | 'Other' | string;
    registrationLicenseNumber: string;
    reviewDate: string;
    clinicalNotes: string;
    decision: 'Review' | 'Confirm' | 'Modify' | string;
    signature: string;
  };
}

export interface Appointment {
  id: string;
  providerName?: string;
  providerType?: 'Psychiatrist' | 'Psychologist' | 'Counselor' | 'Therapist';
  professionalType?: 'Psychiatrist' | 'Psychologist' | 'Counselor' | 'Therapist';
  date: string;
  time: string;
  mode?: 'Telehealth' | 'In-Person';
  reason: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  bookedAt?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: string;
  time: string;
  enabled: boolean;
  message?: string;
  days?: string[];
}

export interface QuizQuestion {
  id: string;
  topic?: string;
  category?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GameId =
  | 'jigsaw'
  | 'coloring'
  | 'zengarden'
  | 'bubblepop'
  | 'memory'
  | 'waterflow'
  | 'mandala'
  | 'growplant'
  | 'aquarium'
  | 'clouds'
  | 'musictiles'
  | 'raindrops'
  | 'stargazing'
  | 'candle'
  | 'naturematch'
  | 'breathinggame';

export type GameCategory =
  | 'Stress Relief'
  | 'Focus'
  | 'Mindfulness'
  | 'Sleep & Relaxation'
  | 'Creativity'
  | 'Quick 2–5 Minute Games';

export interface GameItem {
  id: GameId;
  name: string;
  icon: string;
  duration: string;
  category: GameCategory;
  difficulty: 'Easy' | 'Medium' | 'Relaxed';
  shortPurpose: string;
  imageUrl: string;
  recommendFor?: ('stress' | 'sleep' | 'focus' | 'low_mood' | 'creativity' | 'mindfulness')[];
}

// SafeSpace Peer Support Types
export type SafeSpaceReactionType = 'heard' | 'support' | 'keepGoing' | 'notAlone';

export interface SafeSpaceReactionCounts {
  heard: number;
  support: number;
  keepGoing: number;
  notAlone: number;
}

export type SafeSpacePostCategory = 'all' | 'hope' | 'wins' | 'encouragement' | 'gratitude';

export interface SafeSpaceCommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  authorColor: string;
  content: string;
  timestamp: string;
  category: 'hope' | 'wins' | 'encouragement' | 'gratitude';
  reactions: SafeSpaceReactionCounts;
  userReacted?: SafeSpaceReactionType[];
  isPinned?: boolean;
}

export interface SafeSpaceChatMessage {
  id: string;
  sender: 'seeker' | 'listener' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isCrisisAlert?: boolean;
}

export interface SafeSpaceTopic {
  id: string;
  title: string;
  emoji: string;
  description: string;
  colorClass: string;
  badge: string;
}

export interface SafeSpacePeerRequest {
  id: string;
  seekerName: string;
  seekerAvatar: string;
  seekerColor: string;
  topicId: string;
  topicTitle: string;
  topicEmoji: string;
  feeling: string;
  notes: string;
  waitTimeMinutes: number;
  urgency: 'gentle' | 'normal';
}

export interface SafeSpaceListenerProfile {
  isAvailable: boolean;
  totalListenedMinutes: number;
  peopleSupportedCount: number;
  appreciationHearts: number;
  listenerPledgeAccepted: boolean;
  level: string;
}

