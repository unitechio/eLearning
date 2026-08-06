import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { FieldLabel } from '@/shared/components/ui/typography';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventReminderSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventReminderSection({ form }: EventReminderSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Reminder configurations">
      <FormField
        control={form.control}
        name="reminder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldLabel>Reminder Notification</FieldLabel>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm font-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
                  <SelectValue placeholder="Select reminder interval" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-lg shadow-lg border border-border">
                <SelectItem value="15 mins" className="text-sm font-medium">15 minutes before</SelectItem>
                <SelectItem value="30 mins" className="text-sm font-medium">30 minutes before</SelectItem>
                <SelectItem value="1 hour" className="text-sm font-medium">1 hour before</SelectItem>
                <SelectItem value="1 day" className="text-sm font-medium">1 day before</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
