import React from 'react';
import { DAYS } from './calendar.constants';
import { CalendarTimeColumn } from './CalendarTimeColumn';
import { CalendarColumn } from './CalendarColumn';
import { type CalendarEvent } from './calendar.types';
import { getMonthDaysGrid } from './calendar.utils';
import { cn } from '@/shared/lib';

interface CalendarGridProps {
  readonly view: string;
  readonly selectedDate: string; // YYYY-MM-DD
  readonly events: readonly CalendarEvent[];
  readonly selectedEventId?: string;
  readonly onEventClick?: (event: CalendarEvent) => void;
  readonly onDaySelect?: (dateStr: string) => void;
  readonly onEventDelete?: (eventId: string) => void;
  readonly onSlotDoubleClick?: (dayIndex: number, timeStr: string) => void;
}

/**
 * Enterprise calendar grid supporting Day, 3-Days, Week, Month, and Agenda layouts.
 */
export function CalendarGrid({
  view,
  selectedDate,
  events,
  selectedEventId,
  onEventClick,
  onDaySelect,
  onEventDelete,
  onSlotDoubleClick,
}: CalendarGridProps) {
  
  // 1. Day view: Renders single selected day column
  if (view === 'day') {
    const activeDay = DAYS.find(d => d.date === selectedDate) || DAYS[0]!;
    const dayIndex = DAYS.indexOf(activeDay) + 1;
    const dayEvents = events.filter(e => e.date === activeDay.date);

    return (
      <div className="grid grid-cols-6 divide-x divide-border border border-border bg-card rounded-xl overflow-hidden shadow-xs">
        <CalendarTimeColumn />
        <div className="col-span-5 relative">
          <header className="border-b border-border bg-muted/20 text-center py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{activeDay.label}</header>
          <CalendarColumn 
            dayIndex={dayIndex} 
            events={dayEvents} 
            selectedEventId={selectedEventId} 
            onEventClick={onEventClick} 
            onEventDelete={onEventDelete}
            onSlotDoubleClick={onSlotDoubleClick}
          />
        </div>
      </div>
    );
  }

  // 2. 3-Days view: Renders selected day + 2 days ahead
  if (view === '3days') {
    const startIdx = Math.max(0, DAYS.findIndex(d => d.date === selectedDate));
    const activeDays = DAYS.slice(startIdx, startIdx + 3);

    return (
      <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-xs no-scrollbar">
        <div className="min-w-[500px] grid grid-cols-4 divide-x divide-border">
          <CalendarTimeColumn />
          {activeDays.map((day) => {
            const dayIndex = DAYS.indexOf(day) + 1;
            const dayEvents = events.filter(e => e.date === day.date);
            return (
              <div key={day.key} className="relative">
                <header className="border-b border-border bg-muted/20 text-center py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{day.label}</header>
                <CalendarColumn 
                  dayIndex={dayIndex} 
                  events={dayEvents} 
                  selectedEventId={selectedEventId} 
                  onEventClick={onEventClick} 
                  onEventDelete={onEventDelete}
                  onSlotDoubleClick={onSlotDoubleClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Month view: standard 42-day calendar block
  if (view === 'month') {
    const monthDays = getMonthDaysGrid(2027, 0); // January 2027
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-muted/20 text-center py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          {weekdays.map(d => <div key={d} className="font-semibold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-border border-t border-border -mt-px -ml-px">
          {monthDays.map((day, idx) => {
            const isSelected = day.dateStr === selectedDate;
            const dayEvents = events.filter(e => e.date === day.dateStr);

            return (
              <button
                key={`${day.dateStr}-${idx}`}
                type="button"
                onClick={() => onDaySelect?.(day.dateStr)}
                className={cn(
                  "min-h-[96px] p-2 flex flex-col items-stretch text-left transition-colors duration-150 outline-none",
                  day.isCurrentMonth ? "bg-card" : "bg-muted/10 text-muted-foreground/45",
                  isSelected ? "ring-2 ring-primary ring-inset z-10" : "hover:bg-muted/5"
                )}
              >
                <span className={cn("text-[12px] font-bold block mb-1", isSelected ? "text-primary" : "text-muted-foreground")}>
                  {day.dayLabel}
                </span>
                <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                  {dayEvents.map(e => (
                    <div
                      key={e.id}
                      onClick={(ev) => { ev.stopPropagation(); onEventClick?.(e); }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold truncate border bg-primary/[0.03] border-primary/10 text-primary cursor-pointer hover:bg-primary/5 flex items-center justify-between"
                    >
                      <span className="truncate">{e.title}</span>
                      <button
                        type="button"
                        onClick={(ev) => { ev.stopPropagation(); onEventDelete?.(e.id); }}
                        className="text-muted-foreground hover:text-destructive px-0.5"
                        aria-label={`Delete event ${e.title}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. Agenda View / Fallback: List of active events grouped by day
  if (view === 'agenda') {
    return (
      <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden divide-y divide-border p-4 space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground p-6 font-medium">No events scheduled.</p>
        ) : (
          events.map(e => (
            <article 
              key={e.id} 
              onClick={() => onEventClick?.(e)}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-muted/20 px-3 rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{e.date} ({e.time})</span>
                <h4 className="text-sm font-bold text-foreground leading-none">{e.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-full">{e.type}</span>
                <button
                  type="button"
                  onClick={(ev) => { ev.stopPropagation(); onEventDelete?.(e.id); }}
                  className="text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    );
  }

  // 5. Default: Week view (Mon to Fri 5-day grid)
  return (
    <div className="border border-border bg-card shadow-xs rounded-xl overflow-hidden">
      <div className="overflow-x-auto min-w-full no-scrollbar">
        <div className="min-w-[768px]">
          <div className="grid grid-cols-6 border-b border-border bg-muted/20 text-center py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="border-r border-border" />
            {DAYS.map(day => <div key={day.key} className="border-r border-border last:border-r-0 flex items-center justify-center font-semibold">{day.label}</div>)}
          </div>
          <div className="grid grid-cols-6 divide-x divide-border">
            <CalendarTimeColumn />
            {Array.from({ length: 5 }).map((_, idx) => {
              const dayIndex = idx + 1;
              const dayConfig = DAYS[idx]!;
              const dayEvents = events.filter(e => e.date === dayConfig.date);
              return (
                <CalendarColumn 
                  key={dayIndex} 
                  dayIndex={dayIndex} 
                  events={dayEvents} 
                  selectedEventId={selectedEventId} 
                  onEventClick={onEventClick} 
                  onEventDelete={onEventDelete}
                  onSlotDoubleClick={onSlotDoubleClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
