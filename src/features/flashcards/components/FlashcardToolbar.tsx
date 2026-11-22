import React from 'react';
import {
  Undo2,
  Shuffle,
  Play,
  Pause,
  Settings as SettingsIcon,
  Keyboard,
  RotateCcw,
} from 'lucide-react';

interface FlashcardToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  onShuffle: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onReset: () => void;
}

export const FlashcardToolbar: React.FC<FlashcardToolbarProps> = ({
  canUndo,
  onUndo,
  onShuffle,
  isAutoPlaying,
  onToggleAutoPlay,
  onOpenSettings,
  onOpenShortcuts,
  onReset,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 mt-4 px-2">
      {/* Left controls: Undo & Reset */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Quay lại thẻ trước (Undo - Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e] transition-all shadow-sm"
          title="Bắt đầu lại bộ thẻ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Middle controls: Auto-play & Shuffle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShuffle}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e] transition-all shadow-sm text-xs font-semibold"
          title="Trộn ngẫu nhiên thứ tự thẻ"
        >
          <Shuffle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Trộn thẻ</span>
        </button>

        <button
          type="button"
          onClick={onToggleAutoPlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
            isAutoPlaying
              ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white animate-pulse'
              : 'bg-white dark:bg-[#192923] border-gray-200 dark:border-[#31473c] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e]'
          }`}
          title={isAutoPlaying ? 'Tạm dừng tự động học' : 'Bắt đầu tự động học (Auto-play)'}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Tự động phát</span>
            </>
          )}
        </button>
      </div>

      {/* Right controls: Keyboard hints & Settings */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e] transition-all shadow-sm"
          title="Danh sách phím tắt"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-[#31473c] bg-white dark:bg-[#192923] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#21362e] transition-all shadow-sm"
          title="Cài đặt hiển thị & âm thanh"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
