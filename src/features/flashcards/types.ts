export interface FlashcardOption {
  key: string;
  text: string;
}

export interface Flashcard {
  id: string | number;
  term: string; // Mặt trước: Thuật ngữ / Khái niệm / Câu hỏi
  definition: string; // Mặt sau: Định nghĩa / Giải thích / Đáp án
  imageUrl?: string; // Ảnh minh họa (tùy chọn)
  audioUrl?: string; // File âm thanh riêng (tùy chọn)
  category?: string; // Chủ đề / Phân loại (tùy chọn)
  example?: string; // Ví dụ minh họa ngữ cảnh (tùy chọn)
  options?: FlashcardOption[]; // Các phương án trắc nghiệm A, B, C, D (nếu là câu hỏi)
  correctAnswers?: string[]; // Mảng key đáp án đúng (ví dụ: ["D"])
  explanation?: string; // Ghi chú giải thích chi tiết
}

export type CardStatus = 'unseen' | 'learning' | 'known';

export interface HistoryItem {
  cardIndex: number;
  previousStatus: CardStatus;
  cardId: string | number;
}

export type DisplaySide = 'term_first' | 'definition_first';

export interface StudySettings {
  displaySide: DisplaySide;
  autoTtsOnFlip: boolean;
  speechRate: number; // 0.8 | 1.0 | 1.2
  speechVoiceLang: string; // 'en-US' | 'vi-VN' | 'auto'
  showOptionsOnFront?: boolean; // Tùy chọn hiển thị các phương án A,B,C,D ở mặt trước câu hỏi
}

export interface StudyStats {
  total: number;
  knownCount: number;
  learningCount: number;
  unseenCount: number;
  progressPercent: number;
}
