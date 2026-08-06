import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

interface DatePickerProps {
  readonly value?: string; // YYYY-MM-DD
  readonly onChange?: (value: string) => void;
  readonly className?: string;
  readonly placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder = 'Select date',
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  
  // Base state for the viewed year/month
  const selectedDate = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(year, month, day);
    const formatted = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
    onChange?.(formatted);
    setOpen(false);
  };

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  const blanksCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // start week on Mon
  for (let i = 0; i < blanksCount; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const formattedDisplay = selectedDate
    ? selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-xs h-9 border border-input rounded-lg bg-background px-3 focus:ring-1 focus:ring-primary focus:ring-offset-0",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground/60 shrink-0" />
          <span className="truncate">{formattedDisplay}</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3 border border-border rounded-xl shadow-lg bg-popover z-50">
        <div className="space-y-3 font-sans">
          <header className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">{monthLabel}</span>
            <div className="flex gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-muted"
                onClick={() => handleMonthChange(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-muted"
                onClick={() => handleMonthChange(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground uppercase">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const isSelected = selectedDate
                ? selectedDate.getFullYear() === year &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getDate() === day
                : false;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={cn(
                    "h-7 w-7 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center border border-transparent",
                    isSelected
                      ? "bg-primary text-primary-foreground font-black shadow-xs"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
