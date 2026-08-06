import { useMemo } from 'react';
import { type CalendarEvent } from '../../calendar.types';
import { useTeacherAvailability } from './useTeacherAvailability';
import { useRoomAvailability } from './useRoomAvailability';

interface UseConflictDetectionProps {
  readonly events: readonly CalendarEvent[];
  readonly teacherId: string;
  readonly roomId: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly attendeeCount: number;
}

export interface ConflictWarning {
  readonly type: 'teacher' | 'room' | 'capacity';
  readonly message: string;
}

export function useConflictDetection({
  events,
  teacherId,
  roomId,
  date,
  startTime,
  endTime,
  attendeeCount,
}: UseConflictDetectionProps) {
  const { conflictEvent: teacherConflict } = useTeacherAvailability({
    events,
    teacherId,
    date,
    startTime,
    endTime,
  });

  const { roomConflict, capacityExceeded } = useRoomAvailability({
    events,
    roomId,
    date,
    startTime,
    endTime,
    attendeeCount,
  });

  const conflicts = useMemo<readonly ConflictWarning[]>(() => {
    const list: ConflictWarning[] = [];

    if (teacherConflict) {
      list.push({
        type: 'teacher',
        message: `Teacher conflict: Already assigned to "${teacherConflict.title}" (${teacherConflict.time})`,
      });
    }

    if (roomConflict) {
      list.push({
        type: 'room',
        message: `Room conflict: Already booked for "${roomConflict.title}" (${roomConflict.time})`,
      });
    }

    if (capacityExceeded) {
      list.push({
        type: 'capacity',
        message: `Capacity warning: Classroom limits exceeded.`,
      });
    }

    return list;
  }, [teacherConflict, roomConflict, capacityExceeded]);

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
  };
}
