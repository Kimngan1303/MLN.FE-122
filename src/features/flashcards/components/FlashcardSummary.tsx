import React from 'react';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Flashcard, CardStatus, StudyStats } from '../types';

interface FlashcardSummaryProps {
  stats: StudyStats;
  cards: Flashcard[];
  statusMap: Record<string | number, CardStatus>;
  onRestartUnlearned: () => void;
  onResetAll: () => void;
}

export const FlashcardSummary: React.FC<FlashcardSummaryProps> = ({
  stats,
  cards,
  statusMap,
  onRestartUnlearned,
  onResetAll,
}) => {
  const { total, knownCount, learningCount } = stats;
  const masteryPercentage = total > 0 ? Math.round((knownCount / total) * 100) : 0;

  const hasUnlearned = learningCount > 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#192923] rounded-3xl border border-gray-200 dark:border-[#31473c] shadow-2xl p-6 sm:p-10 text-center animate-fade-in">
      {/* Icon Badge */}
      <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
        {masteryPercentage >= 80 ? (
          <Trophy className="w-10 h-10 animate-bounce" />
        ) : (
          <Sparkles className="w-10 h-10" />
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        {masteryPercentage === 100
          ? 'Tuyệt vời! Bạn đã thuộc toàn bộ thẻ!'
          : masteryPercentage >= 70
          ? 'Rất tốt! Bạn đang tiến bộ vượt bậc'
          : 'Hoàn thành vòng học! Hãy tiếp tục rèn luyện'}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
        Bạn đã hoàn thành 1 vòng ôn tập. Hãy xem lại kết quả và tập trung vào các thẻ cần củng cố thêm.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#21362e] border border-gray-200/60 dark:border-[#31473c]">
          <span className="block text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">
            {masteryPercentage}%
          </span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Độ thành thạo
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
            {knownCount}
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Đã thuộc
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
          <span className="block text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mb-1">
            {learningCount}
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Đang học
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
        {hasUnlearned && (
          <button
            type="button"
            onClick={onRestartUnlearned}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Học lại {learningCount} thẻ chưa thuộc</span>
          </button>
        )}

        <button
          type="button"
          onClick={onResetAll}
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            hasUnlearned
              ? 'border border-gray-300 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e]'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Học lại từ đầu ({total} thẻ)</span>
        </button>
      </div>

      {/* Breakdown list preview */}
      <div className="text-left border-t border-gray-100 dark:border-[#2b443b] pt-6">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Danh sách thẻ trong vòng này</span>
        </h3>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {cards.map((card) => {
            const status = statusMap[card.id];
            const isKnown = status === 'known';
            return (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#21362e] border border-gray-100 dark:border-[#31473c] text-xs"
              >
                <div className="flex-1 pr-3">
                  <strong className="text-gray-900 dark:text-gray-100 block mb-0.5">
                    {card.term}
                  </strong>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-1">
                    {card.definition}
                  </p>
                </div>
                <div>
                  {isKnown ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã thuộc
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Đang học
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
