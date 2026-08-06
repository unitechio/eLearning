import React from 'react';
import { TIME_SLOTS, SLOT_HEIGHT } from './calendar.constants';

/**
 * Renders the vertical time scale column with consistent hour mark indicators.
 */
export function CalendarTimeColumn() {
  const hourHeight = SLOT_HEIGHT * 2; // 128px per hour

  return (
    <div 
      className="flex flex-col text-[12px] font-semibold text-muted-foreground/75 py-4 text-center divide-y divide-border/20 bg-muted/10"
      aria-hidden="true"
    >
      {TIME_SLOTS.map((time) => (
        <div 
          key={time} 
          className="flex items-start justify-center pt-2"
          style={{ height: `${hourHeight}px` }}
        >
          {time}
        </div>
      ))}
    </div>
  );
}
