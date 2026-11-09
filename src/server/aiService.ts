import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export interface AiTutorRequest {
  message: string;
  context?: {
    currentWord?: string;
    questionPrompt?: string;
    partNumber?: number;
    errorType?: string;
  };
}


export async function askAiTutor(request: AiTutorRequest): Promise<string> {
  const client = getAiClient();
  const systemInstruction = `Bạn là Trợ lý AI Giảng dạy TOEIC chuyên sâu (TOEIC MASTER AI Tutor) với hơn 20 năm kinh nghiệm luyện thi TOEIC theo định dạng chuẩn ETS.
Quy tắc trả lời:
1. Giải thích súc tích, chính xác bằng tiếng Việt, có dẫn chứng câu ví dụ song ngữ Anh-Việt.
2. Phân tích chi tiết: vì sao chọn đáp án này, bẫy thường gặp (distractor analysis), collocations và paraphrasing tương đương.
3. Nếu người dùng hỏi về từ vựng, chỉ ra từ loại, sắc thái nghĩa theo từng ngữ cảnh công sở, và các từ đồng nghĩa/trái nghĩa phổ biến trong đề thi TOEIC.
4. KHÔNG bịa đặt mẹo sai (như nói 'being' luôn sai 100%, hoặc mẹo loại từ 95% không căn cứ). Luôn giữ phong thái sư phạm uy tín, khích lệ.`;

  let prompt = request.message;
  if (request.context) {
    prompt += `\n\n[Bối cảnh học tập hiện tại:]`;
    if (request.context.currentWord) prompt += `\n- Từ vựng đang học: ${request.context.currentWord}`;
    if (request.context.questionPrompt) prompt += `\n- Câu hỏi đang làm: "${request.context.questionPrompt}"`;
    if (request.context.partNumber) prompt += `\n- Part: Part ${request.context.partNumber}`;
    if (request.context.errorType) prompt += `\n- Dạng lỗi người học hay mắc: ${request.context.errorType}`;
  }

  if (!client) {
    return `[Chế độ AI Ngoại tuyến - Thầy giáo TOEIC MASTER]:
Cảm ơn câu hỏi của bạn về: "${request.message}".
Về câu hỏi này trong chuẩn đề thi TOEIC ETS:
1. **Trọng tâm ngữ pháp/từ vựng**: Luôn xác định từ loại và cấu trúc trước (Subject - Verb - Object - Adverb) trước khi dịch nghĩa.
2. **Chiến thuật làm bài**: Chú ý bẫy từ phát âm tương tự (Sound-alike traps) trong Listening và bẫy cấu trúc từ vựng (Word Forms) trong Reading Part 5.
3. **Mẹo ghi nhớ**: Hãy thêm từ vựng này vào danh sách Flashcards của bạn để ôn tập theo thuật toán Spaced Repetition (FSRS) đạt hiệu quả dài lâu!`;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text || 'Rất tiếc, AI chưa thể tạo câu trả lời vào lúc này. Vui lòng thử lại sau.';
  } catch (error) {
    console.error('Gemini API tutor error:', error);
    return `[Chế độ Hướng dẫn Phân tích TOEIC]:\nĐể giải quyết câu hỏi này: Hãy đối chiếu trực tiếp với vị trí ngữ pháp trong câu và đối chiếu từ đồng nghĩa trong ngữ cảnh công sở. Nếu cần hỗ trợ thêm, bạn có thể hỏi tiếp AI Tutor bất kỳ lúc nào!`;
  }
}
