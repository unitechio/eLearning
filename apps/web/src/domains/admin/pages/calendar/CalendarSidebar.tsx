import React from 'react';
import { TEACHERS, CLASSROOMS } from './calendar.constants';
import { type SkillType } from './calendar.types';
import { Calendar as CalendarIcon, User, Home, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/shared/lib';

interface CalendarSidebarProps {
  readonly selectedSkills: readonly SkillType[];
  readonly onSkillToggle: (skill: SkillType) => void;
  readonly selectedTeachers: readonly string[];
  readonly onTeacherToggle: (teacherId: string) => void;
  readonly selectedClassrooms: readonly string[];
  readonly onClassroomToggle: (classroomId: string) => void;
  readonly isOpen: boolean;
}

/**
 * Collapsible left sidebar containing mini calendar metadata,
 * teacher scheduling indicators, classroom details, and skill filters.
 */
export function CalendarSidebar({
  selectedSkills,
  onSkillToggle,
  selectedTeachers,
  onTeacherToggle,
  selectedClassrooms,
  onClassroomToggle,
  isOpen,
}: CalendarSidebarProps) {
  if (!isOpen) return null;

  const skills: readonly { value: SkillType; label: string }[] = [
    { value: 'listening', label: 'Listening' },
    { value: 'reading', label: 'Reading' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' },
    { value: 'general', label: 'General / Sync' },
  ] as const;

  return (
    <aside 
      className="w-64 border-r border-border bg-card/50 p-4 space-y-6 shrink-0 hidden md:block select-none"
      aria-label="Calendar filters sidebar"
    >
      {/* 1. Skill Filters */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>Filter by Skill</span>
        </h3>
        <ul className="space-y-1">
          {skills.map((skill) => {
            const isChecked = selectedSkills.includes(skill.value);
            return (
              <li key={skill.value}>
                <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 text-xs font-semibold cursor-pointer text-foreground">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onSkillToggle(skill.value)}
                    className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring focus:ring-offset-0"
                  />
                  <span>{skill.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 2. Teachers List */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>Teachers</span>
        </h3>
        <ul className="space-y-1">
          {TEACHERS.map((teacher) => {
            const isChecked = selectedTeachers.includes(teacher.id);
            return (
              <li key={teacher.id}>
                <label className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted/50 text-xs font-semibold cursor-pointer text-foreground">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTeacherToggle(teacher.id)}
                      className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring focus:ring-offset-0"
                    />
                    <span>{teacher.name}</span>
                  </div>
                  <span 
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      teacher.color === 'blue' ? 'bg-blue-500' :
                      teacher.color === 'purple' ? 'bg-purple-500' :
                      teacher.color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'
                    )}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. Classrooms List */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>Classrooms</span>
        </h3>
        <ul className="space-y-1">
          {CLASSROOMS.map((room) => {
            const isChecked = selectedClassrooms.includes(room.id);
            return (
              <li key={room.id}>
                <label className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted/50 text-xs font-semibold cursor-pointer text-foreground">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onClassroomToggle(room.id)}
                      className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring focus:ring-offset-0"
                    />
                    <span>{room.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    cap: {room.capacity}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
