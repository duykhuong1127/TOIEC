import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { VocabularyItem, WordClass, CefrLevel, PriorityLevel, UsageLevel, VocabExample } from '../../types';
import { api } from '../../services/api';

interface AddVocabTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddVocabTextModal: React.FC<AddVocabTextModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'quickText' | 'form'>('quickText');

  // Quick Text Input with exact required structure
  const [rawText, setRawText] = useState(
`Từ vựng: EXPEDITE
IPA: /ˌek.spəˈdaɪt/
Loại từ: Verb
Cấp độ: B2
Chủ đề: Purchase & Inventory
Part: Part 5, 7

Nghĩa:
- Tiếng Việt: Đẩy nhanh tiến độ, xúc tiến
- Tiếng Anh: To make an action or process happen more quickly.

3 ví dụ cho từ vựng:
1. Please expedite the shipment of our urgent order. (Vui lòng đẩy nhanh tiến độ giao hàng cho đơn khẩn của chúng tôi.)
2. We must expedite the approval process to meet the client deadline. (Chúng ta phải xúc tiến quy trình phê duyệt để kịp hạn chót của khách hàng.)
3. The supervisor assigned additional staff to expedite the warehouse inventory audit. (Người giám sát đã điều thêm nhân sự để đẩy nhanh cuộc kiểm kê kho hàng.)

Từ đồng nghĩa:
- Speed up: The factory will speed up production to satisfy customer demand. (Nhà máy sẽ đẩy nhanh sản xuất để đáp ứng nhu cầu khách hàng.)
- Accelerate: New government policies aim to accelerate economic expansion. (Các chính sách mới của chính phủ nhằm thúc đẩy tăng trưởng kinh tế.)

Từ trái nghĩa:
- Delay: Inclement weather will delay flight departures this evening. (Thời tiết xấu sẽ làm hoãn các chuyến bay khởi hành tối nay.)
- Postpone: The board decided to postpone the annual conference until next month. (Hội đồng quản trị đã quyết định hoãn hội nghị thường niên sang tháng sau.)`
  );

  // Structured Form States
  const [word, setWord] = useState('EXPEDITE');
  const [ipa, setIpa] = useState('/ˌek.spəˈdaɪt/');
  const [partOfSpeech, setPartOfSpeech] = useState<WordClass>('verb');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>('B2');
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>('Priority 1');
  const [topic, setTopic] = useState('Purchase & Inventory');
  const [toeicPart, setToeicPart] = useState('Part 5, 7');
  const [definitionVi, setDefinitionVi] = useState('Đẩy nhanh tiến độ, xúc tiến');
  const [definitionEn, setDefinitionEn] = useState('To make an action or process happen more quickly.');

  // 3 ví dụ cho từ vựng
  const [examples, setExamples] = useState<VocabExample[]>([
    {
      en: 'Please expedite the shipment of our urgent order.',
      vi: 'Vui lòng đẩy nhanh tiến độ giao hàng cho đơn khẩn của chúng tôi.',
    },
    {
      en: 'We must expedite the approval process to meet the client deadline.',
      vi: 'Chúng ta phải xúc tiến quy trình phê duyệt để kịp hạn chót của khách hàng.',
    },
    {
      en: 'The supervisor assigned additional staff to expedite the warehouse inventory audit.',
      vi: 'Người giám sát đã điều thêm nhân sự để đẩy nhanh cuộc kiểm kê kho hàng.',
    },
  ]);

  // Từ đồng nghĩa kèm ví dụ mỗi từ
  const [synonyms, setSynonyms] = useState<
    Array<{ targetPhrase: string; usageLevel: UsageLevel; context: string; exampleEn: string; exampleVi: string }>
  >([
    {
      targetPhrase: 'Speed up',
      usageLevel: 'Cao',
      context: 'Ngữ cảnh công sở',
      exampleEn: 'The factory will speed up production to satisfy customer demand.',
      exampleVi: 'Nhà máy sẽ đẩy nhanh sản xuất để đáp ứng nhu cầu khách hàng.',
    },
    {
      targetPhrase: 'Accelerate',
      usageLevel: 'Trung bình',
      context: 'Ngữ cảnh tiến độ',
      exampleEn: 'New government policies aim to accelerate economic expansion.',
      exampleVi: 'Các chính sách mới của chính phủ nhằm thúc đẩy tăng trưởng kinh tế.',
    },
  ]);

  // Từ trái nghĩa kèm ví dụ mỗi từ
  const [antonyms, setAntonyms] = useState<
    Array<{ targetPhrase: string; usageLevel: UsageLevel; context: string; exampleEn: string; exampleVi: string }>
  >([
    {
      targetPhrase: 'Delay',
      usageLevel: 'Cao',
      context: 'Trì hoãn lịch trình',
      exampleEn: 'Inclement weather will delay flight departures this evening.',
      exampleVi: 'Thời tiết xấu sẽ làm hoãn các chuyến bay khởi hành tối nay.',
    },
    {
      targetPhrase: 'Postpone',
      usageLevel: 'Cao',
      context: 'Dời sang thời điểm khác',
      exampleEn: 'The board decided to postpone the annual conference until next month.',
      exampleVi: 'Hội đồng quản trị đã quyết định hoãn hội nghị thường niên sang tháng sau.',
    },
  ]);

  const [contextNotes, setContextNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Parser for raw text formatted with:
  // Từ vựng, Nghĩa, 3 ví dụ cho từ vựng, Từ đồng nghĩa & ví dụ, Từ trái nghĩa & ví dụ
  const handleParseText = () => {
    setParseError(null);
    try {
      const lines = rawText.split('\n');
      let parsedWord = '';
      let parsedIpa = '';
      let parsedPos: WordClass = 'verb';
      let parsedCefr: CefrLevel = 'B2';
      let parsedDefVi = '';
      let parsedDefEn = '';
      let parsedTopic = 'General Business';
      let parsedPart = 'Part 5';
      let parsedNotes = '';

      const parsedExamples: VocabExample[] = [];
      const parsedSynonyms: Array<{
        targetPhrase: string;
        usageLevel: UsageLevel;
        context: string;
        exampleEn: string;
        exampleVi: string;
      }> = [];
      const parsedAntonyms: Array<{
        targetPhrase: string;
        usageLevel: UsageLevel;
        context: string;
        exampleEn: string;
        exampleVi: string;
      }> = [];

      let currentSection: 'header' | 'meaning' | 'examples' | 'synonyms' | 'antonyms' = 'header';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const lower = line.toLowerCase();

        // Section detectors
        if (lower.startsWith('nghĩa')) {
          currentSection = 'meaning';
          const colonIdx = line.indexOf(':');
          if (colonIdx !== -1 && line.slice(colonIdx + 1).trim()) {
            parsedDefVi = line.slice(colonIdx + 1).trim();
          }
          continue;
        }

        if (lower.includes('ví dụ cho từ vựng') || lower.startsWith('3 ví dụ')) {
          currentSection = 'examples';
          continue;
        }

        if (lower.startsWith('từ đồng nghĩa') || lower.startsWith('đồng nghĩa')) {
          currentSection = 'synonyms';
          continue;
        }

        if (lower.startsWith('từ trái nghĩa') || lower.startsWith('trái nghĩa')) {
          currentSection = 'antonyms';
          continue;
        }

        // Parse within sections
        if (currentSection === 'header') {
          const colonIdx = line.indexOf(':');
          if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim().toLowerCase();
            const val = line.slice(colonIdx + 1).trim();

            if (key.includes('từ') || key === 'word') {
              parsedWord = val.toUpperCase();
            } else if (key === 'ipa' || key.includes('phiên âm')) {
              parsedIpa = val;
            } else if (key.includes('loại từ') || key === 'pos') {
              const valLower = val.toLowerCase();
              if (valLower.includes('noun') || valLower.includes('danh')) parsedPos = 'noun';
              else if (valLower.includes('adj') || valLower.includes('tính')) parsedPos = 'adjective';
              else if (valLower.includes('adv') || valLower.includes('trạng')) parsedPos = 'adverb';
              else if (valLower.includes('phrase') || valLower.includes('cụm')) parsedPos = 'phrase';
              else parsedPos = 'verb';
            } else if (key.includes('cấp độ') || key.includes('cefr')) {
              parsedCefr = (val.toUpperCase() as CefrLevel) || 'B2';
            } else if (key.includes('chủ đề') || key === 'topic') {
              parsedTopic = val;
            } else if (key.includes('part') || key.includes('phần')) {
              parsedPart = val;
            } else if (key.includes('lưu ý') || key.includes('ghi chú')) {
              parsedNotes = val;
            }
          }
        } else if (currentSection === 'meaning') {
          const colonIdx = line.indexOf(':');
          if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim().toLowerCase();
            const val = line.slice(colonIdx + 1).trim();
            if (key.includes('việt') || key.includes('nghĩa')) {
              parsedDefVi = val;
            } else if (key.includes('anh') || key.includes('en') || key.includes('giải thích')) {
              parsedDefEn = val;
            }
          } else if (!parsedDefVi) {
            parsedDefVi = line.replace(/^[-*•]\s*/, '').trim();
          }
        } else if (currentSection === 'examples') {
          // Parse lines like: "1. Please expedite the shipment. (Vui lòng đẩy nhanh...)"
          const cleaned = line.replace(/^(\d+[\.\)]|[-*•])\s*/, '').trim();
          const match = cleaned.match(/^([^(]+)(?:\(([^)]+)\))?$/);
          if (match) {
            const exEn = match[1].trim();
            const exVi = (match[2] || '').trim();
            if (exEn) {
              parsedExamples.push({ en: exEn, vi: exVi });
            }
          } else if (cleaned) {
            parsedExamples.push({ en: cleaned, vi: '' });
          }
        } else if (currentSection === 'synonyms') {
          // Parse: "- Speed up: The factory will speed up production. (Nhà máy sẽ...)"
          const cleaned = line.replace(/^[-*•]\s*/, '').trim();
          const colonIdx = cleaned.indexOf(':');
          if (colonIdx !== -1) {
            const targetPhrase = cleaned.slice(0, colonIdx).trim();
            const rest = cleaned.slice(colonIdx + 1).trim();
            const match = rest.match(/^([^(]+)(?:\(([^)]+)\))?$/);
            const exEn = match ? match[1].trim() : rest;
            const exVi = match && match[2] ? match[2].trim() : '';

            if (targetPhrase) {
              parsedSynonyms.push({
                targetPhrase,
                usageLevel: 'Cao',
                context: 'Ngữ cảnh tương đương',
                exampleEn: exEn,
                exampleVi: exVi,
              });
            }
          } else {
            // Comma-separated or bare words
            cleaned.split(',').forEach((p) => {
              const phrase = p.trim();
              if (phrase) {
                parsedSynonyms.push({
                  targetPhrase: phrase,
                  usageLevel: 'Cao',
                  context: 'Ngữ cảnh công sở',
                  exampleEn: `We can ${phrase.toLowerCase()} to fulfill the request.`,
                  exampleVi: `Chúng ta có thể ${phrase.toLowerCase()} để đáp ứng yêu cầu.`,
                });
              }
            });
          }
        } else if (currentSection === 'antonyms') {
          // Parse: "- Delay: Inclement weather will delay departures. (Thời tiết xấu...)"
          const cleaned = line.replace(/^[-*•]\s*/, '').trim();
          const colonIdx = cleaned.indexOf(':');
          if (colonIdx !== -1) {
            const targetPhrase = cleaned.slice(0, colonIdx).trim();
            const rest = cleaned.slice(colonIdx + 1).trim();
            const match = rest.match(/^([^(]+)(?:\(([^)]+)\))?$/);
            const exEn = match ? match[1].trim() : rest;
            const exVi = match && match[2] ? match[2].trim() : '';

            if (targetPhrase) {
              parsedAntonyms.push({
                targetPhrase,
                usageLevel: 'Cao',
                context: 'Ngữ cảnh đối lập',
                exampleEn: exEn,
                exampleVi: exVi,
              });
            }
          } else {
            cleaned.split(',').forEach((p) => {
              const phrase = p.trim();
              if (phrase) {
                parsedAntonyms.push({
                  targetPhrase: phrase,
                  usageLevel: 'Cao',
                  context: 'Ngữ cảnh đối lập',
                  exampleEn: `They chose not to ${phrase.toLowerCase()} at this time.`,
                  exampleVi: `Họ chọn không ${phrase.toLowerCase()} vào thời điểm này.`,
                });
              }
            });
          }
        }
      }

      if (!parsedWord || !parsedDefVi) {
        setParseError('Không nhận diện được Từ vựng hoặc Nghĩa tiếng Việt. Vui lòng kiểm tra lại văn bản.');
        return;
      }

      // Ensure 3 examples
      while (parsedExamples.length < 3) {
        const idx = parsedExamples.length + 1;
        parsedExamples.push({
          en: `Example ${idx}: Employees should be familiar with "${parsedWord.toLowerCase()}".`,
          vi: `Ví dụ ${idx}: Nhân viên nên làm quen với từ "${parsedWord.toLowerCase()}".`,
        });
      }

      // Populate Form states
      setWord(parsedWord);
      setIpa(parsedIpa || `/${parsedWord.toLowerCase()}/`);
      setPartOfSpeech(parsedPos);
      setCefrLevel(parsedCefr);
      setTopic(parsedTopic);
      setToeicPart(parsedPart);
      setDefinitionVi(parsedDefVi);
      setDefinitionEn(parsedDefEn || parsedDefVi);
      setExamples(parsedExamples.slice(0, 3));
      if (parsedSynonyms.length > 0) setSynonyms(parsedSynonyms);
      if (parsedAntonyms.length > 0) setAntonyms(parsedAntonyms);
      if (parsedNotes) setContextNotes(parsedNotes);

      // Switch to Form tab to review
      setActiveTab('form');
    } catch (e: any) {
      setParseError('Lỗi khi phân tích: ' + e.message);
    }
  };

  const handleSaveFlashcard = async () => {
    if (!word.trim() || !definitionVi.trim()) {
      alert('Vui lòng nhập Từ vựng và Nghĩa tiếng Việt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedExamples = examples.map((ex, idx) => ({
        en: ex.en.trim() || `Example sentence ${idx + 1} with ${word.trim()}.`,
        vi: ex.vi.trim() || definitionVi.trim(),
      }));

      const newCard: VocabularyItem = {
        id: `vocab-${Date.now()}-${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        word: word.trim().toUpperCase(),
        ipa: ipa.trim() || `/${word.toLowerCase()}/`,
        partOfSpeech,
        cefrLevel,
        priorityLevel,
        definitionVi: definitionVi.trim(),
        definitionEn: definitionEn.trim() || definitionVi.trim(),
        exampleEn: sanitizedExamples[0]?.en || `Usage of ${word}.`,
        exampleVi: sanitizedExamples[0]?.vi || definitionVi.trim(),
        examples: sanitizedExamples,
        topic,
        toeicPart,
        sourceDoc: 'User Added Text',
        contextNotes: contextNotes.trim() || undefined,
        synonyms: synonyms
          .filter((s) => s.targetPhrase.trim())
          .map((s, idx) => ({
            id: `syn-${Date.now()}-${idx}`,
            targetPhrase: s.targetPhrase.trim(),
            relationType: 'synonym',
            context: s.context || 'Ngữ cảnh công sở',
            usageLevel: s.usageLevel,
            priority: 'Priority 1',
            supportingExample: s.exampleEn || `Example with ${s.targetPhrase}`,
            supportingExampleVi: s.exampleVi || `Ví dụ với ${s.targetPhrase}`,
            interchangeability: 'conditional',
            verificationStatus: 'verified',
          })),
        antonyms: antonyms
          .filter((a) => a.targetPhrase.trim())
          .map((a, idx) => ({
            id: `ant-${Date.now()}-${idx}`,
            targetPhrase: a.targetPhrase.trim(),
            relationType: 'antonym',
            context: a.context || 'Ngữ cảnh đối lập',
            usageLevel: a.usageLevel,
            priority: 'Priority 1',
            supportingExample: a.exampleEn || `Opposite of ${word}`,
            supportingExampleVi: a.exampleVi || `Trái nghĩa với ${word}`,
            interchangeability: 'conditional',
            verificationStatus: 'verified',
          })),
        collocations: [],
        wordFamily: {},
        paraphraseExamples: [
          {
            original: sanitizedExamples[0]?.en || `We will ${word.toLowerCase()}.`,
            paraphrased: synonyms[0]?.targetPhrase
              ? (sanitizedExamples[0]?.en || '').replace(new RegExp(word, 'gi'), synonyms[0].targetPhrase)
              : sanitizedExamples[0]?.en || '',
            vietnamese: sanitizedExamples[0]?.vi || definitionVi,
          },
        ],
      };

      await api.addVocabulary(newCard);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to add vocabulary:', err);
      alert('Lỗi khi thêm từ vựng: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white">
                Thêm Flashcard Từ vựng theo Cấu trúc chuẩn
              </h3>
              <p className="text-xs text-slate-500">
                Từ vựng ➔ Nghĩa ➔ 3 Ví dụ ➔ Từ đồng nghĩa & Ví dụ ➔ Từ trái nghĩa & Ví dụ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('quickText')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quickText'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Nhập văn bản nhanh (Quick Text Paste)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Biểu mẫu chi tiết từng mục (Form View)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'quickText' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900/40 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Cấu trúc chuẩn Flashcard:</span>
                </div>
                <p className="leading-relaxed">
                  Dán hoặc gõ văn bản theo cấu trúc: <strong>Từ vựng</strong>, <strong>Nghĩa</strong>,{' '}
                  <strong>3 ví dụ cho từ vựng</strong> (có bản dịch), <strong>Từ đồng nghĩa & Ví dụ</strong>,{' '}
                  <strong>Từ trái nghĩa & Ví dụ</strong>. Hệ thống sẽ tự động bóc tách thành flashcard hoàn chỉnh!
                </p>
              </div>

              {parseError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                  Soạn thảo hoặc dán nội dung từ vựng:
                </label>
                <textarea
                  rows={14}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleParseText}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Phân tích văn bản & Xem thẻ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-xs">
              {/* 1. TỪ VỰNG */}
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-sky-800 dark:text-sky-300">
                  1. Từ vựng & Thuộc tính cơ bản
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Từ vựng tiếng Anh (*)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: POSTPONE"
                      value={word}
                      onChange={(e) => setWord(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Phiên âm IPA
                    </label>
                    <input
                      type="text"
                      placeholder="VD: /pəˈspoʊn/"
                      value={ipa}
                      onChange={(e) => setIpa(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Loại từ (Part of Speech)
                    </label>
                    <select
                      value={partOfSpeech}
                      onChange={(e: any) => setPartOfSpeech(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    >
                      <option value="verb">Verb (Động từ)</option>
                      <option value="noun">Noun (Danh từ)</option>
                      <option value="adjective">Adjective (Tính từ)</option>
                      <option value="adverb">Adverb (Trạng từ)</option>
                      <option value="phrase">Phrase (Cụm từ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Cấp độ CEFR
                    </label>
                    <select
                      value={cefrLevel}
                      onChange={(e: any) => setCefrLevel(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Độ ưu tiên TOEIC
                    </label>
                    <select
                      value={priorityLevel}
                      onChange={(e: any) => setPriorityLevel(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    >
                      <option value="Priority 1">Priority 1 (Rất nên học)</option>
                      <option value="Priority 2">Priority 2 (Nên học)</option>
                      <option value="Priority 3">Priority 3 (Mở rộng)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Chủ đề
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    >
                      <option value="Meetings & Schedules">Meetings & Schedules</option>
                      <option value="Purchase & Inventory">Purchase & Inventory</option>
                      <option value="Financial & Budgeting">Financial & Budgeting</option>
                      <option value="Personnel">Personnel</option>
                      <option value="Office Issues">Office Issues</option>
                      <option value="Management Issues">Management Issues</option>
                      <option value="General Business">General Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Xuất hiện ở Part
                    </label>
                    <input
                      type="text"
                      value={toeicPart}
                      onChange={(e) => setToeicPart(e.target.value)}
                      placeholder="VD: Part 5, 7"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. NGHĨA */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  2. Nghĩa của từ
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Nghĩa tiếng Việt (*)
                    </label>
                    <input
                      type="text"
                      required
                      value={definitionVi}
                      onChange={(e) => setDefinitionVi(e.target.value)}
                      placeholder="VD: Đẩy nhanh tiến độ, xúc tiến"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Định nghĩa tiếng Anh
                    </label>
                    <input
                      type="text"
                      value={definitionEn}
                      onChange={(e) => setDefinitionEn(e.target.value)}
                      placeholder="VD: To make an action happen more quickly."
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 3 VÍ DỤ CHO TỪ VỰNG */}
              <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                    3. 3 Ví dụ cho từ vựng (Bắt buộc 3 câu có bản dịch)
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600">3 ví dụ</span>
                </div>

                {examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-2"
                  >
                    <div className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                      Ví dụ {idx + 1}:
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder={`Câu ví dụ tiếng Anh ${idx + 1}`}
                        value={ex.en}
                        onChange={(e) => {
                          const copy = [...examples];
                          copy[idx].en = e.target.value;
                          setExamples(copy);
                        }}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white italic"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder={`Bản dịch tiếng Việt cho ví dụ ${idx + 1}`}
                        value={ex.vi}
                        onChange={(e) => {
                          const copy = [...examples];
                          copy[idx].vi = e.target.value;
                          setExamples(copy);
                        }}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. TỪ ĐỒNG NGHĨA & VÍ DỤ */}
              <div className="p-4 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    4. Từ đồng nghĩa & Ví dụ mỗi từ đồng nghĩa
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSynonyms((prev) => [
                        ...prev,
                        {
                          targetPhrase: '',
                          usageLevel: 'Cao',
                          context: 'Ngữ cảnh tương đương',
                          exampleEn: '',
                          exampleVi: '',
                        },
                      ])
                    }
                    className="text-teal-700 dark:text-teal-400 font-bold hover:underline"
                  >
                    + Thêm từ đồng nghĩa
                  </button>
                </div>

                {synonyms.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-teal-100 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Từ đồng nghĩa (VD: Speed up)"
                        value={s.targetPhrase}
                        onChange={(e) => {
                          const copy = [...synonyms];
                          copy[idx].targetPhrase = e.target.value;
                          setSynonyms(copy);
                        }}
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white font-bold"
                      />
                      <select
                        value={s.usageLevel}
                        onChange={(e: any) => {
                          const copy = [...synonyms];
                          copy[idx].usageLevel = e.target.value;
                          setSynonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white text-xs"
                      >
                        <option value="Cao">Tần suất: Cao</option>
                        <option value="Trung bình">Tần suất: Trung bình</option>
                        <option value="Thấp">Tần suất: Thấp</option>
                      </select>
                      {synonyms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSynonyms(synonyms.filter((_, i) => i !== idx))}
                          className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Ví dụ tiếng Anh cho từ đồng nghĩa này"
                        value={s.exampleEn}
                        onChange={(e) => {
                          const copy = [...synonyms];
                          copy[idx].exampleEn = e.target.value;
                          setSynonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white italic text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Bản dịch tiếng Việt cho ví dụ này"
                        value={s.exampleVi}
                        onChange={(e) => {
                          const copy = [...synonyms];
                          copy[idx].exampleVi = e.target.value;
                          setSynonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. TỪ TRÁI NGHĨA & VÍ DỤ */}
              <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    5. Từ trái nghĩa & Ví dụ mỗi từ trái nghĩa
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAntonyms((prev) => [
                        ...prev,
                        {
                          targetPhrase: '',
                          usageLevel: 'Cao',
                          context: 'Ngữ cảnh đối lập',
                          exampleEn: '',
                          exampleVi: '',
                        },
                      ])
                    }
                    className="text-rose-700 dark:text-rose-400 font-bold hover:underline"
                  >
                    + Thêm từ trái nghĩa
                  </button>
                </div>

                {antonyms.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Từ trái nghĩa (VD: Delay)"
                        value={a.targetPhrase}
                        onChange={(e) => {
                          const copy = [...antonyms];
                          copy[idx].targetPhrase = e.target.value;
                          setAntonyms(copy);
                        }}
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white font-bold text-rose-700 dark:text-rose-300"
                      />
                      <select
                        value={a.usageLevel}
                        onChange={(e: any) => {
                          const copy = [...antonyms];
                          copy[idx].usageLevel = e.target.value;
                          setAntonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white text-xs"
                      >
                        <option value="Cao">Tần suất: Cao</option>
                        <option value="Trung bình">Tần suất: Trung bình</option>
                        <option value="Thấp">Tần suất: Thấp</option>
                      </select>
                      {antonyms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setAntonyms(antonyms.filter((_, i) => i !== idx))}
                          className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Ví dụ tiếng Anh cho từ trái nghĩa này"
                        value={a.exampleEn}
                        onChange={(e) => {
                          const copy = [...antonyms];
                          copy[idx].exampleEn = e.target.value;
                          setAntonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white italic text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Bản dịch tiếng Việt cho ví dụ này"
                        value={a.exampleVi}
                        onChange={(e) => {
                          const copy = [...antonyms];
                          copy[idx].exampleVi = e.target.value;
                          setAntonyms(copy);
                        }}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border rounded-lg dark:text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('quickText')}
                  className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                >
                  ← Trở lại nhập văn bản
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSaveFlashcard}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu Flashcard mới'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
