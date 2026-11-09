import React, { useState } from 'react';
import { RotateCw, Columns } from 'lucide-react';
import { VocabularyItem, ReviewRating } from '../../types';
import { normalizeVocabularyFlashcard } from '../../utils/vocabAdapter';
import { FlashcardFront } from './FlashcardFront';
import { FlashcardBack } from './FlashcardBack';

interface FlashcardCardProps {
  card: VocabularyItem;
  onRating: (vocabId: string, rating: ReviewRating) => void;
  onToggleBookmark: (vocabId: string) => void;
  isBookmarked?: boolean;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  onRating,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'flip' | 'side-by-side'>('flip');

  const normalizedCard = normalizeVocabularyFlashcard(card);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Controls: Mode Switcher */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Chủ đề: <span className="text-slate-800 dark:text-slate-200">{card.topic || 'TOEIC Core'}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('flip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'flip'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Chế độ lật thẻ 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Xem 2 bảng song song</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Two-Panel Mode */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="h-full">
            <FlashcardFront
              card={normalizedCard}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
              topic={card.topic}
              toeicPart={card.toeicPart}
              cefrLevel={card.cefrLevel}
              priorityLevel={card.priorityLevel}
              showFlipPrompt={false}
            />
          </div>
          <div className="h-full">
            <FlashcardBack
              card={normalizedCard}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
              onRating={onRating}
              showRatingButtons={true}
            />
          </div>
        </div>
      ) : (
        /* Interactive 3D Flip Card View */
        <div className="w-full perspective-1000 select-none">
          <div
            className={`relative w-full min-h-[480px] md:min-h-[540px] transition-transform duration-500 transform-style-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT SIDE */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <FlashcardFront
                card={normalizedCard}
                isBookmarked={isBookmarked}
                onToggleBookmark={onToggleBookmark}
                topic={card.topic}
                toeicPart={card.toeicPart}
                cefrLevel={card.cefrLevel}
                priorityLevel={card.priorityLevel}
                onFlipClick={handleFlip}
                showFlipPrompt={true}
              />
            </div>

            {/* BACK SIDE */}
            <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden">
              <FlashcardBack
                card={normalizedCard}
                isBookmarked={isBookmarked}
                onToggleBookmark={onToggleBookmark}
                onRating={onRating}
                showRatingButtons={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
