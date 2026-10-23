import React, { useState, useEffect } from 'react';
import {
  NavigationSection,
  UserProfile,
  DailyTrackerEntry,
  MentalHealthReport,
  ExerciseItem,
  MoodType,
} from './types';
import {
  getProfile,
  getTodayTrackerEntry,
  saveTodayTrackerEntry,
  getTrackerEntries,
  getReport,
  saveReport,
  initializeDemoData,
} from './utils/storage';

// Views
import { HomeView } from './views/HomeView';
import { ChatbotView } from './views/ChatbotView';
import { TrackerView } from './views/TrackerView';
import { NutritionView } from './views/NutritionView';
import { ExerciseView } from './views/ExerciseView';
import { YogaView } from './views/YogaView';
import { MeditationView } from './views/MeditationView';
import { MusicView } from './views/MusicView';
import { ReportView } from './views/ReportView';
import { JournalView } from './views/JournalView';
import { QuizView } from './views/QuizView';
import { ProfessionalsView } from './views/ProfessionalsView';
import { RemindersView } from './views/RemindersView';
import { SettingsView } from './views/SettingsView';
import { GamesView } from './views/GamesView';
import { ActivitiesView } from './views/ActivitiesView';
import { SafeSpaceView } from './views/SafeSpaceView';

// Modals & Floating Components
import { OnboardingModal } from './components/OnboardingModal';
import { UniversalTimerModal } from './components/UniversalTimerModal';
import { BreathingModal } from './components/BreathingModal';
import { ExerciseVideoModal } from './components/ExerciseVideoModal';
import { SOSModal } from './components/SOSModal';
import { MusicBar } from './components/MusicBar';
import { GameModal } from './components/games/GameModal';

// Icons
import {
  Sparkles,
  Home,
  MessageSquare,
  Activity,
  Salad,
  Wind,
  Heart,
  Music,
  FileText,
  BookOpen,
  HelpCircle,
  UserCheck,
  Bell,
  Settings,
  ShieldAlert,
  Menu,
  X,
  CheckCircle,
  Gamepad2,
  Compass,
  HeartHandshake,
} from 'lucide-react';
import { GameItem } from './types';

