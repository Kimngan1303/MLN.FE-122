import React from 'react';
import { X, Keyboard, Smartphone } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space / ↑ / ↓', action: 'Lật thẻ 3D (Xem câu hỏi / đáp án)' },
    { key: '← (Mũi tên Trái)', action: 'Quay lại câu trước' },
    { key: '→ (Mũi tên Phải)', action: 'Đi tiếp câu sau' },
    { key: 'Ctrl + Z / ⌘ + Z', action: 'Hoàn tác (Undo)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#192923] rounded-3xl border border-gray-200 dark:border-[#31473c] shadow-2xl p-6 text-gray-900 dark:text-gray-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2b443b] mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold">Phím tắt & Cử chỉ</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#21362e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Bàn phím Desktop
          </span>
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#21362e] border border-gray-100 dark:border-[#31473c]"
            >
              <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">
                {item.action}
              </span>
              <kbd className="px-2 py-1 rounded bg-white dark:bg-[#192923] border border-gray-200 dark:border-[#3b5448] shadow-xs text-xs font-mono font-bold text-gray-800 dark:text-gray-100">
                {item.key}
              </kbd>
            </div>
          ))}

          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block pt-2">
            Cảm ứng Mobile
          </span>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#21362e] border border-gray-100 dark:border-[#31473c]">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">
                Vuốt Trái: Đi tiếp | Vuốt Phải: Quay lại
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2b443b] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
