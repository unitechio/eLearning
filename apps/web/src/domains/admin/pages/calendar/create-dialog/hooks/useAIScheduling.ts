import { useMemo } from 'react';
import { type CalendarEvent } from '../../calendar.types';
import { suggestFreeSlots } from '../../calendar.utils';

interface UseAISchedulingProps {
  readonly events: readonly CalendarEvent[];
  readonly teacherId: string;
  readonly date: string;
  readonly roomId: string;
}

export interface Recommendation {
  readonly start: string;
  readonly end: string;
  readonly score: number;
  readonly reason: string;
}

export function useAIScheduling({
  events,
  teacherId,
  date,
  roomId,
}: UseAISchedulingProps) {
  const recommendations = useMemo<readonly Recommendation[]>(() => {
    if (!teacherId || !date) return [];
    
    const slots = suggestFreeSlots(events, teacherId, date);
    return slots.map((slot) => {
      // Determine if there is any classroom conflict for this recommended slot
      const isRoomOccupied = events.some((e) => {
        if (e.classroomId !== roomId || e.date !== date || e.type === 'cancelled') return false;
        // Simple overlap check
        return true; // (mock logic for room checking)
      });

      const score = isRoomOccupied ? 85 : 98;
      const reason = isRoomOccupied
        ? 'Teacher is free, but Room is occupied. Suggest switching rooms.'
        : 'Optimal slot: Teacher and Room are completely vacant. Highly recommended.';

      return {
        start: slot.start,
        end: slot.end,
        score,
        reason,
      };
    });
  }, [events, teacherId, date, roomId]);

  return {
    recommendations,
  };
}
