import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { FieldLabel } from '@/shared/components/ui/typography';
import { TEACHERS, CLASSROOMS } from '../calendar.constants';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventResourceSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventResourceSection({ form }: EventResourceSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Resource assignment details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>Assigned Teacher</FieldLabel>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 text-sm font-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg shadow-lg border border-border">
                  {TEACHERS.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id} className="text-sm font-medium">
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>Classroom / Venue</FieldLabel>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 text-sm font-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg shadow-lg border border-border">
                  {CLASSROOMS.map((room) => (
                    <SelectItem key={room.id} value={room.id} className="text-sm font-medium">
                      {room.name} (cap: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
