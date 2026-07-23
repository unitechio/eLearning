import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/shared/lib';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location?: string;
  instructor?: string;
  type: 'class' | 'exam' | 'assignment' | 'other';
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "IELTS Listening practice - Part 2",
    date: "2026-07-25",
    time: "09:00 - 10:30 AM",
    location: "Online (Zoom)",
    instructor: "Ms. Sheila Nanda",
    type: "class"
  },
  {
    id: "2",
    title: "Writing Task 2 Mock Test Submission",
    date: "2026-07-26",
    time: "23:59 PM Deadline",
    type: "assignment"
  },
  {
    id: "3",
    title: "Full Mock Test Exam Review Session",
    date: "2026-07-28",
    time: "14:00 - 16:00 PM",
    location: "Room 402 - Main Campus",
    instructor: "Mr. Ben Beckman",
    type: "exam"
  },
  {
    id: "4",
    title: "SAT Reading Workshop",
    date: "2026-07-28",
    time: "17:00 - 18:30 PM",
    location: "Online",
    instructor: "Ms. Sabrina Brown",
    type: "class"
  }
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 23)); // July 2026
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-23");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'class' as const });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = Array.from({ length: firstDayIndex }).map((_, i) => {
    return new Date(year, month, -i).getDate();
  }).reverse();

  const currentMonthDays = Array.from({ length: totalDays }).map((_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateStr = (dayNum: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time) return;
    const added: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      instructor: "You"
    };
    setEvents(prev => [...prev, added]);
    setNewEvent({ title: '', time: '', type: 'class' });
    setShowAddModal(false);
  };

  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  return (
    <article className="grid gap-6 lg:grid-cols-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl text-slate-800 dark:text-slate-100 font-sans">
      {/* 1. Month Grid Area */}
      <section className="lg:col-span-2 space-y-4">
        {/* Header month selector */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <figure className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center shrink-0" aria-hidden="true">
              <CalendarIcon className="h-5 w-5" />
            </figure>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-none">Lịch học & Sự kiện</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
                {monthNames[month]} {year}
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1.5" aria-label="Month selection">
            <button 
              type="button" 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button 
              type="button" 
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition"
              aria-label="Next month"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </nav>
        </header>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest py-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}
        </div>

        {/* Grid slots */}
        <div className="grid grid-cols-7 gap-1.5" role="grid">
          {prevMonthDays.map((d, i) => (
            <div 
              key={`prev-${i}`} 
              className="aspect-square p-1 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 text-slate-300 dark:text-slate-700 text-xs font-semibold flex items-center justify-center pointer-events-none"
              role="gridcell"
            >
              {d}
            </div>
          ))}

          {currentMonthDays.map(d => {
            const dateStr = formatDateStr(d);
            const isSelected = dateStr === selectedDate;
            const dayEvents = events.filter(e => e.date === dateStr);

            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "aspect-square p-1.5 rounded-2xl text-xs font-black relative flex flex-col items-center justify-between border transition",
                  isSelected 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:border-red-200"
                )}
                role="gridcell"
                aria-selected={isSelected}
              >
                <span>{d}</span>
                
                {/* Event dots indicator */}
                {dayEvents.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <span 
                        key={idx} 
                        className={cn(
                          "h-1 w-1 rounded-full",
                          isSelected 
                            ? "bg-white/80" 
                            : e.type === 'class' ? 'bg-blue-500' : e.type === 'exam' ? 'bg-purple-500' : 'bg-orange-500'
                        )} 
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Right Upcoming Events Sidebar */}
      <section className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-6 space-y-4 flex flex-col">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Sự kiện ngày {selectedDate.split('-')[2]}
            </h3>
            <p className="text-[10px] text-slate-450 mt-1">Danh sách buổi học và bài tập</p>
          </div>

          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="p-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl transition"
            aria-label="Add event"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>

        {/* Selected date events list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-60">
          {selectedDateEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs font-bold">Không có sự kiện nào trong ngày này</p>
            </div>
          ) : (
            selectedDateEvents.map(event => (
              <article 
                key={event.id}
                className={cn(
                  "p-4 border rounded-2xl space-y-2 hover:shadow-sm transition",
                  event.type === 'class' 
                    ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10' 
                    : event.type === 'exam' 
                      ? 'border-purple-100 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-950/10' 
                      : 'border-orange-100 dark:border-orange-900/30 bg-orange-50/20 dark:bg-orange-950/10'
                )}
              >
                <header className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {event.title}
                  </h4>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0",
                    event.type === 'class' ? 'bg-blue-100 text-blue-700' : event.type === 'exam' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  )}>
                    {event.type}
                  </span>
                </header>

                <div className="space-y-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.instructor && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span>GV: {event.instructor}</span>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <article 
            className="w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative flex flex-col gap-4 text-slate-800 dark:text-slate-100 font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Add calendar event"
          >
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 rounded-xl"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <header>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Thêm sự kiện mới</h3>
              <p className="text-[10px] text-slate-400 mt-1">Ngày: {selectedDate}</p>
            </header>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Tên sự kiện</span>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. IELTS Reading Lesson 1"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:border-red-300 focus:outline-none"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Thời gian</span>
                <input 
                  type="text" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g. 09:00 - 10:30 AM"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:border-red-300 focus:outline-none"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Loại sự kiện</span>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:border-red-300 focus:outline-none"
                >
                  <option value="class">Buổi học</option>
                  <option value="exam">Bài thi</option>
                  <option value="assignment">Bài tập về nhà</option>
                </select>
              </label>

              <button 
                type="submit"
                className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs py-3 transition"
              >
                Lưu sự kiện
              </button>
            </form>
          </article>
        </div>
      )}
    </article>
  );
}
