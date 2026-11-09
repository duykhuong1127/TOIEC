import type { VocabularyItem, SourceDocumentInfo, ReviewRating } from '../types';

// Leave empty when /api is served on the same domain.
// For a separate backend, set VITE_API_BASE_URL to its HTTPS origin and rebuild.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  reply?: string;
  isBookmarked?: boolean;
}

async function requestJson<T>(route: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${route}`, init);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      `API ${route} trả về HTTP ${response.status}, không phải JSON. ` +
      'Kiểm tra backend Express, cấu hình /api trên Vercel hoặc VITE_API_BASE_URL.'
    );
  }

  let payload: ApiResponse<T>;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`API ${route} trả về JSON không hợp lệ (HTTP ${response.status}).`);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(`API ${route} trả về dữ liệu sai cấu trúc.`);
  }
  if (!response.ok || payload.success !== true) {
    throw new Error(payload.error || `Yêu cầu API thất bại (HTTP ${response.status}).`);
  }
  return payload;
}

function post<T>(route: string, body: unknown) {
  return requestJson<T>(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export const api = {
  async getVocabulary(params?: {
    topic?: string; toeicPart?: string; priority?: string; search?: string; state?: string;
  }): Promise<VocabularyItem[]> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params || {})) {
      if (value) query.set(key, value);
    }
    const result = await requestJson<VocabularyItem[]>(`/api/vocabulary?${query}`);
    if (!Array.isArray(result.data)) throw new Error('API thiếu danh sách từ vựng hợp lệ.');
    return result.data;
  },
  async getVocabularyById(id: string): Promise<VocabularyItem | null> {
    const result = await requestJson<VocabularyItem>(`/api/vocabulary/${encodeURIComponent(id)}`);
    return result.data || null;
  },
  async addVocabulary(item: Partial<VocabularyItem>): Promise<VocabularyItem> {
    const result = await post<VocabularyItem>('/api/vocabulary', item);
    if (!result.data?.id) throw new Error('Máy chủ chưa xác nhận đã lưu từ vựng.');
    return result.data;
  },
  async submitReview(vocabId: string, rating: ReviewRating): Promise<ApiResponse<any>> {
    return post('/api/flashcards/review', { vocabId, rating });
  },
  async toggleBookmark(vocabId: string): Promise<boolean> {
    const result = await post('/api/flashcards/bookmark', { vocabId });
    if (typeof result.isBookmarked !== 'boolean') throw new Error('API thiếu trạng thái đánh dấu sao.');
    return result.isBookmarked;
  },
  async getDocuments(): Promise<SourceDocumentInfo[]> {
    const result = await requestJson<SourceDocumentInfo[]>('/api/documents');
    if (!Array.isArray(result.data)) throw new Error('API thiếu danh sách tài liệu hợp lệ.');
    return result.data;
  },
  async askAiTutor(message: string, context?: any): Promise<string> {
    const result = await post('/api/gemini/tutor', { message, context });
    return result.reply || 'Không có phản hồi từ AI.';
  },
};