import React, { useState } from 'react';
import {
  Heart,
  Users,
  Shield,
  ShieldAlert,
  Wind,
  Sparkles,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Smile,
  BookOpen,
} from 'lucide-react';
import { SafeSpaceCommunityPost, SafeSpaceReactionType } from '../types';
import {
  getSafeSpacePosts,
  addSafeSpacePost,
  toggleSafeSpaceReaction,
} from '../utils/safeSpaceStorage';
import { SafeSpaceCommunityWall } from '../components/safespace/SafeSpaceCommunityWall';
import { SafeSpaceSeekerFlow } from '../components/safespace/SafeSpaceSeekerFlow';
import { SafeSpaceListenerFlow } from '../components/safespace/SafeSpaceListenerFlow';

interface SafeSpaceViewProps {
  onOpenSOSModal: () => void;
  onOpenBreathingModal: () => void;
  onNavigateToJournal?: () => void;
  showToast: (msg: string) => void;
}

type ActiveViewMode = 'home' | 'seeker' | 'listener';

export function SafeSpaceView({
  onOpenSOSModal,
  onOpenBreathingModal,
  onNavigateToJournal,
  showToast,
}: SafeSpaceViewProps) {
  const [mode, setMode] = useState<ActiveViewMode>('home');
  const [posts, setPosts] = useState<SafeSpaceCommunityPost[]>(() => getSafeSpacePosts());

  const handleAddPost = (
    authorName: string,
    authorAvatar: string,
    content: string,
    category: 'hope' | 'wins' | 'encouragement' | 'gratitude'
  ) => {
    const updated = addSafeSpacePost(authorName, authorAvatar, content, category);
    setPosts(updated);
  };

  const handleReact = (postId: string, reaction: SafeSpaceReactionType) => {
    const updated = toggleSafeSpaceReaction(postId, reaction);
    setPosts(updated);
  };

  if (mode === 'seeker') {
    return (
      <SafeSpaceSeekerFlow
        onBackToHome={() => setMode('home')}
        onOpenSOSModal={onOpenSOSModal}
        onOpenBreathingModal={onOpenBreathingModal}
        onNavigateToJournal={onNavigateToJournal}
        showToast={showToast}
      />
    );
  }

  if (mode === 'listener') {
    return (
      <SafeSpaceListenerFlow
        onBackToHome={() => setMode('home')}
        onOpenSOSModal={onOpenSOSModal}
        onOpenBreathingModal={onOpenBreathingModal}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* SafeSpace Main Banner & Disclaimer */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
              <span>🫂</span>
              <span>SafeSpace • Peer Support & Listening</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              SafeSpace <span className="text-teal-600">🫂</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
              “You don't have to face everything alone. A place to be heard, not judged.”
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenBreathingModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-teal-200 bg-teal-50/80 text-teal-800 text-xs font-bold hover:bg-teal-100 transition shadow-2xs"
            >
              <Wind className="h-3.5 w-3.5 text-teal-600" />
              <span>Breathing Pause</span>
            </button>

            <button
              onClick={onOpenSOSModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>🆘 24/7 Crisis Help</span>
            </button>
          </div>
        </div>

        {/* Clear Role Disclaimer */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
          <Shield className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-800 font-bold">SafeSpace Principles:</strong>{' '}
            Listeners are here to listen and support, not diagnose or treat. Peer support is non-clinical and 100% anonymous.
            If you are in immediate danger or severe mental distress, please connect with 24/7 crisis hotlines immediately.
          </p>
        </div>
      </div>

      {/* Two Large Premium Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: I Need Someone */}
        <div className="bg-gradient-to-br from-teal-50/70 via-white to-white rounded-3xl p-6 md:p-8 border border-teal-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6 group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition">
              🫂
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                I Need Someone
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Talk anonymously with someone who is ready to listen. Share what feels heavy, process your thoughts freely, and be heard without judgment.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-teal-100">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Choose your gentle anonymous alias</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Confidential, private peer chat session</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Zero judgment or lecturing—just empathetic presence</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMode('seeker')}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs md:text-sm font-extrabold shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Find Someone</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 2: I Can Listen */}
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-white rounded-3xl p-6 md:p-8 border border-blue-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6 group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition">
              💙
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                I Can Listen
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Be there for someone who needs to be heard. Provide emotional warmth, hold a safe space, and make someone’s day feel lighter.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-blue-100">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>5-point active listening code of ethics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Browse incoming requests from anonymous peers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Receive gratitude hearts & track your support impact</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMode('listener')}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs md:text-sm font-extrabold shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Become a Listener</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Community Section: You Are Not Alone */}
      <SafeSpaceCommunityWall
        posts={posts}
        onAddPost={handleAddPost}
        onReact={handleReact}
        showToast={showToast}
      />
    </div>
  );
}
