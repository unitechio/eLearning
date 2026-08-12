import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, FolderPlus, Info, CloudUpload } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { CourseToolbar, CourseViewMode } from './CourseToolbar';
import { CourseGrid } from './CourseGrid';
import { CourseManagerPagination } from './CourseManagerPagination';
import { PreviewModal } from './PreviewModal';
import { CategoryManagerModal } from './CategoryManagerModal';
import {
  useAdminCourses,
  useCourseCategories,
  useDeleteCourse
} from '../api/courseManagerHooks';
import { AdminCourse } from '../types';

export const CourseManagerPage: React.FC = () => {
  const navigate = useNavigate();

  // Query state parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch course list and categories list
  const { data: categories = [] } = useCourseCategories();
  const { data: coursesResult, isLoading } = useAdminCourses({
    page: currentPage,
    page_size: pageSize,
    q: searchQuery,
    category_id: selectedCategory,
    level: selectedLevel,
    status: selectedStatus
  });

  const deleteMutation = useDeleteCourse();

  // Modals visibility state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [courseToPreview, setCourseToPreview] = useState<AdminCourse | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Handlers
  const handleEditCourse = (course: AdminCourse) => {
    navigate(`/admin/courses/${course.id}/edit`);
  };

  const handlePreviewCourse = (course: AdminCourse) => {
    setCourseToPreview(course);
    setIsPreviewOpen(true);
  };

  const handleDeleteCourse = (course: AdminCourse) => {
    if (confirm(`Are you sure you want to delete course "${course.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(course.id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const courses = coursesResult?.items || [];
  const totalItems = coursesResult?.meta?.total_items || courses.length;
  const totalPages = coursesResult?.meta?.total_pages || Math.ceil(totalItems / pageSize) || 1;

  return (
    <section className="p-6 space-y-6 flex flex-col w-full antialiased font-inter">
      {/* Custom Header with Breadcrumbs matching requested UX */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        {/* Title Area */}
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Courses & Programs</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Courses</span>
          </nav>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Course manager
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Create, publish, and manage all student course curriculums.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and manage your school courses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
          >
            <CloudUpload className="h-4 w-4" />
            <span>Import Course</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCategoryOpen(true)}
            className="gap-1.5 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Manage Categories</span>
          </Button>
          <Button
            onClick={() => navigate('/admin/courses/create')}
            size="sm"
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </Button>
        </div>
      </div>



      {/* Preview details modal */}
      {isPreviewOpen && courseToPreview && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          course={courseToPreview}
        />
      )}

      {/* Category settings modal */}
      {isCategoryOpen && (
        <CategoryManagerModal
          isOpen={isCategoryOpen}
          onClose={() => setIsCategoryOpen(false)}
        />
      )}
    </section>
  );
};
export default CourseManagerPage;
