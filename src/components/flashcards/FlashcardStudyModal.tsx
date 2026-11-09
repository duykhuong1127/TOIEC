import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyItem, ReviewRating } from '../../types';
import { playPronunciation } from '../../utils/speech';
import { FlashcardCard } from './FlashcardCard';

interface FlashcardStudyModalProps {
  mode: string;
  cards: VocabularyItem[];
  onClose: () => void;
  onRating: (vocabId: string, rating: ReviewRating) => void;
  onToggleBookmark: (vocabId: string) => void;
}

export const FlashcardStudyModal: React.FC<FlashcardStudyModalProps> = ({
  mode,
  cards,
  onClose,
  onRating,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = cards[currentIndex];

  // Helper to trigger confetti on finish with good score
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // Generate dynamic interactive quiz options based on mode
  useEffect(() => {
    if (!currentCard) return;
    setSelectedAnswer(null);
    setIsAnswerChecked(false);

    if (mode === 'synonym') {
      // Target correct synonym
      const correct = currentCard.synonyms[0]?.targetPhrase || currentCard.word;
      // Pick 3 distractors from other cards
      const others = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.word)
        .slice(0, 3);
      const combined = [correct, ...others].sort(() => Math.random() - 0.5);
      setQuizOptions(combined);
    } else if (mode === 'antonym') {
      const correct = currentCard.antonyms[0]?.targetPhrase || 'None';
      const others = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.word)
        .slice(0, 3);
      const combined = [correct, ...others].sort(() => Math.random() - 0.5);
      setQuizOptions(combined);
    } else if (mode === 'listening') {
      const correct = currentCard.word;
      const others = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.word)
        .slice(0, 3);
      const combined = [correct, ...others].sort(() => Math.random() - 0.5);
      setQuizOptions(combined);
      // Auto play audio in listening mode
      playPronunciation(currentCard.word);
    } else if (mode === 'context') {
      const correct = currentCard.word;
      const others = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.word)
        .slice(0, 3);
      const combined = [correct, ...others].sort(() => Math.random() - 0.5);
      setQuizOptions(combined);
    } else if (mode === 'paraphrase') {
      const p = currentCard.paraphraseExamples?.[0];
      const correct = p ? p.paraphrased : currentCard.definitionEn;
      const others = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.exampleEn)
        .slice(0, 3);
      const combined = [correct, ...others].sort(() => Math.random() - 0.5);
      setQuizOptions(combined);
    }
  }, [currentIndex, mode, cards]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
      triggerConfetti();
    }
  };

  const handleRatingAndNext = (vocabId: string, rating: ReviewRating) => {
    onRating(vocabId, rating);
    handleNext();
  };

  const checkMultipleChoice = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
    setIsAnswerChecked(true);

    let isCorrect = false;
    if (mode === 'synonym') {
      const correct = currentCard.synonyms[0]?.targetPhrase || currentCard.word;
      isCorrect = option === correct;
    } else if (mode === 'antonym') {
      const correct = currentCard.antonyms[0]?.targetPhrase;
      isCorrect = option === correct;
    } else if (mode === 'listening' || mode === 'context') {
      isCorrect = option.toLowerCase() === currentCard.word.toLowerCase();
    } else if (mode === 'paraphrase') {
      const p = currentCard.paraphraseExamples?.[0];
      const correct = p ? p.paraphrased : currentCard.definitionEn;
      isCorrect = option === correct;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      onRating(currentCard.id, 'good');
    } else {
      onRating(currentCard.id, 'again');
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'learn':
        return 'Chế độ 1: Học từ mới (Learn)';
      case 'review':
        return 'Chế độ 2: Ôn tập Spaced Repetition (FSRS)';
      case 'synonym':
        return 'Chế độ 3: Thử thách từ đồng nghĩa (Synonym Challenge)';
      case 'antonym':
        return 'Chế độ 4: Thử thách từ trái nghĩa (Antonym Challenge)';
      case 'context':
        return 'Chế độ 5: Điền từ vào ngữ cảnh (Context Challenge)';
      case 'listening':
        return 'Chế độ 6: Từ vựng qua âm thanh (Listening Vocab)';
      case 'paraphrase':
        return 'Chế độ 7: Diễn đạt tương đương (Paraphrasing Challenge)';
      case 'difficult':
        return 'Chế độ 9: Ôn tập từ khó thường sai';
      default:
        return 'Luyện tập Flashcard';
    }
  };

  if (!cards.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full text-center shadow-xl">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Không có từ vựng nào trong danh mục này.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
              {getModeTitle()}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Thẻ {currentIndex + 1} / {cards.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="w-28 md:w-40 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {isFinished ? (
            /* Results Screen */
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Hoàn thành phiên học!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Bạn đã hoàn thành toàn bộ {cards.length} từ trong đợt học này. Tiến độ ghi nhớ của bạn đã được cập nhật vào hệ thống Spaced Repetition.
              </p>

              {['synonym', 'antonym', 'listening', 'context', 'paraphrase'].includes(mode) && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 mb-6">
                  <div className="text-xs text-slate-500 mb-1">Kết quả bài thử thách</div>
                  <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
                    {score} / {cards.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Độ chính xác: {Math.round((score / cards.length) * 100)}%
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setScore(0);
                    setIsFinished(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Học lại lần nữa</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  Hoàn tất & Thoát
                </button>
              </div>
            </div>
          ) : mode === 'learn' || mode === 'review' || mode === 'difficult' ? (
            /* Mode 1 & 2: Interactive 3D Flip Card View */
            <div className="space-y-4">
              <FlashcardCard
                card={currentCard}
                onRating={handleRatingAndNext}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={!!currentCard.review?.isBookmarked}
              />
              <div className="flex justify-between items-center max-w-2xl mx-auto pt-2">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((p) => p - 1)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  ← Thẻ trước
                </button>
                <button
                  onClick={handleNext}
                  className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Bỏ qua / Thẻ tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Challenge Modes (3, 4, 5, 6, 7): Interactive Multiple-Choice drills */
            <div className="max-w-xl mx-auto py-4">
              <div className="text-center mb-6">
                {mode === 'listening' ? (
                  <div>
                    <button
                      onClick={() => playPronunciation(currentCard.word)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:scale-105 transition-transform"
                    >
                      <Volume2 className="w-6 h-6" />
                      <span className="font-semibold text-base">Bấm để nghe phát âm</span>
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Nghe âm thanh và chọn từ đúng nhất
                    </p>
                  </div>
                ) : mode === 'context' ? (
                  <div>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      Điền từ vào chỗ trống ({currentCard.toeicPart})
                    </span>
                    <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-200 mt-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                      "{currentCard.exampleEn.replace(new RegExp(currentCard.word, 'gi'), '_____')}"
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Gợi ý tiếng Việt: {currentCard.exampleVi}
                    </p>
                  </div>
                ) : mode === 'paraphrase' ? (
                  <div>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      Tìm cách diễn đạt tương đương (Paraphrasing)
                    </span>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                      "{currentCard.paraphraseExamples?.[0]?.original || currentCard.exampleEn}"
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {mode === 'synonym' ? 'Chọn từ đồng nghĩa với:' : 'Chọn từ trái nghĩa với:'}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 dark:text-white mt-1">
                      {currentCard.word}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {currentCard.definitionVi} ({currentCard.partOfSpeech})
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {quizOptions.map((opt, i) => {
                  let btnStyle =
                    'border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

                  if (isAnswerChecked) {
                    let isThisCorrect = false;
                    if (mode === 'synonym') {
                      isThisCorrect = opt === (currentCard.synonyms[0]?.targetPhrase || currentCard.word);
                    } else if (mode === 'antonym') {
                      isThisCorrect = opt === currentCard.antonyms[0]?.targetPhrase;
                    } else if (mode === 'listening' || mode === 'context') {
                      isThisCorrect = opt.toLowerCase() === currentCard.word.toLowerCase();
                    } else if (mode === 'paraphrase') {
                      const p = currentCard.paraphraseExamples?.[0];
                      isThisCorrect = opt === (p ? p.paraphrased : currentCard.definitionEn);
                    }

                    if (isThisCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                    } else if (selectedAnswer === opt) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold';
                    } else {
                      btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => checkMultipleChoice(opt)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-sm md:text-base">{opt}</span>
                      {isAnswerChecked && (
                        <span>
                          {mode === 'synonym' && opt === (currentCard.synonyms[0]?.targetPhrase || currentCard.word) ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : selectedAnswer === opt ? (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          ) : null}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory feedback upon answer check */}
              {isAnswerChecked && (
                <div className="mt-5 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                  <div className="text-xs font-semibold text-sky-800 dark:text-sky-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Giải thích chi tiết:</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Từ <strong>{currentCard.word}</strong>: {currentCard.definitionVi}.
                    {currentCard.contextNotes && ` Lưu ý: ${currentCard.contextNotes}`}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Câu tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
