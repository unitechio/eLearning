import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib';

interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly shortcut?: string;
  readonly action: () => void;
}

interface CalendarCommandPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelectView: (view: string) => void;
  readonly onToggleLeftSidebar: () => void;
  readonly onToggleRightSidebar: () => void;
  readonly onQuickAdd: () => void;
}

/**
 * Command palette Spotlight modal search menu (Ctrl+K / Cmd+K).
 * Fully keyboard navigable, allows search execution and calendar controls.
 */
export function CalendarCommandPalette({
  isOpen,
  onClose,
  onSelectView,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onQuickAdd,
}: CalendarCommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: readonly CommandItem[] = [
    { id: 'view-day', label: 'Switch to Day view', category: 'Calendar Views', shortcut: 'D', action: () => onSelectView('day') },
    { id: 'view-3days', label: 'Switch to 3-Days view', category: 'Calendar Views', action: () => onSelectView('3days') },
    { id: 'view-week', label: 'Switch to Week view', category: 'Calendar Views', shortcut: 'W', action: () => onSelectView('week') },
    { id: 'view-month', label: 'Switch to Month view', category: 'Calendar Views', shortcut: 'M', action: () => onSelectView('month') },
    { id: 'view-agenda', label: 'Switch to Agenda view', category: 'Calendar Views', shortcut: 'A', action: () => onSelectView('agenda') },
    { id: 'toggle-left', label: 'Toggle Filters Sidebar', category: 'Sidebar Panels', shortcut: 'L', action: onToggleLeftSidebar },
    { id: 'toggle-right', label: 'Toggle Info Sidebar', category: 'Sidebar Panels', shortcut: 'R', action: onToggleRightSidebar },
    { id: 'quick-add', label: 'Create New Event', category: 'Actions', shortcut: 'C', action: onQuickAdd },
  ] as const;

  // Filter commands by search string
  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          filtered[activeIndex]!.action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filtered, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search Input Box */}
        <div className="flex items-center border-b border-border px-4 py-3 gap-2.5">
          <Search className="h-4.5 w-4.5 text-muted-foreground/60" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveIndex(0); }}
            className="flex-1 bg-transparent border-0 outline-none text-xs focus:ring-0 text-foreground placeholder:text-muted-foreground/50 font-medium"
          />
        </div>

        {/* Command Options List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground p-6 font-medium">No commands found.</p>
          ) : (
            filtered.map((cmd, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => { cmd.action(); onClose(); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs transition-colors font-semibold outline-none",
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                    <span>{cmd.label}</span>
                    <span className="text-[10px] text-muted-foreground/50 font-normal">({cmd.category})</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="font-mono text-[10px] bg-muted/80 border border-border/80 px-1.5 py-0.5 rounded leading-none text-muted-foreground">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
