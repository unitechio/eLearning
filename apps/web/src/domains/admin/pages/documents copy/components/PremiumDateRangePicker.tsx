import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface PremiumDateRangePickerProps {
  readonly value?: DateRange;
  readonly onChange?: (value: DateRange) => void;
  readonly className?: string;
}

export function PremiumDateRangePicker({
  value = {},
  onChange,
  className,
}: PremiumDateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 8, 1)); // September 2026
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activeInput, setActiveInput] = useState<'in' | 'out'>('in');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handleDayClick = (dayDate: Date) => {
    if (activeInput === 'in') {
      onChange?.({ from: dayDate, to: undefined });
      setActiveInput('out');
    } else {
      if (value.from && dayDate >= value.from) {
        onChange?.({ from: value.from, to: dayDate });
        setActiveInput('in');
      } else {
        onChange?.({ from: dayDate, to: undefined });
        setActiveInput('out');
      }
    }
  };

  const setQuickRange = (days: number) => {
    const from = new Date(2026, 8, 9); // default base to match image
    const to = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
    onChange?.({ from, to });
    setActiveInput('in');
  };

  const clearRange = () => {
    onChange?.({ from: undefined, to: undefined });
    setActiveInput('in');
  };

  // Generate calendar days
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday
  // We want Monday (1) to be index 0. So Sunday (0) should be index 6.
  const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysList: (Date | null)[] = [];
  for (let i = 0; i < adjustedStart; i++) {
    daysList.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysList.push(new Date(year, month, d));
  }

  const formatDateLabel = (d?: Date) => {
    if (!d) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isSelected = (d: Date) => {
    return (
      (value.from && d.toDateString() === value.from.toDateString()) ||
      (value.to && d.toDateString() === value.to.toDateString())
    );
  };

  const isBetween = (d: Date) => {
    if (!value.from) return false;
    const t = d.getTime();
    const fromT = value.from.getTime();
    if (value.to) {
      return t > fromT && t < value.to.getTime();
    }
    if (hoverDate) {
      return t > fromT && t < hoverDate.getTime();
    }
    return false;
  };

  return (
    <article className={cn("w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900 font-sans", className)}>
      {/* Check-In / Check-Out Header */}
      <header className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveInput('in')}
          className="relative flex-1 text-left focus:outline-none"
        >
          <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Check-In
          </span>
          <span className="mt-1 block text-2xl font-black text-slate-800 dark:text-white">
            {formatDateLabel(value.from)}
          </span>
          {activeInput === 'in' && (
            <span className="absolute bottom-[-17px] left-0 h-0.5 w-12 bg-blue-600 rounded-full" />
          )}
        </button>

        <hr className="mx-4 h-8 w-[1px] bg-slate-200 dark:bg-slate-800 border-none" />

        <button
          type="button"
          onClick={() => setActiveInput('out')}
          className="relative flex-1 text-left focus:outline-none"
        >
          <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Check-Out
          </span>
          <span className="mt-1 block text-2xl font-black text-slate-800 dark:text-white">
            {formatDateLabel(value.to)}
          </span>
          {activeInput === 'out' && (
            <span className="absolute bottom-[-17px] left-0 h-0.5 w-12 bg-blue-600 rounded-full" />
          )}
        </button>
      </header>

      {/* Calendar Grid */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white text-left px-1">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        <div className="mt-4 grid grid-cols-7 text-center text-xs font-bold text-slate-400">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <span key={`${day}-${idx}`} className="w-10 py-2 block mx-auto">
              {day}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {daysList.map((dayDate, index) => {
            if (!dayDate) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const active = isSelected(dayDate);
            const between = isBetween(dayDate);
            const isStart = value.from && dayDate.toDateString() === value.from.toDateString();
            const isEnd = value.to && dayDate.toDateString() === value.to.toDateString();

            return (
              <div
                key={dayDate.toISOString()}
                className="relative aspect-square flex items-center justify-center"
                onMouseEnter={() => value.from && !value.to && setHoverDate(dayDate)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {/* Highlight background strip for in-between days */}
                {between && (
                  <span
                    className={cn(
                      "absolute inset-y-1.5 bg-blue-50 dark:bg-blue-950/20 z-0",
                      isStart ? "left-1/2 rounded-l-full w-1/2" : isEnd ? "right-1/2 rounded-r-full w-1/2" : "inset-x-0"
                    )}
                  />
                )}
                
                <button
                  type="button"
                  onClick={() => handleDayClick(dayDate)}
                  className={cn(
                    "relative z-10 h-10 w-10 rounded-full text-sm font-semibold transition-all flex items-center justify-center",
                    active
                      ? "bg-blue-600 text-white font-black shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                      : between
                      ? "text-blue-600 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {dayDate.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Actions Row */}
      <footer className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setQuickRange(2)}
            className="rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={() => setQuickRange(3)}
            className="rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            3 nights
          </button>
          <button
            type="button"
            onClick={() => setQuickRange(7)}
            className="rounded-full bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-800 px-4 py-2 text-xs font-bold hover:bg-blue-100/60"
          >
            1 week
          </button>
          <button
            type="button"
            onClick={() => setQuickRange(14)}
            className="rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            2 weeks
          </button>
        </div>
        <button
          type="button"
          onClick={clearRange}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          Clear
        </button>
      </footer>
    </article>
  );
}
