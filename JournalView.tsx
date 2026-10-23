import React, { useState } from 'react';
import { JournalEntry, MoodType } from '../types';
import { getJournalEntries, saveJournalEntries } from '../utils/storage';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Calendar,
  Sparkles,
  Tag,
  PenTool,
} from 'lucide-react';

interface JournalViewProps {
  showToast: (msg: string) => void;
}

const JOURNAL_PROMPTS = [
  'What made you feel grateful or proud today?',
  'What was the biggest emotional challenge you faced, and how did you respond?',
  'Where did you feel tension in your body today, and what helped you soften it?',
  'What is one kind thought you can give yourself right now?',
  'Describe a moment of peace or calm from your day.',
];

const MOOD_OPTIONS: Array<{ type: MoodType; emoji: string; label: string }> = [
  { type: 'very_happy', emoji: '😄', label: 'Very Happy' },
  { type: 'happy', emoji: '🙂', label: 'Happy' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'sad', emoji: '🙁', label: 'Sad' },
  { type: 'very_sad', emoji: '😞', label: 'Very Sad' },
];

export const JournalView: React.FC<JournalViewProps> = ({ showToast }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournalEntries());
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('happy');
  const [tags, setTags] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJournalEntries(updated);
    showToast('✓ Journal reflection saved');

    setTitle('');
    setContent('');
    setTags('');
    setShowCompose(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveJournalEntries(updated);
    showToast('Journal entry deleted');
  };

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>📔</span>
            Mindful Mood Journal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Expressive writing to process thoughts, cultivate self-compassion, and untangle daily cognitive noise.
          </p>
        </div>

        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
        >
          <PenTool className="h-4 w-4" />
          {showCompose ? 'Close Composer' : 'Write New Reflection'}
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white p-6 border border-teal-200 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">New Reflection</h3>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navigating midterms with self-kindness"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Associated Mood</label>
              <div className="flex items-center gap-1.5">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => setMood(m.type)}
                    className={`rounded-lg px-2 py-1 text-xs transition ${
                      mood === m.type
                        ? 'bg-teal-100 text-teal-900 font-bold border border-teal-300'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{m.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Your Reflection</label>
              <span className="text-[10px] text-slate-400">Write freely without judgment</span>
            </div>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What thoughts, sensations, or insights are showing up for you today?..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-xs leading-relaxed text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Study, Calm, Family, Sleep"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCompose(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
            >
              Save Journal Entry
            </button>
          </div>
        </form>
      )}

      {/* Writing Prompts Carousel */}
      <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-200/70">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          Reflective Writing Prompts:
        </div>
        <div className="flex flex-wrap gap-2">
          {JOURNAL_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setShowCompose(true);
                setTitle(prompt.slice(0, 35) + '...');
                setContent(prompt + '\n\n');
              }}
              className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 border border-amber-200/70 hover:bg-amber-100/50 hover:border-amber-300 transition text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedMoodFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              selectedMoodFilter === 'all'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.type}
              onClick={() => setSelectedMoodFilter(m.type)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedMoodFilter === m.type
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200 text-slate-400 text-xs">
            No journal entries match your criteria.
          </div>
        ) : (
          filtered.map((entry) => {
            const moodObj = MOOD_OPTIONS.find((m) => m.type === entry.mood);
            return (
              <div
                key={entry.id}
                className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{moodObj?.emoji}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {entry.date}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{entry.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {entry.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 flex items-center gap-1"
                      >
                        <Tag className="h-2.5 w-2.5 text-slate-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
