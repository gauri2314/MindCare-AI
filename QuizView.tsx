import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/initialData';
import { QuizQuestion } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question: QuizQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>🧠</span>
          Evidence-Based Wellness & Science Quiz
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore the physiology of sleep cycles, diaphragmatic breathing, hydration chemistry, and autonomic regulation.
        </p>
      </div>

      {!isFinished ? (
        <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-teal-700">Score: {score}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {question.category}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-1 leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {(question?.options || []).map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              let btnStyle =
                'border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-slate-100';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full rounded-2xl p-4 border text-left text-xs md:text-sm font-medium transition flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="rounded-2xl bg-teal-50/80 p-4 border border-teal-200 animate-in fade-in space-y-1">
              <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-700" />
                The Science Behind It:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedOption === null ? 'Select an answer above' : 'Answer selected'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 disabled:opacity-50 transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Screen */
        <div className="rounded-3xl bg-white p-8 md:p-12 text-center border border-slate-200 shadow-sm space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-xs">
            <Award className="h-9 w-9 text-teal-600" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Quiz Completed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              You Scored {score} / {QUIZ_QUESTIONS.length}!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              {score >= 4
                ? 'Outstanding grasp of holistic physiology, circadian habits, and mindfulness mechanics!'
                : 'Great learning effort! Understanding the neurological foundations of rest and movement helps you build resilient routines.'}
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
