import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { AiTutorModal } from './components/tutor/AiTutorModal';
import { api } from './services/api';
import {
  VocabularyItem,
  SourceDocumentInfo,
  ReviewRating,
} from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('flashcards');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('toeic_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState('');
  const [aiTutorContext, setAiTutorContext] = useState<any>(null);

  // Core Data States
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [documents, setDocuments] = useState<SourceDocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Theme synchronization with html class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('toeic_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('toeic_theme', 'light');
    }
  }, [isDarkMode]);

  // Initial Data Fetching
  const loadAllData = async () => {
    try {
      const [vocabData, docsData] =
        await Promise.all([
          api.getVocabulary(),
          api.getDocuments(),
        ]);

      setVocabulary(vocabData);
      setDocuments(docsData);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRating = async (vocabId: string, rating: ReviewRating) => {
    try {
      const updatedReview = await api.submitReview(vocabId, rating);
      setVocabulary((prev) =>
        prev.map((v) => (v.id === vocabId ? { ...v, review: updatedReview.data } : v))
      );
    } catch (err) {
      console.error('Error submitting flashcard rating:', err);
    }
  };

  const handleToggleBookmark = async (vocabId: string) => {
    try {
      const isBookmarked = await api.toggleBookmark(vocabId);
      setVocabulary((prev) =>
        prev.map((v) =>
          v.id === vocabId
            ? { ...v, review: { ...v.review!, isBookmarked } as any }
            : v
        )
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const dueCount = vocabulary.filter(
    (c) => c.review?.nextReviewAt && new Date(c.review.nextReviewAt) <= new Date()
  ).length;

  return (
    <div className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        streak={3}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenAiTutor={() => {
          setAiTutorInitialPrompt('');
          setAiTutorContext(null);
          setIsAiTutorOpen(true);
        }}
        onToggleMobileMenu={() => setIsOpenMobileMenu(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          isOpenMobile={isOpenMobileMenu}
          onCloseMobile={() => setIsOpenMobileMenu(false)}
          dueCount={dueCount}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 overflow-y-auto">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-500">Đang khởi tạo hệ thống...</p>
            </div>
          ) : (
            <>
              {currentView === 'flashcards' && (
                <FlashcardsView
                  cards={vocabulary}
                  onRating={handleRating}
                  onToggleBookmark={handleToggleBookmark}
                  onRefresh={loadAllData}
                />
              )}

              {currentView === 'documents' && (
                <DocumentsView
                  documents={documents}
                  onAddCustomWord={api.addVocabulary}
                  onRefresh={loadAllData}
                />
              )}
            </>
          )}
        </main>
      </div>

      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        initialMessage={aiTutorInitialPrompt}
        context={aiTutorContext}
      />

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 TOEIC MASTER AI</span>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Thuật toán Spaced Repetition FSRS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
