import React from 'react';
import { Eye, Award, Star, BookOpen, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { AdminCourse } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';

interface CourseCardProps {
  course: AdminCourse;
  onPreview: (course: AdminCourse) => void;
  onEdit: (course: AdminCourse) => void;
  onDelete: (course: AdminCourse) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPreview,
  onEdit,
  onDelete
}) => {
  const discountPercentage = course.original_price > 0 && course.price < course.original_price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Thumbnail Area */}
      <figure className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
            <BookOpen className="h-12 w-12 stroke-[1.5]" />
          </div>
        )}
        
        {/* Category Badge */}
        {course.category_name && (
          <Badge
            className="absolute left-3 top-3 border-none text-white font-medium shadow-sm"
            style={{ backgroundColor: course.category_color || '#3B82F6' }}
          >
            {course.category_name}
          </Badge>
        )}

        {/* Actions Dropdown */}
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full border border-slate-200/50 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white dark:border-slate-800 dark:bg-slate-950/90"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
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

        {/* Level badge */}
        {course.level && (
          <span className="absolute bottom-3 right-3 rounded bg-slate-900/70 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {course.level}
          </span>
        )}
      </figure>

      {/* Course Info */}
      <div className="flex flex-1 flex-col p-5">
        <header className="mb-2">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-950 dark:text-white min-h-[2.75rem] group-hover:text-primary">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="line-clamp-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
              {course.subtitle}
            </p>
          )}
        </header>

        {/* Rating and Reviews */}
        <section className="mb-4 flex items-center gap-1.5 text-sm">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-bold">{course.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-500 dark:text-slate-400">
            {course.enrollment_count || 0} students
          </span>
        </section>

        {/* Price Area */}
        <section className="mt-auto flex items-baseline gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xl font-extrabold text-slate-950 dark:text-white">
            ${course.price}
          </span>
          {discountPercentage > 0 && (
            <>
              <span className="text-sm text-slate-400 line-through">
                ${course.original_price}
              </span>
              <span className="text-xs font-semibold text-red-500">
                {discountPercentage}% off
              </span>
            </>
          )}
        </section>

        {/* Preview Button */}
        <Button
          onClick={() => onPreview(course)}
          variant="outline"
          className="mt-4 w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 dark:border-primary/30"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Button>
      </div>
    </article>
  );
};
