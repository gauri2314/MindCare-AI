import React, { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audio';
import { RotateCcw } from 'lucide-react';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['🌸', '🌿', '☀️', '💧', '🌙', '🏔️', '🕊️', '🪨'];

interface MemoryGameProps {
  isMuted: boolean;
  isPaused: boolean;
  onComplete?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ isMuted, isPaused, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    setIsWon(false);
    setMoves(0);
    setFlippedIndices([]);

    // 6 pairs = 12 cards
    const deckSymbols = SYMBOLS.slice(0, 6);
    const combined = [...deckSymbols, ...deckSymbols];
    const shuffled = combined
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: idx,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isPaused || isWon) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    if (!isMuted) audioManager.playPop(0.25);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (newCards[first].symbol === newCards[second].symbol) {
        // Match!
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        if (!isMuted) audioManager.playChimeNote(660, 'sine', 0.8, 0.3);

        // Check if all matched
        if (newCards.every((c) => c.isMatched)) {
          setIsWon(true);
          if (!isMuted) audioManager.playSuccessChime(0.4);
          onComplete?.();
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isFlipped = false;
            updated[second].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-sm">🧠</span>
          <span className="text-xs font-bold text-slate-700">
            Moves: <span className="text-teal-600 font-extrabold">{moves}</span>
          </span>
        </div>

        <button
          onClick={initGame}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full aspect-4/3 max-w-[380px]">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xs transition-all duration-300 transform active:scale-95 border ${
              card.isFlipped || card.isMatched
                ? 'bg-white border-teal-300 shadow-md rotate-0'
                : 'bg-linear-to-br from-teal-500 to-teal-700 border-teal-600 text-teal-100'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.symbol : '✨'}
          </button>
        ))}
      </div>

      {/* Won Message */}
      {isWon && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center text-teal-900 w-full animate-in fade-in zoom-in-95">
          <span className="text-3xl">🎉 🌿</span>
          <h4 className="font-extrabold text-sm mt-1">Peaceful Memory Mastered!</h4>
          <p className="text-xs text-teal-700 mt-0.5">
            You matched all peaceful pairs in {moves} moves.
          </p>
        </div>
      )}
    </div>
  );
};
