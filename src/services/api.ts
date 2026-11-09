import {
  VocabularyItem,
  SourceDocumentInfo,
  ReviewRating,
} from '../types';

export const api = {
  // Vocabulary
  async getVocabulary(params?: {
    topic?: string;
    toeicPart?: string;
    priority?: string;
    search?: string;
    state?: string;
  }): Promise<VocabularyItem[]> {
    const query = new URLSearchParams();
    if (params?.topic) query.set('topic', params.topic);
    if (params?.toeicPart) query.set('toeicPart', params.toeicPart);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.search) query.set('search', params.search);
    if (params?.state) query.set('state', params.state);

    const res = await fetch(`/api/vocabulary?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getVocabularyById(id: string): Promise<VocabularyItem | null> {
    const res = await fetch(`/api/vocabulary/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  },

  async addVocabulary(item: Partial<VocabularyItem>): Promise<VocabularyItem> {
    const res = await fetch('/api/vocabulary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    return data.data;
  },

  // Spaced Repetition (FSRS / SM-2)
  async submitReview(vocabId: string, rating: ReviewRating): Promise<any> {
    const res = await fetch('/api/flashcards/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vocabId, rating }),
    });
    return res.json();
  },

  async toggleBookmark(vocabId: string): Promise<boolean> {
    const res = await fetch('/api/flashcards/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vocabId }),
    });
    const data = await res.json();
    return !!data.isBookmarked;
  },


  // Documents
  async getDocuments(): Promise<SourceDocumentInfo[]> {
    const res = await fetch('/api/documents');
    const data = await res.json();
    return data.data || [];
  },

  // AI Tutor
  async askAiTutor(message: string, context?: any): Promise<string> {
    const res = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    const data = await res.json();
    return data.reply || 'Không có phản hồi từ AI.';
  },
};
