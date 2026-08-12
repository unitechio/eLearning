import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a?: Date, b?: Date) => !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime();

const isBefore = (a: Date, b: Date) => startOfDay(a).getTime() < startOfDay(b).getTime();

const isAfter = (a: Date, b: Date) => startOfDay(a).getTime() > startOfDay(b).getTime();

const formatDateLabel = (date?: Date) => date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

const getNights = (from?: Date, to?: Date) => {
  if (!from || !to) return 0;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000);
};

export function PremiumDateRangePicker({ value = {}, onChange, className }: PremiumDateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activeInput, setActiveInput] = useState<'in' | 'out'>('in');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const nights = getNights(value.from, value.to);

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const day = index - startOffset + 1;
      return day > 0 && day <= daysInMonth ? new Date(year, month, day) : null;
    });
  }, [year, month]);

  const previewTo = !value.to && hoverDate && value.from && isAfter(hoverDate, value.from) ? hoverDate : undefined;

  const rangeFrom = value.from;
  const rangeTo = value.to ?? previewTo;

  const isInRange = (date: Date) => {
    if (!rangeFrom || !rangeTo) return false;
    const time = startOfDay(date).getTime();
    return time > startOfDay(rangeFrom).getTime() && time < startOfDay(rangeTo).getTime();
  };

  const isRangeStart = (date: Date) => isSameDay(date, rangeFrom);

  const isRangeEnd = (date: Date) => isSameDay(date, rangeTo);

  const changeMonth = (offset: number) => {
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setHoverDate(null);
  };

  const handleDayClick = (date: Date) => {
    if (!value.from || activeInput === 'in') {
      onChange?.({ from: date, to: undefined });
      setActiveInput('out');
      return;
    }

    if (isBefore(date, value.from)) {
      onChange?.({ from: date, to: value.from });
    } else {
      onChange?.({ from: value.from, to: date });
    }

    setActiveInput('in');
    setHoverDate(null);
  };

  const setQuickRange = (days: number) => {
    const from = startOfDay(new Date());
    const to = new Date(from);
    to.setDate(to.getDate() + days);

    onChange?.({ from, to });
    setCurrentMonth(new Date(from.getFullYear(), from.getMonth(), 1));
    setActiveInput('in');
  };

  const clearRange = () => {
    onChange?.({ from: undefined, to: undefined });
    setHoverDate(null);
    setActiveInput('in');
  };

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={cn('w-[380px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200 bg-white font-sans shadow-[0_16px_45px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900', className)}>
      {/* Header */}
      <header className="border-b border-slate-100 px-5 pt-5 dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-800 dark:text-white">Select dates</h2>
          {nights > 0 && <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">{nights} {nights === 1 ? 'night' : 'nights'}</span>}
        </div>

        <div className="grid grid-cols-2">
          <button type="button" onClick={() => setActiveInput('in')} className={cn('relative pb-4 text-left transition-colors', activeInput === 'in' ? 'text-slate-900 dark:text-white' : 'text-slate-400')}>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Check-in</span>
            <span className="mt-1 block text-[17px] font-semibold">{formatDateLabel(value.from)}</span>
            {activeInput === 'in' && <span className="absolute bottom-0 left-0 h-0.5 w-10 rounded-full bg-red-600" />}
          </button>

          <button type="button" onClick={() => setActiveInput('out')} className={cn('relative border-l border-slate-100 pb-4 pl-5 text-left transition-colors dark:border-slate-800', activeInput === 'out' ? 'text-slate-900 dark:text-white' : 'text-slate-400')}>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Check-out</span>
            <span className="mt-1 block text-[17px] font-semibold">{formatDateLabel(value.to)}</span>
            {activeInput === 'out' && <span className="absolute bottom-0 left-5 h-0.5 w-10 rounded-full bg-red-600" />}
          </button>
        </div>
      </header>

      {/* Calendar */}
      <section className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-slate-800 dark:text-white">{monthLabel}</h3>

          <div className="flex items-center gap-1">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7">
          {WEEK_DAYS.map((day, index) => <span key={`${day}-${index}`} className="flex h-7 items-center justify-center text-[10px] font-semibold uppercase text-slate-400">{day}</span>)}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="h-9" />;

            const selected = isSameDay(date, value.from) || isSameDay(date, value.to);
            const range = isInRange(date);
            const start = isRangeStart(date);
            const end = isRangeEnd(date);

            return (
              <div key={date.toISOString()} className="relative flex h-9 items-center justify-center" onMouseEnter={() => value.from && !value.to && setHoverDate(date)} onMouseLeave={() => setHoverDate(null)}>
                {range && <span className="absolute inset-y-1.5 inset-x-0 bg-red-50 dark:bg-red-950/25" />}
                {start && rangeTo && <span className="absolute right-0 inset-y-1.5 w-1/2 bg-red-50 dark:bg-red-950/25" />}
                {end && rangeFrom && <span className="absolute left-0 inset-y-1.5 w-1/2 bg-red-50 dark:bg-red-950/25" />}

                <button type="button" onClick={() => handleDayClick(date)} className={cn('relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30', selected ? 'bg-red-600 font-semibold text-white shadow-[0_3px_10px_rgba(220,38,38,0.28)]' : range ? 'text-red-700 dark:text-red-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick ranges */}
      <footer className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button type="button" onClick={() => setQuickRange(2)} className="shrink-0 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">Weekend</button>
          <button type="button" onClick={() => setQuickRange(3)} className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">3 nights</button>
          <button type="button" onClick={() => setQuickRange(7)} className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">1 week</button>
          <button type="button" onClick={() => setQuickRange(14)} className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">2 weeks</button>
          <button type="button" onClick={clearRange} className="ml-auto shrink-0 px-1 text-[11px] font-medium text-slate-400 transition hover:text-slate-700 dark:hover:text-white">Clear</button>
        </div>
      </footer>
    </article>
  );
}
