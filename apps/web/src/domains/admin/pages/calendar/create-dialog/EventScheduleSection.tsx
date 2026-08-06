import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { FieldLabel } from '@/shared/components/ui/typography';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventScheduleSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventScheduleSection({ form }: EventScheduleSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Schedule settings">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>Date</FieldLabel>
              </FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>Start Time</FieldLabel>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. 09:00 AM"
                  className="h-9 text-sm font-medium placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/45 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>End Time</FieldLabel>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. 10:30 AM"
                  className="h-9 text-sm font-medium placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/45 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
