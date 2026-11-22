import React from 'react';
import { X, Sliders, Volume2, Layout, Zap } from 'lucide-react';
import { StudySettings, DisplaySide } from '../types';

interface FlashcardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudySettings;
  onUpdateSettings: (updater: (prev: StudySettings) => StudySettings) => void;
}

export const FlashcardSettingsModal: React.FC<FlashcardSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-[#192923] rounded-3xl border border-gray-200 dark:border-[#31473c] shadow-2xl p-6 text-gray-900 dark:text-gray-100 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2b443b] mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 id="settings-title" className="text-lg font-bold">
              Cài đặt Flashcards
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#21362e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-5">
          {/* 1. Mặt hiển thị trước */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
              Mặt hiển thị trước
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, displaySide: 'term_first' }))
                }
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  settings.displaySide === 'term_first'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-200 dark:border-[#31473c] hover:bg-gray-50 dark:hover:bg-[#21362e]'
                }`}
              >
                Thuật ngữ trước
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, displaySide: 'definition_first' }))
                }
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  settings.displaySide === 'definition_first'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-gray-200 dark:border-[#31473c] hover:bg-gray-50 dark:hover:bg-[#21362e]'
                }`}
              >
                Định nghĩa trước
              </button>
            </div>
          </div>

          {/* 2. Tự động đọc khi lật thẻ */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#21362e] border border-gray-100 dark:border-[#31473c]">
            <div className="pr-4">
              <span className="text-sm font-semibold block text-gray-800 dark:text-gray-100">
                Tự động phát âm thanh khi lật
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Đọc nội dung mặt thẻ ngay khi bạn lật
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoTtsOnFlip}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    autoTtsOnFlip: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* 3. Tốc độ đọc */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Tốc độ đọc giọng nói
            </label>
            <div className="flex gap-2">
              {[0.8, 1.0, 1.2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, speechRate: rate }))}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    settings.speechRate === rate
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-[#31473c] hover:bg-gray-50 dark:hover:bg-[#21362e]'
                  }`}
                >
                  {rate}x {rate === 1.0 ? '(Chuẩn)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2b443b] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Đã xong
          </button>
        </div>
      </div>
    </div>
  );
};
