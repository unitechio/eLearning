import React from 'react';
import { Search, Grid2X2, List } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CourseCategory } from '../types';
import { cn } from '@/shared/lib/utils';

export type CourseViewMode = 'grid' | 'list';

interface CourseToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;

  categories: CourseCategory[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;

  selectedLevel: string;
  onLevelChange: (value: string) => void;

  selectedStatus: string;
  onStatusChange: (value: string) => void;

  viewMode: CourseViewMode;
  onViewModeChange: (mode: CourseViewMode) => void;
}

export const CourseToolbar: React.FC<CourseToolbarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full sm:w-auto">
        {/* Search Field */}
        <div className="relative w-full sm:max-w-[280px] md:max-w-[320px]">
          <label htmlFor="search-courses-toolbar" className="sr-only">Search courses</label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-650" />
          <Input
            id="search-courses-toolbar"
            type="search"
            placeholder="Search courses"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm rounded-lg"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Select */}
          <Select value={selectedStatus || 'all'} onValueChange={(val) => onStatusChange(val === 'all' ? '' : val)}>
            <SelectTrigger className="h-10 w-[130px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Select */}
          <Select value={selectedCategory || 'all'} onValueChange={(val) => onCategoryChange(val === 'all' ? '' : val)}>
            <SelectTrigger className="h-10 w-[150px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Level Select */}
          <Select value={selectedLevel || 'all'} onValueChange={(val) => onLevelChange(val === 'all' ? '' : val)}>
            <SelectTrigger className="h-10 w-[130px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Side: View Mode Toggler */}
      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
        <div className="inline-flex items-center h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
              viewMode === 'grid'
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 font-bold"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
            )}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
              viewMode === 'list'
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 font-bold"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default CourseToolbar;
