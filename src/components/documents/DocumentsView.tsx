import React, { useState } from 'react';
import {
  FolderArchive,
  FileCheck2,
  FilePlus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Upload,
  Search,
  BookOpen,
} from 'lucide-react';
import { SourceDocumentInfo, VocabularyItem } from '../../types';

interface DocumentsViewProps {
  documents: SourceDocumentInfo[];
  onAddCustomWord: (item: Partial<VocabularyItem>) => Promise<any>;
  onRefresh: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddCustomWord,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newPos, setNewPos] = useState<'verb' | 'noun' | 'adjective' | 'adverb'>('verb');
  const [newDefVi, setNewDefVi] = useState('');
  const [newDefEn, setNewDefEn] = useState('');
  const [newExEn, setNewExEn] = useState('');
  const [newExVi, setNewExVi] = useState('');
  const [newSynonym, setNewSynonym] = useState('');
  const [newAntonym, setNewAntonym] = useState('');
  const [selectedDocCode, setSelectedDocCode] = useState('TOEIC-003');

  const handleCreateVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newDefVi || !newExEn) {
      alert('Vui lòng điền đầy đủ từ tiếng Anh, nghĩa tiếng Việt và câu ví dụ.');
      return;
    }

    await onAddCustomWord({
      id: `vocab-${Date.now()}`,
      word: newWord.toUpperCase().trim(),
      ipa: newIpa || '/.../',
      partOfSpeech: newPos,
      cefrLevel: 'B1',
      priorityLevel: 'Priority 1',
      definitionVi: newDefVi,
      definitionEn: newDefEn || newDefVi,
      exampleEn: newExEn,
      exampleVi: newExVi || newDefVi,
      examples: [
        { en: newExEn, vi: newExVi || newDefVi },
        {
          en: `Staff members should note how "${newWord.trim()}" is used in formal documents.`,
          vi: `Nhân viên nên lưu ý cách dùng "${newWord.trim()}" trong văn bản trang trọng.`,
        },
        {
          en: `The department successfully applied the instructions regarding "${newWord.trim()}".`,
          vi: `Phòng ban đã áp dụng thành công các hướng dẫn liên quan đến "${newWord.trim()}".`,
        },
      ],
      topic: 'General Business',
      toeicPart: 'Part 5',
      sourceDoc: selectedDocCode,
      synonyms: newSynonym
        ? [
            {
              id: `syn-${Date.now()}`,
              targetPhrase: newSynonym,
              relationType: 'synonym',
              context: 'Ngữ cảnh công sở chuẩn hóa',
              usageLevel: 'Cao',
              priority: 'Priority 1',
              supportingExample: newExEn,
              interchangeability: 'conditional',
              verificationStatus: 'verified',
            },
          ]
        : [],
      antonyms: newAntonym
        ? [
            {
              id: `ant-${Date.now()}`,
              targetPhrase: newAntonym,
              relationType: 'antonym',
              context: 'Ngữ cảnh đối lập',
              usageLevel: 'Cao',
              priority: 'Priority 1',
              supportingExample: `Opposite of ${newWord}`,
              interchangeability: 'conditional',
              verificationStatus: 'verified',
            },
          ]
        : [],
      collocations: [],
      wordFamily: {},
    });

    setShowAddModal(false);
    setNewWord('');
    setNewIpa('');
    setNewDefVi('');
    setNewDefEn('');
    setNewExEn('');
    setNewExVi('');
    setNewSynonym('');
    setNewAntonym('');
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Document Library & Content Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quản trị Tài liệu & Chuẩn hóa Dữ liệu
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Quản lý nguồn gốc học liệu từ 5 bộ tài liệu TOEIC-001 đến TOEIC-005. Tuân thủ 10 quy tắc nhập liệu bắt buộc và kiểm duyệt trước khi công bố.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span>Thêm từ vựng vào kiểm duyệt</span>
        </button>
      </div>

      {/* 10 Ingestion Rules Compliance Callout */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>10 Quy tắc Nhập liệu Bắt buộc (Mục 2.2):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
          <div>1. Chỉ nhập dữ liệu có trong tài liệu thực tế hoặc tạo mới có ghi rõ nguồn.</div>
          <div>2. Không tự bịa những trang hoặc từ vựng chưa được cung cấp.</div>
          <div>3. Giữ thông tin nguồn gốc, số trang, số mục chuẩn xác.</div>
          <div>4. Phát hiện và sửa lỗi chính tả, phiên âm IPA, ngữ pháp trước khi duyệt.</div>
          <div>5. Các từ đồng nghĩa trong tài liệu phải được kiểm chứng lại theo ngữ cảnh.</div>
          <div>6. Không coi các mẹo có xác suất 85%, 95% là quy tắc đúng 100%.</div>
        </div>
      </div>

      {/* 5 Source Documents Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.code}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {doc.code}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Đã kiểm duyệt</span>
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Quy mô: {doc.totalPages} trang</span>
              <span>Đã chuẩn hóa: {doc.verifiedCount} mục</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Thêm từ vựng mới vào hàng đợi kiểm duyệt
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVocab} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Từ tiếng Anh (*)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NEGOTIATE"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Phiên âm IPA
                  </label>
                  <input
                    type="text"
                    placeholder="VD: /nɪˈɡoʊ.ʃi.eɪt/"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Loại từ
                  </label>
                  <select
                    value={newPos}
                    onChange={(e: any) => setNewPos(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                  >
                    <option value="verb">Verb (Động từ)</option>
                    <option value="noun">Noun (Danh từ)</option>
                    <option value="adjective">Adjective (Tính từ)</option>
                    <option value="adverb">Adverb (Trạng từ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Bộ tài liệu nguồn
                  </label>
                  <select
                    value={selectedDocCode}
                    onChange={(e) => setSelectedDocCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                  >
                    <option value="TOEIC-003">TOEIC-003 Từ vựng</option>
                    <option value="TOEIC-004">TOEIC-004 Synonyms</option>
                    <option value="TOEIC-005">TOEIC-005 Part 7</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Nghĩa tiếng Việt chuẩn (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đàm phán, thương lượng hợp đồng."
                  value={newDefVi}
                  onChange={(e) => setNewDefVi(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Câu ví dụ tiếng Anh (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: The two companies negotiated a favorable contract."
                  value={newExEn}
                  onChange={(e) => setNewExEn(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Từ đồng nghĩa (Synonym)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bargain, discuss"
                    value={newSynonym}
                    onChange={(e) => setNewSynonym(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Từ trái nghĩa (Antonym)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Refuse"
                    value={newAntonym}
                    onChange={(e) => setNewAntonym(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Lưu & Xuất bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
