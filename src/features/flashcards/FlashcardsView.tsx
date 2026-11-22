import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Filter,
  Search,
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

interface FlashcardsViewProps {
  customCards?: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ customCards }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('random-20');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Initialize with selected preset or questions
  const getInitialList = (): Flashcard[] => {
    if (customCards && customCards.length > 0) return customCards;
    const preset = FLASHCARD_PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.getCards() : MLN_FLASHCARDS.slice(0, 20);
  };

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
    initialCards: getInitialList(),
  });

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSearchQuery('');
    if (presetId === 'demo-web') {
      resetAll(INITIAL_FLASHCARDS);
      return;
    }
    const preset = FLASHCARD_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      resetAll(preset.getCards());
    }
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
          Tổng hợp 526 câu hỏi từ ngân hàng câu hỏi. Lật thẻ để xem đáp án đúng và giải thích chi tiết.
        </p>
      </div>

      {/* Preset & Search Toolbar */}
      <div className="w-full max-w-2xl mx-auto mb-6 p-3 rounded-2xl bg-white dark:bg-[#192923] border border-gray-200 dark:border-[#31473c] shadow-sm flex flex-col sm:flex-row items-center gap-3">
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

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 w-full sm:w-64">
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

      {/* Main Content Area */}
      {isFinished ? (
        <FlashcardSummary
          stats={stats}
          cards={cards}
          statusMap={statusMap}
          onRestartUnlearned={restartUnlearned}
          onResetAll={() => handlePresetChange(selectedPresetId)}
        />
      ) : cards.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-[#192923] rounded-3xl border border-gray-200 dark:border-[#31473c] shadow-sm max-w-2xl mx-auto">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Không có câu hỏi nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => handlePresetChange('random-20')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Tải 20 câu ngẫu nhiên
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
            onReset={() => handlePresetChange(selectedPresetId)}
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
