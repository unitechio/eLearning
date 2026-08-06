import { START_HOUR, PIXELS_PER_MINUTE } from './calendar.constants';
import { type CalendarEvent } from './calendar.types';

export function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]!, 10);
    const minutes = parseInt(ampmMatch[2]!, 10);
    const period = ampmMatch[3];
    if (period === 'PM' && hours < 12) hours += 12;
    else if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const timeMatch = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    return parseInt(timeMatch[1]!, 10) * 60 + parseInt(timeMatch[2]!, 10);
  }
  throw new Error(`parseTimeToMinutes: Invalid time format '${timeStr}'`);
}

export function calculateTop(timeStr: string): number {
  const diffMinutes = parseTimeToMinutes(timeStr) - START_HOUR * 60;
  return Math.max(0, diffMinutes * PIXELS_PER_MINUTE);
}

export function calculateHeight(startTimeStr: string, endTimeStr: string): number {
  const duration = parseTimeToMinutes(endTimeStr) - parseTimeToMinutes(startTimeStr);
  if (duration <= 0) throw new RangeError('Duration must be positive');
  return duration * PIXELS_PER_MINUTE;
}

export interface MonthDay {
  readonly date: Date;
  readonly dateStr: string;
  readonly isCurrentMonth: boolean;
  readonly dayLabel: number;
}

export function getMonthDaysGrid(year: number, month: number): readonly MonthDay[] {
  const result: MonthDay[] = [];
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();

  const prevMonthEnd = new Date(year, month, 0);
  const prevMonthTotalDays = prevMonthEnd.getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const date = new Date(year, month - 1, d);
    result.push({ date, dateStr: formatDateString(date), isCurrentMonth: false, dayLabel: d });
  }

  const currentMonthEnd = new Date(year, month + 1, 0);
  const currentMonthTotalDays = currentMonthEnd.getDate();
  for (let d = 1; d <= currentMonthTotalDays; d++) {
    const date = new Date(year, month, d);
    result.push({ date, dateStr: formatDateString(date), isCurrentMonth: true, dayLabel: d });
  }

  const remainingCells = 42 - result.length;
  for (let d = 1; d <= remainingCells; d++) {
    const date = new Date(year, month + 1, d);
    result.push({ date, dateStr: formatDateString(date), isCurrentMonth: false, dayLabel: d });
  }
  return result;
}

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function detectScheduleConflict(
  events: readonly CalendarEvent[],
  teacherId: string,
  date: string,
  startTime: string,
  endTime: string,
  skipEventId?: string
): CalendarEvent | undefined {
  const newStart = parseTimeToMinutes(startTime);
  const newEnd = parseTimeToMinutes(endTime);

  return events.find((e) => {
    if (e.id === skipEventId || e.date !== date || e.teacherId !== teacherId || e.type === 'cancelled') {
      return false;
    }
    const eStart = parseTimeToMinutes(e.rowStart);
    const eEnd = parseTimeToMinutes(e.rowEnd);
    return newStart < eEnd && newEnd > eStart;
  });
}

export function suggestFreeSlots(
  events: readonly CalendarEvent[],
  teacherId: string,
  date: string,
  durationMinutes = 60
): readonly { start: string; end: string }[] {
  const dayEvents = events.filter((e) => e.date === date && e.teacherId === teacherId && e.type !== 'cancelled');
  const calendarStart = START_HOUR * 60;
  const calendarEnd = (START_HOUR + 4) * 60; // 9 AM to 1 PM grid
  
  const suggestions: { start: string; end: string }[] = [];
  const formatTime = (totalMinutes: number): string => {
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    const period = hh >= 12 ? 'PM' : 'AM';
    const displayH = hh > 12 ? hh - 12 : hh;
    return `${displayH}:${String(mm).padStart(2, '0')} ${period}`;
  };

  // Check 30-min intervals
  for (let current = calendarStart; current + durationMinutes <= calendarEnd; current += 30) {
    const hasConflict = dayEvents.some((e) => {
      const eStart = parseTimeToMinutes(e.rowStart);
      const eEnd = parseTimeToMinutes(e.rowEnd);
      return current < eEnd && (current + durationMinutes) > eStart;
    });

    if (!hasConflict) {
      suggestions.push({
        start: formatTime(current),
        end: formatTime(current + durationMinutes),
      });
    }
  }
  return suggestions.slice(0, 3);
}
