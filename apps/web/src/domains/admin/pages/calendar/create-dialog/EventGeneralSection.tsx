import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { FieldLabel } from '@/shared/components/ui/typography';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventGeneralSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventGeneralSection({ form }: EventGeneralSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="General event details">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldLabel>Event Title</FieldLabel>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. IELTS Speaking Session 1"
                className="h-9 text-sm font-medium placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/45 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FieldLabel>Event Type</FieldLabel>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 text-sm font-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg shadow-lg border border-border">
                  <SelectItem value="class" className="text-sm font-medium">Class</SelectItem>
                  <SelectItem value="meeting" className="text-sm font-medium">Meeting</SelectItem>
                  <SelectItem value="exam" className="text-sm font-medium">Exam</SelectItem>
                  <SelectItem value="reminder" className="text-sm font-medium">Reminder</SelectItem>
                  <SelectItem value="holiday" className="text-sm font-medium">Holiday</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldLabel>Description</FieldLabel>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Add lesson details, notes, etc."
                className="min-h-[60px] text-sm font-medium placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/45 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
