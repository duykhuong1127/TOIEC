# TOEIC MASTER AI – HỆ THỐNG LUYỆN THI TOEIC & FLASHCARDS THÔNG MINH

Ứng dụng web EdTech luyện thi TOEIC Listening & Reading toàn diện, kết hợp ưu điểm của **Quizlet** (Flashcards hai mặt, Spaced Repetition FSRS), **Study4** (Luyện đề, chữa bài chi tiết, trích xuất từ vựng), và **dethitracnghiem.vn** (Ngân hàng đề thi, đồng hồ đếm ngược, phân loại bẫy).

---

## 1. DANH SÁCH CHỨC NĂNG ĐÃ HOÀN THÀNH (WORKING MVP)

### 1.1. Module Flashcards Hai Mặt (Quan trọng nhất)
- [x] **Thiết kế Flashcard 2 mặt hoàn chỉnh**:
  - **Mặt trước (FRONT)**: Từ tiếng Anh, phiên âm IPA, loại từ, nút phát âm audio chuẩn US (Web Speech API), nhãn cấp độ CEFR (A1–C2), nhãn độ ưu tiên (Priority 1/2/3), câu ví dụ ngắn có nút bật/tắt bản dịch tiếng Việt, nút đánh dấu sao.
  - **Mặt sau (BACK)**: Nghĩa tiếng Việt chính xác, giải thích tiếng Anh, bảng từ đồng nghĩa (Synonyms) kèm mức phổ biến dự kiến (Cao, Trung bình, Thấp) và câu ví dụ, bảng từ trái nghĩa (Antonyms) trong cùng ngữ cảnh, bảng ví dụ Paraphrasing chuẩn ETS, collocations, word families, lưu ý ngữ cảnh công sở.
- [x] **3 Flashcard mẫu bắt buộc (Mục 4.3)**:
  - `POSTPONE`: 3 synonyms (*Delay*, *Put off*, *Defer*), 3 antonyms (*Bring forward*, *Move up*, *Advance*), ví dụ paraphrasing.
  - `AVAILABLE`: 3 synonyms (*In stock*, *On hand*, *Obtainable*), 3 antonyms (*Unavailable*, *Out of stock*, *Sold out*), lưu ý ngữ cảnh hàng hóa vs nhân sự.
  - `REDUCE`: 3 synonyms (*Lower*, *Cut*, *Decrease*), 3 antonyms (*Increase*, *Raise*, *Boost*), lưu ý nội/ngoại động từ.
- [x] **10 Chế độ Flashcard (Section 4.4)**:
  - *Mode 1 (Learn)*: Lật thẻ xem nghĩa, phát âm và ví dụ.
  - *Mode 2 (Review)*: Ôn tập Spaced Repetition theo lịch đến hạn.
  - *Mode 3 (Synonym Challenge)*: Trắc nghiệm chọn từ đồng nghĩa theo ngữ cảnh công sở.
  - *Mode 4 (Antonym Challenge)*: Trắc nghiệm chọn từ trái nghĩa chính xác.
  - *Mode 5 (Context Challenge)*: Điền từ vào chỗ trống câu TOEIC Part 5.
  - *Mode 6 (Listening Vocab)*: Nghe phát âm chuẩn và chọn từ/nghĩa.
  - *Mode 7 (Paraphrasing Challenge)*: Chọn câu diễn đạt tương đương.
  - *Mode 8 (Word Family)*: Nhận diện dạng danh/động/tính/trạng.
  - *Mode 9 (My Difficult Words)*: Chỉ ôn các từ người học thường xuyên quên (Again).
  - *Mode 10 (Quick Review)*: Bài luyện nhanh 5 phút.
- [x] **Thuật toán Spaced Repetition (FSRS / SM-2)**:
  - 4 nút đánh giá: **Again** (< 1 ngày), **Hard** (2 ngày), **Good** (4 ngày), **Easy** (7+ ngày).
  - Theo dõi số lần ôn, số lần quên (lapses), độ khó, độ ổn định và tự động tính ngày ôn kế tiếp.

