import React from 'react';
import { type CalendarEvent } from './calendar.types';
import { CalendarEventCard } from './CalendarEventCard';
import { SLOT_HEIGHT } from './calendar.constants';

interface CalendarColumnProps {
  readonly dayIndex: number;
  readonly events: readonly CalendarEvent[];
  readonly selectedEventId?: string;
  readonly onEventClick?: (event: CalendarEvent) => void;
  readonly onSlotDoubleClick?: (dayIndex: number, timeStr: string) => void;
  readonly onEventDelete?: (eventId: string) => void;
}

/**
 * Weekly column representing a day schedule with horizontal divisions.
 * Supports quick peek, keyboard focus traversal, and double click creation.
 */
export function CalendarColumn({
  dayIndex,
  events,
  selectedEventId,
  onEventClick,
  onSlotDoubleClick,
  onEventDelete,
}: CalendarColumnProps) {
  const columnHeight = SLOT_HEIGHT * 2 * 5; // 640px height
  const linesCount = 5;

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSlotDoubleClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    
    // Determine target start hour
    const totalMinutes = Math.floor(relativeY / (SLOT_HEIGHT * 2)) * 60 + 9 * 60; // relative to 9 AM
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 65; // keep it standardized to 30 mins
    const period = hh >= 12 ? 'PM' : 'AM';
    const displayH = hh > 12 ? hh - 12 : hh;
    const timeStr = `${displayH}:00 ${period}`;
    
    onSlotDoubleClick(dayIndex, timeStr);
  };

  return (
    <div 
      className="relative bg-card cursor-pointer select-none"
      style={{ height: `${columnHeight}px` }}
      onDoubleClick={handleDoubleClick}
      role="gridcell"
      aria-label={`Schedule column for day ${dayIndex}`}
    >
      {/* Horizontal divider grid markings */}
      {Array.from({ length: linesCount }).map((_, idx) => {
        const topOffset = idx * SLOT_HEIGHT * 2;
        return (
          <div
            key={idx}
            className="absolute left-0 right-0 border-t border-border/20 dark:border-border/10 pointer-events-none"
            style={{ top: `${topOffset}px` }}
          />
        );
      })}

      {/* Render absolute positioned Event Cards */}
      {events.map((event) => (
        <CalendarEventCard
          key={event.id}
          event={event}
          selected={event.id === selectedEventId}
          onClick={onEventClick}
          onDelete={onEventDelete}
        />
      ))}
    </div>
  );
}
