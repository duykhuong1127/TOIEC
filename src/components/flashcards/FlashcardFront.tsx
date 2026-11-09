import React from 'react';
import { Star, RotateCw } from 'lucide-react';
import { NormalizedFlashcard } from '../../utils/vocabAdapter';
import { PronunciationButton } from './PronunciationButton';

interface FlashcardFrontProps {
  card: NormalizedFlashcard;
  isBookmarked: boolean;
  onToggleBookmark: (vocabId: string) => void;
  topic?: string;
  toeicPart?: string;
  cefrLevel?: string;
  priorityLevel?: string;
  onFlipClick?: () => void;
  showFlipPrompt?: boolean;
}

export const FlashcardFront: React.FC<FlashcardFrontProps> = ({
  card,
  isBookmarked,
  onToggleBookmark,
  topic = 'Vocabulary',
  toeicPart,
  cefrLevel,
  priorityLevel,
  onFlipClick,
  showFlipPrompt = true,
}) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(card.id);
  };

  return (
    <div
      onClick={onFlipClick}
      className="w-full h-full min-h-[460px] md:min-h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative select-none"
    >
      {/* Top Bar: Metadata & Bookmark */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {cefrLevel && (
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              CEFR {cefrLevel}
            </span>
          )}
          {cefrLevel && priorityLevel && <span aria-hidden="true">·</span>}
          {priorityLevel && (
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {priorityLevel}
            </span>
          )}
          {(cefrLevel || priorityLevel) && toeicPart && <span aria-hidden="true">·</span>}
          {toeicPart && (
            <span className="font-medium text-slate-500">
              {toeicPart}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Đánh dấu sao từ vựng này"
          aria-label="Đánh dấu sao"
        >
          <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Center Vocabulary Display */}
      <div className="my-auto text-center py-6 space-y-4">
        {/* Unboxed Topic Label */}
        <div className="text-xs font-semibold tracking-widest text-sky-600 dark:text-sky-400 uppercase">
          {topic}
        </div>

        {/* 1. English Vocabulary Word */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
          {card.word}
        </h2>

        {/* 2. IPA Phonetic Transcription + Audio Button */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-xl md:text-2xl font-mono font-medium text-slate-600 dark:text-slate-300 tracking-wider">
            {card.ipa}
          </span>
          <PronunciationButton text={card.word} size="md" />
        </div>

        {/* 3. Part of Speech Badge */}
        <div className="pt-2">
          <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-widest text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-900/60 px-3 py-1 rounded-md">
            [{card.partOfSpeech}]
          </span>
        </div>
      </div>

      {/* Bottom Prompt to Flip */}
      {showFlipPrompt && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Chạm / Nhấp để lật xem Nghĩa, Ví dụ, Từ đồng nghĩa & Trái nghĩa</span>
          </div>
        </div>
      )}
    </div>
  );
};
