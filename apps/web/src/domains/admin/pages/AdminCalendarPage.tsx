import React, { useState } from 'react';
import { Calendar, Search, ChevronLeft, ChevronRight, Plus, Users, Globe, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { AdminPageHeader } from '@/shared/components/admin';
import { cn } from '@/shared/lib/utils';

type Event = {
  id: string;
  title: string;
  time: string;
  col: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri
  rowStart: string;
  rowEnd: string;
  color: 'blue' | 'orange' | 'purple' | 'gray';
  platform?: string;
  avatars: string[];
};

const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Brainstorming Session',
    time: '9:00 - 9:30 AM',
    col: 1,
    rowStart: '9:00 AM',
    rowEnd: '9:30 AM',
    color: 'gray',
    avatars: ['MT', 'LM', 'LA'],
  },
  {
    id: 'e2',
    title: 'Bi-Weekly Marketing Team',
    time: '9:30 - 10:00 AM',
    col: 1,
    rowStart: '9:30 AM',
    rowEnd: '10:00 AM',
    color: 'gray',
    avatars: ['LM', 'LA', 'JB'],
  },
  {
    id: 'e3',
    title: 'Workshop: "Mastering Design Thinking"',
    time: '11:30 AM - 1:00 PM',
    col: 1,
    rowStart: '11:30 AM',
    rowEnd: '1:00 PM',
    color: 'orange',
    platform: 'Venue: XYZ Conference Room',
    avatars: ['MT', 'AP', 'CR'],
  },
  {
    id: 'e4',
    title: 'Project Review Meeting',
    time: '9:00 - 9:30 AM',
    col: 2,
    rowStart: '9:00 AM',
    rowEnd: '9:30 AM',
    color: 'blue',
    avatars: ['EH', 'BS', 'WY'],
  },
  {
    id: 'e5',
    title: 'Sales Team Training Session',
    time: '10:00 - 11:30 AM',
    col: 2,
    rowStart: '10:00 AM',
    rowEnd: '11:30 AM',
    color: 'blue',
    platform: 'on Zoom',
    avatars: ['MT', 'LM', 'LA', 'JB', 'AP', 'CR', 'EH'],
  },
  {
    id: 'e6',
    title: 'Quarterly Financial Review',
    time: '12:00 - 12:30 PM',
    col: 2,
    rowStart: '12:00 PM',
    rowEnd: '12:30 PM',
    color: 'blue',
    avatars: ['BS', 'WY'],
  },
  {
    id: 'e7',
    title: 'Sales Performance Review',
    time: '12:30 - 1:00 PM',
    col: 2,
    rowStart: '12:30 PM',
    rowEnd: '1:00 PM',
    color: 'blue',
    platform: 'on Slack',
    avatars: ['MT', 'LM', 'LA', 'JB'],
  },
  {
    id: 'e8',
    title: 'Marketing Strategy Discussion',
    time: '9:30 - 10:00 AM',
    col: 3,
    rowStart: '9:30 AM',
    rowEnd: '10:00 AM',
    color: 'blue',
    avatars: ['AP', 'CR', 'EH'],
  },
  {
    id: 'e9',
    title: 'Strategy Planning for Company',
    time: '11:00 - 11:30 AM',
    col: 3,
    rowStart: '11:00 AM',
    rowEnd: '11:30 AM',
    color: 'blue',
    avatars: ['BS', 'WY'],
  },
  {
    id: 'e10',
    title: 'New Feature Implementation',
    time: '11:30 AM - 1:00 PM',
    col: 3,
    rowStart: '11:30 AM',
    rowEnd: '1:00 PM',
    color: 'blue',
    platform: 'on Zoom',
    avatars: ['MT', 'LM', 'LA', 'JB', 'AP'],
  },
  {
    id: 'e11',
    title: 'Customer Feedback Analysis',
    time: '9:00 - 10:00 AM',
    col: 4,
    rowStart: '9:00 AM',
    rowEnd: '10:00 AM',
    color: 'blue',
    platform: 'on Meet',
    avatars: ['EH', 'BS', 'WY', 'MT'],
  },
  {
    id: 'e12',
    title: 'Webinar: "Digital Marketing Trends"',
    time: '11:30 AM - 1:00 PM',
    col: 4,
    rowStart: '11:30 AM',
    rowEnd: '1:00 PM',
    color: 'orange',
    platform: 'www.examplewebinar.com',
    avatars: ['MT', 'LM', 'LA'],
  },
];

const timeSlots = [
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
];

const days = [
  { key: '04 MON', label: '04 MON' },
  { key: '05 TUE', label: '05 TUE' },
  { key: '06 WED', label: '06 WED' },
  { key: '07 THU', label: '07 THU' },
  { key: '08 FRI', label: '08 FRI' },
];