### 1.2. Thư viện Từ vựng & Paraphrasing (Vocabulary Library)
- [x] Bộ lọc đa chiều: Theo TOEIC Part (Part 1–7), Chủ đề (Business, Personnel, Office Issues, Purchase, Finance, Management), CEFR Level, Priority 1/2/3.
- [x] Tra cứu thời gian thực theo từ vựng, nghĩa tiếng Việt hoặc từ đồng nghĩa.
- [x] Bảng quan hệ từ vựng đa cột (`lexical_relations`): Không gộp chuỗi, lưu riêng biệt mức phổ biến, ngữ cảnh và tính hoán đổi.

### 1.3. Chiến thuật 7 Part Toàn diện (TOEIC Tips & Strategies)
- [x] Đầy đủ 7 Part: Part 1 (Photographs), Part 2 (Question-Response), Part 3 (Conversations), Part 4 (Talks), Part 5 (Incomplete Sentences), Part 6 (Text Completion), Part 7 (Reading Comprehension).
- [x] Minh bạch chất lượng mẹo: Gắn nhãn trạng thái chứng cứ (*Verified / Context-dependent*), độ tin cậy (*High / Medium*), điều kiện áp dụng và nhầm lẫn tai hại cần tránh.
- [x] Đính chính các mẹo ảo (như phân tích bẫy `being + V3` trong Part 1: vẫn có thể đúng nếu có người đang thao tác).
- [x] Hướng dẫn phân bổ thời gian Reading: Part 5 (~10m), Part 6 (~10m), Part 7 (~55m).
- [x] Mini Quiz tương tác cho từng mẹo có chấm điểm và giải thích tức thì.

### 1.4. Luyện đề ETS & Thi thử (Exam & Practice System)
- [x] Đề thi ETS Mini Diagnostic Test & Part Practice.
- [x] Chế độ làm bài: Thi thử bấm giờ (Exam Timed) và Luyện tập tự do (Practice Mode).
- [x] Đồng hồ đếm ngược chạy độc lập, không bị sai lệch khi chuyển tab.
- [x] Trình phát mô phỏng audio bài nghe Listening (Play/Pause, transcript có thể bật/tắt ở chế độ luyện tập).
- [x] Tự động lưu bài làm (Autosave) vào bộ nhớ cục bộ, không mất bài khi tải lại trang.
- [x] Bảng điều hướng câu hỏi: Trạng thái đã làm, chưa làm, gắn cờ xem lại.
- [x] Chấm điểm & Quy đổi thang điểm ETS (10–990).
- [x] Chữa bài chi tiết: Hiển thị đáp án đúng, phân tích từng phương án sai (distractor reason), loại bẫy gây nhầm lẫn, trích xuất dẫn chứng bài đọc/nghe.

### 1.5. Sổ tay Lỗi sai (My Mistakes)
- [x] Phân loại câu trả lời sai thành 10 nhóm bẫy: Vocabulary, Grammar, Word Form, Collocation, Listening Comprehension, Paraphrasing, Inference, Detail Identification, Time Management, Other/Uncertain.
- [x] Ghi chú cá nhân và nút "Đánh dấu đã hiểu / Resolve".
- [x] Nút 1 chạm "Hỏi AI Tutor" để phân tích sâu nguyên nhân chọn sai.

### 1.6. Phân tích Năng lực & Học tập Thích ứng (Learning Analytics & Adaptive Engine)
- [x] Bảng điều khiển KPI: Streak, tổng phút học, tỷ lệ từ đã thuộc, đề thi đã hoàn tất.
- [x] Biểu đồ tỷ lệ chính xác theo từng Part 1–7.
- [x] Đề xuất thích ứng (Adaptive Learning Next Step): Phân tích điểm yếu và gợi ý bài học kế tiếp (Ví dụ: đề xuất luyện Synonym Challenge và ôn Word Forms khi sai nhiều Part 5).
- [x] Xuất báo cáo tiến độ dạng file CSV.

### 1.7. AI Tutor Thông minh (Gemini 3.8 Flash)
- [x] Backend proxy an toàn gọi Gemini API (`@google/genai` với `gemini-3.8-flash`).
- [x] Trả lời câu hỏi học viên về ngữ pháp, bẫy đề thi, so sánh từ đồng nghĩa, phân tích paraphrasing.
- [x] Bộ câu hỏi gợi ý nhanh (Quick prompts).
- [x] Có chế độ dự phòng thông minh (Rule-based pedagogical fallback) khi ngoại tuyến.

