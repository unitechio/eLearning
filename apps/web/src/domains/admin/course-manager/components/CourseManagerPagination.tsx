import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';

interface CourseManagerPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const CourseManagerPagination: React.FC<CourseManagerPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Numbers */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {getPageNumbers().map((num, i) => {
          if (num === '...') {
            return (
              <span
                key={`dots-${i}`}
                className="flex h-8 w-8 items-center justify-center text-slate-400 dark:text-slate-600 text-sm font-semibold"
              >
                ...
              </span>
            );
          }
          return (
            <Button
              key={`page-${num}`}
              variant={currentPage === num ? 'default' : 'outline'}
              className={`h-8 w-8 p-0 text-sm font-semibold ${
                currentPage === num
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : ''
              }`}
              onClick={() => onPageChange(num as number)}
            >
              {num}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </nav>

      {/* Page size & info */}
      <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 sm:justify-end">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-slate-200 bg-white font-semibold dark:border-slate-800 dark:bg-slate-900"
              >
                <span>{pageSize.toString().padStart(2, '0')}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[8, 12, 24, 48].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => onPageSizeChange(size)}
                  className="cursor-pointer"
                >
                  {size.toString().padStart(2, '0')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span>Per Page</span>
        </div>

        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {totalItems > 0 ? `${startItem} - ${endItem} of ${totalItems}` : '0 - 0 of 0'}
        </span>
      </div>
    </div>
  );
};
