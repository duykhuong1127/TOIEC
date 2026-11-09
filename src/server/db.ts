import fs from 'fs';
import path from 'path';
import {
  SEED_VOCABULARY,
  VocabularyItem,
} from './seedData';

export interface FlashcardReviewRecord {
  vocabId: string;
  repetitionCount: number;
  lapseCount: number;
  stability: number; // in days
  difficulty: number; // 1 to 10
  intervalDays: number;
  state: 'new' | 'learning' | 'reviewing' | 'mastered';
  lastRating?: 'again' | 'hard' | 'good' | 'easy';
  lastReviewedAt?: string;
  nextReviewAt: string;
  isBookmarked?: boolean;
}


export interface UserStudyState {
  streak: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
  targetScore: number;
  dailyGoalCards: number;
  completedSessions: number;
}

export interface SourceDocumentInfo {
  code: string;
  title: string;
  description: string;
  totalPages: number;
  verifiedCount: number;
  category: string;
  status: 'verified' | 'in_progress';
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'app_data.json');

interface StoredData {
  vocabulary: VocabularyItem[];
  reviews: Record<string, FlashcardReviewRecord>; // vocabId -> review
  userState: UserStudyState;
  documents: SourceDocumentInfo[];
}

class DatabaseService {
  private data: StoredData;

  constructor() {
    this.data = this.loadInitialData();
  }

  private loadInitialData(): StoredData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure default vocabulary seeds are merged if any are missing
        const vocabMap = new Map<string, VocabularyItem>();
        SEED_VOCABULARY.forEach((v) => vocabMap.set(v.id, v));
        (parsed.vocabulary || []).forEach((v: VocabularyItem, idx: number) => {
          const id = v.id || `vocab-${(v.word || 'item').toLowerCase().replace(/[^a-z0-9]/g, '')}-${idx}`;
          const seed = vocabMap.get(id);
          vocabMap.set(id, {
            ...seed,
            ...v,
            id,
            examples: v.examples?.length ? v.examples : seed?.examples,
          });
        });

        const loadedReviews = parsed.reviews || {};
        const allVocab = Array.from(vocabMap.values());
        allVocab.forEach((v) => {
          if (!loadedReviews[v.id]) {
            loadedReviews[v.id] = {
              vocabId: v.id,
              repetitionCount: 0,
              lapseCount: 0,
              stability: 1.0,
              difficulty: 5.0,
              intervalDays: 0,
              state: 'new',
              nextReviewAt: new Date().toISOString(),
            };
          }
        });

