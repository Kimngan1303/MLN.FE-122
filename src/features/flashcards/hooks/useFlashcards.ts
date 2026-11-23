import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Flashcard,
  CardStatus,
  HistoryItem,
  StudySettings,
  StudyStats,
} from '../types';
import { useSpeech } from './useSpeech';

interface UseFlashcardsProps {
  initialCards: Flashcard[];
  storageKey?: string;
}

export function useFlashcards({ initialCards, storageKey }: UseFlashcardsProps) {
  // Helper to read initial progress from localStorage
  const getStoredState = useCallback(() => {
    if (typeof window === 'undefined' || !storageKey) {
      return { index: 0, statusMap: {} as Record<string | number, CardStatus> };
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return { index: 0, statusMap: {} };
      const parsed = JSON.parse(raw);
      let index = 0;
      if (
        typeof parsed.currentIndex === 'number' &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < initialCards.length
      ) {
        index = parsed.currentIndex;
      }
      // If cardId is stored, try to match by cardId for precision
      if (parsed.cardId) {
        const found = initialCards.findIndex((c) => c.id === parsed.cardId);
        if (found !== -1) {
          index = found;
        }
      }
      return {
        index,
        statusMap: parsed.statusMap || {},
      };
    } catch {
      return { index: 0, statusMap: {} };
    }
  }, [storageKey, initialCards]);

  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(() => getStoredState().index);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string | number, CardStatus>>(
    () => getStoredState().statusMap
  );
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Synchronize when initialCards or storageKey change
  useEffect(() => {
    setCards(initialCards);
    const restored = getStoredState();
    setCurrentIndex(restored.index);
    setStatusMap(restored.statusMap);
    setIsFlipped(false);
    setIsFinished(false);
  }, [initialCards, storageKey, getStoredState]);

  // Persist progress to localStorage whenever currentIndex or statusMap updates
  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey || cards.length === 0) return;
    try {
      const current = cards[currentIndex];
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentIndex,
          cardId: current?.id,
          statusMap,
          updatedAt: Date.now(),
        })
      );
    } catch {}
  }, [currentIndex, cards, statusMap, storageKey]);

  const [settings, setSettings] = useState<StudySettings>({
    displaySide: 'term_first',
    autoTtsOnFlip: false,
    speechRate: 1.0,
    speechVoiceLang: 'auto',
  });

  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard: Flashcard | undefined = cards[currentIndex];

  // Calculate statistics
  const stats: StudyStats = {
    total: cards.length,
    knownCount: cards.filter((c) => statusMap[c.id] === 'known').length,
    learningCount: cards.filter((c) => statusMap[c.id] === 'learning').length,
    unseenCount: cards.filter((c) => !statusMap[c.id] || statusMap[c.id] === 'unseen').length,
    progressPercent: cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0,
  };

  // Flip card
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (settings.autoTtsOnFlip && currentCard) {
        const textToRead = next
          ? (settings.displaySide === 'term_first' ? currentCard.definition : currentCard.term)
          : (settings.displaySide === 'term_first' ? currentCard.term : currentCard.definition);
        speak(textToRead, undefined, { rate: settings.speechRate, lang: settings.speechVoiceLang });
      }
      return next;
    });
  }, [settings, currentCard, speak]);

  // Read current side speech
  const readCurrentSide = useCallback(() => {
    if (!currentCard) return;
    const isShowingTerm = settings.displaySide === 'term_first' ? !isFlipped : isFlipped;
    const textToSpeak = isShowingTerm ? currentCard.term : currentCard.definition;
    const audioUrl = isShowingTerm ? currentCard.audioUrl : undefined;

    speak(textToSpeak, audioUrl, {
      rate: settings.speechRate,
      lang: settings.speechVoiceLang,
    });
  }, [currentCard, isFlipped, settings, speak]);

  // Read specific text
  const speakText = useCallback(
    (text: string, audioUrl?: string) => {
      speak(text, audioUrl, {
        rate: settings.speechRate,
        lang: settings.speechVoiceLang,
      });
    },
    [speak, settings]
  );

  // Stop auto-play helper
  const cancelAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    stopSpeech();
    setIsAutoPlaying(false);
  }, [stopSpeech]);

  // Navigate to previous card
  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      stopSpeech();
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, stopSpeech]);

  // Navigate to next card
  const goNext = useCallback(() => {
    stopSpeech();
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      cancelAutoPlay();
    }
  }, [currentIndex, cards.length, stopSpeech, cancelAutoPlay]);

  // Jump to specific card index
  const jumpToCard = useCallback(
    (targetIndex: number) => {
      if (targetIndex >= 0 && targetIndex < cards.length) {
        stopSpeech();
        setIsFlipped(false);
        setIsFinished(false);
        setCurrentIndex(targetIndex);
      }
    },
    [cards.length, stopSpeech]
  );

  // Mark card as Known or Learning
  const rateCard = useCallback(
    (decision: 'known' | 'learning') => {
      if (!currentCard) return;

      stopSpeech();

      // Record history for Undo
      setHistory((prev) => [
        ...prev,
        {
          cardIndex: currentIndex,
          previousStatus: statusMap[currentCard.id] || 'unseen',
          cardId: currentCard.id,
        },
      ]);

      // Update status
      setStatusMap((prev) => ({
        ...prev,
        [currentCard.id]: decision,
      }));

      // Move to next card or finish
      if (currentIndex + 1 < cards.length) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        cancelAutoPlay();
      }
    },
    [currentCard, currentIndex, cards.length, statusMap, stopSpeech, cancelAutoPlay]
  );

  // Undo last action
  const undo = useCallback(() => {
    if (history.length === 0) return;

    cancelAutoPlay();
    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    // Restore previous status
    setStatusMap((prev) => {
      const next = { ...prev };
      if (lastAction.previousStatus === 'unseen') {
        delete next[lastAction.cardId];
      } else {
        next[lastAction.cardId] = lastAction.previousStatus;
      }
      return next;
    });

    setIsFinished(false);
    setIsFlipped(false);
    setCurrentIndex(lastAction.cardIndex);
  }, [history, cancelAutoPlay]);

  // Shuffle cards (Fisher-Yates)
  const shuffleCards = useCallback(() => {
    cancelAutoPlay();
    setCards((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
    setHistory([]);
  }, [cancelAutoPlay]);

  // Reset to beginning
  const resetAll = useCallback(
    (newCardsList?: Flashcard[]) => {
      cancelAutoPlay();
      if (newCardsList) {
        setCards(newCardsList);
      }
      setCurrentIndex(0);
      setIsFlipped(false);
      setStatusMap({});
      setHistory([]);
      setIsFinished(false);

      if (typeof window !== 'undefined' && storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch {}
      }
    },
    [cancelAutoPlay, storageKey]
  );

  // Review only cards that were marked as 'learning'
  const restartUnlearned = useCallback(() => {
    cancelAutoPlay();
    const unlearnedCards = cards.filter((c) => statusMap[c.id] === 'learning');
    if (unlearnedCards.length === 0) {
      resetAll();
      return;
    }
    setCards(unlearnedCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatusMap({});
    setHistory([]);
    setIsFinished(false);
  }, [cards, statusMap, cancelAutoPlay, resetAll]);

  // Auto-play loop engine
  useEffect(() => {
    if (!isAutoPlaying || isFinished || !currentCard) return;

    const frontText =
      settings.displaySide === 'term_first' ? currentCard.term : currentCard.definition;
    const backText =
      settings.displaySide === 'term_first' ? currentCard.definition : currentCard.term;

    // Step 1: Show front side and speak
    setIsFlipped(false);
    speak(
      frontText,
      settings.displaySide === 'term_first' ? currentCard.audioUrl : undefined,
      { rate: settings.speechRate, lang: settings.speechVoiceLang },
      () => {
        // Step 2: Once front speech finishes, delay and flip card
        autoPlayTimerRef.current = setTimeout(() => {
          setIsFlipped(true);

          // Step 3: Speak back side
          speak(
            backText,
            settings.displaySide === 'definition_first' ? currentCard.audioUrl : undefined,
            { rate: settings.speechRate, lang: settings.speechVoiceLang },
            () => {
              // Step 4: Once back speech finishes, pause and advance to next card
              autoPlayTimerRef.current = setTimeout(() => {
                if (currentIndex + 1 < cards.length) {
                  setCurrentIndex((prev) => prev + 1);
                } else {
                  setIsFinished(true);
                  setIsAutoPlaying(false);
                }
              }, 1600);
            }
          );
        }, 1000);
      }
    );

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [
    isAutoPlaying,
    currentIndex,
    cards.length,
    isFinished,
    currentCard,
    settings,
    speak,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, goPrevious, goNext, undo]);

  return {
    cards,
    currentCard,
    currentIndex,
    isFlipped,
    statusMap,
    history,
    isFinished,
    isAutoPlaying,
    settings,
    stats,
    isSpeaking,
    toggleFlip,
    rateCard,
    goPrevious,
    goNext,
    jumpToCard,
    canGoPrevious: currentIndex > 0,
    canGoNext: currentIndex + 1 < cards.length,
    undo,
    shuffleCards,
    resetAll,
    restartUnlearned,
    setIsAutoPlaying,
    cancelAutoPlay,
    setSettings,
    readCurrentSide,
    speakText,
    canUndo: history.length > 0,
  };
}
