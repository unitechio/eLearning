import React from 'react';
import { Calendar as CalendarIcon, Plus, Bell, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface CalendarHeaderProps {
  readonly workspaceName?: string;
  readonly timezone?: string;
  readonly lastSynced?: string;
  readonly onQuickAddClick?: () => void;
  readonly onSyncClick?: () => void;
}

/**
 * Enterprise Header component displaying active workspace details,
 * timezone, sync state, and primary action triggers.
 */
export function CalendarHeader({
  lastSynced = 'Just now',
  onQuickAddClick,
  onSyncClick,
}: CalendarHeaderProps) {
  return (
    <header
      className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between pb-6 border-b border-border"
      aria-label="Calendar page header"
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground/60" aria-hidden="true">
            <CalendarIcon className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground select-none">Calendar</h1>
        </div>

        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Organize and schedule speaking sessions, classroom events, and general organization workshops.
        </p>
      </div>

      {/* Global Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0 self-start">
        {/* Sync Indicator */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mr-2 select-none">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm">{lastSynced}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-muted text-muted-foreground rounded"
            onClick={onSyncClick}
            aria-label="Refresh calendar sync"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>

        {/* Notifications */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border hover:bg-muted/50 rounded-lg text-muted-foreground relative"
          aria-label="View calendar notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full" />
        </Button>

        {/* Quick Add Action */}
        <Button
          type="button"
          size="sm"
          onClick={onQuickAddClick}
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 py-4 text-xs gap-1.5 rounded-md shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add event</span>
        </Button>
      </div>
    </header>
  );
}
