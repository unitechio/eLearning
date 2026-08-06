import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { FieldLabel } from '@/shared/components/ui/typography';
import { type CreateEventValues } from './hooks/useCreateEventForm';

interface EventPermissionSectionProps {
  readonly form: UseFormReturn<CreateEventValues, any>;
}

export function EventPermissionSection({ form }: EventPermissionSectionProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Permission settings">
      <FormField
        control={form.control}
        name="permission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <FieldLabel>Visibility & Permissions</FieldLabel>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm font-medium focus:ring-1 focus:ring-primary focus:ring-offset-0">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-lg shadow-lg border border-border">
                <SelectItem value="private" className="text-sm font-medium">Private (Just me)</SelectItem>
                <SelectItem value="team" className="text-sm font-medium">Team members</SelectItem>
                <SelectItem value="org" className="text-sm font-medium">Organization default</SelectItem>
                <SelectItem value="public" className="text-sm font-medium">Publicly visible</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
