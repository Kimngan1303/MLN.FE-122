import originalQuestions from '../../../data/questions.json';
import { Flashcard, FlashcardOption } from './types';

interface RawOption {
  key: string;
  text: string;
}

interface RawQuestion {
  id: number | string;
  question: string;
  options: RawOption[];
  answer: string[];
  notes?: string[];
}

export function convertQuestionsToFlashcards(rawList: RawQuestion[] = originalQuestions as RawQuestion[]): Flashcard[] {
  return rawList.map((item, index) => {
    // Determine the readable answer text
    const correctOptions = item.options.filter((opt) => item.answer.includes(opt.key));
    const answerSummary = correctOptions.length > 0
      ? correctOptions.map((opt) => `${opt.key}. ${opt.text}`).join('\n')
      : item.answer.join(', ');

    const explanationText = item.notes && item.notes.length > 0
      ? item.notes.join('\n\n')
      : '';

    const definition = explanationText
      ? `${answerSummary}\n\n📝 Ghi chú / Giải thích:\n${explanationText}`
      : answerSummary;

    return {
      id: `mln-${item.id ?? index + 1}`,
      term: item.question,
      definition: definition,
      category: `MLN122 · Câu ${item.id ?? index + 1}`,
      options: item.options,
      correctAnswers: item.answer,
      explanation: explanationText,
    };
  });
}

export const MLN_FLASHCARDS = convertQuestionsToFlashcards();

export interface CardSetPreset {
  id: string;
  name: string;
  count: number;
  getCards: () => Flashcard[];
}

export const FLASHCARD_PRESETS: CardSetPreset[] = [
  {
    id: 'random-20',
    name: '20 câu ngẫu nhiên (Luyện nhanh)',
    count: 20,
    getCards: () => {
      const copy = [...MLN_FLASHCARDS];
      copy.sort(() => Math.random() - 0.5);
      return copy.slice(0, 20);
    },
  },
  {
    id: 'random-50',
    name: '50 câu ngẫu nhiên (Tiêu chuẩn)',
    count: 50,
    getCards: () => {
      const copy = [...MLN_FLASHCARDS];
      copy.sort(() => Math.random() - 0.5);
      return copy.slice(0, 50);
    },
  },
  {
    id: 'range-1-50',
    name: 'Câu 1 – 50',
    count: 50,
    getCards: () => MLN_FLASHCARDS.slice(0, 50),
  },
  {
    id: 'range-51-100',
    name: 'Câu 51 – 100',
    count: 50,
    getCards: () => MLN_FLASHCARDS.slice(50, 100),
  },
  {
    id: 'range-101-200',
    name: 'Câu 101 – 200',
    count: 100,
    getCards: () => MLN_FLASHCARDS.slice(100, 200),
  },
  {
    id: 'range-201-350',
    name: 'Câu 201 – 350',
    count: 150,
    getCards: () => MLN_FLASHCARDS.slice(200, 350),
  },
  {
    id: 'range-351-526',
    name: 'Câu 351 – 526',
    count: 176,
    getCards: () => MLN_FLASHCARDS.slice(350, 526),
  },
  {
    id: 'all',
    name: `Toàn bộ 526 câu hỏi MLN122`,
    count: MLN_FLASHCARDS.length,
    getCards: () => MLN_FLASHCARDS,
  },
];
