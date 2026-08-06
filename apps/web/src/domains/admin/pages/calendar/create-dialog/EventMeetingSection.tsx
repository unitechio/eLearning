import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { FieldLabel } from '@/shared/components/ui/typography';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventMeetingSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventMeetingSection({ form }: EventMeetingSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Meeting link configuration">
      <FormField
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldLabel>Meeting Platform / Custom Link</FieldLabel>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. Zoom Meeting ID or Google Meet URL"
                className="h-9 text-sm font-medium placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/45 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
