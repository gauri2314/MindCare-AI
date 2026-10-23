import React, { useState, useRef, useEffect } from 'react';
import {
  UserProfile,
  DailyTrackerEntry,
  NavigationSection,
} from '../types';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Wind,
  Moon,
  Footprints,
  Salad,
  Music,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  featureRecommendation?: {
    action: string;
    title: string;
    duration?: string;
    description?: string;
  } | null;
  imageUrl?: string | null;
  timestamp: string;
  isCrisis?: boolean;
}

interface ChatbotViewProps {
  profile: UserProfile | null;
  todayEntry: DailyTrackerEntry;
  onNavigate: (section: NavigationSection) => void;
  onOpenBreathingModal: () => void;
  onOpenTimerModal: (title: string, mins: number) => void;
  onOpenSOSModal: () => void;
}

const QUICK_PROMPTS = [
  "I'm feeling stressed.",
  "I can't concentrate.",
  "How can I relax?",
  "Give me a breathing exercise.",
  "How can I sleep better?",
  "Suggest a healthy meal.",
  "Which exercise should I try?",
  "I feel overwhelmed.",
  "Recommend a meditation.",
  "Give me motivation.",
];

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  profile,
  todayEntry,
  onNavigate,
  onOpenBreathingModal,
  onOpenTimerModal,
  onOpenSOSModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello ${profile?.preferredName || profile?.name || 'there'}! I'm MindCare AI, your supportive mental wellness companion. How are you feeling today? You can share what's on your mind, ask for breathing exercises, sleep habits, or healthy food ideas.`,
      featureRecommendation: {
        action: 'breathing',
        title: '🌿 4-7-8 Relaxing Breathwork',
        duration: '5 min',
        description: 'Try a gentle 5-minute breathing cycle to center your mind.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          userContext: {
            userName: profile?.name || 'User',
            age: profile?.age || 21,
            bmi: profile?.bmi || 22,
            wellnessGoal: profile?.wellnessGoal || 'Manage everyday stress',
            todayMood: todayEntry.mood || 'Not logged',
            todayStress: todayEntry.stress || 'Not logged',
            waterGlasses: todayEntry.waterGlasses || 0,
            sleepHours: todayEntry.sleepHours || 7,
          },
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I'm here with you. How can we take care of your wellness right now?",
        featureRecommendation: data.featureRecommendation || null,
        imageUrl: data.imageUrl || null,
        isCrisis: data.isSafetyCrisis || false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm listening and right here beside you. If you're feeling tense or overwhelmed, taking three slow, deep breaths or a short walk can help your body decompress.",
          featureRecommendation: {
            action: 'breathing',
            title: '🌿 4-7-8 Calming Breath',
            duration: '5 min',
            description: 'A soothing parasympathetic breathing loop.',
          },
          imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationAction = (action: string) => {
    switch (action) {
      case 'breathing':
        onOpenBreathingModal();
        break;
      case 'meditation':
        onNavigate('meditation');
        break;
      case 'yoga':
        onNavigate('yoga');
        break;
      case 'exercise':
        onNavigate('exercise');
        break;
      case 'nutrition':
        onNavigate('nutrition');
        break;
      case 'music':
        onNavigate('music');
        break;
      case 'journal':
        onNavigate('journal');
        break;
      case 'tracker':
        onNavigate('tracker');
        break;
      case 'sos':
        onOpenSOSModal();
        break;
      default:
        onNavigate('home');
        break;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-110px)] max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">MindCare AI</h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Your friendly wellness companion</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${Date.now()}`,
                sender: 'ai',
                text: "Chat refreshed. What is on your mind right now?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-600 transition"
          title="Clear & Refresh Conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Safety Notice Bar */}
      <div className="bg-teal-50/60 px-4 py-2 border-b border-teal-100/70 text-[11px] text-teal-900 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          General wellness support & screening information only. MindCare AI does not diagnose or prescribe medication.
        </span>
        <button
          onClick={onOpenSOSModal}
          className="shrink-0 text-rose-600 font-bold text-[11px] hover:underline flex items-center gap-1"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          SOS Help
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[75%] space-y-2 rounded-2xl p-4 text-xs leading-relaxed ${
                  isAi
                    ? msg.isCrisis
                      ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                    : 'bg-teal-600 text-white shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap font-sans">{msg.text}</p>

                {/* AI Image Response where relevant */}
                {isAi && msg.imageUrl && (
                  <div className="rounded-xl overflow-hidden mt-2 border border-slate-200/80 shadow-2xs max-h-48 w-full">
                    <img
                      src={msg.imageUrl}
                      alt="Wellness visual"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}

                {/* AI Feature Recommendation Card */}
                {isAi && msg.featureRecommendation && (
                  <div className="mt-3 rounded-xl bg-white p-3 border border-teal-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                        {msg.featureRecommendation.title}
                      </div>
                      {msg.featureRecommendation.duration && (
                        <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                          {msg.featureRecommendation.duration}
                        </span>
                      )}
                    </div>
                    {msg.featureRecommendation.description && (
                      <p className="text-[11px] text-slate-600 mt-1">
                        {msg.featureRecommendation.description}
                      </p>
                    )}
                    <button
                      onClick={() =>
                        handleRecommendationAction(msg.featureRecommendation!.action)
                      }
                      className="mt-2 flex items-center justify-center gap-1 w-full rounded-lg bg-teal-600 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition"
                    >
                      <span>Start Now</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] text-right mt-1 ${
                    isAi ? 'text-slate-400' : 'text-teal-100'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 mt-1">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-slate-500 text-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Reflecting on your wellness...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Suggestions:
          </span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-700 border border-slate-200/80 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask MindCare AI about stress, sleep, breathing, or nutrition..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
