export type WordClass = 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrase' | 'preposition';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type PriorityLevel = 'Priority 1' | 'Priority 2' | 'Priority 3';
export type UsageLevel = 'Cao' | 'Trung bình' | 'Thấp';
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
export type CardState = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface LexicalRelation {
  definitionIndex?: number; // Optional index of the definition this relation applies to
  id: string;
  targetPhrase: string;
  relationType: 'synonym' | 'antonym' | 'paraphrase' | 'collocation' | 'word_family';
  context: string;
  usageLevel: UsageLevel;
  priority: PriorityLevel;
  supportingExample: string;
  supportingExampleVi?: string;
  interchangeability: 'exact' | 'near' | 'conditional' | 'none';
  verificationStatus: 'verified' | 'context-dependent' | 'needs_review';
}

export interface VocabExample {
  en: string;
  vi: string;
}

export interface VocabularyExample {
  en: string;
  vi: string;
}

export interface RelatedVocabulary {
  word: string;
  meaningVi: string;
  examples?: VocabularyExample[];
  exampleEn?: string;
  exampleVi?: string;
  supportingExample?: string;
  supportingExampleVi?: string;
  priority?: number;
  usageLevel?: UsageLevel;
}

export interface VocabularySense {
  meaningVi: string;
  meaningEn?: string;
  priority?: number;
  examples?: VocabularyExample[];
  synonyms?: RelatedVocabulary[];
  antonyms?: RelatedVocabulary[];
}

export interface VocabularyFlashcard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  senses?: VocabularySense[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: WordClass;
  cefrLevel: CefrLevel;
  priorityLevel: PriorityLevel;
  definitionVi: string;
  definitionEn: string;
  definitions?: Array<{ vi: string; en: string }>;
  exampleEn: string;
  exampleVi: string;
  examples?: VocabExample[]; // 3 ví dụ cho từ vựng
  senses?: VocabularySense[]; // Dynamic structured senses
  topic: string;
  toeicPart: string;
  sourceDoc: string;
  sourcePage?: number;
  synonyms: LexicalRelation[];
  antonyms: LexicalRelation[];
  collocations: string[];
  wordFamily: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  contextNotes?: string;
  paraphraseExamples?: Array<{
    original: string;
    paraphrased: string;
    vietnamese: string;
  }>;
  review?: {
    repetitionCount: number;
    lapseCount: number;
    intervalDays: number;
    state: CardState;
    isBookmarked?: boolean;
    lastRating?: ReviewRating;
    nextReviewAt?: string;
  };
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