export function AdminCalendarPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'teams' | 'public'>('all');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-5">
      {/* Refined Page Header matching the rest of the Admin panel */}
      <AdminPageHeader
        title="Calendar"
        description="Organize and schedule speaking sessions, classroom events, and general organization workshops."
        icon={Calendar}
        action={
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold rounded-lg border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/80" />
              <span>Schedule</span>
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-8 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-lg shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add event</span>
            </Button>
          </div>
        }
      />

      {/* Tabs navigation and Search toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-px">
        {/* Underline category selector tabs */}
        <nav className="flex gap-1" aria-label="Event category tabs">
          {(
            [
              { value: 'all', label: 'All events' },
              { value: 'teams', label: 'Teams' },
              { value: 'public', label: 'Public' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap border-b-2 -mb-px",
                  active
                    ? "border-primary text-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Toolbar: search and filter options */}
        <div className="flex items-center gap-2 pb-1.5 sm:pb-0">
          <label className="relative flex items-center w-52">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 h-8 border-border/60 rounded-lg text-xs bg-muted/20 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50 font-medium"
            />
          </label>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/60 bg-muted/20 hover:bg-muted/50 rounded-lg text-muted-foreground"
            aria-label="Filter events"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Date Switcher row */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1" aria-label="Calendar date selection">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-border/60 bg-card shadow-sm">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Jan</span>
            <span className="text-xs font-extrabold text-foreground leading-none mt-0.5">8</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground leading-none">January 2027</h2>
            <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Jan 1, 2027 – Jan 31, 2027</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/60 bg-card p-0.5 shadow-sm">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" aria-label="Previous Month">
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" className="h-7 rounded-md text-xs font-semibold px-2.5">
              Today
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" aria-label="Next Month">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>

          <select
            className="rounded-lg border border-border/60 bg-card px-2 py-1 text-xs font-semibold h-8 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            defaultValue="month"
            aria-label="View format"
          >
            <option value="day">Day view</option>
            <option value="week">Week view</option>
            <option value="month">Month view</option>
          </select>
        </div>
      </section>

      {/* Week Grid Layout */}
      <section className="rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden" aria-label="Calendar scheduler grid">
        <div className="grid grid-cols-6 border-b border-border/60 bg-muted/20 text-center py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="border-r border-border/40" />
          {days.map((day) => (
            <div key={day.key} className="border-r border-border/40 last:border-r-0">
              {day.label}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-6 divide-x divide-border/50">
          {/* Time scale label columns */}
          <div className="flex flex-col text-[10px] font-semibold text-muted-foreground/75 py-4 text-center divide-y divide-border/20 bg-muted/10">
            {timeSlots.map((time) => (
              <div key={time} className="h-32 flex items-start justify-center pt-2">
                {time}
              </div>
            ))}
          </div>

          {/* Day Grid column contents */}
          {Array.from({ length: 5 }).map((_, dayIdx) => {
            const colIdx = dayIdx + 1;
            const eventsInCol = mockEvents.filter((e) => e.col === colIdx);

            return (
              <div key={dayIdx} className="relative h-[640px] bg-card p-1.5 space-y-2">
                {/* Horizontal time grids markings */}
                {Array.from({ length: 5 }).map((_, slotIdx) => (
                  <div key={slotIdx} className="absolute left-0 right-0 border-t border-border/10 pointer-events-none" style={{ top: `${slotIdx * 128}px` }} />
                ))}

                {/* Event Cards renders */}
                {eventsInCol.map((event) => {
                  const isGray = event.color === 'gray';
                  const isOrange = event.color === 'orange';

                  // Calculate simple relative positions
                  let cardTop = '0px';
                  let cardHeight = 'auto';

                  if (event.rowStart === '9:00 AM') {
                    cardTop = '10px';
                    cardHeight = event.rowEnd === '10:00 AM' ? '110px' : '52px';
                  } else if (event.rowStart === '9:30 AM') {
                    cardTop = '68px';
                    cardHeight = '52px';
                  } else if (event.rowStart === '10:00 AM') {
                    cardTop = '138px';
                    cardHeight = '110px';
                  } else if (event.rowStart === '11:00 AM') {
                    cardTop = '266px';
                    cardHeight = '52px';
                  } else if (event.rowStart === '11:30 AM') {
                    cardTop = '324px';
                    cardHeight = '180px';
                  } else if (event.rowStart === '12:00 PM') {
                    cardTop = '394px';
                    cardHeight = '52px';
                  } else if (event.rowStart === '12:30 PM') {
                    cardTop = '454px';
                    cardHeight = '52px';
                  }

                  return (
                    <article
                      key={event.id}
                      className={cn(
                        "absolute left-2 right-2 rounded-xl border p-2.5 flex flex-col justify-between transition-all select-none hover:shadow-sm",
                        isOrange
                          ? "bg-amber-500/[0.03] border-amber-500/20 text-amber-900 dark:text-amber-300"
                          : isGray
                          ? "bg-muted/40 border-border text-foreground"
                          : "bg-primary/[0.03] border-primary/20 text-primary-foreground dark:text-primary"
                      )}
                      style={{ top: cardTop, height: cardHeight }}
                    >
                      <div className="space-y-1 min-w-0">
                        <h3 className={cn(
                          "font-bold text-[11px] leading-snug truncate",
                          isOrange ? "text-amber-800 dark:text-amber-400" : isGray ? "text-foreground" : "text-primary dark:text-primary-foreground"
                        )}>
                          {event.title}
                        </h3>
                        <p className="text-[9px] font-medium text-muted-foreground/80">{event.time}</p>
                      </div>

                      {cardHeight !== '52px' && (
                        <footer className="space-y-2 mt-2 pt-2 border-t border-border/10">
                          {event.platform && (
                            <p className="text-[9px] font-semibold opacity-70 truncate">{event.platform}</p>
                          )}
                          <div className="flex items-center justify-between">
                            {/* Stacked Avatar list */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {event.avatars.slice(0, 3).map((av, idx) => (
                                <Avatar key={idx} className="h-4.5 w-4.5 border border-background shrink-0">
                                  <AvatarFallback className="text-[8px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold">
                                    {av}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {event.avatars.length > 3 && (
                                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] font-bold text-slate-600 border border-background shrink-0">
                                  +{event.avatars.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </footer>
                      )}
                    </article>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
