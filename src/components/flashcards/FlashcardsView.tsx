import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Play,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Brain,
  Headphones,
  Flame,
  ArrowRight,
  BookOpen,
  FilePlus,
  Trash2,
} from 'lucide-react';
import { VocabularyItem, ReviewRating } from '../../types';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardStudyModal } from './FlashcardStudyModal';
import { AddVocabTextModal } from './AddVocabTextModal';
import { api } from '../../services/api';

interface FlashcardsViewProps {
  cards: VocabularyItem[];
  onRating: (vocabId: string, rating: ReviewRating) => void;
  onToggleBookmark: (vocabId: string) => void;
  onRefresh: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  onRating,
  onToggleBookmark,
  onRefresh,
}) => {
  const [activeStudyMode, setActiveStudyMode] = useState<string | null>(null);
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedPart, setSelectedPart] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  React.useEffect(() => {
    setVisibleCount(25);
  }, [selectedTopic, selectedPart, searchQuery, filterBookmarkedOnly]);

  const [showDeduplicateModal, setShowDeduplicateModal] = useState(false);
  const [isDeduplicating, setIsDeduplicating] = useState(false);
  const [deduplicateResult, setDeduplicateResult] = useState<{ removedCount: number; duplicateWords: string[] } | null>(null);
  const [deduplicateError, setDeduplicateError] = useState<string | null>(null);

  // Compute metrics
  const now = new Date();
  const dueCount = cards.filter(
    (c) => c.review?.nextReviewAt && new Date(c.review.nextReviewAt) <= now
  ).length;
  const masteredCount = cards.filter((c) => c.review?.state === 'mastered').length;
  const bookmarkedCount = cards.filter((c) => c.review?.isBookmarked).length;

  // Compute local duplicates count & lists
  const wordCountMap = new Map<string, number>();
  cards.forEach((c) => {
    const w = (c.word || '').trim().toUpperCase();
    if (w) wordCountMap.set(w, (wordCountMap.get(w) || 0) + 1);
  });
  let duplicateCount = 0;
  const duplicateWordsList: string[] = [];
  wordCountMap.forEach((count, wordKey) => {
    if (count > 1) {
      duplicateCount += count - 1;
      duplicateWordsList.push(wordKey);
    }
  });

  const handleOpenDeduplicateModal = () => {
    setDeduplicateResult(null);
    setDeduplicateError(null);
    setShowDeduplicateModal(true);
  };

  const handleExecuteDeduplicate = async () => {
    setIsDeduplicating(true);
    setDeduplicateError(null);
    try {
      const result = await api.removeDuplicateVocabulary();
      setDeduplicateResult(result);
      onRefresh();
    } catch (err: any) {
      setDeduplicateError('Lỗi khi xóa từ trùng lặp: ' + err.message);
    } finally {
      setIsDeduplicating(false);
    }
  };

  // Filtered card list
  const filteredCards = cards.filter((c) => {
    if (selectedTopic !== 'all' && !c.topic.toLowerCase().includes(selectedTopic.toLowerCase())) {
      return false;
    }
    if (selectedPart !== 'all' && !c.toeicPart.toLowerCase().includes(selectedPart.toLowerCase())) {
      return false;
    }
    if (filterBookmarkedOnly && !c.review?.isBookmarked) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchWord = c.word.toLowerCase().includes(q);
      const matchVi = c.definitionVi.toLowerCase().includes(q);
      const matchSyn = c.synonyms.some((s) => s.targetPhrase.toLowerCase().includes(q));
      if (!matchWord && !matchVi && !matchSyn) return false;
    }
    return true;
  });

  const topics = [
    { id: 'all', label: 'Tất cả chủ đề' },
    { id: 'general', label: 'General Business' },
    { id: 'meetings', label: 'Meetings & Schedules' },
    { id: 'purchase', label: 'Purchase & Inventory' },
    { id: 'financial', label: 'Financial & Budgeting' },
    { id: 'personnel', label: 'Personnel & HR' },
    { id: 'office', label: 'Office Issues' },
    { id: 'management', label: 'Management' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Module Flashcards Hai Mặt (Quizlet + Study4 Standard)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kho Flashcards & Luyện Trí Nhớ FSRS
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Phân tích chuyên sâu từ đồng nghĩa, trái nghĩa, paraphrasing và tần suất xuất hiện thực tế trong đề thi TOEIC ETS.
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddTextModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <FilePlus className="w-3.5 h-3.5 text-sky-600" />
            <span>+ Thêm từ vựng bằng Text</span>
          </button>

          <button
            onClick={handleOpenDeduplicateModal}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-rose-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95 ${
              duplicateCount > 0 ? 'border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 bg-rose-50/50' : ''
            }`}
            title="Dọn dẹp và xóa các bản ghi từ vựng bị trùng lặp"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Xóa từ trùng lặp {duplicateCount > 0 ? `(${duplicateCount})` : ''}</span>
          </button>

          <button
            onClick={() => setActiveStudyMode('review')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Bắt đầu ôn tập ({dueCount} từ)</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng số thẻ từ</div>
          <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {cards.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Từ vựng chuẩn hóa</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Cần ôn hôm nay</div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {dueCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Theo Spaced Repetition</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Đã thuộc (Mastered)</div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {masteredCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Khoảng cách &gt; 7 ngày</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Đánh dấu sao</div>
          <div className="text-2xl md:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
            {bookmarkedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần chú ý đặc biệt</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm từ tiếng Anh, nghĩa tiếng Việt, từ đồng nghĩa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter bookmarked toggle */}
            <button
              onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterBookmarkedOnly
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${filterBookmarkedOnly ? 'fill-amber-500' : ''}`} />
              <span>Chỉ từ gắn sao</span>
            </button>
          </div>
        </div>

        {/* Topic filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === t.id
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Flashcard Cards Showcase & Practice */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Danh sách thẻ từ vựng ({filteredCards.length} thẻ)</span>
          </h2>
          <span className="text-xs text-slate-500">Nhấp vào thẻ để lật xem mặt sau</span>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Không tìm thấy từ vựng phù hợp với bộ lọc.</p>
            <button
              onClick={() => {
                setSelectedTopic('all');
                setSearchQuery('');
                setFilterBookmarkedOnly(false);
              }}
              className="mt-3 text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCards.slice(0, visibleCount).map((card, idx) => (
              <FlashcardCard
                key={card.id || `card-${card.word}-${idx}`}
                card={card}
                onRating={onRating}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={!!card.review?.isBookmarked}
              />
            ))}

            {visibleCount < filteredCards.length && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium">
                  Đang hiển thị {Math.min(visibleCount, filteredCards.length)} / {filteredCards.length} thẻ từ vựng
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 25)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer shadow-xs transition-colors"
                  >
                    + Xem thêm 25 thẻ tiếp theo
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredCards.length)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
                  >
                    Xem tất cả ({filteredCards.length} thẻ)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Active Study Mode Runner Modal */}
      {activeStudyMode && (
        <FlashcardStudyModal
          mode={activeStudyMode}
          cards={
            activeStudyMode === 'review'
              ? cards.filter((c) => new Date(c.review?.nextReviewAt || 0) <= now).length > 0
                ? cards.filter((c) => new Date(c.review?.nextReviewAt || 0) <= now)
                : cards
              : activeStudyMode === 'difficult'
              ? cards.filter((c) => (c.review?.lapseCount || 0) > 0).length > 0
                ? cards.filter((c) => (c.review?.lapseCount || 0) > 0)
                : cards
              : filteredCards.length > 0
              ? filteredCards
              : cards
          }
          onClose={() => {
            setActiveStudyMode(null);
            onRefresh();
          }}
          onRating={onRating}
          onToggleBookmark={onToggleBookmark}
        />
      )}

      {/* Add Vocabulary by Text Modal */}
      <AddVocabTextModal
        isOpen={showAddTextModal}
        onClose={() => setShowAddTextModal(false)}
        onSuccess={onRefresh}
      />

      {/* Remove Duplicates In-App Modal */}
      {showDeduplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Xóa các từ vựng trùng lặp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dọn dẹp bản ghi thừa & giữ lại bản chuẩn duy nhất
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeduplicateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {deduplicateResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Đã dọn dẹp thành công!</span>
                  </div>
                  <p>
                    Đã xóa tổng cộng <strong>{deduplicateResult.removedCount} từ vựng trùng lặp</strong> khỏi hệ thống.
                  </p>
                  {deduplicateResult.duplicateWords.length > 0 && (
                    <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400">
                      Các từ đã được dọn dẹp: <span className="font-semibold text-slate-900 dark:text-white">{deduplicateResult.duplicateWords.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeduplicateModal(false)}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {duplicateCount > 0 ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
                    <div className="font-bold text-sm flex items-center gap-2 text-amber-800 dark:text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Phát hiện {duplicateCount} bản ghi từ vựng bị trùng lặp:</span>
                    </div>
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl font-mono text-[11px] max-h-28 overflow-y-auto border border-amber-200/60 dark:border-amber-900/60 text-slate-800 dark:text-slate-200">
                      {duplicateWordsList.join(', ')}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Hệ thống sẽ giữ lại 1 thẻ từ vựng chuẩn (ưu tiên giữ thẻ có tiến độ học hoặc lượt gắn sao) và xóa bỏ các thẻ lặp lại thừa.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Kho từ vựng hoàn toàn sạch sẽ!</p>
                    <p className="text-xs text-slate-500 mt-1">Không phát hiện từ vựng nào bị trùng lặp trong hệ thống.</p>
                  </div>
                )}

                {deduplicateError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                    {deduplicateError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeduplicateModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>

                  {duplicateCount > 0 && (
                    <button
                      type="button"
                      disabled={isDeduplicating}
                      onClick={handleExecuteDeduplicate}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeduplicating ? 'Đang dọn dẹp...' : `Xác nhận xóa ${duplicateCount} từ trùng`}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