### 1.8. Quản trị Nội dung & Tài liệu Nguồn (Document Library)
- [x] Quản lý 5 bộ tài liệu nguồn: TOEIC-001 (Ngữ pháp), TOEIC-002 (Mẹo Listening), TOEIC-003 (Từ vựng), TOEIC-004 (Synonyms), TOEIC-005 (Part 7).
- [x] Form thêm từ vựng mới vào hàng đợi kiểm duyệt tuân thủ 10 quy tắc nhập liệu.

### 1.9. UI/UX & Giao diện EdTech Chuẩn mực
- [x] Hỗ trợ Light Mode và Dark Mode đồng bộ (`@custom-variant dark`).
- [x] Đáp ứng hoàn hảo trên Desktop, Tablet và Mobile.
- [x] Tuân thủ hiến pháp thiết kế: Không dùng pill badge bao quanh thông tin tĩnh, sử dụng typography Plus Jakarta Sans và số tabular-nums.
- [x] Hiệu ứng lật thẻ 3D mượt mà không gây giật lag.

---

## 2. DATABASE SCHEMA & MIGRATION FILES

- File DDL chuẩn PostgreSQL: `/migrations/001_initial_schema.sql`
- Bao gồm đầy đủ 22 bảng:
  1. `users`, `user_profiles`, `study_goals`, `study_sessions`, `learning_events`
  2. `source_documents`, `source_pages`, `import_jobs`, `content_review_queue`
  3. `vocabulary_entries`, `vocabulary_senses`, `lexical_relations`, `vocabulary_examples`, `collocations`, `word_families`, `flashcard_decks`, `flashcard_deck_items`, `flashcard_reviews`
  4. `grammar_topics`, `strategy_tips`
  5. `tests`, `test_sections`, `passages`, `questions`, `answer_options`, `test_sessions`, `user_answers`, `mistake_records`
  6. `performance_summaries`, `vocabulary_mastery`
- Bảng `lexical_relations` lưu trữ chuẩn hóa: `source_vocab_sense_id`, `target_phrase`, `relation_type`, `context`, `interchangeability`, `usage_level`, `priority`, `supporting_example`, `source_reference`, `verification_status`.
- Hệ thống dữ liệu hoạt động thực tế với tính bền vững lưu trữ trong `/data/app_data.json`.

---

## 3. HƯỚNG DẪN KHỞI CHẠY & CẤU HÌNH

### Cài đặt dependencies:
```bash
npm install
```

### Biến môi trường (`.env`):
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Chạy ở môi trường phát triển (Full-stack):
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### Build và Kiểm tra Lint:
```bash
npm run lint
npm run build
```

---

## 4. KẾT QUẢ KIỂM THỬ (TEST RESULTS)

- **Kiểm thử biên dịch (compile_applet)**: PASS (0 lỗi).
- **Kiểm thử cú pháp & kiểu dữ liệu (lint_applet - `tsc --noEmit`)**: PASS (0 lỗi).
- **Kiểm thử chức năng Flashcard**:
  - Lật thẻ 2 mặt và âm thanh Web Speech API hoạt động trơn tru.
  - Cập nhật chu kỳ Spaced Repetition (Again/Hard/Good/Easy) ghi nhận chính xác vào cơ sở dữ liệu.
- **Kiểm thử đề thi trắc nghiệm**:
  - Đồng hồ đếm ngược và phục hồi phiên làm bài qua localStorage hoạt động ổn định.
  - Chấm điểm và phân tích bẫy từng câu chính xác.
- **Kiểm thử Dual-Theme (Light / Dark)**:
  - Chuyển đổi tương phản rõ ràng, không bị lỗi chữ đen trên nền tối.

---

## 5. CÁC HẠN CHẾ & LỘ TRÌNH PHÁT TRIỂN TIẾP THEO

- **Hạn chế**: Hiện tại ngân hàng đề bao gồm Mini Test chuẩn 15 câu và các câu hỏi mẫu 7 Part. Bộ đề Full Test 200 câu sẽ được nạp thêm khi ban quản trị hoàn tất bản quyền đề thi ETS chính thức.
- **Phase tiếp theo**:
  - Tích hợp thêm âm thanh phòng thi thực tế (tiếng quạt, tiếng ho nhẹ trong chế độ Exam Timed nâng cao).
  - Mở rộng ngân hàng câu hỏi Part 3 & 4 với giọng đọc đa quốc ngữ (Mỹ, Anh, Úc, Canada).
