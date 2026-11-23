import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Filter,
  Search,
  RotateCcw,
  BookmarkCheck,
  Hash,
} from 'lucide-react';
import {
  MLN_FLASHCARDS,
  FLASHCARD_PRESETS,
} from './questionsAdapter';
import { INITIAL_FLASHCARDS } from './mockData';
import { useFlashcards } from './hooks/useFlashcards';
import { FlashcardCard } from './components/FlashcardCard';
import { FlashcardProgress } from './components/FlashcardProgress';
import { FlashcardToolbar } from './components/FlashcardToolbar';
import { FlashcardSummary } from './components/FlashcardSummary';
import { FlashcardSettingsModal } from './components/FlashcardSettingsModal';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { Flashcard } from './types';

const PRESET_STORAGE_KEY = 'mln122_flashcards_active_preset';

interface FlashcardsViewProps {
  customCards?: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ customCards }) => {
  // Restore last selected preset or default to 'all' (526 questions)
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PRESET_STORAGE_KEY);
        if (saved) return saved;
      } catch {}
    }
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [jumpInput, setJumpInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Determine current cards list based on preset
  const getCardsForPreset = (presetId: string): Flashcard[] => {
    if (customCards && customCards.length > 0) return customCards;
    if (presetId === 'demo-web') return INITIAL_FLASHCARDS;
    const preset = FLASHCARD_PRESETS.find((p) => p.id === presetId);
    return preset ? preset.getCards() : MLN_FLASHCARDS;
  };

  const currentCardsList = getCardsForPreset(selectedPresetId);
  const storageKey = `mln122_flashcards_progress_${selectedPresetId}`;

  const {
    cards,
    currentCard,
    currentIndex,
    isFlipped,
    statusMap,
    isFinished,
    isAutoPlaying,
    settings,
    stats,
    isSpeaking,
    toggleFlip,
    goPrevious,
    goNext,
    jumpToCard,
    canGoPrevious,
    canGoNext,
    undo,
    shuffleCards,
    resetAll,
    restartUnlearned,
    setIsAutoPlaying,
    cancelAutoPlay,
    setSettings,
    speakText,
    canUndo,
  } = useFlashcards({
    initialCards: currentCardsList,
    storageKey,
  });

  // Save selected preset whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PRESET_STORAGE_KEY, selectedPresetId);
      } catch {}
    }
  }, [selectedPresetId]);

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSearchQuery('');
    setJumpInput('');
  };

  // Handle Search in Question Bank
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handlePresetChange(selectedPresetId);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const matched = MLN_FLASHCARDS.filter(
      (c) =>
        c.term.toLowerCase().includes(query) ||
        c.definition.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query)
    );
    if (matched.length > 0) {
      resetAll(matched);
    } else {
      alert(`Không tìm thấy câu hỏi nào chứa từ khóa "${searchQuery}"`);
    }
  };

  // Jump to specific card by number
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= cards.length) {
      jumpToCard(num - 1);
      setJumpInput('');
    } else {
      alert(`Vui lòng nhập số câu từ 1 đến ${cards.length}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8">
      {/* Header & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-800/40 mb-2.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kinh tế chính trị Mác – Lênin (MLN122)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1.5">
          Thẻ Ghi Nhớ Câu Hỏi Trắc Nghiệm
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Tự động ghi nhớ vị trí câu đang học. Khi mở lại trang, bạn sẽ tiếp tục đúng câu trước đó.
        </p>
      </div>

      {/* Preset, Search & Jump Toolbar */}
      <div className="w-full max-w-2xl mx-auto mb-4 p-3 rounded-2xl bg-white dark:bg-[#192923] border border-gray-200 dark:border-[#31473c] shadow-sm flex flex-col sm:flex-row items-center gap-3">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Filter className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <select
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-gray-200 dark:border-[#31473c] bg-gray-50 dark:bg-[#21362e] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {FLASHCARD_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.count} câu)
              </option>
            ))}
            <option value="demo-web">Thẻ mẫu: Lập trình Web (8 thẻ)</option>
          </select>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 w-full sm:w-56">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 pl-7 pr-3 rounded-xl border border-gray-200 dark:border-[#31473c] bg-gray-50 dark:bg-[#21362e] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
          >
            Lọc
          </button>
        </form>
      </div>

      {/* Persistence Status & Quick Jump Bar */}
      <div className="w-full max-w-2xl mx-auto mb-5 px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            Đang học: <strong>Câu {currentIndex + 1}</strong> / {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick jump input */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-emerald-600" />
            <input
              type="number"
              min={1}
              max={cards.length}
              placeholder="Đến câu..."
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-16 px-1.5 py-0.5 text-xs rounded-md border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#192923] text-gray-800 dark:text-gray-100 focus:outline-none text-center"
            />
          </form>

          {/* Reset to first card if not already at 0 */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={() => jumpToCard(0)}
              className="text-[11px] font-semibold underline hover:text-emerald-900 dark:hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
              title="Quay lại câu đầu tiên của bộ thẻ này"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Về câu 1</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isFinished ? (
        <FlashcardSummary
          stats={stats}
          cards={cards}
          statusMap={statusMap}
          onRestartUnlearned={restartUnlearned}
          onResetAll={() => jumpToCard(0)}
        />
      ) : cards.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#192923] rounded-3xl border border-gray-200 dark:border-[#31473c] shadow-sm max-w-2xl mx-auto">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Không có câu hỏi nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => handlePresetChange('all')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Tải lại toàn bộ câu hỏi
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Progress Bar & Counters */}
          <FlashcardProgress stats={stats} currentIndex={currentIndex} />

          {/* Flashcard Component */}
          {currentCard && (
            <FlashcardCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={toggleFlip}
              displaySide={settings.displaySide}
              onSpeak={speakText}
              isSpeaking={isSpeaking}
              showOptionsOnFront={true}
              onSwipeLeft={goNext}
              onSwipeRight={goPrevious}
            />
          )}

          {/* Big Navigation Buttons: Quay lại & Đi tiếp */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mt-6">
            {/* Quay lại Button */}
            <button
              type="button"
              onClick={goPrevious}
              disabled={!canGoPrevious}
              className="group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white dark:bg-[#192923] border-2 border-gray-200 dark:border-[#31473c] hover:bg-gray-50 dark:hover:bg-[#21362e] disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              title="Quay lại câu trước (Phím ←)"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#21362e] flex items-center justify-center group-hover:-translate-x-0.5 transition-transform text-gray-700 dark:text-gray-200">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-none">Quay lại</span>
                <span className="text-[10px] font-mono text-gray-400 font-normal hidden sm:inline">
                  [Phím ←]
                </span>
              </div>
            </button>

            {/* Đi tiếp Button */}
            <button
              type="button"
              onClick={goNext}
              className="group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              title={canGoNext ? 'Đi tiếp câu sau (Phím →)' : 'Hoàn thành bộ thẻ'}
            >
              <div className="text-right">
                <span className="block leading-none">
                  {canGoNext ? 'Đi tiếp' : 'Hoàn thành'}
                </span>
                <span className="text-[10px] font-mono text-emerald-200 font-normal hidden sm:inline">
                  [Phím →]
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/50 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>

          {/* Controls Toolbar: Undo, Shuffle, Auto-play, Settings */}
          <FlashcardToolbar
            canUndo={canUndo}
            onUndo={undo}
            onShuffle={shuffleCards}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={() => {
              if (isAutoPlaying) {
                cancelAutoPlay();
              } else {
                setIsAutoPlaying(true);
              }
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onReset={() => jumpToCard(0)}
          />
        </div>
      )}

      {/* Settings Modal */}
      <FlashcardSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default FlashcardsView;
