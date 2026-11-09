import React from 'react';
import {
  Sparkles,
  Flame,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  streak: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAiTutor: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  streak,
  isDarkMode,
  onToggleTheme,
  onOpenAiTutor,
  onToggleMobileMenu,
}) => {
  const navItems = [
    { id: 'flashcards', label: 'Flashcards thông minh' },
    { id: 'documents', label: 'Tài liệu & Quản trị' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSelectView('flashcards')}
            className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-600 text-white font-black text-sm shadow-sm">
              TM
            </span>
            <span>TOEIC MASTER AI</span>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & compact utility controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-900/60"
            title={`${streak} ngày học liên tiếp`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="tabular-nums">{streak} ngày</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: AI Tutor */}
          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hỏi AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
