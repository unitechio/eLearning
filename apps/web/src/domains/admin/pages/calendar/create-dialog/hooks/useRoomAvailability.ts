import { useMemo } from 'react';
import { type CalendarEvent } from '../../calendar.types';
import { CLASSROOMS } from '../../calendar.constants';
import { parseTimeToMinutes } from '../../calendar.utils';

interface UseRoomAvailabilityProps {
  readonly events: readonly CalendarEvent[];
  readonly roomId: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly attendeeCount: number;
}

export function useRoomAvailability({
  events,
  roomId,
  date,
  startTime,
  endTime,
  attendeeCount,
}: UseRoomAvailabilityProps) {
  const roomConflict = useMemo(() => {
    if (!roomId || !date || !startTime || !endTime) return undefined;
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);

    return events.find((e) => {
      if (e.classroomId !== roomId || e.date !== date || e.type === 'cancelled') return false;
      const eStart = parseTimeToMinutes(e.rowStart);
      const eEnd = parseTimeToMinutes(e.rowEnd);
      return startMins < eEnd && endMins > eStart;
    });
  }, [events, roomId, date, startTime, endTime]);

  const classroom = useMemo(() => {
    return CLASSROOMS.find((c) => c.id === roomId);
  }, [roomId]);

  const capacityExceeded = useMemo(() => {
    if (!classroom) return false;
    return attendeeCount > classroom.capacity;
  }, [classroom, attendeeCount]);

  return {
    isAvailable: !roomConflict,
    roomConflict,
    classroom,
    capacityExceeded,
  };
}
