import React, { useEffect } from 'react';
import { type CalendarEvent } from '../calendar.types';
import { useCreateEventForm, type CreateEventValues } from './hooks/useCreateEventForm';
import { useConflictDetection } from './hooks/useConflictDetection';
import { useAIScheduling } from './hooks/useAIScheduling';
import { EventGeneralSection } from './EventGeneralSection';
import { EventScheduleSection } from './EventScheduleSection';
import { EventResourceSection } from './EventResourceSection';
import { EventMeetingSection } from './EventMeetingSection';
import { EventReminderSection } from './EventReminderSection';
import { EventPermissionSection } from './EventPermissionSection';
import { EventPreviewPanel } from './EventPreviewPanel';
import { AIRecommendationPanel } from './AIRecommendationPanel';
import { ConflictPanel } from './ConflictPanel';
import { Dialog, DialogContent, DialogHeader } from '@/shared/components/ui/dialog';
import { DialogTitle, DialogDescription } from '@/shared/components/ui/typography';
import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface CreateEventDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly defaultDate: string;
  readonly defaultStartTime: string;
  readonly onSubmit: (values: CreateEventValues) => void;
  readonly events: readonly CalendarEvent[];
}

export function CreateEventDialog({
  isOpen,
  onClose,
  defaultDate,
  defaultStartTime,
  onSubmit,
  events,
}: CreateEventDialogProps) {
  const { form, handleFormSubmit, isSubmitting, isValid } = useCreateEventForm({
    defaultDate,
    defaultStartTime,
    onSubmit,
  });

  const formValues = form.watch();

  const { conflicts, hasConflicts } = useConflictDetection({
    events,
    teacherId: formValues.teacherId,
    roomId: formValues.classroomId,
    date: formValues.date,
    startTime: formValues.startTime,
    endTime: formValues.endTime,
    attendeeCount: 0, // dynamic count
  });

  const { recommendations } = useAIScheduling({
    events,
    teacherId: formValues.teacherId,
    date: formValues.date,
    roomId: formValues.classroomId,
  });

  // Handle Ctrl+Enter to save form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleFormSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleFormSubmit]);

  const handleSelectSlot = (start: string, end: string) => {
    form.setValue('startTime', start);
    form.setValue('endTime', end);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden font-sans border-border rounded-xl">
        <DialogHeader className="p-6 border-b border-border bg-muted/10">
          <DialogTitle>Create Workspace Session</DialogTitle>
          <DialogDescription>
            Schedule a classroom session, sync meeting, or holiday reservation inside the academic board.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border h-[500px]">
            {/* Left 70% Form Area */}
            <ScrollArea className="flex-1 p-6 h-full">
              <div className="space-y-6">
                <EventGeneralSection form={form} />
                <EventScheduleSection form={form} />
                <EventResourceSection form={form} />
                <EventMeetingSection form={form} />
                <EventReminderSection form={form} />
                <EventPermissionSection form={form} />
              </div>
            </ScrollArea>

            {/* Right 30% Preview / AI / Conflict Area */}
            <div className="w-full md:w-80 p-6 bg-muted/10 space-y-4 overflow-y-auto h-full no-scrollbar">
              <EventPreviewPanel
                title={formValues.title}
                type={formValues.type}
                date={formValues.date}
                startTime={formValues.startTime}
                endTime={formValues.endTime}
                teacherId={formValues.teacherId}
                roomId={formValues.classroomId}
                reminder={formValues.reminder}
                permission={formValues.permission}
              />
              <ConflictPanel conflicts={conflicts} />
              <AIRecommendationPanel recommendations={recommendations} onSelectSlot={handleSelectSlot} />
            </div>
          </form>
        </Form>

        {/* Footer actions */}
        <footer className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="h-8 text-xs font-semibold px-3">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting || hasConflicts || !isValid}
            className="h-8 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 text-xs"
          >
            {isSubmitting ? 'Scheduling...' : 'Create Event'}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
