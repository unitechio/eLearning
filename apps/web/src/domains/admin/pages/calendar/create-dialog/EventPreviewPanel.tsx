import React from 'react';
import { TEACHERS, CLASSROOMS } from '../calendar.constants';
import { type EventType } from '../calendar.types';
import { FieldLabel, HelperText, PreviewCardTitle, PreviewMetadata } from '@/shared/components/ui/typography';
import { Clock, User, Home, Shield, Bell } from 'lucide-react';
import { cn } from '@/shared/lib';

interface EventPreviewPanelProps {
  readonly title: string;
  readonly type: EventType;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly teacherId: string;
  readonly roomId: string;
  readonly reminder: string;
  readonly permission: string;
}

export function EventPreviewPanel({
  title,
  type,
  date,
  startTime,
  endTime,
  teacherId,
  roomId,
  reminder,
  permission,
}: EventPreviewPanelProps) {
  const teacher = TEACHERS.find((t) => t.id === teacherId);
  const classroom = CLASSROOMS.find((r) => r.id === roomId);

  return (
    <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4 font-sans select-none">
      <header className="space-y-1">
        <FieldLabel>Live Preview</FieldLabel>
        <HelperText className="text-[10px]">Visual calendar representation</HelperText>
      </header>

      {/* Styled Event Card Block */}
      <div className={cn(
        "p-3 rounded-lg border bg-card text-card-foreground shadow-xs space-y-2 border-l-4 border-l-primary",
        type === 'cancelled' && 'opacity-65 border-l-destructive',
        type === 'exam' && 'border-l-purple-500',
        type === 'holiday' && 'border-l-yellow-500'
      )}>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-primary px-1.5 py-0.5 bg-primary/10 rounded-full inline-block">
          {type}
        </span>
        <PreviewCardTitle>{title || 'Untitled Event'}</PreviewCardTitle>
        
        <div className="space-y-1.5 pt-1 flex flex-col">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
            <PreviewMetadata>
              {date || 'YYYY-MM-DD'} ({startTime || 'Start'} - {endTime || 'End'})
            </PreviewMetadata>
          </p>
          <p className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground/60" />
            <PreviewMetadata>
              Teacher: {teacher?.name || 'Unassigned'}
            </PreviewMetadata>
          </p>
          <p className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-muted-foreground/60" />
            <PreviewMetadata>
              Room: {classroom?.name || 'Online'}
            </PreviewMetadata>
          </p>
          <p className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-muted-foreground/60" />
            <PreviewMetadata>
              Remind: {reminder}
            </PreviewMetadata>
          </p>
          <p className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-muted-foreground/60" />
            <PreviewMetadata>
              Access: {permission}
            </PreviewMetadata>
          </p>
        </div>
      </div>
    </div>
  );
}
