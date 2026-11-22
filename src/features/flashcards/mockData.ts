import { Flashcard } from './types';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    term: 'Closure',
    definition:
      'Hàm có khả năng ghi nhớ và truy cập vào phạm vi từ vựng (lexical scope) của hàm cha bao bọc nó, ngay cả khi hàm cha đã thực thi xong.',
    category: 'JavaScript / Core Concepts',
    example: 'function outer() { let count = 0; return () => ++count; }',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fc-2',
    term: 'Server-Side Rendering (SSR)',
    definition:
      'Quá trình tạo mã HTML của trang web ngay trên máy chủ (server) cho mỗi request trước khi gửi về client, giúp tối ưu SEO và tốc độ hiển thị nội dung đầu tiên (FCP).',
    category: 'Web Architecture',
    example: 'Next.js App Router render page components trên Node.js runtime.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fc-3',
    term: 'Virtual DOM',
    definition:
      'Bản sao thu nhỏ và nhẹ của cấu trúc Real DOM được lưu trong bộ nhớ. React so sánh bản sao này (Diffing) để chỉ cập nhật những phần tử thực sự thay đổi (Reconciliation).',
    category: 'React Ecosystem',
    example: 'Giúp tránh việc thao tác trực tiếp và tốn kém lên Browser Real DOM.',
  },
  {
    id: 'fc-4',
    term: 'Spaced Repetition (Lặp lại ngắt quãng)',
    definition:
      'Kỹ thuật học tập phân bố khoảng thời gian ôn tập dài dần theo thời gian dựa trên đường cong lãng quên của Ebbinghaus, giúp khắc sâu kiến thức vào trí nhớ dài hạn.',
    category: 'Cognitive Science & Learning',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fc-5',
    term: 'CSS 3D Transforms & Perspective',
    definition:
      'Thuộc tính CSS cho phép định vị và xoay phần tử trong không gian 3 chiều. Thuộc tính `perspective` tạo chiều sâu thị giác và góc nhìn của người quan sát.',
    category: 'Modern CSS & Animation',
    example: 'transform: perspective(1000px) rotateY(180deg); transform-style: preserve-3d;',
  },
  {
    id: 'fc-6',
    term: 'Idempotency (Tính bất biến kết quả)',
    definition:
      'Đặc tính của một thao tác hoặc API call mà khi thực hiện lặp lại nhiều lần với cùng tham số thì kết quả trạng thái trên hệ thống vẫn giữ nguyên như lần thực hiện đầu tiên.',
    category: 'API & Backend Design',
    example: 'HTTP GET, PUT, DELETE được thiết kế mang tính chất Idempotent.',
  },
  {
    id: 'fc-7',
    term: 'Hydration',
    definition:
      'Giai đoạn ở client khi React đọc HTML tĩnh do server trả về, đính kèm các event listeners (onClick, onChange,...) và khởi tạo state để biến trang web thành tương tác động.',
    category: 'React Internals',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fc-8',
    term: 'Debounce vs Throttle',
    definition:
      'Debounce trì hoãn gọi hàm cho đến khi người dùng ngừng thao tác sau khoảng thời gian T; còn Throttle đảm bảo hàm chỉ được gọi tối đa 1 lần trong mỗi chu kỳ thời gian T.',
    category: 'Performance Optimization',
    example: 'Debounce cho Search Input autocomplete; Throttle cho Window Scroll/Resize event.',
  },
];
