import React, { useState, useEffect } from 'react';
import { type CalendarEvent, type EventType } from './calendar.types';
import { calculateTop, calculateHeight } from './calendar.utils';
import { AvatarStack } from './AvatarStack';
import { TEACHERS, CLASSROOMS } from './calendar.constants';
import { AlertCircle, MoreVertical, Copy, Trash2, Edit2, Link as LinkIcon, User, Home } from 'lucide-react';
import { cn } from '@/shared/lib';

interface CalendarEventCardProps {
  readonly event: CalendarEvent;
  readonly selected?: boolean;
  readonly onClick?: (event: CalendarEvent) => void;
  readonly onDelete?: (eventId: string) => void;
}

const variantStyles: Record<EventType, string> = {
  meeting: 'bg-primary/[0.03] border-primary/20 text-primary hover:bg-primary/[0.05]',
  class: 'bg-info/[0.03] border-info/20 text-info hover:bg-info/[0.05]',
  exam: 'bg-warning/[0.03] border-warning/20 text-warning hover:bg-warning/[0.05]',
  reminder: 'bg-success/[0.03] border-success/20 text-success hover:bg-success/[0.05]',
  holiday: 'bg-secondary/[0.03] border-secondary/20 text-secondary hover:bg-secondary/[0.05]',
  cancelled: 'bg-destructive/[0.02] border-destructive/10 text-destructive line-through opacity-60 hover:opacity-75',
  interview: 'bg-primary/[0.03] border-primary/25 text-primary hover:bg-primary/[0.05]',
  lesson: 'bg-info/[0.03] border-info/25 text-info hover:bg-info/[0.05]',
  task: 'bg-success/[0.03] border-success/25 text-success hover:bg-success/[0.05]',
  blocked: 'bg-muted/30 border-border/40 text-muted-foreground/75 cursor-not-allowed',
  travel: 'bg-amber-500/[0.03] border-amber-500/20 text-amber-700 hover:bg-amber-500/[0.05]',
  pending: 'bg-yellow-500/[0.03] border-yellow-500/20 text-yellow-700 animate-pulse',
  completed: 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-700 opacity-90',
};

export function CalendarEventCard({ event, selected = false, onClick, onDelete }: CalendarEventCardProps) {
  const top = calculateTop(event.rowStart);
  const height = calculateHeight(event.rowStart, event.rowEnd);
  
  const [showPeek, setShowPeek] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const styleClass = variantStyles[event.type] || variantStyles.meeting;
  const isDetailed = height > 64;

  const teacher = TEACHERS.find(t => t.id === event.teacherId);
  const classroom = CLASSROOMS.find(c => c.id === event.classroomId);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ top: e.clientY, left: e.clientX });
    setMenuOpen(true);
  };

  return (
    <>
      <article
        tabIndex={0}
        role="button"
        aria-selected={selected}
        aria-label={`${event.type} event: ${event.title}`}
        onClick={() => onClick?.(event)}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setShowPeek(true)}
        onMouseLeave={() => setShowPeek(false)}
        className={cn(
          "absolute left-2 right-2 p-3 flex flex-col justify-between transition-all duration-150 rounded-[14px] border shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 select-none",
          selected ? "ring-2 ring-primary border-transparent shadow-sm" : "border-border",
          styleClass
        )}
        style={{ top: `${top + 10}px`, height: `${height - 12}px` }}
      >
        <div className="space-y-1 min-w-0">
          <h3 className="font-bold text-[13px] leading-snug truncate">{event.title}</h3>
          <p className="text-[12px] font-semibold opacity-85 leading-none">{event.time}</p>
        </div>

        {isDetailed && (
          <footer className="space-y-1.5 mt-2 pt-2 border-t border-border-muted/10 flex items-center justify-between">
            {event.platform ? (
              <span className="text-[11px] font-bold text-muted-foreground truncate max-w-[100px]">{event.platform}</span>
            ) : (
              <span className="text-[11px] font-bold text-muted-foreground truncate">{classroom?.name || 'Online'}</span>
            )}
            <AvatarStack avatars={event.avatars} max={3} />
          </footer>
        )}

        {/* Hover Peek Details Popover */}
        {showPeek && !menuOpen && (
          <div 
            className="absolute left-full ml-2 top-0 w-60 bg-popover text-popover-foreground border border-border shadow-lg rounded-xl p-4 z-40 space-y-3 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-100"
            role="tooltip"
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-primary leading-none">{event.type}</h4>
            <h3 className="text-xs font-extrabold text-foreground leading-snug">{event.title}</h3>
            
            <div className="space-y-1.5 text-[11px] font-semibold text-muted-foreground">
              <p className="flex items-center gap-1.5"><ClockIcon /> {event.date} ({event.time})</p>
              <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> GV: {teacher?.name}</p>
              <p className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Room: {classroom?.name}</p>
              {event.platform && <p className="flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> {event.platform}</p>}
            </div>
            
            <div className="text-[10px] font-bold bg-muted/40 px-2 py-1 rounded text-muted-foreground flex items-center gap-1 justify-between">
              <span>Attendees: {event.students.length} / {event.maxCapacity}</span>
              {event.students.length > event.maxCapacity && <AlertCircle className="h-3 w-3 text-destructive" />}
            </div>
          </div>
        )}
      </article>

      {/* Right Click Context Menu (Rendered Absolute at click pos) */}
      {menuOpen && (
        <div 
          className="fixed bg-popover border border-border shadow-lg rounded-lg py-1 z-50 w-40 text-xs font-semibold text-foreground animate-in fade-in-50 zoom-in-95 duration-100"
          style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          role="menu"
        >
          <button 
            type="button" 
            className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2"
            onClick={() => onClick?.(event)}
            role="menuitem"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" /> Open Details
          </button>
          <button 
            type="button" 
            className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center gap-2 text-destructive"
            onClick={() => onDelete?.(event.id)}
            role="menuitem"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete event
          </button>
        </div>
      )}
    </>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
