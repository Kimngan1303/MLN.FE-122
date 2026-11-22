import React from 'react';
import { StudyStats } from '../types';

interface FlashcardProgressProps {
  stats: StudyStats;
  currentIndex: number;
}

export const FlashcardProgress: React.FC<FlashcardProgressProps> = ({
  stats,
  currentIndex,
}) => {
  const { total } = stats;
  const currentDisplay = total > 0 ? Math.min(currentIndex + 1, total) : 0;
  const progressPercent = total > 0 ? Math.round((currentDisplay / total) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mb-5">
      {/* Top Counters */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2 font-medium">
        <span className="text-gray-500 dark:text-gray-400">
          Tiến độ: <strong className="text-gray-800 dark:text-gray-200">{progressPercent}%</strong>
        </span>

        {/* Current position counter */}
        <div className="font-bold text-gray-700 dark:text-gray-200 text-sm sm:text-base">
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{currentDisplay}</span>
          <span className="text-gray-400 dark:text-gray-500 font-normal"> / {total}</span>
        </div>

        <span className="text-gray-500 dark:text-gray-400">
          Còn lại: <strong className="text-gray-800 dark:text-gray-200">{Math.max(0, total - currentDisplay)}</strong>
        </span>
      </div>

      {/* Smooth Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200/80 dark:bg-[#253d34] rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
