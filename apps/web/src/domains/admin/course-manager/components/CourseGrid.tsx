import React from 'react';
import { Plus, Sparkles, BookOpen, Eye, Edit, Trash2, MoreVertical, Inbox } from 'lucide-react';
import { AdminCourse } from '../types';
import { CourseCard } from './CourseCard';
import { Button } from '@/shared/components/ui/button';
import { EmptyState } from '@/shared/components/ui/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';

interface CourseGridProps {
  courses: AdminCourse[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  isFiltered: boolean;
  onClearFilters: () => void;
  onPreview: (course: AdminCourse) => void;
  onEdit: (course: AdminCourse) => void;
  onDelete: (course: AdminCourse) => void;
  onCreateCourse: () => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  viewMode,
  isFiltered,
  onClearFilters,
  onPreview,
  onEdit,
  onDelete,
  onCreateCourse
}) => {
  if (isLoading) {
    if (viewMode === 'list') {
      return (
        <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-8 w-12 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </TableCell>
                  <TableCell><div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                  <TableCell><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                  <TableCell><div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                  <TableCell><div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                  <TableCell><div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 p-5 space-y-4">
              <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-full rounded bg-slate-200 dark:bg-slate-800 pt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle empty states cleanly
  if (courses.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          title="No courses found"
          description="Try adjusting your search or filters."
          icon={Inbox}
          action={
            <Button onClick={onClearFilters} variant="outline" size="sm">
              Clear filters
            </Button>
          }
        />
      );
    }

    return (
      <EmptyState
        title="No courses available"
        description="Create your first course to get started."
        icon={BookOpen}
        action={
          <Button onClick={onCreateCourse} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Create Course</span>
          </Button>
        }
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/20">
              <TableHead className="w-[90px] font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Thumbnail</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Course</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Level</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <TableCell>
                  <figure className="relative h-10 w-16 overflow-hidden rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <BookOpen className="h-5 w-5 stroke-[1.5]" />
                      </div>
                    )}
                  </figure>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</div>
                    {course.subtitle && <div className="text-xs text-slate-500 line-clamp-1">{course.subtitle}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  {course.category_name ? (
                    <Badge
                      className="border-none text-white font-medium text-[10px] rounded-md px-2 py-0.5"
                      style={{ backgroundColor: course.category_color || '#3B82F6' }}
                    >
                      {course.category_name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {course.level || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                    {course.status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${course.price}</span>
                    {course.original_price > course.price && (
                      <span className="text-xs text-slate-400 line-through">${course.original_price}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border-none">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => onPreview(course)} className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4 text-slate-500" />
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(course)} className="gap-2 cursor-pointer">
                          <Edit className="h-4 w-4 text-slate-500" />
                          <span>Edit Course</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(course)} className="gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* "Expand your catalog" AI Card */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/20 min-h-[350px]">
        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
          Expand your catalog
        </h3>
        <p className="mb-6 max-w-[200px] text-xs leading-normal text-slate-500 dark:text-slate-400">
          Build your own courses with our AI assistant - or license ready - made ones from top providers.
        </p>
        <Button onClick={onCreateCourse} variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Create course</span>
        </Button>
      </div>
    </div>
  );
};
