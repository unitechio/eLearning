import React, { useState, useMemo, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarRightSidebar } from './CalendarRightSidebar';
import { CalendarGrid } from './CalendarGrid';
import { CalendarCommandPalette } from './CalendarCommandPalette';
import { CreateEventDialog, type CreateEventValues } from './create-dialog';
import { type CalendarEvent, type SkillType } from './calendar.types';
import { INITIAL_EVENTS, DAYS, CLASSROOMS } from './calendar.constants';

export function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'teams' | 'public'>('all');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('2027-01-08');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();
  const [view, setView] = useState<string>('week');
  const [events, setEvents] = useState<readonly CalendarEvent[]>(INITIAL_EVENTS);

  // Sidebars, filter state & modals
  const [selectedSkills, setSelectedSkills] = useState<readonly SkillType[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<readonly string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<readonly string[]>([]);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Dialog parameters
  const [showAddModal, setShowAddModal] = useState(false);
  const [defaultDate, setDefaultDate] = useState('2027-01-04');
  const [defaultStartTime, setDefaultStartTime] = useState('09:00 AM');

  // Handle hotkeys (Ctrl+K, C, T, L, R)
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const active = document.activeElement?.tagName;
      if (active === 'INPUT' || active === 'SELECT' || active === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowAddModal(true);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setSelectedDate('2027-01-08');
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setLeftOpen(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setRightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (activeTab === 'teams' && e.type !== 'meeting' && e.type !== 'class') return false;
      if (activeTab === 'public' && e.type !== 'exam' && e.type !== 'holiday') return false;
      
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
        (e.platform && e.platform.toLowerCase().includes(search.toLowerCase()));
      if (!matchSearch) return false;

      if (selectedSkills.length > 0 && !selectedSkills.includes(e.skill)) return false;
      if (selectedTeachers.length > 0 && !selectedTeachers.includes(e.teacherId)) return false;
      if (selectedClassrooms.length > 0 && !selectedClassrooms.includes(e.classroomId)) return false;

      return true;
    });
  }, [events, activeTab, search, selectedSkills, selectedTeachers, selectedClassrooms]);

  const selectedEvent = useMemo(() => events.find(e => e.id === selectedEventId), [events, selectedEventId]);

  // Attendance Toggle
  const handleAttendanceChange = (eventId: string, studentId: string, status: 'present' | 'absent') => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        students: e.students.map(s => s.id === studentId ? { ...s, status } : s),
        auditLog: { ...e.auditLog, lastModifiedBy: 'Staff', lastModifiedAt: 'Just now' }
      };
    }));
  };

  // Delete event callback
  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    if (selectedEventId === eventId) setSelectedEventId(undefined);
  };
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEventId(event.id);
  };
  const handleSlotDoubleClick = (dayIndex: number, timeStr: string) => {
    const matchedDay = DAYS[dayIndex - 1];
    if (matchedDay) {
      setDefaultDate(matchedDay.date);
      setDefaultStartTime(timeStr);
      setShowAddModal(true);
    }
  };

  // Add event submit
  const handleAddSubmit = (values: CreateEventValues) => {
    const matchedDay = DAYS.find(d => d.date === values.date);
    const colIndex = matchedDay ? DAYS.indexOf(matchedDay) + 1 : 1;

    const created: CalendarEvent = {
      id: `e-${Date.now()}`,
      title: values.title,
      time: `${values.startTime} - ${values.endTime}`,
      date: values.date,
      col: colIndex,
      rowStart: values.startTime,
      rowEnd: values.endTime,
      color: values.type === 'cancelled' ? 'gray' : values.type === 'exam' ? 'purple' : 'blue',
      type: values.type,
      platform: values.platform || undefined,
      teacherId: values.teacherId,
      classroomId: values.classroomId,
      courseId: 'c_custom',
      skill: 'general',
      students: [],
      maxCapacity: CLASSROOMS.find(r => r.id === values.classroomId)?.capacity || 15,
      avatars: ['GV'],
      auditLog: { createdBy: 'Admin', createdAt: 'Just now' }
    };

    setEvents(prev => [...prev, created]);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-foreground bg-background">
      <CalendarHeader onQuickAddClick={() => setShowAddModal(true)} />
      <div className="flex flex-col gap-4 mt-4">
        <CalendarToolbar activeTab={activeTab} onTabChange={setActiveTab} searchValue={search} onSearchChange={setSearch} view={view} onViewChange={setView} />
        <div className="flex flex-1 gap-4 overflow-hidden">
          <CalendarSidebar
            isOpen={leftOpen}
            selectedSkills={selectedSkills}
            onSkillToggle={s => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
            selectedTeachers={selectedTeachers}
            onTeacherToggle={t => setSelectedTeachers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
            selectedClassrooms={selectedClassrooms}
            onClassroomToggle={c => setSelectedClassrooms(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
          />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <CalendarGrid view={view} selectedDate={selectedDate} events={filteredEvents} selectedEventId={selectedEventId} onEventClick={handleEventClick} onDaySelect={setSelectedDate} onEventDelete={handleEventDelete} onSlotDoubleClick={handleSlotDoubleClick} />
          </div>
          <CalendarRightSidebar isOpen={rightOpen} selectedEvent={selectedEvent} onAttendanceChange={handleAttendanceChange} events={events} />
        </div>
      </div>

      <CalendarCommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onSelectView={setView} onToggleLeftSidebar={() => setLeftOpen(p => !p)} onToggleRightSidebar={() => setRightOpen(p => !p)} onQuickAdd={() => setShowAddModal(true)} />

      <CreateEventDialog
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        defaultDate={defaultDate}
        defaultStartTime={defaultStartTime}
        onSubmit={handleAddSubmit}
        events={events}
      />
    </div>
  );
}
