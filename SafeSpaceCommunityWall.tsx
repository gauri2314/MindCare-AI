import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Users,
  Smile,
  Shield,
  Filter,
  Check,
  X,
} from 'lucide-react';
import {
  SafeSpaceCommunityPost,
  SafeSpacePostCategory,
  SafeSpaceReactionType,
} from '../../types';
import { ANONYMOUS_PERSONAS } from '../../data/safeSpaceData';

interface SafeSpaceCommunityWallProps {
  posts: SafeSpaceCommunityPost[];
  onAddPost: (
    authorName: string,
    authorAvatar: string,
    content: string,
    category: 'hope' | 'wins' | 'encouragement' | 'gratitude'
  ) => void;
  onReact: (postId: string, reaction: SafeSpaceReactionType) => void;
  showToast: (msg: string) => void;
}

export function SafeSpaceCommunityWall({
  posts,
  onAddPost,
  onReact,
  showToast,
}: SafeSpaceCommunityWallProps) {
  const [selectedCategory, setSelectedCategory] = useState<SafeSpacePostCategory>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'hope' | 'wins' | 'encouragement' | 'gratitude'>('hope');
  const [selectedPersona, setSelectedPersona] = useState(ANONYMOUS_PERSONAS[0]);

  const categories: Array<{ id: SafeSpacePostCategory; label: string; icon: string }> = [
    { id: 'all', label: 'All Notes', icon: '🌟' },
    { id: 'hope', label: 'Hope & Healing', icon: '🌱' },
    { id: 'wins', label: 'Little Wins', icon: '🏆' },
    { id: 'encouragement', label: 'Daily Encouragement', icon: '💭' },
    { id: 'gratitude', label: 'Gratitude', icon: '🌸' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    if (postContent.trim().length < 5) {
      showToast('Please share a few more kind words.');
      return;
    }

    onAddPost(selectedPersona.name, selectedPersona.avatar, postContent, postCategory);
    setPostContent('');
    setIsComposeOpen(false);
    showToast('✨ Your encouraging note is now on the community wall!');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌎</span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Community: <span className="text-teal-700">“You Are Not Alone”</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Anonymous reflections and gentle reminders left by fellow peers. No followers, no popularity algorithms—only authentic human empathy.
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-xs transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Leave an Encouraging Note</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💌</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Share an Encouraging Note</h3>
                  <p className="text-[11px] text-slate-500">Completely anonymous and gentle</p>
                </div>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Persona Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Pick your anonymous alias
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ANONYMOUS_PERSONAS.slice(0, 4).map((p) => {
                    const isSelected = selectedPersona.name === p.name;
                    return (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setSelectedPersona(p)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold text-left transition ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-base">{p.avatar}</span>
                        <span className="truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Topic Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'hope' as const, label: '🌱 Hope & Healing' },
                    { id: 'wins' as const, label: '🏆 Little Wins' },
                    { id: 'encouragement' as const, label: '💭 Encouragement' },
                    { id: 'gratitude' as const, label: '🌸 Gratitude' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setPostCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        postCategory === c.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Your gentle reflection or words of comfort
                </label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="e.g. 'To whoever is having a tough day: take a deep breath. You survived 100% of your hardest days so far.'"
                  maxLength={300}
                  className="w-full rounded-2xl border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Keep it supportive and kind</span>
                  <span>{postContent.length}/300</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Post Anonymously</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const reactions = post.reactions || { heard: 0, support: 0, keepGoing: 0, notAlone: 0 };
          const userReacted = post.userReacted || [];

          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-lg shadow-xs">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{post.authorName}</span>
                      {post.isPinned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <span className="capitalize text-teal-700 font-semibold">{post.category}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {post.authorBadge || 'Anonymous Peer'}
                </span>
              </div>

              {/* Post Content */}
              <blockquote className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal italic bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                “{post.content}”
              </blockquote>

              {/* Reaction Buttons */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Send anonymous support:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {/* Heard */}
                  <button
                    onClick={() => {
                      onReact(post.id, 'heard');
                      showToast('🫂 You heard this note');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      userReacted.includes('heard')
                        ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs ring-1 ring-teal-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🫂</span>
                    <span>Heard</span>
                    <span className="text-[10px] font-extrabold opacity-75">({reactions.heard})</span>
                  </button>

                  {/* Sending Support */}
                  <button
                    onClick={() => {
                      onReact(post.id, 'support');
                      showToast('💙 Sent heartfelt support');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      userReacted.includes('support')
                        ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>💙</span>
                    <span>Support</span>
                    <span className="text-[10px] font-extrabold opacity-75">({reactions.support})</span>
                  </button>

                  {/* Keep Going */}
                  <button
                    onClick={() => {
                      onReact(post.id, 'keepGoing');
                      showToast('🌱 Encouraged them to keep going');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      userReacted.includes('keepGoing')
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌱</span>
                    <span>Keep Going</span>
                    <span className="text-[10px] font-extrabold opacity-75">({reactions.keepGoing})</span>
                  </button>

                  {/* Not Alone */}
                  <button
                    onClick={() => {
                      onReact(post.id, 'notAlone');
                      showToast('🤍 Reminded them they are not alone');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      userReacted.includes('notAlone')
                        ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-xs ring-1 ring-purple-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🤍</span>
                    <span>Not Alone</span>
                    <span className="text-[10px] font-extrabold opacity-75">({reactions.notAlone})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
