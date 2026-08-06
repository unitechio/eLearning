import React from 'react';
import { SlidersHorizontal, Download, Upload, Keyboard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SearchInput } from '@/shared/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib';

interface CalendarToolbarProps {
  readonly activeTab: 'all' | 'teams' | 'public';
  readonly onTabChange: (tab: 'all' | 'teams' | 'public') => void;
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly view: string;
  readonly onViewChange: (view: string) => void;
  readonly onExportClick?: () => void;
  readonly onImportClick?: () => void;
}

/**
 * Enterprise toolbar component containing category filters, advanced search,
 * calendar view selectors, export/import options, and keyboard hints.
 */
export function CalendarToolbar({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  view,
  onViewChange,
  onExportClick,
  onImportClick,
}: CalendarToolbarProps) {
  const tabs = [
    { value: 'all', label: 'All events' },
    { value: 'teams', label: 'Teams' },
    { value: 'public', label: 'Public' },
  ] as const;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-px">
      {/* Category Selection Tabs */}
      <nav aria-label="Event category filters" className="flex">
        <ul className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <li key={tab.value}>
                <button
                  type="button"
                  onClick={() => onTabChange(tab.value)}
                  className={cn(
                    "relative px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap border-b-2",
                    isActive
                      ? "border-primary text-foreground font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toolbar controls */}
      <div className="flex flex-wrap items-center gap-2 pb-2 sm:pb-0">
        {/* Keyboard shortcut indicator */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/30 border border-border px-1.5 py-0.5 rounded select-none">
          <Keyboard className="h-3 w-3" />
          <span>Press <kbd className="font-mono bg-muted px-1 rounded">Ctrl+K</kbd> for commands</span>
        </div>

        {/* Global SearchInput */}
        <div className="w-48">
          <SearchInput
            placeholder="Search classes, rooms..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search calendar events"
          />
        </div>

        {/* View Switcher Dropdown */}
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger className="h-9 w-32 text-xs font-semibold rounded-lg border border-border bg-card shadow-xs focus:ring-1 focus:ring-primary focus:ring-offset-0">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border border-border">
            <SelectItem value="day" className="text-xs">Day view</SelectItem>
            <SelectItem value="3days" className="text-xs">3 Days view</SelectItem>
            <SelectItem value="week" className="text-xs">Week view</SelectItem>
            <SelectItem value="month" className="text-xs">Month view</SelectItem>
            <SelectItem value="agenda" className="text-xs">Agenda view</SelectItem>
            <SelectItem value="timeline" className="text-xs">Timeline view</SelectItem>
          </SelectContent>
        </Select>

        {/* Secondary Actions */}
        <div className="flex items-center gap-1 border-l border-border pl-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border bg-card text-muted-foreground hover:bg-muted/30"
            onClick={onExportClick}
            aria-label="Export calendar"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border bg-card text-muted-foreground hover:bg-muted/30"
            onClick={onImportClick}
            aria-label="Import calendar"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
