import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Shield,
  ShieldAlert,
  Wind,
  Heart,
  MessageSquare,
  Sparkles,
  Check,
  AlertTriangle,
  LogOut,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import {
  SafeSpaceTopic,
  SafeSpaceChatMessage,
} from '../../types';
import {
  SAFESPACE_TOPICS,
  ANONYMOUS_PERSONAS,
  SEEKER_PROMPT_SUGGESTIONS,
} from '../../data/safeSpaceData';

interface SafeSpaceSeekerFlowProps {
  onBackToHome: () => void;
  onOpenSOSModal: () => void;
  onOpenBreathingModal: () => void;
  onNavigateToJournal?: () => void;
  showToast: (msg: string) => void;
}

type FlowStep = 'topic_select' | 'matching' | 'chatting' | 'feedback';

export function SafeSpaceSeekerFlow({
  onBackToHome,
  onOpenSOSModal,
  onOpenBreathingModal,
  onNavigateToJournal,
  showToast,
}: SafeSpaceSeekerFlowProps) {
  // Step State
  const [step, setStep] = useState<FlowStep>('topic_select');

  // Topic & Persona
  const [selectedTopic, setSelectedTopic] = useState<SafeSpaceTopic>(SAFESPACE_TOPICS[0]);
  const [selectedPersona, setSelectedPersona] = useState(ANONYMOUS_PERSONAS[0]);
  const [customNote, setCustomNote] = useState('');
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<SafeSpaceChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeListener, setActiveListener] = useState({
    name: 'Rowan',
    avatar: '💙',
    title: 'Peer Listener',
    roleTag: 'Compassionate Peer',
  });
  const [hasCrisisAlert, setHasCrisisAlert] = useState(false);

  // Feedback State
  const [emotionalOutcome, setEmotionalOutcome] = useState<'lighter' | 'better' | 'same' | 'heavy' | null>(null);
  const [sentHeart, setSentHeart] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(1);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Scroll to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start matching flow
  const handleStartMatching = () => {
    if (!safetyAcknowledged) {
      showToast('Please confirm the peer listening agreement.');
      return;
    }
    setStep('matching');

    // Simulate 2.5s gentle matching transition
    setTimeout(() => {
      const listenerNames = [
        { name: 'Rowan', avatar: '💙', title: 'Peer Listener' },
        { name: 'Elena', avatar: '🌿', title: 'Empathetic Peer' },
        { name: 'Julian', avatar: '🕊️', title: 'Active Listener' },
        { name: 'Maya', avatar: '🌸', title: 'Supportive Guide' },
      ];
      const picked = listenerNames[Math.floor(Math.random() * listenerNames.length)];
      setActiveListener({
        name: picked.name,
        avatar: picked.avatar,
        title: picked.title,
        roleTag: 'Peer Listener',
      });

      // Initial greeting from the peer listener
      const greeting: SafeSpaceChatMessage = {
        id: `msg-${Date.now()}-1`,
        sender: 'listener',
        senderName: picked.name,
        avatar: picked.avatar,
        content: `Hi there, I'm ${picked.name}. I'm here and ready to listen with zero judgment. Take all the time you need—what's been on your mind regarding ${selectedTopic.title.toLowerCase()}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([greeting]);
      sessionStartTimeRef.current = Date.now();
      setStep('chatting');
      showToast(`Connected with ${picked.name} 💙`);
    }, 2800);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Check crisis in input
    const lower = text.toLowerCase();
    const crisisDetected =
      lower.includes('suicide') ||
      lower.includes('kill myself') ||
      lower.includes('end my life') ||
      lower.includes('hurt myself') ||
      lower.includes('want to die') ||
      lower.includes('hang myself') ||
      lower.includes('overdose');

    if (crisisDetected) {
      setHasCrisisAlert(true);
    }

    const newMsg: SafeSpaceChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'seeker',
      senderName: selectedPersona.name,
      avatar: selectedPersona.avatar,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/safespace/peer-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'listener',
          message: text,
          history: updatedMessages.map((m) => ({ sender: m.senderName, text: m.content })),
          topic: selectedTopic.title,
          feeling: customNote || selectedTopic.badge,
          persona: activeListener.name,
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      if (data.isCrisisAlert) {
        setHasCrisisAlert(true);
      }

      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: SafeSpaceChatMessage = {
          id: `msg-${Date.now()}-reply`,
          sender: 'listener',
          senderName: activeListener.name,
          avatar: activeListener.avatar,
          content: data.reply || "I'm right here listening with you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCrisisAlert: data.isCrisisAlert,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1200);
    } catch (e) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMsg: SafeSpaceChatMessage = {
          id: `msg-${Date.now()}-fallback`,
          sender: 'listener',
          senderName: activeListener.name,
          avatar: activeListener.avatar,
          content: "I hear you. That sounds like a heavy thing to carry, but you don't have to carry it all by yourself right now. I'm right here.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }, 1000);
    }
  };

  // End session
  const handleEndChat = () => {
    const elapsedMins = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 60000));
    setSessionMinutes(elapsedMins);
    setStep('feedback');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={step === 'chatting' ? handleEndChat : onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl shadow-xs transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{step === 'chatting' ? 'End Conversation' : 'Back to SafeSpace Home'}</span>
        </button>

        {/* Emergency button */}
        <button
          onClick={onOpenSOSModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          <span>🆘 Crisis Support (988)</span>
        </button>
      </div>

      {/* STEP 1: TOPIC & ALIAS SELECTION */}
      {step === 'topic_select' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
              <span>🫂</span>
              <span>I Need Someone to Listen</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Connect with an Anonymous Peer Listener
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Talk freely about whatever is on your mind. You will be paired with a trained peer listener who is here to support you without judgment.
            </p>
          </div>

          {/* Topics Grid */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. What feels heavy today?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SAFESPACE_TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-slate-900 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{topic.emoji}</span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold">{topic.title}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-teal-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              2. Anything specific on your mind? (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. 'Feeling numb before exams' or 'Need to process an argument'"
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              maxLength={120}
            />
          </div>

          {/* Choose Anonymous Alias */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
              3. Choose your gentle anonymous alias
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ANONYMOUS_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.name === persona.name;
                return (
                  <button
                    key={persona.name}
                    type="button"
                    onClick={() => setSelectedPersona(persona)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/80 text-teal-900 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{persona.avatar}</span>
                    <span className="truncate">{persona.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety Notice & Acknowledgment */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-extrabold">Peer Listening Safety Agreement</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  SafeSpace connects you with fellow human peers who are here to offer warm emotional presence. 
                  Listeners are <strong>not doctors, therapists, or psychiatrists</strong> and cannot provide medical advice, diagnosis, or clinical treatment.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold cursor-pointer pt-1 border-t border-amber-200/60">
              <input
                type="checkbox"
                checked={safetyAcknowledged}
                onChange={(e) => setSafetyAcknowledged(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>I understand that my listener is a supportive peer, and I agree to treat this space with mutual kindness.</span>
            </label>
          </div>

          {/* Start Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onBackToHome}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleStartMatching}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Find Someone to Listen</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MATCHING SCREEN */}
      {step === 'matching' && (
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-slate-200/80 shadow-xs text-center space-y-6 flex flex-col items-center justify-center min-h-[420px]">
          <div className="relative flex items-center justify-center">
            {/* Breathing pulse rings */}
            <div className="absolute w-32 h-32 rounded-full bg-teal-100/60 animate-ping opacity-60" />
            <div className="absolute w-24 h-24 rounded-full bg-teal-200/40 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl shadow-lg relative z-10">
              🫂
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Holding a Quiet Space for You...
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Matching you with a compassionate peer listener who is ready to listen about{' '}
              <strong className="text-teal-700">{selectedTopic.title}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" />
            <span>Connecting anonymously as “{selectedPersona.name}”</span>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            “Take a slow breath in... and let your shoulders drop.”
          </p>
        </div>
      )}

      {/* STEP 3: ACTIVE PEER CHAT SESSION */}
      {step === 'chatting' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl shadow-xs">
                {activeListener.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{activeListener.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {activeListener.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online & Listening • Topic: {selectedTopic.title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick breath button */}
              <button
                onClick={onOpenBreathingModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition"
                title="Take a quick 1-minute breathing break"
              >
                <Wind className="h-3.5 w-3.5 text-teal-600" />
                <span>Breathwork</span>
              </button>

              {/* End chat */}
              <button
                onClick={handleEndChat}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>End</span>
              </button>
            </div>
          </div>

          {/* Compassionate Crisis Intervention Banner if detected */}
          {hasCrisisAlert && (
            <div className="bg-rose-50 border-b border-rose-200 p-3.5 px-4 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 space-y-1">
                  <p className="font-extrabold">You matter, and immediate support is ready for you right now.</p>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Peer listeners care, but are not equipped for emergency distress. Please connect with free, 24/7 confidential crisis professionals:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-extrabold bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      📞 Call/Text 988 (Lifeline)
                    </span>
                    <span className="font-extrabold bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      💬 Text HOME to 741741
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenSOSModal}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shrink-0"
              >
                Open SOS
              </button>
            </div>
          )}

          {/* Safe Notice Bar */}
          <div className="bg-teal-50/50 border-b border-teal-100/60 px-4 py-1.5 text-[10px] text-teal-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>Anonymous Peer Session • Not medical diagnosis or therapy</span>
            </span>
            <span className="text-slate-400">You are chatting as {selectedPersona.name}</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m) => {
              const isMe = m.sender === 'seeker';
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {m.avatar || '💙'}
                    </div>
                  )}

                  <div className={`max-w-[80%] md:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      <span className="font-bold text-slate-600">{m.senderName}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-xs'
                          : m.isCrisisAlert
                          ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {isMe && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {selectedPersona.avatar}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
                <div className="w-6 h-6 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
                  {activeListener.avatar}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
                </div>
                <span className="text-[11px] text-slate-400 italic">{activeListener.name} is typing...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Reply Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggestions:
            </span>
            {SEEKER_PROMPT_SUGGESTIONS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition shrink-0 truncate max-w-[220px]"
              >
                “{prompt}”
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message with honesty... you are safe here."
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: POST-SESSION REFLECTION & CHECK-IN */}
      {step === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 rounded-3xl bg-teal-50 text-teal-700 flex items-center justify-center text-3xl mx-auto shadow-xs">
            🌱
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Thank You for Sharing Today
            </h2>
            <p className="text-xs text-slate-500">
              Session duration: ~{sessionMinutes} minute{sessionMinutes > 1 ? 's' : ''} with {activeListener.name}
            </p>
          </div>

          {/* Emotional check-in */}
          <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              How does your heart/mind feel right now?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'lighter' as const, label: '✨ Much Lighter', desc: 'Felt good to let it out' },
                { id: 'better' as const, label: '🌱 A Bit Better', desc: 'Felt heard and validated' },
                { id: 'same' as const, label: '⚖️ About the Same', desc: 'Still processing thoughts' },
                { id: 'heavy' as const, label: '🌧️ Still Heavy', desc: 'Might need further support' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setEmotionalOutcome(opt.id);
                    showToast('Thank you for checking in with your feelings.');
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    emotionalOutcome === opt.id
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Send Gratitude Heart */}
          <div className="flex items-center justify-between p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xl">💖</span>
              <div>
                <p className="text-xs font-extrabold text-rose-950">Send an Appreciation Heart</p>
                <p className="text-[10px] text-rose-700">Let {activeListener.name} know their presence helped</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSentHeart(true);
                showToast(`💖 Sent an Appreciation Heart to ${activeListener.name}!`);
              }}
              disabled={sentHeart}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                sentHeart
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xs'
              }`}
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>{sentHeart ? 'Heart Sent!' : 'Send Heart'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            {onNavigateToJournal && (
              <button
                onClick={onNavigateToJournal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Save Note to Mood Journal</span>
              </button>
            )}

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-xs transition"
            >
              Return to SafeSpace Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
