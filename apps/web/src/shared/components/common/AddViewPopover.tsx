import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  BarChart2,
  Clock,
  Columns,
  Grid,
  Kanban,
  LayoutGrid,
  List,
  Newspaper,
  PieChart,
  Plus,
  Table,
} from 'lucide-react';

export type ViewType =
  | 'list'
  | 'board'
  | 'simple'
  | 'overview'
  | 'timeline'
  | 'table'
  | 'chart'
  | 'feed';

export interface ViewOption {
  id: ViewType;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const VIEW_OPTIONS: ViewOption[] = [
  { id: 'list', label: 'List', description: 'List view of items', icon: List },
  { id: 'board', label: 'Board', description: 'Board view of items', icon: Columns },
  { id: 'simple', label: 'Simple', description: 'Gallery view of items', icon: LayoutGrid },
  { id: 'overview', label: 'Overview', description: 'Overview of items', icon: Activity },
  { id: 'timeline', label: 'Timeline', description: 'Timeline of items', icon: Clock },
  { id: 'table', label: 'Table', description: 'Table view of items', icon: Table },
  { id: 'chart', label: 'Chart', description: 'Chart of items', icon: PieChart },
  { id: 'feed', label: 'Feed', description: 'Feed view of items', icon: Newspaper },
];

interface AddViewPopoverProps {
  activeViews: ViewType[];
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onAddView: (view: ViewType) => void;
}

export function AddViewPopover({
  activeViews,
  currentView,
  onSelectView,
  onAddView,
}: AddViewPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (view: ViewType) => {
    if (!activeViews.includes(view)) {
      onAddView(view);
    }
    onSelectView(view);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* View Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>View</span>
      </button>

      {/* Popover Menu (Image 1 input_file_0.png) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Add a new view popover"
          className="absolute left-0 top-full z-50 mt-2 w-[460px] max-w-[90vw] origin-top-left rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-[#181C24] font-sans antialiased animate-in fade-in zoom-in-95 duration-150"
        >
          <header className="mb-3 px-1">
            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Add a new view
            </h3>
          </header>

          {/* 8 Grid Options (2 Columns x 4 Rows) */}
          <div className="grid grid-cols-2 gap-2">
            {VIEW_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isCurrent = currentView === opt.id;
              const isAdded = activeViews.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`group flex items-start gap-3 rounded-xl p-2.5 text-left transition-all duration-150 ${
                    isCurrent
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition group-hover:scale-105 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 ${
                      isCurrent ? 'bg-white font-bold text-gray-900 shadow-2xs dark:bg-gray-800' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {opt.label}
                      </span>
                      {isAdded && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active in bar" />
                      )}
                    </div>
                    <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
