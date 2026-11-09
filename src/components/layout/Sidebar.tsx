import React from 'react';
import {
  Layers,
  FolderArchive,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  dueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  dueCount,
}) => {
  const menuItems = [
    {
      id: 'flashcards',
      label: 'Flashcards thông minh',
      icon: Layers,
      badge: dueCount > 0 ? `${dueCount} cần ôn` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      description: 'Học 2 mặt, FSRS & Thêm từ',
    },
    {
      id: 'documents',
      label: 'Tài liệu & Quản trị',
      icon: FolderArchive,
      description: 'TOEIC-001 đến TOEIC-005',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 shrink-0">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-sky-600" />
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">TOEIC MASTER</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider">
          CHỨC NĂNG CHÍNH
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="rounded-xl p-3 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Spaced Repetition FSRS</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Học tập khoa học với chu kỳ ôn tập tự động theo năng lực.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:block">{content}</aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
