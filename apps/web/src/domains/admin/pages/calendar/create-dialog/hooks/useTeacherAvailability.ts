import { useMemo } from 'react';
import { type CalendarEvent } from '../../calendar.types';
import { detectScheduleConflict } from '../../calendar.utils';

interface UseTeacherAvailabilityProps {
  readonly events: readonly CalendarEvent[];
  readonly teacherId: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
}

export function useTeacherAvailability({
  events,
  teacherId,
  date,
  startTime,
  endTime,
}: UseTeacherAvailabilityProps) {
  const conflictEvent = useMemo(() => {
    if (!teacherId || !date || !startTime || !endTime) return undefined;
    return detectScheduleConflict(events, teacherId, date, startTime, endTime);
  }, [events, teacherId, date, startTime, endTime]);

  const isAvailable = !conflictEvent;

  return {
    isAvailable,
    conflictEvent,
  };
}
