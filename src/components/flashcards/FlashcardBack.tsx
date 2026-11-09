import React from 'react';
import { Star, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { NormalizedFlashcard } from '../../utils/vocabAdapter';
import { PronunciationButton } from './PronunciationButton';
import { ReviewRating } from '../../types';

interface FlashcardBackProps {
  card: NormalizedFlashcard;
  isBookmarked: boolean;
  onToggleBookmark: (vocabId: string) => void;
  onRating?: (vocabId: string, rating: ReviewRating) => void;
  showRatingButtons?: boolean;
}

/**
 * Highlights occurrences of the target word inside an example string.
 */
function highlightWord(text: string, targetWord: string): React.ReactNode {
  if (!text || !targetWord) return text;
  const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === targetWord.toLowerCase() ? (
      <strong key={i} className="font-bold text-sky-700 dark:text-sky-300 underline decoration-sky-400/50 decoration-2">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export const FlashcardBack: React.FC<FlashcardBackProps> = ({
  card,
  isBookmarked,
  onToggleBookmark,
  onRating,
  showRatingButtons = true,
}) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(card.id);
  };

  const hasMultipleSenses = card.senses.length > 1;

  return (
    <div className="w-full h-full min-h-[460px] md:min-h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-8 flex flex-col justify-between shadow-sm overflow-hidden select-text text-left">
      {/* Back Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {card.word}
          </h3>
          <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
            {card.ipa}
          </span>
          <PronunciationButton text={card.word} size="sm" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/60 px-2 py-0.5 rounded">
            [{card.partOfSpeech}]
          </span>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Đánh dấu sao"
        >
          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Dynamic Content Body with Smooth Vertical Scrolling */}
      <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-6">
        {card.senses.map((sense, senseIdx) => {
          return (
            <div key={senseIdx} className="space-y-5">
              {/* SECTION 1: VIETNAMESE MEANING (Nghĩa) */}
              <section className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>
                    {hasMultipleSenses ? `NGHĨA ${senseIdx + 1}` : 'NGHĨA'}
                  </span>
                </div>
                <div className="text-base md:text-lg font-bold text-slate-900 dark:text-white pl-3.5 border-l-2 border-emerald-500">
                  {hasMultipleSenses ? `${senseIdx + 1}. ` : ''}{sense.meaningVi}
                </div>
                {sense.meaningEn && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pl-3.5 italic">
                    English: {sense.meaningEn}
                  </div>
                )}
              </section>

              {/* SECTION 2: EXAMPLE SENTENCE FOR THE MAIN WORD (Ví dụ cho từ gốc) */}
              <section className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  VÍ DỤ CÂU
                </div>
                <p className="text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
                  "{highlightWord(sense.exampleEn, card.word)}"
                </p>
                {sense.exampleVi && (
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                    ➔ <strong className="font-semibold text-slate-700 dark:text-slate-300">Dịch:</strong> {sense.exampleVi}
                  </p>
                )}
              </section>

              {/* SECTION 3: SYNONYMS (TỪ ĐỒNG NGHĨA) */}
              <section className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-teal-100 dark:border-teal-900/50 pb-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                    <span>TỪ ĐỒNG NGHĨA</span>
                  </div>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                    {sense.synonyms.length > 0 ? `${sense.synonyms.length} từ` : 'Không có'}
                  </span>
                </div>

                {sense.synonyms.length > 0 ? (
                  <div className="space-y-3 pl-1">
                    {sense.synonyms.map((syn, synIdx) => (
                      <div
                        key={syn.id || `syn-${synIdx}`}
                        className="p-3.5 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 space-y-1.5"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                            {synIdx + 1}.
                          </span>
                          <span className="text-sm md:text-base font-bold text-teal-900 dark:text-teal-200">
                            {syn.word}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                          <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {syn.meaningVi}
                          </span>
                        </div>

                        {/* Synonym Example & Translation */}
                        <div className="pl-4 space-y-1 text-xs">
                          <p className="font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                            <strong className="not-italic text-teal-700 dark:text-teal-400 font-semibold">Ví dụ:</strong> "{syn.exampleEn}"
                          </p>
                          {syn.exampleVi && (
                            <p className="text-slate-600 dark:text-slate-400">
                              <strong className="font-semibold text-slate-700 dark:text-slate-300">Dịch:</strong> {syn.exampleVi}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic pl-3.5">
                    Chưa có từ đồng nghĩa phù hợp.
                  </div>
                )}
              </section>

              {/* SECTION 4: ANTONYMS (TỪ TRÁI NGHĨA) */}
              <section className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/50 pb-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    <span>TỪ TRÁI NGHĨA</span>
                  </div>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    {sense.antonyms.length > 0 ? `${sense.antonyms.length} từ` : 'Không có'}
                  </span>
                </div>

                {sense.antonyms.length > 0 ? (
                  <div className="space-y-3 pl-1">
                    {sense.antonyms.map((ant, antIdx) => (
                      <div
                        key={ant.id || `ant-${antIdx}`}
                        className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {antIdx + 1}.
                          </span>
                          <span className="text-sm md:text-base font-bold text-rose-900 dark:text-rose-200">
                            {ant.word}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                          <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {ant.meaningVi}
                          </span>
                        </div>

                        {/* Antonym Example & Translation */}
                        <div className="pl-4 space-y-1 text-xs">
                          <p className="font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                            <strong className="not-italic text-rose-700 dark:text-rose-400 font-semibold">Ví dụ:</strong> "{ant.exampleEn}"
                          </p>
                          {ant.exampleVi && (
                            <p className="text-slate-600 dark:text-slate-400">
                              <strong className="font-semibold text-slate-700 dark:text-slate-300">Dịch:</strong> {ant.exampleVi}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic pl-3.5">
                    Chưa có từ trái nghĩa phù hợp.
                  </div>
                )}
              </section>
            </div>
          );
        })}
      </div>

      {/* FSRS Spaced Repetition Action Buttons */}
      {showRatingButtons && onRating && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center mb-1.5 font-medium">
            Đánh giá mức độ nhớ thẻ (Spaced Repetition FSRS):
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRating(card.id, 'again');
              }}
              className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer active:scale-95"
            >
              <span className="text-xs font-bold">Again</span>
              <span className="text-[10px] text-rose-500 font-mono">&lt; 1 ngày</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRating(card.id, 'hard');
              }}
              className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer active:scale-95"
            >
              <span className="text-xs font-bold">Hard</span>
              <span className="text-[10px] text-amber-500 font-mono">2 ngày</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRating(card.id, 'good');
              }}
              className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors cursor-pointer active:scale-95"
            >
              <span className="text-xs font-bold">Good</span>
              <span className="text-[10px] text-sky-500 font-mono">4 ngày</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRating(card.id, 'easy');
              }}
              className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer active:scale-95"
            >
              <span className="text-xs font-bold">Easy</span>
              <span className="text-[10px] text-emerald-500 font-mono">7+ ngày</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