        return {
          vocabulary: allVocab,
          reviews: loadedReviews,
          userState: parsed.userState || {
            streak: 3,
            lastActiveDate: new Date().toISOString().split('T')[0],
            totalStudyMinutes: 45,
            targetScore: 750,
            dailyGoalCards: 20,
            completedSessions: 5,
          },
          documents: this.getDefaultDocuments(),
        };
      }
    } catch (err) {
      console.warn('Could not read existing data file, initializing fresh store:', err);
    }

    const defaultReviews: Record<string, FlashcardReviewRecord> = {};
    SEED_VOCABULARY.forEach((v) => {
      defaultReviews[v.id] = {
        vocabId: v.id,
        repetitionCount: 0,
        lapseCount: 0,
        stability: 1.0,
        difficulty: 5.0,
        intervalDays: 0,
        state: 'new',
        nextReviewAt: new Date().toISOString(),
      };
    });

    const initial: StoredData = {
      vocabulary: SEED_VOCABULARY,
      reviews: defaultReviews,
      userState: {
        streak: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalStudyMinutes: 45,
        targetScore: 750,
        dailyGoalCards: 20,
        completedSessions: 5,
      },
      documents: this.getDefaultDocuments(),
    };

    this.saveData(initial);
    return initial;
  }

  private getDefaultDocuments(): SourceDocumentInfo[] {
    return [
      {
        code: 'TOEIC-001',
        title: 'Kiến thức TOEIC căn bản',
        description: '13 trang ngữ pháp: Danh từ, tính từ, trạng từ, giới từ, collocations, 12 thì, gerund/infinitive, word forms.',
        totalPages: 13,
        verifiedCount: 13,
        category: 'Grammar & Foundations',
        status: 'verified',
      },
      {
        code: 'TOEIC-002',
        title: 'Mẹo làm bài Listening',
        description: '6 trang chiến thuật Part 1, 2, 3, 4: nhận diện câu hỏi, tìm từ khóa, phân tích bẫy và paraphrasing.',
        totalPages: 6,
        verifiedCount: 6,
        category: 'Listening Strategies',
        status: 'verified',
      },
      {
        code: 'TOEIC-003',
        title: 'Từ vựng TOEIC thường gặp',
        description: '138 mục từ vựng có phiên âm IPA, loại từ, nghĩa tiếng Việt chuẩn hóa và các nhóm word family.',
        totalPages: 4,
        verifiedCount: 138,
        category: 'Vocabulary',
        status: 'verified',
      },
      {
        code: 'TOEIC-004',
        title: 'Synonyms & Paraphrasing',
        description: '129 nhóm từ/cụm từ theo 6 chủ đề lớn: Business, Office Issues, Personnel, Purchase, Finance, Management.',
        totalPages: 18,
        verifiedCount: 129,
        category: 'Synonyms & Paraphrasing',
        status: 'verified',
      },
      {
        code: 'TOEIC-005',
        title: 'Từ vựng & Cụm từ Part 7 Reading',
        description: 'Từ vựng theo chủ đề đọc hiểu, collocations, expressions và các phương thức paraphrasing.',
        totalPages: 22,
        verifiedCount: 95,
        category: 'Reading Comprehension',
        status: 'verified',
      },
    ];
  }

  private saveData(dataToSave: StoredData = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- Vocabulary Operations ---
  public getVocabulary(filter?: {
    topic?: string;
    toeicPart?: string;
    priority?: string;
    search?: string;
    state?: string;
  }): VocabularyItem[] {
    let result = [...this.data.vocabulary];

    if (filter?.topic && filter.topic !== 'all') {
      result = result.filter((v) => v.topic.toLowerCase().includes(filter.topic!.toLowerCase()));
    }
    if (filter?.toeicPart && filter.toeicPart !== 'all') {
      result = result.filter((v) => v.toeicPart.toLowerCase().includes(filter.toeicPart!.toLowerCase()));
    }
    if (filter?.priority && filter.priority !== 'all') {
      result = result.filter((v) => v.priorityLevel === filter.priority);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.definitionVi.toLowerCase().includes(q) ||
          v.synonyms.some((s) => s.targetPhrase.toLowerCase().includes(q)) ||
          v.antonyms.some((a) => a.targetPhrase.toLowerCase().includes(q))
      );
    }
    if (filter?.state && filter.state !== 'all') {
      result = result.filter((v) => {
        const rev = this.data.reviews[v.id];
        return (rev?.state || 'new') === filter.state;
      });
    }

    return result;
  }

  public getVocabularyById(id: string): VocabularyItem | undefined {
    return this.data.vocabulary.find((v) => v.id === id);
  }

  public addVocabularyItem(item: VocabularyItem): VocabularyItem {
    if (!item.id) {
      item.id = `vocab-${Date.now()}-${(item.word || 'word').toLowerCase().replace(/[^a-z0-9]/g, '') || Math.random().toString(36).slice(2, 7)}`;
    }
    this.data.vocabulary.push(item);
    this.data.reviews[item.id] = {
      vocabId: item.id,
      repetitionCount: 0,
      lapseCount: 0,
      stability: 1.0,
      difficulty: 5.0,
      intervalDays: 0,
      state: 'new',
      nextReviewAt: new Date().toISOString(),
    };
    this.saveData();
    return item;
  }

  public deleteVocabularyItem(id: string): boolean {
    const idx = this.data.vocabulary.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.data.vocabulary.splice(idx, 1);
    delete this.data.reviews[id];
    this.saveData();
    return true;
  }

  public removeDuplicates(): { removedCount: number; duplicateWords: string[] } {
    const seen = new Map<string, string>(); // wordUpper -> original vocabId to keep
    const toRemoveIds = new Set<string>();
    const duplicateWordsSet = new Set<string>();

    this.data.vocabulary.forEach((item) => {
      const normalized = (item.word || '').trim().toUpperCase();
      if (!normalized) return;

      if (seen.has(normalized)) {
        const existingId = seen.get(normalized)!;
        const existingRev = this.data.reviews[existingId];
        const currentRev = this.data.reviews[item.id];

        if (
          currentRev &&
          (!existingRev ||
            (currentRev.repetitionCount || 0) > (existingRev.repetitionCount || 0) ||
            (currentRev.isBookmarked && !existingRev.isBookmarked))
        ) {
          toRemoveIds.add(existingId);
          seen.set(normalized, item.id);
        } else {
          toRemoveIds.add(item.id);
        }
        duplicateWordsSet.add(normalized);
      } else {
        seen.set(normalized, item.id);
      }
    });

    if (toRemoveIds.size > 0) {
      this.data.vocabulary = this.data.vocabulary.filter((v) => !toRemoveIds.has(v.id));
      toRemoveIds.forEach((id) => delete this.data.reviews[id]);
      this.saveData();
    }

    return {
      removedCount: toRemoveIds.size,
      duplicateWords: Array.from(duplicateWordsSet),
    };
  }

  // --- Spaced Repetition Review Algorithm (FSRS/SuperMemo hybrid) ---
  public submitReviewRating(
    vocabId: string,
    rating: 'again' | 'hard' | 'good' | 'easy'
  ): FlashcardReviewRecord {
    const existing = this.data.reviews[vocabId] || {
      vocabId,
      repetitionCount: 0,
      lapseCount: 0,
      stability: 1.0,
      difficulty: 5.0,
      intervalDays: 0,
      state: 'new',
      nextReviewAt: new Date().toISOString(),
    };

    const now = new Date();
    let newStability = existing.stability;
    let newDifficulty = existing.difficulty;
    let newInterval = 1;
    let newState = existing.state;
    let newRepetitions = existing.repetitionCount + 1;
    let newLapses = existing.lapseCount;

    switch (rating) {
      case 'again':
        newLapses += 1;
        newStability = Math.max(0.5, existing.stability * 0.5);
        newDifficulty = Math.min(10, existing.difficulty + 0.8);
        newInterval = 0; // Due immediately / same day
        newState = 'learning';
        break;

      case 'hard':
        newStability = Math.max(1.0, existing.stability * 1.2);
        newDifficulty = Math.min(10, existing.difficulty + 0.3);
        newInterval = Math.max(1, Math.round(existing.stability * 1.2));
        newState = existing.repetitionCount > 2 ? 'reviewing' : 'learning';
        break;

      case 'good':
        newStability = Math.max(1.5, existing.stability * 2.2);
        newDifficulty = Math.max(1.0, existing.difficulty - 0.2);
        newInterval = Math.max(2, Math.round(existing.stability * 2.2));
        newState = existing.repetitionCount >= 3 ? 'mastered' : 'reviewing';
        break;

      case 'easy':
        newStability = Math.max(2.5, existing.stability * 3.5);
        newDifficulty = Math.max(1.0, existing.difficulty - 0.5);
        newInterval = Math.max(4, Math.round(existing.stability * 3.5));
        newState = 'mastered';
        break;
    }

    const nextDueDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

    const updatedReview: FlashcardReviewRecord = {
      ...existing,
      repetitionCount: newRepetitions,
      lapseCount: newLapses,
      stability: Math.round(newStability * 10) / 10,
      difficulty: Math.round(newDifficulty * 10) / 10,
      intervalDays: newInterval,
      state: newState,
      lastRating: rating,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextDueDate.toISOString(),
    };

    this.data.reviews[vocabId] = updatedReview;
    this.updateUserStreakAndMinutes(2); // ~2 mins study per review batch
    this.saveData();

    return updatedReview;
  }

  public getReviews(): Record<string, FlashcardReviewRecord> {
    return this.data.reviews;
  }

  public toggleBookmark(vocabId: string): boolean {
    const rev = this.data.reviews[vocabId] || {
      vocabId,
      repetitionCount: 0,
      lapseCount: 0,
      stability: 1.0,
      difficulty: 5.0,
      intervalDays: 0,
      state: 'new',
      nextReviewAt: new Date().toISOString(),
    };

    rev.isBookmarked = !rev.isBookmarked;
    this.data.reviews[vocabId] = rev;
    this.saveData();
    return !!rev.isBookmarked;
  }


  private updateUserStreakAndMinutes(minutes: number) {
    const today = new Date().toISOString().split('T')[0];
    this.data.userState.totalStudyMinutes += minutes;

    if (this.data.userState.lastActiveDate !== today) {
      const last = new Date(this.data.userState.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        this.data.userState.streak += 1;
      } else if (diffDays > 1) {
        this.data.userState.streak = 1;
      }
      this.data.userState.lastActiveDate = today;
    }
  }

  public getDocuments(): SourceDocumentInfo[] {
    return this.data.documents;
  }
}

export const db = new DatabaseService();
