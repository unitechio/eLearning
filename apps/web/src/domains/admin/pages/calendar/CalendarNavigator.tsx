import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface CalendarNavigatorProps {
  readonly currentMonth: string; // e.g. "January 2027"
  readonly dateRange: string;    // e.g. "Jan 1, 2027 – Jan 31, 2027"
  readonly onPrevMonth?: () => void;
  readonly onNextMonth?: () => void;
  readonly onToday?: () => void;
  readonly onViewChange?: (view: string) => void;
}

/**
 * Navigation panel containing month selector, current month label,
 * and view type select dropdown.
 */
export function CalendarNavigator({
  currentMonth,
  dateRange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewChange,
}: CalendarNavigatorProps) {
  return (
    <section 
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2" 
      aria-label="Calendar date selection"
    >
      {/* Current Month & Date details */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-border bg-card shadow-xs select-none">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Jan</span>
          <span className="text-xs font-extrabold text-foreground leading-none mt-0.5">8</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground leading-none">{currentMonth}</h2>
          <p className="text-[12px] font-medium text-muted-foreground mt-1">{dateRange}</p>
        </div>
      </div>

      {/* Navigator Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-xs">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-md hover:bg-muted/50" 
            aria-label="Previous Month"
            onClick={onPrevMonth}
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            className="h-7 rounded-md text-xs font-semibold px-3 hover:bg-muted/50"
            onClick={onToday}
          >
            Today
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-md hover:bg-muted/50" 
            aria-label="Next Month"
            onClick={onNextMonth}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Custom view format select component */}
        <Select defaultValue="week" onValueChange={onViewChange}>
          <SelectTrigger className="h-8 w-28 text-xs font-semibold rounded-lg border border-border bg-card shadow-xs focus:ring-1 focus:ring-primary focus:ring-offset-0">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border border-border">
            <SelectItem value="day" className="text-xs">Day view</SelectItem>
            <SelectItem value="week" className="text-xs">Week view</SelectItem>
            <SelectItem value="month" className="text-xs">Month view</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
