import React from 'react';
import { type CalendarEvent, type StudentAttendance } from './calendar.types';
import { TEACHERS, CLASSROOMS } from './calendar.constants';
import { User, Home, CheckCircle2, XCircle, Users, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib';

interface CalendarRightSidebarProps {
  readonly selectedEvent?: CalendarEvent;
  readonly onAttendanceChange: (eventId: string, studentId: string, status: 'present' | 'absent') => void;
  readonly events: readonly CalendarEvent[];
  readonly isOpen: boolean;
}

/**
 * Right details sidebar displaying selected class information,
 * attendance sheets, capacity warnings, and general coordination analytics.
 */
export function CalendarRightSidebar({
  selectedEvent,
  onAttendanceChange,
  events,
  isOpen,
}: CalendarRightSidebarProps) {
  if (!isOpen) return null;

  // Compute overall schedule metrics
  const totalClasses = events.filter(e => e.type === 'class').length;
  const totalMeetings = events.filter(e => e.type === 'meeting').length;
  const totalHours = events.reduce((acc, curr) => acc + (curr.type === 'class' ? 1.5 : 0.5), 0);

  const teacher = selectedEvent
    ? TEACHERS.find(t => t.id === selectedEvent.teacherId)
    : null;
  const classroom = selectedEvent
    ? CLASSROOMS.find(c => c.id === selectedEvent.classroomId)
    : null;

  const currentCount = selectedEvent?.students.length || 0;
  const maxCap = selectedEvent?.maxCapacity || 1;
  const isOverCapacity = currentCount > maxCap;

  return (
    <aside 
      className="w-80 border-l border-border bg-card/50 p-4 space-y-6 shrink-0 hidden lg:block overflow-y-auto select-none"
      aria-label="Event detail & analytics panel"
    >
      {selectedEvent ? (
        /* Event details view mode */
        <div className="space-y-6">
          <header className="space-y-2">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block",
              selectedEvent.type === 'cancelled' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
            )}>
              {selectedEvent.type}
            </span>
            <h3 className="text-sm font-bold text-foreground leading-snug">{selectedEvent.title}</h3>
            <p className="text-[12px] text-muted-foreground flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{selectedEvent.date} ({selectedEvent.time})</span>
            </p>
          </header>

          {/* Allocation details */}
          <section className="space-y-3 border-t border-border pt-4 text-xs font-semibold text-foreground">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Teacher
              </span>
              <span>{teacher?.name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Room
              </span>
              <span>{classroom?.name || 'Online'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Attendance ratio
              </span>
              <span className={cn(isOverCapacity && "text-destructive flex items-center gap-1")}>
                {currentCount} / {maxCap}
                {isOverCapacity && <AlertTriangle className="h-3.5 w-3.5" />}
              </span>
            </div>
          </section>

          {/* Attendance sheet checklist */}
          <section className="space-y-2 border-t border-border pt-4">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Student Attendance
            </h4>
            {selectedEvent.students.length === 0 ? (
              <p className="text-xs text-muted-foreground italic font-medium">No students registered.</p>
            ) : (
              <ul className="space-y-2">
                {selectedEvent.students.map((student) => (
                  <li 
                    key={student.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border"
                  >
                    <span className="text-xs font-bold text-foreground">{student.name}</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 rounded hover:bg-emerald-500/10",
                          student.status === 'present' ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground/40'
                        )}
                        onClick={() => onAttendanceChange(selectedEvent.id, student.id, 'present')}
                        aria-label={`Mark ${student.name} present`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 rounded hover:bg-destructive/10",
                          student.status === 'absent' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground/40'
                        )}
                        onClick={() => onAttendanceChange(selectedEvent.id, student.id, 'absent')}
                        aria-label={`Mark ${student.name} absent`}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Audit logs */}
          <footer className="space-y-1.5 border-t border-border pt-4 text-[11px] font-semibold text-muted-foreground/75">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
              Change History
            </h4>
            <p>Created by: {selectedEvent.auditLog.createdBy}</p>
            <p>Created at: {selectedEvent.auditLog.createdAt}</p>
            {selectedEvent.auditLog.lastModifiedBy && (
              <p>Modified by: {selectedEvent.auditLog.lastModifiedBy}</p>
            )}
          </footer>
        </div>
      ) : (
        /* General schedule statistics and analytics view mode */
        <div className="space-y-5">
          <header className="space-y-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 select-none">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Center Analytics</span>
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">Weekly schedule insights</p>
          </header>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1 select-none">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Weekly Classes</p>
              <p className="text-xl font-extrabold text-foreground mt-1">{totalClasses} Lessons</p>
            </div>
            <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1 select-none">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Meetings & Synced</p>
              <p className="text-xl font-extrabold text-foreground mt-1">{totalMeetings} Events</p>
            </div>
            <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1 select-none">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Total Hours Booked</p>
              <p className="text-xl font-extrabold text-foreground mt-1">{totalHours} Hours</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
