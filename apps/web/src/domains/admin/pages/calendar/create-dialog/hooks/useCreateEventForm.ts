import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type EventType, type SkillType } from '../../calendar.types';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  type: z.enum([
    'meeting', 'class', 'exam', 'reminder', 'holiday', 
    'cancelled', 'interview', 'lesson', 'task', 
    'blocked', 'travel', 'pending', 'completed'
  ]),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  teacherId: z.string().min(1, 'Teacher selection is required'),
  classroomId: z.string().min(1, 'Classroom selection is required'),
  platform: z.string(),
  reminder: z.string(),
  permission: z.string(),
});

export type CreateEventValues = z.infer<typeof createEventSchema>;

interface UseCreateEventFormProps {
  readonly defaultDate: string;
  readonly defaultStartTime: string;
  readonly onSubmit: (values: CreateEventValues) => void;
}

export function useCreateEventForm({
  defaultDate,
  defaultStartTime,
  onSubmit,
}: UseCreateEventFormProps) {
  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'class',
      date: defaultDate,
      startTime: defaultStartTime,
      endTime: '10:00 AM',
      teacherId: 't1',
      classroomId: 'c1',
      platform: '',
      reminder: '15 mins',
      permission: 'team',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return {
    form,
    handleFormSubmit,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
}
