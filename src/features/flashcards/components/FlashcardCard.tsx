import React, { useRef, useState } from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Flashcard, DisplaySide } from '../types';

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  displaySide: DisplaySide;
  onSpeak: (text: string, audioUrl?: string) => void;
  isSpeaking: boolean;
  showOptionsOnFront?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  isFlipped,
  onFlip,
  displaySide,
  onSpeak,
  isSpeaking,
  showOptionsOnFront = true,
  onSwipeLeft,
  onSwipeRight,
}) => {
  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartXRef.current;
    if (Math.abs(diffX) < 120) {
      setSwipeOffset(diffX * 0.4);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartXRef.current;
    const diffY = endY - touchStartYRef.current;

    setSwipeOffset(0);
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(diffX) > 70 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
  };

  const isTermFront = displaySide === 'term_first';
  const frontTitle = isTermFront ? (card.options ? 'Câu hỏi trắc nghiệm' : 'Mặt trước') : 'Đáp án';
  const backTitle = isTermFront ? 'Đáp án đúng & Giải thích' : 'Câu hỏi';

  const handleSpeechClick = (e: React.MouseEvent, text: string, audioUrl?: string) => {
    e.stopPropagation();
    onSpeak(text, audioUrl);
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto cursor-pointer select-none group"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label="Flashcard. Click or press Space to flip."
    >
      <div
        className="relative w-full h-[460px] sm:h-[500px] transition-transform duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateX(${swipeOffset}px) rotateY(${isFlipped ? 180 : 0}deg) ${
            swipeOffset !== 0 ? `rotateZ(${swipeOffset * 0.05}deg)` : ''
          }`,
        }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-[#192923] border border-gray-200/90 dark:border-[#31473c] shadow-xl hover:shadow-2xl transition-shadow flex flex-col justify-between p-6 sm:p-7 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-[#a0b0a8] flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/40">
              <Sparkles className="w-3.5 h-3.5" />
              {card.category || frontTitle}
            </span>

            <button
              type="button"
              onClick={(e) => handleSpeechClick(e, card.term, card.audioUrl)}
              className={`p-2.5 rounded-full border transition-all ${
                isSpeaking && !isFlipped
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-[#21362e] dark:hover:bg-[#2b443b] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#31473c]'
              }`}
              title="Phát âm câu hỏi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center my-3 overflow-y-auto px-1 pr-2 text-left">
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-gray-900 dark:text-gray-100 mb-4">
              {card.term}
            </h2>

            {/* If the card has multiple-choice options */}
            {card.options && showOptionsOnFront && (
              <div className="space-y-2 mt-1">
                {card.options.map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 dark:bg-[#21362e]/70 border border-gray-200/60 dark:border-[#31473c] text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="w-5 h-5 rounded-md bg-white dark:bg-[#192923] border border-gray-300 dark:border-[#3b5448] flex items-center justify-center font-bold text-gray-800 dark:text-gray-100 flex-shrink-0 text-xs">
                      {opt.key}
                    </span>
                    <span className="leading-snug pt-0.5">{opt.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Hint */}
          <div className="text-center pt-2 border-t border-gray-100 dark:border-[#253d34] flex-shrink-0">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Nhấn để xem đáp án đúng (hoặc phím <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#21362e] border border-gray-300 dark:border-[#3b5448] font-mono text-[10px]">Space</kbd>)
            </span>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-[#192923] border border-emerald-300/80 dark:border-emerald-800/60 shadow-xl hover:shadow-2xl transition-shadow flex flex-col justify-between p-6 sm:p-7 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-[#a0b0a8] flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-700/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {backTitle}
            </span>

            <button
              type="button"
              onClick={(e) => handleSpeechClick(e, card.definition, card.audioUrl)}
              className={`p-2.5 rounded-full border transition-all ${
                isSpeaking && isFlipped
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-[#21362e] dark:hover:bg-[#2b443b] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#31473c]'
              }`}
              title="Phát âm đáp án"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center my-3 overflow-y-auto px-1 pr-2 text-left">
            {/* If question has options, highlight the correct one prominently */}
            {card.options && card.correctAnswers ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
                    Đáp án chính xác:
                  </span>
                  {card.options
                    .filter((opt) => card.correctAnswers?.includes(opt.key))
                    .map((opt) => (
                      <div key={opt.key} className="flex items-start gap-2.5 font-bold text-emerald-900 dark:text-emerald-100 text-base sm:text-lg">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm">
                          {opt.key}
                        </span>
                        <span className="leading-snug pt-0.5">{opt.text}</span>
                      </div>
                    ))}
                </div>

                {card.explanation && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="block text-amber-800 dark:text-amber-300 font-semibold mb-1">
                      Ghi chú / Kiến thức mở rộng:
                    </strong>
                    <div className="whitespace-pre-wrap">{card.explanation}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-medium text-gray-800 dark:text-gray-100 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap">
                {card.definition}
              </p>
            )}
          </div>

          {/* Footer Hint */}
          <div className="text-center pt-2 border-t border-gray-100 dark:border-[#253d34] flex-shrink-0">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Nhấn để quay lại câu hỏi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
