import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Shield,
  ShieldAlert,
  Heart,
  Users,
  Check,
  Award,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Wind,
  LogOut,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  SafeSpacePeerRequest,
  SafeSpaceListenerProfile,
  SafeSpaceChatMessage,
} from '../../types';
import {
  LISTENER_PLEDGE_POINTS,
  LISTENER_PROMPT_SUGGESTIONS,
} from '../../data/safeSpaceData';
import {
  getSafeSpaceListenerProfile,
  saveSafeSpaceListenerProfile,
  recordCompletedListenerSession,
  getSafeSpaceRequests,
  removeSafeSpaceRequest,
} from '../../utils/safeSpaceStorage';

interface SafeSpaceListenerFlowProps {
  onBackToHome: () => void;
  onOpenSOSModal: () => void;
  onOpenBreathingModal: () => void;
  showToast: (msg: string) => void;
}

type ListenerStep = 'pledge' | 'queue' | 'chatting' | 'complete';

export function SafeSpaceListenerFlow({
  onBackToHome,
  onOpenSOSModal,
  onOpenBreathingModal,
  showToast,
}: SafeSpaceListenerFlowProps) {
  const [profile, setProfile] = useState<SafeSpaceListenerProfile>(() => getSafeSpaceListenerProfile());
  const [step, setStep] = useState<ListenerStep>(() => (profile.listenerPledgeAccepted ? 'queue' : 'pledge'));

  // Requests queue
  const [requests, setRequests] = useState<SafeSpacePeerRequest[]>(() => getSafeSpaceRequests());
  const [activeRequest, setActiveRequest] = useState<SafeSpacePeerRequest | null>(null);

  // Guidelines drawer
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<SafeSpaceChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasCrisisAlert, setHasCrisisAlert] = useState(false);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const [sessionMinutes, setSessionMinutes] = useState(1);

  // Scroll to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Pledge Acceptance
  const handleAcceptPledge = () => {
    const updated = { ...profile, listenerPledgeAccepted: true };
    setProfile(updated);
    saveSafeSpaceListenerProfile(updated);
    setStep('queue');
    showToast('💙 Thank you for committing to empathetic peer support.');
  };

  // Toggle availability
  const handleToggleAvailability = () => {
    const updated = { ...profile, isAvailable: !profile.isAvailable };
    setProfile(updated);
    saveSafeSpaceListenerProfile(updated);
    showToast(updated.isAvailable ? '🟢 You are now marked as Available to Listen' : '⚪ Marked as Away');
  };

  // Accept a seeker request
  const handleConnectWithSeeker = (req: SafeSpacePeerRequest) => {
    setActiveRequest(req);
    // Remove from queue
    const updatedReqs = removeSafeSpaceRequest(req.id);
    setRequests(updatedReqs);

    // Initial message from the seeker
    const initialSeekerMsg: SafeSpaceChatMessage = {
      id: `msg-${Date.now()}-seeker`,
      sender: 'seeker',
      senderName: req.seekerName,
      avatar: req.seekerAvatar,
      content: `Hello... thank you so much for taking time to connect with me. ${req.notes}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialSeekerMsg]);
    sessionStartTimeRef.current = Date.now();
    setStep('chatting');
    showToast(`Connected with ${req.seekerName}`);
  };

  // Send message as Listener
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeRequest) return;

    const newMsg: SafeSpaceChatMessage = {
      id: `msg-${Date.now()}-listener`,
      sender: 'listener',
      senderName: 'You (Peer Listener)',
      avatar: '💙',
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
          role: 'seeker',
          message: text,
          history: updatedMessages.map((m) => ({ sender: m.senderName, text: m.content })),
          topic: activeRequest.topicTitle,
          feeling: activeRequest.feeling,
          persona: activeRequest.seekerName,
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
          sender: 'seeker',
          senderName: activeRequest.seekerName,
          avatar: activeRequest.seekerAvatar,
          content: data.reply || "Thank you for listening. It helps a lot just knowing someone is there.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCrisisAlert: data.isCrisisAlert,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1400);
    } catch (e) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMsg: SafeSpaceChatMessage = {
          id: `msg-${Date.now()}-fallback`,
          sender: 'seeker',
          senderName: activeRequest.seekerName,
          avatar: activeRequest.seekerAvatar,
          content: "Thank you for being so patient with me. Just having a quiet space to type this out makes my chest feel a little less tight.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }, 1000);
    }
  };

  // End session
  const handleEndSession = () => {
    const elapsedMins = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 60000));
    setSessionMinutes(elapsedMins);
    const updatedProfile = recordCompletedListenerSession(elapsedMins, 1);
    setProfile(updatedProfile);
    setStep('complete');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={step === 'chatting' ? handleEndSession : onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl shadow-xs transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{step === 'chatting' ? 'End Session with Care' : 'Back to SafeSpace Home'}</span>
        </button>

        <button
          onClick={onOpenSOSModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          <span>🆘 Crisis Support (988)</span>
        </button>
      </div>

      {/* STEP 1: LISTENER PLEDGE */}
      {step === 'pledge' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
              <span>💙</span>
              <span>Become a Peer Listener</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              The Peer Listener Commitment
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Before taking your first session, please review and accept the core principles of empathetic peer listening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LISTENER_PLEDGE_POINTS.map((pt, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{pt.icon}</span>
                  <h3 className="text-xs font-extrabold text-slate-900">{pt.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{pt.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold">Important Legal & Medical Disclaimer</p>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Listeners are <strong>never</strong> presented as therapists, doctors, psychiatrists, or medical professionals. 
                Listeners are here to listen and support, not diagnose or treat.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onBackToHome}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Maybe Later
            </button>
            <button
              onClick={handleAcceptPledge}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>I Agree & Commit to Listen</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LISTENER QUEUE & HUB */}
      {step === 'queue' && (
        <div className="space-y-6">
          {/* Listener Stats Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl border border-blue-200 shadow-xs">
                💙
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">Peer Listener Dashboard</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {profile.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Ready to offer a non-judgmental ear to someone in need today.
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAvailability}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold border transition flex items-center gap-2 shadow-xs ${
                  profile.isAvailable
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    profile.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{profile.isAvailable ? 'Available to Listen' : 'Status: Away'}</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
              <span className="text-xl">🫂</span>
              <div className="text-xl font-extrabold text-slate-900">{profile.peopleSupportedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">People Supported</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
              <span className="text-xl">⏱️</span>
              <div className="text-xl font-extrabold text-slate-900">{profile.totalListenedMinutes}m</div>
              <div className="text-[11px] text-slate-400 font-medium">Minutes Listened</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
              <span className="text-xl">💖</span>
              <div className="text-xl font-extrabold text-slate-900">{profile.appreciationHearts}</div>
              <div className="text-[11px] text-slate-400 font-medium">Gratitude Hearts</div>
            </div>
          </div>

          {/* Guidelines Collapsible Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
              className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-extrabold text-slate-800">
                  Active Listening Quick Guide & Empathetic Phrases
                </span>
              </div>
              {isGuidelinesOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {isGuidelinesOpen && (
              <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Remember: You do not have to fix their problems or give solutions. Simply hearing them, mirroring their emotion, and holding a warm presence is the most healing gift.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {LISTENER_PROMPT_SUGGESTIONS.map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 shadow-2xs font-medium"
                    >
                      “{s}”
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Incoming Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Live Seeker Queue ({requests.length})
                </h3>
                <p className="text-xs text-slate-500">
                  People currently seeking a gentle, non-judgmental ear
                </p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Live & Anonymous
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-2">
                <span className="text-3xl">🌿</span>
                <p className="text-sm font-bold text-slate-800">All seekers are currently being supported</p>
                <p className="text-xs text-slate-400">
                  Stay tuned! New anonymous requests appear as peers reach out.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{req.seekerAvatar}</span>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900">{req.seekerName}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>Waiting ~{req.waitTimeMinutes}m</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {req.topicEmoji} {req.topicTitle}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Feeling: <span className="text-teal-700">{req.feeling}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 italic leading-relaxed">
                        “{req.notes}”
                      </p>
                    </div>

                    <button
                      onClick={() => handleConnectWithSeeker(req)}
                      className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                      <span>Connect & Listen</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: ACTIVE LISTENING SESSION */}
      {step === 'chatting' && activeRequest && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl shadow-xs">
                {activeRequest.seekerAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{activeRequest.seekerName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeRequest.topicEmoji} {activeRequest.topicTitle}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  You are supporting as a Peer Listener
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenBreathingModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition"
              >
                <Wind className="h-3.5 w-3.5 text-teal-600" />
                <span>Breathwork</span>
              </button>

              <button
                onClick={handleEndSession}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>End</span>
              </button>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="bg-blue-50/50 border-b border-blue-100/60 px-4 py-1.5 text-[10px] text-blue-900 flex items-center justify-between">
            <span>🛡️ Listen with empathy • Do not diagnose or prescribe treatment</span>
            <span className="text-slate-400">Feeling: {activeRequest.feeling}</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m) => {
              const isListener = m.sender === 'listener';
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2.5 ${isListener ? 'justify-end' : 'justify-start'}`}
                >
                  {!isListener && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {m.avatar || activeRequest.seekerAvatar}
                    </div>
                  )}

                  <div className={`max-w-[80%] md:max-w-[70%] space-y-1 ${isListener ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      <span className="font-bold text-slate-600">{m.senderName}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xs ${
                        isListener
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {isListener && (
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                      💙
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
                <div className="w-6 h-6 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs">
                  {activeRequest.seekerAvatar}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
                </div>
                <span className="text-[11px] text-slate-400 italic">{activeRequest.seekerName} is typing...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Supportive Phrases for Listener */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Tap to use:
            </span>
            {LISTENER_PROMPT_SUGGESTIONS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-medium transition shrink-0 truncate max-w-[220px]"
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
              placeholder="Send an empathetic, non-judgmental response..."
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: SESSION COMPLETE */}
      {step === 'complete' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto shadow-xs border border-blue-200">
            💙
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Thank You for Being Someone’s Safe Harbour
            </h2>
            <p className="text-xs text-slate-500">
              You held space for ~{sessionMinutes} minute{sessionMinutes > 1 ? 's' : ''} and earned an Appreciation Heart 💖.
            </p>
          </div>

          {/* Decompression advice for listener */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span>Listener Self-Care Check</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Holding space for others takes emotional energy. Drink a glass of water, stretch your neck, and take a couple of slow breaths before your next activity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBreathingModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition flex items-center justify-center gap-2"
            >
              <Wind className="h-4 w-4" />
              <span>2-Min Reset Breathwork</span>
            </button>

            <button
              onClick={() => setStep('queue')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-xs transition"
            >
              Back to Listener Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