export default function App() {
  // State
  const [profile, setProfile] = useState<UserProfile | null>(() => getProfile());
  const [currentSection, setCurrentSection] = useState<NavigationSection>('home');
  const [todayEntry, setTodayEntry] = useState<DailyTrackerEntry>(() => getTodayTrackerEntry());
  const [entries, setEntries] = useState<DailyTrackerEntry[]>(() => getTrackerEntries());
  const [report, setReport] = useState<MentalHealthReport>(() => getReport());

  // Navigation sidebar on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !getProfile()?.isCompleted);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [timerModalConfig, setTimerModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    minutes: number;
  }>({
    isOpen: false,
    title: 'Meditation Session',
    minutes: 5,
  });
  const [videoModalConfig, setVideoModalConfig] = useState<{
    isOpen: boolean;
    exercise: ExerciseItem | null;
  }>({
    isOpen: false,
    exercise: null,
  });
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Sync today's entry update
  const handleSaveEntry = (updated: DailyTrackerEntry) => {
    setTodayEntry(updated);
    saveTodayTrackerEntry(updated);
    setEntries(getTrackerEntries());
  };

  const handleUpdateMood = (mood: MoodType) => {
    const updated = { ...todayEntry, mood };
    handleSaveEntry(updated);
    showToast(`✓ Mood recorded: ${mood.replace('_', ' ')}`);
  };

  const handleAddWater = () => {
    const next = Math.min(16, (todayEntry.waterGlasses || 0) + 1);
    const updated = { ...todayEntry, waterGlasses: next };
    handleSaveEntry(updated);
    showToast(`💧 Logged glass of water (${next}/8)`);
  };

  const handleOpenTimerModal = (title: string, mins: number) => {
    setTimerModalConfig({
      isOpen: true,
      title,
      minutes: mins,
    });
  };

  const handleTimerCompleted = (minutes: number) => {
    const updated = {
      ...todayEntry,
      exerciseMinutes: todayEntry.exerciseMinutes + minutes,
    };
    handleSaveEntry(updated);
    showToast(`✓ Completed & logged ${minutes}m activity`);
  };

  const handleBreathingCompleted = (minutes: number) => {
    const updated = {
      ...todayEntry,
      meditationMinutes: todayEntry.meditationMinutes + minutes,
    };
    handleSaveEntry(updated);
    showToast(`✓ Completed & logged ${minutes}m diaphragmatic breathwork`);
  };

  const handleReloadDemo = () => {
    setProfile(getProfile());
    setTodayEntry(getTodayTrackerEntry());
    setEntries(getTrackerEntries());
    setReport(getReport());
    setIsOnboardingOpen(false);
  };

  // Navigation Items definition
  const NAV_ITEMS: Array<{ id: NavigationSection; label: string; icon: any; badge?: string }> = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'safespace', label: 'SafeSpace 🫂', icon: HeartHandshake, badge: 'Peer Support' },
    { id: 'chat', label: 'AI Companion', icon: MessageSquare, badge: 'Active' },
    { id: 'tracker', label: 'Daily Tracker', icon: Activity },
    { id: 'activities', label: 'Activities Hub', icon: Compass, badge: 'Rest & Play' },
    { id: 'games', label: 'Games & Chill', icon: Gamepad2, badge: '16 Games' },
    { id: 'meditation', label: 'Meditation', icon: Sparkles },
    { id: 'yoga', label: 'Mindful Yoga', icon: Heart },
    { id: 'exercise', label: 'Exercise Library', icon: Activity },
    { id: 'nutrition', label: 'Nutrition & Meals', icon: Salad },
    { id: 'music', label: 'Sound Studio', icon: Music },
    { id: 'report', label: 'Hospital Report', icon: FileText, badge: 'Clinical' },
    { id: 'journal', label: 'Mood Journal', icon: BookOpen },
    { id: 'quiz', label: 'Wellness Quiz', icon: HelpCircle },
    { id: 'professionals', label: 'Doctors & Care', icon: UserCheck },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => setCurrentSection('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs group-hover:bg-teal-700 transition">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                MindCare <span className="text-teal-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-none">
                Mental Wellness & Health Companion
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Breathing quick trigger */}
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 transition"
          >
            <Wind className="h-3.5 w-3.5 text-teal-600" />
            Breathing Orb
          </button>

          {/* ALWAYS VISIBLE SOS EMERGENCY BUTTON */}
          <button
            id="global-sos-header-btn"
            onClick={() => setIsSOSOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition"
            title="Immediate Safety Support & Hotlines"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>🆘 Emergency Support</span>
          </button>

          {/* User Profile avatar pill */}
          <button
            onClick={() => setCurrentSection('settings')}
            className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 pr-3 hover:bg-slate-200 transition text-xs font-bold text-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white text-[11px] font-extrabold">
              {profile?.preferredName?.charAt(0) || profile?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:inline">{profile?.preferredName || profile?.name || 'Alex'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto">
          {/* Navigation links */}
          <nav className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
              Wellness Modules
            </span>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ambient Music Bar in sidebar */}
          <div className="pt-2 border-t border-slate-100">
            <MusicBar />
          </div>

          {/* Clinical Disclaimer in sidebar */}
          <div className="rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-500 border border-slate-200/60 leading-tight">
            MindCare AI provides lifestyle wellness and educational screening metrics. It is not an emergency hospital service.
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    <span className="font-extrabold text-slate-900">MindCare AI</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentSection(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-teal-600 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[9px] font-bold text-teal-800">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsSOSOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="h-4 w-4" /> SOS Emergency Support
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Center Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-12">
          {currentSection === 'home' && (
            <HomeView
              profile={profile}
              todayEntry={todayEntry}
              onUpdateMood={handleUpdateMood}
              onAddWater={handleAddWater}
              onNavigate={(s) => setCurrentSection(s)}
              onOpenBreathingModal={() => setIsBreathingOpen(true)}
              onOpenTimerModal={handleOpenTimerModal}
            />
          )}

          {currentSection === 'safespace' && (
            <SafeSpaceView
              onOpenSOSModal={() => setIsSOSOpen(true)}
              onOpenBreathingModal={() => setIsBreathingOpen(true)}
              onNavigateToJournal={() => setCurrentSection('journal')}
              showToast={showToast}
            />
          )}

          {currentSection === 'chat' && (
            <ChatbotView
              profile={profile}
              todayEntry={todayEntry}
              onNavigate={(s) => setCurrentSection(s)}
              onOpenBreathingModal={() => setIsBreathingOpen(true)}
              onOpenTimerModal={handleOpenTimerModal}
              onOpenSOSModal={() => setIsSOSOpen(true)}
            />
          )}

          {currentSection === 'tracker' && (
            <TrackerView
              todayEntry={todayEntry}
              entries={entries}
              onSaveEntry={handleSaveEntry}
              showToast={showToast}
            />
          )}

          {currentSection === 'nutrition' && (
            <NutritionView profile={profile} showToast={showToast} />
          )}

          {currentSection === 'exercise' && (
            <ExerciseView
              onOpenVideoModal={(ex) => setVideoModalConfig({ isOpen: true, exercise: ex })}
              onOpenTimerModal={handleOpenTimerModal}
              showToast={showToast}
            />
          )}

          {currentSection === 'yoga' && (
            <YogaView onOpenTimerModal={handleOpenTimerModal} showToast={showToast} />
          )}

          {currentSection === 'meditation' && (
            <MeditationView onOpenTimerModal={handleOpenTimerModal} showToast={showToast} />
          )}

          {currentSection === 'music' && <MusicView />}

          {currentSection === 'report' && (
            <ReportView
              report={report}
              profile={profile}
              entries={entries}
              onUpdateReport={(rep) => {
                setReport(rep);
                saveReport(rep);
              }}
              showToast={showToast}
            />
          )}

          {currentSection === 'journal' && <JournalView showToast={showToast} />}

          {currentSection === 'quiz' && <QuizView />}

          {currentSection === 'professionals' && (
            <ProfessionalsView showToast={showToast} />
          )}

          {currentSection === 'reminders' && <RemindersView showToast={showToast} />}

          {currentSection === 'games' && (
            <GamesView
              onSelectGame={(g) => setSelectedGame(g)}
              currentMood={todayEntry.mood}
              currentStress={todayEntry.stress}
            />
          )}

          {currentSection === 'activities' && (
            <ActivitiesView
              onSelectGame={(g) => setSelectedGame(g)}
              onOpenTimerModal={handleOpenTimerModal}
              onOpenBreathingModal={() => setIsBreathingOpen(true)}
              todayEntry={todayEntry}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={(p) => setProfile(p)}
              onReloadDemo={handleReloadDemo}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (Section 106.3) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'home' as NavigationSection, label: 'Home', icon: Home },
          { id: 'safespace' as NavigationSection, label: 'SafeSpace', icon: HeartHandshake },
          { id: 'chat' as NavigationSection, label: 'Chat', icon: MessageSquare },
          { id: 'tracker' as NavigationSection, label: 'Tracker', icon: Activity },
          { id: 'activities' as NavigationSection, label: 'Activities', icon: Compass },
          { id: 'games' as NavigationSection, label: 'Games', icon: Gamepad2 },
          { id: 'report' as NavigationSection, label: 'Report', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentSection(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
                isActive ? 'text-teal-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Interactive Game Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onNavigate={(s) => setCurrentSection(s)}
        onOpenBreathingModal={() => setIsBreathingOpen(true)}
      />

      {/* Floating Bottom Sound Player on Mobile (Positioned above bottom nav) */}
      <div className="md:hidden fixed bottom-14 inset-x-3 z-30">
        <MusicBar />
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 rounded-2xl bg-slate-900/90 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="h-4 w-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Onboarding / Welcome Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onCompleted={(newProf) => {
          setProfile(newProf);
          setIsOnboardingOpen(false);
          showToast('Welcome to MindCare AI!');
        }}
        onExploreDemo={() => {
          initializeDemoData();
          handleReloadDemo();
          showToast('🎓 Loaded College Demo Environment');
        }}
      />

      {/* Universal Reusable Timer Modal */}
      <UniversalTimerModal
        isOpen={timerModalConfig.isOpen}
        title={timerModalConfig.title}
        defaultMinutes={timerModalConfig.minutes}
        onClose={() => setTimerModalConfig({ ...timerModalConfig, isOpen: false })}
        onCompleted={handleTimerCompleted}
      />

      {/* Diaphragmatic Guided Breathing Orb Modal */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        onCompleted={handleBreathingCompleted}
      />

      {/* Exercise Video & Step Guidance Modal */}
      <ExerciseVideoModal
        isOpen={videoModalConfig.isOpen}
        exercise={videoModalConfig.exercise}
        onClose={() => setVideoModalConfig({ isOpen: false, exercise: null })}
        onStartTimer={(mins, name) => handleOpenTimerModal(name, mins)}
      />

      {/* SOS Immediate Help & Crisis Hotlines Modal */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </div>
  );
}
